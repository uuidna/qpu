// Conflict Resolution for Distributed Replication (WAVE 6)
// Handles conflicts when data is written to multiple providers concurrently

export type ConflictResolutionStrategy =
  | 'first-write-wins'
  | 'last-write-wins'
  | 'custom'
  | 'vector-clock'
  | 'timestamp'
  | 'provider-priority'

export interface VersionedData {
  value: any
  timestamp: number
  version: number
  provider: string
  vectorClock?: Record<string, number>
}

export interface ConflictMetadata {
  id: string
  key: string
  conflictingVersions: VersionedData[]
  detectedAt: number
  resolution?: VersionedData
  strategy: ConflictResolutionStrategy
}

export class ConflictResolver {
  private strategy: ConflictResolutionStrategy
  private vectorClocks: Map<string, Record<string, number>> = new Map()
  private providerPriority: Map<string, number> = new Map()

  constructor(strategy: ConflictResolutionStrategy = 'last-write-wins', providerPriority?: Map<string, number>) {
    this.strategy = strategy
    if (providerPriority) {
      this.providerPriority = providerPriority
    }
  }

  // Detect conflict when versions differ
  detectConflict(versions: VersionedData[]): boolean {
    if (versions.length <= 1) return false

    const first = versions[0]
    return !versions.every(v =>
      JSON.stringify(v.value) === JSON.stringify(first.value) &&
      v.timestamp === first.timestamp &&
      v.version === first.version
    )
  }

  // Resolve conflict using configured strategy
  resolve(conflict: ConflictMetadata): VersionedData {
    switch (this.strategy) {
      case 'first-write-wins':
        return this.resolveFirstWriteWins(conflict)
      case 'last-write-wins':
        return this.resolveLastWriteWins(conflict)
      case 'timestamp':
        return this.resolveByTimestamp(conflict)
      case 'vector-clock':
        return this.resolveByVectorClock(conflict)
      case 'provider-priority':
        return this.resolveByProviderPriority(conflict)
      case 'custom':
        return this.resolveCustom(conflict)
      default:
        return conflict.conflictingVersions[0]
    }
  }

  // First write wins - keep earliest timestamp
  private resolveFirstWriteWins(conflict: ConflictMetadata): VersionedData {
    return conflict.conflictingVersions.reduce((earliest, current) =>
      current.timestamp < earliest.timestamp ? current : earliest
    )
  }

  // Last write wins - keep latest timestamp (common strategy)
  private resolveLastWriteWins(conflict: ConflictMetadata): VersionedData {
    return conflict.conflictingVersions.reduce((latest, current) =>
      current.timestamp > latest.timestamp ? current : latest
    )
  }

  // Resolve by comparing timestamps with millisecond precision
  private resolveByTimestamp(conflict: ConflictMetadata): VersionedData {
    const sorted = [...conflict.conflictingVersions].sort((a, b) => {
      if (b.timestamp !== a.timestamp) {
        return b.timestamp - a.timestamp
      }
      // Tie-breaker: by version number
      return b.version - a.version
    })
    return sorted[0]
  }

  // Vector clock comparison for causality detection
  private resolveByVectorClock(conflict: ConflictMetadata): VersionedData {
    const versions = conflict.conflictingVersions

    // Find causally ordered versions
    for (const candidate of versions) {
      let isCausallyLater = true

      for (const other of versions) {
        if (candidate === other) continue
        if (!this.isCausallyAfter(candidate, other)) {
          isCausallyLater = false
          break
        }
      }

      if (isCausallyLater) {
        return candidate
      }
    }

    // No causal ordering - fall back to timestamp
    return this.resolveByTimestamp(conflict)
  }

  // Provider priority - prefer data from higher-priority provider
  private resolveByProviderPriority(conflict: ConflictMetadata): VersionedData {
    let selected = conflict.conflictingVersions[0]
    let bestPriority = this.providerPriority.get(selected.provider) ?? 999

    for (const version of conflict.conflictingVersions) {
      const priority = this.providerPriority.get(version.provider) ?? 999
      if (priority < bestPriority) {
        selected = version
        bestPriority = priority
      }
    }

    return selected
  }

  // Custom resolution - can be overridden per application
  private resolveCustom(conflict: ConflictMetadata): VersionedData {
    // Application-specific logic should override this
    return this.resolveLastWriteWins(conflict)
  }

  // Merge compatible versions
  async merge(versions: VersionedData[]): Promise<any> {
    if (versions.length === 0) return null
    if (versions.length === 1) return versions[0].value

    // For objects, try field-level merge
    const firstValue = versions[0].value
    if (typeof firstValue === 'object' && firstValue !== null) {
      const merged: any = {}

      // Collect all keys from all versions
      const allKeys = new Set<string>()
      for (const version of versions) {
        if (typeof version.value === 'object' && version.value !== null) {
          Object.keys(version.value).forEach(k => allKeys.add(k))
        }
      }

      // For each key, resolve conflicts
      for (const key of allKeys) {
        const keyVersions = versions
          .map(v => ({
            ...v,
            value: v.value?.[key]
          }))
          .filter(v => v.value !== undefined)

        if (keyVersions.length === 0) continue

        if (this.detectConflict(keyVersions)) {
          const conflict: ConflictMetadata = {
            id: `${key}-merge`,
            key,
            conflictingVersions: keyVersions,
            detectedAt: Date.now(),
            strategy: this.strategy
          }
          merged[key] = this.resolve(conflict).value
        } else {
          merged[key] = keyVersions[0].value
        }
      }

      return merged
    }

    // For non-objects, resolve conflict normally
    const conflict: ConflictMetadata = {
      id: 'merge-conflict',
      key: 'value',
      conflictingVersions: versions,
      detectedAt: Date.now(),
      strategy: this.strategy
    }

    return this.resolve(conflict).value
  }

  // Update vector clock for causality tracking
  updateVectorClock(provider: string, clock: Record<string, number>): Record<string, number> {
    const current = this.vectorClocks.get(provider) || {}

    for (const key in clock) {
      current[key] = Math.max(current[key] || 0, clock[key])
    }
    current[provider] = (current[provider] || 0) + 1

    this.vectorClocks.set(provider, current)
    return current
  }

  private isCausallyAfter(a: VersionedData, b: VersionedData): boolean {
    if (!a.vectorClock || !b.vectorClock) return false

    let hasGreater = false
    for (const key in a.vectorClock) {
      const aVal = a.vectorClock[key] || 0
      const bVal = b.vectorClock[key] || 0

      if (aVal < bVal) return false
      if (aVal > bVal) hasGreater = true
    }

    return hasGreater
  }

  // Analyze conflict patterns
  analyzeConflicts(conflicts: ConflictMetadata[]): {
    totalConflicts: number
    conflictRate: number
    mostCommonKeys: Array<{ key: string; count: number }>
    averageVersionsPerConflict: number
  } {
    const keyCount = new Map<string, number>()

    for (const conflict of conflicts) {
      const count = keyCount.get(conflict.key) || 0
      keyCount.set(conflict.key, count + 1)
    }

    const mostCommonKeys = Array.from(keyCount.entries())
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const avgVersions = conflicts.reduce((sum, c) => sum + c.conflictingVersions.length, 0) / conflicts.length

    return {
      totalConflicts: conflicts.length,
      conflictRate: conflicts.length > 0 ? 1 : 0,
      mostCommonKeys,
      averageVersionsPerConflict: avgVersions
    }
  }
}
