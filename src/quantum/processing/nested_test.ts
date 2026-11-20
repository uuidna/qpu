// The nested catalogue is written by Lean and served over MCP: clause page, module page, theorem as product, textbook example as variant.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { call } from './mcp.ts'
import { EXAMPLES } from './examples.ts'
import { NESTED, NESTED_COUNTS } from './nested-index.ts'
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

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the mixes Lean counts are the pairs of textbooks, and every mix sums to the variations Lean counts. */
test('the mixes Lean counts are the pairs of textbooks, and every mix sums to the variations Lean counts', () => {
  const weight = (page: (typeof NESTED)[number]) => page.products.reduce((n, product) => n + Math.max(1, product.variants.length), 0)
  assert.equal(NESTED_COUNTS.textbooks, NESTED.length)
  assert.equal(NESTED_COUNTS.mixes, (NESTED.length * (NESTED.length - 1)) / 2)
  assert.equal(NESTED_COUNTS.variations, String(NESTED.reduce((n, page) => n + weight(page), 0)))
  let mixed = 0n
  for (let i = 0; i < NESTED.length; i++) for (let j = i + 1; j < NESTED.length; j++) mixed += BigInt(weight(NESTED[i]!)) * BigInt(weight(NESTED[j]!))
  assert.equal(NESTED_COUNTS.mixedVariations, mixed.toString())
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a mix lists every product of one textbook with every product of the other, each in its ISO and scientific context. */
test('a mix lists every product of one textbook with every product of the other, each in its ISO and scientific context', () => {
  const names = ['Qpu.Processing.Qft', 'Qpu.Application.Shor']
  const [a, b] = names.map((name) => NESTED.find((page) => page.module === name)!)
  const weight = (page: (typeof NESTED)[number]) => page.products.reduce((n, product) => n + Math.max(1, product.variants.length), 0)
  const first = call('textbook', { mix: names }).result!.structuredContent
  assert.equal(first.total, weight(a!) * weight(b!))
  const seen = new Set<string>()
  for (let page = 1; page <= first.pages; page++) {
    const answer = call('textbook', { mix: names, page }).result!.structuredContent
    for (const variation of answer.variations) {
      const [left, right] = variation.products
      assert.deepEqual([left.context, right.context], [{ iso: 'Processing', scientific: names[0] }, { iso: 'Application', scientific: names[1] }])
      seen.add(`${left.product}/${left.variant}|${right.product}/${right.variant}`)
    }
  }
  assert.equal(seen.size, first.total)
  assert.equal(call('textbook', { mix: [names[0]] }).result!.structuredContent.found, false)
  assert.equal(call('textbook', { mix: [names[0], names[0]] }).result!.structuredContent.found, false)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the trinities Lean counts are the triples of textbooks, and every trinity sums to the variations Lean counts. */
test('the trinities Lean counts are the triples of textbooks, and every trinity sums to the variations Lean counts', () => {
  const weight = (page: (typeof NESTED)[number]) => BigInt(page.products.reduce((n, product) => n + Math.max(1, product.variants.length), 0))
  const t = NESTED.length, weights = NESTED.map(weight)
  assert.equal(NESTED_COUNTS.trinities, (t * (t - 1) * (t - 2)) / 6)
  let triples = 0, total = 0n
  for (let i = 0; i < t; i++) for (let j = i + 1; j < t; j++) for (let k = j + 1; k < t; k++) { triples += 1; total += weights[i]! * weights[j]! * weights[k]! }
  assert.equal(NESTED_COUNTS.trinities, triples)
  assert.equal(NESTED_COUNTS.trinityVariations, total.toString())
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a trinity lists every product of each textbook with every product of the other two, each once. */
test('a trinity lists every product of each textbook with every product of the other two, each once', () => {
  const names = ['Qpu.Processing.Qft', 'Qpu.Application.Shor', 'Qpu.Application.Grover']
  const weight = (name: string) => NESTED.find((page) => page.module === name)!.products.reduce((n, product) => n + Math.max(1, product.variants.length), 0)
  const first = call('textbook', { mix: names }).result!.structuredContent
  assert.equal(first.trinity, true)
  assert.equal(first.total, names.reduce((n, name) => n * weight(name), 1))
  const seen = new Set<string>()
  for (let page = 1; page <= first.pages; page++) {
    for (const variation of call('textbook', { mix: names, page }).result!.structuredContent.variations) {
      assert.deepEqual(variation.products.map((p: { context: { scientific: string } }) => p.context.scientific), names)
      seen.add(variation.products.map((p: { product: string; variant: string | null }) => `${p.product}/${p.variant}`).join('|'))
    }
  }
  assert.equal(seen.size, first.total)
  assert.equal(call('textbook', { mix: [names[0], names[1], names[0]] }).result!.structuredContent.found, false)
  assert.equal(call('textbook', { mix: [...names, 'Qpu.General.Mint'] }).result!.structuredContent.found, false)
})
