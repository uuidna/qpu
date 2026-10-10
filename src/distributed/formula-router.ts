/**
 * Formula Router: Route formulas across nodes based on compute affinity
 * Intelligent load balancing, affinity matching, parallelization
 */

import {
  FormulaMetadata,
  FormulaRoute,
  RoutingResult,
  NodeInfo
} from './types.js'
import NodeRegistry from './node-registry.js'

let __seq = 0

export class FormulaRouter {
  private registry: NodeRegistry
  private formulaCache: Map<string, FormulaMetadata> = new Map()
  private routeCache: Map<string, FormulaRoute> = new Map()
  private affinityWeights: Map<string, number> = new Map()

  constructor(registry: NodeRegistry) {
    this.registry = registry
    this.initializeAffinityWeights()
  }

  /**
   * Initialize affinity weights for routing decisions
   */
  private initializeAffinityWeights(): void {
    this.affinityWeights.set('cpu-heavy', 100)
    this.affinityWeights.set('memory-intensive', 150)
    this.affinityWeights.set('quantum-only', 200)
    this.affinityWeights.set('general', 50)
  }

  /**
   * Register formula for routing
   */
  registerFormula(metadata: FormulaMetadata): void {
    this.formulaCache.set(metadata.id, metadata)
    console.log(`[Formula Router] Formula registered: ${metadata.name} (distribute: ${metadata.distributeAcross})`)
  }

  /**
   * Register multiple formulas
   */
  registerFormulas(formulas: FormulaMetadata[]): void {
    formulas.forEach(f => this.registerFormula(f))
  }

  /**
   * Route formula to optimal node(s)
   */
  async routeFormula(formulaId: string): Promise<RoutingResult> {
    const metadata = this.formulaCache.get(formulaId)
    if (!metadata) {
      throw new Error(`Formula not found: ${formulaId}`)
    }

    // Check cache
    const cached = this.routeCache.get(formulaId)
    if (cached && Date.now() - cached.priority < 10000) {
      const nodes = cached.targetNodes
        .map(nodeId => this.registry.getNodeInfo(nodeId))
        .filter((n): n is NodeInfo => n !== undefined)
      return {
        formulaId,
        route: cached,
        selectedNodes: nodes,
        reason: 'cached'
      }
    }

    let route: FormulaRoute
    let reason: string

    if (metadata.distributeAcross === 'single-node') {
      route = this.routeToSingleNode(metadata)
      reason = 'single-node strategy'
    } else if (metadata.multiResult) {
      route = this.routeToMultipleNodes(metadata)
      reason = 'multi-result aggregation'
    } else {
      route = this.routeToOptimalNode(metadata)
      reason = 'affinity-based load balancing'
    }

    // Cache route
    route.priority = Date.now()
    this.routeCache.set(formulaId, route)

    const selectedNodes = route.targetNodes
      .map(nodeId => this.registry.getNodeInfo(nodeId))
      .filter((n): n is NodeInfo => n !== undefined)

    return {
      formulaId,
      route,
      selectedNodes,
      reason
    }
  }

  /**
   * Route to single healthy node
   */
  private routeToSingleNode(metadata: FormulaMetadata): FormulaRoute {
    const candidates = this.getAffinityCandidates(metadata)

    // Select node with lowest load
    let bestNode = candidates[0]
    let lowestLoad = Infinity

    for (const node of candidates) {
      const load = this.calculateNodeLoad(node)
      if (load < lowestLoad) {
        lowestLoad = load
        bestNode = node
      }
    }

    return {
      formulaId: metadata.id,
      targetNodes: [bestNode.id],
      strategy: 'load-balanced',
      priority: Date.now(),
      timeout: metadata.estimatedDuration ? metadata.estimatedDuration * 2 : 30000
    }
  }

  /**
   * Route to multiple nodes for distribution
   */
  private routeToMultipleNodes(metadata: FormulaMetadata): FormulaRoute {
    const candidates = this.getAffinityCandidates(metadata)
    const f = Math.floor((this.registry.getClusterSize() - 1) / 3) // PBFT: f faulty nodes
    const needed = f + 1 // Minimum for consensus

    // Select top N nodes by lowest load
    const sorted = candidates
      .map(n => ({ node: n, load: this.calculateNodeLoad(n) }))
      .sort((a, b) => a.load - b.load)
      .slice(0, Math.max(needed, Math.min(candidates.length, 3)))

    return {
      formulaId: metadata.id,
      targetNodes: sorted.map(s => s.node.id),
      strategy: 'broadcast',
      priority: Date.now(),
      timeout: metadata.estimatedDuration ? metadata.estimatedDuration * 3 : 60000
    }
  }

  /**
   * Route to optimal node considering affinity and load
   */
  private routeToOptimalNode(metadata: FormulaMetadata): FormulaRoute {
    const candidates = this.getAffinityCandidates(metadata)

    // Score nodes
    const scored = candidates.map(node => ({
      node,
      score: this.scoreNode(node, metadata)
    }))

    // Sort by score (highest first)
    scored.sort((a, b) => b.score - a.score)

    const best = scored[0]?.node || candidates[0]

    return {
      formulaId: metadata.id,
      targetNodes: [best.id],
      strategy: 'affinity',
      priority: Date.now(),
      timeout: metadata.estimatedDuration ? metadata.estimatedDuration * 2 : 30000
    }
  }

  /**
   * Get nodes matching formula affinity requirements
   */
  private getAffinityCandidates(metadata: FormulaMetadata): NodeInfo[] {
    const affinity = metadata.affinity || 'general'
    let candidates = this.registry.getNodesByCapability('formula', affinity)

    // Fallback to general if no specialized nodes
    if (candidates.length === 0) {
      candidates = this.registry.getNodesByCapability('formula', 'general')
    }

    if (candidates.length === 0) {
      // Last resort: any compute nodes
      candidates = this.registry.getHealthyNodes()
    }

    return candidates
  }

  /**
   * Calculate node load (0-100)
   */
  private calculateNodeLoad(node: NodeInfo): number {
    if (node.capabilities.length === 0) return 50

    const loads = node.capabilities.map(c =>
      c.maxConcurrent > 0 ? (c.currentLoad / c.maxConcurrent) * 100 : 0
    )

    return loads.reduce((a, b) => a + b, 0) / loads.length
  }

  /**
   * Score node for formula placement
   */
  private scoreNode(node: NodeInfo, metadata: FormulaMetadata): number {
    let score = 100

    // Load penalty
    const load = this.calculateNodeLoad(node)
    score -= load * 0.5

    // Affinity bonus
    if (metadata.affinity) {
      const affinityBonus = this.affinityWeights.get(metadata.affinity) || 50
      score += affinityBonus * 0.1
    }

    // CPU/Memory bonus if matched
    if (metadata.affinity === 'cpu-heavy' && node.cpu > 80) {
      score += 30
    }
    if (metadata.affinity === 'memory-intensive' && node.memory > 80) {
      score += 30
    }

    // Quantum affinity
    if (metadata.affinity === 'quantum-only') {
      const hasQuantum = node.capabilities.some(c => c.name === 'quantum')
      score += hasQuantum ? 50 : -100
    }

    // Latency penalty (if available)
    if (node.networkLatency) {
      score -= node.networkLatency * 0.5
    }

    return Math.max(0, score)
  }

  /**
   * Route formula to all nodes (broadcast)
   */
  routeToAll(formulaId: string): FormulaRoute {
    const nodes = this.registry.getHealthyNodes()
    return {
      formulaId,
      targetNodes: nodes.map(n => n.id),
      strategy: 'broadcast',
      priority: Date.now(),
      timeout: 60000
    }
  }

  /**
   * Route formula to random node
   */
  routeToRandom(formulaId: string): FormulaRoute {
    const nodes = this.registry.getHealthyNodes()
    const random = nodes.length > 0 ? nodes[(__seq++) % nodes.length] : undefined
    return {
      formulaId,
      targetNodes: [random?.id || this.registry.getState().localNodeId],
      strategy: 'load-balanced',
      priority: Date.now(),
      timeout: 30000
    }
  }

  /**
   * Get routing statistics
   */
  getStats(): Record<string, any> {
    return {
      cachedFormulas: this.formulaCache.size,
      cachedRoutes: this.routeCache.size,
      clusterSize: this.registry.getClusterSize(),
      topology: this.registry.getTopology()
    }
  }

  /**
   * Clear route cache (useful for topology changes)
   */
  clearRouteCache(): void {
    this.routeCache.clear()
    console.log('[Formula Router] Route cache cleared')
  }

  /**
   * Get formula info
   */
  getFormula(formulaId: string): FormulaMetadata | undefined {
    return this.formulaCache.get(formulaId)
  }

  /**
   * List all registered formulas
   */
  listFormulas(): FormulaMetadata[] {
    return Array.from(this.formulaCache.values())
  }
}

export default FormulaRouter
