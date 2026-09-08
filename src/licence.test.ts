import { test } from 'node:test'
import assert from 'node:assert/strict'
import { QPU_HOST } from './hologram.js'
import { QPU_VERSION } from './version.js'
import { QPU_FUSE_DOMAINS } from './bindings/recognize.js'
import {
  QPU_LICENCE, QPU_LICENCE_APEX, QPU_LICENCE_ISSUER, QPU_LICENCE_REPLICA,
  qpuLicenceApplyOf, qpuLicenceCapacityOf, qpuLicenceCertificateOf, qpuLicenceHolds, qpuLicenceHostOf, qpuLicenceOf, qpuLicenceAllowsHostOf,
} from './licence.js'
import { handleQpuFetch } from './edge.js'
import { qpuMcpCall } from './mcp-catalog.js'

test('offline licence certificate is issued by license.uuidna.com, never a wildcard, never a network', () => {
  const c = qpuLicenceOf()
  assert.equal(c.kind, 'licence')
  assert.equal(c.offline, true)
  assert.equal(c.when, 'never')
  assert.equal(c.expires, 'never')
  assert.equal(c.protocol, 'https')
  assert.equal(c.wildcards, false)
  assert.equal(c.issuer, QPU_LICENCE_ISSUER)
  assert.equal(c.issuer, 'license.uuidna.com')
  assert.equal(c.subject, QPU_HOST)
  assert.equal(c.engine, 'qpu')
  assert.equal(c.messenger, 'uuid')
  assert.equal(c.sequence, Number(QPU_VERSION.split('.')[2]) % 16)
  assert.equal(c.href, `https://${QPU_LICENCE_ISSUER}/licence`)
  assert.equal(c.rotate, true)
  assert.equal(c.combine, 'sum')
  assert.equal(c.capacity, qpuLicenceCapacityOf(c.subject, c.issuer))
  assert.ok(c.san.includes(c.subject))
  assert.ok(c.san.includes(QPU_LICENCE_ISSUER))
  assert.ok(c.san.includes(QPU_LICENCE_REPLICA))
  for (const h of c.san) {
    assert.equal(h.includes('*'), false)
    assert.ok(h === QPU_LICENCE_APEX || h.endsWith(`.${QPU_LICENCE_APEX}`))
  }
  for (const d of QPU_FUSE_DOMAINS) assert.ok(c.san.includes(d), d)
  assert.equal(qpuLicenceHolds(c), true)
})

test('offline apply rebinds named occupancy; wildcards, clones, and field writes refuse', () => {
  const home = qpuLicenceOf()
  const unreal = qpuLicenceApplyOf(qpuLicenceCertificateOf({ subject: 'unreal.uuidna.com', engine: 'unreal' }))
  assert.equal(unreal.subject, 'unreal.uuidna.com')
  assert.equal(unreal.engine, 'unreal')
  assert.equal(qpuLicenceHostOf(), 'unreal.uuidna.com')
  assert.equal(qpuLicenceHolds(unreal), true)
  assert.throws(() => qpuLicenceApplyOf(qpuLicenceCertificateOf({ subject: '*.uuidna.com', engine: 'qpu' })))
  assert.throws(() => qpuLicenceApplyOf(qpuLicenceCertificateOf({ subject: 'a.example', engine: 'qpu' })))
  const clone = JSON.parse(JSON.stringify(unreal)) as typeof unreal
  assert.equal(qpuLicenceHolds(clone), false)
  assert.throws(() => qpuLicenceApplyOf(clone))
  assert.throws(() => {
    (QPU_LICENCE as { host: string }).host = 'a.example'
  })
  const restored = qpuLicenceApplyOf(qpuLicenceCertificateOf({ subject: home.subject, engine: home.engine }))
  assert.equal(restored.subject, QPU_HOST)
  assert.equal(qpuLicenceHostOf(), QPU_HOST)
  assert.equal(qpuLicenceAllowsHostOf(QPU_HOST), true)
  assert.equal(qpuLicenceAllowsHostOf('a.example'), false)
})

test('GET /licence and MCP qpu_licence are the offline certificate', async () => {
  const res = await handleQpuFetch(new Request(`https://${QPU_HOST}/licence`))
  assert.equal(res.status, 200)
  const body = await res.json() as { kind: string; offline: boolean; holds: boolean; subject: string; issuer: string }
  assert.equal(body.kind, 'licence')
  assert.equal(body.offline, true)
  assert.equal(body.holds, true)
  assert.equal(body.subject, QPU_HOST)
  assert.equal(body.issuer, 'license.uuidna.com')
  const mcp = await qpuMcpCall('qpu_licence', {}) as { offline: boolean; expires: string; issuer: string }
  assert.equal(mcp.offline, true)
  assert.equal(mcp.expires, 'never')
  assert.equal(mcp.issuer, QPU_LICENCE_ISSUER)
})
