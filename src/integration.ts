/**
 * Integration Patterns & Helpers
 * Cross-cutting concerns and common patterns
 */

import { ApiResponse, Metric, TraceSpan } from './types.js'

// API Response Helper
export function apiResponse<T>(data: T, status = 'success'): ApiResponse<T> {
  return {
    status: status as 'success' | 'error',
    data,
    timestamp: Date.now()
  }
}

export function apiError(error: string): ApiResponse<null> {
  return {
    status: 'error',
    error,
    timestamp: Date.now()
  }
}

// Metrics Helper
export function recordMetric(name: string, value: number, labels?: Record<string, string>): Metric {
  return {
    name,
    value,
    timestamp: Date.now(),
    labels
  }
}

// Tracing Helper
export function createSpan(traceId: string, name: string): TraceSpan {
  const spanId = Math.random().toString(36).substring(7)
  return {
    traceId,
    spanId,
    name,
    startTime: Date.now(),
    duration: 0,
    status: 'ok'
  }
}

export function endSpan(span: TraceSpan, duration: number, status: 'ok' | 'error' = 'ok'): TraceSpan {
  return { ...span, duration, status }
}

// Retry Logic
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 100
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)))
    }
  }
  throw new Error('Retry exhausted')
}

// Caching
export class Cache<T> {
  private store = new Map<string, { value: T; expiry: number }>()

  set(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiry: Date.now() + ttlMs })
  }

  get(key: string): T | undefined {
    const item = this.store.get(key)
    if (!item) return undefined
    if (Date.now() > item.expiry) {
      this.store.delete(key)
      return undefined
    }
    return item.value
  }

  clear(): void {
    this.store.clear()
  }
}
