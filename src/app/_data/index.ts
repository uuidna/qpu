import config from '@payload-config'
import { getPayload, type Where } from 'payload'
import { headers } from 'next/headers'
import { cache } from 'react'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuZoneHostOf } from '@uuidna/qpu'
// every hex family, fused door and MCP method registers itself on import: the generated registry is the one import
import '@uuidna/qpu/mcp/families.js'
import { qpuDataOf, qpuDataSourcesOf } from '@uuidna/qpu/mcp/qpu-fused.js'
import type { Doc, Footer, Form, Header, Page, Product, Search } from '@/payload-types'
import discovery from '@root/discovery-receipt.json'

import { seed } from '@/seed'
// every request advances the seed one slice when the content changed; a finished seed costs one KV read. Awaited: a
// promise left behind a Worker's response is dropped with it, and the slice's KV writes with it (measured 2026-10-03:
// the host served the pages' old descriptions through eleven deployments)
export const payloadOf = cache(async () => {
  const payload = await getPayload({ config })
  // SEEDING MUST NOT BLOCK THE RENDER. A GET that awaits a seed slice can exceed the Worker CPU limit and be killed
  // before the slice commits, so seeding never advances — a deadlock that leaves every page 503. Run it AFTER the
  // response with waitUntil (which keeps the promise alive past the Worker's reply, unlike a bare dangling promise);
  // the render returns fast on the content already there and seeding advances across requests. At build time / outside
  // a request there is no context, so await it there (no response to race).
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    getCloudflareContext().ctx.waitUntil(seed(payload).catch(() => undefined))
  } catch {
    await seed(payload).catch(() => undefined)
  }
  return payload
})

/** EACH TENANT IS AN APP, AND THE MAIN WEBSITE MOUNTS ALL OF THEM. A tenant is a domain (src/collections/Tenants.ts);
 *  the multi-tenant plugin scopes every page and doc to one. The main website — a first-party/reserved zone host the
 *  unit's own formula qpuZoneHostOf names (qpu.uuidna.com, www, saas-fallback) — is NOT a tenant: it mounts every
 *  tenant's content, so tenantOf is undefined there and the queries are unscoped. Any other host is a tenant's own
 *  domain, and its content is scoped to the tenant whose `domain` matches it — that host is the tenant's app. `cache`
 *  dedupes the lookup within a request. */
export const tenantOf = cache(async (): Promise<string | undefined> => {
  // headers() throws outside a request (e.g. a build-time sitemap); there is no tenant then — mount all, unscoped.
  const host = await headers().then((h) => h.get('host')?.split(':')[0]).catch(() => undefined)
  if (!host || qpuZoneHostOf(host)) return undefined // the main website mounts all tenants — no scope
  const match = (await (await payloadOf()).find({ collection: 'tenants', where: { domain: { equals: host } }, limit: 1, depth: 0 })).docs[0]
  return (match as { id?: string } | undefined)?.id
})
/** The where-clause that scopes a tenant-scoped collection to the request's tenant (empty when none resolves). */
const tenantWhere = async (): Promise<Where> => {
  const t = await tenantOf()
  return t ? { tenant: { equals: t } } : {}
}

export type Family = { name: string; formulas: { nibble: string; name: string; arity: number }[] }

export const familiesOf = (): Family[] =>
  [...qpuHexFamiliesOf()]
    .map(([name, formulas]) => ({ name, formulas: formulas.map((f, i) => ({ nibble: (i + 1).toString(16), name: f.name, arity: f.arity })) }))
    .sort((a, b) => a.name.localeCompare(b.name))

/** The combinatorics of a family of n formulas: ordered programs of up to ten formulas, ordered pairs, unordered pairs. */
export const countsOf = (n: number) => {
  let programs = 0n
  for (let k = 1n, p = 1n; k <= 10n; k++) programs += p *= BigInt(n)
  return { formulas: n, programs, compositions: n * n, pairs: (n * (n - 1)) / 2 }
}

export const runOf = async (family: string, program: string[], params: number[]) => {
  const uuid = qpuHexUuidOf({ family, program, params })
  return { uuid, run: await qpuHexRunOf(uuid) }
}

export const liveOf = async () => Promise.all((await qpuDataSourcesOf()).map(async (l) => ({ ...l, result: (await qpuDataOf(l.source, l.args)) as { holds?: boolean; agrees?: boolean; reading?: unknown; receipt?: string; url?: string; denied?: string } })))

import { receipts } from '@/receipts'
export const receiptsOf = () => receipts

/** ANY MEANINGFUL PATH IS A LEAD, NOT A RECORD. A path that names no page, doc, family or UUID is not stored and not a
 *  404 on sight: its words are parsed (the `ask` door) and, if they name a formula — a meaningful combination — its
 *  combinatorics are returned (200). Nothing is written: the path is a lead the discovery resolves on the fly. Returns
 *  the ask reading when a formula is named (with its hex and value), or undefined when the words name nothing. */
export const askOf = async (about: string): Promise<{ hex?: string; formula?: string; value?: unknown; holds?: boolean; answer?: string } | undefined> => {
  if (!about.trim()) return undefined
  const r = (await qpuDataOf('ask', { about })) as { reading?: { hex?: string; formula?: string; value?: unknown; holds?: boolean; answer?: string }; agrees?: boolean }
  const reading = r?.reading
  return reading?.hex && r.agrees ? reading : undefined
}

export const docsOf = cache(async (): Promise<Doc[]> =>
  (await (await payloadOf()).find({ collection: 'docs', where: await tenantWhere(), limit: 500, depth: 0, sort: 'title' })).docs as Doc[])

export const docOf = async (slug: string): Promise<Doc | undefined> =>
  ((await (await payloadOf()).find({ collection: 'docs', where: { slug: { equals: slug }, ...(await tenantWhere()) } as Where, limit: 1, depth: 1 })).docs[0] as Doc | undefined)

export const productsOf = async (): Promise<Product[]> =>
  (await (await payloadOf()).find({ collection: 'products', limit: 20, depth: 0, where: { _status: { equals: 'published' } } })).docs as Product[]

export const formOf = async (title: string): Promise<Form | undefined> =>
  ((await (await payloadOf()).find({ collection: 'forms', where: { title: { equals: title } }, limit: 1, depth: 0 })).docs[0] as Form | undefined)

/** Plain text of a Lexical rich-text value (a form's confirmation message). */
export const plainOf = (rich: unknown): string => {
  const walk = (n: unknown): string =>
    !n || typeof n !== 'object' ? '' : 'text' in n && typeof (n as { text: unknown }).text === 'string' ? (n as { text: string }).text : ((n as { children?: unknown[] }).children ?? []).map(walk).join(' ')
  return walk((rich as { root?: unknown } | undefined)?.root).trim()
}

/** A published page by slug (drafts too when previewing signed in, as payloadcms/website reads its pages). */
export const pageOf = async (slug: string, draft = false): Promise<Page | undefined> =>
  ((await (await payloadOf()).find({ collection: 'pages', where: { slug: { equals: slug }, ...(await tenantWhere()) } as Where, limit: 1, depth: 2, draft })).docs[0] as Page | undefined)

export const pagesOf = cache(async (): Promise<Page[]> =>
  (await (await payloadOf()).find({ collection: 'pages', where: await tenantWhere(), limit: 500, depth: 0 })).docs as Page[])

export type App = { id: string; name: string; domain?: string | null; pages: number; docs: number }
/** The tenants as apps: each a name and a domain, with the pages and docs scoped to it. Read with overrideAccess so the
 *  public dashboard lists every app on the lattice, not only the host's own; the counts are the scoped collections per tenant. */
export const appsOf = async (): Promise<App[]> => {
  const payload = await payloadOf()
  const tenants = (await payload.find({ collection: 'tenants', limit: 50, depth: 0, overrideAccess: true, sort: 'createdAt' })).docs as { id: string; name: string; domain?: string | null }[]
  const count = async (collection: 'pages' | 'docs', tenant: string) =>
    (await payload.count({ collection, where: { tenant: { equals: tenant } }, overrideAccess: true })).totalDocs
  return Promise.all(tenants.map(async (t) => ({ id: t.id, name: t.name, domain: t.domain, pages: await count('pages', t.id), docs: await count('docs', t.id) })))
}

/** Which collections a tenant owns and which the QPU shares across every app — the multi-tenant split. */
export const scopeOf = () => ({
  scoped: ['pages', 'docs', 'posts', 'case-studies', 'categories', 'community-help', 'partners', 'partner-filters', 'docs-feedback', 'reusable-content'],
  shared: ['quantum-receipts', 'fuse-apis', 'fuse-fields', 'fuse-formulas'],
})

export const headerOf = cache(async (): Promise<Header> => (await (await payloadOf()).findGlobal({ slug: 'header', depth: 1 })) as Header)
export const footerOf = cache(async (): Promise<Footer> => (await (await payloadOf()).findGlobal({ slug: 'footer', depth: 1 })) as Footer)

/** The search plugin's index for a query, best first. */
export const searchOf = async (q: string): Promise<Search[]> =>
  q ? ((await (await payloadOf()).find({ collection: 'search', where: { title: { like: q } }, limit: 30, depth: 1, sort: '-priority' })).docs as Search[]) : []

export type ReceiptRow = { name: string; pass: boolean; value: string; receipt: string }
/** The committed discovery receipt (discover over every live source), split by what each row records. */
export const discoveryOf = () => {
  const rows = discovery.rows as ReceiptRow[]
  const by = (prefix: string) => rows.filter((r) => r.name.startsWith(prefix))
  return { ...discovery, rows, live: by('live '), families: by('family '), relations: by('relation '), identities: by('sequence '), seals: by('seal ') }
}
