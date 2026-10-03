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
import { qpuHexFamiliesOf, qpuMcpCallOf } from '../dist/quantum/processing/unit/index.js'
import { DOORS } from '../dist/mcp/discovery.js'

const mode = process.argv[2] ?? 'commit'
const sorted = [...qpuHexFamiliesOf().keys()].filter((f) => !DOORS.has(f)).sort()
const run = async (program, params) => {
  const r = await qpuMcpCallOf('qpu_cite', { hex: { family: 'gate', program: [program], params } })
  const sc = (r?.structuredContent ?? r) ?? {}
  // the formula's own reading rides with the last step: failing names, next, the family
  return { ...sc, ...(sc.steps?.at?.(-1)?.reading ?? {}) }
}
const line = (name, r) => `  ${r.holds ? '✓' : '✗'} gate.${name}(${(r.params ?? []).join(', ')}) = ${r.value}${r.family ? ` ${r.family}` : ''}${r.failing?.length ? ` failing ${r.failing.join(', ')}` : ''}${r.denied ? ` ${r.denied} ${r.reading ?? ''}` : ''}`

let holds = true
if (mode === 'commit') {
  const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' }).split('\n').filter((f) => /^src\/(families\/[^/]+\/index|mcp\/[^/]+)\.ts$/.test(f) && fs.existsSync(f))
  const families = [...new Set(staged.flatMap((f) => [...fs.readFileSync(f, 'utf8').matchAll(/qpuHexRegisterOf\('([^']+)'/g)].map((m) => m[1])))].filter((f) => sorted.includes(f))
  if (!families.length) { console.log('gate: no formula module staged'); process.exit(0) }
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
  for (const name of ['proof', 'rules']) {
    const r = await run(name, [])
    console.log(line(name, { ...r, params: [] }))
    holds &&= r.holds === true
  }
  if (!families.length) console.log('  (no formula module changed since origin/main)')
}
console.log(`gate ${mode}: ${holds ? 'holds' : 'does not hold'}`)
process.exit(holds ? 0 : 1)
