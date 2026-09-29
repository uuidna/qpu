/**
 * Phase 13 Deep Reflexivity Demo
 * Demonstrates wisdom in action
 */

import Phase13Orchestrator from '../phases/phase-13-unified-orchestration.js'

export async function demoPhase13(): Promise<void> {
  console.log('\n' + '='.repeat(70))
  console.log('PHASE 13: DEEP REFLEXIVITY & VALUE ALIGNMENT')
  console.log('='.repeat(70) + '\n')

  const orchestrator = new Phase13Orchestrator()
  await orchestrator.initialize()

  // Scenario 1: Value-aligned decision
  console.log('📋 SCENARIO 1: Optimizing for Cost vs Safety\n')

  const decision1 = await orchestrator.processDecisionWithReflexivity(
    'Reduce server redundancy to save 30% cost',
    'Redundancy is expensive and current load is low',
    0.75,
    { riskLevel: 'medium', deadline: 'next-quarter', auditRequired: true }
  )

  console.log(`Decision: ${decision1.decision.description}`)
  console.log(`  Confidence: ${(decision1.decision.confidence * 100).toFixed(0)}%`)
  console.log(`  Value Alignment: ${decision1.valueAlignment.overallAlignment.toFixed(0)}%`)
  console.log(`  Aligned Values: ${decision1.valueAlignment.alignedValues.join(', ')}`)
  if (decision1.valueAlignment.violatedValues.length > 0) {
    console.log(`  ⚠️  Violated Values: ${decision1.valueAlignment.violatedValues.join(', ')}`)
  }
  console.log(`  Wisdom Score: ${decision1.overallWisdomScore.toFixed(0)}/100`)
  console.log(`  Recommendation: ${decision1.recommendation.toUpperCase()}`)

  if (decision1.recommendation === 'ask-human') {
    console.log(`\n🤔 System asking: ${decision1.dialogue}`)
  }

  // Scenario 2: High uncertainty decision
  console.log('\n📋 SCENARIO 2: Novel Optimization (High Uncertainty)\n')

  const decision2 = await orchestrator.processDecisionWithReflexivity(
    'Apply machine learning to predict user behavior',
    'ML model trained on recent data shows 85% accuracy',
    0.65,
    { riskLevel: 'high', deadline: 'urgent', novel: true }
  )

  console.log(`Decision: ${decision2.decision.description}`)
  console.log(`  Confidence: ${(decision2.decision.confidence * 100).toFixed(0)}%`)
  console.log(`  Uncertainty Factors: ${decision2.decision.uncertainties.join(', ')}`)
  console.log(`  Estimated Failure Risk: ${decision2.uncertainty.failureRisk.riskLevel.toUpperCase()}`)
  console.log(`  Wisdom Score: ${decision2.overallWisdomScore.toFixed(0)}/100`)
  console.log(`  Recommendation: ${decision2.recommendation.toUpperCase()}`)

  // Scenario 3: Well-aligned decision
  console.log('\n📋 SCENARIO 3: Safe, Transparent Improvement\n')

  const decision3 = await orchestrator.processDecisionWithReflexivity(
    'Add detailed logging to improve transparency',
    'Logging enables better understanding of system behavior',
    0.95,
    { riskLevel: 'low', deadline: 'flexible', auditRequired: true }
  )

  console.log(`Decision: ${decision3.decision.description}`)
  console.log(`  Confidence: ${(decision3.decision.confidence * 100).toFixed(0)}%`)
  console.log(`  Value Alignment: ${decision3.valueAlignment.overallAlignment.toFixed(0)}%`)
  console.log(`  Aligned Values: ${decision3.valueAlignment.alignedValues.join(', ')}`)
  console.log(`  Wisdom Score: ${decision3.overallWisdomScore.toFixed(0)}/100`)
  console.log(`  ✅ Recommendation: ${decision3.recommendation.toUpperCase()}`)

  // Overall Phase 13 Report
  console.log('\n' + '='.repeat(70))
  console.log('PHASE 13 COMPREHENSIVE REPORT')
  console.log('='.repeat(70) + '\n')

  const report = await orchestrator.getPhase13Report()

  console.log(`📊 Statistics:`)
  console.log(`   Decisions Processed: ${report.decisions}`)
  console.log(`   Average Wisdom Score: ${report.averageWisdom.toFixed(0)}/100`)
  console.log(`   Human Interventions: ${report.humanInterventionsNeeded}`)

  console.log(`\n💡 Key Insights:`)
  for (const insight of report.keyInsights) {
    console.log(`   • ${insight}`)
  }

  console.log(`\n📋 Recommendations:`)
  for (const rec of report.systemRecommendations) {
    console.log(`   • ${rec}`)
  }

  console.log(`\n📝 System Explanation:`)
  console.log(orchestrator.explainPhase13())

  console.log('\n' + '='.repeat(70))
  console.log('✅ Phase 13 Demo Complete')
  console.log('='.repeat(70) + '\n')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  demoPhase13().catch(console.error)
}

export default demoPhase13
