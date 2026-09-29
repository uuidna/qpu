/**
 * Phase 11 Integration Layer
 * Connects adaptive learning to autonomous engine and self-optimizer
 */

import { AdaptiveLearningEngine, RecursiveImprovementEngine, CapabilityDiscoverer, PredictiveOptimizer } from '../phases/phase-11-adaptive-learning.js'
import { SelfOptimizer } from './self-optimizer.js'
import { AutonomousEngine } from './autonomous-engine.js'

export class Phase11Integration {
  private adaptiveLearning: AdaptiveLearningEngine
  private recursiveEngine: RecursiveImprovementEngine
  private selfOptimizer: SelfOptimizer
  private autonomousEngine: AutonomousEngine
  private isRunning = false

  constructor(
    selfOptimizer: SelfOptimizer,
    autonomousEngine: AutonomousEngine
  ) {
    this.selfOptimizer = selfOptimizer
    this.autonomousEngine = autonomousEngine
    this.adaptiveLearning = new AdaptiveLearningEngine()
    this.recursiveEngine = new RecursiveImprovementEngine(this.adaptiveLearning)
  }

  /**
   * Start integrated self-improvement system
   */
  async start(): Promise<void> {
    if (this.isRunning) return
    this.isRunning = true

    console.log('[Phase 11] Adaptive Learning & Recursive Self-Improvement activated')

    // Run improvement cycles every 2 minutes
    setInterval(() => this.runImprovedOptimizationCycle(), 2 * 60 * 1000)
  }

  /**
   * Run optimization cycle with adaptive learning feedback
   */
  private async runImprovedOptimizationCycle(): Promise<void> {
    try {
      // 1. Get current metrics from self-optimizer
      const stats = this.selfOptimizer.getStats()

      // 2. Build metrics object
      const metrics: Record<string, number> = {
        latency: 100 - (parseFloat(stats.improvementRate) || 0),
        throughput: stats.targets || 100,
        errorRate: Math.max(0, 0.05 - (parseFloat(stats.improvementRate) || 0) / 1000),
      }

      // 3. Execute recursive improvement cycle
      const cycle = await this.recursiveEngine.executeRecursiveCycle(metrics, 2)

      // 4. Log improvements
      console.log(`[Phase 11] Recursive cycle #${cycle.cycleNumber}:`)
      console.log(`  - Improvements: ${cycle.improvements.length}`)
      console.log(`  - Success rate: ${(cycle.improvements.filter(i => i.success).length / cycle.improvements.length * 100).toFixed(1)}%`)
      console.log(`  - New knowledge: ${cycle.newKnowledge.length}`)
      console.log(`  - Predicted next: ${cycle.predictedNextSteps.slice(0, 2).join(', ')}`)

      // 5. Assess capabilities
      const state = this.adaptiveLearning.getLearningState()
      const assessment = CapabilityDiscoverer.assessCapabilities(state)
      console.log(`[Phase 11] System readiness: ${assessment.readiness.toFixed(1)}%`)

    } catch (err) {
      console.error('[Phase 11] Cycle error:', err)
    }
  }

  /**
   * Get integrated improvement report
   */
  async getImprovementReport(): Promise<{
    learningState: any
    trajectory: any
    capabilities: any
    recentCycles: any[]
  }> {
    const learningState = this.adaptiveLearning.getLearningState()
    const trajectory = this.recursiveEngine.getTrajectory()
    const capabilities = CapabilityDiscoverer.assessCapabilities(learningState)
    const recentCycles = this.recursiveEngine.getCycleHistory(3)

    return {
      learningState,
      trajectory,
      capabilities,
      recentCycles,
    }
  }

  /**
   * Predict and suggest next optimizations
   */
  async suggestOptimizations(): Promise<Array<{
    component: string
    metric: string
    expectedImprovement: number
    confidence: number
  }>> {
    const metrics: Record<string, number> = {
      latency: 100,
      throughput: 1000,
      errorRate: 0.01,
    }

    const predictions = PredictiveOptimizer.predictNextOptimizations(
      metrics,
      this.adaptiveLearning['optimizationHistory'] || [],
      Array.from(this.adaptiveLearning['knowledgeBase']?.values() || [])
    )

    const state = this.adaptiveLearning.getLearningState()
    return predictions.map(p => ({
      ...p,
      confidence: Math.min(100, state.predictiveAccuracy),
    }))
  }

  /**
   * Stop adaptive improvement
   */
  stop(): void {
    this.isRunning = false
    console.log('[Phase 11] Adaptive Learning stopped')
  }

  /**
   * Get learning engine for direct access
   */
  getLearningEngine(): AdaptiveLearningEngine {
    return this.adaptiveLearning
  }

  /**
   * Get recursive engine for direct access
   */
  getRecursiveEngine(): RecursiveImprovementEngine {
    return this.recursiveEngine
  }
}

export default Phase11Integration
