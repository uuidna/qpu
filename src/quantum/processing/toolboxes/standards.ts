// The standards toolbox: schema.org JSON-LD for any block, page or offer, and the tree's ISO codes validated against the
// CLDR lists a client fetched. Pure; the discover tool reads the standards' documents as contracts.
import { TABLES } from '../tables-index.ts'
import { defineTool, createChecks, isObj, type Toolbox } from '../toolbox.ts'
import { blockJsonLd, pageJsonLd, offerJsonLd, listCodes, validateCodes, validateStandards, verifyIsoOnline, verifyIsoQuantumEquivalence, STANDARDS, detectStandard, ISO_DIMENSIONS } from '../standards.ts'
import { LOCALES } from '../i18n.ts'
import { isoClassify } from '../iso-deliverables.ts'
import { physicalEvidence, type DeviceReadings } from '../quantum-vocabulary.ts'
import { CATALOGUE } from './billing.ts'
import { flowWidget } from '../widgets.ts'

const jsonld = defineTool('standards', {
  name: 'jsonld',
  description: 'schema.org JSON-LD, pure: for a block (tool, id, description), a page (url, title, description, uuid?) or an offer of the catalogue (product, variant, currency). The author a Person with an ORCID, the licence a URL, dates ISO 8601, languages ISO 639-1, currencies ISO 4217. Every tools/call result already carries its block\'s JSON-LD in _meta.jsonLd; every documentation page carries its own in its head.',
  inputSchema: { type: 'object', properties: { kind: { type: 'string', enum: ['block', 'page', 'offer', 'catalogue'] }, tool: { type: 'string' }, id: { type: 'string' }, description: { type: 'string' }, url: { type: 'string' }, title: { type: 'string' }, uuid: { type: 'string' }, locale: { type: 'string', enum: Object.keys(LOCALES) }, product: { type: 'string' }, variant: { type: 'string' }, currency: { type: 'string' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    const kind = String(args.kind ?? 'block')
    if (kind === 'block') return { kind, jsonLd: blockJsonLd({ tool: String(args.tool ?? 'qpu'), id: String(args.id ?? ''), description: String(args.description ?? ''), url: typeof args.url === 'string' ? args.url : undefined, locale: typeof args.locale === 'string' ? args.locale : undefined }) }
    if (kind === 'page') return { kind, jsonLd: pageJsonLd({ url: String(args.url ?? 'https://qpu.uuidna.com/'), title: String(args.title ?? '@uuidna/qpu'), description: String(args.description ?? ''), uuid: typeof args.uuid === 'string' ? args.uuid : undefined, locale: typeof args.locale === 'string' ? args.locale : undefined }) }
    const currency = String(args.currency ?? 'eur')
    const offers = CATALOGUE.filter((v) => (kind === 'offer' ? v.product === args.product && v.variant === args.variant : true) && currency in v.amounts).map((v) => offerJsonLd({ product: v.product, variant: v.variant, unit: v.unit, interval: v.interval, currency, amount: v.amounts[currency]!, description: v.description }))
    if (kind === 'offer' && !offers.length) throw new Error(`no variant ${String(args.product)} ${String(args.variant)} in ${currency}`)
    return { kind, offers: offers.length, jsonLd: kind === 'offer' ? offers[0] : { '@context': 'https://schema.org', '@type': 'OfferCatalog', name: 'QPU licences', itemListElement: offers } }
  },
  widget: flowWidget,
})

const codes = defineTool('standards', {
  name: 'codes',
  description: 'The tree\'s ISO codes validated against the CLDR lists a client fetched (languages ISO 639, currencies ISO 4217, territories ISO 3166-1): every locale of the language toolbox, every currency of the catalogue, the tenants\' countries. Without the lists: what would be checked and where the lists are. A code the standard does not know is a lead, never a guess.',
  inputSchema: { type: 'object', properties: { cldr: { type: 'object', description: '{ languages, currencies, territories }: the CLDR JSON documents as fetched' }, territories: { type: 'array', items: { type: 'string' } }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    const mine = { locales: Object.keys(LOCALES), currencies: [...new Set(CATALOGUE.flatMap((v) => Object.keys(v.amounts)))], territories: Array.isArray(args.territories) ? args.territories.map(String) : ['BG', 'US'] }
    if (!args.cldr) return { phase: 'plan' as const, locales: mine.locales.length, currencies: mine.currencies.length, territories: mine.territories.length, standards: STANDARDS.filter((s) => s.kind === 'codes').map((s) => ({ id: s.id, contract: s.contract })), mine }
    const v = validateCodes(listCodes(args.cldr as Parameters<typeof listCodes>[0]), mine)
    return { phase: 'validated' as const, languagesValidCount: v.languagesValid.length, languagesUnknownCount: v.languagesUnknown.length, currenciesValidCount: v.currenciesValid.length, currenciesUnknownCount: v.currenciesUnknown.length, territoriesValidCount: v.territoriesValid.length, territoriesUnknownCount: v.territoriesUnknown.length, ...v, leads: [...v.languagesUnknown.map((c) => ({ id: `code-language-${c}`, statement: `locale ${c} is not an ISO 639 code CLDR names`, status: 'open', reason: 'rename the locale to its code, or it is a dialect to tag under its language' })), ...v.currenciesUnknown.map((c) => ({ id: `code-currency-${c}`, statement: `currency ${c} is not an ISO 4217 code CLDR names`, status: 'open', reason: 'the catalogue prices in codes the standard names' }))] }
  },
  widget: flowWidget,
})

/** Every file against ISO_DIMENSIONS by what it cites: the paths first, as a readList, then each file read back as path → dimensions */
const classifyFiles = (paths: unknown, files?: Readonly<Record<string, string>>) => {
  const asked = (Array.isArray(paths) ? paths.map(String) : String(paths).split('\n')).filter(Boolean)
  if (!files) return { phase: 'classify' as const, readList: asked, says: `${asked.length} file(s) to read` }
  const classified = Object.fromEntries(asked.filter((p) => typeof files[p] === 'string').map((p) => [p, isoClassify(files[p]!)]))
  const unclassified = Object.keys(classified).filter((p) => classified[p]!.length === 0)
  const byDimension = Object.fromEntries(ISO_DIMENSIONS.map((d) => [d, Object.values(classified).filter((ds) => ds.includes(d)).length]))
  return { phase: 'classify' as const, files: Object.keys(classified).length, classified, byDimension, unclassified, theorem: 'textbook_iso_classify', says: `${Object.keys(classified).length - unclassified.length} of ${Object.keys(classified).length} file(s) cite an ISO dimension; ${unclassified.length} unclassified, named` }
}

const validate = defineTool('standards', {
  name: 'validate',
  description: 'Validate against all standards via Payload\'s standard implementation, in the cheapest possible slices: every standard (the vocabularies, the ISO code lists, the references) with the Payload mechanism that validates it, split into content-addressed slices so validation, reindexing and cleanup run per slice (a page, a job) — the cheapest unit, an unchanged slice skipped by its address (the 304 involution), never the whole at once. online: true asks the ISO Open Data page. A page answer yields the JSONLines link that page publishes. A file answer verifies each ISO dimension by a reference in that file and defines it by the English title and the scope. The catalogue number is the row id.',
  inputSchema: { type: 'object', properties: { bound: { type: 'integer', minimum: 1, description: 'standards per slice (default 6)' }, online: { description: 'true: the ISO Open Data page. { status, text }: that page, or the JSONLines file the page linked' }, selftest: { type: 'boolean' }, classify: { description: 'the paths to classify (an array, or one per line), the files read by the client as files: each path → the ISO dimensions it cites, the unclassified named' }, files: { type: 'object' }, physical: { description: '{ device }: the hardware ISO terms with the readings of the device the client runs on' } } },
  run: (args, ctx) => {
    if (isObj(args.physical)) return physicalEvidence((args.physical as { device?: DeviceReadings }).device) as never
    if (args.classify !== undefined) return classifyFiles(args.classify, isObj(args.files) ? args.files as Record<string, string> : undefined) as never
    if (args.online === true) return verifyIsoOnline() as never
    if (isObj(args.online)) { const o = args.online as { status?: unknown; text?: unknown }; return verifyIsoOnline({ status: typeof o.status === 'number' ? o.status : 0, text: typeof o.text === 'string' ? o.text : '' }) as never }
    if (args.iso === true || args.quantum === true) return verifyIsoQuantumEquivalence() as never
    return validateStandards(typeof args.bound === 'number' ? args.bound : 6)
  },
  widget: flowWidget,
})

const CLDR_FIXTURE = Object.fromEntries(Object.entries(TABLES.CLDR_FIXTURE).map(([k, v]) => [k, JSON.parse(v)]))

export const STANDARDS_BOX: Toolbox = {
  name: 'standards',
  idea: 'the standards fused: schema.org on every block, page and offer; ISO 8601, 639-1, 4217 and 3166-1 in every date, language, price and country, validated against the CLDR lists discovery reads as contracts',
  tools: [jsonld, codes, validate],
  examples: [
    { id: 'standards-validate', tool: 'validate', theorem: 'textbook_standards_sliced', arguments: { bound: 6 }, shows: 'validateStandards validates against all standards via Payload\'s standard implementation, in the cheapest possible slices: every standard (a codes list by a select/validate against CLDR, a vocabulary by schema.org JSON-LD, a reference by the generated config and its field validations) covered, split into content-addressed slices of six so validation, reindexing (referenceIndex) and cleanup (purify, the RAID GC) run per slice as a job — the cheapest unit, an unchanged slice skipped by its address; the covered and the uncovered make the standards.', expect: (s) => (s.phase === 'standards-validate' && s.standards === STANDARDS.length && s.covered === s.standards && s.uncovered === 0 && s.slices === Math.ceil(STANDARDS.length / 6) && s.bySlice.every((sl: { address: string }) => /^[0-9a-f-]{36}$/.test(sl.address)) && /304 involution/.test(s.cheapest) ? null : JSON.stringify({ std: s.standards, covered: s.covered, slices: s.slices })) },
    { id: 'standards-iso-online', tool: 'validate', arguments: { online: true }, shows: 'Every ISO dimension is asked of the ISO Open Data page. The deliverables file is the JSONLines link that page publishes. No catalogue number is kept here. Nothing is verified until that file is the answer. Research and citations are asked of the DOI ecosystem: ISO 690 names the elements, ISO 26324 names the identifier.', expect: (s) => (s.phase === 'requests' && s.source === 'https://www.iso.org/open-data.html' && s.request.url === s.source && s.request.accept === 'text/html' && s.dataset === 'iso_deliverables_metadata' && s.asked === ISO_DIMENSIONS.length && s.holds === false && s.verified === 0 && s.rows.every((r: { verified: boolean }) => r.verified === false) && s.research.source === 'doi' && s.research.standards.join() === 'ISO 690,ISO 26324' && s.research.ecosystem.some((item: { url: string }) => item.url === 'https://api.crossref.org') && s.research.ecosystem.some((item: { url: string }) => item.url === 'https://api.datacite.org') ? null : JSON.stringify({ phase: s.phase, url: s.request?.url, holds: s.holds, research: s.research?.source })) },
    { id: 'standards-iso-page', tool: 'validate', arguments: { online: { status: 200, text: '<a href="https://www.iso.org/open-data/iso_deliverables_metadata.jsonl">JSONLines</a>' } }, shows: 'The ISO Open Data page is the way in. The next request is the JSONLines address that page published, and the dimensions stay unverified until that file is the answer.', expect: (s) => (s.phase === 'requests' && s.holds === false && s.verified === 0 && s.source === 'https://www.iso.org/open-data.html' && s.request.url === 'https://www.iso.org/open-data/iso_deliverables_metadata.jsonl' && s.request.accept === 'application/x-ndjson' ? null : JSON.stringify({ phase: s.phase, url: s.request?.url })) },
    { id: 'standards-iso-joined', tool: 'validate', arguments: { online: { status: 200, text: '{"reference":"ISO 9001:2015","id":1,"currentStage":9093}\n' } }, shows: 'One row of the open dataset verifies the dimension its reference names. The catalogue page is that row\'s id. The dimensions the file does not name stay unverified.', expect: (s) => { const named = s.rows.find((r: { dimension: string }) => r.dimension === 'ISO 9001'); return s.phase === 'verified' && s.holds === false && named?.verified === true && named.reference === 'ISO 9001:2015' && named.url === 'https://www.iso.org/standard/1.html' && s.verified === 1 ? null : JSON.stringify({ verified: s.verified, named }) } },
  ],
  skill: {
    instructions: 'jsonld needs no fetch. codes: the client fetches the three CLDR documents the plan names (GET, free, no credential) and calls codes with them; a code the standard does not know is a lead. The discover step reads schema.org\'s vocabulary and the CLDR lists as contracts; every tools/call result carries _meta.jsonLd and every documentation page a JSON-LD script.',
    directions: ['server only: JSON-LD shapes on fixtures; CLDR fixtures read into code sets; the tree\'s codes validated', 'client → server: the CLDR lists come from Unicode\'s repository', 'toolbox → toolbox: offers come from the billing catalogue, locales from the language toolbox, the contracts from discovery'],
    selftest: () => {
      const { check, done } = createChecks()
      const b = blockJsonLd({ tool: 'clay', id: 'x', description: 'd', date: '2026-01-01T00:00:00.000Z' })
      check('standards:block', b['@type'] === 'CreativeWork' && (b.author as { '@id': string })['@id'] === 'https://orcid.org/0009-0000-7312-9778' && b.dateModified === '2026-01-01T00:00:00.000Z' && b.inLanguage === 'en', 'CreativeWork with ORCID author, ISO 8601 date, ISO 639-1 language')
      const p = pageJsonLd({ url: 'https://qpu.uuidna.com/abc', title: 't', description: 'd', uuid: 'abc', locale: 'bg' })
      check('standards:page', p['@type'] === 'WebPage' && p.identifier === 'abc' && p.inLanguage === 'bg' && (p.isPartOf as { url: string }).url === 'https://qpu.uuidna.com', 'WebPage with identifier and locale')
      const o = offerJsonLd({ product: 'qpu-domain', variant: 'yearly', unit: 'domain', interval: 'year', currency: 'bgn', amount: 84500, description: 'd' })
      check('standards:offer', o.priceCurrency === 'BGN' && o.price === '845.00' && (o.priceSpecification as { unitCode: string }).unitCode === 'ANN', 'Offer in ISO 4217 with a yearly UnitPriceSpecification')
      const v = validateCodes(listCodes(CLDR_FIXTURE), { locales: Object.keys(LOCALES), currencies: ['eur', 'usd', 'bgn'], territories: ['BG', 'US', 'XX'] })
      check('standards:codes', v.measured && v.languagesUnknown.length === 0 && v.currenciesUnknown.length === 0 && v.territoriesUnknown.join() === 'XX', `locales ${v.languagesValid.length} valid, currencies ${v.currenciesValid.length} valid, territory XX unknown`)
      const none = validateCodes(listCodes({}), { locales: ['en'], currencies: ['eur'] })
      check('standards:unmeasured', !none.measured && none.languagesUnknown.length === 0, 'without the lists nothing is called unknown')
      check('standards:detect', detectStandard(JSON.stringify({ '@context': 'x', '@graph': [1, 2] }))?.detected === 'json-ld vocabulary' && detectStandard(JSON.stringify(CLDR_FIXTURE.languages))?.detected === 'cldr json' && detectStandard('<html>') === null, 'the vocabulary and a CLDR list are told apart')
      const iso = verifyIsoQuantumEquivalence()
      check('standards:iso-quantum-equivalence', iso.bijective && iso.noLessQuantum && iso.noMoreQuantum && iso.isoBlockchainProgrammable && iso.sealed, iso.says)
      const plan = verifyIsoOnline()
      const page = verifyIsoOnline({ status: 200, text: '<a href="https://www.iso.org/open-data/iso_deliverables_metadata.jsonl">JSONLines</a>' })
      const joined = verifyIsoOnline({ status: 200, text: '{"reference":"ISO 9001:2015","id":62085,"currentStage":9093}\n{"reference":"ISO 639-1:2002","id":22109,"currentStage":9599}\n' })
      const named = joined.rows.find((row) => row.dimension === 'ISO 9001')
      const retired = joined.rows.find((row) => row.dimension === 'ISO 639-1')
      const defined = verifyIsoOnline({ status: 200, text: '{"reference":"ISO 9001:2015","id":62085,"currentStage":9093,"title":{"en":"Quality management systems — Requirements"},"scope":{"en":"<p>This document specifies requirements.</p>"}}\n{"reference":"ISO 80000-10:2019/Amd 1:2025","id":1,"currentStage":6060,"supplementType":"Amd","title":{"en":"Amendment 1"}}\n{"reference":"ISO 80000-10:2019","id":64980,"currentStage":9093,"title":{"en":"Quantities and units — Part 10: Atomic and nuclear physics"},"scope":{"en":"<p>This document gives names, symbols, definitions and units.</p>"}}\n' })
      const quality = defined.rows.find((row) => row.dimension === 'ISO 9001')
      const quantity = defined.rows.find((row) => row.dimension === 'ISO 80000-10')
      check('standards:iso-online', plan.phase === 'requests' && plan.request.url === 'https://www.iso.org/open-data.html' && plan.defined === 0 && page.phase === 'requests' && page.request.url === 'https://www.iso.org/open-data/iso_deliverables_metadata.jsonl' && plan.holds === false && plan.asked === ISO_DIMENSIONS.length && joined.holds === false && joined.defined === 0 && named?.verified === true && named.defined === false && named.current === true && named.catalogue === 62085 && retired?.verified === true && retired.current === false && quality?.defined === true && quality.definition === 'This document specifies requirements.' && quality.title === 'Quality management systems — Requirements' && quantity?.reference === 'ISO 80000-10:2019' && quantity.defined === true && quantity.catalogue === 64980, `${plan.asked} dimensions asked through the ISO Open Data page; a published row verifies, a title and a scope define it, and a base document is kept ahead of an amendment`)
      return done()
    },
  },
}
