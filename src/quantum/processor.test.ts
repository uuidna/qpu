import test from 'node:test'
import assert from 'node:assert/strict'
import { PROCESSORS, WILLOW, averageConnectivityOf, belowThresholdOf, couplersOf, fitsProcessor } from './processor.js'

test('Willow has 105 sites on the spec sheet grid, all distinct', () => {
  assert.equal(WILLOW.qubits, 105)
  assert.equal(new Set(WILLOW.sites.map(([r, c]) => `${r},${c}`)).size, 105)
})

test('the couplers of the grid give the sheet\'s average connectivity, 3.47, to two places', () => {
  assert.equal(WILLOW.couplers.length, 182)
  const average = averageConnectivityOf(WILLOW.sites, WILLOW.couplers)
  assert.equal(average.toFixed(2), WILLOW.statedAverageConnectivity.toFixed(2))
})

test('a coupler joins two sites next to each other along a row or a column and nothing else', () => {
  for (const [[r1, c1], [r2, c2]] of couplersOf(WILLOW.sites)) assert.ok((r1 === r2 && Math.abs(c1 - c2) === 1) || (c1 === c2 && Math.abs(r1 - r2) === 1))
})

test('the two chips carry the sheet\'s figures as stated', () => {
  const qec = WILLOW.chips.errorCorrection
  assert.deepEqual(qec.errorSuppression, { distances: [3, 5, 7], mean: 2.14, spread: 0.02 })
  assert.equal(qec.errorCorrectionCyclesPerSecond, 909000)
  assert.equal(qec.twoQubitGateError.gate, 'CZ')
  const rcs = WILLOW.chips.randomCircuitSampling
  assert.equal(rcs.circuitRepetitionsPerSecond, 63000)
  assert.deepEqual(rcs.application, { qubits: 103, depth: 40, xebFidelity: 0.001 })
  assert.equal(rcs.twoQubitGateError.gate, 'iSWAP-like')
})

test('magic state cultivation on Willow carries the figures the Google blog states', () => {
  assert.deepEqual(WILLOW.magicStateCultivation, { errorReductionFactor: 40, logicalFidelity: 0.9999, colorCodeDistance: 3, surfaceCodeDistance: 5 })
})

test('error correction is below threshold on Willow, since Λ is above 1', () => {
  assert.equal(belowThresholdOf(WILLOW), true)
})

test('a circuit fits a processor only up to its qubit count', () => {
  assert.equal(fitsProcessor(WILLOW, 105), true)
  assert.equal(fitsProcessor(WILLOW, 106), false)
  assert.ok(PROCESSORS.Willow === WILLOW)
})
