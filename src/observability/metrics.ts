// Prometheus metrics collection and export (WAVE 8C)

import { MetricValue, OperationMetrics } from './types.js'

export class PrometheusMetrics {
  private counters: Map<string, Map<string, number>> = new Map()
  private gauges: Map<string, Map<string, number>> = new Map()
  private histograms: Map<string, Map<string, number[]>> = new Map()
  private summaries: Map<string, Array<{ value: number; timestamp: number }>> = new Map()
  private exportCallbacks: Array<(metrics: MetricValue[]) => Promise<void>> = []
  private flushInterval: number = 60000 // 1 minute default

  constructor(config?: { flushInterval?: number }) {
    if (config?.flushInterval) {
      this.flushInterval = config.flushInterval
    }
  }

  // Counter: monotonically increasing value
  incrementCounter(name: string, value: number = 1, labels?: Record<string, string>): void {
    const key = this.makeKey(name, labels)
    if (!this.counters.has(name)) {
      this.counters.set(name, new Map())
    }
    const current = this.counters.get(name)!.get(key) || 0
    this.counters.get(name)!.set(key, current + value)
  }

  // Gauge: value that can go up or down
  setGauge(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.makeKey(name, labels)
    if (!this.gauges.has(name)) {
      this.gauges.set(name, new Map())
    }
    this.gauges.get(name)!.set(key, value)
  }

  // Histogram: distribution of values
  recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.makeKey(name, labels)
    if (!this.histograms.has(name)) {
      this.histograms.set(name, new Map())
    }
    if (!this.histograms.get(name)!.has(key)) {
      this.histograms.get(name)!.set(key, [])
    }
    this.histograms.get(name)!.get(key)!.push(value)

    // Keep only last 10000 values to prevent unbounded growth
    const values = this.histograms.get(name)!.get(key)!
    if (values.length > 10000) {
      values.shift()
    }
  }

  // Summary: track all values over time
  recordSummary(name: string, value: number): void {
    if (!this.summaries.has(name)) {
      this.summaries.set(name, [])
    }
    this.summaries.get(name)!.push({ value, timestamp: Date.now() })

    // Keep only last hour of data
    const cutoff = Date.now() - 3600000
    const values = this.summaries.get(name)!
    while (values.length > 0 && values[0].timestamp < cutoff) {
      values.shift()
    }
  }

  // Add export callback
  addExportCallback(callback: (metrics: MetricValue[]) => Promise<void>): void {
    this.exportCallbacks.push(callback)
  }

  // Export metrics in Prometheus format
  exportPrometheusFormat(): string {
    const lines: string[] = []

    // Export counters
    for (const [name, values] of this.counters.entries()) {
      lines.push(`# HELP ${name} Counter metric`)
      lines.push(`# TYPE ${name} counter`)
      for (const [key, value] of values.entries()) {
        lines.push(`${name}${key} ${value}`)
      }
    }

    // Export gauges
    for (const [name, values] of this.gauges.entries()) {
      lines.push(`# HELP ${name} Gauge metric`)
      lines.push(`# TYPE ${name} gauge`)
      for (const [key, value] of values.entries()) {
        lines.push(`${name}${key} ${value}`)
      }
    }

    // Export histograms with percentiles
    for (const [name, values] of this.histograms.entries()) {
      lines.push(`# HELP ${name} Histogram metric`)
      lines.push(`# TYPE ${name} histogram`)
      for (const [key, histogram] of values.entries()) {
        const stats = this.calculatePercentiles(histogram)
        lines.push(`${name}_bucket${key}{le="0.005"} ${stats.count}`)
        lines.push(`${name}_bucket${key}{le="0.01"} ${stats.count}`)
        lines.push(`${name}_bucket${key}{le="0.025"} ${stats.count}`)
        lines.push(`${name}_bucket${key}{le="0.05"} ${stats.count}`)
        lines.push(`${name}_bucket${key}{le="0.075"} ${stats.count}`)
        lines.push(`${name}_bucket${key}{le="0.1"} ${stats.count}`)
        lines.push(`${name}_bucket${key}{le="0.25"} ${stats.count}`)
        lines.push(`${name}_bucket${key}{le="0.5"} ${stats.count}`)
        lines.push(`${name}_bucket${key}{le="0.75"} ${stats.count}`)
        lines.push(`${name}_bucket${key}{le="1"} ${stats.count}`)
        lines.push(`${name}_bucket${key}{le="+Inf"} ${stats.count}`)
        lines.push(`${name}_sum${key} ${stats.sum}`)
        lines.push(`${name}_count${key} ${stats.count}`)
      }
    }

    return lines.join('\n')
  }

  // Export metrics as JSON array
  async exportMetrics(): Promise<MetricValue[]> {
    const metrics: MetricValue[] = []
    const now = Date.now()

    // Export counters
    for (const [name, values] of this.counters.entries()) {
      for (const [key, value] of values.entries()) {
        const { labels } = this.parseKey(key)
        metrics.push({
          name: `${name}`,
          value,
          timestamp: now,
          labels,
          unit: 'count',
        })
      }
    }

    // Export gauges
    for (const [name, values] of this.gauges.entries()) {
      for (const [key, value] of values.entries()) {
        const { labels } = this.parseKey(key)
        metrics.push({
          name: `${name}`,
          value,
          timestamp: now,
          labels,
          unit: 'gauge',
        })
      }
    }

    // Export histogram percentiles
    for (const [name, values] of this.histograms.entries()) {
      for (const [key, histogram] of values.entries()) {
        const { labels } = this.parseKey(key)
        const stats = this.calculatePercentiles(histogram)
        metrics.push(
          {
            name: `${name}_p50`,
            value: stats.p50,
            timestamp: now,
            labels,
            unit: 'ms',
          },
          {
            name: `${name}_p95`,
            value: stats.p95,
            timestamp: now,
            labels,
            unit: 'ms',
          },
          {
            name: `${name}_p99`,
            value: stats.p99,
            timestamp: now,
            labels,
            unit: 'ms',
          },
          {
            name: `${name}_mean`,
            value: stats.mean,
            timestamp: now,
            labels,
            unit: 'ms',
          }
        )
      }
    }

    // Export to callbacks
    const promises = this.exportCallbacks.map(callback =>
      callback(metrics).catch(err => console.error('Failed to export metrics:', err))
    )
    await Promise.all(promises)

    return metrics
  }

  // Get operation metrics aggregated by name
  getOperationMetrics(operation: string): OperationMetrics | null {
    const latencyHistogram = this.histograms.get(`operation_latency_ms`)
    if (!latencyHistogram) {
      return null
    }

    const key = `{operation="${operation}"}`
    const values = latencyHistogram.get(key)
    if (!values || values.length === 0) {
      return null
    }

    const errorCounter = this.counters.get(`operation_errors`)?.get(key) || 0
    const totalCounter = this.counters.get(`operation_total`)?.get(key) || 0

    const stats = this.calculatePercentiles(values)

    return {
      operation,
      count: totalCounter,
      totalDuration: stats.sum,
      minDuration: Math.min(...values),
      maxDuration: Math.max(...values),
      avgDuration: stats.mean,
      p50: stats.p50,
      p95: stats.p95,
      p99: stats.p99,
      errorCount: errorCounter,
      errorRate: totalCounter > 0 ? errorCounter / totalCounter : 0,
    }
  }

  // Record operation call
  recordOperation(operation: string, duration: number, success: boolean = true): void {
    const labels = { operation }
    const labelStr = `{operation="${operation}"}`

    // Record latency
    this.recordHistogram('operation_latency_ms', duration, labels)

    // Record counters
    this.incrementCounter('operation_total', 1, labels)
    if (!success) {
      this.incrementCounter('operation_errors', 1, labels)
    }

    // Update gauge for last latency
    this.setGauge('operation_last_latency_ms', duration, labels)
  }

  // Get statistics
  getStatistics(): {
    counters: number
    gauges: number
    histograms: number
    summaries: number
  } {
    return {
      counters: this.counters.size,
      gauges: this.gauges.size,
      histograms: this.histograms.size,
      summaries: this.summaries.size,
    }
  }

  // Private helper methods
  private makeKey(name: string, labels?: Record<string, string>): string {
    if (!labels || Object.keys(labels).length === 0) {
      return '{}'
    }
    const pairs = Object.entries(labels)
      .map(([k, v]) => `${k}="${v}"`)
      .join(',')
    return `{${pairs}}`
  }

  private parseKey(key: string): { labels: Record<string, string> } {
    const labels: Record<string, string> = {}
    const match = key.match(/\{([^}]*)\}/)
    if (match && match[1]) {
      const pairs = match[1].split(',')
      for (const pair of pairs) {
        const [k, v] = pair.split('=')
        if (k && v) {
          labels[k] = v.replace(/"/g, '')
        }
      }
    }
    return { labels }
  }

  private calculatePercentiles(values: number[]): {
    min: number
    max: number
    mean: number
    sum: number
    count: number
    p50: number
    p95: number
    p99: number
  } {
    if (values.length === 0) {
      return {
        min: 0,
        max: 0,
        mean: 0,
        sum: 0,
        count: 0,
        p50: 0,
        p95: 0,
        p99: 0,
      }
    }

    const sorted = [...values].sort((a, b) => a - b)
    const sum = values.reduce((a, b) => a + b, 0)
    const mean = sum / values.length

    const percentile = (p: number): number => {
      const idx = Math.ceil((p / 100) * sorted.length) - 1
      return sorted[Math.max(0, idx)]
    }

    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      mean,
      sum,
      count: values.length,
      p50: percentile(50),
      p95: percentile(95),
      p99: percentile(99),
    }
  }
}

// Global metrics instance
export const metrics = new PrometheusMetrics()
