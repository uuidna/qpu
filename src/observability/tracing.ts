// OpenTelemetry tracing instrumentation (WAVE 8C)

import { TraceContext, Span, SpanEvent } from './types.js'
import { randomBytes } from 'crypto'

export class TracingSystem {
  private spans: Map<string, Span> = new Map()
  private activeSpans: Map<string, Span> = new Map()
  private samplingRate: number = 1.0 // 100% by default
  private maxSpansPerTrace: number = 1000
  private spanBuffer: Span[] = []
  private bufferSize: number = 10000
  private exportCallback?: (spans: Span[]) => Promise<void>

  constructor(config?: { samplingRate?: number; maxSpansPerTrace?: number; bufferSize?: number }) {
    if (config?.samplingRate !== undefined) {
      this.samplingRate = Math.min(1, Math.max(0, config.samplingRate))
    }
    if (config?.maxSpansPerTrace !== undefined) {
      this.maxSpansPerTrace = config.maxSpansPerTrace
    }
    if (config?.bufferSize !== undefined) {
      this.bufferSize = config.bufferSize
    }
  }

  // Generate trace context for a new request
  createTraceContext(userId?: string, parentContext?: TraceContext): TraceContext {
    const shouldSample = Math.random() < this.samplingRate
    if (!shouldSample && !parentContext) {
      // Non-sampled trace without parent
      return {
        traceId: this.generateId(),
        spanId: this.generateId(),
        correlationId: this.generateId(),
        userId,
        requestId: this.generateId(),
      }
    }

    return {
      traceId: parentContext?.traceId || this.generateId(),
      spanId: this.generateId(),
      parentSpanId: parentContext?.spanId,
      correlationId: parentContext?.correlationId || this.generateId(),
      userId: userId || parentContext?.userId,
      requestId: parentContext?.requestId || this.generateId(),
    }
  }

  // Start a new span
  startSpan(
    name: string,
    context: TraceContext,
    kind: 'client' | 'server' | 'internal' | 'producer' | 'consumer' = 'internal',
    attributes?: Record<string, any>
  ): Span {
    const spanId = this.generateId()
    const span: Span = {
      traceId: context.traceId,
      spanId,
      parentSpanId: context.spanId,
      name,
      kind,
      startTime: Date.now(),
      status: 'unset',
      attributes,
      events: [],
    }

    this.activeSpans.set(spanId, span)
    return span
  }

  // Record an event within a span
  recordEvent(span: Span, event: SpanEvent): void {
    if (!this.activeSpans.has(span.spanId)) {
      return // Span already ended
    }
    span.events?.push(event)
  }

  // End a span
  endSpan(span: Span, status: 'ok' | 'error' = 'ok', attributes?: Record<string, any>): void {
    if (!this.activeSpans.has(span.spanId)) {
      return // Already ended
    }

    span.endTime = Date.now()
    span.duration = span.endTime - span.startTime
    span.status = status
    if (attributes) {
      span.attributes = { ...span.attributes, ...attributes }
    }

    this.activeSpans.delete(span.spanId)
    this.spans.set(span.spanId, span)
    this.spanBuffer.push(span)

    // Auto-flush if buffer exceeds size
    if (this.spanBuffer.length >= this.bufferSize) {
      this.flush().catch(err => console.error('Failed to flush spans:', err))
    }
  }

  // Get a span by ID
  getSpan(spanId: string): Span | undefined {
    return this.activeSpans.get(spanId) || this.spans.get(spanId)
  }

  // Get all spans for a trace
  getTraceSpans(traceId: string): Span[] {
    return Array.from(this.spans.values()).filter(span => span.traceId === traceId)
  }

  // Extract trace context from headers (W3C Trace Context format)
  extractTraceContext(headers: Record<string, string>): TraceContext | undefined {
    const traceparent = headers['traceparent'] || headers['Traceparent']
    if (!traceparent) {
      return undefined
    }

    // Format: version-traceId-parentSpanId-traceFlags
    const parts = traceparent.split('-')
    if (parts.length !== 4) {
      return undefined
    }

    return {
      traceId: parts[1],
      spanId: parts[2],
      correlationId: headers['x-correlation-id'] || this.generateId(),
      userId: headers['x-user-id'],
      requestId: headers['x-request-id'] || this.generateId(),
    }
  }

  // Inject trace context into headers (W3C Trace Context format)
  injectTraceContext(context: TraceContext): Record<string, string> {
    const traceFlags = context.traceId ? '01' : '00' // sampled
    return {
      traceparent: `00-${context.traceId}-${context.spanId}-${traceFlags}`,
      'x-correlation-id': context.correlationId,
      'x-request-id': context.requestId,
      ...(context.userId && { 'x-user-id': context.userId }),
    }
  }

  // Set export callback for span batches
  setExportCallback(callback: (spans: Span[]) => Promise<void>): void {
    this.exportCallback = callback
  }

  // Flush buffered spans
  async flush(): Promise<void> {
    if (this.spanBuffer.length === 0) {
      return
    }

    const spans = [...this.spanBuffer]
    this.spanBuffer = []

    if (this.exportCallback) {
      try {
        await this.exportCallback(spans)
      } catch (err) {
        console.error('Failed to export spans:', err)
        // Re-buffer failed spans (limit attempts)
        if (this.spanBuffer.length < this.bufferSize / 2) {
          this.spanBuffer.unshift(...spans)
        }
      }
    }
  }

  // Get statistics for active and buffered spans
  getStatistics(): {
    activeSpans: number
    bufferedSpans: number
    totalSpans: number
    samplingRate: number
  } {
    return {
      activeSpans: this.activeSpans.size,
      bufferedSpans: this.spanBuffer.length,
      totalSpans: this.spans.size,
      samplingRate: this.samplingRate,
    }
  }

  // Clear old spans (older than maxAge ms)
  clearOldSpans(maxAge: number = 3600000): number {
    const cutoff = Date.now() - maxAge
    let removed = 0

    for (const [id, span] of this.spans.entries()) {
      if (span.endTime && span.endTime < cutoff) {
        this.spans.delete(id)
        removed++
      }
    }

    return removed
  }

  // Private helper to generate random IDs
  private generateId(): string {
    return randomBytes(8).toString('hex')
  }
}

// Global tracing instance
export const tracer = new TracingSystem()
