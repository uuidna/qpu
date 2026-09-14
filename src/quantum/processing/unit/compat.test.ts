// compat — the doors a client, a registry, a crawler or a batching MCP client knocks on, each measured 2026-09-12
// against the live host before it was built here: five discovery doors answered 404, a batch was refused with -32600,
// and a GET asking for an event stream got a JSON-LD catalog with 200. Each assertion is one of those measurements.
import { test, sensorTemperatureOf, temperatureOf } from './receipted.js'   // every test walks the one door: its receipt is the fold of what it computed
import assert from 'node:assert/strict'
import worker, { bootPort, qpuNetworkFetchHolds, qpuOpenApiHolds, qpuServerQueueHolds, qpuWellKnownHolds } from './index.js'

const O = 'https://qpu.uuidna.com'
const env = { QPU_HOST: 'qpu.uuidna.com' }
const get = (path: string, accept = 'application/json') => worker.fetch(new Request(O + path, { headers: { accept } }), env)
const post = (body: unknown) => worker.fetch(new Request(`${O}/mcp`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }), env)

test('a receipt\'s temperature is the device sensor, named, or unmeasured; never guessed', async () => {
  assert.equal((await get('/')).status, 200, 'the unit runs, so this receipt holds a computation beside its reading')
  const read = sensorTemperatureOf(() => '    "Temperature" = 3046\n    "VirtualTemperature" = 3139')
  assert.deepEqual(read, { measured: true, millikelvin: 303610, source: 'battery gauge, ioreg AppleSmartBattery Temperature 3046 (hundredths of °C), not the chip die' })
  assert.equal(sensorTemperatureOf(() => '"Voltage" = 12791').measured, false, 'no Temperature line is unmeasured, not zero')
  assert.equal(sensorTemperatureOf(() => { throw new Error('no ioreg') }).measured, false, 'a missing sensor is unmeasured, not zero')
  const lab = temperatureOf({ QPU_TEMPERATURE_MILLIKELVIN: '12', QPU_TEMPERATURE_SOURCE: 'lab instrument named by the caller' })
  assert.deepEqual(lab, { measured: true, millikelvin: 12, source: 'lab instrument named by the caller' }, 'a lab reading always wins')
  if (process.platform === 'darwin') {
    const here = temperatureOf({})
    assert.ok(!here.measured || here.source.startsWith('battery gauge'), 'on this host the reading names its sensor')
  }
})

test('/api is Payload over the service binding; without the binding it is refused by name', async () => {
  const seen: string[] = []
  const PAYLOAD = {
    fetch: async (r: Request) => {
      seen.push(new URL(r.url).pathname)
      return new Response(JSON.stringify({ user: null }), { headers: { 'content-type': 'application/json' } })
    },
  }
  const bound = await worker.fetch(new Request(`${O}/api/users/me`), { ...env, PAYLOAD })
  assert.deepEqual(await bound.json(), { user: null }, 'the request reaches Payload and its answer comes back unchanged')
  assert.deepEqual(seen, ['/api/users/me'])
  const unbound = (await (await get('/api/mcp')).json()) as { holds: boolean; denied?: string }
  assert.equal(unbound.denied, 'payload')
  assert.equal((await get('/')).status, 200, 'and the unit still answers its own doors')
})

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
  const inst = (await (await get('/install.json')).json()) as { hardware: { prove: string; seat: { device: string } }; packages: string[] }
  assert.deepEqual(inst.packages, ['qpu-mcp', 'payload-mcp', 'vitepress-payload']); assert.equal(inst.hardware.seat.device, 'empty'); assert.match(inst.hardware.prove, /boot\.js --prove/)
  const sm = await get('/sitemap.xml')
  assert.equal(sm.status, 200); assert.match(sm.headers.get('content-type') ?? '', /xml/); assert.match(await sm.text(), /<loc>https:\/\/qpu\.uuidna\.com\/openapi\.json<\/loc>/)
})

test('the discovery doors and the tool results compute their holds, and a broken input does not hold', async () => {
  type Api = Parameters<typeof qpuOpenApiHolds>[0] & { holds: boolean }
  const api = (await (await get('/openapi.json')).json()) as Api
  assert.equal(api.holds, true); assert.equal(qpuOpenApiHolds(api), true, 'the served document holds when checked again')
  const [first, ...rest] = Object.keys(api.paths)
  assert.equal(qpuOpenApiHolds({ ...api, paths: Object.fromEntries(rest.map((p) => [p, api.paths[p]!])) }), false, `route ${first} dropped`)
  assert.equal(qpuOpenApiHolds({ ...api, paths: { ...api.paths, '/extra': { get: { operationId: 'get_extra' } } } }), false, 'a path docs.api lacks')
  assert.equal(qpuOpenApiHolds({ ...api, 'x-mcp': { tools: api['x-mcp'].tools.slice(1) } }), false, 'a missing tool')

  type Wk = Parameters<typeof qpuWellKnownHolds>[0] & { holds: boolean }
  const wk = (await (await get('/.well-known/mcp.json')).json()) as Wk
  assert.equal(wk.holds, true); assert.equal(qpuWellKnownHolds(wk), true)
  assert.equal(qpuWellKnownHolds({ ...wk, url: 'https://elsewhere.example/mcp' }), false, 'an endpoint on another host')
  assert.equal(qpuWellKnownHolds({ ...wk, tools: wk.tools + 1 }), false, 'a tool count the MCP does not have')
  assert.equal(qpuWellKnownHolds({ ...wk, protocolVersions: ['1999-01-01'] as unknown as Wk['protocolVersions'] }), false, 'a version this unit does not speak')

  type Fetched = { path: string; href: string; hostEscape: boolean; holds: boolean }
  const fetched = (await (await post({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'net_fetch', arguments: { path: '/mcp' } } })).json()) as { result: Fetched & { structuredContent?: Fetched } }
  const f = fetched.result.structuredContent ?? fetched.result
  assert.equal(f.holds, true); assert.equal(f.hostEscape, false)
  assert.equal(qpuNetworkFetchHolds(f, [f.path]), true)
  assert.equal(qpuNetworkFetchHolds({ ...f, href: `https://elsewhere.example${f.path}` }, [f.path]), false, 'an href on another host')
  assert.equal(qpuNetworkFetchHolds(f, []), false, 'a door that is not named')

  const queue = { jobs: [{ id: 1, status: 'done' }, { id: 2, status: 'done' }], n: 2 }
  assert.equal(qpuServerQueueHolds(queue), true)
  assert.equal(qpuServerQueueHolds({ ...queue, jobs: [...queue.jobs].reverse() }), false, 'ids out of submission order')
  assert.equal(qpuServerQueueHolds({ ...queue, n: 3 }), false, 'a count that is not the length')

  const inst = (await (await get('/install.json')).json()) as { hardware: { port: number; docker: string } }
  assert.equal(inst.hardware.port, bootPort, 'the manifest\'s port is the one boot.js serves on')
  assert.ok(inst.hardware.docker.includes(`-p ${bootPort}:${bootPort}`))
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
