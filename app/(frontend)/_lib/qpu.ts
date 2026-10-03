import config from '@payload-config'
import { getPayload } from 'payload'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf } from '@uuidna/qpu'
// every hex family registers itself on import: cross, path, audit, signal, holo, crypt, np, clay
import '@/dist/mcp/cross-domain-formulas.js'
import '@/dist/mcp/cross-domain-paths.js'
import '@/dist/audit/audit-formulas.js'
import '@/dist/mcp/quantum-secure-signalling.js'
import '@/dist/mcp/hologram-streams.js'
import '@/dist/mcp/crypt-formulas.js'
import '@/dist/mcp/np-formulas.js'
import '@/dist/mcp/clay-seals.js'
import { qpuDataOf, qpuDataSourcesOf } from '@/dist/mcp/qpu-fused.js'
import type { Doc, Form, Product } from '@/src/payload/payload-types'

export const payloadOf = () => getPayload({ config })

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

export const liveOf = () => Promise.all(qpuDataSourcesOf().map(async (l) => ({ ...l, result: (await qpuDataOf(l.source, l.args)) as { holds?: boolean; agrees?: boolean; reading?: unknown; receipt?: string; url?: string; denied?: string } })))

// every committed receipt, found by name pattern at build time rather than listed
const receiptContext = (require as unknown as { context: (dir: string, deep: boolean, re: RegExp) => { keys: () => string[]; (k: string): Record<string, unknown> } }).context('../../..', false, /-receipt\.json$/)
export const receiptsOf = () => receiptContext.keys().map((k) => ({ file: k.replace(/^\.\//, ''), doc: receiptContext(k) }))

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
