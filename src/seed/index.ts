import type { Payload } from 'payload'
import { qpuCiteOf, qpuContentUuidOf, qpuFacesOf, qpuInstallOf, qpuPurposeOf } from '@uuidna/qpu'
// the app consumes QPU through the package (its built dist), not src internals — so a bundler never recompiles the
// index<->lattice core and the Payload-default app stays close to the template.
import { formulatedCatalogOf, saleRoyaltyOf } from '@uuidna/qpu/payload/plugins'
import { receipts } from '../receipts/index'
import { docs as generated } from './docs'

type Row = Record<string, unknown> & { id: string }
type Slug = Parameters<Payload['find']>[0]['collection']

// ---------------------------------------------------------------------------------------------------------------------
// THE CONTENT IS A COMBINATION. Nothing here is written by hand: the docs are generated, each committed receipt is a row,
// the footer is the citation, the licence is the citation's. Pages are no longer built from Payload blocks — the unit's
// own lean surface (qpuPageOf, the docs and the formula families) serves the site. A reference names its target by
// collection and slug (or a url) and is resolved when written, so this data is the same in every build and its content
// UUID is the seed's fingerprint.
// ---------------------------------------------------------------------------------------------------------------------

type Ref = { ref: 'docs'; slug: string } | { url: string }
type NavItem = Ref & { label: string }

const lexical = (text: string) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, children: [{ type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '', version: 1 }] }] },
})
const url = (href: string, label: string): NavItem => ({ url: href, label })

// what the unit says of itself: the citation (origin, author, DOIs, licence), the install manifest (the repository), the
// purpose (the platform, its qubits, the factoring)
const cite = qpuCiteOf() as unknown as { href: string; website: string; doi: string; identifier: string; author: { first: string; last: string; orcid: string }; '@context': [string, Record<string, string>] }
const repo = /[?&]url=(https:\/\/github\.com\/[^&]+)/.exec((qpuInstallOf() as unknown as { cloudflare: { qpu: string } }).cloudflare.qpu)?.[1] ?? cite.href
const packageName = `@${repo.replace(/^https:\/\/github\.com\//, '')}`
const cc = cite['@context'][1].cc ?? ''
const licence = { url: cc, name: `CC ${(/licenses\/([a-z-]+)\/([\d.]+)/.exec(cc)?.[1] ?? '').toUpperCase()} ${/licenses\/[a-z-]+\/([\d.]+)/.exec(cc)?.[1] ?? ''}`.trim() }
const purpose = qpuPurposeOf() as unknown as { nature: { platform: string; qubits: number }; cybersecurity: { n: number; factors: readonly [number, number] } }
void purpose
// THE ROOT TENANT. This site is one app, and the multi-tenant plugin scopes every doc to a tenant, so the seed's own
// content must be stamped with one — the tenant whose domain is this host, which is the same tenant a request to this
// host resolves to. Without it every doc create is refused ("Assigned Tenant is invalid") and nothing gets built.
const ROOT_TENANT = { name: cite.website, domain: cite.website }
/** Sold tenants from formulatedCatalogOf (root + perma); reserved zone labels are not seeded as tenants. */
const SOLD_TENANTS = formulatedCatalogOf().seedTenants

// Sale record. Price stays off, so it holds false until the author sets one. Cloudflare for SaaS custom hostname billing bills the other user's Cloudflare account; the account id stays unset. No card is stored.
// A sale on this uuidna.com host pays publishing.royalty. The rate integer is unset; the formula returns 0 and holds false.
// Offers come from formulatedCatalogOf — doors/harnesses/arities/lattice names only; no invented SKUs or prices.
const royalty = saleRoyaltyOf(cite.website)
const catalog = formulatedCatalogOf()
const PRODUCTS = catalog.seedProducts.map((p) => ({
  ...p,
  organisation: null as null,
  use: null as null,
  billedAccount: p.slug === 'commercial-license' ? 'other-cloudflare-account' : null,
  cloudflareAccountId: null as null,
  royalty,
  description:
    p.slug === 'commercial-license'
      ? `${packageName} is licensed ${licence.name}: non-commercial use only. Commercial use needs this license, priced per organisation on request.`
      : p.slug === 'storage-writes'
        ? `Reads of ${cite.website} are free and open. Writes to the document store need a bearer token; this plan issues one, priced on request.`
        : p.description,
}))
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
const HEADER: NavItem[] = [...(index ? [{ ref: 'docs' as const, slug: 'index', label: 'Docs' }] : []), url('/license', 'License')]
const FOOTER = {
  copyright: `© ${cite.author.first} ${cite.author.last} · ${licence.name}`,
  navItems: [url('/license', PRODUCTS[0]!.title), url(`${cite.href}/mcp`, 'MCP'), url(repo, 'GitHub'), url(cite.identifier, 'DOI'), url(cite.author.orcid, 'ORCID')] as NavItem[],
}

const CONTENT = { tenant: ROOT_TENANT, tenants: SOLD_TENANTS, docs: generated.map((d) => d.uuid), receipts: receipts.map((r) => r.name), FORM, PRODUCTS, HEADER, FOOTER }

// ---------------------------------------------------------------------------------------------------------------------
// THE APPLIER
// ---------------------------------------------------------------------------------------------------------------------

/** Created when missing and never overwritten: what an admin edits afterwards stays. Copies a racing seed made go. */
const ensure = async (payload: Payload, collection: string, field: string, value: string, data: Record<string, unknown>): Promise<Row> => {
  const found = (await payload.find({ collection: collection as Slug, where: { [field]: { equals: value } }, limit: 0, pagination: false, depth: 0, sort: 'createdAt', overrideAccess: true })).docs as unknown as Row[]
  for (const copy of found.slice(1)) await payload.delete({ collection: collection as Slug, id: copy.id, overrideAccess: true })
  const first = found[0] as (Row & { title?: unknown; description?: unknown }) | undefined
  const meta = (first as { meta?: { title?: unknown; description?: unknown } } | undefined)?.meta ?? {}
  const moved = ['title', 'description'].filter((k) => k in data && (data[k] !== first?.[k as 'title'] || data[k] !== meta[k as 'title']))
  const saleMoved = ['organisation', 'use', 'licence', 'priceInUSDEnabled', 'billedAccount', 'cloudflareAccountId', 'royalty'].filter((k) => k in data && (first as Record<string, unknown> | undefined)?.[k] == null && (first as Record<string, unknown> | undefined)?.[k] !== data[k])
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
    const fingerprint = qpuContentUuidOf({ ...CONTENT, applier: [ensure, upsertDocs, seedSite, seedReceipts, indexDocs].map(String) })
    await payload.kv.set(`seed:error:${fingerprint}`, { message: String((e as { message?: string })?.message ?? e).slice(0, 500), when: new Date().toISOString() }).catch(() => undefined)
    throw e
  }
}

async function seedSliceOf(payload: Payload) {
  const fingerprint = qpuContentUuidOf({ ...CONTENT, applier: [ensure, upsertDocs, seedSite, seedReceipts, indexDocs].map(String) })
  if ((await payload.kv.get<string>('seed')) === fingerprint) return
  // RESUMED, NOT WRITTEN AT ONCE: a request may make only so many storage calls, so each call of the seed does one
  // slice (faces docs) and keeps its cursor under the content's own address; the next request continues.
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

/** The site: tenants, the licence form, the products and the header and footer globals (a few writes, one slice). */
async function seedSite(payload: Payload) {
  const docId = (slug: string) => generated.find((d) => d.slug === slug)?.id
  const linkOf = (r: Ref, label?: string) => {
    if ('url' in r) return { type: 'custom', url: r.url, ...(label ? { label } : {}) }
    const id = docId(r.slug)
    return id ? { type: 'reference', reference: { relationTo: r.ref, value: id }, ...(label ? { label } : {}) } : { type: 'custom', url: `/${r.slug}`, ...(label ? { label } : {}) }
  }
  // tenants the catalog sells/serves (root host + perma); tenants collection is unscoped
  for (const t of SOLD_TENANTS) await ensure(payload, 'tenants', 'domain', t.domain, t)
  await ensure(payload, 'tenants', 'domain', ROOT_TENANT.domain, ROOT_TENANT)
  await ensure(payload, 'forms', 'title', FORM.title, FORM)
  for (const p of PRODUCTS) await ensure(payload, 'products', 'slug', p.slug, p)
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
  const tenant = (await ensure(payload, 'tenants', 'domain', ROOT_TENANT.domain, ROOT_TENANT)).id
  await Promise.all(generated.slice(from, from + take).map(async (doc) => {
    const parent = index && doc.slug !== 'index' ? index.id : undefined
    const old = (await payload.findByID({ collection: 'docs', id: doc.id, depth: 0, disableErrors: true, overrideAccess: true })) as { uuid?: string; parent?: unknown; tenant?: unknown } | null
    const data = { ...doc, ...(parent ? { parent } : {}), tenant } as never
    if (!old) await payload.create({ collection: 'docs', data, overrideAccess: true })
    else if (old.uuid !== doc.uuid || (parent && !old.parent) || !old.tenant) await payload.update({ collection: 'docs', id: doc.id, data, overrideAccess: true })
  }))
}

// the search plugin indexes a doc when it is saved: the docs it has not indexed are saved once, the rest left alone
async function indexDocs(payload: Payload, from: number, take: number) {
  const found = (await payload.find({ collection: 'search', limit: 0, pagination: false, depth: 0, overrideAccess: true })).docs as unknown as { doc?: { value?: unknown } }[]
  const indexed = new Set(found.map((s) => (s.doc?.value && typeof s.doc.value === 'object' ? (s.doc.value as { id: string }).id : String(s.doc?.value ?? ''))))
  for (const d of generated.slice(from, from + take).filter((x) => !indexed.has(x.id))) await payload.update({ collection: 'docs', id: d.id, data: { title: d.title }, overrideAccess: true })
}
