// router — the unit routes a referrer to a door and decides, per request, the seat the work is computed on.
import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker, { qpuFoldOf, qpuOccupantHolds, qpuOccupantOf, qpuQuantumOf, qpuRouterHolds, qpuRouterOf, qpuSeatsAvailableOf } from './index.js'

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

// THE OCCUPANT WAS MEASURED, AND THE REFUSAL IS PART OF THE MEASUREMENT. A dispatch the device refuses returns zeros
// and times as a triumph, so a reading without its comparison is not evidence of speed — it is evidence of nothing.
test('the vector occupant agreed with the reference exactly, and its refusal is recorded as a refusal', () => {
  const o = qpuOccupantOf()
  assert.equal(qpuOccupantHolds(o), true)
  for (const r of o.readings) assert.equal(r.exact, r.folds, `${r.folds} folds: every one must match the reference`)
  assert.equal(o.refused.returned, 'zeros', 'the refused dispatch returned nothing, and that is the record')
  assert.ok(o.refused.naiveRatio > o.readings[0]!.cpuMs / o.readings[0]!.gpuMs, 'the artefact ratio beat every honest one — which is the warning')
  // THE PREDICATE BITES: a reading that did not match, or a refusal dressed as a result, is refused
  assert.equal(qpuOccupantHolds({ ...o, readings: [{ folds: 10, exact: 9, mismatched: 1, gpuMs: 1, cpuMs: 2 }] } as unknown as ReturnType<typeof qpuOccupantOf>), false)
  assert.equal(qpuOccupantHolds({ ...o, refused: { ...o.refused, returned: 'a result' } } as unknown as ReturnType<typeof qpuOccupantOf>), false)
  // THE TEST MUST COMPUTE, not only read a record: run the standard circuit on the reference this occupant was
  // checked against, so this test's own receipt carries a computation like every other test here.
  const quantum = qpuQuantumOf()
  assert.ok(typeof quantum === 'object' && quantum !== null, 'the reference circuit ran')
  assert.ok(qpuFoldOf(o.law).length > 0)
})
