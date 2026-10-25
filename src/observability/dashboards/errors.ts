// Error tracking and alerting dashboard (WAVE 8C)

import { StructuredLog, AnalyticsData } from '../types.js'
import { analytics } from '../analytics.js'

export interface ErrorMetrics {
  error: string
  count: number
  lastOccurrence: number
  firstOccurrence?: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  affectedOperations: Set<string>
  sampleMessage?: string
  stackTrace?: string
}

export interface ErrorTrend {
  error: string
  timestamp: number
  count: number
  trend: 'increasing' | 'decreasing' | 'stable'
}

export class ErrorDashboard {
  // Generate error metrics
  static generateMetrics(data?: AnalyticsData): ErrorMetrics[] {
    const errorMetrics: Map<string, ErrorMetrics> = new Map()

    if (data?.topErrors) {
      for (const topError of data.topErrors) {
        errorMetrics.set(topError.error, {
          error: topError.error,
          count: topError.count,
          lastOccurrence: topError.lastOccurrence,
          severity: this.determineSeverity(topError.count),
          affectedOperations: new Set(),
        })
      }
    }

    return Array.from(errorMetrics.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 50) // Top 50 errors
  }

  // Generate error rate time series
  static generateErrorRateTimeSeries(minutes: number = 60): Array<{
    timestamp: number
    errorRate: number
    errorCount: number
    totalCount: number
  }> {
    const timeSeries: Array<{
      timestamp: number
      errorRate: number
      errorCount: number
      totalCount: number
    }> = []

    const historical = analytics.getHistoricalData(minutes)
    for (const data of historical) {
      let totalCount = 0
      let errorCount = 0

      for (const [, opMetrics] of data.metrics.entries()) {
        totalCount += opMetrics.count
        errorCount += opMetrics.errorCount
      }

      timeSeries.push({
        timestamp: data.timestamp,
        errorRate: totalCount > 0 ? errorCount / totalCount : 0,
        errorCount,
        totalCount,
      })
    }

    return timeSeries
  }

  // Generate error distribution by operation
  static generateErrorDistribution(): Array<{
    operation: string
    errorCount: number
    totalCount: number
    errorRate: number
    topError?: string
  }> {
    const distribution: Array<{
      operation: string
      errorCount: number
      totalCount: number
      errorRate: number
      topError?: string
    }> = []

    const historical = analytics.getHistoricalData(10)
    const operationErrors = new Map<
      string,
      { errorCount: number; totalCount: number; errors: Map<string, number> }
    >()

    // Aggregate errors by operation
    for (const data of historical) {
      for (const [op, opMetrics] of data.metrics.entries()) {
        const existing = operationErrors.get(op) || {
          errorCount: 0,
          totalCount: 0,
          errors: new Map(),
        }
        existing.errorCount += opMetrics.errorCount
        existing.totalCount += opMetrics.count
        operationErrors.set(op, existing)
      }

      // Add top errors per operation
      for (const topError of data.topErrors) {
        const existing = operationErrors.get('unknown') || {
          errorCount: 0,
          totalCount: 0,
          errors: new Map(),
        }
        existing.errors.set(topError.error, (existing.errors.get(topError.error) || 0) + topError.count)
        operationErrors.set('unknown', existing)
      }
    }

    for (const [operation, errorData] of operationErrors.entries()) {
      const errorRate = errorData.totalCount > 0 ? errorData.errorCount / errorData.totalCount : 0
      let topError: string | undefined

      // Find the most common error
      let maxCount = 0
      for (const [error, count] of errorData.errors.entries()) {
        if (count > maxCount) {
          maxCount = count
          topError = error
        }
      }

      distribution.push({
        operation,
        errorCount: errorData.errorCount,
        totalCount: errorData.totalCount,
        errorRate,
        topError,
      })
    }

    return distribution.sort((a, b) => b.errorRate - a.errorRate)
  }

  // Generate error trends
  static generateErrorTrends(error: string, minutes: number = 60): ErrorTrend[] {
    const trends: ErrorTrend[] = []

    const historical = analytics.getHistoricalData(minutes)
    let previousCount = 0
    let previousTrend: 'increasing' | 'decreasing' | 'stable' = 'stable'

    for (const data of historical) {
      const topError = data.topErrors.find(e => e.error === error)
      const count = topError?.count || 0

      let trend: 'increasing' | 'decreasing' | 'stable'
      if (count > previousCount * 1.1) {
        trend = 'increasing'
      } else if (count < previousCount * 0.9) {
        trend = 'decreasing'
      } else {
        trend = 'stable'
      }

      trends.push({
        error,
        timestamp: data.timestamp,
        count,
        trend,
      })

      previousCount = count
      previousTrend = trend
    }

    return trends
  }

  // Detect anomalies
  static detectAnomalies(
    threshold: number = 2.0
  ): Array<{
    error: string
    count: number
    expectedCount: number
    deviation: number
    severity: 'critical' | 'high' | 'medium'
  }> {
    const anomalies: Array<{
      error: string
      count: number
      expectedCount: number
      deviation: number
      severity: 'critical' | 'high' | 'medium'
    }> = []

    const historical = analytics.getHistoricalData(20)
    const errorStats = new Map<string, { counts: number[]; latest: number }>()

    // Collect error counts over time
    for (const data of historical) {
      for (const topError of data.topErrors) {
        const existing = errorStats.get(topError.error) || { counts: [], latest: 0 }
        existing.counts.push(topError.count)
        existing.latest = topError.count
        errorStats.set(topError.error, existing)
      }
    }

    // Detect anomalies using standard deviation
    for (const [error, stats] of errorStats.entries()) {
      if (stats.counts.length < 3) {
        continue // Need at least 3 data points
      }

      const mean = stats.counts.reduce((a, b) => a + b) / stats.counts.length
      const variance =
        stats.counts.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / stats.counts.length
      const stdDev = Math.sqrt(variance)

      const deviation = stdDev > 0 ? (stats.latest - mean) / stdDev : 0

      if (Math.abs(deviation) > threshold) {
        anomalies.push({
          error,
          count: stats.latest,
          expectedCount: mean,
          deviation: Math.abs(deviation),
          severity: deviation > 3 ? 'critical' : deviation > 2 ? 'high' : 'medium',
        })
      }
    }

    return anomalies.sort((a, b) => b.deviation - a.deviation)
  }

  // Generate alert summary
  static generateAlertSummary(): {
    criticalErrors: number
    highErrors: number
    mediumErrors: number
    totalErrors: number
    errorRate: number
    recommendedActions: string[]
  } {
    const current = analytics.getHistoricalData(1)[0]
    if (!current) {
      return {
        criticalErrors: 0,
        highErrors: 0,
        mediumErrors: 0,
        totalErrors: 0,
        errorRate: 0,
        recommendedActions: [],
      }
    }

    const errorMetrics = this.generateMetrics(current)
    const anomalies = this.detectAnomalies(2.0)

    const critical = errorMetrics.filter(e => e.severity === 'critical').length
    const high = errorMetrics.filter(e => e.severity === 'high').length
    const medium = errorMetrics.filter(e => e.severity === 'medium').length
    const total = errorMetrics.length

    let errorRate = 0
    let totalRequests = 0
    let totalErrors = 0

    for (const [, opMetrics] of current.metrics.entries()) {
      totalRequests += opMetrics.count
      totalErrors += opMetrics.errorCount
    }

    if (totalRequests > 0) {
      errorRate = totalErrors / totalRequests
    }

    const recommendedActions: string[] = []

    if (critical > 0) {
      recommendedActions.push(`Investigate ${critical} critical errors immediately`)
    }

    if (anomalies.length > 0) {
      const criticalAnomalies = anomalies.filter(a => a.severity === 'critical')
      if (criticalAnomalies.length > 0) {
        recommendedActions.push(`Alert: ${criticalAnomalies.length} anomalies detected`)
      }
    }

    if (errorRate > 0.05) {
      recommendedActions.push(`Error rate is ${(errorRate * 100).toFixed(2)}% - consider scaling or optimization`)
    }

    if (recommendedActions.length === 0) {
      recommendedActions.push('System operating normally')
    }

    return {
      criticalErrors: critical,
      highErrors: high,
      mediumErrors: medium,
      totalErrors: total,
      errorRate,
      recommendedActions,
    }
  }

  // Helper to determine severity
  private static determineSeverity(count: number): 'critical' | 'high' | 'medium' | 'low' {
    if (count > 100) return 'critical'
    if (count > 50) return 'high'
    if (count > 10) return 'medium'
    return 'low'
  }
}
