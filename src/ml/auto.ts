/**
 * ML Utilities - Minimal, DRY
 * Anomaly detection, auto-scaling, cost optimization
 */

interface Point {
  val: number
  ts: number
}

interface Anomaly {
  ts: number
  val: number
  z: number
  anomalous: boolean
}

interface Scale {
  current: number
  target: number
  change: number
}

// ============================================================================
// ANOMALY DETECTOR (Z-Score)
// ============================================================================

export class Anomaly_ {
  private window: Point[] = []
  private size = 100
  private threshold = 3

  record(val: number): void {
    this.window.push({ val, ts: Date.now() })
    if (this.window.length > this.size) {
      this.window.shift()
    }
  }

  // BOOLEAN QUESTIONS

  isAnomaly(val: number): boolean {
    return Math.abs(this.zscore(val)) > this.threshold
  }

  hasPattern(pattern: 'spike' | 'drop' | 'drift'): boolean {
    if (this.window.length < 10) return false

    const recent = this.window.slice(-10)
    const vals = recent.map(p => p.val)
    const mean = vals.reduce((a, b) => a + b) / vals.length

    switch (pattern) {
      case 'spike':
        return vals.some(v => v > mean * 1.5)
      case 'drop':
        return vals.some(v => v < mean * 0.5)
      case 'drift':
        const first = vals.slice(0, 5).reduce((a, b) => a + b) / 5
        const last = vals.slice(5).reduce((a, b) => a + b) / 5
        return Math.abs(last - first) > mean * 0.3
    }
  }

  // ANALYSIS

  analyze(val: number): Anomaly {
    const z = this.zscore(val)
    return {
      ts: Date.now(),
      val,
      z,
      anomalous: Math.abs(z) > this.threshold
    }
  }

  private zscore(val: number): number {
    if (this.window.length === 0) return 0
    const vals = this.window.map(p => p.val)
    const mean = vals.reduce((a, b) => a + b) / vals.length
    const std = Math.sqrt(
      vals.reduce((a, v) => a + Math.pow(v - mean, 2), 0) / vals.length
    )
    return std === 0 ? 0 : (val - mean) / std
  }

  setThreshold(z: number): void {
    this.threshold = z
  }
}

// ============================================================================
// AUTO SCALER
// ============================================================================

export class AutoScale {
  private target = 50
  private min = 1
  private max = 100
  private current = 10

  // BOOLEAN QUESTIONS

  shouldScaleUp(metric: number): boolean {
    return metric > this.target * 0.8
  }

  shouldScaleDown(metric: number): boolean {
    return metric < this.target * 0.2 && this.current > this.min
  }

  isAtCapacity(): boolean {
    return this.current >= this.max
  }

  // SCALING

  decide(metric: number, trend?: 'up' | 'down'): Scale {
    let target = this.current

    if (this.shouldScaleUp(metric)) {
      target = Math.min(this.max, this.current + 1)
      if (trend === 'up') target = Math.min(this.max, this.current + 2)
    } else if (this.shouldScaleDown(metric)) {
      target = Math.max(this.min, this.current - 1)
    }

    const change = target - this.current
    this.current = target

    return { current: this.current, target, change }
  }

  setCurrent(n: number): void {
    this.current = Math.max(this.min, Math.min(this.max, n))
  }

  setTarget(n: number): void {
    this.target = n
  }

  setLimits(min: number, max: number): void {
    this.min = min
    this.max = max
    this.current = Math.max(min, Math.min(max, this.current))
  }

  stats() {
    return { current: this.current, target: this.target, min: this.min, max: this.max }
  }
}

// ============================================================================
// COST OPTIMIZER
// ============================================================================

export class CostOpt {
  private baseline = 1000
  private costs: Point[] = []

  record(cost: number): void {
    this.costs.push({ val: cost, ts: Date.now() })
  }

  // BOOLEAN QUESTIONS

  isOverBudget(budget: number): boolean {
    const avg = this.avgCost()
    return avg > budget
  }

  canOptimize(): boolean {
    return this.costs.length > 10
  }

  // OPTIMIZATION

  avgCost(): number {
    if (this.costs.length === 0) return 0
    return this.costs.reduce((a, p) => a + p.val, 0) / this.costs.length
  }

  savings(current: number): number {
    const avg = this.avgCost()
    return Math.max(0, (avg - current) / avg)
  }

  recommend(budget: number): { action: string; potential: number } {
    const avg = this.avgCost()
    const ratio = avg / budget

    if (ratio > 1.5) {
      return { action: 'reduce-by-30%', potential: avg * 0.3 }
    } else if (ratio > 1.2) {
      return { action: 'reduce-by-20%', potential: avg * 0.2 }
    } else if (ratio > 1.0) {
      return { action: 'reduce-by-10%', potential: avg * 0.1 }
    } else {
      return { action: 'optimize-efficiency', potential: avg * 0.05 }
    }
  }

  trend(): 'increasing' | 'stable' | 'decreasing' {
    if (this.costs.length < 5) return 'stable'
    const recent = this.costs.slice(-5).map(p => p.val)
    const avg1 = recent.slice(0, 2).reduce((a, b) => a + b) / 2
    const avg2 = recent.slice(3).reduce((a, b) => a + b) / 2
    const change = (avg2 - avg1) / avg1

    if (change > 0.1) return 'increasing'
    if (change < -0.1) return 'decreasing'
    return 'stable'
  }
}

// ============================================================================
// SINGLETONS
// ============================================================================

export const anomaly = new Anomaly_()
export const autoScale = new AutoScale()
export const costOpt = new CostOpt()
