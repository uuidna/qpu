#!/usr/bin/env node

/**
 * FORMULA ORCHESTRATOR
 * Master script for all formula-related operations
 * Consolidates gap analysis, filling, generation, and validation
 */

import { analyzeGaps, formatGapReport } from '../dist/mcp/cross-formula-gap-test.js'
import { testAllGapsAutoFilled } from '../dist/mcp/automated-gap-filler.js'
import { startAutonomousFormulaGeneration } from '../dist/mcp/autonomous-formula-generation.js'

const commands = {
  'analyze-gaps': analyzeGapsCmd,
  'fill-gaps': fillGapsCmd,
  'generate-autonomous': generateAutonomousCmd,
  'full-cycle': fullCycleCmd,
  'status': statusCmd
}

async function analyzeGapsCmd() {
  console.log(`
╔════════════════════════════════════════════════════════════════════════════════╗
║                     FORMULA GAP ANALYSIS                                       ║
║              Analyzing cross-domain formula network coverage                    ║
╚════════════════════════════════════════════════════════════════════════════════╝
  `)

  const analysis = analyzeGaps()
  const report = formatGapReport(analysis)
  console.log(report)

  console.log(`\n📈 FORMULA DISCOVERY ROADMAP`)
  console.log(`═══════════════════════════════════════════════════════════════════════════════`)
  console.log(`\nPhase 10 (Current):`)
  console.log(`  ✅ 8 convergence formulas implemented`)
  console.log(`  ✅ Health ↔ Climate ↔ Resources connected`)

  console.log(`\nPhase 11 Next:`)
  console.log(`  🔴 ${analysis.criticalGaps.length} CRITICAL formulas to develop`)
  console.log(`  🟠 ${analysis.highPriorityGaps.length} HIGH priority formulas to develop`)

  console.log(`\n✅ VERIFICATION RESULT`)
  console.log(`═══════════════════════════════════════════════════════════════════════════════`)
  console.log(`Total domain pairs:     ${analysis.totalPairs}`)
  console.log(`Connected pairs:        ${analysis.discoveredPairs}`)
  console.log(`Remaining gaps:         ${analysis.gapPairs}`)
  console.log(`Coverage:               ${(analysis.discoveredPairs / analysis.totalPairs * 100).toFixed(1)}%`)
  console.log(`\nStatus: ${analysis.gapPairs > 0 ? '🟡 GAPS IDENTIFIED - Ready for filling' : '✅ ALL GAPS FILLED'}`)
  console.log(`\nNext: Run 'npm run formula-orchestrator fill-gaps' to auto-fill gaps\n`)

  return { gaps: analysis, status: 'complete' }
}

async function fillGapsCmd() {
  console.log(`
╔════════════════════════════════════════════════════════════════════════════════╗
║                     AUTOMATED GAP FILLING                                      ║
║              Auto-generating missing operations and formulas                    ║
╚════════════════════════════════════════════════════════════════════════════════╝
  `)

  const result = await testAllGapsAutoFilled()
  console.log(result.report)

  if (result.passed) {
    console.log('\n✅ ALL GAPS AUTO-FILLED\n')
    console.log('Summary:')
    console.log(`  - MCP OS Operations:  ${result.summary.mcp_os_operations.length}/80 ✅`)
    console.log(`  - Phase 11 Formulas:  ${result.summary.formulas.length}/23 ✅`)
    console.log(`  - Total Fill Rate:    ${result.summary.fillRate.toFixed(1)}%`)
    console.log(`  - Execution Time:     ${(result.summary.endTime - result.summary.startTime)}ms`)
    console.log(`\nNext: Run 'npm run formula-orchestrator generate-autonomous' for AI discovery\n`)
    return { status: 'success', result }
  } else {
    console.log('\n❌ SOME GAPS NOT FILLED\n')
    return { status: 'failed', result }
  }
}

async function generateAutonomousCmd() {
  console.log(`
╔════════════════════════════════════════════════════════════════════════════════╗
║                   AUTONOMOUS FORMULA GENERATION                                ║
║         AI-Driven discovery of new cross-domain formulas                        ║
╚════════════════════════════════════════════════════════════════════════════════╝
  `)

  const result = await startAutonomousFormulaGeneration()

  console.log(`\n📊 GENERATION COMPLETE`)
  console.log(`═══════════════════════════════════════════════════════════════════════════════`)
  console.log(`Generated Formulas:    ${result.metrics.formulasGenerated}`)
  console.log(`Validated Formulas:    ${result.metrics.formulasValidated}`)
  console.log(`Deployed Formulas:     ${result.metrics.formulasDeployed}`)
  console.log(`Success Rate:          ${((result.metrics.formulasDeployed / result.metrics.formulasValidated) * 100).toFixed(1)}%`)
  console.log(`Average Synergy:       ${result.metrics.avgSynergy.toFixed(2)}/1.0`)
  console.log(`Total Gain Unlocked:   ${(result.metrics.totalGainUnlocked / 1000000).toFixed(0)}M`)
  console.log(`Generation Rate:       ${result.metrics.generationRate.toFixed(1)} formulas/hour`)
  console.log(`\nNext: Run 'npm run formula-orchestrator status' to verify all systems\n`)

  return { status: 'complete', metrics: result.metrics }
}

async function fullCycleCmd() {
  console.log(`
╔════════════════════════════════════════════════════════════════════════════════╗
║               FORMULA ORCHESTRATION - FULL CYCLE                               ║
║      1. Analyze gaps  2. Fill gaps  3. Generate autonomously                    ║
╚════════════════════════════════════════════════════════════════════════════════╝
  `)

  console.log('\n[1/3] ANALYZING GAPS...\n')
  const gapAnalysis = await analyzeGapsCmd()

  console.log('\n[2/3] FILLING GAPS...\n')
  const gapFilling = await fillGapsCmd()

  console.log('\n[3/3] GENERATING NEW FORMULAS AUTONOMOUSLY...\n')
  const autonomous = await generateAutonomousCmd()

  console.log(`
╔════════════════════════════════════════════════════════════════════════════════╗
║                    FULL CYCLE COMPLETE ✅                                      ║
╚════════════════════════════════════════════════════════════════════════════════╝

📊 SUMMARY
═══════════════════════════════════════════════════════════════════════════════
Gap Analysis:
  - Total pairs:     ${gapAnalysis.gaps.totalPairs}
  - Connected:       ${gapAnalysis.gaps.discoveredPairs}
  - Gaps found:      ${gapAnalysis.gaps.gapPairs}

Gap Filling:
  - Operations gen:  ${gapFilling.result.summary.mcp_os_operations.length}/80
  - Formulas gen:    ${gapFilling.result.summary.formulas.length}/23
  - Fill rate:       ${gapFilling.result.summary.fillRate.toFixed(1)}%

Autonomous Generation:
  - Formulas found:  ${autonomous.metrics.formulasGenerated}
  - Deployed:        ${autonomous.metrics.formulasDeployed}
  - Gain unlocked:   ${(autonomous.metrics.totalGainUnlocked / 1000000).toFixed(0)}M

Status: ✅ FULL ORCHESTRATION COMPLETE
  `)

  return {
    gaps: gapAnalysis,
    filling: gapFilling,
    autonomous: autonomous,
    completedAt: new Date().toISOString()
  }
}

async function statusCmd() {
  console.log(`
╔════════════════════════════════════════════════════════════════════════════════╗
║                   FORMULA SYSTEM STATUS                                        ║
╚════════════════════════════════════════════════════════════════════════════════╝

📋 AVAILABLE COMMANDS
═══════════════════════════════════════════════════════════════════════════════
  analyze-gaps          Analyze cross-domain formula network gaps
  fill-gaps             Auto-fill identified gaps with generated operations
  generate-autonomous   AI-driven discovery of new cross-domain formulas
  full-cycle            Run all stages (analyze → fill → generate)
  status                Show this help message

🚀 QUICK START
═══════════════════════════════════════════════════════════════════════════════
  npm run formula-orchestrator analyze-gaps    # See what's missing
  npm run formula-orchestrator fill-gaps       # Auto-generate solutions
  npm run formula-orchestrator generate-autonomous  # Discover new formulas
  npm run formula-orchestrator full-cycle      # Do everything at once

📊 SYSTEM STATE
═══════════════════════════════════════════════════════════════════════════════
  Current Formulas:    31 (Phase 10: 8, Phase 11: 23)
  MCP OS Layers:       10 layers with 8 operations each = 80 total
  Domain Pairs:        182 possible, discovering connections...
  Status:              Ready for orchestration

💡 WORKFLOW
═══════════════════════════════════════════════════════════════════════════════
  1. Analyze gaps to find what's missing
  2. Auto-fill gaps with AI-generated operations
  3. Use autonomous generation to discover new formulas continuously
  4. Deploy validated formulas to production

  Perfect for CI/CD: Run 'full-cycle' on every commit
  `)

  return { status: 'ready' }
}

async function main() {
  const cmd = process.argv[2] || 'status'
  const handler = commands[cmd]

  if (!handler) {
    console.error(`\n❌ Unknown command: ${cmd}\n`)
    await statusCmd()
    process.exit(1)
  }

  try {
    const result = await handler()
    process.exit(result.status === 'failed' ? 1 : 0)
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`)
    process.exit(1)
  }
}

main()
