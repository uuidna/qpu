// WAVE 8A Integration Example
// Demonstrates how to use the API Gateway with the Composition Engine

import { compositionEngine } from '../mcp-composition/composition-engine.js'
import { APIGateway } from './index.js'
import { RequestRouter } from './request-router.js'
import type { HTTPRequest } from './request-router.js'

/**
 * Example: Setting up the API Gateway
 */
async function setupAPIGateway() {
  console.log('=== WAVE 8A: API Gateway Setup ===\n')

  // Initialize composition engine first
  await compositionEngine.initialize()
  console.log('Composition Engine: initialized')

  // Create API Gateway
  const apiGateway = new APIGateway(compositionEngine, {
    version: '1.0.0',
    enable_rest: true,
    enable_graphql: true,
    enable_cache: true,
    cache_ttl: 300,
    rate_limit_rpm: 100
  })

  // Initialize gateway
  await apiGateway.initialize()
  console.log('API Gateway: initialized\n')

  return apiGateway
}

/**
 * Example: REST API Request
 */
async function exampleRESTRequest(apiGateway: APIGateway) {
  console.log('=== Example: REST API Request ===\n')

  const request: HTTPRequest = {
    method: 'POST',
    path: '/api/v1/database/query',
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'dev_key_12345',
      'x-user-id': 'user123'
    },
    body: {
      provider: 'postgresql',
      sql: 'SELECT * FROM users WHERE age > ?',
      params: [18]
    }
  }

  const response = await apiGateway.handleRequest(request)
  console.log('Request:', {
    method: request.method,
    path: request.path
  })
  console.log('Response Status:', response.status)
  console.log('Response Body:', response.body)
  console.log()
}

/**
 * Example: GraphQL Query
 */
async function exampleGraphQLQuery(apiGateway: APIGateway) {
  console.log('=== Example: GraphQL Query ===\n')

  const request: HTTPRequest = {
    method: 'POST',
    path: '/api/graphql',
    headers: {
      'content-type': 'application/json',
      'x-api-key': 'dev_key_12345'
    },
    body: {
      query: `
        query GetDatabaseInfo {
          database {
            query(params: { sql: "SELECT COUNT(*) FROM users" }) {
              rows
              count
            }
          }
          filesystem {
            read(params: { path: "/data" }) {
              content
              size
            }
          }
        }
      `
    }
  }

  const response = await apiGateway.handleRequest(request)
  console.log('GraphQL Query executed')
  console.log('Response Status:', response.status)
  console.log('Response Body:', response.body)
  console.log()
}

/**
 * Example: OpenAPI Schema
 */
async function exampleOpenAPISchema(apiGateway: APIGateway) {
  console.log('=== Example: OpenAPI Schema ===\n')

  const request: HTTPRequest = {
    method: 'GET',
    path: '/api/v1/schema',
    headers: {
      'accept': 'application/json',
      'x-api-key': 'dev_key_12345'
    }
  }

  const response = await apiGateway.handleRequest(request)
  console.log('OpenAPI Schema retrieved')
  console.log('Response Status:', response.status)
  console.log('Schema Info:', {
    openapi: response.body.openapi,
    title: response.body.info?.title,
    version: response.body.info?.version,
    paths: Object.keys(response.body.paths || {}).length
  })
  console.log()
}

/**
 * Example: GraphQL Schema
 */
async function exampleGraphQLSchema(apiGateway: APIGateway) {
  console.log('=== Example: GraphQL Schema ===\n')

  const schema = apiGateway.getGraphQLSchema()
  if (schema) {
    console.log('GraphQL Schema (first 500 chars):')
    console.log(schema.substring(0, 500))
    console.log('...')
  }
  console.log()
}

/**
 * Example: Health Check
 */
async function exampleHealthCheck(apiGateway: APIGateway) {
  console.log('=== Example: Health Check ===\n')

  const request: HTTPRequest = {
    method: 'GET',
    path: '/health',
    headers: {}
  }

  const response = await apiGateway.handleRequest(request)
  console.log('Health Check Response:')
  console.log(response.body)
  console.log()
}

/**
 * Example: Request with Different Accept Header
 */
async function exampleContentNegotiation(apiGateway: APIGateway) {
  console.log('=== Example: Content Negotiation ===\n')

  // Request with XML format
  const xmlRequest: HTTPRequest = {
    method: 'GET',
    path: '/api/v1/database/list',
    headers: {
      'accept': 'application/xml',
      'x-api-key': 'dev_key_12345'
    }
  }

  const xmlResponse = await apiGateway.handleRequest(xmlRequest)
  console.log('XML Format Request:')
  console.log('Content-Type:', xmlResponse.headers['content-type'])
  console.log()

  // Request with CSV format
  const csvRequest: HTTPRequest = {
    method: 'GET',
    path: '/api/v1/database/list',
    headers: {
      'accept': 'text/csv',
      'x-api-key': 'dev_key_12345'
    }
  }

  const csvResponse = await apiGateway.handleRequest(csvRequest)
  console.log('CSV Format Request:')
  console.log('Content-Type:', csvResponse.headers['content-type'])
  console.log()
}

/**
 * Example: Caching with ETag
 */
async function exampleCaching(apiGateway: APIGateway) {
  console.log('=== Example: Caching with ETag ===\n')

  // First request
  const request1: HTTPRequest = {
    method: 'GET',
    path: '/api/v1/database/list',
    headers: {
      'x-api-key': 'dev_key_12345'
    }
  }

  const response1 = await apiGateway.handleRequest(request1)
  console.log('First Request:')
  console.log('Status:', response1.status)
  console.log('ETag:', response1.headers['etag'])
  console.log()

  // Second request with If-None-Match
  const etag = response1.headers['etag']
  const request2: HTTPRequest = {
    method: 'GET',
    path: '/api/v1/database/list',
    headers: {
      'x-api-key': 'dev_key_12345',
      'if-none-match': etag
    }
  }

  const response2 = await apiGateway.handleRequest(request2)
  console.log('Second Request (with ETag):')
  console.log('Status:', response2.status, response2.status === 304 ? '(Not Modified)' : '')
  console.log()
}

/**
 * Example: Authentication
 */
async function exampleAuthentication(apiGateway: APIGateway) {
  console.log('=== Example: Authentication ===\n')

  // Request without API key
  const unauthRequest: HTTPRequest = {
    method: 'GET',
    path: '/api/v1/database/list',
    headers: {}
  }

  const unauthResponse = await apiGateway.handleRequest(unauthRequest)
  console.log('Request without API Key:')
  console.log('Status:', unauthResponse.status, '(Unauthorized)')
  console.log()

  // Request with API key
  const authRequest: HTTPRequest = {
    method: 'GET',
    path: '/api/v1/database/list',
    headers: {
      'x-api-key': 'dev_key_12345'
    }
  }

  const authResponse = await apiGateway.handleRequest(authRequest)
  console.log('Request with API Key:')
  console.log('Status:', authResponse.status)
  console.log()
}

/**
 * Example: Metrics
 */
async function exampleMetrics(apiGateway: APIGateway) {
  console.log('=== Example: Metrics ===\n')

  const metrics = apiGateway.getMetrics()
  console.log('API Gateway Metrics:')
  console.log('Requests:', metrics.requests)
  console.log('Cache Stats:', metrics.cache)
  console.log('Rate Limit Stats:', metrics.rate_limit)
  console.log()
}

/**
 * Main: Run all examples
 */
async function main() {
  try {
    // Setup API Gateway
    const apiGateway = await setupAPIGateway()

    // Run examples
    await exampleHealthCheck(apiGateway)
    await exampleAuthentication(apiGateway)
    await exampleRESTRequest(apiGateway)
    await exampleGraphQLQuery(apiGateway)
    await exampleOpenAPISchema(apiGateway)
    await exampleGraphQLSchema(apiGateway)
    await exampleContentNegotiation(apiGateway)
    await exampleCaching(apiGateway)
    await exampleMetrics(apiGateway)

    console.log('=== All Examples Complete ===')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Export for testing
export {
  setupAPIGateway,
  exampleRESTRequest,
  exampleGraphQLQuery,
  exampleOpenAPISchema,
  exampleGraphQLSchema,
  exampleHealthCheck,
  exampleContentNegotiation,
  exampleCaching,
  exampleAuthentication,
  exampleMetrics
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
