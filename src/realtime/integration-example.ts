// WAVE 8B Integration Example
// Shows how to integrate real-time synchronization with Cloudflare Workers, DO, and MCPs

import RealtimeEngine from './index.js'
import { RealtimeAPIIntegration, handleRealtimeRequest } from './api-integration.js'
import type { Request as WorkerRequest } from '@cloudflare/workers-types'

/**
 * Example Cloudflare Worker Environment
 */
interface Env {
  REALTIME_COORDINATOR: DurableObjectNamespace
  DATABASE: D1Database
}

/**
 * Example: Main Worker Handler
 */
export async function handleRequest(request: WorkerRequest, env: Env): Promise<Response> {
  const url = new URL(request.url)

  // Initialize real-time engine (once per request or cached globally)
  const realtimeEngine = new RealtimeEngine({
    heartbeatInterval: 30000,
    maxConnections: 10000,
    enablePresenceTracking: true,
    enableCompression: true
  })

  // Initialize with Durable Objects coordination
  await realtimeEngine.initialize(env.REALTIME_COORDINATOR)

  // Route to real-time endpoints
  if (url.pathname.startsWith('/api/realtime')) {
    return handleRealtimeRequest(request, realtimeEngine)
  }

  // Regular API endpoints
  if (url.pathname.startsWith('/api/')) {
    return handleAPIRequest(request, env, realtimeEngine)
  }

  return new Response('Not found', { status: 404 })
}

/**
 * Example: Handle regular API request with real-time updates
 */
async function handleAPIRequest(
  request: WorkerRequest,
  env: Env,
  realtimeEngine: RealtimeEngine
): Promise<Response> {
  const url = new URL(request.url)

  // Example: User creation endpoint
  if (url.pathname === '/api/users' && request.method === 'POST') {
    // Start monitoring the operation
    const operationId = realtimeEngine.startMCPOperation('database', 'INSERT INTO users', {
      resource: 'users',
      resourceId: 'unknown'
    })

    try {
      const body = await request.json<any>()
      const { name, email } = body

      // Execute database operation
      const stmt = env.DATABASE.prepare(
        'INSERT INTO users (name, email) VALUES (?, ?) RETURNING id'
      )
      const result = await stmt.bind(name, email).first<any>()

      // Complete operation with changes
      await realtimeEngine.completeMCPOperation(operationId, result, {
        id: result.id,
        name,
        email,
        createdAt: new Date().toISOString()
      })

      return new Response(
        JSON.stringify({
          success: true,
          user: result
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    } catch (error) {
      // Fail operation
      await realtimeEngine.failMCPOperation(
        operationId,
        error instanceof Error ? error : new Error(String(error))
      )

      return new Response(
        JSON.stringify({
          error: 'Failed to create user'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  // Example: Update user endpoint
  if (url.pathname.match(/^\/api\/users\/\d+$/) && request.method === 'PUT') {
    const userId = url.pathname.split('/').pop()

    const operationId = realtimeEngine.startMCPOperation(
      'database',
      'UPDATE users',
      { resource: 'users', resourceId: userId }
    )

    try {
      const body = await request.json<any>()

      // Update database
      const result = await env.DATABASE.prepare(
        'UPDATE users SET name = ?, email = ? WHERE id = ?'
      )
        .bind(body.name, body.email, userId)
        .run()

      // Complete operation with changes
      await realtimeEngine.completeMCPOperation(operationId, result, {
        id: userId,
        name: body.name,
        email: body.email,
        updatedAt: new Date().toISOString()
      })

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      await realtimeEngine.failMCPOperation(
        operationId,
        error instanceof Error ? error : new Error(String(error))
      )

      return new Response(
        JSON.stringify({ error: 'Update failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  return new Response('Endpoint not found', { status: 404 })
}

/**
 * Example: Client-side usage in HTML/JavaScript
 */
export const CLIENT_EXAMPLE_HTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Real-Time Demo</title>
  <script src="/realtime/client.js"></script>
</head>
<body>
  <h1>Real-Time Updates Demo</h1>

  <div id="connection-status">Connecting...</div>
  <div id="users-list"></div>
  <div id="presence">Online Users: 0</div>

  <script>
    const client = new RealtimeClient({
      url: 'wss://api.qpu.com/api/realtime/ws'
    })

    // Connect
    client.connect().then(() => {
      console.log('Connected:', client.getClientId())
      document.getElementById('connection-status').textContent = 'Connected'

      // Subscribe to user changes
      const userSub = client.subscribe(\`
        subscription {
          onDatabaseChange(table: "users") {
            id
            name
            email
            updatedAt
          }
        }
      \`)

      userSub.on('data', (data) => {
        console.log('User update:', data)
        updateUsersList(data)
      })

      userSub.on('error', (error) => {
        console.error('Subscription error:', error)
      })

      // Subscribe to presence
      const presenceSub = client.subscribePresence('main-channel')

      presenceSub.on('data', (data) => {
        console.log('Presence update:', data)
        updatePresence(data)
      })
    })

    function updateUsersList(user) {
      const list = document.getElementById('users-list')
      let item = document.getElementById('user-' + user.id)

      if (!item) {
        item = document.createElement('div')
        item.id = 'user-' + user.id
        list.appendChild(item)
      }

      item.textContent = \`\${user.name} (\${user.email})\`
    }

    function updatePresence(event) {
      if (event.type === 'joined') {
        console.log('User joined:', event.presence.clientId)
      } else if (event.type === 'left') {
        console.log('User left:', event.presence.clientId)
      }

      // Update online count
      document.getElementById('presence').textContent =
        'Online Users: ' + event.count
    }

    // Handle disconnect
    window.addEventListener('beforeunload', () => {
      client.disconnect()
    })
  </script>
</body>
</html>
`

/**
 * Example: Monitor MCP Operations
 */
export async function exampleMonitorMCPOperations(
  realtimeEngine: RealtimeEngine
): Promise<void> {
  // Listen for database changes
  const unsubscribe = realtimeEngine.onChanges('users', (event) => {
    console.log(`[Event] ${event.changeType} on ${event.resource}:${event.resourceId}`)
    console.log('Changes:', event.changes)
    console.log('Caused by:', event.userId || 'system')
  })

  // Listen for analytics changes
  realtimeEngine.onChanges('analytics', (event) => {
    console.log(`[Analytics] ${event.operation}`)
  })

  // Later: unsubscribe
  // unsubscribe()
}

/**
 * Example: Setup GraphQL Subscriptions
 */
export async function exampleGraphQLSubscriptions(realtimeEngine: RealtimeEngine): Promise<void> {
  // Example 1: Database changes
  const dbSub = await realtimeEngine.subscribe(
    'client-123',
    `
      subscription {
        onDatabaseChange(table: "users") {
          id
          name
          email
          updatedAt
        }
      }
    `
  )

  console.log('Database subscription:', dbSub)

  // Example 2: MCP operation changes
  const mcpSub = await realtimeEngine.subscribe(
    'client-123',
    `
      subscription {
        onMCPOperationChange(mcp: "database") {
          operation
          status
          timestamp
          duration
        }
      }
    `
  )

  console.log('MCP subscription:', mcpSub)

  // Example 3: Replication status
  const replicaSub = await realtimeEngine.subscribe(
    'client-123',
    `
      subscription {
        onReplicationStatusChange(table: "analytics") {
          status
          rowsReplicated
          targetProvider
        }
      }
    `
  )

  console.log('Replication subscription:', replicaSub)
}

/**
 * Example: Presence Tracking
 */
export async function examplePresenceTracking(realtimeEngine: RealtimeEngine): Promise<void> {
  const clientId = 'client-123'
  const userId = 'user-456'
  const channel = 'code-editor'

  // Client joins channel
  await realtimeEngine.clientJoins(clientId, channel, userId, {
    cursor: { x: 0, y: 0 }
  })

  // Get who's online
  const presence = realtimeEngine.getChannelPresence(channel)
  console.log('Online on', channel, ':', presence.length, 'users')

  // Update cursor
  await realtimeEngine.updatePresence(clientId, 'online', {
    cursor: { x: 100, y: 200 }
  })

  // Set typing indicator
  await realtimeEngine.updatePresence(clientId, 'typing')

  // After 3 seconds, stop typing
  setTimeout(async () => {
    await realtimeEngine.updatePresence(clientId, 'online')
  }, 3000)

  // Client leaves
  await realtimeEngine.clientLeaves(clientId, channel)
}

/**
 * Example: Statistics and Monitoring
 */
export function exampleGetStatistics(realtimeEngine: RealtimeEngine): void {
  const stats = realtimeEngine.getStats()

  console.log('[Real-Time Statistics]')
  console.log('WebSocket connections:', stats.websocket.connections)
  console.log('SSE connections:', stats.sse.connections)
  console.log('Total connections:', stats.websocket.connections + stats.sse.connections)
  console.log('')
  console.log('Subscriptions:')
  console.log('  Active:', stats.subscriptions.active)
  console.log('  Types:', stats.subscriptions.operationTypes)
  console.log('  Clients:', stats.subscriptions.clientCount)
  console.log('')
  console.log('MCP Operations:')
  console.log('  Total:', stats.operations.total)
  console.log('  Success:', stats.operations.success)
  console.log('  Failed:', stats.operations.failure)
  console.log('  Pending:', stats.operations.pending)
  console.log('  Avg duration:', stats.operations.avgDuration, 'ms')
  console.log('  By MCP:', stats.operations.byMCP)
  console.log('')
  console.log('Presence:')
  console.log('  Total present:', stats.presence.total)
  console.log('  Online:', stats.presence.online)
  console.log('  Idle:', stats.presence.idle)
  console.log('  Typing:', stats.presence.typing)
}

/**
 * Example: Integration with WAVE 7 (MCP Composition)
 */
export async function exampleIntegrateWithMCPComposition(
  realtimeEngine: RealtimeEngine
): Promise<void> {
  // When MCP composition executes, it can emit changes
  const compositionId = realtimeEngine.startMCPOperation(
    'composition',
    'execute-multi-mcp',
    {
      resource: 'composition',
      resourceId: 'comp-123'
    }
  )

  try {
    // Simulate composition execution steps
    // 1. Git MCP: Get recent files
    // 2. Filesystem MCP: Read files
    // 3. AI MCP: Analyze code
    // 4. Database MCP: Store results

    const results = {
      files: 15,
      analyzed: 12,
      issues: 3
    }

    await realtimeEngine.completeMCPOperation(compositionId, results, {
      compositionId: 'comp-123',
      filesProcessed: results.files,
      issuesFound: results.issues,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    await realtimeEngine.failMCPOperation(
      compositionId,
      error instanceof Error ? error : new Error(String(error))
    )
  }
}

/**
 * Example: Integration with WAVE 6 (Durable Objects)
 */
export async function exampleIntegrateWithDurableObjects(env: Env): Promise<void> {
  // The broadcaster automatically coordinates with DO
  // This is transparent to the user - just initialize with the DO namespace

  const realtimeEngine = new RealtimeEngine()
  await realtimeEngine.initialize(env.REALTIME_COORDINATOR)

  // All broadcasts are coordinated through DO automatically
  console.log('Real-time engine initialized with DO coordination')
}

export default { handleRequest }
