// Framework Server: Expose QPU as backend for external quantum frameworks
// Any framework can submit circuits via MCP and get results from QPU providers

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js'

import { FrameworkBridge } from './mcp-framework-bridge.js'

const bridge = new FrameworkBridge()
const server = new Server({
  name: 'mcp-framework-bridge',
  version: '1.0.0'
})

// Execution history for tracking
const executionHistory: any[] = []

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools: Tool[] = [
    {
      name: 'framework/compute',
      description: 'Execute quantum circuit from external framework via QPU',
      inputSchema: {
        type: 'object',
        properties: {
          framework: {
            enum: ['qiskit', 'cirq', 'pennylane', 'pyquil'],
            description: 'Quantum framework (Qiskit, Cirq, PennyLane, PyQuil)'
          },
          circuitJson: {
            type: 'string',
            description: 'Circuit serialized as JSON or QASM'
          },
          provider: {
            type: 'string',
            description: 'Target provider (auto-select if not specified)'
          },
          shots: {
            type: 'number',
            description: 'Number of measurement shots (default: 1000)'
          }
        },
        required: ['framework', 'circuitJson']
      }
    },

    {
      name: 'framework/convert',
      description: 'Convert circuit between quantum frameworks',
      inputSchema: {
        type: 'object',
        properties: {
          circuitJson: {
            type: 'string',
            description: 'Circuit in JSON format'
          },
          fromFormat: {
            enum: ['qiskit', 'cirq', 'pennylane', 'pyquil', 'qasm'],
            description: 'Source framework'
          },
          toFormat: {
            enum: ['qiskit', 'cirq', 'pennylane', 'pyquil', 'qasm'],
            description: 'Target framework'
          }
        },
        required: ['circuitJson', 'fromFormat', 'toFormat']
      }
    },

    {
      name: 'framework/run',
      description: 'Run circuit with automatic framework detection',
      inputSchema: {
        type: 'object',
        properties: {
          circuitJson: {
            type: 'string',
            description: 'Circuit serialized as JSON'
          },
          provider: {
            type: 'string',
            description: 'Target provider (auto-select if not specified)'
          },
          shots: {
            type: 'number',
            description: 'Number of shots'
          }
        },
        required: ['circuitJson']
      }
    },

    {
      name: 'framework/supported',
      description: 'List supported quantum frameworks',
      inputSchema: { type: 'object', properties: {} }
    },

    {
      name: 'framework/history',
      description: 'Get execution history from external frameworks',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Number of recent executions (default: 20)'
          },
          framework: {
            type: 'string',
            description: 'Filter by framework (optional)'
          }
        }
      }
    },

    {
      name: 'framework/benchmark',
      description: 'Benchmark circuit execution across multiple frameworks and providers',
      inputSchema: {
        type: 'object',
        properties: {
          circuitJson: {
            type: 'string',
            description: 'Circuit to benchmark'
          },
          frameworks: {
            type: 'array',
            items: { type: 'string' },
            description: 'Frameworks to test'
          },
          providers: {
            type: 'array',
            items: { type: 'string' },
            description: 'Providers to test'
          }
        },
        required: ['circuitJson']
      }
    }
  ]

  return { tools }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const args = request.params.arguments as Record<string, any>

  try {
    switch (request.params.name) {
      case 'framework/compute': {
        const circuit = JSON.parse(args.circuitJson)

        const result = await bridge.compute({
          framework: args.framework,
          circuit: {
            format: args.framework,
            circuit
          },
          provider: args.provider,
          shots: args.shots || 1000
        })

        executionHistory.push({
          timestamp: new Date().toISOString(),
          ...result
        })

        return {
          content: [{ type: 'text', text: formatResult(result) }]
        }
      }

      case 'framework/convert': {
        const circuit = JSON.parse(args.circuitJson)

        const converted = await bridge.convertCircuit(
          circuit,
          args.fromFormat,
          args.toFormat
        )

        return {
          content: [
            {
              type: 'text',
              text: `Converted from ${args.fromFormat} to ${args.toFormat}\n\n${JSON.stringify(converted, null, 2)}`
            }
          ]
        }
      }

      case 'framework/run': {
        const circuit = JSON.parse(args.circuitJson)

        const result = await bridge.run(circuit, args.provider, args.shots || 1000)

        executionHistory.push({
          timestamp: new Date().toISOString(),
          ...result
        })

        return {
          content: [{ type: 'text', text: formatResult(result) }]
        }
      }

      case 'framework/supported': {
        const frameworks = bridge.listFrameworks()

        let text = 'Supported Quantum Frameworks:\n\n'
        text += frameworks.map((f, i) => `${i + 1}. ${f.toUpperCase()}`).join('\n')
        text += '\n\nUse framework/compute to execute circuits from any framework via QPU.'

        return {
          content: [{ type: 'text', text }]
        }
      }

      case 'framework/history': {
        const limit = args.limit || 20
        let history = executionHistory.slice(-limit)

        if (args.framework) {
          history = history.filter((e) => e.framework === args.framework)
        }

        let text = `Execution History (${history.length} recent)\n\n`
        history.forEach((e) => {
          text += `${e.timestamp} | ${e.framework} → ${e.provider} | ${e.shots} shots\n`
        })

        return {
          content: [{ type: 'text', text }]
        }
      }

      case 'framework/benchmark': {
        const circuit = JSON.parse(args.circuitJson)
        const frameworks = args.frameworks || bridge.listFrameworks()
        const providers = args.providers || ['ibm-quantum', 'aws-braket', 'ionq']

        let text = `Benchmarking Circuit Across ${frameworks.length} Frameworks × ${providers.length} Providers\n\n`

        for (const framework of frameworks) {
          for (const provider of providers) {
            const result = await bridge.compute({
              framework,
              circuit: {
                format: framework,
                circuit
              },
              provider,
              shots: 1000
            })

            text += `${framework} → ${provider}: ${result.metadata.executionTime.toFixed(0)}ms, ${(result.metadata.fidelity! * 100).toFixed(2)}% fidelity\n`

            executionHistory.push({
              timestamp: new Date().toISOString(),
              ...result
            })
          }
        }

        return {
          content: [{ type: 'text', text }]
        }
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`)
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${String(error)}` }],
      isError: true
    }
  }
})

function formatResult(result: any): string {
  let text = `Computation Result\n\n`
  text += `Framework: ${result.framework}\n`
  text += `Provider: ${result.provider}\n`
  text += `Shots: ${result.shots}\n\n`

  text += `Measurement Counts:\n`
  Object.entries(result.counts)
    .slice(0, 10)
    .forEach(([state, count]) => {
      text += `  |${state}⟩: ${count}\n`
    })

  if (Object.keys(result.counts).length > 10) {
    text += `  ... and ${Object.keys(result.counts).length - 10} more\n`
  }

  text += `\nMetadata:\n`
  text += `  Execution Time: ${result.metadata.executionTime.toFixed(0)}ms\n`
  if (result.metadata.fidelity) {
    text += `  Fidelity: ${(result.metadata.fidelity * 100).toFixed(2)}%\n`
  }
  text += `  Qubits: ${result.metadata.qubits}\n`
  text += `  Circuit Depth: ${result.metadata.circuitDepth}\n`

  return text
}

// Start server
const transport = new StdioServerTransport()
server.connect(transport)

console.error('[Framework Bridge Server] Started')
console.error('[Framework Bridge Server] Enables any quantum framework to use QPU')
console.error('[Framework Bridge Server] Supported frameworks:')
console.error('  - Qiskit')
console.error('  - Cirq')
console.error('  - PennyLane')
console.error('  - PyQuil')

process.on('SIGINT', () => {
  console.error('[Framework Bridge Server] Shutting down...')
  process.exit(0)
})

export { server, bridge }
