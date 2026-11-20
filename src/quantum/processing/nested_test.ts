// The nested catalogue is written by Lean and served over MCP: clause page, module page, theorem as product, textbook example as variant.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { call } from './mcp.ts'
import { EXAMPLES } from './examples.ts'
import { NESTED } from './nested-index.ts'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'
import { THEOREMS } from './theorems-index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every page nests under its clause and every product is a theorem the kernel accepted. */
test('every page nests under its clause and every product is a theorem the kernel accepted', () => {
  const all = call('textbook', { nested: true }).result!.structuredContent
  const kernel = new Set(THEOREMS.map((t) => t.key))
  assert.equal(all.phase, 'nested')
  assert.equal(all.pages.length, NESTED.length)
  assert.equal(all.pages.every((p: { parent: string }) => all.clauses.some((c: { slug: string }) => c.slug === p.parent)), true)
  assert.equal(NESTED.every((page) => page.module.split('.')[1] === page.clause && page.products.every((product) => kernel.has(product.theorem))), true)
  assert.equal(all.productCount, NESTED.reduce((n, p) => n + p.products.length, 0))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a textbook theorem is a product and its examples are its variants, each with the call that runs it. */
test('a textbook theorem is a product and its examples are its variants, each with the call that runs it', () => {
  const page = call('textbook', { nested: 'Qpu.General.Textbook' }).result!.structuredContent
  assert.equal(page.found, true)
  assert.equal(page.page.parent, 'general')
  assert.equal(page.products.length, TEXTBOOK_THEOREMS.length)
  for (const theorem of TEXTBOOK_THEOREMS) {
    const product = page.products.find((p: { title: string }) => p.title === theorem.key)
    assert.deepEqual(product.variants.map((v: { title: string }) => v.title), theorem.examples, theorem.key)
  }
  const known = new Set(EXAMPLES.map((e) => e.id))
  const variants = page.products.flatMap((p: { variants: { title: string; call: unknown }[] }) => p.variants)
  assert.equal(variants.every((v: { title: string; call: unknown }) => (v.call !== null) === known.has(v.title)), true)
  assert.equal(call('textbook', { nested: 'Qpu.Nope' }).result!.structuredContent.found, false)
})
