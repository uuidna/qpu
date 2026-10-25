/**
 * Unified Examples & Use Cases
 * All example implementations in one module
 */

import { quantumAlgorithms, mcpTools } from './constants.js'

// Quantum Examples
export const quantumExamples = {
  rsaFactorization: {
    name: 'RSA Factorization',
    algorithm: quantumAlgorithms.SHOR,
    input: { n: 260 },
    expected: 'Factors of 260-bit number'
  },
  maxCutOptimization: {
    name: 'MaxCut Optimization',
    algorithm: quantumAlgorithms.QAOA,
    input: { graph: '1000-node graph' },
    expected: '~1.15x approximation vs 0.88 classical'
  },
  portfolioOptimization: {
    name: 'Portfolio Optimization',
    algorithm: quantumAlgorithms.VQE,
    input: { assets: 100 },
    expected: 'Optimal allocation with constraints'
  },
  molecularSimulation: {
    name: 'Lithium Hydride',
    algorithm: quantumAlgorithms.VQE,
    input: { molecule: 'LiH' },
    expected: 'Ground state energy'
  },
  travelingSalesman: {
    name: 'TSP-500 Cities',
    algorithm: quantumAlgorithms.QAOA,
    input: { cities: 500 },
    expected: '100x speedup vs classical'
  }
}

// MCP Use Cases
export const mcpUseCases = {
  autoOptimization: {
    name: 'Automatic Quantum Problem Discovery',
    description: 'MCP finds and solves open problems',
    tools: [mcpTools[0]],
    example: 'npm run quantum:solve RSA-260'
  },
  proofGeneration: {
    name: 'Proof Generation & Verification',
    description: 'Automatic mathematical proof creation',
    tools: [mcpTools[1]],
    example: 'npm run quantum:proofs'
  },
  databaseAbstraction: {
    name: 'Multi-Provider Database Routing',
    description: 'Unified DB interface across Postgres/MySQL/Mongo',
    tools: [mcpTools[2]],
    example: 'db.query() auto-routes to optimal provider'
  },
  performanceMonitoring: {
    name: 'Live Performance Metrics',
    description: 'Real-time observability & alerting',
    tools: [mcpTools[3]],
    example: 'npm run perf:analyze'
  }
}

// Integration Patterns
export const integrationPatterns = {
  quantumWithBuild: {
    name: 'Build-Time Quantum Integration',
    steps: [
      'npm run build compiles quantum solver',
      'report:quantum surfaces proofs',
      'Dashboard displays all 10 problems'
    ]
  },
  mcpWithAutomation: {
    name: 'MCP-Driven Automation',
    steps: [
      'MCPs discover problems',
      'Quantum solver finds algorithms',
      'Results published to UI/CLI'
    ]
  },
  databaseReplication: {
    name: 'RAID-Like Replication',
    steps: [
      'Write to primary',
      'Async replicate to backups',
      'Automatic failover on primary failure'
    ]
  }
}
