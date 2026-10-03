import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { TaxFormulas } from './index.js'
import '../../mcp/families.js'

test('tax: brackets, rates, deductions, credits, capital gains, withholding — crossing to law', async (t) => {
  assert.equal(TaxFormulas.bracket(80000, 50000, 40).value, 12000, '40% of the income above 50000')
  assert.equal(TaxFormulas.bracket(40000, 50000, 40).value, 0, 'below the bracket threshold')
  assert.equal(TaxFormulas.marginal(80000, 20).value, 16000, '20% flat')
  assert.equal(TaxFormulas.effective(16000, 80000).value, 20, 'a 20% effective rate')
  assert.equal(TaxFormulas.deduct(80000, 12000).value, 68000, 'taxable income after a deduction')
  assert.equal(TaxFormulas.credit(16000, 2000).value, 14000, 'tax after a credit')
  assert.equal(TaxFormulas.capgains(50000, 30000, 15).value, 3000, '15% of the 20000 gain')
  assert.equal(TaxFormulas.capgains(30000, 50000, 15).value, 0, 'a loss, no gains tax')
  assert.equal(TaxFormulas.withhold(5000, 30).value, 1500, '30% withheld at source')
  assert.equal(TaxFormulas.net(80000, 16000).value, 64000, 'the net in hand')
  assert.equal(TaxFormulas.marginal(80000, 20).dst, 'law', 'tax is enforced by the court')
  assert.equal(qpuHexFamiliesOf().get('tax')?.length, 8)
  // a 3-param formula addresses 16-bit params (≤ 65535), so the hex check uses values that fit
  const uuid = qpuHexUuidOf({ family: 'tax', program: ['bracket'], params: [60000, 50000, 40] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 4000, `tax.bracket at ${uuid}`)
  qpuUuidReceiptOf('tax bracket', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; bracket 12000, marginal 16000, effective 20%, deduct 68000, credit 14000, capgains 3000, withhold 1500, net 64000; crossing to law')
})
