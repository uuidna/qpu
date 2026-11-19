// The five-bit comparison stays a theorem. It is not a register ceiling: Shor.lean states every door, including moduli past 21.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the five-bit comparison is a theorem, and the kernel states every Shor door. */
test('the five-bit comparison is a theorem, and the kernel states every Shor door', () => {
  const reduction = TEXTBOOK_THEOREMS.find((t) => t.key === 'textbook_shor_reduction')
  const bound = TEXTBOOK_THEOREMS.find((t) => t.key === 'textbook_rsa_beyond_bound')
  assert.ok(reduction, 'textbook_shor_reduction is defined')
  assert.ok(bound, 'textbook_rsa_beyond_bound is defined')
  assert.match(reduction!.lean, /by decide/, 'the reduction theorem closes by decide')
  assert.match(bound!.lean, /2 \^ 4 < 21 ∧ 21 < 2 \^ 5/, 'the comparison states that 21 sits between 16 and 32')
  assert.match(bound!.lean, /by decide/, 'the comparison closes by decide')
  const kernel = readFileSync('src/quantum/processing/unit/lean/Qpu/Shor.lean', 'utf8')
  assert.match(kernel, /theorem shor_cases/, 'the kernel states the doors')
  assert.match(kernel, /2048 = 2 \^ 11/)
  assert.match(kernel, /period 2 35 = 12/)
})
