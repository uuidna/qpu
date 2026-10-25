// WAVE 8H: Production Hardening - Rate Limiting

export interface RateLimitConfig {
  requests_per_second: number
  burst_size: number
  per_user?: boolean
  per_ip?: boolean
}

export interface RateLimitStatus {
  allowed: boolean
  remaining: number
  reset_at: number
  retry_after?: number
}

export class RateLimiter {
  private buckets = new Map<string, { tokens: number; last_refill: number }>()
  private config: RateLimitConfig
  private refill_interval = 1000  // ms

  constructor(config: RateLimitConfig = { requests_per_second: 100, burst_size: 1000 }) {
    this.config = config
    this.startRefillTimer()
  }

  // Check if request is allowed
  checkLimit(identifier: string): RateLimitStatus {
    const bucket = this.getBucket(identifier)

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1
      return {
        allowed: true,
        remaining: Math.floor(bucket.tokens),
        reset_at: Date.now() + this.refill_interval
      }
    }

    return {
      allowed: false,
      remaining: 0,
      reset_at: Date.now() + this.refill_interval,
      retry_after: Math.ceil(1000 / this.config.requests_per_second)
    }
  }

  // Get bucket for identifier
  private getBucket(identifier: string) {
    let bucket = this.buckets.get(identifier)

    if (!bucket) {
      bucket = {
        tokens: this.config.burst_size,
        last_refill: Date.now()
      }
      this.buckets.set(identifier, bucket)
    }

    return bucket
  }

  // Refill tokens
  private refillBuckets(): void {
    const now = Date.now()

    for (const [, bucket] of this.buckets.entries()) {
      const time_passed = now - bucket.last_refill
      const tokens_to_add = (time_passed / this.refill_interval) * this.config.requests_per_second

      bucket.tokens = Math.min(
        this.config.burst_size,
        bucket.tokens + tokens_to_add
      )
      bucket.last_refill = now
    }
  }

  // Start refill timer
  private startRefillTimer(): void {
    setInterval(() => this.refillBuckets(), this.refill_interval)
  }

  // Get bucket stats
  getStats(identifier: string) {
    const bucket = this.getBucket(identifier)
    return {
      tokens: bucket.tokens,
      capacity: this.config.burst_size,
      requests_per_second: this.config.requests_per_second
    }
  }

  // Reset bucket
  reset(identifier: string): void {
    this.buckets.delete(identifier)
  }
}

export const rateLimiter = new RateLimiter()
