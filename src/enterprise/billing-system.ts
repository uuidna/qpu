/**
 * Enterprise Billing & Payment System
 * Handles licensing fees, prize earnings, and payouts
 */

export interface Invoice {
  id: string;
  organizationId: string;
  amount: number;
  description: string;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  lineItems: LineItem[];
}

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  id: string;
  organizationId: string;
  amount: number;
  method: 'card' | 'bank' | 'crypto';
  status: 'completed';
  transactionId: string;
  timestamp: Date;
}

export interface Payout {
  id: string;
  organizationId: string;
  amount: number;
  currency: 'USD' | 'BTC' | 'ETH';
  destination: string;
  status: 'pending' | 'completed';
  requestedAt: Date;
  completedAt?: Date;
}

export class BillingSystem {
  private invoices: Map<string, Invoice[]> = new Map();
  private payments: Map<string, Payment[]> = new Map();
  private payouts: Map<string, Payout[]> = new Map();
  private monthlyEarnings: Map<string, number> = new Map();

  generateInvoice(organizationId: string, monthlyPrice: number, month: Date): Invoice {
    const invoiceId = `inv_${Date.now()}`;
    const invoice: Invoice = {
      id: invoiceId,
      organizationId,
      amount: monthlyPrice,
      description: `Monthly license - ${month.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
      issueDate: new Date(),
      dueDate: new Date(month.getTime() + 30 * 24 * 60 * 60 * 1000),
      status: 'draft',
      lineItems: [{
        description: 'Quantum problem solver license',
        quantity: 1,
        unitPrice: monthlyPrice,
        total: monthlyPrice
      }]
    };

    const orgInvoices = this.invoices.get(organizationId) || [];
    orgInvoices.push(invoice);
    this.invoices.set(organizationId, orgInvoices);
    return invoice;
  }

  processPayment(organizationId: string, invoiceId: string, amount: number, method: 'card' | 'bank' | 'crypto') {
    const payment: Payment = {
      id: `pay_${Date.now()}`,
      organizationId,
      amount,
      method,
      status: 'completed',
      transactionId: `txn_${Date.now()}`,
      timestamp: new Date()
    };

    const orgPayments = this.payments.get(organizationId) || [];
    orgPayments.push(payment);
    this.payments.set(organizationId, orgPayments);
    return payment;
  }

  recordEarning(organizationId: string, amount: number): void {
    const current = this.monthlyEarnings.get(organizationId) || 0;
    this.monthlyEarnings.set(organizationId, current + amount);
  }

  requestPayout(organizationId: string, amount: number, currency: 'USD' | 'BTC' | 'ETH', destination: string) {
    const earnings = this.monthlyEarnings.get(organizationId) || 0;
    if (amount > earnings) return null;

    const payout: Payout = {
      id: `payout_${Date.now()}`,
      organizationId,
      amount,
      currency,
      destination,
      status: 'pending',
      requestedAt: new Date()
    };

    const orgPayouts = this.payouts.get(organizationId) || [];
    orgPayouts.push(payout);
    this.payouts.set(organizationId, orgPayouts);
    return payout;
  }

  getMetrics() {
    let totalEarnings = 0;
    for (const earnings of this.monthlyEarnings.values()) {
      totalEarnings += earnings;
    }
    return { totalEarnings, organizationCount: this.invoices.size };
  }
}

export default BillingSystem;
