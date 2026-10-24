// Quantum Echoes, as Google describes it: run the operations forward, perturb one qubit, run them backward, and measure
// the result. Without a perturbation the echo returns to the start with certainty; a perturbation that reaches the
// measured qubits leaves the echo disturbed, which is the out-of-time-order correlator the protocol measures. Every gate
// backward run applies the adjoint of each forward operation, in reverse order: the true inverse for any unitary, gate powers
// included, so the echo returns with certainty when nothing perturbs it.

import { Circuit, Simulator, adjointOf, type Operation } from './cirq.js'
import { PROCESSORS } from './processor.js'

/** Google's Quantum Echoes result as its blog states it: the OTOC protocol run on the 105-qubit array of Willow, 13,000x
 *  faster than the fastest supercomputers, on molecules of 15 and 28 atoms. Figures as stated, none estimated here. */
export const QUANTUM_ECHOES = {
  processor: PROCESSORS.Willow.name,
  qubits: PROCESSORS.Willow.qubits,
  speedup: 13000,
  molecules: [15, 28],
  /** the experiment as Google's research blog states it: the figure's 65 qubits, the text's 103 for forward and backward
   *  evolution (both as stated), about 2 hours on Willow, 3.2 years per data point on Frontier, 10 person-years of classical red-teaming */
  experiment: {
    qubitsUsedInFigure: 65,
    qubitsStatedInText: 103,
    quantumRunHours: 2,
    frontierYearsPerDataPoint: 3.2,
    classicalRedTeamPersonYears: 10,
    classicalAlgorithms: 9,
    nmrDemonstrationBeyondClassical: false,
  },
  /** the OTOC protocol as the research blog lists it */
  protocol: [
    'the qubits start in a ground state, one prepared in |ψM>',
    'a forward evolution U, a random circuit of one- and two-qubit operations on a 2D grid, creates a chaotic state',
    'a one-qubit perturbation B is applied between the forward and backward evolutions',
    'the backward evolution U† is applied',
    'a one-qubit probe M is applied to the initially prepared qubit',
    'the steps repeat k times, and another qubit is then measured',
  ],
} as const

/** The echo circuit: forward operations, an optional perturbation, then the adjoint of each forward operation in reverse. */
export const echoCircuit = (forward: Operation[], perturbation?: Operation): Circuit => {
  const circuit = new Circuit()
  for (const op of forward) circuit.append(op)
  if (perturbation) circuit.append(perturbation)
  for (const op of [...forward].reverse()) circuit.append(op.kind === 'gate' ? { ...op, gate: adjointOf(op.gate) } : op)
  return circuit
}

/** The probability that every qubit of the echo returns to |0...0>. */
export const echoProbability = (forward: Operation[], perturbation?: Operation): number => {
  const { amplitudes } = new Simulator().simulate(echoCircuit(forward, perturbation))
  const [re, im] = amplitudes[0]!
  return re * re + im * im
}
