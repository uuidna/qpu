/**
 * Quantum Proofs MCP - Expose quantum solver to MCPs
 * Connects quantum-solver.ts to UI and CLI
 */

import { getAllProofs, getProofsSummary, exportProofsJSON, exportProofsMarkdown, QuantumProof } from '../quantum/quantum-solver.js'

/**
 * Generate dashboard data for UI
 */
export function generateQuantumProofDashboard() {
  const proofs = getAllProofs()
  const summary = getProofsSummary()

  return {
    summary: {
      total: summary.total,
      solved: summary.solved,
      solving: summary.solving,
      open: summary.open,
      totalSpeedup: summary.totalSpeedup
    },
    uiComponents: {
      timeline: {
        milestones: [
          {
            label: 'Current (2024)',
            year: 2024,
            achievements: ['Shor\'s Algorithm solved', 'VQE for molecular simulation']
          },
          {
            label: 'Near-term (2025-2026)',
            year: 2025,
            achievements: ['QAOA for optimization', 'Portfolio optimization']
          },
          {
            label: 'Medium-term (2027-2029)',
            year: 2027,
            achievements: ['RSA-896 factorization', 'Large TSP instances']
          },
          {
            label: 'Long-term (2030+)',
            year: 2030,
            achievements: ['RSA-2048 breaking', 'Universal quantum advantage']
          }
        ]
      }
    }
  }
}

/**
 * Generate all proofs for dashboard display
 */
export function generateAllQuantumProofs() {
  return getAllProofs().map((proof: QuantumProof) => ({
    problemId: proof.id,
    problemName: proof.name,
    algorithm: proof.algorithm,
    solution: proof.solution,
    complexity: {
      classical: proof.complexity.classical,
      quantum: proof.complexity.quantum,
      speedup: proof.complexity.speedup
    },
    verification: {
      proven: proof.verification.proven,
      confidence: proof.verification.confidence,
      details: proof.verification.details
    },
    resources: {
      qubitsNeeded: proof.resources.qubits,
      gateDepth: proof.resources.gates,
      estimatedTime: proof.resources.time
    },
    uiDisplay: {
      icon: proof.icon,
      badge: proof.status === 'solved'
        ? 'SOLVED'
        : proof.status === 'solving'
          ? 'SOLVING NOW'
          : 'OPEN'
    }
  }))
}

/**
 * Export proofs for external use (publication, sharing)
 */
export function exportProofsForPublication() {
  return {
    proofs: getAllProofs(),
    summary: getProofsSummary(),
    json: exportProofsJSON(),
    markdown: exportProofsMarkdown(),
    timestamp: new Date().toISOString()
  }
}

/**
 * Get quantum proof summary for reporting
 */
export function getQuantumProofSummary() {
  const summary = getProofsSummary()
  return {
    solved: summary.solved,
    inProgress: summary.solving,
    open: summary.open,
    totalSpeedup: summary.totalSpeedup,
    total: summary.total
  }
}

/**
 * MCP Tool definitions for Claude
 */
export const quantumProofsMCPTools = [
  {
    name: 'list_quantum_proofs',
    description: 'List all 10 quantum computing problems and their solutions',
    inputSchema: {
      type: 'object',
      properties: {
        filter: {
          type: 'string',
          enum: ['all', 'solved', 'solving', 'open'],
          description: 'Filter by status'
        }
      }
    }
  },
  {
    name: 'get_proof_summary',
    description: 'Get summary statistics of all quantum proofs',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'export_proofs',
    description: 'Export all proofs in JSON or Markdown format',
    inputSchema: {
      type: 'object',
      properties: {
        format: {
          type: 'string',
          enum: ['json', 'markdown'],
          description: 'Export format'
        }
      }
    }
  }
]

export default {
  generateQuantumProofDashboard,
  generateAllQuantumProofs,
  exportProofsForPublication,
  getQuantumProofSummary,
  quantumProofsMCPTools
}
