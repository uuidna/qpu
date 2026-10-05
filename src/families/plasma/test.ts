import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { PlasmaFormulas } from './index.js'
import '../../mcp/families.js'

test('plasma: temperature, density, debye, confinement, ionization, fusion, magnetic, frequency — crossing to energy', async (t) => {
  assert.equal(PlasmaFormulas.temperature(1000, 40).value, 25, 'energy per particle')
  assert.equal(PlasmaFormulas.density(1000, 10).value, 100)
  assert.equal(PlasmaFormulas.debye(1000, 10).value, 100)
  assert.equal(PlasmaFormulas.confinement(1000, 20).value, 50, 'confinement time')
  assert.equal(PlasmaFormulas.ionization(99, 100).value, 99)
  assert.equal(PlasmaFormulas.fusion(1000, 100).value, 1000, 'Q factor %')
  assert.equal(PlasmaFormulas.magnetic(1000, 50).value, 20, 'beta proxy')
  assert.equal(PlasmaFormulas.frequency(100, 3).value, 300, 'plasma frequency proxy')
  assert.equal(PlasmaFormulas.temperature(1000, 40).dst, 'energy')
  assert.equal(qpuHexFamiliesOf().get('plasma')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'plasma', program: ['density'], params: [1000, 10] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 100, `plasma.density at ${uuid}`)
  qpuUuidReceiptOf('plasma density', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; temperature 25, density 100, debye 100, confinement 50, ionization 99, fusion 1000, magnetic 20, frequency 300; crossing to energy')
})
