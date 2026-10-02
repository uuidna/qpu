/**
 * Universal API Operations Route
 * Serves all APIs through combinatorial hex routing
 * No hardcoding: pure formula-driven routing
 *
 * Routes:
 * GET /api/operations/services - List all services
 * GET /api/operations/tools - List all MCP tools
 * GET /api/operations/[service]/[endpoint] - Describe endpoint
 * POST /api/operations/[service]/[endpoint] - Execute operation
 * GET /api/operations/[formula-hex] - Execute cached formula
 */

import { createQPUMCPUnlimited } from '@/lib/qpu-mcp-unlimited'
import { createUniversalCombinator } from '@/lib/universal-api-framework'

// Initialize once
const mcp = createQPUMCPUnlimited()
const combinator = createUniversalCombinator()

/**
 * GET /api/operations/*
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const pathIndex = parts.indexOf('operations') + 1
    const path = parts.slice(pathIndex)

    // List all services
    if (path[0] === 'services') {
      const services = combinator.getServices()
      return Response.json({
        count: services.length,
        services: services.map((s) => ({
          name: s.name,
          baseUrl: s.baseUrl,
          endpointCount: s.endpoints.length,
          endpoints: s.endpoints.map((e) => ({
            name: e.name,
            method: e.method,
            path: e.path,
            description: e.description,
          })),
        })),
      })
    }

    // List all MCP tools
    if (path[0] === 'tools') {
      const tools = mcp.getAllTools()
      const count = mcp.getOperationCount()
      return Response.json({
        ...count,
        tools: tools.map((t) => ({
          name: t.name,
          description: t.description,
          inputs: t.inputSchema.properties,
          required: t.inputSchema.required,
        })),
      })
    }

    // Get specific endpoint definition
    if (path.length === 2) {
      const [serviceName, endpointName] = path
      const service = combinator.getService(serviceName)
      const endpoint = service?.endpoints.find((e) => e.name === endpointName)

      if (!service || !endpoint) {
        return Response.json(
          {
            error: 'Endpoint not found',
            service: serviceName,
            endpoint: endpointName,
          },
          { status: 404 },
        )
      }

      const hex = combinator.generateEndpointHex(serviceName, endpointName)

      return Response.json({
        service: serviceName,
        endpoint: endpoint.name,
        formula: hex,
        method: endpoint.method,
        path: endpoint.path,
        description: endpoint.description,
        parameters: endpoint.parameters,
        response: endpoint.response,
        cacheSeconds: endpoint.cacheSeconds,
        documentation: {
          exampleQuery: `/api/operations/${hex}?param1=value1&param2=value2`,
          exampleFetch: `curl -X ${endpoint.method} "/api/operations/${hex}?...params"`,
        },
      })
    }

    // Execute formula
    if (path.length === 1 && path[0].length === 16) {
      const formula = path[0]
      const params: Record<string, unknown> = {}

      for (const [key, value] of url.searchParams) {
        params[key] = tryParse(value)
      }

      const result = await mcp.executeByFormula(formula, params)
      return Response.json(result)
    }

    return Response.json(
      {
        error: 'Invalid path',
        available: [
          '/api/operations/services - List all services',
          '/api/operations/tools - List all MCP tools',
          '/api/operations/[service]/[endpoint] - Get endpoint definition',
          '/api/operations/[service]/[endpoint]?params - Execute endpoint',
        ],
      },
      { status: 400 },
    )
  } catch (error) {
    return Response.json(
      {
        error: 'Operation failed',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/operations/*
 */
export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const pathIndex = parts.indexOf('operations') + 1
    const path = parts.slice(pathIndex)

    // Execute endpoint with POST body
    if (path.length === 2) {
      const [serviceName, endpointName] = path
      const body = await request.json()

      const result = await combinator.executeAPICall(serviceName, endpointName, body)

      return Response.json({
        ...result,
        executedAt: new Date().toISOString(),
        cacheableFor: `Provide formula ${result.formula} for cached results`,
      })
    }

    // Execute by formula with POST body
    if (path.length === 1 && path[0].length === 16) {
      const formula = path[0]
      const body = await request.json()

      const result = await mcp.executeByFormula(formula, body)

      return Response.json({
        formula,
        result,
        executedAt: new Date().toISOString(),
      })
    }

    return Response.json(
      {
        error: 'Invalid path for POST',
        expected: ['/api/operations/[service]/[endpoint]', '/api/operations/[formula-hex]'],
      },
      { status: 400 },
    )
  } catch (error) {
    return Response.json(
      {
        error: 'Operation failed',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

/**
 * OPTIONS - CORS and documentation
 */
export async function OPTIONS() {
  const manifest = mcp.generateMCPManifest()

  return Response.json({
    status: 'QPU MCP Unlimited Ready',
    manifest,
    usage: {
      base_operations: manifest.capabilities.baseOperations,
      composed_operations: manifest.capabilities.composedOperations,
      total_tools: manifest.capabilities.totalTools,
      all_combinations: 'Unlimited through formula composition',
    },
    routes: {
      'GET /api/operations/services': 'List all registered API services',
      'GET /api/operations/tools': 'List all MCP tools (base + composed)',
      'GET /api/operations/[service]/[endpoint]': 'Get endpoint definition and example',
      'POST /api/operations/[service]/[endpoint]': 'Execute endpoint with JSON body',
      'GET /api/operations/[formula-hex]': 'Execute cached formula with query params',
      'POST /api/operations/[formula-hex]': 'Execute cached formula with JSON body',
    },
    add_service: {
      method: 'POST',
      endpoint: '/api/operations/register-service',
      body: {
        name: 'my-service',
        baseUrl: 'https://api.example.com',
        endpoints: [
          {
            name: 'search',
            method: 'GET',
            path: '/search',
            description: 'Search endpoint',
            parameters: [{ name: 'q', type: 'string', required: true }],
            response: { status: 200, format: 'json' },
          },
        ],
      },
    },
  })
}

/**
 * Helper: Try to parse value as JSON/number/boolean, fallback to string
 */
function tryParse(value: string): unknown {
  // Try number
  if (/^\d+(\.\d+)?$/.test(value)) {
    return parseFloat(value)
  }

  // Try boolean
  if (value === 'true') return true
  if (value === 'false') return false

  // Try JSON
  if (value.startsWith('{') || value.startsWith('[')) {
    try {
      return JSON.parse(value)
    } catch {}
  }

  // Return as string
  return value
}
