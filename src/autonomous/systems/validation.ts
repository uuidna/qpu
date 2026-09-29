/**
 * Autonomous Validation System
 * Data integrity checks, auto-repair, consistency enforcement
 */

import type { Payload } from 'payload'

export interface ValidationIssue {
  collection: string
  recordId: string
  field: string
  issue: string
  severity: 'info' | 'warning' | 'critical'
  autoRepairable: boolean
  repairStrategy?: string
}

export interface ValidationResult {
  totalRecords: number
  issuesFound: number
  issuesRepaired: number
  criticalIssues: number
  collections: {
    name: string
    recordCount: number
    issues: ValidationIssue[]
  }[]
}

export class ValidationSystem {
  private payload: Payload
  private validationHistory: ValidationResult[] = []
  private repairLog: { timestamp: Date; action: string; status: string }[] = []

  constructor(payload: Payload) {
    this.payload = payload
  }

  /**
   * Execute validation wave
   */
  async executeWave(): Promise<{
    improvements: any[]
    validationResults: ValidationResult
  }> {
    const validationResults = await this.validateAllCollections()

    // Auto-repair safe issues
    let repaired = 0
    for (const collection of validationResults.collections) {
      for (const issue of collection.issues) {
        if (issue.autoRepairable && issue.severity !== 'critical') {
          const fixed = await this.repairIssue(issue)
          if (fixed) repaired++
        }
      }
    }

    // Generate improvements
    const improvements = [
      {
        system: 'validation',
        metric: 'data_integrity_repairs',
        before: validationResults.issuesFound,
        after: Math.max(0, validationResults.issuesFound - repaired),
        gain: repaired,
        formula: 'auto_repair'
      }
    ]

    validationResults.issuesRepaired = repaired
    this.validationHistory.push(validationResults)

    return { improvements, validationResults }
  }

  /**
   * Validate all collections
   */
  private async validateAllCollections(): Promise<ValidationResult> {
    const collections = ['users', 'support-tickets', 'audit-logs', 'enrollments', 'metrics']
    const collectionResults = []
    let totalRecords = 0
    let totalIssues = 0
    let criticalIssues = 0

    for (const collName of collections) {
      try {
        const result = await this.payload.find({ collection: collName as any })
        const docs = result.docs || []
        const issues: ValidationIssue[] = []

        // Validate each record
        for (const doc of docs) {
          const recordIssues = await this.validateRecord(collName, doc)
          issues.push(...recordIssues)

          if (recordIssues.some(i => i.severity === 'critical')) {
            criticalIssues += recordIssues.filter(i => i.severity === 'critical').length
          }
        }

        totalRecords += docs.length
        totalIssues += issues.length

        collectionResults.push({
          name: collName,
          recordCount: docs.length,
          issues
        })
      } catch (error) {
        console.error(`Error validating ${collName}:`, error)
      }
    }

    return {
      totalRecords,
      issuesFound: totalIssues,
      issuesRepaired: 0,
      criticalIssues,
      collections: collectionResults
    }
  }

  /**
   * Validate a single record
   */
  private async validateRecord(collection: string, record: any): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = []

    // Check required fields
    const requiredFields = this.getRequiredFields(collection)
    for (const field of requiredFields) {
      if (!record[field]) {
        issues.push({
          collection,
          recordId: record.id,
          field,
          issue: `Missing required field: ${field}`,
          severity: 'warning',
          autoRepairable: true,
          repairStrategy: 'populate_default'
        })
      }
    }

    // Check field types
    if (record.status && !this.isValidEnum(collection, 'status', record.status)) {
      issues.push({
        collection,
        recordId: record.id,
        field: 'status',
        issue: `Invalid enum value: ${record.status}`,
        severity: 'warning',
        autoRepairable: true,
        repairStrategy: 'set_to_default'
      })
    }

    // Check timestamps
    if (record.createdAt && record.updatedAt) {
      if (new Date(record.createdAt) > new Date(record.updatedAt)) {
        issues.push({
          collection,
          recordId: record.id,
          field: 'timestamps',
          issue: 'createdAt is after updatedAt',
          severity: 'warning',
          autoRepairable: true,
          repairStrategy: 'fix_timestamps'
        })
      }
    }

    // Check relationships
    if (collection === 'support-tickets' && record.assignee) {
      const user = await this.findRecord('users', record.assignee)
      if (!user) {
        issues.push({
          collection,
          recordId: record.id,
          field: 'assignee',
          issue: `Broken relationship: user ${record.assignee} not found`,
          severity: 'critical',
          autoRepairable: false
        })
      }
    }

    return issues
  }

  /**
   * Repair an issue
   */
  private async repairIssue(issue: ValidationIssue): Promise<boolean> {
    try {
      switch (issue.repairStrategy) {
        case 'populate_default': {
          // Set default value
          await this.updateRecord(issue.collection, issue.recordId, {
            [issue.field]: this.getDefaultValue(issue.collection, issue.field)
          })
          this.logRepair(issue, 'success')
          return true
        }

        case 'set_to_default': {
          // Set to enum default
          await this.updateRecord(issue.collection, issue.recordId, {
            [issue.field]: this.getEnumDefault(issue.collection, issue.field)
          })
          this.logRepair(issue, 'success')
          return true
        }

        case 'fix_timestamps': {
          // Fix timestamp ordering
          await this.updateRecord(issue.collection, issue.recordId, {
            updatedAt: new Date()
          })
          this.logRepair(issue, 'success')
          return true
        }

        default:
          return false
      }
    } catch (error) {
      console.error(`Failed to repair ${issue.collection}:${issue.recordId}:`, error)
      this.logRepair(issue, 'failed')
      return false
    }
  }

  /**
   * Get required fields for collection
   */
  private getRequiredFields(collection: string): string[] {
    const schema: Record<string, string[]> = {
      users: ['email', 'name', 'role'],
      'support-tickets': ['title', 'status'],
      'audit-logs': ['collection', 'action'],
      enrollments: ['user', 'course'],
      metrics: ['name', 'value']
    }
    return schema[collection] || []
  }

  /**
   * Check if valid enum value
   */
  private isValidEnum(collection: string, field: string, value: string): boolean {
    const enums: Record<string, Record<string, string[]>> = {
      users: { role: ['admin', 'support', 'auditor', 'trainer', 'user'] },
      'support-tickets': { status: ['open', 'in_progress', 'resolved', 'closed'] },
      'audit-logs': { action: ['create', 'read', 'update', 'delete'] },
      metrics: { type: ['system', 'performance', 'business'] }
    }

    const validValues = enums[collection]?.[field] || []
    return validValues.includes(value)
  }

  /**
   * Get default value for field
   */
  private getDefaultValue(collection: string, field: string): any {
    const defaults: Record<string, Record<string, any>> = {
      users: { email: 'unset@example.com', name: 'Unknown', role: 'user' },
      'support-tickets': { title: 'Untitled', status: 'open' },
      'audit-logs': { collection: 'unknown', action: 'read' },
      enrollments: { status: 'active' },
      metrics: { value: 0 }
    }

    return defaults[collection]?.[field] || null
  }

  /**
   * Get enum default for field
   */
  private getEnumDefault(collection: string, field: string): string {
    const defaults: Record<string, Record<string, string>> = {
      users: { role: 'user' },
      'support-tickets': { status: 'open' },
      'audit-logs': { action: 'read' },
      metrics: { type: 'system' }
    }

    return defaults[collection]?.[field] || 'unknown'
  }

  /**
   * Helper: Find record by ID
   */
  private async findRecord(collection: string, id: string): Promise<any> {
    try {
      return await this.payload.findByID({
        collection: collection as any,
        id
      })
    } catch {
      return null
    }
  }

  /**
   * Helper: Update record
   */
  private async updateRecord(collection: string, id: string, data: Record<string, any>): Promise<void> {
    try {
      await this.payload.update({
        collection: collection as any,
        id,
        data
      })
    } catch (error) {
      console.error(`Failed to update ${collection}:${id}:`, error)
    }
  }

  /**
   * Log repair action
   */
  private logRepair(issue: ValidationIssue, status: string): void {
    this.repairLog.push({
      timestamp: new Date(),
      action: `${issue.repairStrategy} on ${issue.collection}:${issue.field}`,
      status
    })
  }

  /**
   * Get validation history
   */
  getValidationHistory(limit: number = 10): ValidationResult[] {
    return this.validationHistory.slice(-limit)
  }

  /**
   * Get repair log
   */
  getRepairLog(limit: number = 20): any[] {
    return this.repairLog.slice(-limit)
  }
}

export async function createValidationSystem(payload: Payload): Promise<ValidationSystem> {
  return new ValidationSystem(payload)
}
