// Quantum processors, as Google Quantum AI publishes them. Every figure is one the Willow Spec Sheet states (published
// Dec 9, 2024; quantumai.google/static/site-assets/downloads/willow-spec-sheet.pdf). A figure the sheet does not state is
// not here. Errors are probabilities: 0.035% is 0.00035.

import { CZ, Device, GridQubit, keyOf, type Qubit } from './cirq.js'

/** A qubit site on the grid, as the spec sheet's qubit-grid figure labels it: a Cirq grid qubit at its row and column. */
export type Site = Qubit

/** The qubit grid of Willow: for each row, the column range the spec sheet's figure shows. */
const ROWS: readonly [row: number, from: number, to: number][] = [
  [0, 6, 8], [1, 5, 8], [2, 4, 10], [3, 3, 10], [4, 2, 12], [5, 1, 12], [6, 0, 14],
  [7, 2, 13], [8, 2, 12], [9, 4, 11], [10, 4, 10], [11, 6, 9], [12, 6, 8],
]

/** Willow's sites, row by row: 105 of them. */
export const WILLOW_SITES: readonly Site[] = ROWS.flatMap(([row, from, to]) =>
  Array.from({ length: to - from + 1 }, (_, i) => GridQubit.of(row, from + i)))

/** The couplers: each pair of sites next to each other along a row or along a column of the grid. */
export const couplersOf = (sites: readonly Site[]): [Site, Site][] => {
  const present = new Set(sites.map(keyOf))
  return sites.flatMap((site): [Site, Site][] => {
    if (site.kind !== 'grid') return []
    return [GridQubit.of(site.row, site.col + 1), GridQubit.of(site.row + 1, site.col)]
      .filter((n) => present.has(keyOf(n)))
      .map((n): [Site, Site] => [site, n])
  })
}

/** Average connectivity: each coupler joins two sites, so the average over N sites is 2E/N. */
export const averageConnectivityOf = (sites: readonly Site[], couplers: readonly [Site, Site][]): number =>
  (2 * couplers.length) / sites.length

/** The errors and coherence common to both chips' reset options, as the spec sheet lists them. */
const RESET = ['multi-level reset (|1> and above)', 'leakage removal (|2> only)'] as const

/** Chip 1: the quantum error correction chip. */
const ERROR_CORRECTION_CHIP = {
  singleQubitGateError: { mean: 0.00035, spread: 0.00029 },
  twoQubitGateError: { gate: CZ.name, mean: 0.0033, spread: 0.0018 },
  measurementError: { mean: 0.0077, spread: 0.0021, scope: 'repetitive, measure qubits' },
  t1Microseconds: { mean: 68, spread: 13 },
  reset: RESET,
  errorCorrectionCyclesPerSecond: 909000,
  surfaceCodeCycleMicroseconds: 1.1,
  /** Λ for code distances 3, 5 and 7: the error suppression factor, as the sheet states it (Λ3,5,7 = 2.14 ± 0.02) */
  errorSuppression: { distances: [3, 5, 7], mean: 2.14, spread: 0.02 },
} as const

/** Chip 2: the random circuit sampling chip. */
const RANDOM_CIRCUIT_SAMPLING_CHIP = {
  singleQubitGateError: { mean: 0.00036, spread: 0.00013 },
  twoQubitGateError: { gate: 'iSWAP-like', mean: 0.0014, spread: 0.00052 },
  measurementError: { mean: 0.0067, spread: 0.0051, scope: 'terminal, all qubits' },
  t1Microseconds: { mean: 98, spread: 32 },
  reset: RESET,
  circuitRepetitionsPerSecond: 63000,
  application: { qubits: 103, depth: 40, xebFidelity: 0.001 },
  comparison: { onWillow: '5 minutes', onClassicalSupercomputer: '10^25 years' },
} as const

/** Willow: 105 superconducting qubits on the grid above, with the two chips the spec sheet gives. */
export const WILLOW = {
  name: 'Willow',
  technology: 'superconducting',
  qubits: WILLOW_SITES.length,
  sites: WILLOW_SITES,
  couplers: couplersOf(WILLOW_SITES),
  /** the sheet's stated average connectivity, 4-way typical; the grid's couplers give 2E/N, checked in the tests */
  statedAverageConnectivity: 3.47,
  typicalConnectivity: 4,
  /** Magic state cultivation on Willow, as the Google blog states it: a 40-fold reduction in errors against un-cultivated
   *  states, T-states at a logical fidelity of 99.99%, grafted from a distance-3 color code to a distance-5 surface code */
  magicStateCultivation: { errorReductionFactor: 40, logicalFidelity: 0.9999, colorCodeDistance: 3, surfaceCodeDistance: 5 },
  chips: { errorCorrection: ERROR_CORRECTION_CHIP, randomCircuitSampling: RANDOM_CIRCUIT_SAMPLING_CHIP },
} as const

/** Error correction is below threshold when Λ is above 1: each step up in code distance then halves the error, as the sheet's Λ shows. */
export const belowThresholdOf = (processor: typeof WILLOW): boolean => processor.chips.errorCorrection.errorSuppression.mean > 1

/** The device a processor is: its sites and its couplers, so a circuit is checked against the hardware it runs on. */
export const deviceOf = (processor: typeof WILLOW = WILLOW): Device => new Device(processor.sites, processor.couplers)

/** The processors this repository describes, by their Google name. */
export const PROCESSORS = { Willow: WILLOW } as const

/** True when a circuit's qubit count fits the processor. */
export const fitsProcessor = (processor: { qubits: number }, qubits: number): boolean => qubits <= processor.qubits
