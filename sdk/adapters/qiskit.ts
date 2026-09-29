/** Qiskit Adapter - Always uses QPU payload, never bypasses */

import { tools } from '../../src/quantum/kernel/index'

export class QiskitQPU {
  async shorFactor(n: number) {
    return tools.qpu_shor(`${n}`)
  }

  async groverSearch(target: bigint, searchSpace: bigint) {
    return tools.qpu_grover_search(`${target}`, `${searchSpace}`)
  }

  async discreteLog(base: bigint, target: bigint, prime: bigint) {
    return tools.qpu_discrete_log(`${base}`, `${target}`, `${prime}`)
  }

  async knapsack(items: number[], capacity: number) {
    return tools.qpu_knapsack(JSON.stringify(items), `${capacity}`)
  }

  async runPhase(phase: 'phase1' | 'phase2' | 'phase3' | 'unified') {
    const phaseFn = tools[`qpu_${phase}` as keyof typeof tools] as () => any
    return phaseFn()
  }

  async benchmark() {
    return tools.qpu_benchmark()
  }

  toQiskitString(): string {
    return `QiskitQPU(backend='uuidna-qpu', device='quantum-kernel', powered_by='QPU-Payload')`
  }
}

export default QiskitQPU
