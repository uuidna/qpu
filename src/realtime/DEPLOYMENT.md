# WAVE 8B Real-Time Synchronization - Deployment Guide

Complete guide for deploying real-time synchronization with WebSockets, SSE, and Durable Objects coordination.

## Prerequisites

- Cloudflare Workers account
- Durable Objects enabled
- Node.js 18+
- TypeScript
- wrangler CLI

## Installation

### 1. Add Real-Time Module to Package

```bash
npm install --save-dev typescript @cloudflare/workers-types
```

### 2. Copy Real-Time Module

The real-time module is located in `src/realtime/`:

```
src/realtime/
├── index.ts              # Main engine
├── types.ts              # Type definitions
├── websocket-server.ts   # WebSocket handler
├── sse-server.ts         # SSE fallback
├── broadcaster.ts        # Multi-client broadcast
├── subscription.ts       # GraphQL subscriptions
├── change-detector.ts    # MCP change monitoring
├── presence.ts           # Presence tracking
├── client.ts             # Client library
├── api-integration.ts    # API gateway integration
├── do-coordination.ts    # Durable Objects coordination
├── integration-example.ts # Usage examples
└── README.md             # Module documentation
```

## Configuration

### 1. Update wrangler.toml

```toml
name = "qpu"
main = "src/worker.ts"
compatibility_date = "2024-10-24"

# Workers environment
[env.production]

# Durable Objects for real-time coordination
[[env.production.durable_objects.bindings]]
name = "REALTIME_COORDINATOR"
class_name = "RealtimeBroadcaster"
script_name = "qpu"

# Database binding
[[env.production.d1_databases]]
binding = "DATABASE"
database_name = "qpu"

# Environment variables
[env.production.vars]
REALTIME_ENABLED = "true"
REALTIME_MAX_CONNECTIONS = "10000"
REALTIME_HEARTBEAT_INTERVAL = "30000"

# Migrations for Durable Objects
[[env.production.durable_objects.migrations]]
tag = "v1"
new_classes = ["RealtimeBroadcaster"]
```

### 2. Update Worker Entry Point

File: `src/worker.ts`

```typescript
import { handleRequest } from './realtime/integration-example.js'
import type { Env } from './realtime/integration-example.js'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handleRequest(request, env)
  }
}
```

### 3. Create Durable Object Binding

File: `src/do-realtime.ts`

```typescript
import { RealtimeBroadcaster } from './realtime/do-coordination.js'

// Export the Durable Object
export { RealtimeBroadcaster }
```

Update `wrangler.toml`:

```toml
[[migrations]]
tag = "v1"
new_classes = ["RealtimeBroadcaster"]

[[durable_objects.bindings]]
name = "REALTIME_COORDINATOR"
class_name = "RealtimeBroadcaster"
script_name = "qpu"
```

## Deployment

### 1. Build the Project

```bash
npm run build
```

### 2. Test Locally

```bash
wrangler dev --env production
```

Test endpoints:
- WebSocket: `ws://localhost:8787/api/realtime/ws`
- SSE: `http://localhost:8787/api/realtime/sse`
- Stats: `http://localhost:8787/api/realtime/stats`

### 3. Deploy to Production

```bash
wrangler publish --env production
```

### 4. Verify Deployment

```bash
# Check worker is running
curl https://api.qpu.com/api/realtime/stats

# Monitor logs
wrangler tail --env production
```

## Client Setup

### 1. Install Client Library

Copy `src/realtime/client.ts` to your frontend project or use the bundled version.

### 2. Initialize Client

```typescript
import RealtimeClient from '@qpu/realtime-client'

const client = new RealtimeClient({
  url: 'wss://api.qpu.com/api/realtime/ws',
  reconnectDelay: 3000,
  maxReconnectAttempts: 10
})

// Connect
await client.connect()

// Subscribe to updates
const sub = client.subscribe(`
  subscription {
    onDatabaseChange(table: "users") {
      id
      name
      email
      updatedAt
    }
  }
`)

// Handle updates
sub.on('data', (message) => {
  console.log('Update:', message)
})

// Handle errors
sub.on('error', (error) => {
  console.error('Error:', error)
})
```

## API Endpoints

### WebSocket

```
wss://api.qpu.com/api/realtime/ws
```

Protocols:
- JSON-RPC over WebSocket
- Auto-reconnect with tokens
- Message queuing for offline clients

### Server-Sent Events (SSE)

```
https://api.qpu.com/api/realtime/sse
```

Fallback when WebSocket unavailable.

### GraphQL Subscriptions

```
POST https://api.qpu.com/api/graphql/subscribe
```

Body:
```json
{
  "clientId": "client-123",
  "query": "subscription { ... }",
  "variables": {}
}
```

### Statistics

```
GET https://api.qpu.com/api/realtime/stats
```

Response:
```json
{
  "timestamp": 1729788000000,
  "connections": {
    "websocket": 234,
    "sse": 45,
    "total": 279
  },
  "subscriptions": {
    "active": 567,
    "types": { "onDatabaseChange": 300, ... },
    "clientCount": 279
  },
  "operations": {
    "total": 15234,
    "success": 15000,
    "failure": 234,
    "pending": 0,
    "avgDuration": 45.2,
    "byMCP": { "database": 8000, "ai": 5000, ... }
  },
  "presence": {
    "total": 279,
    "online": 200,
    "idle": 70,
    "typing": 9,
    "byChannel": { "code-editor": 50, ... }
  }
}
```

### Presence

```
GET https://api.qpu.com/api/realtime/presence/:channel
```

Response:
```json
{
  "channel": "code-editor",
  "count": 5,
  "members": [
    {
      "clientId": "client-123",
      "userId": "user-456",
      "status": "online",
      "cursor": { "x": 100, "y": 200 },
      "lastHeartbeat": 1729788000000
    }
  ]
}
```

## Monitoring

### 1. Cloudflare Dashboard

- Workers Analytics
- Durable Objects Requests
- Error Rate
- P99 Latency

### 2. Custom Monitoring

```typescript
// Log statistics every 60 seconds
setInterval(() => {
  const stats = realtimeEngine.getStats()
  console.log('[RealtimeStats]', JSON.stringify(stats))
}, 60000)
```

### 3. Alerts

Configure alerts for:
- High connection count
- High error rate
- Queue buildup
- DO request failures

## Performance Tuning

### 1. Heartbeat Interval

```typescript
const engine = new RealtimeEngine({
  heartbeatInterval: 30000  // Default: 30s
})
```

Reduce for faster failure detection, increase to save bandwidth.

### 2. Message Queue Size

```typescript
const engine = new RealtimeEngine({
  maxMessageQueueSize: 1000  // Default: 1000
})
```

Increase for more offline buffering.

### 3. Connection Pool

```typescript
const engine = new RealtimeEngine({
  maxConnections: 10000  // Default: 10000
})
```

Set based on Worker capacity.

### 4. Message Batching

Batch delta updates before broadcast to reduce CPU:

```typescript
// Batch updates into groups of 100
const batch = updates.splice(0, 100)
for (const update of batch) {
  await realtimeEngine.broadcastUpdate(update)
}
```

## Troubleshooting

### High Memory Usage

- Check message queue size
- Monitor active subscriptions
- Enable message compression

### Slow Broadcasts

- Check DO request latency
- Monitor worker CPU time
- Profile broadcaster code

### Connection Timeouts

- Increase heartbeat interval
- Check network conditions
- Verify DO availability

### SSE not working

- Check browser compatibility
- Verify CORS headers
- Check firewall rules

## Testing

### 1. Unit Tests

```bash
npm run test:realtime
```

### 2. Load Testing

```bash
# Connect 1000 clients
npm run test:load-1000

# Broadcast to all
npm run test:broadcast-all

# Monitor performance
npm run test:monitor
```

### 3. Integration Tests

```bash
npm run test:integration
```

## Security

### 1. WebSocket Authentication

```typescript
// Add authentication to WebSocket upgrade
if (!validateToken(request.headers.get('authorization'))) {
  return new Response('Unauthorized', { status: 401 })
}
```

### 2. Message Validation

```typescript
// Validate incoming messages
const schema = validateMessage(message)
if (!schema.valid) {
  throw new Error('Invalid message')
}
```

### 3. Rate Limiting

```typescript
const engine = new RealtimeEngine({
  // Rate limit: 100 messages per second per client
  rateLimit: 100
})
```

### 4. CORS Headers

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://trusted-domain.com',
  'Access-Control-Allow-Methods': 'GET, POST',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}
```

## Maintenance

### 1. Regular Backups

- Monitor message logs
- Archive old data
- Clean up stale connections

### 2. Updates

```bash
# Update real-time module
npm update @qpu/realtime

# Deploy updates
npm run deploy:production
```

### 3. Monitoring

- Check error rates daily
- Review performance metrics
- Monitor DO costs

## Cost Optimization

### 1. Reduce DO Calls

Batch messages to reduce DO request count:

```typescript
// Instead of 1000 single calls, use 10 batched calls
await broadcaster.broadcastBatch(messages)
```

### 2. Message Compression

Enable compression for large messages:

```typescript
const engine = new RealtimeEngine({
  enableCompression: true
})
```

### 3. Connection Pooling

Reuse connections instead of creating new ones.

## Scaling

### 1. Multiple Workers

Deploy across multiple regions:

```toml
[env.us]
route = "api-us.qpu.com/*"

[env.eu]
route = "api-eu.qpu.com/*"
```

### 2. Durable Objects Distribution

Shard DO by channel hash for load distribution:

```typescript
const coordinatorId = `coordinator:${hash(channel) % 10}`
```

### 3. Load Balancing

Use Cloudflare Load Balancing for multi-region setup.

## Status

**Deployment Status: 🚀 Ready for production**

All components tested and ready to deploy. Follow this guide for production setup.
