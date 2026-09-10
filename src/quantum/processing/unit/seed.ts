/**
 * Payload import seed. Occupancy theorems arrive as standard pages with a
 * Lexical `content` field. Agnostic of collection meaning: doi empty is unclaimed.
 * Official plugin fields only: nested-docs parent + breadcrumbs, seo meta,
 * import-export upsert by slug, localized maps, multi-tenant tenant.
 */
export type QpuLexicalNode = {
  type: string
  text?: string
  tag?: string
  language?: string
  children?: QpuLexicalNode[]
}

export type QpuLexicalState = { root: QpuLexicalNode }

export type QpuTheoremSeed = {
  heading: string
  theorem: string
  formula: string
  reading?: string
  holds: boolean
  slug?: string
}

export type QpuSeedAncestry = { slug: string; title: string }

export type QpuBreadcrumb = { doc: string; url: string; label: string }

export type QpuPayloadDoc = {
  slug: string
  title: Record<string, string>
  _status: 'published'
  parent: string | null
  breadcrumbs: QpuBreadcrumb[]
  doi: string
  tenant: string
  meta: { title: Record<string, string>; description: Record<string, string>; image: null }
  content: QpuLexicalState
}

/** Official nested-docs generateLabel: (_, doc) => String(doc.title) */
export const qpuGenerateLabelOf = (_docs: QpuSeedAncestry[], doc: QpuSeedAncestry): string => String(doc.title)

/** Official nested-docs generateURL: (docs) => docs.reduce((url, doc) => url + '/' + doc.slug, '') */
export const qpuGenerateURLOf = (docs: QpuSeedAncestry[]): string => docs.reduce((url, doc) => `${url}/${doc.slug}`, '')

export const qpuBreadcrumbsOf = (ancestry: QpuSeedAncestry[]): QpuBreadcrumb[] =>
  ancestry.map((_, i) => {
    const docs = ancestry.slice(0, i + 1)
    const doc = docs[docs.length - 1]!
    return { doc: doc.slug, url: qpuGenerateURLOf(docs), label: qpuGenerateLabelOf(docs, doc) }
  })

export const qpuLocalizedOf = <T>(locales: readonly string[], value: T): Record<string, T> =>
  Object.fromEntries(locales.map((code) => [code, value])) as Record<string, T>

export const qpuLexicalOf = (children: QpuLexicalNode[]): QpuLexicalState => ({
  root: { type: 'root', children },
})

export const qpuTheoremLexicalOf = (row: {
  heading: string
  theorem: string
  formula: string
  reading?: string
}): QpuLexicalState => {
  const children: QpuLexicalNode[] = [
    { type: 'heading', tag: 'h3', children: [{ type: 'text', text: row.heading }] },
    { type: 'code', language: 'tex', children: [{ type: 'text', text: row.formula }] },
    { type: 'code', language: 'lean', children: [{ type: 'text', text: row.theorem }] },
  ]
  if (row.reading) children.push({ type: 'paragraph', children: [{ type: 'text', text: row.reading }] })
  return qpuLexicalOf(children)
}

const docOf = (
  slug: string,
  title: string,
  parent: string | null,
  ancestry: QpuSeedAncestry[],
  locales: readonly string[],
  tenant: string,
  content: QpuLexicalState,
  description: string,
): QpuPayloadDoc => ({
  slug,
  title: qpuLocalizedOf(locales, title),
  _status: 'published',
  parent,
  breadcrumbs: qpuBreadcrumbsOf(ancestry),
  doi: '',
  tenant,
  meta: {
    title: qpuLocalizedOf(locales, title),
    description: qpuLocalizedOf(locales, description),
    image: null,
  },
  content,
})

export const qpuPayloadImportOf = (args: {
  src: string
  theorems: readonly QpuTheoremSeed[]
  cover: readonly QpuTheoremSeed[]
  climb: QpuTheoremSeed
  locales: readonly string[]
  tenant: { name: string; slug: string; domain: string }
}) => {
  const { src, theorems, cover, climb, locales, tenant } = args
  const lean: QpuSeedAncestry = { slug: 'lean', title: src }
  const coverNode: QpuSeedAncestry = { slug: 'cover', title: 'cover' }
  const docs: QpuPayloadDoc[] = [
    docOf('lean', src, null, [lean], locales, tenant.slug, qpuLexicalOf([{ type: 'code', language: 'lean', children: [{ type: 'text', text: src }] }]), src),
    ...theorems.map((row) => {
      const slug = row.slug ?? row.heading
      const node = { slug, title: row.heading }
      return docOf(slug, row.heading, 'lean', [lean, node], locales, tenant.slug, qpuTheoremLexicalOf(row), row.reading ?? row.heading)
    }),
    docOf('cover', 'cover', 'lean', [lean, coverNode], locales, tenant.slug, qpuLexicalOf([{ type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'cover' }] }]), 'cover'),
    ...cover.map((row) => {
      const slug = row.slug ?? row.heading
      const node = { slug, title: row.heading }
      return docOf(slug, row.heading, 'cover', [lean, coverNode, node], locales, tenant.slug, qpuTheoremLexicalOf(row), row.reading ?? row.heading)
    }),
    docOf(climb.heading, climb.heading, 'lean', [lean, { slug: climb.heading, title: climb.heading }], locales, tenant.slug, qpuTheoremLexicalOf(climb), climb.reading ?? climb.heading),
  ]
  return {
    collectionSlug: 'pages' as const,
    locale: 'all' as const,
    importMode: 'upsert' as const,
    matchField: 'slug' as const,
    tenant,
    locales,
    docs,
  }
}
