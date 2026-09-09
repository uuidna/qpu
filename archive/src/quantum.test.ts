import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BASE, QPU_HOST, VE_FACES, qpuSeatOf, throughVoid } from './hologram.js'
import { STANDING } from './standing.js'
import { qpuQuantumHolds, qpuQuantumKeysOf, qpuQuantumOf } from './quantum.js'
import { handleQpuFetch } from './edge.js'
import { qpuMcpCall } from './mcp-catalog.js'

test('qpuQuantumHolds proves every face, every reflection, every Quantum.lean key', () => {
  const q = qpuQuantumOf()
  assert.equal(q.kind, 'quantum')
  assert.equal(q.pure, true)
  assert.equal(q.agnostic, true)
  assert.equal(q.live, true)
  assert.equal(q.working, true)
  assert.equal(q.host, QPU_HOST)
  assert.equal(q.host, 'qpu.uuidna.com')
  assert.equal(q.when, 'never')
  assert.deepEqual(q.products, [])
  assert.equal(q.seat, qpuSeatOf().seat)
  assert.equal(q.target.seat, 'empty')
  assert.equal(q.possibilities, 2 ** VE_FACES)
  assert.equal(q.surfaces.length, VE_FACES)
  assert.equal(q.superpositions.length, VE_FACES)
  const standing = new Set(STANDING.filter((s) => s.file === 'Quantum.lean').map((s) => s.key))
  const keys = qpuQuantumKeysOf()
  assert.ok(keys.length > 0)
  assert.equal(keys.length, standing.size)
  for (const key of standing) assert.ok(keys.includes(key), key)
  for (let i = 0; i < VE_FACES; i++) {
    const face = q.surfaces[i]!
    assert.equal(face.face, i)
    assert.equal(face.opposite, throughVoid(i % BASE))
    const s = q.superpositions[i]!
    assert.equal(s.face, i)
    assert.equal(s.door, s.referer % 6)
    assert.equal(s.angles.hue, 40)
  }
  assert.equal(q.census.length, keys.length)
  for (let i = 0; i < q.census.length; i++) {
    const row = q.census[i]!
    assert.equal(row.slug, keys[i])
    const u = new URL(row.href)
    assert.equal(u.protocol, 'https:')
    assert.equal(u.hostname, 'uuidna.com')
    assert.equal(u.pathname, `/theorem/${row.slug}`)
  }
  assert.equal(q.square.slug, 'qpu_superpositions_are_the_ve_square')
  assert.doesNotMatch(JSON.stringify(q.products), /unreal|lean/i)
  assert.equal(new URL(q.href).hostname, QPU_HOST)
  assert.equal(new URL(q.href).pathname, '/quantum')
  assert.equal(qpuQuantumHolds(q), true)
})

test('GET /quantum and MCP qpu_quantum are the live working QPU square', async () => {
  const res = await handleQpuFetch(new Request(`https://${QPU_HOST}/quantum`))
  assert.equal(res.status, 200)
  const body = await res.json() as {
    holds: boolean
    kind: string
    pure: boolean
    agnostic: boolean
    live: boolean
    working: boolean
    host: string
    when: string
    possibilities: number
    products: unknown[]
  }
  assert.equal(body.holds, true)
  assert.equal(body.kind, 'quantum')
  assert.equal(body.pure, true)
  assert.equal(body.agnostic, true)
  assert.equal(body.live, true)
  assert.equal(body.working, true)
  assert.equal(body.host, 'qpu.uuidna.com')
  assert.equal(body.when, 'never')
  assert.equal(body.products.length, 0)
  assert.equal(body.possibilities, 2 ** VE_FACES)
  const mcp = await qpuMcpCall('qpu_quantum', {}) as { holds: boolean; possibilities: number; live: boolean }
  assert.equal(mcp.holds, true)
  assert.equal(mcp.live, true)
  assert.equal(mcp.possibilities, 2 ** VE_FACES)
})
