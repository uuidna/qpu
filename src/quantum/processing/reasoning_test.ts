// Quantum-standard reasoning is grounded in Lean theorems the kernel accepts: the match/search path, deciding any quantum-standard statement,
// carries only a kernel-accepted theorem as its proof (verify, never assert), and a theorem the kernel has not accepted is surfaced as drift,
// never as a proof. Every quantum domain the QPU reasons about has such a theorem in the kernel index.
import test from 'node:test'
import assert from 'node:assert/strict'
import { call } from './mcp.ts'
import { THEOREMS } from './theorems-index.ts'

const kernel = new Set(THEOREMS.map((t) => t.key))
const search = (q: string) => (call('match', { search: q }) as { result: { structuredContent: { verdict: string; solved: boolean; proof: { theorem: string; kernelAccepted: boolean } | null; drift: boolean } } }).result.structuredContent

const QUANTUM_STATEMENTS = [
  'Shor factors 15', 'the surface code corrects a single error', 'Grover searches in sqrt N', 'QAOA max-cut on a triangle',
  'quantum teleportation carries the state', 'the QFT is the discrete Fourier transform', 'the Steane code encodes one logical qubit',
  'the Golay code is perfect', 'factor a 1000-bit integer', 'the clay register relation_28 holds',
]

/** ISO/IEC/IEEE 29119-3 test case. Identifier: quantum-standard reasoning carries only a kernel-accepted theorem as its proof, never asserts an unproven one. */
test('quantum-standard reasoning carries only a kernel-accepted theorem as its proof, never asserts an unproven one', () => {
  for (const q of QUANTUM_STATEMENTS) {
    const s = search(q)
    // verify, don't assert: any proof the decision carries names a theorem the kernel accepts, and is not drift
    if (s.proof) {
      assert.ok(kernel.has(s.proof.theorem), `${q}: proof ${s.proof.theorem} is not in the kernel index`)
      assert.equal(s.proof.kernelAccepted, true, `${q}: proof not marked kernel-accepted`)
      assert.equal(s.drift, false, `${q}: a kernel-accepted proof must not be flagged drift`)
    }
    // drift is exactly "a proof the kernel has not accepted" — a non-accepted match is a lead, never an asserted proof
    assert.equal(!!s.drift, !!(s.proof && !s.proof.kernelAccepted), `${q}: drift must equal (proof and not kernel-accepted)`)
  }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every quantum domain the QPU reasons about is backed by a kernel-accepted theorem. */
test('every quantum domain the QPU reasons about is backed by a kernel-accepted theorem', () => {
  const domains: Record<string, RegExp> = {
    shor: /shor/, qft: /qft|fourier|hadamard/, grover: /grover/, qaoa: /qaoa/, teleportation: /teleport|message/,
    surface: /surface|toric/, steane: /steane/, 'qec-codes': /hamming|golay|reed|bch|ldpc|color_code|concatenated|nine_code|css/,
    sigma: /sigma|reflection|involution/,
  }
  for (const [domain, re] of Object.entries(domains)) {
    assert.ok([...kernel].some((k) => re.test(k)), `no kernel-accepted theorem for the quantum domain ${domain}`)
  }
})
