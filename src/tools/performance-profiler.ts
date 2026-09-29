/**
 * Performance Profiler
 * Measures operation performance across various dimensions
 * Identifies bottlenecks and optimization opportunities
 */

import { defaultManager, listOperations, countByDomain } from '../core/index.js'

// ============================================================================
// PROFILING TYPES
// ============================================================================

export interface OperationProfile {
  operation: string
  totalExecutions: number
  totalDuration: number
  averageDuration: number
  minDuration: number
  maxDuration: number
  p50Duration: number // median
  p95Duration: number
  p99Duration: number
  successRate: number
  errorRate: number
}

export interface DomainProfile {
  domain: string
  operationCount: number
  totalExecutions: number
  averageDuration: number
  successRate: number
  bottleneck?: string // slowest operation in domain
}

export interface SystemProfile {
  timestamp: Date
  operationProfiles: OperationProfile[]
  domainProfiles: DomainProfile[]
  slowestOperations: string[]
  fastestOperations: string[]
  recommendations: string[]
}

// ============================================================================
// PERFORMANCE PROFILER
// ============================================================================

export class PerformanceProfiler {
  private durations: Map<string, number[]> = new Map()
  private executions: Map<string, number> = new Map()
  private successes: Map<string, number> = new Map()
  private failures: Map<string, number> = new Map()

  /**
   * Record operation execution time
   */
  recordExecution(
    operation: string,
    duration: number,
    success: boolean
  ): void {
    // Track durations
    if (!this.durations.has(operation)) {
      this.durations.set(operation, [])
    }
    this.durations.get(operation)!.push(duration)

    // Track counts
    this.executions.set(operation, (this.executions.get(operation) || 0) + 1)

    if (success) {
      this.successes.set(operation, (this.successes.get(operation) || 0) + 1)
    } else {
      this.failures.set(operation, (this.failures.get(operation) || 0) + 1)
    }
  }

  /**
   * Generate operation profile
   */
  profileOperation(operation: string): OperationProfile {
    const durations = this.durations.get(operation) || []
    const executions = this.executions.get(operation) || 0
    const successes = this.successes.get(operation) || 0
    const failures = this.failures.get(operation) || 0

    const totalDuration = durations.reduce((a, b) => a + b, 0)
    const averageDuration = durations.length > 0 ? totalDuration / durations.length : 0

    const sorted = [...durations].sort((a, b) => a - b)

    return {
      operation,
      totalExecutions: executions,
      totalDuration,
      averageDuration,
      minDuration: sorted.length > 0 ? sorted[0] : 0,
      maxDuration: sorted.length > 0 ? sorted[sorted.length - 1] : 0,
      p50Duration: this.percentile(sorted, 0.5),
      p95Duration: this.percentile(sorted, 0.95),
      p99Duration: this.percentile(sorted, 0.99),
      successRate: executions > 0 ? (successes / executions) * 100 : 0,
      errorRate: executions > 0 ? (failures / executions) * 100 : 0
    }
  }

  /**
   * Generate full system profile
   */
  profileSystem(): SystemProfile {
    const operations = listOperations()
    const domains = countByDomain()

    const operationProfiles = operations.map(op => this.profileOperation(op))
    const domainProfiles = Object.entries(domains).map(([domain, count]) => {
      const opsInDomain = operations.filter(op => op.startsWith(domain))
      const avgDuration = opsInDomain.reduce((sum, op) => {
        return sum + (this.profileOperation(op).averageDuration || 0)
      }, 0) / Math.max(opsInDomain.length, 1)

      return {
        domain,
        operationCount: count,
        totalExecutions: opsInDomain.reduce((sum, op) => {
          return sum + (this.executions.get(op) || 0)
        }, 0),
        averageDuration: avgDuration,
        successRate: this.calculateDomainSuccessRate(opsInDomain),
        bottleneck: this.findBottleneck(opsInDomain)
      }
    })

    const slowestOperations = operationProfiles
      .sort((a, b) => b.averageDuration - a.averageDuration)
      .slice(0, 5)
      .map(p => p.operation)

    const fastestOperations = operationProfiles
      .sort((a, b) => a.averageDuration - b.averageDuration)
      .slice(0, 5)
      .map(p => p.operation)

    const recommendations = this.generateRecommendations(operationProfiles, domainProfiles)

    return {
      timestamp: new Date(),
      operationProfiles,
      domainProfiles,
      slowestOperations,
      fastestOperations,
      recommendations
    }
  }

  /**
   * Calculate percentile from sorted array
   */
  private percentile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0
    const index = Math.ceil(sorted.length * p) - 1
    return sorted[Math.max(0, index)]
  }

  /**
   * Find bottleneck (slowest operation) in domain
   */
  private findBottleneck(operations: string[]): string | undefined {
    let slowest: string | undefined
    let maxDuration = 0

    for (const op of operations) {
      const profile = this.profileOperation(op)
      if (profile.averageDuration > maxDuration) {
        maxDuration = profile.averageDuration
        slowest = op
      }
    }

    return slowest
  }

  /**
   * Calculate domain success rate
   */
  private calculateDomainSuccessRate(operations: string[]): number {
    let totalSuccesses = 0
    let totalExecutions = 0

    for (const op of operations) {
      totalExecutions += this.executions.get(op) || 0
      totalSuccesses += this.successes.get(op) || 0
    }

    return totalExecutions > 0 ? (totalSuccesses / totalExecutions) * 100 : 0
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(
    operationProfiles: OperationProfile[],
    domainProfiles: DomainProfile[]
  ): string[] {
    const recommendations: string[] = []

    // Check for slow operations
    const slowOps = operationProfiles.filter(p => p.averageDuration > 1000)
    if (slowOps.length > 0) {
      recommendations.push(
        `${slowOps.length} operations exceed 1s average duration - consider caching or optimization`
      )
    }

    // Check for high error rates
    const errorOps = operationProfiles.filter(p => p.errorRate > 5)
    if (errorOps.length > 0) {
      recommendations.push(
        `${errorOps.length} operations have error rate > 5% - review error handling`
      )
    }

    // Check for underutilized operations
    const underutilized = operationProfiles.filter(p => p.totalExecutions === 0)
    if (underutilized.length > 0) {
      recommendations.push(
        `${underutilized.length} operations never executed - consider removing or documenting`
      )
    }

    // Domain recommendations
    for (const domain of domainProfiles) {
      if (domain.averageDuration > 500) {
        recommendations.push(
          `${domain.domain} domain average > 500ms - consider parallel execution`
        )
      }
      if (domain.successRate < 95) {
        recommendations.push(
          `${domain.domain} domain success rate < 95% - improve reliability`
        )
      }
    }

    return recommendations
  }

  /**
   * Clear profiling data
   */
  clear(): void {
    this.durations.clear()
    this.executions.clear()
    this.successes.clear()
    this.failures.clear()
  }

  /**
   * Export profile as JSON
   */
  exportJson(): string {
    return JSON.stringify(this.profileSystem(), null, 2)
  }

  /**
   * Export profile as CSV
   */
  exportCsv(): string {
    const profile = this.profileSystem()
    const lines: string[] = [
      'Operation,Total Executions,Avg Duration,Min Duration,Max Duration,P50,P95,P99,Success Rate,Error Rate'
    ]

    for (const op of profile.operationProfiles) {
      lines.push(
        `${op.operation},${op.totalExecutions},${op.averageDuration.toFixed(2)},${op.minDuration},${op.maxDuration},${op.p50Duration.toFixed(2)},${op.p95Duration.toFixed(2)},${op.p99Duration.toFixed(2)},${op.successRate.toFixed(2)}%,${op.errorRate.toFixed(2)}%`
      )
    }

    return lines.join('\n')
  }
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

export const performanceProfiler = new PerformanceProfiler()

/**
 * Profile entire system (global)
 */
export function profileSystem(): SystemProfile {
  return performanceProfiler.profileSystem()
}

/**
 * Profile single operation (global)
 */
export function profileOperation(operation: string): OperationProfile {
  return performanceProfiler.profileOperation(operation)
}

export default {
  PerformanceProfiler,
  performanceProfiler,
  profileSystem,
  profileOperation
}
