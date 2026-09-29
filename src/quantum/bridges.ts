/** Cross-Domain Bridges - 1 connections */

import { solver } from './unified-solver.js'

// Bridge: finance ↔ ml
export const bridgefinanceToml = {
  shared: ['knapsack'],
  transfer: async (data: any) => {
    return await solver.solve(data)
  }
}
