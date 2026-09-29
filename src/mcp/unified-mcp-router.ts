/**
 * Unified MCP Router
 * Central hub consolidating all enterprise logic through UUID-programmable operations
 * Every tool, app, and service is now a composable UUID-indexed MCP operation
 */

import { consolidatedMCP, UUIDOperation, CombinatorialProgram, ExecutionResult } from './uuid-programmable-core.js'

// ============================================================================
// UNIFIED MCP REQUEST/RESPONSE
// ============================================================================

export interface UnifiedMCPRequest {
  requestId: string
  method: 'execute' | 'compose' | 'list' | 'introspect'
  target: 'operation' | 'program' | 'domain'
  uuid?: string
  domain?: string
  operation?: string
  inputs?: Record<string, unknown>
  operationUUIDs?: string[] // For composition
  metadata?: {
    userId: string
    traceId: string
    permissions: string[]
    timestamp: Date
  }
}

export interface UnifiedMCPResponse {
  requestId: string
  success: boolean
  status: 'ok' | 'error' | 'pending'
  data?: unknown
  error?: string
  executionTime: number
}

// ============================================================================
// UNIFIED MCP ROUTER
// ============================================================================

export class UnifiedMCPRouter {
  private requestId = 0

  /**
   * Route request to appropriate UUID-indexed operation
   */
  async route(request: UnifiedMCPRequest): Promise<UnifiedMCPResponse> {
    const startTime = Date.now()
    const requestId = request.requestId || `req-${++this.requestId}`

    try {
      let data: unknown

      switch (request.method) {
        case 'execute':
          data = await this.executeOperation(request)
          break

        case 'compose':
          data = await this.composeProgram(request)
          break

        case 'list':
          data = this.listOperations(request)
          break

        case 'introspect':
          data = this.introspectOperation(request)
          break

        default:
          throw new Error(`Unknown method: ${request.method}`)
      }

      return {
        requestId,
        success: true,
        status: 'ok',
        data,
        executionTime: Date.now() - startTime
      }
    } catch (error) {
      return {
        requestId,
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        executionTime: Date.now() - startTime
      }
    }
  }

  /**
   * Execute operation by UUID
   */
  private async executeOperation(request: UnifiedMCPRequest): Promise<ExecutionResult> {
    const uuid = request.uuid || consolidatedMCP.getOperationUUID(request.domain!, request.operation!)
    const inputs = request.inputs || {}

    return consolidatedMCP.executeByUUID(uuid, inputs)
  }

  /**
   * Compose and execute program from operation UUIDs
   */
  private async composeProgram(request: UnifiedMCPRequest): Promise<unknown> {
    if (!request.operationUUIDs || request.operationUUIDs.length === 0) {
      throw new Error('operationUUIDs required for compose')
    }

    return consolidatedMCP.executeProgram(request.operationUUIDs)
  }

  /**
   * List operations in domain
   */
  private listOperations(request: UnifiedMCPRequest): unknown {
    return consolidatedMCP.listOperations(request.domain)
  }

  /**
   * Introspect operation details
   */
  private introspectOperation(request: UnifiedMCPRequest): unknown {
    if (!request.uuid && (!request.domain || !request.operation)) {
      throw new Error('Either uuid or (domain, operation) required')
    }

    const uuid = request.uuid || consolidatedMCP.getOperationUUID(request.domain!, request.operation!)
    return {
      uuid,
      domain: request.domain,
      operation: request.operation,
      available: true
    }
  }
}

// ============================================================================
// CONVENIENCE BUILDERS
// ============================================================================

/**
 * Fluent API for building UUID-programmable operations
 */
export class MCPBuilder {
  private operations: string[] = []

  /**
   * Add operation to composition
   */
  add(domain: string, operation: string): this {
    const uuid = consolidatedMCP.getOperationUUID(domain, operation)
    this.operations.push(uuid)
    return this
  }

  /**
   * Add compliance scan
   */
  addComplianceScan(): this {
    return this.add('enterprise', 'compliance-scan')
  }

  /**
   * Add security validation
   */
  addSecurityValidation(): this {
    return this.add('enterprise', 'security-validate')
  }

  /**
   * Add performance benchmark
   */
  addPerformanceBenchmark(): this {
    return this.add('enterprise', 'performance-benchmark')
  }

  /**
   * Add quantum ML training
   */
  addQuantumMLTraining(): this {
    return this.add('quantum-ml', 'train-model')
  }

  /**
   * Add quantum ML prediction
   */
  addQuantumMLPrediction(): this {
    return this.add('quantum-ml', 'predict')
  }

  /**
   * Add compression
   */
  addCompression(): this {
    return this.add('compression', 'compress')
  }

  /**
   * Add tracing
   */
  addTracing(): this {
    return this.add('observability', 'trace')
  }

  /**
   * Add anomaly detection
   */
  addAnomalyDetection(): this {
    return this.add('observability', 'detect-anomaly')
  }

  /**
   * Add medical profiling
   */
  addMedicalProfiling(): this {
    return this.add('medical', 'profile-patient')
  }

  /**
   * Add treatment planning
   */
  addTreatmentPlanning(): this {
    return this.add('medical', 'generate-treatment-plan')
  }

  /**
   * Add dashboard rendering
   */
  addDashboard(): this {
    return this.add('ui', 'render-dashboard')
  }

  /**
   * Build the operation UUIDs for composition
   */
  build(): string[] {
    return this.operations
  }

  /**
   * Build and execute as program
   */
  async execute(): Promise<unknown> {
    return consolidatedMCP.executeProgram(this.operations)
  }
}

// ============================================================================
// UNIVERSAL MCP REGISTRY
// ============================================================================

/**
 * All operations mapped to UUID for introspection and discovery
 */
export const UNIVERSAL_OPERATION_REGISTRY = {
  // Enterprise Tools
  'compliance-scan': { domain: 'enterprise', operation: 'compliance-scan' },
  'security-validate': { domain: 'enterprise', operation: 'security-validate' },
  'performance-benchmark': { domain: 'enterprise', operation: 'performance-benchmark' },

  // Quantum ML
  'train-quantum-model': { domain: 'quantum-ml', operation: 'train-model' },
  'quantum-predict': { domain: 'quantum-ml', operation: 'predict' },

  // Compression
  'compress-data': { domain: 'compression', operation: 'compress' },
  'decompress-data': { domain: 'compression', operation: 'decompress' },

  // Observability
  'trace-request': { domain: 'observability', operation: 'trace' },
  'detect-anomaly': { domain: 'observability', operation: 'detect-anomaly' },

  // Medical
  'profile-patient': { domain: 'medical', operation: 'profile-patient' },
  'generate-treatment': { domain: 'medical', operation: 'generate-treatment-plan' },

  // UI/Dashboard
  'render-dashboard': { domain: 'ui', operation: 'render-dashboard' },
  'render-form': { domain: 'ui', operation: 'render-form' }
}

/**
 * Get UUID for any registered operation
 */
export function getOperationUUID(name: keyof typeof UNIVERSAL_OPERATION_REGISTRY): string {
  const op = UNIVERSAL_OPERATION_REGISTRY[name]
  if (!op) throw new Error(`Operation not found: ${name}`)
  return consolidatedMCP.getOperationUUID(op.domain, op.operation)
}

// ============================================================================
// SINGLETON INSTANCES
// ============================================================================

export const unifiedRouter = new UnifiedMCPRouter()

/**
 * Example usage:
 *
 * // Execute single operation
 * await unifiedRouter.route({
 *   requestId: 'req-1',
 *   method: 'execute',
 *   target: 'operation',
 *   domain: 'quantum-ml',
 *   operation: 'predict',
 *   inputs: { data: [...] }
 * })
 *
 * // Compose and execute program
 * const program = new MCPBuilder()
 *   .addComplianceScan()
 *   .addSecurityValidation()
 *   .addQuantumMLPrediction()
 *   .build()
 *
 * await unifiedRouter.route({
 *   requestId: 'req-2',
 *   method: 'compose',
 *   target: 'program',
 *   operationUUIDs: program
 * })
 */
