/** Braket-shaped calls → QPU native. Never calls AWS Braket; maps instructions → QPU gates. */

import { nativeJobOf } from '../../src/payload/plugins/native-adapters.js'

export class BraketQPU {
  deviceId = 'arn:qpu:uuidna:device/exact-amplitudes'

  /** device.run(circuit, shots=…) */
  async run(
    circuit: { instructions?: unknown[]; gates?: unknown[]; qubitCount?: number },
    shots = 100,
  ) {
    return nativeJobOf({
      vendor: 'braket',
      instructions: circuit.instructions ?? circuit.gates,
      shots,
      seal: true,
      pass: 0,
      mode: 5,
      who: 'other',
    })
  }

  toBraketString(): string {
    return `BraketQPU(device='uuidna-qpu', via='connector { vendor: braket }')`
  }
}

export default BraketQPU
