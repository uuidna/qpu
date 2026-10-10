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

test('strict quantum: Shor factors to exact integers, not a probability', () => {
  assert.deepEqual(QUANTUM.cryptography.shorFactor(91n), [7n, 13n], 'Shor(91) must be exactly [7, 13]')
  const f = QUANTUM.cryptography.shorFactor(91n)
  assert.ok(f.every((x) => typeof x === 'bigint'), 'factors are exact bigints, not floats')
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
