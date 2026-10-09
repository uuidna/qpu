/** IonQ-shaped client → QPU native. Computation stays on QPU; IonQ API is not called. */

import { nativeJobOf, type NativeGate } from '../../src/payload/plugins/native-adapters.js'

export interface IonQJob {
  id: string
  status: 'submitted' | 'processing' | 'completed' | 'failed'
  result: unknown
  created_at: string
}

export class IonQClient {
  constructor(private readonly _apiKey = '') {}

  async submitJob(gates: NativeGate[], shots = 100): Promise<IonQJob> {
    const run = await nativeJobOf({
      vendor: 'ionq',
      gates,
      shots,
      seal: true,
      pass: 0,
      mode: 5,
      who: 'other',
    })
    const foreign = (run as { foreign?: { id?: string; status?: string; result?: unknown } }).foreign
    return {
      id: foreign?.id ?? `qpu-ionq-${Date.now()}`,
      status: 'completed',
      result: foreign?.result ?? run,
      created_at: new Date().toISOString(),
    }
  }

  async getJob(jobId: string): Promise<IonQJob> {
    return {
      id: jobId,
      status: 'completed',
      result: { status: 'completed via QPU native adapter' },
      created_at: new Date().toISOString(),
    }
  }

  async cancelJob(jobId: string): Promise<{ id: string; cancelled: boolean }> {
    return { id: jobId, cancelled: true }
  }
}

export default IonQClient
