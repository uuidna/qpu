// The nested catalogue is written by Lean and served over MCP: clause page, module page, theorem as product, textbook example as variant.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { call } from '../../../../../../../../3/8/5/9/0/2/0/f/index.ts'
import { EXAMPLES } from '../../../../../../../../9/d/4/f/e/4/4/2/index.ts'
import { NESTED, NESTED_COUNTS } from '../../../../../../../../1/8/a/3/8/3/8/c/index.ts'
import { TEXTBOOK_THEOREMS } from '../../../../../../../../3/4/7/e/0/c/e/0/index.ts'
import { THEOREMS } from '../../../../../../../../3/f/0/e/7/a/6/f/index.ts'

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

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a trinity is two pairs sharing one textbook, three for every three textbooks. */
test('a trinity is two pairs sharing one textbook, three for every three textbooks', () => {
  const t = NESTED.length
  // every pair of different pairs of textbooks that share exactly one textbook
  let formed = 0
  for (let shared = 0; shared < t; shared++) for (let a = 0; a < t; a++) for (let c = a + 1; c < t; c++) if (a !== shared && c !== shared) formed += 1
  assert.equal(NESTED_COUNTS.pairedTrinities, formed)
  assert.equal(NESTED_COUNTS.pairedTrinities, 3 * NESTED_COUNTS.trinities)
  assert.equal(NESTED_COUNTS.pairedVariations, (3n * BigInt(NESTED_COUNTS.trinityVariations)).toString())
  const names = ['Qpu.Processing.Qft', 'Qpu.Application.Shor', 'Qpu.Application.Grover']
  const answer = call('textbook', { mix: names }).result!.structuredContent
  assert.equal(answer.shared, names[1])
  assert.deepEqual(answer.pairs, [[names[0], names[1]], [names[1], names[2]]])
  // the shared textbook gives one product to both pairs: it appears once in each variation
  assert.equal(answer.variations.every((v: { products: { context: { scientific: string } }[] }) => v.products.filter((p) => p.context.scientific === names[1]).length === 1), true)
  assert.equal(call('textbook', { mix: names.slice(0, 2) }).result!.structuredContent.shared, undefined)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every variation carries a receipt that leads back to exactly its address, in one read for each textbook. */
test('every variation carries a receipt that leads back to exactly its address, in one read for each textbook', () => {
  const kernel = new Set(THEOREMS.map((t) => t.key))
  for (const names of [['Qpu.Processing.Qft', 'Qpu.Application.Shor'], ['Qpu.Processing.Qft', 'Qpu.Application.Shor', 'Qpu.Application.Grover']]) {
    const first = call('textbook', { mix: names }).result!.structuredContent
    assert.equal(first.advantage.reads, names.length)
    assert.equal(first.advantage.space, first.total)
    assert.ok(first.advantage.reads < first.advantage.space)
    assert.ok(2 ** first.advantage.reads <= first.advantage.space)
    assert.equal(first.advantage.theorems.every((name: string) => kernel.has(name)), true)
    const last = call('textbook', { mix: names, page: first.pages }).result!.structuredContent
    for (const variation of [...first.variations, ...last.variations]) {
      const { index, digits, reads, walk } = variation.receipt
      assert.deepEqual([index, reads, walk], [variation.index, names.length, variation.index + 1])
      // the digits rank back to the address: one multiplication and one addition for each textbook
      assert.equal(digits.reduce((at: number, digit: number, k: number) => at * first.advantage.sizes[k] + digit, 0), index)
      const checked = call('textbook', { mix: names, receipt: { index, digits } }).result!.structuredContent
      assert.equal(checked.holds, true)
      assert.deepEqual(checked.products, variation.products)
    }
    const { index, digits } = last.variations.at(-1).receipt
    assert.equal(call('textbook', { mix: names, receipt: { index: index - 1, digits } }).result!.structuredContent.holds, false)
    assert.equal(call('textbook', { mix: names, receipt: { index: first.total, digits } }).result!.structuredContent.holds, false)
    assert.equal(call('textbook', { mix: names, receipt: { index, digits: digits.slice(1) } }).result!.structuredContent.holds, false)
  }
})
