// Distributed Database Manager (WAVE 6)
// Orchestrates RAID, replication, conflict resolution, and multi-provider routing

import { MultiProviderRouter } from './router/multi-provider-router.js'
import { RAIDLayer } from './raid/raid-layer.js'
import { ConflictResolver } from './replication/conflict-resolution.ts'
import { CloudflareD1Adapter } from './adapters/cloudflare-d1.js'
import { PostgreSQLAdapter } from './adapters/postgresql.js'
import { MongoDBAdapter } from './adapters/mongodb.js'
import { SQLiteAdapter } from './adapters/sqlite.js'

import type { DatabaseConfig, DatabaseProvider, RAIDLevel, QueryOptions, WriteOperation, Transaction } from './types.js'

export class DistributedDatabase {
  private router: MultiProviderRouter
  private raid: RAIDLayer
  private conflictResolver: ConflictResolver
  private config: DatabaseConfig | null = null
  private initialized = false

  constructor() {
    this.router = new MultiProviderRouter()
    this.raid = new RAIDLayer()
    this.conflictResolver = new ConflictResolver('last-write-wins')
  }

  async initialize(config: DatabaseConfig): Promise<void> {
    this.config = config

    // Create adapters based on configuration
    const adapters = new Map<DatabaseProvider, any>()

    // Initialize primary adapter
    adapters.set(
      config.primary.provider,
      await this.createAdapter(config.primary)
    )

    // Initialize secondary adapters
    for (const secondary of config.secondary) {
      adapters.set(
        secondary.provider,
        await this.createAdapter(secondary)
      )
    }

    // Initialize cache if configured
    if (config.cache) {
      adapters.set(
        config.cache.provider,
        await this.createAdapter(config.cache)
      )
    }

    // Initialize router with adapters
    await this.router.initialize(config, adapters)

    // Initialize RAID layer
    const providers = Array.from(adapters.keys())
    this.raid = new RAIDLayer(config.failover?.enabled ? 5 : 1, providers)

    // Initialize conflict resolver
    const providerPriority = new Map<string, number>()
    providerPriority.set(config.primary.provider, 0)
    config.secondary.forEach((sec, idx) => {
      providerPriority.set(sec.provider, idx + 1)
    })

    this.conflictResolver = new ConflictResolver(
      config.replication?.conflictResolution || 'last-write-wins',
      providerPriority
    )

    this.initialized = true
    console.log(`✓ Distributed database initialized with RAID level ${this.raid.getRAIDStats().level}`)
  }

  // Query operations
  async query<T = any>(options: QueryOptions): Promise<T[]> {
    if (!this.initialized) throw new Error('Database not initialized')
    const result = await this.router.query<T>(options)
    return result.data
  }

  // Write operations with automatic replication and RAID
  async write(operation: WriteOperation): Promise<{ success: boolean; affectedRows: number }> {
    if (!this.initialized) throw new Error('Database not initialized')
    if (!this.config) throw new Error('Configuration not loaded')

    const result = await this.router.write(operation)

    // Apply RAID striping if configured
    if (operation.replication === 'all') {
      const dataStr = JSON.stringify(operation.data)
      const dataBuffer = Buffer.from(dataStr)
      const raidResult = await this.raid.striped5Data(`write-${Date.now()}`, dataBuffer)
      // RAID chunks distributed across providers automatically
    }

    return {
      success: true,
      affectedRows: result.affectedRows || 0
    }
  }

  // Transactional operations
  async transaction<T = any>(tx: Transaction): Promise<T> {
    if (!this.initialized) throw new Error('Database not initialized')
    const result = await this.router.transaction(tx)
    return result.data as T
  }

  // Replication and failover
  async replicate(fromProvider: DatabaseProvider, toProviders: DatabaseProvider[]): Promise<void> {
    if (!this.initialized) throw new Error('Database not initialized')
    await this.router.replicateData(fromProvider, toProviders, [], { mode: 'merge' })
  }

  async failover(to: DatabaseProvider): Promise<void> {
    if (!this.initialized) throw new Error('Database not initialized')
    await this.router.failoverTo(to)
  }

  // Data migration
  async migrate(from: DatabaseProvider, to: DatabaseProvider): Promise<{
    success: boolean
    migratedRows: number
    duration: number
  }> {
    if (!this.initialized) throw new Error('Database not initialized')
    return this.router.migrateDatabase(from, to)
  }

  // Health and monitoring
  async health(): Promise<any> {
    if (!this.initialized) throw new Error('Database not initialized')
    return this.router.getAllHealth()
  }

  async stats(): Promise<any> {
    if (!this.initialized) throw new Error('Database not initialized')

    const health = await this.router.getAllHealth()
    const raidStats = this.raid.getRAIDStats()

    return {
      raid: raidStats,
      providers: health.map(h => ({
        provider: h.provider,
        status: h.status,
        latency: h.latency,
        errorRate: h.errorRate
      })),
      system: {
        initialized: this.initialized,
        failoverEnabled: this.config?.failover.enabled,
        consistencyModel: this.config?.replication?.conflictResolution || 'last-write-wins'
      }
    }
  }

  // Export/import for portability
  async exportAll(): Promise<{ schema: string; data: any[] }> {
    if (!this.initialized) throw new Error('Database not initialized')
    if (!this.config?.primary) throw new Error('No primary provider configured')

    const primaryAdapter = this.router['adapters'].get(this.config.primary.provider)
    if (!primaryAdapter) throw new Error('Primary adapter not found')

    return {
      schema: await primaryAdapter.exportSchema(),
      data: await primaryAdapter.exportData()
    }
  }

  async importAll(schema: string, data: any[]): Promise<number> {
    if (!this.initialized) throw new Error('Database not initialized')
    if (!this.config?.primary) throw new Error('No primary provider configured')

    const primaryAdapter = this.router['adapters'].get(this.config.primary.provider)
    if (!primaryAdapter) throw new Error('Primary adapter not found')

    await primaryAdapter.importSchema(schema)
    return await primaryAdapter.importData(data, 'replace')
  }

  // Validation and integrity checks
  async validate(): Promise<{ valid: boolean; mismatches: string[] }> {
    if (!this.initialized) throw new Error('Database not initialized')

    const allData = await this.router.exportAllData()
    const validations: Record<string, Record<string, string>> = {}

    for (const [provider, data] of allData) {
      const checksums: Record<string, string> = {}
      for (const item of data) {
        checksums[item.table] = item.rows.length.toString()
      }
      validations[provider as any] = checksums
    }

    const providers = Object.keys(validations)
    if (providers.length < 2) {
      return { valid: true, mismatches: [] }
    }

    const first = validations[providers[0]]
    const mismatches: string[] = []

    for (const provider of providers.slice(1)) {
      const current = validations[provider]
      for (const table in first) {
        if (current[table] !== first[table]) {
          mismatches.push(`${provider}.${table}: expected ${first[table]}, got ${current[table]}`)
        }
      }
    }

    return {
      valid: mismatches.length === 0,
      mismatches
    }
  }

  // Private methods

  private async createAdapter(config: any): Promise<any> {
    const provider = config.provider as DatabaseProvider

    switch (provider) {
      case 'cloudflare-d1': {
        const adapter = new CloudflareD1Adapter()
        await adapter.connect(config.connection)
        return adapter
      }
      case 'postgresql': {
        const adapter = new PostgreSQLAdapter()
        await adapter.connect(config)
        return adapter
      }
      case 'mongodb': {
        const adapter = new MongoDBAdapter()
        await adapter.connect(config)
        return adapter
      }
      case 'sqlite': {
        const adapter = new SQLiteAdapter()
        await adapter.connect(config)
        return adapter
      }
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }
  }

  // Getters for internal components (for testing/debugging)
  getRouter(): MultiProviderRouter {
    return this.router
  }

  getRAIDLayer(): RAIDLayer {
    return this.raid
  }

  getConflictResolver(): ConflictResolver {
    return this.conflictResolver
  }

  isInitialized(): boolean {
    return this.initialized
  }
}

// Export singleton instance
export const distributedDB = new DistributedDatabase()
