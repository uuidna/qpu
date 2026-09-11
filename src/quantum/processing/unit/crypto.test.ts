import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker, {
  qpuCapacityHolds,
  qpuCapacityOf,
  qpuCybersecurityHolds,
  qpuCybersecurityOf,
  qpuCybersecurityToolsOf,
  qpuDocsOf,
  qpuEncryptHolds,
  qpuEncryptOf,
  qpuIdeasOf,
  qpuLeanOf,
  qpuMcpOf,
  qpuProveHolds,
  qpuProveOf,
  qpuQuantumOf,
  qpuRaidHolds,
  qpuRaidOf,
  qpuSequenceOf,
  qpuShorHolds,
  qpuShorOf,
  qpuToolsOf,
  qpuTrainHolds,
  qpuTrainOf,
  shorFactorOf,

} from './index.js'

const host = 'qpu.uuidna.com'
const env = { QPU_HOST: host }
const origin = `https://${host}`

const mcpOf = async (name: string, args: Record<string, unknown> = {}) => {
  const res = await worker.fetch(
    new Request(`${origin}/mcp`, {
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

test('cybersecurity catalog holds — eight morph tools, not a ninth sealed tool', async () => {
  const cyber = qpuCybersecurityOf()
  const sealed = qpuToolsOf()
  const morph = qpuCybersecurityToolsOf()
  const docs = qpuDocsOf()
  const sequence = qpuSequenceOf()
  assert.equal(qpuCybersecurityHolds(cyber), true)
  assert.equal(cyber.kind, 'cybersecurity')
  assert.equal(cyber.theorem, 'crypto')
  assert.equal(cyber.sealed, false)
  assert.equal(cyber.morph, true)
  assert.equal(cyber.listed, true)
  assert.equal(sealed.length, 8)
  assert.equal(morph.length, 8)
  assert.deepEqual(cyber.tools, [
    'crypto_catalog',
    'crypto_shor',
    'crypto_cmodexp',
    'crypto_iqft',
    'crypto_shots',
    'crypto_rsa',
    'crypto_split',
    'crypto_verify',
  ])
  assert.equal(docs.api.length, 7)
  assert.equal(sealed.some((t) => t.name.startsWith('crypto_')), false)
  assert.equal(sequence.rungs.every((row, k) => row.cybersecurity === cyber.tools[k]), true)
  const listed = qpuMcpOf()
  assert.equal(listed.tools.length, 8)
  assert.equal(listed.cybersecurity.listed, true)
  assert.equal(listed.cybersecurity.sealed, false)
  assert.equal(listed.cybersecurity.morph, true)
  assert.equal(listed.cybersecurity.rsa.kind, 'rsa')
  assert.equal(listed.cybersecurity.rsa.factored, true)
  assert.equal(listed.cybersecurity.rsa.p * listed.cybersecurity.rsa.q, listed.cybersecurity.rsa.modulus)
  assert.deepEqual(listed.cybersecurity.tools.map((t) => t.name), cyber.tools)
  const catalogRes = await worker.fetch(
    new Request(`${origin}/mcp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'text/html' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
    }),
    env,
  )
  const catalogList = (await catalogRes.json()) as { result: { tools: { name: string; morph?: boolean; sealed?: boolean }[] } }
  assert.equal(catalogList.result.tools.length, 16)
  assert.deepEqual(
    catalogList.result.tools.map((t) => t.name),
    [...sealed.map((t) => t.name), ...cyber.tools],
  )
  assert.equal(catalogList.result.tools.slice(0, 8).every((t) => t.sealed === true && t.morph === false), true)
  assert.equal(catalogList.result.tools.slice(8).every((t) => t.sealed === false && t.morph === true), true)
  const catalog = (await mcpOf('crypto_catalog')) as {
    kind: string
    theorem: string
    sealed: boolean
    morph: boolean
    listed: boolean
    holds: boolean
    tools: string[]
    rsa: { kind: string; factored: boolean; modulus: number }
  }
  assert.equal(catalog.kind, 'cybersecurity')
  assert.equal(catalog.theorem, 'crypto')
  assert.equal(catalog.sealed, false)
  assert.equal(catalog.morph, true)
  assert.equal(catalog.listed, true)
  assert.equal(catalog.holds, true)
  assert.deepEqual(catalog.tools, cyber.tools)
  assert.equal(catalog.rsa.kind, 'rsa')
  assert.equal(catalog.rsa.factored, true)
  assert.equal(catalog.rsa.modulus, 91)
  assert.equal(cyber.rsa.kind, 'rsa')
  assert.equal(cyber.rsa.factored, true)
  assert.equal(cyber.rsa.modulus, 91)
  assert.equal(cyber.rsa.table[13]?.product, 91)
  assert.equal(cyber.rsa.table.every((row) => row.rsa && row.p * row.q === row.modulus), true)
})

test('quantum reading and GET expose factored RSA', async () => {
  const quantum = qpuQuantumOf()
  const shown = (await mcpOf('qpu_quantum')) as {
    shor?: { rsa: { kind: string; factored: boolean; modulus: number; p: number; q: number } }
  }
  assert.equal(quantum.shor.rsa.kind, 'rsa')
  assert.equal(quantum.shor.rsa.factored, true)
  assert.equal(shown.shor?.rsa.kind, 'rsa')
  assert.equal(shown.shor?.rsa.factored, true)
  assert.equal(shown.shor?.rsa.modulus, 91)
  assert.equal(shown.shor?.rsa.p * shown.shor?.rsa.q, 91)
  assert.equal(quantum.shor.unlocked, true)
  assert.equal(quantum.shor.lock, false)
  assert.equal(quantum.shor.n > 15, true)
})

test('cybersecurity tools morph at call time — each door holds', async () => {
  const names = qpuCybersecurityOf().tools
  for (const name of names) {
    const man = (await mcpOf(name, { man: true })) as { kind: string; name: string; documentation: string; holds: boolean }
    assert.equal(man.kind, 'man')
    assert.equal(man.name, name)
    assert.equal(man.documentation.includes('Not a ninth sealed tool'), true)
    const factors = name !== 'crypto_split'
    const encrypts = name === 'crypto_catalog' || name === 'crypto_split' || name === 'crypto_verify'
    assert.equal(!factors || man.documentation.includes('theorem shor'), true, name)
    assert.equal(!encrypts || man.documentation.includes('theorem crypto'), true, name)
    assert.equal(man.holds, true)
    const shown = (await mcpOf(name)) as { holds?: boolean; kind?: string }
    assert.equal(shown.holds, true, name)
  }
  const shor = (await mcpOf('crypto_shor')) as {
    kind: string
    n: number
    a: number
    coprime: boolean
    rsa: { kind: string; cryptosystem: string; modulus: number; p: number; q: number; factored: boolean; holds: boolean }
    holds: boolean
  }
  assert.equal(shor.kind, 'shor')
  assert.equal(shor.n, 91)
  assert.equal(shor.a, 8)
  assert.equal(shor.coprime, true)
  assert.equal(shor.rsa.kind, 'rsa')
  assert.equal(shor.rsa.cryptosystem, 'rsa')
  assert.equal(shor.rsa.modulus, 91)
  assert.equal(shor.rsa.p * shor.rsa.q, shor.rsa.modulus)
  assert.equal(shor.rsa.factored, true)
  const cmodexp = (await mcpOf('crypto_cmodexp')) as { kind: string; circuitry: { kind: string; native: string[] }; rsa: { kind: string; modulus: number; a: number; factored: boolean }; holds: boolean }
  assert.equal(cmodexp.kind, 'cmodexp')
  assert.equal(cmodexp.circuitry.kind, 'cmodexp')
  assert.deepEqual(cmodexp.circuitry.native, ['h', 'cnot'])
  assert.equal(cmodexp.rsa.kind, 'rsa')
  assert.equal(cmodexp.rsa.modulus, 91)
  assert.equal(cmodexp.rsa.a, 8)
  assert.equal(cmodexp.rsa.factored, true)
  const iqft = (await mcpOf('crypto_iqft')) as { kind: string; qft: { kind: string }; post: { period: number }; rsa: { kind: string; modulus: number; period: number; factored: boolean }; holds: boolean }
  assert.equal(iqft.kind, 'iqft')
  assert.equal(iqft.qft.kind, 'iqft')
  assert.equal(iqft.post.period, 4)
  assert.equal(iqft.rsa.kind, 'rsa')
  assert.equal(iqft.rsa.modulus, 91)
  assert.equal(iqft.rsa.period, 4)
  assert.equal(iqft.rsa.factored, true)
  const shots = (await mcpOf('crypto_shots')) as { kind: string; device: string; measure: { noise: string; shots: number }; rsa: { kind: string; modulus: number; factored: boolean }; holds: boolean }
  assert.equal(shots.kind, 'shots')
  assert.equal(shots.device, 'simulator')
  assert.equal(shots.measure.noise, 'xx')
  assert.equal(shots.measure.shots, 8)
  assert.equal(shots.rsa.kind, 'rsa')
  assert.equal(shots.rsa.factored, true)
  const rsa = (await mcpOf('crypto_rsa')) as {
    kind: string
    cryptosystem: string
    modulus: number
    factored: boolean
    factors: { p: number; q: number; product: number }
    table: { p: number; q: number; product: number; modulus: number; rsa: boolean; holds: boolean }[]
    payload: string
    holds: boolean
  }
  assert.equal(rsa.kind, 'rsa')
  assert.equal(rsa.cryptosystem, 'rsa')
  assert.equal(rsa.modulus, 91)
  assert.equal(rsa.factored, true)
  assert.equal(rsa.factors.p * rsa.factors.q, rsa.modulus)
  assert.equal(rsa.table.length, 14)
  assert.equal(rsa.table.every((row) => row.holds && row.rsa && row.p * row.q === row.modulus), true)
  assert.equal(rsa.payload.endsWith('/storage/databases/payload'), true)
  const encrypt = qpuEncryptOf()
  assert.equal(qpuEncryptHolds(encrypt), true)
  assert.equal(encrypt.kind, 'encrypt')
  assert.equal(encrypt.theorem, 'crypto')
  assert.equal(encrypt.identity, true)
  assert.equal(encrypt.ciphertext, encrypt.public)
  assert.equal(encrypt.ciphertext !== encrypt.modulus, true)
  const split = (await mcpOf('crypto_split')) as {
    kind: string
    theorem: string
    identity: boolean
    ciphertext: number
    public: number
    fused: number
    modulus: number
    holds: boolean
  }
  assert.equal(split.kind, 'encrypt')
  assert.equal(split.theorem, 'crypto')
  assert.equal(split.identity, true)
  assert.equal(split.ciphertext, split.public)
  assert.equal(split.ciphertext, split.fused)
  assert.equal(split.ciphertext !== split.modulus, true)
  const verify = (await mcpOf('crypto_verify')) as {
    kind: string
    factoring: { theorem: string; factored: boolean; n: number; p: number; q: number }
    encrypt: { theorem: string; identity: boolean; holds: boolean }
    verify: { crypt: boolean; rsa: boolean; encrypt: boolean; cors: string }
    rsa: { factored: boolean }
    holds: boolean
  }
  assert.equal(verify.kind, 'verify')
  assert.equal(verify.factoring.theorem, 'shor')
  assert.equal(verify.factoring.factored, true)
  assert.equal(verify.factoring.p * verify.factoring.q, verify.factoring.n)
  assert.equal(verify.encrypt.theorem, 'crypto')
  assert.equal(verify.encrypt.identity, true)
  assert.equal(verify.verify.crypt, true)
  assert.equal(verify.verify.rsa, true)
  assert.equal(verify.verify.encrypt, true)
  assert.equal(verify.rsa.factored, true)
  assert.equal(verify.verify.cors, '*')
})


test('theorem crypto — crypt split fused across faces', () => {
  const capacity = qpuCapacityOf()
  const crypt = capacity.crypt
  assert.equal(qpuCapacityHolds(capacity), true)
  assert.equal(crypt.kind, 'crypto')
  assert.equal(crypt.theorem, 'crypto')
  assert.equal(crypt.split, 14)
  assert.equal(crypt.split, capacity.faces)
  assert.equal(crypt.share, capacity.kv.amplitudes)
  assert.equal(crypt.fused, capacity.fused)
  assert.equal(crypt.fused, crypt.split * crypt.share)
  assert.equal(crypt.holds, true)
})

test('RAID cluster security is crypt', () => {
  const raid = qpuRaidOf()
  assert.equal(qpuRaidHolds(raid), true)
  assert.equal(raid.cluster.security, 'crypt')
})

test('train vm crypt and messaging theorem crypto', () => {
  const train = qpuTrainOf()
  assert.equal(qpuTrainHolds(train), true)
  assert.equal(train.vm.crypt, true)
  assert.equal(train.messaging.theorem, 'crypto')
  assert.equal(train.messaging.security, true)
})

test('ideas crypto ray equals fused split', () => {
  const ideas = qpuIdeasOf()
  const capacity = qpuCapacityOf()
  const crypto = ideas.ideas.find((row) => row.name === 'crypto')
  assert.equal(ideas.holds, true)
  assert.equal(crypto?.theorem, 'fused = faces * mintOf (vertices * hexbit + seed)')
  assert.equal(crypto?.left, crypto?.right)
  assert.equal(crypto?.left, capacity.fused)
})

test('crypto theorems sit on Lean rows — docs stay seven', () => {
  const lean = qpuLeanOf()
  const docs = qpuDocsOf()
  for (const heading of ['crypto', 'shor']) {
    const row = [...lean.rows, ...lean.cover].find((r) => r.heading === heading)
    assert.equal(row?.holds, true)
    assert.equal(row?.theorem.startsWith(`theorem ${heading}`), true)
    assert.equal(row?.theorem.includes('by decide'), false)
  }
  const shorRow = [...lean.rows, ...lean.cover].find((r) => r.heading === 'shor')
  assert.equal(shorRow?.reading.includes(shorFactorOf()), true)
  assert.equal(docs.documentation.includes(shorFactorOf()), true)
  assert.equal(lean.holds, true)
  assert.equal(docs.api.length, 7)
  assert.equal(docs.documentation.includes('Crypt split'), true)
  const prove = qpuProveOf()
  assert.equal(qpuProveHolds(prove), true)
  assert.equal(prove.shor.product, 91)
})

test('Shor specifies N and a coprime base', () => {
  const shor = qpuShorOf()
  assert.equal(qpuShorHolds(shor), true)
  assert.equal(shor.n, 91)
  assert.equal(shor.a, 8)
  assert.equal(shor.coprime, true)
  assert.equal(shor.n % shor.a === 0, false)
})

test('Shor modular-exponentiation circuitry maps counting to a^x mod N', () => {
  const shor = qpuShorOf()
  assert.equal(shor.circuitry.kind, 'cmodexp')
  assert.deepEqual(shor.circuitry.native, ['h', 'cnot'])
  assert.equal(shor.circuitry.mul.length, 2)
  assert.equal(shor.circuitry.mul[0]?.a, 8)
  assert.equal(shor.circuitry.mul[1]?.a, 64)
  assert.equal(shor.circuitry.holds, true)
})

test('Shor period-finding is inverse QFT', () => {
  const shor = qpuShorOf()
  assert.equal(shor.qft.kind, 'iqft')
  assert.equal(shor.qft.qubits, 2)
  assert.equal(shor.qft.size, 4)
  assert.equal(shor.qft.holds, true)
  assert.equal(shor.post.kind, 'continued-fraction')
  assert.equal(shor.post.period, 4)
  assert.equal(shor.post.holds, true)
})

test('Shor repeats physical xx-noisy shots', () => {
  const shor = qpuShorOf()
  assert.equal(shor.device, 'simulator')
  assert.equal(shor.measure.noise, 'xx')
  assert.equal(shor.measure.identity, true)
  assert.equal(shor.measure.shots, 8)
  assert.equal(shor.measure.outcomes.length, 8)
  assert.equal(shor.measure.support.length > 0, true)
  assert.equal(shor.measure.holds, true)
})

test('Shor post-processing factors multiply back to N', () => {
  const shor = qpuShorOf()
  assert.equal(shor.factors.p, 7)
  assert.equal(shor.factors.q, 13)
  assert.equal(shor.factors.product, 91)
  assert.equal(shor.factors.p * shor.factors.q, shor.n)
  assert.equal(shor.factors.holds, true)
  assert.equal(shor.rsa.kind, 'rsa')
  assert.equal(shor.rsa.cryptosystem, 'rsa')
  assert.equal(shor.rsa.modulus, 91)
  assert.equal(shor.rsa.p, 7)
  assert.equal(shor.rsa.q, 13)
  assert.equal(shor.rsa.factored, true)
  assert.equal(shor.unlocked, true)
  assert.equal(shor.lock, false)
  assert.equal(shor.circuitry.work, 7)
  assert.equal(shor.circuitry.qubits, 9)
  assert.equal(shor.rsa.holds, true)
  assert.equal(shor.payload, 'https://qpu.uuidna.com/storage/databases/payload')
})

test('theorem shor — the kernel does not know the answer: period and factors are absent from the statement', () => {
  const shor = qpuShorOf()
  const lean = qpuLeanOf()
  const row = [...lean.rows, ...lean.cover].find((r) => r.heading === 'shor')
  assert.ok(row)
  const statement = row.theorem.slice(0, row.theorem.indexOf(':='))
  const numerals = new Set(statement.match(/\d+/g) ?? [])
  assert.deepEqual([...numerals].sort(), ['0', '1', '2', '8', '91'])
  assert.equal(shor.factors.p * shor.factors.q, shor.n)
  assert.equal(numerals.has(String(shor.factors.p)), false)
  assert.equal(numerals.has(String(shor.factors.q)), false)
  assert.equal(numerals.has(String(shor.post.period)), false)
  assert.equal(row.theorem.includes('by decide'), false)
})

test('purpose cybersecurity is fridge, Shor, crypt split, extras, and next', () => {
  const quantum = qpuQuantumOf()
  const prove = qpuProveOf()
  const capacity = qpuCapacityOf()
  const purpose = quantum.purpose
  assert.equal(purpose.holds, true)
  assert.equal(purpose.kind, 'purpose')
  assert.equal(purpose.nature.platform, quantum.circuit.fridge.kind)
  assert.equal(purpose.nature.qubits, 3)
  assert.equal(purpose.nature.resistance, 0)
  assert.equal(purpose.nature.entangle, false)
  assert.equal(purpose.nature.ghz, true)
  assert.equal(purpose.cybersecurity.n, quantum.shor.n)
  assert.equal(purpose.cybersecurity.a, quantum.shor.a)
  assert.equal(purpose.cybersecurity.product, 91)
  assert.deepEqual(purpose.cybersecurity.factors, [7, 13])
  assert.equal(purpose.cybersecurity.crypt, capacity.crypt.split)
  assert.equal(purpose.cybersecurity.share, capacity.crypt.share)
  assert.equal(purpose.cybersecurity.circuitry, 'cmodexp')
  assert.equal(purpose.cybersecurity.qft, 'iqft')
  assert.equal(purpose.cybersecurity.raid, 'crypt')
  assert.equal(purpose.cybersecurity.sealed, false)
  assert.equal(purpose.cybersecurity.morph, true)
  assert.equal(purpose.cybersecurity.rsa.kind, 'rsa')
  assert.equal(purpose.cybersecurity.rsa.modulus, 91)
  assert.equal(purpose.cybersecurity.rsa.factored, true)
  assert.equal(purpose.cybersecurity.rsa.p * purpose.cybersecurity.rsa.q, 91)
  assert.equal(purpose.cybersecurity.encrypt.kind, 'encrypt')
  assert.equal(purpose.cybersecurity.encrypt.theorem, 'crypto')
  assert.equal(purpose.cybersecurity.encrypt.identity, true)
  assert.equal(purpose.cybersecurity.encrypt.holds, true)
  assert.equal(purpose.cybersecurity.tools.length, 8)
  assert.equal(purpose.cybersecurity.tools.includes('crypto_rsa'), true)
  assert.equal(purpose.optimization.next, purpose.optimization.fused + purpose.optimization.fused)
  assert.equal(purpose.science.climb[3], 'qpu_prove')
  assert.deepEqual(purpose.science.extras, ['/storage', '/network', '/server'])
  assert.equal(purpose.sensing.network, '/network')
  assert.equal(purpose.sensing.server, '/server')
  assert.equal(purpose.sensing.hop, 'involution')
  assert.equal(prove.purpose.holds, true)
  assert.equal(prove.purpose.nature.platform, prove.circuit.hardware.device)
  assert.equal(prove.purpose.cybersecurity.product, prove.shor.n)
})

test('evidence is this-run provenance, calibration, QV-style heavy output, and cross-validation', () => {
  const quantum = qpuQuantumOf()
  const prove = qpuProveOf()
  const evidence = quantum.evidence
  assert.equal(evidence.holds, true)
  assert.equal(evidence.provenance.provider, 'qpu.uuidna.com')
  assert.equal(evidence.provenance.device, quantum.circuit.fridge.kind)
  assert.equal(evidence.provenance.shots, quantum.shor.measure.shots)
  assert.equal(evidence.provenance.outcomes.length, 8)
  assert.equal(evidence.provenance.counts.length, 2)
  assert.equal(evidence.provenance.weights.length, quantum.shor.qft.size)
  assert.deepEqual(evidence.provenance.compiler.native, ['h', 'cnot'])
  assert.equal(evidence.provenance.map.fridge, 3)
  assert.equal(evidence.noise.model, 'xx')
  assert.equal(evidence.noise.gate.identity, true)
  assert.equal(evidence.noise.t1.measured, false)
  assert.equal(evidence.noise.t2.measured, false)
  assert.equal(evidence.noise.resistance, 0)
  assert.equal(evidence.noise.drift, true)
  assert.equal(evidence.volume.dim, 8)
  assert.equal(evidence.volume.threshold.num, 2)
  assert.equal(evidence.volume.threshold.den, 3)
  assert.equal(evidence.volume.uncertainty, 8)
  assert.equal(evidence.volume.randomized.includes('deutsch'), true)
  assert.equal(evidence.volume.randomized.includes('ghz'), false)
  assert.equal(evidence.cross.agreeIdeal, true)
  assert.equal(evidence.cross.noisy, 'xx')
  assert.equal(evidence.scaling.exact, true)
  assert.equal(evidence.scaling.beyond, false)
  assert.equal(evidence.scaling.advantage, false)
  assert.equal(evidence.verify.cors, '*')
  assert.equal(evidence.verify.origin, 'https://qpu.uuidna.com')
  assert.equal(evidence.verify.cern, 'opendata.cern.ch')
  assert.equal(evidence.verify.hardware, true)
  assert.equal(evidence.verify.algorithm, true)
  assert.equal(evidence.verify.rsa, true)
  assert.equal(evidence.verify.crypt, true)
  assert.equal(evidence.fault.code, 'bitflip')
  assert.equal(evidence.fault.distance, 3)
  assert.equal(evidence.fault.codes, 1)
  assert.equal(evidence.fault.suppressed, true)
  assert.equal(evidence.fault.logical.off, 0)
  assert.equal(evidence.fault.logicalLtPhysical, true)
  assert.equal(prove.evidence.holds, true)
  assert.equal(prove.evidence.provenance.device, prove.circuit.hardware.device)
  assert.equal(prove.evidence.provenance.shots, prove.shor.shots)
})

test('Shor is on the sequence — quantum then lean then prove', () => {
  const shor = qpuShorOf()
  const quantum = qpuQuantumOf()
  const prove = qpuProveOf()
  const mcp = qpuMcpOf()
  assert.equal(quantum.shor.holds, true)
  assert.equal(quantum.shor.rsa.kind, 'rsa')
  assert.equal(quantum.shor.rsa.factored, true)
  assert.equal(quantum.shor.factors.p * quantum.shor.factors.q, quantum.shor.n)
  assert.equal(quantum.sequence.rungs[5]?.cybersecurity, 'crypto_rsa')
  assert.equal(quantum.sequence.rungs[0]?.tool, 'qpu_quantum')
  assert.equal(quantum.sequence.rungs[0]?.path, '/')
  assert.equal(quantum.sequence.rungs[7]?.path, '/server')
  assert.equal(quantum.sequence.rungs[7]?.tool, 'qpu_prove')
  assert.equal(quantum.sequence.climb[3], 'qpu_prove')
  assert.equal(quantum.sequence.extras[0]?.path, '/storage')
  assert.equal(prove.shor.circuitry, 'cmodexp')
  assert.equal(prove.shor.qft, 'iqft')
  assert.equal(prove.shor.product, 91)
  assert.equal(prove.shor.rsa.kind, 'rsa')
  assert.equal(prove.shor.rsa.factored, true)
  assert.equal(mcp.prove.shor.n, 91)
  assert.equal(mcp.prove.shor.product, 91)
  assert.equal(mcp.prove.shor.rsa, true)
  assert.equal(mcp.prove.shor.unlocked, true)
  assert.equal(mcp.prove.shor.p * mcp.prove.shor.q, mcp.prove.shor.n)
  assert.equal(shor.n, 91)
  assert.equal(shor.a, 8)
  assert.equal(shor.factors.p * shor.factors.q, shor.n)
})
