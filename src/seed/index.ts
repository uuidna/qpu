import type { Block, Payload } from 'payload'
import { qpuCiteOf, qpuContentUuidOf, qpuInstallOf, qpuPurposeOf } from '@uuidna/qpu'
import { blocks } from '../blocks/index'
import { customOf } from '../fields/blockFields'
import { HOME } from '../fields/link'
import { receipts } from '../receipts/index'
import { docs as generated } from './docs'

type Row = Record<string, unknown> & { id: string }
type Slug = Parameters<Payload['find']>[0]['collection']

// ---------------------------------------------------------------------------------------------------------------------
// THE CONTENT IS A COMBINATION. Nothing here is written: the pages are the blocks (home is the hero and every QPU block
// that does not read the network; each QPU block has a page; each committed receipt has a page; the layout blocks that
// make a page make one), the navigation is the set of pages, the footer is the citation, the hero is the unit's own
// readings, the licence is the citation's. A reference names its target by collection and slug (or a form by title) and
// is resolved when written, so this data is the same in every build and its content UUID is the seed's fingerprint.
// ---------------------------------------------------------------------------------------------------------------------

type Ref = { ref: 'pages' | 'docs'; slug: string } | { url: string }
type NavItem = Ref & { label: string }
type PageData = { slug: string; title: string; description: string; layout: Record<string, unknown>[] }

const lexical = (text: string) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, children: [{ type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '', version: 1 }] }] },
})
const url = (href: string, label: string): NavItem => ({ url: href, label })
const page = (slug: string, label: string): NavItem => ({ ref: 'pages', slug, label })
// a block's link field, as Payload stores it
const link = (href: string, label: string) => ({ link: { type: 'custom', url: href, label } })
// a block's slug as a title: `families` is Families, `callToAction` is Call to action
const titleOf = (slug: string) => slug.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, (c) => c.toUpperCase())

// what the unit says of itself: the citation (origin, author, DOIs, licence), the install manifest (the repository), the
// purpose (the platform, its qubits, the factoring)
const cite = qpuCiteOf() as unknown as { href: string; website: string; doi: string; identifier: string; author: { first: string; last: string; orcid: string }; '@context': [string, Record<string, string>] }
const repo = /[?&]url=(https:\/\/github\.com\/[^&]+)/.exec((qpuInstallOf() as unknown as { cloudflare: { qpu: string } }).cloudflare.qpu)?.[1] ?? cite.href
const packageName = `@${repo.replace(/^https:\/\/github\.com\//, '')}`
const cc = cite['@context'][1].cc ?? ''
const licence = { url: cc, name: `CC ${(/licenses\/([a-z-]+)\/([\d.]+)/.exec(cc)?.[1] ?? '').toUpperCase()} ${/licenses\/[a-z-]+\/([\d.]+)/.exec(cc)?.[1] ?? ''}`.trim() }
const purpose = qpuPurposeOf() as unknown as { nature: { platform: string; qubits: number }; cybersecurity: { n: number; factors: readonly [number, number] } }

// the blocks by what they are
const qpu = blocks.filter((b) => b.admin?.group === 'QPU')
const standing = qpu.filter((b) => !customOf(b).needs?.length) // a page of its own, nothing to supply
const home = standing.filter((b) => !customOf(b).live) // on the home page: no network when the root is served
const blockOf = (b: Block, extra: Record<string, unknown> = {}) => ({ blockType: b.slug, heading: titleOf(b.slug), intro: customOf(b).description, ...extra })
const pageOf = (b: Block): PageData => ({ slug: b.slug, title: titleOf(b.slug), description: customOf(b).description, layout: [blockOf(b)] })
const byName = (name: string) => blocks.find((b) => b.slug === name)!

const PRODUCTS = [
  { title: 'Commercial license', slug: 'commercial-license', description: `${packageName} is licensed ${licence.name}: non-commercial use only. Commercial use needs this license, priced per organisation on request.`, priceInUSDEnabled: false, _status: 'published' },
  { title: 'Storage writes', slug: 'storage-writes', description: `Reads of ${cite.website} are free and open. Writes to the document store need a bearer token; this plan issues one, priced on request.`, priceInUSDEnabled: false, _status: 'published' },
]
const FORM = {
  title: `${PRODUCTS[0]!.title} request`,
  submitButtonLabel: `Request a ${PRODUCTS[0]!.title.toLowerCase()}`,
  confirmationType: 'message',
  confirmationMessage: lexical('Thank you. Your request is recorded and will be answered by email.'),
  fields: [
    { blockType: 'text', name: 'name', label: 'Name', required: true, width: 50 },
    { blockType: 'email', name: 'email', label: 'Email', required: true, width: 50 },
    { blockType: 'text', name: 'organisation', label: 'Organisation', width: 100 },
    { blockType: 'textarea', name: 'use', label: 'Intended commercial use', required: true, width: 100 },
  ],
}

const index = generated.find((d) => d.slug === 'index')
const HOME_PAGE: PageData = {
  slug: HOME,
  title: cite.website,
  description: index?.description ?? '',
  layout: [
    {
      blockType: 'hero',
      badge: `RFC 9562 v8 · doi:${cite.doi}`,
      heading: `${purpose.nature.platform.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())} on ${purpose.nature.qubits} qubits.`,
      emphasis: `Shor: ${purpose.cybersecurity.n} = ${purpose.cybersecurity.factors[0]} × ${purpose.cybersecurity.factors[1]}.`,
      links: standing.slice(0, 3).map((b) => link(`/${b.slug}`, titleOf(b.slug))),
    },
    ...home.map((b) => blockOf(b, b.slug === 'families' ? { anchor: 'families' } : {})),
  ],
}
const RECEIPT_PAGES: PageData[] = receipts.map((r) => ({
  slug: r.name,
  title: `${titleOf(r.name.replace(/-receipt$/, ''))} receipt`,
  description: `The committed ${r.file}${typeof r.doc.when === 'string' ? `, generated ${r.doc.when}` : ''}: every row and the facts it records.`,
  layout: [blockOf(byName('receipt'), { file: r.file, heading: `${titleOf(r.name.replace(/-receipt$/, ''))} receipt` })],
}))
const SEARCH_PAGE = pageOf(byName('search'))
const LICENCE_PAGE: PageData = {
  slug: 'license',
  title: 'License and billing',
  description: `${packageName} is ${licence.name}: reads are free and non-commercial use is open. Commercial use and storage writes are licensed.`,
  layout: [blockOf(byName('products'), { heading: 'License and billing' }), { blockType: 'form', form: { formTitle: FORM.title } }],
}
const PAGES: PageData[] = [HOME_PAGE, ...standing.map(pageOf), ...RECEIPT_PAGES, SEARCH_PAGE, LICENCE_PAGE]

const HEADER: NavItem[] = [...standing.map((b) => page(b.slug, titleOf(b.slug))), ...(index ? [{ ref: 'docs' as const, slug: 'index', label: 'Docs' }] : []), page(SEARCH_PAGE.slug, SEARCH_PAGE.title), page(LICENCE_PAGE.slug, 'License')]
const FOOTER = {
  copyright: `© ${cite.author.first} ${cite.author.last} · ${licence.name}`,
  navItems: [page(HOME, 'Home'), page(LICENCE_PAGE.slug, PRODUCTS[0]!.title), url(`${cite.href}/mcp`, 'MCP'), url(repo, 'GitHub'), url(cite.identifier, 'DOI'), url(cite.author.orcid, 'ORCID')] as NavItem[],
}

const CONTENT = { docs: generated.map((d) => d.uuid), receipts: receipts.map((r) => r.name), FORM, PRODUCTS, PAGES, HEADER, FOOTER }

// ---------------------------------------------------------------------------------------------------------------------
// THE APPLIER
// ---------------------------------------------------------------------------------------------------------------------

/** Created when missing and never overwritten: what an admin edits afterwards stays. Copies a racing seed made go. */
const ensure = async (payload: Payload, collection: string, field: string, value: string, data: Record<string, unknown>): Promise<Row> => {
  const found = (await payload.find({ collection: collection as Slug, where: { [field]: { equals: value } }, limit: 0, pagination: false, depth: 0, sort: 'createdAt', overrideAccess: true })).docs as unknown as Row[]
  for (const copy of found.slice(1)) await payload.delete({ collection: collection as Slug, id: copy.id, overrideAccess: true })
  return found[0] ?? ((await payload.create({ collection: collection as Slug, data: data as never, overrideAccess: true })) as unknown as Row)
}

/** Every plugin's content: docs with their place in the tree (nested-docs) and in search, redirects for retired routes,
 *  the commercial-licence form (form-builder), the products (ecommerce), the pages and the header and footer globals.
 *  Idempotent, run on init only when the content changed: its content UUID is kept in Payload's KV, so a cold isolate
 *  reads one key, and a build that changes no content seeds nothing. */
export async function seed(payload: Payload) {
  const fingerprint = qpuContentUuidOf(CONTENT)
  if ((await payload.kv.get<string>('seed')) === fingerprint) return
  await upsertDocs(payload)
  const pages = new Map<string, string>()
  const docId = (slug: string) => generated.find((d) => d.slug === slug)?.id
  const linkOf = (r: Ref, label?: string) => {
    if ('url' in r) return { type: 'custom', url: r.url, ...(label ? { label } : {}) }
    const id = r.ref === 'docs' ? docId(r.slug) : pages.get(r.slug)
    return id ? { type: 'reference', reference: { relationTo: r.ref, value: id }, ...(label ? { label } : {}) } : { type: 'custom', url: `/${r.slug}`, ...(label ? { label } : {}) }
  }
  const form = await ensure(payload, 'forms', 'title', FORM.title, FORM)
  for (const p of PRODUCTS) await ensure(payload, 'products', 'slug', p.slug, p)
  for (const p of PAGES) {
    const layout = p.layout.map((b) => (b.blockType === 'form' ? { ...b, form: form.id } : b))
    pages.set(p.slug, (await ensure(payload, 'pages', 'slug', p.slug, { ...p, layout, _status: 'published' })).id)
  }
  // a page the combination no longer makes is unpublished, and its address redirects to the page its first block makes
  const made = new Set(PAGES.map((p) => p.slug))
  const stale = (await payload.find({ collection: 'pages', limit: 0, pagination: false, depth: 0, overrideAccess: true })).docs as unknown as (Row & { slug: string; _status?: string; layout?: { blockType: string; file?: string }[] })[]
  for (const old of stale.filter((p) => !made.has(p.slug))) {
    const first = old.layout?.[0]
    const target = first?.blockType === 'receipt' ? first.file?.replace(/\.json$/, '') : first?.blockType === 'hero' ? HOME : first?.blockType
    if (target && made.has(target)) await ensure(payload, 'redirects', 'from', `/${old.slug}`, { from: `/${old.slug}`, to: linkOf({ ref: 'pages', slug: target }) })
    if (old._status !== 'draft') await payload.update({ collection: 'pages', id: old.id, data: { _status: 'draft' } as never, overrideAccess: true })
  }
  const nav = (items: NavItem[]) => items.map(({ label, ...r }) => ({ link: linkOf(r as Ref, label) }))
  const header = (await payload.findGlobal({ slug: 'header', depth: 0, overrideAccess: true })) as { navItems?: unknown[] }
  if (!header.navItems?.length) await payload.updateGlobal({ slug: 'header', overrideAccess: true, data: { navItems: nav(HEADER) } as never })
  const footer = (await payload.findGlobal({ slug: 'footer', depth: 0, overrideAccess: true })) as { navItems?: unknown[] }
  if (!footer.navItems?.length) await payload.updateGlobal({ slug: 'footer', overrideAccess: true, data: { copyright: FOOTER.copyright, navItems: nav(FOOTER.navItems) } as never })
  // last, because it is the only step that can be long: saving the docs the search index lacks
  await indexDocs(payload)
  await payload.kv.set('seed', fingerprint)
}

// the docs as generated, each upserted at its own id with its place under the index (nested-docs); SEO is filled by the
// collection's own hook on save. Read by id, written only when its content UUID changed or its parent is missing.
async function upsertDocs(payload: Payload) {
  const index = generated.find((d) => d.slug === 'index')
  await Promise.all(generated.map(async (doc) => {
    const parent = index && doc.slug !== 'index' ? index.id : undefined
    const old = (await payload.findByID({ collection: 'docs', id: doc.id, depth: 0, disableErrors: true, overrideAccess: true })) as { uuid?: string; parent?: unknown } | null
    const data = { ...doc, ...(parent ? { parent } : {}) } as never
    if (!old) await payload.create({ collection: 'docs', data, overrideAccess: true })
    else if (old.uuid !== doc.uuid || (parent && !old.parent)) await payload.update({ collection: 'docs', id: doc.id, data, overrideAccess: true })
  }))
}

// the search plugin indexes a doc when it is saved: the docs it has not indexed are saved once, the rest left alone
async function indexDocs(payload: Payload) {
  const found = (await payload.find({ collection: 'search', limit: 0, pagination: false, depth: 0, overrideAccess: true })).docs as unknown as { doc?: { value?: unknown } }[]
  const indexed = new Set(found.map((s) => (s.doc?.value && typeof s.doc.value === 'object' ? (s.doc.value as { id: string }).id : String(s.doc?.value ?? ''))))
  for (const d of generated.filter((x) => !indexed.has(x.id))) await payload.update({ collection: 'docs', id: d.id, data: { title: d.title }, overrideAccess: true })
}
