import test from 'node:test'
import assert from 'node:assert/strict'
import { MersenneTwister, numpyWeights, randomInt } from './random.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the Mersenne Twister with numpy's seed 11 gives numpy's randint(0, 500) draws, first twelve. */
test('the Mersenne Twister with numpy\'s seed 11 gives numpy\'s randint(0, 500) draws, first twelve', () => {
  const rng = new MersenneTwister(11)
  const draws = Array.from({ length: 12 }, () => randomInt(rng, 0, 500))
  assert.deepEqual(draws, [409, 191, 80, 91, 337, 439, 269, 332, 161, 71, 338, 280])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the QAOA weights are numpy's draws divided by 100, two decimals in [0, 5). */
test('the QAOA weights are numpy\'s draws divided by 100, two decimals in [0, 5)', () => {
  const weights = numpyWeights(15)
  assert.equal(weights[0], 4.09)
  assert.equal(weights[1], 1.91)
  for (const w of weights) {
    assert.ok(w >= 0 && w < 5)
    assert.ok(Math.abs(w * 100 - Math.round(w * 100)) < 1e-9)
  }
})
