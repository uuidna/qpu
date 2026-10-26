// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.
// The site seeded from the one content source: every document payload { site: true } lays out, created as a page of the app through
// Payload's local API; a page already there (by slug) is left as it is. Run with: pnpm payload run src/scripts/seedQpu.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { handle } from '@uuidna/qpu/mcp'

const main = async () => {
  const payload = await getPayload({ config })
  const site = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'payload', arguments: { site: true } } }) as { result: { structuredContent: { collection: { docs: { id: string; title: string; slug: string; layout: Record<string, unknown>[]; meta: { title: string; description: string } }[] } } } }).result.structuredContent.collection.docs
  let created = 0, kept = 0
  for (const d of site) {
    const slug = d.slug.replace(/^\//, '')
    const found = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true })
    if (found.totalDocs) { kept += 1; continue }
    await payload.create({ collection: 'pages', overrideAccess: true, data: { title: d.title, slug, hero: { type: 'default' }, layout: d.layout, meta: d.meta } as never })
    created += 1
  }
  // the licence catalogue as products of the ecommerce plugin: one per variant, by title, prices in the minor unit per currency
  const catalogue = [{"title":"QPU a432 · harmonic-default","licence":{"product":"qpu-a432","variant":"harmonic-default","unit":"none","interval":"once","domains":"*"},"prices":{"priceInEUR":0,"priceInUSD":0,"priceInBGN":0}},{"title":"QPU domain · yearly","licence":{"product":"qpu-domain","variant":"yearly","unit":"domain","interval":"year","domains":"named"},"prices":{"priceInEUR":43200,"priceInUSD":48354,"priceInBGN":84492}},{"title":"QPU domain · monthly","licence":{"product":"qpu-domain","variant":"monthly","unit":"domain","interval":"month","domains":"named"},"prices":{"priceInEUR":4320,"priceInUSD":4835,"priceInBGN":8449}},{"title":"QPU tenant · yearly","licence":{"product":"qpu-tenant","variant":"yearly","unit":"tenant","interval":"year","domains":"*"},"prices":{"priceInEUR":216000,"priceInUSD":241769,"priceInBGN":422459}},{"title":"QPU seat · monthly","licence":{"product":"qpu-seat","variant":"monthly","unit":"seat","interval":"month","domains":"*"},"prices":{"priceInEUR":2700,"priceInUSD":3022,"priceInBGN":5281}},{"title":"QPU metered · per-thousand-calls","licence":{"product":"qpu-metered","variant":"per-thousand-calls","unit":"thousand-calls","interval":"metered","domains":"*"},"prices":{"priceInEUR":108,"priceInUSD":121,"priceInBGN":211}},{"title":"QPU enterprise · platform","licence":{"product":"qpu-enterprise","variant":"platform","unit":"platform","interval":"year","domains":"*"},"prices":{"priceInEUR":1080000,"priceInUSD":1208844,"priceInBGN":2112296}}] as { title: string; licence: Record<string, string>; prices: Record<string, number> }[]
  let products = 0
  for (const item of catalogue) {
    const found = await payload.find({ collection: 'products' as never, where: { title: { equals: item.title } }, limit: 1, overrideAccess: true })
    if (found.totalDocs) continue
    await payload.create({ collection: 'products' as never, overrideAccess: true, data: { title: item.title, licence: item.licence, ...Object.fromEntries(Object.entries(item.prices).flatMap(([k, v]) => [[k, v], [k + 'Enabled', true]])), _status: 'published' } as never })
    products += 1
  }
  console.log(`seed: ${created} page(s) created, ${kept} kept, from ${site.length} documents; ${products} product(s) created of ${catalogue.length}`)
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
