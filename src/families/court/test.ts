import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { CourtFormulas } from './index.js'
import '../../mcp/families.js'

/** The court arithmetic a firm or a bench runs on a matter, jurisdiction-agnostic and exact — and a lead until reviewed:
 *  it crosses to law, whose reviewed-gate is the only thing that turns a computation into advice. */
test('court: standard of proof, damages, interest, costs, apportionment, settlement, cap, fee — exact, a lead until reviewed', async (t) => {
  assert.equal(CourtFormulas.standard(60, 51).value, 1, 'balance of probabilities met')
  assert.equal(CourtFormulas.standard(85, 90).value, 0, 'beyond reasonable doubt not met at 85%')
  assert.equal(CourtFormulas.damages(1000, 5, 3).value, 1150, '1000 + 5%·3y = 1150')
  assert.equal(CourtFormulas.interest(10000, 8, 365).value, 800, '8% of 10000 for a year')
  assert.equal(CourtFormulas.costs(10, 250).value, 2500, '10 hours at 250')
  assert.equal(CourtFormulas.apportion(3000, 2, 3).value, 2000, "two thirds of the defendant's award")
  assert.equal(CourtFormulas.apportion(3000, 4, 3).holds, false, 'fault cannot exceed total')
  assert.equal(CourtFormulas.settlement(100000, 30).value, 30000, 'expected value at 30% success')
  assert.equal(CourtFormulas.cap(500000, 250000).value, 250000, 'the statutory cap applies')
  assert.equal(CourtFormulas.cap(100000, 250000).value, 100000, 'under the cap, the award stands')
  assert.equal(CourtFormulas.fee(100000, 33).value, 33000, 'a 33% contingency fee')
  // it is a measure crossed to law, not advice: the src is court, the dst is law's advice gate
  assert.equal(CourtFormulas.damages(1000, 5, 3).src, 'court')
  assert.equal(CourtFormulas.damages(1000, 5, 3).dst, 'law')
  // registered and runs at its hex address
  assert.equal(qpuHexFamiliesOf().get('court')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'court', program: ['damages'], params: [1000, 5, 3] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 1150, `court.damages at ${uuid}`)
  qpuUuidReceiptOf('court damages', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas, jurisdiction-agnostic; standard 60≥51, damages 1150, interest 800, apportion 2000, settlement 30000, cap 250000, fee 33000; a lead crossing to law until reviewed')
})
