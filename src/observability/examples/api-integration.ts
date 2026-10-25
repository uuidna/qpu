// Example: Integration of observability with API handlers (WAVE 8C)
// Shows how to instrument HTTP endpoints and request handlers

import { tracer, metrics, getLogger, instrumentHTTPRequest, recordCost } from '../index.js'
import { TraceContext } from '../types.js'

/**
 * HTTP middleware factory for tracing context extraction/creation
 */
export function createTraceContextMiddleware() {
  return (request: Request): TraceContext => {
    const headers = Object.fromEntries(request.headers.entries())

    // Try to extract trace context from headers
    let context = tracer.extractTraceContext(headers)

    // Create new if not found
    if (!context) {
      // Extract user from auth header if available
      const authHeader = headers.authorization
      let userId: string | undefined

      if (authHeader?.startsWith('Bearer ')) {
        userId = 'user-from-token' // In real code, decode the token
      }

      context = tracer.createTraceContext(userId)
    }

    return context
  }
}

/**
 * Instrumented API handler wrapper
 * Use this to wrap your handler functions with full observability
 */
export function createInstrumentedAPIHandler(
  operationName: string,
  options?: {
    costPerRequest?: number
    slaP99?: number
  }
) {
  const logger = getLogger('api')

  return async (request: Request, handler: (context: TraceContext) => Promise<Response>): Promise<Response> => {
    const contextMiddleware = createTraceContextMiddleware()
    const context = contextMiddleware(request)

    const span = tracer.startSpan(request.pathname, context, 'server', {
      http_method: request.method,
      http_url: request.url,
      http_pathname: request.pathname,
      operation: operationName
    })

    const startTime = performance.now()

    logger.info('API request started', context, {
      method: request.method,
      path: request.pathname,
      operation: operationName
    })

    try {
      const response = await handler(context)
      const duration = performance.now() - startTime

      // Record metrics
      metrics.recordOperation(operationName, duration, response.status < 400)
      metrics.recordHistogram('http_request_latency_ms', duration, { operation: operationName })
      metrics.recordHistogram('http_response_size_bytes', parseInt(response.headers.get('content-length') || '0'), {
        operation: operationName
      })
      metrics.incrementCounter('http_requests_total', 1, {
        method: request.method,
        path: request.pathname,
        status: response.status
      })

      // Record cost if applicable
      if (options?.costPerRequest) {
        recordCost(operationName, context, options.costPerRequest, { statusCode: response.status })
      }

      // Record span details
      span.recordEvent({
        name: 'http.response',
        timestamp: Date.now(),
        attributes: {
          http_status_code: response.status,
          http_response_size: parseInt(response.headers.get('content-length') || '0'),
          duration
        }
      })

      tracer.endSpan(span, response.status < 500 ? 'ok' : 'error')

      logger.info('API request completed', context, {
        method: request.method,
        path: request.pathname,
        status: response.status,
        duration: Math.round(duration)
      })

      // Add trace headers to response
      const traceHeaders = tracer.injectTraceContext(context)
      const responseHeaders = new Headers(response.headers)

      for (const [key, value] of Object.entries(traceHeaders)) {
        responseHeaders.set(key, value)
      }

      // Add SLA tracking header if provided
      if (options?.slaP99 && duration > options.slaP99) {
        responseHeaders.set('X-SLA-Warning', 'Response time exceeds SLA')
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders
      })
    } catch (err) {
      const duration = performance.now() - startTime
      const error = err as Error

      // Record error metrics
      metrics.recordOperation(operationName, duration, false)
      metrics.incrementCounter('http_errors_total', 1, {
        operation: operationName,
        errorType: error.constructor.name
      })

      span.recordEvent({
        name: 'http.error',
        timestamp: Date.now(),
        attributes: {
          error_message: error.message,
          error_type: error.constructor.name,
          duration
        }
      })

      tracer.endSpan(span, 'error', { error: error.message })

      logger.error('API request failed', context, error, {
        method: request.method,
        path: request.pathname,
        duration: Math.round(duration)
      })

      return new Response(
        JSON.stringify({
          error: 'Internal Server Error',
          message: error.message,
          traceId: context.traceId,
          correlationId: context.correlationId
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...tracer.injectTraceContext(context)
          }
        }
      )
    }
  }
}

/**
 * Health check endpoint with observability
 */
export function createHealthCheckEndpoint() {
  const logger = getLogger('health')

  return async (request: Request): Promise<Response> => {
    const context = tracer.createTraceContext()
    const startTime = performance.now()

    try {
      // Check basic health
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage()
      }

      const duration = performance.now() - startTime
      metrics.recordOperation('health_check', duration, true)

      logger.debug('Health check completed', context, { duration: Math.round(duration) })

      return new Response(JSON.stringify(health), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })
    } catch (err) {
      const duration = performance.now() - startTime
      const error = err as Error

      metrics.recordOperation('health_check', duration, false)
      logger.error('Health check failed', context, error)

      return new Response(
        JSON.stringify({
          status: 'unhealthy',
          error: error.message
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }
}

/**
 * Metrics export endpoint (Prometheus format)
 */
export async function createMetricsEndpoint(): Promise<Response> {
  const context = tracer.createTraceContext()
  const logger = getLogger('metrics')

  try {
    const prometheusText = metrics.exportPrometheusFormat()

    logger.debug('Metrics exported', context, {
      size: prometheusText.length
    })

    return new Response(prometheusText, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4',
        'Cache-Control': 'no-cache'
      }
    })
  } catch (err) {
    const error = err as Error
    logger.error('Failed to generate metrics', context, error)

    return new Response('Failed to generate metrics', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

/**
 * Traces export endpoint (for debugging)
 */
export async function createTracesEndpoint(): Promise<Response> {
  const context = tracer.createTraceContext()
  const logger = getLogger('traces')

  try {
    const stats = tracer.getStatistics()

    return new Response(
      JSON.stringify({
        activeSpans: stats.activeSpans,
        bufferedSpans: stats.bufferedSpans,
        totalSpans: stats.totalSpans,
        samplingRate: stats.samplingRate
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    )
  } catch (err) {
    const error = err as Error
    logger.error('Failed to generate traces endpoint', context, error)

    return new Response('Failed to generate traces endpoint', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

/**
 * Example API handler using instrumentation
 */
export const createExampleAPIHandler = () => {
  const apiHandler = createInstrumentedAPIHandler('example_operation', {
    costPerRequest: 0.001,
    slaP99: 500
  })

  return async (request: Request): Promise<Response> => {
    return apiHandler(request, async (context: TraceContext) => {
      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, Math.random() * 200))

      return new Response(
        JSON.stringify({
          message: 'Success',
          traceId: context.traceId
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    })
  }
}

/**
 * Rate limiting with observability
 */
export class RateLimitMiddleware {
  private limits = new Map<string, { count: number; resetTime: number }>()
  private logger = getLogger('rate-limit')

  isAllowed(clientId: string, limit: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now()
    const existing = this.limits.get(clientId)

    if (!existing || now > existing.resetTime) {
      this.limits.set(clientId, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (existing.count < limit) {
      existing.count++
      return true
    }

    this.logger.warn('Rate limit exceeded', tracer.createTraceContext(), {
      clientId,
      limit,
      window: Math.round(windowMs / 1000) + 's'
    })

    metrics.incrementCounter('rate_limit_exceeded', 1, { clientId })
    return false
  }
}

/**
 * Authentication middleware with observability
 */
export class AuthMiddleware {
  private logger = getLogger('auth')

  authenticate(request: Request): { userId: string; token: string } | null {
    const context = tracer.createTraceContext()
    const authHeader = request.headers.get('authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      metrics.incrementCounter('auth_failures', 1, { reason: 'missing_token' })
      this.logger.warn('Missing authentication token', context)
      return null
    }

    const token = authHeader.slice(7)

    // In real code, verify the token
    const userId = this.verifyToken(token)

    if (!userId) {
      metrics.incrementCounter('auth_failures', 1, { reason: 'invalid_token' })
      this.logger.warn('Invalid token', context, { tokenPrefix: token.slice(0, 10) })
      return null
    }

    metrics.incrementCounter('auth_successes', 1)
    this.logger.debug('Authentication successful', { ...context, userId })

    return { userId, token }
  }

  private verifyToken(token: string): string | null {
    // Placeholder - in real code, verify JWT or similar
    return token.length > 0 ? 'verified-user' : null
  }
}
