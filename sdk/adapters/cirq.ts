/** Cirq-shaped calls → QPU native (hex / server_submit / connector). Never bypasses QPU; never calls Google. */

import {
  nativeJobOf,
  type NativeGate,
} from '../../src/payload/plugins/native-adapters.js'

export class CirqQPU {
  simulator = 'uuidna-qpu'

  /** cirq.Simulator().run(circuit, repetitions=…) */
  async run(gates: NativeGate[], repetitions = 100) {
    return nativeJobOf({
      vendor: 'cirq',
      gates,
      shots: repetitions,
      seal: true,
      pass: 0,
      mode: 5,
      who: 'other',
    })
  }

  async hamiltonianSimulation(coupling: number, time: number) {
    // Exact computer has no continuous hamiltonian — map depth as gatecount reading via shots params.
    return nativeJobOf({
      vendor: 'cirq',
      gates: [
        { name: 'h', q: 0 },
        { name: 'cnot', c: 0, t: 1 },
      ],
      shots: Math.max(0, Math.floor(Math.abs(coupling * time))),
      seal: true,
      pass: 0,
    })
  }

  toCirqString(): string {
    return `CirqQPU(backend='uuidna-qpu', simulator='exact-amplitudes', via='connector { vendor: cirq }')`
  }
}

export default CirqQPU
