import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { BondFormulas } from './index.js'
import '../../mcp/families.js'

test('bond: coupon, yield, current, par, discount, premium, maturity, accrued — crossing to econ', async (t) => {
  assert.equal(BondFormulas.coupon(1000, 5).value, 50, 'a 5% coupon on 1000 face')
  assert.equal(BondFormulas.yield(50, 1000).value, 5, 'current yield 5%')
  assert.equal(BondFormulas.current(98, 10).value, 980)
  assert.equal(BondFormulas.par(1000, 10).value, 10000)
  assert.equal(BondFormulas.discount(1000, 950).value, 50, 'trading below par')
  assert.equal(BondFormulas.premium(1050, 1000).value, 50, 'trading above par')
  assert.equal(BondFormulas.premium(950, 1000).value, 0)
  assert.equal(BondFormulas.maturity(10, 2).value, 20, 'semiannual periods to maturity')
  assert.equal(BondFormulas.accrued(60, 90, 180).value, 30)
  assert.equal(BondFormulas.coupon(1000, 5).dst, 'econ')
  assert.equal(qpuHexFamiliesOf().get('bond')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'bond', program: ['coupon'], params: [1000, 5] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 50, `bond.coupon at ${uuid}`)
  qpuUuidReceiptOf('bond coupon', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; coupon 50, yield 5, current 980, par 10000, discount 50, premium 50, maturity 20, accrued 30; crossing to econ')
})
