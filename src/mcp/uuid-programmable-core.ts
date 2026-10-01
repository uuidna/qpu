/**
 * UUID-Programmable MCP Core
 * All logic consolidated into combinatorial operations indexed by UUID
 * Everything is composable, addressable, and unified through MCP
 */

import { v4 as uuidv4, parse as parseUuid } from 'uuid'
import { MCP_OPERATIONS } from './operations-metadata.js'

// ============================================================================
// UUID COMBINATORIAL INDEXING
// ============================================================================

export interface UUIDOperation {
  uuid: string
  domain: string
  operation: string
  inputs: Record<string, unknown>
  metadata: OperationMetadata
}

export interface OperationMetadata {
  createdAt: Date
  version: string
  tags: string[]
  dependencies: string[] // UUIDs of operations this depends on
  permissions: string[]
  owner: string
}

export interface CombinatorialProgram {
  uuid: string
  operations: UUIDOperation[]
  composition: CompositionRule[]
  executionPlan: ExecutionStep[]
}

export interface CompositionRule {
  fromUUID: string
  toUUID: string
  dataFlow: string
  transformation?: string
}

export interface ExecutionStep {
  stepIndex: number
  operationUUID: string
  inputs: Record<string, unknown>
  outputs?: Record<string, unknown>
  status: 'pending' | 'running' | 'completed' | 'failed'
}

// ============================================================================
// UUID COMBINATORIAL SPACE
// ============================================================================

export class UUIDCombinatorialSpace {
  private operationRegistry: Map<string, UUIDOperation> = new Map()
  private programs: Map<string, CombinatorialProgram> = new Map()
  private executionCache: Map<string, ExecutionStep[]> = new Map()

  /**
   * Generate UUID from combinatorial index
   * Maps from: operation_space × input_space × context_space → UUID
   */
  generateOperationUUID(domain: string, operation: string, inputs: Record<string, unknown>): string {
    const seed = `${domain}::${operation}::${JSON.stringify(inputs)}`
    const hash = this.hashToUUID(seed)
    return hash
  }

  /**
   * Parse UUID to extract combinatorial coordinates
   */
  parseOperationUUID(uuid: string): { domain: string; operation: string; inputHash: string } {
    // Remove hyphens and convert to bytes manually
    const hex = uuid.replace(/-/g, '')
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
    }

    const domain = this.bytesToString(bytes.slice(0, 6))
    const operation = this.bytesToString(bytes.slice(6, 12))
    const inputHash = Array.from(bytes.slice(12))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    return { domain, operation, inputHash }
  }

  /**
   * Register an operation in the combinatorial space
   */
  registerOperation(op: UUIDOperation): void {
    this.operationRegistry.set(op.uuid, op)
  }

  /**
   * Look up operation by UUID
   */
  getOperation(uuid: string): UUIDOperation | undefined {
    return this.operationRegistry.get(uuid)
  }

  /**
   * List all operations in a domain
   */
  listOperations(domain: string): UUIDOperation[] {
    return Array.from(this.operationRegistry.values()).filter(op => op.domain === domain)
  }

  /**
   * Create combinatorial program from operation UUIDs
   */
  createProgram(operationUUIDs: string[]): CombinatorialProgram {
    const operations = operationUUIDs
      .map(uuid => this.operationRegistry.get(uuid))
      .filter((op): op is UUIDOperation => op !== undefined)

    const uuid = uuidv4()
    const program: CombinatorialProgram = {
      uuid,
      operations,
      composition: [],
      executionPlan: operations.map((op, i) => ({
        stepIndex: i,
        operationUUID: op.uuid,
        inputs: op.inputs,
        status: 'pending'
      }))
    }

    this.programs.set(uuid, program)
    return program
  }

  /**
   * Get program by UUID
   */
  getProgram(uuid: string): CombinatorialProgram | undefined {
    return this.programs.get(uuid)
  }

  private hashToUUID(input: string): string {
    // Simple UUID generation from string (in production use crypto)
    const hash = this.simpleHash(input)
    const bytes = new Uint8Array(16)
    for (let i = 0; i < 16; i++) {
      bytes[i] = (hash >> (i * 8)) & 0xff
    }
    // Set version 4 UUID bits
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80

    return this.bytesToUUID(bytes)
  }

  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  private bytesToString(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => String.fromCharCode(b)).join('').slice(0, 20)
  }

  private bytesToUUID(bytes: Uint8Array): string {
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
  }
}

// ============================================================================
// UUID-PROGRAMMABLE OPERATION EXECUTOR
// ============================================================================

export class UUIDProgrammableExecutor {
  private space: UUIDCombinatorialSpace
  private handlers: Map<string, (input: Record<string, unknown>) => Promise<unknown>> = new Map()

  constructor(space: UUIDCombinatorialSpace) {
    this.space = space
  }

  /**
   * Register handler for domain:operation
   */
  registerHandler(domain: string, operation: string, handler: (input: Record<string, unknown>) => Promise<unknown>): void {
    const key = `${domain}:${operation}`
    this.handlers.set(key, handler)
  }

  /**
   * Execute single operation by UUID
   */
  async executeOperation(uuid: string, inputs: Record<string, unknown>): Promise<ExecutionResult> {
    const startTime = Date.now()
    const operation = this.space.getOperation(uuid)

    if (!operation) {
      return {
        success: false,
        uuid,
        error: `Operation not found: ${uuid}`,
        duration: Date.now() - startTime
      }
    }

    try {
      const handler = this.handlers.get(`${operation.domain}:${operation.operation}`)
      if (!handler) {
        throw new Error(`No handler for ${operation.domain}:${operation.operation}`)
      }

      const result = await handler(inputs)

      return {
        success: true,
        uuid,
        result,
        duration: Date.now() - startTime
      }
    } catch (error) {
      return {
        success: false,
        uuid,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime
      }
    }
  }

  /**
   * Execute combinatorial program by UUID
   */
  async executeProgram(programUUID: string): Promise<ProgramExecutionResult> {
    const program = this.space.getProgram(programUUID)
    if (!program) {
      return {
        success: false,
        programUUID,
        error: 'Program not found',
        steps: []
      }
    }

    const results: ExecutionResult[] = []
    const stepResults: Record<string, unknown> = {}

    for (const step of program.executionPlan) {
      const result = await this.executeOperation(step.operationUUID, {
        ...step.inputs,
        ...stepResults // Make previous outputs available as inputs
      })

      results.push(result)
      if (result.success) {
        stepResults[step.operationUUID] = result.result
      }
    }

    return {
      success: results.every(r => r.success),
      programUUID,
      steps: results,
      finalOutput: stepResults[program.executionPlan[program.executionPlan.length - 1]?.operationUUID || '']
    }
  }
}

// ============================================================================
// CONSOLIDATED MCP-BASED OPERATIONS
// ============================================================================

export interface ExecutionResult {
  success: boolean
  uuid: string
  result?: unknown
  error?: string
  duration: number
}

export interface ProgramExecutionResult {
  success: boolean
  programUUID: string
  steps: ExecutionResult[]
  finalOutput?: unknown
  error?: string
}

/**
 * Consolidated operations from all domains unified through UUID
 */
export class ConsolidatedMCPOperations {
  private space: UUIDCombinatorialSpace
  private executor: UUIDProgrammableExecutor

  constructor() {
    this.space = new UUIDCombinatorialSpace()
    this.executor = new UUIDProgrammableExecutor(this.space)
    this.initializeConsolidatedOperations()
  }

  private initializeConsolidatedOperations(): void {
    // Auto-register all operations from metadata
    for (const op of MCP_OPERATIONS) {
      this.registerOperation(op.domain, op.operation, op.handler)
    }
  }

  private registerOperation(
    domain: string,
    operation: string,
    handler: (input: Record<string, unknown>) => Promise<unknown>
  ): string {
    const uuid = this.space.generateOperationUUID(domain, operation, {})
    const op: UUIDOperation = {
      uuid,
      domain,
      operation,
      inputs: {},
      metadata: {
        createdAt: new Date(),
        version: '1.0.0',
        tags: [domain, operation],
        dependencies: [],
        permissions: ['*'],
        owner: 'system'
      }
    }

    this.space.registerOperation(op)
    this.executor.registerHandler(domain, operation, handler)
    return uuid
  }

  /**
   * Get operation UUID by domain and operation name
   */
  getOperationUUID(domain: string, operation: string): string {
    return this.space.generateOperationUUID(domain, operation, {})
  }

  /**
   * Execute by UUID
   */
  async executeByUUID(uuid: string, inputs: Record<string, unknown>): Promise<ExecutionResult> {
    return this.executor.executeOperation(uuid, inputs)
  }

  /**
   * Create and execute program
   */
  async executeProgram(operationUUIDs: string[]): Promise<ProgramExecutionResult> {
    const program = this.space.createProgram(operationUUIDs)
    return this.executor.executeProgram(program.uuid)
  }

  /**
   * List all available operations
   */
  listOperations(domain?: string): { uuid: string; domain: string; operation: string }[] {
    const ops = domain ? this.space.listOperations(domain) : this.space.listOperations('')
    return ops.length === 0
      ? this.space.listOperations('')
      : ops.map(op => ({ uuid: op.uuid, domain: op.domain, operation: op.operation }))
  }
}

export const consolidatedMCP = new ConsolidatedMCPOperations()
