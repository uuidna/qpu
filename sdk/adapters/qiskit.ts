/** Qiskit-shaped calls → QPU native (hex / server_submit / connector). Never bypasses QPU; never calls IBM. */

import {
  nativeJobOf,
  type NativeGate,
} from '../../src/payload/plugins/native-adapters.js'

export class QiskitQPU {
  backend = 'uuidna-qpu'

  /** backend.run(circuit, shots=…) */
  async run(
    circuit: { gates?: unknown[]; qasm?: string; qubits?: number },
    shots = 1024,
  ) {
    return nativeJobOf({
      vendor: 'qiskit',
      gates: circuit.gates,
      qasm: circuit.qasm,
      shots,
      seal: true,
      pass: 0,
      mode: 5,
      who: 'other',
    })
  }

  /** QuantumCircuit → QPU gates (h/cx/…) */
  async submitJob(gates: NativeGate[], shots = 1024) {
    return this.run({ gates }, shots)
  }

  toQiskitString(): string {
    return `QiskitQPU(backend='uuidna-qpu', device='exact-amplitudes', via='connector { vendor: qiskit }')`
  }
}

export default QiskitQPU
