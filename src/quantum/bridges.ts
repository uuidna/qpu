/** Cross-Domain Bridges - 1 connections */

// Bridge: finance ↔ ml
export const bridgefinanceToml = {
  shared: ['knapsack'],
  transfer: async (data) => {
    // Convert finance format to ml format
    return await solver.solve(data)
  }
}
