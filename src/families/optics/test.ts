import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { OpticsFormulas } from './index.js'
import '../../mcp/families.js'

test('optics: refraction, magnification, focal, power, intensity, wavelength, aperture, transmission — crossing to materials', async (t) => {
  assert.equal(OpticsFormulas.refraction(1000, 1500).value, 666, 'Snell proxy, index x1000')
  assert.equal(OpticsFormulas.magnification(300, 100).value, 300, 'three times, x100')
  assert.equal(OpticsFormulas.focal(500, 200).value, 300)
  assert.equal(OpticsFormulas.power(50).value, 20000, 'diopters x1000')
  assert.equal(OpticsFormulas.intensity(1000, 4).value, 250)
  assert.equal(OpticsFormulas.wavelength(300000000, 600).value, 500000)
  assert.equal(OpticsFormulas.aperture(50, 25).value, 20, 'f/2.0, x10')
  assert.equal(OpticsFormulas.transmission(90, 100).value, 90)
  assert.equal(OpticsFormulas.refraction(1000, 0).value, 0, 'guarded division')
  assert.equal(OpticsFormulas.refraction(1000, 1500).dst, 'materials')
  assert.equal(qpuHexFamiliesOf().get('optics')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'optics', program: ['focal'], params: [500, 200] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 300, `optics.focal at ${uuid}`)
  qpuUuidReceiptOf('optics focal', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; refraction 666, magnification 300, focal 300, power 20000, intensity 250, wavelength 500000, aperture 20, transmission 90; crossing to materials')
})
