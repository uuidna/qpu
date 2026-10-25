// Example: Integration of observability with Database Operations (WAVE 8C)
// Shows how to instrument the distributed database layer from WAVE 6

import type { QueryOptions, Transaction } from '../../database/types.js'
import { tracer, metrics, getLogger, instrumentDatabaseQuery, analytics } from '../index.js'
import { TraceContext } from '../types.js'

/**
 * Instrumented query execution wrapper
 * Wraps DistributedDatabase.query() with full observability
 */
export async function executeQueryWithObservability<T>(
  context: TraceContext,
  query: {
    sql: string
    params?: any[]
    name?: string
  },
  executeFn: () => Promise<T>
): Promise<T> {
  const queryName = query.name || 'query'
  const logger = getLogger('database')

  return await instrumentDatabaseQuery(
    queryName,
    context,
    async () => {
      logger.debug('Query executing', context, {
        operation: queryName,
        paramCount: query.params?.length || 0
      })

      const result = await executeFn()

      logger.debug('Query executed', context, {
        operation: queryName,
        resultType: Array.isArray(result) ? 'array' : typeof result
      })

      return result
    },
    { table: queryName }
  )
}

/**
 * Instrumented transaction execution
 * Tracks begin/commit/rollback with full context
 */
export async function executeTransactionWithObservability<T>(
  context: TraceContext,
  transactionName: string,
  transactionFn: (context: TraceContext) => Promise<T>
): Promise<T> {
  const logger = getLogger('database')

  // Create transaction span
  const span = tracer.startSpan(`db.transaction.${transactionName}`, context, 'client', {
    transaction_name: transactionName
  })

  const startTime = performance.now()
  let eventCount = 0

  try {
    logger.debug('Transaction started', context, { transaction: transactionName })

    span.recordEvent({
      name: 'db.transaction.begin',
      timestamp: Date.now()
    })

    // Execute transaction
    const result = await transactionFn(context)

    const duration = performance.now() - startTime

    span.recordEvent({
      name: 'db.transaction.commit',
      timestamp: Date.now(),
      attributes: { duration }
    })

    tracer.endSpan(span, 'ok')
    metrics.recordOperation(`db.transaction.${transactionName}`, duration, true)

    logger.info('Transaction committed', context, {
      transaction: transactionName,
      duration: Math.round(duration)
    })

    return result
  } catch (err) {
    const duration = performance.now() - startTime
    const error = err as Error

    span.recordEvent({
      name: 'db.transaction.rollback',
      timestamp: Date.now(),
      attributes: { duration, error: error.message }
    })

    tracer.endSpan(span, 'error', { error: error.message })
    metrics.recordOperation(`db.transaction.${transactionName}`, duration, false)

    logger.error('Transaction rolled back', context, error, {
      transaction: transactionName,
      duration: Math.round(duration)
    })

    throw err
  }
}

/**
 * Patch DistributedDatabase with observability
 */
export function patchDistributedDatabaseWithObservability(DatabaseClass: any): any {
  const logger = getLogger('distributed-db')
  const originalQuery = DatabaseClass.prototype.query

  DatabaseClass.prototype.query = async function<T>(
    this: any,
    sql: string,
    params?: any[],
    options?: QueryOptions
  ): Promise<T> {
    // Create context if not provided
    const context = tracer.createTraceContext()

    const queryName = options?.name || 'query'
    const startTime = performance.now()

    const span = tracer.startSpan(`db.query.${queryName}`, context, 'client', {
      db_query_name: queryName,
      db_sql_hash: hashString(sql),
      db_param_count: params?.length || 0
    })

    try {
      logger.debug('Database query starting', context, {
        query: queryName,
        params: params?.length || 0
      })

      const result = await originalQuery.call(this, sql, params, options)

      const duration = performance.now() - startTime

      // Record metrics
      metrics.recordHistogram('db_query_latency_ms', duration, { query: queryName })
      metrics.incrementCounter('db_query_total', 1, { query: queryName })

      // Record result size if available
      const resultSize = Array.isArray(result) ? result.length : 1
      span.recordEvent({
        name: 'db.query.result',
        timestamp: Date.now(),
        attributes: {
          result_count: resultSize,
          duration
        }
      })

      tracer.endSpan(span, 'ok')

      logger.debug('Database query completed', context, {
        query: queryName,
        duration: Math.round(duration),
        resultCount: resultSize
      })

      // Set cost for the query (example: $0.001 per MB)
      if (resultSize > 0) {
        const estimatedSize = JSON.stringify(result).length
        const costPerMb = 0.001
        const queryCost = (estimatedSize / (1024 * 1024)) * costPerMb
        analytics.setOperationCost(`db.${queryName}`, queryCost)
      }

      return result
    } catch (err) {
      const duration = performance.now() - startTime
      const error = err as Error

      metrics.recordHistogram('db_query_latency_ms', duration, { query: queryName })
      metrics.incrementCounter('db_query_errors', 1, { query: queryName })

      span.recordEvent({
        name: 'db.query.error',
        timestamp: Date.now(),
        attributes: { error: error.message, duration }
      })

      tracer.endSpan(span, 'error', { error: error.message })

      logger.error('Database query failed', context, error, {
        query: queryName,
        duration: Math.round(duration)
      })

      throw err
    }
  }

  return DatabaseClass
}

/**
 * Monitor RAID operations
 */
export function instrumentRAIDOperations(raidLayer: any): void {
  const logger = getLogger('raid')
  const context = tracer.createTraceContext()

  const originalRead = raidLayer.read
  const originalWrite = raidLayer.write

  raidLayer.read = async function(key: string) {
    const startTime = performance.now()
    metrics.incrementCounter('raid_read_total', 1)

    try {
      const result = await originalRead.call(this, key)
      const duration = performance.now() - startTime

      metrics.recordHistogram('raid_read_latency_ms', duration)
      logger.debug('RAID read completed', context, { key, duration: Math.round(duration) })

      return result
    } catch (err) {
      const duration = performance.now() - startTime
      metrics.recordHistogram('raid_read_latency_ms', duration)
      metrics.incrementCounter('raid_read_errors', 1)

      logger.error('RAID read failed', context, err as Error, { key })
      throw err
    }
  }

  raidLayer.write = async function(key: string, value: any) {
    const startTime = performance.now()
    metrics.incrementCounter('raid_write_total', 1)

    try {
      const result = await originalWrite.call(this, key, value)
      const duration = performance.now() - startTime

      metrics.recordHistogram('raid_write_latency_ms', duration)
      metrics.recordHistogram('raid_write_size_bytes', JSON.stringify(value).length)

      logger.debug('RAID write completed', context, { key, duration: Math.round(duration) })

      return result
    } catch (err) {
      const duration = performance.now() - startTime
      metrics.recordHistogram('raid_write_latency_ms', duration)
      metrics.incrementCounter('raid_write_errors', 1)

      logger.error('RAID write failed', context, err as Error, { key })
      throw err
    }
  }
}

/**
 * Database performance monitor
 * Tracks and analyzes database performance characteristics
 */
export class DatabasePerformanceMonitor {
  private logger = getLogger('db-performance')
  private queryMetrics = new Map<string, {
    count: number
    totalDuration: number
    minDuration: number
    maxDuration: number
    errorCount: number
  }>()

  recordQuery(
    queryName: string,
    duration: number,
    success: boolean = true
  ): void {
    const existing = this.queryMetrics.get(queryName) || {
      count: 0,
      totalDuration: 0,
      minDuration: Infinity,
      maxDuration: 0,
      errorCount: 0
    }

    existing.count++
    existing.totalDuration += duration
    existing.minDuration = Math.min(existing.minDuration, duration)
    existing.maxDuration = Math.max(existing.maxDuration, duration)

    if (!success) {
      existing.errorCount++
    }

    this.queryMetrics.set(queryName, existing)

    // Alert if query is slow
    if (duration > 1000) {
      this.logger.warn('Slow query detected', tracer.createTraceContext(), {
        query: queryName,
        duration: Math.round(duration)
      })
    }
  }

  getSlowestQueries(limit: number = 10): Array<{
    query: string
    avgDuration: number
    maxDuration: number
    count: number
  }> {
    return Array.from(this.queryMetrics.entries())
      .map(([query, metrics]) => ({
        query,
        avgDuration: metrics.totalDuration / metrics.count,
        maxDuration: metrics.maxDuration,
        count: metrics.count
      }))
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, limit)
  }

  getMostFrequentQueries(limit: number = 10): Array<{
    query: string
    count: number
    totalDuration: number
  }> {
    return Array.from(this.queryMetrics.entries())
      .map(([query, metrics]) => ({
        query,
        count: metrics.count,
        totalDuration: metrics.totalDuration
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  getErrorRate(queryName: string): number {
    const metrics = this.queryMetrics.get(queryName)
    if (!metrics || metrics.count === 0) return 0
    return metrics.errorCount / metrics.count
  }

  logReport(): void {
    this.logger.info('Database performance report', tracer.createTraceContext(), {
      totalQueries: this.queryMetrics.size,
      slowestQueries: this.getSlowestQueries(3).map(q => ({
        query: q.query,
        avgDuration: Math.round(q.avgDuration)
      })),
      mostFrequent: this.getMostFrequentQueries(3).map(q => ({
        query: q.query,
        count: q.count
      }))
    })
  }
}

// Helper: Simple hash function for SQL
function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}
