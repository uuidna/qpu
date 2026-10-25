// MCP Server: Live QPU service exposing all 13 adapters via MCP protocol
// Clients can call any adapter operation through MCP tools and resources

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  TextContent,
  Tool,
  Resource,
} from '@modelcontextprotocol/sdk/types.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

import { adapters, executeAdapterOperation, type AdapterName } from './adapters.js'
import { mcpCapabilities } from './mcp-capabilities.js'

interface StreamEvent {
  type: 'start' | 'progress' | 'complete' | 'error'
  adapter: AdapterName
  operation: string
  timestamp: string
  data?: unknown
  error?: string
}

// Create MCP server
const server = new Server({
  name: 'qpu-mcp-server',
  version: '1.1.0',
})

// Stream events to clients
const streamEventListeners: ((event: StreamEvent) => void)[] = []

function emitStreamEvent(event: StreamEvent) {
  streamEventListeners.forEach((listener) => listener(event))
}

// List all adapter tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools: Tool[] = []

  Object.entries(adapters).forEach(([adapterName, adapter]) => {
    Object.entries(adapter.operations).forEach(([opName]) => {
      tools.push({
        name: `${adapterName}/${opName}`,
        description: `${adapterName}.${opName}() - Execute ${opName} operation on ${adapterName} adapter`,
        inputSchema: {
          type: 'object',
          properties: {
            config: {
              type: 'object',
              description: 'Configuration object for the operation',
            },
          },
          required: ['config'],
        },
      })
    })
  })

  return { tools }
})

// Call adapter tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const [adapterName, operationName] = request.params.name.split('/')
  const config = (request.params.arguments as any)?.config || {}

  emitStreamEvent({
    type: 'start',
    adapter: adapterName as AdapterName,
    operation: operationName,
    timestamp: new Date().toISOString(),
  })

  try {
    const result = executeAdapterOperation(adapterName as AdapterName, operationName, config)

    emitStreamEvent({
      type: 'complete',
      adapter: adapterName as AdapterName,
      operation: operationName,
      timestamp: new Date().toISOString(),
      data: result,
    })

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    }
  } catch (error) {
    const errorMsg = String(error)

    emitStreamEvent({
      type: 'error',
      adapter: adapterName as AdapterName,
      operation: operationName,
      timestamp: new Date().toISOString(),
      error: errorMsg,
    })

    return {
      content: [
        {
          type: 'text' as const,
          text: `Error: ${errorMsg}`,
        },
      ],
      isError: true,
    }
  }
})

// List all resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const { resources } = mcpCapabilities.listOf()

  return {
    resources: resources.map((r) => ({
      uri: r.uri,
      name: r.name,
      description: r.description,
      mimeType: r.mimeType,
    })),
  }
})

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri

  const data = mcpCapabilities.readOf(uri)
  if (!data) {
    throw new Error(`Resource not found: ${uri}`)
  }

  return {
    contents: [
      {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(data.data, null, 2),
      },
    ],
  }
})

// Start server
const transport = new StdioServerTransport()
server.connect(transport)

// Log startup
console.error('[QPU MCP Server] Started')
console.error('[QPU MCP Server] 13 adapters, 60 operations ready')
console.error('[QPU MCP Server] Streaming mode enabled')

// Graceful shutdown
process.on('SIGINT', () => {
  console.error('[QPU MCP Server] Shutting down...')
  process.exit(0)
})

export { server, emitStreamEvent, streamEventListeners }
