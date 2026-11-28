// @payloadcms/plugin-seo attached to @payloadcms/plugin-ecommerce (and any target) as MCP: whatever SEO is attached to IS the toolbox.
import { CATALOG_COLLECTIONS, catalogSeeds } from '../3/2/7/5/4/2/0/1/index.ts'
import { canonicalText, optimise, seal, uuid } from '../2/7/1/a/7/6/4/9/index.ts'
import { hex, sha256, utf8 } from '../9/e/8/6/7/0/6/8/index.ts'
import { LICENSE } from '../a/f/3/d/e/a/5/f/index.ts'
import { THEOREMS } from '../3/f/0/e/7/a/6/f/index.ts'
import { ISO_CLAUSES, ISO_STANDARDS } from '../b/4/2/5/4/0/d/7/index.ts'
import { SDK_API_PREFIX, SDK_VOCABULARY } from '../sdk/schema/index.ts'
import type { Example } from '../9/d/4/f/e/4/4/2/index.ts'

export type SeoItem = {
  id: string
  title: string
  description: string
  path: string
  schemaType?: string
  keywords?: readonly string[]
  price?: number
  currency?: string
}

export type SeoAttachment = {
  target: string
  source: '@payloadcms/plugin-ecommerce' | 'payload' | 'custom'
  items: readonly SeoItem[]
}

export type SeoMeta = {
  title: string
  description: string
  image: string
  canonical: string
  keywords: readonly string[]
  robots: string
  og: { title: string; description: string; url: string; type: string; image: string }
  jsonLd: Record<string, unknown>
  optimised: { kept: string; place: number; seam: number; greatest: boolean; formula: string; theorem: 'textbook_hue_shift' }
  score: number
  checks: { titleLength: boolean; descriptionLength: boolean; canonical: boolean; imageSealed: boolean; greatestSeam: boolean; jsonLd: boolean }
}

export type SeoMcpTool = {
  name: string
  title: string
  description: string
  toolbox: string
  attachedTo: string
  plugin: '@payloadcms/plugin-seo'
  inputSchema: Record<string, unknown>
  annotations: { title: string; readOnlyHint: true; idempotentHint: true; openWorldHint: false }
  call: { method: 'tools/call'; params: { name: 'imagine'; arguments: { catalog: { seo: { target: string; tool: string } } } } }
  rest: { method: 'GET'; path: string }
}

export type SeoToolbox = {
  phase: 'seo-toolbox'
  plugin: '@payloadcms/plugin-seo'
  source: SeoAttachment['source']
  toolbox: string
  attachedTo: string
  fields: readonly ['title', 'description', 'image']
  tools: readonly SeoMcpTool[]
  records: readonly { id: string; path: string; meta: SeoMeta }[]
  audit: {
    total: number
    optimised: number
    uniqueTitles: number
    uniqueDescriptions: number
    averageScore: number
    fullCoverage: boolean
    gaps: readonly string[]
  }
  jsonLd: { '@context': 'https://schema.org'; '@graph': readonly Record<string, unknown>[] }
  address: string
  handle: string
  sha256: string
  sealed: boolean
  standard: string
  licence: string
}

const clean = (s: string) => s.replace(/\s+/g, ' ').trim()
const clip = (s: string, max: number) => (s.length <= max ? s : `${s.slice(0, max - 1).trimEnd()}…`)
const slugOf = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'seo'

const normaliseTitle = (raw: string, id: string, duplicate: boolean): string => {
  const suffix = duplicate ? ` · ${id.slice(0, 6)}` : ' · QPU'
  let t = clean(raw)
  if (t.length < 10 || duplicate) t = `${t}${suffix}`
  if (t.length < 10) t = `QPU ${t}`
  return clip(t, 60)
}

const normaliseDescription = (raw: string, schemaType: string, id: string, duplicate: boolean): string => {
  let d = clean(raw)
  const tag = duplicate ? ` [${id.slice(0, 8)}]` : ''
  if (d.length < 50) d = `${d} — ${schemaType} · ${SDK_VOCABULARY} · Lean 4${tag}`
  else if (duplicate) d = `${d}${tag}`
  if (d.length < 50) d = `${d} · ${LICENSE.spdx} · uuidna.com`
  return clip(d, 160)
}

/** Generate and score ISO 9001 / greatest-seam SEO metadata for one item under an attached target. */
export const seoMetaFor = (
  item: SeoItem,
  peers: readonly string[] = [],
  origin = 'https://qpu.uuidna.com',
  duplicateTitle = false,
  duplicateDescription = false,
): SeoMeta => {
  const root = origin.replace(/\/+$/, '')
  const schemaType = item.schemaType ?? 'Product'
  const title = normaliseTitle(item.title, item.id, duplicateTitle)
  const description = normaliseDescription(item.description, schemaType, item.id, duplicateDescription)
  const path = item.path.startsWith('/') ? item.path : `/${item.path}`
  const canonical = `${root}${path}`
  const baseUuid = seal(item.id).valid ? item.id : uuid(canonicalText({ seo: item.id, path }))
  const opt = optimise(baseUuid, peers.filter((p) => p !== baseUuid))
  const image = opt.kept
  const keywords = item.keywords?.length ? [...item.keywords] : [schemaType, SDK_VOCABULARY, 'Lean 4']
  const jsonLd: Record<string, unknown> = {
    '@type': schemaType,
    '@id': canonical,
    name: title,
    description,
    url: canonical,
    isAccessibleForFree: true,
    license: LICENSE.deed,
    author: { '@type': 'Person', '@id': LICENSE.orcid, name: LICENSE.author },
    ...(schemaType === 'Product' ? {
      sku: item.id,
      offers: {
        '@type': 'Offer',
        price: String(item.price ?? 0),
        priceCurrency: item.currency ?? 'EUR',
        availability: 'https://schema.org/InStock',
        url: canonical,
      },
    } : {}),
  }
  const checks = {
    titleLength: title.length >= 10 && title.length <= 60,
    descriptionLength: description.length >= 50 && description.length <= 160,
    canonical: canonical.startsWith(root),
    imageSealed: seal(image).valid,
    greatestSeam: opt.greatest,
    jsonLd: Boolean(jsonLd['@type'] && jsonLd.url),
  }
  const passed = Object.values(checks).filter(Boolean).length
  const score = Math.round((passed * 100) / Object.keys(checks).length)
  return {
    title,
    description,
    image,
    canonical,
    keywords,
    robots: 'index, follow',
    og: { title, description, url: canonical, type: schemaType === 'Product' ? 'product' : 'website', image },
    jsonLd,
    optimised: { kept: opt.kept, place: opt.place, seam: opt.seam, greatest: opt.greatest, formula: opt.formula, theorem: opt.theorem },
    score,
    checks,
  }
}

const makeTool = (target: string, op: 'optimise' | 'meta' | 'audit' | 'jsonld'): SeoMcpTool => {
  const s = slugOf(target)
  const name = `seo_${s}_${op}`
  return {
    name,
    title: `${target} · ${op}`,
    description: `@payloadcms/plugin-seo ${op} (${target})`,
    toolbox: target,
    attachedTo: target,
    plugin: '@payloadcms/plugin-seo',
    inputSchema: op === 'meta'
      ? { type: 'object', properties: { id: { type: 'string', description: 'record id' } } }
      : { type: 'object', properties: { limit: { type: 'integer', description: 'max records' } } },
    annotations: { title: `${target}:${op}`, readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    call: { method: 'tools/call', params: { name: 'imagine', arguments: { catalog: { seo: { target, tool: name } } } } },
    rest: { method: 'GET', path: `${SDK_API_PREFIX}/globals/catalog?view=seo&target=${encodeURIComponent(target)}&tool=${encodeURIComponent(name)}` },
  }
}

/** Attach @payloadcms/plugin-seo to any collection/domain target so that target becomes its MCP toolbox. */
export const attachSeoToolbox = (attachment: SeoAttachment, origin = 'https://qpu.uuidna.com'): SeoToolbox => {
  const root = origin.replace(/\/+$/, '')
  const target = attachment.target
  const titleCounts = new Map<string, number>()
  const descCounts = new Map<string, number>()
  for (const item of attachment.items) {
    const t = clean(item.title), d = clean(item.description)
    titleCounts.set(t, (titleCounts.get(t) ?? 0) + 1)
    descCounts.set(d, (descCounts.get(d) ?? 0) + 1)
  }
  const peerIds = attachment.items.map((item) => {
    const path = item.path.startsWith('/') ? item.path : `/${item.path}`
    return seal(item.id).valid ? item.id : uuid(canonicalText({ seo: item.id, path }))
  })
  const seenTitles = new Map<string, number>()
  const seenDescs = new Map<string, number>()
  const records = attachment.items.map((item) => {
    const baseMeta = seoMetaFor(
      item,
      peerIds,
      root,
      (titleCounts.get(clean(item.title)) ?? 0) > 1,
      (descCounts.get(clean(item.description)) ?? 0) > 1,
    )
    const tCount = (seenTitles.get(baseMeta.title) ?? 0) + 1
    seenTitles.set(baseMeta.title, tCount)
    const dCount = (seenDescs.get(baseMeta.description) ?? 0) + 1
    seenDescs.set(baseMeta.description, dCount)
    const meta = tCount > 1 || dCount > 1
      ? seoMetaFor(item, peerIds, root, true, true)
      : baseMeta
    return { id: item.id, path: item.path, meta }
  })
  const total = records.length
  const optimised = records.filter((r) => r.meta.checks.greatestSeam && r.meta.checks.imageSealed).length
  const uniqueTitles = new Set(records.map((r) => r.meta.title)).size
  const uniqueDescriptions = new Set(records.map((r) => r.meta.description)).size
  const averageScore = total ? Math.round(records.reduce((s, r) => s + r.meta.score, 0) / total) : 100
  const gaps: string[] = []
  if (optimised < total) gaps.push('unoptimised-records')
  if (uniqueTitles < total) gaps.push('duplicate-titles')
  if (uniqueDescriptions < total) gaps.push('duplicate-descriptions')
  const tools = (['optimise', 'meta', 'audit', 'jsonld'] as const).map((op) => makeTool(target, op))
  const jsonLd = { '@context': 'https://schema.org' as const, '@graph': records.map((r) => r.meta.jsonLd) }
  const audit = { total, optimised, uniqueTitles, uniqueDescriptions, averageScore, fullCoverage: gaps.length === 0 && averageScore === 100, gaps }
  const body = { plugin: '@payloadcms/plugin-seo', source: attachment.source, toolbox: target, attachedTo: target, audit, tools: tools.map((t) => t.name) }
  const canonical = canonicalText(body)
  const address = uuid(canonical)
  return {
    phase: 'seo-toolbox',
    plugin: '@payloadcms/plugin-seo',
    source: attachment.source,
    toolbox: target,
    attachedTo: target,
    fields: ['title', 'description', 'image'],
    tools,
    records,
    audit,
    jsonLd,
    address,
    handle: address.slice(0, 8),
    sha256: hex(sha256(utf8(canonical))),
    sealed: seal(address).valid,
    standard: SDK_VOCABULARY,
    licence: LICENSE.spdx,
  }
}

const seedItemsForEcommerce = (examples: readonly Example[], col: typeof CATALOG_COLLECTIONS[number], limit: number): SeoItem[] => {
  const page = catalogSeeds(examples, col, 1, limit)
  return page.docs.map((doc) => {
    const d = doc as Record<string, unknown>
    const id = String(d.id)
    if (col === 'products') {
      const key = String(d.theorem ?? d.title ?? id)
      return {
        id,
        title: key,
        description: `${String(d.statement ?? key)} (${String(d.module ?? 'Qpu')})`,
        path: `/catalog/${id}`,
        schemaType: 'Product',
        keywords: [key, String(d.module ?? 'Qpu'), SDK_VOCABULARY],
        price: 0,
        currency: 'EUR',
      }
    }
    if (col === 'variants') {
      const title = String(d.title ?? id)
      return {
        id,
        title,
        description: `${String(d.kind ?? 'variant')} variant (${title}) in ${SDK_VOCABULARY}`,
        path: `/api/variants/${id}`,
        schemaType: 'Product',
        keywords: [String(d.kind ?? 'variant'), String(d.tool ?? 'qpu'), SDK_VOCABULARY],
        price: 0,
        currency: 'EUR',
      }
    }
    if (col === 'variantTypes') {
      const label = String(d.label ?? d.name ?? id)
      return {
        id,
        title: `variantType: ${label}`,
        description: `variantType: ${label} · ${SDK_VOCABULARY} · @payloadcms/plugin-ecommerce`,
        path: `/api/variantTypes/${id}`,
        schemaType: 'DefinedTerm',
      }
    }
    const label = String(d.label ?? d.value ?? id)
    return {
      id,
      title: `option: ${label}`,
      description: `variantOption: ${label} · ${SDK_VOCABULARY} · @payloadcms/plugin-ecommerce`,
      path: `/api/variantOptions/${id}`,
      schemaType: 'DefinedTerm',
    }
  })
}

/** Attach @payloadcms/plugin-seo across every @payloadcms/plugin-ecommerce & QPU collection so each attached target is an MCP toolbox. */
export const ecommerceSeoToolboxes = (examples: readonly Example[], origin = 'https://qpu.uuidna.com', limit = 12) => {
  const root = origin.replace(/\/+$/, '')
  const cap = Math.max(1, Math.min(50, Math.floor(limit)))
  const ecommerceAttachments: SeoAttachment[] = CATALOG_COLLECTIONS.map((col) => ({
    target: col,
    source: '@payloadcms/plugin-ecommerce',
    items: seedItemsForEcommerce(examples, col, cap),
  }))
  const sdkAttachments: SeoAttachment[] = [
    {
      target: 'standards',
      source: 'payload',
      items: ISO_STANDARDS.slice(0, cap).map((s) => ({
        id: uuid(`standards;${s.reference}`),
        title: s.reference,
        description: `${s.reference}: ${s.says} (${s.witness ?? 'Lean 4'})`,
        path: '/standards/',
        schemaType: 'DefinedTerm',
      })),
    },
    {
      target: 'clauses',
      source: 'payload',
      items: ISO_CLAUSES.slice(0, cap).map((c) => ({
        id: uuid(`clauses;${c.clause}`),
        title: `${c.clause} · ${c.name}`,
        description: `${SDK_VOCABULARY} ${c.clause}: ${c.says}`,
        path: '/vocabulary/',
        schemaType: 'DefinedTerm',
      })),
    },
    {
      target: 'computations',
      source: 'payload',
      items: examples.slice(0, cap).map((ex) => ({
        id: uuid(`${ex.tool}${canonicalText(ex.arguments)}`),
        title: `${ex.tool}:${ex.id}`,
        description: `${ex.tool} · ${ex.theorem ?? THEOREMS[0]!.key} (${ex.id})`,
        path: '/mcp/',
        schemaType: 'SoftwareApplication',
      })),
    },
  ]

  const toolboxes = [...ecommerceAttachments, ...sdkAttachments].map((a) => attachSeoToolbox(a, root))
  const tools = toolboxes.flatMap((tb) => tb.tools)
  const averageScore = Math.round(toolboxes.reduce((s, tb) => s + tb.audit.averageScore, 0) / toolboxes.length)
  const fullCoverage = toolboxes.every((tb) => tb.audit.fullCoverage && tb.sealed)
  const canonical = canonicalText({
    phase: 'ecommerce-seo-mcp',
    plugin: '@payloadcms/plugin-seo',
    ecommerce: '@payloadcms/plugin-ecommerce',
    toolboxes: toolboxes.map((t) => ({ toolbox: t.toolbox, address: t.address })),
  })
  const address = uuid(canonical)
  return {
    phase: 'ecommerce-seo-mcp' as const,
    plugin: '@payloadcms/plugin-seo' as const,
    ecommerce: '@payloadcms/plugin-ecommerce' as const,
    attachedEqualsToolbox: true as const,
    origin: root,
    count: toolboxes.length,
    toolboxNames: toolboxes.map((t) => t.toolbox),
    totalTools: tools.length,
    averageScore,
    fullCoverage,
    toolboxes,
    tools,
    address,
    handle: address.slice(0, 8),
    sha256: hex(sha256(utf8(canonical))),
    sealed: seal(address).valid,
    standard: SDK_VOCABULARY,
    licence: LICENSE.spdx,
  }
}

/** Dispatch SEO-as-MCP queries: inspect attached ecommerce toolboxes, run a toolbox MCP tool, or attach SEO to any custom target. */
export const ecommerceSeoMcp = (ask: unknown, examples: readonly Example[], origin = 'https://qpu.uuidna.com') => {
  const root = origin.replace(/\/+$/, '')
  if (ask && typeof ask === 'object' && 'attach' in ask) {
    const a = (ask as { attach: { target?: unknown; source?: SeoAttachment['source']; items?: readonly SeoItem[] } }).attach
    const target = typeof a?.target === 'string' && a.target.trim() ? a.target.trim() : 'custom'
    const items = Array.isArray(a?.items) ? a.items : []
    return attachSeoToolbox({ target, source: a?.source ?? 'custom', items }, root)
  }
  const obj = ask && typeof ask === 'object' ? (ask as { target?: unknown; tool?: unknown; id?: unknown; limit?: unknown; toolsOnly?: unknown }) : {}
  const limit = typeof obj.limit === 'number' && Number.isFinite(obj.limit) ? obj.limit : 12
  const all = ecommerceSeoToolboxes(examples, root, limit)
  if (obj.toolsOnly === true) {
    return {
      phase: 'seo-mcp-tools' as const,
      plugin: '@payloadcms/plugin-seo' as const,
      attachedEqualsToolbox: true as const,
      totalDocs: all.tools.length,
      docs: obj.target ? all.tools.filter((t) => t.toolbox === obj.target) : all.tools,
    }
  }
  const target = typeof ask === 'string' ? ask : typeof obj.target === 'string' ? obj.target : undefined
  if (!target) return all
  const tb = all.toolboxes.find((t) => t.toolbox === target)
  if (!tb) throw new Error(`seo target: ${all.toolboxNames.join(', ')}`)
  if (typeof obj.tool === 'string') {
    const op = obj.tool.split('_').at(-1)
    if (op === 'audit') return { phase: 'seo-audit' as const, toolbox: tb.toolbox, attachedTo: tb.attachedTo, audit: tb.audit, address: tb.address, sealed: tb.sealed }
    if (op === 'jsonld') return { phase: 'seo-jsonld' as const, toolbox: tb.toolbox, attachedTo: tb.attachedTo, jsonLd: tb.jsonLd, address: tb.address, sealed: tb.sealed }
    if (op === 'meta') {
      const rec = typeof obj.id === 'string' ? tb.records.find((r) => r.id === obj.id) : tb.records[0]
      if (!rec) throw new Error(`seo record: ${String(obj.id)}`)
      return { phase: 'seo-meta' as const, toolbox: tb.toolbox, attachedTo: tb.attachedTo, record: rec, address: tb.address, sealed: tb.sealed }
    }
    return { phase: 'seo-optimise' as const, toolbox: tb.toolbox, attachedTo: tb.attachedTo, optimised: tb.audit.optimised, records: tb.records, address: tb.address, sealed: tb.sealed }
  }
  return tb
}
