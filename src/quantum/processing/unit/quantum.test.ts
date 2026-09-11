import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker, { shorFactorOf } from './index.js'

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
  const body = (await res.json()) as { result: { structuredContent?: Record<string, unknown> } & Record<string, unknown> }
  assert.equal(res.status, 200)
  return body.result.structuredContent ?? body.result
}

const uiOf = async (path: string) => {
  const res = await worker.fetch(new Request(`https://${host}${path}`, { headers: html }), env)
  return { res, json: await res.json() }
}

const fetchOf = (path: string, init: RequestInit = {}) =>
  worker.fetch(
    new Request(`https://${host}${path}`, {
      ...init,
      headers: { ...html, ...(init.headers as Record<string, string> | undefined) },
    }),
    env,
  )

type Circuit = {
  kind: string
  running: boolean
  physical: boolean
  hardware: {
    kind: string
    physical: boolean
    device: string
    initialize: boolean
    gates: boolean
    interfere: boolean
    measure: boolean
    noise: boolean
    path: { circuit: string; payload?: string; plugin?: string; submit: string; src: string; holds: boolean }
    holds: boolean
  }
  vm: string
  primitives: string[]
  qubits: { n: number; dim: number; levels: number; holds: boolean }
  gates: { names: string[]; index: number; holds: boolean }
  measurement: { index: number; support: number[]; holds: boolean }
  noise: { channel: string; index: number; holds: boolean }
  entangle: {
    kind: string
    support: number[]
    left: number
    right: number
    product: boolean
    parity: number
    plus: { kind: string; ket: string; product: boolean; support: number[]; holds: boolean }
    hadamard: { kind: string; parity: number; product: boolean; support: number[]; holds: boolean }
    coil: {
      theorem: string
      windings: number
      coil: number
      faces: number
      pairs: { ray: number; scanner: number; radar: number; hop: number; product: boolean; holds: boolean }[]
      holds: boolean
    }
    holds: boolean
  }
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
    computer: boolean
    hardware: boolean
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
    isolated: boolean
    lab: boolean
    millikelvin: number
    milli: number
    resistance: boolean
    cryostat: { kind: string; mixing: number; plate: number; pulse: number; holds: boolean }
    telemetry: { kind: string; lab: boolean; millikelvin: number; holds: boolean }
    coil: { kind: string; windings: number; coil: number; holds: boolean }
    electronics: { kind: string; uses: string; holds: boolean }
    follow: { kind: string; emerge: { covered: boolean; balanced: boolean; holds: boolean } }
    efficiency: { kind: string; unity: number; remainder: number; measure: number; holds: boolean }
    next: { kind: string; last: boolean; infinite: boolean; amplitudes: number; next: number; fused: number; nextCoil: number; nextFused: number; holds: boolean }
    clay: { kind: string; clay: number; coil: number; six: number; coils: number; holds: boolean }
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

test('circuit holds via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { circuit: Circuit; ui: { prove: string } }
  assert.equal(q.circuit.kind, 'circuit')
  assert.equal(q.circuit.holds, true)
  assert.equal(q.ui.prove, 'qpu_prove')
})

test('circuit vm browser via mcp', async () => {
  const q = (await mcpOf('qpu_quantum')) as { circuit: Circuit }
  assert.equal(q.circuit.vm, 'browser')
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
  assert.equal(q.circuit.entangle.parity, 0)
  assert.equal(q.circuit.entangle.plus.kind, 'separable')
  assert.equal(q.circuit.entangle.plus.product, true)
  assert.deepEqual(q.circuit.entangle.plus.support, [0, 1, 2, 3])
  assert.equal(q.circuit.entangle.hadamard.parity, 0)
  assert.equal(q.circuit.entangle.hadamard.product, false)
  assert.equal(q.circuit.entangle.left, 1)
  assert.equal(q.circuit.entangle.right, 0)
  assert.equal(q.circuit.entangle.coil.theorem, 'two_coins_make_a_coil')
  assert.equal(q.circuit.entangle.coil.holds, true)
  assert.equal(q.circuit.entangle.coil.pairs.length, 7)
  assert.equal(q.circuit.entangle.coil.pairs.length + q.circuit.entangle.coil.pairs.length, q.circuit.entangle.coil.faces)
  assert.equal(q.circuit.entangle.coil.pairs.every((row) => row.holds && row.product === false && row.hop === row.radar), true)
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
  assert.equal(q.circuit.hardware.holds, true)
  assert.equal(q.circuit.hardware.device, 'simulator')
  assert.equal(q.circuit.hardware.initialize, true)
  assert.equal(q.circuit.hardware.gates, true)
  assert.equal(q.circuit.hardware.interfere, true)
  assert.equal(q.circuit.hardware.measure, true)
  assert.equal(q.circuit.hardware.noise, true)
  assert.equal(q.circuit.hardware.path.circuit, 'https://qpu.uuidna.com')
  assert.equal(q.circuit.hardware.path.payload, 'https://qpu.uuidna.com/storage/databases/payload')
  assert.equal(q.circuit.hardware.path.submit, 'https://qpu.uuidna.com/server')
  assert.equal(q.circuit.hardware.path.src, 'src/quantum/processing/unit/index.lean')
  assert.equal(q.circuit.hardware.path.holds, true)
  assert.equal(q.circuit.fridge.kind, 'simulator')
  assert.equal(q.circuit.fridge.qubits, 3)
  assert.equal(q.circuit.fridge.levels, 2)
  assert.equal(q.circuit.fridge.millikelvin, 10)
  assert.equal(q.circuit.fridge.milli, 1000)
  assert.equal(q.circuit.fridge.cryostat.kind, 'dilution')
  assert.equal(q.circuit.fridge.cryostat.mixing, 10)
  assert.equal(q.circuit.fridge.cryostat.plate, 100)
  assert.equal(q.circuit.fridge.cryostat.pulse, 4000)
  assert.equal(q.circuit.fridge.cryostat.holds, true)
  assert.equal(q.circuit.fridge.telemetry.kind, 'cryostat')
  assert.equal(q.circuit.fridge.telemetry.millikelvin, 10)
  assert.equal(q.circuit.fridge.telemetry.holds, true)
  assert.equal(q.circuit.fridge.coil.holds, true)
  assert.equal(q.circuit.fridge.coil.windings, 2)
  assert.equal(q.circuit.fridge.electronics.uses, 'coil')
  assert.equal(q.circuit.fridge.follow.emerge.covered, true)
  assert.equal(q.circuit.fridge.efficiency.unity, 1)
  assert.equal(q.circuit.fridge.efficiency.remainder, 0)
  assert.equal(q.circuit.fridge.efficiency.measure, 14)
  assert.equal(q.circuit.fridge.next.nextCoil, q.circuit.fridge.next.nextFused)
  assert.equal(q.circuit.fridge.next.nextFused, q.circuit.fridge.next.fused + q.circuit.fridge.next.fused)
  assert.equal(q.circuit.fridge.next.next, q.circuit.fridge.next.amplitudes + q.circuit.fridge.next.amplitudes)
  assert.equal(q.circuit.fridge.clay.clay, 14)
  assert.equal(q.circuit.fridge.clay.clay, q.circuit.fridge.coil.coil)
  assert.equal(q.circuit.fridge.holds, true)
  assert.equal(q.circuit.holds, true)
})

test('circuit lean via mcp', { timeout: 60_000 }, async () => {
  const prove = (await mcpOf('qpu_prove', { live: true })) as {
    holds: boolean
    circuit: { physical: boolean; holds: boolean }
    next: { theorem: string; last: boolean; infinite: boolean; next: number; amplitudes: number; fused: number; nextFused: number; nextCoil: number; holds: boolean }
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
  const millikelvin = prove.theorems.find((r) => r.heading === 'millikelvin')
  const telemetry = prove.theorems.find((r) => r.heading === 'telemetry')
  const kv = prove.theorems.find((r) => r.heading === 'kv')
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
  const infinite = prove.theorems.find((r) => r.heading === 'infinite')
  const distribute = prove.theorems.find((r) => r.heading === 'distribute')
  assert.equal(prove.holds, true)
  assert.equal(prove.next.theorem, 'next_coil')
  assert.equal(prove.next.next, prove.next.amplitudes + prove.next.amplitudes)
  assert.equal(prove.next.nextFused, prove.next.fused + prove.next.fused)
  assert.equal(prove.next.nextCoil, prove.next.nextFused)
  assert.equal(prove.theorems.find((r) => r.heading === 'next')?.holds, true)
  assert.equal(prove.theorems.find((r) => r.heading === 'next_coil')?.holds, true)
  assert.equal(circuit?.holds, true)
  assert.equal(physical?.holds, true)
  assert.equal(fridge?.holds, true)
  assert.equal(fridge?.theorem.includes('resistance = 0'), true)
  assert.equal(fridge?.theorem.includes('by decide'), false)
  assert.equal(millikelvin?.holds, true)
  assert.equal(telemetry?.holds, true)
  assert.equal(kv?.holds, true)
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
  assert.equal(infinite?.holds, true)
  assert.equal(distribute?.holds, true)
  const fusion = prove.theorems.find((r) => r.heading === 'fusion')
  assert.equal(fusion?.holds, true)
  assert.equal(fusion?.theorem.includes('by decide'), false)
  assert.equal(infinite?.theorem.includes('by decide'), false)
  assert.equal(distribute?.theorem.includes('by decide'), false)
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
  assert.equal(json.docs.inline, true)
  assert.equal(json.only.holds, true)
  assert.equal(json.docs.documentation.includes('running quantum circuit'), true)
  assert.equal(json.docs.documentation.includes('state-vector simulator'), true)
  assert.equal(json.docs.documentation.includes('Physical qubit initialize'), true)
  assert.equal(json.docs.documentation.includes('This host is a quantum computer'), true)
  assert.equal(json.docs.documentation.includes('theorem shor'), true)
  assert.equal(json.docs.documentation.includes('theorem fridge'), true)
  assert.equal(json.docs.documentation.includes('theorem qubits'), true)
  assert.equal(json.docs.documentation.includes('demo is not a test nor a proof'), true)
  assert.equal(json.circuit.hardware.holds, true)
  assert.equal(json.circuit.hardware.path.submit, 'https://qpu.uuidna.com/server')
  assert.equal(json.circuit.fridge.kind, 'simulator')
  assert.equal(json.docs.documentation.includes('Resistance none'), true)
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
  assert.equal(json.docs.documentation.includes('Monogamy. Bell is entangled'), true)
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

test('start measure generate', async () => {
  const pageRes = await fetchOf('/')
  const catalogRes = await fetchOf('/mcp')
  const prove = (await mcpOf('qpu_prove')) as {
    holds: boolean
    ui: { experienced: boolean; inline: boolean; door: string }
    theorems: { heading: string; theorem: string; holds: boolean }[]
    cern: { faces: number; holds: boolean }
    integrity: { n: number; holds: boolean }
    intelligence?: { kind: string; test: string; research: string; holds: boolean }
  }
  const quantum = (await mcpOf('qpu_quantum')) as {
    holds: boolean
    fused: number
    next: number
    speed: { cover: string[]; holds: boolean; next: number }
    ui: { experienced: boolean }
    unlocked?: boolean
    lock?: boolean
    shor: { rsa: { kind: string; factored: boolean; modulus: number; p: number; q: number }; n: number; unlocked: boolean }
    purpose: { cybersecurity: { rsa: { kind: string; factored: boolean } } }
    evidence: { verify: { rsa: boolean } }
  }
  const page = (await pageRes.json()) as {
    kind: string
    holds: boolean
    only: { holds: boolean; classical: boolean }
    lattice: { occupied: number; vacant: number; holds: boolean }
    circuit: { running: boolean }
    shor: { rsa: { kind: string; factored: boolean; modulus: number; p: number; q: number }; n: number; unlocked: boolean }
    docs: { inline: boolean; documentation: string }
    ui: { experienced: boolean; prove: string }
    speed: { cover: string[] }
    capacity: {
      infinite: boolean
      scaled: boolean
      next: number
      fused: number
      amplitudes: number
      faces: number
      crypt: { split: number; share: number; holds: boolean }
      kv: { kind: string; added: number; amplitudes: number; holds: boolean; name: string }
      agents: { free: boolean; auth: boolean; n: number; holds: boolean }
      schemas: { mounted: number; vacant: number; holds: boolean }
      raid: {
        holds: boolean
        rotate: boolean
        start: string
        cheapest: string
        cover: string[]
        pick: { name: string; cost: number }
        types: { name: string }[]
        clouds: { name: string }[]
        cluster: { safe: boolean; cost: string; rotate: boolean }
      }
      holds: boolean
    }
  }
  const catalog = (await catalogRes.json()) as {
    kind: string
    holds: boolean
    '@context': unknown
    '@type': string
    hasPart: { '@type': string; numberOfItems: number }
    prove: { ui: { experienced: boolean }; theorems: unknown[]; cern: { faces: number }; shor: { rsa: boolean; p: number; q: number; n: number; unlocked: boolean } }
    cybersecurity: { listed: boolean; rsa: { kind: string; factored: boolean; p: number; q: number; modulus: number; unlocked: boolean }; encrypt: { kind: string; theorem: string; identity: boolean; holds: boolean }; tools: { name: string }[] }
    capacity: {
      infinite: boolean
      scaled: boolean
      agents: { free: boolean; auth: boolean; n: number }
      crypt: { holds: boolean }
      schemas: { mounted: number; vacant: number; holds: boolean }
      holds: boolean
    }
  }
  assert.equal(pageRes.status, 200)
  assert.equal((pageRes.headers.get('content-type') ?? '').includes('application/ld+json'), true)
  assert.equal(page.kind, 'quantum')
  assert.equal(page.holds, true)
  assert.equal(page.only.holds, true)
  assert.equal(page.lattice.occupied, 14)
  assert.equal(page.lattice.vacant, 0)
  assert.equal(page.lattice.holds, true)
  assert.equal(page.docs.inline, true)
  assert.equal(page.ui.prove, 'qpu_prove')
  assert.equal(page.docs.documentation.includes('JSON-LD'), true)
  assert.equal(page.docs.documentation.includes(shorFactorOf()), true)
  assert.equal(page.shor.rsa.kind, 'rsa')
  assert.equal(page.shor.rsa.factored, true)
  assert.equal(page.shor.rsa.p * page.shor.rsa.q, page.shor.n)
  assert.equal(page.shor.n, 91)
  assert.equal(page.shor.unlocked, true)
  assert.deepEqual(page.speed.cover, ['next', 'benchmark'])
  assert.equal(page.capacity.holds, true)
  assert.equal(page.capacity.next, page.capacity.fused + page.capacity.fused)
  assert.equal(page.capacity.crypt.split, 14)
  assert.equal(page.capacity.crypt.holds, true)
  assert.equal(page.capacity.kv.kind, 'kv')
  assert.equal(page.capacity.kv.name, 'kv')
  assert.equal(page.capacity.kv.added, page.capacity.amplitudes)
  assert.equal(page.capacity.kv.amplitudes, page.capacity.fused / 14)
  assert.equal(page.capacity.kv.added + page.capacity.kv.added, page.capacity.kv.amplitudes)
  assert.equal(page.capacity.faces * page.capacity.kv.amplitudes, page.capacity.fused)
  assert.equal(page.capacity.kv.holds, true)
  assert.equal(page.docs.documentation.includes('KV added amplitudes'), true)
  assert.equal(page.capacity.agents.free, true)
  assert.equal(page.capacity.agents.n, 14)
  assert.equal(page.capacity.agents.holds, true)
  assert.equal(page.capacity.schemas.mounted, 14)
  assert.equal(page.capacity.schemas.vacant, 0)
  assert.equal(page.capacity.schemas.holds, true)
  assert.equal(page.capacity.raid.holds, true)
  assert.equal(page.capacity.raid.rotate, true)
  assert.equal(page.capacity.raid.start, 'cheapest')
  assert.equal(page.capacity.raid.cheapest, page.capacity.raid.cover[0])
  assert.equal(page.capacity.raid.cover.length, 14)
  assert.equal(page.capacity.raid.types.length, 14)
  assert.equal(page.capacity.raid.clouds.length, 14)
  assert.equal(page.capacity.raid.cluster.safe, true)
  assert.equal(page.capacity.raid.cluster.cost, 'minimum')
  assert.equal(page.capacity.raid.pick.name, page.capacity.raid.cover[0])
  assert.equal(catalog.kind, 'quantum')
  assert.equal(catalog.holds, true)
  assert.equal(catalog['@type'], 'WebAPI')
  assert.equal(Array.isArray(catalog['@context']), true)
  assert.equal((catalog['@context'] as unknown[])[0], 'https://schema.org')
  assert.equal(catalog.hasPart['@type'], 'ItemList')
  assert.equal(catalog.hasPart.numberOfItems, 8)
  assert.equal(catalog.capacity.holds, true)
  assert.equal(catalog.capacity.agents.free, true)
  assert.equal(catalog.capacity.agents.n, 14)
  assert.equal(catalog.capacity.crypt.holds, true)
  assert.equal(catalog.capacity.schemas.mounted, 14)
  assert.equal(catalog.capacity.schemas.vacant, 0)
  assert.equal(catalog.prove.cern.faces, 14)
  assert.equal(catalog.prove.shor.rsa, true)
  assert.equal(catalog.prove.shor.n, 91)
  assert.equal(catalog.prove.shor.unlocked, true)
  assert.equal(catalog.prove.shor.p * catalog.prove.shor.q, catalog.prove.shor.n)
  assert.equal(catalog.cybersecurity.listed, true)
  assert.equal(catalog.cybersecurity.rsa.kind, 'rsa')
  assert.equal(catalog.cybersecurity.rsa.factored, true)
  assert.equal(catalog.cybersecurity.rsa.unlocked, true)
  assert.equal(catalog.cybersecurity.encrypt.kind, 'encrypt')
  assert.equal(catalog.cybersecurity.encrypt.theorem, 'crypto')
  assert.equal(catalog.cybersecurity.encrypt.identity, true)
  assert.equal(catalog.cybersecurity.encrypt.holds, true)
  assert.equal(catalog.cybersecurity.rsa.modulus, 91)
  assert.equal(catalog.cybersecurity.tools.some((row) => row.name === 'crypto_rsa'), true)
  assert.equal(prove.holds, true)
  assert.equal(prove.ui.inline, true)
  assert.equal(prove.ui.door, 'qpu_prove')
  assert.equal(prove.theorems.every((r) => r.holds && r.theorem.startsWith('theorem') && r.theorem.includes('by decide') === false), true)
  assert.equal(prove.cern.holds, true)
  assert.equal(prove.integrity.holds, true)
  assert.equal(prove.integrity.n, 3)
  assert.equal(prove.intelligence?.kind, 'intelligence')
  assert.equal(prove.intelligence?.test, 'fusion')
  assert.equal(prove.intelligence?.research, 'free online')
  assert.equal(prove.intelligence?.holds, true)
  assert.equal(quantum.holds, true)
  assert.equal(quantum.shor.rsa.kind, 'rsa')
  assert.equal(quantum.shor.rsa.factored, true)
  assert.equal(quantum.shor.rsa.p * quantum.shor.rsa.q, quantum.shor.n)
  assert.equal(quantum.purpose.cybersecurity.rsa.kind, 'rsa')
  assert.equal(quantum.purpose.cybersecurity.rsa.factored, true)
  assert.equal(quantum.evidence.verify.rsa, true)
  assert.equal(quantum.next, quantum.fused + quantum.fused)
  assert.equal(quantum.speed.holds, true)
  assert.equal(quantum.speed.next, quantum.next)
})
