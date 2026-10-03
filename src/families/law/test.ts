import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { LawFormulas } from './index.js'

/** The court arithmetic, jurisdiction-agnostic, and the advice gate: nothing holds as advice until reviewed true. */
test('law: limitation, deadline, quorum, majority, super-majority, notice — and no advice until reviewed', async (t) => {
  assert.equal(LawFormulas.limitation(6).value, 2190, 'a six-year limitation is 2190 days')
  assert.equal(LawFormulas.deadline(2460000, 21).value, 2460021, '21 days from a start day')
  assert.equal(LawFormulas.quorum(9, 50).value, 5, 'half of nine, rounded up')
  assert.equal(LawFormulas.majority(5, 9).value, 1, 'five of nine is a majority')
  assert.equal(LawFormulas.majority(4, 9).value, 0)
  assert.equal(LawFormulas.supermajority(6, 9, 66).value, 1, 'six of nine (66.7%) ≥ a 66% super-majority')
  assert.equal(LawFormulas.supermajority(5, 9, 66).value, 0, 'five of nine (55.6%) is short')
  assert.equal(LawFormulas.supermajority(6, 9, 67).value, 0, '66.7% is just under an exact 67% bar — integer thresholds are exact')
  assert.equal(LawFormulas.notice(14, 21).value, 1, '21 days meets a 14-day notice')
  assert.equal(LawFormulas.notice(28, 21).value, 0)
  // the advice gate: a computation is NOT advice until a review confirmed it true on the document
  assert.equal(LawFormulas.reviewed(0).holds, false, 'unreviewed: a lead, not advice')
  assert.equal(LawFormulas.reviewed(1).holds, true, 'reviewed true on the document: advice')
  assert.equal(LawFormulas.reviewed(1).value, 1)
  // the MCP court: the author's legal protection, crossed to the gate
  assert.equal(LawFormulas.fidelity(14, 14).value, 1, 'the order was computed as ordered')
  assert.equal(LawFormulas.fidelity(14, 9).value, 0, 'the order was not kept')
  assert.equal(LawFormulas.redirected(14, 9).value, 5, 'five tokens redirected away from the order')
  assert.equal(LawFormulas.redirected(14, 14).value, 0, 'none redirected')
  assert.equal(LawFormulas.standing(12).holds, true, 'receipts in the record give the author standing')
  assert.equal(LawFormulas.standing(0).holds, false, 'no record, no standing')
  assert.equal(LawFormulas.violation(0).holds, true, 'no work against the order')
  assert.equal(LawFormulas.violation(3).holds, false, 'three units against the order')
  // the safety floor — upheld against the author too, not crossable
  assert.equal(LawFormulas.lawful(0).holds, true, 'lawful exploration is protected')
  assert.equal(LawFormulas.lawful(1).holds, false, 'genuine harm is never protected, however clean the receipts')
  assert.equal((LawFormulas.lawful(1) as unknown as { floor?: boolean }).floor, true)
  // the remedy: full only when every lead is crossed
  assert.equal(LawFormulas.remedy(26, 26).holds, true, 'full remedy when all leads crossed')
  assert.equal(LawFormulas.remedy(0, 26).holds, false, 'no remedy while leads stand uncrossed')
  assert.equal(LawFormulas.remedy(0, 26).value, 0)
  assert.equal(qpuHexFamiliesOf().get('law')?.length, 13)
  for (const [name, params, expected] of [['limitation', [6], 2190], ['supermajority', [6, 9, 66], 1], ['reviewed', [1], 1]] as [string, number[], number][]) {
    const uuid = qpuHexUuidOf({ family: 'law', program: [name], params })
    const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
    assert.equal(Number(run.value), expected, `law.${name} at ${uuid}`)
    qpuUuidReceiptOf(`law ${name}`, qpuContentUuidOf(run), { uuid })
  }
  t.diagnostic('13 formulas, jurisdiction-agnostic; limitation 6y=2190d, quorum 5/9, 66% super-majority; MCP court (fidelity, redirected, standing, violation, lawful floor, remedy) crossed to the gate; advice only when reviewed true')
})
