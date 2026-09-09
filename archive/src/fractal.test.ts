import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ADDRESS_BITS, COINS, QPU_POINTS, VE_FACES, qpuSeatOf } from './hologram.js'
import { qpuProvidersOf } from './bindings/index.js'
import { QPU_NATIVE, qpuFanoutOf, qpuPeersOf, qpuScaleOf, qpuServerlessOf, qpuWsFrameOf } from './scale.js'
import { qpuFractalHolds, qpuFractalOf, qpuStrokeOf } from './fractal.js'

test('pentagram stroke is +coins mod five and a single closed path', () => {
  const s = qpuStrokeOf()
  assert.deepEqual(s, [0, 2, 4, 1, 3])
  assert.equal(s.length, QPU_POINTS.length)
})

test('fractal fold tower is self-similar; chip stays empty', () => {
  assert.equal(qpuFractalHolds(), true)
  const f = qpuFractalOf()
  assert.equal(f.fused, true)
  assert.equal(f.verified, true)
  assert.equal(f.chip.seat, qpuSeatOf().seat)
  assert.equal(f.chip.seat, 'empty')
  assert.equal(f.novelty.claimed, true)
  assert.equal(f.novelty.holds, true)
  assert.equal(f.fractal.cells.length, VE_FACES)
  assert.ok(f.fractal.cells.every((c) => c.seat === 'empty' && c.door === c.referer % 6))
  assert.equal(f.fractal.inner, f.fractal.doors * f.fractal.rays)
  assert.equal(f.fractal.outer, f.fractal.inner)
  assert.equal(f.fractal.amplitudes, 2 ** VE_FACES)
  assert.equal(f.providers.length, qpuProvidersOf().length)
  assert.equal(f.pentagram.single, true)
  assert.ok(f.serverless > 0)
  assert.equal(f.native.length, QPU_NATIVE.length)
})

test('all serverless lanes are fused; peers scale over MCP', async () => {
  const lanes = qpuServerlessOf()
  assert.ok(lanes.some((b) => b.kind === 'lambda'))
  assert.ok(lanes.some((b) => b.kind === 'functions' && b.provider === 'google'))
  assert.ok(lanes.some((b) => b.kind === 'durable_objects'))
  assert.ok(lanes.every((b) => b.kind !== 'qpu'))
  const one = qpuPeersOf()
  assert.deepEqual(one, ['https://qpu.uuidna.com'])
  const unknown = qpuPeersOf({ QPU_PEERS: 'https://a.example,https://b.example' })
  assert.deepEqual(unknown, one)
  const many = qpuPeersOf({ QPU_PEERS: 'https://uuidna.com,https://a.example' })
  assert.deepEqual(many, ['https://qpu.uuidna.com', 'https://uuidna.com'])
  const scale = qpuScaleOf({ QPU_PEERS: 'https://a.example', QUEUE: { send: () => true } })
  assert.equal(scale.may, true)
  assert.equal(scale.chip.seat, 'empty')
  assert.ok(scale.native.some((t) => t.id === 'websocket' && t.bound))
  assert.ok(scale.native.some((t) => t.id === 'queue' && t.bound))
  const fan = await qpuFanoutOf(undefined, 'qpu_seat', {})
  assert.equal(fan.chip.seat, 'empty')
  assert.equal(fan.peers[0]!.ok, true)
  const refuse = await qpuFanoutOf(undefined, 'qpu_fanout', {})
  assert.equal(refuse.peers.length, 0)
})

test('websocket frames accept MCP and fractal ops', async () => {
  const seat = await qpuWsFrameOf(JSON.stringify({ op: 'seat' })) as { seat: string }
  assert.equal(seat.seat, 'empty')
  const mcp = await qpuWsFrameOf(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'ping' })) as { result: object }
  assert.deepEqual(mcp.result, {})
  const frac = await qpuWsFrameOf(JSON.stringify({ op: 'fractal' })) as { verified: boolean; fractal: { selfSimilar: boolean } }
  assert.equal(frac.verified, true)
  assert.equal(frac.fractal.selfSimilar, true)
  assert.equal(ADDRESS_BITS / COINS, 64)
})
