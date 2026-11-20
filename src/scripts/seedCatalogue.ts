// Payload holds the Lean catalogue. This writes the plan (catalogue-seed.ts) through Payload's local API: the tenant,
// the clause and module pages, the categories, a product for each theorem with its own variant type, whose options
// are the examples that theorem names, and a variant for each of them. The seed runs with no user, so each call overrides access, as
// Payload's local API asks of a script. Every write finds its document first, so a second run changes
// nothing that already agrees. SEED_CHECK=1 writes nothing and fails when a document is missing. SEED_MODULES names
// the modules to seed, comma separated; without it the whole catalogue is seeded. Documents that do not depend on one
// another are written together, SEED_TOGETHER at a time (COIN_QUBIT_SPACE when unset): a page waits only for its parent.
import { COIN_QUBIT_SPACE } from '../quantum/processing/config-index.ts'
import { headedText, planCatalogue, richText } from '../quantum/processing/catalogue-seed.ts'

const check = process.env.SEED_CHECK === '1'
const only = (process.env.SEED_MODULES ?? '').split(',').map((name) => name.trim()).filter(Boolean)
const plan = planCatalogue(only)
const { default: config } = await import('../payload.config.ts')
const { getPayload } = await import('payload')
const payload = await getPayload({ config })
const context = { disableRevalidate: true, disableRelease: true }
let written = 0, missing = 0
const width = Math.max(1, Number(process.env.SEED_TOGETHER) || COIN_QUBIT_SPACE)
/** Every item handled, at most `width` at a time; the first failure ends the seed. */
const together = async <T>(items: readonly T[], each: (item: T) => Promise<void>): Promise<void> => {
  let next = 0
  await Promise.all(Array.from({ length: Math.min(width, items.length) }, async () => { while (next < items.length) await each(items[next++]!) }))
}

type Doc = { id: number | string } & Record<string, unknown>
/** Find one document, and create or update it when it is absent or differs in a field the plan states. */
const hold = async (collection: string, where: Record<string, unknown>, data: Record<string, unknown>, same: (doc: Doc) => boolean = () => true): Promise<Doc | null> => {
  const read = async (draft: boolean) => (await payload.find({ collection: collection as never, where: where as never, limit: 1, depth: 0, draft, pagination: false, overrideAccess: true })).docs[0] as Doc | undefined
  // a seed that was stopped between a document and its version leaves the document without one: the latest version
  // does not show it, the collection does, and it is then written again instead of being created twice
  const latest = await read(true)
  const found = latest ?? (await read(false))
  if (latest && same(latest)) return latest
  if (check) { missing += 1; return found ?? null }
  written += 1
  return (found ? await payload.update({ collection: collection as never, id: found.id, data: data as never, context, draft: false, overrideAccess: true }) : await payload.create({ collection: collection as never, data: data as never, context, draft: false, overrideAccess: true })) as unknown as Doc
}
const idOf = (doc: Doc | null) => doc?.id ?? null
/** The SEO plugin's own fields, filled from what the document states: its title, and its text up to the length a description shows. */
const seo = (title: string, text: readonly string[] | string) => ({ title, description: (typeof text === 'string' ? text : text.filter(Boolean).join(' ')).slice(0, 160) })
const titled = (doc: Doc, title: string) => (doc.meta as { title?: string } | undefined)?.title === title
const refersTo = (value: unknown, id: unknown) => (typeof value === 'object' && value !== null ? (value as Doc).id : value) === id

// THE FIRST ADMIN, when the admin panel cannot make one. QPU_ADMIN_EMAIL and QPU_ADMIN_PASSWORD are read from the
// environment and never printed; with either unset, or with any user already held, nothing is done. The users
// collection makes the first user an admin itself (ensureFirstUserIsAdmin).
const admin = { email: process.env.QPU_ADMIN_EMAIL ?? '', password: process.env.QPU_ADMIN_PASSWORD ?? '' }
let firstUser: 'made' | 'held' | 'unset' = 'unset'
if (admin.email && admin.password) {
  const users = await payload.count({ collection: 'users', overrideAccess: true })
  firstUser = users.totalDocs > 0 ? 'held' : 'made'
  if (users.totalDocs === 0 && !check) await payload.create({ collection: 'users', data: { email: admin.email, password: admin.password, roles: ['admin'] } as never, overrideAccess: true })
}

const tenant = await hold('tenants', { slug: { equals: plan.tenant.slug } }, plan.tenant)
const pages = new Map<string, Doc | null>()
// a page is written once its parent is held, so the pages go wave by wave: the roots, then their children
for (let waiting = [...plan.pages]; waiting.length > 0;) {
  const ready = waiting.filter((page) => !page.parent || pages.has(page.parent))
  if (ready.length === 0) throw new Error(`no parent is planned for ${waiting.map((page) => page.slug).join(', ')}`)
  await together(ready, async (page) => {
    const parent = page.parent ? idOf(pages.get(page.parent) ?? null) : null
    const layout = [{ blockType: 'content', columns: [{ size: 'full', richText: richText(page.text) }] }]
    pages.set(page.slug, await hold('pages', { slug: { equals: page.slug } }, { title: page.title, slug: page.slug, tenant: idOf(tenant), parent, hero: { type: 'lowImpact' }, layout, meta: seo(page.title, page.text), _status: 'published' }, (doc) => doc.title === page.title && doc._status === 'published' && titled(doc, page.title) && refersTo(doc.parent ?? null, parent)))
  })
  waiting = waiting.filter((page) => !ready.includes(page))
}
const categories = new Map<string, Doc | null>()
await together(plan.categories, async (category) => void categories.set(category.slug, await hold('categories', { slug: { equals: category.slug } }, category, (doc) => doc.title === category.title)))
let variants = 0
const held = new Map<string, Doc | null>()
await together(plan.products, async (product) => {
  const category = idOf(categories.get(product.category) ?? null)
  const base = { title: product.title, slug: product.slug, tenant: idOf(tenant), description: richText(product.description), categories: category === null ? [] : [category], meta: seo(product.title, product.description), _status: 'published' }
  let made = await hold('products', { slug: { equals: product.slug } }, { ...base, enableVariants: false, variantTypes: [] }, (doc) => doc.title === product.title && doc._status === 'published' && titled(doc, product.title))
  if (product.variants.length > 0 && made) {
    // the product's own variant type: its options are the examples this theorem names, and no other theorem's
    const own = Array.isArray(made.variantTypes) ? made.variantTypes[0] : undefined
    const ownId = typeof own === 'object' && own !== null ? (own as Doc).id : own
    const type = ownId !== undefined && ownId !== null ? ({ id: ownId } as Doc) : await hold('variantTypes', { id: { equals: -1 } }, plan.variantType)
    if (type && !refersTo(own, type.id)) made = await hold('products', { slug: { equals: product.slug } }, { ...base, enableVariants: true, variantTypes: [type.id] }, () => false)
    for (const example of product.variants) {
      const option = idOf(await hold('variantOptions', { and: [{ value: { equals: example } }, { variantType: { equals: idOf(type) } }] }, { label: example, value: example, variantType: idOf(type) }))
      await hold('variants', { and: [{ product: { equals: idOf(made) } }, { options: { in: [option] } }] }, { title: `${product.title} / ${example}`, product: idOf(made), options: [option], _status: 'published' })
      variants += 1
    }
  }
  held.set(product.slug, made)
})
// the home page: the lead in the hero, the text, three products side by side and the rest in a carousel
const featured = plan.home.featured.map((slug) => idOf(held.get(slug) ?? null)).filter((id) => id !== null)
const homeLayout = [
  { blockType: 'content', columns: [{ size: 'full', richText: richText(plan.home.text) }] },
  ...(featured.length === 3 ? [{ blockType: 'threeItemGrid', products: featured }] : []),
  { blockType: 'carousel', populateBy: 'collection', relationTo: 'products', limit: 12 },
]
await hold('pages', { slug: { equals: plan.home.slug } }, { title: plan.home.title, slug: plan.home.slug, tenant: idOf(tenant), hero: { type: 'lowImpact', richText: headedText(plan.home.title, [plan.home.lead]) }, layout: homeLayout, _status: 'published' }, (doc) => doc.title === plan.home.title && doc._status === 'published' && Array.isArray(doc.layout) && doc.layout.length === homeLayout.length && JSON.stringify((doc.hero as { richText?: unknown } | undefined)?.richText ?? null).includes(plan.home.lead))
console.log(JSON.stringify({ check, modules: only.length || 'all', ...plan.counts, variantsHeld: variants, firstUser, written, missing, allowsDeploy: check ? missing === 0 : true }))
if (check && missing > 0) process.exit(1)
process.exit(0)
