#!/usr/bin/env node
/**
 * THE NEXT DEVELOPMENT, DISCOVERED BY THE MCP: every family researched in the public record (data.research(f): the APIs
 * its formulas name, read live), then one discovery over every reading of the window (data.discover(n)): the values two
 * or more families reach, each with the live reading that reaches it. A combination is tested when one test file
 * names every formula of its ways; the rest is what the tests do not yet drive. Every relation is a superposition of
 * ways, and each way is run from every other way's perspective — its address as referrer, both directions, the double
 * torus — and holds when every perspective answers the same value. Writes next-receipt.json.
 */
import fs from 'node:fs'
import '../dist/mcp/families.js'
import { qpuContentUuidOf, qpuHexFamiliesOf, qpuHexRunOf, qpuMcpCallOf, qpuUuidReceiptOf } from '../dist/quantum/processing/unit/index.js'
import { DOORS } from '../dist/mcp/discovery.js'

const t0 = Date.now()
const run = async (program, params) => {
  const r = await qpuMcpCallOf('qpu_cite', { hex: { family: 'data', program: [program], params } })
  const sc = r?.structuredContent ?? r
  return { ...sc, reading: sc.steps?.at?.(-1)?.reading ?? {} }
}
const sorted = [...qpuHexFamiliesOf().keys()].filter((f) => !DOORS.has(f)).sort()
const researched = []
for (const [i, family] of sorted.entries()) {
  const r = await run('research', [i])
  researched.push({ family, matched: r.value, read: r.reading?.reading?.read ?? 0, holds: r.holds === true })
}
const d = await run('discover', [256])
const tests = fs.globSync(['src/families/*/test.ts', 'src/quantum/processing/unit/*.test.ts', 'scripts/*.test.mjs']).map((f) => ({ file: f, text: fs.readFileSync(f, 'utf8') }))
const relations = d.reading?.relations ?? []
let perspectives = 0, invariant = 0
const rows = []
for (const rel of relations) {
  const names = [...new Set(rel.ways.flatMap((w) => w.program))]
  const by = tests.find((t) => names.every((n) => t.text.includes(n)))
  // every ordered pair of ways: the one run with the other's address as referrer, answering the relation's value
  const pairs = rel.ways.flatMap((w, i) => rel.ways.filter((_, j) => j !== i).map((o) => [w, o]))
  const seen = await Promise.all(pairs.map(async ([w, o]) => { const r = await qpuHexRunOf(w.hex, o.hex, undefined, { store: false }).catch(() => null); return r && String(r.value) === rel.value }))
  perspectives += seen.length
  invariant += seen.filter(Boolean).length
  const closed = seen.every(Boolean)
  rows.push({ name: `${rel.families.join(' × ')} = ${rel.value}`, pass: by !== undefined && closed, value: `${rel.ways.map((w) => `${w.family}.${w.program.join('∘')}(${w.params.join(', ')})`).join(' = ')}${rel.live ? ' · live' : ''} · ${seen.filter(Boolean).length}/${seen.length} perspectives${by ? ` · tested in ${by.file}` : ' · untested'}`, receipt: rel.ways[0]?.receipt ?? '' })
}
const doc = { kind: 'next-receipt', when: new Date().toISOString().slice(0, 10), families: sorted.length, researched: researched.filter((r) => r.holds).length, matched: researched.reduce((n, r) => n + (r.matched ?? 0), 0), read: researched.reduce((n, r) => n + r.read, 0), liveInputs: d.reading?.liveInputs ?? 0, relations: relations.length, live: relations.filter((r) => r.live).length, perspectives, invariant, tested: rows.filter((r) => r.pass).length, untested: rows.filter((r) => !r.pass).length, seconds: Math.round((Date.now() - t0) / 1000), holds: d.holds === true, rows }
doc.uuid = qpuContentUuidOf(doc.rows)
doc.receipt = qpuUuidReceiptOf('next', doc.uuid, `${doc.tested}/${doc.relations}`, 'scripts/next-receipt.mjs').uuid
fs.writeFileSync('next-receipt.json', JSON.stringify(doc, null, 1) + '\n')
console.log(JSON.stringify({ families: doc.families, researched: doc.researched, read: doc.read, liveInputs: doc.liveInputs, relations: doc.relations, live: doc.live, perspectives, invariant, tested: doc.tested, untested: doc.untested, seconds: doc.seconds }))
