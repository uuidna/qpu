import { test } from 'node:test'
import assert from 'node:assert/strict'
import { THEOREMS } from './theorems-index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every theorem carries its statement as TeX written by Lean, and a formula names one statement. */
test('every theorem carries its statement as TeX written by Lean, and a formula names one statement', () => {
  const braces = (tex: string) => tex.replace(/\\[{}]/g, '')
  assert.deepEqual(THEOREMS.filter((t) => t.tex.length === 0 || /[^\x20-\x7e]/.test(t.tex) || braces(t.tex).split('{').length !== braces(t.tex).split('}').length).map((t) => t.key), [])
  assert.equal(new Set(THEOREMS.map((t) => t.tex)).size, new Set(THEOREMS.map((t) => t.statement)).size)
  assert.equal(THEOREMS.find((t) => t.key === 'textbook_entropy_fusion')?.tex, String.raw`\forall (f\ d : \mathbb{N}), f - d \le f`)
})
