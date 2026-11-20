// Payload holds the Lean catalogue. This writes the plan (catalogue-seed.ts) through Payload's local API: the tenant,
// the clause and module pages, the categories, the one variant type with an option for each example, a product for
// each theorem and a variant for each of its examples. The seed runs with no user, so each call overrides access, as
// Payload's local API asks of a script. Every write finds its document first, so a second run changes
// nothing that already agrees. SEED_CHECK=1 writes nothing and fails when a document is missing. SEED_MODULES names
// the modules to seed, comma separated; without it the whole catalogue is seeded.
import { planCatalogue, richText } from '../quantum/processing/catalogue-seed.ts'

const check = process.env.SEED_CHECK === '1'
const only = (process.env.SEED_MODULES ?? '').split(',').map((name) => name.trim()).filter(Boolean)
const plan = planCatalogue(only)
const { default: config } = await import('../payload.config.ts')
const { getPayload } = await import('payload')
const payload = await getPayload({ config })
const context = { disableRevalidate: true, disableRelease: true }
let written = 0, missing = 0

type Doc = { id: number | string } & Record<string, unknown>
/** Find one document, and create or update it when it is absent or differs in a field the plan states. */
const hold = async (collection: string, where: Record<string, unknown>, data: Record<string, unknown>, same: (doc: Doc) => boolean = () => true): Promise<Doc | null> => {
  const found = (await payload.find({ collection: collection as never, where: where as never, limit: 1, depth: 0, draft: true, pagination: false, overrideAccess: true })).docs[0] as Doc | undefined
  if (found && same(found)) return found
  if (check) { missing += 1; return found ?? null }
  written += 1
  return (found ? await payload.update({ collection: collection as never, id: found.id, data: data as never, context, draft: false, overrideAccess: true }) : await payload.create({ collection: collection as never, data: data as never, context, draft: false, overrideAccess: true })) as unknown as Doc
}
const idOf = (doc: Doc | null) => doc?.id ?? null
const refersTo = (value: unknown, id: unknown) => (typeof value === 'object' && value !== null ? (value as Doc).id : value) === id

const tenant = await hold('tenants', { slug: { equals: plan.tenant.slug } }, plan.tenant)
const type = await hold('variantTypes', { name: { equals: plan.variantType.name } }, plan.variantType)
const options = new Map<string, Doc | null>()
for (const value of plan.options) options.set(value, await hold('variantOptions', { and: [{ value: { equals: value } }, { variantType: { equals: idOf(type) } }] }, { label: value, value, variantType: idOf(type) }))
const pages = new Map<string, Doc | null>()
for (const page of plan.pages) {
  const parent = page.parent ? idOf(pages.get(page.parent) ?? null) : null
  const layout = [{ blockType: 'content', columns: [{ size: 'full', richText: richText(page.text) }] }]
  pages.set(page.slug, await hold('pages', { slug: { equals: page.slug } }, { title: page.title, slug: page.slug, tenant: idOf(tenant), parent, hero: { type: 'lowImpact' }, layout, _status: 'published' }, (doc) => doc.title === page.title && doc._status === 'published' && refersTo(doc.parent ?? null, parent)))
}
const categories = new Map<string, Doc | null>()
for (const category of plan.categories) categories.set(category.slug, await hold('categories', { slug: { equals: category.slug } }, category, (doc) => doc.title === category.title))
let variants = 0
for (const product of plan.products) {
  const category = idOf(categories.get(product.category) ?? null)
  const data = { title: product.title, slug: product.slug, tenant: idOf(tenant), description: richText(product.description), categories: category === null ? [] : [category], enableVariants: product.variants.length > 0, variantTypes: product.variants.length > 0 ? [idOf(type)] : [], _status: 'published' }
  const held = await hold('products', { slug: { equals: product.slug } }, data, (doc) => doc.title === product.title && doc._status === 'published' && Boolean(doc.enableVariants) === product.variants.length > 0)
  for (const example of product.variants) {
    const option = idOf(options.get(example) ?? null)
    await hold('variants', { and: [{ product: { equals: idOf(held) } }, { options: { in: [option] } }] }, { title: `${product.title} / ${example}`, product: idOf(held), options: [option], _status: 'published' })
    variants += 1
  }
}
console.log(JSON.stringify({ check, modules: only.length || 'all', ...plan.counts, variantsHeld: variants, written, missing, allowsDeploy: check ? missing === 0 : true }))
if (check && missing > 0) process.exit(1)
process.exit(0)
