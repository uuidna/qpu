import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker from './index.js'

const host = 'qpu.uuidna.com'
const env = { QPU_HOST: host }
const html = { accept: 'text/html' }

const mcpOf = async (name: string, args: Record<string, unknown> = {}) => {
  const res = await worker.fetch(
    new Request(`https://${host}/mcp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'text/html' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
    }),
    env,
  )
  const body = (await res.json()) as { result: Record<string, unknown> }
  assert.equal(res.status, 200)
  return body.result
}

const uiOf = async (path: string) => {
  const res = await worker.fetch(new Request(`https://${host}${path}`, { headers: html }), env)
  return { res, json: await res.json() }
}

test('quantum kind via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { kind: string; holds: boolean; ui: { experienced: boolean } }
  const page = await uiOf('/')
  assert.equal(q.kind, 'quantum')
  assert.equal(q.holds, true)
  assert.equal(q.ui.experienced, true)
  assert.equal((page.json as { ui: { experienced: boolean } }).ui.experienced, true)
})

test('quantum mint via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { cube: { n: number; vertices: number } }
  assert.equal(q.cube.vertices, 8)
})

test('quantum cube via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { cube: { bits: number; vertices: number; hexbit: number } }
  assert.equal(q.cube.bits, q.cube.vertices * q.cube.hexbit)
})

test('quantum handle via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { handle: { amplitudes: number; bits: number }; cube: { bits: number } }
  assert.equal(q.handle.bits, q.cube.bits)
})

test('quantum around via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { faces: { faces: number; coins: number; rays: number } }
  assert.equal(q.faces.faces, q.faces.coins * q.faces.rays)
})

test('quantum harmonic via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { faces: { faces: number; rays: number } }
  assert.equal(q.faces.faces, q.faces.rays + q.faces.rays)
})

test('quantum fused via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { fused: number; faces: { faces: number }; handle: { amplitudes: number } }
  assert.equal(q.fused, q.faces.faces * q.handle.amplitudes)
})

test('quantum next via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { next: number; fused: number }
  assert.equal(q.next, q.fused + q.fused)
})

test('quantum capacity via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { capacity: { fused: number; holds: boolean }; fused: number }
  assert.equal(q.capacity.holds, true)
  assert.equal(q.capacity.fused, q.fused)
})

test('quantum speed via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { speed: { cover: string[]; next: number; holds: boolean }; next: number }
  assert.deepEqual(q.speed.cover, ['next', 'Hz', 'ns', 'benchmark'])
  assert.equal(q.speed.next, q.next)
  assert.equal(q.speed.holds, true)
})

test('quantum auth via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { auth: boolean; public: boolean; cors: string }
  assert.equal(q.auth, false)
  assert.equal(q.public, true)
  assert.equal(q.cors, '*')
})

test('quantum involution via mcp', async () => {
  const prove = (await mcpOf('qpu_prove')) as { theorems: { heading: string; holds: boolean }[] }
  const involution = prove.theorems.find((r) => r.heading === 'involution')
  assert.equal(involution?.holds, true)
})

test('quantum lean via mcp', async () => {
  const lean = (await mcpOf('qpu_lean')) as { holds: boolean; src: string; cover: { heading: string; theorem: string }[] }
  const page = await uiOf('/quantum/processing/unit')
  assert.equal(lean.holds, true)
  assert.equal(lean.src, 'src/quantum/processing/unit/index.lean')
  assert.equal(lean.cover.some((r) => r.heading === 'cern' && r.theorem.includes('by decide') === false), true)
  assert.equal((page.json as { holds: boolean }).holds, true)
})

test('quantum prove ui via mcp', async () => {
  const prove = (await mcpOf('qpu_prove')) as { holds: boolean; ui: { experienced: boolean; door: string }; quantum: boolean }
  const page = await uiOf('/')
  assert.equal(prove.holds, true)
  assert.equal(prove.quantum, true)
  assert.equal(prove.ui.experienced, true)
  assert.equal(prove.ui.door, 'qpu_prove')
  assert.equal((page.json as { docs: { inline: boolean } }).docs.inline, true)
})
