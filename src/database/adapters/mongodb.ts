// MongoDB Adapter (WAVE 6)
// NoSQL document store with eventual consistency

import { DatabaseAdapter } from './base-adapter.js'
import type { QueryOptions, WriteOperation, Transaction, DatabaseResult, HealthStatus, DatabaseProvider } from '../types.js'

export class MongoDBAdapter extends DatabaseAdapter {
  provider: DatabaseProvider = 'mongodb'
  private client: any = null
  private db: any = null

  async connect(config: any): Promise<void> {
    try {
      const mongodb = await import('mongodb')
      const { MongoClient } = mongodb.default || mongodb

      this.client = new MongoClient(config.connection, {
        maxPoolSize: config.options?.maxConnections || 10,
        minPoolSize: 5,
        socketTimeoutMS: config.options?.timeout || 30000,
        connectTimeoutMS: config.options?.timeout || 5000,
        ...config.options
      })

      await this.client.connect()
      this.db = this.client.db()

      // Test connection
      await this.db.admin().ping()
      this.connected = true
    } catch (error) {
      throw new Error(`MongoDB connection failed: ${(error as Error).message}`)
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
    }
    this.connected = false
  }

  async query<T = any>(options: QueryOptions): Promise<DatabaseResult<T>> {
    if (!this.db) throw new Error('Not connected to MongoDB')

    const startTime = performance.now()

    try {
      // Parse collection name from SQL-like query
      // Example: "SELECT * FROM users WHERE id = ?" -> collection: "users"
      const match = options.sql.match(/FROM\s+(\w+)/i)
      const collection = match ? match[1] : 'data'

      const col = this.db.collection(collection)
      const query = this.sqlWhereToMongoQuery(options.sql, options.params)

      const results = await col.find(query).toArray()

      return {
        data: results,
        count: results.length,
        provider: this.provider,
        latency: performance.now() - startTime,
        fromCache: false
      }
    } catch (error) {
      throw new Error(`MongoDB query failed: ${(error as Error).message}`)
    }
  }

  async write(operation: WriteOperation): Promise<DatabaseResult> {
    if (!this.db) throw new Error('Not connected to MongoDB')

    const startTime = performance.now()

    try {
      const col = this.db.collection(operation.table)
      let result: any

      switch (operation.operation) {
        case 'insert':
          result = await col.insertOne(operation.data || {})
          return {
            data: { insertedId: result.insertedId },
            count: 1,
            affectedRows: 1,
            insertId: result.insertedId.toString(),
            provider: this.provider,
            latency: performance.now() - startTime,
            fromCache: false
          }

        case 'update':
          result = await col.updateOne(
            operation.where || {},
            { $set: operation.data }
          )
          return {
            data: { modifiedCount: result.modifiedCount },
            count: result.modifiedCount,
            affectedRows: result.modifiedCount,
            provider: this.provider,
            latency: performance.now() - startTime,
            fromCache: false
          }

        case 'delete':
          result = await col.deleteOne(operation.where || {})
          return {
            data: { deletedCount: result.deletedCount },
            count: result.deletedCount,
            affectedRows: result.deletedCount,
            provider: this.provider,
            latency: performance.now() - startTime,
            fromCache: false
          }
      }
    } catch (error) {
      throw new Error(`MongoDB write failed: ${(error as Error).message}`)
    }

    return {
      data: {},
      count: 0,
      provider: this.provider,
      latency: performance.now() - startTime,
      fromCache: false
    }
  }

  async transaction(tx: Transaction): Promise<DatabaseResult> {
    if (tx.provider !== 'mongodb') {
      throw new Error('Cannot execute non-MongoDB transaction on MongoDB adapter')
    }

    if (!this.client) throw new Error('Not connected to MongoDB')

    const startTime = performance.now()
    const session = this.client.startSession()

    try {
      await session.withTransaction(async () => {
        const results: any[] = []

        for (const step of tx.steps) {
          const match = step.query.match(/FROM\s+(\w+)/i)
          const collection = match ? match[1] : 'data'
          const col = this.db.collection(collection)

          const query = this.sqlWhereToMongoQuery(step.query, step.params)
          const result = await col.findOne(query, { session })
          results.push(result)
        }

        return results
      })

      return {
        data: [],
        count: 0,
        provider: this.provider,
        latency: performance.now() - startTime,
        fromCache: false
      }
    } finally {
      await session.endSession()
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
      await this.db.admin().ping()

      const serverStatus = await this.db.admin().serverStatus?.() || {}

      return {
        provider: this.provider,
        status: 'healthy',
        latency: performance.now() - startTime,
        connectionPoolSize: serverStatus.connections?.current || 0,
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
    if (!this.db) throw new Error('Not connected to MongoDB')

    const collections = await this.db.listCollections().toArray()
    const schemas: string[] = []

    for (const col of collections) {
      schemas.push(`db.createCollection('${col.name}')`)
    }

    return schemas.join('\n')
  }

  async importSchema(schema: string): Promise<void> {
    if (!this.db) throw new Error('Not connected to MongoDB')

    const lines = schema.split('\n')
    for (const line of lines) {
      if (line.includes('createCollection')) {
        const match = line.match(/'([^']+)'/)
        if (match) {
          await this.db.createCollection(match[1])
        }
      }
    }
  }

  async exportData(tables?: string[]): Promise<any[]> {
    if (!this.db) throw new Error('Not connected to MongoDB')

    const collections = tables || (await this.db.listCollections().toArray()).map((c: any) => c.name)
    const data: any[] = []

    for (const collection of collections) {
      const col = this.db.collection(collection)
      const rows = await col.find({}).toArray()
      data.push({ table: collection, rows })
    }

    return data
  }

  async importData(data: any[], mode: 'replace' | 'merge' = 'merge'): Promise<number> {
    if (!this.db) throw new Error('Not connected to MongoDB')

    let totalRows = 0

    for (const item of data) {
      const col = this.db.collection(item.table)

      if (mode === 'replace') {
        await col.deleteMany({})
      }

      if (item.rows.length > 0) {
        await col.insertMany(item.rows)
        totalRows += item.rows.length
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
    if (!this.db) throw new Error('Not connected to MongoDB')

    const collections = await this.db.listCollections().toArray()
    const mismatches: string[] = []

    for (const col of collections) {
      const count = await this.db.collection(col.name).countDocuments()

      if (checksums && checksums[col.name] && checksums[col.name] !== count.toString()) {
        mismatches.push(`${col.name}: expected ${checksums[col.name]}, got ${count}`)
      }
    }

    return {
      valid: mismatches.length === 0,
      mismatches
    }
  }

  private sqlWhereToMongoQuery(sql: string, params?: any[]): any {
    // Simple SQL to MongoDB query conversion
    // In production, use a proper SQL parser
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:ORDER BY|LIMIT|$)/i)
    if (!whereMatch) return {}

    const whereClause = whereMatch[1].trim()
    const query: any = {}

    // Parse simple WHERE conditions
    const conditions = whereClause.split(/\s+AND\s+/i)
    let paramIndex = 0

    for (const condition of conditions) {
      const match = condition.match(/(\w+)\s*=\s*\?/)
      if (match) {
        query[match[1]] = params?.[paramIndex++]
      }
    }

    return query
  }
}
