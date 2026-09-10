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

type Circuit = {
  kind: string
  running: boolean
  physical: boolean
  vm: string
  host: boolean
  primitives: string[]
  qubits: { n: number; dim: number; levels: number; holds: boolean }
  gates: { names: string[]; index: number; holds: boolean }
  measurement: { index: number; support: number[]; holds: boolean }
  noise: { channel: string; index: number; holds: boolean }
  entangle: { kind: string; support: number[]; left: number; right: number; product: boolean; holds: boolean }
  interfere: { kind: string; cancelled: number; restored: number; support: number[]; holds: boolean }
  ghz: { kind: string; support: number[]; left: number; right: number; product: boolean; holds: boolean }
  noclone: { kind: string; copies: number; cloned: number; holds: boolean }
  teleport: { kind: string; psi: number; bob: number; weight0: number; weight1: number; plus0: number; plus1: number; holds: boolean }
  kickback: { kind: string; support: number[]; weight0: number; weight1: number; holds: boolean }
  deutsch: { kind: string; queries: number; classical: number; constant0: number; constant1: number; balanced0: number; balanced1: number; holds: boolean }
  dense: { kind: string; i: number; x: number; z: number; xz: number; holds: boolean }
  monogamy: { kind: string; bell: boolean; pair: boolean; left: number; right: number; holds: boolean }
  only: {
    kind: string
    split: boolean
    entangle: boolean
    interfere: boolean
    ghz: boolean
    noclone: boolean
    teleport: boolean
    kickback: boolean
    deutsch: boolean
    dense: boolean
    monogamy: boolean
    product: boolean
    classical: boolean
    holds: boolean
  }
  lattice: {
    kind: string
    waves: number
    faces: number
    occupied: number
    vacant: number
    cover: number
    nodes: { face: number; hop: number; involution: boolean; name: string; holds: boolean }[]
    holds: boolean
  }
  fridge: {
    kind: string
    qubits: number
    levels: number
    dim: number
    vm: string
    host: boolean
    isolated: boolean
    holds: boolean
  }
  science: { levels: number; qubits: number; dim: number; gates: string[]; xx: boolean }
  sciences: {
    kind: string
    none: boolean
    circuit: number
    cube: number
    faces: number
    bits: number
    shared: boolean
    distinct: boolean
    holds: boolean
  }
  drift: { kind: string; none: boolean; between: boolean; holds: boolean }
  holds: boolean
}

test('circuit running via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { circuit: Circuit; ui: { experienced: boolean } }
  const page = await uiOf('/')
  assert.equal(q.circuit.kind, 'circuit')
  assert.equal(q.circuit.running, true)
  assert.equal(q.circuit.holds, true)
  assert.equal(q.ui.experienced, true)
  assert.equal((page.json as { circuit: Circuit }).circuit.running, true)
})

test('circuit vm browser via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { circuit: Circuit }
  assert.equal(q.circuit.vm, 'browser')
  assert.equal(q.circuit.host, false)
})

test('circuit primitives via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { circuit: Circuit }
  assert.deepEqual(q.circuit.primitives, ['fetch', 'Request', 'Response', 'BigInt', 'performance'])
})

test('circuit qubits via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { circuit: Circuit }
  assert.equal(q.circuit.qubits.n, 3)
  assert.equal(q.circuit.qubits.holds, true)
})

test('circuit dim via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { circuit: Circuit; cube: { vertices: number } }
  assert.equal(q.circuit.qubits.dim, 8)
  assert.equal(q.circuit.qubits.dim, q.cube.vertices)
})

test('circuit levels via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { circuit: Circuit }
  assert.equal(q.circuit.qubits.levels, 2)
  assert.equal(q.circuit.science.levels, 2)
  assert.equal(q.circuit.drift.none, true)
  assert.equal(q.circuit.drift.between, true)
  assert.equal(q.circuit.drift.holds, true)
  assert.equal(q.circuit.sciences.shared, true)
  assert.equal(q.circuit.sciences.distinct, true)
  assert.equal(q.circuit.sciences.circuit, 3)
  assert.equal(q.circuit.sciences.faces, 14)
  assert.notEqual(q.circuit.sciences.circuit, q.circuit.sciences.faces)
  assert.notEqual(q.circuit.sciences.cube, q.circuit.sciences.faces)
  assert.notEqual(q.circuit.sciences.bits, q.circuit.sciences.faces)
})

test('circuit gates via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { circuit: Circuit }
  assert.deepEqual(q.circuit.gates.names, ['h', 'cnot'])
  assert.equal(q.circuit.gates.holds, true)
})

test('circuit gates index via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { circuit: Circuit }
  assert.equal(q.circuit.gates.index, 3)
})

test('circuit measurement via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { circuit: Circuit }
  assert.equal(q.circuit.measurement.index, 3)
  assert.equal(q.circuit.measurement.holds, true)
})

test('circuit measurement support via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { circuit: Circuit }
  assert.deepEqual(q.circuit.measurement.support, [0, 3])
  assert.equal(q.circuit.entangle.product, false)
  assert.equal(q.circuit.entangle.left, 1)
  assert.equal(q.circuit.entangle.right, 0)
  assert.equal(q.circuit.entangle.holds, true)
  assert.equal(q.circuit.interfere.cancelled, 0)
  assert.equal(q.circuit.interfere.restored, 2)
  assert.equal(q.circuit.interfere.holds, true)
  assert.deepEqual(q.circuit.ghz.support, [0, 7])
  assert.equal(q.circuit.ghz.product, false)
  assert.equal(q.circuit.ghz.left, 1)
  assert.equal(q.circuit.ghz.right, 0)
  assert.equal(q.circuit.ghz.holds, true)
  assert.equal(q.circuit.noclone.copies, 4)
  assert.equal(q.circuit.noclone.cloned, 2)
  assert.equal(q.circuit.noclone.holds, true)
  assert.equal(q.circuit.teleport.weight0, 0)
  assert.equal(q.circuit.teleport.weight1, 16)
  assert.equal(q.circuit.teleport.plus0, 16)
  assert.equal(q.circuit.teleport.plus1, 16)
  assert.equal(q.circuit.teleport.holds, true)
  assert.deepEqual(q.circuit.kickback.support, [3])
  assert.equal(q.circuit.kickback.weight0, 0)
  assert.equal(q.circuit.kickback.holds, true)
  assert.equal(q.circuit.deutsch.queries, 1)
  assert.equal(q.circuit.deutsch.classical, 2)
  assert.equal(q.circuit.deutsch.constant1, 0)
  assert.equal(q.circuit.deutsch.balanced0, 0)
  assert.equal(q.circuit.deutsch.holds, true)
  assert.equal(q.circuit.dense.i, 0)
  assert.equal(q.circuit.dense.z, 1)
  assert.equal(q.circuit.dense.x, 2)
  assert.equal(q.circuit.dense.xz, 3)
  assert.equal(q.circuit.dense.holds, true)
  assert.equal(q.circuit.monogamy.bell, true)
  assert.equal(q.circuit.monogamy.pair, true)
  assert.equal(q.circuit.monogamy.holds, true)
  assert.equal(q.circuit.only.ghz, true)
  assert.equal(q.circuit.only.noclone, true)
  assert.equal(q.circuit.only.teleport, true)
  assert.equal(q.circuit.only.kickback, true)
  assert.equal(q.circuit.only.deutsch, true)
  assert.equal(q.circuit.only.dense, true)
  assert.equal(q.circuit.only.monogamy, true)
  assert.equal(q.circuit.only.holds, true)
  assert.equal(q.circuit.only.classical, false)
  assert.equal(q.circuit.lattice.kind, 'lattice')
  assert.equal(q.circuit.lattice.faces, 14)
  assert.equal(q.circuit.lattice.occupied, 14)
  assert.equal(q.circuit.lattice.vacant, 0)
  assert.equal(q.circuit.lattice.holds, true)
  assert.deepEqual(
    q.circuit.lattice.nodes.map((node) => node.name),
    [
      'split',
      'entangle',
      'interfere',
      'ghz',
      'noclone',
      'teleport',
      'kickback',
      'deutsch',
      'dense',
      'monogamy',
      'qubits',
      'gates',
      'measurement',
      'fridge',
    ],
  )
  assert.equal(q.circuit.lattice.nodes.every((node) => node.holds && node.involution), true)
})

test('circuit noise via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { circuit: Circuit }
  assert.equal(q.circuit.noise.channel, 'xx')
  assert.equal(q.circuit.noise.index, q.circuit.measurement.index)
  assert.equal(q.circuit.noise.holds, true)
})

test('circuit physical via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { circuit: Circuit }
  assert.equal(q.circuit.physical, true)
  assert.equal(q.circuit.fridge.kind, 'superconducting')
  assert.equal(q.circuit.fridge.isolated, true)
  assert.equal(q.circuit.fridge.host, false)
  assert.equal(q.circuit.fridge.qubits, 3)
  assert.equal(q.circuit.fridge.levels, 2)
  assert.equal(q.circuit.fridge.holds, true)
  assert.equal(q.circuit.holds, true)
})

test('circuit lean via mcp', { timeout: 60_000 }, async () => {
  const prove = (await mcpOf('qpu_prove', { live: true })) as {
    holds: boolean
    theorems: { heading: string; theorem: string; holds: boolean }[]
    cern: {
      holds: boolean
      live?: { live: boolean; holds: boolean; hostEscape: boolean; records: { href: string; holds: boolean; live: boolean }[] }
      records: { href: string }[]
      primitives: string[]
    }
  }
  const circuit = prove.theorems.find((r) => r.heading === 'circuit')
  const physical = prove.theorems.find((r) => r.heading === 'physical')
  const fridge = prove.theorems.find((r) => r.heading === 'fridge')
  const drift = prove.theorems.find((r) => r.heading === 'drift')
  const sciences = prove.theorems.find((r) => r.heading === 'sciences')
  const interfere = prove.theorems.find((r) => r.heading === 'interfere')
  const entangle = prove.theorems.find((r) => r.heading === 'entangle')
  const ghz = prove.theorems.find((r) => r.heading === 'ghz')
  const noclone = prove.theorems.find((r) => r.heading === 'noclone')
  const teleport = prove.theorems.find((r) => r.heading === 'teleport')
  const kickback = prove.theorems.find((r) => r.heading === 'kickback')
  const deutsch = prove.theorems.find((r) => r.heading === 'deutsch')
  const dense = prove.theorems.find((r) => r.heading === 'dense')
  const monogamy = prove.theorems.find((r) => r.heading === 'monogamy')
  const only = prove.theorems.find((r) => r.heading === 'only')
  const fill = prove.theorems.find((r) => r.heading === 'fill')
  assert.equal(prove.holds, true)
  assert.equal(circuit?.holds, true)
  assert.equal(physical?.holds, true)
  assert.equal(fridge?.holds, true)
  assert.equal(drift?.holds, true)
  assert.equal(sciences?.holds, true)
  assert.equal(interfere?.holds, true)
  assert.equal(entangle?.holds, true)
  assert.equal(ghz?.holds, true)
  assert.equal(noclone?.holds, true)
  assert.equal(teleport?.holds, true)
  assert.equal(kickback?.holds, true)
  assert.equal(deutsch?.holds, true)
  assert.equal(dense?.holds, true)
  assert.equal(monogamy?.holds, true)
  assert.equal(only?.holds, true)
  assert.equal(fill?.holds, true)
  assert.equal(fill?.theorem.includes('by decide'), false)
  assert.equal(only?.theorem.includes('by decide'), false)
  assert.equal(entangle?.theorem.includes('by decide'), false)
  assert.equal(ghz?.theorem.includes('by decide'), false)
  assert.equal(noclone?.theorem.includes('by decide'), false)
  assert.equal(teleport?.theorem.includes('by decide'), false)
  assert.equal(kickback?.theorem.includes('by decide'), false)
  assert.equal(deutsch?.theorem.includes('by decide'), false)
  assert.equal(dense?.theorem.includes('by decide'), false)
  assert.equal(monogamy?.theorem.includes('by decide'), false)
  assert.equal(prove.cern.holds, true)
  assert.equal(prove.cern.live?.live, true)
  assert.equal(prove.cern.live?.holds, true)
  assert.equal(prove.cern.live?.hostEscape, false)
  assert.equal(prove.cern.live?.records.every((row) => row.holds && row.live), true)
})

test('circuit ui via mcp', { timeout: 60_000 }, async () => {
  const prove = (await mcpOf('qpu_prove')) as {
    holds: boolean
    ui: { experienced: boolean }
    theorems: { heading: string; holds: boolean }[]
    cern: { records: { href: string }[]; primitives: string[]; holds: boolean }
  }
  const fetched = (await mcpOf('fetch', { href: prove.cern.records[0]?.href })) as {
    holds: boolean
    live: boolean
    hostEscape: boolean
    value?: { holds: boolean; events: number }
  }
  const page = await uiOf('/')
  const json = page.json as { docs: { inline: boolean; documentation: string }; only: { holds: boolean; classical: boolean }; circuit: Circuit }
  assert.equal(prove.holds, true)
  assert.equal(prove.ui.experienced, true)
  assert.equal(json.docs.inline, true)
  assert.equal(json.only.holds, true)
  assert.equal(json.only.classical, false)
  assert.equal(json.docs.documentation.includes('running quantum circuit'), true)
  assert.equal(json.docs.documentation.includes('superconducting qubits'), true)
  assert.equal(json.circuit.running, true)
  assert.equal(json.circuit.fridge.kind, 'superconducting')
  assert.equal(json.circuit.drift.none, true)
  assert.equal(json.circuit.drift.between, true)
  assert.equal(json.circuit.sciences.distinct, true)
  assert.equal(json.docs.documentation.includes('No drift from science'), true)
  assert.equal(json.docs.documentation.includes('No drift between sciences'), true)
  assert.equal(json.docs.documentation.includes('Possible only in quantum'), true)
  assert.equal(json.docs.documentation.includes('Bell then CNOT onto the third qubit'), true)
  assert.equal(json.docs.documentation.includes('coins ≠ mintOf coins'), true)
  assert.equal(json.docs.documentation.includes('Teleport |1⟩ lands on Bob'), true)
  assert.equal(json.docs.documentation.includes('Phase kickback'), true)
  assert.equal(json.docs.documentation.includes('One quantum query'), true)
  assert.equal(json.docs.documentation.includes('Superdense. Two bits in one qubit'), true)
  assert.equal(json.docs.documentation.includes('Monogamy. Bell is not a product'), true)
  assert.equal(json.circuit.only.holds, true)
  assert.equal(json.circuit.ghz.holds, true)
  assert.equal(json.circuit.noclone.holds, true)
  assert.equal(json.circuit.teleport.holds, true)
  assert.equal(json.circuit.kickback.holds, true)
  assert.equal(json.circuit.deutsch.holds, true)
  assert.equal(json.circuit.dense.holds, true)
  assert.equal(json.circuit.monogamy.holds, true)
  assert.equal(json.circuit.entangle.product, false)
  assert.equal(json.circuit.interfere.holds, true)
  assert.equal(prove.theorems.find((r) => r.heading === 'ghz')?.holds, true)
  assert.equal(prove.theorems.find((r) => r.heading === 'noclone')?.holds, true)
  assert.equal(prove.theorems.find((r) => r.heading === 'teleport')?.holds, true)
  assert.equal(prove.theorems.find((r) => r.heading === 'kickback')?.holds, true)
  assert.equal(prove.theorems.find((r) => r.heading === 'deutsch')?.holds, true)
  assert.equal(prove.theorems.find((r) => r.heading === 'dense')?.holds, true)
  assert.equal(prove.theorems.find((r) => r.heading === 'monogamy')?.holds, true)
  assert.equal(prove.cern.holds, true)
  assert.equal(fetched.holds, true)
  assert.equal(fetched.live, true)
  assert.equal(fetched.hostEscape, false)
  assert.equal(fetched.value?.holds, true)
})
