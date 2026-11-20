// Every theorem the kernel accepted is a product of the catalogue of claims, and every product is claimed.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { THEOREMS } from './theorems-index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: no accepted theorem is left without a claim, and no claim is of a theorem the kernel lacks. */
test('no accepted theorem is left without a claim, and no claim is of a theorem the kernel lacks', () => {
  const sections = readFileSync('src/quantum/CATALOGUE.md', 'utf8').split('\n### `').slice(1)
  const claimed = new Map(sections.map((section) => [section.slice(0, section.indexOf('`')), section]))
  // a name with a segment opening on _ is the compiler's own auxiliary lemma, never a product
  const kernel = new Set(THEOREMS.map((t) => t.key).filter((key) => !/(^|\.)_/.test(key)))
  assert.deepEqual([...kernel].filter((key) => !claimed.has(key)), [], 'an accepted theorem without a claim')
  assert.deepEqual([...claimed.keys()].filter((key) => !kernel.has(key)), [], 'a claim of a theorem the kernel lacks')
  assert.equal(claimed.size, sections.length, 'each product is listed once')
  assert.equal([...claimed.values()].every((section) => /\nClaimed (by|under) /.test(section)), true)
})
