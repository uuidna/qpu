import test from 'node:test'
import assert from 'node:assert/strict'
import { configKinds } from './payload-vocabulary.ts'
import { domainConfigs, scientificDomains } from './domains.ts'
import { call } from './mcp.ts'

const field = (id: string) => ({ id: `https://openalex.org/fields/${id}` })
const domain = (id: string, name: string, fields: string[]) => ({ id: `https://openalex.org/domains/${id}`, display_name: name, fields: fields.map(field) })
const page = {
  meta: { count: 4 },
  results: [
    domain('3', 'Physical Sciences', ['15', '16', '17', '19', '21', '22', '23', '25', '26', '31']),
    domain('2', 'Social Sciences', ['12', '14', '18', '20', '32', '33']),
    domain('4', 'Health Sciences', ['27', '29', '34', '35', '36']),
    domain('1', 'Life Sciences', ['11', '13', '24', '28', '30']),
  ],
}

/** ISO/IEC/IEEE 29119-3 test case. Identifier: omitted domains return the product formula and one request, and a partial page is not the cover. */
test('omitted domains return the product formula and one request, and a partial page is not the cover', () => {
  const open = scientificDomains()
  assert.equal(open.ran, false)
  assert.equal(open.atOnce, true)
  assert.equal(open.walked, false)
  assert.equal(open.product, null)
  assert.equal(open.request.url, 'https://api.openalex.org/domains?page=1')
  assert.equal(open.request.url.includes('/domains/'), false)
  const part = scientificDomains({ meta: { count: 4 }, results: page.results.slice(0, 1) })
  assert.equal(part.whole, false)
  assert.equal(part.product, null)
  const covered = scientificDomains(page)
  assert.equal(covered.product, '1500')
  assert.equal(covered.fields, 26)
  assert.equal(covered.walked, false)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the leads door covers every scientific domain by the product, and a named domain id does not narrow the request. */
test('the leads door covers every scientific domain by the product, and a named domain id does not narrow the request', () => {
  const named = call('leads', { domains: { id: '3' } })
  assert.ok('result' in named)
  const open = (named.result as { structuredContent: { ran: boolean; request: { url: string }; product: null } }).structuredContent
  assert.equal(open.ran, false)
  assert.equal(open.product, null)
  assert.equal(open.request.url.includes('/domains/3'), false)
  const covered = call('leads', { domains: { page } })
  assert.ok('result' in covered)
  const row = (covered.result as { structuredContent: { product: string; whole: boolean; walked: boolean } }).structuredContent
  assert.equal(row.product, '1500')
  assert.equal(row.whole, true)
  assert.equal(row.walked, false)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every Payload config UUID carries the domain product, and a named domain id does not narrow it. */
test('every Payload config UUID carries the domain product, and a named domain id does not narrow it', () => {
  const open = domainConfigs({ id: '3' })
  assert.equal(open.improved, false)
  assert.equal(open.product, null)
  assert.equal(open.configs, configKinds.length)
  assert.ok(open.domains.ran === false, 'no page was handed, so the cover is the one request')
  assert.equal(open.domains.request.url.includes('/domains/3'), false)
  assert.equal(open.rows.every((row) => row.sealed), true)
  const covered = call('payload', { improve: { domains: { id: '3', page } } })
  assert.ok('result' in covered)
  const row = (covered.result as { structuredContent: { improved: boolean; product: string; configs: number; walked: boolean; hosts: string[]; sealed: boolean } }).structuredContent
  assert.equal(row.improved, true)
  assert.equal(row.product, '1500')
  assert.equal(row.configs, configKinds.length)
  assert.equal(row.walked, false)
  assert.equal(row.sealed, true)
  assert.deepEqual(row.hosts, ['qpu.uuidna.com', 'qpu.psg.bg'])
  const configured = call('configure', { domains: { page } })
  assert.ok('result' in configured)
  const config = (configured.result as { structuredContent: { via: string; product: string } }).structuredContent
  assert.equal(config.via, 'uuid-payload-config')
  assert.equal(config.product, '1500')
})
