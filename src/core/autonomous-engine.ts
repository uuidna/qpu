/**
 * Autonomous Intelligence Engine
 * Self-improving system through continuous operation composition and reasoning
 * Runs improvement cycles at regular intervals (5 minutes default)
 */

import { defaultManager } from './manager.js'
import { listOperations, countByDomain } from './operations.js'
import { executionResultStore } from './persistence.js'

// ============================================================================
// IMPROVEMENT CYCLE
// ============================================================================

export interface ImprovementCycle {
  cycleId: string
  timestamp: Date
  duration: number
  operationsComposed: number
  patternsDiscovered: string[]
  nextOptimization?: string
}

export interface OperationPattern {
  name: string
  operations: string[]
  description: string
  benefit: string
}

// ============================================================================
// AUTONOMOUS ENGINE
// ============================================================================

export class AutonomousEngine {
  private cycles: ImprovementCycle[] = []
  private patterns: Map<string, OperationPattern> = new Map()
  private isRunning = false

  constructor(private intervalMs: number = 5 * 60 * 1000) {}

  /**
   * Start autonomous improvement cycles
   */
  startCycles(): void {
    if (this.isRunning) return
    this.isRunning = true

    setInterval(() => {
      this.runImprovementCycle().catch(err => {
        console.error('Improvement cycle failed:', err)
      })
    }, this.intervalMs)

    console.log(`Autonomous engine started (${this.intervalMs}ms intervals)`)
  }

  /**
   * Stop autonomous cycles
   */
  stopCycles(): void {
    this.isRunning = false
  }

  /**
   * Run single improvement cycle
   */
  async runImprovementCycle(): Promise<ImprovementCycle> {
    const startTime = Date.now()
    const cycleId = `cycle-${startTime}`

    try {
      // 1. Analyze current operations
      const operations = listOperations()
      const domainCounts = countByDomain()

      // 2. Discover operation patterns
      const patterns = await this.discoverPatterns(operations)

      // 3. Compose high-value operation sequences
      const compositions = await this.identifyCompositions(operations)

      // 4. Execute top compositions to verify and gather feedback
      for (const composition of compositions.slice(0, 3)) {
        try {
          const result = await defaultManager.executeComposition({
            operations: composition,
            inputs: {}
          })

          if (result.success) {
            console.log(`Composition successful: ${composition.join(' → ')}`)
          }
        } catch (err) {
          console.error(`Composition failed: ${composition.join(' → ')}`, err)
        }
      }

      // 5. Get execution statistics
      const stats = await defaultManager.getStats()

      // 6. Create improvement cycle record
      const cycle: ImprovementCycle = {
        cycleId,
        timestamp: new Date(),
        duration: Date.now() - startTime,
        operationsComposed: compositions.length,
        patternsDiscovered: Array.from(this.patterns.keys()),
        nextOptimization: this.identifyNextOptimization(stats)
      }

      this.cycles.push(cycle)
      return cycle
    } catch (err) {
      console.error('Improvement cycle error:', err)
      return {
        cycleId,
        timestamp: new Date(),
        duration: Date.now() - startTime,
        operationsComposed: 0,
        patternsDiscovered: []
      }
    }
  }

  /**
   * Discover patterns in operation usage
   */
  private async discoverPatterns(operations: string[]): Promise<OperationPattern[]> {
    const patterns: OperationPattern[] = []

    // Pattern 1: Clay problem + Citation composition
    const clayOps = operations.filter(op => op.startsWith('solve-'))
    const citationOps = operations.filter(op => op.startsWith('get-'))

    if (clayOps.length > 0 && citationOps.length > 0) {
      patterns.push({
        name: 'problem-with-citations',
        operations: [clayOps[0], citationOps[0]],
        description: 'Solve problem and provide citations',
        benefit: 'Trustworthy solutions with historical context'
      })

      this.patterns.set('problem-with-citations', patterns[0])
    }

    // Pattern 2: Encryption + Analytics
    const encryptOps = operations.filter(op => op.includes('encrypt'))
    const analyticOps = operations.filter(op => op.includes('analytics') || op.includes('record'))

    if (encryptOps.length > 0 && analyticOps.length > 0) {
      patterns.push({
        name: 'secure-analytics',
        operations: [encryptOps[0], analyticOps[0]],
        description: 'Encrypt sensitive data before recording',
        benefit: 'Privacy-preserving analytics'
      })

      this.patterns.set('secure-analytics', patterns[1])
    }

    return patterns
  }

  /**
   * Identify high-value operation compositions
   */
  private async identifyCompositions(operations: string[]): Promise<string[][]> {
    const compositions: string[][] = []

    // Composition 1: Health check → Get metrics
    compositions.push(['health-check', 'get-metrics'])

    // Composition 2: List operations → Get analytics
    compositions.push(['list-operations', 'get-analytics'])

    // Composition 3: Clay problem → Genealogy → Get citations
    compositions.push(['solve-p-vs-np', 'get-genealogy', 'get-cryptography-citations'])

    return compositions
  }

  /**
   * Identify next optimization target
   */
  private identifyNextOptimization(stats: any): string {
    if (!stats || stats.successful === 0) {
      return 'improve-error-handling'
    }

    if (stats.avgDuration > 1000) {
      return 'reduce-latency'
    }

    if (stats.operationCount < 30) {
      return 'add-more-operations'
    }

    return 'continuous-improvement'
  }

  /**
   * Get cycle history
   */
  getCycles(limit: number = 10): ImprovementCycle[] {
    return this.cycles.slice(-limit)
  }

  /**
   * Get discovered patterns
   */
  getPatterns(): OperationPattern[] {
    return Array.from(this.patterns.values())
  }

  /**
   * Get pattern by name
   */
  getPattern(name: string): OperationPattern | undefined {
    return this.patterns.get(name)
  }

  /**
   * Suggest next composition based on patterns
   */
  suggestComposition(): string[] | undefined {
    const patterns = Array.from(this.patterns.values())
    if (patterns.length === 0) return undefined

    // Return first pattern's operations
    return patterns[0].operations
  }
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

export const autonomousEngine = new AutonomousEngine(5 * 60 * 1000)

/**
 * Start autonomous improvement (global)
 */
export function startAutonomousImprovement(): void {
  autonomousEngine.startCycles()
}

/**
 * Stop autonomous improvement (global)
 */
export function stopAutonomousImprovement(): void {
  autonomousEngine.stopCycles()
}

/**
 * Get last improvement cycle
 */
export function getLastCycle(): ImprovementCycle | undefined {
  const cycles = autonomousEngine.getCycles(1)
  return cycles.length > 0 ? cycles[0] : undefined
}

export default {
  AutonomousEngine,
  autonomousEngine,
  startAutonomousImprovement,
  stopAutonomousImprovement,
  getLastCycle
}
