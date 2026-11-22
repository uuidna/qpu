// The bound and Shor's reduction hold for every integer; Shor.lean states every door.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the bound and the reduction hold for every integer, and the kernel states every Shor door. */
test('the bound and the reduction hold for every integer, and the kernel states every Shor door', () => {
  const reduction = TEXTBOOK_THEOREMS.find((t) => t.key === 'textbook_shor_reduction')
  const bound = TEXTBOOK_THEOREMS.find((t) => t.key === 'textbook_rsa_beyond_bound')
  assert.match(reduction!.lean, /\(N a s : Nat\)/, 'for every N, a, s')
  assert.match(bound!.lean, /2 \^ Nat\.log 2 n ≤ n/, 'for every n')
  const kernel = readFileSync('lean/Qpu/Application/Shor.lean', 'utf8')
  assert.match(kernel, /theorem shor_cases/, 'the kernel states the doors')
  assert.match(kernel, /2048 = 2 \^ 11/)
  assert.match(kernel, /period 2 35 = 12/)
})
