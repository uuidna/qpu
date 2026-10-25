// PostgreSQL Adapter (WAVE 6)
// Traditional RDBMS with ACID guarantees

import { DatabaseAdapter } from './base-adapter.js'
import type { QueryOptions, WriteOperation, Transaction, DatabaseResult, HealthStatus, DatabaseProvider } from '../types.js'

export class PostgreSQLAdapter extends DatabaseAdapter {
  provider: DatabaseProvider = 'postgresql'
  private pool: any = null
  private client: any = null

  async connect(config: any): Promise<void> {
    try {
      // Expects: config.Pool from pg package
      const pg = await import('pg')
      const { Pool } = pg.default || pg

      this.pool = new Pool({
        connectionString: config.connection,
        max: config.options?.maxConnections || 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        ...config.options
      })

      // Test connection
      this.client = await this.pool.connect()
      await this.client.query('SELECT 1')
      this.client.release()

      this.connected = true
    } catch (error) {
      throw new Error(`PostgreSQL connection failed: ${(error as Error).message}`)
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end()
    }
    this.connected = false
  }

  async query<T = any>(options: QueryOptions): Promise<DatabaseResult<T>> {
    if (!this.pool) throw new Error('Not connected to PostgreSQL')

    const startTime = performance.now()
    const client = await this.pool.connect()

    try {
      const result = await client.query(options.sql, options.params || [])

      return {
        data: result.rows || [],
        count: result.rows?.length || 0,
        provider: this.provider,
        latency: performance.now() - startTime,
        fromCache: false
      }
    } finally {
      client.release()
    }
  }

  async write(operation: WriteOperation): Promise<DatabaseResult> {
    if (!this.pool) throw new Error('Not connected to PostgreSQL')

    const startTime = performance.now()
    const client = await this.pool.connect()

    try {
      let sql = ''
      const params: any[] = []

      switch (operation.operation) {
        case 'insert':
          const keys = Object.keys(operation.data || {})
          sql = `INSERT INTO ${operation.table} (${keys.join(', ')}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`
          Object.values(operation.data || {}).forEach((v: any) => params.push(v))
          break
        case 'update':
          const updateKeys = Object.keys(operation.data || {})
          const whereKeys = Object.keys(operation.where || {})
          let paramIndex = 1
          sql = `UPDATE ${operation.table} SET ${updateKeys.map(k => `${k} = $${paramIndex++}`).join(', ')} WHERE ${whereKeys.map(k => `${k} = $${paramIndex++}`).join(' AND ')} RETURNING *`
          Object.values(operation.data || {}).forEach((v: any) => params.push(v))
          Object.values(operation.where || {}).forEach((v: any) => params.push(v))
          break
        case 'delete':
          const delKeys = Object.keys(operation.where || {})
          let delIndex = 1
          sql = `DELETE FROM ${operation.table} WHERE ${delKeys.map(k => `${k} = $${delIndex++}`).join(' AND ')} RETURNING *`
          Object.values(operation.where || {}).forEach((v: any) => params.push(v))
          break
      }

      const result = await client.query(sql, params)

      return {
        data: result.rows || [],
        count: result.rows?.length || 0,
        affectedRows: result.rowCount || 0,
        provider: this.provider,
        latency: performance.now() - startTime,
        fromCache: false
      }
    } finally {
      client.release()
    }
  }

  async transaction(tx: Transaction): Promise<DatabaseResult> {
    if (tx.provider !== 'postgresql') {
      throw new Error('Cannot execute non-PostgreSQL transaction on PostgreSQL adapter')
    }

    if (!this.pool) throw new Error('Not connected to PostgreSQL')

    const startTime = performance.now()
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')

      const isolation = tx.isolation ? `SET TRANSACTION ISOLATION LEVEL ${tx.isolation.replace(/-/g, ' ').toUpperCase()}` : ''
      if (isolation) await client.query(isolation)

      const results: any[] = []
      for (const step of tx.steps) {
        const result = await client.query(step.query, step.params || [])
        results.push(result.rows || result)
      }

      await client.query('COMMIT')

      return {
        data: results,
        count: results.length,
        provider: this.provider,
        latency: performance.now() - startTime,
        fromCache: false
      }
    } catch (error) {
      await client.query('ROLLBACK')
      throw new Error(`PostgreSQL transaction failed: ${(error as Error).message}`)
    } finally {
      client.release()
    }
  }

  async health(): Promise<HealthStatus> {
    const startTime = performance.now()

    if (!this.pool) {
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
      const client = await this.pool.connect()
      await client.query('SELECT 1')
      client.release()

      const poolState = this.pool.totalCount || 0
      const idleCount = this.pool.idleCount || 0

      return {
        provider: this.provider,
        status: 'healthy',
        latency: performance.now() - startTime,
        connectionPoolSize: poolState - idleCount,
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
    if (!this.pool) throw new Error('Not connected to PostgreSQL')

    const client = await this.pool.connect()
    try {
      const result = await client.query(
        `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`
      )

      const tables = result.rows.map((r: any) => r.tablename)
      const schemas: string[] = []

      for (const table of tables) {
        const tableResult = await client.query(
          `SELECT pg_get_createtabletsql('${table}'::regclass)`
        )
        schemas.push(tableResult.rows[0].pg_get_createtabletsql)
      }

      return schemas.join(';\n') + ';'
    } finally {
      client.release()
    }
  }

  async importSchema(schema: string): Promise<void> {
    if (!this.pool) throw new Error('Not connected to PostgreSQL')

    const client = await this.pool.connect()
    try {
      const statements = schema.split(';').filter((s: any) => s.trim())

      for (const stmt of statements) {
        await client.query(stmt)
      }
    } finally {
      client.release()
    }
  }

  async exportData(tables?: string[]): Promise<any[]> {
    if (!this.pool) throw new Error('Not connected to PostgreSQL')

    const client = await this.pool.connect()
    try {
      const tableList = tables || (await client.query(
        `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`
      )).rows.map((r: any) => r.tablename)

      const data: any[] = []
      for (const table of tableList) {
        const result = await client.query(`SELECT * FROM "${table}"`)
        data.push({
          table,
          rows: result.rows
        })
      }

      return data
    } finally {
      client.release()
    }
  }

  async importData(data: any[], mode: 'replace' | 'merge' = 'merge'): Promise<number> {
    if (!this.pool) throw new Error('Not connected to PostgreSQL')

    const client = await this.pool.connect()
    let totalRows = 0

    try {
      for (const item of data) {
        if (mode === 'replace') {
          await client.query(`TRUNCATE TABLE "${item.table}"`)
        }

        for (const row of item.rows) {
          const keys = Object.keys(row)
          const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
          const sql = `INSERT INTO "${item.table}" (${keys.map(k => `"${k}"`).join(', ')}) VALUES (${placeholders})`
          const values = Object.values(row)

          await client.query(sql, values)
          totalRows++
        }
      }

      return totalRows
    } finally {
      client.release()
    }
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
    if (!this.pool) throw new Error('Not connected to PostgreSQL')

    const client = await this.pool.connect()
    try {
      const result = await client.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`)
      const tables = result.rows.map((r: any) => r.tablename)
      const mismatches: string[] = []

      for (const table of tables) {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM "${table}"`)
        const count = countResult.rows[0].count.toString()

        if (checksums && checksums[table] && checksums[table] !== count) {
          mismatches.push(`${table}: expected ${checksums[table]}, got ${count}`)
        }
      }

      return {
        valid: mismatches.length === 0,
        mismatches
      }
    } finally {
      client.release()
    }
  }
}
