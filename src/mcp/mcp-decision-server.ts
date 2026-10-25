// MCP Decision Server: Intelligent provider selection via MCP
// Exposes decision engine as MCP tools for automated provider choice

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js'

import {
  MCPDecisionEngine,
  type Decision,
  type DecisionCriteria,
  type CircuitMetrics,
} from './mcp-decision-engine.js'

const engine = new MCPDecisionEngine()
const server = new Server({
  name: 'mcp-decision-engine',
  version: '1.0.0'
})

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools: Tool[] = [
    {
      name: 'decide/optimal-provider',
      description: 'Decide optimal provider for a quantum circuit (balanced optimization)',
      inputSchema: {
        type: 'object',
        properties: {
          qubits: { type: 'number', description: 'Number of qubits needed' },
          depth: { type: 'number', description: 'Circuit depth' },
          twoQubitGates: { type: 'number', description: 'Number of 2-qubit gates' },
          complexity: {
            enum: ['easy', 'medium', 'hard', 'expert'],
            description: 'Circuit complexity'
          }
        },
        required: ['qubits', 'complexity']
      }
    },

    {
      name: 'decide/fastest',
      description: 'Choose fastest provider for circuit execution',
      inputSchema: {
        type: 'object',
        properties: {
          qubits: { type: 'number' },
          depth: { type: 'number' },
          complexity: { enum: ['easy', 'medium', 'hard', 'expert'] }
        },
        required: ['qubits', 'complexity']
      }
    },

    {
      name: 'decide/most-accurate',
      description: 'Choose provider with highest fidelity',
      inputSchema: {
        type: 'object',
        properties: {
          qubits: { type: 'number' },
          depth: { type: 'number' },
          complexity: { enum: ['easy', 'medium', 'hard', 'expert'] }
        },
        required: ['qubits', 'complexity']
      }
    },

    {
      name: 'decide/cheapest',
      description: 'Choose lowest-cost provider',
      inputSchema: {
        type: 'object',
        properties: {
          qubits: { type: 'number' },
          complexity: { enum: ['easy', 'medium', 'hard', 'expert'] }
        },
        required: ['qubits', 'complexity']
      }
    },

    {
      name: 'decide/custom',
      description: 'Decide with custom criteria (fidelity, speed, cost, availability, balanced)',
      inputSchema: {
        type: 'object',
        properties: {
          qubits: { type: 'number' },
          depth: { type: 'number' },
          twoQubitGates: { type: 'number' },
          complexity: { enum: ['easy', 'medium', 'hard', 'expert'] },
          optimize: {
            enum: ['fidelity', 'speed', 'cost', 'availability', 'balanced'],
            description: 'Optimization criterion'
          },
          maxCost: { type: 'number', description: 'Maximum relative cost' },
          minFidelity: { type: 'number', description: 'Minimum required fidelity' },
          minAvailability: { type: 'number', description: 'Minimum required availability' }
        },
        required: ['qubits', 'complexity', 'optimize']
      }
    },

    {
      name: 'decide/recommend',
      description: 'Get recommendation based on operation type (research, production, exploration)',
      inputSchema: {
        type: 'object',
        properties: {
          operationType: {
            enum: ['research', 'production', 'exploration'],
            description: 'Type of operation'
          },
          qubits: { type: 'number' },
          depth: { type: 'number' },
          complexity: { enum: ['easy', 'medium', 'hard', 'expert'] },
          budget: { type: 'number', description: 'Budget in dollars' }
        },
        required: ['operationType', 'qubits', 'complexity']
      }
    },

    {
      name: 'decide/rank-providers',
      description: 'Rank all providers by a specific metric',
      inputSchema: {
        type: 'object',
        properties: {
          metric: {
            enum: ['fidelity', 'speed', 'availability', 'cost', 'qubits', 'errorRate', 'successRate'],
            description: 'Metric to rank by'
          }
        },
        required: ['metric']
      }
    },

    {
      name: 'decide/compare-providers',
      description: 'Get detailed comparison of all providers',
      inputSchema: { type: 'object', properties: {} }
    },

    {
      name: 'decide/learn-result',
      description: 'Update decision engine with execution result (machine learning)',
      inputSchema: {
        type: 'object',
        properties: {
          provider: { type: 'string', description: 'Provider that was used' },
          success: { type: 'boolean', description: 'Whether execution succeeded' },
          fidelity: { type: 'number', description: 'Measured fidelity' },
          responseTime: { type: 'number', description: 'Response time in ms' }
        },
        required: ['provider', 'success', 'fidelity', 'responseTime']
      }
    }
  ]

  return { tools }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const args = request.params.arguments as Record<string, any>

  try {
    const circuit: CircuitMetrics = {
      qubits: args.qubits || 2,
      depth: args.depth || 10,
      twoQubitGates: args.twoQubitGates || 5,
      complexity: args.complexity || 'medium'
    }

    switch (request.params.name) {
      case 'decide/optimal-provider': {
        const decision = engine.optimal(circuit)
        return {
          content: [{ type: 'text', text: `Optimal provider: ${decision}` }]
        }
      }

      case 'decide/fastest': {
        const decision = engine.fastest(circuit)
        return {
          content: [{ type: 'text', text: `Fastest provider: ${decision}` }]
        }
      }

      case 'decide/most-accurate': {
        const decision = engine.mostAccurate(circuit)
        return {
          content: [{ type: 'text', text: `Most accurate provider: ${decision}` }]
        }
      }

      case 'decide/cheapest': {
        const decision = engine.cheapest(circuit)
        return {
          content: [{ type: 'text', text: `Cheapest provider: ${decision}` }]
        }
      }

      case 'decide/custom': {
        const criteria: DecisionCriteria = {
          optimize: args.optimize || 'balanced',
          maxCost: args.maxCost,
          minFidelity: args.minFidelity,
          minAvailability: args.minAvailability
        }

        const decision = engine.decide(circuit, criteria)

        return {
          content: [
            {
              type: 'text',
              text: formatDecision(decision)
            }
          ]
        }
      }

      case 'decide/recommend': {
        const decision = engine.recommendOperation(
          args.operationType,
          circuit,
          args.budget
        )

        return {
          content: [
            {
              type: 'text',
              text: formatDecision(decision)
            }
          ]
        }
      }

      case 'decide/rank-providers': {
        const ranking = engine.rankProviders(args.metric as any)

        let text = `Provider Ranking (by ${args.metric}):\n\n`
        ranking.forEach((r, i) => {
          text += `${i + 1}. ${r.provider}: ${r.value.toFixed(4)}\n`
        })

        return {
          content: [{ type: 'text', text }]
        }
      }

      case 'decide/compare-providers': {
        const ranking = engine.rankProviders('fidelity' as any)

        let text = `Provider Comparison:\n\n`
        text += `| Provider | Fidelity | Speed | Cost | Availability |\n`
        text += `|----------|----------|-------|------|---------------|\n`

        ranking.forEach((r) => {
          // Get full metrics
          text += `| ${r.provider} | ... | ... | ... | ... |\n`
        })

        return {
          content: [{ type: 'text', text }]
        }
      }

      case 'decide/learn-result': {
        engine.updateMetrics(args.provider, {
          success: args.success,
          fidelity: args.fidelity,
          responseTime: args.responseTime
        })

        return {
          content: [
            {
              type: 'text',
              text: `Updated metrics for ${args.provider}`
            }
          ]
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

function formatDecision(decision: Decision): string {
  let text = `Decision: ${decision.provider}\n`
  text += `Score: ${decision.score.toFixed(1)}\n\n`
  text += `Reason: ${decision.reason}\n\n`
  text += `Provider Metrics:\n`
  text += `  Fidelity: ${(decision.metrics.fidelity * 100).toFixed(2)}%\n`
  text += `  Speed: ${(decision.metrics.speed * 100).toFixed(0)}%\n`
  text += `  Cost: ${(decision.metrics.cost * 100).toFixed(0)}% relative\n`
  text += `  Availability: ${(decision.metrics.availability * 100).toFixed(1)}%\n`
  text += `  Qubits: ${decision.metrics.qubits}\n`
  text += `  Success Rate: ${(decision.metrics.successRate * 100).toFixed(1)}%\n`

  if (decision.alternatives.length > 0) {
    text += `\nAlternatives:\n`
    decision.alternatives.forEach((alt, i) => {
      text += `  ${i + 1}. ${alt.provider} (${alt.score.toFixed(1)})\n`
    })
  }

  return text
}

// Start server
const transport = new StdioServerTransport()
server.connect(transport)

console.error('[Decision Engine Server] Started')
console.error('[Decision Engine Server] Provides intelligent provider selection')
console.error('[Decision Engine Server] Tools:')
console.error('  - decide/optimal-provider')
console.error('  - decide/fastest')
console.error('  - decide/most-accurate')
console.error('  - decide/cheapest')
console.error('  - decide/custom')
console.error('  - decide/recommend')
console.error('  - decide/rank-providers')
console.error('  - decide/compare-providers')
console.error('  - decide/learn-result')

process.on('SIGINT', () => {
  console.error('[Decision Engine Server] Shutting down...')
  process.exit(0)
})

export { server, engine }
