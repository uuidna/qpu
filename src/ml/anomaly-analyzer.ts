/**
 * Anomaly Root Cause Analyzer - Identify causes of performance degradation
 * Uses multiple data sources to correlate anomalies with causes
 */

import { anomalyDetector } from '../core/observability.js'

// ============================================================================
// ANOMALY ANALYSIS MODELS
// ============================================================================

export type RootCauseType =
  | 'resource-exhaustion'
  | 'database-overload'
  | 'external-api-latency'
  | 'deployment'
  | 'traffic-spike'
  | 'cache-miss'
  | 'network-issue'
  | 'configuration-change'
  | 'third-party-issue'
  | 'unknown'

export interface RootCauseAnalysis {
  anomalyId: string
  anomalies: Array<{ type: string; value: number; threshold: number }>
  rootCauses: Array<{
    cause: RootCauseType
    confidence: number // 0-1
    evidence: string[]
    suggestedFix?: string
  }>
  affectedServices: string[]
  startTime: number
  endTime?: number
  duration: number
  impact: {
    usersAffected: number
    operationsAffected: number
    revenueImpact: number
  }
  timeline: Array<{ timestamp: number; event: string }>
}

export interface SystemSignal {
  timestamp: number
  source: string // 'metric', 'log', 'config', 'deployment', 'external'
  type: string
  value: unknown
  severity: 'info' | 'warning' | 'critical'
}

export interface CorrelationAnalysis {
  signals: SystemSignal[]
  correlationScore: number // 0-1
  potentialCause: RootCauseType
  confidence: number
}

// ============================================================================
// ANOMALY ANALYZER
// ============================================================================

export class AnomalyAnalyzer {
  private signalHistory: SystemSignal[] = []
  private analysisCache = new Map<string, RootCauseAnalysis>()
  private knownPatterns = new Map<RootCauseType, RegExp[]>()

  constructor() {
    this.initializePatterns()
  }

  /**
   * Initialize known cause patterns
   */
  private initializePatterns(): void {
    // Resource exhaustion patterns
    this.knownPatterns.set('resource-exhaustion', [
      /memory.*allocation.*exceeded/i,
      /cpu.*usage.*high/i,
      /connection.*pool.*exhausted/i,
      /file.*descriptor.*limit/i,
      /out.*of.*memory/i
    ])

    // Database overload patterns
    this.knownPatterns.set('database-overload', [
      /database.*slow/i,
      /query.*timeout/i,
      /connection.*timeout/i,
      /deadlock.*detected/i,
      /lock.*timeout/i
    ])

    // External API latency
    this.knownPatterns.set('external-api-latency', [
      /external.*api.*slow/i,
      /third.*party.*service.*timeout/i,
      /remote.*service.*unavailable/i
    ])

    // Deployment issues
    this.knownPatterns.set('deployment', [
      /deployment.*in.*progress/i,
      /rolling.*update/i,
      /version.*mismatch/i,
      /config.*reload/i
    ])

    // Traffic spike
    this.knownPatterns.set('traffic-spike', [
      /request.*rate.*spike/i,
      /throughput.*exceeded/i,
      /viral.*traffic/i
    ])

    // Cache miss
    this.knownPatterns.set('cache-miss', [
      /cache.*hit.*rate.*low/i,
      /cache.*evicted/i,
      /cache.*miss.*rate.*high/i
    ])

    // Network issues
    this.knownPatterns.set('network-issue', [
      /network.*latency/i,
      /packet.*loss/i,
      /bandwidth.*saturated/i
    ])
  }

  /**
   * Analyze anomalies to find root causes
   */
  async analyze(anomalyId: string): Promise<RootCauseAnalysis> {
    // Check cache
    if (this.analysisCache.has(anomalyId)) {
      return this.analysisCache.get(anomalyId)!
    }

    const recentAnomalies = anomalyDetector.getAnomalies()
    const targetAnomaly = recentAnomalies.find(a => a.timestamp.toString() === anomalyId)

    if (!targetAnomaly) {
      throw new Error(`Anomaly not found: ${anomalyId}`)
    }

    // Collect signals around anomaly time
    const signals = this.collectSignals(targetAnomaly.timestamp)

    // Perform correlation analysis
    const correlations = await this.correlateSignals(signals, targetAnomaly)

    // Build root cause analysis
    const analysis: RootCauseAnalysis = {
      anomalyId,
      anomalies: [
        {
          type: targetAnomaly.type,
          value: targetAnomaly.value,
          threshold: targetAnomaly.threshold
        }
      ],
      rootCauses: correlations.map(c => ({
        cause: c.potentialCause,
        confidence: c.confidence,
        evidence: this.generateEvidence(c),
        suggestedFix: this.getSuggestedFix(c.potentialCause)
      })),
      affectedServices: this.identifyAffectedServices(targetAnomaly),
      startTime: targetAnomaly.timestamp,
      duration: 0,
      impact: {
        usersAffected: 0,
        operationsAffected: 0,
        revenueImpact: 0
      },
      timeline: this.buildTimeline(signals, targetAnomaly.timestamp)
    }

    // Cache result
    this.analysisCache.set(anomalyId, analysis)

    return analysis
  }

  /**
   * Collect signals around anomaly time
   */
  private collectSignals(anomalyTime: number, windowMs = 600000): SystemSignal[] {
    const cutoff = anomalyTime - windowMs / 2
    return this.signalHistory.filter(s => s.timestamp > cutoff && s.timestamp < anomalyTime + windowMs / 2)
  }

  /**
   * Correlate signals to identify root causes
   */
  private async correlateSignals(
    signals: SystemSignal[],
    anomaly: any
  ): Promise<CorrelationAnalysis[]> {
    const correlations: CorrelationAnalysis[] = []

    for (const [cause, patterns] of this.knownPatterns) {
      const matchingSignals = signals.filter(s => {
        const signalStr = JSON.stringify(s.value)
        return patterns.some(p => p.test(signalStr))
      })

      if (matchingSignals.length > 0) {
        const confidence = Math.min(1, matchingSignals.length / 5)

        correlations.push({
          signals: matchingSignals,
          correlationScore: confidence,
          potentialCause: cause,
          confidence
        })
      }
    }

    // Heuristic correlations
    if (signals.some(s => s.source === 'deployment')) {
      correlations.push({
        signals: signals.filter(s => s.source === 'deployment'),
        correlationScore: 0.8,
        potentialCause: 'deployment',
        confidence: 0.8
      })
    }

    if (signals.some(s => s.type === 'memory-usage' && (s.value as number) > 80)) {
      correlations.push({
        signals: signals.filter(s => s.type === 'memory-usage'),
        correlationScore: 0.7,
        potentialCause: 'resource-exhaustion',
        confidence: 0.7
      })
    }

    // Sort by confidence
    correlations.sort((a, b) => b.confidence - a.confidence)

    return correlations
  }

  /**
   * Generate evidence text
   */
  private generateEvidence(correlation: CorrelationAnalysis): string[] {
    const evidence: string[] = []

    for (const signal of correlation.signals) {
      evidence.push(`[${signal.source}] ${signal.type}: ${JSON.stringify(signal.value)}`)
    }

    return evidence
  }

  /**
   * Get suggested fix for root cause
   */
  private getSuggestedFix(cause: RootCauseType): string {
    const fixes: Record<RootCauseType, string> = {
      'resource-exhaustion': 'Scale up resources: increase memory allocation or add workers',
      'database-overload': 'Add database read replicas or enable query caching',
      'external-api-latency': 'Check external API status; consider implementing fallback',
      'deployment': 'Pause deployment or roll back to previous version',
      'traffic-spike': 'Auto-scale resources or implement request rate limiting',
      'cache-miss': 'Increase cache size or adjust cache TTL settings',
      'network-issue': 'Check network connectivity and bandwidth; inspect ISP status',
      'configuration-change': 'Review recent configuration changes; consider rollback',
      'third-party-issue': 'Contact third-party service provider; use backup service',
      'unknown': 'Collect more diagnostic data; contact support'
    }

    return fixes[cause]
  }

  /**
   * Identify affected services
   */
  private identifyAffectedServices(anomaly: any): string[] {
    // In production, would query actual service registry
    return ['api-gateway', 'query-engine', 'cache-layer']
  }

  /**
   * Build timeline of events
   */
  private buildTimeline(signals: SystemSignal[], anomalyTime: number): Array<{ timestamp: number; event: string }> {
    return signals
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(s => ({
        timestamp: s.timestamp,
        event: `${s.source}: ${s.type} = ${JSON.stringify(s.value)}`
      }))
  }

  /**
   * Record system signal
   */
  recordSignal(signal: SystemSignal): void {
    this.signalHistory.push(signal)

    // Keep last 24 hours
    const oneDayAgo = Date.now() - 86400000
    this.signalHistory = this.signalHistory.filter(s => s.timestamp > oneDayAgo)
  }

  /**
   * Get analysis history
   */
  getAnalysisHistory(limit = 50): RootCauseAnalysis[] {
    return Array.from(this.analysisCache.values()).slice(-limit)
  }

  /**
   * Get summary statistics
   */
  getSummary() {
    const analyses = Array.from(this.analysisCache.values())

    const causeFrequency = new Map<RootCauseType, number>()
    for (const analysis of analyses) {
      for (const cause of analysis.rootCauses) {
        const count = causeFrequency.get(cause.cause) || 0
        causeFrequency.set(cause.cause, count + 1)
      }
    }

    return {
      totalAnomaliesAnalyzed: analyses.length,
      mostCommonCauses: Array.from(causeFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cause, count]) => ({ cause, occurrences: count })),
      averageTimeToDetect: this.calculateAvgDetectionTime(analyses),
      signalsCollected: this.signalHistory.length
    }
  }

  /**
   * Calculate average detection time
   */
  private calculateAvgDetectionTime(analyses: RootCauseAnalysis[]): number {
    if (analyses.length === 0) return 0

    const times = analyses.map(a => a.duration)
    const sum = times.reduce((a, b) => a + b, 0)
    return Math.round(sum / times.length)
  }
}

export const anomalyAnalyzer = new AnomalyAnalyzer()
