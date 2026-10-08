import type { Block, Payload } from 'payload'
import { qpuCiteOf, qpuContentUuidOf, qpuFacesOf, qpuInstallOf, qpuPurposeOf } from '@uuidna/qpu'
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
// THE ROOT TENANT. This site is one app, and the multi-tenant plugin scopes every page and doc to a tenant, so the
// seed's own content must be stamped with one — the tenant whose domain is this host, which is the same tenant a request
// to this host resolves to, so what the seed writes is what the site reads. Without it every page/doc create is refused
// ("Assigned Tenant is invalid") and the whole site — pages, nav, receipts — never gets built.
const ROOT_TENANT = { name: cite.website, domain: cite.website }

// the blocks by what they are
const qpu = blocks.filter((b) => b.admin?.group === 'QPU')
const standing = qpu.filter((b) => !customOf(b).needs?.length) // a page of its own, nothing to supply
// on the home page: no network when the root is served
const home = standing.filter((b) => !customOf(b).live)
// a page's description is what search engines show: the block's text cut at the last sentence that fits 160 characters
// (the SEO rule the release test states), never typed shorter by hand
const seoOf = (t: string): string => {
  if (t.length <= 160) return t
  // the last sentence boundary that still leaves fifty characters; failing that, the last word within 157 and an ellipsis
  const atSentence = t.slice(0, 160).replace(/[^.;:—]*$/, '').trim()
  return atSentence.length >= 50 ? atSentence : `${t.slice(0, 157).replace(/\s+\S*$/, '').trim()}…`
}
const blockOf = (b: Block, extra: Record<string, unknown> = {}) => ({ blockType: b.slug, heading: titleOf(b.slug), intro: customOf(b).description, ...extra })
const pageOf = (b: Block): PageData => ({ slug: b.slug, title: titleOf(b.slug), description: seoOf(customOf(b).description), layout: [blockOf(b)] })
const byName = (name: string) => blocks.find((b) => b.slug === name)!

// Sale record. Price stays off, so it holds false until the author sets one. Cloudflare for SaaS custom hostname billing bills the other user's Cloudflare account; the account id stays unset. No card is stored.
const PRODUCTS = [
  { title: 'Commercial license', slug: 'commercial-license', description: `${packageName} is licensed ${licence.name}: non-commercial use only. Commercial use needs this license, priced per organisation on request.`, organisation: null, use: null, licence: 'CC-BY-NC-ND-4.0', priceInUSDEnabled: false, billedAccount: 'other-cloudflare-account', cloudflareAccountId: null, _status: 'published' },
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
  description: seoOf(index?.description ?? ''),
  layout: [
    {
      blockType: 'hero',
      badge: `RFC 9562 v8 · doi:${cite.doi}`,
      heading: `${purpose.nature.platform.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())} on ${purpose.nature.qubits} qubits.`,
      emphasis: `Shor: ${purpose.cybersecurity.n} = ${purpose.cybersecurity.factors[0]} × ${purpose.cybersecurity.factors[1]}.`,
      links: standing.slice(0, 3).map((b) => link(`/${b.slug}`, titleOf(b.slug))),
    },
    // the Clay receipt is the first thing under the hero; the rest keep the registry's order
    ...[...home.filter((b) => b.slug === 'clay'), ...home.filter((b) => b.slug !== 'clay')].map((b) => blockOf(b, b.slug === 'families' ? { anchor: 'families' } : {})),
  ],
}
const RECEIPT_PAGES: PageData[] = receipts.map((r) => ({
  slug: r.name,
  title: `${titleOf(r.name.replace(/-receipt$/, ''))} receipt`,
  description: seoOf(`The committed ${r.file}${typeof r.doc.when === 'string' ? `, generated ${r.doc.when}` : ''}: every row and the facts it records.`),
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

const CONTENT = { tenant: ROOT_TENANT, docs: generated.map((d) => d.uuid), receipts: receipts.map((r) => r.name), FORM, PRODUCTS, PAGES, HEADER, FOOTER }

// ---------------------------------------------------------------------------------------------------------------------
// THE APPLIER
// ---------------------------------------------------------------------------------------------------------------------

/** Created when missing and never overwritten: what an admin edits afterwards stays. Copies a racing seed made go. */
const ensure = async (payload: Payload, collection: string, field: string, value: string, data: Record<string, unknown>): Promise<Row> => {
  const found = (await payload.find({ collection: collection as Slug, where: { [field]: { equals: value } }, limit: 0, pagination: false, depth: 0, sort: 'createdAt', overrideAccess: true })).docs as unknown as Row[]
  for (const copy of found.slice(1)) await payload.delete({ collection: collection as Slug, id: copy.id, overrideAccess: true })
  // a row whose title or description the combination changed is updated in place: its address stays, its text follows
  const first = found[0] as (Row & { title?: unknown; description?: unknown }) | undefined
  // only the text that moved is written — the row's own title and description and the SEO plugin's meta, which the
  // page serves first (measured 2026-10-03: description updated, meta.description still the old text on every page);
  // a row's layout and relations stay as they were made
  const meta = (first as { meta?: { title?: unknown; description?: unknown } } | undefined)?.meta ?? {}
  const moved = ['title', 'description'].filter((k) => k in data && (data[k] !== first?.[k as 'title'] || data[k] !== meta[k as 'title']))
  // an absent sale field takes the seed, including an explicit unset; a value an admin already set stays
  const saleMoved = ['organisation', 'use', 'licence', 'priceInUSDEnabled', 'billedAccount', 'cloudflareAccountId'].filter((k) => k in data && (first as Record<string, unknown> | undefined)?.[k] == null && (first as Record<string, unknown> | undefined)?.[k] !== data[k])
  // a scoped row needs its tenant. A row created before this site was multi-tenant has none, and the plugin refuses to
  // save it until it does — so the tenant is reconciled like a moved field, enough on its own to warrant the update.
  const tenantMoved = 'tenant' in data && (first as { tenant?: unknown } | undefined)?.tenant !== data.tenant
  if (first && (moved.length || saleMoved.length || tenantMoved)) return (await payload.update({ collection: collection as Slug, id: first.id, data: { ...Object.fromEntries([...moved, ...saleMoved].map((k) => [k, data[k]])), ...(tenantMoved ? { tenant: data.tenant } : {}), ...('description' in data || 'title' in data ? { meta: { ...meta, ...Object.fromEntries(['title', 'description'].filter((k) => k in data).map((k) => [k, data[k]])) } } : {}) } as never, overrideAccess: true })) as unknown as Row
  return found[0] ?? ((await payload.create({ collection: collection as Slug, data: data as never, overrideAccess: true })) as unknown as Row)
}

/** THE VERIFICATION, STORED IN THE PAYLOAD DB. Every committed *-receipt.json becomes a quantum-receipts row, so the
 *  verification the unit runs — the gate, the proof, each family — lives in its own store and not only in files, read
 *  back at /quantum-receipts and over the MCP. A `receipts` stream chained by content UUID; idempotent by uuid, so a
 *  receipt already stored is left. quantum-receipts is the shared engine, not tenant-scoped, so it carries no tenant. */
async function seedReceipts(payload: Payload) {
  const genesis = `${cite.href}/receipts`
  let prev = genesis
  for (let i = 0; i < receipts.length; i++) {
    const r = receipts[i]!
    const doc = r.doc as { uuid?: unknown }
    const fold = qpuContentUuidOf(doc)
    const uuid = typeof doc.uuid === 'string' ? doc.uuid : fold
    const row = { uuid, name: r.name, stream: 'receipts', seq: i, prev, subject: r.file, referrer: `${genesis}/${r.name}`, fold }
    const found = (await payload.find({ collection: 'quantum-receipts', where: { uuid: { equals: uuid } }, limit: 1, depth: 0, overrideAccess: true })).docs
    if (!found.length) await payload.create({ collection: 'quantum-receipts', data: row as never, overrideAccess: true })
    prev = uuid
  }
}

/** Every plugin's content: docs with their place in the tree (nested-docs) and in search, redirects for retired routes,
 *  the commercial-licence form (form-builder), the products (ecommerce), the pages and the header and footer globals.
 *  Idempotent, run on init only when the content changed: its content UUID is kept in Payload's KV, so a cold isolate
 *  reads one key, and a build that changes no content seeds nothing. */
/** The seed's state as the site reports it at /api/seed: done, or the cursor and the last failure of a slice. */
export async function seedStateOf(payload: Payload) {
  const fingerprint = qpuContentUuidOf({ ...CONTENT, applier: [ensure, upsertDocs, seedSite, seedReceipts, indexDocs].map(String) })
  const done = (await payload.kv.get<string>('seed')) === fingerprint
  const cursor = await payload.kv.get<{ docs: number; site: boolean; receipts: boolean; index: number }>(`seed:${fingerprint}`)
  const error = await payload.kv.get<{ message: string; when: string }>(`seed:error:${fingerprint}`)
  return { fingerprint, done, docs: generated.length, cursor: cursor ?? null, error: error ?? null }
}

export async function seed(payload: Payload) {
  try { await seedSliceOf(payload) } catch (e) {
    // a slice that failed is written down where the site reports it, then the request goes on; the next request retries
    const fingerprint = qpuContentUuidOf({ ...CONTENT, applier: [ensure, upsertDocs, seedSite, seedReceipts, indexDocs].map(String) })
    await payload.kv.set(`seed:error:${fingerprint}`, { message: String((e as { message?: string })?.message ?? e).slice(0, 500), when: new Date().toISOString() }).catch(() => undefined)
    throw e
  }
}

async function seedSliceOf(payload: Payload) {
  // the content's address and the applier's own text: a change in how rows are written (measured 2026-10-03: ensure
  // learned to update a row's description, and the host kept the old one because the content had not moved) re-runs
  // the seed as a change in what is written does
  const fingerprint = qpuContentUuidOf({ ...CONTENT, applier: [ensure, upsertDocs, seedSite, seedReceipts, indexDocs].map(String) })
  if ((await payload.kv.get<string>('seed')) === fingerprint) return
  // RESUMED, NOT WRITTEN AT ONCE: a request may make only so many storage calls, so each call of the seed does one
  // slice (faces docs) and keeps its cursor under the content's own address; the next request continues; the
  // fingerprint is set only when every slice is done
  const key = `seed:${fingerprint}`
  const take = qpuFacesOf().faces
  const cursor = (await payload.kv.get<{ docs: number; site: boolean; receipts: boolean; index: number }>(key)) ?? { docs: 0, site: false, receipts: false, index: 0 }
  if (cursor.docs < generated.length) {
    await upsertDocs(payload, cursor.docs, take)
    return payload.kv.set(key, { ...cursor, docs: cursor.docs + take })
  }
  if (!cursor.site) {
    await seedSite(payload)
    return payload.kv.set(key, { ...cursor, site: true })
  }
  if (!cursor.receipts) {
    await seedReceipts(payload)
    return payload.kv.set(key, { ...cursor, receipts: true })
  }
  if (cursor.index < generated.length) {
    await indexDocs(payload, cursor.index, take)
    return payload.kv.set(key, { ...cursor, index: cursor.index + take })
  }
  await payload.kv.set('seed', fingerprint)
}

/** The site: redirects, the form, the products, the pages and the globals (a few dozen writes, one slice). */
async function seedSite(payload: Payload) {
  const pages = new Map<string, string>()
  const docId = (slug: string) => generated.find((d) => d.slug === slug)?.id
  const linkOf = (r: Ref, label?: string) => {
    if ('url' in r) return { type: 'custom', url: r.url, ...(label ? { label } : {}) }
    const id = r.ref === 'docs' ? docId(r.slug) : pages.get(r.slug)
    return id ? { type: 'reference', reference: { relationTo: r.ref, value: id }, ...(label ? { label } : {}) } : { type: 'custom', url: `/${r.slug}`, ...(label ? { label } : {}) }
  }
  // the tenant this host resolves to, stamped on every page the plugin scopes; tenants itself is unscoped, so it needs none
  const tenant = (await ensure(payload, 'tenants', 'domain', ROOT_TENANT.domain, ROOT_TENANT)).id
  const form = await ensure(payload, 'forms', 'title', FORM.title, FORM)
  for (const p of PRODUCTS) await ensure(payload, 'products', 'slug', p.slug, p)
  for (const p of PAGES) {
    const layout = p.layout.map((b) => (b.blockType === 'form' ? { ...b, form: form.id } : b))
    pages.set(p.slug, (await ensure(payload, 'pages', 'slug', p.slug, { ...p, layout, _status: 'published', tenant })).id)
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
}

// the docs as generated, each upserted at its own id with its place under the index (nested-docs); SEO is filled by the
// collection's own hook on save. Read by id, written only when its content UUID changed or its parent is missing.
async function upsertDocs(payload: Payload, from: number, take: number) {
  const index = generated.find((d) => d.slug === 'index')
  // docs are tenant-scoped like pages; stamp the same root tenant so a request to this host reads them
  const tenant = (await ensure(payload, 'tenants', 'domain', ROOT_TENANT.domain, ROOT_TENANT)).id
  await Promise.all(generated.slice(from, from + take).map(async (doc) => {
    const parent = index && doc.slug !== 'index' ? index.id : undefined
    const old = (await payload.findByID({ collection: 'docs', id: doc.id, depth: 0, disableErrors: true, overrideAccess: true })) as { uuid?: string; parent?: unknown; tenant?: unknown } | null
    const data = { ...doc, ...(parent ? { parent } : {}), tenant } as never
    if (!old) await payload.create({ collection: 'docs', data, overrideAccess: true })
    // the uuid moved, the parent is missing, or the doc predates multi-tenant and carries no tenant: write it
    else if (old.uuid !== doc.uuid || (parent && !old.parent) || !old.tenant) await payload.update({ collection: 'docs', id: doc.id, data, overrideAccess: true })
  }))
}

// the search plugin indexes a doc when it is saved: the docs it has not indexed are saved once, the rest left alone
async function indexDocs(payload: Payload, from: number, take: number) {
  const found = (await payload.find({ collection: 'search', limit: 0, pagination: false, depth: 0, overrideAccess: true })).docs as unknown as { doc?: { value?: unknown } }[]
  const indexed = new Set(found.map((s) => (s.doc?.value && typeof s.doc.value === 'object' ? (s.doc.value as { id: string }).id : String(s.doc?.value ?? ''))))
  for (const d of generated.slice(from, from + take).filter((x) => !indexed.has(x.id))) await payload.update({ collection: 'docs', id: d.id, data: { title: d.title }, overrideAccess: true })
}
