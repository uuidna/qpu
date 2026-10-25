// SQLite Adapter (WAVE 6)
// Local/embedded SQLite for development and edge computing

import { DatabaseAdapter } from './base-adapter.js'
import type { QueryOptions, WriteOperation, Transaction, DatabaseResult, HealthStatus, DatabaseProvider } from '../types.js'

export class SQLiteAdapter extends DatabaseAdapter {
  provider: DatabaseProvider = 'sqlite'
  private db: any = null
  private dbPath: string = ''

  async connect(config: any): Promise<void> {
    try {
      // For edge computing, use better-sqlite3 or equivalent
      // For Cloudflare, sqlite is available through D1
      const Database = (await import('better-sqlite3')).default

      this.dbPath = config.connection || ':memory:'
      this.db = new Database(this.dbPath)

      // Enable foreign keys
      this.db.pragma('foreign_keys = ON')

      this.connected = true
    } catch (error) {
      // If better-sqlite3 not available, try fallback
      if (config.fallbackToMemory) {
        this.dbPath = ':memory:'
        this.connected = true
      } else {
        throw new Error(`SQLite connection failed: ${(error as Error).message}`)
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close()
    }
    this.connected = false
  }

  async query<T = any>(options: QueryOptions): Promise<DatabaseResult<T>> {
    if (!this.db) throw new Error('Not connected to SQLite')

    const startTime = performance.now()

    try {
      const stmt = this.db.prepare(options.sql)
      const result = stmt.all(...(options.params || []))

      return {
        data: result,
        count: result.length,
        provider: this.provider,
        latency: performance.now() - startTime,
        fromCache: false
      }
    } catch (error) {
      throw new Error(`SQLite query failed: ${(error as Error).message}`)
    }
  }

  async write(operation: WriteOperation): Promise<DatabaseResult> {
    if (!this.db) throw new Error('Not connected to SQLite')

    const startTime = performance.now()

    try {
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
          const whereKeys = Object.keys(operation.where || {})
          sql = `UPDATE ${operation.table} SET ${updateKeys.map(k => `${k} = ?`).join(', ')} WHERE ${whereKeys.map(k => `${k} = ?`).join(' AND ')}`
          Object.values(operation.data || {}).forEach((v: any) => params.push(v))
          Object.values(operation.where || {}).forEach((v: any) => params.push(v))
          break
        case 'delete':
          const delKeys = Object.keys(operation.where || {})
          sql = `DELETE FROM ${operation.table} WHERE ${delKeys.map(k => `${k} = ?`).join(' AND ')}`
          Object.values(operation.where || {}).forEach((v: any) => params.push(v))
          break
      }

      const stmt = this.db.prepare(sql)
      const result = stmt.run(...params)

      return {
        data: { changes: result.changes },
        count: result.changes,
        affectedRows: result.changes,
        insertId: result.lastInsertRowid,
        provider: this.provider,
        latency: performance.now() - startTime,
        fromCache: false
      }
    } catch (error) {
      throw new Error(`SQLite write failed: ${(error as Error).message}`)
    }
  }

  async transaction(tx: Transaction): Promise<DatabaseResult> {
    if (tx.provider !== 'sqlite') {
      throw new Error('Cannot execute non-SQLite transaction on SQLite adapter')
    }

    if (!this.db) throw new Error('Not connected to SQLite')

    const startTime = performance.now()

    try {
      this.db.exec('BEGIN TRANSACTION')

      const results: any[] = []
      for (const step of tx.steps) {
        const stmt = this.db.prepare(step.query)
        const result = stmt.run(...(step.params || []))
        results.push(result)
      }

      this.db.exec('COMMIT')

      return {
        data: results,
        count: results.length,
        provider: this.provider,
        latency: performance.now() - startTime,
        fromCache: false
      }
    } catch (error) {
      this.db.exec('ROLLBACK')
      throw new Error(`SQLite transaction failed: ${(error as Error).message}`)
    }
  }

  async health(): Promise<HealthStatus> {
    const startTime = performance.now()

    if (!this.db) {
      return {
        provider: this.provider,
        status: 'unavailable',
        latency: 0,
        connectionPoolSize: 0,
        failureCount: 1,
        lastCheckTime: Date.now(),
        uptime: 0,
        errorRate: 100
      }
    }

    try {
      const stmt = this.db.prepare('SELECT 1')
      stmt.get()

      return {
        provider: this.provider,
        status: 'healthy',
        latency: performance.now() - startTime,
        connectionPoolSize: 1,
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

  async exportSchema(): Promise<string> {
    if (!this.db) throw new Error('Not connected to SQLite')

    const stmt = this.db.prepare(
      `SELECT sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`
    )
    const tables = stmt.all()

    return tables
      .map((t: any) => t.sql)
      .filter((s: any) => s)
      .join(';\n') + ';'
  }

  async importSchema(schema: string): Promise<void> {
    if (!this.db) throw new Error('Not connected to SQLite')

    const statements = schema.split(';').filter((s: any) => s.trim())
    for (const stmt of statements) {
      this.db.exec(stmt)
    }
  }

  async exportData(tables?: string[]): Promise<any[]> {
    if (!this.db) throw new Error('Not connected to SQLite')

    const tableList = tables || this.getAllTables()
    const data: any[] = []

    for (const table of tableList) {
      const stmt = this.db.prepare(`SELECT * FROM ${table}`)
      const rows = stmt.all()
      data.push({ table, rows })
    }

    return data
  }

  async importData(data: any[], mode: 'replace' | 'merge' = 'merge'): Promise<number> {
    if (!this.db) throw new Error('Not connected to SQLite')

    let totalRows = 0

    for (const item of data) {
      if (mode === 'replace') {
        const deleteStmt = this.db.prepare(`DELETE FROM ${item.table}`)
        deleteStmt.run()
      }

      for (const row of item.rows) {
        const keys = Object.keys(row)
        const sql = `INSERT INTO ${item.table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`
        const values = Object.values(row)

        const stmt = this.db.prepare(sql)
        stmt.run(...values)
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
    if (!this.db) throw new Error('Not connected to SQLite')

    const tables = this.getAllTables()
    const mismatches: string[] = []

    for (const table of tables) {
      const stmt = this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`)
      const result = stmt.get() as any
      const count = result.count.toString()

      if (checksums && checksums[table] && checksums[table] !== count) {
        mismatches.push(`${table}: expected ${checksums[table]}, got ${count}`)
      }
    }

    return {
      valid: mismatches.length === 0,
      mismatches
    }
  }

  private getAllTables(): string[] {
    if (!this.db) return []

    const stmt = this.db.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`
    )
    return stmt.all().map((r: any) => r.name)
  }
}
