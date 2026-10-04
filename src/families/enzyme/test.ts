import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { EnzymeFormulas } from './index.js'
import '../../mcp/families.js'

test('enzyme: michaelis, velocity, turnover, catalyticefficiency, inhibition, specificactivity, substratesaturation, vmax — crossing to biochemistry', async (t) => {
  assert.equal(EnzymeFormulas.michaelis(100, 50, 40).value, 75, 'Km from a measured velocity')
  assert.equal(EnzymeFormulas.velocity(100, 50, 50).value, 50, 'half-max at s = km')
  assert.equal(EnzymeFormulas.turnover(1000, 5).value, 200, 'kcat per unit enzyme')
  assert.equal(EnzymeFormulas.catalyticefficiency(1000, 20).value, 50)
  assert.equal(EnzymeFormulas.inhibition(10, 30, 10).value, 40, 'apparent Km under competitive inhibition')
  assert.equal(EnzymeFormulas.specificactivity(5000, 100).value, 50)
  assert.equal(EnzymeFormulas.substratesaturation(50, 50).value, 50, 'half saturated')
  assert.equal(EnzymeFormulas.vmax(50, 50, 50).value, 100, 'Vmax recovered')
  assert.equal(EnzymeFormulas.velocity(100, 50, 50).dst, 'biochemistry')
  assert.equal(qpuHexFamiliesOf().get('enzyme')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'enzyme', program: ['velocity'], params: [100, 50, 50] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 50, `enzyme.velocity at ${uuid}`)
  qpuUuidReceiptOf('enzyme velocity', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; michaelis 75, velocity 50, turnover 200, catalyticefficiency 50, inhibition 40, specificactivity 50, substratesaturation 50, vmax 100; crossing to biochemistry')
})
