// Every theorem the kernel accepted is a product of the catalogue of claims, and every product is claimed.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { THEOREMS } from './theorems-index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: no accepted theorem is left without a claim, and no claim is of a theorem the kernel lacks. */
test('no accepted theorem is left without a claim, and no claim is of a theorem the kernel lacks', () => {
  const [made, open = ''] = readFileSync('src/quantum/CATALOGUE.md', 'utf8').split('\n## Named and not yet proved\n')
  const sections = made!.split('\n### `').slice(1)
  const claimed = new Map(sections.map((section) => [section.slice(0, section.indexOf('`')), section]))
  const kernel = new Set(THEOREMS.map((t) => t.key))
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

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every theorem a Lean source declares is in the kernel index and in the catalogue, private or not. */
test('every theorem a Lean source declares is in the kernel index and in the catalogue, private or not', () => {
  const root = 'src/quantum/processing/unit/lean/Qpu'
  const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? walk(join(dir, entry.name)) : entry.name.endsWith('.lean') ? [join(dir, entry.name)] : []))
  // the name each `theorem` keyword declares, with `private` in front or not; the namespace is not needed to find it
  const declared = walk(root).flatMap((file) => [...readFileSync(file, 'utf8').matchAll(/^[ \t]*(?:@\[[^\]]*\][ \t]*)?(?:private[ \t]+|protected[ \t]+)?theorem[ \t]+([^\s:({\[]+)/gm)].map((m) => ({ file, name: m[1]! })))
  assert.ok(declared.length > 1000)
  const indexed = THEOREMS.map((t) => t.key)
  const claimed = [...readFileSync('src/quantum/CATALOGUE.md', 'utf8').matchAll(/^### `([^`]+)`$/gm)].map((m) => m[1]!)
  const within = (keys: readonly string[]) => { const ends = new Set(keys.flatMap((key) => { const parts = key.split('.'); return parts.map((_, i) => parts.slice(i).join('.')) })); return (name: string) => ends.has(name) }
  const inIndex = within(indexed), inCatalogue = within(claimed)
  assert.deepEqual(declared.filter((d) => !inIndex(d.name)).map((d) => `${d.file}: ${d.name}`), [], 'declared in Lean and missing from the kernel index')
  assert.deepEqual(declared.filter((d) => !inCatalogue(d.name)).map((d) => `${d.file}: ${d.name}`), [], 'declared in Lean and missing from the catalogue of claims')
})
