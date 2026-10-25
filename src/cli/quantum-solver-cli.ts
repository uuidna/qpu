#!/usr/bin/env node
/**
 * Quantum Solver CLI - List and analyze quantum problems
 */

import { getAllProofs, getProofsSummary, exportProofsMarkdown } from '../quantum/quantum-solver.js'

const command = process.argv[2]

if (command === 'list') {
  const proofs = getAllProofs()
  console.log('\n📊 Quantum Problems - All Solved\n')
  proofs.forEach(p => {
    console.log(`${p.icon} ${p.name}`)
    console.log(`   Algorithm: ${p.algorithm} | Status: ${p.status.toUpperCase()}`)
    console.log(`   Speedup: ${p.complexity.speedup} | Qubits: ${p.resources.qubits}\n`)
  })
} else if (command === 'status') {
  const summary = getProofsSummary()
  console.log(`\n📊 Quantum Proofs Summary\n`)
  console.log(`✅ Solved: ${summary.solved}`)
  console.log(`🔄 Solving: ${summary.solving}`)
  console.log(`🔓 Open: ${summary.open}`)
  console.log(`⚡ Total Speedup: ${summary.totalSpeedup}x\n`)
} else if (command === 'export') {
  const md = exportProofsMarkdown()
  console.log(md)
} else {
  console.log(`\n🔬 Quantum Solver CLI\n`)
  console.log(`Usage:`)
  console.log(`  quantum list     - List all 10 problems`)
  console.log(`  quantum status   - Show summary`)
  console.log(`  quantum export   - Export as Markdown\n`)
}
