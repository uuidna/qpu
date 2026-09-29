/**
 * Schema Validator
 * Validates operation inputs against runtime schemas
 * Prevents invalid operations before execution
 */

import { listOperations, getOperation } from '../core/index.js'

// ============================================================================
// SCHEMA TYPES
// ============================================================================

export type SchemaType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any'

export interface FieldSchema {
  type: SchemaType
  required?: boolean
  description?: string
  minLength?: number
  maxLength?: number
  pattern?: string
  items?: FieldSchema // for arrays
  properties?: Record<string, FieldSchema> // for objects
}

export interface OperationSchema {
  operation: string
  description: string
  inputs?: Record<string, FieldSchema>
  outputs?: Record<string, FieldSchema>
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

// ============================================================================
// SCHEMA VALIDATOR
// ============================================================================

export class SchemaValidator {
  private schemas: Map<string, OperationSchema> = new Map()

  constructor() {
    this.initializeSchemas()
  }

  /**
   * Initialize default schemas for all operations
   */
  private initializeSchemas(): void {
    // Clay problems
    this.registerSchema({
      operation: 'solve-p-vs-np',
      description: 'Solve P vs NP problem',
      inputs: {},
      outputs: {
        problem: { type: 'string' },
        solved: { type: 'boolean' }
      }
    })

    // Citations
    this.registerSchema({
      operation: 'get-cryptography-citations',
      description: 'Get cryptography domain citations',
      inputs: {},
      outputs: {
        domain: { type: 'string' },
        works: { type: 'number' }
      }
    })

    // Encryption
    this.registerSchema({
      operation: 'encrypt-with-referrer',
      description: 'Encrypt data using referrer',
      inputs: {
        data: { type: 'string', required: true },
        referrer: { type: 'string', required: true }
      },
      outputs: {
        encrypted: { type: 'boolean' },
        algorithm: { type: 'string' }
      }
    })

    // Analytics
    this.registerSchema({
      operation: 'record-lead',
      description: 'Record a lead',
      inputs: {
        source: { type: 'string', required: true },
        metadata: { type: 'object', required: false }
      },
      outputs: {
        recorded: { type: 'boolean' },
        leadId: { type: 'string' }
      }
    })

    // System
    this.registerSchema({
      operation: 'health-check',
      description: 'Check system health',
      inputs: {},
      outputs: {
        healthy: { type: 'boolean' },
        uptime: { type: 'number' }
      }
    })
  }

  /**
   * Register a schema for an operation
   */
  registerSchema(schema: OperationSchema): void {
    this.schemas.set(schema.operation, schema)
  }

  /**
   * Get schema for operation
   */
  getSchema(operation: string): OperationSchema | undefined {
    return this.schemas.get(operation)
  }

  /**
   * Validate inputs against operation schema
   */
  validate(operation: string, inputs: Record<string, unknown>): ValidationResult {
    const schema = this.getSchema(operation)
    if (!schema || !schema.inputs) {
      return { valid: true, errors: [], warnings: [] }
    }

    const errors: string[] = []
    const warnings: string[] = []

    // Check required fields
    for (const [fieldName, fieldSchema] of Object.entries(schema.inputs)) {
      if (fieldSchema.required && !(fieldName in inputs)) {
        errors.push(`Required field missing: ${fieldName}`)
      }

      if (fieldName in inputs) {
        const value = inputs[fieldName]
        const fieldErrors = this.validateField(fieldName, value, fieldSchema)
        errors.push(...fieldErrors)
      }
    }

    // Check for unknown fields
    for (const fieldName of Object.keys(inputs)) {
      if (!(fieldName in schema.inputs)) {
        warnings.push(`Unknown field: ${fieldName}`)
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Validate a single field
   */
  private validateField(name: string, value: unknown, schema: FieldSchema): string[] {
    const errors: string[] = []

    // Check type
    const actualType = Array.isArray(value) ? 'array' : typeof value
    if (actualType !== schema.type && schema.type !== 'any') {
      errors.push(`Field "${name}": expected ${schema.type}, got ${actualType}`)
      return errors
    }

    // Type-specific validation
    if (schema.type === 'string' && typeof value === 'string') {
      if (schema.minLength && value.length < schema.minLength) {
        errors.push(`Field "${name}": string too short (${value.length} < ${schema.minLength})`)
      }
      if (schema.maxLength && value.length > schema.maxLength) {
        errors.push(`Field "${name}": string too long (${value.length} > ${schema.maxLength})`)
      }
      if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
        errors.push(`Field "${name}": does not match pattern ${schema.pattern}`)
      }
    }

    if (schema.type === 'array' && Array.isArray(value)) {
      if (schema.items) {
        for (let i = 0; i < value.length; i++) {
          const itemErrors = this.validateField(`${name}[${i}]`, value[i], schema.items)
          errors.push(...itemErrors)
        }
      }
    }

    if (schema.type === 'object' && typeof value === 'object' && value !== null) {
      if (schema.properties) {
        for (const [propName, propSchema] of Object.entries(schema.properties)) {
          if (propName in value) {
            const propErrors = this.validateField(
              `${name}.${propName}`,
              (value as Record<string, unknown>)[propName],
              propSchema
            )
            errors.push(...propErrors)
          }
        }
      }
    }

    return errors
  }

  /**
   * List all registered schemas
   */
  listSchemas(): OperationSchema[] {
    return Array.from(this.schemas.values())
  }

  /**
   * Generate TypeScript types from schemas
   */
  generateTypes(): string {
    const lines: string[] = ['// Generated operation input/output types\n']

    for (const schema of this.listSchemas()) {
      lines.push(`export interface ${this.toPascalCase(schema.operation)}Inputs {`)
      if (schema.inputs) {
        for (const [fieldName, fieldSchema] of Object.entries(schema.inputs)) {
          const tsType = this.schemaToTsType(fieldSchema)
          const optional = fieldSchema.required === false ? '?' : ''
          lines.push(`  ${fieldName}${optional}: ${tsType}`)
        }
      }
      lines.push('}')
      lines.push('')
    }

    return lines.join('\n')
  }

  /**
   * Convert schema field to TypeScript type
   */
  private schemaToTsType(schema: FieldSchema): string {
    switch (schema.type) {
      case 'string':
        return 'string'
      case 'number':
        return 'number'
      case 'boolean':
        return 'boolean'
      case 'array':
        return schema.items ? `${this.schemaToTsType(schema.items)}[]` : 'unknown[]'
      case 'object':
        return 'Record<string, unknown>'
      default:
        return 'unknown'
    }
  }

  /**
   * Convert snake_case to PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

export const schemaValidator = new SchemaValidator()

/**
 * Validate operation inputs (global)
 */
export function validateOperation(
  operation: string,
  inputs: Record<string, unknown>
): ValidationResult {
  return schemaValidator.validate(operation, inputs)
}

/**
 * Get operation schema (global)
 */
export function getOperationSchema(operation: string): OperationSchema | undefined {
  return schemaValidator.getSchema(operation)
}

export default {
  SchemaValidator,
  schemaValidator,
  validateOperation,
  getOperationSchema
}
