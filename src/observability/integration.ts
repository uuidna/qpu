// Integration helpers for observability (WAVE 8C)
// Utilities to easily instrument existing code with tracing, metrics, and logging

import { tracer, metrics, getLogger } from './index.js'
import { TraceContext } from './types.js'

/**
 * Middleware to extract/create trace context and attach to request
 */
export function traceContextMiddleware(
  request: Request,
  userId?: string
): TraceContext {
  // Try to extract from headers
  let context = tracer.extractTraceContext(
    Object.fromEntries(request.headers.entries())
  )

  // Create new if not found
  if (!context) {
    context = tracer.createTraceContext(userId)
  }

  return context
}

/**
 * Instrument an async operation with tracing, metrics, and logging
 */
export async function instrumentOperation<T>(
  operationName: string,
  context: TraceContext,
  fn: () => Promise<T>,
  options?: {
    kind?: 'client' | 'server' | 'internal' | 'producer' | 'consumer'
    attributes?: Record<string, any>
    recordMetrics?: boolean
  }
): Promise<T> {
  const logger = getLogger('instrumentation')
  const span = tracer.startSpan(
    operationName,
    context,
    options?.kind || 'internal',
    options?.attributes
  )

  const startTime = performance.now()
  logger.debug(`${operationName} started`, context, { operation: operationName })

  try {
    const result = await fn()
    const duration = performance.now() - startTime

    span.recordEvent({
      name: 'operation.complete',
      timestamp: Date.now(),
      attributes: { duration, success: true }
    })

    if (options?.recordMetrics !== false) {
      metrics.recordOperation(operationName, duration, true)
    }

    tracer.endSpan(span, 'ok')
    logger.debug(`${operationName} completed`, context, {
      operation: operationName,
      duration: Math.round(duration)
    })

    return result
  } catch (err) {
    const duration = performance.now() - startTime
    const error = err as Error

    span.recordEvent({
      name: 'operation.error',
      timestamp: Date.now(),
      attributes: { duration, error: error.message }
    })

    if (options?.recordMetrics !== false) {
      metrics.recordOperation(operationName, duration, false)
    }

    tracer.endSpan(span, 'error', { error: error.message })
    logger.error(`${operationName} failed`, context, error, {
      operation: operationName,
      duration: Math.round(duration)
    })

    throw err
  }
}

/**
 * Instrument an operation with retries and observability
 */
export async function instrumentOperationWithRetry<T>(
  operationName: string,
  context: TraceContext,
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number
    backoffMs?: number
    recordMetrics?: boolean
  }
): Promise<T> {
  const logger = getLogger('retry')
  const maxRetries = options?.maxRetries || 3
  const backoffMs = options?.backoffMs || 100

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await instrumentOperation(
        `${operationName}:attempt:${attempt}`,
        context,
        fn,
        { recordMetrics: options?.recordMetrics }
      )
    } catch (err) {
      lastError = err as Error

      if (attempt < maxRetries) {
        const delay = backoffMs * Math.pow(2, attempt - 1)
        logger.warn(`${operationName} failed, retrying in ${delay}ms`, context, {
          operation: operationName,
          attempt,
          error: lastError.message,
          nextRetryMs: delay
        })
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  logger.error(
    `${operationName} failed after ${maxRetries} attempts`,
    context,
    lastError || new Error('Unknown error'),
    { operation: operationName, attempts: maxRetries }
  )

  throw lastError || new Error(`${operationName} failed after ${maxRetries} attempts`)
}

/**
 * Instrument a database query
 */
export async function instrumentDatabaseQuery<T>(
  operation: string,
  context: TraceContext,
  query: () => Promise<T>,
  options?: { table?: string; rows?: number }
): Promise<T> {
  return instrumentOperation(
    `db.${operation}`,
    context,
    query,
    {
      kind: 'client',
      attributes: {
        db_operation: operation,
        db_table: options?.table
      }
    }
  )
}

/**
 * Instrument an MCP call
 */
export async function instrumentMCPCall<T>(
  mcpServer: string,
  operation: string,
  context: TraceContext,
  call: () => Promise<T>,
  options?: { params?: any }
): Promise<T> {
  return instrumentOperation(
    `mcp.${mcpServer}.${operation}`,
    context,
    call,
    {
      kind: 'client',
      attributes: {
        mcp_server: mcpServer,
        mcp_operation: operation,
        mcp_params: options?.params
      }
    }
  )
}

/**
 * Instrument an HTTP request/response cycle
 */
export async function instrumentHTTPRequest(
  request: Request,
  context: TraceContext,
  handler: () => Promise<Response>
): Promise<Response> {
  const logger = getLogger('http')
  const span = tracer.startSpan(request.pathname, context, 'server', {
    http_method: request.method,
    http_url: request.url
  })

  const startTime = performance.now()

  try {
    const response = await handler()
    const duration = performance.now() - startTime

    span.recordEvent({
      name: 'http.response',
      timestamp: Date.now(),
      attributes: {
        http_status_code: response.status,
        http_response_size: response.headers.get('content-length') || 'unknown'
      }
    })

    tracer.endSpan(span, response.status < 500 ? 'ok' : 'error')
    metrics.recordOperation(`http.${request.pathname}`, duration, response.status < 400)

    logger.info('Request completed', context, {
      method: request.method,
      path: request.pathname,
      status: response.status,
      duration: Math.round(duration)
    })

    // Add trace headers to response
    const headers = tracer.injectTraceContext(context)
    const responseHeaders = new Headers(response.headers)
    for (const [key, value] of Object.entries(headers)) {
      responseHeaders.set(key, value)
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders
    })
  } catch (err) {
    const duration = performance.now() - startTime
    const error = err as Error

    tracer.endSpan(span, 'error', { error: error.message })
    metrics.recordOperation(`http.${request.pathname}`, duration, false)

    logger.error('Request failed', context, error, {
      method: request.method,
      path: request.pathname,
      duration: Math.round(duration)
    })

    throw err
  }
}

/**
 * Record a cost event for cost tracking
 */
export function recordCost(
  operation: string,
  context: TraceContext,
  costAmount: number,
  metadata?: any
): void {
  const logger = getLogger('cost')

  logger.info('Cost recorded', context, {
    operation,
    cost: costAmount,
    ...metadata
  })

  // Could also integrate with cost tracking system
  metrics.recordHistogram('operation_cost', costAmount, { operation })
}

/**
 * Batch multiple operations and track collectively
 */
export async function instrumentBatchOperation<T>(
  batchName: string,
  context: TraceContext,
  items: Array<{ id: string; fn: () => Promise<any> }>,
  options?: { concurrency?: number; recordMetrics?: boolean }
): Promise<T[]> {
  const logger = getLogger('batch')
  const concurrency = options?.concurrency || 5

  logger.info('Batch operation started', context, {
    batch: batchName,
    itemCount: items.length,
    concurrency
  })

  const span = tracer.startSpan(`batch.${batchName}`, context, 'internal', {
    batch_item_count: items.length,
    concurrency
  })

  const startTime = performance.now()
  const results: T[] = []
  let successCount = 0
  let errorCount = 0

  // Process with concurrency limit
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency)
    const promises = batch.map(async item => {
      try {
        const result = await item.fn()
        successCount++
        return result
      } catch (err) {
        errorCount++
        logger.warn(`Batch item ${item.id} failed`, context, {
          batch: batchName,
          itemId: item.id,
          error: (err as Error).message
        })
        throw err
      }
    })

    try {
      const batchResults = await Promise.all(promises)
      results.push(...batchResults)
    } catch (err) {
      // Continue processing other batches even if some fail
      logger.warn(`Batch processing error`, context, {
        batch: batchName,
        error: (err as Error).message
      })
    }
  }

  const duration = performance.now() - startTime

  span.recordEvent({
    name: 'batch.complete',
    timestamp: Date.now(),
    attributes: {
      duration,
      successCount,
      errorCount,
      totalCount: items.length
    }
  })

  tracer.endSpan(span, errorCount === 0 ? 'ok' : 'error')

  if (options?.recordMetrics !== false) {
    metrics.recordOperation(`batch.${batchName}`, duration, errorCount === 0)
  }

  logger.info('Batch operation completed', context, {
    batch: batchName,
    duration: Math.round(duration),
    successCount,
    errorCount,
    totalCount: items.length
  })

  return results
}

/**
 * Create a span wrapper function for use as a decorator pattern
 */
export function createSpanWrapper(
  operationName: string,
  options?: {
    kind?: 'client' | 'server' | 'internal' | 'producer' | 'consumer'
    attributes?: Record<string, any>
    recordMetrics?: boolean
  }
) {
  return async function wrappedFn<T>(
    context: TraceContext,
    fn: () => Promise<T>
  ): Promise<T> {
    return instrumentOperation(operationName, context, fn, options)
  }
}
