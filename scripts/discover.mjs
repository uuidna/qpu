#!/usr/bin/env node
/**
 * FILL THE GAPS: discover all cross-formulated use across the whole lattice and receipt it. The live readings of the
 * public sources are the inputs (so a formula that reaches a live value is a live relation); qpuDiscoverOf crosses
 * every family's programs of one and two formulas over the small naturals and those readings, grouping by value —
 * a value reached by two or more families is a cross-formulated solution, each way a hex program. Seals are the
 * fixed points, involutions and inverse pairs. Writes discovery-receipt.json over every registered family.
 */
import fs from 'node:fs'
import '../dist/mcp/families.js'
import { qpuContentUuidOf, qpuUuidReceiptOf } from '../dist/quantum/processing/unit/index.js'
import { qpuDiscoverOf } from '../dist/mcp/discovery.js'
import { qpuDataOf, qpuSequencesOf } from '../dist/mcp/qpu-fused.js'

const t0 = Date.now()
const numbersOf = (x) => (typeof x === 'number' ? (Number.isSafeInteger(x) && x >= 3 ? [x] : []) : typeof x === 'string' ? (/^\d+$/.test(x) && Number.isSafeInteger(Number(x)) && Number(x) >= 3 ? [Number(x)] : []) : x && typeof x === 'object' ? Object.values(x).flatMap(numbersOf) : [])
// the live window: every public source read now, its numbers the discovery's inputs
const sources = ['cern', 'nist', 'oeis', 'zenodo', 'datacite', 'orcid', 'github', 'npm', 'apis']
const live = new Set()
let sourcesAgree = 0
for (const source of sources) { const r = await qpuDataOf(source, {}).catch(() => ({})); if (r.agrees === true) sourcesAgree++; for (const n of numbersOf(r.reading ?? {})) live.add(n) }
// the sequences identified in OEIS (how many of the family formulas are public integer sequences)
const seqs = await qpuSequencesOf()
let sequences = 0
for (const s of seqs) { const r = await qpuDataOf('sequence', { family: s.family, formula: s.formula, fixed: s.fixed }).catch(() => ({})); if (r.agrees === true) sequences++ }

const d = await qpuDiscoverOf([...live].sort((a, b) => a - b).slice(0, 256))
const rows = d.relations.map((r) => ({ name: `${r.live ? 'live ' : ''}${r.families.join(' × ')}`, pass: r.families.length > 1, value: `${r.value} = ${r.ways.map((w) => `${w.family}.${w.program.join('∘')}(${w.params.join(', ')})`).join(' = ')}`, receipt: r.ways[0]?.receipt ?? '' }))
  .concat(d.seals.map((s) => ({ name: `seal ${s.family}.${s.program.join('∘')}`, pass: true, value: `${s.kind} at ${s.points.slice(0, 8).join(', ')}`, receipt: '' })))
const doc = {
  kind: 'discovery-receipt',
  when: new Date().toISOString().slice(0, 10),
  sources: sources.length,
  sourcesAgree,
  liveNumbers: live.size,
  sequences,
  identities: d.relations.filter((r) => r.ways.length >= 2 && new Set(r.ways.map((w) => w.family)).size === 1).length,
  seals: d.seals.length,
  fixedPoints: d.seals.filter((s) => s.kind === 'fixed').length,
  involutions: d.seals.filter((s) => s.kind === 'involution').length,
  inversePairs: d.seals.filter((s) => s.kind === 'inverse').length,
  families: d.families.length,
  runs: d.runs,
  relationsTotal: d.relations.length,
  liveRelations: d.liveRelations,
  unrelated: d.unrelated.join(' '),
  holds: d.holds,
  rows,
}
doc.uuid = qpuContentUuidOf(doc.rows)
doc.receipt = qpuUuidReceiptOf('discovery', doc.uuid, `${doc.relationsTotal} relations over ${doc.families} families`, 'scripts/discover.mjs').uuid
fs.writeFileSync('discovery-receipt.json', JSON.stringify(doc, null, 1) + '\n')
console.log(JSON.stringify({ families: doc.families, runs: doc.runs, relations: doc.relationsTotal, live: doc.liveRelations, seals: doc.seals, sequences: doc.sequences, unrelated: doc.unrelated, seconds: Math.round((Date.now() - t0) / 1000) }))
