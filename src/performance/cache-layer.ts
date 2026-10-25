// WAVE 8E: Performance Optimization - Distributed Cache Layer

import type { DatabaseProvider } from '../database/index.js'

export interface CacheEntry {
  key: string
  value: any
  ttl: number
  created_at: number
  hits: number
  size_bytes: number
}

export interface CacheMetrics {
  hits: number
  misses: number
  evictions: number
  total_size: number
  hit_rate: number
}

export class CacheLayer {
  private memory_cache = new Map<string, CacheEntry>()
  private metrics: CacheMetrics = { hits: 0, misses: 0, evictions: 0, total_size: 0, hit_rate: 0 }
  private max_size_bytes = 1024 * 1024 * 100  // 100 MB default
  private cleanup_interval: NodeJS.Timeout | null = null

  // Set a cache entry
  set(key: string, value: any, ttl: number = 300000): void {
    const entry: CacheEntry = {
      key,
      value,
      ttl,
      created_at: Date.now(),
      hits: 0,
      size_bytes: JSON.stringify(value).length
    }

    // Check if we need to evict entries
    if (this.metrics.total_size + entry.size_bytes > this.max_size_bytes) {
      this.evictLRU()
    }

    this.memory_cache.set(key, entry)
    this.metrics.total_size += entry.size_bytes
  }

  // Get a cache entry
  get(key: string): any | null {
    const entry = this.memory_cache.get(key)

    if (!entry) {
      this.metrics.misses++
      return null
    }

    // Check if expired
    if (Date.now() - entry.created_at > entry.ttl) {
      this.memory_cache.delete(key)
      this.metrics.total_size -= entry.size_bytes
      this.metrics.misses++
      return null
    }

    // Record hit
    entry.hits++
    this.metrics.hits++
    this.updateHitRate()

    return entry.value
  }

  // Invalidate a cache entry
  invalidate(key: string): void {
    const entry = this.memory_cache.get(key)
    if (entry) {
      this.memory_cache.delete(key)
      this.metrics.total_size -= entry.size_bytes
    }
  }

  // Invalidate by pattern
  invalidatePattern(pattern: RegExp): void {
    const keys = Array.from(this.memory_cache.keys()).filter(k => pattern.test(k))
    for (const key of keys) {
      this.invalidate(key)
    }
  }

  // Evict least recently used entries
  private evictLRU(): void {
    const sorted = Array.from(this.memory_cache.values())
      .sort((a, b) => a.created_at - b.created_at)

    // Remove oldest 10% of entries
    const toRemove = Math.max(1, Math.floor(sorted.length * 0.1))
    for (let i = 0; i < toRemove; i++) {
      const key = sorted[i].key
      const size = sorted[i].size_bytes
      this.memory_cache.delete(key)
      this.metrics.total_size -= size
      this.metrics.evictions++
    }
  }

  // Get cache metrics
  getMetrics(): CacheMetrics {
    return { ...this.metrics }
  }

  private updateHitRate(): void {
    const total = this.metrics.hits + this.metrics.misses
    this.metrics.hit_rate = total > 0 ? this.metrics.hits / total : 0
  }

  // Clear all cache
  clear(): void {
    this.memory_cache.clear()
    this.metrics = { hits: 0, misses: 0, evictions: 0, total_size: 0, hit_rate: 0 }
  }

  // Start periodic cleanup of expired entries
  startCleanup(interval: number = 60000): void {
    if (this.cleanup_interval) clearInterval(this.cleanup_interval)

    this.cleanup_interval = setInterval(() => {
      const now = Date.now()
      let removed = 0

      for (const [key, entry] of this.memory_cache.entries()) {
        if (now - entry.created_at > entry.ttl) {
          this.memory_cache.delete(key)
          this.metrics.total_size -= entry.size_bytes
          removed++
        }
      }
    }, interval)
  }

  // Stop cleanup
  stopCleanup(): void {
    if (this.cleanup_interval) {
      clearInterval(this.cleanup_interval)
      this.cleanup_interval = null
    }
  }

  // Cache query results
  cacheQuery(sql: string, provider: DatabaseProvider, result: any, ttl: number): void {
    const key = `query:${provider}:${Buffer.from(sql).toString('base64')}`
    this.set(key, result, ttl)
  }

  // Get cached query result
  getCachedQuery(sql: string, provider: DatabaseProvider): any | null {
    const key = `query:${provider}:${Buffer.from(sql).toString('base64')}`
    return this.get(key)
  }

  // Invalidate all queries for a table
  invalidateTable(table: string): void {
    this.invalidatePattern(new RegExp(`^query:.*:${table}.*`))
  }
}

export const cacheLayer = new CacheLayer()
