import { test } from 'node:test'
import assert from 'node:assert/strict'
import { QPU_HOST, VE_FACES, qpuSeatOf } from './hologram.js'
import { QPU_PWA_DOORS, qpuPwaHolds, qpuPwaManifestOf, qpuPwaOf, qpuPwaSwOf } from './pwa.js'
import { handleQpuFetch } from './edge.js'
import { qpuMcpCall } from './mcp-catalog.js'
import { QPU_VERSION } from './version.js'

test('qpuPwaHolds is the installable proof of concept and work of the QPU itself', () => {
  const p = qpuPwaOf()
  assert.equal(qpuPwaHolds(p), true)
  assert.equal(p.kind, 'pwa')
  assert.equal(p.product, 'QPU')
  assert.equal(p.proof.concept, true)
  assert.equal(p.proof.work, true)
  assert.equal(p.replica, false)
  assert.equal(p.fractal, true)
  assert.equal(p.plugin, 'hologram')
  assert.equal(p.installable, true)
  assert.equal(p.display, 'standalone')
  assert.equal(p.when, 'never')
  assert.equal(p.fetches, 0)
  assert.equal(p.hardware, 'any')
  assert.equal(p.binds, false)
  assert.equal(p.seat, qpuSeatOf().seat)
  assert.equal(p.host, QPU_HOST)
  assert.equal(p.doors.length, VE_FACES)
  assert.equal(QPU_PWA_DOORS.length, VE_FACES)
  assert.equal(new Set(p.doors).size, VE_FACES)
  assert.equal(p.manifest.shortcuts.length, VE_FACES)
  assert.equal(p.manifest.display, 'standalone')
  assert.equal(p.manifest.start_url, '/')
  assert.equal(p.manifest.scope, '/')
  assert.equal(p.manifest.protocol_handlers[0]!.protocol, 'web+qpu')
  assert.equal(p.manifest.share_target.method, 'GET')
  assert.equal(p.work.compareHolds, true)
  assert.equal(p.work.version, QPU_VERSION)
  assert.equal(new URL(p.streaming.href).hostname, QPU_HOST)
  assert.equal(new URL(p.streaming.href).pathname, '/pwa')
  assert.equal(new URL(p.worker).pathname, '/sw.js')
  assert.equal(new URL(p.manifest.href).pathname, '/manifest.webmanifest')
})

test('service worker names the host and never crawls a peer', () => {
  const sw = qpuPwaSwOf()
  assert.match(sw, new RegExp(QPU_HOST.replace(/\./g, '\\.')))
  assert.match(sw, new RegExp(`qpu-${QPU_VERSION}`))
  assert.match(sw, /u\.hostname!==HOST/)
  assert.match(sw, /u\.protocol!=='https:'/)
  assert.doesNotMatch(sw, /\*/)
  const manifest = qpuPwaManifestOf()
  assert.equal(manifest.prefer_related_applications, false)
  assert.equal(manifest.icons.length, 2)
})

test('GET /pwa and MCP qpu_pwa match; chrome does not steal /pqc', async () => {
  const res = await handleQpuFetch(new Request(`https://${QPU_HOST}/pwa`))
  assert.equal(res.status, 200)
  const body = await res.json() as { kind: string; holds: boolean; host: string }
  assert.equal(body.kind, 'pwa')
  assert.equal(body.holds, true)
  assert.equal(body.host, QPU_HOST)
  const mcp = await qpuMcpCall('qpu_pwa', {}) as { kind: string; holds: boolean }
  assert.equal(mcp.kind, 'pwa')
  assert.equal(mcp.holds, true)
  const manifest = await handleQpuFetch(new Request(`https://${QPU_HOST}/manifest.webmanifest`))
  assert.equal(manifest.status, 200)
  assert.match(manifest.headers.get('content-type') ?? '', /manifest\+json/)
  const sw = await handleQpuFetch(new Request(`https://${QPU_HOST}/sw.js`))
  assert.equal(sw.status, 200)
  assert.match(sw.headers.get('content-type') ?? '', /javascript/)
  const pqc = await handleQpuFetch(new Request(`https://${QPU_HOST}/pqc`))
  assert.equal(pqc.status, 200)
  assert.equal('/pqc'.startsWith('/pwa'), false)
  assert.equal('/pwa'.startsWith('/pqc'), false)
})
