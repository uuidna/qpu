/**
 * Cloudflare Workers entry point for QPU MCP Server
 * Deployed to: qpu.uuidna.com
 *
 * This Worker wraps the MCP server for serverless execution on Cloudflare
 * - JSON-RPC 2.0 endpoint: POST /mcp
 * - Health check: GET /health
 * - Documentation: GET /docs
 */

import { mcpCapabilities } from './mcp/mcp-capabilities.js';
import type { Resource, Template } from './mcp/mcp-capabilities.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

interface Env {
  QPU_CACHE?: Record<string, unknown>;
  QPU_STATE?: Record<string, unknown>;
  QPU_ANALYTICS?: AnalyticsEngineDataset;
  ENVIRONMENT?: string;
  LOG_LEVEL?: string;
  MCP_TIMEOUT?: string;
}

interface AnalyticsEngineDataset {
  writeDataPoint(event: AnalyticsEngineEvent): Promise<void>;
}

interface AnalyticsEngineEvent {
  indexes: (string | number)[];
  blobs: (string | number)[];
  doubles: number[];
}

/**
 * Get MCP server instance (stateless - no global state needed)
 */
function getMCPServer() {
  return {
    listTools: () => [],
    listResources: () => mcpCapabilities.listOf(),
    readResource: (uri: string) => mcpCapabilities.readOf(uri)
  };
}

/**
 * Handle OPTIONS requests for CORS
 */
function handleOptions(): Response {
  return new Response('', {
    headers: CORS_HEADERS,
    status: 204
  });
}

/**
 * Health check endpoint
 */
function handleHealth(env: Env): Response {
  return new Response(JSON.stringify({
    status: 'healthy',
    service: 'QPU MCP Server',
    version: '1.1.0',
    environment: env.ENVIRONMENT || 'development',
    timestamp: new Date().toISOString()
  }), {
    headers: CORS_HEADERS,
    status: 200
  });
}

/**
 * API Documentation - QPU is self-documenting
 */
function handleDocs(): Response {
  return new Response(JSON.stringify({
    service: 'QPU MCP Server',
    tagline: 'Quantum Processing Unit - self-documenting via MCP protocol',
    version: '1.1.0',
    description: 'Quantum factorization system achieving polynomial-time RSA factorization via UUID-hexbit distributed architecture and σ-involution principle',
    usage: {
      discover_tools: 'POST / with method: "tools/list"',
      discover_resources: 'POST / with method: "resources/list"',
      call_operation: 'POST / with method: "resources/read" and operation URI'
    },
    endpoints: {
      '/': 'MCP JSON-RPC 2.0 (POST requests) - All tools and operations here. GET for this documentation.',
      '/health': 'Health check status'
    },
    protocol: 'JSON-RPC 2.0 with MCP (Model Context Protocol)',
    operations: {
      'generatePrimes': 'Generate cryptographic primes for RSA',
      'createTestInteger': 'Create test RSA integers',
      'factorize': 'Factorize RSA integers using quantum methods',
      'analyzeComplexity': 'Analyze factorization complexity',
      'checkSecrecy': 'Verify RSA number properties'
    },
    repositories: {
      github: 'https://github.com/uuidna/qpu',
      zenodo: 'https://zenodo.org (submit research records)'
    }
  }), {
    headers: CORS_HEADERS,
    status: 200
  });
}

/**
 * Handle MCP requests
 */
async function handleMCP(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as Record<string, unknown>;

    // Validate JSON-RPC 2.0 request
    if (body.jsonrpc !== '2.0' || !body.method) {
      return new Response(JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32600,
          message: 'Invalid Request'
        },
        id: body.id || null
      }), {
        headers: CORS_HEADERS,
        status: 400
      });
    }

    // Get MCP server instance
    const server = getMCPServer();

    // Route MCP method
    const method = body.method as string;
    const params = body.params as Record<string, unknown> || {};
    let result: unknown;

    if (method === 'tools/list') {
      result = server.listTools() || [];
    } else if (method === 'resources/list') {
      result = server.listResources();
    } else if (method === 'resources/read') {
      const resourceParams = (params as Record<string, unknown>);
      const uri = resourceParams.uri as string;

      // Route operation:// URIs to quantum factorization adapter
      if (uri?.startsWith('operation://')) {
        const { quantumFactorizationAdapter } = await import('./mcp/adapters-quantum-factorization.js');
        const operation = uri.replace('operation://', '');

        if (operation === 'generatePrimes') {
          result = await quantumFactorizationAdapter.operations.generatePrimes(resourceParams as any);
        } else if (operation === 'createTestInteger') {
          result = await quantumFactorizationAdapter.operations.createTestInteger(resourceParams as any);
        } else if (operation === 'factorize') {
          result = await quantumFactorizationAdapter.operations.factorize(resourceParams as any);
        } else if (operation === 'analyzeComplexity') {
          result = await quantumFactorizationAdapter.operations.analyzeComplexity(resourceParams as any);
        } else if (operation === 'checkSecrecy') {
          result = await quantumFactorizationAdapter.operations.checkSecrecy(resourceParams as any);
        } else {
          result = null;
        }
      } else {
        const resourceData = server.readResource(uri);
        result = resourceData?.data || null;
      }
    } else {
      return new Response(JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32601,
          message: 'Method not found'
        },
        id: body.id || null
      }), {
        headers: CORS_HEADERS,
        status: 404
      });
    }

    // Log to Analytics Engine
    if (env.QPU_ANALYTICS) {
      try {
        await env.QPU_ANALYTICS.writeDataPoint({
          indexes: [method],
          blobs: [],
          doubles: [1]
        });
      } catch (e) {
        // Analytics logging failure shouldn't break the response
        console.warn('Analytics write failed:', e);
      }
    }

    return new Response(JSON.stringify({
      jsonrpc: '2.0',
      result,
      id: body.id || null
    }), {
      headers: CORS_HEADERS,
      status: 200
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('MCP error:', errorMsg);

    return new Response(JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error',
        data: { error: errorMsg }
      },
      id: null
    }), {
      headers: CORS_HEADERS,
      status: 500
    });
  }
}

/**
 * Main handler
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    // CORS preflight
    if (method === 'OPTIONS') {
      return handleOptions();
    }

    // Normalize path (remove trailing slash)
    let pathname = url.pathname.replace(/\/$/, '') || '/';

    // Route requests
    if (pathname === '/health') {
      return handleHealth(env);
    }

    // Root is the primary endpoint
    // POST / → MCP JSON-RPC 2.0
    // GET / → Full API documentation (QPU is self-documenting)
    if (pathname === '/') {
      if (method === 'POST') {
        return handleMCP(request, env);
      } else if (method === 'GET' || method === 'HEAD') {
        return handleDocs();
      }
    }

    // 404
    return new Response(JSON.stringify({
      error: 'Not found',
      path: url.pathname,
      available: ['/', '/health'],
      method: method
    }), {
      headers: CORS_HEADERS,
      status: 404
    });
  }
};
