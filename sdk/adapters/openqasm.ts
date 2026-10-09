/** OpenQASM 2.0 text → QPU native gates via nativeQasmOf. */

import { nativeJobOf } from '../../src/payload/plugins/native-adapters.js'

export class OpenQasmQPU {
  async run(qasm: string, shots = 1024) {
    return nativeJobOf({
      vendor: 'openqasm',
      qasm,
      shots,
      seal: true,
      pass: 0,
      mode: 5,
      who: 'other',
    })
  }
}

export default OpenQasmQPU
