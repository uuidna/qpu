// API Gateway - Main Entry Point
// Orchestrates all API handlers and middleware

import type { CompositionEngine } from '../mcp-composition/composition-engine.js'
import { RESTHandler } from './rest-handler.js'
import { GraphQLHandler } from './graphql-handler.js'
import { OpenAPIGenerator } from './openapi-generator.js'
import { RequestRouter, type RouterConfig, type HTTPRequest, type HTTPResponse } from './request-router.js'
import { AuthMiddleware } from './middleware/auth.js'
import { RateLimiter, DistributedRateLimiter } from './middleware/rate-limit.js'
import { CacheManager, CacheKeyGenerator, HTTPCacheDirective } from './middleware/cache.js'
import { RequestTransformer, ResponseTransformer, ContentNegotiation, DataProjection } from './middleware/transform.js'

export class APIGateway {
  private compositionEngine: CompositionEngine
  private router: RequestRouter
  private config: RouterConfig

  constructor(
    compositionEngine: CompositionEngine,
    config?: Partial<RouterConfig>
  ) {
    this.compositionEngine = compositionEngine
    this.config = {
      version: config?.version || '1.0.0',
      enable_rest: config?.enable_rest ?? true,
      enable_graphql: config?.enable_graphql ?? true,
      enable_cache: config?.enable_cache ?? true,
      cache_ttl: config?.cache_ttl || 300,
      rate_limit_rpm: config?.rate_limit_rpm || 100
    }
    this.router = new RequestRouter(compositionEngine, this.config)
  }

  // Initialize API Gateway
  async initialize(): Promise<void> {
    await this.compositionEngine.initialize()
    await this.router.initialize()
    console.log('API Gateway: initialized')
  }

  // Handle incoming HTTP request
  async handleRequest(request: HTTPRequest): Promise<HTTPResponse> {
    return this.router.route(request)
  }

  // Get OpenAPI specification
  getOpenAPISpec(): any {
    return this.router.getOpenAPISpec()
  }

  // Get GraphQL schema
  getGraphQLSchema(): string | undefined {
    return this.router.getGraphQLSchema()
  }

  // Get metrics
  getMetrics(): any {
    return this.router.getMetrics()
  }

  // Update configuration
  updateConfig(config: Partial<RouterConfig>): void {
    Object.assign(this.config, config)
  }
}

// Export all handlers and middleware
export {
  RESTHandler,
  GraphQLHandler,
  OpenAPIGenerator,
  RequestRouter,
  AuthMiddleware,
  RateLimiter,
  DistributedRateLimiter,
  CacheManager,
  CacheKeyGenerator,
  HTTPCacheDirective,
  RequestTransformer,
  ResponseTransformer,
  ContentNegotiation,
  DataProjection
}

// Export types
export type {
  RouterConfig,
  HTTPRequest,
  HTTPResponse
}

// Create default instance
export const createAPIGateway = (
  compositionEngine: CompositionEngine,
  config?: Partial<RouterConfig>
): APIGateway => {
  return new APIGateway(compositionEngine, config)
}
