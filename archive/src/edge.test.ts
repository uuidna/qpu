import { test } from 'node:test'
import assert from 'node:assert/strict'
import { handleQpuFetch } from './edge.js'
import { QPU_HOST, VE_FACES, qpuSeatOf } from './hologram.js'

const get = (path: string, init?: RequestInit, env?: { ASSETS?: { fetch: (req: Request) => Promise<Response> } }) =>
  handleQpuFetch(new Request(`https://${QPU_HOST}${path}`, init), env)

test('GET / returns discovery plus the three readings', async () => {
  const res = await get('/')
  assert.equal(res.status, 200)
  assert.equal(res.headers.get('content-type'), 'application/json; charset=utf-8')
  const body = await res.json() as { worker: string; host: string; machine: { seat: { seat: string } } }
  assert.equal(body.worker, 'uuidna-qpu')
  assert.equal(body.host, QPU_HOST)
  assert.equal(body.machine.seat.seat, 'empty')
})

test('GET /seat /width /hologram and well-known', async () => {
  const seat = await (await get('/seat')).json()
  assert.deepEqual(seat, qpuSeatOf())
  const width = await (await get('/width')).json() as { pentagram: number }
  assert.equal(width.pentagram, 5)
  const holo = await (await get('/hologram')).json() as { veFaces: number; foundation: number; superpositions: unknown[] }
  assert.equal(holo.veFaces, 14)
  assert.equal(holo.foundation, 0)
  assert.equal(holo.superpositions.length, VE_FACES)
  const disc = await (await get('/.well-known/qpu.json')).json() as { readings: string[]; wallet: string; donate: string }
  assert.ok(disc.readings.includes('superpositions'))
  assert.ok(disc.readings.includes('nav'))
  assert.ok(disc.readings.includes('chip'))
  assert.ok(disc.readings.includes('experience'))
  const chip = await (await get('/chip')).json() as { claimed: boolean; holds: boolean; hardware: { seat: string }; merkaba: { fuse: number; rays: number; rotors: number } }
  assert.equal(chip.claimed, true)
  assert.equal(chip.holds, true)
  assert.equal(chip.hardware.seat, 'empty')
  assert.equal(chip.merkaba.fuse, 0)
  assert.equal(chip.merkaba.rays * chip.merkaba.rotors, VE_FACES)
  const merkaba = await (await get('/merkaba')).json() as { novelty: string }
  assert.equal(merkaba.novelty, 'merkaba')
  assert.equal(disc.wallet, 'https://revolut.me/ceccec')
  assert.equal(disc.donate, 'https://revolut.me/ceccec?note=https%3A%2F%2Fqpu.uuidna.com')
  const metrics = await (await get('/metrics')).json() as { holds: boolean; compare: { name: string; value: number; peer: number }[] }
  assert.equal(metrics.holds, true)
  assert.ok(metrics.compare.length >= 12)
  for (const row of metrics.compare) assert.equal(row.value, row.peer, row.name)
  const speed = await (await get('/speed')).json() as { speed: { name: string; walked: boolean }[]; seat: { seat: string } }
  assert.equal(speed.seat.seat, 'empty')
  assert.ok(speed.speed.some((r) => r.name === 'hologram'))
  assert.ok(speed.speed.some((r) => r.name === 'logical 2^48' && r.walked === true))
  assert.ok(speed.speed.some((r) => r.name === 'address 2^128' && r.walked === true))
  assert.ok(speed.speed.some((r) => r.name === 'verify 2^20' && r.walked === true))
})

test('nav sidebar search superpositions are computed upon request', async () => {
  const nav = await (await get('/nav')).json() as { nav: { items: unknown[] }[] }
  assert.ok(nav.nav.length >= 3)
  const side = await (await get('/sidebar?path=/face/3')).json() as { sidebar: { items: unknown[] }[] }
  assert.ok(side.sidebar.some((g) => g.items.length === VE_FACES))
  const search = await (await get('/search?q=pentagram')).json() as { hits: unknown[] }
  assert.ok(search.hits.length > 0)
  const sup = await (await get('/superpositions')).json() as { superpositions: { door: number; referer: number }[] }
  assert.equal(sup.superpositions.length, VE_FACES)
  assert.equal(sup.superpositions[0]!.door, sup.superpositions[0]!.referer % 6)
  const gateways = await (await get('/gateways')).json() as { neighbours: number; holds: boolean; gateways: { capacity: number }[] }
  assert.equal(gateways.neighbours, VE_FACES)
  assert.equal(gateways.holds, true)
  assert.equal(gateways.gateways.length, VE_FACES)
})

test('Accept text/html uses ASSETS when bound', async () => {
  const env = {
    ASSETS: {
      fetch: async () => new Response('<html>hologram</html>', { headers: { 'content-type': 'text/html' } }),
    },
  }
  const html = await get('/', { headers: { accept: 'text/html' } }, env)
  assert.equal(await html.text(), '<html>hologram</html>')
  const stillJson = await get('/', { headers: { accept: 'text/html' } })
  assert.match(stillJson.headers.get('content-type') ?? '', /json/)
})

test('http and www 301 to https apex', async () => {
  const http = await handleQpuFetch(new Request('http://qpu.uuidna.com/seat'))
  assert.equal(http.status, 301)
  assert.equal(http.headers.get('location'), 'https://qpu.uuidna.com/seat')
  const www = await handleQpuFetch(new Request('https://www.qpu.uuidna.com/'))
  assert.equal(www.status, 301)
  assert.equal(www.headers.get('location'), 'https://qpu.uuidna.com/')
})

test('unknown path 404; POST 405; OPTIONS 204', async () => {
  assert.equal((await get('/nope')).status, 404)
  assert.equal((await get('/', { method: 'POST' })).status, 405)
  assert.equal((await get('/', { method: 'OPTIONS' })).status, 204)
})

test('GET /bindings and /environment are always fused', async () => {
  const names = ['cloudflare', 'google', 'aws', 'azure', 'ibm', 'oracle', 'hardware', 'arch']
  const providers = await (await get('/providers')).json() as { providers: { name: string }[] }
  assert.deepEqual(providers.providers.map((p) => p.name), names)
  const env = await (await get('/environment')).json() as { fused: boolean; chip: { seat: string }; total: number }
  assert.equal(env.fused, true)
  assert.equal(env.chip.seat, 'empty')
  assert.ok(env.total > 80)
  const body = await (await get('/bindings')).json() as { fused: boolean; providers: string[]; bindings: { kind: string }[] }
  assert.equal(body.fused, true)
  assert.deepEqual(body.providers, names)
  const home = await (await get('/')).json() as { environment: { fused: boolean } }
  assert.equal(home.environment.fused, true)
})
