// Distributed tracing for cross-domain visibility
export interface Span {
  id: string
  parentId?: string
  domain: string
  operation: string
  startTime: number
  endTime?: number
  duration?: number
  status: 'pending' | 'success' | 'error'
  metadata: Record<string, any>
}

export class DistributedTracer {
  private spans = new Map<string, Span>()
  private activeSpans: Set<string> = new Set()
  private traces: Span[][] = []

  startSpan(domain: string, operation: string, parentId?: string): string {
    const spanId = this.generateId()
    const span: Span = {
      id: spanId,
      parentId,
      domain,
      operation,
      startTime: Date.now(),
      status: 'pending',
      metadata: {},
    }

    this.spans.set(spanId, span)
    this.activeSpans.add(spanId)
    return spanId
  }

  endSpan(spanId: string, status: 'success' | 'error' = 'success') {
    const span = this.spans.get(spanId)
    if (span) {
      span.endTime = Date.now()
      span.duration = span.endTime - span.startTime
      span.status = status
      this.activeSpans.delete(spanId)
    }
  }

  addMetadata(spanId: string, key: string, value: any) {
    const span = this.spans.get(spanId)
    if (span) {
      span.metadata[key] = value
    }
  }

  getTrace(traceId: string): Span[] {
    return Array.from(this.spans.values()).filter(s => s.id === traceId || s.parentId === traceId)
  }

  getLatencyByDomain(): Record<string, number> {
    const latencies: Record<string, number[]> = {}

    for (const span of this.spans.values()) {
      if (span.duration) {
        if (!latencies[span.domain]) {
          latencies[span.domain] = []
        }
        latencies[span.domain].push(span.duration)
      }
    }

    const averages: Record<string, number> = {}
    for (const [domain, durations] of Object.entries(latencies)) {
      averages[domain] = durations.reduce((a, b) => a + b, 0) / durations.length
    }

    return averages
  }

  getCriticalPath(): Span[] {
    const sorted = Array.from(this.spans.values())
      .filter(s => s.duration)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))

    return sorted.slice(0, 10)
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  getStats() {
    const spans = Array.from(this.spans.values())
    const totalDuration = spans.reduce((sum, s) => sum + (s.duration || 0), 0)
    const avgDuration = totalDuration / spans.length

    return {
      totalSpans: spans.length,
      activeSpans: this.activeSpans.size,
      averageDuration: avgDuration,
      successRate: spans.filter(s => s.status === 'success').length / spans.length,
      domainCount: new Set(spans.map(s => s.domain)).size,
    }
  }
}

export const tracer = new DistributedTracer()
