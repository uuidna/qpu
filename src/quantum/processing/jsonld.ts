// The schema.org JSON-LD builders, in a lean module (only the licence and the clock) so the Worker's SEO pages and the
// standards toolbox share one shape without pulling the whole standards module, and its prose, into the page bundle.
import { LICENSE } from './unit/license.ts'
import { stamp } from '../uuid/programs/clock/index.ts'

type JsonLd = Record<string, unknown> & { '@context': 'https://schema.org'; '@type': string }
const AUTHOR = { '@type': 'Person', name: LICENSE.author, '@id': LICENSE.orcid, identifier: LICENSE.orcid }
const APPLICATION = { '@type': 'SoftwareApplication', name: '@uuidna/qpu', applicationCategory: 'DeveloperApplication', license: LICENSE.url, author: AUTHOR }
const SITE = 'https://qpu.uuidna.com'

/** Who a block or a page belongs to, as its caller names them: a name or a schema.org node for the author and the publisher, a URL or a node for
 *  the site it is part of, a URL for its licence. */
type Owner ={ author?: string | Record<string, unknown>; publisher?: string | Record<string, unknown>; isPartOf?: string | Record<string, unknown>; license?: string }
const node = (v: string | Record<string, unknown> | undefined, type: string, key: 'name' | 'url') => (v === undefined ? undefined : typeof v === 'string' ? { '@type': type, [key]: v } : v)
/** The identity a block or a page carries: what its caller names; where a page lives on another site and names nothing, only that site, never qpu's
 *  author, licence or application, which are qpu's to publish and not the tenant's; on qpu's own site, qpu's own. */
const ownedBy = (url: string | undefined, o: Owner, own: Record<string, unknown>) => {
  const foreign = url !== undefined && URL.canParse(url) && new URL(url).hostname !== new URL(SITE).hostname
  const named = Object.fromEntries(Object.entries({ author: node(o.author, 'Person', 'name'), publisher: node(o.publisher, 'Organization', 'name'), isPartOf: node(o.isPartOf, 'WebSite', 'url'), license: o.license }).filter(([, v]) => v !== undefined))
  return { ...(foreign ? { isPartOf: { '@type': 'WebSite', url: new URL(url!).origin } } : own), ...named }
}

/** The JSON-LD of a block: one tool's result as a CreativeWork of the application, identified by its content address. */
export const blockJsonLd = (p: { tool: string; id: string; description: string; url?: string; locale?: string; date?: string; toolbox?: string } & Owner): JsonLd => ({
  '@context': 'https://schema.org', '@type': 'CreativeWork', '@id': p.url ?? `urn:uuid:${p.id}`, identifier: p.id, name: `${p.tool} · @uuidna/qpu`, description: p.description, ...ownedBy(p.url, p, { isPartOf: APPLICATION, author: AUTHOR, license: LICENSE.url }), inLanguage: p.locale ?? 'en', dateModified: p.date ?? stamp(), keywords: [p.tool, p.toolbox ?? 'qpu', 'MCP', 'quantum'].join(', '), isAccessibleForFree: true,
})
/** The JSON-LD of a page: a WebPage of the application on qpu's own site, of its caller's site elsewhere; a UUID page carries its identifier. */
export const pageJsonLd = (p: { url: string; title: string; description: string; uuid?: string; locale?: string; date?: string } & Owner): JsonLd => ({
  '@context': 'https://schema.org', '@type': 'WebPage', '@id': p.url, url: p.url, name: p.title, description: p.description, ...(p.uuid ? { identifier: p.uuid } : {}), ...ownedBy(p.url, p, { isPartOf: { '@type': 'WebSite', name: '@uuidna/qpu', url: SITE, license: LICENSE.url }, about: APPLICATION, author: AUTHOR, license: LICENSE.url }), inLanguage: p.locale ?? 'en', dateModified: p.date ?? stamp(),
})
/** The JSON-LD of a product variant of the catalogue: an Offer in an ISO 4217 currency. */
export const offerJsonLd = (v: { product: string; variant: string; unit: string; interval: string; currency: string; amount: number; description: string }): JsonLd => ({
  '@context': 'https://schema.org', '@type': 'Offer', name: `${v.product} ${v.variant}`, description: v.description, price: (v.amount / 100).toFixed(2), priceCurrency: v.currency.toUpperCase(), itemOffered: { ...APPLICATION, name: `QPU ${v.product.replace(/^qpu-/, '')}` }, seller: AUTHOR, availability: 'https://schema.org/InStock', ...(v.interval === 'month' || v.interval === 'year' ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: (v.amount / 100).toFixed(2), priceCurrency: v.currency.toUpperCase(), unitText: v.unit, billingIncrement: 1, billingDuration: 1, unitCode: v.interval === 'month' ? 'MON' : 'ANN' } } : {}),
})
