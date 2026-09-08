import { test } from 'node:test'
import assert from 'node:assert/strict'
import { VE_FACES, qpuSeatOf } from './hologram.js'
import { QPU_EVENT_KINDS, QPU_EVENT_LISTEN, qpuEventOf, qpuEventsHolds, qpuEventsOf } from './events.js'
import { handleQpuFetch } from './edge.js'
import { qpuMcpCall } from './mcp-catalog.js'

test('fourteen UI event kinds occupy VE faces; unknown types refuse; capture does not claim default', () => {
  const rows = qpuEventsOf()
  assert.equal(rows.length, VE_FACES)
  assert.equal(QPU_EVENT_KINDS.length, 14)
  assert.equal(new Set(QPU_EVENT_KINDS).size, 14)
  assert.equal(rows[0]!.kind, 'pointer')
  assert.equal(rows[0]!.face, 0)
  assert.equal(qpuEventOf('keydown').ok, true)
  assert.equal(qpuEventOf('keydown').kind, 'keyboard')
  assert.equal(qpuEventOf('no-such-event').ok, false)
  assert.equal(qpuEventsHolds(), true)
  assert.equal(qpuSeatOf().seat, 'empty')
  for (const t of QPU_EVENT_LISTEN) assert.equal(qpuEventOf(t).ok, true, t)
})

test('GET /events and MCP qpu_events / qpu_event', async () => {
  const res = await handleQpuFetch(new Request('https://qpu.uuidna.com/events'))
  assert.equal(res.status, 200)
  const body = await res.json() as { kinds: { kind: string }[]; holds: boolean }
  assert.equal(body.holds, true)
  assert.equal(body.kinds.length, VE_FACES)
  const mcp = await qpuMcpCall('qpu_events', {}) as { holds: boolean }
  assert.equal(mcp.holds, true)
  const one = await qpuMcpCall('qpu_event', { type: 'wheel' }) as { ok: boolean; kind: string; face: number }
  assert.equal(one.ok, true)
  assert.equal(one.kind, 'wheel')
  assert.equal(typeof one.face, 'number')
})
