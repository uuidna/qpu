import { test } from 'node:test'
import assert from 'node:assert/strict'
import { handleQpuFetch } from './edge.js'
import { QPU_HOST, qpuSeatOf } from './hologram.js'

const get = (path: string, init?: RequestInit) =>
  handleQpuFetch(new Request(`https://${QPU_HOST}${path}`, init))

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
  const holo = await (await get('/hologram')).json() as { veFaces: number; foundation: number }
  assert.equal(holo.veFaces, 14)
  assert.equal(holo.foundation, 0)
  const disc = await (await get('/.well-known/qpu.json')).json() as { readings: string[] }
  assert.deepEqual(disc.readings, ['seat', 'width', 'hologram'])
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
