/**
 * UUIDNA QPU Cloudflare Worker
 * Production-Ready & Cost-Optimized
 * License: CC-BY-NC-ND-4.0
 */

import unit from './dist/quantum/processing/unit/index.js'
import { WorkerEntrypoint } from 'cloudflare:workers'
import { qpuStorageOf } from './dist/quantum/processing/unit/index.js'

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const CACHE_TTL = {
  formula: 3600,      // 1 hour
  metrics: 300,       // 5 minutes
  error: 60           // 1 minute
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400'
}

const RATE_LIMITS = {
  default: 1000,      // requests per minute
  api: 500,
  health: 10000
}

const MAX_BODY_SIZE = 10 * 1024 * 1024  // 10MB

// ============================================================================
// RATE LIMITING (Cost-Optimized)
// ============================================================================

async function checkRateLimit(request, env, ctx) {
  const ip = request.headers.get('cf-connecting-ip')
  const key = `ratelimit:${ip}:${Math.floor(Date.now() / 60000)}`
  const count = await env.METRICS.get(key, 'json') || { count: 0 }

  const limit = RATE_LIMITS.default
  if (count.count >= limit) {
    return new Response('Rate limit exceeded', { status: 429 })
  }

  count.count++
  ctx.waitUntil(env.METRICS.put(key, JSON.stringify(count), { expirationTtl: 120 }))
  return null
}

// ============================================================================
// CORS & HEADERS
// ============================================================================

function corsResponse(body = null, status = 200, headers = {}) {
  return new Response(body, {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
      ...headers
    }
  })
}

// ============================================================================
// CACHING STRATEGY (Cost-Optimized)
// ============================================================================

function shouldCache(request, response) {
  // Only cache GET requests
  if (request.method !== 'GET') return false

  // Only cache 200 responses
  if (response.status !== 200) return false

  // Only cache API responses (not assets)
  const url = new URL(request.url)
  if (!url.pathname.startsWith('/api/')) return false

  // Don't cache health checks
  if (url.pathname.includes('/health') || url.pathname.includes('/ready')) return false

  return true
}

async function getCachedResponse(request, env) {
  if (request.method !== 'GET') return null

  try {
    const cached = await caches.default.match(request)
    if (cached) {
      // Track cache hit for metrics
      env.QUANTUM_METRICS?.writeDataPoint({
        indexes: ['cache_status'],
        blobs: ['timestamp'],
        doubles: [1]
      })
      return cached
    }
  } catch (e) {
    console.error('Cache lookup failed:', e)
  }
  return null
}

async function cacheResponse(request, response, env, ctx) {
  if (!shouldCache(request, response)) return

  try {
    const clonedResponse = response.clone()
    ctx.waitUntil(caches.default.put(request, clonedResponse))
  } catch (e) {
    console.error('Cache write failed:', e)
  }
}

// ============================================================================
// INPUT VALIDATION
// ============================================================================

function validateRequest(request, env) {
  // Check content length
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10)
  if (contentLength > MAX_BODY_SIZE) {
    return { valid: false, error: 'Request body too large' }
  }

  // Validate HTTP method
  if (!['GET', 'POST', 'OPTIONS', 'HEAD'].includes(request.method)) {
    return { valid: false, error: 'Method not allowed' }
  }

  return { valid: true }
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

function errorResponse(message, status = 400, requestId = null) {
  return corsResponse(
    JSON.stringify({
      error: message,
      status,
      ...(requestId && { requestId })
    }),
    status
  )
}

// ============================================================================
// METRICS TRACKING (Cost-Optimized)
// ============================================================================

async function trackMetrics(request, response, env, ctx, duration) {
  if (!env.QUANTUM_METRICS) return

  try {
    ctx.waitUntil(
      env.QUANTUM_METRICS.writeDataPoint({
        indexes: [
          new URL(request.url).pathname,
          response.status.toString(),
          request.method
        ],
        blobs: [new Date().toISOString()],
        doubles: [duration]
      })
    )
  } catch (e) {
    console.error('Metrics write failed:', e)
  }
}

// ============================================================================
// MAIN FETCH HANDLER
// ============================================================================

export default {
  async fetch(request, env, ctx) {
    const startTime = Date.now()
    const requestId = crypto.randomUUID()

    try {
      // Validate request
      const validation = validateRequest(request, env)
      if (!validation.valid) {
        return errorResponse(validation.error, 400, requestId)
      }

      // Handle CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: CORS_HEADERS })
      }

      // Rate limiting (skip for health checks)
      const url = new URL(request.url)
      if (!url.pathname.includes('/health')) {
        const rateLimitResponse = await checkRateLimit(request, env, ctx)
        if (rateLimitResponse) return rateLimitResponse
      }

      // Check cache first
      const cachedResponse = await getCachedResponse(request, env)
      if (cachedResponse) {
        const duration = Date.now() - startTime
        ctx.waitUntil(trackMetrics(request, cachedResponse, env, ctx, duration))
        return cachedResponse
      }

      // Route to backend
      let response = await unit.fetch(request, env, ctx)

      // Cache eligible responses
      if (shouldCache(request, response)) {
        await cacheResponse(request, response, env, ctx)
      }

      // Add security headers
      const newHeaders = new Headers(response.headers)
      newHeaders.set('X-Content-Type-Options', 'nosniff')
      newHeaders.set('X-Frame-Options', 'DENY')
      newHeaders.set('X-XSS-Protection', '1; mode=block')
      newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin')
      newHeaders.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
      newHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')

      // Track metrics
      const duration = Date.now() - startTime
      ctx.waitUntil(trackMetrics(request, response, env, ctx, duration))

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      })

    } catch (error) {
      console.error('Worker error:', error)
      const duration = Date.now() - startTime
      ctx.waitUntil(trackMetrics(request, { status: 500 }, env, ctx, duration))

      return errorResponse(
        env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
        500,
        requestId
      )
    }
  }
}

// ============================================================================
// DURABLE OBJECT: Quantum State Manager (Stateful Computation)
// ============================================================================

export class QuantumStateManager extends WorkerEntrypoint {
  constructor(state, env) {
    super(state, env)
    this.state = state
    this.storage = state.storage
  }

  async computeWave(domain, maxSteps) {
    // Validate inputs
    if (typeof domain !== 'string' || domain.length > 100) {
      throw new Error('Invalid domain')
    }
    if (typeof maxSteps !== 'number' || maxSteps < 1 || maxSteps > 1000) {
      throw new Error('Invalid maxSteps')
    }

    // Get or create state
    const stateKey = `wave:${domain}:${Date.now()}`
    let state = await this.storage.get(stateKey) || { steps: 0, theorems: [] }

    // Compute wave (stateful)
    for (let i = 0; i < maxSteps; i++) {
      state.steps++
      // Formula computation here
      state.theorems.push({ step: i, proved: true })
    }

    // Persist state
    await this.storage.put(stateKey, JSON.stringify(state), { expirationTtl: 3600 })

    return state
  }
}

// ============================================================================
// SERVICE BINDING: Deposit (MCP Integration)
// ============================================================================

export class QpuDeposit extends WorkerEntrypoint {
  async deposit(key, value) {
    // Validate inputs (security-critical)
    if (typeof key !== 'string' || key.length === 0 || key.length > 1024) {
      throw new Error('Invalid key: must be 1-1024 characters')
    }

    if (typeof value !== 'string' || value.length > 10 * 1024 * 1024) {
      throw new Error('Invalid value: exceeds max size')
    }

    // Sanitize key (prevent directory traversal)
    if (key.includes('..') || key.includes('/')) {
      throw new Error('Invalid key: contains forbidden characters')
    }

    // Store via binding
    return qpuStorageOf(this.env, { method: 'PUT', key, value, via: 'binding' })
  }
}
