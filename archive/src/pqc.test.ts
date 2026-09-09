import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BASE, HANDLE_HEXBITS, QPU_HOST, QPU_POINTS, TETRA, VE_FACES, qpuSeatOf, throughVoid } from './hologram.js'
import { STANDING } from './standing.js'
import { QPU_FUSE_DOMAINS } from './bindings/recognize.js'
import { QPU_PQC_CENSUS, qpuPqcHolds, qpuPqcOf } from './pqc.js'
import { handleQpuFetch } from './edge.js'
import { qpuMcpCall } from './mcp-catalog.js'

test('qpuPqcHolds proves every face, every reflection, every census slug, every domain', () => {
  const p = qpuPqcOf()
  assert.equal(p.kind, 'pqc')
  assert.equal(p.sandbox, true)
  assert.equal(p.experiments, 'unlimited')
  assert.equal(p.when, 'never')
  assert.equal(p.fuse.protocol, 'http')
  assert.equal(p.fuse.wildcards, false)
  assert.equal(p.seat, qpuSeatOf().seat)
  assert.equal(p.target.seat, 'empty')
  assert.equal(p.possibilities, 2 ** VE_FACES)
  assert.equal(p.surfaces.length, VE_FACES)
  assert.equal(p.superpositions.length, VE_FACES)
  const keys = new Set(STANDING.map((s) => s.key))
  for (let i = 0; i < VE_FACES; i++) {
    const face = p.surfaces[i]!
    assert.equal(face.face, i)
    assert.equal(face.opposite, throughVoid(i % BASE))
    const s = p.superpositions[i]!
    assert.equal(s.face, i)
    assert.equal(s.door, s.referer % 6)
    assert.equal(s.angles.hue, 40)
  }
  assert.equal(p.census.length, HANDLE_HEXBITS)
  for (let i = 0; i < p.census.length; i++) {
    const row = p.census[i]!
    assert.equal(row.slug, QPU_PQC_CENSUS[i]!.slug)
    assert.equal(keys.has(row.slug), true, row.slug)
    const u = new URL(row.href)
    assert.equal(u.protocol, 'https:')
    assert.equal(u.hostname, 'uuidna.com')
    assert.equal(u.pathname, `/theorem/${row.slug}`)
  }
  assert.deepEqual(p.points, [...QPU_POINTS])
  assert.equal(p.tetra.inner.length, TETRA)
  assert.equal(p.tetra.outer.length, TETRA)
  for (let i = 0; i < QPU_FUSE_DOMAINS.length; i++) {
    assert.equal(p.fuse.domains[i], QPU_FUSE_DOMAINS[i])
    assert.equal(QPU_FUSE_DOMAINS[i]!.includes('.'), true)
    assert.equal(QPU_FUSE_DOMAINS[i]!.includes('*'), false)
  }
  assert.equal(new URL(p.href).hostname, QPU_HOST)
  assert.equal(new URL(p.href).pathname, '/pqc')
  assert.equal(qpuPqcHolds(p), true)
})

test('GET /pqc and MCP qpu_pqc prove the square; /scale stays serverless', async () => {
  const res = await handleQpuFetch(new Request(`https://${QPU_HOST}/pqc`))
  assert.equal(res.status, 200)
  const body = await res.json() as {
    holds: boolean
    kind: string
    sandbox: boolean
    experiments: string
    when: string
    possibilities: number
    superpositions: { door: number }[]
    target: { seat: string }
  }
  assert.equal(body.holds, true)
  assert.equal(body.kind, 'pqc')
  assert.equal(body.when, 'never')
  assert.equal(body.experiments, 'unlimited')
  assert.equal(body.possibilities, 2 ** VE_FACES)
  assert.equal(body.superpositions.length, VE_FACES)
  assert.equal(body.target.seat, 'empty')
  const scale = await handleQpuFetch(new Request(`https://${QPU_HOST}/scale`))
  assert.equal(scale.status, 200)
  assert.notEqual((await scale.json() as { kind?: string }).kind, 'pqc')
  const mcp = await qpuMcpCall('qpu_pqc', {}) as { holds: boolean; possibilities: number; when: string }
  assert.equal(mcp.holds, true)
  assert.equal(mcp.when, 'never')
  assert.equal(mcp.possibilities, 2 ** VE_FACES)
})
