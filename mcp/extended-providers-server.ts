// Extended Providers MCP Server
// Integrates D-Wave, Quantinuum, Pasqal, Xanadu, and 8+ other providers

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js'

import {
  DWaveAdapter,
  QuantinuumAdapter,
  PasqalAdapter,
  XanaduAdapter,
  ExtendedProviderRegistry
} from '../src/quantum/extended-providers-adapters.js'

class ExtendedProvidersServer {
  private server: Server
  private dWave: DWaveAdapter
  private quantinuum: QuantinuumAdapter
  private pasqal: PasqalAdapter
  private xanadu: XanaduAdapter
  private registry: ExtendedProviderRegistry

  constructor() {
    this.server = new Server({
      name: 'extended-providers-mcp',
      version: '1.0.0'
    })

    this.dWave = new DWaveAdapter()
    this.quantinuum = new QuantinuumAdapter()
    this.pasqal = new PasqalAdapter()
    this.xanadu = new XanaduAdapter()
    this.registry = new ExtendedProviderRegistry()

    this.setupToolHandlers()
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getTools()
    }))

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      return this.handleToolCall(
        request.params.name,
        request.params.arguments as Record<string, unknown>
      )
    })
  }

  private getTools(): Tool[] {
    return [
      // D-Wave Annealing
      {
        name: 'transpile_to_dwave_annealing',
        description: 'Convert gate-based circuit to D-Wave QUBO problem',
        inputSchema: {
          type: 'object' as const,
          properties: {
            circuit: {
              type: 'object',
              description: 'Quantum circuit with gates and measurements'
            }
          },
          required: ['circuit']
        }
      },
      {
        name: 'optimize_maxcut_dwave',
        description: 'Optimize MaxCut problem for D-Wave annealer',
        inputSchema: {
          type: 'object' as const,
          properties: {
            graph: { type: 'object', description: 'Graph with nodes and edges' }
          },
          required: ['graph']
        }
      },
      {
        name: 'execute_annealing_problem',
        description: 'Execute optimization problem on D-Wave Advantage',
        inputSchema: {
          type: 'object' as const,
          properties: {
            problem: {
              type: 'object',
              description: 'QUBO or annealing problem'
            }
          },
          required: ['problem']
        }
      },

      // Quantinuum Native Gates
      {
        name: 'transpile_to_quantinuum',
        description: 'Transpile circuit to Quantinuum native gates',
        inputSchema: {
          type: 'object' as const,
          properties: {
            circuit: { type: 'object' }
          },
          required: ['circuit']
        }
      },
      {
        name: 'enable_midcircuit_measurement',
        description: 'Enable mid-circuit measurement with classical feedback',
        inputSchema: {
          type: 'object' as const,
          properties: {
            circuit: { type: 'object' },
            measurementPoint: { type: 'number' }
          },
          required: ['circuit', 'measurementPoint']
        }
      },
      {
        name: 'estimate_quantinuum_fidelity',
        description: 'Estimate native gate fidelity for Quantinuum',
        inputSchema: {
          type: 'object' as const,
          properties: {
            circuit: { type: 'object' }
          },
          required: ['circuit']
        }
      },

      // Pasqal Analog Quantum
      {
        name: 'program_analog_hamiltonian',
        description: 'Program analog Hamiltonian for Pasqal',
        inputSchema: {
          type: 'object' as const,
          properties: {
            circuit: { type: 'object' }
          },
          required: ['circuit']
        }
      },
      {
        name: 'reconfigure_pasqal_topology',
        description: 'Reconfigure qubit connectivity on Pasqal',
        inputSchema: {
          type: 'object' as const,
          properties: {
            geometry: {
              type: 'string',
              enum: ['triangular', 'hexagonal', 'custom']
            }
          },
          required: ['geometry']
        }
      },

      // Xanadu Photonic
      {
        name: 'program_photonic_circuit',
        description: 'Program photonic circuit for Xanadu',
        inputSchema: {
          type: 'object' as const,
          properties: {
            circuit: { type: 'object' }
          },
          required: ['circuit']
        }
      },
      {
        name: 'optimize_gaussian_xanadu',
        description: 'Optimize Gaussian operations for Xanadu',
        inputSchema: {
          type: 'object' as const,
          properties: {
            circuit: { type: 'object' }
          },
          required: ['circuit']
        }
      },

      // Provider Registry
      {
        name: 'list_all_providers',
        description: 'List all 12+ available quantum providers',
        inputSchema: { type: 'object' as const, properties: {} }
      },
      {
        name: 'get_provider_specs',
        description: 'Get detailed specs for a provider',
        inputSchema: {
          type: 'object' as const,
          properties: {
            provider: { type: 'string' }
          },
          required: ['provider']
        }
      },
      {
        name: 'get_providers_by_type',
        description: 'Get providers filtered by type (gate-based, annealing, analog)',
        inputSchema: {
          type: 'object' as const,
          properties: {
            type: {
              type: 'string',
              enum: ['gate-based', 'annealing', 'analog', 'hybrid']
            }
          },
          required: ['type']
        }
      },
      {
        name: 'compare_provider_costs',
        description: 'Compare execution costs across all providers',
        inputSchema: {
          type: 'object' as const,
          properties: {
            circuit: { type: 'object' },
            shots: { type: 'number', default: 1000 }
          },
          required: ['circuit']
        }
      },
      {
        name: 'recommend_provider',
        description: 'Get best provider recommendation for circuit',
        inputSchema: {
          type: 'object' as const,
          properties: {
            circuit: { type: 'object' },
            objective: {
              type: 'string',
              enum: ['fidelity', 'cost', 'speed'],
              default: 'fidelity'
            }
          },
          required: ['circuit']
        }
      },
      {
        name: 'route_to_best_provider',
        description: 'Route circuit to optimal provider with cost-fidelity tradeoff',
        inputSchema: {
          type: 'object' as const,
          properties: {
            circuit: { type: 'object' },
            budget: { type: 'number', description: 'Max cost in USD' }
          },
          required: ['circuit']
        }
      }
    ]
  }

  private async handleToolCall(
    name: string,
    args: Record<string, unknown>
  ): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      let result: unknown

      switch (name) {
        case 'transpile_to_dwave_annealing':
          result = this.dWave.transpileToAnnealing(args.circuit as any)
          break
        case 'optimize_maxcut_dwave':
          result = this.dWave.optimizeMaxCut(args.graph as any)
          break
        case 'execute_annealing_problem':
          result = await this.dWave.executeAnnealingProblem(args.problem as any)
          break

        case 'transpile_to_quantinuum':
          result = this.quantinuum.transpileToNative(args.circuit as any)
          break
        case 'enable_midcircuit_measurement':
          result = this.quantinuum.enableMidCircuitMeasurement(
            args.circuit as any,
            args.measurementPoint as number
          )
          break
        case 'estimate_quantinuum_fidelity':
          result = this.quantinuum.estimateFidelity(args.circuit as any)
          break

        case 'program_analog_hamiltonian':
          result = this.pasqal.programAnalogHamiltonian(args.circuit as any)
          break
        case 'reconfigure_pasqal_topology':
          result = this.pasqal.reconfigureTopology(
            args.geometry as 'triangular' | 'hexagonal' | 'custom'
          )
          break

        case 'program_photonic_circuit':
          result = this.xanadu.programPhotonic(args.circuit as any)
          break
        case 'optimize_gaussian_xanadu':
          result = this.xanadu.optimizeGaussian(args.circuit as any)
          break

        case 'list_all_providers':
          result = {
            providers: this.registry.listProviders(),
            total: this.registry.listProviders().length
          }
          break
        case 'get_provider_specs':
          result = this.registry.getProvider(args.provider as string)
          break
        case 'get_providers_by_type':
          result = {
            type: args.type,
            providers: this.registry.getProvidersByType(args.type as string),
            count: this.registry.getProvidersByType(args.type as string).length
          }
          break
        case 'compare_provider_costs':
          result = {
            circuit: args.circuit,
            shots: args.shots || 1000,
            costs: this.registry.compareCosts(args.circuit as any, (args.shots as number) || 1000)
          }
          break
        case 'recommend_provider':
          result = {
            circuit: args.circuit,
            objective: args.objective || 'fidelity',
            recommendedProvider: this.registry.recommendProvider(
              args.circuit as any,
              (args.objective as any) || 'fidelity'
            )
          }
          break
        case 'route_to_best_provider':
          const budget = args.budget as number
          const costs = this.registry.compareCosts(args.circuit as any)
          const affordable = Object.entries(costs)
            .filter(([_, cost]) => cost <= budget)
            .map(([provider]) => provider)

          result = {
            budget,
            affordable,
            recommended:
              affordable.length > 0
                ? affordable[0]
                : this.registry.recommendProvider(args.circuit as any, 'cost')
          }
          break

        default:
          throw new Error(`Unknown tool: ${name}`)
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      }
    }
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error('Extended Providers MCP Server started on stdio')
  }
}

// Main
const server = new ExtendedProvidersServer()
server.start().catch(console.error)
