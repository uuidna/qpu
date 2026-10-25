// WAVE 8D: Data Masking & Anonymization
// PII redaction, field masking, anonymization for non-authorized users

/**
 * Masking strategies
 */
export enum MaskingStrategy {
  REDACT = 'redact', // Replace with ***
  HASH = 'hash', // One-way hash
  PARTIAL = 'partial', // Show first/last N chars
  REPLACE = 'replace', // Replace with static value
  NONE = 'none' // No masking
}

/**
 * Anonymization technique
 */
export enum AnonymizationTechnique {
  GENERALIZATION = 'generalization', // Convert to less specific (age -> age range)
  SUPPRESSION = 'suppression', // Remove entirely
  PERTURBATION = 'perturbation', // Add random noise
  AGGREGATION = 'aggregation', // Show only statistics
  PSEUDONYMIZATION = 'pseudonymization' // Replace with pseudo ID
}

/**
 * Masking rule
 */
export interface MaskingRule {
  fieldName: string
  strategy: MaskingStrategy
  showCharacters?: number // For PARTIAL strategy
  replaceValue?: string // For REPLACE strategy
  hashAlgorithm?: string // For HASH strategy (default: sha256)
}

/**
 * Anonymization rule
 */
export interface AnonymizationRule {
  fieldName: string
  technique: AnonymizationTechnique
  parameters?: Record<string, any>
  // For GENERALIZATION: { ranges: [{ min, max, label }] }
  // For PSEUDONYMIZATION: { mapping: {} }
  // For PERTURBATION: { variance: 0.1 }
  // For AGGREGATION: { groupBy: 'day' }
}

/**
 * PII type definitions
 */
export enum PIIType {
  EMAIL = 'email',
  PHONE = 'phone',
  SSN = 'ssn',
  CREDIT_CARD = 'credit_card',
  PASSPORT = 'passport',
  DRIVER_LICENSE = 'driver_license',
  HEALTH_RECORD = 'health_record',
  LOCATION = 'location',
  BIOMETRIC = 'biometric',
  CUSTOM = 'custom'
}

/**
 * Data Masking Service
 */
export class DataMaskingService {
  private maskingRules: Map<string, MaskingRule> = new Map()
  private anonymizationRules: Map<string, AnonymizationRule> = new Map()
  private piiPatterns: Map<PIIType, RegExp> = new Map()
  private pseudonymizationMappings: Map<string, Map<string, string>> = new Map()

  constructor() {
    this.initializePIIPatterns()
  }

  /**
   * Initialize PII detection patterns
   */
  private initializePIIPatterns(): void {
    // Email pattern
    this.piiPatterns.set(
      PIIType.EMAIL,
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    )

    // Phone pattern (US format)
    this.piiPatterns.set(
      PIIType.PHONE,
      /(\+1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/
    )

    // SSN pattern
    this.piiPatterns.set(
      PIIType.SSN,
      /\b\d{3}-\d{2}-\d{4}\b/
    )

    // Credit card pattern
    this.piiPatterns.set(
      PIIType.CREDIT_CARD,
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/
    )

    // Passport pattern
    this.piiPatterns.set(
      PIIType.PASSPORT,
      /\b[A-Z]{2}\d{7}\b/
    )

    // Driver license pattern
    this.piiPatterns.set(
      PIIType.DRIVER_LICENSE,
      /\b[A-Z]{1,2}\d{5,7}\b/
    )
  }

  /**
   * Define masking rule
   */
  defineMaskingRule(rule: MaskingRule): void {
    this.maskingRules.set(rule.fieldName, rule)
  }

  /**
   * Define anonymization rule
   */
  defineAnonymizationRule(rule: AnonymizationRule): void {
    this.anonymizationRules.set(rule.fieldName, rule)
  }

  /**
   * Mask field value
   */
  maskField(fieldName: string, value: any): any {
    if (value === null || value === undefined) return value

    const rule = this.maskingRules.get(fieldName)
    if (!rule) return value

    return this.applyMaskingStrategy(value, rule)
  }

  /**
   * Apply masking strategy
   */
  private applyMaskingStrategy(value: any, rule: MaskingRule): any {
    const stringValue = String(value)

    switch (rule.strategy) {
      case MaskingStrategy.REDACT:
        return '***'

      case MaskingStrategy.HASH:
        const { createHash } = require('crypto')
        const algorithm = rule.hashAlgorithm || 'sha256'
        return createHash(algorithm).update(stringValue).digest('hex').substring(0, 16)

      case MaskingStrategy.PARTIAL:
        const showChars = rule.showCharacters || 4
        if (stringValue.length <= showChars) return '***'
        return stringValue.substring(0, showChars) + '***'

      case MaskingStrategy.REPLACE:
        return rule.replaceValue || '[REDACTED]'

      case MaskingStrategy.NONE:
        return value

      default:
        return value
    }
  }

  /**
   * Mask entire object/record
   */
  maskRecord(recordName: string, data: Record<string, any>): Record<string, any> {
    const masked: Record<string, any> = {}

    for (const [key, value] of Object.entries(data)) {
      const fieldName = `${recordName}.${key}`
      const rule = this.maskingRules.get(key) || this.maskingRules.get(fieldName)

      if (rule) {
        masked[key] = this.applyMaskingStrategy(value, rule)
      } else {
        masked[key] = value
      }
    }

    return masked
  }

  /**
   * Detect PII in text
   */
  detectPII(text: string): Array<{ type: PIIType; value: string; position: number }> {
    const findings: Array<{ type: PIIType; value: string; position: number }> = []

    for (const [piiType, pattern] of this.piiPatterns) {
      let match
      const regex = new RegExp(pattern, 'g')

      while ((match = regex.exec(text)) !== null) {
        findings.push({
          type: piiType,
          value: match[0],
          position: match.index
        })
      }
    }

    return findings
  }

  /**
   * Redact PII from text
   */
  redactPII(text: string, replacement: string = '[REDACTED]'): string {
    let result = text

    for (const [, pattern] of this.piiPatterns) {
      result = result.replace(new RegExp(pattern, 'g'), replacement)
    }

    return result
  }

  /**
   * Anonymize field value
   */
  anonymizeField(fieldName: string, value: any): any {
    const rule = this.anonymizationRules.get(fieldName)
    if (!rule) return value

    return this.applyAnonymizationTechnique(value, rule)
  }

  /**
   * Apply anonymization technique
   */
  private applyAnonymizationTechnique(value: any, rule: AnonymizationRule): any {
    switch (rule.technique) {
      case AnonymizationTechnique.GENERALIZATION:
        return this.generalize(value, rule.parameters)

      case AnonymizationTechnique.SUPPRESSION:
        return '[SUPPRESSED]'

      case AnonymizationTechnique.PERTURBATION:
        return this.perturb(value, rule.parameters)

      case AnonymizationTechnique.AGGREGATION:
        return `${rule.parameters?.aggregationType || 'statistical'} aggregation`

      case AnonymizationTechnique.PSEUDONYMIZATION:
        return this.pseudonymize(value, rule)

      default:
        return value
    }
  }

  /**
   * Generalization: Convert to less specific value
   */
  private generalize(value: any, parameters?: Record<string, any>): string {
    if (typeof value === 'number' && parameters?.ranges) {
      const range = parameters.ranges.find((r: any) => value >= r.min && value < r.max)
      return range ? range.label : '[OUT_OF_RANGE]'
    }

    if (value instanceof Date && parameters?.granularity) {
      switch (parameters.granularity) {
        case 'year':
          return value.getFullYear().toString()
        case 'month':
          return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}`
        case 'quarter':
          const quarter = Math.ceil((value.getMonth() + 1) / 3)
          return `${value.getFullYear()}-Q${quarter}`
        default:
          return value.toISOString().split('T')[0]
      }
    }

    return String(value)
  }

  /**
   * Perturbation: Add random noise
   */
  private perturb(value: any, parameters?: Record<string, any>): any {
    if (typeof value === 'number') {
      const variance = parameters?.variance || 0.1
      const noise = value * variance * (Math.random() - 0.5) * 2
      return Math.round((value + noise) * 100) / 100
    }

    return value
  }

  /**
   * Pseudonymization: Replace with pseudo ID
   */
  private pseudonymize(value: any, rule: AnonymizationRule): string {
    const mapping = this.pseudonymizationMappings.get(rule.fieldName) || new Map()
    const stringValue = String(value)

    if (!mapping.has(stringValue)) {
      const pseudoId = `PSEUDO_${Date.now()}_${Math.random().toString(36).substring(7)}`
      mapping.set(stringValue, pseudoId)
      this.pseudonymizationMappings.set(rule.fieldName, mapping)
    }

    return mapping.get(stringValue)!
  }

  /**
   * Anonymize entire dataset
   */
  anonymizeDataset(records: Record<string, any>[], mappings?: Map<string, AnonymizationRule>): Record<string, any>[] {
    return records.map((record) => {
      const anonymized: Record<string, any> = {}

      for (const [key, value] of Object.entries(record)) {
        const rule = mappings?.get(key) || this.anonymizationRules.get(key)

        if (rule) {
          anonymized[key] = this.applyAnonymizationTechnique(value, rule)
        } else {
          anonymized[key] = value
        }
      }

      return anonymized
    })
  }

  /**
   * Check k-anonymity (minimum group size for quasi-identifiers)
   */
  checkKAnonymity(
    records: Record<string, any>[],
    quasiIdentifiers: string[],
    minK: number = 5
  ): { kValue: number; isKAnonymous: boolean; vulnerableGroups: number } {
    const groupMap = new Map<string, number>()

    for (const record of records) {
      const key = quasiIdentifiers.map((id) => record[id]).join('|')
      groupMap.set(key, (groupMap.get(key) || 0) + 1)
    }

    const kValue = Math.min(...Array.from(groupMap.values()))
    const vulnerableGroups = Array.from(groupMap.values()).filter((count) => count < minK).length

    return {
      kValue,
      isKAnonymous: kValue >= minK,
      vulnerableGroups
    }
  }

  /**
   * Check l-diversity (diversity in sensitive attributes)
   */
  checkLDiversity(
    records: Record<string, any>[],
    quasiIdentifiers: string[],
    sensitiveAttribute: string,
    minL: number = 2
  ): { lValue: number; isLDiverse: boolean } {
    const groupMap = new Map<string, Set<any>>()

    for (const record of records) {
      const key = quasiIdentifiers.map((id) => record[id]).join('|')
      if (!groupMap.has(key)) {
        groupMap.set(key, new Set())
      }
      groupMap.get(key)!.add(record[sensitiveAttribute])
    }

    const lValue = Math.min(...Array.from(groupMap.values()).map((set) => set.size))

    return {
      lValue,
      isLDiverse: lValue >= minL
    }
  }

  /**
   * Export masking configuration
   */
  exportConfiguration(): {
    maskingRules: Record<string, MaskingRule>
    anonymizationRules: Record<string, AnonymizationRule>
  } {
    const maskingRulesObj: Record<string, MaskingRule> = {}
    const anonymizationRulesObj: Record<string, AnonymizationRule> = {}

    for (const [key, rule] of this.maskingRules) {
      maskingRulesObj[key] = rule
    }

    for (const [key, rule] of this.anonymizationRules) {
      anonymizationRulesObj[key] = rule
    }

    return {
      maskingRules: maskingRulesObj,
      anonymizationRules: anonymizationRulesObj
    }
  }
}

/**
 * Create global data masking service
 */
export const dataMaskingService = new DataMaskingService()
