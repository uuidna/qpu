import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { CorrosionFormulas } from './index.js'
import '../../mcp/families.js'

test('corrosion: rate, penetration, galvanic, passivation, pitting, inhibition, servicelife, massloss — crossing to chemistry', async (t) => {
  assert.equal(CorrosionFormulas.rate(1000, 50).value, 20, 'mass lost per unit time')
  assert.equal(CorrosionFormulas.penetration(20, 10).value, 200)
  assert.equal(CorrosionFormulas.galvanic(340, 250).value, 90, 'the galvanic drive')
  assert.equal(CorrosionFormulas.passivation(100, 30).value, 4)
  assert.equal(CorrosionFormulas.pitting(18, 2).value, 24, 'PREN of the alloy')
  assert.equal(CorrosionFormulas.inhibition(200, 50).value, 75, 'inhibitor efficiency %')
  assert.equal(CorrosionFormulas.servicelife(600, 20).value, 30)
  assert.equal(CorrosionFormulas.massloss(10, 2, 5).value, 100)
  assert.equal(CorrosionFormulas.galvanic(250, 340).value, 0, 'no drive when active leads')
  assert.equal(CorrosionFormulas.rate(1000, 50).dst, 'chemistry')
  assert.equal(qpuHexFamiliesOf().get('corrosion')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'corrosion', program: ['rate'], params: [1000, 50] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 20, `corrosion.rate at ${uuid}`)
  qpuUuidReceiptOf('corrosion rate', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; rate 20, penetration 200, galvanic 90, passivation 4, pitting 24, inhibition 75, servicelife 30, massloss 100; crossing to chemistry')
})
