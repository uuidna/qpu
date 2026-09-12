// router — the unit routes a referrer to a door and decides, per request, the seat the work is computed on.
import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker, { qpuFoldOf, qpuRouterHolds, qpuRouterOf, qpuSeatsAvailableOf } from './index.js'

test('the seat is READ from this runtime, and the reference answers when nothing else is exposed', () => {
  const seats = qpuSeatsAvailableOf()
  assert.equal(seats.reference, true, 'the reference seat is always present — it is the simulator itself')
  assert.equal(seats.device, false, 'the device seat stays empty until a device fills it')
  const r = qpuRouterOf()
  assert.equal(qpuRouterHolds(r), true)
  assert.equal(r.seat, seats.vector ? 'vector' : 'reference', 'the decision follows the reading, not a preference')
  assert.equal(r.decidedAt, 'request', 'the seat is decided per request, not once at boot')
})

test('a referrer is named by host, an unknown path falls back to a served door, and a known one is kept', () => {
  const self = qpuRouterOf('https://qpu.uuidna.com/page', '/cite')
  assert.equal(self.origin, 'self'); assert.equal(self.door, '/cite'); assert.equal(self.known, true)
  const foreign = qpuRouterOf('https://example.org/x', '/no-such-door')
  assert.equal(foreign.origin, 'foreign'); assert.equal(foreign.referrer, 'example.org')
  assert.equal(foreign.door, '/', 'an unknown path routes to a door that exists')
  const none = qpuRouterOf('not a url', '/')
  assert.equal(none.origin, 'none'); assert.equal(none.referrer, '')
  // THE PREDICATE BITES: a decision that routes off the doors, or claims a seat it did not read, is refused
  assert.equal(qpuRouterHolds({ ...self, door: '/invented' } as unknown as ReturnType<typeof qpuRouterOf>), false)
  assert.equal(qpuRouterHolds({ ...self, seat: 'vector' as const, seats: { ...self.seats, vector: false } } as unknown as ReturnType<typeof qpuRouterOf>), false)
  // the routing is deterministic: the same referrer and path fold to the same decision
  assert.equal(qpuFoldOf(JSON.stringify(qpuRouterOf('https://example.org/x', '/cite'))), qpuFoldOf(JSON.stringify(qpuRouterOf('https://example.org/x', '/cite'))))
})

// THE DECISION IS SERVED, NOT ONLY COMPUTED. A router nobody can see is a claim; these read it off the wire.
const origin = 'https://qpu.uuidna.com'
const env = { QPU_HOST: 'qpu.uuidna.com' }
const getOf = (path: string, referer?: string) =>
  worker.fetch(new Request(`${origin}${path}`, { headers: { accept: 'text/html', ...(referer ? { referer } : {}) } }), env)

test('every answer names the seat it was computed on and the door that answered', async () => {
  const res = await getOf('/cite', 'https://example.org/blog')
  assert.equal(res.status, 200)
  assert.equal(res.headers.get('x-qpu-seat'), qpuSeatsAvailableOf().vector ? 'vector' : 'reference')
  assert.equal(res.headers.get('x-qpu-door'), '/cite', 'a known path is its own door')
  const root = await getOf('/')
  assert.equal(root.headers.get('x-qpu-door'), '/', 'the root answers for itself')
  // the referrer never changes WHICH door a known path reaches — it is provenance, not redirection
  const same = await getOf('/cite')
  assert.equal(same.headers.get('x-qpu-door'), res.headers.get('x-qpu-door'))
})

test('the coordination block states the routing law a client needs before its first call', async () => {
  const wk = (await (await getOf('/.well-known/mcp.json')).json()) as { coordination?: { routing?: string; seat?: string } }
  assert.match(wk.coordination?.routing ?? '', /x-qpu-seat/)
  assert.match(wk.coordination?.routing ?? '', /decided per request/)
  assert.match(wk.coordination?.seat ?? '', /driver bug, never a physics claim/)
  assert.equal(qpuRouterHolds(qpuRouterOf('https://example.org/blog', '/cite')), true)
  assert.ok(qpuFoldOf(String(qpuRouterOf().seat)).length > 0, 'the decision folds')
})
