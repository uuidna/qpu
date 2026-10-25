// WAVE 8A Integration
// Complete integration of API Gateway with Composition Engine

import { compositionEngine } from '../mcp-composition/composition-engine.js'
import { APIGateway } from './index.js'
import { RESTHandler } from './rest-handler.js'
import { GraphQLHandler } from './graphql-handler.js'
import { OpenAPIGenerator } from './openapi-generator.js'
import { RequestRouter } from './request-router.js'

/**
 * WAVE 8A: API Gateway System
 *
 * This module provides a complete API Gateway for the QPU platform:
 * - REST API with auto-generated endpoints
 * - GraphQL interface
 * - OpenAPI 3.1 specifications
 * - Authentication and authorization
 * - Rate limiting
 * - Response caching with ETag
 * - Content negotiation (JSON, XML, CSV, YAML)
 */

export interface WAVE8AConfig {
  // Server configuration
  host?: string
  port?: number

  // API Gateway configuration
  api_version?: string
  enable_rest?: boolean
  enable_graphql?: boolean
  enable_cache?: boolean
  cache_ttl?: number
  rate_limit_rpm?: number

  // Feature flags
  enable_openapi?: boolean
  enable_docs?: boolean
  enable_metrics?: boolean
}

export class WAVE8AAPIGateway {
  private apiGateway: APIGateway
  private config: WAVE8AConfig

  constructor(config: WAVE8AConfig = {}) {
    this.config = {
      host: config.host || 'localhost',
      port: config.port || 3000,
      api_version: config.api_version || '1.0.0',
      enable_rest: config.enable_rest ?? true,
      enable_graphql: config.enable_graphql ?? true,
      enable_cache: config.enable_cache ?? true,
      cache_ttl: config.cache_ttl || 300,
      rate_limit_rpm: config.rate_limit_rpm || 100,
      enable_openapi: config.enable_openapi ?? true,
      enable_docs: config.enable_docs ?? true,
      enable_metrics: config.enable_metrics ?? true
    }

    this.apiGateway = new APIGateway(compositionEngine, {
      version: this.config.api_version,
      enable_rest: this.config.enable_rest,
      enable_graphql: this.config.enable_graphql,
      enable_cache: this.config.enable_cache,
      cache_ttl: this.config.cache_ttl,
      rate_limit_rpm: this.config.rate_limit_rpm
    })
  }

  /**
   * Initialize WAVE 8A API Gateway
   */
  async initialize(): Promise<void> {
    console.log('WAVE 8A: Initializing API Gateway...')
    await this.apiGateway.initialize()
    console.log('WAVE 8A: API Gateway initialized')
    console.log(`  Version: ${this.config.api_version}`)
    console.log(`  REST: ${this.config.enable_rest ? 'enabled' : 'disabled'}`)
    console.log(`  GraphQL: ${this.config.enable_graphql ? 'enabled' : 'disabled'}`)
    console.log(`  Cache TTL: ${this.config.cache_ttl}s`)
    console.log(`  Rate Limit: ${this.config.rate_limit_rpm} requests/min`)
  }

  /**
   * Handle HTTP request
   */
  async handleRequest(request: any) {
    return this.apiGateway.handleRequest(request)
  }

  /**
   * Get OpenAPI specification
   */
  getOpenAPISpec(): any {
    return this.apiGateway.getOpenAPISpec()
  }

  /**
   * Get GraphQL schema
   */
  getGraphQLSchema(): string | undefined {
    return this.apiGateway.getGraphQLSchema()
  }

  /**
   * Get metrics
   */
  getMetrics(): any {
    return this.apiGateway.getMetrics()
  }
}

/**
 * REST API Example Endpoints
 *
 * These are auto-generated from MCP capabilities:
 *
 * Database Operations:
 * - GET    /api/v1/database/list?provider=postgresql
 * - POST   /api/v1/database/query
 * - PUT    /api/v1/database/update
 * - DELETE /api/v1/database/delete
 *
 * Filesystem Operations:
 * - GET    /api/v1/filesystem/read?path=/data
 * - POST   /api/v1/filesystem/write
 * - DELETE /api/v1/filesystem/delete
 *
 * Search Operations:
 * - POST   /api/v1/search/search
 * - GET    /api/v1/search/index
 *
 * AI Operations:
 * - POST   /api/v1/ai/analyze
 * - POST   /api/v1/ai/generate
 * - POST   /api/v1/ai/transform
 */

/**
 * GraphQL Schema Example
 *
 * The GraphQL schema is built from MCP capabilities:
 *
 * type Query {
 *   database: DatabaseQueries
 *   filesystem: FilesystemQueries
 *   search: SearchQueries
 *   ai: AIQueries
 * }
 *
 * type DatabaseQueries {
 *   list(params: JSON): [Database]
 *   query(params: JSON): QueryResult
 *   get(params: JSON): Row
 * }
 *
 * type FilesystemQueries {
 *   read(params: JSON): FileContent
 *   list(params: JSON): [File]
 *   stat(params: JSON): FileStats
 * }
 *
 * type Mutation {
 *   database: DatabaseMutations
 *   filesystem: FilesystemMutations
 * }
 *
 * type DatabaseMutations {
 *   create(params: JSON): Result
 *   update(params: JSON): Result
 *   delete(params: JSON): Result
 * }
 */

/**
 * Authentication Example
 *
 * API Key:
 *   curl -H "X-API-Key: dev_key_12345" https://api.qpu.dev/api/v1/database/list
 *
 * Bearer Token:
 *   curl -H "Authorization: Bearer token123" https://api.qpu.dev/api/v1/database/list
 *
 * User ID (for testing):
 *   curl -H "X-User-ID: user123" https://api.qpu.dev/api/v1/database/list
 */

/**
 * Rate Limiting Example
 *
 * Each API key has a rate limit:
 *   - 100 requests/minute (default)
 *   - Token bucket algorithm with burst support
 *   - Returns 429 Too Many Requests when exceeded
 *
 * Response headers:
 *   X-RateLimit-Remaining: 99
 *   X-RateLimit-Reset: 1234567890
 *   Retry-After: 60
 */

/**
 * Caching Example
 *
 * GET requests are cached automatically:
 *   - ETag: SHA256 hash of response
 *   - Cache-Control: public, max-age=300
 *   - 304 Not Modified for unchanged responses
 *   - Configurable TTL (default: 5 minutes)
 *
 * Request with ETag:
 *   GET /api/v1/database/list
 *   If-None-Match: "abc123def456"
 *   → 304 Not Modified
 */

/**
 * Content Negotiation Example
 *
 * Request different formats:
 *   Accept: application/json     → JSON response
 *   Accept: application/xml      → XML response
 *   Accept: text/csv             → CSV response
 *   Accept: text/yaml            → YAML response
 *
 * Custom transformations based on Accept-Encoding:
 *   Accept-Encoding: gzip        → gzip compressed response
 *   Accept-Encoding: deflate     → deflate compressed response
 */

/**
 * Error Handling Example
 *
 * 400 Bad Request:
 *   { error: "Bad Request", message: "Invalid parameters" }
 *
 * 401 Unauthorized:
 *   { error: "Unauthorized", message: "API key required" }
 *
 * 404 Not Found:
 *   { error: "Not Found", message: "Endpoint not found" }
 *
 * 429 Too Many Requests:
 *   { error: "Too Many Requests", message: "Rate limit exceeded" }
 *
 * 500 Internal Server Error:
 *   { error: "Internal Server Error", message: "Server error" }
 */

/**
 * Integration Points
 *
 * 1. Composition Engine
 *    - Executes MCP compositions
 *    - Manages workflow execution
 *    - Coordinates across MCPs
 *
 * 2. MCP Discovery
 *    - Discovers available MCPs
 *    - Lists tools and resources
 *    - Monitors MCP health
 *
 * 3. Authentication System
 *    - Manages API keys
 *    - Validates bearer tokens
 *    - Tracks permissions
 *
 * 4. Database
 *    - Stores workflows
 *    - Audit logging
 *    - Request history
 *
 * 5. Caching Layer
 *    - Response caching
 *    - ETag support
 *    - Cache invalidation
 */

export const createWAVE8AGateway = (config?: WAVE8AConfig): WAVE8AAPIGateway => {
  return new WAVE8AAPIGateway(config)
}

// Export main class for direct usage
export { WAVE8AAPIGateway }
