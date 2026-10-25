// Real-Time API Integration (WAVE 8B)
// Integrates real-time synchronization with API Gateway

import RealtimeEngine from './index.js'
import type { Request as WorkerRequest } from '@cloudflare/workers-types'

export class RealtimeAPIIntegration {
  private realtimeEngine: RealtimeEngine

  constructor(realtimeEngine: RealtimeEngine) {
    this.realtimeEngine = realtimeEngine
  }

  /**
   * Handle incoming request to realtime endpoints
   */
  async handleRequest(request: WorkerRequest): Promise<Response> {
    const url = new URL(request.url)

    // WebSocket upgrade
    if (url.pathname === '/api/realtime/ws' || url.pathname === '/realtime/ws') {
      return this.handleWebSocket(request)
    }

    // SSE endpoint
    if (url.pathname === '/api/realtime/sse' || url.pathname === '/realtime/sse') {
      return this.handleSSE(request)
    }

    // GraphQL subscriptions endpoint
    if (url.pathname === '/api/graphql/subscribe' || url.pathname === '/graphql/subscribe') {
      return this.handleGraphQLSubscription(request)
    }

    // REST endpoints
    if (url.pathname.startsWith('/api/realtime/')) {
      return this.handleRealtimeAPI(request)
    }

    return new Response('Not found', { status: 404 })
  }

  /**
   * Handle WebSocket upgrade
   */
  private async handleWebSocket(request: WorkerRequest): Promise<Response> {
    // Check for WebSocket upgrade header
    if (request.headers.get('upgrade') !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 })
    }

    try {
      // @ts-ignore - Cloudflare Workers API
      const { 0: client, 1: server } = new WebSocketPair()

      // Handle connection in background
      const clientId = await this.realtimeEngine.handleWebSocket(client, request)

      // Accept server side
      server.accept()

      // Send welcome message
      server.send(
        JSON.stringify({
          type: 'connected',
          clientId,
          protocol: 'websocket',
          timestamp: Date.now()
        })
      )

      return new Response(null, {
        status: 101,
        // @ts-ignore - Cloudflare Workers API
        webSocket: server
      })
    } catch (error) {
      console.error('[RealtimeAPIIntegration] WebSocket error:', error)
      return new Response('WebSocket upgrade failed', { status: 500 })
    }
  }

  /**
   * Handle SSE connection
   */
  private async handleSSE(request: WorkerRequest): Promise<Response> {
    try {
      const { response, clientId } = await this.realtimeEngine.handleSSE(request)

      console.log(`[RealtimeAPIIntegration] SSE client connected: ${clientId}`)

      return response
    } catch (error) {
      console.error('[RealtimeAPIIntegration] SSE error:', error)
      return new Response('SSE connection failed', { status: 500 })
    }
  }

  /**
   * Handle GraphQL subscriptions
   */
  private async handleGraphQLSubscription(request: WorkerRequest): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      const body = await request.json<any>()
      const { clientId, query, variables } = body

      if (!query) {
        return new Response(
          JSON.stringify({ error: 'Missing query' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      const result = await this.realtimeEngine.subscribe(
        clientId || 'anonymous',
        query,
        variables
      )

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('[RealtimeAPIIntegration] GraphQL subscription error:', error)
      return new Response(
        JSON.stringify({ error: 'Subscription failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  /**
   * Handle REST realtime API
   */
  private async handleRealtimeAPI(request: WorkerRequest): Promise<Response> {
    const url = new URL(request.url)

    // GET /api/realtime/stats
    if (url.pathname === '/api/realtime/stats' && request.method === 'GET') {
      return this.handleStatsEndpoint()
    }

    // GET /api/realtime/subscriptions
    if (url.pathname === '/api/realtime/subscriptions' && request.method === 'GET') {
      return this.handleSubscriptionsEndpoint()
    }

    // GET /api/realtime/presence
    if (url.pathname.startsWith('/api/realtime/presence/')) {
      const channel = url.pathname.split('/').pop()
      return this.handlePresenceEndpoint(channel || '')
    }

    return new Response('Not found', { status: 404 })
  }

  /**
   * Handle stats endpoint
   */
  private handleStatsEndpoint(): Response {
    const stats = this.realtimeEngine.getStats()

    return new Response(
      JSON.stringify(
        {
          timestamp: Date.now(),
          connections: {
            websocket: stats.websocket.connections,
            sse: stats.sse.connections,
            total: stats.websocket.connections + stats.sse.connections
          },
          subscriptions: stats.subscriptions,
          operations: stats.operations,
          presence: stats.presence
        },
        null,
        2
      ),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    )
  }

  /**
   * Handle subscriptions endpoint
   */
  private handleSubscriptionsEndpoint(): Response {
    const stats = this.realtimeEngine.getStats()

    return new Response(
      JSON.stringify(
        {
          active: stats.subscriptions.active,
          types: stats.subscriptions.operationTypes,
          clientCount: stats.subscriptions.clientCount
        },
        null,
        2
      ),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  /**
   * Handle presence endpoint
   */
  private handlePresenceEndpoint(channel: string): Response {
    const presence = this.realtimeEngine.getChannelPresence(channel)

    return new Response(
      JSON.stringify(
        {
          channel,
          count: presence.length,
          members: presence.map(p => ({
            clientId: p.clientId,
            userId: p.userId,
            status: p.status,
            cursor: p.cursor,
            lastHeartbeat: p.lastHeartbeat
          }))
        },
        null,
        2
      ),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

/**
 * Middleware for realtime endpoints
 */
export class RealtimeMiddleware {
  /**
   * Authentication middleware
   */
  static async authenticate(request: WorkerRequest): Promise<boolean> {
    // Check for authentication token
    const auth = request.headers.get('authorization')
    if (!auth) {
      return false
    }

    // Validate token (implement your auth logic)
    const token = auth.replace('Bearer ', '')
    return token.length > 0
  }

  /**
   * Rate limiting middleware
   */
  static async rateLimit(clientId: string, limit: number = 100): Promise<boolean> {
    // TODO: Implement rate limiting
    // Could use Durable Objects for distributed rate limiting
    return true
  }

  /**
   * CORS headers
   */
  static getCORSHeaders(): Record<string, string> {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  }
}

/**
 * Example Cloudflare Worker integration
 */
export async function handleRealtimeRequest(
  request: WorkerRequest,
  realtimeEngine: RealtimeEngine
): Promise<Response> {
  const integration = new RealtimeAPIIntegration(realtimeEngine)

  // Add CORS headers
  const corsHeaders = RealtimeMiddleware.getCORSHeaders()

  try {
    const response = await integration.handleRequest(request)
    return new Response(response.body, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        ...corsHeaders
      }
    })
  } catch (error) {
    console.error('[RealtimeAPIIntegration] Error:', error)
    return new Response('Internal server error', {
      status: 500,
      headers: corsHeaders
    })
  }
}
