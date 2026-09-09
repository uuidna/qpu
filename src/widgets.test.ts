import { test } from 'node:test'
import assert from 'node:assert/strict'
import { VE_FACES, qpuSeatOf } from './hologram.js'
import { qpuUuidOf } from './messenger.js'
import { handleQpuFetch } from './edge.js'
import { qpuMcpCall } from './mcp-catalog.js'
import { QPU_HOST } from './hologram.js'
import {
  QPU_WIDGETS, qpuUuidStreamHolds, qpuUuidStreamOf, qpuWidgetsHolds, qpuWidgetsOf,
} from './widgets.js'

test('widget uuid stream is fourteen public uuids; payload stays off', () => {
  const s = qpuUuidStreamOf(0)
  assert.equal(s.payload, false)
  assert.equal(s.graphql, false)
  assert.equal(s.layers, 0)
  assert.equal(s.uuids.length, VE_FACES)
  assert.equal(s.live.seat, qpuSeatOf().seat)
  assert.equal(qpuUuidStreamHolds(s), true)
  for (const u of s.uuids) assert.equal(qpuUuidOf(u), u)
})

test('widgets share across licensed sites without payload.find', () => {
  const w = qpuWidgetsOf(0)
  assert.equal(w.kind, 'widgets')
  assert.equal(w.share, true)
  assert.equal(w.payload, false)
  assert.equal(w.finds, false)
  assert.equal(w.sse, '/sse')
  assert.equal(w.widgets.length, QPU_WIDGETS.length)
  assert.ok(w.sites.every((site) => site.host.includes('.') && !site.host.includes('*')))
  assert.equal(qpuWidgetsHolds(w), true)
})

test('GET /widgets and MCP qpu_widgets are the uuid stream', async () => {
  const res = await handleQpuFetch(new Request(`https://${QPU_HOST}/widgets`))
  assert.equal(res.status, 200)
  const body = await res.json() as { payload: boolean; stream: { uuids: string[] } }
  assert.equal(body.payload, false)
  assert.equal(body.stream.uuids.length, VE_FACES)
  const mcp = await qpuMcpCall('qpu_widgets', {}) as { payload: boolean; finds: boolean }
  assert.equal(mcp.payload, false)
  assert.equal(mcp.finds, false)
  const sse = await handleQpuFetch(new Request(`https://${QPU_HOST}/sse`))
  assert.match(sse.headers.get('content-type') ?? '', /text\/event-stream/)
  assert.match(await sse.text(), /event: stream/)
})
