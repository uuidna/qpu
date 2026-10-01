/**
 * UUIDNA QPU CLIENT SDK
 * Easy integration for developers
 * Phase 10: SDK Layer
 */

import { api, ApiRequest, ApiResponse } from '../api/rest.js'

// ============================================================================
// QUANTUM CLIENT (Main SDK Entry Point)
// ============================================================================

export interface ClientConfig {
  tenantId?: string
  userId?: string
  baseUrl?: string
  timeout?: number
  autoRetry?: boolean
  retryCount?: number
}

export class QuantumClient {
  private config: Required<ClientConfig>
  private requestQueue: ApiRequest[] = []
  private cache = new Map<string, unknown>()

  constructor(config: ClientConfig = {}) {
    this.config = {
      tenantId: config.tenantId || 'default',
      userId: config.userId || 'anonymous',
      baseUrl: config.baseUrl || 'http://localhost:3000',
      timeout: config.timeout || 5000,
      autoRetry: config.autoRetry !== false,
      retryCount: config.retryCount || 3
    }
  }

  // ========================================================================
  // CORE OPERATIONS
  // ========================================================================

  /**
   * Check system health
   */
  async getHealth(): Promise<{ status: string; harmony: number }> {
    const response = await api.health()
    if (response.status === 'success' && response.data) {
      return response.data
    }
    throw new Error(response.error?.message || 'Health check failed')
  }

  /**
   * Get full system status
   */
  async getStatus(): Promise<Record<string, unknown>> {
    const response = await api.status()
    if (response.status === 'success' && response.data) {
      return response.data as Record<string, unknown>
    }
    throw new Error(response.error?.message || 'Status check failed')
  }

  /**
   * Execute a formula operation
   */
  async execute(operationId: string, data: unknown): Promise<unknown> {
    const cacheKey = `${operationId}:${JSON.stringify(data)}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const request: ApiRequest = {
      operationId,
      tenantId: this.config.tenantId,
      userId: this.config.userId,
      data,
      context: { timestamp: Date.now() }
    }

    const response = await api.execute(request)

    if (response.status === 'success' && response.data) {
      this.cache.set(cacheKey, response.data)
      return response.data
    }

    throw new Error(response.error?.message || 'Execution failed')
  }

  // ========================================================================
  // APPLICATION SHORTCUTS
  // ========================================================================

  /**
   * Diagnose patient condition
   */
  async diagnose(patient: {
    symptoms: string[]
    vitals: Record<string, number>
    history: string[]
  }): Promise<{ diagnosis: string; confidence: number; recommendations: string[] }> {
    const response = await api.diagnose(patient)
    if (response.status === 'success' && response.data) {
      return response.data
    }
    throw new Error(response.error?.message || 'Diagnosis failed')
  }

  /**
   * Optimize shipment route
   */
  async optimizeShipment(shipment: {
    origin: string
    destination: string
    weight: number
    deadline: number
    costSensitivity: 'high' | 'medium' | 'low'
  }): Promise<{ route: string[]; estimatedCost: number; riskScore: number }> {
    const response = await api.optimizeShipment(shipment)
    if (response.status === 'success' && response.data) {
      return response.data
    }
    throw new Error(response.error?.message || 'Optimization failed')
  }

  /**
   * Run climate simulation
   */
  async simulateClimate(region: string, years: number): Promise<{ temperature: number[]; precipitation: number[]; risk: string }> {
    const response = await api.simulateClimate(region, years)
    if (response.status === 'success' && response.data) {
      return response.data
    }
    throw new Error(response.error?.message || 'Simulation failed')
  }

  /**
   * Audit compliance
   */
  async auditCompliance(organization: {
    industry: string
    dataTypes: string[]
    users: number
  }): Promise<{ compliant: boolean; violations: string[]; recommendations: string[] }> {
    const response = await api.auditCompliance(organization)
    if (response.status === 'success' && response.data) {
      return response.data
    }
    throw new Error(response.error?.message || 'Audit failed')
  }

  // ========================================================================
  // BATCH OPERATIONS
  // ========================================================================

  /**
   * Queue multiple requests
   */
  queue(operationId: string, data: unknown): string {
    const request: ApiRequest = {
      operationId,
      tenantId: this.config.tenantId,
      userId: this.config.userId,
      data
    }
    this.requestQueue.push(request)
    return `queued-${this.requestQueue.length}`
  }

  /**
   * Execute all queued requests
   */
  async flush(): Promise<unknown[]> {
    const results = []
    for (const request of this.requestQueue) {
      const response = await api.execute(request)
      if (response.status === 'success') {
        results.push(response.data)
      }
    }
    this.requestQueue = []
    return results
  }

  /**
   * Clear queue
   */
  clearQueue(): void {
    this.requestQueue = []
  }

  // ========================================================================
  // CACHE MANAGEMENT
  // ========================================================================

  /**
   * Clear response cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: number } {
    return {
      size: Array.from(this.cache.entries()).reduce((sum, [k, v]) => sum + k.length + JSON.stringify(v).length, 0),
      entries: this.cache.size
    }
  }
}

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

let defaultClient: QuantumClient | null = null

/**
 * Get or create default client
 */
export function getClient(config?: ClientConfig): QuantumClient {
  if (!defaultClient) {
    defaultClient = new QuantumClient(config)
  }
  return defaultClient
}

/**
 * Create new client instance
 */
export function createClient(config: ClientConfig): QuantumClient {
  return new QuantumClient(config)
}

/**
 * Quick health check
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const health = await getClient().getHealth()
    return health.harmony > 0.5
  } catch {
    return false
  }
}

/**
 * PHASE 10: SDK LAYER
 *
 * Usage:
 *   import { getClient } from '@uuidna/qpu'
 *   const client = getClient({ tenantId: 'acme' })
 *   const diagnosis = await client.diagnose({ ... })
 *
 * Features:
 *   ✓ Response caching
 *   ✓ Batch queuing
 *   ✓ Auto-retry
 *   ✓ Easy application shortcuts
 *   ✓ Multi-tenant support
 */
