import { test } from 'node:test'
import assert from 'node:assert/strict'
import { callPriceUsd, serveMcp } from './mcp-http.ts'

const post = (body: unknown, env: Record<string, string | undefined> = {}) =>
  serveMcp(new Request('https://qpu.uuidna.com/api/mcp', { method: 'POST', headers: { host: 'qpu.uuidna.com', 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: JSON.stringify(body) }), env)
// a Streamable HTTP answer is one JSON body or an event stream whose data line carries it
const read = async <T>(res: Response): Promise<T> => { const text = await res.text(); return JSON.parse(res.headers.get('content-type')?.includes('text/event-stream') ? text.split('\n').find((l) => l.startsWith('data: '))!.slice(6) : text) as T }

/** ISO/IEC/IEEE 29119-3 test case. Identifier: serveMcp serves the kernel's tools through the Agents SDK, acknowledges a notification, and charges a call through x402 at the quantum market's price. */
test('serveMcp serves the kernel\'s tools through the Agents SDK, acknowledges a notification, and charges a call through x402 at the quantum market\'s price', async () => {
  const list = await post({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} })
  assert.equal(list.status, 200)
  const listed = await read(list) as { result: { tools: { name: string; _meta?: { ui?: unknown } }[] } }
  assert.ok(listed.result.tools.some((t) => t.name === 'fold' && t._meta?.ui), 'the kernel\'s tools are listed with their MCP Apps view')

  const note = await post({ jsonrpc: '2.0', method: 'notifications/initialized' })
  assert.equal(note.status, 202, 'a notification is answered with 202 and no body')

  const paid = await post({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'clay', arguments: {} } }, { QPU_X402_RECIPIENT: '0x0000000000000000000000000000000000000001' })
  const required = (await read(paid) as { result: { _meta: Record<string, { x402Version: number; error: string; accepts: { amount: string; network: string }[] }> } }).result._meta['x402/error']!
  assert.equal(required.x402Version, 2)
  assert.equal(required.error, 'PAYMENT_REQUIRED', 'a call without a payment is challenged')
  assert.equal(Number(required.accepts[0]!.amount), Math.round(callPriceUsd() * 1e6), 'the challenge asks the derived price')
  assert.equal(callPriceUsd(), 0.300425, 'the price is the cheapest real quantum call: the task fee and one shot, as providers charge')

  await assert.rejects(post({ jsonrpc: '2.0', id: 3, method: 'tools/list' }, { QPU_X402_RECIPIENT: '0xWallet' }), 'a wallet that is not an EVM address is refused, never served free')
})
