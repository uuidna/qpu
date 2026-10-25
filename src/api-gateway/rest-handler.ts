// REST Handler for API Gateway
// Auto-generates REST endpoints from MCP compositions

import type { CompositionRequest, CompositionResult, CompositionEngine } from '../mcp-composition/composition-engine.js'

export interface RESTEndpoint {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  mcp: string
  operation: string
  params?: {
    query?: string[]
    path?: string[]
    body?: string[]
  }
  description: string
}

export interface RESTRequest {
  method: string
  path: string
  query?: Record<string, string | string[]>
  body?: any
  headers?: Record<string, string>
}

export interface RESTResponse {
  status: number
  body: any
  headers: Record<string, string>
}

export class RESTHandler {
  private endpoints: Map<string, RESTEndpoint> = new Map()
  private compositionEngine: CompositionEngine

  constructor(compositionEngine: CompositionEngine) {
    this.compositionEngine = compositionEngine
  }

  async initialize(): Promise<void> {
    // Generate endpoints from available capabilities
    const capabilities = await this.compositionEngine.listCapabilities()

    // Create REST endpoints for each MCP capability
    for (const cap of capabilities) {
      const endpointId = `${cap.mcp}:${cap.tool}`

      // Map tool operations to HTTP methods
      const httpMethod = this.getHTTPMethod(cap.tool)
      const path = `/api/v1/${cap.mcp}/${cap.tool}`

      this.endpoints.set(endpointId, {
        path,
        method: httpMethod,
        mcp: cap.mcp,
        operation: cap.tool,
        description: cap.description
      })
    }

    console.log(`REST Handler: generated ${this.endpoints.size} endpoints`)
  }

  // Handle incoming REST request
  async handleRequest(req: RESTRequest): Promise<RESTResponse> {
    try {
      // Parse request
      const route = this.matchRoute(req.method, req.path)

      if (!route) {
        return {
          status: 404,
          body: { error: 'Not Found', message: `No route found for ${req.method} ${req.path}` },
          headers: { 'content-type': 'application/json' }
        }
      }

      // Build composition request from REST request
      const compositionRequest = this.buildCompositionRequest(route, req)

      // Execute composition
      const result = await this.compositionEngine.execute(compositionRequest)

      // Transform response
      return this.transformResponse(result)
    } catch (error) {
      return {
        status: 500,
        body: { error: 'Internal Server Error', message: (error as Error).message },
        headers: { 'content-type': 'application/json' }
      }
    }
  }

  // Match request to route
  private matchRoute(method: string, path: string): RESTEndpoint | null {
    // Try exact match first
    for (const endpoint of this.endpoints.values()) {
      if (endpoint.method === method && endpoint.path === path) {
        return endpoint
      }
    }

    // Try parametrized match
    const pathSegments = path.split('/').filter(s => s)
    for (const endpoint of this.endpoints.values()) {
      const endpointSegments = endpoint.path.split('/').filter(s => s)

      if (pathSegments.length !== endpointSegments.length) continue
      if (endpoint.method !== method) continue

      let matches = true
      for (let i = 0; i < endpointSegments.length; i++) {
        const epSeg = endpointSegments[i]
        const reqSeg = pathSegments[i]

        if (epSeg.startsWith(':') || epSeg.startsWith('{')) {
          // Parameter - matches anything
          continue
        }

        if (epSeg !== reqSeg) {
          matches = false
          break
        }
      }

      if (matches) {
        return endpoint
      }
    }

    return null
  }

  // Build composition request from REST request
  private buildCompositionRequest(endpoint: RESTEndpoint, req: RESTRequest): CompositionRequest {
    const params: any = {}

    // Merge query parameters
    if (req.query) {
      Object.assign(params, req.query)
    }

    // Merge body
    if (req.body) {
      Object.assign(params, req.body)
    }

    // Extract path parameters
    const pathMatch = this.extractPathParams(endpoint.path, req.path)
    if (pathMatch) {
      Object.assign(params, pathMatch)
    }

    return {
      steps: [
        {
          id: 'main',
          mcp: endpoint.mcp,
          operation: endpoint.operation,
          params
        }
      ],
      context: {
        user: req.headers?.['x-user-id'] || 'anonymous',
        permissions: (req.headers?.['x-permissions'] || '').split(',').filter(Boolean)
      }
    }
  }

  // Extract path parameters
  private extractPathParams(pattern: string, actual: string): Record<string, string> | null {
    const patternSegments = pattern.split('/').filter(s => s)
    const actualSegments = actual.split('/').filter(s => s)

    if (patternSegments.length !== actualSegments.length) {
      return null
    }

    const params: Record<string, string> = {}

    for (let i = 0; i < patternSegments.length; i++) {
      const patSeg = patternSegments[i]
      const actSeg = actualSegments[i]

      if (patSeg.startsWith(':') || patSeg.startsWith('{')) {
        const paramName = patSeg.replace(/^[:{}]/g, '').replace(/[}]$/, '')
        params[paramName] = actSeg
      }
    }

    return Object.keys(params).length > 0 ? params : null
  }

  // Transform composition result to REST response
  private transformResponse(result: CompositionResult): RESTResponse {
    const status = result.success ? 200 : 500
    const body = result.success ? this.extractData(result) : this.extractError(result)

    return {
      status,
      body,
      headers: {
        'content-type': 'application/json',
        'x-execution-time': result.total_time.toString(),
        'cache-control': 'public, max-age=300'
      }
    }
  }

  // Extract data from composition result
  private extractData(result: CompositionResult): any {
    if (result.steps.size === 1) {
      const [data] = result.steps.values()
      return data
    }

    // Return all steps
    const data: Record<string, any> = {}
    for (const [key, value] of result.steps.entries()) {
      data[key] = value
    }
    return data
  }

  // Extract error from composition result
  private extractError(result: CompositionResult): any {
    return {
      error: 'Composition Failed',
      errors: result.errors,
      timestamp: result.timestamp
    }
  }

  // Get HTTP method for tool operation
  private getHTTPMethod(operation: string): 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' {
    const op = operation.toLowerCase()

    if (op.includes('list') || op.includes('get') || op.includes('read') || op.includes('fetch')) {
      return 'GET'
    }
    if (op.includes('create') || op.includes('add') || op.includes('submit') || op.includes('execute')) {
      return 'POST'
    }
    if (op.includes('update') || op.includes('put') || op.includes('replace')) {
      return 'PUT'
    }
    if (op.includes('patch') || op.includes('modify')) {
      return 'PATCH'
    }
    if (op.includes('delete') || op.includes('remove') || op.includes('drop')) {
      return 'DELETE'
    }

    return 'POST' // Default to POST
  }

  // List all available endpoints
  listEndpoints(): RESTEndpoint[] {
    return Array.from(this.endpoints.values())
  }

  // Get endpoint by ID
  getEndpoint(id: string): RESTEndpoint | undefined {
    return this.endpoints.get(id)
  }
}
