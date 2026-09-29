/**
 * Base Connector - Abstract interface for all external integrations
 * Defines standard patterns for CRM, ERP, data warehouse, API connections
 */

// ============================================================================
// CONNECTOR INTERFACE
// ============================================================================

export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'retrying'
export type AuthType = 'api-key' | 'oauth2' | 'basic' | 'service-account'

export interface ConnectorConfig {
  id: string
  name: string
  type: string
  enabled: boolean
  authType: AuthType
  credentials: Record<string, string>
  baseUrl?: string
  timeout?: number // ms
  retryPolicy?: {
    maxRetries: number
    backoffMs: number
    backoffMultiplier: number
  }
  rateLimit?: {
    requestsPerSecond: number
    burstSize?: number
  }
}

export interface ConnectorMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  avgLatency: number
  lastSyncTime?: number
  nextSyncTime?: number
  errorCount: number
  status: ConnectionStatus
}

export interface SyncResult {
  status: 'success' | 'partial' | 'failed'
  recordsProcessed: number
  recordsFailed: number
  duration: number
  errors?: Array<{ record: string; error: string }>
  metadata?: Record<string, unknown>
}

export interface ConnectorEvent {
  timestamp: number
  type: 'sync' | 'error' | 'auth' | 'health'
  connector: string
  message: string
  data?: Record<string, unknown>
}

// ============================================================================
// BASE CONNECTOR CLASS
// ============================================================================

export abstract class BaseConnector {
  protected config: ConnectorConfig
  protected status: ConnectionStatus = 'disconnected'
  protected metrics: ConnectorMetrics
  protected lastError?: Error
  protected isAuthenticated = false
  protected retryCount = 0
  protected requestCache = new Map<string, { data: unknown; timestamp: number }>()

  constructor(config: ConnectorConfig) {
    this.config = config
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      avgLatency: 0,
      errorCount: 0,
      status: 'disconnected'
    }
  }

  /**
   * Initialize connector - authenticate and validate connection
   */
  async initialize(): Promise<void> {
    try {
      this.status = 'retrying'
      await this.authenticate()
      await this.validateConnection()
      this.status = 'connected'
      this.isAuthenticated = true
      this.retryCount = 0
    } catch (error) {
      this.status = 'error'
      this.lastError = error as Error
      throw error
    }
  }

  /**
   * Authenticate using configured credentials
   */
  protected abstract authenticate(): Promise<void>

  /**
   * Validate that connection is working
   */
  protected abstract validateConnection(): Promise<void>

  /**
   * Execute a request with retry and caching
   */
  protected async executeRequest<T>(
    method: string,
    path: string,
    data?: Record<string, unknown>,
    options?: { useCache?: boolean; cacheTTL?: number }
  ): Promise<T> {
    const cacheKey = `${method}:${path}`
    const now = Date.now()

    // Check cache
    if (options?.useCache) {
      const cached = this.requestCache.get(cacheKey)
      if (cached && now - cached.timestamp < (options.cacheTTL || 60000)) {
        return cached.data as T
      }
    }

    const startTime = now
    let lastError: Error | undefined

    // Retry loop
    const maxRetries = this.config.retryPolicy?.maxRetries ?? 3
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.performRequest<T>(method, path, data)

        // Cache result
        if (options?.useCache) {
          this.requestCache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
          })
        }

        // Update metrics
        this.recordSuccess(Date.now() - startTime)
        this.retryCount = 0

        return result
      } catch (error) {
        lastError = error as Error

        if (attempt < maxRetries) {
          const backoffMs = (this.config.retryPolicy?.backoffMs ?? 100) *
            Math.pow(this.config.retryPolicy?.backoffMultiplier ?? 2, attempt)

          await this.sleep(backoffMs)
          this.status = 'retrying'
        }
      }
    }

    // All retries failed
    this.recordFailure(Date.now() - startTime, lastError!)
    this.status = 'error'
    this.lastError = lastError
    throw lastError
  }

  /**
   * Perform actual HTTP/API request (implemented by subclass)
   */
  protected abstract performRequest<T>(
    method: string,
    path: string,
    data?: Record<string, unknown>
  ): Promise<T>

  /**
   * Record successful request
   */
  private recordSuccess(latency: number): void {
    this.metrics.totalRequests++
    this.metrics.successfulRequests++

    // Update average latency
    const avgLatency = this.metrics.avgLatency
    const n = this.metrics.successfulRequests
    this.metrics.avgLatency = (avgLatency * (n - 1) + latency) / n

    this.status = 'connected'
  }

  /**
   * Record failed request
   */
  private recordFailure(latency: number, error: Error): void {
    this.metrics.totalRequests++
    this.metrics.failedRequests++
    this.metrics.errorCount++
    this.lastError = error
    this.status = 'error'
  }

  /**
   * Sync data from external system
   */
  async sync(): Promise<SyncResult> {
    if (!this.isAuthenticated) {
      await this.initialize()
    }

    const startTime = Date.now()

    try {
      const result = await this.performSync()

      this.metrics.lastSyncTime = Date.now()
      this.metrics.nextSyncTime = Date.now() + 3600000 // 1 hour default

      return {
        ...result,
        duration: Date.now() - startTime
      }
    } catch (error) {
      return {
        status: 'failed',
        recordsProcessed: 0,
        recordsFailed: 0,
        duration: Date.now() - startTime,
        errors: [{ record: 'sync', error: (error as Error).message }]
      }
    }
  }

  /**
   * Perform actual sync (implemented by subclass)
   */
  protected abstract performSync(): Promise<Omit<SyncResult, 'duration'>>

  /**
   * Get connector status
   */
  getStatus(): ConnectorMetrics {
    return { ...this.metrics, status: this.status }
  }

  /**
   * Get last error
   */
  getLastError(): Error | undefined {
    return this.lastError
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ healthy: boolean; message: string }> {
    try {
      await this.validateConnection()
      return { healthy: true, message: 'Connected' }
    } catch (error) {
      return {
        healthy: false,
        message: (error as Error).message
      }
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.requestCache.clear()
  }

  /**
   * Sleep utility
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// ============================================================================
// CONNECTOR REGISTRY
// ============================================================================

export class ConnectorRegistry {
  private connectors = new Map<string, BaseConnector>()
  private configs = new Map<string, ConnectorConfig>()

  register(config: ConnectorConfig, connector: BaseConnector): void {
    this.connectors.set(config.id, connector)
    this.configs.set(config.id, config)
  }

  getConnector(id: string): BaseConnector | undefined {
    return this.connectors.get(id)
  }

  getConfig(id: string): ConnectorConfig | undefined {
    return this.configs.get(id)
  }

  getAll(): Map<string, BaseConnector> {
    return this.connectors
  }

  async initializeAll(): Promise<void> {
    const errors: Record<string, Error> = {}

    for (const [id, connector] of this.connectors) {
      try {
        await connector.initialize()
      } catch (error) {
        errors[id] = error as Error
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new Error(`Failed to initialize connectors: ${JSON.stringify(errors)}`)
    }
  }

  async healthCheckAll(): Promise<Record<string, { healthy: boolean; message: string }>> {
    const results: Record<string, { healthy: boolean; message: string }> = {}

    for (const [id, connector] of this.connectors) {
      results[id] = await connector.healthCheck()
    }

    return results
  }

  getMetrics(): Record<string, ConnectorMetrics> {
    const metrics: Record<string, ConnectorMetrics> = {}

    for (const [id, connector] of this.connectors) {
      metrics[id] = connector.getStatus()
    }

    return metrics
  }
}

export const connectorRegistry = new ConnectorRegistry()
