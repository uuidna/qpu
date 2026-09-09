import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PROVIDERS } from './types.js'
import { qpuBindingsOf, qpuDrive, qpuProviderOf, qpuProvidersOf, qpuRecognizeOf, qpuSolidsHolds, qpuSolidsOf } from './index.js'
import { mockEnvFrom } from './mock.js'
import { mockCloudflareEnv } from './cloudflare/mock.js'
import { CLOUDFLARE_BINDINGS } from './cloudflare/kinds.js'
import { HANDLE_HEXBITS, QPU_POINTS } from '../hologram.js'
import { qpuKeyOf } from './drive.js'
import { ARCH_ALIAS } from './recognize.js'

const NAMES = ['cloudflare', 'google', 'aws', 'azure', 'ibm', 'oracle', 'hardware', 'arch'] as const

test('platonic solids seat known and unknown APIs on the cube and duals', () => {
  const s = qpuSolidsOf()
  assert.equal(qpuSolidsHolds(s), true)
  assert.equal(s.cube.faces, 6)
  assert.equal(s.cube.vertices, 8)
  assert.equal(s.ve.faces, s.cube.faces + s.octa.faces)
  assert.equal(s.providers.length, 8)
  assert.equal(s.unknown.seat, 'empty')
  assert.equal(s.unknown.wildcards, false)
  assert.equal(s.byCube.length, s.cube.faces)
  assert.equal(s.apis.length, s.known)
  assert.equal(s.pentagram.shared, true)
  assert.deepEqual(s.pentagram.points, [...QPU_POINTS])
  assert.equal(s.byPentagram.length, QPU_POINTS.length)
  assert.ok(s.apis.every((a) => a.point === QPU_POINTS[a.pentagram]))
})

test('every architecture and cloud is a src/bindings folder with drivers', () => {
  assert.deepEqual([...PROVIDERS], [...NAMES])
  assert.deepEqual(qpuProvidersOf().map((p) => p.name), [...NAMES])
  for (const p of qpuProvidersOf()) {
    assert.ok(p.bindings.length > 0, p.name)
    assert.equal(p.seat, 'bound', p.name)
    const kinds = new Set<string>()
    const keys = new Set<string>()
    for (const b of p.bindings) {
      assert.equal(b.provider, p.name)
      assert.ok(b.ops.includes('probe'), `${p.name}.${b.kind}`)
      assert.equal(kinds.has(b.kind), false, `dup kind ${p.name}.${b.kind}`)
      assert.equal(keys.has(b.envKey), false, `dup key ${b.envKey}`)
      kinds.add(b.kind)
      keys.add(b.envKey)
    }
  }
})

test('env keys do not collide across providers', () => {
  const keys = new Set<string>()
  for (const p of qpuProvidersOf()) {
    for (const b of p.bindings) {
      assert.equal(keys.has(b.envKey), false, b.envKey)
      keys.add(b.envKey)
    }
  }
})

test('Cloudflare Worker env fuses loaders, media, stream, flagship, artifacts, vpc; AI Gateway is env.AI', () => {
  const kinds = CLOUDFLARE_BINDINGS.map((b) => b.kind)
  for (const k of ['worker_loaders', 'media', 'stream', 'flagship', 'artifacts', 'vpc']) {
    assert.ok(kinds.includes(k), k)
  }
  const ai = CLOUDFLARE_BINDINGS.find((b) => b.kind === 'ai')
  assert.ok(ai?.ops.includes('gateway'))
  const gateway = CLOUDFLARE_BINDINGS.find((b) => b.kind === 'ai_gateway')
  assert.equal(gateway?.wrangler, 'ai')
  assert.equal(gateway?.envKey, 'AI_GATEWAY')
})

test('QPU is always fused; chip named qpu never binds', async () => {
  const r = qpuRecognizeOf({ QPU: { fake: true }, KV: mockCloudflareEnv().KV })
  assert.equal(r.fused, true)
  assert.equal(r.sandbox, true)
  assert.equal(r.experiments, 'unlimited')
  assert.equal(r.when, 'never')
  assert.equal(r.fuse.protocol, 'http')
  assert.equal(r.fuse.wildcards, false)
  assert.ok(r.fuse.domains.every((d) => d.includes('.') && !d.includes('*')))
  assert.equal(r.chip.seat, 'empty')
  const qpu = r.bindings.find((b) => b.kind === 'qpu')
  assert.ok(qpu)
  assert.equal(qpu!.bound, false)
  assert.equal(qpu!.seat, 'empty')
  const drive = await qpuDrive({ QPU: { fake: true } }, 'hardware', 'qpu', 'probe')
  assert.equal(drive.ok, false)
  assert.equal(drive.error, 'empty')
})

test('auto-recognize aliases and host arch', () => {
  const rows = qpuBindingsOf({ S3: mockEnvFrom(qpuProviderOf('aws')!.bindings).AWS_S3 })
  const s3 = rows.find((b) => b.kind === 's3' && b.provider === 'aws')
  assert.equal(s3?.bound, true)
  const host = qpuRecognizeOf()
  assert.equal(host.fused, true)
  if (host.host.kind) {
    const row = host.bindings.find((b) => b.kind === host.host.kind && b.provider === 'arch')
    assert.equal(row?.bound, true, `host arch ${host.host.kind}`)
  }
  if (host.host.cores) {
    const cpu = host.bindings.find((b) => b.kind === 'cpu' && b.provider === 'hardware')
    assert.equal(cpu?.bound, true)
  }
})

test('mock env: every provider, every binding, every op drives', async () => {
  for (const p of qpuProvidersOf()) {
    const env = p.name === 'cloudflare' ? mockCloudflareEnv() : mockEnvFrom(p.bindings, ['qpu', 'QPU'])
    for (const b of p.bindings) {
      if (b.kind === 'qpu') continue
      for (const op of b.ops) {
        const out = await qpuDrive(env, p.name, b.kind, op, { key: b.kind, value: b.kind, q: b.kind, model: b.kind })
        assert.equal(out.ok, true, `${p.name}.${b.kind}.${op}: ${out.error}`)
      }
    }
  }
})

test('BindingPoint names are hardware drivers; Alpine ISAs are arch drivers', () => {
  const hw = qpuProviderOf('hardware')!
  for (const name of QPU_POINTS) {
    assert.ok(hw.bindings.some((b) => b.kind === name.toLowerCase() && b.envKey === name), name)
  }
  const arches = qpuProviderOf('arch')!.bindings.map((b) => b.kind)
  for (const a of ['x86_64', 'x86', 'aarch64', 'armhf', 'armv7', 'ppc64le', 's390x', 'riscv64', 'wasm32', 'webgpu', 'cuda']) {
    assert.ok(arches.includes(a), a)
  }
  assert.equal(ARCH_ALIAS.x64, 'x86_64')
  assert.equal(ARCH_ALIAS.arm64, 'aarch64')
})

test('kv put then get uses a hologram-width key', async () => {
  const env = mockCloudflareEnv()
  const put = await qpuDrive(env, 'cloudflare', 'kv', 'put', { value: 'hologram' })
  assert.equal(put.ok, true)
  assert.equal(put.key?.length, HANDLE_HEXBITS)
  assert.equal(qpuKeyOf('hologram'), put.key)
  const got = await qpuDrive(env, 'cloudflare', 'kv', 'get', { key: put.key })
  assert.equal(got.value, 'hologram')
})

test('unknown provider is refused', async () => {
  const x = await qpuDrive(undefined, 'azure-not', 'blob', 'probe')
  assert.equal(x.ok, false)
  assert.equal(x.error, 'no such provider')
})
