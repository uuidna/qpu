import test from 'node:test'
import assert from 'node:assert/strict'
import { ANCIENT_LAW, summonCourt } from './toolboxes/legal.ts'
import { shorFactor } from './algorithms.ts'

// Complete legal: the court is summoned on any security finding, lead or capability decline, each bringing its own theorem and remedy,
// judged under the duty of candour (legal_only_the_proven_is_admitted). The ten HTTP gate rules still match as before.

test('the court is summoned on a capability decline, citing its theorem, remedy and the duty of candour', () => {
  const d = shorFactor(35)
  assert.equal(d.declined, true, '35 is beyond the bound')
  const c = summonCourt({ gate: 'shorFactor', violated: 'beyond the order-finding bound N ≤ 21', theorem: d.bound, remedy: d.handle, duty: d.duty, evidence: { N: 35, needsQubits: d.needsQubits } })
  assert.equal(c.theorem, 'textbook_rsa_beyond_bound', 'the case cites the bound theorem, not a mis-mapped HTTP rule')
  assert.equal(c.duty, 'legal_only_the_proven_is_admitted', 'the duty of candour is cited')
  assert.match(c.remedy, /never a factorization|do not assert/, 'the remedy is the honest handling')
  assert.ok(c.case && c.denier && c.ruling, 'a full case: address, denier, ruling')
  // quantum is ancient: the case is grounded with priority in the ancient wisdom it enacts (here the burden-of-proof maxim = the duty of candour)
  assert.ok(Array.isArray(c.ancient) && c.ancient.some((l) => l.id === 'ei-incumbit-probatio'), 'the case is grounded first in ancient law')
})

test('the court is summoned on any security finding or lead (self-described), not only the HTTP gate rules', () => {
  const sec = summonCourt({ gate: 'audit:security', violated: 'a slow operation (nothing slow is secure)', theorem: 'verify_beats_recompute_by_magnitudes', remedy: 'content-address the operation to O(1) and verify by lookup' })
  assert.equal(sec.theorem, 'verify_beats_recompute_by_magnitudes', 'the security finding brings its own theorem')
  assert.equal(sec.duty, 'legal_only_the_proven_is_admitted')
  assert.equal(sec.violated, 'a slow operation (nothing slow is secure)')
  const lead = summonCourt({ gate: 'lead:open', violated: 'an open lead to develop', remedy: 'develop the lead via the loop' })
  assert.ok(lead.case, 'a lead summons a case too')
  assert.equal(lead.duty, 'legal_only_the_proven_is_admitted', 'a lead defaults to the duty theorem')
})

test('an HTTP gate refusal still matches its court rule (unchanged)', () => {
  assert.equal(summonCourt({ gate: 'rest', status: 401 }).theorem, 'textbook_rest_rbac', 'a 401 maps to the role rule')
  assert.equal(summonCourt({ gate: 'edit', status: 412 }).theorem, 'textbook_edit_collides', 'a 412 maps to the collision rule')
})

test('ancient law is fused into the court: each code and maxim maps to a mechanism, a theorem and a source', () => {
  assert.ok(ANCIENT_LAW.length >= 9, 'the foundational codes and the Roman maxims are present')
  for (const l of ANCIENT_LAW) assert.ok(l.theorem.length > 0 && l.enactedBy.length > 0 && l.era.length > 0, `${l.id} maps to an era, a theorem and a court mechanism`)
  // the burden-of-proof maxim is exactly this tree's duty of candour
  assert.equal(ANCIENT_LAW.find((l) => l.id === 'ei-incumbit-probatio')?.theorem, 'legal_only_the_proven_is_admitted')
  for (const id of ['ur-nammu', 'hammurabi', 'twelve-tables', 'corpus-juris-civilis', 'audi-alteram-partem', 'nemo-iudex-in-causa-sua', 'res-judicata'])
    assert.ok(ANCIENT_LAW.some((l) => l.id === id), `${id} is fused`)
})
