// WAVE 8E: Performance Optimization Module Exports

export { QueryOptimizer, QueryPlan, queryOptimizer } from './query-optimizer.js'
export { ConnectionPool, PoolConfig, PooledConnection, connectionPool } from './connection-pool.js'
export { CacheLayer, CacheEntry, CacheMetrics, cacheLayer } from './cache-layer.js'

// Performance optimization orchestrator
export class PerformanceOptimizer {
  private queryOptimizer: any
  private connectionPool: any
  private cacheLayer: any

  constructor() {
    // Imported from ./index.js above
  }

  // Integrated performance metrics
  getMetrics() {
    return {
      cache: this.cacheLayer.getMetrics(),
      pool: {
        postgresql: this.connectionPool.getStats('postgresql'),
        mongodb: this.connectionPool.getStats('mongodb'),
        cloudflare_d1: this.connectionPool.getStats('cloudflare-d1'),
        sqlite: this.connectionPool.getStats('sqlite')
      }
    }
  }
}

export const performanceOptimizer = new PerformanceOptimizer()
