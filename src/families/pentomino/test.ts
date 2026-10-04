import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { PentominoFormulas } from './index.js'
import '../../mcp/families.js'

test('pentomino: pieces, cells, orientations, placementcombos, tilingsubsets, symmetryorderings, boardarea, coverage — crossing to combinatorics', async (t) => {
  assert.equal(PentominoFormulas.pieces(12, 0).value, 12)
  assert.equal(PentominoFormulas.cells(12, 5).value, 60)
  assert.equal(PentominoFormulas.orientations(12, 8).value, 96)
  assert.equal(PentominoFormulas.placementcombos(12, 3).value, 220)
  assert.equal(PentominoFormulas.tilingsubsets(6).value, 64)
  assert.equal(PentominoFormulas.symmetryorderings(4).value, 24)
  assert.equal(PentominoFormulas.boardarea(6, 10).value, 60)
  assert.equal(PentominoFormulas.coverage(100, 100).value, 100)
  assert.equal(PentominoFormulas.pieces(12, 0).dst, 'combinatorics')
  assert.equal(qpuHexFamiliesOf().get('pentomino')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'pentomino', program: ['pieces'], params: [12, 0] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 12, `pentomino.pieces at ${uuid}`)
  qpuUuidReceiptOf('pentomino pieces', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; pieces 12, cells 60, orientations 96, placementcombos 220, tilingsubsets 64, symmetryorderings 24, boardarea 60, coverage 100; crossing to combinatorics')
})
