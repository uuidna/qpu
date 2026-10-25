# WAVE 8C: Integration Guide

Step-by-step guide to integrate observability with WAVE 6 (Database) and WAVE 7 (MCP Composition).

## Quick Start

### 1. Setup Global Observability

```typescript
// Initialize in your application startup
import {
  tracer,
  metrics,
  getLogger,
  analytics,
  flushAllLoggers,
  addGlobalExportCallback
} from '@uuidna/qpu/observability'

// Configure sampling (example: 10% sampling)
const tracingSystem = new TracingSystem({ samplingRate: 0.1 })

// Configure cost tracking
analytics.setOperationCost('mcp.invoke', 0.001)
analytics.setOperationCost('db.query', 0.0005)

// Configure SLA targets
analytics.setSLATarget('api.request', {
  availability: 0.999,
  errorRate: 0.001,
  p99Latency: 500
})

// Setup log export (example: CloudFlare Logpush)
addGlobalExportCallback(async (logs) => {
  await fetch('https://api.logpush.example.com/logs', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.LOGPUSH_TOKEN}` },
    body: JSON.stringify(logs)
  })
})

// Setup graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down, flushing observability data...')
  await flushAllLoggers()
  process.exit(0)
})
```

### 2. Instrument API Handlers

```typescript
// In your main worker/handler file
import { createTraceContextMiddleware, createInstrumentedAPIHandler } from '@uuidna/qpu/observability/examples/api-integration'

export default {
  async fetch(request: Request, env: any, ctx: any) {
    // Extract trace context from request
    const contextMiddleware = createTraceContextMiddleware()
    const context = contextMiddleware(request)

    // Route to handlers
    const url = new URL(request.url)

    // Health check
    if (url.pathname === '/health') {
      return createHealthCheckEndpoint()(request)
    }

    // Metrics endpoint
    if (url.pathname === '/metrics') {
      return createMetricsEndpoint()
    }

    // Your API endpoints
    if (url.pathname === '/api/query') {
      const handler = createInstrumentedAPIHandler('query_operation', {
        costPerRequest: 0.001,
        slaP99: 500
      })

      return handler(request, async (context) => {
        // Your handler logic here
        const result = await executeQuery(context)
        return new Response(JSON.stringify(result))
      })
    }

    return new Response('Not Found', { status: 404 })
  }
}
```

### 3. Instrument MCP Composition

```typescript
// In your MCP composition setup
import { CompositionEngine } from '@uuidna/qpu/src/mcp-composition/composition-engine'
import {
  executeCompositionWithObservability,
  CompositionAnalytics
} from '@uuidna/qpu/observability/examples/mcp-composition-integration'

const engine = new CompositionEngine()
const analytics = new CompositionAnalytics()

// Patch the engine with observability
engine.execute = async function(request) {
  return executeCompositionWithObservability(this, request, request.context?.user)
}

// Track composition metrics
async function trackComposition(intent: string, result: CompositionResult) {
  const duration = result.total_time
  const success = result.success && result.errors.length === 0

  analytics.recordComposition(intent, duration, success)
}
```

### 4. Instrument Database Operations

```typescript
// In your database layer
import { DistributedDatabase } from '@uuidna/qpu/src/database/distributed-db'
import {
  executeQueryWithObservability,
  DatabasePerformanceMonitor
} from '@uuidna/qpu/observability/examples/database-integration'

const db = new DistributedDatabase()
const dbMonitor = new DatabasePerformanceMonitor()

// Patch database with observability
const originalQuery = db.query.bind(db)
db.query = async function<T>(sql: string, params?: any[], options?: any): Promise<T> {
  const context = tracer.createTraceContext()

  return executeQueryWithObservability(context, { sql, params, name: options?.name }, async () => {
    const result = await originalQuery(sql, params, options)

    // Track in performance monitor
    const duration = 0 // You'll get this from the span
    dbMonitor.recordQuery(options?.name || 'query', duration, true)

    return result
  })
}
```

## Integration Patterns

### Pattern 1: Function Wrapper

```typescript
import { instrumentOperation } from '@uuidna/qpu/observability'

async function myOperation(context: TraceContext, data: any) {
  return instrumentOperation(
    'my_operation',
    context,
    async () => {
      // Your code here
      return processData(data)
    },
    {
      kind: 'internal',
      attributes: { dataSize: JSON.stringify(data).length }
    }
  )
}
```

### Pattern 2: Decorator Pattern

```typescript
import { createSpanWrapper } from '@uuidna/qpu/observability'

const instrumentedQuery = createSpanWrapper('db.query', { kind: 'client' })

async function executeQuery(context: TraceContext) {
  return instrumentedQuery(context, async () => {
    return db.query('SELECT * FROM users')
  })
}
```

### Pattern 3: Batch Operations

```typescript
import { instrumentBatchOperation } from '@uuidna/qpu/observability'

const items = [
  { id: '1', fn: () => fetchUser('1') },
  { id: '2', fn: () => fetchUser('2') },
  { id: '3', fn: () => fetchUser('3') }
]

const results = await instrumentBatchOperation(
  'fetch_users',
  context,
  items,
  { concurrency: 2, recordMetrics: true }
)
```

### Pattern 4: Retry with Observability

```typescript
import { instrumentOperationWithRetry } from '@uuidna/qpu/observability'

async function fetchWithRetry(context: TraceContext, url: string) {
  return instrumentOperationWithRetry(
    'fetch_url',
    context,
    () => fetch(url),
    { maxRetries: 3, backoffMs: 100 }
  )
}
```

## Monitoring & Dashboards

### Performance Dashboard

```typescript
import { PerformanceDashboard } from '@uuidna/qpu/observability'
import { analytics } from '@uuidna/qpu/observability'

// Get current metrics
const data = await analytics.aggregateMetrics('minute')
const metrics = PerformanceDashboard.generateMetrics(data)

console.log('Latency:')
console.log(`  p50: ${metrics.latency.p50.toFixed(2)}ms`)
console.log(`  p95: ${metrics.latency.p95.toFixed(2)}ms`)
console.log(`  p99: ${metrics.latency.p99.toFixed(2)}ms`)

// Generate time series for graphing
const latencySeries = PerformanceDashboard.generateLatencyTimeSeries(60)
const throughputSeries = PerformanceDashboard.generateThroughputTimeSeries(60)
```

### Error Dashboard

```typescript
import { ErrorDashboard } from '@uuidna/qpu/observability'

const errorMetrics = ErrorDashboard.generateMetrics(data)
console.log('Top Errors:')
for (const error of errorMetrics.slice(0, 5)) {
  console.log(`  ${error.error}: ${error.count} occurrences`)
}

// Detect anomalies
const anomalies = ErrorDashboard.detectAnomalies(2.0)
for (const anomaly of anomalies) {
  console.log(`ALERT: Anomaly detected in ${anomaly.error}`)
  console.log(`  Expected: ${anomaly.expectedCount}, Got: ${anomaly.count}`)
}
```

### Cost Dashboard

```typescript
import { CostDashboard } from '@uuidna/qpu/observability'

const costSummary = CostDashboard.generateSummary(data)
console.log(`Total Cost: $${costSummary.totalCost.toFixed(2)}`)
console.log(`Daily Projection: $${costSummary.dailyProjection.toFixed(2)}`)

// Find optimization opportunities
const optimizations = CostDashboard.identifyOptimizations(data)
for (const opt of optimizations.slice(0, 3)) {
  console.log(`\nOptimization: ${opt.optimizationStrategy}`)
  console.log(`  Current: $${opt.currentCostPerRequest.toFixed(6)}/request`)
  console.log(`  Potential: $${opt.estimatedNewCostPerRequest.toFixed(6)}/request`)
  console.log(`  Savings: $${opt.potentialSavings.toFixed(6)}/request`)
}
```

## Export Backends

### Prometheus

```typescript
// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  const prometheusText = metrics.exportPrometheusFormat()
  res.type('text/plain').send(prometheusText)
})
```

### Jaeger/Tempo (OpenTelemetry)

```typescript
import { tracer } from '@uuidna/qpu/observability'

tracer.setExportCallback(async (spans) => {
  const batch = {
    resourceSpans: [{
      scopeSpans: [{
        spans: spans.map(convertToOTelFormat)
      }]
    }]
  }

  await fetch('http://localhost:4318/v1/traces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(batch)
  })
})
```

### Datadog

```typescript
import { addGlobalExportCallback } from '@uuidna/qpu/observability'

addGlobalExportCallback(async (logs) => {
  await fetch('https://http-intake.logs.datadoghq.com/v1/input', {
    method: 'POST',
    headers: {
      'DD-API-KEY': process.env.DATADOG_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(logs)
  })
})
```

### CloudFlare Logpush

```typescript
addGlobalExportCallback(async (logs) => {
  await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/logpush/datasets/http_requests/jobs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(logs)
  })
})
```

## Configuration Examples

### Development

```typescript
const tracer = new TracingSystem({
  samplingRate: 1.0, // 100% sampling for debugging
  bufferSize: 1000
})

const logger = getLogger('app', {
  level: 'debug', // Log everything
  bufferSize: 1000
})
```

### Production

```typescript
const tracer = new TracingSystem({
  samplingRate: 0.1, // 10% sampling for cost
  bufferSize: 10000
})

const logger = getLogger('app', {
  level: 'info', // Only info and above
  bufferSize: 5000
})

const metrics = new PrometheusMetrics({
  flushInterval: 60000 // 1 minute
})
```

### High-Traffic

```typescript
const tracer = new TracingSystem({
  samplingRate: 0.01, // 1% sampling
  bufferSize: 50000,
  maxSpansPerTrace: 100
})

const metrics = new PrometheusMetrics({
  flushInterval: 30000 // 30 seconds
})
```

## Testing

```typescript
import { tracer, metrics, getLogger } from '@uuidna/qpu/observability'

describe('Observability Integration', () => {
  it('should track operation latency', async () => {
    const context = tracer.createTraceContext('test-user')
    const operation = 'test_operation'

    const start = performance.now()
    await delay(100)
    const duration = performance.now() - start

    metrics.recordOperation(operation, duration, true)

    // Verify metrics were recorded
    const opMetrics = metrics.getOperationMetrics(operation)
    expect(opMetrics).toBeDefined()
    expect(opMetrics?.count).toBe(1)
  })

  it('should propagate trace context', () => {
    const context = tracer.createTraceContext('test-user')
    const headers = tracer.injectTraceContext(context)

    expect(headers['traceparent']).toBeDefined()
    expect(headers['x-correlation-id']).toBe(context.correlationId)

    const extractedContext = tracer.extractTraceContext(headers)
    expect(extractedContext?.traceId).toBe(context.traceId)
  })

  it('should aggregate analytics', async () => {
    const context = tracer.createTraceContext()
    metrics.recordOperation('test_op', 100, true)
    metrics.recordOperation('test_op', 200, false)

    const data = await analytics.aggregateMetrics('minute')
    expect(data.metrics.size).toBeGreaterThan(0)
  })
})
```

## Best Practices

1. **Always pass TraceContext** - Never execute operations without a trace context
2. **Use correlation IDs** - Track requests across service boundaries
3. **Set cost data** - Enable cost tracking for optimization
4. **Configure SLA targets** - Get alerts when SLAs are violated
5. **Export regularly** - Flush logs and traces frequently
6. **Monitor the monitors** - Track observability system health
7. **Clean old data** - Regularly clean old spans and logs
8. **Test observability** - Include observability in unit tests

## Troubleshooting

### High Memory Usage

```typescript
// Reduce buffer sizes
const tracer = new TracingSystem({ bufferSize: 1000 })
const logger = getLogger('app', { bufferSize: 1000 })

// Increase flush frequency
await tracer.flush()
await flushAllLoggers()

// Clean old data
tracer.clearOldSpans(1800000) // 30 minutes
```

### Missing Traces

```typescript
// Check sampling rate
console.log(tracer.getStatistics())

// Ensure export callback is set
tracer.setExportCallback(async (spans) => {
  console.log(`Exporting ${spans.length} spans`)
  // Your export logic
})
```

### Performance Impact

```typescript
// Use lower sampling rate
const tracer = new TracingSystem({ samplingRate: 0.01 })

// Use batch export
metrics.exportMetrics().then(metrics => {
  console.log(`Exported ${metrics.length} metrics`)
})
```
