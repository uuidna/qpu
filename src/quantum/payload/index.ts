// Pages are stored with Payload's local API: find by slug, then create or update.
// The collection is the website's pages. The nested-docs plugin fills breadcrumbs.
import { entryText, uuid } from '../uuid/index.ts'
import { pageSeed } from '../processing/page-seed.ts'

type Seed = ReturnType<typeof pageSeed>
type PageData = Omit<Seed, 'id' | 'breadcrumbs'>
type PageDoc = PageData & { id: string | number; breadcrumbs?: { url?: string | null; label?: string | null; doc?: unknown }[] | null }

const context = { disableRevalidate: true as const }

export const pageData = (title: string, text: string): { page: Seed; data: PageData } => {
  const page = pageSeed(title, text)
  const data: PageData = { sku: page.sku, title: page.title, slug: page.slug, _status: page._status, hero: page.hero, layout: page.layout, meta: page.meta }
  return { page, data }
}

export { seedWaves } from './waves.ts'
export { mcpPages } from './mcp-seeds.ts'

export const findArgs = (slug: string) => ({
  collection: 'pages' as const,
  where: { slug: { equals: slug } },
  limit: 1 as const,
  overrideAccess: true as const,
  draft: true as const,
})

/** The arguments of payload.create. The id and the breadcrumbs stay off the write. The parent is set by the nested-docs field. */
export const writeArgs = (page: Seed & { parentSlug?: string | null; parentId?: string | null; product?: string; variant?: string; depth?: number; kind?: string; url?: string; addressed?: boolean }) => {
  const { id: _id, breadcrumbs: _breadcrumbs, parentSlug: _parent, parentId: _parentId, product: _product, variant: _variant, depth: _depth, kind: _kind, url: _url, addressed: _addressed, ...data } = page
  return { collection: 'pages' as const, data, draft: page._status !== 'published', overrideAccess: true as const, context }
}

const findIdArgs = (id: string) => ({
  collection: 'pages' as const,
  where: { id: { equals: id } },
  limit: 1 as const,
  overrideAccess: true as const,
  draft: true as const,
})

type FindArgs = ReturnType<typeof findArgs> | ReturnType<typeof findIdArgs>
type WriteArgs = ReturnType<typeof writeArgs>
type WriteCall = WriteArgs & { disableTransaction?: boolean }
type Addressed = Seed & { parentId?: string | null; addressed?: boolean }

type PagesApi = {
  find: (args: FindArgs) => Promise<{ docs: PageDoc[] }>
  create: (args: WriteCall) => Promise<PageDoc>
  update: (args: WriteCall & { id: string | number }) => Promise<PageDoc>
}

const publishedFind = (page: Addressed) => page.addressed === true
  ? { collection: 'pages' as const, where: { sku: { equals: page.sku } }, limit: 1 as const, overrideAccess: true as const, draft: page._status !== 'published' }
  : { ...findArgs(page.slug), draft: page._status !== 'published' }

/** Nested docs re-reads draft children through version.parent, which this versions table cannot query. The page is already stored. */
const withoutVersionParent = async (payload: PagesApi, page: Addressed, write: () => Promise<PageDoc>): Promise<PageDoc> => {
  try {
    return await write()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (!message.includes('version.parent') && !message.includes('static generation store missing')) throw err
    const saved = (await payload.find(publishedFind(page))).docs[0]
    if (!saved) throw err
    return saved
  }
}

const relationId = (value: unknown) => {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'string' || typeof id === 'number') return String(id)
  }
  return null
}

const storedParent = (doc: PageDoc | null | undefined) => relationId((doc as { parent?: unknown } | null | undefined)?.parent)

/** The nested-docs plugin writes the parent and the breadcrumb URL. A draft child query on version.parent rolls the write back, so the save commits on its own. */
export const saveSeed = async (payload: PagesApi, page: Addressed, parentDb?: string | number | null): Promise<PageDoc> => {
  const found = await payload.find(publishedFind(page) as FindArgs)
  const existing = found.docs[0]
  const write = writeArgs(page)
  const data = { ...write.data, ...(parentDb ? { parent: parentDb } : {}) } as WriteArgs['data']
  const call = { ...write, data, disableTransaction: true as const }
  return withoutVersionParent(payload, page, () => existing ? payload.update({ ...call, id: existing.id }) : payload.create(call))
}

export const savePage = async (payload: PagesApi, title: string, text: string): Promise<PageDoc> => {
  const { page } = pageData(title, text)
  return saveSeed(payload, page)
}

/** Payload's local API, and nothing beside it. `find` is one page (the answer names the next). `create`, `update` and `delete` are the same API on any collection. */
export const manageApi = (spec: { collection: string; action?: 'find' | 'create' | 'update' | 'delete'; where?: Record<string, unknown>; page?: number; limit?: number; /** false: one read, every document (Payload's uncapped find) */ pagination?: boolean; id?: string | number; data?: Record<string, unknown>; depth?: number; sort?: string; draft?: boolean; override?: boolean }) => {
  const action = spec.action ?? 'find'
  const collection = spec.collection
  const base = { collection, overrideAccess: spec.override === false ? false as const : true as const }
  if (action === 'find') return { api: 'find' as const, args: { ...base, ...(spec.where ? { where: spec.where } : {}), page: spec.page ?? 1, ...(spec.limit ? { limit: spec.limit } : {}), ...(spec.pagination === false ? { pagination: false as const } : {}), depth: spec.depth ?? 0, draft: spec.draft ?? true, ...(spec.sort ? { sort: spec.sort } : {}) } }
  if (action === 'create') return { api: 'create' as const, args: { ...base, data: spec.data ?? {}, draft: true as const, context } }
  if (action === 'update') return { api: 'update' as const, args: { ...base, ...(spec.id != null ? { id: spec.id } : {}), ...(spec.where ? { where: spec.where } : {}), data: spec.data ?? {}, draft: true as const } }
  return { api: 'delete' as const, args: { ...base, ...(spec.id != null ? { id: spec.id } : {}), ...(spec.where ? { where: spec.where } : {}) } }
}

/** One entries create per exit. Covered plus uncovered are the exits (textbook_standards_sliced). Nothing is written. */
export const entriesCover = (exits: readonly { from: string; body: Record<string, unknown> }[]) => {
  const entries = exits.map((exit) => {
    const kind = 'exit' as const
    const from = exit.from
    const body = { ...exit.body, exited: false as const }
    const data = { id: uuid(entryText({ kind, from, body })), kind, from, body }
    return { ...data, call: manageApi({ collection: 'entries', action: 'create', data }) }
  })
  const covered = entries.filter((entry) => exits.some((exit) => exit.from === entry.from)).length
  const uncovered = exits.length - covered
  return { entries, exits: exits.length, covered, uncovered, holds: covered + uncovered === exits.length && exits.length - uncovered === covered, theorem: 'textbook_standards_sliced' as const }
}

export const findPage = async (payload: PagesApi, slug: string): Promise<PageDoc | null> => {
  const found = await payload.find(findArgs(slug))
  return found.docs[0] ?? null
}

const textOf = (node: unknown, into: string[]) => {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) { node.forEach((child) => textOf(child, into)); return }
  const record = node as { text?: unknown; children?: unknown }
  if (typeof record.text === 'string') into.push(record.text)
  textOf(record.children, into)
}

/** A stored page agrees with a seed when the fields the seed writes are the fields the record holds. */
export const recordAgrees = (record: PageDoc | null | undefined, page: Seed): boolean => {
  if (!record) return false
  const data = writeArgs(page).data
  const stored: string[] = []
  const seeded: string[] = []
  textOf(record.layout, stored)
  textOf(data.layout, seeded)
  const block = record.layout?.[0]
  const seededBlock = data.layout[0]
  return record.slug === data.slug && record.title === data.title && record.sku === data.sku && record._status === data._status && record.hero?.type === data.hero.type && block?.blockType === seededBlock?.blockType && stored.join('\n') === seeded.join('\n') && record.meta?.title === data.meta.title && record.meta?.description === data.meta.description
}

/** Find every seed. Deploy is allowed only when each current record already agrees. Nothing is written. */
const locate = async (payload: PagesApi, page: Addressed) => (await payload.find(publishedFind(page) as FindArgs)).docs[0] ?? null

export const seedsSynced = async (payload: PagesApi, pages: readonly Addressed[]) => {
  const rows = []
  for (const page of pages) {
    const current = await locate(payload, page)
    rows.push({ slug: page.slug, synced: recordAgrees(current, page) })
  }
  const synced = rows.length > 0 && rows.every((row) => row.synced)
  return { pages: rows.length, written: 0, synced, rows, allowsDeploy: synced }
}

/** After the pages exist, each nested seed points at its parent page. A repeated slug is found by its id. */
export const linkSeedParents = async (payload: PagesApi, links: readonly { id?: string; slug?: string; parentId?: string | null; parentSlug?: string | null }[]) => {
  let linked = 0
  for (const link of links) {
    if (!link.parentId && !link.parentSlug) continue
    const page = link.id ? (await payload.find(findIdArgs(link.id))).docs[0] ?? null : await findPage(payload, link.slug ?? '')
    const parent = link.parentId ? (await payload.find(findIdArgs(link.parentId))).docs[0] ?? null : await findPage(payload, link.parentSlug ?? '')
    if (!page || !parent) continue
    const write = writeArgs(page as Seed)
    const child = page as Addressed
    await withoutVersionParent(payload, { ...child, id: String(page.id), slug: page.slug ?? child.slug, _status: 'published' }, () => payload.update({ ...write, id: page.id, data: { ...write.data, parent: parent.id } as WriteArgs['data'] }))
    linked += 1
  }
  return { linked }
}

const nestedReady = (page: Addressed, doc: PageDoc | null | undefined, parentDb?: string | number) => {
  const parentReady = page.parentId ? parentDb != null && storedParent(doc) === String(parentDb) : storedParent(doc) == null
  const wanted = page.breadcrumbs?.at(-1)?.url
  return parentReady && typeof wanted === 'string' && wanted.length > 0 && doc?.breadcrumbs?.at(-1)?.url === wanted
}

/** Find each seed, then create or update it through the local API when the current record differs. */
export const syncSeeds = async (payload: PagesApi, pages: readonly Addressed[]) => {
  const rows = []
  const ids = new Map<string, string | number>()
  let parents = 0
  for (const page of pages) {
    const parentDb = page.parentId ? ids.get(page.parentId) : undefined
    const current = await locate(payload, page)
    const agreed = recordAgrees(current, page)
    const nested = nestedReady(page, current, parentDb)
    if (!agreed || !nested) {
      await saveSeed(payload, page, parentDb)
      if (parentDb) parents += 1
    }
    const after = agreed && nested ? current : await locate(payload, page)
    if (after) ids.set(page.id, after.id)
    rows.push({ slug: page.slug, written: !agreed || !nested, synced: recordAgrees(after, page) && nestedReady(page, after, parentDb) })
  }
  const synced = rows.length > 0 && rows.every((row) => row.synced)
  return { pages: rows.length, written: rows.filter((row) => row.written).length, synced, rows, allowsDeploy: synced, parents }
}

let opening: Promise<PagesApi> | null = null

/** Payload's local API, the same getPayload({ config }) the website uses. */
export const openPages = (): Promise<PagesApi> => {
  opening ??= (async () => {
    const { default: config } = await import('../../payload.config.ts')
    const { getPayload } = await import('payload')
    const payload = await getPayload({ config })
    return {
      find: (args: FindArgs) => payload.find(args) as Promise<{ docs: PageDoc[] }>,
      create: (args: WriteArgs) => payload.create(args) as Promise<PageDoc>,
      update: (args: WriteArgs & { id: string | number }) => payload.update(args) as Promise<PageDoc>,
    }
  })()
  return opening
}

export { payloadPlugin as plugin } from '../plugin.ts'
