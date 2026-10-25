// Observability types and interfaces

export interface TraceContext {
  traceId: string
  spanId: string
  parentSpanId?: string
  correlationId: string
  userId?: string
  requestId: string
}

export interface MetricValue {
  name: string
  value: number
  timestamp: number
  labels?: Record<string, string>
  unit?: string
}

export interface StructuredLog {
  timestamp: number
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  context: TraceContext
  fields?: Record<string, any>
  error?: {
    message: string
    stack?: string
    code?: string
  }
}

export interface SpanEvent {
  name: string
  timestamp: number
  attributes?: Record<string, any>
}

export interface Span {
  traceId: string
  spanId: string
  parentSpanId?: string
  name: string
  kind: 'client' | 'server' | 'internal' | 'producer' | 'consumer'
  startTime: number
  endTime?: number
  duration?: number
  status: 'unset' | 'ok' | 'error'
  attributes?: Record<string, any>
  events?: SpanEvent[]
  links?: Array<{ traceId: string; spanId: string }>
}

export interface OperationMetrics {
  operation: string
  count: number
  totalDuration: number
  minDuration: number
  maxDuration: number
  avgDuration: number
  p50: number
  p95: number
  p99: number
  errorCount: number
  errorRate: number
  lastError?: string
  lastErrorTime?: number
}

export interface AnalyticsData {
  timestamp: number
  period: 'minute' | 'hour' | 'day'
  metrics: Map<string, OperationMetrics>
  topErrors: Array<{
    error: string
    count: number
    lastOccurrence: number
  }>
  costData?: {
    operationCosts: Map<string, number>
    totalCost: number
    costPerOperation: Map<string, number>
  }
  slaMetrics?: {
    availability: number
    errorRate: number
    p99Latency: number
  }
}

export interface MetricsExport {
  timestamp: number
  metrics: MetricValue[]
  spans: Span[]
}

export interface DashboardMetrics {
  timestamp: number
  latency: {
    p50: number
    p95: number
    p99: number
    mean: number
  }
  errorRate: number
  throughput: number
  activeConnections: number
  topOperations: Array<{
    operation: string
    count: number
    avgLatency: number
    errorRate: number
  }>
  topErrors: Array<{
    error: string
    count: number
    lastOccurrence: number
  }>
}
