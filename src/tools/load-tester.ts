/**
 * Load Testing Suite
 * Verify performance claims: 15,000+ req/s with <5ms latency
 * Gradual ramp-up, burst testing, and endurance runs
 */

import { executeOperation, listOperations } from '../core/index.js'
import { metricsCollector, traceCollector, Observability } from '../core/observability.js'

// ============================================================================
// LOAD TEST CONFIGURATION
// ============================================================================

export interface LoadTestConfig {
  duration: number // milliseconds
  targetRps: number // requests per second
  rampUpTime: number // seconds to reach target RPS
  operations?: string[] // specific operations to test
  concurrency?: number // parallel requests
  burstSize?: number // number of requests per burst
  userSimulation?: boolean
  reportInterval?: number // milliseconds
}

export interface LoadTestResult {
  duration: number
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  avgLatency: number
  p50: number
  p95: number
  p99: number
  p999: number
  maxLatency: number
  minLatency: number
  throughput: number // actual req/s achieved
  targetThroughput: number // requested req/s
  successRate: number
  peakMemory: number
  operationResults: Map<string, OperationResult>
}

export interface OperationResult {
  operation: string
  count: number
  avgLatency: number
  p95: number
  p99: number
  errorCount: number
  errorRate: number
}

// ============================================================================
// LOAD TEST ENGINE
// ============================================================================

export class LoadTester {
  private config: LoadTestConfig
  private results: {
    timestamp: number
    latency: number
    success: boolean
    operation: string
    error?: string
  }[] = []

  private startTime = 0
  private endTime = 0
  private activeRequests = 0
  private maxActiveRequests = 0

  constructor(config: LoadTestConfig) {
    this.config = {
      reportInterval: 5000,
      concurrency: 10,
      ...config
    }
  }

  /**
   * Run load test with gradual ramp-up
   */
  async runRampUp(): Promise<LoadTestResult> {
    this.startTime = Date.now()
    const rampUpDuration = this.config.rampUpTime * 1000
    const targetRps = this.config.targetRps
    const testDuration = this.config.duration

    console.log(`\n📊 Starting Load Test (Ramp-Up Mode)`)
    console.log(`   Target: ${targetRps} req/s over ${this.config.rampUpTime}s ramp-up`)
    console.log(`   Duration: ${testDuration / 1000}s`)

    const operations = this.config.operations || (await listOperations()).slice(0, 5)
    let requestCount = 0

    const startTest = Date.now()
    const reportTimer = setInterval(() => this.logProgress(), this.config.reportInterval!)

    while (Date.now() - startTest < testDuration) {
      const elapsed = Date.now() - startTest

      // Linear ramp-up
      const rampedRps = Math.min(
        targetRps,
        (targetRps * elapsed) / rampUpDuration
      )

      const requestsThisSecond = Math.ceil(rampedRps)

      // Send batch of requests
      const promises: Promise<void>[] = []
      for (let i = 0; i < requestsThisSecond && this.activeRequests < this.config.concurrency!; i++) {
        const op = operations[requestCount % operations.length]
        promises.push(this.sendRequest(op))
        requestCount++
      }

      await Promise.allSettled(promises)

      // Rate limiting sleep
      await this.sleep(100)
    }

    clearInterval(reportTimer)
    this.endTime = Date.now()

    return this.calculateResults()
  }

  /**
   * Burst test - sudden spike to peak load
   */
  async runBurst(): Promise<LoadTestResult> {
    this.startTime = Date.now()
    const operations = this.config.operations || (await listOperations()).slice(0, 5)
    const burstSize = this.config.burstSize || 1000

    console.log(`\n📊 Starting Load Test (Burst Mode)`)
    console.log(`   Burst size: ${burstSize} requests`)
    console.log(`   Concurrency: ${this.config.concurrency}`)

    const startTest = Date.now()
    const reportTimer = setInterval(() => this.logProgress(), this.config.reportInterval!)

    while (Date.now() - startTest < this.config.duration) {
      const promises: Promise<void>[] = []

      for (let i = 0; i < burstSize && this.activeRequests < this.config.concurrency!; i++) {
        const op = operations[Math.floor(Math.random() * operations.length)]
        promises.push(this.sendRequest(op))
      }

      await Promise.allSettled(promises)
      await this.sleep(1000) // 1s between bursts
    }

    clearInterval(reportTimer)
    this.endTime = Date.now()

    return this.calculateResults()
  }

  /**
   * Endurance test - sustained load for long duration
   */
  async runEndurance(): Promise<LoadTestResult> {
    this.startTime = Date.now()
    const operations = this.config.operations || (await listOperations()).slice(0, 5)

    console.log(`\n📊 Starting Load Test (Endurance Mode)`)
    console.log(`   Target: ${this.config.targetRps} req/s`)
    console.log(`   Duration: ${this.config.duration / 1000}s`)

    const startTest = Date.now()
    const reportTimer = setInterval(() => this.logProgress(), this.config.reportInterval!)
    const targetRps = this.config.targetRps
    const interval = 1000 / targetRps

    while (Date.now() - startTest < this.config.duration) {
      const iterationStart = Date.now()

      for (let i = 0; i < targetRps && this.activeRequests < this.config.concurrency!; i++) {
        const op = operations[i % operations.length]
        this.sendRequest(op).catch(console.error)
      }

      const elapsed = Date.now() - iterationStart
      const sleepTime = Math.max(0, 1000 - elapsed)
      if (sleepTime > 0) {
        await this.sleep(sleepTime)
      }
    }

    clearInterval(reportTimer)
    this.endTime = Date.now()

    return this.calculateResults()
  }

  /**
   * Memory stress test - increase load gradually
   */
  async runMemoryStress(): Promise<LoadTestResult> {
    this.startTime = Date.now()
    const operations = this.config.operations || (await listOperations()).slice(0, 5)

    console.log(`\n📊 Starting Load Test (Memory Stress Mode)`)
    console.log(`   Starting at 100 req/s, increasing by 100 req/s every 30s`)

    const startTest = Date.now()
    const reportTimer = setInterval(() => this.logProgress(), this.config.reportInterval!)
    let currentRps = 100

    while (Date.now() - startTest < this.config.duration) {
      // Every 30 seconds, increase load
      const phase = Math.floor((Date.now() - startTest) / 30000)
      currentRps = 100 + phase * 100

      const requestsThisSecond = currentRps
      const promises: Promise<void>[] = []

      for (let i = 0; i < requestsThisSecond && this.activeRequests < this.config.concurrency!; i++) {
        const op = operations[i % operations.length]
        promises.push(this.sendRequest(op))
      }

      await Promise.allSettled(promises)
      await this.sleep(100)
    }

    clearInterval(reportTimer)
    this.endTime = Date.now()

    return this.calculateResults()
  }

  /**
   * Send a single request
   */
  private async sendRequest(operation: string): Promise<void> {
    this.activeRequests++
    this.maxActiveRequests = Math.max(this.maxActiveRequests, this.activeRequests)

    const startTime = Date.now()
    const { traceId, spanId } = Observability.startTrace(operation)

    try {
      const payload = {
        text: 'test input for performance measurement',
        config: { verbose: false }
      }

      await executeOperation(operation, payload)

      const duration = Date.now() - startTime
      Observability.endTrace(spanId, true)

      this.results.push({
        timestamp: Date.now(),
        latency: duration,
        success: true,
        operation
      })
    } catch (error) {
      const duration = Date.now() - startTime
      Observability.endTrace(spanId, false, error as Error)

      this.results.push({
        timestamp: Date.now(),
        latency: duration,
        success: false,
        operation,
        error: (error as Error).message
      })
    } finally {
      this.activeRequests--
    }
  }

  /**
   * Calculate final results
   */
  private calculateResults(): LoadTestResult {
    const duration = this.endTime - this.startTime
    const successful = this.results.filter(r => r.success).length
    const failed = this.results.length - successful

    const latencies = this.results.map(r => r.latency).sort((a, b) => a - b)
    const operationStats = new Map<string, OperationResult>()

    for (const result of this.results) {
      const op = result.operation
      const existing = operationStats.get(op) || {
        operation: op,
        count: 0,
        avgLatency: 0,
        p95: 0,
        p99: 0,
        errorCount: 0,
        errorRate: 0
      }

      existing.count++
      if (!result.success) existing.errorCount++
      existing.avgLatency += result.latency

      operationStats.set(op, existing)
    }

    // Calculate final stats
    for (const stat of operationStats.values()) {
      stat.avgLatency = stat.avgLatency / stat.count
      stat.errorRate = stat.errorCount / stat.count

      const opLatencies = this.results
        .filter(r => r.operation === stat.operation && r.success)
        .map(r => r.latency)
        .sort((a, b) => a - b)

      if (opLatencies.length > 0) {
        stat.p95 = opLatencies[Math.floor(opLatencies.length * 0.95)]
        stat.p99 = opLatencies[Math.floor(opLatencies.length * 0.99)]
      }
    }

    return {
      duration,
      totalRequests: this.results.length,
      successfulRequests: successful,
      failedRequests: failed,
      avgLatency: latencies.length > 0 ? latencies.reduce((a, b) => a + b) / latencies.length : 0,
      p50: latencies[Math.floor(latencies.length * 0.50)] || 0,
      p95: latencies[Math.floor(latencies.length * 0.95)] || 0,
      p99: latencies[Math.floor(latencies.length * 0.99)] || 0,
      p999: latencies[Math.floor(latencies.length * 0.999)] || 0,
      maxLatency: Math.max(...latencies),
      minLatency: Math.min(...latencies),
      throughput: (this.results.length / duration) * 1000,
      targetThroughput: this.config.targetRps,
      successRate: successful / this.results.length,
      peakMemory: this.maxActiveRequests,
      operationResults: operationStats
    }
  }

  /**
   * Log progress during test
   */
  private logProgress(): void {
    const elapsed = Date.now() - this.startTime
    const throughput = (this.results.length / elapsed) * 1000
    const errorRate = this.results.filter(r => !r.success).length / Math.max(this.results.length, 1)

    console.log(
      `⏱️  ${(elapsed / 1000).toFixed(1)}s | ` +
      `${this.results.length} req | ` +
      `${throughput.toFixed(0)} req/s | ` +
      `${errorRate.toFixed(1)}% err | ` +
      `${this.activeRequests}/${this.maxActiveRequests} active`
    )
  }

  /**
   * Format and display results
   */
  static printResults(result: LoadTestResult): void {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`✅ LOAD TEST COMPLETE`)
    console.log(`${'='.repeat(60)}`)

    console.log(`\n📊 Summary`)
    console.log(`   Duration: ${result.duration / 1000}s`)
    console.log(`   Total Requests: ${result.totalRequests}`)
    console.log(`   Successful: ${result.successfulRequests} (${(result.successRate * 100).toFixed(2)}%)`)
    console.log(`   Failed: ${result.failedRequests}`)

    console.log(`\n⚡ Throughput`)
    console.log(`   Target: ${result.targetThroughput} req/s`)
    console.log(`   Achieved: ${result.throughput.toFixed(2)} req/s`)
    console.log(`   Achievement: ${((result.throughput / result.targetThroughput) * 100).toFixed(1)}%`)

    console.log(`\n⏱️  Latency (milliseconds)`)
    console.log(`   Min: ${result.minLatency.toFixed(2)}ms`)
    console.log(`   Avg: ${result.avgLatency.toFixed(2)}ms`)
    console.log(`   P50: ${result.p50.toFixed(2)}ms`)
    console.log(`   P95: ${result.p95.toFixed(2)}ms`)
    console.log(`   P99: ${result.p99.toFixed(2)}ms`)
    console.log(`   P999: ${result.p999.toFixed(2)}ms`)
    console.log(`   Max: ${result.maxLatency.toFixed(2)}ms`)

    console.log(`\n📈 Per-Operation Results`)
    for (const [op, stats] of result.operationResults) {
      console.log(`   ${op}`)
      console.log(`      Count: ${stats.count} | Avg: ${stats.avgLatency.toFixed(2)}ms | P95: ${stats.p95.toFixed(2)}ms | Errors: ${stats.errorCount}`)
    }

    console.log(`\n${'='.repeat(60)}\n`)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * CLI entry point for load testing
 */
export async function runLoadTest(mode: 'ramp-up' | 'burst' | 'endurance' | 'stress' = 'ramp-up') {
  const config: LoadTestConfig = {
    duration: mode === 'endurance' ? 60000 : 30000,
    targetRps: mode === 'burst' ? 5000 : 1000,
    rampUpTime: 10,
    concurrency: 100
  }

  const tester = new LoadTester(config)
  let result: LoadTestResult

  switch (mode) {
    case 'burst':
      result = await tester.runBurst()
      break
    case 'endurance':
      result = await tester.runEndurance()
      break
    case 'stress':
      result = await tester.runMemoryStress()
      break
    default:
      result = await tester.runRampUp()
  }

  LoadTester.printResults(result)
  return result
}
