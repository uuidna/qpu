// Quantum Echoes, as Google describes it: run the operations forward, perturb one qubit, run them backward, and measure
// the result. Without a perturbation the echo returns to the start with certainty; a perturbation that reaches the
// measured qubits leaves the echo disturbed, which is the out-of-time-order correlator the protocol measures. Every gate
// backward run applies the adjoint of each forward operation, in reverse order: the true inverse for any unitary, gate powers
// included, so the echo returns with certainty when nothing perturbs it.

import { Circuit, Simulator, adjointGate, type Operation } from './cirq.ts'
import { PROCESSORS } from './processor.ts'
import { TABLES } from './tables-index.ts'

/** Google's Quantum Echoes result as its blog states it: the OTOC protocol run on the 105-qubit array of Willow, 13,000x
 *  faster than the fastest supercomputers, on molecules of 15 and 28 atoms. Figures as stated, none estimated here. */
export const QUANTUM_ECHOES = TABLES.QUANTUM_ECHOES

/** The echo circuit: forward operations, an optional perturbation, then the adjoint of each forward operation in reverse. */
export const echoCircuit = (forward: Operation[], perturbation?: Operation): Circuit => {
  const circuit = new Circuit()
  for (const op of forward) circuit.append(op)
  if (perturbation) circuit.append(perturbation)
  for (const op of [...forward].reverse()) circuit.append(op.kind === 'gate' ? { ...op, gate: adjointGate(op.gate) } : op)
  return circuit
}

/** The probability that every qubit of the echo returns to |0...0>. */
export const echoProbability = (forward: Operation[], perturbation?: Operation): number => {
  const { amplitudes } = new Simulator().simulate(echoCircuit(forward, perturbation))
  const [re, im] = amplitudes[0]!
  return re * re + im * im
}
