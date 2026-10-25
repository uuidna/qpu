// WAVE 8E: Performance Optimization - Connection Pooling

import type { DatabaseProvider } from '../database/index.js'

export interface PoolConfig {
  min_size: number
  max_size: number
  idle_timeout: number
  max_lifetime: number
  queue_timeout: number
}

export interface PooledConnection {
  id: string
  provider: DatabaseProvider
  in_use: boolean
  created_at: number
  last_used: number
}

export class ConnectionPool {
  private pools = new Map<DatabaseProvider, PooledConnection[]>()
  private waitQueues = new Map<DatabaseProvider, ((conn: PooledConnection) => void)[]>()
  private config: Record<DatabaseProvider, PoolConfig> = {
    'postgresql': { min_size: 10, max_size: 100, idle_timeout: 300000, max_lifetime: 3600000, queue_timeout: 5000 },
    'mongodb': { min_size: 5, max_size: 50, idle_timeout: 300000, max_lifetime: 3600000, queue_timeout: 5000 },
    'cloudflare-d1': { min_size: 20, max_size: 200, idle_timeout: 600000, max_lifetime: 7200000, queue_timeout: 2000 },
    'sqlite': { min_size: 1, max_size: 10, idle_timeout: 600000, max_lifetime: 3600000, queue_timeout: 5000 }
  }

  constructor() {
    this.initializeAllPools()
  }

  private initializeAllPools(): void {
    const providers: DatabaseProvider[] = ['postgresql', 'mongodb', 'cloudflare-d1', 'sqlite']
    for (const provider of providers) {
      this.pools.set(provider, [])
      this.waitQueues.set(provider, [])
      this.createInitialConnections(provider)
    }
  }

  private createInitialConnections(provider: DatabaseProvider): void {
    const config = this.config[provider]
    const pool = this.pools.get(provider)!

    for (let i = 0; i < config.min_size; i++) {
      pool.push(this.createConnection(provider))
    }
  }

  private createConnection(provider: DatabaseProvider): PooledConnection {
    return {
      id: `${provider}-${Date.now()}-${Math.random()}`,
      provider,
      in_use: false,
      created_at: Date.now(),
      last_used: Date.now()
    }
  }

  // Acquire a connection from the pool
  async acquire(provider: DatabaseProvider): Promise<PooledConnection> {
    const pool = this.pools.get(provider)!
    const config = this.config[provider]

    // Try to get an available connection
    const available = pool.find(c => !c.in_use)
    if (available) {
      available.in_use = true
      available.last_used = Date.now()
      return available
    }

    // Create new connection if under limit
    if (pool.length < config.max_size) {
      const conn = this.createConnection(provider)
      conn.in_use = true
      pool.push(conn)
      return conn
    }

    // Wait for a connection to be released
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Connection pool timeout for ${provider}`))
      }, config.queue_timeout)

      this.waitQueues.get(provider)!.push((conn) => {
        clearTimeout(timeout)
        resolve(conn)
      })
    })
  }

  // Release a connection back to the pool
  release(conn: PooledConnection): void {
    conn.in_use = false
    conn.last_used = Date.now()

    // Check if anyone is waiting
    const queue = this.waitQueues.get(conn.provider)!
    if (queue.length > 0) {
      const waiter = queue.shift()
      if (waiter) {
        conn.in_use = true
        waiter(conn)
      }
    }
  }

  // Get pool statistics
  getStats(provider: DatabaseProvider): {
    total: number
    in_use: number
    available: number
    waiting: number
  } {
    const pool = this.pools.get(provider)!
    const queue = this.waitQueues.get(provider)!
    const in_use = pool.filter(c => c.in_use).length

    return {
      total: pool.length,
      in_use,
      available: pool.length - in_use,
      waiting: queue.length
    }
  }

  // Clean up idle connections
  cleanupIdleConnections(): void {
    const now = Date.now()
    const providers: DatabaseProvider[] = ['postgresql', 'mongodb', 'cloudflare-d1', 'sqlite']

    for (const provider of providers) {
      const pool = this.pools.get(provider)!
      const config = this.config[provider]
      const minSize = config.min_size

      // Remove idle connections beyond minimum size
      const kept = pool.filter(conn => {
        if (conn.in_use) return true
        if (pool.length <= minSize) return true
        if (now - conn.last_used < config.idle_timeout) return true
        return false
      })

      this.pools.set(provider, kept)
    }
  }

  // Start cleanup interval
  startCleanup(interval: number = 60000): void {
    setInterval(() => this.cleanupIdleConnections(), interval)
  }
}

export const connectionPool = new ConnectionPool()
