import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { PayrollFormulas } from './index.js'
import '../../mcp/families.js'

test('payroll: gross, overtime, net, taxrate, benefits, costperhead, accrual, withholding — crossing to accounting', async (t) => {
  assert.equal(PayrollFormulas.gross(20, 160).value, 3200, 'a month of pay')
  assert.equal(PayrollFormulas.overtime(45, 40).value, 5, 'five overtime hours')
  assert.equal(PayrollFormulas.overtime(30, 40).value, 0, 'no overtime')
  assert.equal(PayrollFormulas.net(3200, 700).value, 2500)
  assert.equal(PayrollFormulas.net(500, 700).value, 0, 'never below zero')
  assert.equal(PayrollFormulas.taxrate(640, 3200).value, 20)
  assert.equal(PayrollFormulas.benefits(320, 3200).value, 10)
  assert.equal(PayrollFormulas.costperhead(32000, 10).value, 3200, 'per head')
  assert.equal(PayrollFormulas.accrual(12, 8).value, 96)
  assert.equal(PayrollFormulas.withholding(800, 3200).value, 25)
  assert.equal(PayrollFormulas.gross(20, 160).dst, 'accounting')
  assert.equal(qpuHexFamiliesOf().get('payroll')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'payroll', program: ['gross'], params: [20, 160] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 3200, `payroll.gross at ${uuid}`)
  qpuUuidReceiptOf('payroll gross', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; gross 3200, overtime 5, net 2500, taxrate 20, benefits 10, costperhead 3200, accrual 96, withholding 25; crossing to accounting')
})
