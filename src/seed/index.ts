import type { Payload } from 'payload'
import { qpuContentUuidOf } from '@uuidna/qpu'
import { docs as generated } from './docs'

type Row = Record<string, unknown> & { id: string }
type Slug = Parameters<Payload['find']>[0]['collection']

// ---------------------------------------------------------------------------------------------------------------------
// THE CONTENT: what the seed writes, as data. A reference names its target by collection and slug (or a form by title)
// and is resolved when written, so this data is the same in every build and its content UUID is the seed's fingerprint.
// ---------------------------------------------------------------------------------------------------------------------

type Ref = { ref: 'pages' | 'docs'; slug: string } | { url: string }
type NavItem = Ref & { label: string }

const lexical = (text: string) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, children: [{ type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '', version: 1 }] }] },
})
const url = (href: string, label: string): NavItem => ({ url: href, label })
// a block's link field, as Payload stores it
const link = (href: string, label: string) => ({ link: { type: 'custom', url: href, label } })

const REDIRECTS: [string, Ref][] = [
  ['/clay', { url: '/' }],
  ['/clay/proofs', { ref: 'docs', slug: 'proof' }],
  ['/clay/formulas', { url: '/' }],
  ['/formulas', { url: '/' }],
  ['/mcp', { ref: 'docs', slug: 'agents' }],
]

const FORM = {
  title: 'Commercial license request',
  submitButtonLabel: 'Request a commercial license',
  confirmationType: 'message',
  confirmationMessage: lexical('Thank you. Your request is recorded and will be answered by email.'),
  fields: [
    { blockType: 'text', name: 'name', label: 'Name', required: true, width: 50 },
    { blockType: 'email', name: 'email', label: 'Email', required: true, width: 50 },
    { blockType: 'text', name: 'organisation', label: 'Organisation', width: 100 },
    { blockType: 'textarea', name: 'use', label: 'Intended commercial use', required: true, width: 100 },
  ],
}

// QPU billing through ecommerce: reads are free; what is billed is commercial use and the right to write to storage
const PRODUCTS = [
  { title: 'QPU storage writes', slug: 'qpu-storage-writes', description: 'Reads of qpu.uuidna.com are free and open. Writes to the QPU document store need a bearer token; this plan issues one, priced on request.', priceInUSDEnabled: false, _status: 'published' },
  { title: 'Commercial license', slug: 'commercial-license', description: '@uuidna/qpu is licensed CC BY-NC-ND 4.0: non-commercial use only. Commercial use needs this license, priced per organisation on request.', priceInUSDEnabled: false, _status: 'published' },
]

/** The public site as payloadcms/website builds its own: pages composed of blocks. */
const PAGES: { slug: string; title: string; description: string; layout: Record<string, unknown>[] }[] = [
  { slug: 'home', title: 'UUIDNA QPU', description: 'An exact quantum processing unit served over MCP: hex-addressed formula families, Lean-checked theorems, live public data and quantum receipts.', layout: [
    { blockType: 'hero', badge: 'RFC 9562 v8 · hex programs · quantum receipts', heading: 'Every formula is an address.', emphasis: 'Every composition is a program.', links: [link('/#families', 'Explore the formulas'), link('/data', 'Live data checks'), link('/index', 'Documentation')] },
    { blockType: 'stats' },
    { blockType: 'wings', heading: 'What QPU does', intro: 'Each wing as its own page reports it: capabilities, the predicates that check them, and how many hold right now.' },
    { blockType: 'receipts', heading: 'Evidence', intro: 'Every committed receipt and the facts it records. Each one is a node of the final build receipt in the README.' },
    { blockType: 'clay', heading: 'Clay Millennium Prize Problems', intro: "The author claims solutions to the Millennium Prize Problems, composed by the unit's cross formulas across its families. Each claim links to the document that states it." },
    { blockType: 'families', heading: 'Formula families', anchor: 'families', intro: 'Every family at its own name.' },
    { blockType: 'docs', heading: 'Documentation' },
  ] },
  { slug: 'discover', title: 'Discovery', description: 'Cross-formulated solutions across every formula family: values reached by programs of two or more families, with the live public data that fed them.', layout: [
    { blockType: 'discovery', heading: 'Discovery', intro: 'Every family, every program of one formula and every composition of two, over parameters that fit the hex split (one 48-bit, two 24-bit or three 16-bit naturals), with numbers read live from public sources as inputs. A value reached by two or more families is a cross-formulated solution.' },
  ] },
  { slug: 'data', title: 'Live data checks', description: 'Public datasets read live and checked against the unit: CERN Open Data, NIST CODATA, OEIS, Zenodo, DataCite, ORCID, GitHub, npm and every catalogue the unit names.', layout: [
    { blockType: 'live', heading: 'Live data checks', intro: 'Read from the public source and compared with what the unit proves or computes. The same check is the MCP tool qpu_data.' },
  ] },
  { slug: 'license', title: 'License and billing', description: 'QPU is CC BY-NC-ND 4.0: reads are free and non-commercial use is open. Commercial use and storage writes are licensed.', layout: [
    { blockType: 'products', heading: 'License and billing', intro: '@uuidna/qpu is licensed CC BY-NC-ND 4.0. Reading qpu.uuidna.com and its MCP is free; non-commercial use with attribution is open. What is billed is commercial use and the right to write to the QPU document store.' },
    { blockType: 'form', form: { formTitle: FORM.title } },
  ] },
  { slug: 'heat', title: 'Heat', description: 'Code quality by temperature and time: each file measured by git and run through the heat family, photon / thermal T from Qpu.Physics.', layout: [
    { blockType: 'receipt', file: 'heat-receipt.json', heading: 'Heat', intro: "A file's temperature is its commits per thousand days; its signal is the unit's photon / thermal T (theorem temperature: 23 at 10 mK, 0 at 4000 mK); its coherence time is the days it holds per fix. Hot files hold no signal: the split shown is the number of ways that would cool each one below the threshold. A row holds when the file is cold." },
  ] },
  { slug: 'search', title: 'Search', description: 'Search the QPU documentation and pages.', layout: [{ blockType: 'search', heading: 'Search' }] },
]

const HEADER: NavItem[] = [url('/#families', 'Formulas'), { ref: 'pages', slug: 'discover', label: 'Discovery' }, { ref: 'pages', slug: 'data', label: 'Live data' }, { ref: 'docs', slug: 'index', label: 'Docs' }, { ref: 'pages', slug: 'search', label: 'Search' }, { ref: 'pages', slug: 'license', label: 'License' }]
const FOOTER = {
  copyright: '© Tsvetan Rouschev · CC BY-NC-ND 4.0',
  navItems: [{ ref: 'pages', slug: 'home', label: 'Home' }, { ref: 'pages', slug: 'license', label: 'Commercial license' }, url('https://qpu.uuidna.com/mcp', 'MCP'), url('https://github.com/uuidna/qpu', 'GitHub'), url('https://doi.org/10.5281/zenodo.23091364', 'DOI')] as NavItem[],
}

const CONTENT = { docs: generated.map((d) => d.uuid), REDIRECTS, FORM, PRODUCTS, PAGES, HEADER, FOOTER }

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
  for (const [from, to] of REDIRECTS) await ensure(payload, 'redirects', 'from', from, { from, to: linkOf(to) })
  const form = await ensure(payload, 'forms', 'title', FORM.title, FORM)
  for (const p of PRODUCTS) await ensure(payload, 'products', 'slug', p.slug, p)
  for (const p of PAGES) {
    const layout = p.layout.map((b) => (b.blockType === 'form' ? { ...b, form: form.id } : b))
    pages.set(p.slug, (await ensure(payload, 'pages', 'slug', p.slug, { ...p, layout, _status: 'published' })).id)
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
