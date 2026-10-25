// WAVE 8G: Monitoring Dashboard - Real-time System Health

export interface HealthStatus {
  timestamp: number
  uptime: number
  status: 'healthy' | 'degraded' | 'unhealthy'
}

export interface SystemMetrics {
  timestamp: number
  api_latency_p50: number
  api_latency_p95: number
  api_latency_p99: number
  database_latency_p50: number
  error_rate: number
  request_rate: number
  cache_hit_rate: number
  memory_usage_mb: number
  cpu_usage_percent: number
}

export interface CostAnalytics {
  timestamp: number
  total_cost: number
  cost_per_operation: number
  cost_by_provider: Record<string, number>
  cost_trends: Array<{ date: string; cost: number }>
}

export interface DashboardData {
  health: HealthStatus
  metrics: SystemMetrics
  costs: CostAnalytics
  alerts: Alert[]
}

export interface Alert {
  id: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  timestamp: number
  resolved: boolean
}

export class MonitoringDashboard {
  private metrics_history: SystemMetrics[] = []
  private alerts: Map<string, Alert> = new Map()
  private health_checks: Map<string, { last_check: number; healthy: boolean }> = new Map()
  private start_time = Date.now()

  // Record system metrics
  recordMetrics(metrics: Partial<SystemMetrics>): void {
    const full_metrics: SystemMetrics = {
      timestamp: Date.now(),
      api_latency_p50: metrics.api_latency_p50 || 0,
      api_latency_p95: metrics.api_latency_p95 || 0,
      api_latency_p99: metrics.api_latency_p99 || 0,
      database_latency_p50: metrics.database_latency_p50 || 0,
      error_rate: metrics.error_rate || 0,
      request_rate: metrics.request_rate || 0,
      cache_hit_rate: metrics.cache_hit_rate || 0,
      memory_usage_mb: metrics.memory_usage_mb || 0,
      cpu_usage_percent: metrics.cpu_usage_percent || 0
    }

    this.metrics_history.push(full_metrics)

    // Keep last 1000 metrics
    if (this.metrics_history.length > 1000) {
      this.metrics_history.shift()
    }

    this.evaluateAlerts(full_metrics)
  }

  // Get current health status
  getHealth(): HealthStatus {
    const uptime = Date.now() - this.start_time
    const status = this.calculateHealthStatus()

    return { timestamp: Date.now(), uptime, status }
  }

  private calculateHealthStatus(): 'healthy' | 'degraded' | 'unhealthy' {
    if (this.metrics_history.length === 0) return 'healthy'

    const latest = this.metrics_history[this.metrics_history.length - 1]

    // Check for unhealthy conditions
    if (latest.error_rate > 0.05 || latest.api_latency_p99 > 10000 || latest.memory_usage_mb > 1024) {
      return 'unhealthy'
    }

    // Check for degraded conditions
    if (latest.error_rate > 0.01 || latest.api_latency_p99 > 5000 || latest.memory_usage_mb > 512) {
      return 'degraded'
    }

    return 'healthy'
  }

  // Evaluate alerts based on metrics
  private evaluateAlerts(metrics: SystemMetrics): void {
    // High error rate alert
    if (metrics.error_rate > 0.05) {
      this.createAlert('HIGH_ERROR_RATE', 'critical', 'Error rate exceeds 5%', `Current error rate: ${(metrics.error_rate * 100).toFixed(2)}%`)
    } else {
      this.resolveAlert('HIGH_ERROR_RATE')
    }

    // High latency alert
    if (metrics.api_latency_p99 > 10000) {
      this.createAlert('HIGH_LATENCY', 'warning', 'P99 latency exceeds 10s', `Current P99: ${metrics.api_latency_p99}ms`)
    } else {
      this.resolveAlert('HIGH_LATENCY')
    }

    // Memory usage alert
    if (metrics.memory_usage_mb > 900) {
      this.createAlert('HIGH_MEMORY', 'critical', 'Memory usage exceeds 900MB', `Current: ${metrics.memory_usage_mb}MB`)
    } else {
      this.resolveAlert('HIGH_MEMORY')
    }

    // Low cache hit rate alert
    if (metrics.cache_hit_rate < 0.5) {
      this.createAlert('LOW_CACHE_HIT_RATE', 'info', 'Cache hit rate below 50%', `Current: ${(metrics.cache_hit_rate * 100).toFixed(2)}%`)
    }
  }

  private createAlert(id: string, severity: Alert['severity'], title: string, description: string): void {
    const existing = this.alerts.get(id)

    if (existing && !existing.resolved) {
      return  // Already has active alert
    }

    this.alerts.set(id, {
      id,
      severity,
      title,
      description,
      timestamp: Date.now(),
      resolved: false
    })
  }

  private resolveAlert(id: string): void {
    const alert = this.alerts.get(id)
    if (alert && !alert.resolved) {
      alert.resolved = true
    }
  }

  // Get cost analytics
  getCostAnalytics(days: number = 30): CostAnalytics {
    // Calculate cost trends
    const trends: Array<{ date: string; cost: number }> = []
    let total_cost = 0

    for (let i = days; i > 0; i--) {
      const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
      const cost = Math.random() * 100 + 50  // Placeholder
      trends.push({ date, cost })
      total_cost += cost
    }

    return {
      timestamp: Date.now(),
      total_cost,
      cost_per_operation: total_cost / (this.metrics_history.length || 1),
      cost_by_provider: {
        'postgresql': total_cost * 0.3,
        'mongodb': total_cost * 0.25,
        'cloudflare-d1': total_cost * 0.25,
        'sqlite': total_cost * 0.2
      },
      cost_trends: trends
    }
  }

  // Get full dashboard data
  getDashboard(): DashboardData {
    return {
      health: this.getHealth(),
      metrics: this.metrics_history[this.metrics_history.length - 1] || {
        timestamp: Date.now(),
        api_latency_p50: 0,
        api_latency_p95: 0,
        api_latency_p99: 0,
        database_latency_p50: 0,
        error_rate: 0,
        request_rate: 0,
        cache_hit_rate: 0,
        memory_usage_mb: 0,
        cpu_usage_percent: 0
      },
      costs: this.getCostAnalytics(),
      alerts: Array.from(this.alerts.values()).filter(a => !a.resolved)
    }
  }

  // Get metrics history
  getHistory(limit: number = 100): SystemMetrics[] {
    return this.metrics_history.slice(-limit)
  }

  // Get SLA compliance
  getSLACompliance(): {
    availability: number
    latency_p99: number
    error_rate: number
  } {
    if (this.metrics_history.length === 0) {
      return { availability: 100, latency_p99: 0, error_rate: 0 }
    }

    const total = this.metrics_history.length
    const unhealthy = this.metrics_history.filter(m => m.error_rate > 0.01).length

    return {
      availability: ((total - unhealthy) / total) * 100,
      latency_p99: Math.max(...this.metrics_history.map(m => m.api_latency_p99)),
      error_rate: (this.metrics_history.reduce((sum, m) => sum + m.error_rate, 0) / total) * 100
    }
  }

  // Clear old data
  cleanup(olderThan: number = 86400000): void {
    const cutoff = Date.now() - olderThan
    this.metrics_history = this.metrics_history.filter(m => m.timestamp > cutoff)

    for (const [id, alert] of this.alerts.entries()) {
      if (alert.timestamp < cutoff && alert.resolved) {
        this.alerts.delete(id)
      }
    }
  }
}

export const monitoringDashboard = new MonitoringDashboard()
