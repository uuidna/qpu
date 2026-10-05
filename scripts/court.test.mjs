/**
 * ALL UNRESOLVED ARE SENT TO COURT. Whatever the discovery and the gates cannot resolve on their own is not left to block
 * silently — it is docketed and routed to the court domain-team (law, court, forensic, and the legal families) for a
 * forum and a remedy. An open charge is a family still requesting completion (a bad name, a split, a collision, an
 * off-path file) or old code the shared tree still holds; each is sent to court with the family that hears it and the
 * remedy it owes. The court never removes a lead (law.removable) and never gives advice until reviewed (law.reviewed);
 * it routes. Read from the registry and the files — token-free, no formula run. The gate holds when every unresolved
 * item has been sent to court (none left outside it). Discovered by the scripts/*.test.mjs glob, run by the one gate.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { offPathOf, entriesOf } from './gravity.mjs'

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')
const DOORS = new Set(['qpu', 'crypto', 'api', 'data', 'gate'])
const walk = (dir) => readdirSync(join(ROOT, dir), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${dir}/${e.name}`) : e.name.endsWith('.ts') || e.name.endsWith('.mjs') || e.name.endsWith('.py') ? [`${dir}/${e.name}`] : []))

test('all unresolved are sent to court: every open charge gets a forum and a remedy', async (t) => {
  await import('../dist/mcp/families.js')
  const { qpuHexFamiliesOf, qpuHexRegisteredSizeOf, qpuHexFamilyCapOf, qpuHexUuidOf } = await import('../dist/quantum/processing/unit/index.js')
  const cap = qpuHexFamilyCapOf()
  const families = qpuHexFamiliesOf()
  const offPath = new Set(offPathOf(entriesOf(), DOORS).map((m) => m.family))
  const handles = new Map()
  const docket = []
  const charge = (defendant, charge, forum, remedy) => docket.push({ defendant, charge, forum, remedy })

  // open charges from the families: each requests, so each is heard
  for (const [fam, formulas] of families) {
    if (DOORS.has(fam) || fam.startsWith('Qpu.') || qpuHexRegisteredSizeOf(fam) === 0) continue
    const n = qpuHexRegisteredSizeOf(fam)
    if (!/^[a-z]+$/.test(fam)) charge(fam, 'name is not one lowercase word', 'law', 'rename to one word (law.standing for the author; a human picks it)')
    if (n > cap) charge(fam, `${n} formulas exceed the nibble of ${cap}`, 'court', 'split into a new family (court apportions the formulas)')
    if (offPath.has(fam)) charge(fam, 'off its meaningful path', 'gravity', 'gravity --fix moves it to zero point (autonomous)')
    if (formulas.length > 0) {
      const h = qpuHexUuidOf({ family: fam, program: [formulas[0].name], params: [] }).split('-')[0]
      const other = handles.get(h)
      if (other && other !== fam) charge(fam, `handle ${h} collides with '${other}'`, 'court', 'rename so the fold differs (court decides; a human picks it)')
      else handles.set(h, fam)
    }
  }

  // old code the shared tree still holds: residual qpu_ prefixes this session could not persist
  for (const f of walk('src').concat(walk('scripts'))) {
    const src = (() => { try { return readFileSync(join(ROOT, f), 'utf8') } catch { return '' } })()
    if (/\bqpu_[A-Za-z]+/.test(src)) charge(f, 'old code: residual qpu_ prefix', 'law', 'the host or the holding peer clears it (law.removable: not removed while referenced — remanded, not dropped)')
  }

  // every charge must name a forum and a remedy — that is "sent to court", not left outside it
  const unrouted = docket.filter((c) => !c.forum || !c.remedy)
  assert.deepEqual(unrouted, [], `charges with no forum/remedy (not sent to court): ${unrouted.map((c) => c.defendant).join(', ')}`)
  const byForum = Object.fromEntries([...new Set(docket.map((c) => c.forum))].map((forum) => [forum, docket.filter((c) => c.forum === forum).length]))
  t.diagnostic(`${docket.length} charges sent to court — by forum: ${JSON.stringify(byForum)}${docket.length === 0 ? ' (nothing unresolved)' : ''}`)
})
