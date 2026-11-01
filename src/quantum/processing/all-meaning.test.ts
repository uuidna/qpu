import test from 'node:test'
import assert from 'node:assert/strict'
import { compositionOf, compositionIndexOf } from './unit/blocks.ts'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'

// The real meaning of "all", found by textbook indexing, and tested as meaningful combinatorial use.

test('the real meaning of all is indexed in the textbook: use_completes, antimatter_total, code_folds, audit_all_pass', () => {
  // all is not a one-shot total: it is reached monotonically (use_completes), every gap has its antimatter so the way never dead-ends
  // (antimatter_total), each commit folds net <= 0 (code_folds), and all-pass is when no check fails (audit_all_pass).
  for (const key of ['textbook_use_completes', 'textbook_antimatter_total', 'textbook_code_folds', 'textbook_audit_all_pass'])
    assert.ok(TEXTBOOK_THEOREMS.some((t) => t.key === key), `${key} indexes a face of the meaning of "all"`)
})

test('all is meaningful combinatorial use: every one of the 432 a432 cells is a distinct, in-range, round-tripping address', () => {
  const radices = [2, 2, 2, 2, 3, 3, 3] // a432 = 2^4 · 3^3
  const count = radices.reduce((n, r) => n * r, 1)
  assert.equal(count, 432, 'the a432 space is 2^4 · 3^3 = 432 cells')
  const seen = new Set<string>()
  for (let i = 0; i < count; i++) {
    const digits = compositionOf(radices, BigInt(i))
    assert.equal(Number(compositionIndexOf(radices, digits)), i, `cell ${i} round-trips: its composition addresses it back (a meaningful use)`)
    assert.ok(digits.length === radices.length && digits.every((d, k) => d >= 0 && d < radices[k]!), `cell ${i} is in range at every position`)
    seen.add(digits.join(','))
  }
  // all of them, every combination distinct and addressable: the whole space is meaningful use, none wasted, none missing
  assert.equal(seen.size, count, 'all 432 combinations are distinct and addressable — "all" is the whole combinatorial space, meaningfully used')
})

test('all is combinatorial at any shape: every index round-trips across several radix spaces (the one primitive counts them all)', () => {
  for (const radices of [[2, 3, 4], [6, 7], [5, 5, 5], [16, 16]]) {
    const count = radices.reduce((n, r) => n * r, 1)
    for (let i = 0; i < count; i++) assert.equal(Number(compositionIndexOf(radices, compositionOf(radices, BigInt(i)))), i, `${radices.join('x')} cell ${i} round-trips`)
  }
})
