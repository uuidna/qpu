// Quantum Echoes, as Google describes it: run the operations forward, perturb one qubit, run them backward, and measure
// the result. Without a perturbation the echo returns to the start with certainty; a perturbation that reaches the
// measured qubits leaves the echo disturbed, which is the out-of-time-order correlator the protocol measures. Every gate
// in the Cirq layer is its own inverse, so the backward run is the forward list reversed.

import { Circuit, Simulator, type Operation } from './cirq.js'

/** The echo circuit: forward operations, an optional perturbation, then the forward operations in reverse. */
export const echoCircuit = (forward: Operation[], perturbation?: Operation): Circuit => {
  const circuit = new Circuit()
  for (const op of forward) circuit.append(op)
  if (perturbation) circuit.append(perturbation)
  for (const op of [...forward].reverse()) circuit.append(op)
  return circuit
}

/** The probability that every qubit of the echo returns to |0...0>. */
export const echoProbability = (forward: Operation[], perturbation?: Operation): number => {
  const { amplitudes } = new Simulator().simulate(echoCircuit(forward, perturbation))
  const [re, im] = amplitudes[0]!
  return re * re + im * im
}
