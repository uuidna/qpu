/**
 * Auto-Scaler - Automatically adjust resources based on demand and anomalies
 * Manages connection pools, cache sizes, and worker allocation
 */

import { anomalyDetector } from '../core/observability.js'

// ============================================================================
// AUTO-SCALING MODELS
// ============================================================================

export type ScalingMetric = 'latency' | 'throughput' | 'errorRate' | 'memory' | 'cpu'

export interface ScalingPolicy {
  metric: ScalingMetric
  scaleUpThreshold: number
  scaleDownThreshold: number
  minResources: number
  maxResources: number
  cooldownPeriod: number // ms before next scaling action
  targetValue?: number
}

export interface ResourceAllocation {
  timestamp: number
  connectionPool: number
  cacheSize: number // MB
  workers: number
  readReplicas: number
  memoryAllocation: number // MB
  cpuAllocation: number // percentage
}

export interface ScalingAction {
  timestamp: number
  metric: ScalingMetric
  direction: 'up' | 'down'
  amount: number
  reason: string
  resultingAllocation: ResourceAllocation
}

export interface PredictedLoad {
  timestamp: number
  expectedThroughput: number // req/s
  expectedLatency: number
  expectedMemory: number // MB
  confidence: number // 0-1
  seasonality: 'peak' | 'normal' | 'low'
}

// ============================================================================
// AUTO-SCALER
// ============================================================================

export class AutoScaler {
  private policies = new Map<ScalingMetric, ScalingPolicy>()
  private currentAllocation: ResourceAllocation
  private allocationHistory: ResourceAllocation[] = []
  private actionHistory: ScalingAction[] = []
  private lastScaleTime = new Map<ScalingMetric, number>()
  private loadPredictions: PredictedLoad[] = []

  constructor() {
    // Initialize with conservative defaults
    this.currentAllocation = {
      timestamp: Date.now(),
      connectionPool: 50,
      cacheSize: 100,
      workers: 4,
      readReplicas: 1,
      memoryAllocation: 512,
      cpuAllocation: 50
    }

    this.initializePolicies()
  }

  /**
   * Initialize scaling policies
   */
  private initializePolicies(): void {
    // Latency scaling
    this.policies.set('latency', {
      metric: 'latency',
      scaleUpThreshold: 100, // ms
      scaleDownThreshold: 30, // ms
      minResources: 2,
      maxResources: 16,
      cooldownPeriod: 300000, // 5 minutes
      targetValue: 50
    })

    // Throughput scaling
    this.policies.set('throughput', {
      metric: 'throughput',
      scaleUpThreshold: 8000, // req/s (80% of 10k)
      scaleDownThreshold: 2000, // req/s (20% of 10k)
      minResources: 1,
      maxResources: 100,
      cooldownPeriod: 300000,
      targetValue: 5000
    })

    // Error rate scaling
    this.policies.set('errorRate', {
      metric: 'errorRate',
      scaleUpThreshold: 0.05, // 5%
      scaleDownThreshold: 0.001, // 0.1%
      minResources: 10,
      maxResources: 100,
      cooldownPeriod: 180000, // 3 minutes
      targetValue: 0.001
    })

    // Memory scaling
    this.policies.set('memory', {
      metric: 'memory',
      scaleUpThreshold: 80, // percentage used
      scaleDownThreshold: 30, // percentage used
      minResources: 256,
      maxResources: 8192,
      cooldownPeriod: 600000, // 10 minutes
      targetValue: 60
    })

    // CPU scaling
    this.policies.set('cpu', {
      metric: 'cpu',
      scaleUpThreshold: 75, // percentage
      scaleDownThreshold: 25, // percentage
      minResources: 10,
      maxResources: 100,
      cooldownPeriod: 300000, // 5 minutes
      targetValue: 50
    })
  }

  /**
   * Evaluate scaling needs
   */
  async evaluateScaling(
    currentMetrics: Record<ScalingMetric, number>
  ): Promise<ScalingAction[]> {
    const actions: ScalingAction[] = []

    for (const [metric, policy] of this.policies) {
      const value = currentMetrics[metric]

      // Check cooldown
      const lastScale = this.lastScaleTime.get(metric) || 0
      const timeSinceLastScale = Date.now() - lastScale
      if (timeSinceLastScale < policy.cooldownPeriod) {
        continue
      }

      // Scale up?
      if (value > policy.scaleUpThreshold) {
        const action = await this.scaleUp(metric, policy, value)
        if (action) actions.push(action)
      }

      // Scale down?
      else if (value < policy.scaleDownThreshold) {
        const action = await this.scaleDown(metric, policy, value)
        if (action) actions.push(action)
      }
    }

    return actions
  }

  /**
   * Scale up resources
   */
  private async scaleUp(
    metric: ScalingMetric,
    policy: ScalingPolicy,
    currentValue: number
  ): Promise<ScalingAction | null> {
    const old = { ...this.currentAllocation }

    // Scale by 50% or to max
    const scaleAmount = 1.5

    switch (metric) {
      case 'latency':
        this.currentAllocation.workers = Math.min(
          policy.maxResources,
          Math.ceil(this.currentAllocation.workers * scaleAmount)
        )
        this.currentAllocation.connectionPool = Math.min(
          300,
          Math.ceil(this.currentAllocation.connectionPool * scaleAmount)
        )
        break

      case 'throughput':
        this.currentAllocation.workers = Math.min(
          policy.maxResources,
          Math.ceil(this.currentAllocation.workers * scaleAmount)
        )
        this.currentAllocation.readReplicas = Math.min(
          16,
          this.currentAllocation.readReplicas + 1
        )
        break

      case 'errorRate':
        this.currentAllocation.connectionPool = Math.min(
          300,
          Math.ceil(this.currentAllocation.connectionPool * 1.2)
        )
        this.currentAllocation.memoryAllocation = Math.min(
          policy.maxResources,
          Math.ceil(this.currentAllocation.memoryAllocation * scaleAmount)
        )
        break

      case 'memory':
        this.currentAllocation.cacheSize = Math.min(
          policy.maxResources,
          Math.ceil(this.currentAllocation.cacheSize * scaleAmount)
        )
        this.currentAllocation.memoryAllocation = Math.min(
          policy.maxResources,
          Math.ceil(this.currentAllocation.memoryAllocation * scaleAmount)
        )
        break

      case 'cpu':
        this.currentAllocation.cpuAllocation = Math.min(
          policy.maxResources,
          Math.ceil(this.currentAllocation.cpuAllocation * scaleAmount)
        )
        this.currentAllocation.workers = Math.min(
          policy.maxResources,
          Math.ceil(this.currentAllocation.workers * scaleAmount)
        )
        break
    }

    this.currentAllocation.timestamp = Date.now()
    this.lastScaleTime.set(metric, Date.now())

    const action: ScalingAction = {
      timestamp: Date.now(),
      metric,
      direction: 'up',
      amount: this.getTotalResourceDiff(old),
      reason: `${metric} exceeded threshold: ${currentValue} > ${policy.scaleUpThreshold}`,
      resultingAllocation: { ...this.currentAllocation }
    }

    this.actionHistory.push(action)
    this.allocationHistory.push(this.currentAllocation)

    return action
  }

  /**
   * Scale down resources
   */
  private async scaleDown(
    metric: ScalingMetric,
    policy: ScalingPolicy,
    currentValue: number
  ): Promise<ScalingAction | null> {
    const old = { ...this.currentAllocation }

    // Scale by 67% (2/3) or to min
    const scaleAmount = 0.67

    switch (metric) {
      case 'latency':
        this.currentAllocation.workers = Math.max(
          policy.minResources,
          Math.floor(this.currentAllocation.workers * scaleAmount)
        )
        this.currentAllocation.connectionPool = Math.max(
          10,
          Math.floor(this.currentAllocation.connectionPool * scaleAmount)
        )
        break

      case 'throughput':
        this.currentAllocation.workers = Math.max(
          policy.minResources,
          Math.floor(this.currentAllocation.workers * scaleAmount)
        )
        this.currentAllocation.readReplicas = Math.max(1, this.currentAllocation.readReplicas - 1)
        break

      case 'errorRate':
        // Don't scale down on low error rates - maintain stability
        return null

      case 'memory':
        this.currentAllocation.cacheSize = Math.max(
          policy.minResources,
          Math.floor(this.currentAllocation.cacheSize * scaleAmount)
        )
        break

      case 'cpu':
        this.currentAllocation.cpuAllocation = Math.max(
          policy.minResources,
          Math.floor(this.currentAllocation.cpuAllocation * scaleAmount)
        )
        break
    }

    this.currentAllocation.timestamp = Date.now()
    this.lastScaleTime.set(metric, Date.now())

    const action: ScalingAction = {
      timestamp: Date.now(),
      metric,
      direction: 'down',
      amount: -this.getTotalResourceDiff(old),
      reason: `${metric} below threshold: ${currentValue} < ${policy.scaleDownThreshold}`,
      resultingAllocation: { ...this.currentAllocation }
    }

    this.actionHistory.push(action)
    this.allocationHistory.push(this.currentAllocation)

    return action
  }

  /**
   * Calculate total resource difference
   */
  private getTotalResourceDiff(old: ResourceAllocation): number {
    const workerDiff = Math.abs(this.currentAllocation.workers - old.workers)
    const memoryDiff = Math.abs(this.currentAllocation.memoryAllocation - old.memoryAllocation) / 256
    const cacheDiff = Math.abs(this.currentAllocation.cacheSize - old.cacheSize) / 100

    return Math.round(workerDiff + memoryDiff + cacheDiff)
  }

  /**
   * Predict future load
   */
  predictLoad(historyHours = 24): PredictedLoad | null {
    if (this.allocationHistory.length === 0) {
      return null
    }

    const cutoff = Date.now() - historyHours * 3600000
    const recent = this.allocationHistory.filter(a => a.timestamp > cutoff)

    if (recent.length === 0) return null

    // Simple extrapolation
    const latest = recent[recent.length - 1]
    const previous = recent[Math.max(0, recent.length - 10)]

    const trend = {
      workers: (latest.workers - previous.workers) / previous.workers,
      memory: (latest.memoryAllocation - previous.memoryAllocation) / previous.memoryAllocation
    }

    const expectedThroughput = 5000 * (1 + trend.workers * 0.5)
    const expectedLatency = 50 * (1 + trend.workers * -0.3)
    const expectedMemory = latest.memoryAllocation * (1 + trend.memory * 0.5)

    const seasonality = this.getSeasonality()

    return {
      timestamp: Date.now(),
      expectedThroughput: Math.round(expectedThroughput),
      expectedLatency: Math.round(expectedLatency),
      expectedMemory: Math.round(expectedMemory),
      confidence: 0.7,
      seasonality
    }
  }

  /**
   * Detect seasonality
   */
  private getSeasonality(): 'peak' | 'normal' | 'low' {
    const hour = new Date().getHours()

    if (hour >= 9 && hour <= 17) {
      return 'peak'
    } else if (hour >= 6 && hour <= 22) {
      return 'normal'
    } else {
      return 'low'
    }
  }

  /**
   * Get current allocation
   */
  getCurrentAllocation(): ResourceAllocation {
    return { ...this.currentAllocation }
  }

  /**
   * Get scaling history
   */
  getHistory(limit = 100): ScalingAction[] {
    return this.actionHistory.slice(-limit)
  }

  /**
   * Get scaling summary
   */
  getSummary() {
    const recentActions = this.actionHistory.slice(-10)
    const upCount = recentActions.filter(a => a.direction === 'up').length
    const downCount = recentActions.filter(a => a.direction === 'down').length

    return {
      currentAllocation: this.currentAllocation,
      recentScaling: { upCount, downCount },
      lastAction: recentActions[recentActions.length - 1],
      prediction: this.predictLoad(),
      seasonality: this.getSeasonality()
    }
  }
}

export const autoScaler = new AutoScaler()
