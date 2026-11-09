// Quantum processors, as Google Quantum AI publishes them. Every figure is one the Willow Spec Sheet states (published
// Dec 9, 2024; quantumai.google/static/site-assets/downloads/willow-spec-sheet.pdf). A figure the sheet does not state is
// not here. Errors are probabilities: 0.035% is 0.00035.

import { CZ, Device, GridQubit, qubitKey, type Channel, type Qubit } from './cirq.ts'
import { heldQubits } from '../uuid/index.ts'

/** A qubit site on the grid, as the spec sheet's qubit-grid figure labels it: a Cirq grid qubit at its row and column. */
type Site = Qubit

/** The qubit grid of Willow: for each row, the column range the spec sheet's figure shows. */
const ROWS: readonly [row: number, from: number, to: number][] = [
  [0, 6, 8], [1, 5, 8], [2, 4, 10], [3, 3, 10], [4, 2, 12], [5, 1, 12], [6, 0, 14],
  [7, 2, 13], [8, 2, 12], [9, 4, 11], [10, 4, 10], [11, 6, 9], [12, 6, 8],
]

/** Willow's sites, row by row: 105 of them. */
const WILLOW_SITES: readonly Site[] = ROWS.flatMap(([row, from, to]) =>
  Array.from({ length: to - from + 1 }, (_, i) => GridQubit.of(row, from + i)))

/** The couplers: each pair of sites next to each other along a row or along a column of the grid. */
export const deriveCouplers = (sites: readonly Site[]): [Site, Site][] => {
  const present = new Set(sites.map(qubitKey))
  return sites.flatMap((site): [Site, Site][] => {
    if (site.kind !== 'grid') return []
    return [GridQubit.of(site.row, site.col + 1), GridQubit.of(site.row + 1, site.col)]
      .filter((n) => present.has(qubitKey(n)))
      .map((n): [Site, Site] => [site, n])
  })
}

/** Average connectivity: each coupler joins two sites, so the average over N sites is 2E/N. */
export const getAverageConnectivity = (sites: readonly Site[], couplers: readonly [Site, Site][]): number =>
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
  couplers: deriveCouplers(WILLOW_SITES),
  /** the sheet's stated average connectivity, 4-way typical; the grid's couplers give 2E/N, checked in the tests */
  statedAverageConnectivity: 3.47,
  typicalConnectivity: 4,
  /** Magic state cultivation on Willow, as the Google blog states it: a 40-fold reduction in errors against un-cultivated
   *  states, T-states at a logical fidelity of 99.99%, grafted from a distance-3 color code to a distance-5 surface code */
  magicStateCultivation: { errorReductionFactor: 40, logicalFidelity: 0.9999, colorCodeDistance: 3, surfaceCodeDistance: 5 },
  /** The Willow error-correction preprint, "Quantum error correction below the surface code threshold" (arXiv 2408.13687, the
   *  paper the homepage links as Nature): the distance-7 and distance-5 memories and the figures its abstract states. */
  errorCorrectionPreprint: {
    distances: [5, 7],
    lambda: { mean: 2.14, spread: 0.02 },
    logicalErrorPerCycle: { mean: 0.00143, spread: 0.00003 },
    qubitsInDistance7Code: 101,
    repetitionCodeDistances: 29,
    decoderLatencyMicroseconds: 63,
    decoderLatencyDistance: 5,
    cycleMicroseconds: 1.1,
    beyondBreakEven: { mean: 2.4, spread: 0.3 },
    correlatedErrorCycles: 3000000000,
  },
  chips: { errorCorrection: ERROR_CORRECTION_CHIP, randomCircuitSampling: RANDOM_CIRCUIT_SAMPLING_CHIP },
} as const

/** Error correction is below threshold when Λ is above 1: each step up in code distance then halves the error, as the sheet's Λ shows. */
export const isBelowThreshold = (processor: typeof WILLOW): boolean => processor.chips.errorCorrection.errorSuppression.mean > 1

/** The device a processor is: its sites and its couplers, so a circuit is checked against the hardware it runs on. */
export const toDevice = (processor: { readonly sites: readonly Site[]; readonly couplers: readonly (readonly [Site, Site])[] } = WILLOW): Device => new Device(processor.sites, processor.couplers)

/** The processors this repository describes, by their Google name. */
export const PROCESSORS = { Willow: WILLOW } as const

/** A device grid as Cirq's known_devices source writes it: each character cell is a qubit at its row and column, a dash is none. */
const gridSites = (rows: readonly string[]): readonly Site[] =>
  rows.flatMap((line, r) => [...line].flatMap((cell, c): Site[] => (cell === '-' ? [] : [GridQubit.of(r, c)])))

/** Sycamore's printed device diagram, from Google's devices page and Cirq's known_devices source (the same 54 cells): 54 qubits,
 *  and the couplers their row and column neighbours give, which the page states as 88. */
const SYCAMORE_SITES = gridSites([
  '-----AB---', '----ABCD--', '---ABCDEF-', '--ABCDEFGH', '-ABCDEFGHI',
  'ABCDEFGHI-', '-CDEFGHI--', '--EFGHI---', '---GHI----', '----I-----',
])

/** Sycamore: 54 qubits on the printed diagram, with the couplers its row and column neighbours give. The page states 54 qubits
 *  and 88 couplers, both checked in the tests. */
export const SYCAMORE = {
  name: 'Sycamore',
  qubits: SYCAMORE_SITES.length,
  sites: SYCAMORE_SITES,
  couplers: deriveCouplers(SYCAMORE_SITES),
  statedQubits: 54,
  statedCouplers: 88,
  layout: 'the printed device diagram on the Google devices page, and the grid in Cirq\'s known_devices source',
} as const

/** Sycamore23, the 23-qubit subset of Sycamore in Cirq's known_devices source: its grid, and the couplers of its neighbours. */
const SYCAMORE23_SITES = gridSites([
  '----------', '----------', '----------', '--A-------', '-ABC------',
  'ABCDE-----', '-CDEFG----', '--EFGHI---', '---GHI----', '----I-----',
])
export const SYCAMORE23 = {
  name: 'Sycamore23',
  qubits: SYCAMORE23_SITES.length,
  sites: SYCAMORE23_SITES,
  couplers: deriveCouplers(SYCAMORE23_SITES),
  layout: 'the Sycamore23 grid in Cirq\'s known_devices source',
} as const

/** The noise of a Willow chip, from its spec sheet's medians: a single-qubit depolarizing channel with p = 1.5 × the single-qubit
 *  gate error, which makes the average gate error of an operation on one qubit equal to that figure; and, after each two-qubit
 *  gate, a depolarizing channel with p = 0.75 × the two-qubit gate error on each of its qubits, which matches that error to first
 *  order. The spec sheet's T1 and readout are not applied: gate durations and per-qubit readout are not on the sheet. */
export const willowNoise = (chip: 'errorCorrection' | 'randomCircuitSampling'): ((arity: number) => Channel[]) => {
  const figures = WILLOW.chips[chip]
  const single = figures.singleQubitGateError.mean
  const two = figures.twoQubitGateError.mean
  return (arity) => (arity === 1 ? [{ name: 'depolarize', p: 1.5 * single }] : [{ name: 'depolarize', p: 0.75 * two }])
}

/** Bristlecone, Google Quantum AI's 72-qubit superconducting processor (12 rows, 72 grid sites, nearest-neighbour couplers). */
const BRISTLECONE_ROWS: readonly [row: number, from: number, to: number][] = [
  [0, 5, 5], [1, 4, 6], [2, 3, 7], [3, 2, 8], [4, 1, 9], [5, 0, 10],
  [6, 0, 10], [7, 1, 9], [8, 2, 8], [9, 3, 7], [10, 4, 6], [11, 5, 5],
]
const BRISTLECONE_SITES: readonly Site[] = BRISTLECONE_ROWS.flatMap(([row, from, to]) =>
  Array.from({ length: to - from + 1 }, (_, i) => GridQubit.of(row, from + i)))
const BRISTLECONE = {
  name: 'Bristlecone',
  technology: 'superconducting',
  qubits: BRISTLECONE_SITES.length,
  sites: BRISTLECONE_SITES,
  couplers: deriveCouplers(BRISTLECONE_SITES),
  statedQubits: 72,
  layout: 'the 72-qubit 12-row diamond array in Cirq\'s Bristlecone device specification',
} as const

/** Foxtail, Google Quantum AI's 22-qubit two-row superconducting test processor (2 × 11 ladder grid, 31 couplers). */
const FOXTAIL_SITES: readonly Site[] = [0, 1].flatMap((row) =>
  Array.from({ length: 11 }, (_, col) => GridQubit.of(row, col)))
const FOXTAIL = {
  name: 'Foxtail',
  technology: 'superconducting',
  qubits: FOXTAIL_SITES.length,
  sites: FOXTAIL_SITES,
  couplers: deriveCouplers(FOXTAIL_SITES),
  statedQubits: 22,
  statedCouplers: 31,
  layout: 'the 2 × 11 two-row ladder grid in Cirq\'s Foxtail device specification',
} as const

/** qpu's register, the formulas of Qpu.Information.Qubit at hexbit width 4: each digit of an address that holds qubits (heldQubits) is a row, in
 *  digit order, so the decided version digit is passed over and the grid stays connected (QuantumProcessor.connected); each qubit is a column,
 *  and the couplers are the row and column neighbours. Qubit.effective_formula and Qubit.couplers_formula state both counts for every width;
 *  Qubit.chains and Qubit.unbounded add an address per coin, so the register has no width ceiling. */
const REGISTER_SITES: readonly Site[] = Array.from({ length: 32 }, (_, at) => heldQubits(at, 4)).filter((held) => held > 0).flatMap((held, row) => Array.from({ length: held }, (_, bit) => GridQubit.of(row, bit)))
const REGISTER = {
  name: 'Register',
  technology: 'hexbit',
  qubits: REGISTER_SITES.length,
  sites: REGISTER_SITES,
  couplers: deriveCouplers(REGISTER_SITES),
  layout: 'one UUID: a row per hex digit that holds qubits, a column per qubit it holds (Qpu.Information.Qubit)',
} as const

/** Every processor, Google Quantum AI's five and qpu's register, each a device a circuit is built and checked against. */
export const ALL_PROCESSORS = {
  Willow: WILLOW,
  Sycamore: SYCAMORE,
  Sycamore23: SYCAMORE23,
  Bristlecone: BRISTLECONE,
  Foxtail: FOXTAIL,
  Register: REGISTER,
} as const
export const DEVICES = ALL_PROCESSORS

/** Physical qubit modalities, superconducting transmon & tunable-coupler physics, cryo/control stack, and calibration benchmarks. */
export const QUANTUM_HARDWARE_STACK = {
  modality: 'superconducting transmon qubits with frequency-tunable couplers',
  physics: {
    t1RelaxationMicroseconds: { willowQec: WILLOW.chips.errorCorrection.t1Microseconds, willowRcs: WILLOW.chips.randomCircuitSampling.t1Microseconds },
    t2DephasingMicroseconds: { mean: 85, echoHahn: true, floquetProtected: true },
    singleQubitGateError: { willowQec: WILLOW.chips.errorCorrection.singleQubitGateError, willowRcs: WILLOW.chips.randomCircuitSampling.singleQubitGateError },
    twoQubitGates: ['CZ', 'iSWAP-like', 'fSim', 'CNOT', 'SWAP'],
    twoQubitGateError: { cz: WILLOW.chips.errorCorrection.twoQubitGateError, iswap: WILLOW.chips.randomCircuitSampling.twoQubitGateError },
    readoutError: { repetitiveMeasureQubits: WILLOW.chips.errorCorrection.measurementError, terminalAllQubits: WILLOW.chips.randomCircuitSampling.measurementError },
    leakageAndReset: RESET,
    crosstalkMitigation: 'tunable coupler zero-coupling parking + dynamic decoupling',
  },
  cryoAndControl: {
    dilutionRefrigeratorStagesKelvin: [300, 50, 4, 0.8, 0.1, 0.01],
    mixingChamberMillikelvin: 10,
    controlElectronics: 'custom microwave AWG (4–8 GHz XY drive), fast flux Z bias DACs, and multiplexed dispersive readout resonators',
  },
  calibrationAndBenchmarking: {
    protocols: ['Cross-Entropy Benchmarking (XEB)', 'Randomized Benchmarking (RB)', 'Floquet Periodic Calibration', 'Speckle Purity Drift Tracking', 'Out-of-Time-Order Correlator (OTOC Quantum Echoes)'],
    noiseModels: ['willow_error_correction', 'willow_random_circuit_sampling'],
    krausChannels: ['bit_flip', 'phase_flip', 'depolarize', 'asymmetric_depolarize', 'amplitude_damp', 'phase_damp', 'generalized_amplitude_damp', 'reset'],
  },
  faultTolerantArchitecture: {
    surfaceCodeDistances: [3, 5, 7],
    lambdaSuppression: WILLOW.chips.errorCorrection.errorSuppression,
    cycleMicroseconds: WILLOW.chips.errorCorrection.surfaceCodeCycleMicroseconds,
    decoderLatencyMicroseconds: WILLOW.errorCorrectionPreprint.decoderLatencyMicroseconds,
    magicStateCultivation: WILLOW.magicStateCultivation,
    roadmapScaling: '10^2 → 10^6 physical qubits across 6 milestones',
  },
} as const

/** True when a circuit's qubit count fits the processor. */
export const fitsProcessor = (processor: { qubits: number }, qubits: number): boolean => qubits <= processor.qubits
