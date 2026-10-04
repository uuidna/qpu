import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { OptionFormulas } from './index.js'
import '../../mcp/families.js'

test('option: intrinsicvalue, timevalue, payoff, breakeven, moneyness, premium, leverageratio, exercisevalue — crossing to trading', async (t) => {
  assert.equal(OptionFormulas.intrinsicvalue(150, 100).value, 50, 'fifty in the money')
  assert.equal(OptionFormulas.intrinsicvalue(90, 100).value, 0)
  assert.equal(OptionFormulas.timevalue(60, 50).value, 10)
  assert.equal(OptionFormulas.payoff(150, 100, 20).value, 30, 'payoff after the premium')
  assert.equal(OptionFormulas.breakeven(100, 20).value, 120)
  assert.equal(OptionFormulas.moneyness(150, 100).value, 150, 'spot is 150% of strike')
  assert.equal(OptionFormulas.premium(50, 10).value, 60)
  assert.equal(OptionFormulas.leverageratio(150, 20).value, 7)
  assert.equal(OptionFormulas.exercisevalue(150, 100, 20).value, 1000, 'intrinsic across twenty contracts')
  assert.equal(OptionFormulas.intrinsicvalue(150, 100).dst, 'trading')
  assert.equal(qpuHexFamiliesOf().get('option')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'option', program: ['intrinsicvalue'], params: [150, 100] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 50, `option.intrinsicvalue at ${uuid}`)
  qpuUuidReceiptOf('option intrinsicvalue', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; intrinsicvalue 50, timevalue 10, payoff 30, breakeven 120, moneyness 150, premium 60, leverageratio 7, exercisevalue 1000; crossing to trading')
})
