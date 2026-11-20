// What Payload holds of the Lean catalogue: the pages, categories, products and variants, planned from the indexes Lean
// writes. A clause is a page; a module is a page nested under its clause and a category; a theorem is a product of
// that category; each example the theorem names is a variant of the product, an option of the one variant type.
// Pure: the plan is data, and src/scripts/seedCatalogue.ts writes it through Payload's local API.
import { NESTED } from './nested-index.ts'
import { MODULE_DOCS, THEOREMS } from './theorems-index.ts'
import { TENANTS } from './unit/tenants.ts'

export const slugOf = (name: string) => name.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase()

const paragraph = (text: string) => ({ type: 'paragraph' as const, version: 1, format: '' as const, indent: 0, direction: 'ltr' as const, textFormat: 0, textStyle: '', children: [{ type: 'text' as const, version: 1, text, format: 0, mode: 'normal' as const, style: '', detail: 0 }] })
/** Lexical rich text of the lines given, one paragraph each. */
export const richText = (lines: readonly string[]) => ({ root: { type: 'root' as const, version: 1, direction: 'ltr' as const, format: '' as const, indent: 0, children: lines.filter((line) => line.trim().length > 0).map(paragraph) } })

/** The prose of a module doc: its title line and any frontmatter left out. */
const proseOf = (doc: string | undefined) => {
  const lines = (doc ?? '').split('\n').map((line) => line.trim())
  const body = lines[1] === '---' ? lines.slice(lines.indexOf('---', 2) + 1) : lines.slice(1)
  return body.join(' ').replace(/\s+/g, ' ').trim()
}

export const VARIANT_TYPE = { name: 'example', label: 'Example' } as const

/** The whole plan, or the plan of the modules named. */
export const planCatalogue = (only?: readonly string[]) => {
  const [domain, tenant] = Object.entries(TENANTS)[0]!
  const stated = new Map(THEOREMS.map((t) => [t.key, t]))
  const modules = NESTED.filter((page) => !only?.length || only.includes(page.module))
  const clauses = [...new Set(modules.map((page) => page.clause))]
  const pages = [
    ...clauses.map((clause) => ({ title: clause, slug: slugOf(clause), parent: null as string | null, text: [clause] })),
    ...modules.map((page) => ({ title: page.module, slug: slugOf(page.module), parent: slugOf(page.clause), text: [proseOf(MODULE_DOCS[page.module]) || page.module] })),
  ]
  const categories = modules.filter((page) => page.products.length > 0).map((page) => ({ title: page.module, slug: slugOf(page.module) }))
  const products = modules.flatMap((page) => page.products.map((product) => {
    const theorem = stated.get(product.theorem)
    return { title: product.theorem, slug: slugOf(product.theorem), category: slugOf(page.module), description: [theorem?.doc ?? '', theorem?.statement ?? ''], variants: [...product.variants] }
  }))
  const options = [...new Set(products.flatMap((product) => product.variants))].sort()
  return { tenant: { name: tenant, slug: tenant, domain }, variantType: VARIANT_TYPE, options, pages, categories, products, counts: { pages: pages.length, categories: categories.length, products: products.length, variants: products.reduce((n, p) => n + p.variants.length, 0), options: options.length } }
}
