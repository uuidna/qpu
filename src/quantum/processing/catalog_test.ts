// The kernel as a catalog (catalog.ts): products, variants and orders in the ecommerce collections' own shapes, each document a receipt.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CATALOG_COLLECTIONS, CATALOG_RELATIONS, catalogDoc, catalogOrder, catalogProduct, catalogSeeds, catalogSummary, recognisePayload, seedCatalog, type CatalogDoc } from './catalog.ts'
import { CLAY_RELATIONS } from './clay-statements.ts'
import { EXAMPLES } from './examples.ts'
import { call } from './mcp.ts'
import { THEOREMS } from './theorems-index.ts'
import { THOUSAND_WALK } from './thousand-index.ts'
import { canonicalText, uuid } from '../uuid/index.ts'

const sealed = (d: CatalogDoc) => d.id === uuid(`${d.collection};${canonicalText(d.data)}`)

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every theorem is a product, every worked example from each of fourteen witnesses a variant, and what no hand wrote is claimed: each relation and each family formula has its example. */
test('every theorem is a product, every worked example from each of fourteen witnesses a variant, and what no hand wrote is claimed: each relation and each family formula has its example', () => {
  const s = catalogSummary(EXAMPLES)
  assert.deepEqual([s.products, s.witnesses, s.walked, s.collections.variantTypes, s.funding.price], [THEOREMS.length, 14, true, 2, 0])
  assert.equal(s.claimed + s.unclaimed.products, s.products)
  assert.equal(s.discovered, `${Math.floor((s.claimed * 100) / s.products)}%`)
  assert.equal(s.unclaimed.modules.reduce((n, m) => n + m.products, 0), s.unclaimed.products)
  assert.equal(s.variants % s.witnesses, 0)
  for (const r of CLAY_RELATIONS) assert.equal(catalogProduct(EXAMPLES, r.name).discovered, true, r.name)
  for (const f of THOUSAND_WALK.formulas) assert.equal(catalogProduct(EXAMPLES, f.binding!).examples.some((e) => e.example === `clay-walk-${f.name.toLowerCase()}`), true, f.name)
  // the door answers the same count
  assert.deepEqual(call('imagine', { catalog: true }).result!.structuredContent.receipt, s.receipt)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every document is a receipt whose id is the address of its collection and content, and a document names only documents of the collections before its own. */
test('every document is a receipt whose id is the address of its collection and content, and a document names only documents of the collections before its own', () => {
  const p = catalogProduct(EXAMPLES, 'textbook_clay_register_width')
  const docs = [p.product, ...p.variantTypes, ...p.witnesses, ...p.examples.map((e) => e.option), ...p.variants]
  assert.equal(docs.every(sealed), true)
  assert.equal(p.variants.length, p.examples.length * 14)
  assert.equal(new Set(p.variants.map((v) => v.id)).size, p.variants.length)
  const types = new Set(p.variantTypes.map((t) => t.id)), options = new Set([...p.witnesses, ...p.examples.map((e) => e.option)].map((o) => o.id))
  assert.deepEqual(p.product.data.variantTypes, p.variantTypes.map((t) => t.id))
  assert.equal([...p.witnesses, ...p.examples.map((e) => e.option)].every((o) => types.has(String(o.data.variantType))), true)
  assert.equal(p.variants.every((v) => v.data.product === p.product.id && (v.data.options as string[]).length === 2 && (v.data.options as string[]).every((o) => options.has(o))), true)
  assert.deepEqual([...CATALOG_COLLECTIONS], ['variantTypes', 'variantOptions', 'products', 'variants'])
  // a changed document is another receipt
  assert.notEqual(catalogDoc('products', { ...p.product.data, title: 'another' }).id, p.product.id)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a collection is served a page at a time as a find answers, the pages together being the collection once. */
test('a collection is served a page at a time as a find answers, the pages together being the collection once', () => {
  const s = catalogSummary(EXAMPLES)
  for (const collection of CATALOG_COLLECTIONS) assert.equal(catalogSeeds(EXAMPLES, collection, 1, 1).totalDocs, s.collections[collection], collection)
  const options: string[] = []
  for (let page = 1; ; page++) { const got = catalogSeeds(EXAMPLES, 'variantOptions', page, 100); options.push(...got.docs.map((d) => d.id)); assert.deepEqual([got.page, got.limit, got.hasPrevPage, got.prevPage], [page, 100, page > 1, page > 1 ? page - 1 : null]); if (!got.hasNextPage) { assert.equal(got.nextPage, null); break } }
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
  const variant = p.variants.find((v) => v.data.example === asked.example && v.data.witness === asked.witness)!
  assert.deepEqual(o.order.data.items, [{ product: p.product.id, variant: variant.id, quantity: 1 }])
  assert.deepEqual([o.use.variations, o.use.examples, o.use.witnesses, o.use.address], [p.variants.length, p.examples.length, 14, variant.data.address])
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
  const s = catalogSummary(few), seeded = await seedCatalog(sdk, few, 50)
  assert.deepEqual(seeded.created, s.collections)
  assert.equal(seeded.receipts, made.length)
  assert.deepEqual([...new Set(made.map((m) => m.collection))], [...CATALOG_COLLECTIONS])
  // no receipt is left where a relation stands: each names the number Payload gave, of a document created before it
  const at = (collection: string) => made.flatMap((m, i) => (m.collection === collection ? [i + 1] : []))
  const types = new Set(at('variantTypes')), options = new Set(at('variantOptions')), products = new Set(at('products'))
  assert.equal(made.filter((m) => m.collection === 'variantOptions').every((m) => types.has(m.data.variantType as number)), true)
  assert.equal(made.filter((m) => m.collection === 'products').every((m) => (m.data.variantTypes as number[]).every((id) => types.has(id))), true)
  assert.equal(made.filter((m) => m.collection === 'variants').every((m) => products.has(m.data.product as number) && (m.data.options as number[]).length === 2 && (m.data.options as number[]).every((id) => options.has(id))), true)
  assert.deepEqual(Object.keys(CATALOG_RELATIONS), [...CATALOG_COLLECTIONS])
  // this tree does not install Payload: its SDK does not resolve, so the site serves the catalog and no seeder runs
  assert.deepEqual(await recognisePayload(), { installed: false, sdk: null })
})
