/**
 * ML Optimizer
 * Machine learning-based optimization for operation selection and routing
 * Predicts best operations and composition patterns based on historical data
 */

import { listOperations } from './operations.js'

// ============================================================================
// ML TYPES
// ============================================================================

export interface OperationMetrics {
  name: string
  avgDuration: number
  successRate: number
  errorRate: number
  usageCount: number
}

export interface CompositionPattern {
  operations: string[]
  frequency: number
  avgDuration: number
  successRate: number
  score: number
}

export interface OptimizationSuggestion {
  type: 'operation' | 'composition' | 'caching' | 'parallelization'
  target: string | string[]
  expectedImprovement: number
  confidence: number
  reason: string
}

// ============================================================================
// ML OPTIMIZER
// ============================================================================

export class MLOptimizer {
  private operationMetrics: Map<string, OperationMetrics> = new Map()
  private compositionPatterns: Map<string, CompositionPattern> = new Map()
  private trainingData: Array<{
    operation: string
    duration: number
    success: boolean
    timestamp: Date
  }> = []

  constructor() {
    this.initializeMetrics()
  }

  /**
   * Initialize metrics for all operations
   */
  private initializeMetrics(): void {
    const operations = listOperations()
    for (const op of operations) {
      this.operationMetrics.set(op, {
        name: op,
        avgDuration: 0,
        successRate: 100,
        errorRate: 0,
        usageCount: 0
      })
    }
  }

  /**
   * Record operation execution for training
   */
  recordExecution(operation: string, duration: number, success: boolean): void {
    this.trainingData.push({
      operation,
      duration,
      success,
      timestamp: new Date()
    })

    // Update metrics
    const metrics = this.operationMetrics.get(operation)
    if (metrics) {
      metrics.usageCount++
      metrics.avgDuration = (metrics.avgDuration * (metrics.usageCount - 1) + duration) / metrics.usageCount

      if (success) {
        metrics.successRate = ((metrics.successRate * (metrics.usageCount - 1) + 100) / metrics.usageCount)
      } else {
        metrics.errorRate = ((metrics.errorRate * (metrics.usageCount - 1) + 100) / metrics.usageCount)
        metrics.successRate = 100 - metrics.errorRate
      }
    }

    // Keep training data manageable
    if (this.trainingData.length > 10000) {
      this.trainingData = this.trainingData.slice(-5000)
    }
  }

  /**
   * Find best operation for goal
   */
  findBestOperation(goal: string, options?: string[]): string | undefined {
    const candidates = options || listOperations()
    if (candidates.length === 0) return undefined

    let best: string | undefined
    let bestScore = -Infinity

    for (const op of candidates) {
      const score = this.scoreOperation(op, goal)
      if (score > bestScore) {
        bestScore = score
        best = op
      }
    }

    return best
  }

  /**
   * Score an operation for a goal
   */
  private scoreOperation(operation: string, goal: string): number {
    const metrics = this.operationMetrics.get(operation)
    if (!metrics) return -Infinity

    // Simple scoring: faster + more reliable = higher score
    const speedScore = 1 / (1 + metrics.avgDuration / 100) // Inverted duration (faster = higher)
    const reliabilityScore = metrics.successRate / 100

    // Weight based on relevance to goal
    const relevanceScore = operation.includes(goal) ? 1.5 : 1.0

    return (speedScore * 0.4 + reliabilityScore * 0.6) * relevanceScore
  }

  /**
   * Discover optimal composition patterns
   */
  discoverPatterns(): CompositionPattern[] {
    const patterns: Map<string, CompositionPattern> = new Map()

    // Analyze recent operations for patterns
    const recentOps = this.trainingData.slice(-1000)

    for (let i = 0; i < recentOps.length - 1; i++) {
      const key = `${recentOps[i].operation}->${recentOps[i + 1].operation}`
      const pattern = patterns.get(key) || {
        operations: [recentOps[i].operation, recentOps[i + 1].operation],
        frequency: 0,
        avgDuration: 0,
        successRate: 0,
        score: 0
      }

      pattern.frequency++
      pattern.avgDuration = (pattern.avgDuration + recentOps[i].duration) / 2
      pattern.successRate = (pattern.successRate * (pattern.frequency - 1) + (recentOps[i].success ? 100 : 0)) / pattern.frequency
      pattern.score = pattern.frequency * (pattern.successRate / 100) // More frequent + more reliable

      patterns.set(key, pattern)
    }

    return Array.from(patterns.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }

  /**
   * Generate optimization suggestions
   */
  generateSuggestions(): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = []

    // Analyze operations
    const operations = Array.from(this.operationMetrics.values())
      .sort((a, b) => b.usageCount - a.usageCount)

    // Suggest caching for slow, frequently-used operations
    for (const op of operations.slice(0, 5)) {
      if (op.avgDuration > 100 && op.usageCount > 10) {
        suggestions.push({
          type: 'caching',
          target: op.name,
          expectedImprovement: Math.min(90, (op.avgDuration / 100) * 50),
          confidence: Math.min(0.95, op.usageCount / 100),
          reason: `Operation "${op.name}" takes ${op.avgDuration.toFixed(0)}ms and is used frequently`
        })
      }
    }

    // Suggest parallelization for independent operations
    const patterns = this.discoverPatterns()
    for (const pattern of patterns.slice(0, 3)) {
      if (pattern.frequency > 5 && pattern.successRate > 90) {
        suggestions.push({
          type: 'parallelization',
          target: pattern.operations,
          expectedImprovement: 40,
          confidence: pattern.successRate / 100,
          reason: `Pattern "${pattern.operations.join(' → ')}" is reliable and frequent`
        })
      }
    }

    // Suggest avoiding unreliable operations
    for (const op of operations) {
      if (op.errorRate > 10 && op.usageCount > 5) {
        suggestions.push({
          type: 'operation',
          target: op.name,
          expectedImprovement: op.errorRate,
          confidence: op.usageCount / 100,
          reason: `Operation "${op.name}" has ${op.errorRate.toFixed(1)}% error rate`
        })
      }
    }

    return suggestions.sort((a, b) => b.expectedImprovement * b.confidence - a.expectedImprovement * a.confidence)
  }

  /**
   * Predict operation success likelihood
   */
  predictSuccess(operation: string): number {
    const metrics = this.operationMetrics.get(operation)
    return metrics ? metrics.successRate / 100 : 0.5
  }

  /**
   * Estimate operation duration
   */
  estimateDuration(operation: string): number {
    const metrics = this.operationMetrics.get(operation)
    return metrics ? metrics.avgDuration : 0
  }

  /**
   * Get operation statistics
   */
  getOperationStats(operation: string): OperationMetrics | undefined {
    return this.operationMetrics.get(operation)
  }

  /**
   * Get all operation statistics
   */
  getAllStats(): OperationMetrics[] {
    return Array.from(this.operationMetrics.values())
      .sort((a, b) => b.usageCount - a.usageCount)
  }

  /**
   * Train model (batch update from external data)
   */
  train(trainingExamples: Array<{ operation: string; duration: number; success: boolean }>): void {
    for (const example of trainingExamples) {
      this.recordExecution(example.operation, example.duration, example.success)
    }
  }

  /**
   * Get model accuracy (%)
   */
  getModelAccuracy(): number {
    if (this.trainingData.length < 10) return 0

    // Simple accuracy: how many predictions matched actual outcomes
    let correct = 0
    for (const data of this.trainingData.slice(-100)) {
      const predicted = this.predictSuccess(data.operation) > 0.5
      if (predicted === data.success) {
        correct++
      }
    }

    return (correct / Math.min(100, this.trainingData.length)) * 100
  }
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

export const mlOptimizer = new MLOptimizer()

/**
 * Find best operation (global)
 */
export function findBestOperation(goal: string, options?: string[]): string | undefined {
  return mlOptimizer.findBestOperation(goal, options)
}

/**
 * Get optimization suggestions (global)
 */
export function getSuggestions(): OptimizationSuggestion[] {
  return mlOptimizer.generateSuggestions()
}

/**
 * Record execution (global)
 */
export function recordExecution(operation: string, duration: number, success: boolean): void {
  mlOptimizer.recordExecution(operation, duration, success)
}

export default {
  MLOptimizer,
  mlOptimizer,
  findBestOperation,
  getSuggestions,
  recordExecution
}
