// MCP Dynamic Server: Clients configure adapters at runtime via MCP protocol
// Zero hardcoding — full flexibility via tool calls

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  TextContent,
  Tool,
} from '@modelcontextprotocol/sdk/types.js'

import {
  registerEndpoint,
  getEndpoint,
  listEndpoints,
  createDynamicAdapter,
  registerAdapter,
  getAdapter,
  listAdapters,
  executeAdapterOperation,
  type ApiEndpoint,
} from './adapters-dynamic.js'

interface RuntimeState {
  createdAdapters: Map<string, any>
  registeredEndpoints: Map<string, ApiEndpoint>
  executedOperations: Array<{ adapter: string; operation: string; status: string; timestamp: Date }>
}

const state: RuntimeState = {
  createdAdapters: new Map(),
  registeredEndpoints: new Map(),
  executedOperations: [],
}

// Create MCP server
const server = new Server({
  name: 'qpu-dynamic-mcp',
  version: '2.0.0',
})

// List all dynamic tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools: Tool[] = [
    {
      name: 'endpoint/register',
      description: 'Register a new API endpoint for adapters to call',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Unique endpoint name' },
          method: {
            enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            description: 'HTTP method',
          },
          url: { type: 'string', description: 'API endpoint URL' },
          headers: { type: 'object', description: 'Optional HTTP headers' },
          auth: {
            type: 'object',
            description: 'Optional authentication',
            properties: {
              type: { enum: ['bearer', 'basic', 'api_key'] },
              token: { type: 'string' },
              username: { type: 'string' },
              password: { type: 'string' },
              apiKeyHeader: { type: 'string' },
            },
          },
        },
        required: ['name', 'method', 'url'],
      },
    },

    {
      name: 'adapter/create',
      description: 'Create a new dynamic adapter',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Adapter name' },
          version: { type: 'string', description: 'Adapter version (default: 1.0.0)' },
        },
        required: ['name'],
      },
    },

    {
      name: 'adapter/register-operation',
      description: 'Register an operation on an adapter that calls a registered endpoint',
      inputSchema: {
        type: 'object',
        properties: {
          adapterName: { type: 'string', description: 'Target adapter name' },
          operationName: { type: 'string', description: 'Operation name' },
          endpointName: { type: 'string', description: 'Registered endpoint name' },
        },
        required: ['adapterName', 'operationName', 'endpointName'],
      },
    },

    {
      name: 'adapter/execute',
      description: 'Execute an operation on an adapter',
      inputSchema: {
        type: 'object',
        properties: {
          adapterName: { type: 'string', description: 'Adapter name' },
          operationName: { type: 'string', description: 'Operation name' },
          config: { type: 'object', description: 'Operation configuration' },
        },
        required: ['adapterName', 'operationName'],
      },
    },

    {
      name: 'registry/list-endpoints',
      description: 'List all registered endpoints',
      inputSchema: { type: 'object', properties: {} },
    },

    {
      name: 'registry/list-adapters',
      description: 'List all created adapters',
      inputSchema: { type: 'object', properties: {} },
    },

    {
      name: 'registry/describe-adapter',
      description: 'Get details about an adapter',
      inputSchema: {
        type: 'object',
        properties: {
          adapterName: { type: 'string', description: 'Adapter name' },
        },
        required: ['adapterName'],
      },
    },

    {
      name: 'registry/execution-history',
      description: 'Get execution history',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max results (default: 20)' },
        },
      },
    },
  ]

  return { tools }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const args = request.params.arguments as Record<string, any>

  try {
    switch (request.params.name) {
      case 'endpoint/register': {
        registerEndpoint(args)
        state.registeredEndpoints.set(args.name, args)
        return {
          content: [{ type: 'text', text: `Registered endpoint: ${args.name}` }],
        }
      }

      case 'adapter/create': {
        const adapter = createDynamicAdapter(args.name, args.version || '1.0.0')
        registerAdapter(adapter)
        state.createdAdapters.set(args.name, adapter)
        return {
          content: [{ type: 'text', text: `Created adapter: ${args.name} v${adapter.version}` }],
        }
      }

      case 'adapter/register-operation': {
        const adapter = getAdapter(args.adapterName)
        if (!adapter) throw new Error(`Adapter not found: ${args.adapterName}`)

        const endpoint = getEndpoint(args.endpointName)
        if (!endpoint) throw new Error(`Endpoint not found: ${args.endpointName}`)

        adapter.register(args.operationName, endpoint)

        return {
          content: [
            {
              type: 'text',
              text: `Registered operation: ${args.adapterName}.${args.operationName} → ${args.endpointName}`,
            },
          ],
        }
      }

      case 'adapter/execute': {
        const result = await executeAdapterOperation(args.adapterName, args.operationName, args.config || {})

        state.executedOperations.push({
          adapter: args.adapterName,
          operation: args.operationName,
          status: 'success',
          timestamp: new Date(),
        })

        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        }
      }

      case 'registry/list-endpoints': {
        const endpoints = listEndpoints()
        return {
          content: [{ type: 'text', text: `Registered endpoints:\n${endpoints.map((e) => `  - ${e}`).join('\n')}` }],
        }
      }

      case 'registry/list-adapters': {
        const adapters = listAdapters()
        return {
          content: [{ type: 'text', text: `Created adapters:\n${adapters.map((a) => `  - ${a}`).join('\n')}` }],
        }
      }

      case 'registry/describe-adapter': {
        const adapter = getAdapter(args.adapterName)
        if (!adapter) throw new Error(`Adapter not found: ${args.adapterName}`)

        const description = adapter.describe()
        return {
          content: [{ type: 'text', text: JSON.stringify(description, null, 2) }],
        }
      }

      case 'registry/execution-history': {
        const limit = args.limit || 20
        const history = state.executedOperations.slice(-limit).map((e) => ({
          adapter: e.adapter,
          operation: e.operation,
          status: e.status,
          time: e.timestamp.toISOString(),
        }))

        return {
          content: [{ type: 'text', text: JSON.stringify(history, null, 2) }],
        }
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`)
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${String(error)}` }],
      isError: true,
    }
  }
})

// Start server
const transport = new StdioServerTransport()
server.connect(transport)

console.error('[Dynamic MCP Server] Started')
console.error('[Dynamic MCP Server] Ready for runtime configuration')
console.error('[Dynamic MCP Server] Tools available:')
console.error('  - endpoint/register')
console.error('  - adapter/create')
console.error('  - adapter/register-operation')
console.error('  - adapter/execute')
console.error('  - registry/*')

// Graceful shutdown
process.on('SIGINT', () => {
  console.error('[Dynamic MCP Server] Shutting down...')
  process.exit(0)
})

export { server, state }
