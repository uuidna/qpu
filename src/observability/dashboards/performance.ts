// Performance dashboard metrics (WAVE 8C)

import { DashboardMetrics, AnalyticsData, OperationMetrics } from '../types.js'
import { metrics } from '../metrics.js'
import { analytics } from '../analytics.js'

export class PerformanceDashboard {
  // Generate performance metrics for dashboard
  static generateMetrics(data?: AnalyticsData): DashboardMetrics {
    const timestamp = Date.now()

    let latency = {
      p50: 0,
      p95: 0,
      p99: 0,
      mean: 0,
    }

    let errorRate = 0
    let throughput = 0
    const topOperations: Array<{
      operation: string
      count: number
      avgLatency: number
      errorRate: number
    }> = []
    let activeConnections = 0

    if (data) {
      // Calculate latency percentiles
      let allLatencies: number[] = []
      let totalCount = 0
      let totalErrors = 0
      let totalLatency = 0

      for (const [operation, opMetrics] of data.metrics.entries()) {
        totalCount += opMetrics.count
        totalErrors += opMetrics.errorCount
        totalLatency += opMetrics.totalDuration

        topOperations.push({
          operation,
          count: opMetrics.count,
          avgLatency: opMetrics.avgDuration,
          errorRate: opMetrics.errorRate,
        })

        // Simulate latency distribution
        for (let i = 0; i < opMetrics.count; i++) {
          allLatencies.push(opMetrics.avgDuration)
        }
      }

      // Sort top operations by count
      topOperations.sort((a, b) => b.count - a.count)

      if (allLatencies.length > 0) {
        allLatencies.sort((a, b) => a - b)
        latency.p50 = allLatencies[Math.floor(allLatencies.length * 0.5)]
        latency.p95 = allLatencies[Math.floor(allLatencies.length * 0.95)]
        latency.p99 = allLatencies[Math.floor(allLatencies.length * 0.99)]
        latency.mean = totalLatency / totalCount
      }

      errorRate = totalCount > 0 ? totalErrors / totalCount : 0
      throughput = totalCount

      // Estimate active connections (0-100)
      activeConnections = Math.min(100, Math.floor(totalCount / 100))
    }

    return {
      timestamp,
      latency,
      errorRate,
      throughput,
      activeConnections,
      topOperations: topOperations.slice(0, 10),
      topErrors: data?.topErrors || [],
    }
  }

  // Generate latency time series
  static generateLatencyTimeSeries(minutes: number = 60): Array<{
    timestamp: number
    p50: number
    p95: number
    p99: number
    mean: number
  }> {
    const timeSeries: Array<{
      timestamp: number
      p50: number
      p95: number
      p99: number
      mean: number
    }> = []

    const historical = analytics.getHistoricalData(minutes)
    for (const data of historical) {
      let p50 = 0,
        p95 = 0,
        p99 = 0,
        mean = 0

      let allLatencies: number[] = []
      let totalLatency = 0
      let totalCount = 0

      for (const [, opMetrics] of data.metrics.entries()) {
        totalLatency += opMetrics.totalDuration
        totalCount += opMetrics.count

        for (let i = 0; i < opMetrics.count; i++) {
          allLatencies.push(opMetrics.avgDuration)
        }
      }

      if (allLatencies.length > 0) {
        allLatencies.sort((a, b) => a - b)
        p50 = allLatencies[Math.floor(allLatencies.length * 0.5)]
        p95 = allLatencies[Math.floor(allLatencies.length * 0.95)]
        p99 = allLatencies[Math.floor(allLatencies.length * 0.99)]
        mean = totalCount > 0 ? totalLatency / totalCount : 0
      }

      timeSeries.push({
        timestamp: data.timestamp,
        p50,
        p95,
        p99,
        mean,
      })
    }

    return timeSeries
  }

  // Generate throughput time series
  static generateThroughputTimeSeries(minutes: number = 60): Array<{
    timestamp: number
    requests: number
    errors: number
    errorRate: number
  }> {
    const timeSeries: Array<{
      timestamp: number
      requests: number
      errors: number
      errorRate: number
    }> = []

    const historical = analytics.getHistoricalData(minutes)
    for (const data of historical) {
      let totalRequests = 0
      let totalErrors = 0

      for (const [, opMetrics] of data.metrics.entries()) {
        totalRequests += opMetrics.count
        totalErrors += opMetrics.errorCount
      }

      timeSeries.push({
        timestamp: data.timestamp,
        requests: totalRequests,
        errors: totalErrors,
        errorRate: totalRequests > 0 ? totalErrors / totalRequests : 0,
      })
    }

    return timeSeries
  }

  // Generate operation performance breakdown
  static generateOperationBreakdown(): Array<{
    operation: string
    requests: number
    avgLatency: number
    p95Latency: number
    p99Latency: number
    errorRate: number
    percentOfTotal: number
  }> {
    const breakdown: Array<{
      operation: string
      requests: number
      avgLatency: number
      p95Latency: number
      p99Latency: number
      errorRate: number
      percentOfTotal: number
    }> = []

    const historical = analytics.getHistoricalData(10)
    const aggregated = new Map<
      string,
      {
        count: number
        totalDuration: number
        errorCount: number
        p95: number
        p99: number
      }
    >()

    // Aggregate across all periods
    for (const data of historical) {
      for (const [op, opMetrics] of data.metrics.entries()) {
        const existing = aggregated.get(op) || {
          count: 0,
          totalDuration: 0,
          errorCount: 0,
          p95: 0,
          p99: 0,
        }
        aggregated.set(op, {
          count: existing.count + opMetrics.count,
          totalDuration: existing.totalDuration + opMetrics.totalDuration,
          errorCount: existing.errorCount + opMetrics.errorCount,
          p95: Math.max(existing.p95, opMetrics.p95),
          p99: Math.max(existing.p99, opMetrics.p99),
        })
      }
    }

    let totalRequests = 0
    for (const agg of aggregated.values()) {
      totalRequests += agg.count
    }

    for (const [operation, agg] of aggregated.entries()) {
      breakdown.push({
        operation,
        requests: agg.count,
        avgLatency: agg.count > 0 ? agg.totalDuration / agg.count : 0,
        p95Latency: agg.p95,
        p99Latency: agg.p99,
        errorRate: agg.count > 0 ? agg.errorCount / agg.count : 0,
        percentOfTotal: totalRequests > 0 ? (agg.count / totalRequests) * 100 : 0,
      })
    }

    return breakdown.sort((a, b) => b.requests - a.requests)
  }

  // Generate slow query report
  static generateSlowQueries(thresholdMs: number = 1000): Array<{
    operation: string
    avgLatency: number
    maxLatency: number
    count: number
    percentage: number
  }> {
    const slowOps: Array<{
      operation: string
      avgLatency: number
      maxLatency: number
      count: number
      percentage: number
    }> = []

    const historical = analytics.getHistoricalData(60)
    for (const data of historical) {
      for (const [op, opMetrics] of data.metrics.entries()) {
        if (opMetrics.avgDuration >= thresholdMs) {
          slowOps.push({
            operation: op,
            avgLatency: opMetrics.avgDuration,
            maxLatency: opMetrics.maxDuration,
            count: opMetrics.count,
            percentage: 0,
          })
        }
      }
    }

    // Calculate percentages
    let totalCount = 0
    for (const op of slowOps) {
      totalCount += op.count
    }

    for (const op of slowOps) {
      op.percentage = totalCount > 0 ? (op.count / totalCount) * 100 : 0
    }

    return slowOps.sort((a, b) => b.avgLatency - a.avgLatency)
  }
}
