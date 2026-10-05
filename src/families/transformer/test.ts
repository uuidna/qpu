import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { TransformerFormulas } from './index.js'
import '../../mcp/families.js'

test('transformer: ratio, secondary, primary, power, efficiency, impedance, regulation, turns — crossing to electrical', async (t) => {
  assert.equal(TransformerFormulas.ratio(240, 24).value, 10, 'ten-to-one step-down')
  assert.equal(TransformerFormulas.secondary(240, 10, 1).value, 24)
  assert.equal(TransformerFormulas.primary(24, 1, 10).value, 240)
  assert.equal(TransformerFormulas.power(240, 5).value, 1200, 'volt-amperes')
  assert.equal(TransformerFormulas.efficiency(950, 1000).value, 95)
  assert.equal(TransformerFormulas.impedance(240, 6).value, 40)
  assert.equal(TransformerFormulas.regulation(250, 240).value, 4, 'four percent drop')
  assert.equal(TransformerFormulas.regulation(240, 240).value, 0)
  assert.equal(TransformerFormulas.turns(240, 2).value, 120)
  assert.equal(TransformerFormulas.ratio(240, 24).dst, 'electrical')
  assert.equal(qpuHexFamiliesOf().get('transformer')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'transformer', program: ['ratio'], params: [240, 24] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 10, `transformer.ratio at ${uuid}`)
  qpuUuidReceiptOf('transformer ratio', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; ratio 10, secondary 24, primary 240, power 1200, efficiency 95, impedance 40, regulation 4, turns 120; crossing to electrical')
})
