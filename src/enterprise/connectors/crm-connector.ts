/**
 * CRM Connector - Unified interface for Salesforce, HubSpot, Pipedrive
 * Syncs leads, contacts, opportunities, and customer data
 */

import { BaseConnector, type ConnectorConfig, type SyncResult } from './base-connector.js'

// ============================================================================
// CRM DATA MODELS
// ============================================================================

export interface CRMContact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  industry?: string
  leadScore?: number
  createdAt: number
  updatedAt: number
  customFields?: Record<string, unknown>
}

export interface CRMOpportunity {
  id: string
  name: string
  contactId: string
  value: number
  stage: string
  probability: number
  expectedCloseDate: number
  createdAt: number
  updatedAt: number
}

export interface CRMActivity {
  id: string
  type: 'email' | 'call' | 'meeting' | 'note'
  contactId: string
  subject: string
  description?: string
  date: number
  metadata?: Record<string, unknown>
}

export interface CRMSyncConfig extends ConnectorConfig {
  type: 'crm'
  crmType: 'salesforce' | 'hubspot' | 'pipedrive' | 'custom'
  syncEntities: ('contacts' | 'opportunities' | 'activities' | 'companies')[]
  incrementalSync: boolean
  lastSyncTimestamp?: number
}

// ============================================================================
// CRM CONNECTOR
// ============================================================================

export abstract class CRMConnector extends BaseConnector {
  protected crmConfig: CRMSyncConfig
  private contacts: Map<string, CRMContact> = new Map()
  private opportunities: Map<string, CRMOpportunity> = new Map()
  private activities: Map<string, CRMActivity> = new Map()

  constructor(config: CRMSyncConfig) {
    super(config)
    this.crmConfig = config
  }

  /**
   * Get contacts from CRM
   */
  async getContacts(filter?: { company?: string; industry?: string }): Promise<CRMContact[]> {
    const contacts = await this.executeRequest<CRMContact[]>(
      'GET',
      '/contacts',
      filter as Record<string, unknown>,
      { useCache: true, cacheTTL: 300000 } // 5 min cache
    )

    // Store locally
    for (const contact of contacts) {
      this.contacts.set(contact.id, contact)
    }

    return contacts
  }

  /**
   * Get opportunities from CRM
   */
  async getOpportunities(filter?: { stage?: string; minValue?: number }): Promise<CRMOpportunity[]> {
    const opportunities = await this.executeRequest<CRMOpportunity[]>(
      'GET',
      '/opportunities',
      filter as Record<string, unknown>,
      { useCache: true, cacheTTL: 300000 }
    )

    for (const opp of opportunities) {
      this.opportunities.set(opp.id, opp)
    }

    return opportunities
  }

  /**
   * Get contact details
   */
  async getContact(contactId: string): Promise<CRMContact | undefined> {
    // Check local cache first
    if (this.contacts.has(contactId)) {
      return this.contacts.get(contactId)
    }

    try {
      const contact = await this.executeRequest<CRMContact>(
        'GET',
        `/contacts/${contactId}`,
        undefined,
        { useCache: true, cacheTTL: 600000 } // 10 min cache
      )

      this.contacts.set(contactId, contact)
      return contact
    } catch (error) {
      return undefined
    }
  }

  /**
   * Create or update contact
   */
  async upsertContact(contact: Partial<CRMContact>): Promise<CRMContact> {
    const result = await this.executeRequest<CRMContact>(
      contact.id ? 'PATCH' : 'POST',
      contact.id ? `/contacts/${contact.id}` : '/contacts',
      contact as Record<string, unknown>
    )

    this.contacts.set(result.id, result)
    return result
  }

  /**
   * Get recent activities
   */
  async getActivities(contactId?: string, limit = 100): Promise<CRMActivity[]> {
    const path = contactId ? `/contacts/${contactId}/activities` : '/activities'
    const activities = await this.executeRequest<CRMActivity[]>(
      'GET',
      path,
      { limit },
      { useCache: true, cacheTTL: 120000 } // 2 min cache
    )

    for (const activity of activities) {
      this.activities.set(activity.id, activity)
    }

    return activities
  }

  /**
   * Log activity
   */
  async logActivity(activity: Omit<CRMActivity, 'id' | 'createdAt'>): Promise<CRMActivity> {
    return this.executeRequest<CRMActivity>(
      'POST',
      '/activities',
      activity as Record<string, unknown>
    )
  }

  /**
   * Perform full sync
   */
  protected async performSync(): Promise<Omit<SyncResult, 'duration'>> {
    const startTime = Date.now()
    const results: Omit<SyncResult, 'duration'> = {
      status: 'success',
      recordsProcessed: 0,
      recordsFailed: 0
    }

    try {
      // Sync contacts
      if (this.crmConfig.syncEntities.includes('contacts')) {
        try {
          const contacts = await this.getContacts()
          results.recordsProcessed += contacts.length
        } catch (error) {
          results.recordsFailed++
          results.status = 'partial'
        }
      }

      // Sync opportunities
      if (this.crmConfig.syncEntities.includes('opportunities')) {
        try {
          const opportunities = await this.getOpportunities()
          results.recordsProcessed += opportunities.length
        } catch (error) {
          results.recordsFailed++
          results.status = 'partial'
        }
      }

      // Sync activities
      if (this.crmConfig.syncEntities.includes('activities')) {
        try {
          const activities = await this.getActivities()
          results.recordsProcessed += activities.length
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
   * Get local cache stats
   */
  getCacheStats() {
    return {
      contacts: this.contacts.size,
      opportunities: this.opportunities.size,
      activities: this.activities.size
    }
  }
}

// ============================================================================
// SALESFORCE CONNECTOR
// ============================================================================

export class SalesforceConnector extends CRMConnector {
  protected async authenticate(): Promise<void> {
    const clientId = this.config.credentials['clientId']
    const clientSecret = this.config.credentials['clientSecret']
    const instanceUrl = this.config.baseUrl

    if (!clientId || !clientSecret || !instanceUrl) {
      throw new Error('Missing Salesforce credentials')
    }

    // In real implementation, exchange credentials for OAuth token
    // For now, store for later use
    this.isAuthenticated = true
  }

  protected async validateConnection(): Promise<void> {
    // Query Salesforce API to validate
    await this.executeRequest<{ version: string }>(
      'GET',
      '/services/data/v58.0'
    )
  }

  protected async performRequest<T>(
    method: string,
    path: string,
    data?: Record<string, unknown>
  ): Promise<T> {
    // Mock implementation - in real code, make actual HTTP requests
    if (method === 'GET' && path.includes('/contacts')) {
      return [{
        id: 'SF001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        company: 'Acme Inc',
        industry: 'Technology',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }] as unknown as T
    }

    return {} as T
  }
}

// ============================================================================
// HUBSPOT CONNECTOR
// ============================================================================

export class HubSpotConnector extends CRMConnector {
  protected async authenticate(): Promise<void> {
    const apiKey = this.config.credentials['apiKey']
    if (!apiKey) {
      throw new Error('Missing HubSpot API key')
    }
    this.isAuthenticated = true
  }

  protected async validateConnection(): Promise<void> {
    await this.executeRequest<{ integrator: { name: string } }>(
      'GET',
      '/crm/v3/objects/contacts'
    )
  }

  protected async performRequest<T>(
    method: string,
    path: string,
    data?: Record<string, unknown>
  ): Promise<T> {
    // Mock implementation
    if (method === 'GET' && path.includes('/contacts')) {
      return [{
        id: 'HS001',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        company: 'TechCorp',
        industry: 'SaaS',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }] as unknown as T
    }

    return {} as T
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createCRMConnector(config: CRMSyncConfig): CRMConnector {
  switch (config.crmType) {
    case 'salesforce':
      return new SalesforceConnector(config)
    case 'hubspot':
      return new HubSpotConnector(config)
    default:
      throw new Error(`Unsupported CRM type: ${config.crmType}`)
  }
}
