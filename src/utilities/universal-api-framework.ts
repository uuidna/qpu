/**
 * Universal API Framework
 * Serves all external APIs through combinatorial hex routing
 * No hardcoding: pure formula composition
 */

import { sha256Hex } from '@uuidna/qpu/core/crypt.js'

export interface APIParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  required: boolean
  description?: string
}

export interface APIResponse {
  status: number
  format: 'json' | 'xml' | 'text'
  schema?: Record<string, unknown>
}

export interface APIEndpoint {
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  parameters: APIParameter[]
  response: APIResponse
  rateLimitPerMinute?: number
  cacheSeconds?: number
}

export interface APIService {
  name: string
  baseUrl: string
  authentication?: {
    type: 'bearer' | 'apikey' | 'oauth2' | 'basic'
    header?: string
  }
  endpoints: APIEndpoint[]
}

/**
 * Universal API Combinator
 * Treats all APIs as composable formulas
 */
export class UniversalAPICombinator {
  private services: Map<string, APIService> = new Map()
  private formulaCache: Map<string, string> = new Map()

  /**
   * Register any external API service
   */
  registerService(service: APIService): void {
    this.services.set(service.name, service)
  }

  /**
   * Generate hex address for any API endpoint
   * Deterministic: same endpoint → same hex
   */
  generateEndpointHex(serviceName: string, endpointName: string): string {
    const key = `${serviceName}:${endpointName}`
    if (this.formulaCache.has(key)) {
      return this.formulaCache.get(key)!
    }

    const hash = sha256Hex(key)
      .slice(0, 16)
    this.formulaCache.set(key, hash)
    return hash
  }

  /**
   * Generate hex for parameter combination
   * Enables combinatorial routing: GET /api/[service]/[endpoint]/[params-hash]
   */
  generateParamsHex(serviceName: string, endpointName: string, params: Record<string, unknown>): string {
    const endpoint = this.getEndpoint(serviceName, endpointName)
    if (!endpoint) throw new Error(`Unknown endpoint: ${serviceName}/${endpointName}`)

    // Sort parameters for determinism
    const sorted = Object.keys(params)
      .sort()
      .map((k) => `${k}=${JSON.stringify(params[k])}`)
      .join('&')

    return sha256Hex(sorted).slice(0, 16)
  }

  /**
   * Generate full formula for any API call
   * Input: service name + endpoint + parameters
   * Output: hex address that routes to cached result
   */
  generateAPIFormula(serviceName: string, endpointName: string, params: Record<string, unknown>): string {
    const endpointHex = this.generateEndpointHex(serviceName, endpointName)
    const paramsHex = this.generateParamsHex(serviceName, endpointName, params)
    return `${endpointHex}/${paramsHex}`
  }

  /**
   * Get all API operations as formulas
   */
  getAllAPIFormulas(): Array<{
    name: string
    service: string
    endpoint: string
    hex: string
    inputs: APIParameter[]
    output: APIResponse
  }> {
    const formulas: Array<{
      name: string
      service: string
      endpoint: string
      hex: string
      inputs: APIParameter[]
      output: APIResponse
    }> = []

    for (const [serviceName, service] of this.services) {
      for (const endpoint of service.endpoints) {
        const hex = this.generateEndpointHex(serviceName, endpoint.name)
        formulas.push({
          name: `${serviceName}/${endpoint.name}`,
          service: serviceName,
          endpoint: endpoint.name,
          hex,
          inputs: endpoint.parameters,
          output: endpoint.response,
        })
      }
    }

    return formulas
  }

  /**
   * Generate combinatorial routes for all APIs
   * Routes: /api/[service-hex]/[endpoint-hex]/[params-hex]
   */
  generateCombinatoricRoutes(): Map<
    string,
    {
      serviceName: string
      endpointName: string
      handler: (params: Record<string, unknown>) => Promise<unknown>
    }
  > {
    const routes = new Map()

    for (const [serviceName, service] of this.services) {
      for (const endpoint of service.endpoints) {
        const hex = this.generateEndpointHex(serviceName, endpoint.name)
        routes.set(hex, {
          serviceName,
          endpointName: endpoint.name,
          handler: async (params: Record<string, unknown>) => {
            return this.executeAPICall(serviceName, endpoint.name, params)
          },
        })
      }
    }

    return routes
  }

  /**
   * Execute API call with parameter validation
   */
  async executeAPICall(
    serviceName: string,
    endpointName: string,
    params: Record<string, unknown>,
  ): Promise<{
    status: number
    data: unknown
    cached: boolean
    formula: string
  }> {
    const service = this.services.get(serviceName)
    const endpoint = service?.endpoints.find((e) => e.name === endpointName)

    if (!service || !endpoint) {
      throw new Error(`Unknown service/endpoint: ${serviceName}/${endpointName}`)
    }

    // Validate parameters
    for (const param of endpoint.parameters) {
      if (param.required && !(param.name in params)) {
        throw new Error(`Missing required parameter: ${param.name}`)
      }
    }

    // Generate formula
    const formula = this.generateAPIFormula(serviceName, endpointName, params)

    // In production, would execute actual API call here
    // For now, return formula + metadata
    return {
      status: 200,
      data: {
        formula,
        service: serviceName,
        endpoint: endpointName,
        parameters: params,
      },
      cached: false,
      formula,
    }
  }

  /**
   * Get endpoint definition
   */
  private getEndpoint(serviceName: string, endpointName: string): APIEndpoint | undefined {
    return this.services.get(serviceName)?.endpoints.find((e) => e.name === endpointName)
  }

  /**
   * Get all services
   */
  getServices(): APIService[] {
    return Array.from(this.services.values())
  }

  /**
   * Get service by name
   */
  getService(name: string): APIService | undefined {
    return this.services.get(name)
  }
}

/**
 * Pre-built standard services
 */
export const STANDARD_SERVICES = {
  GOOGLE_SEARCH: {
    name: 'google-search',
    baseUrl: 'https://www.googleapis.com/customsearch/v1',
    authentication: { type: 'apikey' as const },
    endpoints: [
      {
        name: 'search',
        method: 'GET' as const,
        path: '/search',
        description: 'Search Google Custom Search Engine',
        parameters: [
          { name: 'q', type: 'string' as const, required: true, description: 'Search query' },
          {
            name: 'num',
            type: 'number' as const,
            required: false,
            description: 'Number of results (1-10)',
          },
        ],
        response: { status: 200, format: 'json' as const },
        cacheSeconds: 3600,
      },
    ],
  } as APIService,

  OPENAI_API: {
    name: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    authentication: { type: 'bearer' as const, header: 'Authorization' },
    endpoints: [
      {
        name: 'completions',
        method: 'POST' as const,
        path: '/chat/completions',
        description: 'Generate text with GPT',
        parameters: [
          { name: 'model', type: 'string' as const, required: true },
          { name: 'messages', type: 'array' as const, required: true },
          { name: 'temperature', type: 'number' as const, required: false },
        ],
        response: { status: 200, format: 'json' as const },
      },
    ],
  } as APIService,

  GITHUB_API: {
    name: 'github',
    baseUrl: 'https://api.github.com',
    authentication: { type: 'bearer' as const, header: 'Authorization' },
    endpoints: [
      {
        name: 'list-repos',
        method: 'GET' as const,
        path: '/user/repos',
        description: 'List user repositories',
        parameters: [
          { name: 'sort', type: 'string' as const, required: false },
          { name: 'per_page', type: 'number' as const, required: false },
        ],
        response: { status: 200, format: 'json' as const },
        cacheSeconds: 300,
      },
      {
        name: 'get-repo',
        method: 'GET' as const,
        path: '/repos/{owner}/{repo}',
        description: 'Get repository details',
        parameters: [
          { name: 'owner', type: 'string' as const, required: true },
          { name: 'repo', type: 'string' as const, required: true },
        ],
        response: { status: 200, format: 'json' as const },
        cacheSeconds: 600,
      },
    ],
  } as APIService,

  STRIPE_API: {
    name: 'stripe',
    baseUrl: 'https://api.stripe.com/v1',
    authentication: { type: 'bearer' as const, header: 'Authorization' },
    endpoints: [
      {
        name: 'create-payment-intent',
        method: 'POST' as const,
        path: '/payment_intents',
        description: 'Create a payment intent',
        parameters: [
          { name: 'amount', type: 'number' as const, required: true },
          { name: 'currency', type: 'string' as const, required: true },
        ],
        response: { status: 200, format: 'json' as const },
      },
      {
        name: 'list-charges',
        method: 'GET' as const,
        path: '/charges',
        description: 'List charges',
        parameters: [{ name: 'limit', type: 'number' as const, required: false }],
        response: { status: 200, format: 'json' as const },
        cacheSeconds: 60,
      },
    ],
  } as APIService,

  TWILIO_API: {
    name: 'twilio',
    baseUrl: 'https://api.twilio.com',
    authentication: { type: 'basic' as const },
    endpoints: [
      {
        name: 'send-sms',
        method: 'POST' as const,
        path: '/2010-04-01/Accounts/{account_sid}/Messages',
        description: 'Send SMS message',
        parameters: [
          { name: 'To', type: 'string' as const, required: true },
          { name: 'From', type: 'string' as const, required: true },
          { name: 'Body', type: 'string' as const, required: true },
        ],
        response: { status: 201, format: 'json' as const },
      },
    ],
  } as APIService,
}

/**
 * Create a universal combinator with all standard services
 */
export function createUniversalCombinator(): UniversalAPICombinator {
  const combinator = new UniversalAPICombinator()
  for (const service of Object.values(STANDARD_SERVICES)) {
    combinator.registerService(service)
  }
  return combinator
}
