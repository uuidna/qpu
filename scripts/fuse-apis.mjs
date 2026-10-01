#!/usr/bin/env node
/**
 * FUSE EVERY API THE REGISTRY LISTS. The Worker reads `faces` specs per request (fifty subrequests); this walks all
 * of apis.guru outside it, through the unit's own qpuSchemaMethodsOf (fields addressed by shape UUID), qpuFuseOf
 * (an edge is a giver and a taker of one field UUID) and qpuGraphStateOf (one qubit per API, CZ per edge; the
 * entanglement across a cut is the GF(2) rank of the adjacency between its sides, exact at any qubit count).
 *
 * Every listed API is accounted for: reached with its methods, or unreached with why. Each reached API gets a
 * quantum receipt referred by its spec URL, in the `fuse` stream.
 *
 *   node scripts/fuse-apis.mjs [--limit N]     writes fuse-receipt.json and .fuse/fused-apis.json
 */
import fs from 'node:fs'
import {
  qpuSchemaMethodsOf,
  qpuFuseOf,
  qpuGraphStateOf,
  qpuContentUuidOf,
  qpuUuidReceiptOf,
  qpuReceiptStreamsOf,
} from '../dist/quantum/processing/unit/index.js'

const REGISTRY = 'https://api.apis.guru/v2/list.json'
const CONCURRENCY = 8
const TIMEOUT = 30000
const limitAt = process.argv.indexOf('--limit')
const limit = limitAt > 0 ? Number(process.argv[limitAt + 1]) : Infinity

const fetchJson = async (url) => {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(TIMEOUT) })
      if (!r.ok) return { why: `http ${r.status}` }
      return { doc: await r.json() }
    } catch (e) {
      if (attempt === 1) return { why: e.name === 'TimeoutError' ? 'timeout' : e instanceof SyntaxError ? 'not json' : 'unreachable' }
    }
  }
}

const t0 = Date.now()
const listed = await fetchJson(REGISTRY)
if (!listed.doc) {
  console.error(`registry did not answer: ${listed.why}`)
  process.exit(1)
}
const catalogue = listed.doc
const names = Object.keys(catalogue).sort().slice(0, limit)

const rows = new Array(names.length)
const methods = []
let next = 0
let done = 0
const worker = async () => {
  for (;;) {
    const k = next++
    if (k >= names.length) return
    const api = names[k]
    const entry = catalogue[api]
    const version = entry?.versions?.[entry.preferred ?? '']
    const spec = version?.swaggerUrl ?? ''
    const categories = version?.info?.['x-apisguru-categories'] ?? []
    if (!spec) {
      rows[k] = { api, spec, categories, reached: false, why: 'no spec url', methods: 0 }
    } else {
      const got = await fetchJson(spec)
      if (!got.doc) rows[k] = { api, spec, categories, reached: false, why: got.why, methods: 0 }
      else {
        const found = qpuSchemaMethodsOf(api, got.doc)
        methods.push(...found)
        const receipt = qpuUuidReceiptOf(`fuse ${api}`, qpuContentUuidOf({ api, methods: found.map((m) => `${m.verb} ${m.path}`) }), { methods: found.length }, spec)
        rows[k] = { api, spec, categories, reached: true, methods: found.length, receipt: receipt.uuid }
      }
    }
    if (++done % 100 === 0) console.error(`${done}/${names.length} ${Math.round((Date.now() - t0) / 1000)}s`)
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker))

const fused = qpuFuseOf(methods, false)
// every walked API is a qubit — one with no composing field is an isolated qubit, not an absent one
const global = new Map(names.map((a, k) => [a, k]))
const edges = fused.edges.map((e) => ({ i: global.get(fused.apis[e.i]), j: global.get(fused.apis[e.j]) }))
const categoryOf = new Map(rows.map((r) => [r.api, r.categories]))
const categories = [...new Set(rows.flatMap((r) => r.categories))].sort()
const half = qpuGraphStateOf(names.length, edges)
const byCategory = categories
  .map((c) => {
    const g = qpuGraphStateOf(names.length, edges, (v) => (categoryOf.get(names[v]) ?? []).includes(c))
    return { category: c, apis: g.cut.left, ebits: g.ebits, bound: g.bound }
  })
  .filter((c) => c.apis > 0)
  .sort((a, b) => b.ebits - a.ebits)

const stream = qpuReceiptStreamsOf(0).streams.find((s) => s.stream === 'fuse')
const why = rows.filter((r) => !r.reached).reduce((m, r) => ({ ...m, [r.why]: (m[r.why] ?? 0) + 1 }), {})
const receipt = {
  kind: 'fuse-receipt',
  when: new Date().toISOString().slice(0, 10),
  registry: REGISTRY,
  listed: Object.keys(catalogue).length,
  walked: names.length,
  reached: rows.filter((r) => r.reached).length,
  unreached: why,
  methods: fused.methods,
  fields: fused.fields,
  composing: fused.apis.length,
  edges: fused.edges.length,
  entangled: fused.entangled,
  oneWay: fused.oneWay,
  graphState: { ...half, cutBy: 'name, first half | second half' },
  categories: byCategory,
  hubs: fused.hubs.slice(0, 14),
  stream: stream && { length: stream.length, head: stream.head, chain: stream.chain, holds: stream.holds },
  seconds: Math.round((Date.now() - t0) / 1000),
}
fs.writeFileSync('fuse-receipt.json', JSON.stringify(receipt, null, 1) + '\n')
fs.mkdirSync('.fuse', { recursive: true })
fs.writeFileSync(
  '.fuse/fused-apis.json',
  JSON.stringify({ apis: names, rows, edges: fused.edges.map((e) => [global.get(fused.apis[e.i]), global.get(fused.apis[e.j]), e.forward, e.backward]), hubs: fused.hubs.slice(0, 500) }),
)
console.log(JSON.stringify({ ...receipt, categories: receipt.categories.slice(0, 5), hubs: receipt.hubs.slice(0, 5) }, null, 1))
