import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { CombinatoricsFormulas } from './index.js'
import '../../mcp/families.js'

test('combinatorics: factorial, permutations, combinations, stars, derangement, catalan, multichoose, binomial — crossing to statistics', async (t) => {
  assert.equal(CombinatoricsFormulas.factorial(5).value, 120, 'five items in order')
  assert.equal(CombinatoricsFormulas.permutations(6, 2).value, 30)
  assert.equal(CombinatoricsFormulas.combinations(6, 2).value, 15, 'two chosen from six')
  assert.equal(CombinatoricsFormulas.stars(5, 3).value, 21)
  assert.equal(CombinatoricsFormulas.derangement(5).value, 44, 'no one in their own seat')
  assert.equal(CombinatoricsFormulas.catalan(4).value, 14)
  assert.equal(CombinatoricsFormulas.multichoose(3, 2).value, 6, 'multisets of size two')
  assert.equal(CombinatoricsFormulas.binomial(4).value, 16)
  assert.equal(CombinatoricsFormulas.combinations(6, 2).dst, 'statistics')
  assert.equal(qpuHexFamiliesOf().get('combinatorics')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'combinatorics', program: ['combinations'], params: [6, 2] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 15, `combinatorics.combinations at ${uuid}`)
  qpuUuidReceiptOf('combinatorics combinations', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; factorial 120, permutations 30, combinations 15, stars 21, derangement 44, catalan 14, multichoose 6, binomial 16; crossing to statistics')
})
