/**
 * SLA Validator - Monitors SLA compliance, calculates uptime, generates reports
 */

export interface SLATarget {
  name: string
  metric: 'uptime' | 'response-time' | 'error-rate' | 'throughput'
  threshold: number
  unit: string
  window: 'hourly' | 'daily' | 'monthly' | 'quarterly' | 'yearly'
  breach?: {
    penalty: number
    description: string
  }
}

export interface SLAIncident {
  id: string
  startTime: Date
  endTime?: Date
  duration: number // seconds
  impactedServices: string[]
  severity: 'critical' | 'major' | 'minor'
  rootCause: string
  resolution: string
}

export interface SLAMetrics {
  timestamp: Date
  uptime: number // percentage
  responseTime: number // milliseconds
  errorRate: number // percentage
  throughput: number // requests/second
}

export interface SLAReport {
  period: { start: Date; end: Date }
  metrics: SLAMetrics[]
  incidents: SLAIncident[]
  compliance: Record<string, boolean>
  uptime: number
  downtime: number // seconds
  breaches: Array<{ target: string; breached: boolean; actual: number; threshold: number }>
  creditEligibility: number // percentage
  summary: string
}

export class SLAValidator {
  private targets: Map<string, SLATarget> = new Map()
  private incidents: Map<string, SLAIncident> = new Map()
  private metrics: SLAMetrics[] = []

  constructor() {
    this.initializeTargets()
  }

  private initializeTargets(): void {
    this.targets.set('uptime', {
      name: 'System Uptime',
      metric: 'uptime',
      threshold: 99.9,
      unit: '%',
      window: 'monthly',
      breach: {
        penalty: 10,
        description: '10% service credit for uptime < 99.9%'
      }
    })

    this.targets.set('response-time', {
      name: 'API Response Time',
      metric: 'response-time',
      threshold: 500,
      unit: 'ms',
      window: 'hourly'
    })

    this.targets.set('error-rate', {
      name: 'Error Rate',
      metric: 'error-rate',
      threshold: 0.1,
      unit: '%',
      window: 'hourly'
    })

    this.targets.set('throughput', {
      name: 'Minimum Throughput',
      metric: 'throughput',
      threshold: 1000,
      unit: 'req/sec',
      window: 'hourly'
    })
  }

  recordMetrics(metrics: SLAMetrics): void {
    this.metrics.push(metrics)

    // Keep last 30 days of metrics
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    this.metrics = this.metrics.filter(m => m.timestamp.getTime() > thirtyDaysAgo)
  }

  recordIncident(data: Omit<SLAIncident, 'id'>): SLAIncident {
    const incident: SLAIncident = {
      id: `incident-${Date.now()}`,
      ...data
    }

    this.incidents.set(incident.id, incident)
    return incident
  }

  closeIncident(incidentId: string, resolution: string): SLAIncident | null {
    const incident = this.incidents.get(incidentId)
    if (!incident) return null

    incident.endTime = new Date()
    incident.duration = (incident.endTime.getTime() - incident.startTime.getTime()) / 1000
    incident.resolution = resolution

    return incident
  }

  validateSLA(metricName: string, actualValue: number): { compliant: boolean; difference: number } {
    const target = this.targets.get(metricName)
    if (!target) {
      return { compliant: false, difference: 0 }
    }

    let compliant = false
    let difference = 0

    if (metricName === 'uptime' || metricName === 'throughput') {
      compliant = actualValue >= target.threshold
      difference = actualValue - target.threshold
    } else {
      compliant = actualValue <= target.threshold
      difference = target.threshold - actualValue
    }

    return { compliant, difference }
  }

  calculateUptimePercentage(period: { start: Date; end: Date }): number {
    const periodDuration = (period.end.getTime() - period.start.getTime()) / 1000

    const downtime = Array.from(this.incidents.values())
      .filter(i => i.startTime >= period.start && i.startTime <= period.end)
      .reduce((total, i) => total + i.duration, 0)

    return ((periodDuration - downtime) / periodDuration) * 100
  }

  generateSLAReport(period: { start: Date; end: Date }): SLAReport {
    const relevantMetrics = this.metrics.filter(
      m => m.timestamp >= period.start && m.timestamp <= period.end
    )

    const avgUptime = relevantMetrics.length > 0
      ? relevantMetrics.reduce((sum, m) => sum + m.uptime, 0) / relevantMetrics.length
      : 100

    const avgResponseTime = relevantMetrics.length > 0
      ? relevantMetrics.reduce((sum, m) => sum + m.responseTime, 0) / relevantMetrics.length
      : 0

    const avgErrorRate = relevantMetrics.length > 0
      ? relevantMetrics.reduce((sum, m) => sum + m.errorRate, 0) / relevantMetrics.length
      : 0

    const avgThroughput = relevantMetrics.length > 0
      ? relevantMetrics.reduce((sum, m) => sum + m.throughput, 0) / relevantMetrics.length
      : 0

    const breaches = [
      {
        target: 'Uptime',
        breached: avgUptime < 99.9,
        actual: Math.round(avgUptime * 100) / 100,
        threshold: 99.9
      },
      {
        target: 'Response Time',
        breached: avgResponseTime > 500,
        actual: Math.round(avgResponseTime),
        threshold: 500
      },
      {
        target: 'Error Rate',
        breached: avgErrorRate > 0.1,
        actual: Math.round(avgErrorRate * 100) / 100,
        threshold: 0.1
      },
      {
        target: 'Throughput',
        breached: avgThroughput < 1000,
        actual: Math.round(avgThroughput),
        threshold: 1000
      }
    ]

    const relevantIncidents = Array.from(this.incidents.values()).filter(
      i => i.startTime >= period.start && i.startTime <= period.end
    )

    const downtime = relevantIncidents.reduce((total, i) => total + i.duration, 0)
    const periodDuration = (period.end.getTime() - period.start.getTime()) / 1000
    const actualUptime = ((periodDuration - downtime) / periodDuration) * 100

    let creditEligibility = 0
    if (actualUptime < 99.9) creditEligibility += 10
    if (actualUptime < 99.0) creditEligibility += 20
    if (actualUptime < 95.0) creditEligibility += 30

    const breached = breaches.filter(b => b.breached).length
    let summary = `SLA Report: ${breached === 0 ? 'All targets met ✓' : `${breached} targets breached`}`

    return {
      period,
      metrics: relevantMetrics,
      incidents: relevantIncidents,
      compliance: {
        uptime: avgUptime >= 99.9,
        responseTime: avgResponseTime <= 500,
        errorRate: avgErrorRate <= 0.1,
        throughput: avgThroughput >= 1000
      },
      uptime: Math.round(actualUptime * 100) / 100,
      downtime,
      breaches,
      creditEligibility,
      summary
    }
  }

  getComplianceTrend(days: number): Array<{ date: string; compliance: number }> {
    const trend: Array<{ date: string; compliance: number }> = []

    for (let i = days; i > 0; i--) {
      const start = new Date()
      start.setDate(start.getDate() - i)
      start.setHours(0, 0, 0, 0)

      const end = new Date()
      end.setDate(end.getDate() - i + 1)
      end.setHours(0, 0, 0, 0)

      const uptime = this.calculateUptimePercentage({ start, end })
      trend.push({
        date: start.toISOString().split('T')[0],
        compliance: Math.round(uptime * 100) / 100
      })
    }

    return trend
  }

  alertOnBreach(metric: string, value: number): { alert: boolean; message: string } {
    const result = this.validateSLA(metric, value)

    if (!result.compliant) {
      const target = this.targets.get(metric)
      return {
        alert: true,
        message: `SLA Breach: ${metric} = ${value} (threshold: ${target?.threshold})`
      }
    }

    return { alert: false, message: '' }
  }
}

export const slaValidator = new SLAValidator()
