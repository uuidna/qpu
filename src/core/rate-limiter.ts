/**
 * Rate Limiter
 * Token bucket rate limiting with per-user, per-operation, and global limits
 */

// ============================================================================
// RATE LIMITER TYPES
// ============================================================================

export interface RateLimitConfig {
  requestsPerSecond: number
  burstSize: number
}

export interface RateLimitStatus {
  allowed: boolean
  tokensRemaining: number
  retryAfterMs?: number
}

// ============================================================================
// TOKEN BUCKET LIMITER
// ============================================================================

export class TokenBucket {
  private tokens: number
  private lastRefillTime: number
  private readonly capacity: number
  private readonly refillRate: number

  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity
    this.refillRate = refillRate
    this.tokens = capacity
    this.lastRefillTime = Date.now()
  }

  /**
   * Try to consume tokens
   */
  tryConsume(tokens: number = 1): boolean {
    this.refill()

    if (this.tokens >= tokens) {
      this.tokens -= tokens
      return true
    }

    return false
  }

  /**
   * Check if tokens available without consuming
   */
  canConsume(tokens: number = 1): boolean {
    this.refill()
    return this.tokens >= tokens
  }

  /**
   * Get time until tokens available (ms)
   */
  getRetryAfterMs(tokensNeeded: number = 1): number {
    this.refill()

    if (this.tokens >= tokensNeeded) {
      return 0
    }

    const tokensShortfall = tokensNeeded - this.tokens
    const secondsNeeded = tokensShortfall / this.refillRate
    return Math.ceil(secondsNeeded * 1000)
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refill(): void {
    const now = Date.now()
    const elapsedSeconds = (now - this.lastRefillTime) / 1000
    const tokensToAdd = elapsedSeconds * this.refillRate

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd)
    this.lastRefillTime = now
  }

  /**
   * Get current token count
   */
  getTokens(): number {
    this.refill()
    return this.tokens
  }
}

// ============================================================================
// RATE LIMITER
// ============================================================================

export class RateLimiter {
  private globalBucket: TokenBucket
  private userBuckets: Map<string, TokenBucket> = new Map()
  private operationBuckets: Map<string, TokenBucket> = new Map()
  private config: {
    global: RateLimitConfig
    perUser: RateLimitConfig
    perOperation: RateLimitConfig
  }

  constructor(
    globalConfig: RateLimitConfig = { requestsPerSecond: 1000, burstSize: 100 },
    perUserConfig: RateLimitConfig = { requestsPerSecond: 100, burstSize: 10 },
    perOperationConfig: RateLimitConfig = { requestsPerSecond: 500, burstSize: 50 }
  ) {
    this.config = {
      global: globalConfig,
      perUser: perUserConfig,
      perOperation: perOperationConfig
    }

    this.globalBucket = new TokenBucket(
      globalConfig.burstSize,
      globalConfig.requestsPerSecond
    )
  }

  /**
   * Check if request is allowed
   */
  isAllowed(userId?: string, operation?: string): RateLimitStatus {
    // Check global limit
    if (!this.globalBucket.canConsume(1)) {
      return {
        allowed: false,
        tokensRemaining: 0,
        retryAfterMs: this.globalBucket.getRetryAfterMs(1)
      }
    }

    // Check per-user limit
    if (userId) {
      const userBucket = this.getUserBucket(userId)
      if (!userBucket.canConsume(1)) {
        return {
          allowed: false,
          tokensRemaining: 0,
          retryAfterMs: userBucket.getRetryAfterMs(1)
        }
      }
    }

    // Check per-operation limit
    if (operation) {
      const opBucket = this.getOperationBucket(operation)
      if (!opBucket.canConsume(1)) {
        return {
          allowed: false,
          tokensRemaining: 0,
          retryAfterMs: opBucket.getRetryAfterMs(1)
        }
      }
    }

    // All limits passed, consume tokens
    this.globalBucket.tryConsume(1)
    if (userId) {
      this.getUserBucket(userId).tryConsume(1)
    }
    if (operation) {
      this.getOperationBucket(operation).tryConsume(1)
    }

    return {
      allowed: true,
      tokensRemaining: Math.floor(this.globalBucket.getTokens())
    }
  }

  /**
   * Get or create user bucket
   */
  private getUserBucket(userId: string): TokenBucket {
    if (!this.userBuckets.has(userId)) {
      this.userBuckets.set(
        userId,
        new TokenBucket(
          this.config.perUser.burstSize,
          this.config.perUser.requestsPerSecond
        )
      )
    }
    return this.userBuckets.get(userId)!
  }

  /**
   * Get or create operation bucket
   */
  private getOperationBucket(operation: string): TokenBucket {
    if (!this.operationBuckets.has(operation)) {
      this.operationBuckets.set(
        operation,
        new TokenBucket(
          this.config.perOperation.burstSize,
          this.config.perOperation.requestsPerSecond
        )
      )
    }
    return this.operationBuckets.get(operation)!
  }

  /**
   * Get rate limit status without consuming
   */
  getStatus(userId?: string, operation?: string): RateLimitStatus {
    const globalStatus = {
      allowed: this.globalBucket.canConsume(1),
      tokensRemaining: Math.floor(this.globalBucket.getTokens())
    }

    if (!globalStatus.allowed) {
      return {
        ...globalStatus,
        retryAfterMs: this.globalBucket.getRetryAfterMs(1)
      }
    }

    return globalStatus
  }

  /**
   * Reset user limit
   */
  resetUser(userId: string): void {
    this.userBuckets.delete(userId)
  }

  /**
   * Reset operation limit
   */
  resetOperation(operation: string): void {
    this.operationBuckets.delete(operation)
  }

  /**
   * Reset all limits
   */
  resetAll(): void {
    this.userBuckets.clear()
    this.operationBuckets.clear()
  }

  /**
   * Get active users count
   */
  getActiveUserCount(): number {
    return this.userBuckets.size
  }

  /**
   * Get active operations count
   */
  getActiveOperationCount(): number {
    return this.operationBuckets.size
  }
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

export const rateLimiter = new RateLimiter()

/**
 * Check if request allowed (global)
 */
export function isAllowed(userId?: string, operation?: string): RateLimitStatus {
  return rateLimiter.isAllowed(userId, operation)
}

/**
 * Get rate limit status (global)
 */
export function getRateLimitStatus(userId?: string, operation?: string): RateLimitStatus {
  return rateLimiter.getStatus(userId, operation)
}

export default {
  TokenBucket,
  RateLimiter,
  rateLimiter,
  isAllowed,
  getRateLimitStatus
}
