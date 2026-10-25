// Rate Limiting Middleware
// Implements token bucket and sliding window rate limiting

export interface RateLimitConfig {
  requests_per_minute: number
  requests_per_hour: number
  burst_size?: number
  window_size?: number
}

export interface RateLimitStatus {
  limited: boolean
  remaining: number
  reset_at: number
  retry_after?: number
}

export class RateLimiter {
  private buckets: Map<string, { tokens: number; last_refill: number }> = new Map()
  private windowLogs: Map<string, number[]> = new Map()
  private config: RateLimitConfig

  constructor(config: RateLimitConfig = {
    requests_per_minute: 100,
    requests_per_hour: 5000,
    burst_size: 150,
    window_size: 60000 // 1 minute in ms
  }) {
    this.config = config
    console.log('Rate Limiter: initialized')
  }

  // Check if request is allowed (token bucket algorithm)
  checkLimit(key: string, tokensRequired: number = 1): RateLimitStatus {
    const now = Date.now()

    // Get or create bucket
    let bucket = this.buckets.get(key)
    if (!bucket) {
      const burst = this.config.burst_size || this.config.requests_per_minute
      bucket = { tokens: burst, last_refill: now }
      this.buckets.set(key, bucket)
    }

    // Refill tokens based on time elapsed
    const time_elapsed = now - bucket.last_refill
    const tokens_to_add = (time_elapsed / 60000) * this.config.requests_per_minute
    bucket.tokens = Math.min(
      this.config.burst_size || this.config.requests_per_minute,
      bucket.tokens + tokens_to_add
    )
    bucket.last_refill = now

    // Check if we have enough tokens
    if (bucket.tokens >= tokensRequired) {
      bucket.tokens -= tokensRequired
      return {
        limited: false,
        remaining: Math.floor(bucket.tokens),
        reset_at: now + 60000
      }
    }

    // Rate limited
    const tokens_needed = tokensRequired - bucket.tokens
    const time_to_recover = (tokens_needed / this.config.requests_per_minute) * 60000

    return {
      limited: true,
      remaining: 0,
      reset_at: now + time_to_recover,
      retry_after: Math.ceil(time_to_recover / 1000)
    }
  }

  // Check limit with sliding window algorithm
  checkSlidingWindowLimit(key: string): RateLimitStatus {
    const now = Date.now()
    const window = this.config.window_size || 60000

    // Get or create window log
    let log = this.windowLogs.get(key)
    if (!log) {
      log = []
      this.windowLogs.set(key, log)
    }

    // Remove old entries outside the window
    const cutoff = now - window
    const filteredLog = log.filter(timestamp => timestamp > cutoff)
    this.windowLogs.set(key, filteredLog)

    // Check if we're within the limit
    const limit = this.config.requests_per_minute
    const remaining = limit - filteredLog.length

    if (remaining > 0) {
      // Add current request
      filteredLog.push(now)
      return {
        limited: false,
        remaining,
        reset_at: now + window
      }
    }

    // Rate limited
    const oldest = filteredLog[0]
    const retry_after = Math.ceil((oldest + window - now) / 1000)

    return {
      limited: true,
      remaining: 0,
      reset_at: oldest + window,
      retry_after
    }
  }

  // Reset limit for key
  resetLimit(key: string): void {
    this.buckets.delete(key)
    this.windowLogs.delete(key)
  }

  // Get limit status
  getStatus(key: string): RateLimitStatus {
    return this.checkLimit(key, 0)
  }

  // Get statistics
  getStats(): {
    total_keys: number
    buckets: number
    windows: number
  } {
    return {
      total_keys: Math.max(this.buckets.size, this.windowLogs.size),
      buckets: this.buckets.size,
      windows: this.windowLogs.size
    }
  }

  // Update configuration
  updateConfig(config: Partial<RateLimitConfig>): void {
    this.config = { ...this.config, ...config }
  }
}

// Distributed rate limiter (for multiple servers)
export class DistributedRateLimiter {
  private localLimiter: RateLimiter
  private redisClient?: any // Redis client for distributed state

  constructor(config?: RateLimitConfig) {
    this.localLimiter = new RateLimiter(config)
  }

  // Set Redis client for distributed operation
  setRedisClient(client: any): void {
    this.redisClient = client
  }

  // Check rate limit (distributed)
  async checkLimit(key: string, tokensRequired: number = 1): Promise<RateLimitStatus> {
    if (!this.redisClient) {
      // Fall back to local
      return this.localLimiter.checkLimit(key, tokensRequired)
    }

    try {
      // Use Redis for distributed rate limiting
      const redisKey = `rate_limit:${key}`
      const current = await this.redisClient.incr(redisKey)

      if (current === 1) {
        // First request in this minute
        await this.redisClient.expire(redisKey, 60)
      }

      const limit = 1000 // Default limit
      const remaining = Math.max(0, limit - current)
      const limited = current > limit

      return {
        limited,
        remaining,
        reset_at: Date.now() + 60000,
        retry_after: limited ? 60 : undefined
      }
    } catch (error) {
      // Fall back to local on error
      return this.localLimiter.checkLimit(key, tokensRequired)
    }
  }

  // Reset limit
  async resetLimit(key: string): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.del(`rate_limit:${key}`)
    } else {
      this.localLimiter.resetLimit(key)
    }
  }
}
