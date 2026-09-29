/** Cirq Adapter - Always uses QPU payload, never bypasses */

import { tools } from '../../src/quantum/kernel/index'

export class CirqQPU {
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

  async hamiltonianSimulation(coupling: number, time: number) {
    return tools.qpu_hamiltonian_sim(`${coupling}`, `${time}`)
  }

  async runPhase(phase: 'phase1' | 'phase2' | 'phase3' | 'unified') {
    const phaseFn = tools[`qpu_${phase}` as keyof typeof tools] as () => any
    return phaseFn()
  }

  async benchmark() {
    return tools.qpu_benchmark()
  }

  toCirqString(): string {
    return `CirqQPU(backend='uuidna-qpu', simulator='quantum-kernel-payload', device='QPU')`
  }
}

export default CirqQPU
