// ladder — THE GUIDE IS ITS TESTS. The learning ladder the unit serves (docs.ladder) is the guide a reader climbs. Each
// step's test is generated from the step itself, titled `ladder <step> — <concept>`, and asserts exactly what that step's
// Expect tells the reader to see, as relations over the unit's own served answer rather than copied numbers. A step with
// no assertion here fails as untested, and an assertion no step names fails as orphaned, so the guide and its tests
// cannot drift apart. The README's Reproduce column runs each one by name.
import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker from './index.js'

type Root = {
  docs: { ladder: { step: number; concept: string; theorem: string }[] }
  only: { ghz: boolean; entangle: boolean; product: boolean }
  circuit: {
    qubits: { n: number; dim: number }
    entangle: { kind: string; support: number[]; product: boolean; holds: boolean; plus: { product: boolean } }
  }
  shor: { n: number; a: number; coprime: boolean; factors: { p: number; q: number; product: number }; classical: { gcd: number; period: number; counting: number } }
  evidence: { fault: { distance: number; syndrome: string[]; logicalLtPhysical: boolean } }
}

const env = { QPU_HOST: 'qpu.uuidna.com' }
const rootOf = async (): Promise<Root> =>
  (await (await worker.fetch(new Request('https://qpu.uuidna.com/', { headers: { accept: 'application/json' } }), env)).json()) as Root
// the ladder names the tests; each test then asks the unit again inside itself, so its receipt holds the computation
const ladder = (await rootOf()).docs.ladder

const proofs: Record<string, (r: Root) => void> = {
  qubits: (r) => {
    const e = r.circuit.entangle
    assert.equal(e.kind, 'bell')
    assert.deepEqual(e.support.map((i) => i.toString(2).padStart(2, '0')), ['00', '11'], 'the outcomes are 00 and 11')
    assert.equal(e.holds, true, 'a00 = a11 = 1 and a01 = a10 = 0: equal integer amplitudes, so each outcome is exactly 1/2')
    assert.equal(r.circuit.qubits.dim, 2 ** r.circuit.qubits.n, 'exact: the state vector is all 2^n amplitudes')
  },
  entangle: (r) => {
    assert.equal(r.only.ghz, true)
    assert.equal(r.only.entangle, true)
    assert.equal(r.only.product, false, 'the served state is not a product')
    assert.equal(r.circuit.entangle.plus.product, true, 'and the product state served beside it is')
  },
  shor: (r) => {
    const { n, a, factors: { p, q, product }, classical: { gcd, period, counting } } = r.shor
    assert.equal(p * q, n, 'p · q = n')
    assert.equal(product, n)
    assert.ok(1 < p && p < n && 1 < q && q < n, 'both factors are proper')
    assert.equal(gcd, 1, 'a is coprime to n')
    let x = 1
    for (let i = 0; i < period; i++) x = (x * a) % n
    assert.equal(x, 1, 'a^period ≡ 1 mod n')
    assert.equal(2 ** counting % period, 0, 'the period divides 2^counting, so the counting register resolves it')
  },
  noise: (r) => {
    const f = r.evidence.fault
    assert.equal((f.distance - 1) / 2, 1, 'distance 2t + 1 with t = 1 corrects exactly one flip')
    assert.deepEqual(f.syndrome, ['cnot', 'cnot', 'toffoli'])
    assert.equal(f.logicalLtPhysical, true, 'logical < physical on this run')
  },
}

for (const l of ladder) {
  test(`ladder ${l.step} — ${l.concept}`, async () => {
    const prove = proofs[l.theorem]
    assert.ok(prove, `ladder step ${l.step} (theorem ${l.theorem}) has no test; the guide cannot outgrow its tests`)
    prove(await rootOf())
  })
}

test('every ladder test belongs to a served step', async () => {
  assert.deepEqual(Object.keys(proofs).sort(), (await rootOf()).docs.ladder.map((l) => l.theorem).sort())
})
