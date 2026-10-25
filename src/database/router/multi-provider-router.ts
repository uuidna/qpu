// Multi-Provider Router with Automatic Failover (WAVE 6)
// Routes queries to optimal provider, handles failover, manages replication

import { DatabaseAdapter } from '../adapters/base-adapter.js'
import type { QueryOptions, WriteOperation, Transaction, DatabaseResult, HealthStatus, DatabaseConfig, DatabaseProvider } from '../types.js'

export class MultiProviderRouter {
  private adapters: Map<DatabaseProvider, DatabaseAdapter> = new Map()
  private config: DatabaseConfig | null = null
  private healthCache: Map<DatabaseProvider, HealthStatus> = new Map()
  private lastHealthCheck = 0
  private healthCheckInterval = 30000  // 30 seconds
  private failoverEnabled = false
  private replicationInFlight = new Set<string>()

  async initialize(config: DatabaseConfig, adapterMap: Map<DatabaseProvider, DatabaseAdapter>): Promise<void> {
    this.config = config
    this.adapters = adapterMap
    this.failoverEnabled = config.failover.enabled
    this.healthCheckInterval = config.failover.healthCheckInterval

    // Start health check loop
    this.startHealthCheckLoop()
  }

  // Main query method - handles provider selection and failover
  async query<T = any>(options: QueryOptions): Promise<DatabaseResult<T>> {
    const providers = options.preferredProviders || [this.config?.primary.provider as DatabaseProvider]

    for (const providerName of providers) {
      const adapter = this.adapters.get(providerName)
      if (!adapter) continue

      // Check health before querying
      const health = await this.getHealth(providerName)
      if (health.status === 'unavailable') {
        continue  // Skip unavailable providers
      }

      try {
        return await adapter.query<T>(options)
      } catch (error) {
        console.warn(`Query failed on ${providerName}, trying next provider...`)
        // Continue to next provider
      }
    }

    // All providers failed
    throw new Error(`Query failed on all providers: ${providers.join(', ')}`)
  }

  // Write operation - replicates to multiple providers
  async write(operation: WriteOperation): Promise<DatabaseResult> {
    if (!this.config) throw new Error('Router not initialized')

    const primaryAdapter = this.adapters.get(this.config.primary.provider)
    if (!primaryAdapter) throw new Error('Primary adapter not configured')

    // Always write to primary first
    const result = await primaryAdapter.write(operation)

    // Handle replication asynchronously
    if (operation.replication && operation.replication !== 'none') {
      this.queueReplication(operation, result)
    }

    return result
  }

  // Transaction - runs on specified provider
  async transaction(tx: Transaction): Promise<DatabaseResult> {
    const adapter = this.adapters.get(tx.provider)
    if (!adapter) throw new Error(`Adapter for ${tx.provider} not found`)

    return adapter.transaction(tx)
  }

  // Health check for a provider
  async getHealth(provider: DatabaseProvider): Promise<HealthStatus> {
    // Use cached health if recent
    const cached = this.healthCache.get(provider)
    if (cached && Date.now() - cached.lastCheckTime < this.healthCheckInterval / 2) {
      return cached
    }

    const adapter = this.adapters.get(provider)
    if (!adapter) {
      return {
        provider,
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
      const health = await adapter.health()
      this.healthCache.set(provider, health)
      return health
    } catch (error) {
      const health: HealthStatus = {
        provider,
        status: 'unavailable',
        latency: 1000,
        connectionPoolSize: 0,
        failureCount: 1,
        lastCheckTime: Date.now(),
        uptime: 0,
        errorRate: 100
      }
      this.healthCache.set(provider, health)
      return health
    }
  }

  // Get health status for all providers
  async getAllHealth(): Promise<HealthStatus[]> {
    const health: HealthStatus[] = []

    for (const provider of this.adapters.keys()) {
      health.push(await this.getHealth(provider))
    }

    return health
  }

  // Manual failover
  async failoverTo(targetProvider: DatabaseProvider): Promise<void> {
    if (!this.failoverEnabled) throw new Error('Failover disabled')

    const primaryProvider = this.config?.primary.provider
    console.log(`Initiating failover from ${primaryProvider} to ${targetProvider}`)

    // Update config to promote secondary
    if (this.config) {
      const secondary = this.config.secondary.find(s => s.provider === targetProvider)
      if (secondary) {
        this.config.primary = { ...secondary, provider: targetProvider }
      }
    }

    // Ensure data is synced
    await this.syncData(primaryProvider as DatabaseProvider, targetProvider)
  }

  // Export data from all providers for analysis
  async exportAllData(): Promise<Map<DatabaseProvider, any[]>> {
    const data = new Map<DatabaseProvider, any[]>()

    for (const [provider, adapter] of this.adapters) {
      try {
        const exported = await adapter.exportData()
        data.set(provider, exported)
      } catch (error) {
        console.warn(`Failed to export from ${provider}:`, error)
      }
    }

    return data
  }

  // Replicate specific data to target providers
  async replicateData(
    sourceProvider: DatabaseProvider,
    targetProviders: DatabaseProvider[],
    data: any[],
    options?: { mode?: 'replace' | 'merge'; partial?: boolean }
  ): Promise<Map<DatabaseProvider, number>> {
    const results = new Map<DatabaseProvider, number>()

    const sourceAdapter = this.adapters.get(sourceProvider)
    if (!sourceAdapter) throw new Error(`Source provider ${sourceProvider} not found`)

    for (const target of targetProviders) {
      const targetAdapter = this.adapters.get(target)
      if (!targetAdapter) continue

      try {
        const rowsImported = await targetAdapter.importData(data, options?.mode || 'merge')
        results.set(target, rowsImported)
      } catch (error) {
        console.warn(`Replication to ${target} failed:`, error)
        results.set(target, 0)
      }
    }

    return results
  }

  // Data portability - migrate schema and data
  async migrateDatabase(
    sourceProvider: DatabaseProvider,
    targetProvider: DatabaseProvider,
    options?: any
  ): Promise<{ success: boolean; migratedRows: number; duration: number }> {
    const sourceAdapter = this.adapters.get(sourceProvider)
    const targetAdapter = this.adapters.get(targetProvider)

    if (!sourceAdapter) throw new Error(`Source provider ${sourceProvider} not found`)
    if (!targetAdapter) throw new Error(`Target provider ${targetProvider} not found`)

    const startTime = performance.now()

    try {
      // Export schema from source
      const schema = await sourceAdapter.exportSchema()
      await targetAdapter.importSchema(schema)

      // Export data from source
      const data = await sourceAdapter.exportData()
      const migratedRows = await targetAdapter.importData(data, 'replace')

      // Validate migration
      const validation = await this.validateMigration(sourceAdapter, targetAdapter)

      return {
        success: validation.valid,
        migratedRows,
        duration: performance.now() - startTime
      }
    } catch (error) {
      throw new Error(`Migration failed: ${(error as Error).message}`)
    }
  }

  // Get provider info and status
  getProviderInfo(): Array<{ provider: DatabaseProvider; priority: number; status: string }> {
    if (!this.config) return []

    return [
      {
        provider: this.config.primary.provider,
        priority: 0,
        status: 'primary'
      },
      ...this.config.secondary.map((sec, idx) => ({
        provider: sec.provider,
        priority: sec.priority || idx + 1,
        status: 'secondary'
      }))
    ]
  }

  // Private methods

  private startHealthCheckLoop(): void {
    setInterval(() => {
      this.performHealthCheck()
    }, this.healthCheckInterval)
  }

  private async performHealthCheck(): Promise<void> {
    const health = await this.getAllHealth()

    const availableProviders = health.filter(h => h.status !== 'unavailable')
    const unavailableProviders = health.filter(h => h.status === 'unavailable')

    // Log health status
    console.log(`Health check: ${availableProviders.length} healthy, ${unavailableProviders.length} unavailable`)

    // If primary is down, initiate failover
    if (this.failoverEnabled && this.config) {
      const primaryHealth = health.find(h => h.provider === this.config?.primary.provider)
      if (primaryHealth?.status === 'unavailable' && availableProviders.length > 0) {
        const fallbackProvider = availableProviders[0].provider
        console.warn(`Primary ${this.config.primary.provider} down, failing over to ${fallbackProvider}`)
        await this.failoverTo(fallbackProvider as DatabaseProvider)
      }
    }

    this.lastHealthCheck = Date.now()
  }

  private async syncData(from: DatabaseProvider, to: DatabaseProvider): Promise<void> {
    const fromAdapter = this.adapters.get(from)
    const toAdapter = this.adapters.get(to)

    if (!fromAdapter || !toAdapter) throw new Error('Sync providers not found')

    const data = await fromAdapter.exportData()
    await toAdapter.importData(data, 'replace')
  }

  private queueReplication(operation: WriteOperation, result: DatabaseResult): void {
    if (!this.config) return

    const eventId = `repl:${Date.now()}:${Math.random().toString(36).slice(2)}`
    this.replicationInFlight.add(eventId)

    // Run replication in background
    this.performReplication(operation, result, eventId).catch(error => {
      console.error(`Replication failed for ${eventId}:`, error)
    }).finally(() => {
      this.replicationInFlight.delete(eventId)
    })
  }

  private async performReplication(operation: WriteOperation, result: DatabaseResult, eventId: string): Promise<void> {
    if (!this.config) return

    const targets = this.config.secondary
      .filter(sec => operation.replication === 'all' || operation.replication === 'majority')
      .map(sec => sec.provider)

    // Replicate to secondary providers
    for (const target of targets) {
      const adapter = this.adapters.get(target)
      if (!adapter) continue

      try {
        await adapter.write(operation)
      } catch (error) {
        console.warn(`Failed to replicate to ${target}:`, error)
      }
    }
  }

  private async validateMigration(source: DatabaseAdapter, target: DatabaseAdapter): Promise<{ valid: boolean; mismatches: string[] }> {
    // Get checksums from source
    const sourceData = await source.exportData()
    const checksums: Record<string, string> = {}

    for (const item of sourceData) {
      checksums[item.table] = item.rows.length.toString()
    }

    // Validate against target
    return target.validateData(checksums)
  }
}
