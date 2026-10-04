import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { VectorFormulas } from './index.js'
import '../../mcp/families.js'

test('vector: anchorpoints, beziersegments, boundingbox, nodes, pathlengthsq, simplify, strokearea, winding — crossing to cartography', async (t) => {
  assert.equal(VectorFormulas.anchorpoints(99).value, 100, 'one more anchor than segments')
  assert.equal(VectorFormulas.beziersegments(10).value, 3, 'three cubic segments')
  assert.equal(VectorFormulas.boundingbox(640, 480).value, 307200)
  assert.equal(VectorFormulas.nodes(30, 1).value, 31, 'a single path')
  assert.equal(VectorFormulas.pathlengthsq(3, 4).value, 25, 'squared step length')
  assert.equal(VectorFormulas.simplify(1000, 1, 4).value, 250, 'keep a quarter')
  assert.equal(VectorFormulas.strokearea(200, 3).value, 600)
  assert.equal(VectorFormulas.winding(5, 2).value, 3, 'net clockwise')
  assert.equal(VectorFormulas.winding(2, 5).value, 0)
  assert.equal(VectorFormulas.pathlengthsq(3, 4).dst, 'cartography')
  assert.equal(qpuHexFamiliesOf().get('vector')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'vector', program: ['pathlengthsq'], params: [3, 4] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 25, `vector.pathlengthsq at ${uuid}`)
  qpuUuidReceiptOf('vector pathlengthsq', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; anchorpoints 100, beziersegments 3, boundingbox 307200, nodes 31, pathlengthsq 25, simplify 250, strokearea 600, winding 3; crossing to cartography')
})
