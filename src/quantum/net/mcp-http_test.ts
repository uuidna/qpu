import { test } from 'node:test'
import assert from 'node:assert/strict'
import { serveMcp } from './mcp-http.ts'

const post = (body: unknown, env: Record<string, string | undefined> = {}) =>
  serveMcp(new Request('https://qpu.uuidna.com/api/mcp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }), env)

/** ISO/IEC/IEEE 29119-3 test case. Identifier: serveMcp frames tools/list, suppresses a notification, and prices a paid call below the quantum market. */
test('serveMcp frames tools/list, suppresses a notification, and prices a paid call below the quantum market', async () => {
  const list = await post({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} })
  const listed = await list.json()
  assert.equal(list.status, 200)
  assert.ok(listed.result.tools.length > 0, 'tools are listed')

  const note = await post({ jsonrpc: '2.0', method: 'notifications/initialized' })
  assert.equal(note.status, 202, 'a notification is answered with 202 and no body')
  assert.equal(await note.text(), '')

  const paid = await post({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'clay', arguments: {} } }, { QPU_X402_RECIPIENT: '0xWallet' })
  assert.equal(paid.status, 402, 'a paid call with no X-PAYMENT is challenged')
  const accept = (await paid.json()).accepts[0]
  const amount = Number(accept.maxAmountRequired)
  assert.ok(amount > 0, 'the price is positive')
  assert.ok(amount < Math.floor(accept.extra.cheapestRealCallUsd * 1e6), 'the price is below the cheapest real quantum call')
})
