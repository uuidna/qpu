/** Unified Domain Interface - Cross-domain abstraction */

import { solver, Problem, Solution } from '../src/quantum/unified-solver'

/**
 * Single interface for all domains
 * Crypto, Drug Discovery, Finance, ML use same solver
 */
export class Domain {
  name: string

  constructor(name: string) {
    this.name = name
  }

  async shor(n: string | bigint): Promise<Solution> {
    return solver.solve({
      type: 'factor',
      params: { n: String(n) },
    })
  }

  async grover(target: bigint, space: bigint): Promise<Solution> {
    return solver.solve({
      type: 'search',
      params: { target: String(target), space: String(space) },
    })
  }

  async knapsack(items: number[], capacity: number): Promise<Solution> {
    return solver.solve({
      type: 'optimize',
      params: { items, capacity },
    })
  }

  async hamiltonian(coupling: number, time: number): Promise<Solution> {
    return solver.solve({
      type: 'simulate',
      params: { coupling, time },
    })
  }

  async graphColoring(vertices: number): Promise<Solution> {
    return solver.solve({
      type: 'cluster',
      params: { vertices },
    })
  }
}

// Domain instances
export const crypto = new Domain('Cryptography')
export const pharma = new Domain('Drug Discovery')
export const finance = new Domain('Finance')
export const ml = new Domain('Machine Learning')
