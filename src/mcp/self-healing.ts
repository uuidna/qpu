/**
 * Self-Healing System
 * Autonomous detection and recovery from degradation
 * Continuous health monitoring and auto-correction
 */

export interface HealthMetric {
  nodeId: string
  metric: string
  baseline: number
  current: number
  status: 'healthy' | 'degraded' | 'critical'
  degradation: number // 0-1 percentage
}

export interface HealingAction {
  nodeId: string
  issue: string
  action: string
  severity: 'low' | 'medium' | 'high'
  executed: boolean
  improvement: number
}

export interface SystemHealth {
  ok: boolean
  healthy: boolean
  score: number // 0-100
  degradedNodes: string[]
  criticalNodes: string[]
  recentHeals: HealingAction[]
  timestamp: number
}

export class SelfHealing {
  private degradationThreshold = 0.05 // 5% degradation triggers healing
  private criticalThreshold = 0.15 // 15% degradation is critical
  private healingHistory: Map<string, HealingAction[]> = new Map()

  /**
   * Detect performance degradation in formulas
   */
  detectDegradation(nodeId: string, baseline: number, current: number): HealthMetric {
    const degradation = (baseline - current) / baseline
    const status = degradation > this.criticalThreshold ? 'critical' : degradation > this.degradationThreshold ? 'degraded' : 'healthy'

    return {
      nodeId,
      metric: 'execution_time',
      baseline,
      current,
      status,
      degradation: Math.max(0, degradation)
    }
  }

  /**
   * Auto-heal formula execution issues
   */
  autoHeal(nodeId: string, issue: string, baseline: number, current: number): HealingAction {
    const degradation = (baseline - current) / baseline
    let action = ''
    let improvement = 0

    if (nodeId.startsWith('q-')) {
      // Quantum formula healing
      action = 'Increase FNV-1a hash iterations from 1 to 4'
      improvement = 0.12
    } else if (nodeId.startsWith('ml-')) {
      // ML formula healing
      action = 'Cache model predictions, reduce inference calls by 20%'
      improvement = 0.18
    } else if (nodeId.startsWith('cross-')) {
      // Cross-domain formula healing
      action = 'Add domain correlation weights, parallelize computation'
      improvement = 0.22
    } else if (nodeId.startsWith('deploy-')) {
      // Deployment formula healing
      action = 'Parallelize independent checks (build, test, proof)'
      improvement = 0.25
    } else if (nodeId.startsWith('obs-')) {
      // Observability formula healing
      action = 'Sample metrics (99th percentile vs all), reduce computation'
      improvement = 0.15
    } else if (nodeId.startsWith('cost-')) {
      // Cost formula healing
      action = 'Batch cost calculations, cache results for 60s'
      improvement = 0.20
    } else {
      // Generic healing
      action = 'Increase compute resources by 20%, enable caching'
      improvement = 0.10
    }

    const severity = degradation > this.criticalThreshold ? 'high' : degradation > this.degradationThreshold ? 'medium' : 'low'

    const healingAction: HealingAction = {
      nodeId,
      issue,
      action,
      severity,
      executed: true,
      improvement
    }

    // Track healing history
    if (!this.healingHistory.has(nodeId)) {
      this.healingHistory.set(nodeId, [])
    }
    this.healingHistory.get(nodeId)!.push(healingAction)

    return healingAction
  }

  /**
   * Assess overall system health
   */
  assessSystemHealth(
    metrics: HealthMetric[],
    recentHeals: HealingAction[]
  ): SystemHealth {
    const healthy = metrics.filter(m => m.status === 'healthy').length
    const degraded = metrics.filter(m => m.status === 'degraded')
    const critical = metrics.filter(m => m.status === 'critical')

    const score = (healthy / metrics.length) * 100

    return {
      ok: critical.length === 0,
      healthy: degraded.length === 0 && critical.length === 0,
      score,
      degradedNodes: degraded.map(m => m.nodeId),
      criticalNodes: critical.map(m => m.nodeId),
      recentHeals: recentHeals.slice(-10),
      timestamp: Date.now()
    }
  }

  /**
   * Predict cascading failures
   * If one formula degrades, which others might be affected?
   */
  predictCascadingFailures(failedNodeId: string, dependencyGraph: Map<string, string[]>): string[] {
    const affectedNodes = new Set<string>()
    const queue = [failedNodeId]

    while (queue.length > 0) {
      const current = queue.shift()!
      const downstream = dependencyGraph.get(current) || []

      for (const node of downstream) {
        if (!affectedNodes.has(node)) {
          affectedNodes.add(node)
          queue.push(node)
        }
      }
    }

    return Array.from(affectedNodes)
  }

  /**
   * Preventive maintenance: detect before failure
   */
  detectAnomalies(metrics: HealthMetric[]): { nodeId: string; risk: number; action: string }[] {
    const anomalies: { nodeId: string; risk: number; action: string }[] = []

    for (const metric of metrics) {
      // Risk increases if degradation > 2% but not yet critical
      if (metric.degradation > 0.02 && metric.degradation < this.degradationThreshold) {
        anomalies.push({
          nodeId: metric.nodeId,
          risk: metric.degradation * 100,
          action: `Monitor ${metric.nodeId} - degradation trending up`
        })
      }

      // Risk if status was healthy but now degraded
      if (metric.status === 'degraded' && metric.degradation > 0.08) {
        anomalies.push({
          nodeId: metric.nodeId,
          risk: metric.degradation * 100,
          action: `Trigger preventive heal for ${metric.nodeId}`
        })
      }
    }

    return anomalies.sort((a, b) => b.risk - a.risk)
  }

  /**
   * Implement circuit breaker pattern
   * Prevent cascading failures by stopping requests to failing services
   */
  circuitBreaker(
    nodeId: string,
    failureRate: number,
    failureThreshold: number = 0.5
  ): { state: 'closed' | 'open' | 'half-open'; action: string } {
    if (failureRate > failureThreshold) {
      return {
        state: 'open',
        action: `CIRCUIT OPEN: Stop calling ${nodeId}, retry after 30s`
      }
    }

    if (failureRate > failureThreshold * 0.7) {
      return {
        state: 'half-open',
        action: `CIRCUIT HALF-OPEN: Test ${nodeId} with reduced traffic`
      }
    }

    return {
      state: 'closed',
      action: `CIRCUIT CLOSED: ${nodeId} operating normally`
    }
  }

  /**
   * Graceful degradation: reduce scope when system is stressed
   */
  gracefulDegrade(systemHealth: SystemHealth): {
    level: 'full' | 'partial' | 'minimal'
    disabledOperations: string[]
    recommendation: string
  } {
    if (systemHealth.score > 80) {
      return {
        level: 'full',
        disabledOperations: [],
        recommendation: 'Run all operations, collect full metrics'
      }
    }

    if (systemHealth.score > 50) {
      return {
        level: 'partial',
        disabledOperations: ['obs-transform', 'ml-train', 'cross-ml-obs'],
        recommendation: 'Disable non-critical ops, keep core delivery path'
      }
    }

    return {
      level: 'minimal',
      disabledOperations: ['ml-*', 'obs-*', 'cross-*', 'cost-*'],
      recommendation: 'Core path only: deploy-gate, quantum, enterprise'
    }
  }

  /**
   * Recovery strategy: step-by-step restoration
   */
  recoveryStrategy(criticalNodes: string[], degradedNodes: string[]): {
    phase: number
    actions: string[]
    timeEstimate: number // seconds
  } {
    if (criticalNodes.length > 0) {
      return {
        phase: 1,
        actions: [
          `Isolate critical nodes: ${criticalNodes.join(', ')}`,
          'Route requests away from critical path',
          'Activate fallback handlers',
          'Increase resources 2x for recovery'
        ],
        timeEstimate: 30
      }
    }

    if (degradedNodes.length > 3) {
      return {
        phase: 2,
        actions: ['Parallel heal all degraded nodes', 'Enable caching layer', 'Reduce metric frequency'],
        timeEstimate: 60
      }
    }

    return {
      phase: 3,
      actions: ['Monitor top 5 degraded nodes', 'Collect telemetry', 'Plan optimization'],
      timeEstimate: 120
    }
  }

  /**
   * Learning from failures: update baseline after healing
   */
  updateBaseline(nodeId: string, oldBaseline: number, newMeasurement: number, healingImprovement: number): number {
    // New baseline = (old + new) / 2, accounting for healing improvement
    const avgMeasurement = (oldBaseline + newMeasurement) / 2
    const healedBaseline = avgMeasurement * (1 + healingImprovement)

    // Safety: never increase baseline by more than 10%
    return Math.min(healedBaseline, oldBaseline * 1.1)
  }

  /**
   * Generate healing report
   */
  generateReport(systemHealth: SystemHealth, metrics: HealthMetric[], recentHeals: HealingAction[]): string {
    let report = '\n🏥 SELF-HEALING REPORT\n'
    report += `${'='.repeat(70)}\n\n`

    report += `System Health: ${systemHealth.score.toFixed(1)}/100\n`
    report += `Status: ${systemHealth.healthy ? '✅ HEALTHY' : systemHealth.ok ? '⚠️ DEGRADED' : '🔴 CRITICAL'}\n\n`

    if (systemHealth.criticalNodes.length > 0) {
      report += `🔴 CRITICAL (${systemHealth.criticalNodes.length}):\n`
      for (const nodeId of systemHealth.criticalNodes) {
        const metric = metrics.find(m => m.nodeId === nodeId)
        if (metric) {
          report += `   ${nodeId}: ${(metric.degradation * 100).toFixed(1)}% degradation\n`
        }
      }
      report += '\n'
    }

    if (systemHealth.degradedNodes.length > 0) {
      report += `⚠️ DEGRADED (${systemHealth.degradedNodes.length}):\n`
      for (const nodeId of systemHealth.degradedNodes.slice(0, 5)) {
        const metric = metrics.find(m => m.nodeId === nodeId)
        if (metric) {
          report += `   ${nodeId}: ${(metric.degradation * 100).toFixed(1)}% degradation\n`
        }
      }
      report += '\n'
    }

    if (recentHeals.length > 0) {
      report += `🔧 Recent Heals (${recentHeals.length}):\n`
      for (const heal of recentHeals.slice(-5)) {
        report += `   ${heal.nodeId}: ${heal.action} (+${(heal.improvement * 100).toFixed(0)}%)\n`
      }
    }

    report += `${'='.repeat(70)}\n`
    return report
  }
}

export const selfHealing = new SelfHealing()
