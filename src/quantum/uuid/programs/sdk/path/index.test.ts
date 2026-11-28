// ISO/IEC/IEEE 29119-3 test cases for trimTrailingSlashes.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { trimTrailingSlashes } from './index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: trailing slashes leave, every other character stays. */
test('trailing slashes leave, every other character stays', () => {
  assert.equal(trimTrailingSlashes('https://qpu.uuidna.com/'), 'https://qpu.uuidna.com')
  assert.equal(trimTrailingSlashes('https://qpu.uuidna.com///'), 'https://qpu.uuidna.com')
  assert.equal(trimTrailingSlashes('https://qpu.uuidna.com/api'), 'https://qpu.uuidna.com/api')
  assert.equal(trimTrailingSlashes('///'), '')
  assert.equal(trimTrailingSlashes(''), '')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a value of many slashes is trimmed in linear time. */
test('a value of many slashes is trimmed in linear time', () => {
  const t = performance.now()
  assert.equal(trimTrailingSlashes(`a${'/'.repeat(1_000_000)}`), 'a')
  assert.ok(performance.now() - t < 1000)
})
