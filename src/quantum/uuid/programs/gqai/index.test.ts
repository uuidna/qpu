// Google Quantum AI Challenge Implementation conformance tests: Lean witness matrix, operational functions, evidence policy, and Payload global routing.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  GQAI_CHALLENGES,
  GQAI_WITNESS_MATRIX,
  getGroverSize,
  getQaoaParams,
  getQftDepth,
  getQubitBasisLength,
  getSurfaceCorrectableErrors,
  getSurfacePhysicalQubits,
  gqaiAppsScript,
  gqaiChallengeMatrix,
  verifyCompilationMetrics,
} from './index.ts'
import { isSdkRequest, serveSdk } from '../sdk/index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: operationalized Lean-verified quantum functions match kernel formulas and verify compilation metrics with strict evidence policy. */
test('operationalized Lean-verified quantum functions match kernel formulas and verify compilation metrics with strict evidence policy', () => {
  assert.equal(getQubitBasisLength(10), 1024)
  assert.equal(getGroverSize(4), 256)
  assert.equal(getQftDepth(8), 15)
  assert.equal(getQaoaParams(6), 12)
  assert.equal(getSurfacePhysicalQubits(7), 85)
  assert.equal(getSurfaceCorrectableErrors(7), 3)

  const ok = verifyCompilationMetrics({ qubits: 8, distance: 7, rawDepth: 24, benchmark: 'fusion-invsqrt' })
  assert.equal(ok.isCompilationValid, true)
  assert.equal(ok.evidenceStatus, 'supported')
  assert.equal(ok.requiredPhysicalQubits, 85)
  assert.equal(ok.maxCorrectableErrors, 3)
  assert.equal(ok.minAllowedDepth, 15)
  assert.equal(ok.fitsWillowSingleLogical, true)
  assert.equal(ok.sealed, true)

  // depth below Lean-verified 2q - 1 lower bound is blocked
  const blockedDepth = verifyCompilationMetrics({ qubits: 8, distance: 7, rawDepth: 10 })
  assert.equal(blockedDepth.isCompilationValid, false)
  assert.equal(blockedDepth.evidenceStatus, 'blocked')

  // even distance is blocked
  const blockedDistance = verifyCompilationMetrics({ qubits: 8, distance: 6, rawDepth: 24 })
  assert.equal(blockedDistance.isCompilationValid, false)
  assert.equal(blockedDistance.evidenceStatus, 'blocked')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every Google Quantum AI witness theorem is Lean-kernel accepted and served through standard Payload global /api/globals/google. */
test('every Google Quantum AI witness theorem is Lean-kernel accepted and served through standard Payload global /api/globals/google', async () => {
  const matrix = gqaiChallengeMatrix()
  assert.equal(matrix.allWitnessesAccepted, true)
  assert.equal(matrix.witnesses.length, GQAI_WITNESS_MATRIX.length)
  assert.equal(matrix.challenges.length, GQAI_CHALLENGES.length)
  assert.equal(matrix.challenges.every((c) => c.witnessesAccepted && c.baseline.evidenceStatus === 'supported' && c.submissionStatus === 'unverified'), true)
  assert.equal(matrix.sealed, true)

  const script = gqaiAppsScript()
  assert.equal(script.sealed, true)
  assert.ok(script.code.includes('function verifyCompilationMetrics'))

  // standard Payload global routes (zero manual routes)
  const chalReq = new Request('https://qpu.uuidna.com/api/globals/google?view=challenges')
  assert.equal(isSdkRequest(chalReq), true)
  const chalRes = await serveSdk(chalReq)
  assert.equal(chalRes.status, 200)
  const chalJson = await chalRes.json() as Record<string, unknown>
  assert.equal(chalJson.phase, 'gqai-challenges')
  assert.equal(chalJson.allWitnessesAccepted, true)

  const scriptRes = await serveSdk(new Request('https://qpu.uuidna.com/api/globals/google?view=apps-script'))
  assert.equal(scriptRes.status, 200)
  const scriptJson = await scriptRes.json() as Record<string, unknown>
  assert.equal(scriptJson.phase, 'gqai-apps-script')

  const verifyRes = await serveSdk(new Request('https://qpu.uuidna.com/api/globals/google', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'verify-compilation', qubits: 10, distance: 7, rawDepth: 32, benchmark: 'dqi-reed-solomon' }),
  }))
  assert.equal(verifyRes.status, 200)
  const verified = await verifyRes.json() as Record<string, unknown>
  assert.equal(verified.phase, 'gqai-compilation')
  assert.equal(verified.evidenceStatus, 'supported')
  assert.equal(verified.sealed, true)
})
