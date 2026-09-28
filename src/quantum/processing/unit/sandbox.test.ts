import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker, { qpuSandboxEpochHolds, qpuSandboxEpochOf } from './index.js'

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
  assert.equal(unlockedQuantum.value.register.kind, 'exact-amplitudes')
  assert.equal(unlockedQuantum.value.related.includes('split'), true)
  assert.equal(unlockedQuantum.value.related.includes('register'), true)
  assert.equal(unlockedQuantum.value.related.includes('speed'), true)
  assert.equal(unlockedQuantum.value.holds, true)
  assert.equal(unlockedQuantum.memory, true)
  assert.equal(sandbox.tools.some((t) => t.name === 'slot_register'), true)
  assert.equal(sandbox.tools.some((t) => t.name === 'slot_split'), true)
  const register = (await mcpOf('slot_register')) as { value: { kind: string; holds: boolean }; unlocked: boolean; holds: boolean }
  assert.equal(register.value.kind, 'exact-amplitudes')
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
  // theorem 'no one may lock' — A DOOR'S NAME IS FORGEABLE AND THE DOOR SURVIVES. The forge succeeds, and the shadow
  // it adds is never reached because a door is dispatched before the sandbox is consulted. The fixture was called
  // `sealed`, which reads as "this was refused"; it is named for the theorem now, because the assertion below is the
  // opposite of a refusal and the old name argued with it.
  const noLock = (await mcpOf('qpu_forge', { name: 'qpu_quantum', run: { op: 'lit', value: true } })) as { holds: boolean; forged?: boolean; denied?: string }
  assert.equal(noLock.holds, true)
  assert.equal(noLock.forged, true)
  // A SEEDED TOOL'S NAME IS RESERVED, and this is the asymmetry: a host shim is dispatched from the very map the
  // forge writes to, so forging one would replace it rather than shadow it. Refused, and said so.
  const shim = (await mcpOf('qpu_forge', { name: 'eval', run: { op: 'lit', value: true } })) as { holds: boolean; forged?: boolean; denied?: string; hop?: string }
  assert.equal(shim.holds, false)
  assert.equal(shim.denied, 'seeded')
  const op = (await mcpOf('qpu_forge', { name: 'op_mint', run: { op: 'lit', value: true } })) as { denied?: string }
  assert.equal(op.denied, 'seeded')
  // And the shim still does its own job afterwards, which is what reserving the name is for.
  const intact = (await mcpOf('eval', { run: { op: 'mint', k: 3 } })) as { value: unknown }
  assert.equal(intact.value, 8)
  // theorem involution — THE REFUSAL CARRIES THE MOVE. eval is seeded on team call, so the hop is the same idea on
  // team read; the seat is free, and forging it succeeds where the reserved name could not.
  assert.equal(shim.hop, 'read_eval')
  const hopped = (await mcpOf('qpu_forge', { name: shim.hop!, run: { op: 'mint', k: { op: 'args', name: 'k' } } })) as { holds: boolean; forged?: boolean }
  assert.equal(hopped.holds, true)
  assert.equal(hopped.forged, true)
  // A hop twice is the identity: read_eval is now a caller's tool, not seeded, so it is forgeable in place and the
  // involution has nowhere further to carry it.
  const again = (await mcpOf('qpu_forge', { name: 'read_eval', run: { op: 'lit', value: true } })) as { holds: boolean; denied?: string }
  assert.equal(again.holds, true)
  assert.equal(again.denied, undefined)
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

/**
 * A MEMOISED ANSWER MAY NOT OUTLIVE THE SANDBOX IT DESCRIBED.
 *
 * qpu_train, qpu_improve and qpu_compete each carry the sandbox and are now served from the memo, which is
 * worth 79% of a warm call. qpu_forge writes to that sandbox. Keyed on arguments alone, a forge would leave
 * three cached answers describing a sandbox that no longer exists — stale, and still claiming to hold.
 *
 * The epoch rides in the key, so a forge does not invalidate anything: it makes the old keys unreachable.
 * This drives the condition — forge between two identical calls and the second must see the new sandbox.
 */
test('a forge makes the memoised doors answer again, rather than answering from before it', async () => {
  const ask = async (name: string, args: Record<string, unknown> = {}) => {
    const res = await worker.fetch(
      new Request(`https://${host}/mcp`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
      }),
      env,
    )
    const body = (await res.json()) as { result?: { structuredContent?: { sandbox?: { tools?: number } }; sandbox?: { tools?: number } } }
    return body.result?.structuredContent ?? body.result
  }

  const epochBefore = qpuSandboxEpochOf()
  const first = (await ask('qpu_train')) as { sandbox?: { tools?: number } }
  const cached = (await ask('qpu_train')) as { sandbox?: { tools?: number } }
  assert.equal(cached?.sandbox?.tools, first?.sandbox?.tools, 'the same sandbox, served from the memo')

  await ask('qpu_forge', { name: 'epoch_probe', run: { op: 'lit', value: true } })
  assert.ok(qpuSandboxEpochOf() > epochBefore, 'a forge advances the epoch, or nothing below can work')

  const after = (await ask('qpu_train')) as { sandbox?: { tools?: number } }
  assert.notEqual(
    after?.sandbox?.tools,
    first?.sandbox?.tools,
    'and the door answers the sandbox as it now is — keyed on arguments alone this would still be the old count',
  )

  // THE EPOCH ONLY RISES. A counter that could fall would let two different sandboxes share a key.
  assert.equal(qpuSandboxEpochHolds(), true)
  assert.ok(qpuSandboxEpochOf() >= epochBefore)
})

/**
 * A WRITE THAT CHANGES NOTHING MUST CHANGE NOTHING.
 *
 * qpuIntegrityOf forges a sandbox tool named after a sealed door on every qpu_prove — a probe showing the
 * sandbox namespace cannot reach the real door — and writes the identical definition each time. With the
 * epoch advancing on the WRITE, every prove invalidated the memos for train, improve and compete, so the
 * saving measured on a door in isolation would never have survived mixed traffic. Measured: improve fell
 * back from 5.7ms to 546ms after a single prove.
 *
 * The epoch follows CONTENT now, and this drives both halves — an identical forge must not move it, and a
 * different one must.
 */
test('the epoch follows the sandbox content, so an identical forge does not move it', async () => {
  const forge = async (name: string, value: unknown) => {
    const res = await worker.fetch(
      new Request(`https://${host}/mcp`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'qpu_forge', arguments: { name, run: { op: 'lit', value } } } }),
      }),
      env,
    )
    await res.json()
    return qpuSandboxEpochOf()
  }

  const first = await forge('epoch_same', true)
  const again = await forge('epoch_same', true)
  assert.equal(again, first, 'the same definition written twice is one state of the sandbox, not two')

  // AND A REAL CHANGE STILL MOVES IT, or the memo would serve a sandbox that had genuinely changed.
  const changed = await forge('epoch_same', false)
  assert.ok(changed > first, 'a different definition is a different sandbox')

  // a new name is a change too
  const added = await forge('epoch_other', true)
  assert.ok(added > changed)
})
