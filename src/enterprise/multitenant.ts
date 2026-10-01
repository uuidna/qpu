/**
 * MULTI-TENANT ISOLATION FORMULAS
 * Cost isolation, quota enforcement, RBAC, audit
 * Phase 8b: Enterprise - GAP 4
 */

// ============================================================================
// FORMULA 1: TENANT IDENTIFIER
// Extract from JWT/context/headers
// ============================================================================

export interface TenantContext {
  tenantId: string
  userId: string
  roles: string[]
  tier: 'free' | 'pro' | 'enterprise'
  features: string[]
}

export class TenantIdentifier {
  identify(request: any): TenantContext | null {
    // Extract from JWT
    const jwt = request.headers?.authorization?.replace('Bearer ', '')
    if (jwt) {
      try {
        const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString())
        return {
          tenantId: payload.sub,
          userId: payload.user_id,
          roles: payload.roles || [],
          tier: payload.tier || 'free',
          features: payload.features || []
        }
      } catch {
        return null
      }
    }

    // Extract from X-Tenant-ID header
    const headerId = request.headers?.['x-tenant-id']
    if (headerId) {
      return {
        tenantId: headerId,
        userId: request.headers?.['x-user-id'] || 'anonymous',
        roles: (request.headers?.['x-roles'] || '').split(',').filter(Boolean),
        tier: 'free',
        features: []
      }
    }

    return null
  }
}

// ============================================================================
// FORMULA 2: COST ATTRIBUTION
// Tag compute with tenant ID
// ============================================================================

export interface CostEntry {
  tenantId: string
  operationId: string
  cpuMs: number
  memoryMb: number
  timestamp: number
  cost: number
}

export class CostAttributor {
  private costs = new Map<string, CostEntry[]>()
  private rates = { perCpuMs: 0.001, perMemoryMb: 0.01, perOperation: 0.001 }

  record(tenantId: string, operationId: string, cpuMs: number, memoryMb: number): CostEntry {
    const cost = cpuMs * this.rates.perCpuMs + memoryMb * this.rates.perMemoryMb + this.rates.perOperation
    const entry: CostEntry = { tenantId, operationId, cpuMs, memoryMb, timestamp: Date.now(), cost }

    if (!this.costs.has(tenantId)) {
      this.costs.set(tenantId, [])
    }
    this.costs.get(tenantId)!.push(entry)

    return entry
  }

  totalCost(tenantId: string): number {
    return this.costs.get(tenantId)?.reduce((sum, c) => sum + c.cost, 0) || 0
  }

  dailyCost(tenantId: string): number {
    const now = Date.now()
    const dayAgo = now - 86400000
    return (this.costs.get(tenantId) || [])
      .filter(c => c.timestamp > dayAgo)
      .reduce((sum, c) => sum + c.cost, 0)
  }

  exportCSV(): string {
    const rows = [['Tenant ID', 'Operation', 'CPU ms', 'Memory MB', 'Cost', 'Timestamp']]
    for (const [_, entries] of this.costs) {
      entries.forEach(e => {
        rows.push([e.tenantId, e.operationId, String(e.cpuMs), String(e.memoryMb), e.cost.toFixed(4), new Date(e.timestamp).toISOString()])
      })
    }
    return rows.map(r => r.join(',')).join('\n')
  }
}

// ============================================================================
// FORMULA 3: QUOTA ENFORCER
// Hard limits per tenant
// ============================================================================

export interface TenantQuota {
  tenantId: string
  monthlyApiCalls: number
  monthlyComputeMs: number
  storageGb: number
  concurrentRequests: number
  used: {
    apiCalls: number
    computeMs: number
    storageGb: number
    concurrentRequests: number
  }
}

export class QuotaEnforcer {
  private quotas = new Map<string, TenantQuota>()

  set(tenantId: string, quota: Partial<TenantQuota>): void {
    if (!this.quotas.has(tenantId)) {
      this.quotas.set(tenantId, {
        tenantId,
        monthlyApiCalls: quota.monthlyApiCalls || 1000000,
        monthlyComputeMs: quota.monthlyComputeMs || 3600000,
        storageGb: quota.storageGb || 100,
        concurrentRequests: quota.concurrentRequests || 100,
        used: { apiCalls: 0, computeMs: 0, storageGb: 0, concurrentRequests: 0 }
      })
    }
  }

  canExecute(tenantId: string): boolean {
    const quota = this.quotas.get(tenantId)
    if (!quota) return false
    return (
      quota.used.apiCalls < quota.monthlyApiCalls &&
      quota.used.computeMs < quota.monthlyComputeMs &&
      quota.used.concurrentRequests < quota.concurrentRequests
    )
  }

  recordUsage(tenantId: string, cpuMs: number, bytes: number): boolean {
    const quota = this.quotas.get(tenantId)
    if (!quota) return false

    quota.used.apiCalls++
    quota.used.computeMs += cpuMs
    quota.used.storageGb += bytes / (1024 * 1024 * 1024)
    quota.used.concurrentRequests++

    return this.canExecute(tenantId)
  }

  releaseRequest(tenantId: string): void {
    const quota = this.quotas.get(tenantId)
    if (quota) quota.used.concurrentRequests--
  }

  remaining(tenantId: string) {
    const quota = this.quotas.get(tenantId)
    if (!quota) return null
    return {
      apiCalls: quota.monthlyApiCalls - quota.used.apiCalls,
      computeMs: quota.monthlyComputeMs - quota.used.computeMs,
      storageGb: quota.storageGb - quota.used.storageGb,
      concurrentRequests: quota.concurrentRequests - quota.used.concurrentRequests
    }
  }
}

// ============================================================================
// FORMULA 4: SECURITY BOUNDARY
// RBAC per domain per tenant
// ============================================================================

export interface Permission {
  tenantId: string
  resource: string
  action: 'read' | 'write' | 'delete' | 'admin'
  roles: string[]
}

export class SecurityBoundary {
  private permissions: Permission[] = []

  grant(tenantId: string, resource: string, action: string, roles: string[]): void {
    this.permissions.push({ tenantId, resource, action: action as any, roles })
  }

  can(tenantId: string, userRoles: string[], resource: string, action: string): boolean {
    return this.permissions.some(
      p =>
        p.tenantId === tenantId &&
        p.resource === resource &&
        p.action === action &&
        userRoles.some(r => p.roles.includes(r))
    )
  }

  listPermissions(tenantId: string): Permission[] {
    return this.permissions.filter(p => p.tenantId === tenantId)
  }

  revoke(tenantId: string, resource: string): void {
    this.permissions = this.permissions.filter(p => !(p.tenantId === tenantId && p.resource === resource))
  }
}

// ============================================================================
// FORMULA 5: NOISY NEIGHBOR DETECTOR
// Detect starvation and interference
// ============================================================================

export interface TenantMetrics {
  tenantId: string
  cpuSharePercent: number
  memorySharePercent: number
  latencyMs: number
  errorRate: number
  timestamp: number
}

export class NoisyNeighborDetector {
  private metrics: TenantMetrics[] = []
  private starvationThreshold = 0.05 // 5% CPU usage while others at 90%

  record(metric: TenantMetrics): void {
    this.metrics.push(metric)
    if (this.metrics.length > 10000) this.metrics.shift()
  }

  isStarved(tenantId: string): boolean {
    const recent = this.metrics.slice(-100).filter(m => m.tenantId === tenantId)
    if (recent.length === 0) return false

    const avgCpu = recent.reduce((sum, m) => sum + m.cpuSharePercent, 0) / recent.length
    const maxCpu = Math.max(...this.metrics.map(m => m.cpuSharePercent))

    return avgCpu < this.starvationThreshold && maxCpu > 80
  }

  isNoisy(tenantId: string): boolean {
    const recent = this.metrics.slice(-100).filter(m => m.tenantId === tenantId)
    if (recent.length === 0) return false

    const avgLatency = recent.reduce((sum, m) => sum + m.latencyMs, 0) / recent.length
    const avgErrorRate = recent.reduce((sum, m) => sum + m.errorRate, 0) / recent.length

    return avgLatency > 1000 || avgErrorRate > 0.1
  }

  detector(): { starved: string[]; noisy: string[] } {
    const tenants = new Set(this.metrics.map(m => m.tenantId))
    const starved: string[] = []
    const noisy: string[] = []

    for (const t of tenants) {
      if (this.isStarved(t)) starved.push(t)
      if (this.isNoisy(t)) noisy.push(t)
    }

    return { starved, noisy }
  }
}

// ============================================================================
// FORMULA 6: AUDIT LOGGER
// Compliance logging for all operations
// ============================================================================

export interface AuditEntry {
  id: string
  tenantId: string
  userId: string
  action: string
  resource: string
  timestamp: number
  status: 'success' | 'failure'
  details: Record<string, any>
}

export class AuditLogger {
  private logs: AuditEntry[] = []

  log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): AuditEntry {
    const auditEntry: AuditEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random()}`,
      timestamp: Date.now()
    }
    this.logs.push(auditEntry)
    return auditEntry
  }

  search(tenantId: string, action?: string, days: number = 30): AuditEntry[] {
    const cutoff = Date.now() - days * 86400000
    return this.logs.filter(
      l => l.tenantId === tenantId && l.timestamp > cutoff && (!action || l.action === action)
    )
  }

  export(tenantId: string): string {
    const entries = this.search(tenantId)
    return JSON.stringify(entries, null, 2)
  }
}

// ============================================================================
// FORMULA 7: RATE LIMITER (per-tenant)
// Per-tenant rate limits
// ============================================================================

export class PerTenantRateLimiter {
  private limiters = new Map<string, { tokens: number; lastRefill: number }>()
  private configs = new Map<string, { rps: number; burst: number }>()

  configTenant(tenantId: string, rps: number, burst: number): void {
    this.configs.set(tenantId, { rps, burst })
    this.limiters.set(tenantId, { tokens: burst, lastRefill: Date.now() })
  }

  async waitForSlot(tenantId: string): Promise<boolean> {
    const config = this.configs.get(tenantId)
    if (!config) return true // No limit if not configured

    const limiter = this.limiters.get(tenantId)!
    const now = Date.now()
    const timeSinceRefill = (now - limiter.lastRefill) / 1000
    const tokensToAdd = timeSinceRefill * config.rps

    limiter.tokens = Math.min(config.burst, limiter.tokens + tokensToAdd)
    limiter.lastRefill = now

    if (limiter.tokens >= 1) {
      limiter.tokens -= 1
      return true
    }

    return false
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const multitenant = {
  identifier: new TenantIdentifier(),
  cost: new CostAttributor(),
  quota: new QuotaEnforcer(),
  security: new SecurityBoundary(),
  noisy: new NoisyNeighborDetector(),
  audit: new AuditLogger(),
  rateLimit: new PerTenantRateLimiter()
}

/**
 * PHASE 8b: GAP 4 - MULTI-TENANT ISOLATION
 *
 * 7 Formulas for SaaS-ready platform:
 * ✓ TenantIdentifier - Extract from JWT/headers
 * ✓ CostAttributor - Track compute per tenant
 * ✓ QuotaEnforcer - Hard limits per tenant
 * ✓ SecurityBoundary - RBAC per resource
 * ✓ NoisyNeighborDetector - Prevent starvation
 * ✓ AuditLogger - Compliance logging
 * ✓ PerTenantRateLimiter - API quotas
 *
 * Enables: B2B SaaS deployments, regulatory compliance, cost control
 */
