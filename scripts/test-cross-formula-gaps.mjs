#!/usr/bin/env node

import { analyzeGaps, formatGapReport } from '../dist/mcp/cross-formula-gap-test.js'

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

const criticalByType = {}
analysis.criticalGaps.forEach(g => {
  const type = `${g.from}-${g.to}`
  criticalByType[type] = (criticalByType[type] || 0) + 1
})

console.log(`\n🔴 CRITICAL GAPS DETAIL:`)
analysis.criticalGaps.forEach(g => {
  console.log(`  • ${g.from} ⟷ ${g.to}`)
  console.log(`    Why: ${g.reason}`)
})

console.log(`\n✅ VERIFICATION RESULT`)
console.log(`═══════════════════════════════════════════════════════════════════════════════`)
console.log(`Total domain pairs: ${analysis.totalPairs}`)
console.log(`Connected pairs: ${analysis.discoveredPairs}`)
console.log(`Remaining gaps: ${analysis.gapPairs}`)
console.log(`Coverage: ${(analysis.discoveredPairs / analysis.totalPairs * 100).toFixed(1)}%`)
console.log(`\nStatus: ${analysis.gapPairs > 0 ? '🟡 GAPS IDENTIFIED - Ready for Phase 11 development' : '✅ ALL GAPS FILLED'}`)

process.exit(0)
