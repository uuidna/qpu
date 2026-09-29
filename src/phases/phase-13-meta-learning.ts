/**
 * Phase 13d: Meta-Learning Engine
 * System learns about its own learning process
 */

export interface LearningMethodEvaluation {
  method: string
  effectiveness: number // 0-1
  applicableTo: string[] // Problem types
  convergenceSpeed: number // cycles to convergence
  stabilitScore: number // How stable the results are
}

export interface OverfittingDetection {
  isOverfitting: boolean
  evidence: string[]
  trainingAccuracy: number
  testAccuracy: number
  gap: number
  recommendation: string
}

export interface KnowledgeQuality {
  patternId: string
  reliability: number
  applicationsCount: number
  ageInCycles: number
  shouldForget: boolean
  shouldRefresh: boolean
}

export class MetaLearningEngine {
  private methodEvaluations: Map<string, LearningMethodEvaluation> = new Map()
  private trainingMetrics: Array<{ cycle: number; trainAccuracy: number; testAccuracy: number }> = []
  private knowledgeAge: Map<string, number> = new Map()
  private learningHistory: Array<{ method: string; success: boolean; score: number }> = []

  /**
   * Initialize learning methods
   */
  async initializeMethods(): Promise<LearningMethodEvaluation[]> {
    const methods: LearningMethodEvaluation[] = [
      {
        method: 'gradient-descent',
        effectiveness: 0.85,
        applicableTo: ['optimization', 'regression'],
        convergenceSpeed: 100,
        stabilitScore: 0.9,
      },
      {
        method: 'reinforcement-learning',
        effectiveness: 0.80,
        applicableTo: ['decision-making', 'strategy'],
        convergenceSpeed: 500,
        stabilitScore: 0.75,
      },
      {
        method: 'ensemble-voting',
        effectiveness: 0.88,
        applicableTo: ['classification', 'consensus'],
        convergenceSpeed: 50,
        stabilitScore: 0.95,
      },
      {
        method: 'curriculum-learning',
        effectiveness: 0.82,
        applicableTo: ['progression', 'skill-building'],
        convergenceSpeed: 200,
        stabilitScore: 0.85,
      },
      {
        method: 'federated-learning',
        effectiveness: 0.78,
        applicableTo: ['distributed', 'consensus'],
        convergenceSpeed: 300,
        stabilitScore: 0.80,
      },
    ]

    for (const method of methods) {
      this.methodEvaluations.set(method.method, method)
    }

    return methods
  }

  /**
   * Evaluate learning method effectiveness
   */
  async evaluateLearningMethod(method: string, problemType: string): Promise<LearningMethodEvaluation | null> {
    const evaluation = this.methodEvaluations.get(method)

    if (!evaluation) return null

    // Adjust effectiveness based on problem type match
    let adjustedEffectiveness = evaluation.effectiveness

    if (evaluation.applicableTo.includes(problemType)) {
      adjustedEffectiveness += 0.1
    } else {
      adjustedEffectiveness -= 0.15
    }

    return {
      ...evaluation,
      effectiveness: Math.max(0, Math.min(1, adjustedEffectiveness)),
    }
  }

  /**
   * Choose optimal learning strategy for problem
   */
  async chooseOptimalLearningStrategy(problemType: string): Promise<{
    recommendedMethod: string
    reason: string
    expectedEffectiveness: number
    estimatedTime: number
  }> {
    let best: [string, LearningMethodEvaluation] | null = null
    let bestScore = 0

    for (const [method, evaluation] of this.methodEvaluations) {
      let score = evaluation.effectiveness

      if (evaluation.applicableTo.includes(problemType)) {
        score += 0.3
      }

      // Prefer faster methods
      score += (500 - evaluation.convergenceSpeed) / 1000

      if (score > bestScore) {
        bestScore = score
        best = [method, evaluation]
      }
    }

    if (!best) {
      return {
        recommendedMethod: 'ensemble-voting',
        reason: 'Fallback to robust method',
        expectedEffectiveness: 0.88,
        estimatedTime: 50,
      }
    }

    return {
      recommendedMethod: best[0],
      reason: `Best for ${problemType}: ${best[0]} combines effectiveness and speed`,
      expectedEffectiveness: best[1].effectiveness,
      estimatedTime: best[1].convergenceSpeed,
    }
  }

  /**
   * Detect overfitting
   */
  async detectOverfitting(): Promise<OverfittingDetection> {
    if (this.trainingMetrics.length < 3) {
      return {
        isOverfitting: false,
        evidence: [],
        trainingAccuracy: 0,
        testAccuracy: 0,
        gap: 0,
        recommendation: 'Not enough data to detect overfitting',
      }
    }

    const recent = this.trainingMetrics.slice(-10)
    const trainAvg = recent.reduce((sum, m) => sum + m.trainAccuracy, 0) / recent.length
    const testAvg = recent.reduce((sum, m) => sum + m.testAccuracy, 0) / recent.length
    const gap = trainAvg - testAvg

    const evidence: string[] = []
    if (gap > 0.2) {
      evidence.push(`Large accuracy gap: train ${trainAvg.toFixed(2)} vs test ${testAvg.toFixed(2)}`)
    }
    if (trainAvg > 0.95 && testAvg < 0.85) {
      evidence.push('Training accuracy very high but test accuracy drops significantly')
    }

    // Check if gap is widening
    if (recent.length > 5) {
      const oldGap = recent[0].trainAccuracy - recent[0].testAccuracy
      const newGap = recent[recent.length - 1].trainAccuracy - recent[recent.length - 1].testAccuracy
      if (newGap > oldGap + 0.1) {
        evidence.push('Overfitting is increasing over time')
      }
    }

    return {
      isOverfitting: gap > 0.15,
      evidence,
      trainingAccuracy: trainAvg,
      testAccuracy: testAvg,
      gap,
      recommendation: gap > 0.15
        ? 'Use regularization or reduce model complexity'
        : 'Model is well-generalized',
    }
  }

  /**
   * Manage knowledge decay - decide what to forget
   */
  async shouldForgetPattern(patternId: string, maxAge: number = 100): Promise<{
    shouldForget: boolean
    reason: string
  }> {
    const age = this.knowledgeAge.get(patternId) || 0

    // Forget if too old
    if (age > maxAge) {
      return {
        shouldForget: true,
        reason: `Pattern is ${age} cycles old (threshold: ${maxAge})`,
      }
    }

    // Forget if unreliable
    if (age > 50 && Math.random() < 0.2) {
      // 20% chance to forget unreliable patterns
      return {
        shouldForget: true,
        reason: 'Low reliability after long period',
      }
    }

    return {
      shouldForget: false,
      reason: 'Pattern is recent and reliable',
    }
  }

  /**
   * Record training metrics for overfitting detection
   */
  recordMetrics(cycle: number, trainAccuracy: number, testAccuracy: number): void {
    this.trainingMetrics.push({ cycle, trainAccuracy, testAccuracy })
  }

  /**
   * Record learning method result
   */
  recordLearningResult(method: string, success: boolean, score: number): void {
    this.learningHistory.push({ method, success, score })

    // Update method evaluation based on result
    const evaluation = this.methodEvaluations.get(method)
    if (evaluation) {
      // Adjust effectiveness slightly based on result
      evaluation.effectiveness = evaluation.effectiveness * 0.9 + (success ? 0.1 : 0)
    }
  }

  /**
   * Age knowledge
   */
  ageKnowledge(patternId: string): void {
    const current = this.knowledgeAge.get(patternId) || 0
    this.knowledgeAge.set(patternId, current + 1)
  }

  /**
   * Get meta-learning report
   */
  getMetaLearningReport(): {
    bestMethods: Array<{ method: string; effectiveness: number }>
    overtittingRisk: string
    recommendedActions: string[]
    learningVelocity: number
  } {
    const sorted = Array.from(this.methodEvaluations.values())
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 3)

    const overfitting = this.trainingMetrics.length > 0
      ? this.trainingMetrics[this.trainingMetrics.length - 1].trainAccuracy -
        this.trainingMetrics[this.trainingMetrics.length - 1].testAccuracy
      : 0

    const recommendations: string[] = []
    if (overfitting > 0.15) {
      recommendations.push('Apply regularization to prevent overfitting')
    }

    const velocity = this.trainingMetrics.length > 5
      ? (this.trainingMetrics[this.trainingMetrics.length - 1].testAccuracy -
         this.trainingMetrics[this.trainingMetrics.length - 6].testAccuracy) / 5
      : 0

    return {
      bestMethods: sorted.map(m => ({ method: m.method, effectiveness: m.effectiveness })),
      overtittingRisk: overfitting > 0.2 ? 'High' : overfitting > 0.1 ? 'Medium' : 'Low',
      recommendedActions: recommendations,
      learningVelocity: velocity,
    }
  }
}

export default MetaLearningEngine
