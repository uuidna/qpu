// Every theorem the kernel accepted is a product of the catalogue of claims, and every product is claimed.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { THEOREMS } from './theorems-index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: no accepted theorem is left without a claim, and no claim is of a theorem the kernel lacks. */
test('no accepted theorem is left without a claim, and no claim is of a theorem the kernel lacks', () => {
  const [made, open = ''] = readFileSync('src/quantum/CATALOGUE.md', 'utf8').split('\n## Named and not yet proved\n')
  const sections = made!.split('\n### `').slice(1)
  const claimed = new Map(sections.map((section) => [section.slice(0, section.indexOf('`')), section]))
  // a name with a segment opening on _ is the compiler's own auxiliary lemma, never a product
  const kernel = new Set(THEOREMS.map((t) => t.key).filter((key) => !/(^|\.)_/.test(key)))
  assert.deepEqual([...kernel].filter((key) => !claimed.has(key)), [], 'an accepted theorem without a claim')
  assert.deepEqual([...claimed.keys()].filter((key) => !kernel.has(key)), [], 'a claim of a theorem the kernel lacks')
  assert.equal(claimed.size, sections.length, 'each product is listed once')
  assert.equal([...claimed.values()].every((section) => /\nClaimed (by|under) /.test(section)), true)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a theorem a sentence names and the kernel lacks is listed as a claim still open. */
test('a theorem a sentence names and the kernel lacks is listed as a claim still open', async () => {
  const { PROSE } = await import('./prose-index.ts')
  const kernel = new Set(THEOREMS.map((t) => t.key))
  const named = [...new Set(Object.values(PROSE).flatMap((text) => text.match(/\b(?:textbook|relation)_[a-z0-9_]*[a-z0-9]\b/g) ?? []))].filter((name) => !kernel.has(name)).sort()
  const open = readFileSync('src/quantum/CATALOGUE.md', 'utf8').split('\n## Named and not yet proved\n')[1] ?? ''
  const listed = [...open.matchAll(/^### `([^`]+)` \(open\)$/gm)].map((m) => m[1]!).sort()
  assert.deepEqual(listed, named)
  assert.ok(listed.length > 0)
})
