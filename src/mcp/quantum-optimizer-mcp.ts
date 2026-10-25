/**
 * Quantum Optimizer MCP - Solve quantum computing problems
 * Integrates quantum solver with optimization tools
 */

import { getAllProofs, getProofByID, QuantumProof } from '../quantum/quantum-solver.js'

/**
 * Solve a quantum problem
 */
export function solveQuantumProblem(problemId: string) {
  const proof = getProofByID(problemId)
  if (!proof) {
    return { error: `Problem ${problemId} not found` }
  }

  return {
    problemId: proof.id,
    problemName: proof.name,
    algorithm: proof.algorithm,
    solution: proof.solution,
    speedup: proof.complexity.speedup,
    qubitsRequired: proof.resources.qubits,
    status: proof.status,
    proven: proof.verification.proven,
    confidence: proof.verification.confidence
  }
}

/**
 * Find problems solvable with given resources
 */
export function findProblems(maxQubits: number, status?: string) {
  const proofs = getAllProofs()
  return proofs.filter((p: QuantumProof) => {
    const qubitMatch = p.resources.qubits <= maxQubits
    const statusMatch = !status || p.status === status
    return qubitMatch && statusMatch
  })
}

/**
 * Estimate resources needed for a problem
 */
export function estimateResources(problemId: string) {
  const proof = getProofByID(problemId)
  if (!proof) return null

  return {
    problemId: proof.id,
    qubitsNeeded: proof.resources.qubits,
    gateDepth: proof.resources.gates,
    estimatedTime: proof.resources.time,
    complexity: proof.complexity
  }
}

/**
 * Optimize problem solving (choose best algorithm)
 */
export function optimizeProblemSolving(problem: string) {
  const proofs = getAllProofs()
  const candidates = proofs.filter((p: QuantumProof) =>
    p.name.toLowerCase().includes(problem.toLowerCase()) ||
    p.algorithm.toLowerCase().includes(problem.toLowerCase())
  )

  if (candidates.length === 0) {
    return { error: 'No matching problems found' }
  }

  // Return the one with highest speedup
  return candidates.reduce((best: QuantumProof, current: QuantumProof) => {
    const bestSpeedup = parseInt(best.complexity.speedup.match(/\d+/)?.[0] || '0')
    const currentSpeedup = parseInt(current.complexity.speedup.match(/\d+/)?.[0] || '0')
    return currentSpeedup > bestSpeedup ? current : best
  })
}

/**
 * MCP Tool definitions for quantum optimization
 */
export const quantumOptimizerMCPTools = [
  {
    name: 'solve_quantum_problem',
    description: 'Solve a specific quantum computing problem',
    inputSchema: {
      type: 'object',
      properties: {
        problemId: {
          type: 'string',
          description: 'ID of problem (e.g., rsa-260, maxcut, tsp)'
        }
      },
      required: ['problemId']
    }
  },
  {
    name: 'find_solvable_problems',
    description: 'Find quantum problems solvable with given resources',
    inputSchema: {
      type: 'object',
      properties: {
        maxQubits: {
          type: 'number',
          description: 'Maximum available qubits'
        },
        status: {
          type: 'string',
          enum: ['solved', 'solving', 'open'],
          description: 'Filter by status'
        }
      },
      required: ['maxQubits']
    }
  },
  {
    name: 'estimate_resources',
    description: 'Estimate quantum resources needed for a problem',
    inputSchema: {
      type: 'object',
      properties: {
        problemId: {
          type: 'string',
          description: 'Problem ID'
        }
      },
      required: ['problemId']
    }
  },
  {
    name: 'optimize_problem_solving',
    description: 'Find best algorithm for solving a problem',
    inputSchema: {
      type: 'object',
      properties: {
        problem: {
          type: 'string',
          description: 'Problem name or algorithm'
        }
      },
      required: ['problem']
    }
  }
]

export default {
  solveQuantumProblem,
  findProblems,
  estimateResources,
  optimizeProblemSolving,
  quantumOptimizerMCPTools
}
