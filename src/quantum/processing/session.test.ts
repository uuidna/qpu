// The session door, the a432 lead cells and the Clay rosetta at the small size: hermetic, no network, recorded fixtures only. Every test name
// carries its Google test size, so the standards measure can count the sizes.
import test from 'node:test'
import assert from 'node:assert/strict'
import { combineLeads, runSession, LEADS } from './leads.ts'
import { toolCallerOf } from './mcp.ts'

// recorded with real MCP client calls to the hosted unit's run_sequence on 2026-10-27
const RECORDED = [{ value: 3432, answer: { seed: 2, reflection: 8 } }, { value: 15, answer: { seed: 5, reflection: 5 } }, { value: 471435600, answer: { seed: 0, reflection: 0 } }, { value: 0, answer: { seed: 0, reflection: 0 } }]

test('[small] a432: 432 cells, every lead placed once, every cell its own mixed radix, the key naming cell 0', () => {
  const k = combineLeads(LEADS)
  assert.equal(k.total, 432)
  assert.equal(k.radices.reduce((p, r) => p * r, 1), 432)
  assert.equal(k.cells.reduce((n, c) => n + c.count, 0), LEADS.length)
  assert.ok(k.cells.every((c) => c.digits.reduce((n, d, i) => n + d * k.places[i]!, 0) === c.cell))
  assert.equal(k.default.cell, 0)
  assert.equal(combineLeads(LEADS, '0'.repeat(30) + '01b0').default.cell, 0x1b0 % 432)
  assert.deepEqual(k.rosetta.plan.map((p) => p.arguments.input), k.rosetta.values)
})

test('[small] the session door: every directive in one class, started work first, breaks by the six rules', () => {
  const s = runSession({ open: [{ id: 'a', title: 'read every session transcript to decide', status: 'draft' }, { id: 'b', title: 'rename the favicon palette', status: 'draft', started: true }], directives: [{ session: 's1', at: '', text: 'read every session transcript and decide what is next' }, { session: 's1', at: '', text: 'go' }, { session: 's1', at: '', text: 'translate the docs into Bulgarian' }, { session: 's2', at: '', text: 'translate all docs into Bulgarian' }], breaks: [{ text: 'npm install x' }, { text: 'git commit -m y' }, { rule: 'killing by name', count: 3 }], files: ['scripts/session.ts', 'src/quantum/favicon.ts'] })
  const d = s.directives
  assert.equal(d.folded + d.proposed + d.once + d.assents, d.total)
  assert.equal(s.items[0]!.id, 'b')
  assert.ok(s.items.some((i) => i.proposed && i.act))
  assert.equal(s.breaks['raw npm or pnpm install'], 1)
  assert.equal(s.breaks['killing by name'], 3)
  assert.deepEqual(s.items.find((i) => i.id === 'a')!.files, ['scripts/session.ts'])
})

test('[small] the Clay rosetta over the recorded unit answers: both conventions kept, σ₁₀ on both sides', () => {
  const r = toolCallerOf('clay')({ technique: 'reflection', unit: RECORDED })
  assert.equal(r.unitVerified, RECORDED.length)
  assert.equal(r.conventionBreaks, 0)
  const broken = toolCallerOf('clay')({ technique: 'reflection', unit: [{ value: 3432, answer: { seed: 3, reflection: 7 } }] })
  assert.equal(broken.conventionBreaks, 1)
  assert.ok(broken.leads.some((l: { id: string }) => l.id === 'rosetta-3432'))
})
