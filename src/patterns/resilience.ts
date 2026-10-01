/**
 * Resilience Patterns - Minimal, DRY
 * Circuit breaker, retry, timeout, fallback
 */

type Handler<T> = () => Promise<T>
type Fallback<T> = (err: Error) => T

// ============================================================================
// CIRCUIT BREAKER
// ============================================================================

export class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed'
  private failures = 0
  private lastFailure = 0
  private threshold = 5
  private timeout = 60000 // 1 minute

  // BOOLEAN QUESTIONS

  isClosed(): boolean {
    return this.state === 'closed'
  }

  isOpen(): boolean {
    return this.state === 'open'
  }

  isHalfOpen(): boolean {
    return this.state === 'half-open'
  }

  canAttempt(): boolean {
    if (this.state === 'closed') return true
    if (this.state === 'open') {
      const elapsed = Date.now() - this.lastFailure
      if (elapsed > this.timeout) {
        this.state = 'half-open'
        return true
      }
      return false
    }
    return true
  }

  // EXECUTION

  async run<T>(handler: Handler<T>): Promise<T> {
    if (!this.canAttempt()) {
      throw new Error('Circuit breaker open')
    }

    try {
      const result = await handler()
      this.onSuccess()
      return result
    } catch (e) {
      this.onFailure()
      throw e
    }
  }

  private onSuccess(): void {
    this.failures = 0
    this.state = 'closed'
  }

  private onFailure(): void {
    this.failures++
    this.lastFailure = Date.now()
    if (this.failures >= this.threshold) {
      this.state = 'open'
    }
  }

  reset(): void {
    this.state = 'closed'
    this.failures = 0
  }
}

// ============================================================================
// RETRY
// ============================================================================

export class Retry {
  private maxAttempts = 3
  private delay = 100
  private backoff = 2

  // EXECUTION

  async run<T>(handler: Handler<T>): Promise<T> {
    let lastError: Error | undefined

    for (let attempt = 0; attempt < this.maxAttempts; attempt++) {
      try {
        return await handler()
      } catch (e) {
        lastError = e as Error
        if (attempt < this.maxAttempts - 1) {
          await this.wait(this.delay * Math.pow(this.backoff, attempt))
        }
      }
    }

    throw lastError || new Error('Max retries exceeded')
  }

  private wait(ms: number): Promise<void> {
    return new Promise(r => setTimeout(r, ms))
  }

  setMaxAttempts(n: number): void {
    this.maxAttempts = n
  }

  setDelay(ms: number): void {
    this.delay = ms
  }

  setBackoff(factor: number): void {
    this.backoff = factor
  }
}

// ============================================================================
// TIMEOUT
// ============================================================================

export class Timeout {
  private maxTime = 5000

  async run<T>(handler: Handler<T>): Promise<T> {
    return Promise.race<T>([
      handler(),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), this.maxTime)
      )
    ])
  }

  setMaxTime(ms: number): void {
    this.maxTime = ms
  }
}

// ============================================================================
// BULKHEAD
// ============================================================================

export class Bulkhead {
  private active = 0
  private queue: Array<{ handler: Handler<any>; resolve: (v: any) => void; reject: (e: Error) => void }> = []
  private maxConcurrent = 10

  // BOOLEAN QUESTIONS

  isFull(): boolean {
    return this.active >= this.maxConcurrent
  }

  isAvailable(): boolean {
    return this.active < this.maxConcurrent
  }

  // EXECUTION

  async run<T>(handler: Handler<T>): Promise<T> {
    if (this.isAvailable()) {
      return this.execute(handler)
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ handler, resolve, reject })
    })
  }

  private async execute<T>(handler: Handler<T>): Promise<T> {
    this.active++
    try {
      return await handler()
    } finally {
      this.active--
      this.drainQueue()
    }
  }

  private drainQueue(): void {
    if (this.queue.length === 0 || this.isFull()) return

    const { handler, resolve, reject } = this.queue.shift()!
    this.execute(handler).then(resolve).catch((err: any) => reject(err))
  }

  stats() {
    return {
      active: this.active,
      queued: this.queue.length,
      available: this.maxConcurrent - this.active
    }
  }
}

// ============================================================================
// FALLBACK
// ============================================================================

export async function withFallback<T>(
  handler: Handler<T>,
  fallback: Fallback<T>
): Promise<T> {
  try {
    return await handler()
  } catch (e) {
    return fallback(e as Error)
  }
}

// ============================================================================
// COMBINED: Circuit Breaker + Retry + Timeout + Fallback
// ============================================================================

export class Resilient<T> {
  private cb = new CircuitBreaker()
  private retry = new Retry()
  private timeout = new Timeout()
  private fallback?: Fallback<T>

  withFallback(fn: Fallback<T>): this {
    this.fallback = fn
    return this
  }

  withRetry(attempts: number, delay: number = 100): this {
    this.retry.setMaxAttempts(attempts)
    this.retry.setDelay(delay)
    return this
  }

  withTimeout(ms: number): this {
    this.timeout.setMaxTime(ms)
    return this
  }

  async run(handler: Handler<T>): Promise<T> {
    try {
      return await this.cb.run(() =>
        this.retry.run(() =>
          this.timeout.run(handler)
        )
      )
    } catch (e) {
      if (this.fallback) {
        return this.fallback(e as Error)
      }
      throw e
    }
  }
}

// ============================================================================
// SINGLETONS
// ============================================================================

export const circuitBreaker = new CircuitBreaker()
export const retry = new Retry()
export const timeout = new Timeout()
export const bulkhead = new Bulkhead()
export const resilient = new Resilient()
