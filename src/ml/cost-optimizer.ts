/**
 * Cost Optimizer - Minimize costs while maintaining SLA
 * Dynamically adjusts caching, batching, and resource allocation
 */

import { predictiveRouter } from './predictive-router.js'

// ============================================================================
// COST OPTIMIZATION MODELS
// ============================================================================

export interface CostOptimizationStrategy {
  name: string
  description: string
  estimatedSavings: number // percentage 0-100
  implementationCost: number // CPU/memory overhead
  riskLevel: 'low' | 'medium' | 'high'
  affectedOperations: string[]
  parameters: Record<string, number | boolean | string>
}

export interface CostMetrics {
  timestamp: number
  totalOperations: number
  totalCost: number
  costPerOperation: number
  costByOperation: Record<string, number>
  costByUserTier: Record<string, number>
  costTrend: number // % change from last period
  inefficientOperations: Array<{ operation: string; costRatio: number }>
}

export interface OptimizationTarget {
  maxCostPerRequest: number
  targetSavings: number // percentage
  preserveSLA: boolean
  userTierLimits: Record<string, number> // max cost per tier
}

// ============================================================================
// COST OPTIMIZER
// ============================================================================

export class CostOptimizer {
  private strategies = new Map<string, CostOptimizationStrategy>()
  private activeStrategies = new Set<string>()
  private costHistory: CostMetrics[] = []
  private optimizationHistory: Array<{ timestamp: number; strategyId: string; impact: number }> = []

  constructor() {
    this.initializeStrategies()
  }

  /**
   * Initialize built-in optimization strategies
   */
  private initializeStrategies(): void {
    // Strategy 1: Request batching
    this.strategies.set('batch-requests', {
      name: 'Request Batching',
      description: 'Batch multiple small requests into single large request',
      estimatedSavings: 15,
      implementationCost: 5,
      riskLevel: 'low',
      affectedOperations: ['classifyData', 'extractInfo'],
      parameters: {
        batchSize: 100,
        batchTimeoutMs: 5000,
        minBatchSize: 10
      }
    })

    // Strategy 2: Aggressive caching
    this.strategies.set('aggressive-cache', {
      name: 'Aggressive Caching',
      description: 'Increase cache TTL for frequently accessed data',
      estimatedSavings: 25,
      implementationCost: 10,
      riskLevel: 'medium',
      affectedOperations: ['searchIndex', 'getMetadata'],
      parameters: {
        cacheTTL: 3600000, // 1 hour
        cacheSize: 1000,
        hitRateTarget: 0.85
      }
    })

    // Strategy 3: Operation substitution
    this.strategies.set('operation-swap', {
      name: 'Operation Substitution',
      description: 'Route to cheaper equivalent operations',
      estimatedSavings: 30,
      implementationCost: 8,
      riskLevel: 'medium',
      affectedOperations: ['generateText', 'classifyData'],
      parameters: {
        qualityThreshold: 0.95, // 95% accuracy
        costReduction: 0.3, // 30% cheaper
        enableForFreeTier: true
      }
    })

    // Strategy 4: Time-based routing
    this.strategies.set('time-based-routing', {
      name: 'Time-based Routing',
      description: 'Use different operations at different times',
      estimatedSavings: 20,
      implementationCost: 3,
      riskLevel: 'low',
      affectedOperations: ['generateText', 'classifyData'],
      parameters: {
        peakHours: '9-17', // 9 AM to 5 PM
        offPeakCostReduction: 0.2, // 20% cheaper off-peak
        enableBatchOffPeak: true
      }
    })

    // Strategy 5: Compression
    this.strategies.set('request-compression', {
      name: 'Request Compression',
      description: 'Compress requests/responses to reduce data transfer',
      estimatedSavings: 10,
      implementationCost: 7,
      riskLevel: 'low',
      affectedOperations: [],
      parameters: {
        compressionLevel: 6,
        minSizeToCompress: 1024, // Only compress > 1KB
        algorithm: 'gzip'
      }
    })

    // Strategy 6: Tier-based optimization
    this.strategies.set('tier-optimization', {
      name: 'Tier-based Optimization',
      description: 'Apply stricter optimization for free/pro tiers',
      estimatedSavings: 40,
      implementationCost: 5,
      riskLevel: 'medium',
      affectedOperations: [],
      parameters: {
        freeTierBatchSize: 500,
        proTierBatchSize: 100,
        enterpriseTierBatchSize: 0 // No batching
      }
    })
  }

  /**
   * Analyze costs and recommend optimizations
   */
  async analyzeCosts(metrics: CostMetrics, target: OptimizationTarget): Promise<CostOptimizationStrategy[]> {
    const recommendations: CostOptimizationStrategy[] = []

    // Find inefficient operations
    const inefficient = metrics.inefficientOperations
    if (inefficient.length > 0) {
      // Recommend operation substitution for expensive ops
      if (metrics.costPerOperation > target.maxCostPerRequest) {
        const opSwap = this.strategies.get('operation-swap')
        if (opSwap && !this.activeStrategies.has('operation-swap')) {
          recommendations.push(opSwap)
        }
      }
    }

    // Check if cost trend is negative
    if (metrics.costTrend > 5) {
      // Recommend batching
      const batch = this.strategies.get('batch-requests')
      if (batch && !this.activeStrategies.has('batch-requests')) {
        recommendations.push(batch)
      }

      // Recommend caching
      const cache = this.strategies.get('aggressive-cache')
      if (cache && !this.activeStrategies.has('aggressive-cache')) {
        recommendations.push(cache)
      }
    }

    // Check free tier costs
    const freeTierCost = metrics.costByUserTier['free'] || 0
    if (freeTierCost > (target.userTierLimits['free'] || 100)) {
      const tierOpt = this.strategies.get('tier-optimization')
      if (tierOpt && !this.activeStrategies.has('tier-optimization')) {
        recommendations.push(tierOpt)
      }
    }

    // Always recommend compression for large operations
    const avgSize = metrics.totalCost / metrics.totalOperations
    if (avgSize > 10000) {
      const compress = this.strategies.get('request-compression')
      if (compress && !this.activeStrategies.has('request-compression')) {
        recommendations.push(compress)
      }
    }

    return recommendations
  }

  /**
   * Activate optimization strategy
   */
  async activateStrategy(strategyId: string): Promise<{ success: boolean; impact: number }> {
    const strategy = this.strategies.get(strategyId)
    if (!strategy) {
      return { success: false, impact: 0 }
    }

    // Don't activate high-risk strategies immediately
    if (strategy.riskLevel === 'high') {
      console.warn(`⚠️  Strategy "${strategyId}" is high-risk, requires manual approval`)
      return { success: false, impact: 0 }
    }

    this.activeStrategies.add(strategyId)

    const impact = strategy.estimatedSavings - strategy.implementationCost

    this.optimizationHistory.push({
      timestamp: Date.now(),
      strategyId,
      impact
    })

    console.log(`✅ Activated strategy: ${strategy.name} (estimated ${impact}% net savings)`)

    return { success: true, impact }
  }

  /**
   * Deactivate strategy
   */
  deactivateStrategy(strategyId: string): void {
    this.activeStrategies.delete(strategyId)
  }

  /**
   * Get optimal batch size for operation
   */
  getOptimalBatchSize(operation: string, userTier: string): number {
    // Check if batching is enabled
    const batchStrategy = this.strategies.get('batch-requests')
    if (!this.activeStrategies.has('batch-requests') || !batchStrategy) {
      return 1 // No batching
    }

    // Check tier optimization
    const tierStrategy = this.strategies.get('tier-optimization')
    if (this.activeStrategies.has('tier-optimization') && tierStrategy) {
      const tierBatches: Record<string, number> = {
        free: tierStrategy.parameters['freeTierBatchSize'] as number,
        pro: tierStrategy.parameters['proTierBatchSize'] as number,
        enterprise: tierStrategy.parameters['enterpriseTierBatchSize'] as number
      }

      return tierBatches[userTier] || 100
    }

    return batchStrategy.parameters['batchSize'] as number
  }

  /**
   * Get cache TTL based on strategy
   */
  getCacheTTL(operation: string): number {
    if (!this.activeStrategies.has('aggressive-cache')) {
      return 60000 // Default 1 minute
    }

    const strategy = this.strategies.get('aggressive-cache')
    if (!strategy) return 60000

    return strategy.parameters['cacheTTL'] as number
  }

  /**
   * Should apply compression
   */
  shouldCompress(dataSize: number): boolean {
    if (!this.activeStrategies.has('request-compression')) {
      return false
    }

    const strategy = this.strategies.get('request-compression')
    if (!strategy) return false

    const minSize = strategy.parameters['minSizeToCompress'] as number
    return dataSize > minSize
  }

  /**
   * Get cost adjustment factor
   */
  getCostAdjustment(operation: string, userTier: string, hour: number): number {
    let adjustment = 1.0

    // Time-based adjustment
    if (this.activeStrategies.has('time-based-routing')) {
      const strategy = this.strategies.get('time-based-routing')
      if (strategy) {
        const peakHours = strategy.parameters['peakHours'] as string // "9-17"
        const [startHour, endHour] = peakHours.split('-').map(h => parseInt(h))

        if (hour < startHour || hour > endHour) {
          adjustment *= (1 - (strategy.parameters['offPeakCostReduction'] as number))
        }
      }
    }

    // Tier-based adjustment
    if (this.activeStrategies.has('tier-optimization')) {
      if (userTier === 'free') {
        adjustment *= 0.8 // 20% cost reduction for free tier
      }
    }

    return adjustment
  }

  /**
   * Record cost metrics
   */
  recordMetrics(metrics: CostMetrics): void {
    this.costHistory.push(metrics)

    // Keep last 24 hours
    const oneDayAgo = Date.now() - 86400000
    this.costHistory = this.costHistory.filter(m => m.timestamp > oneDayAgo)
  }

  /**
   * Get cost trend
   */
  getCostTrend(hours = 24): number {
    if (this.costHistory.length < 2) return 0

    const cutoff = Date.now() - hours * 3600000
    const recentMetrics = this.costHistory.filter(m => m.timestamp > cutoff)

    if (recentMetrics.length < 2) return 0

    const first = recentMetrics[0]
    const last = recentMetrics[recentMetrics.length - 1]

    const change = (last.costPerOperation - first.costPerOperation) / first.costPerOperation
    return Math.round(change * 100)
  }

  /**
   * Get optimization summary
   */
  getSummary() {
    const totalSavings = Array.from(this.activeStrategies)
      .map(id => {
        const strategy = this.strategies.get(id)
        return strategy ? strategy.estimatedSavings - strategy.implementationCost : 0
      })
      .reduce((a, b) => a + b, 0)

    return {
      activeStrategies: Array.from(this.activeStrategies).map(id => {
        const s = this.strategies.get(id)
        return { id, name: s?.name, savings: (s?.estimatedSavings || 0) - (s?.implementationCost || 0) }
      }),
      totalEstimatedSavings: Math.round(totalSavings),
      availableStrategies: this.strategies.size,
      recentOptimizations: this.optimizationHistory.slice(-10),
      costTrend: this.getCostTrend()
    }
  }
}

export const costOptimizer = new CostOptimizer()
