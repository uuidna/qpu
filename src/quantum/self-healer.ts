// Self-healing infrastructure with anomaly detection and auto-recovery
export class SelfHealer {
  private anomalies: Array<{ timestamp: number; type: string; severity: string }> = []
  private lastHealthCheck = 0
  private recoveryActions = new Map<string, () => void>()

  registerRecovery(anomalyType: string, action: () => void) {
    this.recoveryActions.set(anomalyType, action)
  }

  async detectAnomalies(metrics: any): Promise<string[]> {
    const issues: string[] = []

    if (metrics.errorRate > 0.05) {
      issues.push('high-error-rate')
    }

    if (metrics.latency > 500) {
      issues.push('latency-spike')
    }

    if (metrics.memoryUsage > 0.85) {
      issues.push('memory-pressure')
    }

    if (metrics.cpuUsage > 0.9) {
      issues.push('cpu-overload')
    }

    return issues
  }

  async autoRecover(anomalies: string[]): Promise<void> {
    for (const anomaly of anomalies) {
      const action = this.recoveryActions.get(anomaly)
      if (action) {
        action()
        this.recordAnomaly(anomaly, 'recovered')
      }
    }
  }

  recordAnomaly(type: string, severity: string) {
    this.anomalies.push({
      timestamp: Date.now(),
      type,
      severity,
    })
  }

  getAnomalyHistory(hours: number = 24): any[] {
    const since = Date.now() - hours * 3600000
    return this.anomalies.filter(a => a.timestamp > since)
  }

  getHealthScore(): number {
    const recentAnomalies = this.getAnomalyHistory(1)
    return Math.max(0, 100 - recentAnomalies.length * 10)
  }
}

export const healer = new SelfHealer()
