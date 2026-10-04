import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { TelescopeFormulas } from './index.js'
import '../../mcp/families.js'

test('telescope: magnification, resolution, lightgathering, fratio, fieldofview, limiting, exitpupil, dawes — crossing to astronomy', async (t) => {
  assert.equal(TelescopeFormulas.magnification(1200, 25).value, 48, 'focal over eyepiece')
  assert.equal(TelescopeFormulas.resolution(550, 100).value, 5500)
  assert.equal(TelescopeFormulas.lightgathering(100, 7).value, 204, 'aperture area over pupil area')
  assert.equal(TelescopeFormulas.fratio(1200, 100).value, 120, 'f/12 ×10')
  assert.equal(TelescopeFormulas.fieldofview(50, 48).value, 1)
  assert.equal(TelescopeFormulas.limiting(100).value, 100)
  assert.equal(TelescopeFormulas.exitpupil(100, 48).value, 2)
  assert.equal(TelescopeFormulas.dawes(100).value, 116, 'arcseconds ×100')
  assert.equal(TelescopeFormulas.magnification(1200, 0).value, 0, 'eyepiece guard')
  assert.equal(TelescopeFormulas.magnification(1200, 25).dst, 'astronomy')
  assert.equal(qpuHexFamiliesOf().get('telescope')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'telescope', program: ['magnification'], params: [1200, 25] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 48, `telescope.magnification at ${uuid}`)
  qpuUuidReceiptOf('telescope magnification', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; magnification 48, resolution 5500, lightgathering 204, fratio 120, fieldofview 1, limiting 100, exitpupil 2, dawes 116; crossing to astronomy')
})
