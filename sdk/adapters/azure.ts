/** Azure Quantum job shape → QPU native. Never calls Azure Workspace. */

import { nativeJobOf, type NativeGate } from '../../src/payload/plugins/native-adapters.js'

export class AzureQuantumQPU {
  async submit(gates: NativeGate[], shots = 500) {
    return nativeJobOf({
      vendor: 'azure',
      gates,
      shots,
      seal: true,
      pass: 0,
      mode: 5,
      who: 'other',
    })
  }
}

export default AzureQuantumQPU
