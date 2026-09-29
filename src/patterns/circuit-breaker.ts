/** Circuit Breaker Pattern - Production Reliability */

export type CircuitState = 'closed' | 'open' | 'half-open'

export interface CircuitBreakerConfig {
  failureThreshold: number // failures before opening
  resetTimeout: number // ms before trying again
  windowSize: number // ms time window for failures
  name: string
}

export class CircuitBreaker {
  private state: CircuitState = 'closed'
  private failureCount = 0
  private lastFailureTime = 0
  private openedAt = 0
  private config: CircuitBreakerConfig

  constructor(config: CircuitBreakerConfig) {
    this.config = config
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if we should reset from open state
    if (this.state === 'open') {
      const timeSinceOpened = Date.now() - this.openedAt
      if (timeSinceOpened >= this.config.resetTimeout) {
        this.state = 'half-open'
        this.failureCount = 0
      } else {
        throw new Error(`Circuit breaker is open for ${this.config.name}`)
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failureCount = 0

    if (this.state === 'half-open') {
      this.state = 'closed'
    }
  }

  private onFailure() {
    const now = Date.now()

    // Reset failure count if outside window
    if (now - this.lastFailureTime > this.config.windowSize) {
      this.failureCount = 0
    }

    this.failureCount++
    this.lastFailureTime = now

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'open'
      this.openedAt = now
    }
  }

  getState(): CircuitState {
    return this.state
  }

  getStatus() {
    return {
      state: this.state,
      failures: this.failureCount,
      threshold: this.config.failureThreshold,
      windowMs: this.config.windowSize,
    }
  }

  reset() {
    this.state = 'closed'
    this.failureCount = 0
    this.lastFailureTime = 0
  }
}

// Factory for creating multiple circuit breakers
export class CircuitBreakerManager {
  private breakers = new Map<string, CircuitBreaker>()
  private defaultConfig: Partial<CircuitBreakerConfig>

  constructor(defaultConfig: Partial<CircuitBreakerConfig> = {}) {
    this.defaultConfig = defaultConfig
  }

  create(name: string, config: Partial<CircuitBreakerConfig> = {}): CircuitBreaker {
    const mergedConfig: CircuitBreakerConfig = {
      failureThreshold: 5,
      resetTimeout: 60000, // 1 minute
      windowSize: 10000, // 10 seconds
      name,
      ...this.defaultConfig,
      ...config,
    }

    const breaker = new CircuitBreaker(mergedConfig)
    this.breakers.set(name, breaker)
    return breaker
  }

  get(name: string): CircuitBreaker | undefined {
    return this.breakers.get(name)
  }

  getAll() {
    return Array.from(this.breakers.entries()).map(([name, breaker]) => ({
      name,
      ...breaker.getStatus(),
    }))
  }

  reset(name: string) {
    this.breakers.get(name)?.reset()
  }

  resetAll() {
    this.breakers.forEach(b => b.reset())
  }
}

// Example usage
export const breakers = new CircuitBreakerManager({
  failureThreshold: 5,
  resetTimeout: 60000,
  windowSize: 10000,
})

// Create breakers for different services
export const dbBreaker = breakers.create('database', { failureThreshold: 3 })
export const cacheBreaker = breakers.create('cache', { failureThreshold: 2 })
export const apiBreaker = breakers.create('external-api', { failureThreshold: 5 })
