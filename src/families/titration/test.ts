import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { TitrationFormulas } from './index.js'
import '../../mcp/families.js'

test('titration: equivalence, concentration, endpoint, normality, titer, buffer, indicator, backtitration — crossing to chemistry', async (t) => {
  assert.equal(TitrationFormulas.equivalence(25, 2, 1).value, 50, 'titrant volume to the equivalence point')
  assert.equal(TitrationFormulas.concentration(20, 5, 10).value, 10, 'the unknown concentration by dilution')
  assert.equal(TitrationFormulas.endpoint(5, 30).value, 25, 'titrant delivered from the burette')
  assert.equal(TitrationFormulas.normality(2, 3).value, 6)
  assert.equal(TitrationFormulas.titer(1000, 25).value, 40)
  assert.equal(TitrationFormulas.buffer(10, 100).value, 10, 'conjugate-base to acid ratio')
  assert.equal(TitrationFormulas.indicator(3, 11).value, 7, 'transition midpoint')
  assert.equal(TitrationFormulas.backtitration(50, 12).value, 38, 'the unreacted excess')
  assert.equal(TitrationFormulas.equivalence(25, 2, 1).dst, 'chemistry')
  assert.equal(qpuHexFamiliesOf().get('titration')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'titration', program: ['equivalence'], params: [25, 2, 1] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 50, `titration.equivalence at ${uuid}`)
  qpuUuidReceiptOf('titration equivalence', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; equivalence 50, concentration 10, endpoint 25, normality 6, titer 40, buffer 10, indicator 7, backtitration 38; crossing to chemistry')
})
