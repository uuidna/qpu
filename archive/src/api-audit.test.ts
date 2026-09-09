import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HEXBIT_BITS, HEXBIT_STATES, QPU_HOST, qpuTwoNOf, qpuVersionIntegerOf } from './hologram.js'
import { QPU_VERSION } from './version.js'
import { PROVIDERS } from './bindings/types.js'
import { qpuBindingsOf, qpuDrive, qpuProvidersOf, qpuRecognizeOf } from './bindings/index.js'
import { mockEnvFrom } from './bindings/mock.js'
import { mockCloudflareEnv } from './bindings/cloudflare/mock.js'
import { qpuDiscoveryOf } from './discovery.js'
import { handleQpuFetch } from './edge.js'
import { qpuMcpCall, qpuMcpToolNames } from './mcp-catalog.js'
import { qpuPeersOf } from './scale.js'
import * as licence from './licence.js'
import {
  QPU_LICENCE, QPU_LICENCE_APEX, QPU_LICENCE_ISSUER,
  qpuLicenceAllowsHostOf, qpuLicenceApplyOf, qpuLicenceCertificateOf, qpuLicenceHolds, qpuLicenceOf,
} from './licence.js'

const ORIGIN = `https://${QPU_HOST}`

const homeLicence = () =>
  qpuLicenceApplyOf(qpuLicenceCertificateOf({ subject: QPU_HOST, engine: 'qpu' }))

const get = (path: string, env?: Parameters<typeof handleQpuFetch>[1]) =>
  handleQpuFetch(new Request(`${ORIGIN}${path}`), env)

const mcpArgsOf = (name: string): Record<string, unknown> => {
  if (name === 'qpu_drive') return { provider: 'hardware', kind: 'cpu', op: 'probe' }
  if (name === 'qpu_donate') return { referrer: ORIGIN }
  if (name === 'qpu_event') return { type: 'click' }
  if (name === 'qpu_input') return { type: 'click', id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' }
  if (name === 'qpu_search') return { q: 'hologram' }
  if (name === 'qpu_fanout') return { tool: 'qpu_seat' }
  return {}
}

test('qpu.uuidna.com serves every discovery API and every fused binding provider', async () => {
  homeLicence()
  assert.equal(QPU_HOST, 'qpu.uuidna.com')
  const disc = qpuDiscoveryOf(ORIGIN)
  assert.equal(disc.host, QPU_HOST)
  assert.equal(disc.worker, 'uuidna-qpu')
  const providers = qpuProvidersOf().map((p) => p.name)
  assert.deepEqual(providers, [...PROVIDERS])

  for (const path of Object.keys(disc.endpoints)) {
    const res = await get(path)
    assert.equal(res.status, 200, path)
  }

  const listed = await get('/providers')
  const body = await listed.json() as { providers: { name: string; bindings: number }[] }
  assert.deepEqual(body.providers.map((p) => p.name), [...PROVIDERS])
  assert.ok(body.providers.every((p) => p.bindings > 0))

  const env = mockCloudflareEnv()
  const census = await get('/bindings', env)
  const bind = await census.json() as {
    fused: boolean
    providers: string[]
    environment: { chip: { seat: string }; bindings: { provider: string; kind: string; bound: boolean }[] }
  }
  assert.equal(bind.fused, true)
  assert.deepEqual(bind.providers, [...PROVIDERS])
  assert.equal(bind.environment.chip.seat, 'empty')
  const rows = qpuBindingsOf(env)
  assert.equal(bind.environment.bindings.length, rows.length)
  for (const p of PROVIDERS) {
    assert.ok(rows.some((b) => b.provider === p), p)
  }

  const names = qpuMcpToolNames()
  for (const tool of ['qpu_fetch', 'qpu_providers', 'qpu_bindings', 'qpu_drive', 'qpu_environment', 'qpu_peers', 'qpu_scale']) {
    assert.ok(names.includes(tool), tool)
  }
  for (const name of names) {
    const hit = await qpuMcpCall(name, mcpArgsOf(name))
    assert.ok(hit != null, name)
  }

  for (const reading of disc.readings) {
    const hit = await qpuMcpCall('qpu_fetch', { path: `/${reading}` }) as { status: number }
    assert.equal(hit.status, 200, reading)
  }
})

test('every binding drives on qpu.uuidna.com; the chip named QPU never binds', async () => {
  homeLicence()
  for (const p of qpuProvidersOf()) {
    const env = p.name === 'cloudflare' ? mockCloudflareEnv() : mockEnvFrom(p.bindings, ['qpu', 'QPU'])
    for (const b of p.bindings) {
      if (b.kind === 'qpu') {
        const out = await qpuDrive(env, p.name, b.kind, 'probe')
        assert.equal(out.ok, false, `${p.name}.qpu`)
        assert.equal(out.error, 'empty')
        continue
      }
      for (const op of b.ops) {
        const out = await qpuDrive(env, p.name, b.kind, op, { key: b.kind, value: b.kind, q: b.kind, model: b.kind })
        assert.equal(out.ok, true, `${p.name}.${b.kind}.${op}: ${out.error}`)
      }
    }
  }
  const unknown = await qpuDrive(undefined, 'not-a-cloud', 'kv', 'probe')
  assert.equal(unknown.ok, false)
  assert.equal(unknown.error, 'no such provider')
  const rec = qpuRecognizeOf({ QPU: { fake: true } })
  const chip = rec.bindings.find((b) => b.kind === 'qpu')
  assert.equal(chip?.bound, false)
})

test('no bypass of the licence, hex climb, named peers, or qpu.uuidna.com host', async () => {
  homeLicence()
  const packed = qpuVersionIntegerOf(QPU_VERSION)
  assert.equal(HEXBIT_STATES, qpuTwoNOf(HEXBIT_BITS))
  assert.equal(packed.hexbits[0], packed.sequence)

  const cert = qpuLicenceOf()
  assert.equal(cert.issuer, QPU_LICENCE_ISSUER)
  assert.equal(cert.issuer, 'license.uuidna.com')
  assert.equal(new URL(cert.href).hostname, QPU_LICENCE_ISSUER)
  assert.equal(cert.subject, QPU_HOST)
  assert.equal(qpuLicenceHolds(cert), true)

  assert.throws(() => {
    (QPU_LICENCE as { host: string }).host = 'a.example'
  })
  assert.throws(() => {
    (QPU_LICENCE as { engine: string }).engine = 'unreal'
  })
  const clone = JSON.parse(JSON.stringify(cert)) as typeof cert
  assert.equal(qpuLicenceHolds(clone), false)
  assert.throws(() => qpuLicenceApplyOf(clone))
  assert.throws(() => qpuLicenceApplyOf(qpuLicenceCertificateOf({ subject: '*.uuidna.com', engine: 'qpu' })))
  assert.throws(() => qpuLicenceApplyOf(qpuLicenceCertificateOf({ subject: 'a.example', engine: 'qpu' })))

  const self = qpuPeersOf()
  assert.deepEqual(self, [ORIGIN])
  assert.deepEqual(qpuPeersOf({ QPU_PEERS: 'https://a.example,http://uuidna.com,https://*.uuidna.com' }), self)
  const licensed = qpuPeersOf({ QPU_PEERS: 'https://license.uuidna.com,https://uuidna.com' })
  assert.ok(licensed.includes('https://license.uuidna.com'))
  assert.ok(licensed.includes('https://uuidna.com'))
  assert.equal(licensed.includes('https://a.example'), false)

  for (const h of cert.san) {
    assert.equal(h.includes('*'), false)
    assert.ok(h === QPU_LICENCE_APEX || h.endsWith(`.${QPU_LICENCE_APEX}`))
  }

  const sneak = await handleQpuFetch(new Request(`${ORIGIN}/bindings`, { method: 'POST' }))
  assert.equal(sneak.status, 405)

  assert.equal('qpuLicenceRequireOf' in licence, false)
  assert.equal(qpuLicenceAllowsHostOf(QPU_HOST), true)
  assert.equal(qpuLicenceAllowsHostOf(QPU_LICENCE_ISSUER), true)
  assert.equal(qpuLicenceAllowsHostOf(QPU_LICENCE_APEX), true)
  assert.equal(qpuLicenceAllowsHostOf('a.example'), false)
  assert.equal(qpuLicenceAllowsHostOf('*.uuidna.com'), false)
  assert.equal(qpuLicenceAllowsHostOf('www.qpu.uuidna.com'), false)
  assert.equal(qpuLicenceAllowsHostOf('localhost'), false)

  for (const host of ['a.example', 'evil.com', 'localhost', '127.0.0.1', 'qpu.example.com']) {
    const res = await handleQpuFetch(new Request(`https://${host}/seat`))
    assert.equal(res.status, 403, host)
    const body = await res.json() as { error: string }
    assert.equal(body.error, 'licence: host refused')
  }

  const spread = { ...cert }
  assert.equal(qpuLicenceHolds(spread), false)
  assert.throws(() => qpuLicenceApplyOf(spread))
  const handmade = {
    kind: 'licence',
    holds: true,
    offline: true,
    when: 'never',
    expires: 'never',
    protocol: 'https',
    issuer: QPU_LICENCE_ISSUER,
    subject: QPU_HOST,
    engine: 'qpu',
    san: cert.san,
    wildcards: false,
    href: cert.href,
    hex: true,
    nibble: 4,
    rotate: true,
    combine: 'sum',
    capacity: cert.capacity,
    sequence: cert.sequence,
    messenger: 'uuid',
  } as typeof cert
  assert.equal(qpuLicenceHolds(handmade), false)
  assert.throws(() => qpuLicenceApplyOf(handmade))
})
