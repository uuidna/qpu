import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { VectorFormulas } from './index.js'

/** vector: 8 exact-integer formulas, each recomputed from the palette and run at its hex address. */
test('vector: dot, magnitude, dims, scale, components, crossprod, norm, combos', async (t) => {
  assert.equal(VectorFormulas.dot(3, 4).value, 12, 'dot(3, 4)')
  assert.equal(VectorFormulas.magnitude(500, 10).value, 50, 'magnitude(500, 10)')
  assert.equal(VectorFormulas.dims(3, 0).value, 3, 'dims(3, 0)')
  assert.equal(VectorFormulas.scale(5, 3).value, 15, 'scale(5, 3)')
  assert.equal(VectorFormulas.components(3, 1).value, 3, 'components(3, 1)')
  assert.equal(VectorFormulas.crossprod(3, 4, 1).value, 12, 'crossprod(3, 4, 1)')
  assert.equal(VectorFormulas.norm(100, 20).value, 80, 'norm(100, 20)')
  assert.equal(VectorFormulas.combos(6, 2).value, 15, 'combos(6, 2)')
  assert.equal(qpuHexFamiliesOf().get('vector')?.length, 8)
  for (const [name, params, expected] of [["dot",[3,4],12],["magnitude",[500,10],50],["dims",[3,0],3]] as [string, number[], number][]) {
    const uuid = qpuHexUuidOf({ family: 'vector', program: [name], params })
    const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
    assert.equal(Number(run.value), expected, `vector.${name} at ${uuid}`)
    qpuUuidReceiptOf(`vector ${name}`, qpuContentUuidOf(run), { uuid })
  }
  t.diagnostic('8 formulas; ' + "dot=12, magnitude=50, dims=3")
})
