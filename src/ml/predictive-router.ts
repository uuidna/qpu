/**
 * Predictive Router - ML-based operation routing and optimization
 * Routes requests to optimal operations based on learned patterns
 */

import { metricsCollector } from '../core/observability.js'

// ============================================================================
// PREDICTION MODELS
// ============================================================================

export interface OperationProfile {
  operation: string
  avgLatency: number
  p95Latency: number
  errorRate: number
  throughput: number
  costPerRequest: number
  successRate: number
  resourceIntensity: 'low' | 'medium' | 'high' // CPU/memory usage
  affinity?: string[] // works best with these operations
}

export interface RoutingDecision {
  recommendedOperation: string
  alternativeOperations: string[]
  confidence: number // 0-1
  reasoning: string
  expectedLatency: number
  expectedCost: number
}

export interface TrainingData {
  timestamp: number
  operation: string
  inputCharacters: number
  outputCharacters: number
  latency: number
  success: boolean
  cost: number
  userTier: string
  timeOfDay: number // hour 0-23
  dayOfWeek: number // 0-6
}

export interface PredictionModel {
  operation: string
  version: number
  trainedAt: number
  accuracy: number // 0-1
  samples: number
  features: {
    avgLatencyByInputSize: Map<number, number>
    avgLatencyByTimeOfDay: Map<number, number>
    errorRateByUserTier: Map<string, number>
    costByOperation: number
  }
}

// ============================================================================
// PREDICTIVE ROUTER
// ============================================================================

export class PredictiveRouter {
  private profiles = new Map<string, OperationProfile>()
  private models = new Map<string, PredictionModel>()
  private trainingBuffer: TrainingData[] = []
  private lastTrainTime = Date.now()
  private trainInterval = 3600000 // Train every hour
  private modelVersion = 0

  /**
   * Initialize router with operation profiles
   */
  async initialize(operations: string[]): Promise<void> {
    for (const op of operations) {
      this.profiles.set(op, {
        operation: op,
        avgLatency: 50,
        p95Latency: 100,
        errorRate: 0.01,
        throughput: 100,
        costPerRequest: 0.0001,
        successRate: 0.99,
        resourceIntensity: 'medium'
      })

      this.models.set(op, {
        operation: op,
        version: 1,
        trainedAt: Date.now(),
        accuracy: 0.8,
        samples: 0,
        features: {
          avgLatencyByInputSize: new Map(),
          avgLatencyByTimeOfDay: new Map(),
          errorRateByUserTier: new Map(),
          costByOperation: 0.0001
        }
      })
    }

    // Start periodic training
    setInterval(() => this.train(), this.trainInterval)
  }

  /**
   * Predict best operation for request
   */
  async predict(
    goal: string,
    inputSize: number,
    userTier: 'free' | 'pro' | 'enterprise' = 'pro',
    latencyBudget = 500
  ): Promise<RoutingDecision> {
    const candidates = await this.getCandidates(goal)

    if (candidates.length === 0) {
      throw new Error(`No operations match goal: ${goal}`)
    }

    // Score each candidate
    const scores = candidates.map(op => ({
      operation: op,
      score: this.scoreOperation(op, inputSize, userTier, latencyBudget),
      profile: this.profiles.get(op)!
    }))

    // Sort by score
    scores.sort((a, b) => b.score - a.score)

    const best = scores[0]
    const alternatives = scores.slice(1, 4).map(s => s.operation)

    return {
      recommendedOperation: best.operation,
      alternativeOperations: alternatives,
      confidence: this.calculateConfidence(best.operation),
      reasoning: this.generateReasoning(best.operation, goal),
      expectedLatency: best.profile!.avgLatency,
      expectedCost: best.profile!.costPerRequest
    }
  }

  /**
   * Score operation based on multiple factors
   */
  private scoreOperation(
    operation: string,
    inputSize: number,
    userTier: string,
    latencyBudget: number
  ): number {
    const profile = this.profiles.get(operation)
    if (!profile) return 0

    const model = this.models.get(operation)
    if (!model) return 0

    let score = 100

    // Latency penalty (most important)
    const latencyPenalty = Math.max(0, profile.avgLatency - latencyBudget) / 100
    score -= latencyPenalty * 40

    // Cost efficiency for free tier
    if (userTier === 'free') {
      score -= profile.costPerRequest * 1000 * 30 // Penalize expensive ops
    }

    // Success rate bonus
    score += profile.successRate * 20

    // Resource intensity (prefer less intensive)
    const resourcePenalty = {
      low: 0,
      medium: 5,
      high: 15
    }
    score -= resourcePenalty[profile.resourceIntensity]

    // Input size fit (prefer ops optimized for this size)
    const sizeOptimality = this.calculateSizeOptimality(operation, inputSize)
    score += sizeOptimality * 10

    return Math.max(0, score)
  }

  /**
   * Calculate how well operation handles input size
   */
  private calculateSizeOptimality(operation: string, inputSize: number): number {
    const model = this.models.get(operation)
    if (!model) return 0.5

    const sizeLatencies = model.features.avgLatencyByInputSize
    if (sizeLatencies.size === 0) return 0.5

    // Find closest size in training data
    let closestSize = Array.from(sizeLatencies.keys())[0]
    let minDiff = Math.abs(closestSize - inputSize)

    for (const size of sizeLatencies.keys()) {
      const diff = Math.abs(size - inputSize)
      if (diff < minDiff) {
        minDiff = diff
        closestSize = size
      }
    }

    // Optimize for similar sizes
    const latency = sizeLatencies.get(closestSize) || 50
    return Math.max(0.1, 1 - latency / 500)
  }

  /**
   * Get candidate operations for goal
   */
  private async getCandidates(goal: string): Promise<string[]> {
    // Simple goal matching - in production, use semantic similarity
    const goalKeywords = goal.toLowerCase().split(' ')
    const candidates: string[] = []

    for (const [op, profile] of this.profiles) {
      const opKeywords = op.toLowerCase().split(/[-_]/)

      // Match if any keyword matches
      const matches = goalKeywords.some(gk =>
        opKeywords.some(ok => ok.includes(gk) || gk.includes(ok))
      )

      if (matches || candidates.length < 3) {
        candidates.push(op)
      }
    }

    return candidates.length > 0 ? candidates : Array.from(this.profiles.keys())
  }

  /**
   * Calculate model confidence
   */
  private calculateConfidence(operation: string): number {
    const model = this.models.get(operation)
    if (!model) return 0.5

    // Confidence based on training samples and accuracy
    const sampleConfidence = Math.min(model.samples / 10000, 1)
    const accuracyConfidence = model.accuracy

    return (sampleConfidence * 0.5 + accuracyConfidence * 0.5)
  }

  /**
   * Generate human-readable reasoning
   */
  private generateReasoning(operation: string, goal: string): string {
    const profile = this.profiles.get(operation)
    if (!profile) return 'No profile available'

    const reasons: string[] = []

    if (profile.avgLatency < 100) {
      reasons.push('low latency')
    }

    if (profile.errorRate < 0.01) {
      reasons.push('high reliability')
    }

    if (profile.successRate > 0.99) {
      reasons.push('excellent success rate')
    }

    if (profile.costPerRequest < 0.0005) {
      reasons.push('cost-effective')
    }

    return `Recommended for "${goal}": ${reasons.join(', ')}`
  }

  /**
   * Record training data
   */
  recordExecution(data: TrainingData): void {
    this.trainingBuffer.push(data)

    // Train when buffer is full
    if (this.trainingBuffer.length >= 1000) {
      this.train()
    }
  }

  /**
   * Train models on collected data
   */
  private async train(): Promise<void> {
    if (this.trainingBuffer.length === 0) {
      return
    }

    const data = this.trainingBuffer.splice(0, this.trainingBuffer.length)
    this.modelVersion++

    // Group by operation
    const byOperation = new Map<string, TrainingData[]>()
    for (const record of data) {
      if (!byOperation.has(record.operation)) {
        byOperation.set(record.operation, [])
      }
      byOperation.get(record.operation)!.push(record)
    }

    // Update models
    for (const [op, records] of byOperation) {
      await this.updateModel(op, records)
    }

    this.lastTrainTime = Date.now()
  }

  /**
   * Update model with new data
   */
  private async updateModel(operation: string, data: TrainingData[]): Promise<void> {
    const model = this.models.get(operation)
    if (!model) return

    const profile = this.profiles.get(operation)
    if (!profile) return

    // Update latency buckets
    const latenciesBySize = new Map<number, number[]>()
    const latenciesByTime = new Map<number, number[]>()
    const errorsByTier = new Map<string, number[]>()
    let totalCost = 0

    for (const record of data) {
      // Bucket by input size (round to nearest 1000)
      const sizeBucket = Math.round(record.inputCharacters / 1000) * 1000
      if (!latenciesBySize.has(sizeBucket)) {
        latenciesBySize.set(sizeBucket, [])
      }
      latenciesBySize.get(sizeBucket)!.push(record.latency)

      // Bucket by time of day
      if (!latenciesByTime.has(record.timeOfDay)) {
        latenciesByTime.set(record.timeOfDay, [])
      }
      latenciesByTime.get(record.timeOfDay)!.push(record.latency)

      // Error rate by tier
      if (!errorsByTier.has(record.userTier)) {
        errorsByTier.set(record.userTier, [])
      }
      errorsByTier.get(record.userTier)!.push(record.success ? 0 : 1)

      totalCost += record.cost
    }

    // Update model features
    const avgLatencies: number[] = []
    for (const [size, latencies] of latenciesBySize) {
      const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length
      model.features.avgLatencyByInputSize.set(size, avg)
      avgLatencies.push(avg)
    }

    for (const [time, latencies] of latenciesByTime) {
      const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length
      model.features.avgLatencyByTimeOfDay.set(time, avg)
    }

    for (const [tier, errors] of errorsByTier) {
      const errorRate = errors.reduce((a, b) => a + b, 0) / errors.length
      model.features.errorRateByUserTier.set(tier, errorRate)
    }

    // Update profile with new statistics
    profile.avgLatency = avgLatencies.length > 0
      ? avgLatencies.reduce((a, b) => a + b, 0) / avgLatencies.length
      : profile.avgLatency
    profile.costPerRequest = totalCost / Math.max(data.length, 1)
    profile.errorRate = 1 - (data.filter(d => d.success).length / Math.max(data.length, 1))
    profile.successRate = 1 - profile.errorRate

    // Update model metadata
    model.version = this.modelVersion
    model.trainedAt = Date.now()
    model.samples += data.length
    model.accuracy = Math.min(0.95, 0.7 + (data.length / 10000) * 0.25)
  }

  /**
   * Get all operation profiles
   */
  getProfiles(): Map<string, OperationProfile> {
    return this.profiles
  }

  /**
   * Get model info
   */
  getModelInfo(operation: string): PredictionModel | undefined {
    return this.models.get(operation)
  }

  /**
   * Get router stats
   */
  getStats() {
    return {
      modelVersion: this.modelVersion,
      lastTrained: this.lastTrainTime,
      trainingBufferSize: this.trainingBuffer.length,
      modelsCount: this.models.size,
      profilesCount: this.profiles.size
    }
  }
}

export const predictiveRouter = new PredictiveRouter()
