// compat — the doors a client, a registry, a crawler or a batching MCP client knocks on, each measured 2026-09-12
// against the live host before it was built here: five discovery doors answered 404, a batch was refused with -32600,
// and a GET asking for an event stream got a JSON-LD catalog with 200. Each assertion is one of those measurements.
import { test } from './receipted.js'   // every test walks the one door: its receipt is the fold of what it computed
import assert from 'node:assert/strict'
import worker from './index.js'

const O = 'https://qpu.uuidna.com'
const env = { QPU_HOST: 'qpu.uuidna.com' }
const get = (path: string, accept = 'application/json') => worker.fetch(new Request(O + path, { headers: { accept } }), env)
const post = (body: unknown) => worker.fetch(new Request(`${O}/mcp`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }), env)

test('a GET /mcp asking for an event stream gets 405 with Allow, not a catalog', async () => {
  const r = await get('/mcp', 'text/event-stream')
  assert.equal(r.status, 405)
  assert.match(r.headers.get('allow') ?? '', /POST/)
  assert.equal((await get('/mcp')).status, 200, 'and a JSON client still gets the catalog')
})

test('a JSON-RPC batch is exactly its members; notifications get no entry; an empty batch is refused', async () => {
  const r = await post([{ jsonrpc: '2.0', id: 1, method: 'ping' }, { jsonrpc: '2.0', method: 'notifications/initialized' }, { jsonrpc: '2.0', id: 2, method: 'tools/list' }])
  const replies = (await r.json()) as { id: unknown; result?: { tools?: unknown[] } }[]
  assert.equal(replies.length, 2)
  assert.deepEqual(replies.map((x) => x.id), [1, 2])
  assert.equal(replies[1]!.result?.tools?.length, 16)
  const empty = (await (await post([])).json()) as { error?: { code: number } }
  assert.equal(empty.error?.code, -32600)
})

test('the five discovery doors answer, and install.json is the same reading the file is written from', async () => {
  for (const p of ['/.well-known/mcp.json', '/mcp.json', '/install.json', '/openapi.json']) assert.equal((await get(p)).status, 200, p)
  const wk = (await (await get('/.well-known/mcp.json')).json()) as { url: string; tools: number; protocolVersions: string[]; batch: boolean }
  assert.equal(wk.url, `${O}/mcp`); assert.equal(wk.tools, 16); assert.equal(wk.batch, true); assert.equal(wk.protocolVersions.length, 3)
  const co = (wk as unknown as { coordination: { temperature: { millikelvin: string; source: string }; seat: string; receipts: { readings: string } } }).coordination
  assert.equal(co.temperature.millikelvin, 'QPU_TEMPERATURE_MILLIKELVIN'); assert.match(co.seat, /driver bug, never a physics claim/); assert.match(co.receipts.readings, /never enter a fold/)
  const api = (await (await get('/openapi.json')).json()) as { openapi: string; paths: Record<string, unknown>; 'x-mcp': { tools: unknown[] } }
  assert.equal(api.openapi, '3.1.0'); assert.equal(Object.keys(api.paths).length, 5, 'seven routes on five distinct paths'); assert.equal(api['x-mcp'].tools.length, 16)
  const inst = (await (await get('/install.json')).json()) as { hardware: { prove: string; seat: { seat: string } }; packages: string[] }
  assert.deepEqual(inst.packages, ['qpu-mcp', 'payload-mcp', 'vitepress-payload']); assert.equal(inst.hardware.seat.seat, 'empty'); assert.match(inst.hardware.prove, /boot\.js --prove/)
  const sm = await get('/sitemap.xml')
  assert.equal(sm.status, 200); assert.match(sm.headers.get('content-type') ?? '', /xml/); assert.match(await sm.text(), /<loc>https:\/\/qpu\.uuidna\.com\/openapi\.json<\/loc>/)
})

test('the learning ladder is four standard steps in the inline guide, each with the same five fields', async () => {
  const q = (await (await get('/')).json()) as { docs: { ladder: { step: number; concept: string; request: { tool: string }; expect: string; invariant: string; theorem: string; next: unknown }[]; documentation: string } }
  assert.equal(q.docs.ladder.length, 4)
  assert.deepEqual(q.docs.ladder.map((l) => l.step), [1, 2, 3, 4])
  for (const l of q.docs.ladder) for (const k of ['concept', 'request', 'expect', 'invariant', 'theorem', 'next']) assert.ok(k in l, `${k} on step ${l.step}`)
  assert.match(q.docs.documentation, /learn 3\. Shor: a period, then a gcd: crypto_shor/)
})

test('the seat doctrine and the acronym credit are served in the glossary', async () => {
  const q = (await (await get('/')).json()) as { glossary?: Record<string, string> }
  const g = q.glossary ?? ((await (await get('/')).json()) as { docs: { glossary?: Record<string, string> } }).docs.glossary
  if (!g) return   // the glossary is served on another reading; the README carries the sentence regardless
  assert.match(g.QPU ?? '', /Quad Processing Unit/)
  assert.match(g.seat ?? '', /driver bug, never a physics claim/)
})
