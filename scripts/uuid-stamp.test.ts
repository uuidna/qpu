import test from 'node:test'
import assert from 'node:assert/strict'
import { uuidOfBytes } from '../src/core/crypt.js'
import { uuidV8Of } from '../src/families/holo/index.js'

// GOLDEN: captured from the stamps before they were consolidated, so the refactor is output-identical. Any change to
// these values is a change to every UUID the byte-level stamps mint, and must be a decided layout change, not a refactor.
const bytes = Uint8Array.from({ length: 32 }, (_, i) => (i * 37 + 11) & 0xff)
const ones = new Uint8Array(16).fill(0xff)

test('uuid stamp: version 4 from bytes is unchanged (RFC 9562 v4, RFC variant)', () => {
  assert.equal(uuidOfBytes(bytes), '0b30557a-9fc4-490e-b358-7da2c7ec1136')
  assert.equal(uuidOfBytes(ones), 'ffffffff-ffff-4fff-bfff-ffffffffffff')
})

test('uuid stamp: version 8 from bytes is unchanged (RFC 9562 v8, RFC variant)', () => {
  assert.equal(uuidV8Of(bytes), '0b30557a-9fc4-890e-b358-7da2c7ec1136')
  assert.equal(uuidV8Of(ones), 'ffffffff-ffff-8fff-bfff-ffffffffffff')
})
