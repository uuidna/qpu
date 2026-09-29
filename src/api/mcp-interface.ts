// MCP Interface - Unified UUID-Programmable MCP
// All enterprise logic consolidated through UUID-indexed operations
import { APIError, ValidationError } from '../types/errors.js'
import { unifiedRouter, UnifiedMCPRequest, UNIVERSAL_OPERATION_REGISTRY, getOperationUUID } from '../mcp/index.js'

export interface Schema {
  type: string
  properties?: Record<string, any>
  required?: string[]
}

export interface MCPTool {
  name: string
  domain: string
  description: string
  inputSchema: Schema
  outputSchema: Schema
  uuid: string // UUID-indexed
}

export interface MCPRequest {
  tool: string
  domain?: string
  input: Record<string, any>
  uuid?: string // Direct UUID execution
  metadata?: {
    traceId?: string
    userId?: string
    priority?: 'low' | 'normal' | 'high'
  }
}

export interface MCPResponse {
  result: any
  domain: string
  tool: string
  uuid?: string
  executionTime: number
  status: 'success' | 'error'
  error?: string
  traceId?: string
}

export interface DomainRouter {
  execute(toolName: string, input: Record<string, any>): Promise<any>
}

export class MCPInterface {
  private tools: Map<string, MCPTool> = new Map()
  private domainRouters: Map<string, DomainRouter> = new Map()

  registerTool(tool: MCPTool) {
    const key = `${tool.domain}:${tool.name}`
    this.tools.set(key, tool)
  }

  registerDomainRouter(domain: string, router: DomainRouter): void {
    if (!domain) throw new ValidationError('Domain name is required')
    if (!router) throw new ValidationError('Router is required')
    this.domainRouters.set(domain, router)
  }

  listTools(domain?: string): MCPTool[] {
    if (domain) {
      return Array.from(this.tools.values()).filter(t => t.domain === domain)
    }
    return Array.from(this.tools.values())
  }

  getToolSchema(domain: string, toolName: string): MCPTool | undefined {
    return this.tools.get(`${domain}:${toolName}`)
  }

  async invokeTool(request: MCPRequest): Promise<MCPResponse> {
    const startTime = Date.now()
    const domain = request.domain || this.inferDomain(request.tool)

    try {
      this.validateRequest(request)

      // Route to unified UUID-programmable MCP
      const uuid = request.uuid || getOperationUUID(request.tool as any)
      const mcpRequest: UnifiedMCPRequest = {
        requestId: request.metadata?.traceId || `req-${Date.now()}`,
        method: 'execute',
        target: 'operation',
        uuid,
        domain,
        operation: request.tool,
        inputs: request.input,
        metadata: {
          userId: request.metadata?.userId || 'anonymous',
          traceId: request.metadata?.traceId || `trace-${Date.now()}`,
          permissions: ['*'],
          timestamp: new Date()
        }
      }

      const mcpResponse = await unifiedRouter.route(mcpRequest)

      return {
        result: mcpResponse.data,
        domain,
        tool: request.tool,
        uuid,
        executionTime: mcpResponse.executionTime,
        status: mcpResponse.success ? 'success' : 'error',
        error: mcpResponse.error,
        traceId: request.metadata?.traceId,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      return {
        result: null,
        domain,
        tool: request.tool,
        executionTime: Date.now() - startTime,
        status: 'error',
        error: errorMessage,
        traceId: request.metadata?.traceId,
      }
    }
  }

  async batchInvoke(requests: MCPRequest[]): Promise<MCPResponse[]> {
    return Promise.all(requests.map(req => this.invokeTool(req)))
  }

  getCapabilityMap(): Record<string, string[]> {
    const map: Record<string, string[]> = {}

    for (const [key, tool] of this.tools) {
      if (!map[tool.domain]) {
        map[tool.domain] = []
      }
      map[tool.domain].push(tool.name)
    }

    return map
  }

  private inferDomain(toolName: string): string {
    // Simple inference from tool name patterns
    if (toolName.includes('factor')) return 'cryptography'
    if (toolName.includes('portfolio') || toolName.includes('optimize')) return 'finance'
    if (toolName.includes('classify') || toolName.includes('train')) return 'ml'
    if (toolName.includes('knapsack') || toolName.includes('route')) return 'supply-chain'
    if (toolName.includes('code') || toolName.includes('correct')) return 'error-correction'
    if (toolName.includes('anyon') || toolName.includes('braid')) return 'topological'

    return 'unknown'
  }

  private validateRequest(request: MCPRequest): void {
    if (!request.tool) {
      throw new ValidationError('Tool name is required')
    }
    if (!request.input || typeof request.input !== 'object') {
      throw new ValidationError('Input must be a valid object')
    }
  }

  private validateInput(input: Record<string, any>, schema: Schema): void {
    if (!schema.properties) return

    const required = schema.required || []
    for (const field of required) {
      if (!(field in input)) {
        throw new ValidationError(`Missing required field: ${field}`)
      }
    }
  }

  generateOpenAPISpec(): Record<string, any> {
    const spec: Record<string, any> = {
      openapi: '3.0.0',
      info: {
        title: 'UUIDNA QPU MCP Interface',
        version: '1.0.0',
        description: 'Agnostic access to quantum domain-specific capabilities',
      },
      paths: {},
    }

    for (const [key, tool] of this.tools) {
      const path = `/quantum/${tool.domain}/${tool.name}`

      spec.paths[path] = {
        post: {
          summary: tool.description,
          operationId: `${tool.domain}_${tool.name}`,
          requestBody: {
            content: {
              'application/json': {
                schema: tool.inputSchema,
              },
            },
          },
          responses: {
            200: {
              description: 'Successful execution',
              content: {
                'application/json': {
                  schema: tool.outputSchema,
                },
              },
            },
          },
        },
      }
    }

    return spec
  }
}

export const mcp = new MCPInterface()
