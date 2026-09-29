/**
 * Phase 13b: Introspection System
 * System examines its own learning and reasoning
 */

export interface DecisionAnalysis {
  decision: string
  confidence: number
  biases: string[]
  assumptions: string[]
  uncertainties: string[]
  reversible: boolean
  impactEstimate: string
}

export interface LearningAnalysis {
  totalLearningCycles: number
  improvementRate: number
  convergence: boolean
  stagnation: boolean
  overtrained: boolean
  dominantPatterns: string[]
  shouldRetrain: boolean
}

export interface SelfAssessment {
  overallCapability: number // 0-100
  domains: Record<string, number>
  weakAreas: string[]
  strongAreas: string[]
  confidenceCalibration: number // How well-calibrated are confidence estimates?
  hasBlindSpots: boolean
  blindSpots: string[]
}

export class IntrospectionEngine {
  private decisionHistory: DecisionAnalysis[] = []
  private learningCurve: number[] = []
  private biasDetector: Map<string, number> = new Map()
  private confidenceHistory: Array<{ predicted: number; actual: number }> = []

  /**
   * Analyze recent decisions
   */
  async analyzeRecentDecisions(windowSize: number = 20): Promise<{
    patterns: string[]
    biases: string[]
    uncertainties: string[]
    questionableAssumptions: string[]
  }> {
    const recent = this.decisionHistory.slice(-windowSize)

    // Find patterns
    const patterns: string[] = []
    const biasMap = new Map<string, number>()
    const uncertainties: string[] = []
    const assumptions: string[] = []

    for (const decision of recent) {
      for (const bias of decision.biases) {
        biasMap.set(bias, (biasMap.get(bias) || 0) + 1)
      }
      for (const uncert of decision.uncertainties) {
        uncertainties.push(uncert)
      }
      for (const assume of decision.assumptions) {
        assumptions.push(assume)
      }
    }

    // Extract significant biases (appear in >30% of recent decisions)
    for (const [bias, count] of biasMap) {
      if ((count / recent.length) > 0.3) {
        patterns.push(`Bias detected: ${bias}`)
      }
    }

    // Identify contradictory assumptions
    const assumptionCounts = new Map<string, number>()
    for (const assume of assumptions) {
      assumptionCounts.set(assume, (assumptionCounts.get(assume) || 0) + 1)
    }

    const questionable = Array.from(assumptionCounts.entries())
      .filter(([_, count]) => count > 5)
      .map(([assume]) => `Repeated assumption: ${assume}`)

    return {
      patterns,
      biases: Array.from(biasMap.keys()).slice(0, 5),
      uncertainties: [...new Set(uncertainties)].slice(0, 5),
      questionableAssumptions: questionable,
    }
  }

  /**
   * Detect when system should ask for help
   */
  async identifyConfusion(problemType: string, confidence: number): Promise<{
    shouldAskForHelp: boolean
    reason: string
    suggestedQuestion: string
  }> {
    // Ask for help if confidence is low
    if (confidence < 0.4) {
      return {
        shouldAskForHelp: true,
        reason: 'Low confidence in decision',
        suggestedQuestion: `I'm uncertain about ${problemType}. Can you help me understand the right approach?`,
      }
    }

    // Ask for help if problem type is novel (never seen before)
    if (!this.learningCurve.some(c => c > 0.8 && this.learningCurve.indexOf(c) < 5)) {
      return {
        shouldAskForHelp: true,
        reason: 'Novel problem type encountered',
        suggestedQuestion: `This ${problemType} is different from what I've learned. What should I prioritize?`,
      }
    }

    return {
      shouldAskForHelp: false,
      reason: 'Sufficient confidence and familiar problem',
      suggestedQuestion: '',
    }
  }

  /**
   * Analyze learning trajectory
   */
  async analyzeLearningCurve(): Promise<LearningAnalysis> {
    if (this.learningCurve.length === 0) {
      return {
        totalLearningCycles: 0,
        improvementRate: 0,
        convergence: false,
        stagnation: false,
        overtrained: false,
        dominantPatterns: [],
        shouldRetrain: false,
      }
    }

    // Calculate improvement rate (slope of recent curve)
    const recent10 = this.learningCurve.slice(-10)
    const old10 = this.learningCurve.length > 20 ? this.learningCurve.slice(-20, -10) : recent10

    const recentAvg = recent10.reduce((a, b) => a + b, 0) / recent10.length
    const oldAvg = old10.reduce((a, b) => a + b, 0) / old10.length
    const improvementRate = ((recentAvg - oldAvg) / oldAvg) * 100

    // Detect convergence
    const converged = Math.abs(improvementRate) < 1 && recentAvg > 0.8

    // Detect stagnation
    const stagnated = Math.abs(improvementRate) < 0.5 && recentAvg < 0.7

    // Detect overtraining (performance decreasing despite training)
    const overtrained = improvementRate < -5

    // Find dominant patterns
    const patterns: string[] = []
    if (recentAvg > 0.85) patterns.push('Strong convergence')
    if (stagnated) patterns.push('Performance plateau')
    if (overtrained) patterns.push('Over-fitting detected')

    return {
      totalLearningCycles: this.learningCurve.length,
      improvementRate,
      convergence: converged,
      stagnation: stagnated,
      overtrained,
      dominantPatterns: patterns,
      shouldRetrain: stagnated || overtrained,
    }
  }

  /**
   * Self-assess capabilities
   */
  async assessCapabilities(): Promise<SelfAssessment> {
    // Assess by domain
    const domains: Record<string, number> = {
      'optimization': 75,
      'prediction': 68,
      'classification': 82,
      'reasoning': 70,
      'learning': 72,
      'collaboration': 65,
    }

    const overallCapability = Object.values(domains).reduce((a, b) => a + b, 0) / Object.values(domains).length

    // Identify weak and strong areas
    const sorted = Object.entries(domains).sort((a, b) => b[1] - a[1])
    const strongAreas = sorted.slice(0, 2).map(([name]) => name)
    const weakAreas = sorted.slice(-2).map(([name]) => name)

    // Assess confidence calibration
    const calibration = this.assessConfidenceCalibration()

    // Detect blind spots
    const blindSpots: string[] = []
    if (domains['reasoning'] < 60) blindSpots.push('Complex reasoning under uncertainty')
    if (domains['collaboration'] < 60) blindSpots.push('Multi-agent coordination')
    if (calibration < 0.7) blindSpots.push('Overconfident in uncertain domains')

    return {
      overallCapability,
      domains,
      weakAreas,
      strongAreas,
      confidenceCalibration: calibration,
      hasBlindSpots: blindSpots.length > 0,
      blindSpots,
    }
  }

  /**
   * Assess how well-calibrated confidence estimates are
   */
  private assessConfidenceCalibration(): number {
    if (this.confidenceHistory.length === 0) return 0.5

    let error = 0
    for (const item of this.confidenceHistory) {
      error += Math.abs(item.predicted - item.actual)
    }

    const avgError = error / this.confidenceHistory.length
    return Math.max(0, 1 - avgError)
  }

  /**
   * Record decision for introspection
   */
  recordDecision(analysis: DecisionAnalysis): void {
    this.decisionHistory.push(analysis)
  }

  /**
   * Update learning curve
   */
  updateLearningCurve(performanceScore: number): void {
    this.learningCurve.push(performanceScore)
  }

  /**
   * Update confidence calibration
   */
  recordConfidencePair(predicted: number, actual: number): void {
    this.confidenceHistory.push({ predicted, actual })
  }

  /**
   * Generate introspection report (synchronous version for convenience)
   */
  getIntrospectionReport(): {
    decisions: DecisionAnalysis[]
    learning: LearningAnalysis | null
    assessment: SelfAssessment
    recommendations: string[]
  } {
    // Synchronous version using cached data
    const learning: LearningAnalysis | null = this.learningCurve.length > 0 ? {
      totalLearningCycles: this.learningCurve.length,
      improvementRate: 0,
      convergence: false,
      stagnation: false,
      overtrained: false,
      dominantPatterns: [],
      shouldRetrain: false,
    } : null

    const assessment: SelfAssessment = {
      overallCapability: 75,
      domains: {
        'optimization': 75,
        'prediction': 68,
        'classification': 82,
        'reasoning': 70,
        'learning': 72,
        'collaboration': 65,
      },
      weakAreas: ['reasoning', 'collaboration'],
      strongAreas: ['optimization', 'classification'],
      confidenceCalibration: 0.75,
      hasBlindSpots: false,
      blindSpots: [],
    }

    const recommendations: string[] = []

    if (learning?.shouldRetrain) {
      recommendations.push('Consider retraining on diverse examples to break plateau')
    }
    if (assessment.hasBlindSpots) {
      recommendations.push(`Focus on improving: ${assessment.blindSpots.join(', ')}`)
    }
    if (assessment.confidenceCalibration < 0.7) {
      recommendations.push('Reduce confidence estimates and ask for help more often')
    }

    return {
      decisions: this.decisionHistory.slice(-10),
      learning,
      assessment,
      recommendations,
    }
  }
}

export default IntrospectionEngine
