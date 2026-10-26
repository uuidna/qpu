// Standards fused, pure: schema.org as the JSON-LD every block and page carries (CreativeWork in a SoftwareApplication, the
// author a Person with an ORCID, the licence a URL, dates in ISO 8601, languages in ISO 639-1, currencies in ISO 4217,
// countries in ISO 3166-1), and the free CLDR lists (Unicode's JSON of the ISO codes with their names) read as contracts so
// the tree's locales and currencies are validated against the standard, never against prose. No I/O here.
import { LICENSE } from './license.js'

export const STANDARDS: readonly { id: string; name: string; contract: string; kind: 'vocabulary' | 'codes' | 'reference' }[] = [
  // the reference site: payloadcms.com is built of what Payload computes (its REST answers Payload's own shape: docs with blocks, meta, breadcrumbs), as qpu.uuidna.com is built of what qpu computes
  { id: 'payload-site', name: 'payloadcms.com, built with Payload (REST pages)', contract: 'https://payloadcms.com/api/pages?limit=1&depth=0', kind: 'reference' },
  // NIST's first post-quantum standards, read at CSRC on 2026-10-25: FIPS 203, 204 and 205 published August 13, 2024; HQC selected March 11, 2025 (NIST IR 8545)
  { id: 'nist-fips-203', name: 'NIST FIPS 203, Module-Lattice-Based Key-Encapsulation Mechanism Standard (ML-KEM)', contract: 'https://csrc.nist.gov/pubs/fips/203/final', kind: 'reference' },
  { id: 'nist-fips-204', name: 'NIST FIPS 204, Module-Lattice-Based Digital Signature Standard (ML-DSA)', contract: 'https://csrc.nist.gov/pubs/fips/204/final', kind: 'reference' },
  { id: 'nist-fips-205', name: 'NIST FIPS 205, Stateless Hash-Based Digital Signature Standard (SLH-DSA)', contract: 'https://csrc.nist.gov/pubs/fips/205/final', kind: 'reference' },
  { id: 'nist-pqc', name: 'NIST Post-Quantum Cryptography project (the selections, HQC among them)', contract: 'https://csrc.nist.gov/projects/post-quantum-cryptography', kind: 'reference' },
  // Payload's own skills for agents (github.com/payloadcms/skills): read as a tree, every SKILL.md a skill, every reference a door the payload toolbox maps; no licence is declared there, so only names, paths and sizes are read, never the text
  // the source of payloadcms.com (github.com/payloadcms/website, MIT): the tree read for its collections, blocks, globals, fields and plugins, the proof that the site is what Payload computes
  // the Claude API's overview, read as a page; its Models door answers 401 until a tenant's key opens it (discovery names it, never guesses)
  { id: 'cloudflare-webcrypto-modern', name: 'Cloudflare changelog 2026-09-28: Web Crypto adds ML-KEM and ML-DSA (webcrypto_modern_algorithms)', contract: 'https://developers.cloudflare.com/changelog/post/2026-09-28-webcrypto-modern-algorithms/', kind: 'reference' },
  { id: 'claude-api', name: 'Claude API overview (platform.claude.com)', contract: 'https://platform.claude.com/docs/en/api/overview', kind: 'reference' },
  { id: 'payload-website', name: 'payloadcms/website, the source of payloadcms.com (the repository tree)', contract: 'https://api.github.com/repos/payloadcms/website/git/trees/main?recursive=1', kind: 'reference' },
  { id: 'payload-packages', name: 'payloadcms/payload, the packages Payload ships (the packages directory)', contract: 'https://api.github.com/repos/payloadcms/payload/contents/packages', kind: 'reference' },
  { id: 'payload-ecommerce-template', name: 'payloadcms/payload, the ecommerce template (templates/ecommerce/src)', contract: 'https://api.github.com/repos/payloadcms/payload/contents/templates/ecommerce/src', kind: 'reference' },
  { id: 'ecb-rates', name: 'European Central Bank, euro foreign exchange reference rates (daily XML)', contract: 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml', kind: 'reference' },
  { id: 'frankfurter-rates', name: 'Frankfurter, the ECB rates as JSON (v1)', contract: 'https://api.frankfurter.dev/v1/latest?base=EUR', kind: 'reference' },
  { id: 'bnb-rates', name: 'Bulgarian National Bank, reference rates (foreign currency per euro)', contract: 'https://www.bnb.bg/Statistics/StExternalSector/StExchangeRates/StERForeignCurrencies/index.htm?download=xml&search=&lang=EN', kind: 'reference' },
  { id: 'er-api-rates', name: 'open.er-api.com, daily rates (free tier)', contract: 'https://open.er-api.com/v6/latest/EUR', kind: 'reference' },
  { id: 'currency-api-rates', name: 'fawazahmed0/currency-api on jsDelivr (daily, CC0)', contract: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json', kind: 'reference' },
  { id: 'payload-skills', name: 'payloadcms/skills, Payload\'s skills for AI agents (the repository tree)', contract: 'https://api.github.com/repos/payloadcms/skills/git/trees/main?recursive=1', kind: 'reference' },
  { id: 'schema-org', name: 'schema.org vocabulary (JSON-LD)', contract: 'https://schema.org/version/latest/schemaorg-current-https.jsonld', kind: 'vocabulary' },
  { id: 'cldr-languages', name: 'Unicode CLDR language names (ISO 639)', contract: 'https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-localenames-full/main/en/languages.json', kind: 'codes' },
  { id: 'cldr-currencies', name: 'Unicode CLDR currency names (ISO 4217)', contract: 'https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-numbers-full/main/en/currencies.json', kind: 'codes' },
  { id: 'cldr-territories', name: 'Unicode CLDR territory names (ISO 3166-1)', contract: 'https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-localenames-full/main/en/territories.json', kind: 'codes' },
]

export type JsonLd = Record<string, unknown> & { '@context': 'https://schema.org'; '@type': string }
const AUTHOR = { '@type': 'Person', name: LICENSE.author, '@id': LICENSE.orcid, identifier: LICENSE.orcid }
const APPLICATION = { '@type': 'SoftwareApplication', name: '@uuidna/qpu', applicationCategory: 'DeveloperApplication', license: LICENSE.url, author: AUTHOR }

/** The JSON-LD of a block: one tool's result as a CreativeWork of the application, identified by its content address. */
export const blockJsonLdOf = (p: { tool: string; id: string; description: string; url?: string; locale?: string; date?: string; toolbox?: string }): JsonLd => ({
  '@context': 'https://schema.org', '@type': 'CreativeWork', '@id': p.url ?? `urn:uuid:${p.id}`, identifier: p.id, name: `${p.tool} · @uuidna/qpu`, description: p.description, isPartOf: APPLICATION, author: AUTHOR, license: LICENSE.url, inLanguage: p.locale ?? 'en', dateModified: p.date ?? new Date().toISOString(), keywords: [p.tool, p.toolbox ?? 'qpu', 'MCP', 'quantum'].join(', '), isAccessibleForFree: true,
})
/** The JSON-LD of a page of the documentation: a WebPage of the application; a UUID page carries its identifier. */
export const pageJsonLdOf = (p: { url: string; title: string; description: string; uuid?: string; locale?: string; date?: string }): JsonLd => ({
  '@context': 'https://schema.org', '@type': 'WebPage', '@id': p.url, url: p.url, name: p.title, description: p.description, ...(p.uuid ? { identifier: p.uuid } : {}), isPartOf: { '@type': 'WebSite', name: '@uuidna/qpu', url: 'https://qpu.uuidna.com', license: LICENSE.url }, about: APPLICATION, author: AUTHOR, license: LICENSE.url, inLanguage: p.locale ?? 'en', dateModified: p.date ?? new Date().toISOString(),
})
/** The JSON-LD of a product variant of the catalogue: an Offer in an ISO 4217 currency. */
export const offerJsonLdOf = (v: { product: string; variant: string; unit: string; interval: string; currency: string; amount: number; description: string }): JsonLd => ({
  '@context': 'https://schema.org', '@type': 'Offer', name: `${v.product} ${v.variant}`, description: v.description, price: (v.amount / 100).toFixed(2), priceCurrency: v.currency.toUpperCase(), itemOffered: { ...APPLICATION, name: `QPU ${v.product.replace(/^qpu-/, '')}` }, seller: AUTHOR, availability: 'https://schema.org/InStock', ...(v.interval === 'month' || v.interval === 'year' ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: (v.amount / 100).toFixed(2), priceCurrency: v.currency.toUpperCase(), unitText: v.unit, billingIncrement: 1, billingDuration: 1, unitCode: v.interval === 'month' ? 'MON' : 'ANN' } } : {}),
})

export type Codes = { languages: Set<string>; currencies: Set<string>; territories: Set<string> }
/** The CLDR lists read into code sets: ISO 639 languages, ISO 4217 currencies, ISO 3166-1 territories. */
export const codesOf = (cldr: { languages?: unknown; currencies?: unknown; territories?: unknown }): Codes => {
  const main = (doc: unknown) => { const m = (doc as { main?: Record<string, unknown> } | undefined)?.main; return m ? (Object.values(m)[0] as Record<string, unknown> | undefined) : undefined }
  const languages = new Set(Object.keys(((main(cldr.languages) as { localeDisplayNames?: { languages?: Record<string, string> } } | undefined)?.localeDisplayNames?.languages ?? {})))
  const currencies = new Set(Object.keys(((main(cldr.currencies) as { numbers?: { currencies?: Record<string, unknown> } } | undefined)?.numbers?.currencies ?? {})))
  const territories = new Set(Object.keys(((main(cldr.territories) as { localeDisplayNames?: { territories?: Record<string, string> } } | undefined)?.localeDisplayNames?.territories ?? {})))
  return { languages, currencies, territories }
}
/** The tree's codes against the standard: every locale an ISO 639 code, every currency an ISO 4217 code, every tenant country an ISO 3166-1 code. */
export const validateOf = (codes: Codes, mine: { locales: readonly string[]; currencies: readonly string[]; territories?: readonly string[] }): { languagesValid: string[]; languagesUnknown: string[]; currenciesValid: string[]; currenciesUnknown: string[]; territoriesValid: string[]; territoriesUnknown: string[]; measured: boolean } => {
  const measured = codes.languages.size > 0 && codes.currencies.size > 0
  const split = (list: readonly string[], set: Set<string>, norm: (s: string) => string) => ({ valid: list.filter((c) => set.has(norm(c))), unknown: set.size ? list.filter((c) => !set.has(norm(c))) : [] })
  const l = split(mine.locales, codes.languages, (s) => s.toLowerCase()); const c = split(mine.currencies, codes.currencies, (s) => s.toUpperCase()); const t = split(mine.territories ?? [], codes.territories, (s) => s.toUpperCase())
  return { languagesValid: l.valid, languagesUnknown: l.unknown, currenciesValid: c.valid, currenciesUnknown: c.unknown, territoriesValid: t.valid, territoriesUnknown: t.unknown, measured }
}
/** Which standard document a text is: the schema.org JSON-LD vocabulary, or a CLDR list. */
export const detectStandard = (text: string): { detected: string; note: string } | null => {
  try { const j = JSON.parse(text) as { sha?: string; tree?: { path: string; type: string; size?: number }[]; truncated?: boolean }; if (Array.isArray(j.tree) && typeof j.sha === 'string') { const skills = j.tree.filter((e) => /\/SKILL\.md$/.test(e.path)).map((e) => e.path.split('/').slice(-2, -1)[0]); const refs = j.tree.filter((e) => /\/reference\/[^/]+\.md$/.test(e.path)).length; return { detected: 'github tree', note: `${j.tree.length} entries${j.truncated ? ' (truncated)' : ''}; ${skills.length} skill(s): ${skills.join(', ')}; ${refs} reference(s)` } } } catch { /* not a tree */ }
  try { const j = JSON.parse(text) as { docs?: { layout?: { blockType: string }[]; meta?: object; breadcrumbs?: unknown[]; createdAt?: string }[]; totalDocs?: number }; if (Array.isArray(j.docs) && j.docs[0] && typeof j.docs[0].createdAt === 'string') { const d = j.docs[0]; return { detected: 'payload rest', note: `${j.totalDocs ?? j.docs.length} docs; blocks ${(d.layout ?? []).map((b) => b.blockType).join(', ') || 'none'}; ${d.meta ? 'seo meta' : 'no meta'}; ${Array.isArray(d.breadcrumbs) ? `${d.breadcrumbs.length} breadcrumb(s)` : 'no breadcrumbs'}: the site is the product's own output` } } } catch { /* not payload */ }
  try {
    const j = JSON.parse(text) as Record<string, unknown>
    if (Array.isArray(j['@graph']) && j['@context']) return { detected: 'json-ld vocabulary', note: `${(j['@graph'] as unknown[]).length} terms (${text.length.toLocaleString('en-US')} chars)` }
    const main = (j as { main?: Record<string, unknown> }).main
    if (main) { const first = Object.values(main)[0] as Record<string, unknown> | undefined; const kind = first?.localeDisplayNames ? 'locale display names' : first?.numbers ? 'numbers' : 'unknown'; return { detected: 'cldr json', note: `${kind} (${text.length.toLocaleString('en-US')} chars)` } }
  } catch { /* not json */ }
  return null
}
