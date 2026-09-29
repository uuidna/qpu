/** Rate Limiting Middleware - Production Reliability */

export interface RateLimitConfig {
  requestsPerSecond: number
  burstSize: number
  windowSeconds: number
}

export interface RateLimitBucket {
  tokens: number
  lastRefill: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
  requestsPerSecond: 1000,
  burstSize: 2000,
  windowSeconds: 1,
}

const buckets = new Map<string, RateLimitBucket>()

export class RateLimiter {
  private config: RateLimitConfig

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  isAllowed(clientId: string): boolean {
    const now = Date.now()
    let bucket = buckets.get(clientId)

    if (!bucket) {
      bucket = {
        tokens: this.config.burstSize,
        lastRefill: now,
      }
      buckets.set(clientId, bucket)
    }

    // Refill tokens based on elapsed time
    const elapsed = (now - bucket.lastRefill) / 1000
    const tokensToAdd = elapsed * this.config.requestsPerSecond
    bucket.tokens = Math.min(this.config.burstSize, bucket.tokens + tokensToAdd)
    bucket.lastRefill = now

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1
      return true
    }

    return false
  }

  getRemainingTokens(clientId: string): number {
    const bucket = buckets.get(clientId)
    return bucket ? bucket.tokens : this.config.burstSize
  }

  reset(clientId: string) {
    buckets.delete(clientId)
  }

  resetAll() {
    buckets.clear()
  }
}

export function createRateLimitMiddleware(config?: Partial<RateLimitConfig>) {
  const limiter = new RateLimiter(config)

  return (clientId: string): { allowed: boolean; remaining: number } => {
    const allowed = limiter.isAllowed(clientId)
    const remaining = limiter.getRemainingTokens(clientId)
    return { allowed, remaining }
  }
}
