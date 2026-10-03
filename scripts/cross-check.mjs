#!/usr/bin/env node
/**
 * EVERY FORMULA IS CROSSED WITH THE PUBLIC RECORD BEFORE IT IS COMMITTED. For each family whose module is staged (or
 * named), two live checks through the unit's own formulas: data.research(f) — the registry's APIs the family's formula
 * names find, their parameter-free reads made now — and discovery with the live readings as inputs, which says what
 * values the family reaches that other families and the readings reach too. Writes cross-check-receipt.json and
 * prints each family's line. A staged family with neither an answered research read nor a live cross-family
 * relation stops the commit: it is untested by anything outside itself.
 *
 *   node scripts/cross-check.mjs --staged            the families whose modules are staged
 *   node scripts/cross-check.mjs cal kin yi          named families
 */
import fs from 'node:fs'
import { execSync } from 'node:child_process'
import '../dist/mcp/families.js'
import { qpuContentUuidOf, qpuHexFamiliesOf, qpuUuidReceiptOf } from '../dist/quantum/processing/unit/index.js'
import { DataFormulas, qpuDataOf } from '../dist/mcp/qpu-fused.js'
import { DOORS, qpuDiscoverOf } from '../dist/mcp/discovery.js'

const sorted = () => [...qpuHexFamiliesOf().keys()].filter((f) => !DOORS.has(f)).sort()
const numbersOf = (x) => (typeof x === 'number' ? (Number.isSafeInteger(x) && x >= 3 ? [x] : []) : typeof x === 'string' ? (/^\d+$/.test(x) && Number.isSafeInteger(Number(x)) && Number(x) >= 3 ? [Number(x)] : []) : x && typeof x === 'object' ? Object.values(x).flatMap(numbersOf) : [])

// which families a staged module registers: read off the module, as the registry is
const familiesOfModule = (file) => [...new Set([...fs.readFileSync(file, 'utf8').matchAll(/qpuHexRegisterOf\('([^']+)'/g)].map((m) => m[1]))]
const staged = process.argv.includes('--staged')
const named = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const families = staged
  ? [...new Set(execSync('git diff --cached --name-only', { encoding: 'utf8' }).split('\n').filter((f) => /^src\/(families\/[^/]+\/index|mcp\/[^/]+)\.ts$/.test(f) && fs.existsSync(f)).flatMap(familiesOfModule))].filter((f) => qpuHexFamiliesOf().has(f))
  : named.length ? named : sorted()
if (!families.length) {
  console.log('cross-check: no formula module staged')
  process.exit(0)
}

// the live readings the theorems are checked against, as discovery's inputs, plus every research reading's numbers
const t0 = Date.now()
const live = new Set()
for (const source of ['cern', 'nist', 'oeis', 'zenodo', 'apis']) {
  const r = await qpuDataOf(source, {})
  for (const x of numbersOf(r.reading ?? {})) live.add(x)
}
const rows = []
for (const family of families) {
  const f = sorted().indexOf(family)
  const research = await DataFormulas.research(f)
  const readings = research.reading?.readings ?? []
  for (const r of readings) for (const x of numbersOf(r.excerpt ?? {})) live.add(x)
  rows.push({ family, f, research })
}
const d = await qpuDiscoverOf([...live])
for (const row of rows) {
  const relations = d.relations.filter((r) => r.families.includes(row.family))
  const liveRelations = relations.filter((r) => r.live)
  const answered = (row.research.reading?.readings ?? []).filter((r) => r.status > 0)
  row.relations = relations.length
  row.liveRelations = liveRelations.length
  row.crossed = [...new Set(relations.flatMap((r) => r.families))].filter((x) => x !== row.family)
  row.matched = row.research.reading?.matched ?? 0
  row.answered = answered.map((r) => `${r.api} ${r.status}`)
  row.pass = answered.length > 0 || liveRelations.length > 0
}
const doc = {
  kind: 'cross-check-receipt',
  when: new Date().toISOString().slice(0, 10),
  families: rows.map((r) => r.family),
  liveNumbers: live.size,
  seconds: Math.round((Date.now() - t0) / 1000),
  holds: rows.every((r) => r.pass),
  rows: rows.map((r) => ({ name: `family ${r.family}`, pass: r.pass, value: `${r.matched} APIs named, ${r.answered.length} answered (${r.answered.slice(0, 4).join(', ')}); ${r.relations} cross-family values, ${r.liveRelations} with live readings, crossing ${r.crossed.slice(0, 8).join(' ')}`, receipt: r.research.receipt ?? '' })),
}
doc.uuid = qpuContentUuidOf(doc.rows)
doc.receipt = qpuUuidReceiptOf('cross-check', doc.uuid, `${rows.filter((r) => r.pass).length}/${rows.length}`, 'scripts/cross-check.mjs').uuid
fs.writeFileSync('cross-check-receipt.json', JSON.stringify(doc, null, 1) + '\n')
for (const r of doc.rows) console.log(`  ${r.pass ? '✓' : '✗'} ${r.name}: ${r.value}`)
console.log(`cross-check: ${rows.filter((r) => r.pass).length}/${rows.length} families crossed with the public record in ${doc.seconds}s (${live.size} live numbers)`)
if (!doc.holds) {
  console.error('cross-check: a staged family has neither an answered research read nor a live cross-family relation — it is untested by anything outside itself. Commit BLOCKED.')
  process.exit(1)
}
