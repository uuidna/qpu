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

test('purpose cybersecurity is register, Shor, crypt split, extras, and next', () => {
  const quantum = qpuQuantumOf()
  const prove = qpuProveOf()
  const capacity = qpuCapacityOf()
  const purpose = quantum.purpose
  assert.equal(purpose.holds, true)
  assert.equal(purpose.kind, 'purpose')
  assert.equal(purpose.nature.platform, quantum.circuit.register.kind)
  assert.equal(purpose.nature.qubits, 3)
  assert.equal(purpose.nature.product, false)
  assert.equal(purpose.nature.entangled, true)
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
  assert.equal(evidence.provenance.device, quantum.circuit.register.kind)
  assert.equal(evidence.provenance.shots, quantum.shor.measure.shots)
  assert.equal(evidence.provenance.outcomes.length, 8)
  assert.equal(evidence.provenance.counts.length, 2)
  assert.equal(evidence.provenance.weights.length, quantum.shor.qft.size)
  assert.deepEqual(evidence.provenance.compiler.native, ['h', 'cnot'])
  assert.equal(evidence.provenance.map.register, 3)
  assert.equal(evidence.noise.model, 'xx')
  assert.equal(evidence.noise.gate.identity, true)
  assert.equal(evidence.noise.t1.measured, false)
  assert.equal(evidence.noise.t2.measured, false)
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

test('crypto_shor runs on the n and a it is given, whatever they are; no denial, no cap', async () => {
  const listed = (await (await worker.fetch(
    new Request(`${origin}/mcp`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) }),
    env,
  )).json()) as { result: { tools: { name: string; inputSchema: { properties: Record<string, { type: string; minimum?: number }> } }[] } }
  for (const name of ['crypto_shor', 'crypto_cmodexp', 'crypto_iqft', 'crypto_shots', 'crypto_rsa']) {
    const schema = listed.result.tools.find((t) => t.name === name)?.inputSchema as { properties: Record<string, { type: string | string[]; minimum?: number }> } | undefined
    assert.deepEqual(schema?.properties.n?.type, ['integer', 'string'], name)
    assert.deepEqual(schema?.properties.a?.type, ['integer', 'string'], name)
    assert.equal(schema?.properties.n?.minimum, undefined, name)
    assert.equal(schema?.properties.a?.minimum, undefined, name)
  }
  type Run = {
    n: number | string
    a: number | string
    coprime: boolean
    circuitry: { qubits: number; work: number; dim: number; holds: boolean }
    prepare: { qubits: number; dim: number | string; amplitudes: number; sparse: boolean; prepared: boolean; reason: 'held' | 'empty'; holds: boolean }
    exact: { safe: boolean; n: string; a: string; p: string; q: string; product: string; dim: string }
    device: string
    measure: { measured: boolean; shots: number; outcomes: number[]; holds: boolean }
    post: { period: number }
    classical: { gcd: number; period: number; unit: boolean; beyond: boolean; resolvable: boolean; agrees: boolean; holds: boolean }
    factors: { p: number | string; q: number | string; product: number | string; by: 'period' | 'gcd' | 'none' }
    rsa: { factored: boolean }
    holds: boolean
  }
  // the impostor this catches: a tool that answers 91 = 7 * 13 whatever it is asked
  const fifteen = (await mcpOf('crypto_shor', { n: 15, a: 7 })) as Run
  assert.equal(fifteen.n, 15)
  assert.equal(fifteen.a, 7)
  assert.equal(fifteen.post.period, 4)
  assert.deepEqual([Number(fifteen.factors.p), Number(fifteen.factors.q)].sort((x, y) => x - y), [3, 5])
  assert.equal(fifteen.factors.by, 'period')
  assert.equal(fifteen.rsa.factored, true)
  assert.equal(fifteen.prepare.prepared, true)
  assert.equal(fifteen.prepare.sparse, true)
  assert.equal(fifteen.prepare.amplitudes > 0 && fifteen.prepare.amplitudes <= 16, true)
  assert.equal(fifteen.exact.safe, true)
  assert.equal(fifteen.exact.n, '15')
  assert.equal(fifteen.measure.measured, true)
  assert.equal(fifteen.measure.shots, 8)
  assert.equal(fifteen.classical.unit, true)
  assert.equal(fifteen.classical.beyond, false)
  assert.equal(fifteen.holds, true)
  // the tool text says what the reach is not, and the runs say the same: coprime periods off 4 recover nothing,
  // a shared factor is gcd, and a wide modulus is no exception either way
  const catalog = (await (await worker.fetch(new Request(`${origin}/mcp`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) }), env)).json()) as { result: { tools: { name: string; description: string; inputSchema: { properties: Record<string, { description?: string }> } }[] } }
  const shorTool = catalog.result.tools.find((x) => x.name === 'crypto_shor')!
  assert.equal(shorTool.inputSchema.properties.n?.description?.includes('recovers a period only when it divides 4'), true)
  assert.equal(shorTool.inputSchema.properties.n?.description?.includes('The reach is of the state, not of period-finding'), true)
  const wideShared = (await mcpOf('crypto_shor', { n: ((1n << 4096n) - 1n).toString(), a: 3 })) as Run
  assert.equal(wideShared.coprime, false)
  assert.equal(wideShared.factors.by, 'gcd')
  assert.equal(wideShared.post.period, 0)
  const wideCoprime = (await mcpOf('crypto_shor', { n: ((1n << 4096n) - 1n).toString(), a: 7 })) as Run
  assert.equal(wideCoprime.coprime, true)
  assert.equal(wideCoprime.classical.resolvable, false)
  assert.equal(wideCoprime.post.period, 0)
  assert.equal(wideCoprime.factors.by, 'none')
  assert.equal(wideCoprime.rsa.factored, false)
  const ninetyOne = (await mcpOf('crypto_shor', { n: 91, a: 8 })) as Run
  assert.equal(Number(ninetyOne.factors.p) * Number(ninetyOne.factors.q), 91)
  assert.notEqual(JSON.stringify(fifteen), JSON.stringify(ninetyOne))
  const byDefault = (await mcpOf('crypto_shor')) as Run
  assert.equal(byDefault.n, 91)
  assert.equal(byDefault.a, 8)
  // a period the two-qubit counting register cannot resolve: the run recovers nothing and says so, never a typed answer
  const twentyOne = (await mcpOf('crypto_shor', { n: 21, a: 2 })) as Run
  assert.equal(twentyOne.classical.period, 0)
  assert.equal(twentyOne.classical.beyond, true)
  assert.equal(twentyOne.classical.resolvable, false)
  assert.equal(twentyOne.post.period, 0)
  assert.equal(twentyOne.factors.by, 'none')
  assert.equal(twentyOne.rsa.factored, false)
  assert.equal(twentyOne.holds, false)
  assert.equal(twentyOne.classical.holds, true)
  const twentyOneEight = (await mcpOf('crypto_shor', { n: 21, a: 8 })) as Run
  assert.equal(twentyOneEight.classical.period, 2)
  assert.equal(twentyOneEight.rsa.factored, true)
  assert.equal(Number(twentyOneEight.factors.p) * Number(twentyOneEight.factors.q), 21)
  // no denial: a base sharing a factor with n runs, and the run hands that factor over as Shor's first step
  const shared = (await mcpOf('crypto_shor', { n: 91, a: 7 })) as Run
  assert.equal(shared.coprime, false)
  assert.equal(shared.classical.gcd, 7)
  assert.equal(shared.post.period, 0)
  assert.equal(shared.factors.by, 'gcd')
  assert.deepEqual([Number(shared.factors.p), Number(shared.factors.q)].sort((x, y) => x - y), [7, 13])
  assert.equal(shared.rsa.factored, true)
  assert.equal(shared.holds, true)
  // no cap: fifteen qubits run
  const big = (await mcpOf('crypto_shor', { n: 4096, a: 3 })) as Run
  assert.equal(big.n, 4096)
  assert.equal(big.circuitry.qubits, 15)
  assert.equal(big.circuitry.work, 13)
  assert.equal(big.circuitry.dim, 32768)
  assert.equal(big.circuitry.holds, true)
  assert.equal(big.classical.period, 0)
  assert.equal(big.classical.beyond, true)
  assert.equal(big.classical.resolvable, false)
  assert.equal(big.post.period, 0)
  assert.equal(big.rsa.factored, false)
  // input is read, never refused: a numeric string and a fraction become the integers they hold
  const text = (await mcpOf('crypto_shor', { n: '15', a: '7' })) as Run
  assert.equal(text.n, 15)
  assert.equal(text.a, 7)
  assert.equal(text.rsa.factored, true)
  const fraction = (await mcpOf('crypto_shor', { n: 15.9, a: 7.2 })) as Run
  assert.equal(fraction.n, 15)
  assert.equal(fraction.a, 7)
  const nonsense = (await mcpOf('crypto_shor', { n: 'ninety-one', a: null })) as Run
  assert.equal(nonsense.n, 91)
  assert.equal(nonsense.a, 8)
  // out of the textbook range still runs and reports what fell out
  const aboveN = (await mcpOf('crypto_shor', { n: 15, a: 15 })) as Run
  assert.equal(aboveN.n, 15)
  assert.equal(aboveN.a, 15)
  assert.equal(aboveN.rsa.factored, false)
  assert.equal(aboveN.holds, false)
  const one = (await mcpOf('crypto_shor', { n: 1, a: 1 })) as Run
  assert.equal(one.n, 1)
  assert.equal(one.rsa.factored, false)
  assert.equal(one.holds, false)
  const zero = (await mcpOf('crypto_shor', { n: 0, a: 0 })) as Run
  assert.equal(zero.n, 0)
  assert.equal(zero.rsa.factored, false)
  assert.equal(zero.holds, false)
  // no host reach: 64 qubits is 2^64 dimensions, but the state is sparse — sixteen amplitudes at most — so it is held,
  // run, and measured like any other; a number past 2^53 is sent as digits and echoed exactly in `exact`
  const sixtyFour = (await mcpOf('crypto_shor', { n: '2305843009213693952', a: 3 })) as Run
  assert.equal(sixtyFour.circuitry.qubits, 64)
  assert.equal(sixtyFour.prepare.prepared, true)
  assert.equal(sixtyFour.prepare.sparse, true)
  assert.equal(sixtyFour.prepare.amplitudes > 0 && sixtyFour.prepare.amplitudes <= 16, true)
  assert.equal(sixtyFour.prepare.dim, '18446744073709551616')
  assert.equal(sixtyFour.device, 'simulator')
  assert.equal(sixtyFour.exact.safe, false)
  assert.equal(sixtyFour.exact.n, '2305843009213693952')
  assert.equal(sixtyFour.n, '2305843009213693952')
  assert.equal(sixtyFour.measure.measured, true)
  assert.equal(sixtyFour.measure.holds, true)
  assert.equal(sixtyFour.circuitry.holds, true)
  assert.equal(sixtyFour.classical.beyond, true)
  assert.equal(sixtyFour.classical.resolvable, false)
  // the register cannot resolve an order past four, the run recovered nothing, and the two agree: that is the check holding
  assert.equal(sixtyFour.classical.holds, true)
  assert.equal(sixtyFour.classical.agrees, true)
  assert.equal(sixtyFour.post.period, 0)
  assert.equal(sixtyFour.factors.by, 'none')
  assert.equal(sixtyFour.rsa.factored, false)
  assert.equal(sixtyFour.holds, false)
  // a shared factor past 2^53 is handed over exactly: 2^70 with base 6 has gcd 2
  const huge = (await mcpOf('crypto_shor', { n: '1180591620717411303424', a: 6 })) as Run
  assert.equal(huge.circuitry.qubits, 73)
  assert.equal(huge.factors.by, 'gcd')
  assert.equal(huge.exact.p, '2')
  assert.equal(huge.exact.q, '590295810358705651712')
  assert.equal(huge.exact.product, huge.exact.n)
  assert.equal(huge.rsa.factored, true)
  assert.equal(huge.holds, true)
  // a 2048-bit modulus runs too: the unit has no reach to fall short of, and it reports honestly that it found nothing
  const rsa2048 = (await mcpOf('crypto_shor', { n: '3'.repeat(617), a: 3 })) as Run
  assert.equal(rsa2048.circuitry.qubits > 2048, true)
  assert.equal(rsa2048.prepare.prepared, true)
  assert.equal(rsa2048.measure.measured, true)
  assert.equal(rsa2048.exact.n, '3'.repeat(617))
  assert.equal(rsa2048.n, '3'.repeat(617))
  assert.equal(rsa2048.factors.p, '3')
  assert.equal(rsa2048.factors.product, '3'.repeat(617))
  assert.equal(rsa2048.factors.by, 'gcd')
  assert.equal(rsa2048.exact.p, '3')
  assert.equal(rsa2048.classical.unit, false)
  assert.equal(rsa2048.classical.beyond, false)
  assert.equal(JSON.stringify(rsa2048).includes('null'), false)
  assert.equal(JSON.stringify(zero).includes('null'), false)
  // READ: every reply says how each argument was taken; a garbage argument runs the default and says so, and does not hold
  type Read = { how: string; exact: boolean; given: boolean }
  type WithRead = Run & { read: { n: Read; a: Read; holds: boolean }; classical: Run['classical'] & { ring: boolean } }
  const plain = (await mcpOf('crypto_shor', { n: 15, a: 7 })) as WithRead
  assert.deepEqual(plain.read, { n: { how: 'number', exact: true, given: true }, a: { how: 'number', exact: true, given: true }, holds: true })
  const absent = (await mcpOf('crypto_shor')) as WithRead
  assert.deepEqual(absent.read.n, { how: 'absent', exact: true, given: false })
  assert.equal(absent.holds, true)
  const garbage = (await mcpOf('crypto_shor', { n: [15], a: { a: 7 } })) as WithRead
  assert.equal(garbage.n, 91)
  assert.deepEqual(garbage.read.n, { how: 'default', exact: false, given: true })
  assert.deepEqual(garbage.read.a, { how: 'default', exact: false, given: true })
  assert.equal(garbage.read.holds, false)
  assert.equal(garbage.rsa.factored, true)
  assert.equal(garbage.holds, false)
  const digits = (await mcpOf('crypto_shor', { n: '2305843009213693952', a: '3' })) as WithRead
  assert.deepEqual(digits.read.n, { how: 'digits', exact: true, given: true })
  assert.equal(digits.read.holds, true)
  // a JSON number past 2^53 was rounded by the caller's parser before it arrived; the reply says it is not exact
  const rounded = (await mcpOf('crypto_shor', { n: 2 ** 61, a: 3 })) as WithRead
  assert.deepEqual(rounded.read.n, { how: 'number', exact: false, given: true })
  assert.equal(rounded.read.holds, false)
  // an exponent-form string is read through a double: exact under 2^53, inexact past it, and said so
  const small = (await mcpOf('crypto_shor', { n: '1e3', a: 7 })) as WithRead
  assert.equal(small.n, 1000)
  assert.deepEqual(small.read.n, { how: 'numeric', exact: true, given: true })
  const expo = (await mcpOf('crypto_shor', { n: '1e30', a: 7 })) as WithRead
  assert.equal(expo.n, '1000000000000000019884624838656')
  assert.deepEqual(expo.read.n, { how: 'numeric', exact: false, given: true })
  assert.equal(expo.holds, false)
  for (const name of ['crypto_cmodexp', 'crypto_iqft', 'crypto_shots', 'crypto_rsa']) {
    const view = (await mcpOf(name, { n: [15], a: 7 })) as { read: { n: Read; holds: boolean }; holds: boolean }
    assert.equal(view.read.n.how, 'default', name)
    assert.equal(view.holds, false, name)
  }
  // RING: a modulus of 1, 0 or below has no ring to ask; the classical block says so and holds nothing
  for (const bad of [1, 0, -91]) {
    const run = (await mcpOf('crypto_shor', { n: bad, a: 8 })) as WithRead
    assert.equal(run.classical.ring, false, `n ${bad}`)
    assert.equal(run.classical.unit, false, `n ${bad}`)
    assert.equal(run.classical.holds, false, `n ${bad}`)
    assert.equal(run.classical.agrees, false, `n ${bad}`)
    assert.equal(run.holds, false, `n ${bad}`)
  }
  const ninetyOneRing = (await mcpOf('crypto_shor', { n: 91, a: 8 })) as WithRead
  assert.equal(ninetyOneRing.classical.ring, true)
  assert.equal(ninetyOneRing.classical.unit, true)
  // EXACT FOR ANY WIDTH: the check is three modular powers, so a 30000-digit modulus answers at once, with no bound
  // hit and nothing left unfinished — `beyond` true is the answer that the order does not divide four
  const wide = (await mcpOf('crypto_shor', { n: '7'.repeat(30000), a: 2 })) as WithRead
  assert.equal(wide.classical.ring, true)
  assert.equal(wide.classical.unit, true)
  assert.equal(wide.classical.beyond, true)
  assert.equal(wide.classical.period, 0)
  assert.equal(wide.classical.resolvable, false)
  assert.equal(wide.classical.holds, true)
  assert.equal(wide.post.period, 0)
  assert.equal(wide.rsa.factored, false)
  assert.equal(JSON.stringify(wide).includes('iterated'), false)
  // the sibling views run on the same arguments
  const rsa = (await mcpOf('crypto_rsa', { n: 15, a: 7 })) as { modulus: number; p: number; q: number; factored: boolean; period: number; by: string }
  assert.equal(rsa.modulus, 15)
  assert.equal(rsa.p * rsa.q, 15)
  assert.equal(rsa.period, 4)
  assert.equal(rsa.by, 'period')
  const iqft = (await mcpOf('crypto_iqft', { n: 21, a: 2 })) as { post: { period: number }; holds: boolean }
  assert.equal(iqft.post.period, 0)
  assert.equal(iqft.holds, false)
  const cmodexp = (await mcpOf('crypto_cmodexp', { n: 3233, a: 7 })) as { circuitry: { qubits: number; work: number; dim: number; holds: boolean }; rsa: { modulus: number } }
  assert.equal(cmodexp.circuitry.qubits, 14)
  assert.equal(cmodexp.circuitry.work, 12)
  assert.equal(cmodexp.circuitry.dim, 16384)
  assert.equal(cmodexp.circuitry.holds, true)
  assert.equal(cmodexp.rsa.modulus, 3233)
  const shots = (await mcpOf('crypto_shots', { n: 91, a: 7 })) as { measure: { shots: number }; rsa: { factored: boolean } }
  assert.equal(shots.measure.shots, 8)
  assert.equal(shots.rsa.factored, true)
})
