// Quantum Execution Monitor: Real-time dashboard
// Track hardware metrics, circuit execution, fidelity improvements

interface ExecutionMetrics {
  circuitId: string
  timestamp: string
  backend: string
  qubits: number
  depth: number
  shots: number
  noisyFidelity: number
  mitigatedFidelity: number
  improvement: number
  t1Time: number
  t2Time: number
  temperature: number
  gateErrors: Record<string, number>
  readoutError: number
  executionTime: number
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED'
}

interface HardwareStatus {
  backend: string
  totalQubits: number
  availableQubits: number
  connectivity: 'GRID' | 'CHAIN' | 'ALL'
  avgT1: number
  avgT2: number
  temperature: number
  activeJobs: number
  queueDepth: number
  avgQueueTime: number
}

interface PerformanceStats {
  backend: string
  totalCircuits: number
  avgFidelity: number
  avgSpeedup: number
  totalGates: number
  totalDepth: number
  successRate: number
}

/**
 * Quantum Execution Monitor
 * Real-time tracking of quantum hardware and experiments
 */
export class QuantumExecutionMonitor {
  private executions: Map<string, ExecutionMetrics> = new Map()
  private hardwareStatus: Map<string, HardwareStatus> = new Map()
  private performanceStats: Map<string, PerformanceStats> = new Map()
  private updateInterval: NodeJS.Timer | null = null
  private onUpdate: ((data: any) => void) | null = null

  /**
   * Register execution metric
   */
  registerExecution(metric: ExecutionMetrics): void {
    this.executions.set(metric.circuitId, metric)
    this.updatePerformanceStats(metric.backend)

    if (this.onUpdate) {
      this.onUpdate({
        type: 'execution',
        data: metric
      })
    }
  }

  /**
   * Update hardware status
   */
  updateHardwareStatus(backend: string, status: HardwareStatus): void {
    this.hardwareStatus.set(backend, status)

    if (this.onUpdate) {
      this.onUpdate({
        type: 'hardware',
        backend,
        data: status
      })
    }
  }

  /**
   * Get real-time dashboard data
   */
  getDashboardData(): {
    executions: ExecutionMetrics[]
    hardware: HardwareStatus[]
    stats: PerformanceStats[]
    summary: any
  } {
    const executions = Array.from(this.executions.values()).slice(-50) // Last 50
    const hardware = Array.from(this.hardwareStatus.values())
    const stats = Array.from(this.performanceStats.values())

    const summary = {
      totalExecutions: this.executions.size,
      avgFidelity:
        executions.length > 0
          ? executions.reduce((sum, e) => sum + e.mitigatedFidelity, 0) / executions.length
          : 0,
      successRate:
        executions.length > 0
          ? (executions.filter(e => e.status === 'COMPLETED').length / executions.length) * 100
          : 0,
      activeBackends: hardware.length,
      totalActiveJobs: hardware.reduce((sum, h) => sum + h.activeJobs, 0),
      avgQueueTime: hardware.length > 0
        ? hardware.reduce((sum, h) => sum + h.avgQueueTime, 0) / hardware.length
        : 0
    }

    return { executions, hardware, stats, summary }
  }

  /**
   * Monitor specific backend
   */
  monitorBackend(backend: string, interval: number = 5000): void {
    const monitor = setInterval(() => {
      const metrics = this.getBackendMetrics(backend)

      if (this.onUpdate) {
        this.onUpdate({
          type: 'monitor',
          backend,
          metrics
        })
      }
    }, interval)

    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    this.updateInterval = monitor
  }

  /**
   * Get backend metrics
   */
  private getBackendMetrics(backend: string): any {
    const backendExecitions = Array.from(this.executions.values()).filter(e => e.backend === backend)

    return {
      backend,
      circuits: backendExecitions.length,
      avgFidelity: backendExecitions.reduce((sum, e) => sum + e.mitigatedFidelity, 0) / backendExecitions.length || 0,
      avgDepth: backendExecitions.reduce((sum, e) => sum + e.depth, 0) / backendExecitions.length || 0,
      avgTime: backendExecitions.reduce((sum, e) => sum + e.executionTime, 0) / backendExecitions.length || 0,
      lastUpdate: new Date().toISOString()
    }
  }

  /**
   * Stream live metrics (for WebSocket or Server-Sent Events)
   */
  streamMetrics(callback: (data: any) => void): void {
    this.onUpdate = callback

    // Send initial dashboard
    callback({
      type: 'dashboard',
      data: this.getDashboardData()
    })

    // Stream updates every 2 seconds
    const stream = setInterval(() => {
      callback({
        type: 'update',
        data: this.getDashboardData()
      })
    }, 2000)
  }

  /**
   * Stop streaming
   */
  stopStreaming(): void {
    this.onUpdate = null
  }

  /**
   * Generate HTML dashboard
   */
  generateHTMLDashboard(): string {
    const data = this.getDashboardData()

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quantum Execution Monitor</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
      background: #0f1419;
      color: #e0e0e0;
      padding: 20px;
    }
    .header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #333;
    }
    .header h1 { font-size: 28px; }
    .status { display: flex; gap: 20px; }
    .metric {
      background: #1a1f2e; padding: 15px 20px; border-radius: 8px;
      border-left: 4px solid #4CAF50;
    }
    .metric-label { font-size: 12px; color: #999; text-transform: uppercase; }
    .metric-value { font-size: 24px; font-weight: bold; color: #4CAF50; margin-top: 5px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .card {
      background: #1a1f2e; border-radius: 8px; padding: 20px;
      border: 1px solid #333; overflow: hidden;
    }
    .card h2 { font-size: 16px; margin-bottom: 15px; color: #fff; }
    table { width: 100%; font-size: 12px; }
    th { text-align: left; color: #999; font-weight: 600; padding: 8px 0; border-bottom: 1px solid #333; }
    td { padding: 8px 0; }
    .status-badge {
      display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 10px;
      font-weight: 600;
    }
    .status-completed { background: #4CAF50; color: #000; }
    .status-running { background: #2196F3; color: #fff; }
    .status-failed { background: #f44336; color: #fff; }
    .bar { display: inline-block; height: 4px; background: #4CAF50; border-radius: 2px; }
    .chart { height: 200px; margin-top: 10px; position: relative; }
    footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>⚛️ Quantum Execution Monitor</h1>
    <div class="status">
      <div class="metric">
        <div class="metric-label">Total Executions</div>
        <div class="metric-value">${data.summary.totalExecutions}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Avg Fidelity</div>
        <div class="metric-value">${(data.summary.avgFidelity * 100).toFixed(1)}%</div>
      </div>
      <div class="metric">
        <div class="metric-label">Success Rate</div>
        <div class="metric-value">${data.summary.successRate.toFixed(1)}%</div>
      </div>
      <div class="metric">
        <div class="metric-label">Active Jobs</div>
        <div class="metric-value">${data.summary.totalActiveJobs}</div>
      </div>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <h2>Recent Executions</h2>
      <table>
        <thead>
          <tr>
            <th>Circuit</th>
            <th>Backend</th>
            <th>Fidelity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${data.executions
            .slice(-10)
            .map(
              e => `
          <tr>
            <td>${e.circuitId.slice(0, 12)}...</td>
            <td>${e.backend}</td>
            <td><div class="bar" style="width: ${e.mitigatedFidelity * 100}px;"></div> ${(e.mitigatedFidelity * 100).toFixed(1)}%</td>
            <td><span class="status-badge status-${e.status.toLowerCase()}">${e.status}</span></td>
          </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <div class="card">
      <h2>Hardware Status</h2>
      <table>
        <thead>
          <tr>
            <th>Backend</th>
            <th>Qubits</th>
            <th>Queue</th>
            <th>Temp</th>
          </tr>
        </thead>
        <tbody>
          ${data.hardware
            .map(
              h => `
          <tr>
            <td>${h.backend}</td>
            <td>${h.availableQubits}/${h.totalQubits}</td>
            <td>${h.queueDepth}</td>
            <td>${(h.temperature * 1000).toFixed(0)}mK</td>
          </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <div class="card">
      <h2>Performance Statistics</h2>
      <table>
        <thead>
          <tr>
            <th>Backend</th>
            <th>Circuits</th>
            <th>Avg Fidelity</th>
            <th>Success</th>
          </tr>
        </thead>
        <tbody>
          ${data.stats
            .map(
              s => `
          <tr>
            <td>${s.backend}</td>
            <td>${s.totalCircuits}</td>
            <td>${(s.avgFidelity * 100).toFixed(1)}%</td>
            <td>${(s.successRate * 100).toFixed(1)}%</td>
          </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  </div>

  <footer>
    <p>Real-time quantum execution monitoring | Last updated: ${new Date().toLocaleTimeString()}</p>
  </footer>
</body>
</html>
    `

    return html
  }

  /**
   * Export metrics
   */
  exportMetrics(format: 'json' | 'csv' = 'json'): string {
    const data = this.getDashboardData()

    if (format === 'json') {
      return JSON.stringify(data, null, 2)
    } else {
      // CSV format
      const headers = ['CircuitId', 'Timestamp', 'Backend', 'Qubits', 'Depth', 'Fidelity', 'Status']
      const rows = data.executions.map(e => [
        e.circuitId,
        e.timestamp,
        e.backend,
        e.qubits,
        e.depth,
        e.mitigatedFidelity.toFixed(4),
        e.status
      ])

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
      return csv
    }
  }

  /**
   * Update performance stats
   */
  private updatePerformanceStats(backend: string): void {
    const backendExecutions = Array.from(this.executions.values()).filter(e => e.backend === backend)

    const stats: PerformanceStats = {
      backend,
      totalCircuits: backendExecutions.length,
      avgFidelity: backendExecutions.reduce((sum, e) => sum + e.mitigatedFidelity, 0) / backendExecutions.length || 0,
      avgSpeedup: backendExecutions.reduce((sum, e) => sum + (e.improvement + 1), 0) / backendExecutions.length || 1,
      totalGates: backendExecutions.reduce((sum, e) => sum + e.depth, 0),
      totalDepth: backendExecutions.reduce((sum, e) => sum + e.depth, 0),
      successRate: (backendExecutions.filter(e => e.status === 'COMPLETED').length / backendExecutions.length) || 0
    }

    this.performanceStats.set(backend, stats)
  }
}

export { QuantumExecutionMonitor, ExecutionMetrics, HardwareStatus, PerformanceStats }
