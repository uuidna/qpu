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
  qpuReceiptLedgerOf,
  qpuHexRegisterOf,
  qpuHexUuidOf,
} from '../dist/quantum/processing/unit/index.js'
import { crossFormulaOf } from '../dist/mcp/cross-domain-formulas.js'

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

/* EVERY COMPOSING PAIR IS A CROSS FORMULA. Its evidence is the rarest field each direction is joined on (fewest
 * giver × taker pairs — the most specific); its value is that specificity, 1 / pairs per direction, multiplied when
 * both directions hold (entangled). Each is a CrossFormula: a content UUID and a quantum receipt (stream `cross`). */
fs.mkdirSync('.fuse', { recursive: true })
const out = fs.createWriteStream('.fuse/fuse-formulas.ndjson')
// every fused pair is a hex callable: fuse.edge(i, j) returns its formula; params are the two API indexes (24 bits each)
const edgeAt = new Map(fused.edges.map((e) => [e.i * fused.apis.length + e.j, e]))
qpuHexRegisterOf('fuse', 'edge', function edge(i, j) {
  const e = edgeAt.get(Number(i) * fused.apis.length + Number(j))
  return e ? { kind: 'fuse-edge', left: fused.apis[e.i], right: fused.apis[e.j], forward: e.rare.forward ?? null, backward: e.rare.backward ?? null, holds: Boolean(e.rare.forward || e.rare.backward) } : { kind: 'fuse-edge', holds: false }
})
const buckets = { '1': 0, '2-4': 0, '5-16': 0, '17-64': 0, '65-256': 0, '>256': 0 }
const bucketOf = (p) => (p <= 1 ? '1' : p <= 4 ? '2-4' : p <= 16 ? '5-16' : p <= 64 ? '17-64' : p <= 256 ? '65-256' : '>256')
const specific = []
let formulas = 0
let holding = 0
for (const e of fused.edges) {
  const a = fused.apis[e.i]
  const b = fused.apis[e.j]
  const f = e.rare.forward
  const g = e.rare.backward
  const both = !!f && !!g
  const value = (f ? 1 / f.pairs : 1) * (g ? 1 / g.pairs : 1)
  const formula = [f && `${b}.takes(${f.name}) ← ${a}.gives(${f.name})`, g && `${a}.takes(${g.name}) ← ${b}.gives(${g.name})`].filter(Boolean).join(' ∧ ')
  const x = crossFormulaOf(
    {
      id: `fuse ${a} ${both ? '⇄' : f ? '→' : '←'} ${b}`,
      src: f ? a : b,
      dst: f ? b : a,
      formula,
      value,
      proof: [f && `field ${f.uuid}: ${f.pairs} giver × taker pairs in the registry`, g && `field ${g.uuid}: ${g.pairs} giver × taker pairs in the registry`].filter(Boolean).join('; '),
    },
    !!(f || g),
  )
  formulas++
  if (x.holds) holding++
  buckets[bucketOf(Math.max(f?.pairs ?? 0, g?.pairs ?? 0))]++
  const hex = qpuHexUuidOf({ family: 'fuse', program: ['edge'], params: [e.i, e.j] })
  out.write(JSON.stringify({ ...x, hex, hexExact: true, entangled: both, forward: f, backward: g }) + '\n')
  if (both && f.pairs * g.pairs <= 4) specific.push({ id: x.id, uuid: x.uuid, receipt: x.receipt, forward: f.name, backward: g.name, pairs: f.pairs * g.pairs })
}
await new Promise((r) => out.end(r))
specific.sort((p, q) => p.pairs - q.pairs || p.id.localeCompare(q.id))
const crossStream = qpuReceiptStreamsOf(0).streams.find((s) => s.stream === 'cross')
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
  formulas: {
    produced: formulas,
    holds: holding,
    specificity: buckets,
    entangledMostSpecific: specific.length,
    top: specific.slice(0, 14),
    stream: crossStream && { length: crossStream.length, head: crossStream.head, chain: crossStream.chain, holds: crossStream.holds },
  },
  stream: stream && { length: stream.length, head: stream.head, chain: stream.chain, holds: stream.holds },
  seconds: Math.round((Date.now() - t0) / 1000),
}
fs.writeFileSync('fuse-receipt.json', JSON.stringify(receipt, null, 1) + '\n')
fs.writeFileSync(
  '.fuse/fused-apis.json',
  JSON.stringify({ apis: names, rows, edges: fused.edges.map((e) => [global.get(fused.apis[e.i]), global.get(fused.apis[e.j]), e.forward, e.backward]), hubs: fused.hubs }),
)
// every quantum receipt of the run, for the quantum-receipts collection
const ledger = fs.createWriteStream('.fuse/receipts.ndjson')
for (const r of qpuReceiptLedgerOf()) if (r.uuid) ledger.write(JSON.stringify({ uuid: r.uuid, name: r.name, stream: r.stream, seq: r.seq, prev: r.prev, subject: r.subject, referrer: r.referrer, fold: r.fold }) + '\n')
await new Promise((r) => ledger.end(r))
console.log(JSON.stringify({ ...receipt, categories: receipt.categories.slice(0, 5), hubs: receipt.hubs.slice(0, 5) }, null, 1))
