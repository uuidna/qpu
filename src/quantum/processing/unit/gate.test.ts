// gate — every string the unit serves walks through the prose honesty gate, so an overclaim is caught by its SHAPE,
// not by the name of the last one fixed. Two readings once said "This host is a quantum computer" beside an evidence
// block that said simulator; they were found by running this gate by hand over the served JSON. Now the suite runs it.
// The instrument is checked first: the gate must drain the known positives and pass the known negations, or a passing
// walk proves nothing. Then the vendored copy is compared with the upstream file when the sibling checkout is present.
import { test } from './receipted.js'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import worker, { qpuQuantumOf } from './index.js'
import { computes } from './gate.js'

const host = 'qpu.uuidna.com'
const env = { QPU_HOST: host }
const origin = `https://${host}`

const walk = (value: unknown, path: string, out: { path: string; text: string; hit: string }[]): void => {
  if (typeof value === 'string') {
    if (value.length >= 20 && !value.startsWith('http') && !value.startsWith('@layer')) {
      const r = computes(value)
      if (r.binary === 0) out.push({ path, text: value.slice(0, 120), hit: r.hit ?? '?' })
    }
  } else if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${path}[${i}]`, out))
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`, out)
}

const getOf = async (path: string) => (await worker.fetch(new Request(`${origin}${path}`, { headers: { accept: 'text/html' } }), env)).json()
const rpcOf = async (method: string, params: Record<string, unknown> = {}) =>
  (await worker.fetch(new Request(`${origin}/mcp`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) }), env)).json()

test('gate: the instrument drains the known overclaims and passes the bounded refusals before it judges anything', () => {
  qpuQuantumOf() // the receipt: this test computes the unit it is about to judge
  const positives = [
    'holds true. Possible only in quantum. This host is a quantum computer. Entangle. Interfere.',
    'holds true. Quantum computer. SWAP. Toffoli. Reset.',
    'we prove all seven',
    'this encryption is unbreakable',
  ]
  const negatives = [
    'holds true. Possible only in quantum. This host is a simulator, not a quantum computer. Entangle.',
    'holds true. Quantum circuit simulator. SWAP. Toffoli. Reset.',
    'measured, 0 of 7',
    'a counting register of two qubits resolves only a period that divides 4; every other run recovers nothing',
  ]
  for (const p of positives) assert.equal(computes(p).binary, 0, `should drain: ${p}`)
  for (const n of negatives) assert.equal(computes(n).binary, 1, `should pass: ${n}`)
})

test('gate: every string the unit serves passes the prose gate — root, lean, mcp catalog, tools/list, prove, server', async (t) => {
  const surfaces: Record<string, unknown> = {
    root: await getOf('/'),
    lean: await getOf('/quantum/processing/unit'),
    mcp: await getOf('/mcp'),
    server: await getOf('/server'),
    tools: await rpcOf('tools/list'),
    prove: await rpcOf('tools/call', { name: 'qpu_prove', arguments: {} }),
    shor: await rpcOf('tools/call', { name: 'crypto_shor', arguments: {} }),
  }
  const drained: { path: string; text: string; hit: string }[] = []
  let strings = 0
  const count = (value: unknown): void => {
    if (typeof value === 'string') strings += value.length >= 20 ? 1 : 0
    else if (Array.isArray(value)) value.forEach(count)
    else if (value && typeof value === 'object') Object.values(value).forEach(count)
  }
  for (const [name, value] of Object.entries(surfaces)) {
    count(value)
    walk(value, name, drained)
  }
  assert.equal(strings > 1000, true, `walked only ${strings} strings; the surfaces did not load`)
  assert.deepEqual(drained, [], `drained:\n${drained.map((d) => `  ${d.path}\n    hit=${d.hit}\n    "${d.text}"`).join('\n')}`)
  t.diagnostic(`gate walked ${strings} strings across ${Object.keys(surfaces).length} surfaces · 0 drained`)
})

test('gate: the vendored copy matches upstream when the sibling checkout is present', (t) => {
  qpuQuantumOf()
  const upstream = join(process.cwd(), '..', '..', 'ceccec', 'millennium-solutions', 'packages', 'uuidna', 'src', 'gate.ts')
  const local = readFileSync(join(process.cwd(), 'src', 'quantum', 'processing', 'unit', 'gate.ts'), 'utf8')
  const header = local.split('\n').findIndex((l) => l.startsWith('// upstream:'))
  assert.equal(header >= 0, true)
  const body = local.split('\n').slice(header + 1).join('\n')
  if (!existsSync(upstream)) {
    t.diagnostic('upstream checkout absent on this host; drift not checked here')
    return
  }
  assert.equal(body, readFileSync(upstream, 'utf8'), 'vendored gate.ts drifted from upstream; copy it again')
  t.diagnostic('vendored gate.ts is byte-identical to upstream')
})
