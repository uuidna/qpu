// MCP Interface - Agnostic access to domain-specific capabilities
export interface MCPTool {
  name: string
  domain: string
  description: string
  inputSchema: Record<string, any>
  outputSchema: Record<string, any>
}

export interface MCPRequest {
  tool: string
  domain?: string
  input: any
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
  executionTime: number
  status: 'success' | 'error'
  traceId?: string
}

export class MCPInterface {
  private tools: Map<string, MCPTool> = new Map()
  private domainRouters: Map<string, any> = new Map()

  registerTool(tool: MCPTool) {
    const key = `${tool.domain}:${tool.name}`
    this.tools.set(key, tool)
  }

  registerDomainRouter(domain: string, router: any) {
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

    try {
      // Route to domain-specific implementation
      const domain = request.domain || this.inferDomain(request.tool)
      const router = this.domainRouters.get(domain)

      if (!router) {
        throw new Error(`Domain not found: ${domain}`)
      }

      const tool = this.tools.get(`${domain}:${request.tool}`)
      if (!tool) {
        throw new Error(`Tool not found: ${request.tool}`)
      }

      // Validate input
      this.validateInput(request.input, tool.inputSchema)

      // Execute tool
      const result = await router.execute(request.tool, request.input)

      return {
        result,
        domain,
        tool: request.tool,
        executionTime: Date.now() - startTime,
        status: 'success',
        traceId: request.metadata?.traceId,
      }
    } catch (error) {
      return {
        result: { error: String(error) },
        domain: request.domain || 'unknown',
        tool: request.tool,
        executionTime: Date.now() - startTime,
        status: 'error',
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

  private validateInput(input: any, schema: Record<string, any>): void {
    // Basic validation - in production, use JSON Schema validator
    for (const [key, type] of Object.entries(schema)) {
      if (!(key in input) && type.required) {
        throw new Error(`Missing required field: ${key}`)
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
