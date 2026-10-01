/**
 * UUID CONSOLIDATION LAYER
 * Unified UUID handling for all operations, theorems, and MCP resources
 * Single source of truth for all UUID-based addressing
 */

import { v4 as uuidv4 } from 'uuid'

interface UUIDResourceType {
  operation: 'operation'
  theorem: 'theorem'
  formula: 'formula'
  domain: 'domain'
  mcp: 'mcp'
}

interface UUIDEntry {
  uuid: string
  type: keyof UUIDResourceType
  domain: string
  resource: string
  metadata: Record<string, any>
  createdAt: Date
  verified: boolean
}

interface UUIDIndex {
  byUUID: Map<string, UUIDEntry>
  byDomain: Map<string, Set<string>>
  byResource: Map<string, UUIDEntry>
  byType: Map<string, Set<string>>
}

/**
 * UNIFIED UUID CONSOLIDATION ENGINE
 * Manages all UUIDs across operations, theorems, formulas, and domains
 */
export class UUIDConsolidationEngine {
  private index: UUIDIndex = {
    byUUID: new Map(),
    byDomain: new Map(),
    byResource: new Map(),
    byType: new Map()
  }

  /**
   * Register a new UUID resource
   */
  register(
    uuid: string,
    type: keyof UUIDResourceType,
    domain: string,
    resource: string,
    metadata: Record<string, any> = {}
  ): UUIDEntry {
    const entry: UUIDEntry = {
      uuid,
      type,
      domain,
      resource,
      metadata,
      createdAt: new Date(),
      verified: false
    }

    // Index by UUID
    this.index.byUUID.set(uuid, entry)

    // Index by domain
    const domainSet = this.index.byDomain.get(domain) || new Set()
    domainSet.add(uuid)
    this.index.byDomain.set(domain, domainSet)

    // Index by resource
    this.index.byResource.set(`${domain}::${resource}`, entry)

    // Index by type
    const typeSet = this.index.byType.get(type) || new Set()
    typeSet.add(uuid)
    this.index.byType.set(type, typeSet)

    return entry
  }

  /**
   * Generate deterministic UUID from domain and resource name
   */
  generateDeterministic(domain: string, resource: string): string {
    const seed = `${domain}::${resource}`
    const hash = this.hashString(seed)
    return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-4${hash.substring(13, 16)}-${hash.substring(16, 20)}-${hash.substring(20, 32)}`
  }

  /**
   * Hash function for deterministic UUID generation
   */
  private hashString(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16).padStart(32, '0')
  }

  /**
   * Lookup UUID entry
   */
  lookup(uuid: string): UUIDEntry | undefined {
    return this.index.byUUID.get(uuid)
  }

  /**
   * Lookup by resource
   */
  lookupByResource(domain: string, resource: string): UUIDEntry | undefined {
    return this.index.byResource.get(`${domain}::${resource}`)
  }

  /**
   * Get all UUIDs in a domain
   */
  getDomain(domain: string): string[] {
    return Array.from(this.index.byDomain.get(domain) || new Set())
  }

  /**
   * Get all UUIDs of a type
   */
  getType(type: keyof UUIDResourceType): string[] {
    return Array.from(this.index.byType.get(type) || new Set())
  }

  /**
   * List all UUIDs
   */
  listAll(): UUIDEntry[] {
    return Array.from(this.index.byUUID.values())
  }

  /**
   * Verify a UUID exists
   */
  verify(uuid: string): boolean {
    return this.index.byUUID.has(uuid)
  }

  /**
   * Get index statistics
   */
  getStats() {
    return {
      totalUUIDs: this.index.byUUID.size,
      domains: this.index.byDomain.size,
      resources: this.index.byResource.size,
      types: this.index.byType.size,
      byType: {
        operations: this.index.byType.get('operation')?.size || 0,
        theorems: this.index.byType.get('theorem')?.size || 0,
        formulas: this.index.byType.get('formula')?.size || 0,
        domains: this.index.byType.get('domain')?.size || 0,
        mcp: this.index.byType.get('mcp')?.size || 0
      }
    }
  }

  /**
   * Export index as JSON for persistence
   */
  export(): string {
    const entries = Array.from(this.index.byUUID.values()).map(e => ({
      ...e,
      createdAt: e.createdAt.toISOString()
    }))
    return JSON.stringify(entries, null, 2)
  }

  /**
   * Import index from JSON
   */
  import(json: string): void {
    try {
      const entries = JSON.parse(json)
      for (const entry of entries) {
        this.register(
          entry.uuid,
          entry.type,
          entry.domain,
          entry.resource,
          entry.metadata
        )
      }
    } catch (e) {
      throw new Error(`Failed to import UUID index: ${e}`)
    }
  }
}

/**
 * GLOBAL UUID CONSOLIDATION INSTANCE
 * Single point of access for all UUID operations
 */
export const uuidConsolidation = new UUIDConsolidationEngine()

/**
 * UUID REGISTRATION FUNCTIONS
 * High-level API for registering different resource types
 */

export function registerOperation(uuid: string, domain: string, operationName: string, metadata: any = {}): UUIDEntry {
  return uuidConsolidation.register(uuid, 'operation', domain, operationName, {
    ...metadata,
    resourceType: 'operation'
  })
}

export function registerTheorem(uuid: string, domain: string, theoremName: string, metadata: any = {}): UUIDEntry {
  return uuidConsolidation.register(uuid, 'theorem', domain, theoremName, {
    ...metadata,
    resourceType: 'theorem'
  })
}

export function registerFormula(uuid: string, domain: string, formulaName: string, metadata: any = {}): UUIDEntry {
  return uuidConsolidation.register(uuid, 'formula', domain, formulaName, {
    ...metadata,
    resourceType: 'formula'
  })
}

export function registerDomain(uuid: string, domain: string, metadata: any = {}): UUIDEntry {
  return uuidConsolidation.register(uuid, 'domain', domain, domain, {
    ...metadata,
    resourceType: 'domain'
  })
}

export function registerMCPResource(uuid: string, domain: string, resourceName: string, metadata: any = {}): UUIDEntry {
  return uuidConsolidation.register(uuid, 'mcp', domain, resourceName, {
    ...metadata,
    resourceType: 'mcp'
  })
}

/**
 * UUID LOOKUP FUNCTIONS
 */

export function lookupUUID(uuid: string): UUIDEntry | undefined {
  return uuidConsolidation.lookup(uuid)
}

export function lookupByResource(domain: string, resource: string): UUIDEntry | undefined {
  return uuidConsolidation.lookupByResource(domain, resource)
}

export function getDomainUUIDs(domain: string): string[] {
  return uuidConsolidation.getDomain(domain)
}

export function getTypeUUIDs(type: keyof UUIDResourceType): string[] {
  return uuidConsolidation.getType(type)
}

export function verifyUUID(uuid: string): boolean {
  return uuidConsolidation.verify(uuid)
}

export function listAllUUIDs(): UUIDEntry[] {
  return uuidConsolidation.listAll()
}

/**
 * UUID GENERATION FUNCTIONS
 */

export function generateOperationUUID(domain: string, operationName: string): string {
  return uuidConsolidation.generateDeterministic(domain, operationName)
}

export function generateTheoremUUID(domain: string, theoremName: string): string {
  return uuidConsolidation.generateDeterministic(domain, theoremName)
}

export function generateFormulaUUID(domain: string, formulaName: string): string {
  return uuidConsolidation.generateDeterministic(domain, formulaName)
}

export function generateRandomUUID(): string {
  return uuidv4()
}

/**
 * CONSOLIDATION STATUS REPORT
 */
export function getUUIDConsolidationStatus() {
  const stats = uuidConsolidation.getStats()

  return {
    timestamp: new Date().toISOString(),
    status: 'CONSOLIDATED',
    engine: 'UUID Consolidation Engine v1.0',
    stats,
    message: `UUID consolidation active: ${stats.totalUUIDs} resources indexed across ${stats.domains} domains`
  }
}

export default UUIDConsolidationEngine
