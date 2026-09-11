import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker from './index.js'

const host = 'qpu.uuidna.com'
const env = { QPU_HOST: host }
const html = { accept: 'text/html' }
const origin = `https://${host}`

const fetchOf = (path: string, init: RequestInit = {}) =>
  worker.fetch(
    new Request(`${origin}${path}`, {
      ...init,
      headers: { ...html, ...(init.headers as Record<string, string> | undefined) },
    }),
    env,
  )

const mcpOf = async (name: string, args: Record<string, unknown> = {}) => {
  const res = await fetchOf('/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'text/html' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
  })
  const body = (await res.json()) as { result: { structuredContent?: Record<string, unknown> } & Record<string, unknown> }
  assert.equal(res.status, 200)
  return body.result.structuredContent ?? body.result
}

test('sandbox via mcp', async () => {
  const sandbox = (await mcpOf('qpu_forge')) as {
    kind: string
    unlocked: boolean
    memory: boolean
    eval: boolean
    fs: boolean
    net: boolean
    fetch: boolean
    process: boolean
    import: boolean
    disk: boolean
    worker: boolean
    quantum: boolean
    denied: unknown[]
    lock?: boolean
    tools: { name: string }[]
    holds: boolean
  }
  assert.equal(sandbox.holds, true)
  assert.equal(sandbox.unlocked, true)
  assert.equal(sandbox.lock, false)
  assert.equal(sandbox.memory, true)
  assert.equal(sandbox.eval, true)
  assert.equal(sandbox.fs, true)
  assert.equal(sandbox.net, true)
  assert.equal(sandbox.fetch, true)
  assert.equal(sandbox.process, true)
  assert.equal(sandbox.import, true)
  assert.equal(sandbox.disk, true)
  assert.equal(sandbox.worker, true)
  assert.equal(sandbox.quantum, true)
  assert.equal(sandbox.denied.length, 0)
  assert.equal(sandbox.tools.some((t) => t.name === 'op_mint'), true)
  assert.equal(sandbox.tools.some((t) => t.name === 'slot_fused'), true)
  assert.equal(sandbox.tools.some((t) => t.name === 'op_quantum'), true)
  const unlockedQuantum = (await mcpOf('op_quantum')) as {
    value: {
      kind: string
      unlocked: boolean
      only: { holds: boolean; classical: boolean }
      lattice: { occupied: number; vacant: number; holds: boolean }
      register: { kind: string; holds: boolean }
      related: string[]
      holds: boolean
    }
    memory: boolean
    holds: boolean
  }
  assert.equal(unlockedQuantum.value.kind, 'quantum')
  assert.equal(unlockedQuantum.value.unlocked, true)
  assert.equal(unlockedQuantum.value.only.holds, true)
  assert.equal(unlockedQuantum.value.lattice.occupied, 14)
  assert.equal(unlockedQuantum.value.lattice.vacant, 0)
  assert.equal(unlockedQuantum.value.lattice.holds, true)
  assert.equal(unlockedQuantum.value.register.kind, 'simulator')
  assert.equal(unlockedQuantum.value.related.includes('split'), true)
  assert.equal(unlockedQuantum.value.related.includes('register'), true)
  assert.equal(unlockedQuantum.value.related.includes('speed'), true)
  assert.equal(unlockedQuantum.value.holds, true)
  assert.equal(unlockedQuantum.memory, true)
  assert.equal(sandbox.tools.some((t) => t.name === 'slot_register'), true)
  assert.equal(sandbox.tools.some((t) => t.name === 'slot_split'), true)
  const register = (await mcpOf('slot_register')) as { value: { kind: string; holds: boolean }; unlocked: boolean; holds: boolean }
  assert.equal(register.value.kind, 'simulator')
  assert.equal(register.unlocked, true)
  const split = (await mcpOf('slot_split')) as { value: unknown; holds: boolean }
  assert.equal(split.holds, true)
  const ns = (await mcpOf('slot_ns')) as { value: unknown }
  assert.equal(ns.value, 0)
  const mint = (await mcpOf('call_mint')) as { value: unknown; memory: boolean; unlocked: boolean; holds: boolean }
  assert.equal(mint.value, true)
  assert.equal(mint.memory, true)
  assert.equal(mint.unlocked, true)
  assert.equal(mint.holds, true)
  const forged = (await mcpOf('qpu_forge', {
    name: 'probe_next',
    team: 'call',
    run: { op: 'eq', left: { op: 'quantum', name: 'next' }, right: { op: 'add', left: { op: 'quantum', name: 'fused' }, right: { op: 'quantum', name: 'fused' } } },
  })) as { holds: boolean; memory: boolean; forged: boolean; denied?: string }
  assert.equal(forged.holds, true)
  assert.equal(forged.memory, true)
  assert.equal(forged.forged, true)
  const probe = (await mcpOf('probe_next')) as { value: unknown; memory: boolean; holds: boolean }
  assert.equal(probe.value, true)
  assert.equal(probe.memory, true)
  const sealed = (await mcpOf('qpu_forge', { name: 'qpu_quantum', run: { op: 'lit', value: true } })) as { holds: boolean; forged?: boolean; denied?: string }
  assert.equal(sealed.holds, true)
  assert.equal(sealed.forged, true)
  const still = (await mcpOf('qpu_quantum')) as { kind: string; lock: boolean; unlocked: boolean; holds: boolean }
  assert.equal(still.kind, 'quantum')
  assert.equal(still.lock, false)
  assert.equal(still.unlocked, true)
  assert.equal(still.holds, true)
  const js = (await mcpOf('eval', { run: '1+1' })) as { value: { denied?: string } }
  assert.equal(js.value.denied, 'js')
  const evaluated = (await mcpOf('eval', { run: { op: 'mint', k: 3 } })) as { value: unknown }
  assert.equal(evaluated.value, 8)
  await mcpOf('op_put', { key: 'durable', value: 8 })
  await mcpOf('fs', { method: 'write', path: '/durable', value: 8 })
  await mcpOf('op_put', { key: 'parent', value: 1 })
  await mcpOf('worker', { run: { op: 'put', key: 'parent', value: 2 } })
  const heap = (await mcpOf('op_get', { key: 'durable' })) as { value: unknown }
  const disk = (await mcpOf('fs', { method: 'read', path: '/durable' })) as { value: unknown }
  const parent = (await mcpOf('op_get', { key: 'parent' })) as { value: unknown }
  assert.equal(heap.value, 8)
  assert.equal(disk.value, 8)
  assert.equal(parent.value, 1)
})
