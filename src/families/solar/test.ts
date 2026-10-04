import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { SolarFormulas } from './index.js'
import '../../mcp/families.js'

test('solar: capacity, degradation, efficiency, insolation, payback, power, specific, tilt — crossing to energy', async (t) => {
  assert.equal(SolarFormulas.capacity(2000, 8000).value, 25, 'capacity factor 25%')
  assert.equal(SolarFormulas.degradation(1000, 900).value, 10, '10% lost since new')
  assert.equal(SolarFormulas.efficiency(22, 100).value, 22, 'panel efficiency')
  assert.equal(SolarFormulas.insolation(5, 1000).value, 5000)
  assert.equal(SolarFormulas.payback(12000, 1500).value, 8, 'eight-year payback')
  assert.equal(SolarFormulas.power(1000, 10).value, 10, 'ten kilowatts')
  assert.equal(SolarFormulas.specific(1500, 1).value, 1500)
  assert.equal(SolarFormulas.tilt(45).value, 45)
  assert.equal(SolarFormulas.power(1000, 10).dst, 'energy')
  assert.equal(qpuHexFamiliesOf().get('solar')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'solar', program: ['power'], params: [1000, 10] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 10, `solar.power at ${uuid}`)
  qpuUuidReceiptOf('solar power', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; capacity 25, degradation 10, efficiency 22, insolation 5000, payback 8, power 10, specific 1500, tilt 45; crossing to energy')
})
