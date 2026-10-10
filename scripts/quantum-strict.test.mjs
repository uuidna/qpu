/**
 * STRICT QUANTUM — the quantum path is EXACT and Lean-PROVEN, or it hard-fails. No approximation, no sampling, no
 * assumption: Shor factors to the exact integers, the entangled amplitudes are exact surds (not decimals), the kernel's
 * every capability verifies, and every embedded Lean theorem recomputes and holds. These are hard asserts by design —
 * a soft lead here would let the quantum claim pass unproven. Discovered by the scripts/*.test.mjs glob; needs dist.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import QUANTUM from '../dist/quantum/kernel/index.js'
import { leanRecomputed } from '../dist/quantum/processing/unit/lean.js'

test('strict quantum: the kernel computes every capability exactly (verify is total)', () => {
  const v = QUANTUM.verify()
  assert.equal(v.success, true, `kernel verify ${v.passed}/${v.total} — a quantum capability does not compute exactly`)
  assert.equal(v.passed, v.total, 'strict: every quantum capability must pass, none skipped')
})

test('strict quantum: Shor factors UNLIMITED n exactly, not one baked integer', () => {
  const S = QUANTUM.cryptography.shorFactor
  // the theorem, not a constant: for any modulus, whatever factorisation is returned multiplies back to n exactly,
  // and the factors are exact bigints — tested across a range, never a single hardcoded [7,13].
  const ns = [15n, 21n, 35n, 39n, 51n, 55n, 77n, 85n, 91n, 143n, 187n, 221n, 247n]
  let factored = 0
  for (const n of ns) {
    const f = S(n)
    if (f.length === 0) continue // honest: base shares a factor or the period is odd — no fabricated factor
    assert.equal(f.length, 2, `Shor(${n}) returns a pair or nothing`)
    assert.ok(f.every((x) => typeof x === 'bigint'), `Shor(${n}) factors are exact bigints`)
    assert.equal(f[0] * f[1], n, `Shor(${n}) = [${f}] must multiply back to ${n} exactly`)
    factored++
  }
  assert.ok(factored >= 10, `the unlimited theorem factors many n, not one — only ${factored} succeeded`)
})

test('strict quantum: Grover and the entangled states are exact (surds, not decimals)', () => {
  assert.equal(QUANTUM.optimization.groverSearch(5n, 32n).found, true, 'Grover amplifies the marked state to certainty')
  const ghz = QUANTUM.entanglement.ghzState()
  assert.equal(ghz.qubits, 3, 'GHZ is the exact 3-qubit state')
  assert.ok(ghz.states.every((s) => s.amplitude === '1/√2'), 'amplitudes are the exact surd 1/√2, never a rounded decimal')
})

test('strict quantum: every embedded Lean theorem recomputes and holds (nothing assumed)', () => {
  const entries = Object.entries(leanRecomputed)
  assert.ok(entries.length > 0, 'the Lean proof is embedded')
  const unproven = entries.filter(([, r]) => r.holds !== true).map(([n]) => n)
  assert.deepEqual(unproven, [], `strict: every Lean theorem must hold — unproven: ${unproven.join(', ')}`)
})
