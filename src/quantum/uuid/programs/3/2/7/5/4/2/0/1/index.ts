// The kernel as a catalog, in the shapes Payload's ecommerce plugin gives its default collections (products, variants, variantTypes,
// variantOptions, orders, transactions), configured from Lean (sdk-index.ts / Qpu.General.Config). A product is a theorem the kernel
// holds. A product carries three variant types: example, witness and entanglement. Witness variants pair each worked example with the
// fourteen witnesses of that example's address (witnesses.ts: six squares, eight triangles); entanglement variants encode every kernel
// proof dependency between theorems (THEOREMS.deps from Lean), and every variant carries an executable McpClientTool descriptor usable
// as a client MCP tool over /api/mcp or /api/computations. Pure: nothing is fetched and nothing is stored.
import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { THEOREMS } from '../../../../../../../f/0/e/7/a/6/f/index.ts'
import { TEXTBOOK_THEOREMS } from '../../../../../../../4/7/e/0/c/e/0/index.ts'
import { checkWitnesses, mergeWitnesses } from '../../../../../../../../d/7/8/3/e/4/6/3/index.ts'
import { listFactors } from '../../../../../../../../b/1/c/2/3/6/2/1/index.ts'
import { hexbitRegister } from '../../../../../../../../9/d/1/0/1/4/3/9/index.ts'
import { merkleTree } from '../../../../../../../../e/1/9/1/6/4/9/c/index.ts'
import { LICENSE } from '../../../../../../../../a/f/3/d/e/a/5/f/index.ts'
import { canonicalText, uuid } from '../../../../../../../../2/7/1/a/7/6/4/9/index.ts'
import type { Example } from '../../../../../../../../9/d/4/f/e/4/4/2/index.ts'
import {
  CATALOG_COLLECTIONS,
  CATALOG_RELATIONS,
  CATALOG_VARIANT_TYPES,
  PROVER_DUALITIES,
  SDK_API_PREFIX,
  type CatalogCollection,
  type CatalogDoc,
  type CatalogSdk,
  type CatalogVariantType,
  type McpClientTool,
  type PayloadPaginated,
  type PayloadRelationId,
  type ProverDuality,
  type ProductData,
  type VariantData,
  type VariantOptionData,
  type VariantTypeData,
} from '../../../../../../../../sdk/schema/index.ts'

export { CATALOG_COLLECTIONS, CATALOG_RELATIONS, CATALOG_VARIANT_TYPES, PROVER_DUALITIES }
export type { CatalogCollection, CatalogDoc, CatalogSdk, CatalogVariantType, McpClientTool, ProverDuality, ProductData, VariantData }

/** One document sealed: its id is the address of its collection and canonical data. */
export const catalogDoc = <C extends string, D extends Record<string, unknown>>(collection: C, data: D): CatalogDoc<C, D> => ({
  collection,
  id: uuid(`${collection};${canonicalText(data)}`),
  data,
})

const PUBLISHED = 'published' as const
/** The address of a worked example: the UUID of its tool and canonical arguments, the same call always the same address. */
const exampleAddress = (e: Example) => uuid(`${e.tool}${canonicalText(e.arguments)}`)
const faceOf = (w: { face: string; index: number }) => `${w.face}-${w.index}`
/** The examples a theorem's inline doc names, as Lean wrote them beside the statement. */
const namedIn = (doc: string | undefined): string[] => (/\(examples: ([^)]*)\)/.exec(doc ?? '')?.[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean)

type EntanglementEdge = { target: string; direction: 'uses' | 'usedBy' }
type Built = ReturnType<typeof build>
const built = new WeakMap<readonly Example[], Built>()

/** Map every declared theorem key to its linked worked example identifiers (one shared implementation). */
export const theoremExampleLinks = (examples: readonly { id: string; theorem?: string }[]): Map<string, Set<string>> => {
  const ids = new Set(examples.map((e) => e.id))
  const linked = new Map<string, Set<string>>()
  const link = (theorem: string, id: string) => { if (ids.has(id)) linked.set(theorem, (linked.get(theorem) ?? new Set()).add(id)) }
  for (const e of examples) if (e.theorem) link(e.theorem, e.id)
  for (const t of TEXTBOOK_THEOREMS) for (const id of t.examples) link(t.key, id)
  for (const t of THEOREMS) for (const id of namedIn(t.doc)) link(t.key, id)
  return linked
}

const build = (examples: readonly Example[]) => {
  const byId = new Map(examples.map((e) => [e.id, e]))
  const theoremKeys = new Set(THEOREMS.map((t) => t.key))
  const linked = theoremExampleLinks(examples)

  // kernel entanglement graph: directed uses (t.deps) and reverse usedBy across declared Qpu theorems
  const usesMap = new Map<string, string[]>()
  const usedByMap = new Map<string, string[]>()
  for (const t of THEOREMS) {
    const deps = (t.deps ?? []).filter((d) => d !== t.key && theoremKeys.has(d)).sort()
    usesMap.set(t.key, deps)
    for (const d of deps) {
      const list = usedByMap.get(d) ?? []
      list.push(t.key)
      usedByMap.set(d, list)
    }
  }
  for (const [, list] of usedByMap) list.sort()

  const types = Object.fromEntries(
    CATALOG_VARIANT_TYPES.map((name) => [name, catalogDoc('variantTypes', { name, label: name } satisfies VariantTypeData)]),
  ) as Record<CatalogVariantType, CatalogDoc<'variantTypes', VariantTypeData>>
  const faces = checkWitnesses(LICENSE.address).witnesses.map(faceOf)
  const option = (type: CatalogVariantType, value: string): CatalogDoc<'variantOptions', VariantOptionData> =>
    catalogDoc('variantOptions', { variantType: types[type].id, label: value, value })
  const witnessOptions = new Map(faces.map((face) => [face, option('witness', face)]))
  const used = [...new Set([...linked.values()].flatMap((ids) => [...ids]))].sort()
  const exampleOptions = new Map(used.map((id) => [id, option('example', id)]))
  const entangledTargets = [...new Set([...THEOREMS.flatMap((t) => [...(usesMap.get(t.key) ?? []), ...(usedByMap.get(t.key) ?? [])])])].sort()
  const entanglementOptions = new Map(entangledTargets.map((key) => [key, option('entanglement', key)]))
  const dualityOptions = new Map(PROVER_DUALITIES.map((pole) => [pole, option('duality', pole)]))

  // each example seen once: its address and its fourteen witnesses, every one mapping back
  const seen = new Map(used.map((id) => { const address = exampleAddress(byId.get(id)!), w = checkWitnesses(address); return [id, { address, exact: w.exact, witnesses: w.witnesses }] }))

  const entanglementsOf = (key: string): EntanglementEdge[] => [
    ...(usesMap.get(key) ?? []).map((target): EntanglementEdge => ({ target, direction: 'uses' })),
    ...(usedByMap.get(key) ?? []).map((target): EntanglementEdge => ({ target, direction: 'usedBy' })),
  ]
  const productByKey = new Map<string, CatalogDoc<'products', ProductData>>()
  const productById = new Map<string, (typeof THEOREMS)[number]>()
  for (const t of THEOREMS) {
    const p = catalogDoc('products', {
      title: t.key,
      enableVariants: true as const,
      variantTypes: CATALOG_VARIANT_TYPES.map((name) => types[name].id),
      _status: PUBLISHED,
      theorem: t.key,
      module: t.module,
      statement: t.statement,
      entanglementCount: entanglementsOf(t.key).length,
    } satisfies ProductData)
    productByKey.set(t.key, p)
    productById.set(p.id, t)
  }
  const product = (t: (typeof THEOREMS)[number]) => productByKey.get(t.key)!
  const rows = THEOREMS.map((t) => ({ theorem: t, examples: [...(linked.get(t.key) ?? [])].sort(), entanglements: entanglementsOf(t.key) }))
  return { byId, types, faces, witnessOptions, exampleOptions, entanglementOptions, dualityOptions, seen, product, productByKey, productById, rows }
}

const catalog = (examples: readonly Example[]): Built => { const had = built.get(examples); if (had) return had; const made = build(examples); built.set(examples, made); return made }

const witnessTool = (theorem: string, productId: string, example: Example, witness: string, address: string): McpClientTool => ({
  name: `qpu_${example.tool}_${address.slice(0, 8)}`,
  title: `${theorem} · ${example.id} · ${witness}`,
  description: `${example.tool} (${theorem}, ${witness})`,
  kind: 'witness',
  productId,
  theorem,
  inputSchema: { type: 'object', properties: { arguments: { type: 'object', default: example.arguments } } },
  annotations: { title: `${example.tool}:${example.id}`, readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  call: { method: 'tools/call', params: { name: example.tool, arguments: example.arguments as Record<string, unknown> } },
  rest: { method: 'POST', path: `${SDK_API_PREFIX}/computations`, body: { tool: example.tool, arguments: example.arguments as Record<string, unknown> } },
})

const entanglementTool = (theorem: string, productId: string, target: string, targetProductId: string, direction: 'uses' | 'usedBy', address: string): McpClientTool => ({
  name: `entangle_${direction}_${address.slice(0, 8)}`,
  title: `${theorem} ${direction} ${target}`,
  description: `${theorem} -> ${target} (${direction})`,
  kind: 'entanglement',
  productId,
  theorem,
  targetTheorem: target,
  targetProductId,
  direction,
  inputSchema: {
    type: 'object',
    properties: {
      source: { type: 'string', default: theorem },
      target: { type: 'string', default: target },
    },
  },
  annotations: { title: `${theorem}:${target}`, readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  call: { method: 'tools/call', params: { name: 'imagine', arguments: { catalog: { interact: { source: theorem, target } } } } },
  rest: { method: 'POST', path: `${SDK_API_PREFIX}/computations`, body: { source: theorem, target } },
})

const dualityCode = (module: string, theorem: string, pole: ProverDuality) =>
  pole === 'primal'
    ? `import ${module}\n#check @${theorem}`
    : `import ${module}\nexample : ¬(${theorem} = ${theorem}) := by exact False.elim`

const dualityTool = (theorem: string, module: string, productId: string, pole: ProverDuality, address: string): McpClientTool => {
  const verdict = pole === 'primal' ? 'accept' as const : 'reject' as const
  const code = dualityCode(module, theorem, pole)
  return {
    name: `duality_${pole}_${address.slice(0, 8)}`,
    title: `${theorem} · ${pole} (${verdict})`,
    description: `${pole} ${verdict} (${theorem})`,
    kind: 'duality',
    productId,
    theorem,
    duality: pole,
    proverVerdict: verdict,
    inputSchema: { type: 'object', properties: { code: { type: 'string', default: code } } },
    annotations: { title: `${pole}:${theorem}`, readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    call: { method: 'tools/call', params: { name: 'prove', arguments: { code } } },
    rest: { method: 'POST', path: `${SDK_API_PREFIX}/computations`, body: { tool: 'prove', arguments: { code } } },
  }
}

const variantsOf = (c: Built, row: Built['rows'][number]) => {
  const p = c.product(row.theorem)
  const witnessVariants: CatalogDoc<'variants', VariantData>[] = row.examples.flatMap((id) => {
    const ex = c.byId.get(id)!
    return c.seen.get(id)!.witnesses.map((w) => {
      const face = faceOf(w)
      return catalogDoc('variants', {
        title: `${row.theorem.key} ${id} ${face}`,
        kind: 'witness' as const,
        product: p.id,
        options: [c.exampleOptions.get(id)!.id, c.witnessOptions.get(face)!.id],
        _status: PUBLISHED,
        example: id,
        tool: ex.tool,
        witness: face,
        address: w.uuid,
        mcpTool: witnessTool(row.theorem.key, p.id, ex, face, w.uuid),
      } satisfies VariantData)
    })
  })
  const entanglementVariants: CatalogDoc<'variants', VariantData>[] = row.entanglements.map((edge) => {
    const targetProduct = c.productByKey.get(edge.target)!
    const address = uuid(canonicalText({ entanglement: [row.theorem.key, edge.target], direction: edge.direction, product: p.id, targetProduct: targetProduct.id }))
    return catalogDoc('variants', {
      title: `${row.theorem.key} ${edge.direction} ${edge.target}`,
      kind: 'entanglement' as const,
      product: p.id,
      options: [c.entanglementOptions.get(edge.target)!.id],
      _status: PUBLISHED,
      address,
      targetTheorem: edge.target,
      targetProduct: targetProduct.id,
      direction: edge.direction,
      mcpTool: entanglementTool(row.theorem.key, p.id, edge.target, targetProduct.id, edge.direction, address),
    } satisfies VariantData)
  })
  const dualityVariants: CatalogDoc<'variants', VariantData>[] = PROVER_DUALITIES.map((pole) => {
    const proverVerdict = pole === 'primal' ? 'accept' as const : 'reject' as const
    const proverCode = dualityCode(row.theorem.module, row.theorem.key, pole)
    const address = uuid(canonicalText({ duality: pole, theorem: row.theorem.key, product: p.id, proverVerdict }))
    return catalogDoc('variants', {
      title: `${row.theorem.key} ${pole}`,
      kind: 'duality' as const,
      product: p.id,
      options: [c.dualityOptions.get(pole)!.id],
      _status: PUBLISHED,
      address,
      duality: pole,
      proverVerdict,
      proverCode,
      mcpTool: dualityTool(row.theorem.key, row.theorem.module, p.id, pole, address),
    } satisfies VariantData)
  })
  return { product: p, witnessVariants, entanglementVariants, dualityVariants, variants: [...witnessVariants, ...entanglementVariants, ...dualityVariants] }
}

const withVariantId = (v: CatalogDoc<'variants', VariantData>): McpClientTool => ({ ...v.data.mcpTool, variantId: v.id })
const share = (part: number, whole: number) => `${whole ? Math.floor((part * 100) / whole) : 0}%`
const resolveRow = (c: Built, keyOrId: string) => {
  const byId = c.productById.get(keyOrId)
  const key = byId ? byId.key : keyOrId
  return c.rows.find((r) => r.theorem.key === key)
}

/** The catalog counted: every product, witness variants, kernel entanglement variants and client MCP tools. */
export const catalogSummary = (examples: readonly Example[]) => {
  const c = catalog(examples), claimed = c.rows.filter((r) => r.examples.length > 0), unclaimed = c.rows.filter((r) => r.examples.length === 0)
  const links = claimed.reduce((n, r) => n + r.examples.length, 0), faces = c.faces.length
  const witnessVariants = links * faces
  const entanglementVariants = c.rows.reduce((n, r) => n + r.entanglements.length, 0)
  const dualityVariants = c.rows.length * PROVER_DUALITIES.length
  const entangledProducts = c.rows.filter((r) => r.entanglements.length > 0).length
  const totalVariants = witnessVariants + entanglementVariants + dualityVariants
  const walked = [...c.seen.values()].every((s) => s.exact && s.witnesses.length === faces)
  const modules = Map.groupBy(unclaimed, (r) => r.theorem.module)
  const ids = c.rows.map((r) => c.product(r.theorem).id).sort()
  const merge = merkleTree({ leaves: ids.map((id) => id.replace(/-/g, '')), hex: true }) as { root: string }
  return {
    phase: 'catalog' as const,
    standard: '@payloadcms/plugin-ecommerce' as const,
    collections: {
      variantTypes: CATALOG_VARIANT_TYPES.length,
      variantOptions: faces + c.exampleOptions.size + c.entanglementOptions.size + c.dualityOptions.size,
      products: c.rows.length,
      variants: totalVariants,
    },
    products: c.rows.length,
    examples: c.exampleOptions.size,
    witnesses: faces,
    witnessVariants,
    entanglements: entanglementVariants,
    dualityVariants,
    entangledProducts,
    variants: totalVariants,
    mcpTools: totalVariants,
    walked,
    discovered: share(claimed.length, c.rows.length),
    claimed: claimed.length,
    unclaimed: { products: unclaimed.length, modules: [...modules].map(([module, rows]) => ({ module, products: rows.length })).sort((a, b) => b.products - a.products || (a.module < b.module ? -1 : 1)) },
    order: CATALOG_COLLECTIONS,
    receipt: { rfc: 6962 as const, root: merge.root, address: uuid(`catalog;${canonicalText({ rfc: 6962, root: merge.root, products: ids.length })}`) },
    funding: { by: 'public' as const, donation: LICENSE.donation, price: 0 },
    licence: LICENSE.spdx,
    theorems: ['textbook_cuboctahedron_faces', 'textbook_sigma_involution', 'textbook_prices_are_variants_times_currencies'] as const,
    says: proseFill(PROSE.quantumProcessingCatalog_says, c.rows.length, c.exampleOptions.size, faces, totalVariants, share(claimed.length, c.rows.length), unclaimed.length),
  }
}

/** One product in full: the theorem, its documents, witness variants, entanglement variants and client MCP tools. */
export const catalogProduct = (examples: readonly Example[], keyOrId: string) => {
  const c = catalog(examples), row = resolveRow(c, keyOrId)
  if (!row) throw new Error(`no theorem ${keyOrId}`)
  const { product, witnessVariants, entanglementVariants, dualityVariants, variants } = variantsOf(c, row)
  return {
    phase: 'product' as const,
    theorem: row.theorem.key,
    module: row.theorem.module,
    statement: row.theorem.statement,
    product,
    variantTypes: CATALOG_VARIANT_TYPES.map((name) => c.types[name]),
    examples: row.examples.map((id) => ({ example: id, tool: c.byId.get(id)!.tool, address: c.seen.get(id)!.address, option: c.exampleOptions.get(id)!, exact: c.seen.get(id)!.exact })),
    witnesses: c.faces.map((face) => c.witnessOptions.get(face)!),
    entanglements: entanglementVariants.map((v) => ({
      targetTheorem: v.data.targetTheorem!,
      targetProduct: v.data.targetProduct!,
      direction: v.data.direction!,
      option: c.entanglementOptions.get(v.data.targetTheorem!)!,
      variant: v,
      mcpTool: withVariantId(v),
    })),
    dualities: dualityVariants.map((v) => ({
      duality: v.data.duality!,
      proverVerdict: v.data.proverVerdict!,
      proverCode: v.data.proverCode!,
      option: c.dualityOptions.get(v.data.duality!)!,
      variant: v,
      mcpTool: withVariantId(v),
    })),
    witnessVariants,
    entanglementVariants,
    dualityVariants,
    variants,
    mcpTools: variants.map(withVariantId),
    discovered: row.examples.length > 0,
  }
}

/** Clay-driven prover duality catalog: clay_wings entangled across all Clay superpositions with primal/dual Lean prover variants. */
export const catalogClayDuality = (examples: readonly Example[]) => {
  const hub = catalogProduct(examples, 'clay_wings')
  const relations = hub.entanglements.map((edge) => {
    const rel = catalogProduct(examples, edge.targetTheorem)
    return {
      theorem: rel.theorem,
      product: rel.product.id,
      statement: rel.statement,
      primal: rel.dualities.find((d) => d.duality === 'primal')!.mcpTool,
      dual: rel.dualities.find((d) => d.duality === 'dual')!.mcpTool,
      entanglements: rel.entanglements.length,
    }
  })
  const receiptId = uuid(`clay-duality;${canonicalText({ hub: hub.product.id, relations: relations.map((r) => r.product) })}`)
  return {
    phase: 'clay-duality' as const,
    driver: hub.theorem,
    product: hub.product.id,
    superpositions: relations.length,
    dualityPoles: [...PROVER_DUALITIES],
    primal: hub.dualities.find((d) => d.duality === 'primal')!.mcpTool,
    dual: hub.dualities.find((d) => d.duality === 'dual')!.mcpTool,
    relations,
    receipt: { uuid: receiptId, handle: receiptId.slice(0, 8) },
    licence: LICENSE.spdx,
  }
}

const CLAY_1000_N = (1n << 999n) + 1n
let cachedClay1000Primes: { prime: bigint; exp: number }[] | undefined
const clay1000Primes = () => (cachedClay1000Primes ??= (() => {
  const { factors, verified } = listFactors(CLAY_1000_N, 1n)
  if (!verified || factors.reduce((a, b) => a * b, 1n) !== CLAY_1000_N) throw new Error('clay1000bit unverified')
  const counts = new Map<bigint, number>()
  for (const p of factors) counts.set(p, (counts.get(p) ?? 0) + 1)
  return [...counts.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([prime, exp]) => ({ prime, exp }))
})())

/** O(1) mixed-radix unrank of divisor index k across all 327,680 exact divisors of 2^999 + 1 into a sealed Clay product with 14 witness + 2 prover-duality variants. */
const clay1000ProductAt = (k: number, faces: readonly string[]) => {
  const primes = clay1000Primes()
  let rem = k
  let divisor = 1n
  const exponents: number[] = []
  for (const { prime, exp } of primes) {
    const radix = exp + 1
    const e = rem % radix
    rem = Math.floor(rem / radix)
    exponents.push(e)
    for (let i = 0; i < e; i++) divisor *= prime
  }
  const cofactor = CLAY_1000_N / divisor
  const witnessSum = divisor + cofactor
  const product = catalogDoc('products', {
    title: `clay1000:${k}`,
    enableVariants: true as const,
    variantTypes: [...CATALOG_VARIANT_TYPES],
    _status: PUBLISHED,
    index: k,
    divisor: divisor.toString(),
    cofactor: cofactor.toString(),
    witness: witnessSum.toString(),
    exponents,
    exact: divisor * cofactor === CLAY_1000_N,
    theorem: 'Polynomial.prod_cyclotomic_eq_X_pow_add_one',
  })
  const witnesses = checkWitnesses(product.id).witnesses
  const witnessVariants = witnesses.map((w, i) => ({
    kind: 'witness' as const,
    face: faces[i] ?? faceOf(w),
    address: w.uuid,
  }))
  const dualityVariants = PROVER_DUALITIES.map((pole) => ({
    kind: 'duality' as const,
    duality: pole,
    proverVerdict: pole === 'primal' ? 'accept' as const : 'reject' as const,
    address: uuid(canonicalText({ clay1000: k, product: product.id, duality: pole })),
  }))
  return {
    id: product.id,
    ...product.data,
    variants: [...witnessVariants, ...dualityVariants],
  }
}

/** Massive O(1)-unranked Clay 1000-bit factoring product & variant catalog from 2^999 + 1 (327,680 products; 5,242,880+ variants). */
export const catalogClay1000Bit = (page = 1, limit = 25) => {
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) throw new Error(`page ${page}, limit ${limit}`)
  const primes = clay1000Primes()
  const faces = checkWitnesses(LICENSE.address).witnesses.map(faceOf)
  const radices = primes.map((p) => p.exp + 1)
  const totalProducts = radices.reduce((a, b) => a * b, 1)
  const variantsPerProduct = faces.length + PROVER_DUALITIES.length
  const distinctPrimes = primes.length
  const bellPairs = (distinctPrimes * (distinctPrimes - 1)) / 2
  const ghzTrinities = (distinctPrimes * (distinctPrimes - 1) * (distinctPrimes - 2)) / 6
  const totalVariants = totalProducts * variantsPerProduct + bellPairs + ghzTrinities
  const from = (page - 1) * limit
  const to = Math.min(totalProducts, from + limit)
  const docs = []
  for (let k = from; k < to; k++) docs.push(clay1000ProductAt(k, faces))
  const totalPages = Math.ceil(totalProducts / limit)
  return {
    phase: 'clay-1000bit' as const,
    bits: CLAY_1000_N.toString(2).length,
    modulus: CLAY_1000_N.toString(),
    theorem: 'Polynomial.prod_cyclotomic_eq_X_pow_add_one' as const,
    distinctPrimes,
    radices,
    totalProducts,
    variantsPerProduct,
    bellPairs,
    ghzTrinities,
    totalVariants,
    primes: primes.map((p) => ({ prime: p.prime.toString(), exp: p.exp, bits: p.prime.toString(2).length })),
    docs,
    totalDocs: totalProducts,
    limit,
    totalPages,
    page,
    pagingCounter: from + 1,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
  }
}

/** Two theorems interacting through the product catalog: their entanglement variants, merged witnesses and client MCP tools. */
export const catalogInteract = (examples: readonly Example[], asked: { source?: unknown; target?: unknown }) => {
  const c = catalog(examples)
  const sourceRow = resolveRow(c, String(asked.source ?? ''))
  if (!sourceRow) throw new Error(`no theorem ${String(asked.source)}`)
  const targetRow = resolveRow(c, String(asked.target ?? ''))
  if (!targetRow) throw new Error(`no theorem ${String(asked.target)}`)
  const left = variantsOf(c, sourceRow), right = variantsOf(c, targetRow)
  const directVariants = [
    ...left.entanglementVariants.filter((v) => v.data.targetTheorem === targetRow.theorem.key),
    ...right.entanglementVariants.filter((v) => v.data.targetTheorem === sourceRow.theorem.key),
  ]
  const leftNeighbors = new Set(sourceRow.entanglements.map((e) => e.target))
  const bridge = [...new Set(targetRow.entanglements.map((e) => e.target).filter((k) => leftNeighbors.has(k)))].sort()
  const direct = directVariants.length > 0
  const entangled = direct || bridge.length > 0
  const direction = directVariants[0]?.data.direction ?? (bridge.length ? 'bridge' as const : null)
  const witnesses = mergeWitnesses(left.product.id, right.product.id)
  const mcpTools = [
    ...directVariants.map(withVariantId),
    ...left.witnessVariants.slice(0, 1).map(withVariantId),
    ...right.witnessVariants.slice(0, 1).map(withVariantId),
  ]
  const receiptId = uuid(`interact;${canonicalText({ source: left.product.id, target: right.product.id, direct: directVariants.map((v) => v.id), bridge })}`)
  return {
    phase: 'interact' as const,
    entangled,
    direct,
    direction,
    bridge,
    receipt: { uuid: receiptId, handle: receiptId.slice(0, 8) },
    source: { theorem: sourceRow.theorem.key, module: sourceRow.theorem.module, product: left.product.id, examples: sourceRow.examples },
    target: { theorem: targetRow.theorem.key, module: targetRow.theorem.module, product: right.product.id, examples: targetRow.examples },
    variants: directVariants,
    witnesses,
    mcpTools,
    licence: LICENSE.spdx,
    theorems: ['textbook_cuboctahedron_faces', 'textbook_sigma_involution'] as const,
  }
}

/** Product and entanglement variants packaged as paginated client MCP tool definitions. */
export const catalogMcpTools = (examples: readonly Example[], productKeyOrId?: string, page = 1, limit = 100): PayloadPaginated<McpClientTool & Record<string, unknown>> => {
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) throw new Error(`page ${page}, limit ${limit}`)
  if (productKeyOrId) {
    const p = catalogProduct(examples, productKeyOrId)
    const from = (page - 1) * limit
    const slice = p.mcpTools.slice(from, from + limit).map((t) => ({ id: t.variantId!, ...t }))
    const totalDocs = p.mcpTools.length, totalPages = Math.ceil(totalDocs / limit)
    return { docs: slice, totalDocs, limit, totalPages, page, pagingCounter: from + 1, hasPrevPage: page > 1, hasNextPage: page < totalPages, prevPage: page > 1 ? page - 1 : null, nextPage: page < totalPages ? page + 1 : null }
  }
  const paged = catalogSeeds(examples, 'variants', page, limit)
  const docs = paged.docs.map((v) => {
    const tool = (v as unknown as VariantData).mcpTool
    return { id: v.id, ...tool, variantId: v.id }
  })
  return { ...paged, docs }
}

/** The documents of one collection, a page of them, as a seeder creates them and a site serves them. */
export const catalogSeeds = (examples: readonly Example[], collection: string, page = 1, limit = 100) => {
  const c = catalog(examples)
  if (!(CATALOG_COLLECTIONS as readonly string[]).includes(collection)) throw new Error(`collection: ${CATALOG_COLLECTIONS.join(', ')}`)
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) throw new Error(`page ${page}, limit ${limit}`)
  const from = (page - 1) * limit
  const all = (): CatalogDoc[] => collection === 'variantTypes'
    ? CATALOG_VARIANT_TYPES.map((name) => c.types[name])
    : collection === 'variantOptions'
      ? [...c.witnessOptions.values(), ...c.exampleOptions.values(), ...c.entanglementOptions.values(), ...c.dualityOptions.values()]
      : []
  // products and variants are built for the page asked alone
  const docs = collection === 'products'
    ? c.rows.slice(from, from + limit).map((r) => c.product(r.theorem))
    : collection === 'variants'
      ? (() => {
        const out: CatalogDoc[] = []
        let at = 0
        for (const r of c.rows) {
          const n = r.examples.length * c.faces.length + r.entanglements.length + PROVER_DUALITIES.length
          if (at + n > from && out.length < limit) out.push(...variantsOf(c, r).variants.slice(Math.max(0, from - at), Math.max(0, from - at) + limit - out.length))
          at += n
          if (out.length >= limit) break
        }
        return out
      })()
      : all().slice(from, from + limit)
  const totalDocs = collection === 'products'
    ? c.rows.length
    : collection === 'variants'
      ? c.rows.reduce((n, r) => n + r.examples.length * c.faces.length + r.entanglements.length + PROVER_DUALITIES.length, 0)
      : all().length
  const totalPages = Math.ceil(totalDocs / limit)
  // the page as Payload's REST API answers a find
  return { phase: 'seeds' as const, collection: collection as CatalogCollection, docs: docs.map((d) => ({ id: d.id, ...d.data })), totalDocs, limit, totalPages, page, pagingCounter: from + 1, hasPrevPage: page > 1, hasNextPage: page < totalPages, prevPage: page > 1 ? page - 1 : null, nextPage: page < totalPages ? page + 1 : null }
}

/** A variant ordered: the order and its transaction as the plugin's collections hold them, at no price to the client, and what the receipt opens. */
export const catalogOrder = (examples: readonly Example[], asked: { product?: unknown; example?: unknown; witness?: unknown; entanglement?: unknown; duality?: unknown }) => {
  const c = catalog(examples), row = resolveRow(c, String(asked.product ?? ''))
  if (!row) throw new Error(`no theorem ${String(asked.product)}`)
  const { product, witnessVariants, entanglementVariants, dualityVariants, variants } = variantsOf(c, row)
  const variant = typeof asked.duality === 'string'
    ? dualityVariants.find((v) => v.data.duality === asked.duality)
    : typeof asked.entanglement === 'string'
      ? entanglementVariants.find((v) => v.data.targetTheorem === asked.entanglement)
      : witnessVariants.find((v) => v.data.example === asked.example && v.data.witness === asked.witness)
  if (!variant) {
    if (typeof asked.duality === 'string') throw new Error(`duality: ${PROVER_DUALITIES.join(', ')}`)
    if (typeof asked.entanglement === 'string') throw new Error(`no entanglement ${asked.entanglement}`)
    throw new Error(!row.examples.length ? `${row.theorem.key}: no example` : row.examples.includes(String(asked.example)) ? `witness: ${c.faces.join(', ')}` : `example: ${row.examples.join(', ')}`)
  }
  const items = [{ product: product.id, variant: variant.id, quantity: 1 }]
  const transaction = catalogDoc('transactions', { items, status: 'succeeded', amount: 0 })
  const order = catalogDoc('orders', { items, transactions: [transaction.id], status: 'completed', amount: 0 })
  const register = hexbitRegister(), address = String(variant.data.address)
  // what the receipt opens: every worked example and entanglement MCP tool of the theorem on the register
  const calls = row.examples.map((id) => ({ example: id, tool: c.byId.get(id)!.tool, arguments: c.byId.get(id)!.arguments, witnesses: c.seen.get(id)!.witnesses.map((w) => w.uuid) }))
  return {
    phase: 'order' as const,
    order,
    transaction,
    receipt: { uuid: order.id, handle: order.id.slice(0, 8) },
    price: 0,
    funding: { by: 'public' as const, donation: LICENSE.donation },
    use: {
      theorem: row.theorem.key,
      statement: row.theorem.statement,
      product: product.id,
      variant: variant.id,
      address,
      examples: row.examples.length,
      witnesses: c.faces.length,
      entanglements: entanglementVariants.length,
      dualities: dualityVariants.length,
      variations: variants.length,
      calls,
      mcpTools: variants.map(withVariantId),
      register: { qubits: register.effective, digits: register.digits, combination: register.organised.combination, fingerprint: register.organised.fingerprint },
    },
    licence: LICENSE.spdx,
    theorems: ['textbook_cuboctahedron_faces', 'textbook_sigma_involution', 'textbook_hexbit_gateway_ftl'] as const,
    says: proseFill(PROSE.quantumProcessingCatalog_order, row.theorem.key, String(asked.entanglement ?? asked.example), String(asked.witness ?? variant.data.direction ?? ''), variants.length, row.examples.length, c.faces.length, register.effective),
  }
}

/** The catalog created where Payload is installed, in the collections its ecommerce plugin owns: each collection in order and a page at a time, and
 *  where a document names another by its receipt, the id Payload gave that other one is handed on in its place. */
export const seedCatalog = async (sdk: CatalogSdk, examples: readonly Example[], limit = 100) => {
  const given = new Map<string, PayloadRelationId>(), created: Record<string, number> = {}
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
