// OpenAPI Schema Generator
// Generates OpenAPI 3.1 specifications from MCP compositions

import type { CompositionEngine } from '../mcp-composition/composition-engine.js'
import type { RESTEndpoint } from './rest-handler.js'

export interface OpenAPISpec {
  openapi: string
  info: {
    title: string
    description?: string
    version: string
    contact?: {
      name?: string
      url?: string
      email?: string
    }
    license?: {
      name: string
      url?: string
    }
  }
  servers: Array<{
    url: string
    description?: string
    variables?: Record<string, any>
  }>
  paths: Record<string, any>
  components?: {
    schemas?: Record<string, any>
    securitySchemes?: Record<string, any>
    responses?: Record<string, any>
  }
  tags?: Array<{ name: string; description?: string }>
  security?: Array<Record<string, string[]>>
}

export class OpenAPIGenerator {
  private compositionEngine: CompositionEngine
  private restEndpoints: RESTEndpoint[] = []
  private spec: OpenAPISpec

  constructor(compositionEngine: CompositionEngine) {
    this.compositionEngine = compositionEngine
    this.spec = this.createBaseSpec()
  }

  // Create base OpenAPI spec
  private createBaseSpec(): OpenAPISpec {
    return {
      openapi: '3.1.0',
      info: {
        title: 'QPU API Gateway',
        description: 'Universal API Gateway for MCP Compositions',
        version: '1.0.0',
        contact: {
          name: 'QPU Team',
          url: 'https://qpu.dev'
        },
        license: {
          name: 'Apache 2.0',
          url: 'https://www.apache.org/licenses/LICENSE-2.0'
        }
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        },
        {
          url: 'https://api.qpu.dev',
          description: 'Production server'
        }
      ],
      paths: {},
      components: {
        schemas: {
          Error: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
              code: { type: 'integer' }
            }
          },
          Success: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: { type: 'object' },
              timestamp: { type: 'number' }
            }
          }
        },
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key'
          },
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      tags: [],
      security: [
        { ApiKeyAuth: [] },
        { BearerAuth: [] }
      ]
    }
  }

  async initialize(endpoints: RESTEndpoint[]): Promise<void> {
    this.restEndpoints = endpoints

    // Group endpoints by MCP
    const mcpGroups = new Map<string, RESTEndpoint[]>()
    for (const endpoint of endpoints) {
      if (!mcpGroups.has(endpoint.mcp)) {
        mcpGroups.set(endpoint.mcp, [])
      }
      mcpGroups.get(endpoint.mcp)!.push(endpoint)
    }

    // Add tags for each MCP
    for (const mcp of mcpGroups.keys()) {
      this.spec.tags!.push({
        name: mcp,
        description: `Operations for ${mcp} MCP`
      })
    }

    // Generate paths from endpoints
    for (const endpoint of endpoints) {
      this.addPath(endpoint)
    }

    console.log(`OpenAPI Generator: generated spec with ${Object.keys(this.spec.paths).length} paths`)
  }

  // Add path to OpenAPI spec
  private addPath(endpoint: RESTEndpoint): void {
    const path = endpoint.path
    const method = endpoint.method.toLowerCase()

    if (!this.spec.paths[path]) {
      this.spec.paths[path] = {}
    }

    const pathItem = this.spec.paths[path]!

    pathItem[method] = {
      tags: [endpoint.mcp],
      summary: `${method.toUpperCase()} ${endpoint.path}`,
      description: endpoint.description,
      operationId: `${endpoint.mcp}_${endpoint.operation}`,
      parameters: this.generateParameters(endpoint),
      requestBody: this.generateRequestBody(endpoint),
      responses: this.generateResponses(endpoint),
      security: [
        { ApiKeyAuth: [] },
        { BearerAuth: [] }
      ]
    }
  }

  // Generate parameters from endpoint
  private generateParameters(endpoint: RESTEndpoint): any[] {
    const parameters: any[] = []

    // Extract path parameters from path
    const pathParamRegex = /{(\w+)}|:(\w+)/g
    let match

    while ((match = pathParamRegex.exec(endpoint.path)) !== null) {
      const paramName = match[1] || match[2]
      parameters.push({
        name: paramName,
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: `${paramName} parameter`
      })
    }

    // Query parameters (from endpoint params)
    if (endpoint.params?.query) {
      for (const param of endpoint.params.query) {
        parameters.push({
          name: param,
          in: 'query',
          required: false,
          schema: { type: 'string' },
          description: `Query parameter: ${param}`
        })
      }
    }

    // Common parameters
    parameters.push({
      name: 'X-User-ID',
      in: 'header',
      required: false,
      schema: { type: 'string' },
      description: 'User ID for audit trail'
    })

    parameters.push({
      name: 'X-Request-ID',
      in: 'header',
      required: false,
      schema: { type: 'string' },
      description: 'Request ID for correlation'
    })

    return parameters
  }

  // Generate request body from endpoint
  private generateRequestBody(endpoint: RESTEndpoint): any | undefined {
    if (!['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
      return undefined
    }

    return {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: this.generateSchemaProperties(endpoint),
            description: `Request body for ${endpoint.operation}`
          }
        }
      }
    }
  }

  // Generate schema properties
  private generateSchemaProperties(endpoint: RESTEndpoint): Record<string, any> {
    const properties: Record<string, any> = {}

    if (endpoint.params?.body) {
      for (const param of endpoint.params.body) {
        properties[param] = {
          type: 'string',
          description: `Parameter: ${param}`
        }
      }
    } else {
      // Generic parameters property
      properties['params'] = {
        type: 'object',
        description: 'Operation parameters',
        additionalProperties: true
      }
    }

    return properties
  }

  // Generate response spec
  private generateResponses(endpoint: RESTEndpoint): Record<string, any> {
    return {
      '200': {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                timestamp: { type: 'number' }
              }
            }
          }
        }
      },
      '400': {
        description: 'Bad request',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      '401': {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      '429': {
        description: 'Rate limit exceeded',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      '500': {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      }
    }
  }

  // Get OpenAPI spec as JSON
  getSpec(): OpenAPISpec {
    return this.spec
  }

  // Get OpenAPI spec as YAML (string)
  getSpecYAML(): string {
    return this.convertToYAML(this.spec)
  }

  // Convert object to YAML (simplified)
  private convertToYAML(obj: any, indent: number = 0): string {
    const spaces = ' '.repeat(indent)
    let yaml = ''

    if (Array.isArray(obj)) {
      for (const item of obj) {
        yaml += `${spaces}- ${typeof item === 'object' ? '\n' : ''}${this.convertToYAML(item, indent + 2)}`
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          yaml += `${spaces}${key}:\n${this.convertToYAML(value, indent + 2)}`
        } else {
          yaml += `${spaces}${key}: ${JSON.stringify(value)}\n`
        }
      }
    } else {
      yaml += `${obj}`
    }

    return yaml
  }

  // Generate API documentation
  generateDocumentation(): string {
    let doc = '# API Gateway Documentation\n\n'

    doc += '## Base URL\n'
    doc += '```\n'
    for (const server of this.spec.servers) {
      doc += `${server.url}\n`
    }
    doc += '```\n\n'

    doc += '## Authentication\n'
    doc += 'Use either API Key or Bearer Token:\n'
    doc += '- API Key: `X-API-Key: your-api-key`\n'
    doc += '- Bearer Token: `Authorization: Bearer your-token`\n\n'

    doc += '## Endpoints\n\n'

    for (const [path, pathItem] of Object.entries(this.spec.paths)) {
      for (const [method, operation] of Object.entries(pathItem as any)) {
        if (method === 'parameters') continue

        doc += `### ${method.toUpperCase()} ${path}\n\n`
        doc += `**Description:** ${operation.description || 'No description'}\n\n`

        if (operation.parameters?.length) {
          doc += '**Parameters:**\n'
          for (const param of operation.parameters) {
            doc += `- \`${param.name}\` (${param.in}${param.required ? ', required' : ''}): ${param.description || 'No description'}\n`
          }
          doc += '\n'
        }

        doc += '**Responses:**\n'
        for (const [status, response] of Object.entries(operation.responses || {})) {
          doc += `- \`${status}\`: ${response.description}\n`
        }
        doc += '\n'
      }
    }

    return doc
  }
}
