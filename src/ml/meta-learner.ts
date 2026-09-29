// Meta-learning system - learns patterns across all domains
export interface DomainPattern {
  domain: string
  algorithm: string
  performance: number
  applicability: number
  relatedDomains: string[]
}

export class MetaLearner {
  private patterns: Map<string, DomainPattern> = new Map()
  private correlations: Map<string, number> = new Map()
  private transferability: Map<string, number> = new Map()

  recordPattern(domain: string, algorithm: string, performance: number) {
    const key = `${domain}:${algorithm}`
    const pattern = this.patterns.get(key) || {
      domain,
      algorithm,
      performance: 0,
      applicability: 0,
      relatedDomains: [],
    }

    pattern.performance = (pattern.performance * 0.7 + performance * 0.3)
    pattern.applicability++

    this.patterns.set(key, pattern)
  }

  discoverCorrelations(domainA: string, domainB: string, similarity: number) {
    const key = `${[domainA, domainB].sort().join(':')}`
    this.correlations.set(key, similarity)

    const patternA = Array.from(this.patterns.values()).filter(p => p.domain === domainA)
    const patternB = Array.from(this.patterns.values()).filter(p => p.domain === domainB)

    patternA.forEach(p => {
      if (!p.relatedDomains.includes(domainB)) {
        p.relatedDomains.push(domainB)
      }
    })

    patternB.forEach(p => {
      if (!p.relatedDomains.includes(domainA)) {
        p.relatedDomains.push(domainA)
      }
    })
  }

  estimateTransfer(sourceDomain: string, targetDomain: string): number {
    const key = `${sourceDomain}=>${targetDomain}`
    if (this.transferability.has(key)) {
      return this.transferability.get(key)!
    }

    const source = Array.from(this.patterns.values()).filter(p => p.domain === sourceDomain)
    const target = Array.from(this.patterns.values()).filter(p => p.domain === targetDomain)

    let transferScore = 0
    source.forEach(s => {
      target.forEach(t => {
        if (s.algorithm === t.algorithm) {
          transferScore += Math.min(s.performance, t.performance) * 0.8
        }
      })
    })

    const estimate = source.length > 0 ? transferScore / source.length : 0
    this.transferability.set(key, estimate)
    return estimate
  }

  getTopPatterns(limit: number = 10): DomainPattern[] {
    return Array.from(this.patterns.values())
      .sort((a, b) => b.performance - a.performance)
      .slice(0, limit)
  }

  getAlgorithmRecommendations(domain: string): Array<{ algorithm: string; confidence: number }> {
    const patterns = Array.from(this.patterns.values())
      .filter(p => p.domain === domain)
      .sort((a, b) => b.performance - a.performance)

    return patterns.slice(0, 5).map(p => ({
      algorithm: p.algorithm,
      confidence: p.performance,
    }))
  }

  getStats() {
    const patterns = Array.from(this.patterns.values())
    const avgPerformance = patterns.length > 0 ? patterns.reduce((sum, p) => sum + p.performance, 0) / patterns.length : 0

    return {
      patternCount: patterns.length,
      domainCount: new Set(patterns.map(p => p.domain)).size,
      avgPerformance: avgPerformance.toFixed(2),
      correlations: this.correlations.size,
      transfers: this.transferability.size,
    }
  }
}

export const learner = new MetaLearner()
