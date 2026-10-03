#!/usr/bin/env node
/**
 * THE GATE IS A FORMULA, RUN THROUGH THE MCP. commit: every family a staged module registers, as gate.commit(i) — the
 * family crossed with the public record (the APIs its formulas name, read live; discovery with the readings) and
 * within the rules. push: gate.push(from) over every family, slice by slice. Each verdict is the formula's holds,
 * answered by the unit in-process through the same tools/call a client makes; the script only reads holds.
 *
 *   node scripts/gate.mjs commit      the staged families
 *   node scripts/gate.mjs push        every family, the proof and the rules
 */
import fs from 'node:fs'
import { execSync } from 'node:child_process'
import '../dist/mcp/families.js'
import { qpuFacesOf, qpuHexFamiliesOf, qpuMcpCallOf } from '../dist/quantum/processing/unit/index.js'
import { DOORS } from '../dist/mcp/discovery.js'

const mode = process.argv[2] ?? 'commit'
const sorted = [...qpuHexFamiliesOf().keys()].filter((f) => !DOORS.has(f)).sort()
const run = async (program, params, family = 'gate') => {
  const r = await qpuMcpCallOf('qpu_cite', { hex: { family, program: [program], params } })
  const sc = (r?.structuredContent ?? r) ?? {}
  // the formula's own reading rides with the last step: failing names, next, the family
  return { ...sc, ...(sc.steps?.at?.(-1)?.reading ?? {}) }
}
const line = (name, r) => {
  const text = `gate.${name}(${(r.params ?? []).join(', ')}) = ${r.value}${r.family ? ` ${r.family}` : ''}${r.failing?.length ? ` failing ${r.failing.join(', ')}` : ''}${r.uncrossed?.length ? ` uncrossed ${r.uncrossed.join(', ')}` : ''}${r.denied ? ` ${r.denied} ${r.reading ?? ''}` : ''}`
  lines.push({ name: text.split(' = ')[0], holds: r.holds === true, value: text.split(' = ').slice(1).join(' = '), receipt: r.receipt })
  return `  ${r.holds ? '✓' : '✗'} ${text}`
}

let holds = true
const lines = []
let leadsOf, deepApis = 0
if (mode === 'commit') {
  const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' }).split('\n').filter((f) => /^src\/(families\/[^/]+\/index|mcp\/[^/]+)\.ts$/.test(f) && fs.existsSync(f))
  const families = [...new Set(staged.flatMap((f) => [...fs.readFileSync(f, 'utf8').matchAll(/qpuHexRegisterOf\('([^']+)'/g)].map((m) => m[1])))].filter((f) => sorted.includes(f))
  if (!families.length) console.log('gate: no formula module staged')
  for (const family of families) {
    const r = await run('commit', [sorted.indexOf(family)])
    console.log(line('commit', { ...r, params: [sorted.indexOf(family)], family }))
    holds &&= r.holds === true
  }
} else {
  // what a push carries: the families whose modules changed since the remote, each crossed with the record; and
  // always the proof and the rules
  const changed = execSync('git diff --name-only origin/main...HEAD', { encoding: 'utf8' }).split('\n').filter((f) => /^src\/(families\/[^/]+\/index|mcp\/[^/]+)\.ts$/.test(f) && fs.existsSync(f))
  const families = [...new Set(changed.flatMap((f) => [...fs.readFileSync(f, 'utf8').matchAll(/qpuHexRegisterOf\('([^']+)'/g)].map((m) => m[1])))].filter((f) => sorted.includes(f))
  for (const family of families) {
    const r = await run('commit', [sorted.indexOf(family)])
    console.log(line('commit', { ...r, params: [sorted.indexOf(family)], family }))
    holds &&= r.holds === true
  }
  // every slice of families through push(from): the deep research, the rosetta, the proof, the rules, the leads
  const pushes = []
  for (let from = 0; from < sorted.length; from += qpuFacesOf().faces) {
    const r = await run('push', [from])
    pushes.push(r)
    console.log(line('push', { ...r, params: [from] }))
    holds &&= r.holds === true
  }
  // the leads, tagged under push(from): data.deep → merkaba.rosetta → gate.crossed, nothing by hand
  const leads = { leads: pushes.at(-1)?.leads ?? [] }
  deepApis = pushes.reduce((n, p) => n + (p.deep ?? []).reduce((m, d) => m + d.value, 0), 0)
  leadsOf = leads.leads
  if (pushes.at(-1)?.rosetta) console.log(`  ${pushes.at(-1).rosetta.holds ? '✓' : '~'} merkaba.rosetta(${sorted.length}) = ${pushes.at(-1).rosetta.value} (${pushes.at(-1).rosetta.edges} edges, one turn each way)`)
  console.log(`  ~ gate.crossed() = ${pushes.at(-1)?.uncrossed ?? '—'} uncrossed`)
  for (const l of leads.leads ?? []) console.log(`    ${l.tag.startsWith('crossed') ? '✓' : '~'} ${l.formula}: ${l.tag} (OEIS ${l.efforts.oeis}, seal ${l.efforts.seal}, involutes ${l.efforts.involutes}, research ${l.efforts.research}, APIs ${l.efforts.apis} read: ${(l.apis ?? []).join(' ') || '—'}, rosetta ${l.efforts.rosetta}, detection ${l.detection})`)
  if (!families.length) console.log('  (no formula module changed since origin/main)')
}
console.log(`gate ${mode}: ${holds ? 'holds' : 'does not hold'}`)
{
  // the verdicts as a receipt: what the gate crossed, through the MCP, so the README carries the proof as a node
  const { qpuContentUuidOf, qpuUuidReceiptOf } = await import('../dist/quantum/processing/unit/index.js')
  const doc = { kind: 'gate-receipt', when: new Date().toISOString().slice(0, 10), mode, holds, rows: lines.map((l) => ({ name: l.name, pass: l.holds, value: l.value, receipt: l.receipt ?? '' })) }
  if (mode === 'push') { doc.leads = leadsOf ?? []; doc.deep = { readings: deepApis } }
  doc.uuid = qpuContentUuidOf(doc.rows)
  doc.receipt = qpuUuidReceiptOf('gate', doc.uuid, holds ? 'holds' : 'does not hold', 'scripts/gate.mjs').uuid
  fs.writeFileSync('gate-receipt.json', JSON.stringify(doc, null, 1) + '\n')
}
process.exit(holds ? 0 : 1)
