# WAVE 8A API Gateway - Quick Start Guide

## Installation

The API Gateway is located in `src/api-gateway/` and is fully integrated with the Composition Engine.

## Basic Usage

### 1. Initialize the API Gateway

```typescript
import { compositionEngine } from '../mcp-composition/composition-engine'
import { APIGateway } from './index'

// Create and initialize gateway
const gateway = new APIGateway(compositionEngine, {
  version: '1.0.0',
  enable_rest: true,
  enable_graphql: true,
  enable_cache: true,
  cache_ttl: 300,
  rate_limit_rpm: 100
})

await gateway.initialize()
```

### 2. Handle REST Requests

```typescript
// Make a REST request
const response = await gateway.handleRequest({
  method: 'POST',
  path: '/api/v1/database/query',
  headers: {
    'content-type': 'application/json',
    'x-api-key': 'dev_key_12345'
  },
  body: {
    provider: 'postgresql',
    sql: 'SELECT * FROM users'
  }
})

console.log(response.status)  // 200
console.log(response.body)    // Query results
```

### 3. Handle GraphQL Queries

```typescript
// Execute GraphQL query
const response = await gateway.handleRequest({
  method: 'POST',
  path: '/api/graphql',
  headers: {
    'content-type': 'application/json',
    'x-api-key': 'dev_key_12345'
  },
  body: {
    query: `
      query {
        database {
          query(params: { sql: "SELECT * FROM users" }) {
            rows
            count
          }
        }
      }
    `
  }
})
```

### 4. Get API Specifications

```typescript
// Get OpenAPI specification
const openApiSpec = gateway.getOpenAPISpec()
console.log(openApiSpec.paths)  // All available endpoints

// Get GraphQL schema
const gqlSchema = gateway.getGraphQLSchema()
console.log(gqlSchema)  // Full GraphQL schema

// Get metrics
const metrics = gateway.getMetrics()
console.log(metrics.requests)  // Request counts by endpoint
console.log(metrics.cache)     // Cache statistics
```

## REST API Examples

### Authentication

```bash
# Using API Key
curl -H "X-API-Key: dev_key_12345" \
  http://localhost:3000/api/v1/database/list

# Using Bearer Token
curl -H "Authorization: Bearer token123" \
  http://localhost:3000/api/v1/database/list
```

### Query Operations

```bash
# List databases
GET /api/v1/database/list

# Execute query
POST /api/v1/database/query
{
  "provider": "postgresql",
  "sql": "SELECT * FROM users"
}

# Update data
PUT /api/v1/database/update
{
  "table": "users",
  "id": "123",
  "data": { "name": "John" }
}

# Delete data
DELETE /api/v1/database/delete
{
  "table": "users",
  "id": "123"
}
```

### Content Negotiation

```bash
# JSON (default)
curl -H "Accept: application/json" \
  http://localhost:3000/api/v1/database/list

# XML
curl -H "Accept: application/xml" \
  http://localhost:3000/api/v1/database/list

# CSV
curl -H "Accept: text/csv" \
  http://localhost:3000/api/v1/database/list

# YAML
curl -H "Accept: text/yaml" \
  http://localhost:3000/api/v1/database/list
```

### Caching

```bash
# First request
curl -i http://localhost:3000/api/v1/database/list
# Returns: 200 OK with ETag header

# Second request with ETag
curl -H "If-None-Match: \"abc123\"" \
  http://localhost:3000/api/v1/database/list
# Returns: 304 Not Modified
```

## GraphQL Examples

### Simple Query

```graphql
query {
  database {
    list(params: { provider: "postgresql" }) {
      id
      name
    }
  }
}
```

### Query with Parameters

```graphql
query GetUsers($limit: Int, $offset: Int) {
  database {
    query(params: {
      sql: "SELECT * FROM users LIMIT ? OFFSET ?"
      params: [$limit, $offset]
    }) {
      rows
      count
    }
  }
}
```

### Mutation

```graphql
mutation CreateUser {
  database {
    create(params: {
      table: "users"
      data: {
        name: "John Doe"
        email: "john@example.com"
      }
    }) {
      success
      id
    }
  }
}
```

### Introspection

```graphql
query IntrospectSchema {
  __schema {
    types {
      name
      kind
      fields {
        name
        type {
          name
        }
      }
    }
  }
}
```

## Configuration Options

```typescript
interface RouterConfig {
  version: string           // API version (e.g., '1.0.0')
  enable_rest: boolean      // Enable REST endpoints
  enable_graphql: boolean   // Enable GraphQL endpoint
  enable_cache: boolean     // Enable response caching
  cache_ttl: number        // Cache TTL in seconds
  rate_limit_rpm: number   // Rate limit: requests per minute
}
```

## Authentication Methods

### API Key

```typescript
const context = auth.authenticateRequest({
  'x-api-key': 'dev_key_12345'
})
// context.authenticated = true
// context.permissions = ['read', 'write', 'admin']
```

### Bearer Token

```typescript
const context = auth.authenticateRequest({
  'authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...'
})
// context.authenticated = true
// context.permissions = ['read', 'write']
```

### User ID (Development)

```typescript
const context = auth.authenticateRequest({
  'x-user-id': 'user123'
})
// context.authenticated = true
// context.userId = 'user123'
```

## Rate Limiting

```typescript
// Token bucket algorithm
const status = rateLimiter.checkLimit('api_key_123', 1)

if (status.limited) {
  // Return 429 Too Many Requests
  console.log(`Retry after ${status.retry_after} seconds`)
} else {
  // Allow request
  console.log(`${status.remaining} requests remaining`)
}
```

## Response Format

### Success (200 OK)

```json
{
  "success": true,
  "data": { ... },
  "timestamp": 1234567890
}
```

### Error (4xx/5xx)

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "status": 400,
  "timestamp": 1234567890
}
```

### Rate Limited (429)

```json
{
  "error": "Too Many Requests",
  "status": 429,
  "timestamp": 1234567890
}
```

## Middleware Pipeline

The gateway applies middleware in this order:

1. **Authentication** - Validate API key or Bearer token
2. **Rate Limiting** - Check request limit
3. **Cache Check** - Return cached response if available
4. **Handler** - Execute REST or GraphQL handler
5. **Transform** - Convert response to requested format
6. **Cache Store** - Store response in cache
7. **Headers** - Add response headers (ETags, Cache-Control, etc.)

## Health Check

```bash
curl http://localhost:3000/health

Response:
{
  "status": "ok",
  "timestamp": 1234567890,
  "uptime": 3600,
  "version": "1.0.0",
  "handlers": {
    "rest": true,
    "graphql": true,
    "cache": true
  }
}
```

## API Schema

```bash
# Get OpenAPI spec (JSON)
curl http://localhost:3000/api/v1/schema

# Get OpenAPI spec (YAML)
curl -H "Accept: application/yaml" http://localhost:3000/api/v1/schema

# Get GraphQL schema
curl -X POST http://localhost:3000/api/graphql \
  -d '{ "query": "{ __schema { types { name } } }" }'
```

## Integration with Composition Engine

The API Gateway automatically:

1. **Discovers MCPs** - Uses composition engine's capability list
2. **Generates Endpoints** - Creates REST endpoints for each capability
3. **Maps Operations** - HTTP methods to MCP operations
4. **Executes Compositions** - Routes requests through composition engine
5. **Transforms Results** - Converts composition results to API responses

Example flow:

```
REST Request
  ↓
Match endpoint: POST /api/v1/database/query
  ↓
Build composition request with step:
  { mcp: 'database', operation: 'query', params: {...} }
  ↓
Execute through composition engine
  ↓
Transform result to REST response
  ↓
Cache result (if cacheable)
  ↓
Return HTTP response
```

## Common Tasks

### Register New API Key

```typescript
const auth = new AuthMiddleware()
auth.initialize()

const apiKey = auth.registerAPIKey(
  'my-client',
  ['read', 'write'],
  1000  // rate limit: 1000 requests/minute
)

console.log(apiKey)  // 'api_key_xxxx...'
```

### Clear Cache

```typescript
const cache = new CacheManager()
cache.clear()
console.log('Cache cleared')
```

### Reset Rate Limit

```typescript
const limiter = new RateLimiter()
limiter.resetLimit('api_key_123')
console.log('Rate limit reset')
```

### Get Cache Statistics

```typescript
const stats = cache.getStats()
console.log(`Cache size: ${stats.size} entries`)
console.log(`Total bytes: ${stats.total_bytes}`)
```

## Troubleshooting

### 401 Unauthorized

- Check API key is provided and valid
- API key must be in `X-API-Key` header or Bearer token in `Authorization` header

### 429 Too Many Requests

- Rate limit exceeded for API key
- Check `Retry-After` header for when to retry
- Contact support to increase rate limit

### 404 Not Found

- Endpoint does not exist
- Check path is correct (e.g., `/api/v1/{mcp}/{operation}`)
- Use `/api/v1/schema` to see available endpoints

### 500 Internal Server Error

- Composition engine error
- Check request parameters
- Review server logs for details

## Next Steps

1. Integrate with your HTTP server (Express, Fastify, etc.)
2. Configure rate limits for your use case
3. Set up authentication for your clients
4. Monitor API usage via metrics endpoint
5. Implement custom middleware if needed

## Further Reading

- See `README.md` for detailed documentation
- See `integration-example.ts` for code examples
- See `wave8a-integration.ts` for architecture overview
