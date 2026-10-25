// WAVE 8H: Production Hardening - Graceful Degradation

export interface DegradationLevel {
  level: 'full' | 'reduced' | 'minimal' | 'offline'
  features_available: string[]
  estimated_recovery: number  // ms
}

export class GracefulDegradation {
  private degradation_levels: Map<string, DegradationLevel> = new Map()
  private system_load = 0
  private error_rate = 0
  private memory_usage_mb = 0

  // Feature availability matrix
  private feature_matrix: Record<string, { min_level: 'full' | 'reduced' | 'minimal' }> = {
    'search': { min_level: 'full' },
    'real_time_sync': { min_level: 'reduced' },
    'graphql': { min_level: 'reduced' },
    'analytics': { min_level: 'minimal' },
    'webhooks': { min_level: 'minimal' },
    'api_v2': { min_level: 'minimal' },
    'rest_api': { min_level: 'reduced' }
  }

  // Record system metrics
  recordMetrics(load: number, error_rate: number, memory_mb: number): void {
    this.system_load = load
    this.error_rate = error_rate
    this.memory_usage_mb = memory_mb
  }

  // Determine degradation level based on metrics
  determineDegradationLevel(): DegradationLevel {
    // Critical: Out of memory or 30%+ error rate
    if (this.memory_usage_mb > 900 || this.error_rate > 0.3) {
      return {
        level: 'offline',
        features_available: [],
        estimated_recovery: 300000  // 5 minutes
      }
    }

    // Severe: High memory (>700MB) or high error rate (>10%)
    if (this.memory_usage_mb > 700 || this.error_rate > 0.1) {
      return {
        level: 'minimal',
        features_available: this.getAvailableFeatures('minimal'),
        estimated_recovery: 120000  // 2 minutes
      }
    }

    // Moderate: Medium memory (>500MB) or moderate error rate (>5%)
    if (this.memory_usage_mb > 500 || this.error_rate > 0.05) {
      return {
        level: 'reduced',
        features_available: this.getAvailableFeatures('reduced'),
        estimated_recovery: 60000  // 1 minute
      }
    }

    // Normal: All features available
    return {
      level: 'full',
      features_available: this.getAvailableFeatures('full'),
      estimated_recovery: 0
    }
  }

  // Get available features for degradation level
  private getAvailableFeatures(level: 'full' | 'reduced' | 'minimal' | 'offline'): string[] {
    if (level === 'offline') return []

    const available: string[] = []
    const levels: ('full' | 'reduced' | 'minimal')[] = level === 'full' ? ['full', 'reduced', 'minimal'] : level === 'reduced' ? ['reduced', 'minimal'] : ['minimal']

    for (const [feature, requirement] of Object.entries(this.feature_matrix)) {
      if (levels.includes(requirement.min_level)) {
        available.push(feature)
      }
    }

    return available
  }

  // Check if feature is available
  isFeatureAvailable(feature: string): boolean {
    const degradation = this.determineDegradationLevel()
    return degradation.features_available.includes(feature)
  }

  // Get current status
  getStatus(): {
    degradation_level: DegradationLevel
    system_load: number
    error_rate: number
    memory_usage_mb: number
  } {
    return {
      degradation_level: this.determineDegradationLevel(),
      system_load: this.system_load,
      error_rate: this.error_rate,
      memory_usage_mb: this.memory_usage_mb
    }
  }

  // Fallback strategies
  getFallback(operation: string): any {
    const available = this.determineDegradationLevel()

    switch (operation) {
      case 'real_time_sync':
        if (!available.features_available.includes('real_time_sync')) {
          return { type: 'polling', interval: 5000 }  // Fall back to polling
        }
        break

      case 'graphql_query':
        if (!available.features_available.includes('graphql')) {
          return { type: 'rest_api' }  // Fall back to REST
        }
        break

      case 'search':
        if (!available.features_available.includes('search')) {
          return { type: 'simple_filter' }  // Fall back to filtering
        }
        break

      case 'webhooks':
        if (!available.features_available.includes('webhooks')) {
          return { type: 'polling', interval: 10000 }  // Fall back to polling
        }
        break
    }

    return null
  }
}

export const gracefulDegradation = new GracefulDegradation()
