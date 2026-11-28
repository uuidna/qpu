// The kernel as a catalog (catalog.ts): products, witness variants, theorem entanglement variants and client MCP tools in Payload ecommerce shapes, each document a receipt.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  CATALOG_COLLECTIONS,
  CATALOG_RELATIONS,
  CATALOG_VARIANT_TYPES,
  catalogDoc,
  catalogInteract,
  catalogMcpTools,
  catalogOrder,
  catalogProduct,
  catalogSeeds,
  catalogSummary,
  recognisePayload,
  seedCatalog,
  type CatalogDoc,
} from './index.ts'
import { CLAY_RELATIONS } from '../../../../../../../../1/f/2/7/c/5/1/c/index.ts'
import { EXAMPLES } from '../../../../../../../../9/d/4/f/e/4/4/2/index.ts'
import { call } from '../../../../../../../8/5/9/0/2/0/f/index.ts'
import { THEOREMS } from '../../../../../../../f/0/e/7/a/6/f/index.ts'
import { THOUSAND_WALK } from '../../../../../../../../6/6/3/7/3/f/6/6/index.ts'
import { evaluateKernel, kernelBindingFor, kernelStatement } from '../../../../../../../../2/4/6/5/f/6/3/f/index.ts'
import { canonicalText, uuid } from '../../../../../../../../2/7/1/a/7/6/4/9/index.ts'

const sealed = (d: CatalogDoc) => d.id === uuid(`${d.collection};${canonicalText(d.data)}`)

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every theorem is a product, every worked example from each of fourteen witnesses and every kernel entanglement is a variant usable as a client MCP tool. */
test('every theorem is a product, every worked example from each of fourteen witnesses and every kernel entanglement is a variant usable as a client MCP tool', () => {
  const s = catalogSummary(EXAMPLES)
  assert.deepEqual([s.products, s.witnesses, s.walked, s.collections.variantTypes, s.funding.price], [THEOREMS.length, 14, true, 4, 0])
  assert.deepEqual([...CATALOG_VARIANT_TYPES], ['example', 'witness', 'entanglement', 'duality'])
  assert.equal(s.claimed + s.unclaimed.products, s.products)
  assert.equal(s.discovered, `${Math.floor((s.claimed * 100) / s.products)}%`)
  assert.equal(s.unclaimed.modules.reduce((n, m) => n + m.products, 0), s.unclaimed.products)
  assert.equal(s.witnessVariants % s.witnesses, 0)
  assert.equal(s.dualityVariants, s.products * 2)
  assert.equal(s.variants, s.witnessVariants + s.entanglements + s.dualityVariants)
  assert.equal(s.mcpTools, s.variants)
  assert.ok(s.entanglements > 0)
  assert.ok(s.entangledProducts > 0)
  for (const r of CLAY_RELATIONS) assert.equal(catalogProduct(EXAMPLES, r.name).discovered, true, r.name)
  for (const f of THOUSAND_WALK.formulas) assert.equal(catalogProduct(EXAMPLES, f.binding!).examples.some((e) => e.example === `clay-walk-${f.name.toLowerCase()}`), true, f.name)
  // the door answers the same count
  assert.deepEqual(call('imagine', { catalog: true }).result!.structuredContent.receipt, s.receipt)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every document is a receipt whose id is the address of its collection and content, and a document names only documents of the collections before its own. */
test('every document is a receipt whose id is the address of its collection and content, and a document names only documents of the collections before its own', () => {
  const p = catalogProduct(EXAMPLES, 'textbook_clay_register_width')
  const docs = [p.product, ...p.variantTypes, ...p.witnesses, ...p.examples.map((e) => e.option), ...p.entanglements.map((e) => e.option), ...p.dualities.map((d) => d.option), ...p.variants]
  assert.equal(docs.every(sealed), true)
  assert.equal(p.witnessVariants.length, p.examples.length * 14)
  assert.equal(p.dualityVariants.length, 2)
  assert.equal(p.variants.length, p.witnessVariants.length + p.entanglementVariants.length + p.dualityVariants.length)
  assert.equal(p.mcpTools.length, p.variants.length)
  assert.equal(new Set(p.variants.map((v) => v.id)).size, p.variants.length)
  const types = new Set(p.variantTypes.map((t) => t.id))
  const options = new Set([...p.witnesses, ...p.examples.map((e) => e.option), ...p.entanglements.map((e) => e.option), ...p.dualities.map((d) => d.option)].map((o) => o.id))
  assert.deepEqual(p.product.data.variantTypes, p.variantTypes.map((t) => t.id))
  assert.equal([...p.witnesses, ...p.examples.map((e) => e.option), ...p.entanglements.map((e) => e.option), ...p.dualities.map((d) => d.option)].every((o) => types.has(String(o.data.variantType))), true)
  assert.equal(p.witnessVariants.every((v) => v.data.product === p.product.id && v.data.options.length === 2 && v.data.options.every((o) => options.has(o)) && Boolean(v.data.mcpTool.name)), true)
  assert.equal(p.entanglementVariants.every((v) => v.data.product === p.product.id && v.data.options.length === 1 && v.data.options.every((o) => options.has(o)) && Boolean(v.data.targetProduct) && Boolean(v.data.mcpTool.name)), true)
  assert.deepEqual([...CATALOG_COLLECTIONS], ['variantTypes', 'variantOptions', 'products', 'variants'])
  // a changed document is another receipt
  assert.notEqual(catalogDoc('products', { ...p.product.data, title: 'another' }).id, p.product.id)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: theorems interact through the product catalog via kernel entanglement variants usable as client MCP tools. */
test('theorems interact through the product catalog via kernel entanglement variants usable as client MCP tools', () => {
  const source = 'Advantage.advantage_unbounded'
  const target = 'Advantage.two_pow_le_space'
  const p = catalogProduct(EXAMPLES, source)
  const ent = p.entanglements.find((e) => e.targetTheorem === target)
  assert.ok(ent, 'expected kernel entanglement Advantage.advantage_unbounded -> Advantage.two_pow_le_space')
  assert.equal(ent.direction, 'uses')
  assert.equal(ent.mcpTool.kind, 'entanglement')
  assert.equal(ent.mcpTool.call.method, 'tools/call')
  assert.equal(ent.mcpTool.call.params.name, 'imagine')
  assert.equal(ent.mcpTool.rest.path, '/api/computations')

  const interacted = catalogInteract(EXAMPLES, { source, target })
  assert.equal(interacted.phase, 'interact')
  assert.equal(interacted.entangled, true)
  assert.equal(interacted.direct, true)
  assert.equal(interacted.source.theorem, source)
  assert.equal(interacted.target.theorem, target)
  assert.ok(interacted.variants.length >= 2)
  assert.ok(interacted.mcpTools.length >= 2)
  // the MCP tool call on the entanglement variant replays the exact same interaction receipt over imagine
  const replayed = call(ent.mcpTool.call.params.name, ent.mcpTool.call.params.arguments)
  assert.equal(replayed.result!.structuredContent.receipt.uuid, interacted.receipt.uuid)

  // ordering an entanglement variant returns a free receipt and exposes all variant MCP tools
  const ordered = catalogOrder(EXAMPLES, { product: source, entanglement: target })
  assert.equal(ordered.price, 0)
  assert.equal(ordered.use.variant, ent.variant.id)
  assert.ok(ordered.use.mcpTools.some((t) => t.variantId === ent.variant.id))

  // catalogMcpTools packages variants for one product and paginated across the catalog
  const forProduct = catalogMcpTools(EXAMPLES, source)
  assert.equal(forProduct.totalDocs, p.mcpTools.length)
  assert.ok(forProduct.docs.some((t) => t.name === ent.mcpTool.name))
  const viaDoor = call('imagine', { catalog: { tools: source } })
  assert.equal(viaDoor.result!.structuredContent.totalDocs, p.mcpTools.length)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a collection is served a page at a time as a find answers, the pages together being the collection once. */
test('a collection is served a page at a time as a find answers, the pages together being the collection once', () => {
  const s = catalogSummary(EXAMPLES)
  for (const collection of CATALOG_COLLECTIONS) assert.equal(catalogSeeds(EXAMPLES, collection, 1, 1).totalDocs, s.collections[collection], collection)
  const options: string[] = []
  for (let page = 1; ; page++) {
    const got = catalogSeeds(EXAMPLES, 'variantOptions', page, 100)
    options.push(...got.docs.map((d) => d.id))
    assert.deepEqual([got.page, got.limit, got.hasPrevPage, got.prevPage], [page, 100, page > 1, page > 1 ? page - 1 : null])
    if (!got.hasNextPage) { assert.equal(got.nextPage, null); break }
  }
  assert.deepEqual([options.length, new Set(options).size], [s.collections.variantOptions, s.collections.variantOptions])
  // two pages of variants follow one another, and each variant names a product of the catalog
  const first = catalogSeeds(EXAMPLES, 'variants', 1, 20), second = catalogSeeds(EXAMPLES, 'variants', 2, 20), both = catalogSeeds(EXAMPLES, 'variants', 1, 40)
  assert.deepEqual([...first.docs, ...second.docs].map((d) => d.id), both.docs.map((d) => d.id))
  assert.deepEqual([first.docs.length, first.pagingCounter, second.pagingCounter, first.totalPages], [20, 1, 21, Math.ceil(s.variants / 20)])
  assert.throws(() => catalogSeeds(EXAMPLES, 'orders'))
  assert.throws(() => catalogSeeds(EXAMPLES, 'products', 0))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a variant ordered costs nothing, its order is one receipt, and the receipt opens every variation of the product; a variant the catalog does not hold is refused. */
test('a variant ordered costs nothing, its order is one receipt, and the receipt opens every variation of the product; a variant the catalog does not hold is refused', () => {
  const asked = { product: 'textbook_clay_register_width', example: 'clay-walk', witness: 'triangle-7' }
  const o = catalogOrder(EXAMPLES, asked), p = catalogProduct(EXAMPLES, asked.product)
  assert.deepEqual([o.price, o.funding.by, o.order.data.status, o.transaction.data.status, o.order.data.amount, o.transaction.data.amount], [0, 'public', 'completed', 'succeeded', 0, 0])
  assert.equal(sealed(o.order) && sealed(o.transaction), true)
  assert.deepEqual([o.receipt.uuid, o.order.data.transactions], [o.order.id, [o.transaction.id]])
  const variant = p.witnessVariants.find((v) => v.data.example === asked.example && v.data.witness === asked.witness)!
  assert.deepEqual(o.order.data.items, [{ product: p.product.id, variant: variant.id, quantity: 1 }])
  assert.deepEqual([o.use.variations, o.use.examples, o.use.witnesses, o.use.entanglements, o.use.address], [p.variants.length, p.examples.length, 14, p.entanglementVariants.length, variant.data.address])
  assert.deepEqual(o.use.calls.map((c) => c.example), p.examples.map((e) => e.example))
  assert.equal(o.use.calls.every((c) => c.witnesses.length === 14), true)
  // the same order is the same receipt, another witness another one
  assert.equal(catalogOrder(EXAMPLES, asked).order.id, o.order.id)
  assert.notEqual(catalogOrder(EXAMPLES, { ...asked, witness: 'square-1' }).order.id, o.order.id)
  assert.throws(() => catalogOrder(EXAMPLES, { ...asked, witness: 'square-7' }))
  assert.throws(() => catalogOrder(EXAMPLES, { ...asked, product: 'no_such_theorem' }))
  // no detail of a person is in an order
  assert.deepEqual(Object.keys(o.order.data).sort(), ['amount', 'items', 'status', 'transactions'])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: where Payload is installed the catalog is created collection by collection, each receipt handed on as the id Payload gave; where it is not, it is recognised as absent and nothing is created. */
test('where Payload is installed the catalog is created collection by collection, each receipt handed on as the id Payload gave; where it is not, it is recognised as absent and nothing is created', async () => {
  // a stand-in for Payload's create: every document is given the next number as its id, as a database does
  const made: { collection: string; data: Record<string, unknown> }[] = []
  const sdk = { create: async (args: { collection: string; data: Record<string, unknown> }) => { made.push(args); return { id: made.length } } }
  const few = EXAMPLES.filter((e) => e.theorem === 'textbook_clay_register_width')
  const s = catalogSummary(few), seeded = await seedCatalog(sdk, few, 100)
  assert.deepEqual(seeded.created, s.collections)
  assert.equal(seeded.receipts, made.length)
  assert.deepEqual([...new Set(made.map((m) => m.collection))], [...CATALOG_COLLECTIONS])
  // no receipt is left where a relation stands: each names the number Payload gave, of a document created before it
  const at = (collection: string) => made.flatMap((m, i) => (m.collection === collection ? [i + 1] : []))
  const types = new Set(at('variantTypes')), options = new Set(at('variantOptions')), products = new Set(at('products'))
  assert.equal(made.filter((m) => m.collection === 'variantOptions').every((m) => types.has(m.data.variantType as number)), true)
  assert.equal(made.filter((m) => m.collection === 'products').every((m) => (m.data.variantTypes as number[]).every((id) => types.has(id))), true)
  assert.equal(
    made.filter((m) => m.collection === 'variants').every((m) =>
      products.has(m.data.product as number) &&
      (m.data.options as number[]).length >= 1 &&
      (m.data.options as number[]).every((id) => options.has(id)) &&
      (m.data.targetProduct === undefined || products.has(m.data.targetProduct as number)),
    ),
    true,
  )
  assert.deepEqual(Object.keys(CATALOG_RELATIONS), [...CATALOG_COLLECTIONS])
  // this tree does not install Payload: its SDK does not resolve, so the site serves the catalog and no seeder runs
  assert.deepEqual(await recognisePayload(), { installed: false, sdk: null })
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a theorem of the kernel stated over the naturals is evaluated from the statement Lean printed, at values that meet its premises, none the kernel holds evaluates false, and each one bound has its example. */
test('a theorem of the kernel stated over the naturals is evaluated from the statement Lean printed, at values that meet its premises, none the kernel holds evaluates false, and each one bound has its example', () => {
  assert.deepEqual(kernelStatement('∀ c < 6 * 7, c % (6 * 7) = c'), { variables: ['c'], premises: ['v0 < 6 * 7'], conclusion: 'v0 % (6 * 7) = v0' })
  assert.deepEqual(kernelStatement('∀ (g₁ Δ : ℕ), g₁ ≤ Δ → Δ - g₁ + g₁ = Δ'), { variables: ['g₁', 'Δ'], premises: ['v0 ≤ v1'], conclusion: 'v1 - v0 + v0 = v1' })
  assert.equal(kernelStatement('∀ (s : Finset ℕ), s.card = s.card'), null)
  const closed = evaluateKernel('Qpu.Harmonic.merkaba_frames_agree')
  assert.deepEqual([closed.evaluable, 'premises' in closed && closed.premises, 'holds' in closed && closed.holds], [true, true, true])
  // a premise that fails holds the theorem vacuously; the binding found meets it
  const outside = evaluateKernel('Qpu.Harmonic.merkaba_cells_covered', { c: 50 }), found = kernelBindingFor('Qpu.Harmonic.merkaba_cells_covered')!
  assert.deepEqual(['premises' in outside && outside.premises, 'holds' in outside && outside.holds], [false, true])
  const inside = evaluateKernel('Qpu.Harmonic.merkaba_cells_covered', found)
  assert.deepEqual(['premises' in inside && inside.premises, 'holds' in inside && inside.holds], [true, true])
  // the clay register's own port agrees with the kernel wherever a premise holds, at every small value of up to two naturals
  let checked = 0
  for (const t of THEOREMS) {
    const s = kernelStatement(t.statement)
    if (!s || s.variables.length > 2) continue
    for (const c of s.variables.reduce<number[][]>((acc) => acc.flatMap((x) => [0, 1, 2, 3, 7].map((n) => [...x, n])), [[]])) {
      const values: Record<string, number> = Object.fromEntries(s.variables.map((v, i) => [v, c[i]!]))
      const r = evaluateKernel(t.key, values)
      if (r.evaluable && 'premises' in r && r.premises === true) { assert.equal(r.holds, true, `${t.key} at ${JSON.stringify(values)}`); checked += 1 }
    }
  }
  assert.ok(checked > 1000, `${checked} evaluations compared with the kernel`)
  // each theorem the evaluator binds has a variant in the catalog, and the door computes it
  const unbound = THEOREMS.filter((t) => kernelBindingFor(t.key) && !catalogProduct(EXAMPLES, t.key).discovered).map((t) => t.key)
  assert.deepEqual(unbound, [])
  const door = call('textbook', { evaluate: { theorem: 'mint_eq_two_pow', values: { k: 10 } } }).result!.structuredContent
  assert.deepEqual([door.holds, door.conclusion.parts[0].left, door.conclusion.parts[0].right], [true, '1024', '1024'])
})
