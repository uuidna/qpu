/** PennyLane-shaped calls → QPU native. Never calls PennyLane Lightning; maps gates → QPU. */

import { nativeJobOf, type NativeGate } from '../../src/payload/plugins/native-adapters.js'

export class PennyLaneQPU {
  device = 'uuidna-qpu.exact'

  /** qml.device run / qnode shots */
  async run(gates: NativeGate[], shots = 1000) {
    return nativeJobOf({
      vendor: 'pennylane',
      gates,
      shots,
      seal: true,
      pass: 0,
      mode: 5,
      who: 'other',
    })
  }

  toPennyLaneString(): string {
    return `PennyLaneQPU(device='uuidna-qpu', via='connector { vendor: pennylane }')`
  }
}

export default PennyLaneQPU
