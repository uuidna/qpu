// The standards toolbox: schema.org JSON-LD for any block, page or offer, and the tree's ISO codes validated against the
// CLDR lists a client fetched. Pure; the discover tool reads the standards' documents as contracts.
import { toolOf, type Toolbox } from '../toolbox.js'
import { blockJsonLdOf, pageJsonLdOf, offerJsonLdOf, codesOf, validateOf, STANDARDS, detectStandard } from '../standards.js'
import { LOCALES } from '../i18n.js'
import { CATALOGUE } from './billing.js'
import { flowWidget } from '../widgets.js'

const jsonld = toolOf('standards', {
  name: 'jsonld',
  description: 'schema.org JSON-LD, pure: for a block (tool, id, description), a page (url, title, description, uuid?) or an offer of the catalogue (product, variant, currency). The author a Person with an ORCID, the licence a URL, dates ISO 8601, languages ISO 639-1, currencies ISO 4217. Every tools/call result already carries its block\'s JSON-LD in _meta.jsonLd; every documentation page carries its own in its head.',
  inputSchema: { type: 'object', properties: { kind: { type: 'string', enum: ['block', 'page', 'offer', 'catalogue'] }, tool: { type: 'string' }, id: { type: 'string' }, description: { type: 'string' }, url: { type: 'string' }, title: { type: 'string' }, uuid: { type: 'string' }, locale: { type: 'string', enum: Object.keys(LOCALES) }, product: { type: 'string' }, variant: { type: 'string' }, currency: { type: 'string' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...STANDARDS_BOX.skill.selftest(ctx) }
    const kind = String(args.kind ?? 'block')
    if (kind === 'block') return { kind, jsonLd: blockJsonLdOf({ tool: String(args.tool ?? 'qpu'), id: String(args.id ?? ''), description: String(args.description ?? ''), url: typeof args.url === 'string' ? args.url : undefined, locale: typeof args.locale === 'string' ? args.locale : undefined }) }
    if (kind === 'page') return { kind, jsonLd: pageJsonLdOf({ url: String(args.url ?? 'https://qpu.uuidna.com/'), title: String(args.title ?? '@uuidna/qpu'), description: String(args.description ?? ''), uuid: typeof args.uuid === 'string' ? args.uuid : undefined, locale: typeof args.locale === 'string' ? args.locale : undefined }) }
    const currency = String(args.currency ?? 'eur')
    const offers = CATALOGUE.filter((v) => (kind === 'offer' ? v.product === args.product && v.variant === args.variant : true) && currency in v.amounts).map((v) => offerJsonLdOf({ product: v.product, variant: v.variant, unit: v.unit, interval: v.interval, currency, amount: v.amounts[currency]!, description: v.description }))
    if (kind === 'offer' && !offers.length) throw new Error(`no variant ${String(args.product)} ${String(args.variant)} in ${currency}`)
    return { kind, offers: offers.length, jsonLd: kind === 'offer' ? offers[0] : { '@context': 'https://schema.org', '@type': 'OfferCatalog', name: 'QPU licences', itemListElement: offers } }
  },
  widget: flowWidget,
})

const codes = toolOf('standards', {
  name: 'codes',
  description: 'The tree\'s ISO codes validated against the CLDR lists a client fetched (languages ISO 639, currencies ISO 4217, territories ISO 3166-1): every locale of the language toolbox, every currency of the catalogue, the tenants\' countries. Without the lists: what would be checked and where the lists are. A code the standard does not know is a lead, never a guess.',
  inputSchema: { type: 'object', properties: { cldr: { type: 'object', description: '{ languages, currencies, territories }: the CLDR JSON documents as fetched' }, territories: { type: 'array', items: { type: 'string' } }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...STANDARDS_BOX.skill.selftest(ctx) }
    const mine = { locales: Object.keys(LOCALES), currencies: [...new Set(CATALOGUE.flatMap((v) => Object.keys(v.amounts)))], territories: Array.isArray(args.territories) ? args.territories.map(String) : ['BG', 'US'] }
    if (!args.cldr) return { phase: 'plan' as const, locales: mine.locales.length, currencies: mine.currencies.length, territories: mine.territories.length, standards: STANDARDS.filter((s) => s.kind === 'codes').map((s) => ({ id: s.id, contract: s.contract })), mine }
    const v = validateOf(codesOf(args.cldr as Parameters<typeof codesOf>[0]), mine)
    return { phase: 'validated' as const, languagesValidCount: v.languagesValid.length, languagesUnknownCount: v.languagesUnknown.length, currenciesValidCount: v.currenciesValid.length, currenciesUnknownCount: v.currenciesUnknown.length, territoriesValidCount: v.territoriesValid.length, territoriesUnknownCount: v.territoriesUnknown.length, ...v, leads: [...v.languagesUnknown.map((c) => ({ id: `code-language-${c}`, statement: `locale ${c} is not an ISO 639 code CLDR names`, status: 'open', reason: 'rename the locale to its code, or it is a dialect to tag under its language' })), ...v.currenciesUnknown.map((c) => ({ id: `code-currency-${c}`, statement: `currency ${c} is not an ISO 4217 code CLDR names`, status: 'open', reason: 'the catalogue prices in codes the standard names' }))] }
  },
  widget: flowWidget,
})

const CLDR_FIXTURE = { languages: { main: { en: { localeDisplayNames: { languages: { en: 'English', bg: 'Bulgarian', de: 'German', fr: 'French', es: 'Spanish', it: 'Italian', ru: 'Russian', zh: 'Chinese', ja: 'Japanese', pt: 'Portuguese', nl: 'Dutch' } } } } }, currencies: { main: { en: { numbers: { currencies: { EUR: {}, USD: {}, BGN: {} } } } } }, territories: { main: { en: { localeDisplayNames: { territories: { BG: 'Bulgaria', US: 'United States' } } } } } }

export const STANDARDS_BOX: Toolbox = {
  name: 'standards',
  idea: 'the standards fused: schema.org on every block, page and offer; ISO 8601, 639-1, 4217 and 3166-1 in every date, language, price and country, validated against the CLDR lists discovery reads as contracts',
  tools: [jsonld, codes],
  examples: [
    { id: 'jsonld-block', tool: 'jsonld', arguments: { kind: 'block', tool: 'clay', id: '941ef62e-d97b-2438-bfc8-22ae9e5da781', description: 'The Clay register recomputed' }, shows: 'A block as schema.org JSON-LD: a CreativeWork of the SoftwareApplication, the author a Person with an ORCID, the licence a URL, the date ISO 8601.', expect: (s) => (s.jsonLd['@type'] === 'CreativeWork' && s.jsonLd.author?.['@id']?.includes('orcid.org') && s.jsonLd.license === 'https://uuidna.com/license' && /^\d{4}-\d{2}-\d{2}T/.test(s.jsonLd.dateModified) ? null : JSON.stringify(s.jsonLd).slice(0, 160)) },
    { id: 'jsonld-catalogue', tool: 'jsonld', arguments: { kind: 'catalogue', currency: 'eur' }, shows: 'The whole catalogue as an OfferCatalog of Offers priced in ISO 4217 EUR, each a UnitPriceSpecification by month or year where recurring.', expect: (s) => (s.offers === 7 && s.jsonLd['@type'] === 'OfferCatalog' && s.jsonLd.itemListElement.every((o: { priceCurrency: string }) => o.priceCurrency === 'EUR') ? null : `${s.offers} offers`) },
    { id: 'codes-plan', tool: 'codes', arguments: {}, shows: 'What the codes tool would validate and where the CLDR lists are: eleven locales, three currencies, the tenants\' countries.', expect: (s) => (s.phase === 'plan' && s.locales === 11 && s.currencies === 3 && s.standards.length === 3 ? null : `${s.phase} ${s.locales} ${s.currencies}`) },
  ],
  skill: {
    instructions: 'jsonld needs no fetch. codes: the client fetches the three CLDR documents the plan names (GET, free, no credential) and calls codes with them; a code the standard does not know is a lead. The discover step reads schema.org\'s vocabulary and the CLDR lists as contracts; every tools/call result carries _meta.jsonLd and every documentation page a JSON-LD script.',
    directions: ['server only: JSON-LD shapes on fixtures; CLDR fixtures read into code sets; the tree\'s codes validated', 'client → server: the CLDR lists come from Unicode\'s repository', 'toolbox → toolbox: offers come from the billing catalogue, locales from the language toolbox, the contracts from discovery'],
    selftest: () => {
      const checks: { id: string; passed: boolean; evidence: string }[] = []
      const check = (id: string, passed: boolean, evidence: string) => checks.push({ id, passed, evidence })
      const b = blockJsonLdOf({ tool: 'clay', id: 'x', description: 'd', date: '2026-01-01T00:00:00.000Z' })
      check('standards:block', b['@type'] === 'CreativeWork' && (b.author as { '@id': string })['@id'] === 'https://orcid.org/0009-0000-7312-9778' && b.dateModified === '2026-01-01T00:00:00.000Z' && b.inLanguage === 'en', 'CreativeWork with ORCID author, ISO 8601 date, ISO 639-1 language')
      const p = pageJsonLdOf({ url: 'https://qpu.uuidna.com/abc', title: 't', description: 'd', uuid: 'abc', locale: 'bg' })
      check('standards:page', p['@type'] === 'WebPage' && p.identifier === 'abc' && p.inLanguage === 'bg' && (p.isPartOf as { url: string }).url === 'https://qpu.uuidna.com', 'WebPage with identifier and locale')
      const o = offerJsonLdOf({ product: 'qpu-domain', variant: 'yearly', unit: 'domain', interval: 'year', currency: 'bgn', amount: 84500, description: 'd' })
      check('standards:offer', o.priceCurrency === 'BGN' && o.price === '845.00' && (o.priceSpecification as { unitCode: string }).unitCode === 'ANN', 'Offer in ISO 4217 with a yearly UnitPriceSpecification')
      const v = validateOf(codesOf(CLDR_FIXTURE), { locales: Object.keys(LOCALES), currencies: ['eur', 'usd', 'bgn'], territories: ['BG', 'US', 'XX'] })
      check('standards:codes', v.measured && v.languagesUnknown.length === 0 && v.currenciesUnknown.length === 0 && v.territoriesUnknown.join() === 'XX', `locales ${v.languagesValid.length} valid, currencies ${v.currenciesValid.length} valid, territory XX unknown`)
      const none = validateOf(codesOf({}), { locales: ['en'], currencies: ['eur'] })
      check('standards:unmeasured', !none.measured && none.languagesUnknown.length === 0, 'without the lists nothing is called unknown')
      check('standards:detect', detectStandard(JSON.stringify({ '@context': 'x', '@graph': [1, 2] }))?.detected === 'json-ld vocabulary' && detectStandard(JSON.stringify(CLDR_FIXTURE.languages))?.detected === 'cldr json' && detectStandard('<html>') === null, 'the vocabulary and a CLDR list are told apart')
      return { passed: checks.every((c) => c.passed), checks }
    },
  },
}
