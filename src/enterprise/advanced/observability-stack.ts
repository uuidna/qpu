/**
 * Advanced Observability Stack - Distributed tracing, metrics, logs, profiling
 * Combines metrics (Prometheus), logs (ELK), traces (Jaeger), profiles (Pprof)
 */

export interface Span {
  traceId: string
  spanId: string
  parentSpanId?: string
  operationName: string
  startTime: number
  endTime?: number
  duration: number
  tags: Record<string, unknown>
  logs: Array<{ timestamp: number; message: string }>
  status: 'success' | 'error'
}

export interface Trace {
  traceId: string
  spans: Span[]
  startTime: number
  endTime: number
  duration: number
  status: 'success' | 'error'
  serviceName: string
}

export interface MetricPoint {
  timestamp: number
  value: number
  labels: Record<string, string>
}

export interface Metric {
  name: string
  type: 'gauge' | 'counter' | 'histogram' | 'summary'
  points: MetricPoint[]
  description: string
}

export interface LogEntry {
  timestamp: number
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  message: string
  service: string
  traceId?: string
  context: Record<string, unknown>
}

export class ObservabilityStack {
  private traces: Map<string, Trace> = new Map()
  private metrics: Map<string, Metric> = new Map()
  private logs: LogEntry[] = []
  private profiles: Map<string, ProfileData> = new Map()

  // ========================================================================
  // DISTRIBUTED TRACING (Jaeger-like)
  // ========================================================================

  startSpan(traceId: string, spanId: string, operationName: string, parentSpanId?: string): Span {
    return {
      traceId,
      spanId,
      parentSpanId,
      operationName,
      startTime: Date.now(),
      duration: 0,
      tags: {},
      logs: [],
      status: 'success'
    }
  }

  endSpan(span: Span, tags?: Record<string, unknown>): void {
    span.endTime = Date.now()
    span.duration = span.endTime - span.startTime
    if (tags) span.tags = { ...span.tags, ...tags }

    // Add to trace
    let trace = this.traces.get(span.traceId)
    if (!trace) {
      trace = {
        traceId: span.traceId,
        spans: [],
        startTime: span.startTime,
        endTime: span.endTime || span.startTime,
        duration: span.duration,
        status: 'success',
        serviceName: this.extractServiceName(span)
      }
      this.traces.set(span.traceId, trace)
    }

    trace.spans.push(span)
    trace.endTime = Math.max(trace.endTime, span.endTime || span.startTime)
    trace.duration = trace.endTime - trace.startTime
  }

  private extractServiceName(span: Span): string {
    return (span.tags['service'] as string) || 'unknown'
  }

  getTrace(traceId: string): Trace | undefined {
    return this.traces.get(traceId)
  }

  // ========================================================================
  // METRICS (Prometheus-like)
  // ========================================================================

  recordMetric(name: string, value: number, labels?: Record<string, string>): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, {
        name,
        type: 'gauge',
        points: [],
        description: ''
      })
    }

    const metric = this.metrics.get(name)!
    metric.points.push({
      timestamp: Date.now(),
      value,
      labels: labels || {}
    })

    // Keep only last 1000 points
    if (metric.points.length > 1000) {
      metric.points = metric.points.slice(-1000)
    }
  }

  incrementCounter(name: string, labels?: Record<string, string>): void {
    const metric = this.metrics.get(name)
    if (!metric) {
      this.metrics.set(name, {
        name,
        type: 'counter',
        points: [{ timestamp: Date.now(), value: 1, labels: labels || {} }],
        description: ''
      })
    } else {
      const lastPoint = metric.points[metric.points.length - 1]
      metric.points.push({
        timestamp: Date.now(),
        value: lastPoint.value + 1,
        labels: labels || {}
      })
    }
  }

  recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
    const metric = this.metrics.get(name)
    if (!metric) {
      this.metrics.set(name, {
        name,
        type: 'histogram',
        points: [{ timestamp: Date.now(), value, labels: labels || {} }],
        description: ''
      })
    } else {
      metric.points.push({
        timestamp: Date.now(),
        value,
        labels: labels || {}
      })
    }
  }

  getMetric(name: string): Metric | undefined {
    return this.metrics.get(name)
  }

  // ========================================================================
  // STRUCTURED LOGGING (ELK-like)
  // ========================================================================

  log(
    level: 'debug' | 'info' | 'warn' | 'error' | 'fatal',
    message: string,
    service: string,
    context?: Record<string, unknown>,
    traceId?: string
  ): void {
    this.logs.push({
      timestamp: Date.now(),
      level,
      message,
      service,
      traceId,
      context: context || {}
    })

    // Keep last 10000 logs
    if (this.logs.length > 10000) {
      this.logs = this.logs.slice(-10000)
    }
  }

  queryLogs(filter: { service?: string; level?: string; traceId?: string }): LogEntry[] {
    return this.logs.filter(log => {
      if (filter.service && log.service !== filter.service) return false
      if (filter.level && log.level !== filter.level) return false
      if (filter.traceId && log.traceId !== filter.traceId) return false
      return true
    })
  }

  // ========================================================================
  // CPU/MEMORY PROFILING (Pprof-like)
  // ========================================================================

  startProfile(profileId: string, type: 'cpu' | 'heap' | 'goroutine'): void {
    this.profiles.set(profileId, {
      id: profileId,
      type,
      startTime: Date.now(),
      samples: [],
      sampleCount: 0
    })
  }

  recordProfileSample(profileId: string, stack: string[], count: number): void {
    const profile = this.profiles.get(profileId)
    if (!profile) return

    profile.samples.push({ stack, count, timestamp: Date.now() })
    profile.sampleCount += count
  }

  endProfile(profileId: string): ProfileData | undefined {
    const profile = this.profiles.get(profileId)
    if (profile) {
      profile.endTime = Date.now()
    }
    return profile
  }

  // ========================================================================
  // OBSERVABILITY INSIGHTS
  // ========================================================================

  getServiceMap(): Array<{ from: string; to: string; callCount: number; p99Latency: number }> {
    const serviceCalls: Record<string, Record<string, number[]>> = {}

    this.traces.forEach(trace => {
      trace.spans.forEach(span => {
        const fromService = this.extractServiceName(span)
        const toService = (span.tags['downstream'] as string) || 'unknown'

        if (!serviceCalls[fromService]) serviceCalls[fromService] = {}
        if (!serviceCalls[fromService][toService]) serviceCalls[fromService][toService] = []
        serviceCalls[fromService][toService].push(span.duration)
      })
    })

    const result: Array<{ from: string; to: string; callCount: number; p99Latency: number }> = []

    Object.entries(serviceCalls).forEach(([from, toServices]) => {
      Object.entries(toServices).forEach(([to, latencies]) => {
        latencies.sort((a, b) => a - b)
        const p99 = latencies[Math.floor(latencies.length * 0.99)]

        result.push({
          from,
          to,
          callCount: latencies.length,
          p99Latency: p99
        })
      })
    })

    return result
  }

  getHealthStatus(): {
    healthyServices: string[]
    unhealthyServices: string[]
    errorRate: number
    p99Latency: number
  } {
    const serviceHealth: Record<string, { errors: number; total: number; latencies: number[] }> = {}

    this.traces.forEach(trace => {
      trace.spans.forEach(span => {
        const service = this.extractServiceName(span)
        if (!serviceHealth[service]) {
          serviceHealth[service] = { errors: 0, total: 0, latencies: [] }
        }
        serviceHealth[service].total++
        if (span.status === 'error') serviceHealth[service].errors++
        serviceHealth[service].latencies.push(span.duration)
      })
    })

    const healthy: string[] = []
    const unhealthy: string[] = []

    Object.entries(serviceHealth).forEach(([service, health]) => {
      const errorRate = health.errors / health.total
      if (errorRate > 0.05) {
        unhealthy.push(service)
      } else {
        healthy.push(service)
      }
    })

    const allLatencies: number[] = []
    Object.values(serviceHealth).forEach(h => allLatencies.push(...h.latencies))
    allLatencies.sort((a, b) => a - b)
    const p99 = allLatencies[Math.floor(allLatencies.length * 0.99)] || 0

    return {
      healthyServices: healthy,
      unhealthyServices: unhealthy,
      errorRate: Math.round((allLatencies.filter(l => l > 1000).length / allLatencies.length) * 100) / 100,
      p99Latency: Math.round(p99)
    }
  }

  getDashboardMetrics(): {
    requestsPerSecond: number
    errorRate: number
    p50Latency: number
    p95Latency: number
    p99Latency: number
  } {
    const allSpans: Span[] = []
    this.traces.forEach(trace => allSpans.push(...trace.spans))

    const now = Date.now()
    const lastSecond = allSpans.filter(s => s.startTime > now - 1000)
    const latencies = allSpans.map(s => s.duration).sort((a, b) => a - b)

    return {
      requestsPerSecond: lastSecond.length,
      errorRate: Math.round((allSpans.filter(s => s.status === 'error').length / allSpans.length) * 100) / 100,
      p50Latency: Math.round(latencies[Math.floor(latencies.length * 0.5)]),
      p95Latency: Math.round(latencies[Math.floor(latencies.length * 0.95)]),
      p99Latency: Math.round(latencies[Math.floor(latencies.length * 0.99)])
    }
  }
}

interface ProfileData {
  id: string
  type: 'cpu' | 'heap' | 'goroutine'
  startTime: number
  endTime?: number
  samples: Array<{ stack: string[]; count: number; timestamp: number }>
  sampleCount: number
}

export const observabilityStack = new ObservabilityStack()
