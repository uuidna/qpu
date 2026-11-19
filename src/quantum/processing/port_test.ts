// The port of every Payload adapter onto Cloudflare, tested over the whole space by its combinatorics: every one of the fifty combinations
// through the MCP (the same handler the Payload MCP plugin serves), each a workflow whose every step has a Cloudflare MCP call or is a missing
// link, the missing links found and each a lead, the adapters' order the configure kind's own.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { call } from './mcp.ts'
import { compositions, compositionIndex } from '../uuid/index.ts'
import { PORT_ORDER, PORT_RADICES, CLOUDFLARE_PORT } from './port.ts'
import { ADAPTERS } from './toolboxes/payload.ts'

const port = (p: number | boolean) => (call('configure', { kind: 'adapters', port: p }) as { result: { structuredContent: { config: any } } }).result.structuredContent.config

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the port reads the adapters in the order of the configure kind, and every adapter has its port. */
test('the port reads the adapters in the order of the configure kind, and every adapter has its port', () => {
  assert.deepEqual([...PORT_ORDER.database], ADAPTERS.database.map((a) => a.pkg))
  assert.deepEqual([...PORT_ORDER.storage], ADAPTERS.storage.map((a) => a.pkg))
  assert.deepEqual([...PORT_ORDER.email], ADAPTERS.email.map((a) => a.pkg))
  for (const pkg of [...PORT_ORDER.database, ...PORT_ORDER.storage, ...PORT_ORDER.email]) assert.ok(CLOUDFLARE_PORT[pkg], `${pkg} has a port`)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every combination, through the MCP, is a workflow with its bindings, its steps and their MCP calls or its missing links. */
test('every combination, through the MCP, is a workflow with its bindings, its steps and their MCP calls or its missing links', () => {
  const count = Number(compositions([...PORT_RADICES]))
  assert.equal(count, PORT_RADICES.reduce((a, r) => a * r, 1))
  for (let i = 0; i < count; i++) {
    const p = port(i)
    assert.equal(Number(compositionIndex([...PORT_RADICES], p.digits)), i, 'the digits make the index back')
    assert.ok(p.workflow.length >= 3, `combination ${i} has its steps`)
    assert.ok(Object.keys(p.bindings).length >= 1 || p.email === 'email-resend', `combination ${i} binds what it needs`)
    assert.equal(p.complete, p.missing.length === 0)
    for (const w of p.workflow) assert.ok(w.mcp === null || typeof w.mcp.tool === 'string')
  }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the missing links are found over the whole space, each a lead naming the combinations it blocks; the MCP APIs it calls are named. */
test('the missing links are found over the whole space, each a lead naming the combinations it blocks; the MCP APIs it calls are named', () => {
  const s = port(true)
  assert.equal(s.complete + s.blocked, s.combinations)
  assert.equal(s.leads.length, s.missingLinks)
  for (const l of s.leads) assert.match(l.statement, new RegExp(`blocks \\d+ of ${s.combinations} combinations`))
  assert.ok(s.mcpTools.includes('r2_bucket_create') && s.mcpTools.includes('hyperdrive_configs_list'))
  assert.deepEqual(s.completeOnes, ['db-d1-sqlite + storage-r2 + email-resend'], 'the one combination every step of which an MCP API covers today')
})
