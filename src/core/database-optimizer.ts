/**
 * Database Optimizer
 * Query optimization, connection pooling, caching strategies
 * Maximizes database performance under load
 */

// ============================================================================
// DATABASE TYPES
// ============================================================================

export interface QueryStats {
  query: string
  executionCount: number
  averageTime: number
  minTime: number
  maxTime: number
  slowCount: number // executions > 100ms
}

export interface ConnectionPoolConfig {
  minConnections: number
  maxConnections: number
  idleTimeoutMs: number
  acquireTimeoutMs: number
}

export interface CacheEntry {
  key: string
  value: unknown
  hits: number
  misses: number
  size: number
  createdAt: Date
  lastAccessedAt: Date
}

// ============================================================================
// QUERY CACHE
// ============================================================================

export class QueryCache {
  private cache: Map<string, CacheEntry> = new Map()
  private maxSize = 100 * 1024 * 1024 // 100MB
  private currentSize = 0
  private hitRate = 0
  private requestCount = 0

  /**
   * Get cached query result
   */
  get(query: string): unknown | undefined {
    const entry = this.cache.get(query)
    if (entry) {
      entry.hits++
      entry.lastAccessedAt = new Date()
      this.updateHitRate()
      return entry.value
    }

    if (entry) {
      entry.misses++
      this.updateHitRate()
    }

    return undefined
  }

  /**
   * Set query result cache
   */
  set(query: string, value: unknown): boolean {
    const entrySize = JSON.stringify(value).length
    if (entrySize > this.maxSize * 0.1) {
      return false // Entry too large
    }

    // Remove old entry if exists
    const oldEntry = this.cache.get(query)
    if (oldEntry) {
      this.currentSize -= oldEntry.size
    }

    // Check if we need to evict entries
    while (this.currentSize + entrySize > this.maxSize && this.cache.size > 0) {
      this.evictLRU()
    }

    const entry: CacheEntry = {
      key: query,
      value,
      hits: 0,
      misses: 0,
      size: entrySize,
      createdAt: new Date(),
      lastAccessedAt: new Date()
    }

    this.cache.set(query, entry)
    this.currentSize += entrySize
    return true
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let oldest: CacheEntry | undefined
    for (const entry of this.cache.values()) {
      if (!oldest || entry.lastAccessedAt < oldest.lastAccessedAt) {
        oldest = entry
      }
    }

    if (oldest) {
      this.cache.delete(oldest.key)
      this.currentSize -= oldest.size
    }
  }

  /**
   * Update hit rate
   */
  private updateHitRate(): void {
    this.requestCount++
    const totalHits = Array.from(this.cache.values()).reduce((sum, e) => sum + e.hits, 0)
    this.hitRate = this.requestCount > 0 ? totalHits / this.requestCount : 0
  }

  /**
   * Get hit rate
   */
  getHitRate(): number {
    return this.hitRate
  }

  /**
   * Get cache size
   */
  getSize(): number {
    return this.currentSize
  }

  /**
   * Get entry count
   */
  getEntryCount(): number {
    return this.cache.size
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear()
    this.currentSize = 0
  }

  /**
   * Get cache stats
   */
  getStats(): {
    entries: number
    size: number
    hitRate: number
    topQueries: CacheEntry[]
  } {
    const topQueries = Array.from(this.cache.values())
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 10)

    return {
      entries: this.cache.size,
      size: this.currentSize,
      hitRate: this.hitRate,
      topQueries
    }
  }
}

// ============================================================================
// CONNECTION POOL
// ============================================================================

export class ConnectionPool {
  private config: ConnectionPoolConfig
  private available: any[] = []
  private inUse: Set<any> = new Set()
  private stats = {
    totalCreated: 0,
    totalClosed: 0,
    peakConnections: 0
  }

  constructor(config: Partial<ConnectionPoolConfig> = {}) {
    this.config = {
      minConnections: config.minConnections ?? 5,
      maxConnections: config.maxConnections ?? 20,
      idleTimeoutMs: config.idleTimeoutMs ?? 300000,
      acquireTimeoutMs: config.acquireTimeoutMs ?? 30000
    }

    this.initializePool()
  }

  /**
   * Initialize connection pool
   */
  private initializePool(): void {
    for (let i = 0; i < this.config.minConnections; i++) {
      this.available.push(this.createConnection())
    }
  }

  /**
   * Create new connection (mock)
   */
  private createConnection(): any {
    this.stats.totalCreated++
    return {
      id: `conn-${this.stats.totalCreated}`,
      createdAt: Date.now(),
      lastUsed: Date.now()
    }
  }

  /**
   * Acquire connection from pool
   */
  async acquireConnection(): Promise<any> {
    const startTime = Date.now()

    while (Date.now() - startTime < this.config.acquireTimeoutMs) {
      // Try to get available connection
      if (this.available.length > 0) {
        const conn = this.available.pop()!
        this.inUse.add(conn)
        this.updatePeakConnections()
        return conn
      }

      // Create new connection if under limit
      if (this.inUse.size < this.config.maxConnections) {
        const conn = this.createConnection()
        this.inUse.add(conn)
        this.updatePeakConnections()
        return conn
      }

      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    throw new Error('Could not acquire connection within timeout')
  }

  /**
   * Release connection back to pool
   */
  releaseConnection(conn: any): void {
    this.inUse.delete(conn)
    conn.lastUsed = Date.now()

    if (this.available.length < this.config.maxConnections) {
      this.available.push(conn)
    } else {
      this.closeConnection(conn)
    }
  }

  /**
   * Close connection
   */
  private closeConnection(conn: any): void {
    this.stats.totalClosed++
  }

  /**
   * Update peak connections
   */
  private updatePeakConnections(): void {
    const current = this.inUse.size
    if (current > this.stats.peakConnections) {
      this.stats.peakConnections = current
    }
  }

  /**
   * Get pool statistics
   */
  getStats(): {
    available: number
    inUse: number
    peak: number
    totalCreated: number
    totalClosed: number
    utilization: number
  } {
    const total = this.available.length + this.inUse.size
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      peak: this.stats.peakConnections,
      totalCreated: this.stats.totalCreated,
      totalClosed: this.stats.totalClosed,
      utilization: (this.inUse.size / this.config.maxConnections) * 100
    }
  }

  /**
   * Close all connections
   */
  closeAll(): void {
    for (const conn of this.available) {
      this.closeConnection(conn)
    }
    for (const conn of this.inUse) {
      this.closeConnection(conn)
    }
    this.available = []
    this.inUse.clear()
  }
}

// ============================================================================
// DATABASE OPTIMIZER
// ============================================================================

export class DatabaseOptimizer {
  private queryCache: QueryCache
  private connectionPool: ConnectionPool
  private queryStats: Map<string, QueryStats> = new Map()

  constructor(poolConfig?: Partial<ConnectionPoolConfig>) {
    this.queryCache = new QueryCache()
    this.connectionPool = new ConnectionPool(poolConfig)
  }

  /**
   * Execute query with optimization
   */
  async executeQuery(query: string, params?: unknown[]): Promise<unknown> {
    const startTime = Date.now()

    // Check cache first
    const cacheKey = `${query}:${JSON.stringify(params || [])}`
    const cached = this.queryCache.get(cacheKey)
    if (cached !== undefined) {
      return cached
    }

    // Acquire connection
    const conn = await this.connectionPool.acquireConnection()

    try {
      // Simulate query execution
      const result = { data: `Result for ${query}` }

      // Cache result
      this.queryCache.set(cacheKey, result)

      // Record stats
      const duration = Date.now() - startTime
      this.recordQueryStats(query, duration)

      return result
    } finally {
      this.connectionPool.releaseConnection(conn)
    }
  }

  /**
   * Record query statistics
   */
  private recordQueryStats(query: string, duration: number): void {
    let stats = this.queryStats.get(query)
    if (!stats) {
      stats = {
        query,
        executionCount: 0,
        averageTime: 0,
        minTime: Infinity,
        maxTime: 0,
        slowCount: 0
      }
      this.queryStats.set(query, stats)
    }

    stats.executionCount++
    stats.averageTime = (stats.averageTime * (stats.executionCount - 1) + duration) / stats.executionCount
    stats.minTime = Math.min(stats.minTime, duration)
    stats.maxTime = Math.max(stats.maxTime, duration)

    if (duration > 100) {
      stats.slowCount++
    }
  }

  /**
   * Get slow queries
   */
  getSlowQueries(threshold: number = 100): QueryStats[] {
    return Array.from(this.queryStats.values())
      .filter(q => q.averageTime > threshold)
      .sort((a, b) => b.averageTime - a.averageTime)
  }

  /**
   * Get top queries by execution
   */
  getTopQueries(limit: number = 10): QueryStats[] {
    return Array.from(this.queryStats.values())
      .sort((a, b) => b.executionCount - a.executionCount)
      .slice(0, limit)
  }

  /**
   * Get optimization recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = []
    const slowQueries = this.getSlowQueries()
    const cacheStats = this.queryCache.getStats()
    const poolStats = this.connectionPool.getStats()

    // Cache recommendations
    if (cacheStats.hitRate < 0.5 && cacheStats.entries > 0) {
      recommendations.push(`Cache hit rate is ${(cacheStats.hitRate * 100).toFixed(1)}% - consider caching strategy`)
    }

    // Query recommendations
    if (slowQueries.length > 0) {
      recommendations.push(`${slowQueries.length} slow queries (>100ms) - consider indexing or optimization`)
    }

    // Connection pool recommendations
    if (poolStats.utilization > 80) {
      recommendations.push(`Connection pool at ${poolStats.utilization.toFixed(1)}% utilization - consider increasing pool size`)
    }

    // Query optimization
    for (const query of this.getTopQueries(3)) {
      if (query.executionCount > 100 && query.averageTime > 50) {
        recommendations.push(`Query "${query.query.substring(0, 50)}" executed ${query.executionCount}x avg ${query.averageTime.toFixed(0)}ms`)
      }
    }

    return recommendations
  }

  /**
   * Get performance report
   */
  getPerformanceReport() {
    return {
      cache: this.queryCache.getStats(),
      pool: this.connectionPool.getStats(),
      slowQueries: this.getSlowQueries(),
      recommendations: this.getRecommendations()
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.queryCache.clear()
  }
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

export const databaseOptimizer = new DatabaseOptimizer()

/**
 * Execute query with optimization (global)
 */
export async function executeOptimizedQuery(query: string, params?: unknown[]): Promise<unknown> {
  return databaseOptimizer.executeQuery(query, params)
}

export default {
  QueryCache,
  ConnectionPool,
  DatabaseOptimizer,
  databaseOptimizer,
  executeOptimizedQuery
}
