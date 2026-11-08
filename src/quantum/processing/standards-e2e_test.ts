import test from 'node:test'
import assert from 'node:assert/strict'
import { call } from './mcp.ts'

const page = (d: { _status: string; hero: { type: string }; title: string; slug: string; layout: { blockType: string; contentFields: { layout: string; columnOne: { root: { children: { children: { text: string }[] }[] } } } }[]; meta: { title: string }; breadcrumbs: { url: string }[] }) => d._status === 'draft' && d.hero.type === 'default' && d.layout.length === 1 && d.layout[0]!.blockType === 'content' && d.layout[0]!.contentFields.layout === 'oneColumn' && d.meta.title === d.title && d.breadcrumbs[0]!.url === `/${d.slug}`

/** ISO/IEC/IEEE 29119-3 test case. Identifier: quantum standard leads are pages seeds through the MCP e2e door. */
test('quantum standard leads are pages seeds through the MCP e2e door', () => {
  const s = call('e2e', { standards: true }).result!.structuredContent
  const listed = call('leads', { ids: s.leads.map((l: { id: string }) => l.id) }).result!.structuredContent
  const pairSlugs = new Set(s.docs.map((d: { slug: string }) => d.slug))
  const leadSlugs = new Set(s.leadDocs.map((d: { slug: string }) => d.slug))
  assert.equal(s.phase, 'seed')
  assert.equal(s.collection, 'pages')
  assert.equal(s.schema, 'pages')
  assert.equal(s.standard, 'ISO/IEC 4879:2024')
  assert.equal(s.bijective, true)
  assert.equal(s.pairs, (s.standards * (s.standards - 1)) / 2)
  assert.equal(s.count, s.docs.length)
  assert.equal(s.agree + s.disagree, s.count)
  assert.equal(pairSlugs.size, s.docs.length)
  assert.equal(s.docs.every(page), true)
  assert.equal(s.leads.length, s.leadDocs.length)
  assert.ok(s.leads.length >= 77)
  assert.equal(leadSlugs.size, s.leadDocs.length)
  assert.equal(s.leadDocs.every(page), true)
  assert.equal(s.leads.every((l: { status: string; tool: string; url: string; statement: string }, i: number) => l.status === 'served' && l.tool === 'e2e' && l.url === `/${s.leadDocs[i].slug}` && l.statement.includes(l.url)), true)
  assert.equal(listed.leads.length, s.leads.length)
  assert.equal(listed.unknown.length, 0)
  assert.equal(listed.leads.every((l: { status: string; tool: string }) => l.status === 'served' && l.tool === 'e2e'), true)
})
