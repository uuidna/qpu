// The standards toolbox: schema.org JSON-LD for any block, page or offer, and the tree's ISO codes validated against the
// CLDR lists a client fetched. Pure; the discover tool reads the standards' documents as contracts.
import { PROSE, proseFill } from '../prose-index.ts'
import { TABLES } from '../tables-index.ts'
import { defineTool, createChecks, isObj, type Toolbox } from '../toolbox.ts'
import { blockJsonLd, pageJsonLd, offerJsonLd, listCodes, validateCodes, validateStandards, verifyIsoOnline, verifyIsoQuantumEquivalence, STANDARDS, detectStandard, ISO_DIMENSIONS } from '../standards.ts'
import { LOCALES } from '../i18n.ts'
import { isoClassify } from '../iso-deliverables.ts'
import { physicalEvidence, type DeviceReadings } from '../quantum-vocabulary.ts'
import { CATALOGUE } from './billing.ts'
import { flowWidget } from '../widgets.ts'
import { askedPaths } from '../audit.ts'

type Item = { name: string; sku?: string; description?: string; url?: string; image?: string; brand?: string; price?: number | string; currency?: string; availability?: string; variants?: readonly { name?: string; sku?: string; price: number | string; currency?: string; availability?: string }[] }
/** One product of any caller's catalogue as a schema.org Product: one Offer per variant (or one at its own price), each in the ISO 4217 currency
 *  it names (or the item's, or the call's), at the decimal price it states, sold by the seller the call names. */
const productJsonLd = (item: Item, p: { currency?: unknown; seller?: unknown }) => {
  if (!isObj(item) || typeof item.name !== 'string' || !item.name) throw new Error(PROSE.quantumProcessingToolboxesStandards_itemNamed)
  const seller = typeof p.seller === 'string' ? { '@type': 'Organization', name: p.seller } : isObj(p.seller) ? p.seller : undefined
  const offer = (o: { name?: string; sku?: string; price?: number | string; currency?: string; availability?: string }) => {
    const asked = o.currency ?? item.currency ?? p.currency, currency = typeof asked === 'string' ? asked.toUpperCase() : '', price = Number(o.price)
    if (!/^[A-Z]{3}$/.test(currency)) throw new Error(proseFill(PROSE.quantumProcessingToolboxesStandards_currencyShape, item.name, JSON.stringify(asked ?? null)))
    if (o.price === undefined || o.price === '' || !Number.isFinite(price) || price < 0) throw new Error(proseFill(PROSE.quantumProcessingToolboxesStandards_priceShape, item.name, JSON.stringify(o.price ?? null)))
    return { '@type': 'Offer', ...(o.name ? { name: o.name } : {}), ...(o.sku ? { sku: o.sku } : {}), price: String(o.price), priceCurrency: currency, availability: `https://schema.org/${o.availability ?? 'InStock'}`, ...(seller ? { seller } : {}) }
  }
  const offers = item.variants?.length ? item.variants.map(offer) : item.price !== undefined ? [offer(item)] : []
  return { '@type': 'Product', name: item.name, ...Object.fromEntries((['sku', 'description', 'url', 'image'] as const).filter((k) => typeof item[k] === 'string').map((k) => [k, item[k]])), ...(item.brand ? { brand: { '@type': 'Brand', name: item.brand } } : {}), ...(offers.length ? { offers: offers.length === 1 ? offers[0] : offers } : {}) }
}
const OWNER = { author: { type: ['string', 'object'], description: PROSE.quantumProcessingToolboxesStandards_author }, publisher: { type: ['string', 'object'], description: PROSE.quantumProcessingToolboxesStandards_publisher }, isPartOf: { type: ['string', 'object'], description: PROSE.quantumProcessingToolboxesStandards_isPartOf }, license: { type: 'string', description: PROSE.quantumProcessingToolboxesStandards_license } }
const owner = (args: Record<string, unknown>) => Object.fromEntries((['author', 'publisher', 'isPartOf', 'license'] as const).filter((k) => typeof args[k] === 'string' || (k !== 'license' && isObj(args[k]))).map((k) => [k, args[k]]))
const ITEM = { type: 'object', required: ['name'], properties: { name: { type: 'string' }, sku: { type: 'string' }, description: { type: 'string' }, url: { type: 'string' }, image: { type: 'string' }, brand: { type: 'string' }, price: { type: ['number', 'string'] }, currency: { type: 'string' }, availability: { type: 'string' }, variants: { type: 'array', items: { type: 'object', required: ['price'], properties: { name: { type: 'string' }, sku: { type: 'string' }, price: { type: ['number', 'string'] }, currency: { type: 'string' }, availability: { type: 'string' } } } } } }

const jsonld = defineTool('standards', {
  name: 'jsonld',
  description: PROSE.quantumProcessingToolboxesStandards_description1,
  inputSchema: { type: 'object', properties: { kind: { type: 'string', enum: ['block', 'page', 'offer', 'catalogue'] }, tool: { type: 'string' }, id: { type: 'string' }, description: { type: 'string' }, url: { type: 'string' }, title: { type: 'string' }, uuid: { type: 'string' }, locale: { type: 'string', description: PROSE.quantumProcessingToolboxesStandards_locale }, ...OWNER, product: { type: 'string' }, variant: { type: 'string' }, currency: { type: 'string' }, item: { ...ITEM, description: PROSE.quantumProcessingToolboxesStandards_item }, items: { type: 'array', items: ITEM, description: PROSE.quantumProcessingToolboxesStandards_items }, seller: { type: ['string', 'object'], description: PROSE.quantumProcessingToolboxesStandards_seller }, name: { type: 'string', description: PROSE.quantumProcessingToolboxesStandards_catalogueName }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    const kind = String(args.kind ?? 'block')
    if (kind === 'block') return { kind, jsonLd: blockJsonLd({ tool: String(args.tool ?? 'qpu'), id: String(args.id ?? ''), description: String(args.description ?? ''), url: typeof args.url === 'string' ? args.url : undefined, locale: typeof args.locale === 'string' ? args.locale : undefined, ...owner(args) }) }
    if (kind === 'page') return { kind, jsonLd: pageJsonLd({ url: String(args.url ?? 'https://qpu.uuidna.com/'), title: String(args.title ?? '@uuidna/qpu'), description: String(args.description ?? ''), uuid: typeof args.uuid === 'string' ? args.uuid : undefined, locale: typeof args.locale === 'string' ? args.locale : undefined, ...owner(args) }) }
    // the caller's own catalogue: its products, variants, prices and currency, sold by the seller it names
    if (kind === 'offer' && isObj(args.item)) { const product = productJsonLd(args.item as Item, args); return { kind, offers: [product.offers ?? []].flat().length, jsonLd: { '@context': 'https://schema.org', ...product } } }
    if (kind === 'catalogue' && Array.isArray(args.items)) { const products = (args.items as Item[]).map((i) => productJsonLd(i, args)); return { kind, offers: products.reduce((n, p) => n + [p.offers ?? []].flat().length, 0), products: products.length, jsonLd: { '@context': 'https://schema.org', '@type': 'OfferCatalog', ...(typeof args.name === 'string' ? { name: args.name } : {}), itemListElement: products } } }
    const currency = String(args.currency ?? 'eur')
    const offers = CATALOGUE.filter((v) => (kind === 'offer' ? v.product === args.product && v.variant === args.variant : true) && currency in v.amounts).map((v) => offerJsonLd({ product: v.product, variant: v.variant, unit: v.unit, interval: v.interval, currency, amount: v.amounts[currency]!, description: v.description }))
    if (kind === 'offer' && !offers.length) throw new Error(`no variant ${String(args.product)} ${String(args.variant)} in ${currency}`)
    return { kind, offers: offers.length, jsonLd: kind === 'offer' ? offers[0] : { '@context': 'https://schema.org', '@type': 'OfferCatalog', name: 'QPU licences', itemListElement: offers } }
  },
  widget: flowWidget,
})

const codes = defineTool('standards', {
  name: 'codes',
  description: PROSE.quantumProcessingToolboxesStandards_description2,
  inputSchema: { type: 'object', properties: { cldr: { type: 'object', description: '{ languages, currencies, territories }: the CLDR JSON documents as fetched' }, locales: { type: 'array', items: { type: 'string' }, description: PROSE.quantumProcessingToolboxesStandards_locales }, currencies: { type: 'array', items: { type: 'string' }, description: PROSE.quantumProcessingToolboxesStandards_currencies }, territories: { type: 'array', items: { type: 'string' } }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    const list = (v: unknown) => (Array.isArray(v) ? v.map(String) : null)
    const mine = { locales: list(args.locales) ?? Object.keys(LOCALES), currencies: list(args.currencies) ?? [...new Set(CATALOGUE.flatMap((v) => Object.keys(v.amounts)))], territories: list(args.territories) ?? ['BG', 'US'] }
    const documents = STANDARDS.filter((s) => s.kind === 'codes')
    if (!args.cldr) return { phase: 'plan' as const, locales: mine.locales.length, currencies: mine.currencies.length, territories: mine.territories.length, standards: documents.map((s) => ({ id: s.id, contract: s.contract })), requestList: documents.map((s) => ({ id: s.id.replace(/^cldr-/, ''), method: 'GET', url: s.contract, accept: 'application/json' })), mine }
    // a CLDR document of the wrong shape is refused by name, never read as an empty list
    if (!isObj(args.cldr)) throw new Error(PROSE.quantumProcessingToolboxesStandards_cldrShape)
    const read = listCodes(args.cldr as Parameters<typeof listCodes>[0]), given = args.cldr as Record<string, unknown>
    const wrong = (['languages', 'currencies', 'territories'] as const).filter((k) => given[k] !== undefined && read[k].size === 0)
    if (wrong.length || (given.languages === undefined && given.currencies === undefined)) throw new Error(proseFill(PROSE.quantumProcessingToolboxesStandards_cldrDocument, wrong.length ? wrong.join(', ') : 'languages, currencies'))
    const v = validateCodes(read, mine)
    return { phase: 'validated' as const, languagesValidCount: v.languagesValid.length, languagesUnknownCount: v.languagesUnknown.length, currenciesValidCount: v.currenciesValid.length, currenciesUnknownCount: v.currenciesUnknown.length, territoriesValidCount: v.territoriesValid.length, territoriesUnknownCount: v.territoriesUnknown.length, ...v, leads: [...v.languagesUnknown.map((c) => ({ id: `code-language-${c}`, statement: proseFill(PROSE.quantumProcessingToolboxesStandards_statement3, c), status: 'open', reason: PROSE.quantumProcessingToolboxesStandards_reason4 })), ...v.currenciesUnknown.map((c) => ({ id: `code-currency-${c}`, statement: proseFill(PROSE.quantumProcessingToolboxesStandards_statement5, c), status: 'open', reason: PROSE.quantumProcessingToolboxesStandards_reason6 }))] }
  },
  widget: flowWidget,
})

/** Every file against ISO_DIMENSIONS by what it cites: the paths first, as a readList, then each file read back as path → dimensions */
const classifyFiles = (paths: unknown, files?: Readonly<Record<string, string>>) => {
  const asked = askedPaths(paths)
  if (!files) return { phase: 'classify' as const, readList: asked, says: `${asked.length} file(s) to read` }
  const classified = Object.fromEntries(asked.filter((p) => typeof files[p] === 'string').map((p) => [p, isoClassify(files[p]!)]))
  const unclassified = Object.keys(classified).filter((p) => classified[p]!.length === 0)
  const byDimension = Object.fromEntries(ISO_DIMENSIONS.map((d) => [d, Object.values(classified).filter((ds) => ds.includes(d)).length]))
  return { phase: 'classify' as const, files: Object.keys(classified).length, classified, byDimension, unclassified, theorem: 'textbook_iso_classify', says: proseFill(PROSE.quantumProcessingToolboxesStandards_says7, Object.keys(classified).length - unclassified.length, Object.keys(classified).length, unclassified.length) }
}

const validate = defineTool('standards', {
  name: 'validate',
  description: PROSE.quantumProcessingToolboxesStandards_description8,
  inputSchema: { type: 'object', properties: { bound: { type: 'integer', minimum: 1, description: 'standards per slice (default 6)' }, online: { description: PROSE.quantumProcessingToolboxesStandards_description9 }, selftest: { type: 'boolean' }, classify: { description: PROSE.quantumProcessingToolboxesStandards_description10 }, files: { type: 'object' }, physical: { description: '{ device }: the hardware ISO terms with the readings of the device the client runs on' } } },
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
  idea: PROSE.quantumProcessingToolboxesStandards_idea11,
  tools: [jsonld, codes, validate],
  examples: [
    { id: 'standards-validate', tool: 'validate', theorem: 'textbook_standards_sliced', arguments: { bound: 6 }, shows: PROSE.quantumProcessingToolboxesStandards_shows12, expect: (s) => (s.phase === 'standards-validate' && s.standards === STANDARDS.length && s.covered === s.standards && s.uncovered === 0 && s.slices === Math.ceil(STANDARDS.length / 6) && s.bySlice.every((sl: { address: string }) => /^[0-9a-f-]{36}$/.test(sl.address)) && /304 involution/.test(s.cheapest) ? null : JSON.stringify({ std: s.standards, covered: s.covered, slices: s.slices })) },
    { id: 'standards-iso-online', tool: 'validate', theorem: 'textbook_iso_rows_verified', arguments: { online: true }, shows: PROSE.quantumProcessingToolboxesStandards_shows13, expect: (s) => (s.phase === 'requests' && s.source === 'https://www.iso.org/open-data.html' && s.request.url === s.source && s.request.accept === 'text/html' && s.dataset === 'iso_deliverables_metadata' && s.asked === ISO_DIMENSIONS.length && s.holds === false && s.verified === 0 && s.rows.every((r: { verified: boolean }) => r.verified === false) && s.research.source === 'doi' && s.research.standards.join() === 'ISO 690,ISO 26324' && s.research.ecosystem.some((item: { url: string }) => item.url === 'https://api.crossref.org') && s.research.ecosystem.some((item: { url: string }) => item.url === 'https://api.datacite.org') ? null : JSON.stringify({ phase: s.phase, url: s.request?.url, holds: s.holds, research: s.research?.source })) },
    { id: 'standards-iso-page', tool: 'validate', theorem: 'textbook_iso_rows_verified', arguments: { online: { status: 200, text: '<a href="https://www.iso.org/open-data/iso_deliverables_metadata.jsonl">JSONLines</a>' } }, shows: PROSE.quantumProcessingToolboxesStandards_shows14, expect: (s) => (s.phase === 'requests' && s.holds === false && s.verified === 0 && s.source === 'https://www.iso.org/open-data.html' && s.request.url === 'https://www.iso.org/open-data/iso_deliverables_metadata.jsonl' && s.request.accept === 'application/x-ndjson' ? null : JSON.stringify({ phase: s.phase, url: s.request?.url })) },
    { id: 'standards-iso-joined', tool: 'validate', theorem: 'textbook_iso_rows_verified', arguments: { online: { status: 200, text: '{"reference":"ISO 9001:2015","id":1,"currentStage":9093}\n' } }, shows: PROSE.quantumProcessingToolboxesStandards_shows15, expect: (s) => { const named = s.rows.find((r: { dimension: string }) => r.dimension === 'ISO 9001'); return s.phase === 'verified' && s.holds === false && named?.verified === true && named.reference === 'ISO 9001:2015' && named.url === 'https://www.iso.org/standard/1.html' && s.verified === 1 ? null : JSON.stringify({ verified: s.verified, named }) } },
  ],
  skill: {
    instructions: PROSE.quantumProcessingToolboxesStandards_instructions16,
    directions: [PROSE.quantumProcessingToolboxesStandards_s17, PROSE.quantumProcessingToolboxesStandards_s18, PROSE.quantumProcessingToolboxesStandards_s19],
    selftest: () => {
      const { check, done } = createChecks()
      const b = blockJsonLd({ tool: 'clay', id: 'x', description: 'd', date: '2026-01-01T00:00:00.000Z' })
      check('standards:block', b['@type'] === 'CreativeWork' && (b.author as { '@id': string })['@id'] === 'https://orcid.org/0009-0000-7312-9778' && b.dateModified === '2026-01-01T00:00:00.000Z' && b.inLanguage === 'en', PROSE.quantumProcessingToolboxesStandards_s20)
      const p = pageJsonLd({ url: 'https://qpu.uuidna.com/abc', title: 't', description: 'd', uuid: 'abc', locale: 'bg' })
      check('standards:page', p['@type'] === 'WebPage' && p.identifier === 'abc' && p.inLanguage === 'bg' && (p.isPartOf as { url: string }).url === 'https://qpu.uuidna.com', PROSE.quantumProcessingToolboxesStandards_s21)
      const o = offerJsonLd({ product: 'qpu-domain', variant: 'yearly', unit: 'domain', interval: 'year', currency: 'bgn', amount: 84500, description: 'd' })
      check('standards:offer', o.priceCurrency === 'BGN' && o.price === '845.00' && (o.priceSpecification as { unitCode: string }).unitCode === 'ANN', PROSE.quantumProcessingToolboxesStandards_s22)
      const v = validateCodes(listCodes(CLDR_FIXTURE), { locales: Object.keys(LOCALES), currencies: ['eur', 'usd', 'bgn'], territories: ['BG', 'US', 'XX'] })
      check('standards:codes', v.measured && v.languagesUnknown.length === 0 && v.currenciesUnknown.length === 0 && v.territoriesUnknown.join() === 'XX', proseFill(PROSE.quantumProcessingToolboxesStandards_s23, v.languagesValid.length, v.currenciesValid.length))
      const none = validateCodes(listCodes({}), { locales: ['en'], currencies: ['eur'] })
      check('standards:unmeasured', !none.measured && none.languagesUnknown.length === 0, PROSE.quantumProcessingToolboxesStandards_s24)
      check('standards:detect', detectStandard(JSON.stringify({ '@context': 'x', '@graph': [1, 2] }))?.detected === 'json-ld vocabulary' && detectStandard(JSON.stringify(CLDR_FIXTURE.languages))?.detected === 'cldr json' && detectStandard('<html>') === null, PROSE.quantumProcessingToolboxesStandards_s25)
      const iso = verifyIsoQuantumEquivalence()
      check('standards:iso-quantum-equivalence', iso.bijective && iso.noLessQuantum && iso.noMoreQuantum && iso.isoBlockchainProgrammable && iso.sealed, iso.says)
      const plan = verifyIsoOnline()
      const page = verifyIsoOnline({ status: 200, text: '<a href="https://www.iso.org/open-data/iso_deliverables_metadata.jsonl">JSONLines</a>' })
      const joined = verifyIsoOnline({ status: 200, text: '{"reference":"ISO 9001:2015","id":62085,"currentStage":9093}\n{"reference":"ISO 639-1:2002","id":22109,"currentStage":9599}\n' })
      const named = joined.rows.find((row) => row.dimension === 'ISO 9001')
      const retired = joined.rows.find((row) => row.dimension === 'ISO 639-1')
      const defined = verifyIsoOnline({ status: 200, text: [JSON.stringify({"reference":"ISO 9001:2015","id":62085,"currentStage":9093,"title":{"en":"Quality management systems — Requirements"},"scope":{"en":"<p>This document specifies requirements.</p>"}}), JSON.stringify({"reference":"ISO 80000-10:2019/Amd 1:2025","id":1,"currentStage":6060,"supplementType":"Amd","title":{"en":"Amendment 1"}}), JSON.stringify({"reference":"ISO 80000-10:2019","id":64980,"currentStage":9093,"title":{"en":"Quantities and units — Part 10: Atomic and nuclear physics"},"scope":{"en":"<p>This document gives names, symbols, definitions and units.</p>"}}), ''].join('\n') })
      const quality = defined.rows.find((row) => row.dimension === 'ISO 9001')
      const quantity = defined.rows.find((row) => row.dimension === 'ISO 80000-10')
      check('standards:iso-online', plan.phase === 'requests' && plan.request.url === 'https://www.iso.org/open-data.html' && plan.defined === 0 && page.phase === 'requests' && page.request.url === 'https://www.iso.org/open-data/iso_deliverables_metadata.jsonl' && plan.holds === false && plan.asked === ISO_DIMENSIONS.length && joined.holds === false && joined.defined === 0 && named?.verified === true && named.defined === false && named.current === true && named.catalogue === 62085 && retired?.verified === true && retired.current === false && quality?.defined === true && quality.definition === 'This document specifies requirements.' && quality.title === 'Quality management systems — Requirements' && quantity?.reference === 'ISO 80000-10:2019' && quantity.defined === true && quantity.catalogue === 64980, proseFill(PROSE.quantumProcessingToolboxesStandards_s26, plan.asked))
      return done()
    },
  },
}
