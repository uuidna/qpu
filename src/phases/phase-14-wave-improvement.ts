/**
 * Phase 14: Wave-Based Continuous Improvement
 * Orchestrates iterative self-improvement cycles with feedback and adaptation
 */

export interface Wave {
  id: string
  number: number
  focus: string // What to improve
  startTime: number
  endTime?: number
  improvements: string[]
  metricsStart: Record<string, number>
  metricsEnd?: Record<string, number>
  gain: number // % improvement achieved
  status: 'in-progress' | 'completed' | 'stalled'
}

export interface ImprovementTarget {
  dimension: string // learning-velocity, robustness, efficiency, collaboration
  currentScore: number
  targetScore: number
  priority: number // 1-10
  strategy: string
}

export interface WaveStrategy {
  waveType: 'focused' | 'broad' | 'defensive' | 'opportunistic' | 'exploratory'
  description: string
  expectedGain: number
  complexity: 'low' | 'medium' | 'high'
  riskLevel: 'low' | 'medium' | 'high'
  estimatedDuration: number // cycles
}

export interface ContinuousImprovementState {
  currentWave: Wave | null
  completedWaves: Wave[]
  cumulativeGain: number
  trajectory: Array<{ waveNumber: number; gain: number; timestamp: number }>
  adaptiveStrategy: WaveStrategy
}

export class WaveImprovementOrchestrator {
  private waves: Wave[] = []
  private waveNumber = 0
  private improvementTargets: ImprovementTarget[] = []
  private waveStrategies: Map<string, WaveStrategy> = new Map()
  private metricsHistory: Array<{ timestamp: number; metrics: Record<string, number> }> = []
  private cumulativeGain = 0

  /**
   * Initialize improvement targets
   */
  async initializeTargets(): Promise<ImprovementTarget[]> {
    const targets: ImprovementTarget[] = [
      {
        dimension: 'learning-velocity',
        currentScore: 75,
        targetScore: 95,
        priority: 8,
        strategy: 'curriculum-optimization',
      },
      {
        dimension: 'robustness',
        currentScore: 92,
        targetScore: 98,
        priority: 9,
        strategy: 'adversarial-hardening',
      },
      {
        dimension: 'efficiency',
        currentScore: 88,
        targetScore: 95,
        priority: 7,
        strategy: 'cost-optimization',
      },
      {
        dimension: 'collaboration',
        currentScore: 80,
        targetScore: 92,
        priority: 8,
        strategy: 'multi-agent-sync',
      },
      {
        dimension: 'trustworthiness',
        currentScore: 87,
        targetScore: 96,
        priority: 10,
        strategy: 'value-alignment',
      },
    ]

    this.improvementTargets = targets
    return targets
  }

  /**
   * Initialize wave strategies
   */
  async initializeStrategies(): Promise<Map<string, WaveStrategy>> {
    const strategies: WaveStrategy[] = [
      {
        waveType: 'focused',
        description: 'Deep optimization of single dimension',
        expectedGain: 8,
        complexity: 'high',
        riskLevel: 'medium',
        estimatedDuration: 20,
      },
      {
        waveType: 'broad',
        description: 'Modest improvements across all dimensions',
        expectedGain: 5,
        complexity: 'medium',
        riskLevel: 'low',
        estimatedDuration: 15,
      },
      {
        waveType: 'defensive',
        description: 'Fix weaknesses and prevent degradation',
        expectedGain: 3,
        complexity: 'medium',
        riskLevel: 'low',
        estimatedDuration: 10,
      },
      {
        waveType: 'opportunistic',
        description: 'Exploit discovered synergies',
        expectedGain: 12,
        complexity: 'high',
        riskLevel: 'high',
        estimatedDuration: 25,
      },
      {
        waveType: 'exploratory',
        description: 'Try novel approaches and learn',
        expectedGain: 6,
        complexity: 'high',
        riskLevel: 'high',
        estimatedDuration: 30,
      },
    ]

    for (const strategy of strategies) {
      this.waveStrategies.set(strategy.waveType, strategy)
    }

    return this.waveStrategies
  }

  /**
   * Plan next improvement wave
   */
  async planNextWave(currentMetrics: Record<string, number>): Promise<Wave> {
    this.waveNumber++

    // Determine focus based on targets and current state
    const gapScores = this.improvementTargets.map(t => ({
      dimension: t.dimension,
      gap: t.targetScore - (currentMetrics[t.dimension] || t.currentScore),
      priority: t.priority,
      score: (t.targetScore - (currentMetrics[t.dimension] || t.currentScore)) * (t.priority / 10),
    }))

    const topTarget = gapScores.sort((a, b) => b.score - a.score)[0]

    // Choose strategy based on accumulated gain
    let strategyType: 'focused' | 'broad' | 'defensive' | 'opportunistic' | 'exploratory' = 'broad'
    if (this.cumulativeGain < 10) strategyType = 'focused' // Early waves: focused
    else if (this.cumulativeGain < 30) strategyType = 'opportunistic' // Mid waves: opportunistic
    else if (this.cumulativeGain < 50) strategyType = 'exploratory' // Late waves: exploratory
    else strategyType = 'broad' // Mature: broad optimization

    const wave: Wave = {
      id: `wave-${this.waveNumber}-${Date.now()}`,
      number: this.waveNumber,
      focus: topTarget.dimension,
      startTime: Date.now(),
      improvements: [],
      metricsStart: { ...currentMetrics },
      gain: 0,
      status: 'in-progress',
    }

    this.waves.push(wave)
    return wave
  }

  /**
   * Execute improvement wave
   */
  async executeWave(wave: Wave, strategy: WaveStrategy): Promise<{
    improvementsApplied: string[]
    gain: number
    newMetrics: Record<string, number>
  }> {
    const improvements: string[] = []
    const newMetrics = { ...wave.metricsStart }

    // Apply improvements based on strategy
    switch (strategy.waveType) {
      case 'focused':
        // Deep optimization of target dimension
        improvements.push(`Deep optimization of ${wave.focus}`)
        newMetrics[wave.focus] = Math.min(100, newMetrics[wave.focus] + strategy.expectedGain)
        break

      case 'broad':
        // Improve all dimensions modestly
        for (const [key, value] of Object.entries(newMetrics)) {
          improvements.push(`Modest improvement in ${key}`)
          newMetrics[key] = Math.min(100, value + strategy.expectedGain / 2)
        }
        break

      case 'defensive':
        // Shore up weak areas
        const weakDimensions = Object.entries(newMetrics).filter(([_, v]) => v < 75)
        for (const [dimension, value] of weakDimensions) {
          improvements.push(`Strengthen ${dimension}`)
          newMetrics[dimension] = Math.min(100, value + strategy.expectedGain)
        }
        break

      case 'opportunistic':
        // Exploit synergies
        improvements.push(`Exploit synergies in ${wave.focus}`)
        improvements.push('Cross-system optimization')
        newMetrics[wave.focus] = Math.min(100, newMetrics[wave.focus] + strategy.expectedGain)
        // Boost collaboration as well
        newMetrics['collaboration'] = Math.min(100, (newMetrics['collaboration'] || 80) + 3)
        break

      case 'exploratory':
        // Try novel approaches
        improvements.push(`Novel approach in ${wave.focus}`)
        improvements.push('Experimental optimization')
        newMetrics[wave.focus] = Math.min(100, newMetrics[wave.focus] + strategy.expectedGain / 2)
        break
    }

    // Calculate gain
    const startAvg = Object.values(wave.metricsStart).reduce((a, b) => a + b, 0) / Object.values(wave.metricsStart).length
    const endAvg = Object.values(newMetrics).reduce((a, b) => a + b, 0) / Object.values(newMetrics).length
    const gain = ((endAvg - startAvg) / startAvg) * 100

    // Update wave
    wave.improvements = improvements
    wave.metricsEnd = newMetrics
    wave.gain = gain
    wave.endTime = Date.now()
    wave.status = 'completed'

    this.cumulativeGain += gain
    this.metricsHistory.push({ timestamp: Date.now(), metrics: newMetrics })

    return {
      improvementsApplied: improvements,
      gain,
      newMetrics,
    }
  }

  /**
   * Detect wave stalling (improvement slowing down)
   */
  async detectStalling(): Promise<{
    isStalling: boolean
    reason: string
    recommendation: string
  }> {
    if (this.waves.length < 3) {
      return {
        isStalling: false,
        reason: 'Not enough waves to detect pattern',
        recommendation: 'Continue with current strategy',
      }
    }

    const recentWaves = this.waves.slice(-3)
    const recentGains = recentWaves.map(w => w.gain)
    const avgRecentGain = recentGains.reduce((a, b) => a + b, 0) / recentGains.length

    if (avgRecentGain < 2) {
      return {
        isStalling: true,
        reason: 'Improvement rate has dropped below 2% per wave',
        recommendation: 'Switch to exploratory strategy to find new opportunities',
      }
    }

    // Check if same dimension keeps improving
    const focusDimensions = recentWaves.map(w => w.focus)
    if (new Set(focusDimensions).size === 1) {
      return {
        isStalling: false,
        reason: 'Same dimension improving - not stalling',
        recommendation: 'Consider broad wave next to balance improvements',
      }
    }

    return {
      isStalling: false,
      reason: 'Diverse improvements across dimensions',
      recommendation: 'Continue current trajectory',
    }
  }

  /**
   * Adaptive wave selection
   */
  async selectAdaptiveStrategy(metrics: Record<string, number>): Promise<WaveStrategy> {
    const stalling = await this.detectStalling()
    const trend = this.getImprovementTrend()

    if (stalling.isStalling && this.cumulativeGain > 30) {
      return this.waveStrategies.get('exploratory') || this.waveStrategies.get('broad')!
    }

    if (trend === 'accelerating') {
      return this.waveStrategies.get('opportunistic') || this.waveStrategies.get('focused')!
    }

    if (trend === 'decelerating') {
      return this.waveStrategies.get('defensive') || this.waveStrategies.get('broad')!
    }

    return this.waveStrategies.get('broad')!
  }

  /**
   * Get improvement trend
   */
  private getImprovementTrend(): 'accelerating' | 'stable' | 'decelerating' {
    if (this.waves.length < 3) return 'stable'

    const recent3 = this.waves.slice(-3).map(w => w.gain)
    const avg1 = recent3[0]
    const avg2 = (recent3[1] + recent3[2]) / 2

    if (avg2 > avg1 + 1) return 'accelerating'
    if (avg2 < avg1 - 1) return 'decelerating'
    return 'stable'
  }

  /**
   * Get continuous improvement report
   */
  async getWaveReport(): Promise<{
    wavesCompleted: number
    cumulativeGain: number
    averageGainPerWave: number
    trend: string
    nextStrategy: WaveStrategy | undefined
    waveHistory: Array<{ waveNumber: number; focus: string; gain: number }>
  }> {
    const completedWaves = this.waves.filter(w => w.status === 'completed')
    const avgGain = completedWaves.length > 0
      ? completedWaves.reduce((sum, w) => sum + w.gain, 0) / completedWaves.length
      : 0

    const trend = this.getImprovementTrend()
    const trendStr = trend === 'accelerating' ? '↗️ Accelerating' : trend === 'decelerating' ? '↘️ Decelerating' : '→ Stable'

    const history = completedWaves.map(w => ({
      waveNumber: w.number,
      focus: w.focus,
      gain: w.gain,
    }))

    const nextStrategy = await this.selectAdaptiveStrategy({})

    return {
      wavesCompleted: completedWaves.length,
      cumulativeGain: this.cumulativeGain,
      averageGainPerWave: avgGain,
      trend: trendStr,
      nextStrategy,
      waveHistory: history,
    }
  }

  /**
   * Project improvement trajectory
   */
  async projectTrajectory(waveCount: number = 20): Promise<{
    projectedGain: number
    waveProgression: Array<{ wave: number; projectedScore: number }>
    timeToTarget: number
    convergence: boolean
  }> {
    const completedWaves = this.waves.filter(w => w.status === 'completed')
    const avgGain = completedWaves.length > 0
      ? completedWaves.reduce((sum, w) => sum + w.gain, 0) / completedWaves.length
      : 3

    let projectedScore = this.cumulativeGain
    const progression = []

    for (let i = 1; i <= waveCount; i++) {
      // Assume diminishing returns
      const gainModifier = Math.max(0.5, 1 - (i / waveCount) * 0.5)
      projectedScore += avgGain * gainModifier

      progression.push({
        wave: this.waveNumber + i,
        projectedScore: Math.min(100, projectedScore),
      })
    }

    const convergence = avgGain < 1 || projectedScore > 90

    return {
      projectedGain: Math.min(100, projectedScore),
      waveProgression: progression,
      timeToTarget: completedWaves.length + Math.ceil(waveCount / 2),
      convergence,
    }
  }

  /**
   * Get wave momentum
   */
  getMomentum(): {
    momentum: number // -1 to +1
    direction: 'accelerating' | 'stable' | 'decelerating'
    predictedNextGain: number
  } {
    if (this.waves.length < 2) {
      return { momentum: 0.5, direction: 'stable', predictedNextGain: 5 }
    }

    const recentWaves = this.waves.slice(-5).filter(w => w.status === 'completed')
    if (recentWaves.length < 2) {
      return { momentum: 0.5, direction: 'stable', predictedNextGain: 5 }
    }

    const gains = recentWaves.map(w => w.gain)
    const oldAvg = gains.slice(0, Math.floor(gains.length / 2)).reduce((a, b) => a + b, 0) / Math.floor(gains.length / 2)
    const newAvg = gains.slice(Math.floor(gains.length / 2)).reduce((a, b) => a + b, 0) / Math.ceil(gains.length / 2)

    const momentum = (newAvg - oldAvg) / Math.max(oldAvg, 1)
    let direction: 'accelerating' | 'stable' | 'decelerating' = 'stable'
    if (momentum > 0.2) direction = 'accelerating'
    else if (momentum < -0.2) direction = 'decelerating'

    const predictedNextGain = newAvg * (1 + momentum)

    return { momentum: Math.max(-1, Math.min(1, momentum)), direction, predictedNextGain }
  }

  // Getters
  getWaves() { return this.waves }
  getCompletedWaves() { return this.waves.filter(w => w.status === 'completed') }
  getCurrentWave() { return this.waves.find(w => w.status === 'in-progress') }
  getCumulativeGain() { return this.cumulativeGain }
  getWaveNumber() { return this.waveNumber }
  getImprovementTargets() { return this.improvementTargets }
}

export default WaveImprovementOrchestrator
