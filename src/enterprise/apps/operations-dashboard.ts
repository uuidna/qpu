/**
 * Operations Dashboard - Real-time system health, alerts, incident timeline
 */

export interface SystemMetric {
  name: string
  value: number
  unit: string
  status: 'healthy' | 'warning' | 'critical'
  threshold: { warning: number; critical: number }
  timestamp: Date
}

export interface AlertRule {
  id: string
  name: string
  metric: string
  condition: 'greater-than' | 'less-than' | 'equals'
  threshold: number
  duration: number // seconds
  severity: 'info' | 'warning' | 'critical'
  enabled: boolean
  notificationChannels: string[]
}

export interface Alert {
  id: string
  ruleId: string
  metric: string
  value: number
  severity: 'info' | 'warning' | 'critical'
  triggeredAt: Date
  resolvedAt?: Date
  message: string
  context: Record<string, unknown>
}

export interface IncidentTimeline {
  id: string
  title: string
  description: string
  startTime: Date
  endTime?: Date
  status: 'ongoing' | 'resolved' | 'investigating'
  severity: 'critical' | 'major' | 'minor'
  affectedServices: string[]
  updates: IncidentUpdate[]
}

export interface IncidentUpdate {
  timestamp: Date
  author: string
  message: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
}

export interface HealthStatus {
  service: string
  status: 'healthy' | 'degraded' | 'down'
  lastCheck: Date
  uptime: number // percentage
  responseTime: number // ms
}

export class OperationsDashboard {
  private metrics: Map<string, SystemMetric[]> = new Map()
  private alertRules: Map<string, AlertRule> = new Map()
  private alerts: Map<string, Alert> = new Map()
  private incidents: Map<string, IncidentTimeline> = new Map()
  private serviceHealth: Map<string, HealthStatus> = new Map()

  constructor() {
    this.initializeMetrics()
    this.initializeAlertRules()
    this.initializeServices()
  }

  private initializeMetrics(): void {
    const now = new Date()
    const metrics = [
      { name: 'CPU Usage', value: 45, unit: '%', threshold: { warning: 70, critical: 90 } },
      { name: 'Memory Usage', value: 62, unit: '%', threshold: { warning: 80, critical: 95 } },
      { name: 'Disk Usage', value: 38, unit: '%', threshold: { warning: 80, critical: 95 } },
      { name: 'Network Latency', value: 25, unit: 'ms', threshold: { warning: 100, critical: 500 } },
      { name: 'Request Rate', value: 4500, unit: 'req/s', threshold: { warning: 8000, critical: 10000 } },
      { name: 'Error Rate', value: 0.05, unit: '%', threshold: { warning: 0.1, critical: 0.5 } },
      { name: 'Cache Hit Rate', value: 92, unit: '%', threshold: { warning: 80, critical: 70 } },
      { name: 'Queue Depth', value: 234, unit: 'items', threshold: { warning: 1000, critical: 5000 } }
    ]

    metrics.forEach(metric => {
      const status = metric.value > metric.threshold.critical
        ? 'critical'
        : metric.value > metric.threshold.warning
          ? 'warning'
          : 'healthy'

      this.metrics.set(metric.name, [{
        ...metric,
        status,
        timestamp: now
      }])
    })
  }

  private initializeAlertRules(): void {
    const rules: AlertRule[] = [
      {
        id: 'alert-cpu',
        name: 'High CPU Usage',
        metric: 'CPU Usage',
        condition: 'greater-than',
        threshold: 90,
        duration: 300,
        severity: 'critical',
        enabled: true,
        notificationChannels: ['email', 'slack', 'pagerduty']
      },
      {
        id: 'alert-memory',
        name: 'High Memory Usage',
        metric: 'Memory Usage',
        condition: 'greater-than',
        threshold: 95,
        duration: 300,
        severity: 'critical',
        enabled: true,
        notificationChannels: ['email', 'slack']
      },
      {
        id: 'alert-error-rate',
        name: 'Elevated Error Rate',
        metric: 'Error Rate',
        condition: 'greater-than',
        threshold: 0.5,
        duration: 60,
        severity: 'warning',
        enabled: true,
        notificationChannels: ['slack']
      },
      {
        id: 'alert-latency',
        name: 'High Latency',
        metric: 'Network Latency',
        condition: 'greater-than',
        threshold: 500,
        duration: 120,
        severity: 'warning',
        enabled: true,
        notificationChannels: ['slack']
      }
    ]

    rules.forEach(rule => this.alertRules.set(rule.id, rule))
  }

  private initializeServices(): void {
    const services = [
      { name: 'API Server', uptime: 99.97 },
      { name: 'Quantum Kernel', uptime: 99.99 },
      { name: 'Cache Layer', uptime: 99.85 },
      { name: 'Database', uptime: 99.98 },
      { name: 'Auth Service', uptime: 99.96 },
      { name: 'Message Queue', uptime: 99.94 }
    ]

    services.forEach(service => {
      this.serviceHealth.set(service.name, {
        service: service.name,
        status: service.uptime > 99.5 ? 'healthy' : 'degraded',
        lastCheck: new Date(),
        uptime: service.uptime,
        responseTime: Math.round(Math.random() * 100) + 20
      })
    })
  }

  recordMetric(metricName: string, value: number): SystemMetric {
    const status = this.determineStatus(metricName, value)
    const metric: SystemMetric = {
      name: metricName,
      value,
      unit: this.getUnit(metricName),
      status,
      threshold: this.getThreshold(metricName),
      timestamp: new Date()
    }

    if (!this.metrics.has(metricName)) {
      this.metrics.set(metricName, [])
    }

    const history = this.metrics.get(metricName)!
    history.push(metric)

    // Keep last 1440 minutes (24 hours) of data
    if (history.length > 1440) {
      history.shift()
    }

    // Check alert rules
    this.checkAlertRules(metricName, value)

    return metric
  }

  private determineStatus(metricName: string, value: number): 'healthy' | 'warning' | 'critical' {
    const threshold = this.getThreshold(metricName)

    if (metricName === 'Cache Hit Rate') {
      return value < threshold.critical ? 'critical' : value < threshold.warning ? 'warning' : 'healthy'
    }

    return value > threshold.critical ? 'critical' : value > threshold.warning ? 'warning' : 'healthy'
  }

  private getThreshold(metricName: string): { warning: number; critical: number } {
    const thresholds: Record<string, { warning: number; critical: number }> = {
      'CPU Usage': { warning: 70, critical: 90 },
      'Memory Usage': { warning: 80, critical: 95 },
      'Disk Usage': { warning: 80, critical: 95 },
      'Network Latency': { warning: 100, critical: 500 },
      'Request Rate': { warning: 8000, critical: 10000 },
      'Error Rate': { warning: 0.1, critical: 0.5 },
      'Cache Hit Rate': { warning: 80, critical: 70 },
      'Queue Depth': { warning: 1000, critical: 5000 }
    }

    return thresholds[metricName] || { warning: 70, critical: 90 }
  }

  private getUnit(metricName: string): string {
    const units: Record<string, string> = {
      'CPU Usage': '%',
      'Memory Usage': '%',
      'Disk Usage': '%',
      'Network Latency': 'ms',
      'Request Rate': 'req/s',
      'Error Rate': '%',
      'Cache Hit Rate': '%',
      'Queue Depth': 'items'
    }

    return units[metricName] || ''
  }

  private checkAlertRules(metricName: string, value: number): void {
    Array.from(this.alertRules.values()).forEach(rule => {
      if (!rule.enabled || rule.metric !== metricName) return

      let triggered = false
      if (rule.condition === 'greater-than') triggered = value > rule.threshold
      if (rule.condition === 'less-than') triggered = value < rule.threshold
      if (rule.condition === 'equals') triggered = value === rule.threshold

      if (triggered) {
        this.triggerAlert(rule.id, metricName, value)
      }
    })
  }

  private triggerAlert(ruleId: string, metricName: string, value: number): void {
    const rule = this.alertRules.get(ruleId)
    if (!rule) return

    const alert: Alert = {
      id: `alert-${Date.now()}`,
      ruleId,
      metric: metricName,
      value,
      severity: rule.severity,
      triggeredAt: new Date(),
      message: `${rule.name}: ${metricName} = ${value}`,
      context: { rule: rule.name }
    }

    this.alerts.set(alert.id, alert)
  }

  resolveAlert(alertId: string): Alert | null {
    const alert = this.alerts.get(alertId)
    if (!alert) return null

    alert.resolvedAt = new Date()
    return alert
  }

  createIncident(data: Omit<IncidentTimeline, 'id' | 'updates'>): IncidentTimeline {
    const incident: IncidentTimeline = {
      id: `incident-${Date.now()}`,
      ...data,
      updates: [{
        timestamp: new Date(),
        author: 'System',
        message: `Incident created: ${data.title}`,
        status: 'investigating'
      }]
    }

    this.incidents.set(incident.id, incident)
    return incident
  }

  updateIncident(incidentId: string, update: IncidentUpdate): IncidentTimeline | null {
    const incident = this.incidents.get(incidentId)
    if (!incident) return null

    incident.updates.push(update)
    return incident
  }

  resolveIncident(incidentId: string, message: string): IncidentTimeline | null {
    const incident = this.incidents.get(incidentId)
    if (!incident) return null

    incident.status = 'resolved'
    incident.endTime = new Date()
    incident.updates.push({
      timestamp: new Date(),
      author: 'System',
      message,
      status: 'resolved'
    })

    return incident
  }

  getDashboardSnapshot() {
    const systemMetrics = Array.from(this.metrics.values()).map(history => history[history.length - 1])
    const activeAlerts = Array.from(this.alerts.values()).filter(a => !a.resolvedAt)
    const activeIncidents = Array.from(this.incidents.values()).filter(i => i.status !== 'resolved')
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical')

    return {
      timestamp: new Date(),
      systemHealth: systemMetrics,
      activeAlerts: activeAlerts.length,
      criticalAlerts: criticalAlerts.length,
      activeIncidents: activeIncidents.length,
      services: Array.from(this.serviceHealth.values()),
      systemStatus: criticalAlerts.length > 0 ? 'critical' : activeAlerts.length > 0 ? 'warning' : 'healthy'
    }
  }

  getMetricHistory(metricName: string, minutes: number = 60): SystemMetric[] {
    const history = this.metrics.get(metricName) || []
    const cutoff = Date.now() - minutes * 60 * 1000

    return history.filter(m => m.timestamp.getTime() > cutoff)
  }

  getAlertHistory(limit: number = 100): Alert[] {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime())
      .slice(0, limit)
  }

  getIncidentHistory(limit: number = 20): IncidentTimeline[] {
    return Array.from(this.incidents.values())
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit)
  }
}

export const operationsDashboard = new OperationsDashboard()
