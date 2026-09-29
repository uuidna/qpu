// Adaptive auto-scaler for dynamic resource allocation
export interface ScalingMetrics {
  requestsPerSecond: number
  avgLatency: number
  cpuUsage: number
  memoryUsage: number
  queueDepth: number
}

export interface ScalingDecision {
  action: 'scale-up' | 'scale-down' | 'no-change'
  replicas: number
  reason: string
}

export class AdaptiveScaler {
  private currentReplicas = 1
  private minReplicas = 1
  private maxReplicas = 10
  private history: ScalingMetrics[] = []
  private scalingHistory: ScalingDecision[] = []

  recordMetrics(metrics: ScalingMetrics) {
    this.history.push(metrics)
    if (this.history.length > 100) {
      this.history.shift()
    }
  }

  decide(metrics: ScalingMetrics): ScalingDecision {
    let action: 'scale-up' | 'scale-down' | 'no-change' = 'no-change'
    let reason = 'Metrics within acceptable range'
    let targetReplicas = this.currentReplicas

    if (metrics.requestsPerSecond > 100 && metrics.avgLatency > 200) {
      action = 'scale-up'
      reason = 'High load: RPS > 100 and latency > 200ms'
      targetReplicas = Math.min(this.maxReplicas, this.currentReplicas + 2)
    } else if (metrics.cpuUsage > 80) {
      action = 'scale-up'
      reason = 'CPU pressure: > 80%'
      targetReplicas = Math.min(this.maxReplicas, this.currentReplicas + 1)
    } else if (metrics.memoryUsage > 85) {
      action = 'scale-up'
      reason = 'Memory pressure: > 85%'
      targetReplicas = Math.min(this.maxReplicas, this.currentReplicas + 1)
    } else if (metrics.queueDepth > 50) {
      action = 'scale-up'
      reason = 'Queue backlog: > 50 requests'
      targetReplicas = Math.min(this.maxReplicas, this.currentReplicas + 1)
    } else if (metrics.requestsPerSecond < 10 && metrics.avgLatency < 50 && this.currentReplicas > this.minReplicas) {
      action = 'scale-down'
      reason = 'Low utilization: RPS < 10, latency < 50ms'
      targetReplicas = Math.max(this.minReplicas, this.currentReplicas - 1)
    }

    if (action !== 'no-change') {
      this.currentReplicas = targetReplicas
    }

    const decision: ScalingDecision = {
      action,
      replicas: this.currentReplicas,
      reason,
    }

    this.scalingHistory.push(decision)
    return decision
  }

  getMetricsTrend(): {
    cpuTrend: 'increasing' | 'stable' | 'decreasing'
    latencyTrend: 'increasing' | 'stable' | 'decreasing'
    throughputTrend: 'increasing' | 'stable' | 'decreasing'
  } {
    if (this.history.length < 3) {
      return { cpuTrend: 'stable', latencyTrend: 'stable', throughputTrend: 'stable' }
    }

    const recent = this.history.slice(-3)
    const avgCpuEarly = recent[0].cpuUsage
    const avgCpuLate = recent[2].cpuUsage

    return {
      cpuTrend: avgCpuLate > avgCpuEarly * 1.2 ? 'increasing' : avgCpuLate < avgCpuEarly * 0.8 ? 'decreasing' : 'stable',
      latencyTrend:
        recent[2].avgLatency > recent[0].avgLatency * 1.2
          ? 'increasing'
          : recent[2].avgLatency < recent[0].avgLatency * 0.8
            ? 'decreasing'
            : 'stable',
      throughputTrend:
        recent[2].requestsPerSecond > recent[0].requestsPerSecond * 1.2
          ? 'increasing'
          : recent[2].requestsPerSecond < recent[0].requestsPerSecond * 0.8
            ? 'decreasing'
            : 'stable',
    }
  }

  getStats() {
    return {
      currentReplicas: this.currentReplicas,
      minReplicas: this.minReplicas,
      maxReplicas: this.maxReplicas,
      scalingEvents: this.scalingHistory.length,
      lastScaling: this.scalingHistory[this.scalingHistory.length - 1] || null,
    }
  }
}

export const scaler = new AdaptiveScaler()
