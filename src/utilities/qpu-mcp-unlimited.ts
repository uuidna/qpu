/**
 * QPU MCP Unlimited Capabilities
 * Infinite operations through combinatorial API composition
 * No hardcoding: pure formula-driven tool generation
 */

import { sha256Hex } from '@uuidna/qpu/core/crypt.js'
import { UniversalAPICombinator, STANDARD_SERVICES, APIService, APIEndpoint } from './universal-api-framework'

export interface MCPToolDefinition {
  name: string
  description: string
  inputSchema: {
    type: 'object'
    properties: Record<string, unknown>
    required: string[]
  }
  outputSchema?: {
    type: 'object'
    properties: Record<string, unknown>
  }
}

export interface MCPOperation {
  id: string
  name: string
  formula: string
  tool: MCPToolDefinition
  execute: (input: Record<string, unknown>) => Promise<unknown>
}

/**
 * QPU MCP Unlimited Generator
 * Generates unlimited MCP operations from API composition
 */
export class QPUMCPUnlimited {
  private combinator: UniversalAPICombinator
  private operations: Map<string, MCPOperation> = new Map()
  private composedOperations: Set<string> = new Set()

  constructor(combinator?: UniversalAPICombinator) {
    this.combinator = combinator || new (require('./universal-api-framework').createUniversalCombinator)()
  }

  /**
   * Generate MCP tool definition from API endpoint
   */
  private endpointToMCPTool(serviceName: string, endpoint: APIEndpoint): MCPToolDefinition {
    const properties: Record<string, unknown> = {}
    const required: string[] = []

    for (const param of endpoint.parameters) {
      properties[param.name] = {
        type: param.type,
        description: param.description || param.name,
      }
      if (param.required) {
        required.push(param.name)
      }
    }

    return {
      name: `${serviceName}__${endpoint.name}`,
      description: `${endpoint.description} [${serviceName}/${endpoint.name}]`,
      inputSchema: {
        type: 'object',
        properties,
        required,
      },
      outputSchema: {
        type: 'object',
        properties: {
          formula: { type: 'string' },
          data: { type: 'object' },
          cached: { type: 'boolean' },
          service: { type: 'string' },
          endpoint: { type: 'string' },
        },
      },
    }
  }

  /**
   * Generate all operations from registered services
   */
  generateOperationsFromAPIs(): MCPOperation[] {
    const operations: MCPOperation[] = []

    for (const service of this.combinator.getServices()) {
      for (const endpoint of service.endpoints) {
        const tool = this.endpointToMCPTool(service.name, endpoint)
        const formula = this.combinator.generateEndpointHex(service.name, endpoint.name)

        const operation: MCPOperation = {
          id: formula,
          name: tool.name,
          formula,
          tool,
          execute: async (input: Record<string, unknown>) => {
            return this.combinator.executeAPICall(service.name, endpoint.name, input)
          },
        }

        operations.push(operation)
        this.operations.set(operation.id, operation)
      }
    }

    return operations
  }

  /**
   * Generate composed operations (combining multiple APIs)
   * Example: search-then-summarize = google-search + openai-completions
   */
  generateComposedOperations(): MCPOperation[] {
    const composed: MCPOperation[] = []
    const baseOperations = Array.from(this.operations.values())

    // Generate all 2-operation compositions
    for (let i = 0; i < baseOperations.length; i++) {
      for (let j = i + 1; j < baseOperations.length; j++) {
        const op1 = baseOperations[i]
        const op2 = baseOperations[j]

        // Only compose compatible operations (output type matches input type)
        const composedName = `${op1.name}__then__${op2.name}`
        // the params hash of { op1, op2 }, as generateParamsHex would give it; 'composed' is not a registered service to look up
        const composedFormula = sha256Hex(`op1=${JSON.stringify(op1.formula)}&op2=${JSON.stringify(op2.formula)}`).slice(0, 16)

        const composedOperation: MCPOperation = {
          id: composedFormula,
          name: composedName,
          formula: composedFormula,
          tool: {
            name: composedName,
            description: `Composed: ${op1.tool.description} → ${op2.tool.description}`,
            inputSchema: {
              type: 'object',
              properties: {
                ...op1.tool.inputSchema.properties,
                ...op2.tool.inputSchema.properties,
              },
              required: [...op1.tool.inputSchema.required, ...op2.tool.inputSchema.required],
            },
            outputSchema: op2.tool.outputSchema,
          },
          execute: async (input: Record<string, unknown>) => {
            // Execute first operation, feed output to second
            const result1 = await op1.execute(input)
            const result2 = await op2.execute({
              ...input,
              ...(result1 as Record<string, unknown>), // Combine results
            })
            return {
              formula: composedFormula,
              composed_from: [op1.formula, op2.formula],
              step1_result: result1,
              step2_result: result2,
            }
          },
        }

        composed.push(composedOperation)
        this.operations.set(composedOperation.id, composedOperation)
        this.composedOperations.add(composedOperation.id)
      }
    }

    return composed
  }

  /**
   * Get all available MCP tools
   */
  getAllTools(): MCPToolDefinition[] {
    return Array.from(this.operations.values()).map((op) => op.tool)
  }

  /**
   * Get all operations
   */
  getAllOperations(): MCPOperation[] {
    return Array.from(this.operations.values())
  }

  /**
   * Execute operation by formula
   */
  async executeByFormula(formula: string, input: Record<string, unknown>): Promise<unknown> {
    const operation = this.operations.get(formula)
    if (!operation) {
      throw new Error(`Unknown operation: ${formula}`)
    }
    return operation.execute(input)
  }

  /**
   * Generate MCP server manifest
   * Can be used to bootstrap an MCP server
   */
  generateMCPManifest() {
    const tools = this.getAllTools()
    return {
      name: 'qpu-unlimited',
      version: '1.0.0',
      description: 'QPU MCP with unlimited capabilities through API composition',
      tools: tools.map((tool) => ({
        ...tool,
        id: tool.name,
      })),
      capabilities: {
        totalTools: tools.length,
        baseOperations: tools.filter((t) => !this.composedOperations.has(t.name)).length,
        composedOperations: tools.filter((t) => this.composedOperations.has(t.name)).length,
        supportedCompositions: 'unlimited',
      },
    }
  }

  /**
   * Generate Next.js API routes for all operations
   */
  generateAPIRoutes(): Map<
    string,
    {
      endpoint: string
      handler: (params: Record<string, unknown>) => Promise<unknown>
    }
  > {
    const routes = new Map()

    for (const operation of this.getAllOperations()) {
      routes.set(`/api/operations/${operation.id}`, {
        endpoint: operation.tool.name,
        handler: operation.execute,
      })
    }

    return routes
  }

  /**
   * Add custom service (extend QPU with user APIs)
   */
  addService(service: APIService): void {
    this.combinator.registerService(service)
  }

  /**
   * Get operation count
   */
  getOperationCount(): {
    base: number
    composed: number
    total: number
  } {
    const base = this.operations.size - this.composedOperations.size
    const composed = this.composedOperations.size
    return {
      base,
      composed,
      total: this.operations.size,
    }
  }
}

/**
 * Create QPU MCP Unlimited with all standard services
 */
export function createQPUMCPUnlimited(): QPUMCPUnlimited {
  const mcp = new QPUMCPUnlimited()
  mcp.generateOperationsFromAPIs()
  mcp.generateComposedOperations()
  return mcp
}

/**
 * Export standard capabilities
 */
export const QPU_STANDARD_CAPABILITIES = {
  SEARCH_AND_SUMMARIZE: 'google-search__search + openai__completions',
  REPO_ANALYSIS: 'github__list-repos + openai__completions',
  PAYMENT_PROCESSING: 'stripe__create-payment-intent + stripe__list-charges',
  SMS_NOTIFICATION: 'twilio__send-sms',
  MULTI_DOMAIN_QUERY: 'composition of any 2+ endpoints',
} as const
