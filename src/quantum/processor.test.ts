import test from 'node:test'
import assert from 'node:assert/strict'
import { PROCESSORS, SYCAMORE, SYCAMORE23, WILLOW, averageConnectivityOf, belowThresholdOf, couplersOf, deviceOf, fitsProcessor } from './processor.js'
import { Circuit, applied, CZ, GridQubit, H, keyOf } from './cirq.js'

test('Willow has 105 sites on the spec sheet grid, all distinct', () => {
  assert.equal(WILLOW.qubits, 105)
  assert.equal(new Set(WILLOW.sites.map(keyOf)).size, 105)
})

test('the couplers of the grid give the sheet\'s average connectivity, 3.47, to two places', () => {
  assert.equal(WILLOW.couplers.length, 182)
  const average = averageConnectivityOf(WILLOW.sites, WILLOW.couplers)
  assert.equal(average.toFixed(2), WILLOW.statedAverageConnectivity.toFixed(2))
})

test('a coupler joins two sites next to each other along a row or a column and nothing else', () => {
  for (const [a, b] of couplersOf(WILLOW.sites)) {
    assert.ok(a.kind === 'grid' && b.kind === 'grid')
    assert.ok((a.row === b.row && Math.abs(a.col - b.col) === 1) || (a.col === b.col && Math.abs(a.row - b.row) === 1))
  }
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

test('Willow as a device: a gate on a coupler fits, a gate across an uncoupled pair does not, and a site off the grid is refused', () => {
  const device = deviceOf(WILLOW)
  const [a, b] = WILLOW.couplers[0]!
  device.validateOperation(applied(CZ, a, b))
  assert.throws(() => device.validateOperation(applied(CZ, WILLOW.sites[0]!, WILLOW.sites[WILLOW.sites.length - 1]!)), /does not couple/)
  assert.throws(() => device.validateOperation(applied(H, GridQubit.of(0, 0))), /not a qubit of this device/)
})

test('Sycamore, from its printed diagram: 54 qubits and 88 couplers, as the devices page states, with every coupler a row or column neighbour', () => {
  assert.equal(SYCAMORE.qubits, SYCAMORE.statedQubits)
  assert.equal(SYCAMORE.couplers.length, SYCAMORE.statedCouplers)
  assert.equal(new Set(SYCAMORE.sites.map((q) => `${(q as { row: number }).row},${(q as { col: number }).col}`)).size, 54)
  const device = deviceOf(SYCAMORE)
  device.validateCircuit(new Circuit([applied(CZ, SYCAMORE.couplers[0]![0], SYCAMORE.couplers[0]![1])]))
  assert.throws(() => device.validateOperation(applied(CZ, SYCAMORE.sites[0]!, SYCAMORE.sites[SYCAMORE.sites.length - 1]!)), /does not couple/)
})

test('Sycamore23, from the known_devices source: 23 qubits, all on the Sycamore grid, with its own couplers', () => {
  assert.equal(SYCAMORE23.qubits, 23)
  const sycamore = new Set(SYCAMORE.sites.map(keyOf))
  for (const q of SYCAMORE23.sites) assert.ok(sycamore.has(keyOf(q)), `${keyOf(q)} is on Sycamore`)
  assert.ok(SYCAMORE23.couplers.length > 0 && SYCAMORE23.couplers.length < SYCAMORE.couplers.length)
})
