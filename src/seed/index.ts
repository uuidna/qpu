import type { Payload } from 'payload'
import { qpuContentUuidOf } from '@uuidna/qpu'
import { docs as generated } from './docs'

type Row = Record<string, unknown> & { id: string }
type Slug = Parameters<Payload['find']>[0]['collection']

/** Created when missing and never overwritten: what an admin edits afterwards stays. */
const ensure = async (payload: Payload, collection: string, field: string, value: string, data: Record<string, unknown>): Promise<Row> => {
  const found = (await payload.find({ collection: collection as Slug, where: { [field]: { equals: value } }, limit: 0, pagination: false, depth: 0, sort: 'createdAt', overrideAccess: true })).docs as unknown as Row[]
  // two seeds racing on cold isolates can both create: the oldest stays, the copies go
  for (const copy of found.slice(1)) await payload.delete({ collection: collection as Slug, id: copy.id, overrideAccess: true })
  return found[0] ?? ((await payload.create({ collection: collection as Slug, data: data as never, overrideAccess: true })) as unknown as Row)
}

const lexical = (text: string) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, children: [{ type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '', version: 1 }] }] },
})

/** Every plugin's content: docs with SEO and their place in the tree (nested-docs), the search index, redirects for retired
 *  routes, the commercial-licence form (form-builder) and product (ecommerce), the pages and globals. Idempotent; runs on
 *  init, but only when what it would write changed: its fingerprint (the docs' content UUIDs and the seed's own code) is
 *  kept in Payload's KV, so a cold isolate reads one key instead of re-walking the store before its first answer. */
export async function seed(payload: Payload) {
  const fingerprint = qpuContentUuidOf({ docs: generated.map((d) => d.uuid), code: [ensure, seedBody, seedSite, upsertDocs, indexDocs].map(String) })
  if ((await payload.kv.get<string>('seed')) === fingerprint) return
  await seedBody(payload)
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

async function seedBody(payload: Payload) {
  await upsertDocs(payload)
  const docs = generated as unknown as DocRow[]
  const docBySlug = (slug: string) => docs.find((d) => d.slug === slug)
  const redirects: [string, { type: 'custom'; url: string } | { type: 'reference'; slug: string }][] = [
    ['/clay', { type: 'custom', url: '/' }],
    ['/clay/proofs', { type: 'reference', slug: 'proof' }],
    ['/clay/formulas', { type: 'custom', url: '/' }],
    ['/formulas', { type: 'custom', url: '/' }],
    ['/mcp', { type: 'reference', slug: 'agents' }],
  ]
  for (const [from, to] of redirects) {
    const target = to.type === 'custom' ? to : docBySlug(to.slug) ? { type: 'reference', reference: { relationTo: 'docs', value: docBySlug(to.slug)!.id } } : { type: 'custom', url: '/' }
    await ensure(payload, 'redirects', 'from', from, { from, to: to.type === 'custom' ? to : target })
  }

  await ensure(payload, 'forms', 'title', 'Commercial license request', {
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
  })

  // QPU billing through ecommerce: reads are free; what is billed is commercial use and the right to write to storage
  await ensure(payload, 'products', 'slug', 'qpu-storage-writes', {
    title: 'QPU storage writes',
    slug: 'qpu-storage-writes',
    description: 'Reads of qpu.uuidna.com are free and open. Writes to the QPU document store need a bearer token; this plan issues one, priced on request.',
    priceInUSDEnabled: false,
    _status: 'published',
  })

  await seedSite(payload, docs)

  await ensure(payload, 'products', 'slug', 'commercial-license', {
    title: 'Commercial license',
    slug: 'commercial-license',
    description: '@uuidna/qpu is licensed CC BY-NC-ND 4.0: non-commercial use only. Commercial use needs this license, priced per organisation on request.',
    priceInUSDEnabled: false,
    _status: 'published',
  })

  // last, because it is the only step that can be long: saving the docs the search index lacks
  await indexDocs(payload)
}

type DocRow = Row & { slug: string }
const ref = (relationTo: 'pages' | 'docs', id: string, label: string) => ({ link: { type: 'reference', reference: { relationTo, value: id }, label } })
const url = (href: string, label: string) => ({ link: { type: 'custom', url: href, label } })

/** The public site as payloadcms/website builds its own: pages composed of blocks, and the header and footer as globals.
 *  Created when missing; what an editor changes afterwards stays. */
async function seedSite(payload: Payload, docs: DocRow[]) {
  const form = (await payload.find({ collection: 'forms', where: { title: { equals: 'Commercial license request' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as unknown as Row | undefined
  const page = (slug: string, title: string, description: string, layout: Record<string, unknown>[]) =>
    ensure(payload, 'pages', 'slug', slug, { slug, title, description, layout, _status: 'published' })

  const home = await page('home', 'UUIDNA QPU', 'An exact quantum processing unit served over MCP: hex-addressed formula families, Lean-checked theorems, live public data and quantum receipts.', [
    { blockType: 'hero', badge: 'RFC 9562 v8 · hex programs · quantum receipts', heading: 'Every formula is an address.', emphasis: 'Every composition is a program.', links: [url('/#families', 'Explore the formulas'), url('/data', 'Live data checks'), url('/index', 'Documentation')] },
    { blockType: 'stats' },
    { blockType: 'wings', heading: 'What QPU does', intro: 'Each wing as its own page reports it: capabilities, the predicates that check them, and how many hold right now.' },
    { blockType: 'receipts', heading: 'Evidence', intro: 'Every committed receipt and the facts it records. Each one is a node of the final build receipt in the README.' },
    { blockType: 'clay', heading: 'Clay Millennium Prize Problems', intro: "The author claims solutions to the Millennium Prize Problems, composed by the unit's cross formulas across its families. Each claim links to the document that states it." },
    { blockType: 'families', heading: 'Formula families', anchor: 'families', intro: 'Every family at its own name.' },
    { blockType: 'docs', heading: 'Documentation' },
  ])
  const discover = await page('discover', 'Discovery', 'Cross-formulated solutions across every formula family: values reached by programs of two or more families, with the live public data that fed them.', [
    { blockType: 'discovery', heading: 'Discovery', intro: 'Every family, every program of one formula and every composition of two, over parameters that fit the hex split (one 48-bit, two 24-bit or three 16-bit naturals), with numbers read live from public sources as inputs. A value reached by two or more families is a cross-formulated solution.' },
  ])
  const data = await page('data', 'Live data checks', 'Public datasets read live and checked against the unit: CERN Open Data, NIST CODATA, OEIS, Zenodo, DataCite, ORCID, GitHub, npm and every catalogue the unit names.', [
    { blockType: 'live', heading: 'Live data checks', intro: 'Read from the public source and compared with what the unit proves or computes. The same check is the MCP tool qpu_data.' },
  ])
  const license = await page('license', 'License and billing', 'QPU is CC BY-NC-ND 4.0: reads are free and non-commercial use is open. Commercial use and storage writes are licensed.', [
    { blockType: 'products', heading: 'License and billing', intro: '@uuidna/qpu is licensed CC BY-NC-ND 4.0. Reading qpu.uuidna.com and its MCP is free; non-commercial use with attribution is open. What is billed is commercial use and the right to write to the QPU document store.' },
    ...(form ? [{ blockType: 'form', form: form.id }] : []),
  ])
  await page('heat', 'Heat', 'Code quality by temperature and time: each file measured by git and run through the heat family, photon / thermal T from Qpu.Physics.', [
    { blockType: 'receipt', file: 'heat-receipt.json', heading: 'Heat', intro: "A file's temperature is its commits per thousand days; its signal is the unit's photon / thermal T (theorem temperature: 23 at 10 mK, 0 at 4000 mK); its coherence time is the days it holds per fix. Hot files hold no signal: the split shown is the number of ways that would cool each one below the threshold. A row holds when the file is cold." },
  ])
  const search = await page('search', 'Search', 'Search the QPU documentation and pages.', [{ blockType: 'search', heading: 'Search' }])

  const index = docs.find((d) => d.slug === 'index')
  const header = (await payload.findGlobal({ slug: 'header', depth: 0, overrideAccess: true })) as { navItems?: unknown[] }
  if (!header.navItems?.length)
    await payload.updateGlobal({ slug: 'header', overrideAccess: true, data: { navItems: [url('/#families', 'Formulas'), ref('pages', discover.id, 'Discovery'), ref('pages', data.id, 'Live data'), ...(index ? [ref('docs', index.id, 'Docs')] : []), ref('pages', search.id, 'Search'), ref('pages', license.id, 'License')] } as never })
  const footer = (await payload.findGlobal({ slug: 'footer', depth: 0, overrideAccess: true })) as { navItems?: unknown[]; copyright?: string }
  if (!footer.navItems?.length)
    await payload.updateGlobal({ slug: 'footer', overrideAccess: true, data: { copyright: '© Tsvetan Rouschev · CC BY-NC-ND 4.0', navItems: [ref('pages', home.id, 'Home'), ref('pages', license.id, 'Commercial license'), url('https://qpu.uuidna.com/mcp', 'MCP'), url('https://github.com/uuidna/qpu', 'GitHub'), url('https://doi.org/10.5281/zenodo.23091364', 'DOI')] } as never })
}
