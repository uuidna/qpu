import test from 'node:test'
import assert from 'node:assert/strict'
import { PROCESSORS, WILLOW, fitsProcessor } from './processor.js'

test('Willow matches the figures Google states for it', () => {
  assert.equal(WILLOW.qubits, 105)
  assert.equal(WILLOW.technology, 'superconducting')
  assert.deepEqual(WILLOW.errorCorrectionGrids, [3, 5, 7])
  assert.equal(WILLOW.belowThreshold, true)
  assert.equal(WILLOW.randomCircuitSampling.classical, 'Frontier')
  assert.equal(WILLOW.averageConnectivity, 3.47)
})

test('a circuit fits a processor only up to its qubit count', () => {
  assert.equal(fitsProcessor(WILLOW, 105), true)
  assert.equal(fitsProcessor(WILLOW, 106), false)
  assert.ok(PROCESSORS.Willow === WILLOW)
})
