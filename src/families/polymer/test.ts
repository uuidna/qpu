import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { PolymerFormulas } from './index.js'
import '../../mcp/families.js'

test('polymer: molecularweight, dispersity, crosslink, crystallinity, conversion, glass, tensile, chainlength — crossing to materials', async (t) => {
  assert.equal(PolymerFormulas.molecularweight(100, 500).value, 50000, 'monomer mass over the chain')
  assert.equal(PolymerFormulas.dispersity(220, 200).value, 110)
  assert.equal(PolymerFormulas.crosslink(30, 200).value, 15)
  assert.equal(PolymerFormulas.crystallinity(40, 100).value, 40)
  assert.equal(PolymerFormulas.conversion(85, 100).value, 85, 'per-cent converted')
  assert.equal(PolymerFormulas.glass(373).value, 373)
  assert.equal(PolymerFormulas.tensile(5000, 100).value, 50)
  assert.equal(PolymerFormulas.chainlength(50000, 100).value, 500)
  assert.equal(PolymerFormulas.molecularweight(100, 500).dst, 'materials')
  assert.equal(qpuHexFamiliesOf().get('polymer')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'polymer', program: ['tensile'], params: [5000, 100] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 50, `polymer.tensile at ${uuid}`)
  qpuUuidReceiptOf('polymer tensile', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; molecularweight 50000, dispersity 110, crosslink 15, crystallinity 40, conversion 85, glass 373, tensile 50, chainlength 500; crossing to materials')
})
