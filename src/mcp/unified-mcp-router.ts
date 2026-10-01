/**
 * Unified MCP Router
 * Central hub consolidating all enterprise logic through UUID-programmable operations
 * Every tool, app, and service is now a composable UUID-indexed MCP operation
 */

import { consolidatedMCP, UUIDOperation, CombinatorialProgram, ExecutionResult } from './uuid-programmable-core.js'
import { priorArtCitationManager, Citation, ScholarlyWork } from './prior-art-citations.js'
import { MCP_OPERATIONS, deriveBuilderMethodName } from './operations-metadata.js'

// ============================================================================
// UNIFIED MCP REQUEST/RESPONSE WITH PRIOR ART CITATIONS
// ============================================================================

export interface UnifiedMCPRequest {
  requestId: string
  method: 'execute' | 'compose' | 'list' | 'introspect' | 'citations'
  target: 'operation' | 'program' | 'domain'
  uuid?: string
  domain?: string
  operation?: string
  inputs?: Record<string, unknown>
  operationUUIDs?: string[] // For composition
  problemName?: string // For clay problems
  includeCitations?: boolean // Auto-include prior art genealogy
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
  citations?: Citation[] // Prior art references
  genealogy?: ScholarlyWork[] // Complete historical lineage
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
   * Now includes prior art citations and historical genealogy
   */
  async route(request: UnifiedMCPRequest): Promise<UnifiedMCPResponse> {
    const startTime = Date.now()
    const requestId = request.requestId || `req-${++this.requestId}`

    try {
      let data: unknown
      let citations: Citation[] | undefined
      let genealogy: ScholarlyWork[] | undefined

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

        case 'citations':
          data = this.getCitations(request)
          break

        default:
          throw new Error(`Unknown method: ${request.method}`)
      }

      // Auto-include prior art if requested or for clay problems
      if (request.includeCitations || request.problemName) {
        citations = priorArtCitationManager.getCitationsForProblem(request.problemName || '')
        genealogy = priorArtCitationManager.getIdeologyGenealogy(request.operation || request.problemName || '')
      }

      return {
        requestId,
        success: true,
        status: 'ok',
        data,
        citations,
        genealogy,
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

  /**
   * Get citations and genealogy for operation or problem
   */
  private getCitations(request: UnifiedMCPRequest): unknown {
    if (request.problemName) {
      const citations = priorArtCitationManager.getCitationsForProblem(request.problemName)
      const genealogy = priorArtCitationManager.getIdeologyGenealogy(request.problemName)
      const bibliography = priorArtCitationManager.generateBibliography(citations)

      return {
        problem: request.problemName,
        citationCount: citations.length,
        citations,
        genealogy,
        bibliography,
        scholars: priorArtCitationManager.getAllScholars()
      }
    } else if (request.operation) {
      const genealogy = priorArtCitationManager.getIdeologyGenealogy(request.operation)
      return {
        operation: request.operation,
        genealogy,
        scholars: priorArtCitationManager.getAllScholars()
      }
    }

    // If no specific context, return all scholars and works
    return {
      allScholars: priorArtCitationManager.getAllScholars(),
      totalWorks: priorArtCitationManager.getAllScholars().reduce((sum, s) => sum + s.works, 0)
    }
  }
}

// ============================================================================
// CONVENIENCE BUILDERS
// ============================================================================

/**
 * Fluent API for building UUID-programmable operations
 * Auto-generates add<Operation>() methods from metadata
 */
export class MCPBuilder {
  private operations: string[] = []

  constructor() {
    // Auto-generate all add<Operation>() methods from metadata
    return new Proxy(this, {
      get: (target: any, prop: string | symbol) => {
        // Built-in methods
        if (prop === 'operations' || prop === 'add' || prop === 'build' || prop === 'execute') {
          return target[prop]
        }

        if (typeof prop === 'string' && prop.startsWith('add') && prop.length > 3) {
          const methodName = prop.slice(3)
          const k = methodName
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()
            .replace(/^-/, '')

          const op = MCP_OPERATIONS.find(o => deriveBuilderMethodName(o.key) === methodName)
          if (op) {
            return () => target.add(op.domain, op.operation)
          }
        }

        return target[prop]
      }
    })
  }

  /**
   * Add operation to composition
   */
  add(domain: string, operation: string): this {
    const uuid = consolidatedMCP.getOperationUUID(domain, operation)
    this.operations.push(uuid)
    return this
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
 * Auto-generated from MCP_OPERATIONS metadata
 */
export const UNIVERSAL_OPERATION_REGISTRY: Record<string, { domain: string; operation: string }> = {}

// Initialize registry from metadata
for (const op of MCP_OPERATIONS) {
  UNIVERSAL_OPERATION_REGISTRY[op.key] = {
    domain: op.domain,
    operation: op.operation
  }
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
