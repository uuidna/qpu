import { test } from 'node:test'
import assert from 'node:assert/strict'
import { handleQpuFetch } from './edge.js'
import { QPU_HOST } from './hologram.js'
import { qpuDiscoveryOf } from './discovery.js'
import { qpuMcpCall, qpuMcpToolNames } from './mcp-catalog.js'
import { PROVIDERS } from './bindings/types.js'
import { qpuDrive, qpuProvidersOf, qpuRecognizeOf } from './bindings/index.js'
import { mockCloudflareEnv } from './bindings/cloudflare/mock.js'
import { mockEnvFrom } from './bindings/mock.js'

const ORIGIN = `https://${QPU_HOST}`
const LIVE = 'https://qpu.uuidna.com'

const jsonDoors = (): string[] => {
  const disc = qpuDiscoveryOf(ORIGIN)
  const paths = Object.keys(disc.endpoints).filter((p) => p !== '/sse' && p !== '/ws')
  return [...new Set(paths)].sort()
}

const get = (path: string, env?: Parameters<typeof handleQpuFetch>[1]) =>
  handleQpuFetch(new Request(`${ORIGIN}${path}`), env)

test('QPU worker handles every discovery door, every MCP tool, every binding', async () => {
  const doors = jsonDoors()
  assert.ok(doors.includes('/bindings'))
  assert.ok(doors.includes('/environment'))
  assert.ok(doors.includes('/providers'))
  assert.ok(doors.includes('/mcp'))
  for (const path of doors) {
    const res = await get(path)
    assert.equal(res.status, 200, path)
  }

  const providers = await (await get('/providers')).json() as { providers: { name: string }[] }
  assert.deepEqual(providers.providers.map((p) => p.name), [...PROVIDERS])

  const bindings = await (await get('/bindings')).json() as {
    fused: boolean
    providers: string[]
    environment: { total: number; chip: { seat: string } }
  }
  assert.equal(bindings.fused, true)
  assert.deepEqual(bindings.providers, [...PROVIDERS])
  assert.equal(bindings.environment.chip.seat, 'empty')
  assert.ok(bindings.environment.total > 0)

  const env = qpuRecognizeOf()
  assert.equal(env.byProvider.length, PROVIDERS.length)
  for (const row of env.byProvider) assert.ok(PROVIDERS.includes(row.name as typeof PROVIDERS[number]), row.name)

  const names = qpuMcpToolNames()
  assert.ok(names.includes('qpu_bindings'))
  assert.ok(names.includes('qpu_drive'))
  assert.ok(names.includes('qpu_fetch'))
  assert.ok(names.includes('qpu_providers'))
  const argsFor = (name: string): Record<string, unknown> => {
    if (name === 'qpu_drive') return { provider: 'hardware', kind: 'cpu', op: 'probe' }
    if (name === 'qpu_donate') return { referrer: ORIGIN }
    if (name === 'qpu_event') return { type: 'click' }
    if (name === 'qpu_input') return { type: 'click', id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' }
    if (name === 'qpu_search') return { q: 'hologram' }
    if (name === 'qpu_fanout') return { tool: 'qpu_seat' }
    return {}
  }
  for (const name of names) {
    const body = await qpuMcpCall(name, argsFor(name))
    assert.ok(body != null, name)
  }

  for (const p of qpuProvidersOf()) {
    const mock = p.name === 'cloudflare' ? mockCloudflareEnv() : mockEnvFrom(p.bindings, ['qpu', 'QPU'])
    for (const b of p.bindings) {
      if (b.kind === 'qpu') {
        const empty = await qpuDrive({ QPU: { fake: true } }, p.name, b.kind, 'probe')
        assert.equal(empty.ok, false, `${p.name}.qpu`)
        continue
      }
      const out = await qpuDrive(mock, p.name, b.kind, 'probe')
      assert.equal(out.ok, true, `${p.name}.${b.kind}.probe: ${out.error}`)
    }
  }
})

test('live qpu.uuidna.com handles the same JSON APIs', async () => {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 8000)
  let seat: Response
  try {
    seat = await fetch(`${LIVE}/seat`, { signal: ctrl.signal, headers: { accept: 'application/json' } })
  } catch (e) {
    clearTimeout(t)
    assert.ok(e instanceof Error)
    return
  }
  clearTimeout(t)
  if (seat.status >= 500) return
  assert.equal(seat.status, 200, 'live /seat')
  const body = await seat.json() as { seat: string }
  assert.equal(body.seat, 'empty')

  for (const path of jsonDoors()) {
    if (path === '/mcp') {
      const res = await fetch(`${LIVE}/mcp`, { headers: { accept: 'application/json' } })
      assert.equal(res.status, 200, path)
      continue
    }
    const res = await fetch(`${LIVE}${path}`, { headers: { accept: 'application/json' } })
    assert.equal(res.status, 200, `live ${path}`)
  }

  const providers = await (await fetch(`${LIVE}/providers`, { headers: { accept: 'application/json' } })).json() as {
    providers: { name: string }[]
  }
  assert.deepEqual(providers.providers.map((p) => p.name), [...PROVIDERS])
})
