import config from '@payload-config'
import { getPayload } from 'payload'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf } from '@uuidna/qpu'
// every hex family, fused door and MCP method registers itself on import: the generated registry is the one import
import '@uuidna/qpu/mcp/families.js'
import { qpuDataOf, qpuDataSourcesOf } from '@uuidna/qpu/mcp/qpu-fused.js'
import type { Doc, Footer, Form, Header, Page, Product, Search } from '@/payload-types'
import discovery from '@root/discovery-receipt.json'

import { seed } from '@/seed'
// every request advances the seed one slice when the content changed; a finished seed costs one KV read
export const payloadOf = async () => {
  const payload = await getPayload({ config })
  void seed(payload).catch(() => undefined)
  return payload
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

export const docsOf = async (): Promise<Doc[]> =>
  (await (await payloadOf()).find({ collection: 'docs', limit: 0, pagination: false, depth: 0, sort: 'title' })).docs as Doc[]

export const docOf = async (slug: string): Promise<Doc | undefined> =>
  ((await (await payloadOf()).find({ collection: 'docs', where: { slug: { equals: slug } }, limit: 1, depth: 1 })).docs[0] as Doc | undefined)

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
  ((await (await payloadOf()).find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 2, draft })).docs[0] as Page | undefined)

export const pagesOf = async (): Promise<Page[]> =>
  (await (await payloadOf()).find({ collection: 'pages', limit: 0, pagination: false, depth: 0 })).docs as Page[]

export const headerOf = async (): Promise<Header> => (await (await payloadOf()).findGlobal({ slug: 'header', depth: 1 })) as Header
export const footerOf = async (): Promise<Footer> => (await (await payloadOf()).findGlobal({ slug: 'footer', depth: 1 })) as Footer

/** The search plugin's index for a query, best first. */
export const searchOf = async (q: string): Promise<Search[]> =>
  q ? ((await (await payloadOf()).find({ collection: 'search', where: { title: { like: q } }, limit: 30, depth: 1, sort: '-priority' })).docs as Search[]) : []

export type ReceiptRow = { name: string; pass: boolean; value: string; receipt: string }
/** The committed discovery receipt (qpu_discover over every live source), split by what each row records. */
export const discoveryOf = () => {
  const rows = discovery.rows as ReceiptRow[]
  const by = (prefix: string) => rows.filter((r) => r.name.startsWith(prefix))
  return { ...discovery, rows, live: by('live '), families: by('family '), relations: by('relation '), identities: by('sequence '), seals: by('seal ') }
}
