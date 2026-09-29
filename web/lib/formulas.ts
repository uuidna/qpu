/**
 * Mathematical Formulas from UUIDNA QPU: Combinatorial Perspectives
 * All animations are driven by exact formula outputs
 */

// 1. SYNERGY FORMULA: Synergy(A, B) = Base(A) × Base(B) × Alignment(A, B) × Timing(A, B)
export function calculateSynergy(
  baseA: number,
  baseB: number,
  alignment: number,
  timing: number
): number {
  return baseA * baseB * alignment * timing
}

// 2. WAVE GAIN FORMULA: Gain(n) = G₀ × e^(-λn)
export function calculateWaveGain(
  initialGain: number = 8,
  decayConstant: number = 0.15,
  waveNumber: number
): number {
  return initialGain * Math.exp(-decayConstant * waveNumber)
}

// 3. CUMULATIVE IMPROVEMENT: Total(N) = Σ[i=1 to N] (Gain_i + Synergy_bonus_i)
export function calculateCumulativeImprovement(
  waves: number[],
  synergyBonuses: number[] = []
): number {
  let total = 0
  for (let i = 0; i < waves.length; i++) {
    total += waves[i] + (synergyBonuses[i] || 0)
  }
  return total
}

// 4. METRIC INTERACTION: Overall Score
export function calculateOverallScore(metrics: {
  learning: number
  robustness: number
  efficiency: number
  collaboration: number
  trustworthiness: number
}): number {
  return (
    0.25 * metrics.learning +
    0.25 * metrics.robustness +
    0.2 * metrics.efficiency +
    0.2 * metrics.collaboration +
    0.1 * metrics.trustworthiness
  )
}

// 5. METRIC DIVERGENCE: Max(Metric) - Min(Metric)
export function calculateDivergence(metrics: number[]): number {
  return Math.max(...metrics) - Math.min(...metrics)
}

// 6. AMDAHL'S LAW: Speedup(p) = 1 / ((1-f) + f/p)
export function calculateSpeedup(optimizableFraction: number, parallelism: number): number {
  return 1 / ((1 - optimizableFraction) + optimizableFraction / parallelism)
}

// 7. CONVERGENCE FORMULA: f(n) = Target × (1 - e^(-k×n))
export function calculateConvergence(
  target: number = 100,
  convergenceRate: number = 0.15,
  iterations: number
): number {
  return target * (1 - Math.exp(-convergenceRate * iterations))
}

// 8. PHASE CAPABILITY ACCUMULATION: Total_Capability(Phase_n)
export function calculatePhaseCapability(phaseContributions: number[]): number {
  return phaseContributions.reduce((sum, val) => sum + val, 0)
}

// 9. KNOWLEDGE BASE GROWTH: Knowledge(t) = K₀ × (1 - e^(-αt))
export function calculateKnowledgeGrowth(
  maxKnowledge: number = 100,
  learningRate: number = 0.12,
  cycles: number
): number {
  return maxKnowledge * (1 - Math.exp(-learningRate * cycles))
}

// 10. CONSENSUS STRENGTH: (Agreeing_Agents / Total_Agents) × Agreement_Confidence
export function calculateConsensusStrength(
  agreeingAgents: number,
  totalAgents: number,
  averageConfidence: number
): number {
  return (agreeingAgents / totalAgents) * averageConfidence
}

// 11. MULTI-AGENT SPEEDUP: Speedup = 1 + (Number_Agents - 1) × Efficiency
export function calculateMultiAgentSpeedup(agents: number, efficiency: number): number {
  return 1 + (agents - 1) * efficiency
}

// 12. COMMUNICATION COST: C × Agents² / Bandwidth
export function calculateCommunicationCost(
  protocolOverhead: number,
  agents: number,
  bandwidth: number
): number {
  return (protocolOverhead * Math.pow(agents, 2)) / bandwidth
}

// 13. VALUE COHERENCE SCORE: Σ(DecisionAlignment_i / NumberOfDecisions)
export function calculateCoherence(alignmentScores: number[]): number {
  return alignmentScores.reduce((sum, val) => sum + val, 0) / alignmentScores.length
}

// 14. TRUST SCORE: 0.3×Transparency + 0.3×Consistency + 0.2×Explainability + 0.2×ValueAlignment
export function calculateTrustScore(
  transparency: number,
  consistency: number,
  explainability: number,
  valueAlignment: number
): number {
  return (
    0.3 * transparency +
    0.3 * consistency +
    0.2 * explainability +
    0.2 * valueAlignment
  )
}

// 15. THROUGHPUT SCALING: Total_Throughput(N) = Single_Node_Throughput × N × (1 - Coordination_Overhead(N))
export function calculateThroughput(
  singleNodeThroughput: number,
  nodes: number,
  coordinationOverhead: number
): number {
  return singleNodeThroughput * nodes * (1 - coordinationOverhead)
}

// 16. LATENCY SCALING: Latency(N) = Base_Latency + Network_Delay(N)
export function calculateLatency(
  baseLatency: number,
  nodes: number,
  hopCost: number = 0.5
): number {
  const hops = Math.ceil(Math.log2(Math.max(1, nodes)))
  return baseLatency + hops * hopCost
}

// 17. DATA DURABILITY: 1 - Failure_Probability^Replication_Factor
export function calculateDataDurability(
  failureProbability: number,
  replicationFactor: number
): number {
  return 1 - Math.pow(failureProbability, replicationFactor)
}

// 18. ESCAPE PROBABILITY FROM LOCAL OPTIMA: 1 - e^(-Exploration_Budget / Local_Optima_Depth)
export function calculateEscapeProbability(
  explorationBudget: number,
  optimalDepth: number
): number {
  return 1 - Math.exp(-explorationBudget / optimalDepth)
}

// 19. EMERGENT CAPABILITY: Σ(System_Capability) + Σ(Synergy_Bonus) + (Discovery_Rate × Time)
export function calculateEmergentCapability(
  systemCapabilities: number[],
  synergyBonuses: number[],
  discoveryRate: number,
  time: number
): number {
  const systems = systemCapabilities.reduce((a, b) => a + b, 0)
  const synergies = synergyBonuses.reduce((a, b) => a + b, 0)
  return systems + synergies + discoveryRate * time
}

// 20. PHASE CASCADE EFFECT: (1 + Synergy_Multiplier)^N
export function calculatePhaseCascade(synergyMultiplier: number, phases: number): number {
  return Math.pow(1 + synergyMultiplier, phases)
}

// Generate wave progression with real formula outputs
export function generateWaveProgression(waves: number = 20): Array<{
  wave: number
  gain: number
  cumulative: number
  momentum: number
  strategy: string
}> {
  const result = []
  let cumulative = 0
  let previousGain = 0

  for (let i = 1; i <= waves; i++) {
    const gain = calculateWaveGain(8, 0.15, i)
    cumulative += gain
    const momentum = (gain - previousGain) / (previousGain || 1)

    let strategy = 'Focused'
    if (cumulative > 50) strategy = 'Broad'
    else if (cumulative > 30) strategy = 'Exploratory'
    else if (cumulative > 10) strategy = 'Opportunistic'

    result.push({
      wave: i,
      gain,
      cumulative,
      momentum,
      strategy,
    })

    previousGain = gain
  }

  return result
}

// Generate synergy network
export function generateSynergyNetwork(systems: number = 50) {
  const nodes = Array.from({ length: systems }, (_, i) => ({
    id: i + 1,
    label: `S${i + 1}`,
    strength: 0.5 + Math.random() * 0.5,
  }))

  const edges = []
  const synergiesPerNode = 5

  for (let i = 0; i < systems; i++) {
    for (let j = i + 1; j < Math.min(i + synergiesPerNode, systems); j++) {
      const synergy = calculateSynergy(
        nodes[i].strength,
        nodes[j].strength,
        0.7 + Math.random() * 0.25,
        0.8 + Math.random() * 0.2
      )
      if (synergy > 0.2) {
        edges.push({
          source: nodes[i].id,
          target: nodes[j].id,
          strength: synergy,
        })
      }
    }
  }

  return { nodes, edges }
}

// Generate convergence trajectory
export function generateConvergenceTrajectory(iterations: number = 100) {
  return Array.from({ length: iterations }, (_, i) => ({
    iteration: i,
    convergence: calculateConvergence(100, 0.15, i),
    theoretical: 100,
  }))
}
