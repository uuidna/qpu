// Request Router
// Routes requests to appropriate handlers and applies middleware

import { RESTHandler, type RESTRequest, type RESTResponse } from './rest-handler.js'
import { GraphQLHandler, type GraphQLQuery, type GraphQLResponse } from './graphql-handler.js'
import { OpenAPIGenerator } from './openapi-generator.js'
import { AuthMiddleware, type AuthContext } from './middleware/auth.js'
import { RateLimiter } from './middleware/rate-limit.js'
import { CacheManager, CacheKeyGenerator, HTTPCacheDirective } from './middleware/cache.js'
import { RequestTransformer, ResponseTransformer, ContentNegotiation } from './middleware/transform.js'
import type { CompositionEngine } from '../mcp-composition/composition-engine.js'

export interface RouterConfig {
  version: string
  enable_rest: boolean
  enable_graphql: boolean
  enable_cache: boolean
  cache_ttl: number
  rate_limit_rpm: number
}

export interface HTTPRequest {
  method: string
  path: string
  headers: Record<string, string>
  query?: Record<string, string | string[]>
  body?: any
}

export interface HTTPResponse {
  status: number
  headers: Record<string, string>
  body: any
}

export class RequestRouter {
  private compositionEngine: CompositionEngine
  private config: RouterConfig
  private restHandler?: RESTHandler
  private graphqlHandler?: GraphQLHandler
  private openApiGenerator?: OpenAPIGenerator
  private authMiddleware: AuthMiddleware
  private rateLimiter: RateLimiter
  private cacheManager: CacheManager
  private requestMetrics: Map<string, number> = new Map()

  constructor(
    compositionEngine: CompositionEngine,
    config: RouterConfig = {
      version: '1.0.0',
      enable_rest: true,
      enable_graphql: true,
      enable_cache: true,
      cache_ttl: 300,
      rate_limit_rpm: 100
    }
  ) {
    this.compositionEngine = compositionEngine
    this.config = config
    this.authMiddleware = new AuthMiddleware()
    this.rateLimiter = new RateLimiter({
      requests_per_minute: config.rate_limit_rpm,
      requests_per_hour: config.rate_limit_rpm * 60
    })
    this.cacheManager = new CacheManager({
      ttl: config.cache_ttl,
      etag: true
    })
  }

  async initialize(): Promise<void> {
    // Initialize auth
    this.authMiddleware.initialize()

    if (this.config.enable_rest) {
      // Initialize REST handler
      this.restHandler = new RESTHandler(this.compositionEngine)
      await this.restHandler.initialize()

      // Initialize OpenAPI generator
      this.openApiGenerator = new OpenAPIGenerator(this.compositionEngine)
      await this.openApiGenerator.initialize(this.restHandler.listEndpoints())
    }

    if (this.config.enable_graphql) {
      // Initialize GraphQL handler
      this.graphqlHandler = new GraphQLHandler(this.compositionEngine)
      await this.graphqlHandler.initialize()
    }

    console.log('Request Router: initialized')
  }

  // Route incoming request
  async route(request: HTTPRequest): Promise<HTTPResponse> {
    try {
      // Authenticate request
      const authContext = this.authMiddleware.authenticateRequest(request.headers)

      // Check rate limit
      const apiKey = request.headers['x-api-key']
      if (apiKey) {
        const limitStatus = this.rateLimiter.checkLimit(apiKey, 1)
        if (limitStatus.limited) {
          return this.errorResponse(429, 'Too Many Requests', {
            'retry-after': limitStatus.retry_after?.toString() || '60'
          })
        }
      }

      // Record metrics
      this.recordMetric(request.path)

      // Route based on path
      if (request.path === '/health') {
        return this.healthCheck()
      }

      if (request.path === '/api/v1/schema' || request.path === '/api/schema') {
        return this.schemaResponse(request.headers)
      }

      if (request.path.startsWith('/api/graphql') || request.path === '/graphql') {
        return this.routeGraphQL(request, authContext)
      }

      if (request.path.startsWith('/api/v1/')) {
        return this.routeREST(request, authContext)
      }

      return this.errorResponse(404, 'Not Found')
    } catch (error) {
      console.error('Router error:', error)
      return this.errorResponse(500, 'Internal Server Error')
    }
  }

  // Route REST request
  private async routeREST(request: HTTPRequest, authContext: AuthContext): Promise<HTTPResponse> {
    if (!this.restHandler) {
      return this.errorResponse(501, 'REST handler not enabled')
    }

    // Check authorization
    if (!authContext.authenticated) {
      return this.errorResponse(401, 'Unauthorized')
    }

    // Generate cache key
    const cacheKey = CacheKeyGenerator.generateKey(
      request.method,
      request.path,
      request.query,
      request.headers
    )

    // Check cache for GET requests
    if (request.method === 'GET' && this.config.enable_cache) {
      const cached = this.cacheManager.get(cacheKey)
      if (cached) {
        // Check ETag
        const ifNoneMatch = request.headers['if-none-match']
        if (ifNoneMatch === cached.etag) {
          return {
            status: 304,
            headers: { 'etag': cached.etag },
            body: null
          }
        }

        return {
          status: 200,
          headers: {
            'content-type': 'application/json',
            'etag': cached.etag,
            'cache-control': HTTPCacheDirective.generateDirective({
              public: true,
              max_age: this.config.cache_ttl
            })
          },
          body: cached.value
        }
      }
    }

    // Execute REST request
    const restRequest: RESTRequest = {
      method: request.method,
      path: request.path,
      query: request.query as Record<string, string | string[]>,
      body: request.body,
      headers: request.headers
    }

    const restResponse = await this.restHandler.handleRequest(restRequest)

    // Cache successful GET responses
    if (request.method === 'GET' && restResponse.status === 200 && this.config.enable_cache) {
      const entry = this.cacheManager.set(cacheKey, restResponse.body, this.config.cache_ttl)
      restResponse.headers['etag'] = entry.etag
    }

    return {
      status: restResponse.status,
      headers: restResponse.headers,
      body: restResponse.body
    }
  }

  // Route GraphQL request
  private async routeGraphQL(request: HTTPRequest, authContext: AuthContext): Promise<HTTPResponse> {
    if (!this.graphqlHandler) {
      return this.errorResponse(501, 'GraphQL handler not enabled')
    }

    // Check authorization
    if (!authContext.authenticated) {
      return this.errorResponse(401, 'Unauthorized')
    }

    // Parse GraphQL query from body
    let graphqlQuery: GraphQLQuery

    if (request.method === 'GET' && request.query) {
      // GET request - query from query string
      graphqlQuery = {
        query: (request.query.query as string) || '',
        variables: request.query.variables ? JSON.parse(request.query.variables as string) : undefined
      }
    } else if (request.method === 'POST') {
      // POST request - query from body
      graphqlQuery = request.body || {}
    } else {
      return this.errorResponse(400, 'Bad Request')
    }

    // Execute GraphQL query
    const response = await this.graphqlHandler.handleRequest(graphqlQuery)

    return {
      status: response.errors ? 400 : 200,
      headers: { 'content-type': 'application/json' },
      body: response
    }
  }

  // Health check endpoint
  private healthCheck(): HTTPResponse {
    return {
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: {
        status: 'ok',
        timestamp: Date.now(),
        uptime: process.uptime(),
        version: this.config.version,
        handlers: {
          rest: this.config.enable_rest,
          graphql: this.config.enable_graphql,
          cache: this.config.enable_cache
        }
      }
    }
  }

  // Schema response
  private schemaResponse(headers: Record<string, string>): HTTPResponse {
    if (!this.openApiGenerator) {
      return this.errorResponse(501, 'OpenAPI not enabled')
    }

    // Determine format from Accept header
    const format = ContentNegotiation.negotiate(headers['accept'] || '', [
      'application/json',
      'application/yaml'
    ])

    if (format?.includes('yaml')) {
      return {
        status: 200,
        headers: { 'content-type': 'application/yaml' },
        body: this.openApiGenerator.getSpecYAML()
      }
    }

    return {
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: this.openApiGenerator.getSpec()
    }
  }

  // Error response
  private errorResponse(status: number, message: string, headers?: Record<string, string>): HTTPResponse {
    return {
      status,
      headers: {
        'content-type': 'application/json',
        ...headers
      },
      body: {
        error: message,
        status,
        timestamp: Date.now()
      }
    }
  }

  // Record metrics
  private recordMetric(path: string): void {
    const count = (this.requestMetrics.get(path) || 0) + 1
    this.requestMetrics.set(path, count)
  }

  // Get metrics
  getMetrics(): {
    requests: Record<string, number>
    cache: any
    rate_limit: any
  } {
    return {
      requests: Object.fromEntries(this.requestMetrics),
      cache: this.cacheManager.getStats(),
      rate_limit: this.rateLimiter.getStats()
    }
  }

  // Get OpenAPI spec
  getOpenAPISpec(): any {
    return this.openApiGenerator?.getSpec()
  }

  // Get GraphQL schema
  getGraphQLSchema(): string | undefined {
    return this.graphqlHandler?.getSchema()
  }
}
