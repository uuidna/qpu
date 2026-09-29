/**
 * Unified HTTP Server
 * Single API gateway for all QPU operations
 * Integrates: core operations, UUID routing, persistence, autonomy
 */

import {
  defaultManager,
  uuidBridge,
  executionResultStore,
  autonomousEngine,
  startAutonomousImprovement,
  listOperations,
  countByDomain,
  executeOperation
} from '../core/index.js'

// ============================================================================
// HTTP SERVER INTERFACE
// ============================================================================

export interface UnifiedServerConfig {
  port: number
  environment: 'development' | 'staging' | 'production'
  enableAutonomy: boolean
  enableCors: boolean
  corsOrigins: string[]
}

// ============================================================================
// UNIFIED SERVER
// ============================================================================

export class UnifiedServer {
  private config: UnifiedServerConfig

  constructor(config: UnifiedServerConfig) {
    this.config = config
  }

  /**
   * Start HTTP server
   * In Node.js: uses Express
   * In Cloudflare Workers: uses fetch handlers
   * In Browser: uses service worker
   */
  async start(): Promise<void> {
    if (typeof window !== 'undefined') {
      // Browser environment - use service worker
      this.setupServiceWorker()
    } else if (typeof globalThis.fetch !== 'undefined' && typeof process === 'undefined') {
      // Cloudflare Workers environment
      console.log('Unified Server: Cloudflare Workers mode')
    } else {
      // Node.js environment - use Express-like routing
      this.setupExpressLike()
    }

    if (this.config.enableAutonomy) {
      startAutonomousImprovement()
    }

    console.log(`Unified Server started (${this.config.environment})`)
  }

  /**
   * Handle HTTP request
   * Works across all environments
   */
  async handleRequest(method: string, path: string, body?: Record<string, unknown>): Promise<any> {
    try {
      // Route to appropriate handler
      if (path === '/operations' && method === 'GET') {
        return this.listOperations()
      }

      if (path.startsWith('/execute') && method === 'POST') {
        return this.executeOperation(body)
      }

      if (path.startsWith('/compose') && method === 'POST') {
        return this.composeOperations(body)
      }

      if (path === '/health' && method === 'GET') {
        return this.healthCheck()
      }

      if (path === '/metrics' && method === 'GET') {
        return this.getMetrics()
      }

      if (path === '/autonomy/cycles' && method === 'GET') {
        return this.getCycles()
      }

      if (path === '/autonomy/patterns' && method === 'GET') {
        return this.getPatterns()
      }

      if (path === '/uuid' && method === 'POST') {
        return this.getUUID(body)
      }

      if (path === '/history' && method === 'GET') {
        return this.getHistory()
      }

      return { error: 'Not found', status: 404 }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : String(err),
        status: 500
      }
    }
  }

  // ========================================================================
  // HANDLERS
  // ========================================================================

  private listOperations() {
    const operations = listOperations()
    const domains = countByDomain()

    return {
      success: true,
      operations,
      count: operations.length,
      domains,
      status: 200
    }
  }

  private async executeOperation(body?: Record<string, unknown>) {
    if (!body || !body.operation) {
      return { error: 'Missing operation name', status: 400 }
    }

    const result = await defaultManager.execute(
      body.operation as string,
      body.inputs as Record<string, unknown>
    )

    // Persist result
    const history = defaultManager.getHistory(1)
    if (history.length > 0) {
      await executionResultStore.store(
        body.operation as string,
        body.inputs as Record<string, unknown>,
        result,
        history[0].duration
      )
    }

    return {
      success: result.success,
      data: result.data,
      error: result.error,
      status: result.success ? 200 : 400
    }
  }

  private async composeOperations(body?: Record<string, unknown>) {
    if (!body || !body.operations || !Array.isArray(body.operations)) {
      return { error: 'Missing operations array', status: 400 }
    }

    const result = await defaultManager.executeComposition({
      operations: body.operations as string[],
      inputs: body.inputs as Record<string, unknown>
    })

    return {
      success: result.success,
      data: result.data,
      error: result.error,
      status: result.success ? 200 : 400
    }
  }

  private async healthCheck() {
    const result = await defaultManager.execute('health-check')
    return {
      success: result.success,
      data: result.data,
      status: 200
    }
  }

  private async getMetrics() {
    const stats = defaultManager.getStats()
    return {
      success: true,
      stats,
      status: 200
    }
  }

  private getCycles() {
    const cycles = autonomousEngine.getCycles()
    return {
      success: true,
      cycles,
      count: cycles.length,
      status: 200
    }
  }

  private getPatterns() {
    const patterns = autonomousEngine.getPatterns()
    return {
      success: true,
      patterns,
      count: patterns.length,
      status: 200
    }
  }

  private getUUID(body?: Record<string, unknown>) {
    if (!body || !body.operation) {
      return { error: 'Missing operation name', status: 400 }
    }

    const uuid = uuidBridge.getUUID(body.operation as string)
    if (!uuid) {
      return { error: `Operation not found: ${body.operation}`, status: 404 }
    }

    return {
      success: true,
      uuid,
      operation: body.operation,
      status: 200
    }
  }

  private getHistory() {
    const history = defaultManager.getHistory(100)
    return {
      success: true,
      history,
      count: history.length,
      status: 200
    }
  }

  // ========================================================================
  // ENVIRONMENT-SPECIFIC SETUP
  // ========================================================================

  private setupExpressLike() {
    console.log('Setting up Express-like router (would use actual Express in Node.js)')
  }

  private setupServiceWorker() {
    console.log('Setting up Service Worker (for browser)')
  }
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

export const unifiedServer = new UnifiedServer({
  port: 3000,
  environment: 'development',
  enableAutonomy: true,
  enableCors: true,
  corsOrigins: ['*']
})

/**
 * Start unified server (global)
 */
export async function startUnifiedServer(): Promise<void> {
  await unifiedServer.start()
}

export default {
  UnifiedServer,
  unifiedServer,
  startUnifiedServer
}
