/**
 * Distributed Executor: Execute formulas across cluster, aggregate results
 * Parallel execution, result aggregation, error handling
 */

import {
  ExecutionPlan,
  NodeExecutionResult,
  AggregatedResult,
  NodeInfo
} from './types.js'
import NodeRegistry from './node-registry.js'
import FormulaRouter from './formula-router.js'

export class DistributedExecutor {
  private registry: NodeRegistry
  private router: FormulaRouter
  private executionHistory: Map<string, AggregatedResult> = new Map()

  constructor(registry: NodeRegistry, router: FormulaRouter) {
    this.registry = registry
    this.router = router
  }

  /**
   * Execute formula across cluster
   */
  async executeFormula(
    formulaId: string,
    input: any,
    timeout: number = 30000
  ): Promise<AggregatedResult> {
    console.log(`[Executor] Executing formula: ${formulaId}`)

    // Route formula to nodes
    const routing = await this.router.routeFormula(formulaId)
    const { selectedNodes, route } = routing

    if (selectedNodes.length === 0) {
      return {
        formulaId,
        success: false,
        results: [],
        confidence: 0
      }
    }

    // Create execution plan
    const plan: ExecutionPlan = {
      formulaId,
      targetNodes: selectedNodes.map(n => n.id),
      parallelizable: selectedNodes.length > 1,
      aggregation: route.strategy === 'broadcast' ? 'consensus' : 'first',
      timeout: timeout
    }

    console.log(`[Executor] Plan: ${selectedNodes.length} node(s), strategy=${plan.aggregation}`)

    // Execute on all nodes
    const results = await Promise.all(
      selectedNodes.map(node =>
        this.executeOnNode(formulaId, node, input, timeout)
      )
    )

    // Aggregate results
    const aggregated = this.aggregateResults(formulaId, results, plan.aggregation)

    // Store in history
    this.executionHistory.set(formulaId, aggregated)

    return aggregated
  }

  /**
   * Execute formula on single node
   */
  private async executeOnNode(
    formulaId: string,
    node: NodeInfo,
    input: any,
    timeout: number
  ): Promise<NodeExecutionResult> {
    const startTime = Date.now()

    try {
      // Simulate execution (in real impl: send via WebSocket/gRPC)
      const result = await this.simulateExecution(formulaId, input, timeout)

      const duration = Date.now() - startTime

      return {
        nodeId: node.id,
        formulaId,
        success: true,
        result,
        duration,
        timestamp: Date.now()
      }
    } catch (error) {
      const duration = Date.now() - startTime

      return {
        nodeId: node.id,
        formulaId,
        success: false,
        error: String(error),
        duration,
        timestamp: Date.now()
      }
    }
  }

  /**
   * Simulate formula execution (placeholder)
   */
  private async simulateExecution(formulaId: string, input: any, timeout: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const executionTime = Math.random() * timeout * 0.8

      const timer = setTimeout(() => {
        reject(new Error(`Execution timeout after ${timeout}ms`))
      }, timeout)

      setTimeout(() => {
        clearTimeout(timer)
        resolve({
          formulaId,
          input,
          output: `result-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: Date.now()
        })
      }, executionTime)
    })
  }

  /**
   * Aggregate results from multiple nodes
   */
  private aggregateResults(
    formulaId: string,
    results: NodeExecutionResult[],
    strategy: 'average' | 'consensus' | 'first' | 'all' | 'custom'
  ): AggregatedResult {
    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)

    console.log(`[Executor] Aggregating results: ${successful.length} success, ${failed.length} failed`)

    let aggregated: any = null
    let consensus = false

    switch (strategy) {
      case 'first':
        if (successful.length > 0) {
          aggregated = successful[0].result
        }
        break

      case 'all':
        aggregated = successful.map(r => r.result)
        break

      case 'consensus':
        const aggregationResult = this.consensusAggregate(successful)
        aggregated = aggregationResult.value
        consensus = aggregationResult.consensus
        break

      case 'average':
        aggregated = this.averageAggregate(successful)
        break

      case 'custom':
        // Custom aggregation logic per formula
        aggregated = this.customAggregate(formulaId, successful)
        break
    }

    const confidence = successful.length / results.length

    return {
      formulaId,
      success: successful.length > 0,
      results,
      aggregated,
      consensus,
      confidence
    }
  }

  /**
   * Consensus aggregation (majority vote)
   */
  private consensusAggregate(results: NodeExecutionResult[]): { value: any; consensus: boolean } {
    if (results.length === 0) {
      return { value: null, consensus: false }
    }

    if (results.length === 1) {
      return { value: results[0].result, consensus: false }
    }

    // Count occurrences
    const counts = new Map<string, number>()
    const resultMap = new Map<string, any>()

    for (const result of results) {
      const key = JSON.stringify(result.result)
      counts.set(key, (counts.get(key) || 0) + 1)
      resultMap.set(key, result.result)
    }

    // Find majority
    let maxCount = 0
    let majorityKey = ''

    for (const [key, count] of counts) {
      if (count > maxCount) {
        maxCount = count
        majorityKey = key
      }
    }

    const consensus = maxCount > results.length / 2
    const value = resultMap.get(majorityKey)

    console.log(`[Executor] Consensus: ${maxCount}/${results.length} nodes agree (consensus=${consensus})`)

    return { value, consensus }
  }

  /**
   * Average aggregation (for numeric results)
   */
  private averageAggregate(results: NodeExecutionResult[]): any {
    if (results.length === 0) return null

    const numericResults = results
      .filter(r => typeof r.result === 'number')
      .map(r => r.result as number)

    if (numericResults.length === 0) {
      return results[0].result
    }

    const avg = numericResults.reduce((a, b) => a + b, 0) / numericResults.length
    return avg
  }

  /**
   * Custom aggregation (formula-specific)
   */
  private customAggregate(formulaId: string, results: NodeExecutionResult[]): any {
    // In real implementation: look up formula-specific aggregation logic
    // For now: return first result
    return results.length > 0 ? results[0].result : null
  }

  /**
   * Execute and wait for result
   */
  async executeAndWait(
    formulaId: string,
    input: any,
    timeout: number = 30000
  ): Promise<any> {
    const result = await this.executeFormula(formulaId, input, timeout)

    if (!result.success) {
      throw new Error(`Formula execution failed: ${result.results.map(r => r.error).join(', ')}`)
    }

    return result.aggregated
  }

  /**
   * Execute formula with retry
   */
  async executeWithRetry(
    formulaId: string,
    input: any,
    maxRetries: number = 3,
    timeout: number = 30000
  ): Promise<AggregatedResult> {
    let lastError: Error | null = null

    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await this.executeFormula(formulaId, input, timeout)
        if (result.success) {
          return result
        }
        lastError = new Error(`Formula execution failed`)
      } catch (error) {
        lastError = error as Error
        console.log(`[Executor] Retry ${i + 1}/${maxRetries}: ${lastError.message}`)
      }

      // Exponential backoff
      if (i < maxRetries - 1) {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 100))
      }
    }

    throw lastError || new Error('Formula execution failed')
  }

  /**
   * Get execution history
   */
  getExecutionHistory(formulaId: string): AggregatedResult | undefined {
    return this.executionHistory.get(formulaId)
  }

  /**
   * Get executor stats
   */
  getStats(): Record<string, any> {
    const results = Array.from(this.executionHistory.values())
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    const avgDuration = results.length > 0 ?
      results.reduce((sum, r) => sum + r.results.reduce((s, res) => s + res.duration, 0), 0) / results.length : 0

    return {
      executionsCount: results.length,
      successful,
      failed,
      successRate: results.length > 0 ? (successful / results.length * 100).toFixed(1) : 0,
      avgDuration: Math.round(avgDuration),
      avgConfidence: results.length > 0 ?
        (results.reduce((sum, r) => sum + r.confidence, 0) / results.length * 100).toFixed(1) : 0
    }
  }

  /**
   * Clear execution history
   */
  clearHistory(): void {
    this.executionHistory.clear()
    console.log('[Executor] History cleared')
  }
}

export default DistributedExecutor
