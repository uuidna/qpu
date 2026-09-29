/**
 * Usage Attribution - Track customer usage and billing
 * Integrates with all connectors for holistic usage tracking
 */

import { DataWarehouseConnector, type CustomerUsageRecord } from './data-warehouse-connector.js'

// ============================================================================
// USAGE MODELS
// ============================================================================

export interface UsageEvent {
  timestamp: number
  customerId: string
  userId?: string
  operation: string
  operationType: 'read' | 'write' | 'compute' | 'export'
  inputSize: number
  outputSize: number
  duration: number
  success: boolean
  error?: string
  metadata?: Record<string, unknown>
}

export interface CustomerUsageQuota {
  customerId: string
  tier: 'free' | 'pro' | 'enterprise'
  monthlyQuota: {
    operations: number
    dataProcessed: number // GB
    costLimit: number
  }
  currentMonth: {
    operationsUsed: number
    dataProcessedGB: number
    costIncurred: number
    startDate: number
    endDate: number
  }
}

export interface UsageMetrics {
  customerId: string
  period: { from: number; to: number }
  totalOperations: number
  totalDataProcessedGB: number
  costIncurred: number
  operationBreakdown: Record<string, { count: number; cost: number }>
  avgLatency: number
  errorRate: number
}

export interface BillingRecord {
  invoiceId: string
  customerId: string
  periodStart: number
  periodEnd: number
  operations: number
  dataProcessedGB: number
  basePrice: number
  overagePrice: number
  totalPrice: number
  status: 'draft' | 'issued' | 'paid' | 'overdue'
}

// ============================================================================
// USAGE ATTRIBUTION SYSTEM
// ============================================================================

export class UsageAttribution {
  private dataWarehouse?: DataWarehouseConnector
  private quotas = new Map<string, CustomerUsageQuota>()
  private eventQueue: UsageEvent[] = []
  private flushInterval: NodeJS.Timer | null = null

  constructor(dataWarehouse?: DataWarehouseConnector) {
    this.dataWarehouse = dataWarehouse
  }

  /**
   * Initialize and start background processing
   */
  async initialize(): Promise<void> {
    if (this.dataWarehouse) {
      await this.dataWarehouse.initialize()
    }

    // Start periodic flush
    this.flushInterval = setInterval(
      () => this.flushEvents(),
      60000 // Every minute
    )
  }

  /**
   * Record usage event
   */
  async recordUsage(event: UsageEvent): Promise<void> {
    // Check quota
    const quota = this.quotas.get(event.customerId)
    if (quota) {
      const maxOpsPerDay = quota.monthlyQuota.operations / 30
      const opsToday = quota.currentMonth.operationsUsed

      if (opsToday >= maxOpsPerDay && event.operationType === 'compute') {
        console.warn(`⚠️  Customer ${event.customerId} approaching daily quota`)
      }
    }

    // Queue event
    this.eventQueue.push(event)

    // Flush if queue is large
    if (this.eventQueue.length >= 100) {
      await this.flushEvents()
    }
  }

  /**
   * Calculate cost for operation
   */
  calculateCost(event: UsageEvent): number {
    const baseCost = this.getBaseCost(event.operation)
    const sizeMultiplier = (event.inputSize + event.outputSize) / (1024 * 1024) // MB to GB
    const latencyMultiplier = Math.max(1, event.duration / 100) // Extra cost for slow ops

    return baseCost * sizeMultiplier * latencyMultiplier
  }

  /**
   * Get base cost per operation
   */
  private getBaseCost(operation: string): number {
    const costs: Record<string, number> = {
      generateText: 0.001,
      classifyData: 0.0005,
      searchIndex: 0.0002,
      extractInfo: 0.0008,
      // ... more operations
    }

    return costs[operation] || 0.0001 // Default $0.0001
  }

  /**
   * Get usage metrics for customer
   */
  async getUsageMetrics(customerId: string, from: number, to: number): Promise<UsageMetrics> {
    if (!this.dataWarehouse) {
      throw new Error('Data warehouse not connected')
    }

    const results = await this.dataWarehouse.getCustomerUsageStats(customerId, 30)

    return {
      customerId,
      period: { from, to },
      totalOperations: results.totalOperations,
      totalDataProcessedGB: 0, // Would query DW
      costIncurred: results.totalCost,
      operationBreakdown: Object.fromEntries(
        results.topOperations.map(op => [
          op.operation,
          { count: op.count, cost: this.calculateCost({ operation: op.operation } as UsageEvent) * op.count }
        ])
      ),
      avgLatency: results.avgLatency,
      errorRate: 0 // Would query DW
    }
  }

  /**
   * Set customer quota
   */
  setCustomerQuota(customerId: string, tier: 'free' | 'pro' | 'enterprise'): void {
    const quotas: Record<string, CustomerUsageQuota> = {
      free: {
        customerId,
        tier: 'free',
        monthlyQuota: {
          operations: 10000,
          dataProcessed: 1, // 1 GB
          costLimit: 10
        },
        currentMonth: {
          operationsUsed: 0,
          dataProcessedGB: 0,
          costIncurred: 0,
          startDate: Date.now(),
          endDate: Date.now() + 30 * 86400000
        }
      },
      pro: {
        customerId,
        tier: 'pro',
        monthlyQuota: {
          operations: 1000000,
          dataProcessed: 100, // 100 GB
          costLimit: 500
        },
        currentMonth: {
          operationsUsed: 0,
          dataProcessedGB: 0,
          costIncurred: 0,
          startDate: Date.now(),
          endDate: Date.now() + 30 * 86400000
        }
      },
      enterprise: {
        customerId,
        tier: 'enterprise',
        monthlyQuota: {
          operations: Number.MAX_SAFE_INTEGER,
          dataProcessed: Number.MAX_SAFE_INTEGER,
          costLimit: Number.MAX_SAFE_INTEGER
        },
        currentMonth: {
          operationsUsed: 0,
          dataProcessedGB: 0,
          costIncurred: 0,
          startDate: Date.now(),
          endDate: Date.now() + 30 * 86400000
        }
      }
    }

    this.quotas.set(customerId, quotas[tier])
  }

  /**
   * Get customer quota
   */
  getQuota(customerId: string): CustomerUsageQuota | undefined {
    return this.quotas.get(customerId)
  }

  /**
   * Generate invoice
   */
  async generateInvoice(customerId: string, periodStart: number, periodEnd: number): Promise<BillingRecord> {
    const metrics = await this.getUsageMetrics(customerId, periodStart, periodEnd)
    const quota = this.quotas.get(customerId)

    const basePrice = this.getTierPrice(quota?.tier || 'free')
    const overagePrice = Math.max(0, metrics.costIncurred - basePrice)

    return {
      invoiceId: `INV-${Date.now()}-${customerId}`,
      customerId,
      periodStart,
      periodEnd,
      operations: metrics.totalOperations,
      dataProcessedGB: metrics.totalDataProcessedGB,
      basePrice,
      overagePrice,
      totalPrice: basePrice + overagePrice,
      status: 'draft'
    }
  }

  /**
   * Get base tier price
   */
  private getTierPrice(tier: string): number {
    const prices: Record<string, number> = {
      free: 0,
      pro: 99,
      enterprise: 499
    }

    return prices[tier] || 0
  }

  /**
   * Flush events to data warehouse
   */
  private async flushEvents(): Promise<void> {
    if (!this.dataWarehouse || this.eventQueue.length === 0) {
      return
    }

    const events = this.eventQueue.splice(0, this.eventQueue.length)

    try {
      for (const event of events) {
        // Calculate cost
        const cost = this.calculateCost(event)

        // Update quota
        const quota = this.quotas.get(event.customerId)
        if (quota) {
          quota.currentMonth.operationsUsed++
          quota.currentMonth.dataProcessedGB += (event.inputSize + event.outputSize) / (1024 * 1024 * 1024)
          quota.currentMonth.costIncurred += cost
        }

        // Record to data warehouse
        await this.dataWarehouse.recordCustomerUsage({
          timestamp: event.timestamp,
          customerId: event.customerId,
          operationName: event.operation,
          operationType: event.operationType,
          inputSize: event.inputSize,
          outputSize: event.outputSize,
          duration: event.duration,
          success: event.success,
          errorMessage: event.error,
          userId: event.userId,
          subscriptionTier: quota?.tier || 'free'
        })
      }
    } catch (error) {
      console.error('Failed to flush usage events:', error)
      // Requeue on failure
      this.eventQueue.unshift(...events)
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }

    if (this.dataWarehouse) {
      this.dataWarehouse.destroy()
    }
  }
}

export const usageAttribution = new UsageAttribution()
