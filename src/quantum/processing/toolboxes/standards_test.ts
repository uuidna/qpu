import test from 'node:test'
import assert from 'node:assert/strict'
import { call } from '../mcp.ts'
import { TABLES } from '../tables-index.ts'

const ask = (name: string, args: Record<string, unknown>) => { const r = call(name, args); if (r.error) throw new Error(r.error.message); return r.result!.structuredContent }
const CLDR = Object.fromEntries(Object.entries(TABLES.CLDR_FIXTURE).map(([k, v]) => [k, JSON.parse(v)]))

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a page on a tenant's own site carries the identity its caller names, never qpu's, and qpu's own pages keep qpu's. */
test('a page on a tenant\'s own site carries the identity its caller names, never qpu\'s, and qpu\'s own pages keep qpu\'s', () => {
  const page = { kind: 'page', url: 'https://law.example/bg/uslugi', title: 'Услуги', description: 'Правна помощ', locale: 'bg-BG' }
  const bare = ask('jsonld', page).jsonLd
  assert.deepEqual(bare.isPartOf, { '@type': 'WebSite', url: 'https://law.example' }, 'the site it lives on, derived from its url')
  assert.ok(!('author' in bare) && !('license' in bare) && !('about' in bare), 'nothing of qpu is published as the tenant\'s')
  assert.deepEqual(Object.keys(bare).filter((k) => ['@context', '@type', '@id', 'url', 'name', 'description', 'inLanguage'].includes(k)).length, 7, 'the fields an integrator reads stay in the default answer')
  assert.equal(bare.inLanguage, 'bg-BG', 'any BCP 47 tag')
  const named = ask('jsonld', { ...page, publisher: 'Law Firm Ltd', author: { '@type': 'Organization', name: 'Law Firm Ltd' }, isPartOf: 'https://law.example/', license: 'https://law.example/terms' }).jsonLd
  assert.deepEqual([named.publisher, named.author.name, named.isPartOf.url, named.license], [{ '@type': 'Organization', name: 'Law Firm Ltd' }, 'Law Firm Ltd', 'https://law.example/', 'https://law.example/terms'])
  const own = ask('jsonld', { kind: 'page', url: 'https://qpu.uuidna.com/x', title: 't', description: 'd' }).jsonLd
  assert.equal(own.isPartOf.url, 'https://qpu.uuidna.com', 'qpu\'s own pages are still qpu\'s')
  assert.equal(own.author['@type'], 'Person')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: any caller's catalogue is answered as schema.org products with their variants, prices and currency, and a malformed price or currency is refused by name. */
test('any caller\'s catalogue is answered as schema.org products with their variants, prices and currency, and a malformed price or currency is refused by name', () => {
  const items = [{ name: 'Consultation', sku: 'C-1', price: '120.00', currency: 'bgn' }, { name: 'Contract review', sku: 'R', variants: [{ name: 'up to 10 pages', price: 200 }, { name: 'over 10 pages', price: '350.50', currency: 'EUR' }] }]
  const cat = ask('jsonld', { kind: 'catalogue', name: 'Services', items, currency: 'BGN', seller: 'Law Firm Ltd' })
  assert.equal(cat.jsonLd['@type'], 'OfferCatalog')
  assert.equal(cat.jsonLd.name, 'Services')
  assert.deepEqual([cat.products, cat.offers], [2, 3])
  const [one, two] = cat.jsonLd.itemListElement
  assert.deepEqual([one['@type'], one.sku, one.offers.price, one.offers.priceCurrency, one.offers.seller.name], ['Product', 'C-1', '120.00', 'BGN', 'Law Firm Ltd'])
  assert.deepEqual(two.offers.map((o: { price: string; priceCurrency: string }) => `${o.price} ${o.priceCurrency}`), ['200 BGN', '350.50 EUR'])
  const offer = ask('jsonld', { kind: 'offer', item: items[0] })
  assert.equal(offer.jsonLd['@context'], 'https://schema.org')
  assert.match(call('jsonld', { kind: 'offer', item: { name: 'X', price: 1, currency: 'leva' } }).error!.message, /X: currency "leva" is not an ISO 4217 code/)
  assert.match(call('jsonld', { kind: 'catalogue', items: [{ name: 'Y', price: 'free', currency: 'EUR' }] }).error!.message, /Y: price "free"/)
  assert.equal(ask('jsonld', { kind: 'catalogue' }).jsonLd.name, 'QPU licences', 'without items, the tree\'s own catalogue as before')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: codes validates the caller's own languages and currencies, names the documents to fetch, and refuses a document of the wrong shape instead of answering unmeasured. */
test('codes validates the caller\'s own languages and currencies, names the documents to fetch, and refuses a document of the wrong shape instead of answering unmeasured', () => {
  const plan = ask('codes', { locales: ['bg-BG', 'de'], currencies: ['BGN', 'CHF'] })
  assert.deepEqual(plan.mine.currencies, ['BGN', 'CHF'])
  assert.deepEqual(plan.requestList.map((r: { id: string; url: string }) => [r.id, r.url]), plan.standards.map((s: { id: string; contract: string }) => [s.id.replace(/^cldr-/, ''), s.contract]))
  const v = ask('codes', { cldr: CLDR, locales: ['bg-BG', 'en', 'zz'], currencies: ['bgn', 'XXQ'] })
  assert.equal(v.measured, true)
  assert.deepEqual([v.languagesValid, v.languagesUnknown], [['bg-BG', 'en'], ['zz']])
  assert.deepEqual([v.currenciesValid, v.currenciesUnknown], [['bgn'], ['XXQ']])
  assert.match(call('codes', { cldr: { languages: { languages: ['bg'] }, currencies: CLDR.currencies } }).error!.message, /languages have the wrong shape/)
  assert.match(call('codes', { cldr: 'https://example.org/languages.json' }).error!.message, /cldr is an object/)
})
