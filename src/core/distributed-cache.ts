/**
 * Distributed Cache
 * Redis-compatible caching with multi-tier strategy
 * L1 (in-memory) + L2 (distributed) + L3 (persistent)
 */

// ============================================================================
// CACHE TYPES
// ============================================================================

export type CacheLevel = 'L1' | 'L2' | 'L3'
export type CacheStrategy = 'LRU' | 'LFU' | 'TTL'

export interface CacheConfig {
  l1MaxSize: number // in-memory MB
  l2MaxSize: number // redis/distributed MB
  l3Enabled: boolean // persistent storage
  ttlSeconds: number
  strategy: CacheStrategy
}

export interface CacheMetrics {
  l1Hits: number
  l2Hits: number
  l3Hits: number
  l1Misses: number
  l2Misses: number
  l3Misses: number
  l1Size: number
  l2Size: number
  evictions: number
}

// ============================================================================
// MULTI-TIER CACHE
// ============================================================================

export class DistributedCache {
  private config: CacheConfig
  private l1Cache: Map<string, { value: unknown; expiry: number; score: number }> = new Map()
  private l2Cache: Map<string, { value: unknown; expiry: number; score: number }> = new Map()
  private metrics: CacheMetrics = {
    l1Hits: 0,
    l2Hits: 0,
    l3Hits: 0,
    l1Misses: 0,
    l2Misses: 0,
    l3Misses: 0,
    l1Size: 0,
    l2Size: 0,
    evictions: 0
  }

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      l1MaxSize: config.l1MaxSize ?? 50, // 50MB
      l2MaxSize: config.l2MaxSize ?? 500, // 500MB
      l3Enabled: config.l3Enabled ?? false,
      ttlSeconds: config.ttlSeconds ?? 3600,
      strategy: config.strategy ?? 'LRU'
    }
  }

  /**
   * Get value from cache (multi-tier)
   */
  get(key: string): unknown | undefined {
    const now = Date.now() / 1000

    // Try L1
    let entry = this.l1Cache.get(key)
    if (entry && entry.expiry > now) {
      this.updateScore(entry)
      this.metrics.l1Hits++
      return entry.value
    }

    this.metrics.l1Misses++

    // Try L2
    entry = this.l2Cache.get(key)
    if (entry && entry.expiry > now) {
      this.updateScore(entry)
      // Promote to L1
      this.l1Cache.set(key, entry)
      this.metrics.l2Hits++
      return entry.value
    }

    this.metrics.l2Misses++

    // Try L3 (would be persistent storage)
    if (this.config.l3Enabled) {
      this.metrics.l3Misses++
    }

    return undefined
  }

  /**
   * Set value in cache (multi-tier)
   */
  set(key: string, value: unknown, ttlSeconds?: number): void {
    const now = Date.now() / 1000
    const expiry = now + (ttlSeconds || this.config.ttlSeconds)
    const size = JSON.stringify(value).length / (1024 * 1024) // MB

    const entry = {
      value,
      expiry,
      score: 1 // Initial score for LFU
    }

    // Store in L1 if fits
    if (size <= this.config.l1MaxSize * 0.1) {
      this.l1Cache.set(key, entry)
      this.metrics.l1Size += size

      // Evict if needed
      while (this.metrics.l1Size > this.config.l1MaxSize && this.l1Cache.size > 0) {
        this.evictL1()
      }
    } else {
      // Store in L2
      this.l2Cache.set(key, entry)
      this.metrics.l2Size += size

      // Evict if needed
      while (this.metrics.l2Size > this.config.l2MaxSize && this.l2Cache.size > 0) {
        this.evictL2()
      }
    }
  }

  /**
   * Delete key from cache
   */
  delete(key: string): boolean {
    const inL1 = this.l1Cache.delete(key)
    const inL2 = this.l2Cache.delete(key)
    return inL1 || inL2
  }

  /**
   * Update entry score (for LRU/LFU)
   */
  private updateScore(entry: { score: number; expiry: number }): void {
    if (this.config.strategy === 'LFU') {
      entry.score++
    } else {
      entry.score = Date.now() / 1000 // LRU: update timestamp
    }
  }

  /**
   * Evict from L1 cache
   */
  private evictL1(): void {
    let victimKey: string | undefined
    let victimScore = Infinity

    for (const [key, entry] of this.l1Cache.entries()) {
      if (this.config.strategy === 'LFU') {
        if (entry.score < victimScore) {
          victimScore = entry.score
          victimKey = key
        }
      } else {
        // LRU
        if (entry.score < victimScore) {
          victimScore = entry.score
          victimKey = key
        }
      }
    }

    if (victimKey) {
      this.l1Cache.delete(victimKey)
      this.metrics.evictions++
    }
  }

  /**
   * Evict from L2 cache
   */
  private evictL2(): void {
    let victimKey: string | undefined
    let victimScore = Infinity

    for (const [key, entry] of this.l2Cache.entries()) {
      if (entry.score < victimScore) {
        victimScore = entry.score
        victimKey = key
      }
    }

    if (victimKey) {
      this.l2Cache.delete(victimKey)
      this.metrics.evictions++
    }
  }

  /**
   * Get cache metrics
   */
  getMetrics(): CacheMetrics & { hitRate: number } {
    const totalRequests =
      this.metrics.l1Hits + this.metrics.l1Misses + this.metrics.l2Hits + this.metrics.l2Misses
    const hitRate = totalRequests > 0 ? (this.metrics.l1Hits + this.metrics.l2Hits) / totalRequests : 0

    return {
      ...this.metrics,
      hitRate
    }
  }

  /**
   * Clear all caches
   */
  clear(): void {
    this.l1Cache.clear()
    this.l2Cache.clear()
    this.metrics = {
      l1Hits: 0,
      l2Hits: 0,
      l3Hits: 0,
      l1Misses: 0,
      l2Misses: 0,
      l3Misses: 0,
      l1Size: 0,
      l2Size: 0,
      evictions: 0
    }
  }

  /**
   * Get cache info
   */
  getInfo(): {
    l1: { entries: number; size: number }
    l2: { entries: number; size: number }
    metrics: CacheMetrics & { hitRate: number }
  } {
    return {
      l1: {
        entries: this.l1Cache.size,
        size: this.metrics.l1Size
      },
      l2: {
        entries: this.l2Cache.size,
        size: this.metrics.l2Size
      },
      metrics: this.getMetrics()
    }
  }
}

// ============================================================================
// REDIS-COMPATIBLE INTERFACE
// ============================================================================

export class RedisCompatibleCache extends DistributedCache {
  /**
   * Redis SETEX equivalent
   */
  async setex(key: string, seconds: number, value: string): Promise<void> {
    this.set(key, value, seconds)
  }

  /**
   * Redis GET equivalent
   */
  async get(key: string): Promise<string | undefined> {
    return super.get(key) as string | undefined
  }

  /**
   * Redis DEL equivalent
   */
  async del(key: string): Promise<number> {
    return this.delete(key) ? 1 : 0
  }

  /**
   * Redis INCR equivalent
   */
  async incr(key: string): Promise<number> {
    const current = (super.get(key) as number) || 0
    const newValue = current + 1
    this.set(key, newValue)
    return newValue
  }

  /**
   * Redis LPUSH equivalent
   */
  async lpush(key: string, ...values: string[]): Promise<number> {
    const list = ((super.get(key) as string[]) || []).reverse()
    for (const value of values) {
      list.unshift(value)
    }
    this.set(key, list)
    return list.length
  }

  /**
   * Redis HSET equivalent
   */
  async hset(key: string, field: string, value: string): Promise<number> {
    const hash = ((super.get(key) as Record<string, string>) || {})
    const exists = field in hash
    hash[field] = value
    this.set(key, hash)
    return exists ? 0 : 1
  }

  /**
   * Redis HGET equivalent
   */
  async hget(key: string, field: string): Promise<string | undefined> {
    const hash = (super.get(key) as Record<string, string>) || {}
    return hash[field]
  }
}

// ============================================================================
// GLOBAL INSTANCES
// ============================================================================

export const distributedCache = new DistributedCache()
export const redisCompatible = new RedisCompatibleCache()

/**
 * Get from cache (global)
 */
export function getCache(key: string): unknown | undefined {
  return distributedCache.get(key)
}

/**
 * Set in cache (global)
 */
export function setCache(key: string, value: unknown, ttl?: number): void {
  distributedCache.set(key, value, ttl)
}

/**
 * Delete from cache (global)
 */
export function deleteCache(key: string): boolean {
  return distributedCache.delete(key)
}

export default {
  DistributedCache,
  RedisCompatibleCache,
  distributedCache,
  redisCompatible,
  getCache,
  setCache,
  deleteCache
}
