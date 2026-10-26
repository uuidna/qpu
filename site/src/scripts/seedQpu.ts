// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.
// The site seeded from the one content source: every document payload { site: true } lays out, created as a page of the app through
// Payload's local API; a page already there (by slug) is left as it is. Run with: pnpm payload run src/scripts/seedQpu.ts
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'
import config from '@payload-config'
import { handle } from '@uuidna/qpu/mcp'

const main = async () => {
  const payload = await getPayload({ config })
  const site = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'payload', arguments: { site: true } } }) as { result: { structuredContent: { collection: { docs: { id: string; title: string; slug: string; layout: Record<string, unknown>[]; meta: { title: string; description: string } }[] } } } }).result.structuredContent.collection.docs
  // the tenants from the configs first: one per host, by slug; the super admin seeds, so no user is passed; every scoped document below belongs to the first tenant
  const tenants = {"uuidna":{"name":"uuidna","slug":"uuidna","domains":[{"domain":"qpu.uuidna.com"}],"currency":"EUR"},"psg":{"name":"psg","slug":"psg","domains":[{"domain":"qpu.psg.bg"}],"currency":"EUR"}} as Record<string, { name: string; slug: string; domains: { domain: string }[]; currency: string }>
  let tenantsCreated = 0
  for (const t of Object.values(tenants)) {
    const found = await payload.find({ collection: 'tenants' as never, where: { slug: { equals: t.slug } }, limit: 1, overrideAccess: true })
    if (found.totalDocs) continue
    await payload.create({ collection: 'tenants' as never, overrideAccess: true, data: t as never })
    tenantsCreated += 1
  }
  const tenant = (await payload.find({ collection: 'tenants' as never, where: { slug: { equals: Object.keys(tenants)[0] } }, limit: 1, overrideAccess: true })).docs[0] as { id: string } | undefined
  if (!tenant) throw new Error('no tenant to scope the documents to')
  // the first user from the deployer's account: a deploy creates it (no create-first-user form), its password unknown to everyone — the admin sets one through
  // the panel's reset (forgot password) with the mail the app sends; the email from FIRST_USER_EMAIL, else CLOUDFLARE_EMAIL, else wrangler whoami; none: the form stands
  let firstUser = 'none'
  if (!(await payload.count({ collection: 'users', overrideAccess: true })).totalDocs) {
    const email = process.env.FIRST_USER_EMAIL ?? process.env.CLOUDFLARE_EMAIL ?? (() => { try { return /associated with the email ([^\s]+@[^\s]+?)[.,;]?(?:\s|$)/.exec(execSync('npx wrangler whoami', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).replace(/\u001b\[[0-9;]*m/g, ''))?.[1] ?? null } catch { return null } })()
    if (email) { await payload.create({ collection: 'users', overrideAccess: true, context: { disableRevalidate: true }, data: { email, password: randomUUID() + randomUUID(), firstName: 'Super', lastName: 'Admin', roles: ['admin'], enableAPIKey: false, tenants: [{ tenant: tenant.id, roles: ['tenant-admin'] }] } as never }); firstUser = 'created from the account email (its password unknown: reset it through the admin panel)' }
    else firstUser = 'no account email known (FIRST_USER_EMAIL, CLOUDFLARE_EMAIL, wrangler whoami): the create-first-user form of the admin panel stands'
  } else firstUser = 'a user exists already'
  let created = 0, kept = 0, updated = 0
  for (const d of site) {
    const slug = d.slug.replace(/^\//, '')
    const found = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true, draft: true })
    if (found.totalDocs) { const page = found.docs[0] as { id: string; _status?: string; layout?: unknown[] }; const stale = JSON.stringify((page.layout ?? []).map((b) => { const { id: _id, ...rest } = b as { id?: string }; return rest })) !== JSON.stringify(d.layout); if (page._status !== 'published' || stale) await payload.update({ collection: 'pages', id: page.id, overrideAccess: true, context: { disableRevalidate: true }, data: { _status: 'published', ...(stale ? { layout: d.layout } : {}) } as never }); kept += 1; if (stale) updated += 1; continue }
    // published: the site is what the QPU computes, public at once; a draft would answer no reader
    await payload.create({ collection: 'pages', overrideAccess: true, context: { disableRevalidate: true }, data: { title: d.title, slug, hero: { type: 'default' }, layout: d.layout, meta: d.meta, tenant: tenant.id, _status: 'published' } as never })
    created += 1
  }
  // the licence catalogue as products of the ecommerce plugin: one per variant, by title, prices in the minor unit per currency
  const catalogue = [{"title":"QPU a432 · harmonic-default","licence":{"product":"qpu-a432","variant":"harmonic-default","unit":"none","interval":"once","domains":"*"},"prices":{"priceInEUR":0,"priceInUSD":0,"priceInBGN":0}},{"title":"QPU domain · yearly","licence":{"product":"qpu-domain","variant":"yearly","unit":"domain","interval":"year","domains":"named"},"prices":{"priceInEUR":43200,"priceInUSD":48374,"priceInBGN":84492}},{"title":"QPU domain · monthly","licence":{"product":"qpu-domain","variant":"monthly","unit":"domain","interval":"month","domains":"named"},"prices":{"priceInEUR":4320,"priceInUSD":4837,"priceInBGN":8449}},{"title":"QPU tenant · yearly","licence":{"product":"qpu-tenant","variant":"yearly","unit":"tenant","interval":"year","domains":"*"},"prices":{"priceInEUR":216000,"priceInUSD":241870,"priceInBGN":422459}},{"title":"QPU seat · monthly","licence":{"product":"qpu-seat","variant":"monthly","unit":"seat","interval":"month","domains":"*"},"prices":{"priceInEUR":2700,"priceInUSD":3023,"priceInBGN":5281}},{"title":"QPU metered · per-thousand-calls","licence":{"product":"qpu-metered","variant":"per-thousand-calls","unit":"thousand-calls","interval":"metered","domains":"*"},"prices":{"priceInEUR":108,"priceInUSD":121,"priceInBGN":211}},{"title":"QPU enterprise · platform","licence":{"product":"qpu-enterprise","variant":"platform","unit":"platform","interval":"year","domains":"*"},"prices":{"priceInEUR":1080000,"priceInUSD":1209350,"priceInBGN":2112296}}] as { title: string; licence: Record<string, string>; prices: Record<string, number> }[]
  let products = 0
  for (const item of catalogue) {
    const found = await payload.find({ collection: 'products' as never, where: { title: { equals: item.title } }, limit: 1, overrideAccess: true })
    if (found.totalDocs) continue
    await payload.create({ collection: 'products' as never, overrideAccess: true, context: { disableRevalidate: true }, data: { title: item.title, licence: item.licence, tenant: tenant.id, ...Object.fromEntries(Object.entries(item.prices).flatMap(([k, v]) => [[k, v], [k + 'Enabled', true]])), _status: 'published' } as never })
    products += 1
  }
  console.log(`seed: ${created} page(s) created, ${kept} kept (${updated} relaid), from ${site.length} documents; ${tenantsCreated} tenant(s) created of ${Object.keys(tenants).length}; ${products} product(s) created of ${catalogue.length}; first user: ${firstUser}`)
}
// awaited at the top level: payload run returns when the module has loaded, so a pending promise would be left behind (measured: the seed printed nothing and wrote nothing)
await main()
process.exit(0)
