// Every scientific domain, one product, carried by the UUID of every Payload config.
// The address functions are the website copy. They match the quantum register.
import { canonicalText, compositions, seal, uuid } from '../quantum/password/address.js'
import { configKinds } from '../quantum/processing/payload-vocabulary.ts'
import { TENANTS } from '../quantum/processing/unit/tenants.ts'

export type DomainPage = { meta?: { count?: number }; results?: readonly { id?: string; display_name?: string; fields?: readonly { id?: string; display_name?: string }[] }[] }

const DOMAINS_URL = 'https://api.openalex.org/domains?page=1'
const formula = 'Π |fields(domain)|'

const asPage = (raw: unknown): DomainPage | undefined => {
  if (raw === undefined || raw === true) return undefined
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined
  const row = raw as { page?: unknown; results?: unknown }
  if (row.page && typeof row.page === 'object') return row.page as DomainPage
  if (Array.isArray(row.results)) return row as DomainPage
  return undefined
}

const coverOf = (page?: DomainPage) => {
  if (!page) {
    return { ran: false as const, whole: false as const, walked: false as const, product: null, domains: 0, fields: 0, radices: [] as number[], request: { method: 'GET' as const, url: DOMAINS_URL, accept: 'application/json' as const } }
  }
  const results = Array.isArray(page.results) ? page.results : []
  const count = typeof page.meta?.count === 'number' ? page.meta.count : null
  const domains = results.flatMap((row) => {
    if (!row || typeof row !== 'object' || typeof row.id !== 'string' || row.id.length === 0) return []
    const named = Array.isArray(row.fields) ? row.fields : []
    const ids = [...new Set(named.flatMap((field: { id?: unknown } | null | undefined) => (field && typeof field.id === 'string' && field.id.length > 0 ? [field.id] : [])))]
    return [{ id: row.id, name: typeof row.display_name === 'string' ? row.display_name : row.id, fields: ids.length }]
  })
  const whole = count !== null && count === results.length && results.length > 0 && domains.length === results.length && domains.every((domain) => domain.fields >= 1)
  const radices = domains.map((domain) => domain.fields)
  const product = whole ? compositions(radices) : null
  const fields = radices.reduce((sum, radix) => sum + radix, 0)
  return { ran: true as const, whole, walked: false as const, product: product === null ? null : product.toString(), domains: domains.length, fields, radices, names: domains.map((domain) => domain.name) }
}

/** Every Payload config is one UUID. Those addresses carry the one domain product. A domain id is not a request. */
export const domainConfigs = (raw?: unknown) => {
  const cover = coverOf(asPage(raw))
  const rows = configKinds.map((kind) => {
    const address = uuid(`config:${kind}`)
    return { kind, uuid: address, sealed: seal(address).valid }
  })
  const address = uuid(canonicalText({ formula, configs: rows.map((row) => row.uuid) }))
  const hosts = Object.keys(TENANTS)
  const improved = cover.whole === true && cover.product !== null && rows.every((row) => row.sealed) && seal(address).valid && hosts.length > 0
  return {
    phase: 'improve' as const,
    via: 'uuid-payload-config' as const,
    quantum: true as const,
    atOnce: true as const,
    walked: false as const,
    formula,
    improved,
    configs: rows.length,
    rows,
    hosts,
    address,
    sealed: seal(address).valid,
    product: cover.product,
    domains: cover,
    says: improved
      ? `${rows.length} Payload config UUIDs carry the cover of ${cover.domains} scientific domains: ${cover.product}. One stream, ${address}. The hosts are ${hosts.join(' and ')}. No domain was fetched alone.`
      : cover.ran
        ? 'the page is not the whole set of scientific domains, so the Payload configs do not carry the cover'
        : `${rows.length} Payload configs are one UUID stream. All scientific domains are the product those configs carry. One domains page is the whole set. A domain is not fetched alone.`,
  }
}
