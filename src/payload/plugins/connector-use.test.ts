import { test } from 'node:test'
import assert from 'node:assert/strict'
import { connectorUseOf, publicConnectorOf } from './permaculture.js'
import { qpuMcpDiscoverOf } from '../../quantum/processing/unit/index.js'

test('connector { use: true } maps tools/list bill vs fused routes; goal stays OPEN', () => {
  const use = connectorUseOf()
  assert.equal(use.kind, 'connector-use')
  assert.equal(use.call, 'tools/call connector { use: true }')
  assert.equal(use.goal, 'OPEN')
  assert.equal(use.holds, true)
  assert.ok(use.connectBill.under16384)
  assert.equal(use.connectBill.qpuPrefixed, 0)
  assert.ok(use.connectBill.doors <= 16)
  assert.ok(use.routes.some((r) => 'use' in r.args && r.args.use === true))
  assert.ok(use.routes.some((r) => 'goal' in r.args && r.args.goal === true))
  assert.ok(use.routes.some((r) => 'seal' in r.args && r.args.seal === true))
  assert.ok(use.not.some((n) => /legal document/i.test(n)))
  assert.ok(use.not.some((n) => /Google Drive/i.test(n)))
  assert.equal(use.perplexity.transport, 'streamable-http')
  assert.ok(use.perplexity.server_url.includes('/mcp'))
  assert.equal(use.perplexity.agent_api.type, 'mcp')
  assert.ok(use.perplexity.first_calls.some((c) => c.includes('{ use: true }')))
  assert.ok(publicConnectorOf().use.via.includes('{ use: true }'))
})

test('MCP initialize instructions name fused connector { use: true }', () => {
  const d = qpuMcpDiscoverOf()
  assert.equal(d.holds, true)
  assert.ok(d.instructions.includes('connector { use: true }'))
  assert.ok(d.instructions.includes('not legal-doc or Drive'))
})
