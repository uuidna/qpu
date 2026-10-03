import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { ColorFormulas } from './index.js'
import '../../mcp/families.js'

test('color: hue, shade, alpha, mix, luminance, complement, saturation, palette — crossing to css', async (t) => {
  assert.equal(ColorFormulas.hue(370).value, 10, 'degrees wrap the wheel')
  assert.equal(ColorFormulas.shade(50, 2).value, 30, 'two steps down the lightness')
  assert.equal(ColorFormulas.alpha(80).value, 80)
  assert.equal(ColorFormulas.mix(100, 200).value, 150, 'the channel average')
  assert.equal(ColorFormulas.luminance(255, 0).value, 127)
  assert.equal(ColorFormulas.complement(30).value, 210, 'across the wheel')
  assert.equal(ColorFormulas.saturation(80, 50).value, 40)
  assert.equal(ColorFormulas.palette(11, 10).value, 110, 'eleven hues at ten shades')
  assert.equal(ColorFormulas.hue(370).dst, 'css')
  assert.equal(qpuHexFamiliesOf().get('color')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'color', program: ['palette'], params: [11, 10] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 110, `color.palette at ${uuid}`)
  qpuUuidReceiptOf('color palette', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; hue 10, shade 30, alpha 80, mix 150, luminance 127, complement 210, saturation 40, palette 110; crossing to css')
})
