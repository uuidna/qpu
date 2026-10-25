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
  console.log(`seed: ${created} page(s) created, ${kept} kept, from ${site.length} documents`)
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
