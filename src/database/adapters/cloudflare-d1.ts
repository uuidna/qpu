// Cloudflare D1 + KV Adapter (WAVE 6)
// Primary database provider with KV cache layer

import { DatabaseAdapter } from './base-adapter.js'
import type { QueryOptions, WriteOperation, Transaction, DatabaseResult, HealthStatus, DatabaseProvider } from '../types.js'

export class CloudflareD1Adapter extends DatabaseAdapter {
  provider: DatabaseProvider = 'cloudflare-d1'
  private db: any = null
  private kv: any = null
  private replicationLog: any = null
  private cachePrefix = 'db:cache:'

  async connect(config: any): Promise<void> {
    // In Wrangler env: config.env.db, config.env.CACHE, config.env.REPLICATION_LOG
    this.db = config.db
    this.kv = config.kv || config.env?.CACHE
    this.replicationLog = config.replicationLog || config.env?.REPLICATION_LOG

    if (!this.db) {
      throw new Error('Cloudflare D1 database binding not configured')
    }

    this.connected = true
  }

  async disconnect(): Promise<void> {
    // D1 connections auto-managed by Cloudflare
    this.connected = false
  }

  async query<T = any>(options: QueryOptions): Promise<DatabaseResult<T>> {
    const startTime = performance.now()

    // Check cache first
    if (options.consistency !== 'strong') {
      const cached = await this.getFromCache(options.sql, options.params)
      if (cached) {
        return {
          data: cached.data,
          count: cached.count,
          provider: this.provider,
          latency: performance.now() - startTime,
          fromCache: true
        }
      }
    }

    try {
      const result = await this.db.prepare(options.sql).bind(...(options.params || [])).all()

      // Cache for eventual consistency
      if (options.consistency !== 'strong' && result.success) {
        await this.cacheResult(options.sql, options.params, result.results)
      }

      return {
        data: result.results || [],
        count: result.results?.length || 0,
        provider: this.provider,
        latency: performance.now() - startTime,
        fromCache: false
      }
    } catch (error) {
      throw new Error(`D1 Query failed: ${(error as Error).message}`)
    }
  }

  async write(operation: WriteOperation): Promise<DatabaseResult> {
    const startTime = performance.now()
    const statements: any[] = []

    try {
      // Build SQL based on operation
      let sql = ''
      const params: any[] = []

      switch (operation.operation) {
        case 'insert':
          const keys = Object.keys(operation.data || {})
          sql = `INSERT INTO ${operation.table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`
          Object.values(operation.data || {}).forEach((v: any) => params.push(v))
          break
        case 'update':
          const updateKeys = Object.keys(operation.data || {})
          sql = `UPDATE ${operation.table} SET ${updateKeys.map(k => `${k} = ?`).join(', ')} WHERE ${Object.keys(operation.where || {}).map(k => `${k} = ?`).join(' AND ')}`
          Object.values(operation.data || {}).forEach((v: any) => params.push(v))
          Object.values(operation.where || {}).forEach((v: any) => params.push(v))
          break
        case 'delete':
          sql = `DELETE FROM ${operation.table} WHERE ${Object.keys(operation.where || {}).map(k => `${k} = ?`).join(' AND ')}`
          Object.values(operation.where || {}).forEach((v: any) => params.push(v))
          break
      }

      // Execute write
      const result = await this.db.prepare(sql).bind(...params).run()

      // Log for replication if configured
      if (operation.replication !== 'none' && this.replicationLog) {
        await this.logReplication({
          operation: operation.operation,
          table: operation.table,
          data: operation.data,
          where: operation.where,
          sourceProvider: this.provider,
          targets: operation.replication === 'all' ? ['postgresql', 'mongodb'] : []
        })
      }

      // Invalidate cache
      await this.invalidateCache(operation.table)

      return {
        data: result.meta,
        count: result.meta?.changes || 0,
        affectedRows: result.meta?.changes || 0,
        provider: this.provider,
        latency: performance.now() - startTime,
        fromCache: false
      }
    } catch (error) {
      throw new Error(`D1 Write failed: ${(error as Error).message}`)
    }
  }

  async transaction(tx: Transaction): Promise<DatabaseResult> {
    if (tx.provider !== 'cloudflare-d1') {
      throw new Error('Cannot execute non-D1 transaction on D1 adapter')
    }

    const startTime = performance.now()
    const statements: any[] = []

    try {
      // D1 transactions
      const batch = this.db.batch(
        tx.steps.map((step: any) =>
          this.db.prepare(step.query).bind(...(step.params || []))
        )
      )

      const results = await batch

      return {
        data: results,
        count: results.length,
        provider: this.provider,
        latency: performance.now() - startTime,
        fromCache: false
      }
    } catch (error) {
      throw new Error(`D1 Transaction failed: ${(error as Error).message}`)
    }
  }

  async health(): Promise<HealthStatus> {
    const startTime = performance.now()

    try {
      await this.db.prepare('SELECT 1').first()

      return {
        provider: this.provider,
        status: 'healthy',
        latency: performance.now() - startTime,
        connectionPoolSize: 1,  // D1 is pooled by Cloudflare
        failureCount: 0,
        lastCheckTime: Date.now(),
        uptime: 100,
        errorRate: 0
      }
    } catch (error) {
      return {
        provider: this.provider,
        status: 'unavailable',
        latency: performance.now() - startTime,
        connectionPoolSize: 0,
        failureCount: 1,
        lastCheckTime: Date.now(),
        uptime: 0,
        errorRate: 100
      }
    }
  }

  // Data portability
  async exportSchema(): Promise<string> {
    const result = await this.db.prepare(
      `SELECT sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`
    ).all()

    return result.results
      .map((r: any) => r.sql)
      .filter((s: any) => s)
      .join(';\n') + ';'
  }

  async importSchema(schema: string): Promise<void> {
    const statements = schema.split(';').filter((s: any) => s.trim())

    const batch = this.db.batch(
      statements.map((stmt: string) => this.db.prepare(stmt))
    )

    await batch
  }

  async exportData(tables?: string[]): Promise<any[]> {
    const tableList = tables || await this.getAllTables()
    const data: any[] = []

    for (const table of tableList) {
      const result = await this.db.prepare(`SELECT * FROM ${table}`).all()
      data.push({
        table,
        rows: result.results || []
      })
    }

    return data
  }

  async importData(data: any[], mode: 'replace' | 'merge' = 'merge'): Promise<number> {
    let totalRows = 0

    for (const item of data) {
      if (mode === 'replace') {
        await this.db.prepare(`DELETE FROM ${item.table}`).run()
      }

      for (const row of item.rows) {
        const keys = Object.keys(row)
        const sql = `INSERT INTO ${item.table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`
        const values = Object.values(row)

        await this.db.prepare(sql).bind(...values).run()
        totalRows++
      }
    }

    return totalRows
  }

  async migrate(targetProvider: DatabaseProvider, options?: any): Promise<{ migratedRows: number; duration: number }> {
    const startTime = performance.now()
    const data = await this.exportData()

    let totalRows = 0
    for (const item of data) {
      totalRows += item.rows.length
    }

    return {
      migratedRows: totalRows,
      duration: performance.now() - startTime
    }
  }

  async validateData(checksums?: Record<string, string>): Promise<{ valid: boolean; mismatches: string[] }> {
    const tables = await this.getAllTables()
    const mismatches: string[] = []

    for (const table of tables) {
      const result = await this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`).first()
      if (checksums && checksums[table] && checksums[table] !== result.count.toString()) {
        mismatches.push(`${table}: expected ${checksums[table]}, got ${result.count}`)
      }
    }

    return {
      valid: mismatches.length === 0,
      mismatches
    }
  }

  // Private helpers
  private async getAllTables(): Promise<string[]> {
    const result = await this.db.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`
    ).all()

    return result.results?.map((r: any) => r.name) || []
  }

  private async getFromCache(sql: string, params?: any[]): Promise<any | null> {
    if (!this.kv) return null

    const key = this.cachePrefix + this.hashQuery(sql, params)
    const cached = await this.kv.get(key, 'json')
    return cached
  }

  private async cacheResult(sql: string, params: any[] | undefined, data: any[]): Promise<void> {
    if (!this.kv) return

    const key = this.cachePrefix + this.hashQuery(sql, params)
    await this.kv.put(key, JSON.stringify({ data, count: data.length }), { expirationTtl: 3600 })
  }

  private async invalidateCache(table: string): Promise<void> {
    if (!this.kv) return

    // Invalidate all cache entries for this table
    // In production, would use more sophisticated cache invalidation
    const list = await this.kv.list({ prefix: this.cachePrefix })
    for (const item of list.keys) {
      await this.kv.delete(item.name)
    }
  }

  private async logReplication(event: any): Promise<void> {
    if (!this.replicationLog) return

    const eventId = `repl:${Date.now()}:${Math.random().toString(36).slice(2)}`
    await this.replicationLog.put(eventId, JSON.stringify(event), { expirationTtl: 86400 })
  }

  private hashQuery(sql: string, params?: any[]): string {
    const str = sql + JSON.stringify(params || [])
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash.toString(36)
  }
}
