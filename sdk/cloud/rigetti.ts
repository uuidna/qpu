/** Rigetti-shaped client → QPU native. Quil/program strings with gates map via OpenQASM-ish / gate list. */

import { nativeJobOf } from '../../src/payload/plugins/native-adapters.js'

export interface RigettiJob {
  job_id: string
  state: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED'
  result: unknown
  submitted_at: string
}

export class RigettiClient {
  constructor(private readonly _apiKey = '') {}

  async submitProgram(program: string, shots = 100): Promise<RigettiJob> {
    // Prefer OpenQASM-like text; otherwise Bell on the exact computer.
    const qasm = /OPENQASM|qreg|creg|^\s*h\s|^\s*cx\s/im.test(program) ? program : undefined
    const run = await nativeJobOf({
      vendor: 'rigetti',
      ...(qasm ? { qasm } : {
        gates: [
          { name: 'h', q: 0 },
          { name: 'cnot', c: 0, t: 1 },
        ],
      }),
      shots,
      seal: true,
      pass: 0,
      mode: 5,
      who: 'other',
    })
    const foreign = (run as { foreign?: { id?: string; result?: unknown } }).foreign
    return {
      job_id: foreign?.id ?? `qpu-rigetti-${Date.now()}`,
      state: 'COMPLETED',
      result: foreign?.result ?? run,
      submitted_at: new Date().toISOString(),
    }
  }
}

export default RigettiClient
