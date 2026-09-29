/**
 * Phase 12e: Ensemble Methods
 * Combine multiple optimization strategies for better results
 */

export interface Strategy {
  id: string
  name: string
  type: 'aggressive' | 'conservative' | 'balanced' | 'adaptive'
  successRate: number
  avgImprovement: number
}

export interface EnsembleVote {
  strategyId: string
  recommendation: string
  confidence: number
}

export interface EnsembleDecision {
  recommendation: string
  consensus: number
  strategies: EnsembleVote[]
  confidence: number
}

export class EnsembleOptimizer {
  private strategies: Map<string, Strategy> = new Map()
  private decisions: EnsembleDecision[] = []
  private weights: Map<string, number> = new Map()

  /**
   * Initialize optimization strategies
   */
  async initializeStrategies(): Promise<Strategy[]> {
    const strategies: Strategy[] = [
      {
        id: 'strategy-aggressive',
        name: 'Aggressive Optimization',
        type: 'aggressive',
        successRate: 0.75,
        avgImprovement: 35,
      },
      {
        id: 'strategy-conservative',
        name: 'Conservative Optimization',
        type: 'conservative',
        successRate: 0.92,
        avgImprovement: 12,
      },
      {
        id: 'strategy-balanced',
        name: 'Balanced Optimization',
        type: 'balanced',
        successRate: 0.85,
        avgImprovement: 22,
      },
      {
        id: 'strategy-adaptive',
        name: 'Adaptive Optimization',
        type: 'adaptive',
        successRate: 0.88,
        avgImprovement: 28,
      },
    ]

    for (const strategy of strategies) {
      this.strategies.set(strategy.id, strategy)
      // Initialize equal weights
      this.weights.set(strategy.id, 0.25)
    }

    return strategies
  }

  /**
   * Get votes from all strategies
   */
  getStrategyVotes(context: { metric: string; currentValue: number; target: number }): EnsembleVote[] {
    const votes: EnsembleVote[] = []

    for (const strategy of this.strategies.values()) {
      const gap = context.target - context.currentValue
      let recommendation = 'maintain'
      let confidence = 0

      if (strategy.type === 'aggressive' && gap > 20) {
        recommendation = 'aggressive-optimization'
        confidence = Math.min(100, gap / 10)
      } else if (strategy.type === 'conservative') {
        recommendation = 'gentle-improvement'
        confidence = strategy.successRate * 100
      } else if (strategy.type === 'balanced') {
        recommendation = 'balanced-approach'
        confidence = (strategy.successRate + strategy.avgImprovement / 50) * 50
      } else if (strategy.type === 'adaptive') {
        recommendation = 'context-aware-optimization'
        confidence = (strategy.successRate * (1 + strategy.avgImprovement / 100)) * 100
      }

      votes.push({
        strategyId: strategy.id,
        recommendation,
        confidence: Math.min(100, confidence),
      })
    }

    return votes
  }

  /**
   * Make ensemble decision
   */
  async makeDecision(context: {
    metric: string
    currentValue: number
    target: number
    riskTolerance: 'low' | 'medium' | 'high'
  }): Promise<EnsembleDecision> {
    const votes = this.getStrategyVotes(context)

    // Weight votes by strategy performance
    let weightedVotes: Array<{ recommendation: string; score: number }> = []

    for (const vote of votes) {
      const weight = this.weights.get(vote.strategyId) || 0.25
      weightedVotes.push({
        recommendation: vote.recommendation,
        score: vote.confidence * weight,
      })
    }

    // Group by recommendation and sum scores
    const recommendations = new Map<string, number>()
    for (const { recommendation, score } of weightedVotes) {
      recommendations.set(recommendation, (recommendations.get(recommendation) || 0) + score)
    }

    // Get top recommendation
    let topRecommendation = 'maintain'
    let topScore = 0

    for (const [rec, score] of recommendations.entries()) {
      if (score > topScore) {
        topScore = score
        topRecommendation = rec
      }
    }

    // Calculate consensus (how much agreement)
    const consensus = Math.min(100, topScore / votes.length)

    // Adjust for risk tolerance
    let finalConfidence = (topScore / votes.length) * 100
    if (context.riskTolerance === 'low' && topRecommendation.includes('aggressive')) {
      finalConfidence *= 0.7
    } else if (context.riskTolerance === 'high' && topRecommendation.includes('gentle')) {
      finalConfidence *= 1.2
    }

    const decision: EnsembleDecision = {
      recommendation: topRecommendation,
      consensus,
      strategies: votes,
      confidence: Math.min(100, finalConfidence),
    }

    this.decisions.push(decision)
    return decision
  }

  /**
   * Update strategy weights based on outcomes
   */
  updateWeights(strategyId: string, outcome: number): void {
    const currentWeight = this.weights.get(strategyId) || 0.25
    const newWeight = currentWeight * (1 + (outcome - 0.5) * 0.1) // Adjust by outcome
    const adjustedWeight = Math.max(0.1, Math.min(0.4, newWeight)) // Keep in reasonable range

    // Normalize weights to sum to 1
    let totalWeight = 0
    for (const weight of this.weights.values()) {
      totalWeight += weight
    }

    const scaleFactor = (totalWeight - currentWeight + adjustedWeight) / totalWeight

    for (const [id, weight] of this.weights.entries()) {
      if (id === strategyId) {
        this.weights.set(id, adjustedWeight)
      } else {
        this.weights.set(id, weight / scaleFactor)
      }
    }
  }

  /**
   * Get ensemble statistics
   */
  getStats(): {
    totalDecisions: number
    averageConsensus: number
    averageConfidence: number
    strategyWeights: Record<string, number>
  } {
    let totalConsensus = 0
    let totalConfidence = 0

    for (const decision of this.decisions) {
      totalConsensus += decision.consensus
      totalConfidence += decision.confidence
    }

    const weights: Record<string, number> = {}
    for (const [id, weight] of this.weights.entries()) {
      weights[id] = weight
    }

    return {
      totalDecisions: this.decisions.length,
      averageConsensus:
        this.decisions.length > 0 ? totalConsensus / this.decisions.length : 0,
      averageConfidence:
        this.decisions.length > 0 ? totalConfidence / this.decisions.length : 0,
      strategyWeights: weights,
    }
  }

  /**
   * Get ensemble diversity (how different strategies are)
   */
  getDiversity(): {
    diversity: number
    explanation: string
  } {
    if (this.decisions.length === 0) {
      return { diversity: 0, explanation: 'No decisions yet' }
    }

    // Calculate variance in confidence scores from last 10 decisions
    const recentDecisions = this.decisions.slice(-10)
    const confidences = recentDecisions.map(d => {
      const avg = recentDecisions.reduce((sum, d2) => sum + d2.confidence, 0) / recentDecisions.length
      return Math.pow(d.confidence - avg, 2)
    })

    const variance = confidences.reduce((a, b) => a + b, 0) / confidences.length
    const diversity = Math.sqrt(variance)

    let explanation = 'Low diversity'
    if (diversity > 20) explanation = 'High diversity - strategies often disagree'
    else if (diversity > 10) explanation = 'Moderate diversity - some disagreement'

    return { diversity, explanation }
  }
}

export default EnsembleOptimizer
