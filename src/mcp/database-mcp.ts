// Database Abstraction MCP Handler (WAVE 6)
// Exposes distributed database as MCP tools with multi-provider routing

import { MultiProviderRouter } from '../database/router/multi-provider-router.js'
import { CloudflareD1Adapter } from '../database/adapters/cloudflare-d1.js'
import { PostgreSQLAdapter } from '../database/adapters/postgresql.js'
import { MongoDBAdapter } from '../database/adapters/mongodb.js'
import type { MCPRequest, MCPResponse } from './mcp-server.js'
import type { DatabaseProvider, Consistency, DatabaseConfig } from '../database/types.js'

export class DatabaseMCP {
  private router: MultiProviderRouter
  private config: DatabaseConfig | null = null

  constructor() {
    this.router = new MultiProviderRouter()
  }

  async initialize(config: DatabaseConfig): Promise<void> {
    this.config = config

    // Create adapter instances based on config
    const adapters = new Map<DatabaseProvider, any>()

    // Initialize primary adapter
    const primaryAdapter = await this.createAdapter(config.primary)
    adapters.set(config.primary.provider, primaryAdapter)

    // Initialize secondary adapters
    for (const secondary of config.secondary) {
      const adapter = await this.createAdapter(secondary)
      adapters.set(secondary.provider, adapter)
    }

    // Initialize cache if configured
    if (config.cache) {
      const cacheAdapter = await this.createAdapter(config.cache)
      adapters.set(config.cache.provider, cacheAdapter)
    }

    await this.router.initialize(config, adapters)
  }

  async handle(request: MCPRequest): Promise<MCPResponse> {
    const tool = request.params.name
    const args = request.params.arguments

    try {
      switch (tool) {
        case 'db:query':
          return await this.handleQuery(args)
        case 'db:write':
          return await this.handleWrite(args)
        case 'db:transaction':
          return await this.handleTransaction(args)
        case 'db:replicate':
          return await this.handleReplicate(args)
        case 'db:failover':
          return await this.handleFailover(args)
        case 'db:health':
          return await this.handleHealth(args)
        case 'db:config':
          return await this.handleConfig(args)
        case 'db:stats':
          return await this.handleStats(args)
        case 'db:migrate':
          return await this.handleMigrate(args)
        case 'db:validate':
          return await this.handleValidate(args)
        case 'db:export':
          return await this.handleExport(args)
        case 'db:import':
          return await this.handleImport(args)
        default:
          return {
            success: false,
            error: `Unknown tool: ${tool}`,
            provider: 'unknown',
            latency: 0,
            timestamp: Date.now()
          }
      }
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        provider: 'unknown',
        latency: 0,
        timestamp: Date.now()
      }
    }
  }

  private async handleQuery(args: any): Promise<MCPResponse> {
    const startTime = performance.now()

    const result = await this.router.query({
      sql: args.sql,
      params: args.params,
      consistency: args.consistency as Consistency,
      preferredProviders: args.preferredProviders,
      timeout: args.timeout
    })

    return {
      success: true,
      data: {
        rows: result.data,
        count: result.count,
        provider: result.provider,
        fromCache: result.fromCache
      },
      provider: result.provider,
      latency: result.latency,
      timestamp: Date.now()
    }
  }

  private async handleWrite(args: any): Promise<MCPResponse> {
    const startTime = performance.now()

    const result = await this.router.write({
      operation: args.operation,
      table: args.table,
      data: args.data,
      where: args.where,
      replication: args.replication,
      timeout: args.timeout,
      consistency: args.consistency
    })

    return {
      success: true,
      data: {
        affectedRows: result.affectedRows,
        insertId: result.insertId,
        provider: result.provider
      },
      provider: result.provider,
      latency: result.latency,
      timestamp: Date.now()
    }
  }

  private async handleTransaction(args: any): Promise<MCPResponse> {
    const startTime = performance.now()

    const result = await this.router.transaction({
      provider: args.provider as DatabaseProvider,
      steps: args.steps,
      isolation: args.isolation,
      timeout: args.timeout
    })

    return {
      success: true,
      data: {
        results: result.data,
        provider: result.provider
      },
      provider: result.provider,
      latency: result.latency,
      timestamp: Date.now()
    }
  }

  private async handleReplicate(args: any): Promise<MCPResponse> {
    const startTime = performance.now()

    // Get data from source provider
    const sourceProvider = args.fromProvider as DatabaseProvider
    const targetProviders = args.toProviders as DatabaseProvider[]

    const result = await this.router.replicateData(
      sourceProvider,
      targetProviders,
      [],
      { mode: args.fullSync ? 'replace' : 'merge' }
    )

    const latency = performance.now() - startTime

    return {
      success: true,
      data: {
        replicatedTo: Object.fromEntries(result),
        totalReplicated: Array.from(result.values()).reduce((a, b) => a + b, 0)
      },
      provider: sourceProvider,
      latency,
      timestamp: Date.now()
    }
  }

  private async handleFailover(args: any): Promise<MCPResponse> {
    const startTime = performance.now()

    await this.router.failoverTo(args.to as DatabaseProvider)

    const latency = performance.now() - startTime

    return {
      success: true,
      data: {
        from: args.from,
        to: args.to,
        reason: args.reason,
        timestamp: new Date().toISOString()
      },
      provider: args.to,
      latency,
      timestamp: Date.now()
    }
  }

  private async handleHealth(args: any): Promise<MCPResponse> {
    const startTime = performance.now()

    const providers = args.providers as DatabaseProvider[]
    const health = await this.router.getAllHealth()
    const filtered = health.filter(h => !providers || providers.includes(h.provider))

    const latency = performance.now() - startTime

    return {
      success: true,
      data: {
        providers: filtered.map(h => ({
          provider: h.provider,
          status: h.status,
          latency: h.latency,
          errorRate: h.errorRate,
          uptime: h.uptime
        }))
      },
      provider: 'health-check',
      latency,
      timestamp: Date.now()
    }
  }

  private async handleConfig(args: any): Promise<MCPResponse> {
    const startTime = performance.now()

    // Return current provider configuration
    const providerInfo = this.router.getProviderInfo()
    const latency = performance.now() - startTime

    return {
      success: true,
      data: {
        providers: providerInfo,
        config: this.config
      },
      provider: 'config',
      latency,
      timestamp: Date.now()
    }
  }

  private async handleStats(args: any): Promise<MCPResponse> {
    const startTime = performance.now()

    const health = await this.router.getAllHealth()
    const stats = {
      healthyProviders: health.filter(h => h.status === 'healthy').length,
      totalProviders: health.length,
      avgLatency: health.reduce((sum, h) => sum + h.latency, 0) / health.length,
      maxErrorRate: Math.max(...health.map(h => h.errorRate)),
      timestamp: Date.now()
    }

    const latency = performance.now() - startTime

    return {
      success: true,
      data: stats,
      provider: 'stats',
      latency,
      timestamp: Date.now()
    }
  }

  private async handleMigrate(args: any): Promise<MCPResponse> {
    const startTime = performance.now()

    const result = await this.router.migrateDatabase(
      args.from as DatabaseProvider,
      args.to as DatabaseProvider,
      args.options
    )

    const latency = performance.now() - startTime

    return {
      success: result.success,
      data: result,
      provider: `${args.from}->${args.to}`,
      latency,
      timestamp: Date.now()
    }
  }

  private async handleValidate(args: any): Promise<MCPResponse> {
    const startTime = performance.now()

    const allData = await this.router.exportAllData()
    const validations: any = {}

    for (const [provider, data] of allData) {
      const checksums: Record<string, string> = {}
      for (const item of data) {
        checksums[item.table] = item.rows.length.toString()
      }
      validations[provider] = checksums
    }

    const latency = performance.now() - startTime

    return {
      success: true,
      data: {
        validations,
        consistent: this.checkConsistency(validations)
      },
      provider: 'validation',
      latency,
      timestamp: Date.now()
    }
  }

  private async handleExport(args: any): Promise<MCPResponse> {
    const startTime = performance.now()

    const allData = await this.router.exportAllData()
    const latency = performance.now() - startTime

    return {
      success: true,
      data: {
        providers: Array.from(allData.keys()),
        dataSize: Array.from(allData.values()).reduce((sum, data) => {
          return sum + JSON.stringify(data).length
        }, 0)
      },
      provider: 'export',
      latency,
      timestamp: Date.now()
    }
  }

  private async handleImport(args: any): Promise<MCPResponse> {
    const startTime = performance.now()

    // Implementation depends on how data is provided
    // Could be file path, URL, or embedded data

    const latency = performance.now() - startTime

    return {
      success: false,
      error: 'Import not yet implemented',
      provider: 'import',
      latency,
      timestamp: Date.now()
    }
  }

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
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }
  }

  private checkConsistency(validations: Record<string, Record<string, string>>): boolean {
    const providers = Object.keys(validations)
    if (providers.length < 2) return true

    const first = validations[providers[0]]
    return providers.every(provider => {
      const current = validations[provider]
      return JSON.stringify(current) === JSON.stringify(first)
    })
  }
}

// Export singleton for use in MCP server
export const databaseMCP = new DatabaseMCP()
