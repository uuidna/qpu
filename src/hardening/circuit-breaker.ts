// WAVE 8H: Production Hardening - Circuit Breaker Pattern

export type CircuitState = 'closed' | 'open' | 'half-open'

export interface CircuitBreakerConfig {
  failure_threshold: number  // Number of failures before opening
  success_threshold: number  // Number of successes before closing (in half-open)
  timeout: number  // Time before attempting to close (ms)
}

export interface CircuitBreakerStatus {
  state: CircuitState
  failures: number
  successes: number
  last_failure?: Error
  next_attempt?: number
}

export class CircuitBreaker {
  private state: CircuitState = 'closed'
  private failures = 0
  private successes = 0
  private last_failure_time?: number
  private last_failure?: Error
  private config: CircuitBreakerConfig

  constructor(config: CircuitBreakerConfig = {
    failure_threshold: 5,
    success_threshold: 3,
    timeout: 60000
  }) {
    this.config = config
  }

  // Execute function through circuit breaker
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state = 'half-open'
        this.successes = 0
      } else {
        throw new Error(`Circuit breaker is open. Retry after ${this.getRetryAfter()}ms`)
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure(error as Error)
      throw error
    }
  }

  // Handle successful execution
  private onSuccess(): void {
    this.failures = 0

    if (this.state === 'half-open') {
      this.successes++
      if (this.successes >= this.config.success_threshold) {
        this.state = 'closed'
        this.successes = 0
      }
    }
  }

  // Handle failed execution
  private onFailure(error: Error): void {
    this.failures++
    this.last_failure_time = Date.now()
    this.last_failure = error

    if (this.state === 'half-open') {
      this.state = 'open'
      this.successes = 0
    } else if (this.failures >= this.config.failure_threshold) {
      this.state = 'open'
    }
  }

  // Check if should attempt reset
  private shouldAttemptReset(): boolean {
    if (!this.last_failure_time) return true
    return Date.now() - this.last_failure_time >= this.config.timeout
  }

  // Get retry-after time
  private getRetryAfter(): number {
    if (!this.last_failure_time) return 0
    const elapsed = Date.now() - this.last_failure_time
    return Math.max(0, this.config.timeout - elapsed)
  }

  // Get status
  getStatus(): CircuitBreakerStatus {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      last_failure: this.last_failure,
      next_attempt: this.state === 'open' ? Date.now() + this.getRetryAfter() : undefined
    }
  }

  // Reset circuit breaker
  reset(): void {
    this.state = 'closed'
    this.failures = 0
    this.successes = 0
    this.last_failure_time = undefined
    this.last_failure = undefined
  }
}

// Circuit breaker manager for multiple endpoints
export class CircuitBreakerManager {
  private breakers = new Map<string, CircuitBreaker>()

  getBreaker(service: string, config?: CircuitBreakerConfig): CircuitBreaker {
    if (!this.breakers.has(service)) {
      this.breakers.set(service, new CircuitBreaker(config))
    }
    return this.breakers.get(service)!
  }

  async execute<T>(service: string, fn: () => Promise<T>): Promise<T> {
    const breaker = this.getBreaker(service)
    return breaker.execute(fn)
  }

  getStatus(service: string) {
    const breaker = this.breakers.get(service)
    return breaker?.getStatus()
  }

  getAllStatus() {
    const status: Record<string, CircuitBreakerStatus> = {}
    for (const [service, breaker] of this.breakers.entries()) {
      status[service] = breaker.getStatus()
    }
    return status
  }

  reset(service: string): void {
    const breaker = this.breakers.get(service)
    if (breaker) {
      breaker.reset()
    }
  }

  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset()
    }
  }
}

export const circuitBreakerManager = new CircuitBreakerManager()
