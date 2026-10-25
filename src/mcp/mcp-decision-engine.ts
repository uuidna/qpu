// MCP Decision Engine: Intelligent provider and operation selection
// Decides which provider/operation to use based on criteria, metrics, and history

interface ProviderMetrics {
  name: string
  fidelity: number
  speed: number // ops/sec
  availability: number // 0-1
  cost: number // relative cost
  qubits: number
  errorRate: number
  lastUsed: Date | null
  successRate: number
}

interface CircuitMetrics {
  qubits: number
  depth: number
  twoQubitGates: number
  complexity: 'easy' | 'medium' | 'hard' | 'expert'
}

interface DecisionCriteria {
  optimize: 'fidelity' | 'speed' | 'cost' | 'availability' | 'balanced'
  maxCost?: number
  minFidelity?: number
  minAvailability?: number
  requireQubits?: number
  maxLatency?: number // ms
  preferredProviders?: string[]
}

interface Decision {
  provider: string
  reason: string
  score: number
  metrics: ProviderMetrics
  alternatives: Array<{ provider: string; score: number }>
}

// Provider metrics database
const PROVIDER_METRICS: Record<string, ProviderMetrics> = {
  'ibm-quantum': {
    name: 'IBM Quantum',
    fidelity: 0.9834,
    speed: 0.8,
    availability: 0.99,
    cost: 1.0,
    qubits: 127,
    errorRate: 0.001,
    lastUsed: new Date('2026-10-24'),
    successRate: 0.9834
  },
  'aws-braket': {
    name: 'AWS Braket',
    fidelity: 0.9756,
    speed: 0.7,
    availability: 0.98,
    cost: 1.2,
    qubits: 30,
    errorRate: 0.0015,
    lastUsed: new Date('2026-10-24'),
    successRate: 0.9756
  },
  'ionq': {
    name: 'IonQ',
    fidelity: 0.9892,
    speed: 0.6,
    availability: 0.97,
    cost: 1.5,
    qubits: 11,
    errorRate: 0.002,
    lastUsed: new Date('2026-10-24'),
    successRate: 0.9892
  },
  'rigetti': {
    name: 'Rigetti',
    fidelity: 0.9645,
    speed: 0.9,
    availability: 0.96,
    cost: 0.9,
    qubits: 30,
    errorRate: 0.003,
    lastUsed: new Date('2026-10-23'),
    successRate: 0.9645
  },
  'google-cirq': {
    name: 'Google Cirq',
    fidelity: 0.9912,
    speed: 0.95,
    availability: 0.99,
    cost: 0.5,
    qubits: 53,
    errorRate: 0.0005,
    lastUsed: new Date('2026-10-24'),
    successRate: 0.9912
  }
}

// Decision engine
export class MCPDecisionEngine {
  private metrics: Record<string, ProviderMetrics> = PROVIDER_METRICS

  /**
   * Decide which provider to use based on criteria
   */
  decide(circuit: CircuitMetrics, criteria: DecisionCriteria): Decision {
    const candidates = this.filterCandidates(circuit, criteria)
    const scored = this.scoreProviders(candidates, circuit, criteria)
    const best = scored[0]

    return {
      provider: best.provider,
      reason: this.explainDecision(best, scored, criteria),
      score: best.score,
      metrics: best.metrics,
      alternatives: scored.slice(1, 4).map(s => ({
        provider: s.provider,
        score: s.score
      }))
    }
  }

  /**
   * Filter providers based on circuit requirements and criteria
   */
  private filterCandidates(
    circuit: CircuitMetrics,
    criteria: DecisionCriteria
  ): Array<{ provider: string; metrics: ProviderMetrics }> {
    return Object.entries(this.metrics)
      .filter(([name, m]) => {
        // Must meet circuit requirements
        if (m.qubits < circuit.qubits) return false

        // Must meet cost constraint
        if (criteria.maxCost && m.cost > criteria.maxCost) return false

        // Must meet fidelity constraint
        if (criteria.minFidelity && m.fidelity < criteria.minFidelity) return false

        // Must meet availability constraint
        if (criteria.minAvailability && m.availability < criteria.minAvailability) return false

        return true
      })
      .map(([provider, metrics]) => ({ provider, metrics }))
  }

  /**
   * Score providers based on optimization criteria
   */
  private scoreProviders(
    candidates: Array<{ provider: string; metrics: ProviderMetrics }>,
    circuit: CircuitMetrics,
    criteria: DecisionCriteria
  ): Array<{ provider: string; score: number; metrics: ProviderMetrics }> {
    const scored = candidates.map(({ provider, metrics }) => {
      let score = 0

      switch (criteria.optimize) {
        case 'fidelity':
          score = metrics.fidelity * 100
          // Bonus for right qubit count
          if (metrics.qubits >= circuit.qubits) score += 10
          break

        case 'speed':
          score = metrics.speed * 100
          // Penalty for latency risk on deep circuits
          if (circuit.depth > 50) score -= 5
          break

        case 'cost':
          // Invert cost (lower is better)
          score = (2 - metrics.cost) * 50
          break

        case 'availability':
          score = metrics.availability * 100
          break

        case 'balanced':
        default:
          // Weighted combination
          score =
            metrics.fidelity * 40 +
            metrics.speed * 25 +
            (1 - metrics.cost / 2) * 20 +
            metrics.availability * 15

          // Adjust for circuit complexity
          if (circuit.complexity === 'expert') score *= 1.2 // Prefer high fidelity
          if (circuit.complexity === 'easy') score *= 0.95 // Less critical
          break
      }

      // Freshness bonus (recent use = better maintained)
      if (metrics.lastUsed) {
        const daysSinceUse =
          (Date.now() - metrics.lastUsed.getTime()) / (1000 * 60 * 60 * 24)
        if (daysSinceUse < 1) score += 5
        if (daysSinceUse > 30) score -= 5
      }

      // Success rate multiplier
      score *= metrics.successRate

      return { provider, score, metrics }
    })

    return scored.sort((a, b) => b.score - a.score)
  }

  /**
   * Explain the decision in human-readable form
   */
  private explainDecision(
    best: { provider: string; score: number; metrics: ProviderMetrics },
    alternatives: Array<any>,
    criteria: DecisionCriteria
  ): string {
    let reason = `Selected ${best.metrics.name} (score: ${best.score.toFixed(1)})`

    reason += ` optimizing for ${criteria.optimize}`

    // Add specific advantages
    const advantages: string[] = []

    if (criteria.optimize === 'fidelity' || criteria.optimize === 'balanced') {
      if (best.metrics.fidelity > 0.99) {
        advantages.push(`excellent fidelity (${(best.metrics.fidelity * 100).toFixed(2)}%)`)
      }
    }

    if (criteria.optimize === 'speed') {
      advantages.push(`fast execution (${(best.metrics.speed * 100).toFixed(0)}% speed)`)
    }

    if (criteria.optimize === 'cost') {
      advantages.push(`cost-effective (${(best.metrics.cost * 100).toFixed(0)}% relative cost)`)
    }

    if (best.metrics.qubits > 50) {
      advantages.push(`sufficient qubits (${best.metrics.qubits})`)
    }

    if (best.metrics.availability > 0.98) {
      advantages.push(`highly available (${(best.metrics.availability * 100).toFixed(1)}%)`)
    }

    if (advantages.length > 0) {
      reason += ` with ${advantages.join(', ')}`
    }

    if (alternatives.length > 0) {
      reason += `. Alternative: ${alternatives[0].provider} (${alternatives[0].score.toFixed(1)})`
    }

    return reason
  }

  /**
   * Get recommendation for a specific operation
   */
  recommendOperation(
    operationType: string,
    circuit: CircuitMetrics,
    budget?: number
  ): Decision {
    const criteria: DecisionCriteria = {
      optimize: 'balanced',
      maxCost: budget ? budget / 100 : undefined
    }

    // Adjust based on operation type
    if (operationType === 'research') {
      criteria.optimize = 'fidelity'
      criteria.minFidelity = 0.95
    } else if (operationType === 'production') {
      criteria.optimize = 'balanced'
      criteria.minFidelity = 0.90
      criteria.minAvailability = 0.99
    } else if (operationType === 'exploration') {
      criteria.optimize = 'cost'
    }

    return this.decide(circuit, criteria)
  }

  /**
   * Rank all providers by metric
   */
  rankProviders(metric: keyof ProviderMetrics): Array<{
    provider: string
    value: number
  }> {
    return Object.entries(this.metrics)
      .map(([provider, m]) => ({
        provider,
        value: typeof m[metric] === 'number' ? (m[metric] as number) : 0
      }))
      .sort((a, b) => b.value - a.value)
  }

  /**
   * Get optimal provider for circuit
   */
  optimal(circuit: CircuitMetrics): string {
    const decision = this.decide(circuit, { optimize: 'balanced' })
    return decision.provider
  }

  /**
   * Get fastest provider
   */
  fastest(circuit: CircuitMetrics): string {
    const decision = this.decide(circuit, { optimize: 'speed' })
    return decision.provider
  }

  /**
   * Get most accurate provider
   */
  mostAccurate(circuit: CircuitMetrics): string {
    const decision = this.decide(circuit, { optimize: 'fidelity' })
    return decision.provider
  }

  /**
   * Get cheapest provider
   */
  cheapest(circuit: CircuitMetrics): string {
    const decision = this.decide(circuit, { optimize: 'cost' })
    return decision.provider
  }

  /**
   * Update provider metrics (learning from results)
   */
  updateMetrics(
    provider: string,
    result: {
      success: boolean
      fidelity: number
      responseTime: number
    }
  ): void {
    const m = this.metrics[provider]
    if (!m) return

    // Update success rate (exponential moving average)
    m.successRate = m.successRate * 0.9 + (result.success ? 1 : 0) * 0.1

    // Update fidelity
    m.fidelity = m.fidelity * 0.8 + result.fidelity * 0.2

    // Update last used
    m.lastUsed = new Date()
  }
}

export { Decision, DecisionCriteria, CircuitMetrics, ProviderMetrics }
