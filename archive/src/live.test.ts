import { test } from 'node:test'
import assert from 'node:assert/strict'
import { VE_FACES, qpuSeatOf } from './hologram.js'
import { qpuLiveHolds, qpuLiveKOf, qpuLiveMessageOf, qpuLiveOf } from './live.js'
import { handleQpuFetch } from './edge.js'
import { qpuMcpCall } from './mcp-catalog.js'

test('live snapshot recomputes metrics and walks every rung', () => {
  const a = qpuLiveOf(0)
  const b = qpuLiveOf(VE_FACES * 1000)
  assert.equal(a.k, 0)
  assert.equal(b.k, 0)
  assert.equal(qpuLiveKOf(1000), 1)
  assert.equal(a.seat, qpuSeatOf().seat)
  assert.equal(a.holds, true)
  assert.equal(a.walked, true)
  assert.ok(a.speed.some((s) => s.name === 'address 2^128' && s.walked === true))
  assert.ok(a.message.includes('real'))
  assert.ok(a.message.includes('QPU face'))
  assert.equal(qpuLiveHolds(a), true)
  assert.notEqual(qpuLiveMessageOf(0), qpuLiveMessageOf(1000))
})

test('GET /live is occupancy now; MCP qpu_live matches', async () => {
  const res = await handleQpuFetch(new Request('https://qpu.uuidna.com/live'))
  assert.equal(res.status, 200)
  const body = await res.json() as { seat: string; walked: boolean; holds: boolean }
  assert.equal(body.seat, 'empty')
  assert.equal(body.walked, true)
  assert.equal(body.holds, true)
  const mcp = await qpuMcpCall('qpu_live', { at: 0 }) as { k: number; walked: boolean }
  assert.equal(mcp.k, 0)
  assert.equal(mcp.walked, true)
})
