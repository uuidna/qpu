/**
 * Resilience Layer
 * Error recovery, retries, circuit breaking, fallbacks
 * Ensures system continues operating under failures
 */

import { ExecutionResult } from './types.js'

// ============================================================================
// RESILIENCE TYPES
// ============================================================================

export interface RetryConfig {
  maxAttempts: number
  initialDelayMs: number
  maxDelayMs: number
  backoffMultiplier: number
}

export interface CircuitBreakerConfig {
  failureThreshold: number
  successThreshold: number
  timeout: number
}

export interface ResilienceMetrics {
  totalAttempts: number
  successfulAttempts: number
  failedAttempts: number
  retriedAttempts: number
  circuitBreakerTrips: number
  averageRetries: number
}

// ============================================================================
// RETRY ENGINE
// ============================================================================

export class RetryEngine {
  private config: RetryConfig
  private attemptCounts: Map<string, number> = new Map()

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = {
      maxAttempts: config.maxAttempts ?? 3,
      initialDelayMs: config.initialDelayMs ?? 100,
      maxDelayMs: config.maxDelayMs ?? 5000,
      backoffMultiplier: config.backoffMultiplier ?? 2
    }
  }

  /**
   * Execute with retries
   */
  async executeWithRetry<T>(
    key: string,
    fn: () => Promise<T>,
    isRetryable: (error: unknown) => boolean = () => true
  ): Promise<T> {
    let lastError: unknown
    let attempt = 0

    for (attempt = 0; attempt < this.config.maxAttempts; attempt++) {
      try {
        const result = await fn()
        this.attemptCounts.set(key, 0)
        return result
      } catch (error) {
        lastError = error
        if (!isRetryable(error)) {
          throw error
        }

        if (attempt < this.config.maxAttempts - 1) {
          const delay = this.calculateDelay(attempt)
          await this.sleep(delay)
        }
      }
    }

    this.attemptCounts.set(key, attempt)
    throw lastError
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateDelay(attempt: number): number {
    const delay = Math.min(
      this.config.initialDelayMs * Math.pow(this.config.backoffMultiplier, attempt),
      this.config.maxDelayMs
    )
    // Add jitter (±10%)
    const jitter = delay * (0.9 + Math.random() * 0.2)
    return Math.floor(jitter)
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get retry count for key
   */
  getRetryCount(key: string): number {
    return this.attemptCounts.get(key) || 0
  }

  /**
   * Reset retry count
   */
  resetRetryCount(key: string): void {
    this.attemptCounts.delete(key)
  }
}

// ============================================================================
// CIRCUIT BREAKER
// ============================================================================

export class CircuitBreaker {
  private config: CircuitBreakerConfig
  private state: 'closed' | 'open' | 'half-open' = 'closed'
  private failureCount = 0
  private successCount = 0
  private lastFailureTime = 0
  private trips = 0

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = {
      failureThreshold: config.failureThreshold ?? 5,
      successThreshold: config.successThreshold ?? 2,
      timeout: config.timeout ?? 60000 // 1 minute
    }
  }

  /**
   * Execute with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.config.timeout) {
        this.state = 'half-open'
        this.successCount = 0
      } else {
        throw new Error('Circuit breaker is open')
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

  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    this.failureCount = 0

    if (this.state === 'half-open') {
      this.successCount++
      if (this.successCount >= this.config.successThreshold) {
        this.state = 'closed'
        this.successCount = 0
      }
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(): void {
    this.failureCount++
    this.lastFailureTime = Date.now()
    this.successCount = 0

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'open'
      this.trips++
    }
  }

  /**
   * Get circuit breaker state
   */
  getState(): string {
    return this.state
  }

  /**
   * Get trip count
   */
  getTripCount(): number {
    return this.trips
  }

  /**
   * Reset circuit breaker
   */
  reset(): void {
    this.state = 'closed'
    this.failureCount = 0
    this.successCount = 0
    this.lastFailureTime = 0
  }
}

// ============================================================================
// RESILIENT EXECUTION
// ============================================================================

export class ResilientExecutor {
  private retryEngine: RetryEngine
  private circuitBreaker: CircuitBreaker
  private metrics: ResilienceMetrics = {
    totalAttempts: 0,
    successfulAttempts: 0,
    failedAttempts: 0,
    retriedAttempts: 0,
    circuitBreakerTrips: 0,
    averageRetries: 0
  }

  constructor(
    retryConfig?: Partial<RetryConfig>,
    circuitBreakerConfig?: Partial<CircuitBreakerConfig>
  ) {
    this.retryEngine = new RetryEngine(retryConfig)
    this.circuitBreaker = new CircuitBreaker(circuitBreakerConfig)
  }

  /**
   * Execute with full resilience
   */
  async execute<T>(
    key: string,
    fn: () => Promise<T>,
    isRetryable?: (error: unknown) => boolean
  ): Promise<T> {
    try {
      const result = await this.circuitBreaker.execute(() =>
        this.retryEngine.executeWithRetry(key, fn, isRetryable)
      )
      this.metrics.totalAttempts++
      this.metrics.successfulAttempts++
      this.updateAverageRetries()
      return result
    } catch (error) {
      this.metrics.totalAttempts++
      this.metrics.failedAttempts++
      const retries = this.retryEngine.getRetryCount(key)
      if (retries > 0) {
        this.metrics.retriedAttempts++
      }
      throw error
    }
  }

  /**
   * Update average retry count
   */
  private updateAverageRetries(): void {
    if (this.metrics.successfulAttempts === 0) return
    this.metrics.averageRetries =
      this.metrics.retriedAttempts / this.metrics.successfulAttempts
  }

  /**
   * Get resilience metrics
   */
  getMetrics(): ResilienceMetrics {
    return {
      ...this.metrics,
      circuitBreakerTrips: this.circuitBreaker.getTripCount()
    }
  }

  /**
   * Get circuit breaker state
   */
  getCircuitBreakerState(): string {
    return this.circuitBreaker.getState()
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = {
      totalAttempts: 0,
      successfulAttempts: 0,
      failedAttempts: 0,
      retriedAttempts: 0,
      circuitBreakerTrips: 0,
      averageRetries: 0
    }
    this.circuitBreaker.reset()
  }
}

// ============================================================================
// GLOBAL INSTANCES
// ============================================================================

export const retryEngine = new RetryEngine()
export const circuitBreaker = new CircuitBreaker()
export const resilientExecutor = new ResilientExecutor()

/**
 * Execute with retries (global)
 */
export async function executeWithRetry<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  return retryEngine.executeWithRetry(key, fn)
}

/**
 * Execute with circuit breaker (global)
 */
export async function executeWithCircuitBreaker<T>(fn: () => Promise<T>): Promise<T> {
  return circuitBreaker.execute(fn)
}

/**
 * Execute with full resilience (global)
 */
export async function executeResilient<T>(key: string, fn: () => Promise<T>): Promise<T> {
  return resilientExecutor.execute(key, fn)
}

export default {
  RetryEngine,
  CircuitBreaker,
  ResilientExecutor,
  retryEngine,
  circuitBreaker,
  resilientExecutor,
  executeWithRetry,
  executeWithCircuitBreaker,
  executeResilient
}
