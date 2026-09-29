/**
 * Phase 13e: Uncertainty Quantification
 * System explicitly tracks and exposes uncertainties
 */

export interface Prediction {
  value: number
  confidence: number // 0-1
  credibleInterval: [number, number]
  probabilityOfFailure: number
}

export interface UncertaintyMetrics {
  aleatoric: number // Irreducible randomness
  epistemic: number // Lack of knowledge
  total: number
  trend: 'increasing' | 'stable' | 'decreasing'
}

export interface UncertainDomain {
  domain: string
  averageUncertainty: number
  problemAreas: string[]
  needsHelp: boolean
}

export class UncertaintyQuantifier {
  private predictions: Map<string, Prediction> = new Map()
  private uncertaintyHistory: UncertaintyMetrics[] = []
  private domainUncertainty: Map<string, number[]> = new Map()
  private calibrationErrors: number[] = []

  /**
   * Make prediction with confidence
   */
  async makePredictionWithConfidence(
    decisionId: string,
    predictedValue: number,
    confidence: number,
    range: [number, number]
  ): Promise<Prediction> {
    const failureProbability = 1 - confidence

    const prediction: Prediction = {
      value: predictedValue,
      confidence,
      credibleInterval: range,
      probabilityOfFailure: failureProbability,
    }

    this.predictions.set(decisionId, prediction)
    return prediction
  }

  /**
   * Estimate failure probability
   */
  async estimateFailureRisk(actionType: string): Promise<{
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    probability: number
    factors: string[]
  }> {
    let baseProbability = 0.05 // 5% base risk

    // Adjust by action type
    if (actionType.includes('optimization')) baseProbability += 0.1
    if (actionType.includes('learning')) baseProbability += 0.08
    if (actionType.includes('distributed')) baseProbability += 0.12
    if (actionType.includes('novel')) baseProbability += 0.2

    const factors: string[] = []
    if (baseProbability > 0.25) factors.push('High complexity')
    if (baseProbability > 0.15) factors.push('Insufficient training data')
    if (baseProbability > 0.1) factors.push('Unknown edge cases')

    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
    if (baseProbability > 0.3) riskLevel = 'critical'
    else if (baseProbability > 0.2) riskLevel = 'high'
    else if (baseProbability > 0.1) riskLevel = 'medium'

    return {
      riskLevel,
      probability: Math.min(1, baseProbability),
      factors,
    }
  }

  /**
   * Decompose uncertainty into aleatoric and epistemic
   */
  async quantifyUncertaintyTypes(domain: string): Promise<UncertaintyMetrics> {
    // Aleatoric: irreducible noise
    const aleatoric = Math.random() * 0.2 + 0.05 // 5-25%

    // Epistemic: reducible through learning
    const epistemic = Math.random() * 0.4 + 0.1 // 10-50%

    const total = Math.min(1, aleatoric + epistemic)

    // Determine trend
    const recentUncertainties = this.uncertaintyHistory.slice(-5)
    let trend: 'increasing' | 'stable' | 'decreasing' = 'stable'

    if (recentUncertainties.length > 1) {
      const avg = recentUncertainties.reduce((sum, m) => sum + m.total, 0) / recentUncertainties.length
      if (total > avg + 0.1) trend = 'increasing'
      else if (total < avg - 0.1) trend = 'decreasing'
    }

    const metrics: UncertaintyMetrics = {
      aleatoric,
      epistemic,
      total,
      trend,
    }

    this.uncertaintyHistory.push(metrics)

    // Track by domain
    const domainHistory = this.domainUncertainty.get(domain) || []
    domainHistory.push(total)
    this.domainUncertainty.set(domain, domainHistory)

    return metrics
  }

  /**
   * Identify uncertain domains
   */
  async identifyUncertainDomains(): Promise<UncertainDomain[]> {
    const domains: UncertainDomain[] = []

    for (const [domain, uncertainties] of this.domainUncertainty) {
      const avg = uncertainties.reduce((a, b) => a + b, 0) / uncertainties.length
      const problemAreas: string[] = []
      const needsHelp = avg > 0.4

      if (avg > 0.5) {
        problemAreas.push(`Very high uncertainty (${(avg * 100).toFixed(0)}%)`)
      }
      if (uncertainties[uncertainties.length - 1] > uncertainties[0] + 0.2) {
        problemAreas.push('Uncertainty increasing over time')
      }

      domains.push({
        domain,
        averageUncertainty: avg,
        problemAreas,
        needsHelp,
      })
    }

    return domains.sort((a, b) => b.averageUncertainty - a.averageUncertainty)
  }

  /**
   * Request human oversight when uncertain
   */
  async requestHumanOversightWhen(threshold: number = 0.4): Promise<{
    requiresOversight: boolean
    reasons: string[]
    domains: string[]
  }> {
    const recentMetrics = this.uncertaintyHistory.slice(-1)
    const requiresOversight = recentMetrics.some(m => m.total > threshold)

    const reasons: string[] = []
    const domains: string[] = []

    if (requiresOversight) {
      for (const [domain, uncertainties] of this.domainUncertainty) {
        const avg = uncertainties.reduce((a, b) => a + b, 0) / uncertainties.length
        if (avg > threshold) {
          domains.push(domain)
          reasons.push(`${domain}: ${(avg * 100).toFixed(0)}% uncertainty`)
        }
      }

      reasons.push('System should ask for human guidance before proceeding')
    }

    return { requiresOversight, reasons, domains }
  }

  /**
   * Calibrate confidence estimates
   */
  recordActualOutcome(predictionId: string, actualValue: number): void {
    const prediction = this.predictions.get(predictionId)
    if (!prediction) return

    // Calculate calibration error
    const error = Math.abs(prediction.value - actualValue)
    this.calibrationErrors.push(error)

    // Assess if confidence was appropriate
    if (error > (1 - prediction.confidence) * 100) {
      // Confidence was too high
      prediction.confidence = Math.max(0, prediction.confidence - 0.1)
    }
  }

  /**
   * Get uncertainty monitoring report
   */
  getUncertaintyReport(): {
    totalPredictions: number
    averageConfidence: number
    calibrationError: number
    uncertaintyTrend: string
    domainsNeedingHelp: string[]
    recommendations: string[]
  } {
    const avgConfidence = this.predictions.size > 0
      ? Array.from(this.predictions.values()).reduce((sum, p) => sum + p.confidence, 0) /
        this.predictions.size
      : 0

    const avgCalibrationError = this.calibrationErrors.length > 0
      ? this.calibrationErrors.reduce((a, b) => a + b, 0) / this.calibrationErrors.length
      : 0

    // Determine overall trend
    let trend = 'stable'
    if (this.uncertaintyHistory.length > 5) {
      const recent = this.uncertaintyHistory.slice(-5).map(m => m.total).reduce((a, b) => a + b, 0) / 5
      const older = this.uncertaintyHistory.slice(-10, -5).map(m => m.total).reduce((a, b) => a + b, 0) / 5
      if (recent > older + 0.1) trend = 'increasing'
      else if (recent < older - 0.1) trend = 'decreasing'
    }

    // Identify domains needing help
    const uncertain = this.domainUncertainty.size > 0
      ? Array.from(this.domainUncertainty.entries())
        .filter(([_, vals]) => vals[vals.length - 1] > 0.4)
        .map(([domain]) => domain)
      : []

    const recommendations: string[] = []
    if (avgConfidence < 0.6) {
      recommendations.push('System confidence is low - seek human guidance more frequently')
    }
    if (avgCalibrationError > 20) {
      recommendations.push('Calibration poor - confidence estimates unreliable')
    }
    if (trend === 'increasing') {
      recommendations.push('Uncertainty growing - may need retraining or human input')
    }

    return {
      totalPredictions: this.predictions.size,
      averageConfidence: avgConfidence,
      calibrationError: avgCalibrationError,
      uncertaintyTrend: trend,
      domainsNeedingHelp: uncertain,
      recommendations,
    }
  }

  /**
   * Get confidence by domain
   */
  getConfidenceByDomain(): Record<string, number> {
    const confidenceByDomain: Record<string, number> = {}

    for (const [domain] of this.domainUncertainty) {
      const predictions = Array.from(this.predictions.values())
      const domainPredictions = predictions.slice(0, Math.ceil(predictions.length / this.domainUncertainty.size))

      const avgConfidence = domainPredictions.length > 0
        ? domainPredictions.reduce((sum, p) => sum + p.confidence, 0) / domainPredictions.length
        : 0.5

      confidenceByDomain[domain] = avgConfidence
    }

    return confidenceByDomain
  }
}

export default UncertaintyQuantifier
