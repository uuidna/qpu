/**
 * Observability Layer
 * Metrics collection, tracing, and real-time dashboards
 * Feeds the autonomous engine with production insights
 */

// ============================================================================
// METRICS COLLECTION
// ============================================================================

export interface MetricPoint {
  timestamp: number
  operation: string
  duration: number
  success: boolean
  error?: string
  userId?: string
  tier?: string
  inputSize: number
  outputSize: number
}

export interface AggregatedMetrics {
  operation: string
  count: number
  p50: number
  p95: number
  p99: number
  p999: number
  errorRate: number
  avgDuration: number
  throughput: number
}

export interface SystemMetrics {
  timestamp: number
  totalRequests: number
  totalErrors: number
  avgLatency: number
  peakLatency: number
  throughput: number // req/s
  cacheHitRate: number
  activeConnections: number
  memoryUsage: number
  cpuUsage: number
  operationMetrics: Map<string, AggregatedMetrics>
}

class MetricsCollector {
  private metrics: MetricPoint[] = []
  private aggregated = new Map<string, AggregatedMetrics>()
  private windowSize = 60000 // 1 minute rolling window
  private lastFlush = Date.now()

  recordMetric(metric: MetricPoint): void {
    this.metrics.push(metric)

    // Aggregate in-memory every 100 records
    if (this.metrics.length % 100 === 0) {
      this.aggregate()
    }
  }

  private aggregate(): void {
    const now = Date.now()
    const cutoff = now - this.windowSize

    // Filter to recent metrics
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff)

    // Re-aggregate
    this.aggregated.clear()
    for (const metric of this.metrics) {
      const key = metric.operation
      const agg = this.aggregated.get(key) || {
        operation: key,
        count: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        p999: 0,
        errorRate: 0,
        avgDuration: 0,
        throughput: 0
      }

      agg.count++
      if (metric.error) agg.errorRate++

      this.aggregated.set(key, agg)
    }

    // Calculate percentiles
    for (const [key, agg] of this.aggregated) {
      const durations = this.metrics
        .filter(m => m.operation === key)
        .map(m => m.duration)
        .sort((a, b) => a - b)

      if (durations.length > 0) {
        agg.p50 = durations[Math.floor(durations.length * 0.50)]
        agg.p95 = durations[Math.floor(durations.length * 0.95)]
        agg.p99 = durations[Math.floor(durations.length * 0.99)]
        agg.p999 = durations[Math.floor(durations.length * 0.999)]
        agg.avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
        agg.errorRate = agg.errorRate / agg.count
        agg.throughput = agg.count / (this.windowSize / 1000) // req/s
      }
    }

    this.lastFlush = now
  }

  getSystemMetrics(cacheHitRate: number, activeConnections: number): SystemMetrics {
    const now = Date.now()
    const durations = this.metrics.map(m => m.duration)

    const totalErrors = this.metrics.filter(m => m.error).length
    const totalRequests = this.metrics.length

    return {
      timestamp: now,
      totalRequests,
      totalErrors,
      avgLatency: durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : 0,
      peakLatency: durations.length > 0 ? Math.max(...durations) : 0,
      throughput: totalRequests / (this.windowSize / 1000),
      cacheHitRate,
      activeConnections,
      memoryUsage: typeof process !== 'undefined'
        ? process.memoryUsage().heapUsed / 1024 / 1024
        : 0,
      cpuUsage: 0, // Set by external monitoring
      operationMetrics: this.aggregated
    }
  }

  getOperationMetrics(operation: string): AggregatedMetrics | undefined {
    return this.aggregated.get(operation)
  }

  getAllMetrics(): AggregatedMetrics[] {
    return Array.from(this.aggregated.values())
  }

  exportForDashboard() {
    return {
      timestamp: Date.now(),
      window: this.windowSize,
      totalMetrics: this.metrics.length,
      operations: Array.from(this.aggregated.entries()).map(([name, agg]) => ({
        name,
        ...agg
      }))
    }
  }
}

// ============================================================================
// DISTRIBUTED TRACING
// ============================================================================

export interface Span {
  traceId: string
  spanId: string
  parentSpanId?: string
  operation: string
  startTime: number
  endTime?: number
  duration?: number
  status: 'pending' | 'success' | 'error'
  attributes: Record<string, string | number | boolean>
  events: Array<{ timestamp: number; message: string }>
  error?: { message: string; stack?: string }
}

class TraceCollector {
  private traces = new Map<string, Span[]>()
  private activeSpans = new Map<string, Span>()
  private maxTracesPerId = 1000

  startSpan(traceId: string, spanId: string, operation: string, parentSpanId?: string): Span {
    const span: Span = {
      traceId,
      spanId,
      parentSpanId,
      operation,
      startTime: Date.now(),
      status: 'pending',
      attributes: {},
      events: []
    }

    this.activeSpans.set(spanId, span)

    const traces = this.traces.get(traceId) || []
    if (traces.length < this.maxTracesPerId) {
      traces.push(span)
      this.traces.set(traceId, traces)
    }

    return span
  }

  endSpan(spanId: string, status: 'success' | 'error', error?: Error): void {
    const span = this.activeSpans.get(spanId)
    if (!span) return

    span.endTime = Date.now()
    span.duration = span.endTime - span.startTime
    span.status = status
    if (error) {
      span.error = {
        message: error.message,
        stack: error.stack
      }
    }

    this.activeSpans.delete(spanId)
  }

  addEvent(spanId: string, message: string): void {
    const span = this.activeSpans.get(spanId)
    if (span) {
      span.events.push({
        timestamp: Date.now(),
        message
      })
    }
  }

  setAttribute(spanId: string, key: string, value: string | number | boolean): void {
    const span = this.activeSpans.get(spanId)
    if (span) {
      span.attributes[key] = value
    }
  }

  getTrace(traceId: string): Span[] {
    return this.traces.get(traceId) || []
  }

  getAllTraces(): Map<string, Span[]> {
    return this.traces
  }

  exportTrace(traceId: string) {
    const spans = this.traces.get(traceId) || []
    return {
      traceId,
      spanCount: spans.length,
      totalDuration: spans.reduce((sum, s) => sum + (s.duration || 0), 0),
      spans: spans.map(s => ({
        spanId: s.spanId,
        operation: s.operation,
        duration: s.duration,
        status: s.status
      }))
    }
  }
}

// ============================================================================
// ANOMALY DETECTION
// ============================================================================

export interface Anomaly {
  timestamp: number
  type: 'latency' | 'error-rate' | 'throughput' | 'resource'
  operation?: string
  severity: 'warning' | 'critical'
  message: string
  value: number
  threshold: number
}

class AnomalyDetector {
  private anomalies: Anomaly[] = []
  private baselines = new Map<string, { avg: number; stdDev: number }>()
  private sampleSize = 100

  recordSample(operation: string, duration: number, success: boolean): void {
    const baseline = this.baselines.get(operation) || { avg: 0, stdDev: 0 }

    // Simple running average/stddev
    const samples = [duration]
    baseline.avg = (baseline.avg * (this.sampleSize - 1) + duration) / this.sampleSize
    baseline.stdDev = Math.sqrt(samples.reduce((sum, s) => sum + Math.pow(s - baseline.avg, 2), 0) / samples.length)

    this.baselines.set(operation, baseline)
  }

  detectAnomalies(metrics: SystemMetrics): Anomaly[] {
    const detected: Anomaly[] = []

    // Check latency anomalies
    if (metrics.avgLatency > 100) { // > 100ms
      detected.push({
        timestamp: metrics.timestamp,
        type: 'latency',
        severity: metrics.avgLatency > 500 ? 'critical' : 'warning',
        message: `High latency detected: ${metrics.avgLatency.toFixed(2)}ms`,
        value: metrics.avgLatency,
        threshold: 100
      })
    }

    // Check error rate
    const errorRate = metrics.totalErrors / Math.max(metrics.totalRequests, 1)
    if (errorRate > 0.01) { // > 1%
      detected.push({
        timestamp: metrics.timestamp,
        type: 'error-rate',
        severity: errorRate > 0.05 ? 'critical' : 'warning',
        message: `Elevated error rate: ${(errorRate * 100).toFixed(2)}%`,
        value: errorRate,
        threshold: 0.01
      })
    }

    // Check throughput
    if (metrics.throughput < 100) { // < 100 req/s
      detected.push({
        timestamp: metrics.timestamp,
        type: 'throughput',
        severity: 'warning',
        message: `Low throughput: ${metrics.throughput.toFixed(2)} req/s`,
        value: metrics.throughput,
        threshold: 100
      })
    }

    // Check memory
    if (metrics.memoryUsage > 500) { // > 500 MB
      detected.push({
        timestamp: metrics.timestamp,
        type: 'resource',
        severity: metrics.memoryUsage > 1000 ? 'critical' : 'warning',
        message: `High memory usage: ${metrics.memoryUsage.toFixed(2)} MB`,
        value: metrics.memoryUsage,
        threshold: 500
      })
    }

    this.anomalies.push(...detected)

    // Keep last 1000 anomalies
    if (this.anomalies.length > 1000) {
      this.anomalies = this.anomalies.slice(-1000)
    }

    return detected
  }

  getAnomalies(): Anomaly[] {
    return this.anomalies
  }

  getRecentAnomalies(minutes: number = 5): Anomaly[] {
    const cutoff = Date.now() - minutes * 60000
    return this.anomalies.filter(a => a.timestamp > cutoff)
  }
}

// ============================================================================
// OBSERVABILITY SINGLETON
// ============================================================================

export const metricsCollector = new MetricsCollector()
export const traceCollector = new TraceCollector()
export const anomalyDetector = new AnomalyDetector()

/**
 * High-level observability API for the core system
 */
export class Observability {
  static recordOperation(
    operation: string,
    duration: number,
    success: boolean,
    userId?: string,
    tier?: string,
    inputSize: number = 0,
    outputSize: number = 0,
    error?: string
  ): void {
    metricsCollector.recordMetric({
      timestamp: Date.now(),
      operation,
      duration,
      success,
      error,
      userId,
      tier,
      inputSize,
      outputSize
    })
  }

  static startTrace(operation: string, traceId: string = crypto.randomUUID()): { traceId: string; spanId: string } {
    const spanId = crypto.randomUUID()
    traceCollector.startSpan(traceId, spanId, operation)
    return { traceId, spanId }
  }

  static endTrace(spanId: string, success: boolean, error?: Error): void {
    traceCollector.endSpan(spanId, success ? 'success' : 'error', error)
  }

  static getMetrics(cacheHitRate: number = 0, activeConnections: number = 0) {
    return metricsCollector.getSystemMetrics(cacheHitRate, activeConnections)
  }

  static detectAnomalies() {
    const metrics = metricsCollector.getSystemMetrics(0, 0)
    return anomalyDetector.detectAnomalies(metrics)
  }

  static exportMetrics() {
    return metricsCollector.exportForDashboard()
  }

  static exportTraces() {
    return Array.from(traceCollector.getAllTraces().entries()).slice(-100).map(([traceId]) =>
      traceCollector.exportTrace(traceId)
    )
  }

  static getAnomalies() {
    return anomalyDetector.getAnomalies()
  }
}
