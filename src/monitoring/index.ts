// WAVE 8G: Monitoring Dashboard Module Exports

export {
  HealthStatus,
  SystemMetrics,
  CostAnalytics,
  DashboardData,
  Alert,
  MonitoringDashboard,
  monitoringDashboard
} from './dashboard.js'

// Monitoring orchestrator for all observability
export class MonitoringOrchestrator {
  private dashboard: any

  constructor() {
    // Imported from ./dashboard.js above
  }

  // Start monitoring
  start() {
    // Start collecting metrics
    setInterval(() => {
      // Collect from all systems
      // this.dashboard.recordMetrics(...)
    }, 10000)  // Every 10 seconds
  }

  // Get comprehensive dashboard
  getFullDashboard() {
    return this.dashboard.getDashboard()
  }

  // Get specific metrics
  getMetrics() {
    return this.dashboard.getHistory(100)
  }

  // Get alerts
  getAlerts() {
    const dashboard = this.dashboard.getDashboard()
    return dashboard.alerts
  }

  // Get SLA compliance
  getSLACompliance() {
    return this.dashboard.getSLACompliance()
  }

  // Export metrics for external monitoring
  exportMetrics() {
    const data = this.dashboard.getDashboard()
    return {
      timestamp: Date.now(),
      health: data.health,
      metrics: data.metrics,
      costs: data.costs,
      sla: this.dashboard.getSLACompliance()
    }
  }
}

export const monitoringOrchestrator = new MonitoringOrchestrator()
