/**
 * Performance Benchmarker - Latency testing, throughput measurement, scalability analysis
 */

export interface BenchmarkResult {
  name: string
  duration: number // milliseconds
  samples: number
  min: number
  max: number
  mean: number
  median: number
  p95: number
  p99: number
  stdDev: number
  throughput: number // operations per second
}

export interface LoadTest {
  id: string
  name: string
  concurrency: number
  duration: number // seconds
  rampUp: number // seconds
  results: BenchmarkResult
  timestamp: Date
}

export interface ScalabilityAnalysis {
  metric: string
  scalability: 'linear' | 'sub-linear' | 'super-linear'
  measurements: Array<{ concurrency: number; responseTime: number }>
  estimation: {
    at1000: number
    at10000: number
    at100000: number
  }
}

export class PerformanceBenchmarker {
  private results: Map<string, BenchmarkResult> = new Map()
  private loadTests: Map<string, LoadTest> = new Map()
  private baselines: Map<string, number> = new Map()

  setBaseline(name: string, value: number): void {
    this.baselines.set(name, value)
  }

  benchmark(name: string, fn: () => void, iterations: number = 1000): BenchmarkResult {
    const samples: number[] = []

    // Warmup
    for (let i = 0; i < 10; i++) {
      fn()
    }

    // Actual measurement
    for (let i = 0; i < iterations; i++) {
      const start = performance.now()
      fn()
      const end = performance.now()
      samples.push(end - start)
    }

    samples.sort((a, b) => a - b)

    const min = samples[0]
    const max = samples[samples.length - 1]
    const mean = samples.reduce((a, b) => a + b) / samples.length
    const median = samples[Math.floor(samples.length / 2)]
    const p95 = samples[Math.floor(samples.length * 0.95)]
    const p99 = samples[Math.floor(samples.length * 0.99)]

    const variance = samples.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / samples.length
    const stdDev = Math.sqrt(variance)
    const throughput = 1000 / mean // ops per second

    const result: BenchmarkResult = {
      name,
      duration: mean,
      samples: samples.length,
      min,
      max,
      mean,
      median,
      p95,
      p99,
      stdDev,
      throughput
    }

    this.results.set(name, result)
    return result
  }

  async loadTest(
    name: string,
    fn: () => Promise<void>,
    concurrency: number,
    duration: number,
    rampUp: number = 0
  ): Promise<LoadTest> {
    const startTime = Date.now()
    const endTime = startTime + duration * 1000
    let totalRequests = 0
    let totalTime = 0

    // Ramp up phase
    const rampUpEndTime = startTime + rampUp * 1000
    let currentConcurrency = 1

    const promises: Promise<void>[] = []

    while (Date.now() < endTime) {
      // Adjust concurrency during ramp up
      if (Date.now() < rampUpEndTime && rampUp > 0) {
        const progress = (Date.now() - startTime) / (rampUp * 1000)
        currentConcurrency = Math.ceil(1 + (concurrency - 1) * progress)
      } else {
        currentConcurrency = concurrency
      }

      // Spawn workers up to current concurrency
      while (promises.length < currentConcurrency) {
        promises.push(
          (async () => {
            while (Date.now() < endTime) {
              const start = performance.now()
              await fn()
              const end = performance.now()
              totalTime += end - start
              totalRequests++
            }
          })()
        )
      }

      await new Promise(resolve => setTimeout(resolve, 100))
    }

    await Promise.all(promises)

    const test: LoadTest = {
      id: `loadtest-${Date.now()}`,
      name,
      concurrency,
      duration,
      rampUp,
      results: {
        name,
        duration: totalTime / totalRequests,
        samples: totalRequests,
        min: 0,
        max: 0,
        mean: totalTime / totalRequests,
        median: totalTime / totalRequests,
        p95: 0,
        p99: 0,
        stdDev: 0,
        throughput: totalRequests / (duration)
      },
      timestamp: new Date()
    }

    this.loadTests.set(test.id, test)
    return test
  }

  analyzeScalability(
    metric: string,
    measurements: Array<{ concurrency: number; responseTime: number }>
  ): ScalabilityAnalysis {
    // Analyze if response time grows linearly, sub-linearly, or super-linearly with concurrency

    const sorted = [...measurements].sort((a, b) => a.concurrency - b.concurrency)

    // Calculate ratios
    const ratios: number[] = []
    for (let i = 1; i < sorted.length; i++) {
      const timeRatio = sorted[i].responseTime / sorted[i - 1].responseTime
      const concurrencyRatio = sorted[i].concurrency / sorted[i - 1].concurrency
      ratios.push(timeRatio / concurrencyRatio)
    }

    const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length

    let scalability: 'linear' | 'sub-linear' | 'super-linear'
    if (avgRatio < 0.8) {
      scalability = 'sub-linear' // Better than linear
    } else if (avgRatio > 1.2) {
      scalability = 'super-linear' // Worse than linear
    } else {
      scalability = 'linear'
    }

    // Extrapolate to higher concurrency
    const regression = this.linearRegression(
      sorted.map(m => m.concurrency),
      sorted.map(m => m.responseTime)
    )

    return {
      metric,
      scalability,
      measurements: sorted,
      estimation: {
        at1000: regression.a * 1000 + regression.b,
        at10000: regression.a * 10000 + regression.b,
        at100000: regression.a * 100000 + regression.b
      }
    }
  }

  private linearRegression(x: number[], y: number[]): { a: number; b: number } {
    const n = x.length
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)

    const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const b = (sumY - a * sumX) / n

    return { a, b }
  }

  compareWithBaseline(name: string, result: BenchmarkResult): {
    regression: boolean
    percentChange: number
    message: string
  } {
    const baseline = this.baselines.get(name)
    if (!baseline) {
      return {
        regression: false,
        percentChange: 0,
        message: 'No baseline established'
      }
    }

    const percentChange = ((result.mean - baseline) / baseline) * 100
    const regression = percentChange > 10 // More than 10% slower is a regression

    return {
      regression,
      percentChange,
      message: regression
        ? `REGRESSION: ${percentChange.toFixed(1)}% slower than baseline`
        : `OK: ${percentChange.toFixed(1)}% vs baseline`
    }
  }

  generateReport(): {
    benchmarks: BenchmarkResult[]
    loadTests: LoadTest[]
    scalabilityAnalysis: ScalabilityAnalysis[]
    summary: string
  } {
    const benchmarks = Array.from(this.results.values())
    const loadTests = Array.from(this.loadTests.values())

    const avgThroughput = benchmarks.length > 0
      ? benchmarks.reduce((sum, b) => sum + b.throughput, 0) / benchmarks.length
      : 0

    const summary = `
Performance Report:
- Benchmarks: ${benchmarks.length}
- Load Tests: ${loadTests.length}
- Average Throughput: ${avgThroughput.toFixed(0)} ops/sec
- Min Latency: ${Math.min(...benchmarks.map(b => b.min)).toFixed(2)}ms
- Max Latency: ${Math.max(...benchmarks.map(b => b.max)).toFixed(2)}ms
`

    return {
      benchmarks,
      loadTests,
      scalabilityAnalysis: [],
      summary: summary.trim()
    }
  }
}

export const performanceBenchmarker = new PerformanceBenchmarker()
