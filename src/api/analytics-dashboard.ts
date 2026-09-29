/**
 * Analytics Dashboard API
 * Real-time metrics, tracing, and anomaly detection
 * Feeds dashboards and alerts
 */

import {
  metricsCollector,
  traceCollector,
  anomalyDetector,
  Observability,
  type SystemMetrics,
  type Anomaly
} from '../core/observability.js'

// ============================================================================
// DASHBOARD API ENDPOINTS
// ============================================================================

export interface DashboardData {
  timestamp: number
  metrics: {
    throughput: number
    avgLatency: number
    errorRate: number
    activeConnections: number
    cacheHitRate: number
    p95Latency: number
    p99Latency: number
  }
  topOperations: Array<{
    name: string
    count: number
    avgLatency: number
    errorRate: number
  }>
  anomalies: Anomaly[]
  recentErrors: Array<{
    timestamp: number
    operation: string
    error: string
  }>
}

export class AnalyticsDashboard {
  /**
   * Get real-time dashboard data
   */
  static getDashboardData(cacheHitRate: number = 0, activeConnections: number = 0): DashboardData {
    const metrics = metricsCollector.getSystemMetrics(cacheHitRate, activeConnections)
    const allMetrics = metricsCollector.getAllMetrics()
    const recentAnomalies = anomalyDetector.getRecentAnomalies(5)

    // Top operations by volume
    const topOps = allMetrics
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(m => ({
        name: m.operation,
        count: m.count,
        avgLatency: m.avgDuration,
        errorRate: m.errorRate
      }))

    const errorRate = metrics.totalErrors / Math.max(metrics.totalRequests, 1)

    return {
      timestamp: Date.now(),
      metrics: {
        throughput: metrics.throughput,
        avgLatency: metrics.avgLatency,
        errorRate: errorRate,
        activeConnections: metrics.activeConnections,
        cacheHitRate: metrics.cacheHitRate,
        p95Latency: allMetrics.length > 0
          ? Math.max(...allMetrics.map(m => m.p95 || 0))
          : 0,
        p99Latency: allMetrics.length > 0
          ? Math.max(...allMetrics.map(m => m.p99 || 0))
          : 0
      },
      topOperations: topOps,
      anomalies: recentAnomalies,
      recentErrors: []
    }
  }

  /**
   * Get historical metrics for time series
   */
  static getMetricsTimeSeries(minutes: number = 5) {
    const metrics = metricsCollector.exportForDashboard()
    const cutoff = Date.now() - minutes * 60000

    return {
      range: { from: cutoff, to: Date.now() },
      operations: metrics.operations.map(op => ({
        name: op.name,
        throughput: op.throughput,
        latency: op.avgDuration,
        errorRate: op.errorRate,
        p95: op.p95,
        p99: op.p99
      }))
    }
  }

  /**
   * Get operation-specific analytics
   */
  static getOperationAnalytics(operation: string) {
    const metrics = metricsCollector.getOperationMetrics(operation)

    if (!metrics) {
      return { operation, error: 'No data for operation' }
    }

    return {
      operation,
      count: metrics.count,
      avgLatency: metrics.avgDuration,
      latencyPercentiles: {
        p50: 0, // Would need to store raw data
        p95: metrics.p95,
        p99: metrics.p99,
        p999: metrics.p999
      },
      throughput: metrics.throughput,
      errorRate: metrics.errorRate,
      successCount: metrics.count - Math.round(metrics.count * metrics.errorRate),
      failureCount: Math.round(metrics.count * metrics.errorRate)
    }
  }

  /**
   * Get health check
   */
  static getHealth() {
    const metrics = metricsCollector.getSystemMetrics(0, 0)
    const errorRate = metrics.totalErrors / Math.max(metrics.totalRequests, 1)
    const recentAnomalies = anomalyDetector.getRecentAnomalies(5)

    const isHealthy =
      errorRate < 0.05 &&
      metrics.avgLatency < 500 &&
      recentAnomalies.filter(a => a.severity === 'critical').length === 0

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      uptime: Date.now(),
      metrics: {
        totalRequests: metrics.totalRequests,
        errorRate: errorRate,
        avgLatency: metrics.avgLatency,
        throughput: metrics.throughput
      },
      anomalies: recentAnomalies.length,
      criticalAnomalies: recentAnomalies.filter(a => a.severity === 'critical').length
    }
  }

  /**
   * Get SLA compliance
   */
  static getSLACompliance(slaTarget: number = 99.9) {
    const metrics = metricsCollector.getSystemMetrics(0, 0)
    const errorRate = metrics.totalErrors / Math.max(metrics.totalRequests, 1)
    const uptime = (1 - errorRate) * 100

    return {
      targetSLA: slaTarget,
      achievedSLA: uptime,
      isMet: uptime >= slaTarget,
      totalRequests: metrics.totalRequests,
      failedRequests: metrics.totalErrors,
      compliance: {
        percentage: uptime.toFixed(2),
        allowedDowntimeMs: ((100 - slaTarget) / 100) * 86400000
      }
    }
  }

  /**
   * Get alerts configuration
   */
  static getAlertConfig() {
    return {
      latencyAlert: {
        threshold: 100,
        severity: 'warning'
      },
      errorRateAlert: {
        threshold: 0.01,
        severity: 'warning'
      },
      criticalErrorRateAlert: {
        threshold: 0.05,
        severity: 'critical'
      },
      throughputAlert: {
        threshold: 100,
        severity: 'warning'
      },
      memoryAlert: {
        threshold: 500,
        severity: 'warning'
      }
    }
  }

  /**
   * Get all recent anomalies
   */
  static getAnomalies() {
    return {
      timestamp: Date.now(),
      recentAnomalies: anomalyDetector.getRecentAnomalies(5),
      criticalCount: anomalyDetector.getAnomalies()
        .filter(a => a.severity === 'critical').length,
      warningCount: anomalyDetector.getAnomalies()
        .filter(a => a.severity === 'warning').length
    }
  }

  /**
   * Get trace details
   */
  static getTrace(traceId: string) {
    const spans = traceCollector.getTrace(traceId)
    return {
      traceId,
      spanCount: spans.length,
      spans: spans.map(s => ({
        spanId: s.spanId,
        operation: s.operation,
        duration: s.duration,
        status: s.status,
        startTime: s.startTime,
        endTime: s.endTime
      }))
    }
  }

  /**
   * Export metrics for external monitoring (Prometheus, Datadog, etc.)
   */
  static exportPrometheus(): string {
    const metrics = metricsCollector.getSystemMetrics(0, 0)
    const lines: string[] = []

    // System metrics
    lines.push(`# HELP qpu_total_requests Total number of requests processed`)
    lines.push(`# TYPE qpu_total_requests counter`)
    lines.push(`qpu_total_requests ${metrics.totalRequests}`)

    lines.push(`# HELP qpu_total_errors Total number of errors`)
    lines.push(`# TYPE qpu_total_errors counter`)
    lines.push(`qpu_total_errors ${metrics.totalErrors}`)

    lines.push(`# HELP qpu_avg_latency_ms Average latency in milliseconds`)
    lines.push(`# TYPE qpu_avg_latency_ms gauge`)
    lines.push(`qpu_avg_latency_ms ${metrics.avgLatency.toFixed(2)}`)

    lines.push(`# HELP qpu_throughput_rps Throughput in requests per second`)
    lines.push(`# TYPE qpu_throughput_rps gauge`)
    lines.push(`qpu_throughput_rps ${metrics.throughput.toFixed(2)}`)

    lines.push(`# HELP qpu_cache_hit_rate Cache hit rate`)
    lines.push(`# TYPE qpu_cache_hit_rate gauge`)
    lines.push(`qpu_cache_hit_rate ${(metrics.cacheHitRate * 100).toFixed(2)}`)

    // Operation metrics
    const allMetrics = metricsCollector.getAllMetrics()
    for (const op of allMetrics) {
      const labels = `{operation="${op.operation}"}`
      lines.push(`qpu_operation_count${labels} ${op.count}`)
      lines.push(`qpu_operation_latency${labels} ${op.avgDuration.toFixed(2)}`)
      lines.push(`qpu_operation_error_rate${labels} ${(op.errorRate * 100).toFixed(2)}`)
    }

    return lines.join('\n')
  }
}

/**
 * Mount analytics endpoints on HTTP server
 */
export function mountAnalyticsEndpoints(router: any) {
  // Dashboard
  router.get('/api/analytics/dashboard', () => {
    return AnalyticsDashboard.getDashboardData()
  })

  // Health
  router.get('/api/analytics/health', () => {
    return AnalyticsDashboard.getHealth()
  })

  // SLA
  router.get('/api/analytics/sla', (req: any) => {
    const target = parseFloat(req.query.target) || 99.9
    return AnalyticsDashboard.getSLACompliance(target)
  })

  // Anomalies
  router.get('/api/analytics/anomalies', () => {
    return AnalyticsDashboard.getAnomalies()
  })

  // Operation analytics
  router.get('/api/analytics/operations/:operation', (req: any) => {
    return AnalyticsDashboard.getOperationAnalytics(req.params.operation)
  })

  // Trace
  router.get('/api/analytics/traces/:traceId', (req: any) => {
    return AnalyticsDashboard.getTrace(req.params.traceId)
  })

  // Prometheus metrics
  router.get('/metrics', () => {
    return AnalyticsDashboard.exportPrometheus()
  })

  // Time series
  router.get('/api/analytics/timeseries', (req: any) => {
    const minutes = parseInt(req.query.minutes) || 5
    return AnalyticsDashboard.getMetricsTimeSeries(minutes)
  })

  // Alerts config
  router.get('/api/analytics/alerts', () => {
    return AnalyticsDashboard.getAlertConfig()
  })
}
