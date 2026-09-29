/**
 * OpenAPI 3.0 Specification Generator
 * Generates complete API documentation from MCP interface definitions
 */

export interface APIEndpoint {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  summary: string
  description: string
  parameters?: Parameter[]
  requestBody?: RequestBody
  responses: Record<string, Response>
  security?: string[]
  tags?: string[]
}

export interface Parameter {
  name: string
  in: 'query' | 'path' | 'header' | 'cookie'
  required: boolean
  schema: Schema
  description: string
}

export interface RequestBody {
  required: boolean
  content: Record<string, MediaType>
}

export interface MediaType {
  schema: Schema
  examples?: Record<string, unknown>
}

export interface Response {
  description: string
  content?: Record<string, MediaType>
  headers?: Record<string, Header>
}

export interface Header {
  description: string
  schema: Schema
}

export interface Schema {
  type?: string
  format?: string
  items?: Schema
  properties?: Record<string, Schema>
  required?: string[]
  description?: string
  enum?: unknown[]
  default?: unknown
  example?: unknown
}

export interface SecurityScheme {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect' | 'mutualTLS'
  description: string
  name?: string
  in?: string
  scheme?: string
  flows?: OAuthFlows
}

export interface OAuthFlows {
  implicit?: OAuthFlow
  password?: OAuthFlow
  clientCredentials?: OAuthFlow
  authorizationCode?: OAuthFlow
}

export interface OAuthFlow {
  authorizationUrl: string
  tokenUrl: string
  refreshUrl?: string
  scopes: Record<string, string>
}

export interface OpenAPISpec {
  openapi: string
  info: {
    title: string
    version: string
    description: string
    contact?: {
      name: string
      email: string
      url: string
    }
    license?: {
      name: string
      url: string
    }
  }
  servers: Array<{
    url: string
    description: string
    variables?: Record<string, ServerVariable>
  }>
  paths: Record<string, Record<string, APIEndpoint>>
  components: {
    schemas: Record<string, Schema>
    securitySchemes: Record<string, SecurityScheme>
  }
  security?: Array<Record<string, string[]>>
  tags: Array<{
    name: string
    description: string
  }>
}

export interface ServerVariable {
  enum?: string[]
  default: string
  description?: string
}

export class APISpecGenerator {
  generateSpec(
    title: string,
    version: string,
    endpoints: APIEndpoint[],
    servers: Array<{ url: string; description: string }>
  ): OpenAPISpec {
    const paths: Record<string, Record<string, APIEndpoint>> = {}
    const tags = new Set<string>()

    endpoints.forEach(endpoint => {
      if (!paths[endpoint.path]) {
        paths[endpoint.path] = {}
      }
      paths[endpoint.path][endpoint.method.toLowerCase()] = endpoint

      endpoint.tags?.forEach(tag => tags.add(tag))
    })

    return {
      openapi: '3.0.0',
      info: {
        title,
        version,
        description: `Complete API documentation for ${title}`,
        contact: {
          name: 'UUIDNA Support',
          email: 'support@uuidna.com',
          url: 'https://qpu.uuidna.com/support'
        },
        license: {
          name: 'CC-BY-NC-ND-4.0',
          url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/'
        }
      },
      servers,
      paths,
      components: {
        schemas: this.generateCommonSchemas(),
        securitySchemes: this.generateSecuritySchemes()
      },
      security: [
        { bearerAuth: [] },
        { apiKey: [] }
      ],
      tags: Array.from(tags).map(tag => ({
        name: tag,
        description: `${tag} operations`
      }))
    }
  }

  generateCommonSchemas(): Record<string, Schema> {
    return {
      Error: {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: { type: 'string', description: 'Error code' },
          message: { type: 'string', description: 'Error message' },
          details: { type: 'object', description: 'Additional error details' }
        }
      },
      PaginatedResponse: {
        type: 'object',
        required: ['data', 'pagination'],
        properties: {
          data: { type: 'array', items: { type: 'object' } },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              hasMore: { type: 'boolean' }
            }
          }
        }
      },
      DomainRequest: {
        type: 'object',
        required: ['id', 'input'],
        properties: {
          id: { type: 'string', description: 'Request ID' },
          input: { type: 'object', description: 'Input parameters' },
          params: { type: 'object', description: 'Configuration parameters' }
        }
      },
      DomainResult: {
        type: 'object',
        required: ['id', 'output'],
        properties: {
          id: { type: 'string', description: 'Request ID' },
          output: { type: 'object', description: 'Result output' },
          latency: { type: 'number', description: 'Execution latency in ms' }
        }
      }
    }
  }

  generateSecuritySchemes(): Record<string, SecurityScheme> {
    return {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Bearer token authentication'
      },
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API key authentication'
      },
      oauth2: {
        type: 'oauth2',
        description: 'OAuth 2.0 authorization',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://qpu.uuidna.com/oauth/authorize',
            tokenUrl: 'https://qpu.uuidna.com/oauth/token',
            scopes: {
              'read:all': 'Read all resources',
              'write:all': 'Write all resources',
              'admin': 'Administrative access'
            }
          }
        }
      }
    }
  }

  toJSON(spec: OpenAPISpec): string {
    return JSON.stringify(spec, null, 2)
  }

  toYAML(spec: OpenAPISpec): string {
    // Simple YAML generation (production would use yaml library)
    const lines: string[] = []
    lines.push('openapi: 3.0.0')
    lines.push('info:')
    lines.push(`  title: ${spec.info.title}`)
    lines.push(`  version: ${spec.info.version}`)
    lines.push(`  description: ${spec.info.description}`)
    return lines.join('\n')
  }
}

export const apiSpecGenerator = new APISpecGenerator()
