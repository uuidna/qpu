// Auto-test loop: Continuous monitoring and testing of all adapters
// Runs periodic health checks, discovers issues, and maintains uptime metrics

import { adapters, executeAdapterOperation, type AdapterName } from './adapters.js'

interface HealthMetric {
  adapter: AdapterName
  operation: string
  lastCheck: Date
  status: 'healthy' | 'degraded' | 'failed'
  responseTime: number
  errorCount: number
  successCount: number
  passRate: number
}

interface MonitorState {
  started: Date
  uptime: number
  totalChecks: number
  passedChecks: number
  failedChecks: number
  metrics: Map<string, HealthMetric>
  lastAlert?: string
}

const state: MonitorState = {
  started: new Date(),
  uptime: 0,
  totalChecks: 0,
  passedChecks: 0,
  failedChecks: 0,
  metrics: new Map(),
}

// Test configurations
const testConfigs: Record<AdapterName, unknown> = {
  git: { repository: 'test/repo', branch: 'main', version: '1.0.0' },
  zenodo: { version: '1.0.0', title: 'Test', description: 'Test', creators: [{ name: 'Test' }], license: 'CC-BY', keywords: [] },
  npm: { package: '@test/pkg', version: '1.0.0' },
  github: { owner: 'test', repo: 'repo', version: '1.0.0' },
  deploy: { version: '1.0.0', targets: ['vercel'] },
  'ibm-qiskit': { backend: 'simulator', circuit: {} },
  'aws-braket': { device: 'simulator', circuit: {} },
  ionq: { circuit: {}, target: 'simulator' },
  rigetti: { program: 'H 0', device: 'simulator' },
  'google-qualtran': { algorithm: 'shor' },
  'google-openfermion': { molecule: 'H2' },
  'google-tensorflow-quantum': { model_type: 'qnn' },
  'google-willow': { circuit: {} },
}

// Run single health check
async function checkAdapterHealth(adapterName: AdapterName, operationName: string): Promise<HealthMetric> {
  const key = `${adapterName}/${operationName}`
  const existing = state.metrics.get(key)

  const start = Date.now()
  let status: 'healthy' | 'degraded' | 'failed' = 'healthy'
  let errorCount = existing?.errorCount || 0
  let successCount = existing?.successCount || 0

  try {
    const config = testConfigs[adapterName]
    executeAdapterOperation(adapterName, operationName, config)
    successCount++
  } catch (error) {
    status = 'failed'
    errorCount++
  }

  const responseTime = Date.now() - start

  const metric: HealthMetric = {
    adapter: adapterName,
    operation: operationName,
    lastCheck: new Date(),
    status,
    responseTime,
    errorCount,
    successCount,
    passRate: successCount + errorCount > 0 ? (successCount / (successCount + errorCount)) * 100 : 0,
  }

  state.metrics.set(key, metric)
  state.totalChecks++

  if (status === 'healthy') {
    state.passedChecks++
  } else {
    state.failedChecks++
  }

  return metric
}

// Run complete health check cycle
export async function runHealthCheckCycle(): Promise<HealthMetric[]> {
  const results: HealthMetric[] = []

  for (const [adapterName, adapter] of Object.entries(adapters)) {
    for (const opName of Object.keys(adapter.operations)) {
      const metric = await checkAdapterHealth(adapterName as AdapterName, opName)
      results.push(metric)
    }
  }

  // Update uptime
  state.uptime = (Date.now() - state.started.getTime()) / 1000 / 60 // minutes

  return results
}

// Generate health report
export function generateHealthReport(): string {
  const passRate = state.totalChecks > 0 ? ((state.passedChecks / state.totalChecks) * 100).toFixed(1) : '0'

  let report = '\n═════════════════════════════════════════════════════════════════\n'
  report += 'QPU ADAPTER HEALTH REPORT\n'
  report += '═════════════════════════════════════════════════════════════════\n\n'

  report += 'UPTIME\n'
  report += '─────────────────────────────────────────────────────────────────\n'
  report += `Started:      ${state.started.toISOString()}\n`
  report += `Uptime:       ${state.uptime.toFixed(1)} minutes\n`
  report += `Total Checks: ${state.totalChecks}\n`
  report += `Passed:       ${state.passedChecks}\n`
  report += `Failed:       ${state.failedChecks}\n`
  report += `Pass Rate:    ${passRate}%\n\n`

  report += 'ADAPTER STATUS\n'
  report += '─────────────────────────────────────────────────────────────────\n'

  const byAdapter = new Map<AdapterName, HealthMetric[]>()
  for (const metric of state.metrics.values()) {
    if (!byAdapter.has(metric.adapter)) byAdapter.set(metric.adapter, [])
    byAdapter.get(metric.adapter)!.push(metric)
  }

  for (const [adapter, metrics] of byAdapter) {
    const healthy = metrics.filter((m) => m.status === 'healthy').length
    const total = metrics.length
    const icon = healthy === total ? '✓' : '⚠'
    const adapterPassRate = metrics.length > 0 ? ((healthy / total) * 100).toFixed(0) : '0'

    report += `${icon} ${adapter.padEnd(20)} ${healthy}/${total} healthy (${adapterPassRate}%)\n`

    metrics.forEach((m) => {
      const opIcon = m.status === 'healthy' ? '  ✓' : '  ✗'
      report += `${opIcon} ${m.operation.padEnd(18)} [${m.responseTime}ms, ${m.passRate.toFixed(0)}%]\n`
    })

    report += '\n'
  }

  report += '═════════════════════════════════════════════════════════════════\n'

  return report
}

// Start continuous monitoring
let monitorInterval: NodeJS.Timeout | null = null

export function startMonitoring(intervalSeconds: number = 300): void {
  if (monitorInterval) {
    console.log('[Monitor] Already running')
    return
  }

  console.log(`[Monitor] Started (interval: ${intervalSeconds}s)`)

  monitorInterval = setInterval(async () => {
    try {
      const results = await runHealthCheckCycle()
      const failedCount = results.filter((r) => r.status === 'failed').length

      if (failedCount > 0) {
        state.lastAlert = `${failedCount} adapters failed health check`
        console.log(`[Monitor] Alert: ${state.lastAlert}`)
      }

      console.log(generateHealthReport())
    } catch (error) {
      console.error('[Monitor] Health check failed:', error)
    }
  }, intervalSeconds * 1000)

  // Run immediately
  runHealthCheckCycle().then(() => {
    console.log(generateHealthReport())
  })
}

// Stop monitoring
export function stopMonitoring(): void {
  if (monitorInterval) {
    clearInterval(monitorInterval)
    monitorInterval = null
    console.log('[Monitor] Stopped')
  }
}

// Get current state
export function getMonitorState(): MonitorState {
  return { ...state }
}

export function getHealthMetrics(): HealthMetric[] {
  return Array.from(state.metrics.values())
}
