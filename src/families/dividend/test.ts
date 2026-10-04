import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { DividendFormulas } from './index.js'
import '../../mcp/families.js'

test('dividend: yield, payout, cover, pershare, growth, reinvest, retention, total — crossing to portfolio', async (t) => {
  assert.equal(DividendFormulas.yield(5, 100).value, 5, 'a 5% yield')
  assert.equal(DividendFormulas.payout(40, 100).value, 40, '40% of earnings paid out')
  assert.equal(DividendFormulas.cover(100, 40).value, 2, 'earnings cover the payout twice')
  assert.equal(DividendFormulas.pershare(1000, 500).value, 2)
  assert.equal(DividendFormulas.growth(110, 100).value, 10, '10% growth')
  assert.equal(DividendFormulas.growth(90, 100).value, 0, 'a cut is not negative growth')
  assert.equal(DividendFormulas.reinvest(1000, 50).value, 20, 'twenty shares bought')
  assert.equal(DividendFormulas.retention(40, 100).value, 60)
  assert.equal(DividendFormulas.total(2, 500).value, 1000)
  assert.equal(DividendFormulas.yield(5, 100).dst, 'portfolio')
  assert.equal(qpuHexFamiliesOf().get('dividend')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'dividend', program: ['cover'], params: [100, 40] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 2, `dividend.cover at ${uuid}`)
  qpuUuidReceiptOf('dividend cover', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; yield 5, payout 40, cover 2, pershare 2, growth 10, reinvest 20, retention 60, total 1000; crossing to portfolio')
})
