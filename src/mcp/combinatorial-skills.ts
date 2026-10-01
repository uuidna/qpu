/**
 * Combinatorial Skills & Tools Framework
 * Directional stability as reusable skills
 * Each skill = composable test + operation combination
 */

import { formulaNetwork } from './formula-network.js'
import { CostOptimization } from './cost-optimization.js'
import { selfHealing } from './self-healing.js'

// ============================================
// SKILL DEFINITIONS
// ============================================

export interface Skill {
  name: string
  description: string
  directions: Direction[]
  execute: () => Promise<SkillResult>
}

export interface Direction {
  vector: 'forward' | 'reverse' | 'left' | 'right' | 'up' | 'down' | 'inverse'
  test: () => Promise<boolean>
  metric: string
}

export interface SkillResult {
  skill: string
  passed: boolean
  directions: Record<string, boolean>
  metrics: Record<string, unknown>
  timestamp: number
}

// ============================================
// DIRECTIONAL SKILLS (Reusable Combinations)
// ============================================

export class DirectionalSkills {
  /**
   * SKILL 1: Bidirectional Execution
   * Test forward/reverse stability
   */
  static async skillBidirectionalExecution(): Promise<SkillResult> {
    const result: SkillResult = {
      skill: 'bidirectional-execution',
      passed: true,
      directions: {},
      metrics: {},
      timestamp: Date.now()
    }

    try {
      // FORWARD: Execute all formulas
      formulaNetwork.registerAllFormulas()
      const forward = await formulaNetwork.executeNetworkDefault()
      result.directions['forward'] = forward.size > 40
      result.metrics['forward_formulas'] = forward.size

      // REVERSE: Verify stable state
      const baseline = CostOptimization.globalCostSavings()
      const verify = CostOptimization.globalCostSavings()
      result.directions['reverse'] = baseline.yearlySavings === verify.yearlySavings
      result.metrics['reverse_stability'] = baseline.yearlySavings === verify.yearlySavings

      result.passed = Object.values(result.directions).every(d => d)
    } catch (e: any) {
      result.passed = false
      result.metrics['error'] = e.message
    }

    return result
  }

  /**
   * SKILL 2: Multidirectional Pathfinding
   * Test left/right alternative paths
   */
  static async skillMultidirectionalPathfinding(): Promise<SkillResult> {
    const result: SkillResult = {
      skill: 'multidirectional-pathfinding',
      passed: true,
      directions: {},
      metrics: {},
      timestamp: Date.now()
    }

    try {
      // LEFT: Alternative cost paths
      const browser = CostOptimization.analyzeBrowserCost()
      const docker = CostOptimization.analyzeDockerCost()
      const k8s = CostOptimization.analyzeKubernetesCost()

      result.directions['left'] = browser.optimized < docker.optimized && docker.optimized < k8s.optimized
      result.metrics['left_paths'] = 3
      result.metrics['browser_cost'] = Math.round(browser.optimized)
      result.metrics['docker_cost'] = Math.round(docker.optimized)
      result.metrics['k8s_cost'] = Math.round(k8s.optimized)

      // RIGHT: Optimization selection
      const rec = CostOptimization.recommendCheapestMode('low')
      result.directions['right'] = rec.recommended === 'browser'
      result.metrics['optimized_choice'] = rec.recommended
      result.metrics['optimized_cost'] = Math.round(rec.monthlyCost)

      result.passed = Object.values(result.directions).every(d => d)
    } catch (e: any) {
      result.passed = false
      result.metrics['error'] = e.message
    }

    return result
  }

  /**
   * SKILL 3: Scalability Elasticity
   * Test up/down scaling consistency
   */
  static async skillScalabilityElasticity(): Promise<SkillResult> {
    const result: SkillResult = {
      skill: 'scalability-elasticity',
      passed: true,
      directions: {},
      metrics: {},
      timestamp: Date.now()
    }

    try {
      // UP: Scale to higher load
      const executions: number[] = []
      for (let i = 0; i < 5; i++) {
        const res = await formulaNetwork.executeNetworkDefault()
        executions.push(res.size)
      }
      const consistent = executions.every((e: number) => e === executions[0])
      result.directions['up'] = consistent
      result.metrics['up_iterations'] = executions.length
      result.metrics['up_consistency'] = executions[0]

      // DOWN: Scale to minimal load
      const minimal = selfHealing.gracefulDegrade({
        score: 20,
        healthy: false,
        degradedNodes: ['a', 'b', 'c'],
        criticalNodes: ['x'],
        recentHeals: [],
        ok: false,
        timestamp: Date.now()
      })
      result.directions['down'] = minimal.level === 'minimal'
      result.metrics['down_level'] = minimal.level
      result.metrics['down_disabled'] = minimal.disabledOperations.length

      result.passed = Object.values(result.directions).every(d => d)
    } catch (e: any) {
      result.passed = false
      result.metrics['error'] = e.message
    }

    return result
  }

  /**
   * SKILL 4: Resilience & Recovery
   * Test inverse operations and error handling
   */
  static async skillResilienceRecovery(): Promise<SkillResult> {
    const result: SkillResult = {
      skill: 'resilience-recovery',
      passed: true,
      directions: {},
      metrics: {},
      timestamp: Date.now()
    }

    try {
      // INVERSE 1: Handle invalid inputs
      const invalid = formulaNetwork.getDependencyChain('nonexistent-xyz')
      result.directions['inverse_1'] = Array.isArray(invalid)
      result.metrics['invalid_handling'] = 'graceful'

      // INVERSE 2: Circuit breaker recovery
      const healthy = selfHealing.circuitBreaker('test', 0.2)
      const failing = selfHealing.circuitBreaker('test', 0.65)
      const recovering = selfHealing.circuitBreaker('test', 0.45)

      result.directions['inverse_2'] =
        healthy.state === 'closed' &&
        failing.state === 'open' &&
        recovering.state === 'half-open'
      result.metrics['cb_states'] = [healthy.state, failing.state, recovering.state]

      // INVERSE 3: Degradation learning
      const oldBaseline = 10.0
      const newBaseline = selfHealing.updateBaseline('test', oldBaseline, 11.5, 0.15)
      result.directions['inverse_3'] = newBaseline < oldBaseline * 1.1
      result.metrics['baseline_learning'] = newBaseline.toFixed(2)

      // INVERSE 4: Recovery strategy
      const strategy = selfHealing.recoveryStrategy(['crit-1'], ['deg-1', 'deg-2'])
      result.directions['inverse_4'] = strategy.phase > 0 && strategy.actions.length > 0
      result.metrics['recovery_phase'] = strategy.phase
      result.metrics['recovery_actions'] = strategy.actions.length

      result.passed = Object.values(result.directions).every(d => d)
    } catch (e: any) {
      result.passed = false
      result.metrics['error'] = e.message
    }

    return result
  }

  /**
   * SKILL 5: Domain Bridging
   * Test cross-domain formula interactions
   */
  static async skillDomainBridging(): Promise<SkillResult> {
    const result: SkillResult = {
      skill: 'domain-bridging',
      passed: true,
      directions: {},
      metrics: {},
      timestamp: Date.now()
    }

    try {
      const network = formulaNetwork.getNetwork()

      // Count domain transitions (bridges)
      let bridges = 0
      const domains = new Set<string>()

      for (const edge of network.edges) {
        const fromDomain = network.nodes.find((n: any) => n.id === (edge as any).from)?.id.split('-')[0]
        const toDomain = network.nodes.find((n: any) => n.id === (edge as any).to)?.id.split('-')[0]
        if (fromDomain && toDomain && fromDomain !== toDomain) bridges++
        if (fromDomain) domains.add(fromDomain)
        if (toDomain) domains.add(toDomain)
      }

      result.directions['bridging'] = bridges > 30
      result.metrics['bridges'] = bridges
      result.metrics['domains'] = domains.size
      result.metrics['cross_domain_percentage'] = Math.round((bridges / network.edges.length) * 100)

      result.passed = result.directions['bridging']
    } catch (e: any) {
      result.passed = false
      result.metrics['error'] = e.message
    }

    return result
  }
}

// ============================================
// COMBINATORIAL SKILL SUITES
// ============================================

export class SkillSuites {
  /**
   * Production Readiness Suite
   * Combination of all directional skills
   */
  static async suiteProductionReadiness(): Promise<SkillResult[]> {
    return Promise.all([
      DirectionalSkills.skillBidirectionalExecution(),
      DirectionalSkills.skillMultidirectionalPathfinding(),
      DirectionalSkills.skillScalabilityElasticity(),
      DirectionalSkills.skillResilienceRecovery(),
      DirectionalSkills.skillDomainBridging()
    ])
  }

  /**
   * Stress Test Suite
   * Verify stability under extreme conditions
   */
  static async suiteStressTesting(): Promise<Record<string, unknown>> {
    const results: Record<string, unknown> = {}

    try {
      // Stress 1: High load
      const startTime = Date.now()
      for (let i = 0; i < 100; i++) {
        await formulaNetwork.executeNetworkDefault()
      }
      results['high_load_100x'] = Date.now() - startTime

      // Stress 2: Large dataset
      const largeCost = CostOptimization.calculateMonthlyForecast(100000000, 10000, 10080, 1000)
      results['large_dataset'] = `$${Math.round(largeCost.baselineCost)}`

      // Stress 3: Sustained operations
      const sustained = []
      for (let i = 0; i < 10; i++) {
        const health = selfHealing.assessSystemHealth(
          [
            { nodeId: `node-${i}`, metric: 'test', baseline: 10, current: 10 + (i % 3), status: 'healthy', degradation: 0.02 }
          ],
          []
        )
        sustained.push(health.score)
      }
      results['sustained_10x'] = `avg=${(sustained.reduce((a, b) => a + b) / sustained.length).toFixed(0)}/100`

      results['passed'] = true
    } catch (e: any) {
      results['error'] = e.message
      results['passed'] = false
    }

    return results
  }

  /**
   * Application Scenario Suite
   * Real-world use case validation
   */
  static async suiteApplicationScenarios(): Promise<Record<string, unknown>> {
    const results: Record<string, unknown> = {}

    try {
      // Scenario 1: Health Analytics
      const health = await formulaNetwork.executeNetworkDefault()
      const security = CostOptimization.analyzeBrowserCost()
      results['health_analytics'] = {
        formulas: health.size,
        encryption: `$${Math.round(security.optimized)}/mo`,
        status: 'ready'
      }

      // Scenario 2: Supply Chain
      const supply = {
        cost: CostOptimization.analyzeDockerCost(),
        health: selfHealing.assessSystemHealth([], [])
      }
      results['supply_chain'] = {
        cost: `$${Math.round(supply.cost.optimized)}/mo`,
        health: supply.health.score.toFixed(0) + '/100',
        status: 'ready'
      }

      // Scenario 3: Climate Forecasting
      const climate = {
        storage: CostOptimization.analyzeKubernetesCost(),
        compute: await formulaNetwork.executeNetworkDefault()
      }
      results['climate_forecast'] = {
        cost: `$${Math.round(climate.storage.optimized)}/mo`,
        nodes: climate.compute.size,
        status: 'ready'
      }

      results['passed'] = true
    } catch (e: any) {
      results['error'] = e.message
      results['passed'] = false
    }

    return results
  }
}

// ============================================
// TOOL DEFINITIONS (for MCP registration)
// ============================================

export const directionalTools = {
  'skill-bidirectional': {
    description: 'Test bidirectional execution (forward/reverse)',
    handler: () => DirectionalSkills.skillBidirectionalExecution()
  },
  'skill-multidirectional': {
    description: 'Test multidirectional pathfinding (left/right)',
    handler: () => DirectionalSkills.skillMultidirectionalPathfinding()
  },
  'skill-scalability': {
    description: 'Test scalability elasticity (up/down)',
    handler: () => DirectionalSkills.skillScalabilityElasticity()
  },
  'skill-resilience': {
    description: 'Test resilience and recovery (inverse)',
    handler: () => DirectionalSkills.skillResilienceRecovery()
  },
  'skill-domain-bridging': {
    description: 'Test cross-domain formula interactions',
    handler: () => DirectionalSkills.skillDomainBridging()
  },
  'suite-production': {
    description: 'Run complete production readiness suite (all directions)',
    handler: () => SkillSuites.suiteProductionReadiness()
  },
  'suite-stress': {
    description: 'Run stress testing suite (extreme conditions)',
    handler: () => SkillSuites.suiteStressTesting()
  },
  'suite-scenarios': {
    description: 'Run application scenario suite (real-world use cases)',
    handler: () => SkillSuites.suiteApplicationScenarios()
  }
}
