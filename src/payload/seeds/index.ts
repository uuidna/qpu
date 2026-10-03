import type { Payload } from 'payload'
import { seoDescriptionOf, seoTitleOf } from '../collections/docs'
import { seedDocs } from './docs'

type Row = Record<string, unknown> & { id: string }
type Slug = Parameters<Payload['find']>[0]['collection']

/** Created when missing and never overwritten: what an admin edits afterwards stays. */
const ensure = async (payload: Payload, collection: string, field: string, value: string, data: Record<string, unknown>): Promise<Row> => {
  const found = await payload.find({ collection: collection as Slug, where: { [field]: { equals: value } }, limit: 1, depth: 0, overrideAccess: true })
  return ((found.docs[0] as unknown as Row | undefined) ?? ((await payload.create({ collection: collection as Slug, data: data as never, overrideAccess: true })) as unknown as Row))
}

const lexical = (text: string) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, children: [{ type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '', version: 1 }] }] },
})

/** Every plugin's content: docs with SEO and their place in the tree (nested-docs), the search index, redirects for retired
 *  routes, the commercial-licence form (form-builder) and product (ecommerce). Idempotent; runs on init. */
export async function seed(payload: Payload) {
  await seedDocs(payload)

  const docs = (await payload.find({ collection: 'docs', limit: 0, pagination: false, depth: 0, overrideAccess: true })).docs as unknown as (Row & { slug: string; title: string; description?: string; parent?: unknown; meta?: { title?: string; description?: string } })[]
  const index = docs.find((d) => d.slug === 'index')
  const indexed = (await payload.count({ collection: 'search', overrideAccess: true })).totalDocs
  for (const d of docs) {
    const data: Record<string, unknown> = {}
    if (index && d.slug !== 'index' && !d.parent) data.parent = index.id
    if (!d.meta?.title || !d.meta?.description) data.meta = { ...d.meta, title: d.meta?.title || seoTitleOf(d), description: d.meta?.description || seoDescriptionOf(d) }
    // a save is what the search plugin indexes on: an index shorter than the docs is rebuilt by saving them
    if (indexed < docs.length) data.title = d.title
    if (Object.keys(data).length) await payload.update({ collection: 'docs', id: d.id, data, overrideAccess: true })
  }

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

  await ensure(payload, 'products', 'slug', 'commercial-license', {
    title: 'Commercial license',
    slug: 'commercial-license',
    description: '@uuidna/qpu is licensed CC BY-NC-ND 4.0: non-commercial use only. Commercial use needs this license, priced per organisation on request.',
    priceInUSDEnabled: false,
    _status: 'published',
  })
}
