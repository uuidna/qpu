// The kernel as a catalog, in the shapes Payload's ecommerce plugin gives its default collections (products, variants, variantTypes,
// variantOptions, orders, transactions). A product is a theorem the kernel holds. A product has two variant types, example and witness, and a
// variant is one worked example of the theorem seen from one of the fourteen witnesses of that example's address (witnesses.ts: six squares,
// eight triangles). Every document is a receipt: its id is the UUID of its collection and canonical data, so the same document has the same
// id wherever it is built, and a relation names the other document by that id. A site with no Payload serves the documents as they stand; one
// where Payload is installed creates them through its SDK, collection by collection in the order given, each id handed on to the next.
// Ordering a variant costs the client nothing: the work is funded by the public through the licence table's donation link. The order is one
// more receipt, and it opens every variation of use of the product: each worked example as a call, from each witness, on the register of the
// address ordered. Pure: nothing is fetched and nothing is stored.
import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { THEOREMS } from '../../../../../../../f/0/e/7/a/6/f/index.ts'
import { TEXTBOOK_THEOREMS } from '../../../../../../../4/7/e/0/c/e/0/index.ts'
import { checkWitnesses } from '../../../../../../../../d/7/8/3/e/4/6/3/index.ts'
import { hexbitRegister } from '../../../../../../../../9/d/1/0/1/4/3/9/index.ts'
import { merkleTree } from '../../../../../../../../e/1/9/1/6/4/9/c/index.ts'
import { LICENSE } from '../../../../../../../../a/f/3/d/e/a/5/f/index.ts'
import { canonicalText, uuid, handleOf } from '../../../../../../../../2/7/1/a/7/6/4/9/index.ts'
import type { Example } from '../../../../../../../../9/d/4/f/e/4/4/2/index.ts'

export type CatalogDoc = { collection: string; id: string; data: Record<string, unknown> }
/** One document sealed: its id is the address of its collection and canonical data. */
export const catalogDoc = (collection: string, data: Record<string, unknown>): CatalogDoc => ({ collection, id: uuid(`${collection};${canonicalText(data)}`), data })
/** The collections in the order a seeder creates them: a document names only documents of the collections before its own. */
export const CATALOG_COLLECTIONS = ['variantTypes', 'variantOptions', 'products', 'variants'] as const
const TYPES = ['example', 'witness'] as const
const PUBLISHED = 'published'
/** The address of a worked example: the UUID of its tool and canonical arguments, the same call always the same address. */
const exampleAddress = (e: Example) => uuid(`${e.tool}${canonicalText(e.arguments)}`)
const faceOf = (w: { face: string; index: number }) => `${w.face}-${w.index}`
/** The examples a theorem's inline doc names, as Lean wrote them beside the statement. */
const namedIn = (doc: string | undefined): string[] => (/\(examples: ([^)]*)\)/.exec(doc ?? '')?.[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean)

type Built = ReturnType<typeof build>
const built = new WeakMap<readonly Example[], Built>()
const build = (examples: readonly Example[]) => {
  const byId = new Map(examples.map((e) => [e.id, e]))
  // a theorem's examples: the worked examples that name it, and those its own doc or the textbook names
  const linked = new Map<string, Set<string>>()
  const link = (theorem: string, id: string) => { if (byId.has(id)) linked.set(theorem, (linked.get(theorem) ?? new Set()).add(id)) }
  for (const e of examples) if (e.theorem) link(e.theorem, e.id)
  for (const t of TEXTBOOK_THEOREMS) for (const id of t.examples) link(t.key, id)
  for (const t of THEOREMS) for (const id of namedIn((t as { doc?: string }).doc)) link(t.key, id)
  const types = Object.fromEntries(TYPES.map((name) => [name, catalogDoc('variantTypes', { name, label: name })])) as Record<(typeof TYPES)[number], CatalogDoc>
  const faces = checkWitnesses(LICENSE.address).witnesses.map(faceOf)
  const option = (type: (typeof TYPES)[number], value: string) => catalogDoc('variantOptions', { variantType: types[type].id, label: value, value })
  const witnessOptions = new Map(faces.map((face) => [face, option('witness', face)]))
  const used = [...new Set([...linked.values()].flatMap((ids) => [...ids]))].sort()
  const exampleOptions = new Map(used.map((id) => [id, option('example', id)]))
  // each example seen once: its address and its fourteen witnesses, every one mapping back
  const seen = new Map(used.map((id) => { const address = exampleAddress(byId.get(id)!), w = checkWitnesses(address); return [id, { address, exact: w.exact, witnesses: w.witnesses }] }))
  const product = (t: (typeof THEOREMS)[number]) => catalogDoc('products', { title: t.key, enableVariants: true, variantTypes: TYPES.map((name) => types[name].id), _status: PUBLISHED, theorem: t.key, module: t.module, statement: t.statement })
  const rows = THEOREMS.map((t) => ({ theorem: t, examples: [...(linked.get(t.key) ?? [])].sort() }))
  return { byId, types, faces, witnessOptions, exampleOptions, seen, product, rows }
}
const catalog = (examples: readonly Example[]): Built => { const had = built.get(examples); if (had) return had; const made = build(examples); built.set(examples, made); return made }
const variantsOf = (c: Built, row: Built['rows'][number]) => { const p = c.product(row.theorem); return { product: p, variants: row.examples.flatMap((id) => c.seen.get(id)!.witnesses.map((w) => catalogDoc('variants', { title: `${row.theorem.key} ${id} ${faceOf(w)}`, product: p.id, options: [c.exampleOptions.get(id)!.id, c.witnessOptions.get(faceOf(w))!.id], _status: PUBLISHED, example: id, tool: c.byId.get(id)!.tool, witness: faceOf(w), address: w.uuid }))) } }
const share = (part: number, whole: number) => `${whole ? Math.floor((part * 100) / whole) : 0}%`

/** The catalog counted: every product, the variants its examples and their witnesses make, what is walked and what is discovered. */
export const catalogSummary = (examples: readonly Example[]) => {
  const c = catalog(examples), claimed = c.rows.filter((r) => r.examples.length > 0), unclaimed = c.rows.filter((r) => r.examples.length === 0)
  const links = claimed.reduce((n, r) => n + r.examples.length, 0), faces = c.faces.length
  const walked = [...c.seen.values()].every((s) => s.exact && s.witnesses.length === faces)
  const modules = Map.groupBy(unclaimed, (r) => r.theorem.module)
  const ids = c.rows.map((r) => c.product(r.theorem).id).sort()
  const merge = merkleTree({ leaves: ids.map((id) => id.replace(/-/g, '')), hex: true }) as { root: string }
  return {
    phase: 'catalog' as const, standard: '@payloadcms/plugin-ecommerce' as const, collections: { variantTypes: TYPES.length, variantOptions: faces + c.exampleOptions.size, products: c.rows.length, variants: links * faces },
    products: c.rows.length, examples: c.exampleOptions.size, witnesses: faces, variants: links * faces, walked, discovered: share(claimed.length, c.rows.length), claimed: claimed.length,
    unclaimed: { products: unclaimed.length, modules: [...modules].map(([module, rows]) => ({ module, products: rows.length })).sort((a, b) => b.products - a.products || (a.module < b.module ? -1 : 1)) },
    order: CATALOG_COLLECTIONS, receipt: { rfc: 6962 as const, root: merge.root, address: uuid(`catalog;${canonicalText({ rfc: 6962, root: merge.root, products: ids.length })}`) },
    funding: { by: 'public' as const, donation: LICENSE.donation, price: 0 }, licence: LICENSE.spdx,
    theorems: ['textbook_cuboctahedron_faces', 'textbook_sigma_involution', 'textbook_prices_are_variants_times_currencies'] as const,
    says: proseFill(PROSE.quantumProcessingCatalog_says, c.rows.length, c.exampleOptions.size, faces, links * faces, share(claimed.length, c.rows.length), unclaimed.length),
  }
}
/** One product in full: the theorem, its documents, and every variant, an example from a witness. */
export const catalogProduct = (examples: readonly Example[], key: string) => {
  const c = catalog(examples), row = c.rows.find((r) => r.theorem.key === key)
  if (!row) throw new Error(`no theorem ${key}`)
  const { product, variants } = variantsOf(c, row)
  return { phase: 'product' as const, theorem: row.theorem.key, module: row.theorem.module, statement: row.theorem.statement, product, variantTypes: TYPES.map((name) => c.types[name]), examples: row.examples.map((id) => ({ example: id, tool: c.byId.get(id)!.tool, address: c.seen.get(id)!.address, option: c.exampleOptions.get(id)!, exact: c.seen.get(id)!.exact })), witnesses: c.faces.map((face) => c.witnessOptions.get(face)!), variants, discovered: row.examples.length > 0 }
}
/** The documents of one collection, a page of them, as a seeder creates them and a site serves them. */
export const catalogSeeds = (examples: readonly Example[], collection: string, page = 1, limit = 100) => {
  const c = catalog(examples)
  if (!(CATALOG_COLLECTIONS as readonly string[]).includes(collection)) throw new Error(`collection is one of ${CATALOG_COLLECTIONS.join(', ')}`)
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) throw new Error(`page ${page}, limit ${limit}: positive integers`)
  const from = (page - 1) * limit
  const all = (): CatalogDoc[] => collection === 'variantTypes' ? TYPES.map((name) => c.types[name]) : collection === 'variantOptions' ? [...c.witnessOptions.values(), ...c.exampleOptions.values()] : []
  // products and variants are built for the page asked alone
  const docs = collection === 'products' ? c.rows.slice(from, from + limit).map((r) => c.product(r.theorem)) : collection === 'variants' ? (() => { const out: CatalogDoc[] = []; let at = 0; for (const r of c.rows) { const n = r.examples.length * c.faces.length; if (at + n > from && out.length < limit) out.push(...variantsOf(c, r).variants.slice(Math.max(0, from - at), Math.max(0, from - at) + limit - out.length)); at += n; if (out.length >= limit) break } return out })() : all().slice(from, from + limit)
  const totalDocs = collection === 'products' ? c.rows.length : collection === 'variants' ? c.rows.reduce((n, r) => n + r.examples.length, 0) * c.faces.length : all().length
  const totalPages = Math.ceil(totalDocs / limit)
  // the page as Payload's REST API answers a find
  return { phase: 'seeds' as const, collection, docs: docs.map((d) => ({ id: d.id, ...d.data })), totalDocs, limit, totalPages, page, pagingCounter: from + 1, hasPrevPage: page > 1, hasNextPage: page < totalPages, prevPage: page > 1 ? page - 1 : null, nextPage: page < totalPages ? page + 1 : null }
}
/** A variant ordered: the order and its transaction as the plugin's collections hold them, at no price to the client, and what the receipt opens. */
export const catalogOrder = (examples: readonly Example[], asked: { product?: unknown; example?: unknown; witness?: unknown }) => {
  const c = catalog(examples), row = c.rows.find((r) => r.theorem.key === asked.product)
  if (!row) throw new Error(`no theorem ${String(asked.product)}`)
  const { product, variants } = variantsOf(c, row)
  const variant = variants.find((v) => v.data.example === asked.example && v.data.witness === asked.witness)
  if (!variant) throw new Error(!row.examples.length ? `${row.theorem.key} has no example yet` : row.examples.includes(String(asked.example)) ? `witness is one of ${c.faces.join(', ')}` : `example is one of ${row.examples.join(', ')}`)
  const items = [{ product: product.id, variant: variant.id, quantity: 1 }]
  const transaction = catalogDoc('transactions', { items, status: 'succeeded', amount: 0 })
  const order = catalogDoc('orders', { items, transactions: [transaction.id], status: 'completed', amount: 0 })
  const register = hexbitRegister(), address = String(variant.data.address)
  // what the receipt opens: every worked example of the theorem as a call, from every witness, on the register of the address ordered
  const calls = row.examples.map((id) => ({ example: id, tool: c.byId.get(id)!.tool, arguments: c.byId.get(id)!.arguments, witnesses: c.seen.get(id)!.witnesses.map((w) => w.uuid) }))
  return {
    phase: 'order' as const, order, transaction, receipt: { uuid: order.id, handle: handleOf(order.id) }, price: 0, funding: { by: 'public' as const, donation: LICENSE.donation },
    use: { theorem: row.theorem.key, statement: row.theorem.statement, product: product.id, variant: variant.id, address, examples: row.examples.length, witnesses: c.faces.length, variations: variants.length, calls, register: { qubits: register.effective, digits: register.digits, combination: register.organised.combination, fingerprint: register.organised.fingerprint } },
    licence: LICENSE.spdx, theorems: ['textbook_cuboctahedron_faces', 'textbook_sigma_involution', 'textbook_hexbit_gateway_ftl'] as const,
    says: proseFill(PROSE.quantumProcessingCatalog_order, row.theorem.key, String(asked.example), String(asked.witness), variants.length, row.examples.length, c.faces.length, register.effective),
  }
}

/** The fields of each collection that name another document by its receipt. */
export const CATALOG_RELATIONS: Record<(typeof CATALOG_COLLECTIONS)[number], readonly string[]> = { variantTypes: [], variantOptions: ['variantType'], products: ['variantTypes'], variants: ['product', 'options'] }
/** What a seeder needs of Payload: the create its SDK and its local API both have, answering the created document. */
export type CatalogSdk = { create: (args: { collection: string; data: Record<string, unknown> }) => Promise<{ id: string | number }> }
/** The catalog created where Payload is installed, in the collections its ecommerce plugin owns: each collection in order and a page at a time, and
 *  where a document names another by its receipt, the id Payload gave that other one is handed on in its place. */
export const seedCatalog = async (sdk: CatalogSdk, examples: readonly Example[], limit = 100) => {
  const given = new Map<string, string | number>(), created: Record<string, number> = {}
  const handed = (v: unknown): unknown => (Array.isArray(v) ? v.map(handed) : typeof v === 'string' && given.has(v) ? given.get(v) : v)
  for (const collection of CATALOG_COLLECTIONS) for (let page = 1; ; page++) {
    const found = catalogSeeds(examples, collection, page, limit)
    for (const { id, ...data } of found.docs) {
      const made = await sdk.create({ collection, data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, CATALOG_RELATIONS[collection].includes(k) ? handed(v) : v])) })
      given.set(id, made.id); created[collection] = (created[collection] ?? 0) + 1
    }
    if (!found.hasNextPage) break
  }
  return { phase: 'seeded' as const, created, receipts: given.size }
}
/** Payload recognised as installed: its SDK resolves from this tree. Where it does not, the site serves the catalog as it stands. */
export const recognisePayload = async (): Promise<{ installed: boolean; sdk: ((baseURL: string) => CatalogSdk) | null }> => {
  const name = '@payloadcms/sdk'
  try { const { PayloadSDK } = await import(name) as { PayloadSDK: new (o: { baseURL: string }) => CatalogSdk }; return { installed: true, sdk: (baseURL) => new PayloadSDK({ baseURL }) } } catch { return { installed: false, sdk: null } }
}
