// Analytics aggregation and processing (WAVE 8C)

import { AnalyticsData, OperationMetrics, MetricValue, Span, StructuredLog } from './types.js'
import { metrics } from './metrics.js'

export class AnalyticsEngine {
  private aggregations: Map<string, AnalyticsData> = new Map() // period -> AnalyticsData
  private costPerOperation: Map<string, number> = new Map() // operation -> cost per invocation
  private slaTargets: Map<string, { availability: number; errorRate: number; p99Latency: number }> =
    new Map()
  private costCallback?: (cost: number, operation: string, duration: number) => Promise<void>

  constructor(config?: {
    costPerOperation?: Map<string, number>
    slaTargets?: Map<string, any>
  }) {
    if (config?.costPerOperation) {
      this.costPerOperation = config.costPerOperation
    }
    if (config?.slaTargets) {
      this.slaTargets = config.slaTargets
    }
  }

  // Set cost calculation callback
  setCostCallback(callback: (cost: number, operation: string, duration: number) => Promise<void>): void {
    this.costCallback = callback
  }

  // Aggregate metrics into analytics data
  async aggregateMetrics(period: 'minute' | 'hour' | 'day' = 'minute'): Promise<AnalyticsData> {
    const timestamp = Date.now()
    const key = this.getPeriodKey(timestamp, period)

    const operationMetrics = new Map<string, OperationMetrics>()
    const topErrors: Array<{ error: string; count: number; lastOccurrence: number }> = []

    // Collect all operation metrics
    const operations = new Set<string>()
    // We would ideally track operations, but for now we can infer from metric names
    // In a real implementation, you'd track this explicitly

    // Calculate cost data
    const costData = {
      operationCosts: new Map<string, number>(),
      totalCost: 0,
      costPerOperation: new Map<string, number>(),
    }

    // For each operation with cost
    for (const [operation, costPerInvocation] of this.costPerOperation.entries()) {
      const opMetrics = metrics.getOperationMetrics(operation)
      if (opMetrics) {
        const operationCost = (opMetrics.count || 0) * costPerInvocation
        costData.operationCosts.set(operation, operationCost)
        costData.totalCost += operationCost
        costData.costPerOperation.set(operation, costPerInvocation)
        operationMetrics.set(operation, opMetrics)
      }
    }

    // Calculate SLA metrics
    let totalRequests = 0
    let totalErrors = 0
    let totalLatency = 0
    const allLatencies: number[] = []

    for (const opMetrics of operationMetrics.values()) {
      totalRequests += opMetrics.count
      totalErrors += opMetrics.errorCount
      totalLatency += opMetrics.totalDuration
      // Approximate latency distribution
      for (let i = 0; i < opMetrics.count; i++) {
        allLatencies.push(opMetrics.avgDuration)
      }
    }

    const slaMetrics = {
      availability: totalRequests > 0 ? 1 - totalErrors / totalRequests : 1,
      errorRate: totalRequests > 0 ? totalErrors / totalRequests : 0,
      p99Latency: this.percentile(allLatencies, 0.99),
    }

    const analyticsData: AnalyticsData = {
      timestamp,
      period,
      metrics: operationMetrics,
      topErrors,
      costData,
      slaMetrics,
    }

    this.aggregations.set(key, analyticsData)

    // Clean up old aggregations (keep last 24 hours worth)
    this.cleanupOldAggregations(period)

    return analyticsData
  }

  // Aggregate spans for tracing analytics
  async aggregateSpans(spans: Span[], period: 'minute' | 'hour' | 'day' = 'minute'): Promise<void> {
    const timestamp = Date.now()
    const key = this.getPeriodKey(timestamp, period)

    const existing = this.aggregations.get(key)
    if (!existing) {
      return
    }

    // Analyze spans for patterns
    const spansByOperation = new Map<string, Span[]>()
    const spansByStatus = { ok: 0, error: 0, unset: 0 }

    for (const span of spans) {
      // Infer operation from span name
      const operation = span.name.split('/')[0] || 'unknown'
      if (!spansByOperation.has(operation)) {
        spansByOperation.set(operation, [])
      }
      spansByOperation.get(operation)!.push(span)
      spansByStatus[span.status]++
    }

    // Calculate span statistics
    for (const [operation, operationSpans] of spansByOperation.entries()) {
      const durations = operationSpans
        .map(s => s.duration || 0)
        .filter(d => d > 0)
        .sort((a, b) => a - b)

      if (durations.length > 0) {
        const existingMetrics = existing.metrics.get(operation)
        if (existingMetrics) {
          // Update with span data
          existingMetrics.p50 = this.percentile(durations, 0.5)
          existingMetrics.p95 = this.percentile(durations, 0.95)
          existingMetrics.p99 = this.percentile(durations, 0.99)
        }
      }
    }
  }

  // Aggregate logs for error analysis
  async aggregateLogs(logs: StructuredLog[], period: 'minute' | 'hour' | 'day' = 'minute'): Promise<void> {
    const timestamp = Date.now()
    const key = this.getPeriodKey(timestamp, period)

    const existing = this.aggregations.get(key)
    if (!existing) {
      return
    }

    // Count errors
    const errorCounts = new Map<string, number>()
    const errorTimes = new Map<string, number>()

    for (const log of logs) {
      if (log.level === 'error' && log.error) {
        const errorMsg = log.error.message
        errorCounts.set(errorMsg, (errorCounts.get(errorMsg) || 0) + 1)
        errorTimes.set(errorMsg, log.timestamp)
      }
    }

    // Update top errors
    existing.topErrors = Array.from(errorCounts.entries())
      .map(([error, count]) => ({
        error,
        count,
        lastOccurrence: errorTimes.get(error) || Date.now(),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 errors
  }

  // Set cost for an operation
  setOperationCost(operation: string, costPerInvocation: number): void {
    this.costPerOperation.set(operation, costPerInvocation)
  }

  // Set SLA target for an operation
  setSLATarget(
    operation: string,
    target: { availability: number; errorRate: number; p99Latency: number }
  ): void {
    this.slaTargets.set(operation, target)
  }

  // Check SLA compliance
  checkSLACompliance(data: AnalyticsData): Array<{
    operation: string
    metric: string
    target: number
    actual: number
    compliant: boolean
  }> {
    const violations: Array<{
      operation: string
      metric: string
      target: number
      actual: number
      compliant: boolean
    }> = []

    if (!data.slaMetrics) {
      return violations
    }

    // Check availability
    for (const [operation, target] of this.slaTargets.entries()) {
      const availability = data.slaMetrics.availability || 0
      if (availability < target.availability) {
        violations.push({
          operation,
          metric: 'availability',
          target: target.availability,
          actual: availability,
          compliant: false,
        })
      }

      // Check error rate
      if (data.slaMetrics.errorRate > target.errorRate) {
        violations.push({
          operation,
          metric: 'errorRate',
          target: target.errorRate,
          actual: data.slaMetrics.errorRate,
          compliant: false,
        })
      }

      // Check p99 latency
      if (data.slaMetrics.p99Latency > target.p99Latency) {
        violations.push({
          operation,
          metric: 'p99Latency',
          target: target.p99Latency,
          actual: data.slaMetrics.p99Latency,
          compliant: false,
        })
      }
    }

    return violations
  }

  // Get cost report for a time range
  getCostReport(startTime: number, endTime: number): {
    period: string
    totalCost: number
    costByOperation: Map<string, number>
    averageCostPerRequest: number
    totalRequests: number
  } {
    let totalCost = 0
    let totalRequests = 0
    const costByOperation = new Map<string, number>()

    // Aggregate all matching periods
    for (const [, data] of this.aggregations.entries()) {
      if (data.timestamp >= startTime && data.timestamp <= endTime && data.costData) {
        totalCost += data.costData.totalCost

        for (const [op, cost] of data.costData.operationCosts.entries()) {
          costByOperation.set(op, (costByOperation.get(op) || 0) + cost)
        }

        for (const metrics of data.metrics.values()) {
          totalRequests += metrics.count
        }
      }
    }

    return {
      period: `${new Date(startTime).toISOString()} - ${new Date(endTime).toISOString()}`,
      totalCost,
      costByOperation,
      averageCostPerRequest: totalRequests > 0 ? totalCost / totalRequests : 0,
      totalRequests,
    }
  }

  // Get historical analytics
  getHistoricalData(limit: number = 100): AnalyticsData[] {
    return Array.from(this.aggregations.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
  }

  // Get analytics for specific period
  getAnalyticsForPeriod(timestamp: number, period: 'minute' | 'hour' | 'day'): AnalyticsData | undefined {
    const key = this.getPeriodKey(timestamp, period)
    return this.aggregations.get(key)
  }

  // Private helper methods

  private getPeriodKey(timestamp: number, period: 'minute' | 'hour' | 'day'): string {
    const date = new Date(timestamp)
    switch (period) {
      case 'minute':
        date.setSeconds(0, 0)
        break
      case 'hour':
        date.setMinutes(0, 0, 0)
        break
      case 'day':
        date.setHours(0, 0, 0, 0)
        break
    }
    return date.toISOString()
  }

  private cleanupOldAggregations(period: 'minute' | 'hour' | 'day'): void {
    const maxAge = period === 'minute' ? 86400000 : period === 'hour' ? 604800000 : 2592000000 // 1 day, 1 week, 30 days
    const cutoff = Date.now() - maxAge

    for (const [key, data] of this.aggregations.entries()) {
      if (data.timestamp < cutoff) {
        this.aggregations.delete(key)
      }
    }
  }

  private percentile(values: number[], p: number): number {
    if (values.length === 0) return 0
    const sorted = [...values].sort((a, b) => a - b)
    const idx = Math.ceil(p * sorted.length) - 1
    return sorted[Math.max(0, idx)]
  }
}

// Global analytics instance
export const analytics = new AnalyticsEngine()
