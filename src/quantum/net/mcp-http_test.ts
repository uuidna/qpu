import { test } from 'node:test'
import assert from 'node:assert/strict'
import { callPriceUsd, isMcp, serveMcp } from './mcp-http.ts'

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

// Node's Request carries no Host header: set it from the URL, as the Worker's runtime does
const hosted = (url: string, init: RequestInit = {}) => { const r = new Request(url, init); const h = new Headers(r.headers); h.set('host', new URL(url).host); return new Request(r, { headers: h }) }
const site = () => Promise.resolve(new Response('<html>site</html>', { headers: { 'content-type': 'text/html' } }))
const worker = (r: Request) => (isMcp(r) ? serveMcp(r, { QPU_MCP_HOSTS: 'qpu.test' }) : site())
const rpc = (url: string, body: unknown, headers: Record<string, string> = {}) => hosted(url, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', ...headers }, body: JSON.stringify(body) })

/** ISO/IEC/IEEE 29119-3 test case. Identifier: an agent harness pointed at the domain, /mcp or /api/mcp initializes, lists and calls. */
test('an agent harness pointed at the domain, /mcp or /api/mcp initializes, lists and calls', async () => {
  for (const url of ['https://qpu.test', 'https://qpu.test/', 'https://qpu.test/mcp', 'https://qpu.test/api/mcp']) {
    const init = await worker(rpc(url, { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'harness', version: '1' } } }))
    assert.equal(init.status, 200, url)
    const list = await read(await worker(rpc(url, { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }))) as { result: { tools: { name: string }[] } }
    assert.ok(list.result.tools.length > 10, `${url}: ${list.result.tools.length} tools`)
    const called = await read(await worker(rpc(url, { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'currency', arguments: { selftest: true } } }))) as { result?: { content?: unknown[] } }
    assert.ok(called.result?.content, `${url}: answered`)
  }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a browser at / and /mcp still gets the site, and a browser-based client from another origin is served. */
test('a browser at / and /mcp still gets the site, and a browser-based client from another origin is served', async () => {
  for (const p of ['/', '/mcp']) assert.equal(isMcp(new Request(`https://qpu.test${p}`, { headers: { accept: 'text/html,*/*' } })), false, p)
  const r = await serveMcp(rpc('https://qpu.test/mcp', { jsonrpc: '2.0', id: 1, method: 'tools/list' }, { origin: 'https://inspector.example' }), { QPU_MCP_HOSTS: 'qpu.test' })
  assert.equal(r.status, 200, await r.clone().text())
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every example's arguments satisfy the schema its tool advertises, so a client the SDK validates reaches what the kernel answers. */
test('every example\'s arguments satisfy the schema its tool advertises, so a client the SDK validates reaches what the kernel answers', async () => {
  const [{ EXAMPLES }, { handle }, { z }] = await Promise.all([import('../processing/examples.ts'), import('../processing/mcp.ts'), import('zod')])
  const tools = new Map(((await handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' } as never)) as any).result.tools.map((t: { name: string; inputSchema: object }) => [t.name, t.inputSchema]))
  assert.deepEqual(EXAMPLES.filter((e) => tools.has(e.tool) && !z.fromJSONSchema(tools.get(e.tool) as never).safeParse(e.arguments).success).map((e) => e.id), [])
})
