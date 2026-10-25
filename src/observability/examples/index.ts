// Observability integration examples (WAVE 8C)
// Real-world examples of how to integrate observability with existing code

export { executeCompositionWithObservability, patchCompositionEngineWithObservability, CompositionAnalytics } from './mcp-composition-integration.js'

export { executeQueryWithObservability, executeTransactionWithObservability, patchDistributedDatabaseWithObservability, DatabasePerformanceMonitor } from './database-integration.js'

export { createTraceContextMiddleware, createInstrumentedAPIHandler, createHealthCheckEndpoint, createMetricsEndpoint, createTracesEndpoint, createExampleAPIHandler, RateLimitMiddleware, AuthMiddleware } from './api-integration.js'
