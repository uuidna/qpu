// WAVE 8H: Production Hardening Module Exports

export {
  RateLimitConfig,
  RateLimitStatus,
  RateLimiter,
  rateLimiter
} from './rate-limiter.js'

export {
  CircuitState,
  CircuitBreakerConfig,
  CircuitBreakerStatus,
  CircuitBreaker,
  CircuitBreakerManager,
  circuitBreakerManager
} from './circuit-breaker.js'

export {
  DegradationLevel,
  GracefulDegradation,
  gracefulDegradation
} from './graceful-degradation.js'

// Production hardening orchestrator
export class ProductionHardening {
  private rateLimiter: any
  private circuitBreakerManager: any
  private gracefulDegradation: any

  constructor() {
    // Imported from individual modules above
  }

  // Check if request should be allowed
  async canProcessRequest(identifier: string): Promise<{
    allowed: boolean
    reason?: string
    fallback?: any
  }> {
    // 1. Check rate limit
    const limitStatus = this.rateLimiter.checkLimit(identifier)
    if (!limitStatus.allowed) {
      return {
        allowed: false,
        reason: 'rate_limit_exceeded',
        fallback: { retry_after: limitStatus.retry_after }
      }
    }

    // 2. Check degradation level
    const degradation = this.gracefulDegradation.determineDegradationLevel()
    if (degradation.level === 'offline') {
      return {
        allowed: false,
        reason: 'system_degraded',
        fallback: { estimated_recovery: degradation.estimated_recovery }
      }
    }

    return { allowed: true }
  }

  // Execute with all hardening protections
  async executeWithProtections<T>(
    serviceName: string,
    fn: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    try {
      return await this.circuitBreakerManager.execute(serviceName, fn)
    } catch (error) {
      // Use fallback if available
      if (fallback && this.gracefulDegradation.isFeatureAvailable(serviceName)) {
        return await fallback()
      }
      throw error
    }
  }

  // Get comprehensive hardening status
  getStatus() {
    return {
      degradation: this.gracefulDegradation.getStatus(),
      circuit_breakers: this.circuitBreakerManager.getAllStatus(),
      timestamp: Date.now()
    }
  }

  // Reset all hardening mechanisms
  resetAll() {
    this.circuitBreakerManager.resetAll()
    this.gracefulDegradation = new (this.gracefulDegradation.constructor as any)()
  }
}

export const productionHardening = new ProductionHardening()

// Middleware for Express/Fastify
export function hardendingMiddleware(phd: ProductionHardening) {
  return async (req: any, res: any, next: any) => {
    const userId = req.user?.id || req.ip
    const canProcess = await phd.canProcessRequest(userId)

    if (!canProcess.allowed) {
      if (canProcess.reason === 'rate_limit_exceeded') {
        res.status(429)
          .set('Retry-After', canProcess.fallback.retry_after)
          .send('Too Many Requests')
      } else if (canProcess.reason === 'system_degraded') {
        res.status(503).send('Service Degraded')
      }
      return
    }

    next()
  }
}
