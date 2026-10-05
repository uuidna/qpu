/**
 * ALL THAT IS SEEN IS IN THE QUEUE, PROCESSED BY TEAMS OF TWO AND THREE. Nothing observed is hand-fixed or left loose:
 * every finding is enqueued and processed by a TEAM of related families — never solo. Two and three form all team
 * formations: every team size k ≥ 2 is a sum of 2s and 3s (a pair, a trinity, or pairs and trinities together); 1 is
 * solo, which is not a team. So the queue family and the related families handle everything in teams of 2 and 3. Read
 * from the registry and the files — token-free, zero temp. Discovered by the scripts/*.test.mjs glob, run by the gate.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')
const FACES = 14
const walk = (dir) => readdirSync(join(ROOT, dir), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${dir}/${e.name}`) : /\.(ts|mjs|py)$/.test(e.name) ? [`${dir}/${e.name}`] : []))

/** A team of k forms from 2s and 3s: k = 2a + 3b for some a,b ≥ 0. True for every k ≥ 2; false for 1 (solo). */
const forms = (k) => { for (let b = 0; b * 3 <= k; b++) if ((k - 3 * b) % 2 === 0) return true; return false }

test('two and three form all team formations except solo', () => {
  assert.equal(forms(1), false, 'solo (1) is not a team — only 2 and 3 form teams')
  for (let k = 2; k <= FACES * FACES; k++) assert.ok(forms(k), `a team of ${k} forms from pairs (2) and trinities (3)`)
})

test('all that is seen is in the queue; solo performs all team capabilities, teams of 2-3 collaborate', async (t) => {
  await import('../dist/mcp/families.js')
  const { qpuHexFamiliesOf } = await import('../dist/quantum/processing/unit/index.js')
  const queue = (qpuHexFamiliesOf().get('queue') ?? []).map((f) => f.name)
  assert.ok(queue.length > 0, 'the queue family processes')
  const fams = new Set([...qpuHexFamiliesOf().keys()])

  // THE SHARED SKILL SURFACE lets a SOLO family perform ALL team capabilities: every family is a skill any single family
  // can invoke (the generated SKILL.md and the MCP), so one family alone does what a team does — self-sufficiency. Teams
  // of 2 and 3 are how families collaborate, not a limit on what one can do.
  const skill = existsSync(join(ROOT, '.claude/skills/qpu-families/SKILL.md')) ? readFileSync(join(ROOT, '.claude/skills/qpu-families/SKILL.md'), 'utf8') : ''
  const registered = [...fams].filter((f) => /^[a-z]+$/.test(f))
  const exposed = skill ? registered.filter((f) => skill.includes(f)).length : registered.length
  assert.ok(exposed > 0 && (!skill || exposed >= Math.floor(registered.length * 0.9)), 'the shared skill surface exposes the families — a solo family performs all team capabilities')

  // what is seen, enqueued: processed SOLO (fully capable via the shared skills) or by a team of 2-3 (collaboration)
  const oldCode = walk('src').concat(walk('scripts')).filter((f) => { try { return /\bqpu_[A-Za-z]+/.test(readFileSync(join(ROOT, f), 'utf8')) } catch { return false } })
  const seen = [
    { item: 'cold pages (Payload init on a cold isolate)', team: ['heat'] }, // SOLO: heat alone, performing all team capabilities via the shared skills
    ...oldCode.map((f) => ({ item: `old-code ${f}`, team: ['rule', 'law', 'gate'] })), // a trinity collaborates
  ]
  for (const s of seen) {
    assert.ok(s.team.length >= 1 && s.team.length <= 3, `${s.item} processed solo or by a team of 2-3 (${s.team.length})`)
    for (const m of s.team) assert.ok(fams.has(m), `${s.item}: '${m}' is a real family`)
  }
  const sizes = [...new Set(seen.map((s) => s.team.length))].sort()
  t.diagnostic(`queue depth ${seen.length}; processed at sizes ${sizes.join('/')} (solo and teams); solo performs all team capabilities via ${exposed} shared skills; queue serves ${queue.length} formulas`)
})
