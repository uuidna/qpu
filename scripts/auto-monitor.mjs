#!/usr/bin/env node
/** Auto-Monitor - Continuous system health and performance tracking */

import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dir = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dir, '..')

class HealthMonitor {
  constructor(interval = 5000) {
    this.interval = interval
    this.history = []
    this.maxHistory = 100
    this.alerts = []
    this.running = false
  }

  async checkHealth() {
    const metrics = {
      timestamp: Date.now(),
      iso: new Date().toISOString(),
      checks: {},
    }

    // Check API health
    metrics.checks.api = await this.checkEndpoint('http://localhost:3000/health')

    // Check metrics
    metrics.checks.metrics = await this.checkEndpoint('http://localhost:3000/metrics')

    // System resource usage
    try {
      const os = await import('os')
      metrics.checks.memory = {
        status: 'ok',
        usage: process.memoryUsage(),
        systemTotal: os.totalmem(),
        systemFree: os.freemem(),
      }
    } catch {}

    // Performance
    metrics.checks.performance = {
      uptime: process.uptime(),
      nodeVersion: process.version,
    }

    return metrics
  }

  async checkEndpoint(url) {
    return new Promise(resolve => {
      const start = Date.now()
      const req = http.get(url, { timeout: 5000 }, (res) => {
        const duration = Date.now() - start
        res.on('data', () => {})
        res.on('end', () => {
          resolve({
            status: res.statusCode === 200 ? 'ok' : 'error',
            statusCode: res.statusCode,
            latency: duration,
            timestamp: Date.now(),
          })
        })
      })

      req.on('timeout', () => {
        req.destroy()
        resolve({
          status: 'timeout',
          latency: 5000,
          timestamp: Date.now(),
        })
      })

      req.on('error', (err) => {
        resolve({
          status: 'error',
          error: err.message,
          timestamp: Date.now(),
        })
      })
    })
  }

  detectAnomalies(metrics) {
    const checks = []

    // API health
    if (metrics.checks.api.status !== 'ok') {
      checks.push({
        severity: 'critical',
        message: `API health check failed: ${metrics.checks.api.status}`,
        check: 'api',
      })
    }

    // High latency
    if (metrics.checks.api.latency > 1000) {
      checks.push({
        severity: 'warning',
        message: `High API latency: ${metrics.checks.api.latency}ms`,
        check: 'latency',
      })
    }

    // Memory usage
    if (metrics.checks.memory) {
      const heapUsedPercent = metrics.checks.memory.usage.heapUsed / metrics.checks.memory.usage.heapTotal
      if (heapUsedPercent > 0.9) {
        checks.push({
          severity: 'warning',
          message: `High heap memory usage: ${(heapUsedPercent * 100).toFixed(1)}%`,
          check: 'memory',
        })
      }
    }

    return checks
  }

  recordMetrics(metrics, anomalies) {
    this.history.push({
      metrics,
      anomalies,
      recordedAt: Date.now(),
    })

    if (this.history.length > this.maxHistory) {
      this.history.shift()
    }

    this.alerts.push(...anomalies)
  }

  printStatus(metrics, anomalies) {
    const api = metrics.checks.api
    const apiStatus = api.status === 'ok' ? '✅' : '❌'
    const latency = api.latency ? `${api.latency}ms` : 'N/A'

    console.log(`[${metrics.iso}] API: ${apiStatus} ${latency}`, end = '')

    if (anomalies.length > 0) {
      console.log(` ⚠️ ${anomalies.length} alert(s)`)
      anomalies.forEach(a => {
        console.log(`    [${a.severity.toUpperCase()}] ${a.message}`)
      })
    } else {
      console.log(' ✅')
    }
  }

  saveSnapshot() {
    const snapshot = {
      timestamp: Date.now(),
      iso: new Date().toISOString(),
      history: this.history.slice(-10),
      recentAlerts: this.alerts.slice(-20),
      uptime: process.uptime(),
      totalRequests: this.history.length,
    }

    const file = path.join(ROOT, '.monitor-snapshot.json')
    fs.writeFileSync(file, JSON.stringify(snapshot, null, 2))
  }

  async start() {
    this.running = true
    console.log('🤖 Health Monitor started (interval: ' + (this.interval / 1000) + 's)\n')

    while (this.running) {
      const metrics = await this.checkHealth()
      const anomalies = this.detectAnomalies(metrics)

      this.recordMetrics(metrics, anomalies)
      this.printStatus(metrics, anomalies)
      this.saveSnapshot()

      await new Promise(resolve => setTimeout(resolve, this.interval))
    }
  }

  stop() {
    this.running = false
    console.log('\n🛑 Health Monitor stopped')
  }

  report() {
    const totalChecks = this.history.length
    const healthyChecks = this.history.filter(h => h.metrics.checks.api.status === 'ok').length
    const healthPercent = totalChecks > 0 ? ((healthyChecks / totalChecks) * 100).toFixed(1) : 0

    const avgLatency = this.history.length > 0
      ? (this.history.reduce((sum, h) => sum + (h.metrics.checks.api.latency || 0), 0) / this.history.length).toFixed(0)
      : 0

    console.log('\n' + '═'.repeat(60))
    console.log('📊 HEALTH REPORT')
    console.log('═'.repeat(60))
    console.log(`Health Score: ${healthPercent}%`)
    console.log(`Average Latency: ${avgLatency}ms`)
    console.log(`Total Checks: ${totalChecks}`)
    console.log(`Recent Alerts: ${this.alerts.slice(-5).length}`)
    console.log('═'.repeat(60) + '\n')
  }
}

// Run monitor (10 checks then report)
if (process.argv[2] === '--test') {
  // Test mode: 10 checks then exit
  const monitor = new HealthMonitor(1000)
  let count = 0

  const testInterval = setInterval(async () => {
    const metrics = await monitor.checkHealth()
    const anomalies = monitor.detectAnomalies(metrics)
    monitor.recordMetrics(metrics, anomalies)
    monitor.printStatus(metrics, anomalies)

    count++
    if (count >= 10) {
      clearInterval(testInterval)
      monitor.report()
      process.exit(0)
    }
  }, monitor.interval)
} else {
  // Continuous monitoring
  const monitor = new HealthMonitor(5000)

  process.on('SIGINT', () => {
    monitor.report()
    process.exit(0)
  })

  await monitor.start()
}
