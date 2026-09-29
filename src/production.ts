/** Production Utilities - Minimal, single-file approach */

import { tools } from './quantum/kernel/index'

// ============ Rate Limiting ============
class RateLimiter {
  private buckets = new Map<string, { tokens: number; refill: number }>()

  isAllowed(clientId: string, rps = 1000): boolean {
    const now = Date.now()
    let bucket = this.buckets.get(clientId)

    if (!bucket) {
      bucket = { tokens: rps * 2, refill: now }
      this.buckets.set(clientId, bucket)
    }

    const elapsed = (now - bucket.refill) / 1000
    bucket.tokens = Math.min(rps * 2, bucket.tokens + elapsed * rps)
    bucket.refill = now

    if (bucket.tokens >= 1) {
      bucket.tokens--
      return true
    }
    return false
  }
}

// ============ Circuit Breaker ============
class CircuitBreaker {
  state: 'closed' | 'open' | 'half-open' = 'closed'
  failures = 0
  openedAt = 0

  async execute<T>(fn: () => Promise<T>, threshold = 5, resetMs = 60000): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.openedAt > resetMs) {
        this.state = 'half-open'
        this.failures = 0
      } else {
        throw new Error('Circuit breaker open')
      }
    }

    try {
      const result = await fn()
      this.failures = 0
      if (this.state === 'half-open') this.state = 'closed'
      return result
    } catch (error) {
      this.failures++
      if (this.failures >= threshold) {
        this.state = 'open'
        this.openedAt = Date.now()
      }
      throw error
    }
  }
}

// ============ API Authentication ============
class AuthManager {
  private keys = new Map<string, { limit: number; lastUsed: number }>()

  validateKey(key: string): boolean {
    const entry = this.keys.get(key)
    if (!entry) return false
    entry.lastUsed = Date.now()
    return true
  }

  addKey(key: string, rpsLimit = 1000) {
    this.keys.set(key, { limit: rpsLimit, lastUsed: Date.now() })
  }
}

// ============ Metrics ============
class Metrics {
  requests = 0
  errors = 0
  totalMs = 0

  record(ms: number, error = false) {
    this.requests++
    this.totalMs += ms
    if (error) this.errors++
  }

  get avgLatency() {
    return this.requests > 0 ? this.totalMs / this.requests : 0
  }

  get errorRate() {
    return this.requests > 0 ? this.errors / this.requests : 0
  }

  toJSON() {
    return {
      requests: this.requests,
      errors: this.errors,
      avg_latency_ms: Math.round(this.avgLatency),
      error_rate: (this.errorRate * 100).toFixed(2) + '%',
    }
  }
}

// ============ Exports ============
export const limiter = new RateLimiter()
export const breaker = new CircuitBreaker()
export const auth = new AuthManager()
export const metrics = new Metrics()
