/**
 * Data Warehouse Connector - BigQuery, Snowflake, Redshift
 * Exports QPU operations and customer usage data
 */

import { BaseConnector, type ConnectorConfig, type SyncResult } from './base-connector.js'

// ============================================================================
// DATA WAREHOUSE MODELS
// ============================================================================

export interface CustomerUsageRecord {
  timestamp: number
  customerId: string
  operationName: string
  operationType: string
  inputSize: number
  outputSize: number
  duration: number
  success: boolean
  errorMessage?: string
  userId?: string
  subscriptionTier: string
  costCenter?: string
}

export interface OperationMetricsRecord {
  timestamp: number
  operation: string
  p50Latency: number
  p95Latency: number
  p99Latency: number
  avgLatency: number
  throughput: number
  errorRate: number
  successCount: number
  errorCount: number
}

export interface DataWarehouseTable {
  name: string
  schema: Record<string, string>
  recordCount: number
  lastModified: number
}

export interface DWConfig extends ConnectorConfig {
  type: 'data-warehouse'
  dwType: 'bigquery' | 'snowflake' | 'redshift'
  projectId?: string
  datasetId?: string
  tables: Record<string, string> // table name -> data type
}

// ============================================================================
// DATA WAREHOUSE CONNECTOR
// ============================================================================

export abstract class DataWarehouseConnector extends BaseConnector {
  protected dwConfig: DWConfig
  private batchQueue: unknown[] = []
  private flushInterval: ReturnType<typeof setInterval> | null = null

  constructor(config: DWConfig) {
    super(config)
    this.dwConfig = config
  }

  /**
   * Initialize and start background flush
   */
  async initialize(): Promise<void> {
    await super.initialize()

    // Start periodic flush
    this.flushInterval = setInterval(
      () => this.flushBatch(),
      30000 // Every 30 seconds
    )
  }

  /**
   * Add customer usage record
   */
  async recordCustomerUsage(record: CustomerUsageRecord): Promise<void> {
    this.batchQueue.push({
      table: 'customer_usage',
      record
    })

    // Flush if batch is large
    if (this.batchQueue.length >= 1000) {
      await this.flushBatch()
    }
  }

  /**
   * Add operation metrics record
   */
  async recordOperationMetrics(record: OperationMetricsRecord): Promise<void> {
    this.batchQueue.push({
      table: 'operation_metrics',
      record
    })

    if (this.batchQueue.length >= 1000) {
      await this.flushBatch()
    }
  }

  /**
   * Query data warehouse
   */
  async query<T = Record<string, unknown>>(
    sql: string,
    options?: { limit?: number; timeout?: number }
  ): Promise<T[]> {
    return this.executeRequest<T[]>(
      'POST',
      '/query',
      { sql, ...options },
      { useCache: true, cacheTTL: 60000 }
    )
  }

  /**
   * Get usage stats for customer
   */
  async getCustomerUsageStats(customerId: string, daysBack = 30): Promise<{
    totalOperations: number
    totalCost: number
    topOperations: Array<{ operation: string; count: number }>
    avgLatency: number
  }> {
    const startDate = Date.now() - daysBack * 86400000

    const results = await this.query<{
      count: number
      cost: number
      operation: string
      avg_latency: number
    }>(
      `
      SELECT
        COUNT(*) as count,
        SUM(cost) as cost,
        operation,
        AVG(duration) as avg_latency
      FROM customer_usage
      WHERE customerId = '${customerId}' AND timestamp >= ${startDate}
      GROUP BY operation
      ORDER BY count DESC
      LIMIT 100
      `,
      { timeout: 30000 }
    )

    const totalOps = results.reduce((sum, r) => sum + r.count, 0)
    const totalCost = results.reduce((sum, r) => sum + r.cost, 0)

    return {
      totalOperations: totalOps,
      totalCost,
      topOperations: results.map(r => ({
        operation: r.operation,
        count: r.count
      })),
      avgLatency: results[0]?.avg_latency || 0
    }
  }

  /**
   * Get performance trends
   */
  async getPerformanceTrends(daysBack = 7): Promise<Array<{
    date: string
    avgLatency: number
    errorRate: number
    throughput: number
  }>> {
    const startDate = Date.now() - daysBack * 86400000

    const results = await this.query<{
      date: string
      avg_latency: number
      error_rate: number
      throughput: number
    }>(
      `
      SELECT
        DATE(FROM_UNIXTIME(timestamp/1000)) as date,
        AVG(avgLatency) as avg_latency,
        AVG(errorRate) as error_rate,
        SUM(throughput) as throughput
      FROM operation_metrics
      WHERE timestamp >= ${startDate}
      GROUP BY date
      ORDER BY date ASC
      `,
      { timeout: 30000 }
    )

    return results.map(r => ({
      date: r.date,
      avgLatency: r.avg_latency,
      errorRate: r.error_rate,
      throughput: r.throughput
    }))
  }

  /**
   * Create tables if they don't exist
   */
  async ensureTables(): Promise<void> {
    for (const [tableName] of Object.entries(this.dwConfig.tables)) {
      try {
        await this.createTable(tableName)
      } catch (error) {
        // Table may already exist
      }
    }
  }

  /**
   * Create table (implemented by subclass)
   */
  protected abstract createTable(tableName: string): Promise<void>

  /**
   * Flush batch to data warehouse
   */
  protected async flushBatch(): Promise<void> {
    if (this.batchQueue.length === 0) {
      return
    }

    const batch = this.batchQueue.splice(0, this.batchQueue.length)

    try {
      await this.insertBatch(batch)
      this.metrics.successfulRequests++
    } catch (error) {
      this.metrics.failedRequests++
      // Requeue on failure
      this.batchQueue.unshift(...batch)
    }
  }

  /**
   * Insert batch (implemented by subclass)
   */
  protected abstract insertBatch(records: unknown[]): Promise<void>

  /**
   * Perform sync (export all pending data)
   */
  protected async performSync(): Promise<Omit<SyncResult, 'duration'>> {
    try {
      await this.flushBatch()

      return {
        status: 'success',
        recordsProcessed: this.batchQueue.length,
        recordsFailed: 0
      }
    } catch (error) {
      return {
        status: 'failed',
        recordsProcessed: 0,
        recordsFailed: this.batchQueue.length,
        errors: [{ record: 'batch', error: (error as Error).message }]
      }
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
  }
}

// ============================================================================
// BIGQUERY CONNECTOR
// ============================================================================

export class BigQueryConnector extends DataWarehouseConnector {
  protected async authenticate(): Promise<void> {
    const projectId = this.config.credentials['projectId']
    const serviceAccount = this.config.credentials['serviceAccount']

    if (!projectId || !serviceAccount) {
      throw new Error('Missing BigQuery credentials')
    }

    this.isAuthenticated = true
  }

  protected async validateConnection(): Promise<void> {
    await this.executeRequest<{ project_id: string }>(
      'GET',
      '/projects'
    )
  }

  protected async createTable(tableName: string): Promise<void> {
    const schema = this.dwConfig.tables[tableName]

    await this.executeRequest<void>(
      'POST',
      `/datasets/${this.dwConfig.datasetId}/tables`,
      {
        tableReference: {
          projectId: this.dwConfig.projectId,
          datasetId: this.dwConfig.datasetId,
          tableId: tableName
        },
        schema: JSON.parse(schema)
      }
    )
  }

  protected async insertBatch(records: unknown[]): Promise<void> {
    // Group by table
    const byTable: Record<string, unknown[]> = {}

    for (const item of records) {
      const row = item as { table: string; record: unknown }
      if (!byTable[row.table]) {
        byTable[row.table] = []
      }
      byTable[row.table].push(row.record)
    }

    // Insert each table's records
    for (const [tableName, tableRecords] of Object.entries(byTable)) {
      await this.executeRequest<void>(
        'POST',
        `/datasets/${this.dwConfig.datasetId}/tables/${tableName}/insertAll`,
        { rows: tableRecords.map(r => ({ json: r })) }
      )
    }
  }

  protected async performRequest<T>(
    method: string,
    path: string,
    data?: Record<string, unknown>
  ): Promise<T> {
    // Mock implementation
    return {} as T
  }
}

// ============================================================================
// SNOWFLAKE CONNECTOR
// ============================================================================

export class SnowflakeConnector extends DataWarehouseConnector {
  protected async authenticate(): Promise<void> {
    const account = this.config.credentials['account']
    const warehouse = this.config.credentials['warehouse']
    const database = this.config.credentials['database']
    const user = this.config.credentials['user']
    const password = this.config.credentials['password']

    if (!account || !warehouse || !database || !user || !password) {
      throw new Error('Missing Snowflake credentials')
    }

    this.isAuthenticated = true
  }

  protected async validateConnection(): Promise<void> {
    await this.query('SELECT 1')
  }

  protected async createTable(tableName: string): Promise<void> {
    const schema = this.dwConfig.tables[tableName]

    // Snowflake CREATE TABLE SQL
    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${schema})`
    await this.query(sql)
  }

  protected async insertBatch(records: unknown[]): Promise<void> {
    const byTable: Record<string, unknown[]> = {}

    for (const item of records) {
      const row = item as { table: string; record: unknown }
      if (!byTable[row.table]) {
        byTable[row.table] = []
      }
      byTable[row.table].push(row.record)
    }

    for (const [tableName, tableRecords] of Object.entries(byTable)) {
      // Build INSERT statement
      const columns = Object.keys(tableRecords[0] as Record<string, unknown>)
      const values = tableRecords.map(r => {
        const vals = columns.map(c => {
          const v = (r as Record<string, unknown>)[c]
          return typeof v === 'string' ? `'${v}'` : v
        })
        return `(${vals.join(',')})`
      })

      const sql = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES ${values.join(',')}`
      await this.query(sql)
    }
  }

  protected async performRequest<T>(
    method: string,
    path: string,
    data?: Record<string, unknown>
  ): Promise<T> {
    return {} as T
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createDataWarehouseConnector(config: DWConfig): DataWarehouseConnector {
  switch (config.dwType) {
    case 'bigquery':
      return new BigQueryConnector(config)
    case 'snowflake':
      return new SnowflakeConnector(config)
    default:
      throw new Error(`Unsupported data warehouse: ${config.dwType}`)
  }
}
