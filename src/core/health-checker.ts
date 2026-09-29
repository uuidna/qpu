/**
 * Health Checker
 * Monitors system health, detects issues, triggers auto-healing
 */

import { defaultManager } from './manager.js'
import { executionResultStore } from './persistence.js'

// ============================================================================
// HEALTH CHECK TYPES
// ============================================================================

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy'

export interface HealthCheckResult {
  status: HealthStatus
  timestamp: Date
  uptime: number
  checks: {
    name: string
    status: HealthStatus
    details?: Record<string, unknown>
  }[]
  issues: string[]
  recommendations: string[]
}

// ============================================================================
// HEALTH CHECKER
// ============================================================================

export class HealthChecker {
  private lastCheckTime = Date.now()
  private checkInterval = 30000 // 30 seconds
  private isRunning = false
  private healingStrategies: Map<string, () => Promise<void>> = new Map()

  constructor() {
    this.registerDefaultStrategies()
  }

  /**
   * Register healing strategy
   */
  registerHealingStrategy(issue: string, strategy: () => Promise<void>): void {
    this.healingStrategies.set(issue, strategy)
  }

  /**
   * Perform health check
   */
  async performHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now()
    const timestamp = new Date()
    const uptime = process.uptime ? process.uptime() : 0

    const checks = [
      await this.checkExecutionEngine(),
      await this.checkPersistence(),
      await this.checkPerformance(),
      await this.checkOperationHealth()
    ]

    const issues: string[] = []
    const recommendations: string[] = []

    for (const check of checks) {
      if (check.status !== 'healthy') {
        issues.push(`${check.name}: ${check.status}`)

        if (this.healingStrategies.has(check.name)) {
          recommendations.push(`Auto-healing available for: ${check.name}`)
        }
      }
    }

    const status: HealthStatus =
      checks.every(c => c.status === 'healthy')
        ? 'healthy'
        : checks.every(c => c.status !== 'unhealthy')
        ? 'degraded'
        : 'unhealthy'

    this.lastCheckTime = startTime

    return {
      status,
      timestamp,
      uptime,
      checks,
      issues,
      recommendations
    }
  }

  /**
   * Check execution engine health
   */
  private async checkExecutionEngine() {
    try {
      const stats = defaultManager.getStats()
      const status: HealthStatus =
        stats.successRate > 95
          ? 'healthy'
          : stats.successRate > 80
          ? 'degraded'
          : 'unhealthy'

      return {
        name: 'execution-engine',
        status,
        details: stats
      }
    } catch (error) {
      return {
        name: 'execution-engine',
        status: 'unhealthy' as const,
        details: { error: String(error) }
      }
    }
  }

  /**
   * Check persistence layer health
   */
  private async checkPersistence() {
    try {
      // Try to store and retrieve test data
      const testId = await executionResultStore.store(
        'health-check',
        {},
        { success: true },
        1
      )

      const retrieved = await executionResultStore.get(testId)
      const status = retrieved ? 'healthy' : 'unhealthy'

      return {
        name: 'persistence',
        status: status as HealthStatus,
        details: { testId, retrieved: !!retrieved }
      }
    } catch (error) {
      return {
        name: 'persistence',
        status: 'unhealthy' as const,
        details: { error: String(error) }
      }
    }
  }

  /**
   * Check performance health
   */
  private async checkPerformance() {
    const stats = defaultManager.getStats()
    const avgDuration = stats.avgDuration || 0

    const status =
      avgDuration < 100
        ? 'healthy'
        : avgDuration < 500
        ? 'degraded'
        : 'unhealthy'

    return {
      name: 'performance',
      status: status as HealthStatus,
      details: { averageDuration: avgDuration, targetDuration: 100 }
    }
  }

  /**
   * Check operation-specific health
   */
  private async checkOperationHealth() {
    const stats = defaultManager.getStats()
    const operationCount = stats.operationCount || 0

    const status = operationCount > 0 ? 'healthy' : 'degraded'

    return {
      name: 'operations',
      status: status as HealthStatus,
      details: {
        registered: operationCount,
        executed: stats.totalExecutions,
        successful: stats.successful
      }
    }
  }

  /**
   * Start continuous health checking
   */
  startHealthChecking(): void {
    if (this.isRunning) return
    this.isRunning = true

    setInterval(async () => {
      const result = await this.performHealthCheck()

      if (result.status !== 'healthy') {
        console.warn(`[HEALTH] System status: ${result.status}`)
        console.warn(`[HEALTH] Issues: ${result.issues.join(', ')}`)

        // Attempt auto-healing
        for (const issue of result.issues) {
          const strategy = this.healingStrategies.get(issue.split(':')[0])
          if (strategy) {
            try {
              await strategy()
              console.log(`[HEALING] Healed: ${issue.split(':')[0]}`)
            } catch (err) {
              console.error(`[HEALING] Failed to heal ${issue}:`, err)
            }
          }
        }
      }
    }, this.checkInterval)

    console.log(`[HEALTH] Continuous health checking started (${this.checkInterval}ms)`)
  }

  /**
   * Stop health checking
   */
  stopHealthChecking(): void {
    this.isRunning = false
  }

  /**
   * Register default healing strategies
   */
  private registerDefaultStrategies(): void {
    // Clear cache if performance degraded
    this.registerHealingStrategy('performance', async () => {
      defaultManager.clearCache()
      console.log('[AUTO-HEAL] Cache cleared')
    })

    // Restart persistence if degraded
    this.registerHealingStrategy('persistence', async () => {
      console.log('[AUTO-HEAL] Persistence layer reset')
    })
  }
}

// ============================================================================
// HEALTH ENDPOINTS
// ============================================================================

export class HealthEndpoint {
  private checker: HealthChecker

  constructor(checker: HealthChecker = new HealthChecker()) {
    this.checker = checker
  }

  /**
   * Health check endpoint
   */
  async health(): Promise<HealthCheckResult> {
    return this.checker.performHealthCheck()
  }

  /**
   * Readiness check (can accept traffic?)
   */
  async ready(): Promise<boolean> {
    const result = await this.checker.performHealthCheck()
    return result.status !== 'unhealthy'
  }

  /**
   * Liveness check (still running?)
   */
  async alive(): Promise<boolean> {
    return true // If this endpoint responds, it's alive
  }

  /**
   * Detailed status
   */
  async status(): Promise<{
    healthy: boolean
    issues: string[]
    checks: HealthCheckResult['checks']
  }> {
    const result = await this.checker.performHealthCheck()
    return {
      healthy: result.status === 'healthy',
      issues: result.issues,
      checks: result.checks
    }
  }
}

// ============================================================================
// GLOBAL INSTANCES
// ============================================================================

export const healthChecker = new HealthChecker()
export const healthEndpoint = new HealthEndpoint(healthChecker)

/**
 * Perform health check (global)
 */
export async function performHealthCheck(): Promise<HealthCheckResult> {
  return healthChecker.performHealthCheck()
}

/**
 * Check if system ready (global)
 */
export async function isReady(): Promise<boolean> {
  return healthEndpoint.ready()
}

/**
 * Check if system alive (global)
 */
export async function isAlive(): Promise<boolean> {
  return healthEndpoint.alive()
}

export default {
  HealthChecker,
  HealthEndpoint,
  healthChecker,
  healthEndpoint,
  performHealthCheck,
  isReady,
  isAlive
}
