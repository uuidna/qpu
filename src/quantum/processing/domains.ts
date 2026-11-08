// Scientific domains, covered at once. OpenAlex returns every domain on one page, and each domain names its fields.
// The cover is the product of those field counts: one combination takes one field from every domain together.
// A domain is not a separate request, and a page that is not the whole set is not the cover.

import { canonicalText, compositions, seal, uuid } from '../uuid/index.ts'

export { domainConfigs } from '../../plugins/domainCover.ts'

export const DOMAINS_URL = 'https://api.openalex.org/domains?page=1'

export type DomainPage = { meta?: { count?: number }; results?: readonly { id?: string; display_name?: string; fields?: readonly { id?: string; display_name?: string }[] }[] }

const formula = 'Π |fields(domain)|' as const

/** No page yet: the formula and the one request that holds every domain. Nothing is fetched here. */
const unmeasured = () => ({
  phase: 'domains' as const,
  atOnce: true as const,
  walked: false as const,
  formula,
  ran: false as const,
  whole: false as const,
  product: null,
  request: { method: 'GET' as const, url: DOMAINS_URL, accept: 'application/json' as const },
  says: 'all scientific domains are one product: the field count of every domain multiplies, and that product is the cover. One domains page is the whole set. A domain is not fetched alone.',
})

/** The product of the field counts on one domains page. The page covers the domains when it holds every domain the count names, and every domain names at least one field. */
export const scientificDomains = (page?: DomainPage | true) => {
  if (page === undefined || page === true) return unmeasured()
  const results = Array.isArray(page.results) ? page.results : []
  const count = typeof page.meta?.count === 'number' ? page.meta.count : null
  const domains = results.flatMap((row) => {
    if (!row || typeof row !== 'object' || typeof row.id !== 'string' || row.id.length === 0) return []
    const named = Array.isArray(row.fields) ? row.fields : []
    const ids = [...new Set(named.flatMap((field) => (field && typeof field.id === 'string' && field.id.length > 0 ? [field.id] : [])))]
    return [{ id: row.id, name: typeof row.display_name === 'string' ? row.display_name : row.id, fields: ids.length }]
  })
  const whole = count !== null && count === results.length && results.length > 0 && domains.length === results.length && domains.every((domain) => domain.fields >= 1)
  const radices = domains.map((domain) => domain.fields)
  const product = whole ? compositions(radices) : null
  const fields = radices.reduce((sum, radix) => sum + radix, 0)
  const address = uuid(canonicalText({ formula, domains: domains.map((domain) => ({ id: domain.id, fields: domain.fields })) }))
  return {
    phase: 'domains' as const,
    atOnce: true as const,
    walked: false as const,
    formula,
    ran: true as const,
    whole,
    domains: domains.length,
    of: count,
    fields,
    radices,
    product: product === null ? null : product.toString(),
    names: domains.map((domain) => domain.name),
    address,
    sealed: seal(address).valid,
    says: whole && product !== null
      ? `${domains.length} scientific domains covered at once: ${radices.join(' × ')} = ${product}. ${fields} fields sit in that one product. No domain was fetched alone.`
      : 'the page is not the whole set of scientific domains, so the product is not the cover',
  }
}

