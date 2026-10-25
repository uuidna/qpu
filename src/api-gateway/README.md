# API Gateway (WAVE 8A)

Universal API Gateway for MCP Compositions - provides REST, GraphQL, and OpenAPI interfaces.

## Features

- **REST Handler**: Auto-generates REST endpoints from MCP compositions
- **GraphQL Handler**: Provides GraphQL query and mutation interface
- **OpenAPI Generator**: Generates OpenAPI 3.1 specifications
- **Authentication Middleware**: API key and Bearer token support
- **Rate Limiting**: Token bucket and sliding window algorithms
- **Caching**: ETag support, cache-control directives, automatic eviction
- **Content Negotiation**: JSON, XML, CSV, YAML support
- **Request Routing**: Intelligent routing to composition engine

## Architecture

```
HTTP Request
    ↓
[Request Router]
    ↓
[Auth Middleware] → [Rate Limiter] → [Cache Check]
    ↓
[REST | GraphQL | OpenAPI]
    ↓
[Composition Engine]
    ↓
[Response Transform] → [Cache Store] → HTTP Response
```

## Usage

### Basic Setup

```typescript
import { compositionEngine } from '../mcp-composition/composition-engine.js'
import { APIGateway } from './index.js'

// Create API Gateway
const apiGateway = new APIGateway(compositionEngine, {
  version: '1.0.0',
  enable_rest: true,
  enable_graphql: true,
  enable_cache: true,
  cache_ttl: 300,
  rate_limit_rpm: 100
})

// Initialize
await apiGateway.initialize()
```

### REST Endpoints

Auto-generated from MCP capabilities:

```bash
# List databases
GET /api/v1/database/list?provider=postgresql

# Execute query
POST /api/v1/database/query
Content-Type: application/json

{
  "provider": "postgresql",
  "sql": "SELECT * FROM users"
}

# Update data
PUT /api/v1/database/update
Content-Type: application/json

{
  "table": "users",
  "data": { "name": "John" }
}

# Delete data
DELETE /api/v1/database/delete
Content-Type: application/json

{
  "table": "users",
  "id": "123"
}
```

### GraphQL Queries

```graphql
query {
  database {
    query(params: { sql: "SELECT * FROM users" }) {
      rows
      count
    }
  }
  filesystem {
    read(params: { path: "/data/file.txt" }) {
      content
      size
    }
  }
}
```

### Authentication

Two authentication methods:

1. **API Key** (Header)
```bash
curl -H "X-API-Key: dev_key_12345" \
  https://api.qpu.dev/api/v1/database/query
```

2. **Bearer Token** (JWT)
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  https://api.qpu.dev/api/v1/database/query
```

### Content Negotiation

Request different formats using Accept header:

```bash
# JSON (default)
curl -H "Accept: application/json" \
  https://api.qpu.dev/api/v1/database/list

# XML
curl -H "Accept: application/xml" \
  https://api.qpu.dev/api/v1/database/list

# CSV
curl -H "Accept: text/csv" \
  https://api.qpu.dev/api/v1/database/list

# YAML
curl -H "Accept: text/yaml" \
  https://api.qpu.dev/api/v1/database/list
```

### Caching

Responses are automatically cached with ETag support:

```bash
# First request - full response with ETag
GET /api/v1/database/query
→ 200 OK
→ ETag: "abc123def456"
→ Cache-Control: public, max-age=300

# Second request with If-None-Match
GET /api/v1/database/query
If-None-Match: "abc123def456"
→ 304 Not Modified
```

### Rate Limiting

Rate limits are enforced per API key:

```bash
# Request within limit
→ 200 OK
→ X-RateLimit-Remaining: 99

# Request exceeds limit
→ 429 Too Many Requests
→ Retry-After: 60
```

## Modules

### rest-handler.ts

Generates REST endpoints from MCP compositions.

**Key Classes:**
- `RESTHandler`: Handles REST requests and generates endpoints
- Supports GET, POST, PUT, DELETE, PATCH methods
- Automatic parameter extraction from path and query

**Example:**
```typescript
const handler = new RESTHandler(compositionEngine)
await handler.initialize()
const response = await handler.handleRequest({
  method: 'POST',
  path: '/api/v1/database/query',
  body: { sql: 'SELECT * FROM users' }
})
```

### graphql-handler.ts

Provides GraphQL query and mutation interface.

**Key Classes:**
- `GraphQLHandler`: Handles GraphQL queries and mutations
- Builds schema from MCP capabilities
- Supports introspection queries

**Example:**
```typescript
const handler = new GraphQLHandler(compositionEngine)
await handler.initialize()
const response = await handler.handleRequest({
  query: `query { database { query(params: {sql: "SELECT *"}) { rows } } }`
})
```

### openapi-generator.ts

Generates OpenAPI 3.1 specifications.

**Key Classes:**
- `OpenAPIGenerator`: Generates OpenAPI specs from endpoints
- Supports JSON and YAML formats
- Generates API documentation

**Example:**
```typescript
const generator = new OpenAPIGenerator(compositionEngine)
await generator.initialize(endpoints)
const spec = generator.getSpec()
const yaml = generator.getSpecYAML()
```

### request-router.ts

Routes requests to appropriate handlers.

**Key Classes:**
- `RequestRouter`: Routes requests to handlers
- Applies authentication and rate limiting
- Handles caching and content negotiation

**Example:**
```typescript
const router = new RequestRouter(compositionEngine, config)
await router.initialize()
const response = await router.route(request)
```

### middleware/auth.ts

Authentication and authorization middleware.

**Key Classes:**
- `AuthMiddleware`: Authenticates requests with API keys and Bearer tokens
- Manages API key permissions
- Supports rate limit per key

**Example:**
```typescript
const auth = new AuthMiddleware()
auth.initialize()
const context = auth.authenticateRequest(headers)
const allowed = auth.hasPermission(context, 'write')
```

### middleware/rate-limit.ts

Rate limiting with token bucket algorithm.

**Key Classes:**
- `RateLimiter`: Implements token bucket rate limiting
- `DistributedRateLimiter`: Distributed rate limiting with Redis

**Example:**
```typescript
const limiter = new RateLimiter({
  requests_per_minute: 100,
  burst_size: 150
})
const status = limiter.checkLimit('api_key_123')
if (status.limited) {
  // Handle rate limit exceeded
}
```

### middleware/cache.ts

Caching with ETag and cache-control support.

**Key Classes:**
- `CacheManager`: Manages response caching
- `HTTPCacheDirective`: Parses and generates cache-control headers
- `CacheKeyGenerator`: Generates cache keys from requests

**Example:**
```typescript
const cache = new CacheManager({ ttl: 300 })
cache.set('key', data, 300)
const cached = cache.get('key')
```

### middleware/transform.ts

Request/response transformation and content negotiation.

**Key Classes:**
- `RequestTransformer`: Parses requests in various formats
- `ResponseTransformer`: Transforms responses to various formats
- `ContentNegotiation`: Handles content negotiation
- `DataProjection`: Projects and filters data

**Example:**
```typescript
const json = ResponseTransformer.transformResponse(data, 'json')
const csv = ResponseTransformer.transformResponse(data, 'csv')
const format = ContentNegotiation.negotiate(acceptHeader, ['json', 'xml'])
```

## Endpoints

### Health Check
```bash
GET /health
→ 200 OK
→ { status: "ok", timestamp, version }
```

### Schema/OpenAPI
```bash
GET /api/v1/schema
→ 200 OK
→ OpenAPI specification

GET /api/v1/schema?format=yaml
→ 200 OK
→ OpenAPI specification in YAML
```

### GraphQL
```bash
POST /api/graphql
Content-Type: application/json

{ "query": "{ ... }" }
```

### REST Endpoints (Auto-generated)
```bash
GET /api/v1/{mcp}/{operation}
POST /api/v1/{mcp}/{operation}
PUT /api/v1/{mcp}/{operation}
DELETE /api/v1/{mcp}/{operation}
```

## Configuration

### Default Config
```typescript
{
  version: '1.0.0',
  enable_rest: true,
  enable_graphql: true,
  enable_cache: true,
  cache_ttl: 300,        // 5 minutes
  rate_limit_rpm: 100    // 100 requests/minute
}
```

### Custom Config
```typescript
const gateway = new APIGateway(compositionEngine, {
  cache_ttl: 600,
  rate_limit_rpm: 1000,
  enable_rest: true,
  enable_graphql: true
})
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "timestamp": 1234567890,
  "x-execution-time": "45ms"
}
```

### Error Response
```json
{
  "error": "Error description",
  "message": "Detailed error message",
  "status": 400,
  "timestamp": 1234567890
}
```

## Metrics

```bash
GET /health
→ {
  "requests": { "/api/v1/database/query": 150 },
  "cache": { "size": 42, "entries": 10 },
  "rate_limit": { "total_keys": 5 }
}
```

## Integration

The API Gateway integrates with:
- **Composition Engine**: Executes MCP compositions
- **MCP Discovery**: Discovers available MCPs
- **Authentication System**: Manages API keys and permissions
- **Database**: Stores workflows and audit logs

## Next Steps

- [ ] Add webhook support for async operations
- [ ] Implement API versioning (v1, v2, etc.)
- [ ] Add WebSocket support for real-time APIs
- [ ] Implement request deduplication
- [ ] Add circuit breaker pattern
- [ ] Support for gRPC endpoints
- [ ] API metrics and monitoring
- [ ] OpenID Connect integration
