/**
 * Wave Executor - Comprehensive Multi-Wave System Orchestration
 *
 * Executes everything autonomously:
 * 1. Discover all problems via all MCPs
 * 2. Map to all prizes and financing
 * 3. Execute in parallel waves
 * 4. Report results progressively
 * 5. Scale and iterate
 */

import {
  publicMCPs,
  discoverSolvers,
  autonomouslySolve,
  findPrizesForProblem,
  findFinancingForDomain
} from './ecosystem-discovery.js'

// ============================================================================
// WAVE SYSTEM TYPES
// ============================================================================

export type WaveStatus = 'queued' | 'executing' | 'completed' | 'failed'

export interface WaveTask {
  id: string
  problemId: string
  solvers: string[]
  prizes: string[]
  financing: string[]
  status: WaveStatus
  result?: any
  earnedAmount?: number
  error?: string
}

export interface WaveExecution {
  waveId: string
  waveNumber: number
  taskCount: number
  parallelism: number
  status: WaveStatus
  startTime: number
  endTime?: number
  tasks: WaveTask[]
  results: {
    solved: number
    failed: number
    totalEarned: number
    prizes: Map<string, number>
  }
}

export interface WaveSystemStatus {
  totalWaves: number
  completedWaves: number
  totalTasks: number
  completedTasks: number
  totalEarned: number
  totalValue: number
  currentWave?: WaveExecution
  allWaves: WaveExecution[]
}

// ============================================================================
// WAVE DISCOVERY & PLANNING
// ============================================================================

const allProblems = [
  'rsa-260', 'rsa-576', 'rsa-640',
  'maxcut', 'tsp', '3-sat', 'clique',
  'portfolio', 'lih', 'ising', 'lithium'
]

/**
 * Discover all opportunities across all systems
 */
export function discoverWaveSystem() {
  const discovery = {
    problems: [] as string[],
    mcps: publicMCPs.length,
    totalPrizes: 0,
    totalFinancing: 0,
    opportunities: [] as any[]
  }

  for (const problem of allProblems) {
    const solvers = discoverSolvers({
      domain: problem.split('-')[0],
      description: problem
    })

    if (solvers.length > 0) {
      discovery.problems.push(problem)

      const prizes = findPrizesForProblem(problem)
      const domain = problem.split('-')[0]
      const financing = findFinancingForDomain(domain)

      if (prizes.length > 0 || financing.length > 0) {
        discovery.totalPrizes += prizes.length
        discovery.totalFinancing += financing.length

        discovery.opportunities.push({
          problem,
          solverCount: solvers.length,
          prizeCount: prizes.length,
          financingCount: financing.length,
          totalValue: prizes.reduce((sum, p) => sum + (parseInt(String(p.estimatedValue).replace(/\D/g, '')) || 0), 0)
        })
      }
    }
  }

  return discovery
}

/**
 * Plan waves for parallel execution
 */
export function planWaves(problemCount: number, parallelism: number = 3): WaveExecution[] {
  const waves: WaveExecution[] = []
  const problems = allProblems.slice(0, problemCount)

  let waveNumber = 1
  for (let i = 0; i < problems.length; i += parallelism) {
    const waveBatch = problems.slice(i, i + parallelism)

    const wave: WaveExecution = {
      waveId: `WAVE-${waveNumber}`,
      waveNumber,
      taskCount: waveBatch.length,
      parallelism: Math.min(parallelism, waveBatch.length),
      status: 'queued',
      startTime: 0,
      tasks: waveBatch.map((problem, idx) => ({
        id: `TASK-${waveNumber}-${idx + 1}`,
        problemId: problem,
        solvers: [],
        prizes: [],
        financing: [],
        status: 'queued'
      })),
      results: {
        solved: 0,
        failed: 0,
        totalEarned: 0,
        prizes: new Map()
      }
    }

    waves.push(wave)
    waveNumber++
  }

  return waves
}

// ============================================================================
// WAVE EXECUTION ENGINE
// ============================================================================

const waveRegistry = new Map<string, WaveExecution>()
let waveCounter = 0

/**
 * Execute a single wave
 */
export async function executeWave(wave: WaveExecution): Promise<WaveExecution> {
  wave.status = 'executing'
  wave.startTime = Date.now()

  // Execute all tasks in wave in parallel
  const taskPromises = wave.tasks.map(async (task) => {
    try {
      task.status = 'executing'

      // Discover solvers
      const solvers = discoverSolvers({
        domain: task.problemId.split('-')[0],
        description: task.problemId
      })

      task.solvers = solvers.map(s => `${s.mcp}.${s.tool}`)

      // Solve autonomously
      const solution = await autonomouslySolve(task.problemId)

      // Find prizes
      const prizes = findPrizesForProblem(task.problemId)
      task.prizes = prizes.map(p => p.prize.name)

      // Find financing
      const domain = task.problemId.split('-')[0]
      const financing = findFinancingForDomain(domain)
      task.financing = financing.map(f => f.opportunity.name)

      // Calculate earnings
      if (prizes.length > 0) {
        const prizeValue = parseInt(String(prizes[0].estimatedValue).replace(/\D/g, '')) || 0
        task.earnedAmount = prizeValue
        wave.results.totalEarned += prizeValue

        const prizeName = prizes[0].prize.name
        wave.results.prizes.set(
          prizeName,
          (wave.results.prizes.get(prizeName) || 0) + prizeValue
        )
      }

      task.status = 'completed'
      task.result = solution
      wave.results.solved++
    } catch (error) {
      task.status = 'failed'
      task.error = String(error)
      wave.results.failed++
    }
  })

  await Promise.all(taskPromises)

  wave.status = 'completed'
  wave.endTime = Date.now()

  waveRegistry.set(wave.waveId, wave)

  return wave
}

/**
 * Execute all waves sequentially
 */
export async function executeAllWaves(waves: WaveExecution[]): Promise<WaveExecution[]> {
  const results: WaveExecution[] = []

  for (const wave of waves) {
    const completed = await executeWave(wave)
    results.push(completed)

    // Add small delay between waves for pacing
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return results
}

/**
 * Full system execution with all problems
 */
export async function executeFullWaveSystem(options?: {
  problemCount?: number
  parallelism?: number
}): Promise<WaveSystemStatus> {
  const { problemCount = allProblems.length, parallelism = 3 } = options || {}

  // Plan waves
  const waves = planWaves(problemCount, parallelism)

  // Execute all waves
  const completedWaves = await executeAllWaves(waves)

  // Calculate system status
  let totalCompleted = 0
  let totalEarned = 0
  let totalValue = 0

  for (const wave of completedWaves) {
    totalCompleted += wave.results.solved
    totalEarned += wave.results.totalEarned

    for (const task of wave.tasks) {
      if (task.prizes.length > 0) {
        totalValue += task.earnedAmount || 0
      }
    }
  }

  return {
    totalWaves: completedWaves.length,
    completedWaves: completedWaves.filter(w => w.status === 'completed').length,
    totalTasks: completedWaves.reduce((sum, w) => sum + w.taskCount, 0),
    completedTasks: totalCompleted,
    totalEarned,
    totalValue,
    allWaves: completedWaves
  }
}

/**
 * Get wave system status
 */
export function getWaveSystemStatus(): WaveSystemStatus {
  const waves = Array.from(waveRegistry.values())

  let totalCompleted = 0
  let totalEarned = 0
  let totalValue = 0

  for (const wave of waves) {
    totalCompleted += wave.results.solved
    totalEarned += wave.results.totalEarned
    totalValue += Array.from(wave.results.prizes.values()).reduce((a, b) => a + b, 0)
  }

  return {
    totalWaves: waves.length,
    completedWaves: waves.filter(w => w.status === 'completed').length,
    totalTasks: waves.reduce((sum, w) => sum + w.taskCount, 0),
    completedTasks: totalCompleted,
    totalEarned,
    totalValue,
    allWaves: waves
  }
}

/**
 * Stream wave results as they complete
 */
export async function* streamWaveResults(waves: WaveExecution[]) {
  for (const wave of waves) {
    const completed = await executeWave(wave)

    yield {
      waveId: completed.waveId,
      waveNumber: completed.waveNumber,
      tasksSolved: completed.results.solved,
      tasksFailed: completed.results.failed,
      waveEarned: completed.results.totalEarned,
      duration: ((completed.endTime || 0) - completed.startTime) / 1000
    }
  }
}

/**
 * Generate wave execution report
 */
export function generateWaveReport(): string {
  const status = getWaveSystemStatus()
  const waves = status.allWaves

  let report = `
╔═══════════════════════════════════════════════════════════╗
║           WAVE EXECUTION SYSTEM REPORT                    ║
╚═══════════════════════════════════════════════════════════╝

📊 OVERALL STATISTICS:
  Total Waves: ${status.totalWaves}
  Completed: ${status.completedWaves}
  Total Tasks: ${status.totalTasks}
  Completed Tasks: ${status.completedTasks}
  Success Rate: ${((status.completedTasks / status.totalTasks) * 100).toFixed(1)}%

💰 FINANCIAL RESULTS:
  Total Value Discovered: $${status.totalValue.toLocaleString()}
  Total Earned: $${status.totalEarned.toLocaleString()}
  Remaining: $${(status.totalValue - status.totalEarned).toLocaleString()}

📈 WAVE DETAILS:
`

  for (const wave of waves) {
    const duration = ((wave.endTime || 0) - wave.startTime) / 1000
    report += `
WAVE ${wave.waveNumber}:
  Status: ${wave.status.toUpperCase()}
  Tasks: ${wave.results.solved} solved, ${wave.results.failed} failed
  Duration: ${duration.toFixed(2)}s
  Earned: $${wave.results.totalEarned.toLocaleString()}
  Prizes:
`

    for (const [prize, amount] of wave.results.prizes) {
      report += `    • ${prize}: $${amount.toLocaleString()}\n`
    }
  }

  return report
}

// ============================================================================
// WAVE EXECUTOR MCP TOOLS
// ============================================================================

export const waveExecutorTools = [
  {
    name: 'discover_wave_system',
    description: 'Discover all opportunities in wave system',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'plan_wave_execution',
    description: 'Plan waves for execution',
    inputSchema: {
      type: 'object',
      properties: {
        problemCount: { type: 'number' },
        parallelism: { type: 'number' }
      }
    }
  },
  {
    name: 'execute_full_waves',
    description: 'Execute complete wave system',
    inputSchema: {
      type: 'object',
      properties: {
        problemCount: { type: 'number' },
        parallelism: { type: 'number' }
      }
    }
  },
  {
    name: 'get_wave_status',
    description: 'Get wave system status',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'stream_wave_results',
    description: 'Stream results as waves complete',
    inputSchema: { type: 'object', properties: {} }
  }
]

export default {
  discoverWaveSystem,
  planWaves,
  executeWave,
  executeAllWaves,
  executeFullWaveSystem,
  getWaveSystemStatus,
  streamWaveResults,
  generateWaveReport,
  waveExecutorTools
}
