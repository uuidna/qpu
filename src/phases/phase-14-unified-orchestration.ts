/**
 * Phase 14: Unified Wave-Based Continuous Improvement Orchestrator
 * Orchestrates all 13 prior phases + 14 wave improvement
 */

import WaveImprovementOrchestrator from './phase-14-wave-improvement.js'

export interface ContinuousImprovementState {
  waveNumber: number
  totalGain: number
  momentum: number
  trajectory: 'accelerating' | 'stable' | 'decelerating' | 'converging'
  systemHealth: Record<string, number>
  nextFocus: string
  confidence: number
}

export interface WaveExecutionReport {
  waveCompleted: boolean
  improvementsApplied: string[]
  gain: number
  metrics: Record<string, number>
  insights: string[]
  recommendation: string
}

export class Phase14Orchestrator {
  private waveOrchestrator: WaveImprovementOrchestrator
  private executionHistory: WaveExecutionReport[] = []
  private systemMetrics: Record<string, number> = {
    'learning-velocity': 75,
    'robustness': 92,
    'efficiency': 88,
    'collaboration': 80,
    'trustworthiness': 87,
  }

  constructor() {
    this.waveOrchestrator = new WaveImprovementOrchestrator()
  }

  /**
   * Initialize Phase 14
   */
  async initialize(): Promise<void> {
    await this.waveOrchestrator.initializeTargets()
    await this.waveOrchestrator.initializeStrategies()
    console.log('[Phase 14] Wave-Based Continuous Improvement activated')
  }

  /**
   * Execute one improvement wave
   */
  async executeWave(): Promise<WaveExecutionReport> {
    // Plan wave
    const wave = await this.waveOrchestrator.planNextWave(this.systemMetrics)

    // Select adaptive strategy
    const strategy = await this.waveOrchestrator.selectAdaptiveStrategy(this.systemMetrics)

    // Execute
    const result = await this.waveOrchestrator.executeWave(wave, strategy)

    // Update metrics
    this.systemMetrics = result.newMetrics

    // Generate insights
    const insights = await this.generateWaveInsights(wave, result)

    const report: WaveExecutionReport = {
      waveCompleted: true,
      improvementsApplied: result.improvementsApplied,
      gain: result.gain,
      metrics: result.newMetrics,
      insights,
      recommendation: this.getNextRecommendation(),
    }

    this.executionHistory.push(report)
    return report
  }

  /**
   * Execute continuous waves until convergence
   */
  async executeContinuousWaves(maxWaves: number = 50): Promise<{
    wavesExecuted: number
    totalGain: number
    finalMetrics: Record<string, number>
    trajectory: string
    convergenceReached: boolean
  }> {
    console.log(`\n[Phase 14] Starting continuous wave improvement (max ${maxWaves} waves)...\n`)

    let wavesExecuted = 0
    let previousGain = 0
    const gainTrend: number[] = []

    for (let i = 0; i < maxWaves; i++) {
      const report = await this.executeWave()
      wavesExecuted++
      gainTrend.push(report.gain)

      console.log(`Wave ${this.waveOrchestrator.getWaveNumber()}: +${report.gain.toFixed(2)}% gain (${Object.values(report.metrics)[0].toFixed(1)}/100)`)

      // Check for convergence
      if (report.gain < 0.5 && i > 10) {
        console.log(`\n✅ System converged after ${wavesExecuted} waves`)
        return {
          wavesExecuted,
          totalGain: this.waveOrchestrator.getCumulativeGain(),
          finalMetrics: this.systemMetrics,
          trajectory: this.getTrajectory(),
          convergenceReached: true,
        }
      }

      // Check for stalling
      if (gainTrend.length > 3 && gainTrend.slice(-3).reduce((a, b) => a + b, 0) / 3 < 1) {
        console.log(`\n⚠️  System stalling after ${wavesExecuted} waves`)
      }

      previousGain = report.gain
    }

    return {
      wavesExecuted,
      totalGain: this.waveOrchestrator.getCumulativeGain(),
      finalMetrics: this.systemMetrics,
      trajectory: this.getTrajectory(),
      convergenceReached: false,
    }
  }

  /**
   * Generate insights from wave
   */
  private async generateWaveInsights(wave: any, result: any): Promise<string[]> {
    const insights: string[] = []

    if (result.gain > 8) {
      insights.push('🔥 Exceptional wave - strategy highly effective')
    } else if (result.gain < 1) {
      insights.push('📈 Diminishing returns - may need strategy change')
    }

    // Check metric balance
    const metrics = Object.values(result.newMetrics) as number[]
    const avgMetric = metrics.reduce((a, b) => a + b, 0) / metrics.length
    const maxGap = Math.max(...metrics) - Math.min(...metrics)

    if (maxGap > 20) {
      insights.push(`⚠️  Metric imbalance detected (gap: ${maxGap.toFixed(1)})`)
    }

    const momentum = this.waveOrchestrator.getMomentum()
    if (momentum.direction === 'accelerating') {
      insights.push('🚀 Momentum accelerating - exploit current synergies')
    } else if (momentum.direction === 'decelerating') {
      insights.push('📉 Momentum slowing - switch to exploratory strategy')
    }

    return insights
  }

  /**
   * Get next recommendation
   */
  private getNextRecommendation(): string {
    const momentum = this.waveOrchestrator.getMomentum()

    if (momentum.momentum > 0.5) {
      return 'Continue with opportunistic strategy - momentum is strong'
    }

    if (momentum.momentum < -0.3) {
      return 'Switch to exploratory strategy - need fresh approaches'
    }

    return 'Maintain current trajectory with broad improvements'
  }

  /**
   * Get improvement trajectory
   */
  private getTrajectory(): string {
    const momentum = this.waveOrchestrator.getMomentum()

    if (momentum.direction === 'accelerating') return '🚀 Accelerating'
    if (momentum.direction === 'decelerating') return '📉 Decelerating'
    return '→ Stable'
  }

  /**
   * Get comprehensive Phase 14 report
   */
  async getPhase14Report(): Promise<ContinuousImprovementState> {
    const waveReport = await this.waveOrchestrator.getWaveReport()
    const momentum = this.waveOrchestrator.getMomentum()
    const projection = await this.waveOrchestrator.projectTrajectory(10)

    return {
      waveNumber: this.waveOrchestrator.getWaveNumber(),
      totalGain: this.waveOrchestrator.getCumulativeGain(),
      momentum: momentum.momentum,
      trajectory: (momentum.direction === 'accelerating' ? 'accelerating' :
        momentum.direction === 'decelerating' ? 'decelerating' :
        projection.convergence ? 'converging' : 'stable') as any,
      systemHealth: this.systemMetrics,
      nextFocus: waveReport.nextStrategy?.waveType || 'broad',
      confidence: Math.min(100, 50 + this.waveOrchestrator.getCumulativeGain()),
    }
  }

  /**
   * Get continuous improvement strategy
   */
  explainWaveStrategy(): string {
    return `
## Phase 14: Wave-Based Continuous Improvement

### The 5 Wave Strategies:

1. **Focused Waves** (8% expected gain)
   - Deep optimization of single dimension
   - High complexity, medium risk
   - Used early to establish foundation

2. **Broad Waves** (5% expected gain)
   - Modest improvements across all dimensions
   - Medium complexity, low risk
   - Most common and reliable

3. **Defensive Waves** (3% expected gain)
   - Shore up weak areas
   - Medium complexity, low risk
   - Maintain minimum thresholds

4. **Opportunistic Waves** (12% expected gain)
   - Exploit discovered synergies
   - High complexity, high risk
   - Used when momentum is strong

5. **Exploratory Waves** (6% expected gain)
   - Try novel approaches
   - High complexity, high risk
   - Used when stalling is detected

### Wave Selection Logic:

Early (Gain < 10%):   Focused waves
Mid (Gain < 30%):    Opportunistic waves (exploit synergies)
Late (Gain < 50%):   Exploratory waves (find new opportunities)
Mature (Gain > 50%): Broad waves (balanced optimization)

### Continuous Improvement Cycle:

1. Measure current metrics
2. Identify improvement gaps
3. Select adaptive strategy
4. Plan targeted wave
5. Execute improvements
6. Measure results
7. Detect momentum/stalling
8. Adapt strategy
9. Repeat

### Expected Trajectory:

Wave 1-5:   +5-8% per wave (discovery phase)
Wave 6-15:  +3-6% per wave (optimization phase)
Wave 16+:   +1-3% per wave (convergence phase)

Total potential: 50-80% improvement over baseline
Convergence point: 20-30 waves for most systems
    `
  }

  // Getters
  getWaveOrchestrator() { return this.waveOrchestrator }
  getExecutionHistory() { return this.executionHistory }
  getSystemMetrics() { return this.systemMetrics }
  getWaveNumber() { return this.waveOrchestrator.getWaveNumber() }
}

export default Phase14Orchestrator
