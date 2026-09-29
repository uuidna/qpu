/**
 * Payment Processor
 * Integration for processing payments, subscriptions, and billing
 * Supports multiple payment providers (Stripe, PayPal, etc.)
 */

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export type PaymentProvider = 'stripe' | 'paypal' | 'coinbase' | 'test'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise'

export interface PaymentConfig {
  provider: PaymentProvider
  apiKey?: string
  webhook_secret?: string
  currency: string
  taxRate: number
}

export interface PaymentRequest {
  id: string
  userId: string
  amount: number
  currency: string
  description: string
  metadata?: Record<string, unknown>
}

export interface PaymentResult {
  id: string
  status: PaymentStatus
  amount: number
  currency: string
  timestamp: Date
  transactionId?: string
  error?: string
}

export interface SubscriptionInfo {
  userId: string
  tier: SubscriptionTier
  status: 'active' | 'cancelled' | 'suspended'
  renewalDate: Date
  cancelledAt?: Date
}

export interface UsageMetrics {
  userId: string
  operationsExecuted: number
  compositionsRun: number
  storageUsedMb: number
  bandwidthUsedGb: number
  timestamp: Date
}

// ============================================================================
// PAYMENT PROCESSOR
// ============================================================================

export class PaymentProcessor {
  private config: PaymentConfig
  private transactions: Map<string, PaymentResult> = new Map()
  private subscriptions: Map<string, SubscriptionInfo> = new Map()
  private usageMetrics: Map<string, UsageMetrics> = new Map()

  constructor(config: PaymentConfig) {
    this.config = config
  }

  /**
   * Process payment
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    const startTime = Date.now()

    try {
      const result: PaymentResult = {
        id: request.id,
        status: 'processing',
        amount: request.amount,
        currency: request.currency,
        timestamp: new Date(),
        transactionId: `txn-${Date.now()}-${Math.random().toString(36).slice(2)}`
      }

      // Simulate payment processing based on provider
      switch (this.config.provider) {
        case 'stripe':
          await this.processStripePayment(request, result)
          break
        case 'paypal':
          await this.processPayPalPayment(request, result)
          break
        case 'coinbase':
          await this.processCoinbasePayment(request, result)
          break
        case 'test':
          result.status = 'completed'
          break
        default:
          throw new Error(`Unknown provider: ${this.config.provider}`)
      }

      this.transactions.set(request.id, result)
      return result
    } catch (error) {
      const result: PaymentResult = {
        id: request.id,
        status: 'failed',
        amount: request.amount,
        currency: request.currency,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : String(error)
      }

      this.transactions.set(request.id, result)
      return result
    }
  }

  /**
   * Process Stripe payment
   */
  private async processStripePayment(
    request: PaymentRequest,
    result: PaymentResult
  ): Promise<void> {
    if (!this.config.apiKey) {
      throw new Error('Stripe API key not configured')
    }

    // In real implementation, call Stripe API
    // For now, simulate with delay
    await new Promise(resolve => setTimeout(resolve, 100))
    result.status = 'completed'
  }

  /**
   * Process PayPal payment
   */
  private async processPayPalPayment(
    request: PaymentRequest,
    result: PaymentResult
  ): Promise<void> {
    if (!this.config.apiKey) {
      throw new Error('PayPal API key not configured')
    }

    // In real implementation, call PayPal API
    await new Promise(resolve => setTimeout(resolve, 150))
    result.status = 'completed'
  }

  /**
   * Process Coinbase payment
   */
  private async processCoinbasePayment(
    request: PaymentRequest,
    result: PaymentResult
  ): Promise<void> {
    // In real implementation, call Coinbase API
    // Crypto payments may have different flow
    await new Promise(resolve => setTimeout(resolve, 200))
    result.status = 'pending' // Await blockchain confirmation
  }

  /**
   * Create subscription
   */
  createSubscription(
    userId: string,
    tier: SubscriptionTier,
    renewalIntervalDays: number = 30
  ): SubscriptionInfo {
    const renewalDate = new Date()
    renewalDate.setDate(renewalDate.getDate() + renewalIntervalDays)

    const subscription: SubscriptionInfo = {
      userId,
      tier,
      status: 'active',
      renewalDate
    }

    this.subscriptions.set(userId, subscription)
    return subscription
  }

  /**
   * Cancel subscription
   */
  cancelSubscription(userId: string): boolean {
    const subscription = this.subscriptions.get(userId)
    if (!subscription) return false

    subscription.status = 'cancelled'
    subscription.cancelledAt = new Date()
    return true
  }

  /**
   * Get subscription info
   */
  getSubscription(userId: string): SubscriptionInfo | undefined {
    return this.subscriptions.get(userId)
  }

  /**
   * Track usage
   */
  trackUsage(
    userId: string,
    metrics: Partial<UsageMetrics>
  ): void {
    const existing = this.usageMetrics.get(userId) || {
      userId,
      operationsExecuted: 0,
      compositionsRun: 0,
      storageUsedMb: 0,
      bandwidthUsedGb: 0,
      timestamp: new Date()
    }

    this.usageMetrics.set(userId, {
      ...existing,
      ...metrics,
      userId,
      timestamp: new Date()
    })
  }

  /**
   * Get usage for user
   */
  getUsage(userId: string): UsageMetrics | undefined {
    return this.usageMetrics.get(userId)
  }

  /**
   * Calculate overage charges
   */
  calculateOverageCharges(userId: string): number {
    const subscription = this.subscriptions.get(userId)
    const usage = this.usageMetrics.get(userId)

    if (!subscription || !usage) return 0

    // Tiered pricing (example)
    const limits = {
      free: { operations: 100, storage: 1, bandwidth: 0.1 },
      starter: { operations: 10000, storage: 10, bandwidth: 1 },
      professional: { operations: 1000000, storage: 100, bandwidth: 10 },
      enterprise: { operations: Infinity, storage: Infinity, bandwidth: Infinity }
    }

    const limit = limits[subscription.tier]
    let charges = 0

    if (usage.operationsExecuted > limit.operations) {
      charges += (usage.operationsExecuted - limit.operations) * 0.001 // $0.001 per extra operation
    }

    if (usage.storageUsedMb > limit.storage * 1024) {
      charges += (usage.storageUsedMb - limit.storage * 1024) * 0.01 // $0.01 per MB
    }

    if (usage.bandwidthUsedGb > limit.bandwidth) {
      charges += (usage.bandwidthUsedGb - limit.bandwidth) * 1.0 // $1 per GB
    }

    return charges
  }

  /**
   * Generate invoice
   */
  generateInvoice(userId: string): {
    userId: string
    subscriptionTier: string
    baseCharge: number
    overageCharges: number
    tax: number
    total: number
    period: { start: Date; end: Date }
  } {
    const subscription = this.subscriptions.get(userId)
    if (!subscription) {
      throw new Error(`No subscription found for user: ${userId}`)
    }

    const basePrices = {
      free: 0,
      starter: 29,
      professional: 99,
      enterprise: 299
    }

    const baseCharge = basePrices[subscription.tier]
    const overageCharges = this.calculateOverageCharges(userId)
    const subtotal = baseCharge + overageCharges
    const tax = subtotal * this.config.taxRate
    const total = subtotal + tax

    const periodEnd = new Date()
    const periodStart = new Date(periodEnd)
    periodStart.setDate(periodStart.getDate() - 30)

    return {
      userId,
      subscriptionTier: subscription.tier,
      baseCharge,
      overageCharges,
      tax,
      total,
      period: { start: periodStart, end: periodEnd }
    }
  }

  /**
   * Get transaction history
   */
  getTransactionHistory(userId: string, limit: number = 50): PaymentResult[] {
    return Array.from(this.transactions.values())
      .filter(t => t.id.includes(userId))
      .slice(-limit)
  }

  /**
   * Get payment status
   */
  getPaymentStatus(paymentId: string): PaymentStatus | undefined {
    return this.transactions.get(paymentId)?.status
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId: string): Promise<boolean> {
    const transaction = this.transactions.get(paymentId)
    if (!transaction || transaction.status !== 'completed') {
      return false
    }

    // Process refund with provider
    transaction.status = 'refunded'
    return true
  }
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

export const paymentProcessor = new PaymentProcessor({
  provider: 'test',
  currency: 'USD',
  taxRate: 0.08
})

/**
 * Process payment (global)
 */
export async function processPayment(request: PaymentRequest): Promise<PaymentResult> {
  return paymentProcessor.processPayment(request)
}

/**
 * Create subscription (global)
 */
export function createSubscription(
  userId: string,
  tier: SubscriptionTier
): SubscriptionInfo {
  return paymentProcessor.createSubscription(userId, tier)
}

export default {
  PaymentProcessor,
  paymentProcessor,
  processPayment,
  createSubscription
}
