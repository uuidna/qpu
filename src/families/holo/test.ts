import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { HoloFormulas } from './index.js'
import '../../mcp/families.js'

/** THE HOLOGRAM, AS FORMULAS. A fragment reaches the whole through one Merkle sibling per level, so a proof over n
 *  scales is ⌈log₂ n⌉ deep; and splicing a fragment needs a hash collision, so forgery is the birthday bound
 *  2^−(hashBits/2). Exact; crossing hologram → merkle and hologram → qsec. */
test('holo: the proof depth is ⌈log₂ scales⌉ and forgery is the birthday bound', async (t) => {
  assert.equal(HoloFormulas.proofDepth(14).value, 4, '14 scales (the faces) reach the root in 4 levels')
  assert.equal(HoloFormulas.proofDepth(8).value, 3)
  assert.equal(HoloFormulas.proofDepth(16).value, 4)
  assert.equal(HoloFormulas.proofDepth(1).value, 0, 'one scale is already the root')
  assert.equal(HoloFormulas.proofDepth(0).holds, false, 'a tree has at least one leaf')
  assert.equal(HoloFormulas.forgery(256).value, 2 ** -128, 'splicing needs a SHA-256 collision: 2^-128')
  assert.ok(HoloFormulas.forgery(256).value < 1e-38, 'and it is negligible')
  assert.equal(HoloFormulas.proofDepth(14).dst, 'merkle')
  assert.equal(HoloFormulas.forgery(256).dst, 'qsec')
  assert.equal(qpuHexFamiliesOf().get('holo')?.length, 2)
  for (const [name, params, expected] of [['proofDepth', [14], 4], ['proofDepth', [8], 3]] as [string, number[], number][]) {
    const uuid = qpuHexUuidOf({ family: 'holo', program: [name], params })
    const run = (await qpuHexRunOf(uuid)) as { value?: unknown; holds?: boolean }
    assert.equal(Number(run.value), expected, `holo.${name} at ${uuid}`)
    assert.equal(run.holds, true)
    qpuUuidReceiptOf(`holo ${name}`, qpuContentUuidOf(run), { uuid })
  }
  t.diagnostic('2 formulas; proofDepth(14) = 4 over the faces, forgery(256) = 2^-128; crossing to merkle and qsec')
})
