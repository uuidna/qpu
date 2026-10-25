#!/usr/bin/env node

/**
 * MCP List - Show all available MCPs
 */

const mcps = {
  'quantum-proofs': {
    description: 'List and export all 10 quantum computing problems with solutions',
    tools: ['list_quantum_proofs', 'get_proof_summary', 'export_proofs'],
    enabled: true
  },
  'quantum-optimizer': {
    description: 'Solve quantum problems and optimize algorithm selection',
    tools: ['solve_quantum_problem', 'find_solvable_problems', 'estimate_resources', 'optimize_problem_solving'],
    enabled: true
  },
  'database-abstraction': {
    description: 'Unified database interface across providers (Postgres, MySQL, MongoDB)',
    tools: ['query', 'execute', 'migrate', 'replicate'],
    enabled: true
  },
  'performance-monitoring': {
    description: 'Real-time performance metrics and monitoring',
    tools: ['record_metric', 'get_metrics', 'analyze_performance', 'set_alert'],
    enabled: true
  },
  'automation': {
    description: 'Automate deployment, testing, and optimization',
    tools: ['deploy', 'test', 'optimize', 'rollback'],
    enabled: true
  }
}

console.log('\n📡 Available MCP Servers\n')
console.log('┌─────────────────────────────────────────────────────────┐')

Object.entries(mcps).forEach(([name, mcp]) => {
  const status = mcp.enabled ? '✅' : '⏸️'
  console.log(`│ ${status} ${name}`)
  console.log(`│    ${mcp.description}`)
  console.log(`│    Tools: ${mcp.tools.join(', ')}`)
  console.log(`│`)
})

console.log('└─────────────────────────────────────────────────────────┘')
console.log(`\nTotal MCPs: ${Object.keys(mcps).length}`)
console.log(`Enabled: ${Object.values(mcps).filter(m => m.enabled).length}`)
console.log(`\nRun: npm run mcp:start → Start all MCPs`)
console.log('     npm run mcp:test  → Test MCP connectivity\n')
