# WAVE 8C: Observability & Analytics

Complete observability for the QPU platform with OpenTelemetry-compatible tracing, Prometheus metrics, structured logging, and analytics aggregation.

## Architecture

```
All Operations (MCP, DB, API)
    ↓
[Instrumentation Layer]
    ├── Tracing (W3C Trace Context)
    ├── Metrics (Prometheus format)
    ├── Logging (Structured JSON)
    └── Span Events
    ↓
[Data Pipeline]
    ├── Trace buffering & export
    ├── Metric aggregation
    ├── Log collection
    └── Correlation ID propagation
    ↓
[Analytics Engine]
    ├── Operation metrics aggregation
    ├── Error tracking & analysis
    ├── Cost calculation
    └── SLA monitoring
    ↓
[Dashboards]
    ├── Performance (latency, throughput)
    ├── Errors (tracking, anomalies, alerts)
    └── Cost (optimization, forecasts, budgets)
```

## Core Modules

### Types (`types.ts`)
Defines all observability data structures:
- `TraceContext` - Request trace metadata (traceId, spanId, correlationId, userId)
- `Span` - Individual operation span with timing and status
- `MetricValue` - Single metric data point
- `StructuredLog` - JSON log with context
- `OperationMetrics` - Aggregated metrics for an operation
- `AnalyticsData` - Period-aggregated analytics

### Tracing (`tracing.ts`)
Distributed tracing with W3C Trace Context support:

```typescript
import { tracer, TracingSystem } from '@uuidna/qpu/observability'

// Create trace context for a request
const context = tracer.createTraceContext(userId)

// Start span for an operation
const span = tracer.startSpan('db.query', context, 'client')

try {
  // Do work...
  tracer.endSpan(span, 'ok')
} catch (err) {
  tracer.endSpan(span, 'error', { error: err.message })
}

// Export trace context to headers for propagation
const headers = tracer.injectTraceContext(context)

// Extract from incoming headers
const incomingContext = tracer.extractTraceContext(incomingHeaders)
```

Features:
- **Automatic ID generation** - Creates 64-bit random IDs
- **Sampling** - Configurable sampling rate (default 100%)
- **Span buffering** - Batches spans for efficient export
- **W3C Trace Context** - Standard `traceparent` header format
- **Span events** - Record events within spans
- **Correlation tracking** - Tracks full request lineage

### Metrics (`metrics.ts`)
Prometheus-style metrics collection:

```typescript
import { metrics } from '@uuidna/qpu/observability'

// Counter - monotonically increasing
metrics.incrementCounter('http_requests_total', 1, { method: 'GET', path: '/api' })

// Gauge - point-in-time value
metrics.setGauge('active_connections', 42)

// Histogram - value distribution
metrics.recordHistogram('operation_latency_ms', duration, { operation: 'query' })

// Record operation with built-in tracking
metrics.recordOperation('mcp_call', 125, true) // duration (ms), success

// Export metrics
const prometheusText = metrics.exportPrometheusFormat()
const jsonMetrics = await metrics.exportMetrics()
```

Features:
- **Counters** - Track cumulative values
- **Gauges** - Track current values
- **Histograms** - Track distributions with percentiles (p50, p95, p99)
- **Operation tracking** - Built-in latency and error tracking
- **Label support** - Tag metrics with dimensions
- **Export callbacks** - Real-time metric export to backends
- **Prometheus format** - Standard Prometheus text format export

### Logging (`logging.ts`)
Structured JSON logging with correlation:

```typescript
import { getLogger } from '@uuidna/qpu/observability'

const logger = getLogger('my-module')

// All logging requires trace context
logger.info('Operation started', context, { operation: 'query' })
logger.warn('Slow operation', context, { duration: 5000 })
logger.error('Failed to execute', context, error, { retries: 3 })

// Context stack management
logger.pushContext(context)
const retrievedContext = logger.getContext(context.correlationId)
logger.popContext(context.correlationId)

// Flush logs to backends
await logger.flush()

// Global operations
import { flushAllLoggers, collectAllLogs } from '@uuidna/qpu/observability'
await flushAllLoggers()
const allLogs = collectAllLogs()
```

Features:
- **Structured logs** - JSON with context and fields
- **Log levels** - debug, info, warn, error
- **Error tracking** - Captures error messages and stack traces
- **Context management** - Stack-based context tracking
- **Buffering** - Batches logs for efficient export
- **Export callbacks** - Multiple export targets
- **Console output** - Real-time output for debugging

### Analytics (`analytics.ts`)
Aggregates metrics, spans, and logs into analytics data:

```typescript
import { analytics } from '@uuidna/qpu/observability'

// Set operation costs for cost tracking
analytics.setOperationCost('mcp.invoke', 0.001) // $0.001 per call

// Set SLA targets
analytics.setSLATarget('api.request', {
  availability: 0.999,
  errorRate: 0.001,
  p99Latency: 500
})

// Aggregate metrics for a period
const data = await analytics.aggregateMetrics('minute')
// Returns: OperationMetrics, topErrors, costData, slaMetrics

// Check SLA compliance
const violations = analytics.checkSLACompliance(data)

// Get cost report
const report = analytics.getCostReport(startTime, endTime)
// Returns: totalCost, costByOperation, averageCostPerRequest

// Historical data access
const historical = analytics.getHistoricalData(100) // Last 100 periods
```

Features:
- **Period aggregation** - Minute, hour, or day
- **Cost tracking** - Per-operation cost calculation
- **SLA monitoring** - Compliance checking
- **Error analysis** - Top errors and trends
- **Historical data** - Configurable retention
- **Cost reports** - Cost analysis and optimization

## Dashboards

### Performance Dashboard
Real-time and historical performance metrics:

```typescript
import { PerformanceDashboard } from '@uuidna/qpu/observability'

// Current metrics
const metrics = PerformanceDashboard.generateMetrics(analyticsData)
// Returns: p50/p95/p99 latency, throughput, error rate, top operations

// Time series data
const latencySeries = PerformanceDashboard.generateLatencyTimeSeries(60) // Last 60 minutes
const throughputSeries = PerformanceDashboard.generateThroughputTimeSeries(60)

// Operation breakdown
const breakdown = PerformanceDashboard.generateOperationBreakdown()

// Slow query detection
const slowQueries = PerformanceDashboard.generateSlowQueries(1000) // > 1s
```

### Error Dashboard
Error tracking, analysis, and alerting:

```typescript
import { ErrorDashboard } from '@uuidna/qpu/observability'

// Current error metrics
const errors = ErrorDashboard.generateMetrics(analyticsData)

// Error trends over time
const trends = ErrorDashboard.generateErrorTrends('connection refused', 60)

// Error distribution by operation
const distribution = ErrorDashboard.generateErrorDistribution()

// Anomaly detection
const anomalies = ErrorDashboard.detectAnomalies(2.0) // > 2 std dev

// Alert summary
const summary = ErrorDashboard.generateAlertSummary()
// Returns: critical/high/medium errors, error rate, recommended actions
```

### Cost Dashboard
Cost tracking, optimization, and forecasting:

```typescript
import { CostDashboard } from '@uuidna/qpu/observability'

// Cost summary
const summary = CostDashboard.generateSummary(analyticsData)
// Returns: totalCost, costByOperation, topCostOperations, dailyProjection

// Cost breakdown by operation
const breakdown = CostDashboard.generateBreakdown(analyticsData)

// Optimization opportunities
const optimizations = CostDashboard.identifyOptimizations(analyticsData)
// Returns: caching, batching, query optimization strategies

// Cost forecast
const forecast = CostDashboard.generateCostForecast(7) // 7 days

// Budget alerts
const alerts = CostDashboard.generateBudgetAlerts(5000) // $5000 budget
```

## Integration Points

### MCP Composition Engine (WAVE 7)
Instrument MCP calls:

```typescript
import { tracer, metrics, getLogger } from '@uuidna/qpu/observability'

async execute(request) {
  const context = tracer.createTraceContext(request.userId)
  const logger = getLogger('composition')
  const startTime = performance.now()

  logger.info('Composition started', context, { steps: request.steps?.length })

  for (const step of steps) {
    const span = tracer.startSpan(`mcp.${step.operation}`, context, 'client')
    const opStart = performance.now()

    try {
      const result = await executeMCP(step)
      span.attributes = { result_size: JSON.stringify(result).length }
      tracer.endSpan(span, 'ok')

      const duration = performance.now() - opStart
      metrics.recordOperation(step.operation, duration, true)
      logger.debug('Step completed', context, { step: step.id, duration })
    } catch (err) {
      tracer.endSpan(span, 'error', { error: err.message })
      metrics.recordOperation(step.operation, opStart - performance.now(), false)
      logger.error('Step failed', context, err, { step: step.id })
    }
  }

  const totalDuration = performance.now() - startTime
  metrics.recordOperation('composition', totalDuration, errors.length === 0)
}
```

### Database Operations (WAVE 6)
Instrument database queries:

```typescript
const span = tracer.startSpan('db.query', context, 'client')
const startTime = performance.now()

try {
  const result = await query.execute()
  const duration = performance.now() - startTime

  span.recordEvent({
    name: 'db.result',
    timestamp: Date.now(),
    attributes: { rows_returned: result.rows.length }
  })

  tracer.endSpan(span, 'ok')
  metrics.recordHistogram('db_query_latency_ms', duration, { operation: query.name })
  logger.debug('Query executed', context, { operation: query.name, duration })
} catch (err) {
  const duration = performance.now() - startTime
  tracer.endSpan(span, 'error', { error: err.message })
  metrics.recordOperation(`db.${query.name}`, duration, false)
  logger.error('Query failed', context, err, { operation: query.name })
}
```

### API Handlers
Instrument HTTP endpoints:

```typescript
export async function handler(request: Request) {
  // Extract trace context from headers
  let context = tracer.extractTraceContext(request.headers)
  if (!context) {
    context = tracer.createTraceContext(userId, parentContext)
  }

  const span = tracer.startSpan(request.pathname, context, 'server')
  const startTime = performance.now()

  try {
    const response = await processRequest(request)
    const duration = performance.now() - startTime

    span.attributes = {
      http_method: request.method,
      http_status_code: response.status,
      http_response_size: response.size
    }

    tracer.endSpan(span, 'ok')
    metrics.recordOperation(`http.${request.pathname}`, duration, response.status < 400)
    logger.info('Request completed', context, { path: request.pathname, status: response.status, duration })

    // Propagate trace context to response
    const headers = tracer.injectTraceContext(context)
    return new Response(response.body, {
      status: response.status,
      headers: { ...response.headers, ...headers }
    })
  } catch (err) {
    const duration = performance.now() - startTime
    tracer.endSpan(span, 'error', { error: err.message })
    metrics.recordOperation(`http.${request.pathname}`, duration, false)
    logger.error('Request failed', context, err, { path: request.pathname })

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
```

## Export Backends

### Prometheus Export
```typescript
// Export metrics to Prometheus endpoint
app.get('/metrics', async (req, res) => {
  const prometheusText = metrics.exportPrometheusFormat()
  res.type('text/plain').send(prometheusText)
})
```

### Jaeger/Tempo Tracing
```typescript
import { tracer } from '@uuidna/qpu/observability'

tracer.setExportCallback(async (spans) => {
  // Convert to Jaeger/Tempo format and export
  const batch = {
    resourceSpans: [{
      scopeSpans: [{
        spans: spans.map(span => convertToJaegerFormat(span))
      }]
    }]
  }
  await fetch('http://localhost:14250/api/traces', {
    method: 'POST',
    body: JSON.stringify(batch)
  })
})
```

### CloudFlare Logpush / Datadog
```typescript
import { getLogger, addGlobalExportCallback } from '@uuidna/qpu/observability'

addGlobalExportCallback(async (logs) => {
  // Send to CloudFlare Logpush or Datadog
  await fetch('https://api.datadoghq.com/api/v2/logs', {
    method: 'POST',
    headers: { 'DD-API-KEY': process.env.DATADOG_API_KEY },
    body: JSON.stringify(logs)
  })
})
```

## Configuration

```typescript
// Tracing configuration
const tracer = new TracingSystem({
  samplingRate: 0.1, // 10% sampling
  maxSpansPerTrace: 500,
  bufferSize: 10000
})

// Metrics configuration
const metrics = new PrometheusMetrics({
  flushInterval: 60000 // 1 minute
})

// Logger configuration
const logger = getLogger('myModule', {
  level: 'info',
  bufferSize: 5000
})

// Analytics configuration
const analytics = new AnalyticsEngine({
  costPerOperation: new Map([
    ['mcp.invoke', 0.001],
    ['db.query', 0.0005]
  ]),
  slaTargets: new Map([
    ['api.request', { availability: 0.999, errorRate: 0.001, p99Latency: 500 }]
  ])
})
```

## Performance & Resource Usage

- **Tracer**: 8KB overhead + ~100B per span
- **Metrics**: Negligible collection overhead, ~1KB per metric
- **Logger**: ~500B per log, buffered in batches
- **Analytics**: ~100KB for 24 hours of data

All components auto-cleanup old data and support configurable retention.

## Status

Ready to integrate with WAVE 6 (Database) and WAVE 7 (MCP Composition).
