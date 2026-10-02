/**
 * QPU MCP Registry API
 * Serves all discovered operations and unlimited compositions
 */

import {
  QPU_QUANTUM_OPERATIONS,
  QPU_CRYPTO_OPERATIONS,
  QPU_COMPUTE_OPERATIONS,
  QPU_REGISTRY_OPERATIONS,
  QPU_GOVERNANCE_OPERATIONS,
  generateQPUCompositions,
  generateQPUToolDefinitions,
  generateCapabilityNetwork,
  QPU_MCP_MANIFEST,
} from '@/lib/qpu-mcp-registry'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get('query')

  try {
    // List all operations
    if (!query || query === 'operations') {
      return Response.json({
        quantum: Object.values(QPU_QUANTUM_OPERATIONS),
        crypto: Object.values(QPU_CRYPTO_OPERATIONS),
        compute: Object.values(QPU_COMPUTE_OPERATIONS),
        registry: Object.values(QPU_REGISTRY_OPERATIONS),
        governance: Object.values(QPU_GOVERNANCE_OPERATIONS),
        totalCount:
          Object.keys(QPU_QUANTUM_OPERATIONS).length +
          Object.keys(QPU_CRYPTO_OPERATIONS).length +
          Object.keys(QPU_COMPUTE_OPERATIONS).length +
          Object.keys(QPU_REGISTRY_OPERATIONS).length +
          Object.keys(QPU_GOVERNANCE_OPERATIONS).length,
      })
    }

    // Get compositions
    if (query === 'compositions') {
      const compositions = generateQPUCompositions()
      return Response.json({
        total: compositions.length,
        compositions,
        unlimitedScaling: `Estimated ${Math.pow(compositions.length, 2)} pages via multi-hop`,
      })
    }

    // Get MCP tools
    if (query === 'tools') {
      const tools = generateQPUToolDefinitions()
      return Response.json({
        total: tools.length,
        tools,
        manifest: QPU_MCP_MANIFEST,
      })
    }

    // Get capability network
    if (query === 'network') {
      const network = generateCapabilityNetwork()
      return Response.json({
        network,
        manifest: QPU_MCP_MANIFEST,
      })
    }

    // Default: return comprehensive manifest
    const allCompositions = generateQPUCompositions()
    const allTools = generateQPUToolDefinitions()
    const network = generateCapabilityNetwork()

    return Response.json({
      manifest: QPU_MCP_MANIFEST,
      summary: {
        baseOperations: Object.keys(QPU_QUANTUM_OPERATIONS).length +
          Object.keys(QPU_CRYPTO_OPERATIONS).length +
          Object.keys(QPU_COMPUTE_OPERATIONS).length +
          Object.keys(QPU_REGISTRY_OPERATIONS).length +
          Object.keys(QPU_GOVERNANCE_OPERATIONS).length,
        compositions: allCompositions.length,
        tools: allTools.length,
        unlimited: true,
      },
      operations: {
        quantum: Object.values(QPU_QUANTUM_OPERATIONS),
        crypto: Object.values(QPU_CRYPTO_OPERATIONS),
        compute: Object.values(QPU_COMPUTE_OPERATIONS),
        registry: Object.values(QPU_REGISTRY_OPERATIONS),
        governance: Object.values(QPU_GOVERNANCE_OPERATIONS),
      },
      compositions: allCompositions.slice(0, 50), // First 50 examples
      tools: allTools.slice(0, 20), // First 20 tool examples
      network,
      apiEndpoints: {
        'GET /api/mcp/registry': 'Get full registry (this endpoint)',
        'GET /api/mcp/registry?query=operations': 'List all operations',
        'GET /api/mcp/registry?query=compositions': 'List all compositions',
        'GET /api/mcp/registry?query=tools': 'List all MCP tools',
        'GET /api/mcp/registry?query=network': 'Get capability network',
        'POST /api/mcp/compose': 'Execute operation composition',
      },
    })
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to get registry',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function OPTIONS() {
  return Response.json({
    status: 'QPU MCP Registry Ready',
    endpoints: {
      'GET /api/mcp/registry': 'Full registry',
      'GET /api/mcp/registry?query=operations': 'Operations list',
      'GET /api/mcp/registry?query=compositions': 'Compositions list',
      'GET /api/mcp/registry?query=tools': 'MCP tools',
      'GET /api/mcp/registry?query=network': 'Capability network',
    },
    capabilities: {
      total_base_operations: 41,
      total_compositions: 'Auto-calculated from combinations',
      unlimited_scaling: true,
      domains: ['quantum', 'crypto', 'compute', 'registry', 'governance'],
    },
  })
}
