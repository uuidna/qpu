/**
 * Monitoring Setup - Generates Prometheus configs, Grafana dashboards, alerting rules
 */

export interface MetricDefinition {
  name: string
  type: 'gauge' | 'counter' | 'histogram' | 'summary'
  help: string
  labels?: string[]
}

export interface PrometheusConfig {
  global: {
    scrapeInterval: string
    evaluationInterval: string
  }
  scrapeConfigs: ScrapeConfig[]
  alertingRules: AlertingRule[]
}

export interface ScrapeConfig {
  jobName: string
  staticConfigs: Array<{ targets: string[] }>
  scrapeInterval: string
  scrapeTimeout: string
}

export interface AlertingRule {
  alert: string
  expr: string
  for: string
  annotations: Record<string, string>
  labels: Record<string, string>
}

export interface GrafanaDashboard {
  title: string
  panels: GrafanaPanel[]
  refresh: string
  time: { from: string; to: string }
}

export interface GrafanaPanel {
  title: string
  targets: Array<{ expr: string }>
  type: 'graph' | 'stat' | 'gauge' | 'table'
  gridPos: { x: number; y: number; w: number; h: number }
}

export class MonitoringSetup {
  generatePrometheusConfig(): PrometheusConfig {
    return {
      global: {
        scrapeInterval: '15s',
        evaluationInterval: '15s'
      },
      scrapeConfigs: [
        {
          jobName: 'qpu-api',
          staticConfigs: [{ targets: ['localhost:3000'] }],
          scrapeInterval: '10s',
          scrapeTimeout: '5s'
        },
        {
          jobName: 'qpu-kernel',
          staticConfigs: [{ targets: ['localhost:3001'] }],
          scrapeInterval: '5s',
          scrapeTimeout: '2s'
        },
        {
          jobName: 'qpu-cache',
          staticConfigs: [{ targets: ['localhost:6379'] }],
          scrapeInterval: '15s',
          scrapeTimeout: '5s'
        },
        {
          jobName: 'qpu-database',
          staticConfigs: [{ targets: ['localhost:5432'] }],
          scrapeInterval: '30s',
          scrapeTimeout: '10s'
        },
        {
          jobName: 'prometheus',
          staticConfigs: [{ targets: ['localhost:9090'] }],
          scrapeInterval: '15s',
          scrapeTimeout: '5s'
        }
      ],
      alertingRules: [
        {
          alert: 'HighCPUUsage',
          expr: 'node_cpu_seconds_total > 0.9',
          for: '5m',
          annotations: { summary: 'High CPU usage detected' },
          labels: { severity: 'warning' }
        },
        {
          alert: 'HighMemoryUsage',
          expr: 'node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes < 0.1',
          for: '5m',
          annotations: { summary: 'Low available memory' },
          labels: { severity: 'warning' }
        },
        {
          alert: 'QPUHighErrorRate',
          expr: 'rate(qpu_errors_total[5m]) > 0.01',
          for: '2m',
          annotations: { summary: 'High error rate in QPU' },
          labels: { severity: 'critical' }
        },
        {
          alert: 'QPUHighLatency',
          expr: 'histogram_quantile(0.95, qpu_latency_seconds) > 1',
          for: '3m',
          annotations: { summary: 'High latency detected' },
          labels: { severity: 'warning' }
        },
        {
          alert: 'CacheLowHitRate',
          expr: 'qpu_cache_hit_ratio < 0.7',
          for: '10m',
          annotations: { summary: 'Cache hit rate below 70%' },
          labels: { severity: 'info' }
        }
      ]
    }
  }

  generateGrafanaDashboards(): Map<string, GrafanaDashboard> {
    const dashboards = new Map<string, GrafanaDashboard>()

    // System Overview
    dashboards.set('system-overview', {
      title: 'System Overview',
      panels: [
        {
          title: 'CPU Usage',
          targets: [{ expr: 'node_cpu_seconds_total' }],
          type: 'graph',
          gridPos: { x: 0, y: 0, w: 8, h: 8 }
        },
        {
          title: 'Memory Usage',
          targets: [{ expr: 'node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes' }],
          type: 'gauge',
          gridPos: { x: 8, y: 0, w: 8, h: 8 }
        },
        {
          title: 'Disk Usage',
          targets: [{ expr: 'node_disk_used_bytes / node_disk_size_bytes' }],
          type: 'stat',
          gridPos: { x: 16, y: 0, w: 8, h: 8 }
        },
        {
          title: 'Network I/O',
          targets: [{ expr: 'rate(node_network_transmit_bytes_total[5m])' }],
          type: 'graph',
          gridPos: { x: 0, y: 8, w: 12, h: 8 }
        },
        {
          title: 'Load Average',
          targets: [{ expr: 'node_load1' }],
          type: 'graph',
          gridPos: { x: 12, y: 8, w: 12, h: 8 }
        }
      ],
      refresh: '30s',
      time: { from: 'now-1h', to: 'now' }
    })

    // QPU Performance
    dashboards.set('qpu-performance', {
      title: 'QPU Performance',
      panels: [
        {
          title: 'Requests/sec',
          targets: [{ expr: 'rate(qpu_requests_total[5m])' }],
          type: 'graph',
          gridPos: { x: 0, y: 0, w: 8, h: 8 }
        },
        {
          title: 'Latency (p95)',
          targets: [{ expr: 'histogram_quantile(0.95, qpu_latency_seconds)' }],
          type: 'gauge',
          gridPos: { x: 8, y: 0, w: 8, h: 8 }
        },
        {
          title: 'Error Rate',
          targets: [{ expr: 'rate(qpu_errors_total[5m])' }],
          type: 'stat',
          gridPos: { x: 16, y: 0, w: 8, h: 8 }
        },
        {
          title: 'Success Rate',
          targets: [{ expr: 'rate(qpu_success_total[5m])' }],
          type: 'graph',
          gridPos: { x: 0, y: 8, w: 12, h: 8 }
        },
        {
          title: 'Queue Depth',
          targets: [{ expr: 'qpu_queue_depth' }],
          type: 'gauge',
          gridPos: { x: 12, y: 8, w: 12, h: 8 }
        }
      ],
      refresh: '10s',
      time: { from: 'now-6h', to: 'now' }
    })

    // Cache Performance
    dashboards.set('cache-performance', {
      title: 'Cache Performance',
      panels: [
        {
          title: 'Hit Rate',
          targets: [{ expr: 'qpu_cache_hit_ratio' }],
          type: 'gauge',
          gridPos: { x: 0, y: 0, w: 8, h: 8 }
        },
        {
          title: 'Miss Rate',
          targets: [{ expr: '1 - qpu_cache_hit_ratio' }],
          type: 'stat',
          gridPos: { x: 8, y: 0, w: 8, h: 8 }
        },
        {
          title: 'Cache Size',
          targets: [{ expr: 'qpu_cache_size_bytes' }],
          type: 'graph',
          gridPos: { x: 16, y: 0, w: 8, h: 8 }
        },
        {
          title: 'Evictions/sec',
          targets: [{ expr: 'rate(qpu_cache_evictions_total[5m])' }],
          type: 'graph',
          gridPos: { x: 0, y: 8, w: 12, h: 8 }
        },
        {
          title: 'Access Patterns',
          targets: [{ expr: 'rate(qpu_cache_accesses_total[5m])' }],
          type: 'table',
          gridPos: { x: 12, y: 8, w: 12, h: 8 }
        }
      ],
      refresh: '15s',
      time: { from: 'now-24h', to: 'now' }
    })

    // Application Metrics
    dashboards.set('application-metrics', {
      title: 'Application Metrics',
      panels: [
        {
          title: 'Active Connections',
          targets: [{ expr: 'qpu_active_connections' }],
          type: 'graph',
          gridPos: { x: 0, y: 0, w: 8, h: 8 }
        },
        {
          title: 'Goroutines',
          targets: [{ expr: 'process_goroutines' }],
          type: 'stat',
          gridPos: { x: 8, y: 0, w: 8, h: 8 }
        },
        {
          title: 'Memory (bytes)',
          targets: [{ expr: 'process_resident_memory_bytes' }],
          type: 'gauge',
          gridPos: { x: 16, y: 0, w: 8, h: 8 }
        },
        {
          title: 'GC Pause Time',
          targets: [{ expr: 'histogram_quantile(0.99, gc_pause_duration_seconds)' }],
          type: 'graph',
          gridPos: { x: 0, y: 8, w: 12, h: 8 }
        },
        {
          title: 'Request Distribution',
          targets: [{ expr: 'qpu_requests_by_domain' }],
          type: 'table',
          gridPos: { x: 12, y: 8, w: 12, h: 8 }
        }
      ],
      refresh: '20s',
      time: { from: 'now-12h', to: 'now' }
    })

    return dashboards
  }

  generateAlertingRules(): string {
    const rules = `
groups:
  - name: qpu.rules
    interval: 30s
    rules:
      - alert: HighCPUUsage
        expr: node_cpu_seconds_total > 0.9
        for: 5m
        annotations:
          summary: "High CPU usage detected on {{ $labels.instance }}"
          description: "CPU is above 90% for the last 5 minutes"
        labels:
          severity: warning

      - alert: HighMemoryUsage
        expr: |
          (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) /
          node_memory_MemTotal_bytes > 0.95
        for: 5m
        annotations:
          summary: "High memory usage"
          description: "Memory is above 95% for the last 5 minutes"
        labels:
          severity: critical

      - alert: QPUHighErrorRate
        expr: rate(qpu_errors_total[5m]) > 0.01
        for: 2m
        annotations:
          summary: "High error rate in QPU"
          description: "Error rate is above 1% for the last 2 minutes"
        labels:
          severity: critical

      - alert: QPUHighLatency
        expr: histogram_quantile(0.95, qpu_latency_seconds) > 1
        for: 3m
        annotations:
          summary: "High latency detected"
          description: "p95 latency is above 1 second"
        labels:
          severity: warning

      - alert: CacheLowHitRate
        expr: qpu_cache_hit_ratio < 0.7
        for: 10m
        annotations:
          summary: "Cache hit rate below 70%"
          description: "Cache efficiency is degrading"
        labels:
          severity: info

      - alert: DatabaseConnectionPoolExhausted
        expr: qpu_db_connections_used / qpu_db_connections_max > 0.9
        for: 2m
        annotations:
          summary: "Database connection pool nearly exhausted"
          description: "Using more than 90% of available connections"
        labels:
          severity: warning

      - alert: QueueDepthHigh
        expr: qpu_queue_depth > 10000
        for: 5m
        annotations:
          summary: "Queue depth very high"
          description: "Queue has more than 10K items pending"
        labels:
          severity: warning

      - alert: ServiceDown
        expr: up{job="qpu-api"} == 0
        for: 1m
        annotations:
          summary: "QPU API service is down"
          description: "Service has been unreachable for 1 minute"
        labels:
          severity: critical
    `
    return rules
  }

  toYAML(): string {
    const config = this.generatePrometheusConfig()
    return JSON.stringify(config, null, 2)
  }
}

export const monitoringSetup = new MonitoringSetup()
