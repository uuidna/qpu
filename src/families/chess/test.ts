import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { ChessFormulas } from './index.js'
import '../../mcp/families.js'

test('chess: material, mobility, branching, plytonodes, tempo, centipawns, perft, kingsafety — crossing to combinatorics', async (t) => {
  assert.equal(ChessFormulas.material(2, 5).value, 10, 'two rooks')
  assert.equal(ChessFormulas.mobility(40, 33).value, 7, 'the move advantage')
  assert.equal(ChessFormulas.branching(350, 10).value, 35, 'average legal moves')
  assert.equal(ChessFormulas.plytonodes(2, 3).value, 15, '1 + 2 + 4 + 8')
  assert.equal(ChessFormulas.tempo(15, 2).value, 7)
  assert.equal(ChessFormulas.centipawns(3, 50).value, 350, 'three and a half pawns')
  assert.equal(ChessFormulas.perft(5, 3).value, 125, 'leaves of a uniform tree')
  assert.equal(ChessFormulas.kingsafety(4, 2).value, 2)
  assert.equal(ChessFormulas.material(2, 5).dst, 'combinatorics')
  assert.equal(qpuHexFamiliesOf().get('chess')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'chess', program: ['perft'], params: [5, 3] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 125, `chess.perft at ${uuid}`)
  qpuUuidReceiptOf('chess perft', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; material 10, mobility 7, branching 35, plytonodes 15, tempo 7, centipawns 350, perft 125, kingsafety 2; crossing to combinatorics')
})
