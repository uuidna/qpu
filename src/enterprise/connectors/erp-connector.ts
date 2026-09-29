/**
 * ERP Connector - Unified interface for SAP, Oracle, NetSuite
 * Syncs orders, inventory, financials, and supply chain data
 */

import { BaseConnector, type ConnectorConfig, type SyncResult } from './base-connector.js'

// ============================================================================
// ERP DATA MODELS
// ============================================================================

export interface ERPOrder {
  id: string
  orderNumber: string
  customerId: string
  orderDate: number
  deliveryDate?: number
  status: 'draft' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: number
  currency: string
  items: ERPOrderItem[]
  metadata?: Record<string, unknown>
}

export interface ERPOrderItem {
  id: string
  sku: string
  quantity: number
  unitPrice: number
  lineTotal: number
  description: string
}

export interface ERPInventory {
  sku: string
  productName: string
  quantity: number
  warehouseLocation: string
  reorderPoint: number
  lastCountDate: number
  supplier?: string
}

export interface ERPFinancial {
  periodId: string
  startDate: number
  endDate: number
  revenue: number
  expenses: number
  netIncome: number
  accountsReceivable: number
  accountsPayable: number
  cashPosition: number
}

export interface ERPSyncConfig extends ConnectorConfig {
  type: 'erp'
  erpType: 'sap' | 'oracle' | 'netsuite' | 'custom'
  syncEntities: ('orders' | 'inventory' | 'financials' | 'suppliers')[]
  incrementalSync: boolean
  lastSyncTimestamp?: number
  batchSize?: number
}

// ============================================================================
// ERP CONNECTOR
// ============================================================================

export abstract class ERPConnector extends BaseConnector {
  protected erpConfig: ERPSyncConfig
  private orders: Map<string, ERPOrder> = new Map()
  private inventory: Map<string, ERPInventory> = new Map()
  private financials: Map<string, ERPFinancial> = new Map()

  constructor(config: ERPSyncConfig) {
    super(config)
    this.erpConfig = config
  }

  /**
   * Get orders with filtering
   */
  async getOrders(filter?: {
    status?: string
    customerId?: string
    dateRange?: { from: number; to: number }
  }): Promise<ERPOrder[]> {
    const orders = await this.executeRequest<ERPOrder[]>(
      'GET',
      '/orders',
      filter as Record<string, unknown>,
      { useCache: true, cacheTTL: 300000 }
    )

    for (const order of orders) {
      this.orders.set(order.id, order)
    }

    return orders
  }

  /**
   * Get order details
   */
  async getOrder(orderId: string): Promise<ERPOrder | undefined> {
    if (this.orders.has(orderId)) {
      return this.orders.get(orderId)
    }

    try {
      const order = await this.executeRequest<ERPOrder>(
        'GET',
        `/orders/${orderId}`
      )

      this.orders.set(orderId, order)
      return order
    } catch (error) {
      return undefined
    }
  }

  /**
   * Create order
   */
  async createOrder(order: Omit<ERPOrder, 'id' | 'status'>): Promise<ERPOrder> {
    const result = await this.executeRequest<ERPOrder>(
      'POST',
      '/orders',
      { ...order, status: 'draft' } as Record<string, unknown>
    )

    this.orders.set(result.id, result)
    return result
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: ERPOrder['status']): Promise<ERPOrder> {
    const result = await this.executeRequest<ERPOrder>(
      'PATCH',
      `/orders/${orderId}`,
      { status }
    )

    this.orders.set(orderId, result)
    return result
  }

  /**
   * Get inventory
   */
  async getInventory(filter?: { warehouseId?: string; lowStock?: boolean }): Promise<ERPInventory[]> {
    const inventory = await this.executeRequest<ERPInventory[]>(
      'GET',
      '/inventory',
      filter as Record<string, unknown>,
      { useCache: true, cacheTTL: 180000 } // 3 min cache
    )

    for (const item of inventory) {
      this.inventory.set(item.sku, item)
    }

    return inventory
  }

  /**
   * Get inventory for specific SKU
   */
  async getInventoryBySku(sku: string): Promise<ERPInventory | undefined> {
    if (this.inventory.has(sku)) {
      return this.inventory.get(sku)
    }

    try {
      const item = await this.executeRequest<ERPInventory>(
        'GET',
        `/inventory/${sku}`
      )

      this.inventory.set(sku, item)
      return item
    } catch (error) {
      return undefined
    }
  }

  /**
   * Update inventory
   */
  async updateInventory(sku: string, quantity: number): Promise<ERPInventory> {
    const result = await this.executeRequest<ERPInventory>(
      'PATCH',
      `/inventory/${sku}`,
      { quantity }
    )

    this.inventory.set(sku, result)
    return result
  }

  /**
   * Get financial reports
   */
  async getFinancials(periodId?: string): Promise<ERPFinancial[]> {
    const params = periodId ? { periodId } : {}
    const financials = await this.executeRequest<ERPFinancial[]>(
      'GET',
      '/financials',
      params,
      { useCache: true, cacheTTL: 600000 } // 10 min cache
    )

    for (const fin of financials) {
      this.financials.set(fin.periodId, fin)
    }

    return financials
  }

  /**
   * Perform full sync
   */
  protected async performSync(): Promise<Omit<SyncResult, 'duration'>> {
    const results: Omit<SyncResult, 'duration'> = {
      status: 'success',
      recordsProcessed: 0,
      recordsFailed: 0
    }

    try {
      // Sync orders
      if (this.erpConfig.syncEntities.includes('orders')) {
        try {
          const orders = await this.getOrders()
          results.recordsProcessed += orders.length
        } catch (error) {
          results.recordsFailed++
          results.status = 'partial'
        }
      }

      // Sync inventory
      if (this.erpConfig.syncEntities.includes('inventory')) {
        try {
          const inventory = await this.getInventory()
          results.recordsProcessed += inventory.length
        } catch (error) {
          results.recordsFailed++
          results.status = 'partial'
        }
      }

      // Sync financials
      if (this.erpConfig.syncEntities.includes('financials')) {
        try {
          const financials = await this.getFinancials()
          results.recordsProcessed += financials.length
        } catch (error) {
          results.recordsFailed++
          results.status = 'partial'
        }
      }

      return results
    } catch (error) {
      return {
        status: 'failed',
        recordsProcessed: 0,
        recordsFailed: 0,
        errors: [{ record: 'sync', error: (error as Error).message }]
      }
    }
  }

  /**
   * Get cache stats
   */
  getCacheStats() {
    return {
      orders: this.orders.size,
      inventory: this.inventory.size,
      financials: this.financials.size
    }
  }
}

// ============================================================================
// SAP CONNECTOR
// ============================================================================

export class SAPConnector extends ERPConnector {
  protected async authenticate(): Promise<void> {
    const baseUrl = this.config.baseUrl
    const username = this.config.credentials['username']
    const password = this.config.credentials['password']

    if (!baseUrl || !username || !password) {
      throw new Error('Missing SAP credentials')
    }

    this.isAuthenticated = true
  }

  protected async validateConnection(): Promise<void> {
    await this.executeRequest<{ version: string }>(
      'GET',
      '/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_BusinessPartner'
    )
  }

  protected async performRequest<T>(
    method: string,
    path: string,
    data?: Record<string, unknown>
  ): Promise<T> {
    // Mock implementation
    if (method === 'GET' && path.includes('/orders')) {
      return [{
        id: 'SAP001',
        orderNumber: 'PO-2026-001',
        customerId: 'CUST001',
        orderDate: Date.now(),
        status: 'confirmed',
        totalAmount: 50000,
        currency: 'USD',
        items: [
          { id: 'ITEM001', sku: 'SKU001', quantity: 100, unitPrice: 500, lineTotal: 50000, description: 'Product A' }
        ]
      }] as unknown as T
    }

    return {} as T
  }
}

// ============================================================================
// ORACLE CONNECTOR
// ============================================================================

export class OracleConnector extends ERPConnector {
  protected async authenticate(): Promise<void> {
    const database = this.config.credentials['database']
    const username = this.config.credentials['username']
    const password = this.config.credentials['password']

    if (!database || !username || !password) {
      throw new Error('Missing Oracle credentials')
    }

    this.isAuthenticated = true
  }

  protected async validateConnection(): Promise<void> {
    await this.executeRequest<{ status: string }>(
      'GET',
      '/api/health'
    )
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
// FACTORY
// ============================================================================

export function createERPConnector(config: ERPSyncConfig): ERPConnector {
  switch (config.erpType) {
    case 'sap':
      return new SAPConnector(config)
    case 'oracle':
      return new OracleConnector(config)
    default:
      throw new Error(`Unsupported ERP type: ${config.erpType}`)
  }
}
