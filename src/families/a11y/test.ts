import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { A11yFormulas } from './index.js'
import '../../mcp/families.js'

test('a11y: contrast, alt, labels, target, landmarks, tabindex, aria, focus — crossing to css', async (t) => {
  assert.equal(A11yFormulas.contrast(85, 5).value, 900, 'WCAG ratio ·100, AA met')
  assert.equal(A11yFormulas.alt(90, 100).value, 90)
  assert.equal(A11yFormulas.labels(8, 10).value, 80)
  assert.equal(A11yFormulas.target(44, 44).value, 1, 'tap target large enough')
  assert.equal(A11yFormulas.target(40, 44).value, 0)
  assert.equal(A11yFormulas.landmarks(5).value, 5)
  assert.equal(A11yFormulas.tabindex(3, 5).value, 1, 'in document order')
  assert.equal(A11yFormulas.tabindex(6, 5).value, 0)
  assert.equal(A11yFormulas.aria(9, 10).value, 90)
  assert.equal(A11yFormulas.focus(95, 100).value, 95)
  assert.equal(A11yFormulas.alt(90, 100).dst, 'css')
  assert.equal(qpuHexFamiliesOf().get('a11y')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'a11y', program: ['alt'], params: [90, 100] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 90, `a11y.alt at ${uuid}`)
  qpuUuidReceiptOf('a11y alt', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; contrast 900, alt 90, labels 80, target 1, landmarks 5, tabindex 1, aria 90, focus 95; crossing to css')
})
