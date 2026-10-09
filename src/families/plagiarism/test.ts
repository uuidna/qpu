import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { chooseOf, qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuLatticeNamesOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { PlagiarismFormulas } from './index.js'
import '../../mcp/families.js'

test('plagiarism: plagiarism(a, b) = C(a, b) — the lattice pair, recomputed', async (t) => {
  const { faces, coins } = qpuLatticeNamesOf()
  const got = PlagiarismFormulas.plagiarism(faces, coins)
  assert.equal(got.value, chooseOf(faces, coins))
  assert.equal(got.value, 91)
  assert.equal(got.formula, 'plagiarism(a, b) = C(a, b)')
  assert.equal(got.holds, Number.isSafeInteger(faces) && faces >= 0 && Number.isSafeInteger(coins) && coins >= 0 && coins <= faces)
  assert.equal(got.dst, 'lattice')
  assert.equal(qpuHexFamiliesOf().get('plagiarism')?.length, 1)
  const uuid = qpuHexUuidOf({ family: 'plagiarism', program: ['plagiarism'], params: [faces, coins] })
  const run = (await qpuHexRunOf(uuid, undefined, undefined, { store: false })) as { value?: unknown; holds?: boolean }
  assert.equal(Number(run.value), got.value, `plagiarism.plagiarism at ${uuid}`)
  assert.equal(run.holds, got.holds)
  qpuUuidReceiptOf('plagiarism', qpuContentUuidOf(run), { uuid })
  t.diagnostic(`plagiarism(${faces}, ${coins}) = C(${faces}, ${coins}) = ${got.value}; holds ${run.holds}; ${uuid}`)
})
