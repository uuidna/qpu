// Quantum processors, as Google Quantum AI describes them. Each figure is the one stated in Google's own publication, with
// its source beside it; a figure Google does not state is left out, not estimated.

/** Willow, Google's superconducting quantum processor (blog.google, "Quantum error correction below the surface code threshold"). */
export const WILLOW = {
  name: 'Willow',
  technology: 'superconducting',
  qubits: 105,
  /** the grids of encoded qubits on which error correction was shown to stay below threshold, each step halving the error */
  errorCorrectionGrids: [3, 5, 7],
  belowThreshold: true,
  /** random circuit sampling: under five minutes on Willow, 10^25 years on Frontier (the source writes the exponent as 1025) */
  randomCircuitSampling: { runtime: 'under five minutes', classical: 'Frontier', classicalYears: '10^25' },
  /** average connectivity, from the "Willow System Metrics" table in the same publication */
  averageConnectivity: 3.47,
} as const

/** The processors this repository describes, by their Google name. */
export const PROCESSORS = { Willow: WILLOW } as const

/** True when a circuit's qubit count fits the processor. */
export const fitsProcessor = (processor: { qubits: number }, qubits: number): boolean => qubits <= processor.qubits
