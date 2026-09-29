/**
 * Phase 11 Self-Improvement Demo
 *
 * Demonstrates:
 * - Adaptive learning from optimization history
 * - Predictive optimization suggestions
 * - Recursive improvement cycles
 * - Capability self-assessment
 */

import {
  AdaptiveLearningEngine,
  RecursiveImprovementEngine,
  CapabilityDiscoverer,
  PredictiveOptimizer,
  OptimizationResult,
} from '../phases/phase-11-adaptive-learning.js'

// ============================================================================
// SIMULATION: Historical Optimizations
// ============================================================================

const createHistoricalData = (): OptimizationResult[] => {
  return [
    // Successful latency optimizations
    {
      timestamp: Date.now() - 600000,
      component: 'core-engine',
      metricName: 'latency',
      improvementPercent: 18,
      success: true,
      successIndicators: 1,
    },
    {
      timestamp: Date.now() - 540000,
      component: 'core-engine',
      metricName: 'latency',
      improvementPercent: 12,
      success: true,
      successIndicators: 1,
    },
    // Memory optimizations
    {
      timestamp: Date.now() - 480000,
      component: 'memory',
      metricName: 'efficiency',
      improvementPercent: 25,
      success: true,
      successIndicators: 1,
    },
    {
      timestamp: Date.now() - 420000,
      component: 'memory',
      metricName: 'footprint',
      improvementPercent: 22,
      success: true,
      successIndicators: 1,
    },
    // Throughput improvements
    {
      timestamp: Date.now() - 360000,
      component: 'concurrency',
      metricName: 'throughput',
      improvementPercent: 35,
      success: true,
      successIndicators: 1,
    },
    // Failed attempt
    {
      timestamp: Date.now() - 300000,
      component: 'cache',
      metricName: 'hit-rate',
      improvementPercent: 0,
      success: false,
      successIndicators: 0,
    },
    // Error handling
    {
      timestamp: Date.now() - 240000,
      component: 'error-handling',
      metricName: 'recovery-speed',
      improvementPercent: 40,
      success: true,
      successIndicators: 1,
    },
    // Database optimization
    {
      timestamp: Date.now() - 180000,
      component: 'database',
      metricName: 'query-latency',
      improvementPercent: 28,
      success: true,
      successIndicators: 1,
    },
  ]
}

// ============================================================================
// DEMO 1: Learn from History
// ============================================================================

export async function demoLearningFromHistory(): Promise<void> {
  console.log('\n' + '='.repeat(70))
  console.log('DEMO 1: Adaptive Learning from History')
  console.log('='.repeat(70) + '\n')

  const engine = new AdaptiveLearningEngine()
  const historicalData = createHistoricalData()

  // Record all historical optimizations
  for (const opt of historicalData) {
    engine.recordOptimization(opt)
  }

  // Learn from history
  const learnings = await engine.learnFromHistory()

  console.log('📊 Historical Analysis:')
  console.log(`   Total optimizations: ${historicalData.length}`)
  console.log(`   Success rate: ${learnings.successRate.toFixed(1)}%`)
  console.log(`   Average improvement: ${learnings.avgImprovement.toFixed(1)}%`)

  console.log('\n🎯 Top Success Patterns:')
  for (const pattern of learnings.topPatterns.slice(0, 3)) {
    console.log(`   • ${pattern.pattern}: ${pattern.successCount} successes`)
  }

  const state = engine.getLearningState()
  console.log('\n🧠 Learning State:')
  console.log(`   Cycles completed: ${state.totalCycles}`)
  console.log(`   Knowledge base entries: ${state.knowledgeBaseSize}`)
  console.log(`   Predictive accuracy: ${state.predictiveAccuracy.toFixed(1)}%`)
}

// ============================================================================
// DEMO 2: Predictive Optimization
// ============================================================================

export async function demoPredictiveOptimization(): Promise<void> {
  console.log('\n' + '='.repeat(70))
  console.log('DEMO 2: Predictive Optimization')
  console.log('='.repeat(70) + '\n')

  const engine = new AdaptiveLearningEngine()
  const historicalData = createHistoricalData()

  for (const opt of historicalData) {
    engine.recordOptimization(opt)
  }

  // Simulate current system metrics
  const currentMetrics = {
    latency: 150,        // ms - above ideal 50ms
    errorRate: 0.08,     // 8% - above ideal 1%
    throughput: 800,     // ops/sec - below target 1000
    memoryUsage: 0.75,   // 75% utilization
    cpuUsage: 0.82,      // 82% utilization
  }

  console.log('📈 Current System Metrics:')
  for (const [metric, value] of Object.entries(currentMetrics)) {
    console.log(`   ${metric}: ${value}`)
  }

  // Get predictions
  const predictions = PredictiveOptimizer.predictNextOptimizations(
    currentMetrics,
    engine['optimizationHistory'],
    Array.from(engine['knowledgeBase'].values())
  )

  console.log('\n🔮 Predicted Optimizations (ranked by impact):')
  for (let i = 0; i < predictions.length && i < 3; i++) {
    const pred = predictions[i]
    console.log(
      `   ${i + 1}. ${pred.component} → ${pred.metric}`
    )
    console.log(
      `      Expected improvement: ${pred.expectedImprovement.toFixed(1)}%`
    )
  }
}

// ============================================================================
// DEMO 3: Recursive Improvement Cycle
// ============================================================================

export async function demoRecursiveImprovement(): Promise<void> {
  console.log('\n' + '='.repeat(70))
  console.log('DEMO 3: Recursive Improvement Cycle')
  console.log('='.repeat(70) + '\n')

  const learning = new AdaptiveLearningEngine()
  const recursive = new RecursiveImprovementEngine(learning)

  // Bootstrap
  const historicalData = createHistoricalData()
  for (const opt of historicalData) {
    learning.recordOptimization(opt)
  }

  // Run recursive cycle
  const initialMetrics = {
    latency: 120,
    throughput: 850,
    errorRate: 0.06,
    resourceEfficiency: 0.75,
  }

  console.log('🔄 Running Recursive Improvement Cycle (2 iterations)...\n')
  const cycle = await recursive.executeRecursiveCycle(initialMetrics, 2)

  console.log(`✅ Cycle #${cycle.cycleNumber} Results:`)
  console.log(`   Duration: ${cycle.timestamp}`)
  console.log(`   Improvements executed: ${cycle.improvements.length}`)
  console.log(
    `   Success rate: ${(cycle.improvements.filter(i => i.success).length / cycle.improvements.length * 100).toFixed(1)}%`
  )

  if (cycle.improvements.length > 0) {
    const totalImprovement = cycle.improvements.reduce(
      (sum, imp) => sum + imp.improvementPercent,
      0
    )
    console.log(`   Total improvement: ${totalImprovement.toFixed(1)}%`)
  }

  console.log(`\n🔗 Patterns discovered: ${cycle.patterns.length}`)
  for (const pattern of cycle.patterns) {
    console.log(`   • ${pattern}`)
  }

  console.log(`\n📚 New knowledge added: ${cycle.newKnowledge.length}`)

  console.log(`\n🎯 Next predicted optimizations:`)
  for (const step of cycle.predictedNextSteps) {
    console.log(`   → ${step}`)
  }

  console.log(`\n📊 System Performance:`)
  console.log(`   Latency: ${cycle.systemStats.latency.toFixed(1)}ms`)
  console.log(`   Throughput: ${cycle.systemStats.throughput.toFixed(0)} ops/s`)
  console.log(`   Error Rate: ${(cycle.systemStats.errorRate * 100).toFixed(2)}%`)
  console.log(`   Resource Efficiency: ${(cycle.systemStats.resourceEfficiency * 100).toFixed(1)}%`)

  // Get trajectory
  const trajectory = recursive.getTrajectory()
  console.log(`\n📈 Improvement Trajectory:`)
  console.log(`   Cycles run: ${trajectory.cyclesRun}`)
  console.log(`   Total improvements: ${trajectory.totalImprovements}`)
  console.log(`   Success rate: ${trajectory.successRate.toFixed(1)}%`)
  console.log(`   Cumulative improvement: ${trajectory.cumulativeImprovement.toFixed(1)}%`)
}

// ============================================================================
// DEMO 4: Capability Self-Assessment
// ============================================================================

export async function demoCapabilityAssessment(): Promise<void> {
  console.log('\n' + '='.repeat(70))
  console.log('DEMO 4: Capability Self-Assessment')
  console.log('='.repeat(70) + '\n')

  const engine = new AdaptiveLearningEngine()
  const historicalData = createHistoricalData()

  for (const opt of historicalData) {
    engine.recordOptimization(opt)
  }

  const state = engine.getLearningState()
  const assessment = CapabilityDiscoverer.assessCapabilities(state)

  console.log('🧠 System Self-Assessment:')
  console.log(`   Overall readiness: ${assessment.readiness.toFixed(1)}%`)

  console.log(`\n💪 Strong Areas:`)
  for (const area of assessment.strongAreas) {
    console.log(`   ✓ ${area}`)
  }

  console.log(`\n📈 Areas for Improvement:`)
  for (const area of assessment.improvementAreas) {
    console.log(`   ○ ${area}`)
  }

  // Discover new capabilities
  const discovered = await CapabilityDiscoverer.discoverCapabilities()
  console.log(`\n🆕 Discovered Capabilities:`)
  for (const cap of discovered) {
    console.log(`   ✨ ${cap}`)
  }

  console.log(`\n🎓 Learning Metrics:`)
  console.log(`   Success rate: ${state.successRate.toFixed(1)}%`)
  console.log(`   Avg improvement per cycle: ${state.averageImprovement.toFixed(1)}%`)
  console.log(`   Knowledge base size: ${state.knowledgeBaseSize} entries`)
  console.log(`   Predictive accuracy: ${state.predictiveAccuracy.toFixed(1)}%`)
}

// ============================================================================
// RUN ALL DEMOS
// ============================================================================

export async function runAllDemos(): Promise<void> {
  console.log('\n')
  console.log('🚀 PHASE 11: ADAPTIVE LEARNING & RECURSIVE SELF-IMPROVEMENT')
  console.log('━'.repeat(70))

  await demoLearningFromHistory()
  await demoPredictiveOptimization()
  await demoRecursiveImprovement()
  await demoCapabilityAssessment()

  console.log('\n' + '━'.repeat(70))
  console.log('✅ Phase 11 Demonstrations Complete')
  console.log('━'.repeat(70) + '\n')
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllDemos().catch(console.error)
}

export default {
  demoLearningFromHistory,
  demoPredictiveOptimization,
  demoRecursiveImprovement,
  demoCapabilityAssessment,
  runAllDemos,
}
