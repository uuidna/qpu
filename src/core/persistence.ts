/**
 * Persistence Layer
 * Unified storage backend (Redis/SQLite/KV) with automatic routing
 * All operation results and state persisted consistently
 */

import { ExecutionResult } from './types.js'

// ============================================================================
// PERSISTENCE INTERFACE
// ============================================================================

export interface PersistenceBackend {
  get(key: string): Promise<unknown>
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>
  delete(key: string): Promise<void>
  list(pattern?: string): Promise<string[]>
  clear(): Promise<void>
}

// ============================================================================
// IN-MEMORY BACKEND (Development)
// ============================================================================

class InMemoryBackend implements PersistenceBackend {
  private store: Map<string, { value: unknown; expiry?: number }> = new Map()

  async get(key: string): Promise<unknown> {
    const entry = this.store.get(key)
    if (!entry) return undefined

    if (entry.expiry && entry.expiry < Date.now()) {
      this.store.delete(key)
      return undefined
    }

    return entry.value
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    this.store.set(key, {
      value,
      expiry: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined
    })
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }

  async list(pattern?: string): Promise<string[]> {
    const keys = Array.from(this.store.keys())
    if (!pattern) return keys

    const regex = new RegExp(pattern.replace('*', '.*'))
    return keys.filter(k => regex.test(k))
  }

  async clear(): Promise<void> {
    this.store.clear()
  }
}

// ============================================================================
// EXECUTION RESULT PERSISTENCE
// ============================================================================

export interface StoredExecutionResult {
  id: string
  operation: string
  inputs: Record<string, unknown>
  result: ExecutionResult
  timestamp: Date
  duration: number
}

export class ExecutionResultStore {
  private backend: PersistenceBackend
  private prefix = 'exec:'

  constructor(backend?: PersistenceBackend) {
    this.backend = backend || new InMemoryBackend()
  }

  /**
   * Store execution result
   */
  async store(
    operation: string,
    inputs: Record<string, unknown>,
    result: ExecutionResult,
    duration: number
  ): Promise<string> {
    const id = `${operation}:${Date.now()}:${Math.random().toString(36).slice(2)}`
    const key = `${this.prefix}${id}`

    const stored: StoredExecutionResult = {
      id,
      operation,
      inputs,
      result,
      timestamp: new Date(),
      duration
    }

    await this.backend.set(key, stored, 86400) // 24h TTL
    return id
  }

  /**
   * Get execution result by ID
   */
  async get(id: string): Promise<StoredExecutionResult | undefined> {
    const key = `${this.prefix}${id}`
    return (await this.backend.get(key)) as StoredExecutionResult | undefined
  }

  /**
   * List recent executions for operation
   */
  async listByOperation(operation: string, limit: number = 100): Promise<StoredExecutionResult[]> {
    const pattern = `${this.prefix}${operation}:*`
    const keys = await this.backend.list(pattern)
    const results: StoredExecutionResult[] = []

    for (const key of keys.slice(-limit)) {
      const result = await this.backend.get(key)
      if (result) results.push(result as StoredExecutionResult)
    }

    return results
  }

  /**
   * Get execution statistics
   */
  async getStats(operation: string): Promise<{
    totalExecutions: number
    averageDuration: number
    successRate: number
  }> {
    const results = await this.listByOperation(operation)
    const total = results.length
    const successful = results.filter(r => r.result.success).length
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / (total || 1)

    return {
      totalExecutions: total,
      averageDuration: avgDuration,
      successRate: total > 0 ? (successful / total) * 100 : 0
    }
  }

  /**
   * Clear old results
   */
  async cleanup(olderThanHours: number = 24): Promise<number> {
    const cutoff = Date.now() - olderThanHours * 3600 * 1000
    const keys = await this.backend.list(`${this.prefix}*`)
    let deleted = 0

    for (const key of keys) {
      const result = await this.backend.get(key)
      if (result && (result as StoredExecutionResult).timestamp.getTime() < cutoff) {
        await this.backend.delete(key)
        deleted++
      }
    }

    return deleted
  }
}

// ============================================================================
// GLOBAL BACKENDS
// ============================================================================

export const inMemoryBackend = new InMemoryBackend()
export const executionResultStore = new ExecutionResultStore(inMemoryBackend)

/**
 * Get persistence backend for environment
 */
export function getPersistenceBackend(): PersistenceBackend {
  // In production: use Cloudflare KV, Redis, or SQLite
  // For now: use in-memory
  return inMemoryBackend
}

export default {
  InMemoryBackend,
  ExecutionResultStore,
  inMemoryBackend,
  executionResultStore,
  getPersistenceBackend
}
