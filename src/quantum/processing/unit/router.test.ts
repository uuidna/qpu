// router — the unit routes a referrer to a door and decides, per request, the seat the work is computed on.
import { test } from './receipted.js'
import assert from 'node:assert/strict'
import { qpuFoldOf, qpuRouterHolds, qpuRouterOf, qpuSeatsAvailableOf } from './index.js'

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
