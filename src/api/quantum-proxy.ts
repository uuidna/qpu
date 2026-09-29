// Quantum Proxy - Intelligent routing and task splitting across QPU and external AI APIs
import { RoutingError, ValidationError } from '../types/errors.js'

export interface ExternalAPI {
  name: string
  provider: string // OpenAI, Anthropic, Google, etc.
  endpoint: string
  rateLimit: number // req/sec
  latency: number // ms average
  cost: number // $/1k tokens
  capabilities: string[]
  bandwidth: number // current utilization %
}

export interface TaskRequest {
  id: string
  type: 'quantum' | 'classical-ai' | 'hybrid'
  complexity: number // 0-100
  dataSize: number // bytes
  timeout: number // ms
  priority: 'low' | 'normal' | 'high'
  estimatedTokens?: number
}

export interface RoutingDecision {
  requestId: string
  destination: 'qpu' | string // API name
  reason: string
  expectedLatency: number
  estimatedCost: number
  splitStrategy?: 'sequential' | 'parallel' | 'distributed'
  quantumPortion?: number // % of work for QPU
  aiPortion?: number // % of work for external APIs
}

export class QuantumProxy {
  private externalAPIs: Map<string, ExternalAPI> = new Map()
  private requestQueue: TaskRequest[] = []
  private routingHistory: RoutingDecision[] = []
  private bandwidth: Map<string, number> = new Map() // Current usage %
  private costs: Map<string, number> = new Map() // Running costs

  registerExternalAPI(api: ExternalAPI) {
    this.externalAPIs.set(api.name, api)
    this.bandwidth.set(api.name, 0)
    this.costs.set(api.name, 0)
  }

  async routeRequest(request: TaskRequest): Promise<RoutingDecision> {
    const decision: RoutingDecision = {
      requestId: request.id,
      destination: 'qpu',
      reason: '',
      expectedLatency: 0,
      estimatedCost: 0,
    }

    // Quantum-only tasks → QPU
    if (request.type === 'quantum') {
      if (this.canExecuteQuantum(request)) {
        decision.destination = 'qpu'
        decision.reason = 'Pure quantum problem - optimal on QPU'
        decision.expectedLatency = 45 // ms
        decision.estimatedCost = 0 // QPU cost is amortized
      } else {
        // Fallback to fastest available API
        const bestAPI = this.findBestAPI(request, 'speed')
        if (!bestAPI) {
          throw new RoutingError('No available external API found')
        }
        decision.destination = bestAPI.name
        decision.reason = 'Quantum queue full - using classical approximation'
        decision.expectedLatency = bestAPI.latency
      }
    }

    // Classical AI tasks → External APIs
    else if (request.type === 'classical-ai') {
      const best = this.findBestAPI(request, 'cost')
      if (!best) {
        throw new RoutingError('No external API available for classical AI task')
      }
      decision.destination = best.name
      decision.reason = `Routed to ${best.provider} (lowest cost: $${best.cost}/1k tokens)`
      decision.expectedLatency = best.latency
      decision.estimatedCost = (request.estimatedTokens || 100) * (best.cost / 1000)
    }

    // Hybrid tasks → Split between QPU and APIs
    else if (request.type === 'hybrid') {
      const split = this.optimizeSplit(request)
      decision.splitStrategy = split.strategy
      decision.quantumPortion = split.quantumPortion
      decision.aiPortion = split.aiPortion

      decision.destination = `qpu+${split.selectedAPI.name}`
      decision.reason = `Hybrid split: ${split.quantumPortion}% quantum, ${split.aiPortion}% ${split.selectedAPI.provider}`
      decision.expectedLatency = Math.max(
        split.quantumLatency,
        split.selectedAPI.latency
      ) // Parallel latency
      decision.estimatedCost = split.estimatedCost
    }

    this.routingHistory.push(decision)
    return decision
  }

  private canExecuteQuantum(request: TaskRequest): boolean {
    // Check if QPU can handle request size and complexity
    if (request.complexity > 95) return false // Too complex
    if (request.dataSize > 1_000_000) return false // Too large
    if (request.timeout < 100) return false // Too tight deadline

    return true
  }

  private findBestAPI(
    request: TaskRequest,
    criterion: 'speed' | 'cost' | 'bandwidth'
  ): ExternalAPI | null {
    let best: ExternalAPI | null = null
    let bestScore = criterion === 'speed' ? Infinity : 0

    for (const api of this.externalAPIs.values()) {
      let score: number
      const apiBandwidth = this.bandwidth.get(api.name) ?? 0

      if (criterion === 'speed') {
        score = api.latency + apiBandwidth * 100
      } else if (criterion === 'cost') {
        score = api.cost
      } else {
        score = apiBandwidth
      }

      if (criterion === 'speed' || criterion === 'bandwidth') {
        if (score < bestScore || !best) {
          best = api
          bestScore = score
        }
      } else {
        if (score < bestScore || !best) {
          best = api
          bestScore = score
        }
      }
    }

    return best
  }

  private optimizeSplit(request: TaskRequest): {
    strategy: 'sequential' | 'parallel' | 'distributed'
    quantumPortion: number
    aiPortion: number
    quantumLatency: number
    selectedAPI: ExternalAPI
    estimatedCost: number
  } {
    const bestAPI = this.findBestAPI(request, 'bandwidth')
    if (!bestAPI) {
      throw new RoutingError('No external API available for hybrid task')
    }

    const quantumPortion = Math.min(80, Math.max(20, request.complexity / 2))
    const aiPortion = 100 - quantumPortion

    const strategy: 'sequential' | 'parallel' | 'distributed' = request.complexity > 70 ? 'parallel' : 'sequential'

    const quantumLatency = 50
    const estimatedCost = (request.estimatedTokens || 100) * (bestAPI.cost / 1000) * (aiPortion / 100)

    return {
      strategy,
      quantumPortion,
      aiPortion,
      quantumLatency,
      selectedAPI: bestAPI,
      estimatedCost,
    }
  }

  getBandwidthStatus(): Record<string, { api: ExternalAPI; utilization: number }> {
    const status: Record<string, { api: ExternalAPI; utilization: number }> = {}

    for (const [name, api] of this.externalAPIs) {
      status[name] = {
        api,
        utilization: this.bandwidth.get(name) || 0,
      }
    }

    return status
  }

  getRoutingStats(): {
    totalRequests: number
    quantumRequests: number
    classicalRequests: number
    hybridRequests: number
    totalCost: number
    avgLatency: number
  } {
    const quantumCount = this.routingHistory.filter(r => r.destination === 'qpu').length
    const classicalCount = this.routingHistory.filter(r => r.destination !== 'qpu' && !r.splitStrategy).length
    const hybridCount = this.routingHistory.filter(r => r.splitStrategy).length

    const totalCost = Array.from(this.costs.values()).reduce((a, b) => a + b, 0)
    const avgLatency = this.routingHistory.length > 0
      ? this.routingHistory.reduce((sum, r) => sum + r.expectedLatency, 0) / this.routingHistory.length
      : 0

    return {
      totalRequests: this.routingHistory.length,
      quantumRequests: quantumCount,
      classicalRequests: classicalCount,
      hybridRequests: hybridCount,
      totalCost,
      avgLatency,
    }
  }

  optimizeBandwidth(): {
    recommendations: string[]
    potentialSavings: number
  } {
    const recommendations: string[] = []
    let savings = 0

    // Recommend load balancing to underutilized APIs
    const apis = Array.from(this.externalAPIs.values()).sort(
      (a, b) => (this.bandwidth.get(a.name) || 0) - (this.bandwidth.get(b.name) || 0)
    )

    if (apis[0] && apis[apis.length - 1]) {
      const underutilized = apis[0]
      const overutilized = apis[apis.length - 1]
      const utilizationGap =
        (this.bandwidth.get(overutilized.name) || 0) - (this.bandwidth.get(underutilized.name) || 0)

      if (utilizationGap > 30) {
        recommendations.push(
          `Load balance: shift requests from ${overutilized.name} to ${underutilized.name}`
        )
        savings += utilizationGap * 5 // Estimated cost savings
      }
    }

    // Recommend hybrid splitting for complex tasks
    recommendations.push('Use hybrid splitting for complexity > 70 (parallel execution)')

    // Cost optimization
    const cheapestAPI = this.findBestAPI({ estimatedTokens: 1000 } as TaskRequest, 'cost')
    if (cheapestAPI) {
      recommendations.push(`Route pure-AI tasks to ${cheapestAPI.name} (lowest cost)`)
    }

    return {
      recommendations,
      potentialSavings: savings,
    }
  }

  getStats() {
    return {
      registeredAPIs: this.externalAPIs.size,
      requestsProcessed: this.routingHistory.length,
      routing: this.getRoutingStats(),
      bandwidth: this.getBandwidthStatus(),
      optimization: this.optimizeBandwidth(),
    }
  }
}

export const proxy = new QuantumProxy()
