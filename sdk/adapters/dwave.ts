/** D-Wave sampler shape → QPU native (gatecount / exact computer). Never calls D-Wave Leap. */

import { nativeJobOf, type NativeGate } from '../../src/payload/plugins/native-adapters.js'

export class DWaveQPU {
  /** sampler.sample_ising-shaped: map to QPU gates + shots as num_reads */
  async sample(gates: NativeGate[], numReads = 100) {
    return nativeJobOf({
      vendor: 'dwave',
      gates,
      shots: numReads,
      seal: true,
      pass: 0,
      mode: 5,
      who: 'other',
    })
  }

  toDWaveString(): string {
    return `DWaveQPU(sampler='uuidna-qpu', via='connector { vendor: dwave }')`
  }
}

export default DWaveQPU
