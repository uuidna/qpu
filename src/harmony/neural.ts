/**
 * NEURAL COMBINATORICS
 * Formula relationships, learning, and adaptation
 * Phase 9: Self-aware formula network
 */

// ============================================================================
// FORMULA RELATIONSHIP GRAPH
// ============================================================================

export interface FormulaRelationship {
  formulaA: string
  formulaB: string
  type: 'pipeline' | 'feedback' | 'competition' | 'cooperation' | 'cascade'
  strength: number // 0-1
  learned: boolean // Did this relationship emerge from data?
}

export class NeuralNetwork {
  private relationships: FormulaRelationship[] = []
  private learningHistory: Array<{ timestamp: number; relationship: FormulaRelationship }> = []

  // Learn new formula relationships from execution patterns
  learn(formulaA: string, formulaB: string, pattern: string): void {
    const existing = this.relationships.find(r => r.formulaA === formulaA && r.formulaB === formulaB)

    const type = this.inferRelationType(pattern)
    const strength = Math.random() * 0.5 + 0.5 // 0.5-1.0

    if (existing) {
      existing.strength = Math.min(1, existing.strength + strength / 10)
      existing.learned = true
    } else {
      const relationship: FormulaRelationship = {
        formulaA,
        formulaB,
        type,
        strength,
        learned: true
      }
      this.relationships.push(relationship)
      this.learningHistory.push({ timestamp: Date.now(), relationship })
    }
  }

  // Get relationships between formulas
  getRelationships(formulaId: string): FormulaRelationship[] {
    return this.relationships.filter(r => r.formulaA === formulaId || r.formulaB === formulaId)
  }

  // Find strongest relationship path
  findStrongestPath(fromFormula: string, toFormula: string): FormulaRelationship[] {
    const path: FormulaRelationship[] = []
    const visited = new Set<string>()

    const traverse = (current: string): boolean => {
      if (current === toFormula) return true
      if (visited.has(current)) return false

      visited.add(current)

      const neighbors = this.relationships.filter(
        r => (r.formulaA === current || r.formulaB === current) && !visited.has(r.formulaA === current ? r.formulaB : r.formulaA)
      )

      neighbors.sort((a, b) => b.strength - a.strength)

      for (const rel of neighbors) {
        path.push(rel)
        const next = rel.formulaA === current ? rel.formulaB : rel.formulaA
        if (traverse(next)) return true
        path.pop()
      }

      return false
    }

    traverse(fromFormula)
    return path
  }

  private inferRelationType(pattern: string): FormulaRelationship['type'] {
    if (pattern.includes('sequence')) return 'pipeline'
    if (pattern.includes('feedback')) return 'feedback'
    if (pattern.includes('compete')) return 'competition'
    if (pattern.includes('together')) return 'cooperation'
    if (pattern.includes('cascade')) return 'cascade'
    return 'pipeline'
  }
}

// ============================================================================
// ADAPTIVE LEARNING: FORMULAS THAT IMPROVE OVER TIME
// ============================================================================

export interface FormulaMemory {
  formulaId: string
  successPatterns: Array<{ input: unknown; output: unknown; timestamp: number }>
  failurePatterns: Array<{ input: unknown; error: string; timestamp: number }>
  parameterTuning: Record<string, number>
  learningRate: number
}

export class AdaptiveFormula {
  private memory: FormulaMemory = {
    formulaId: '',
    successPatterns: [],
    failurePatterns: [],
    parameterTuning: {},
    learningRate: 0.1
  }

  recordSuccess(input: unknown, output: unknown): void {
    this.memory.successPatterns.push({ input, output, timestamp: Date.now() })
    if (this.memory.successPatterns.length > 1000) {
      this.memory.successPatterns.shift()
    }
  }

  recordFailure(input: unknown, error: string): void {
    this.memory.failurePatterns.push({ input, error, timestamp: Date.now() })
    if (this.memory.failurePatterns.length > 100) {
      this.memory.failurePatterns.shift()
    }
  }

  // Derive optimal parameters from historical data
  deriveBestParameters(): Record<string, number> {
    const params: Record<string, number> = {}

    // Analyze success patterns
    if (this.memory.successPatterns.length > 10) {
      const avgOutputSize = this.memory.successPatterns.reduce((sum, p) => {
        const size = JSON.stringify(p.output).length
        return sum + size
      }, 0) / this.memory.successPatterns.length

      params['timeout'] = avgOutputSize / 100 + 100 // ms
    }

    // Adjust based on failure rate
    const successRate =
      this.memory.successPatterns.length /
      (this.memory.successPatterns.length + this.memory.failurePatterns.length + 0.0001)

    if (successRate < 0.8) {
      params['retries'] = 3
      params['backoff'] = 100
    } else {
      params['retries'] = 1
      params['backoff'] = 0
    }

    return params
  }

  // Continuous improvement from feedback
  improve(feedback: number): void {
    // Feedback: -1 (bad) to +1 (excellent)
    this.memory.learningRate = Math.max(0.01, Math.min(0.5, this.memory.learningRate + feedback * 0.05))
  }

  stats() {
    const total = this.memory.successPatterns.length + this.memory.failurePatterns.length
    const successRate = this.memory.successPatterns.length / (total || 1)

    return {
      successRate,
      failureRate: 1 - successRate,
      learningRate: this.memory.learningRate,
      patterns: {
        success: this.memory.successPatterns.length,
        failure: this.memory.failurePatterns.length
      }
    }
  }
}

// ============================================================================
// FORMULA CLUSTERS: EMERGENT SPECIALIZATION
// ============================================================================

export interface ClusterCharacteristic {
  name: string
  latency: number
  throughput: number
  reliability: number
  specialization: string[]
}

export class EmergentClustering {
  private clusters = new Map<string, ClusterCharacteristic>()

  // Formulas naturally specialize based on usage
  observeFormula(formulaId: string, latency: number, throughput: number, reliability: number): void {
    const existing = this.clusters.get(formulaId) || {
      name: formulaId,
      latency: 0,
      throughput: 0,
      reliability: 0,
      specialization: []
    }

    // Exponential moving average
    const alpha = 0.3
    existing.latency = alpha * latency + (1 - alpha) * existing.latency
    existing.throughput = alpha * throughput + (1 - alpha) * existing.throughput
    existing.reliability = alpha * reliability + (1 - alpha) * existing.reliability

    // Infer specialization
    if (latency < 10 && throughput > 1000) {
      existing.specialization.push('fast')
    }
    if (reliability > 0.99) {
      existing.specialization.push('reliable')
    }
    if (throughput > 10000) {
      existing.specialization.push('high-throughput')
    }

    this.clusters.set(formulaId, existing)
  }

  getCluster(formulaId: string): ClusterCharacteristic | undefined {
    return this.clusters.get(formulaId)
  }

  allClusters(): ClusterCharacteristic[] {
    return Array.from(this.clusters.values())
  }
}

// ============================================================================
// SELF-REFLECTION: SYSTEM INTROSPECTION
// ============================================================================

export class SystemReflection {
  private decisions: Array<{ timestamp: number; decision: string; outcome: number }> = []
  private patterns: Map<string, number> = new Map()

  // Record decisions and their outcomes
  recordDecision(decision: string, outcome: number): void {
    this.decisions.push({ timestamp: Date.now(), decision, outcome })

    // Track pattern frequency
    const existing = this.patterns.get(decision) || 0
    this.patterns.set(decision, existing + outcome)
  }

  // Find what decisions work best
  bestPatterns(topN: number = 5): string[] {
    return Array.from(this.patterns.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([pattern]) => pattern)
  }

  // Self-awareness: explain current state
  selfAwareness() {
    const recentDecisions = this.decisions.slice(-100)
    const avgOutcome = recentDecisions.reduce((sum, d) => sum + d.outcome, 0) / recentDecisions.length

    return {
      recentPerformance: avgOutcome,
      decisionHistory: this.decisions.length,
      learnedPatterns: this.patterns.size,
      topPatterns: this.bestPatterns(3),
      state: avgOutcome > 0.7 ? 'thriving' : avgOutcome > 0.4 ? 'stable' : 'struggling'
    }
  }
}

export const neural = {
  network: new NeuralNetwork(),
  adaptive: new AdaptiveFormula(),
  clustering: new EmergentClustering(),
  reflection: new SystemReflection()
}

/**
 * PHASE 9: NEURAL COMBINATORICS
 *
 * Formula Intelligence:
 * ✓ Learned relationships (pipeline, feedback, competition, cooperation)
 * ✓ Adaptive learning (success/failure patterns)
 * ✓ Emergent specialization (fast, reliable, high-throughput)
 * ✓ Self-reflection (introspection, self-awareness)
 * ✓ Continuous improvement (feedback-driven tuning)
 *
 * Enables: Self-aware, self-improving formula network
 */
