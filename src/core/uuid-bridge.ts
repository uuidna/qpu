/**
 * UUID-Core Bridge
 * Connects the UUID-programmable MCP layer with the core operation registry
 * Allows operations to be addressed by UUID, name, or domain
 */

import { operationRegistry, listOperations, getOperation, executeOperation } from './operations.js'
import { ExecutionResult } from './types.js'
import { v4 as uuidv4 } from 'uuid'

// ============================================================================
// UUID OPERATION INDEX
// ============================================================================

interface UUIDIndexEntry {
  uuid: string
  domain: string
  operation: string
  registered: Date
}

export class UUIDBridge {
  private uuidToOperation: Map<string, string> = new Map() // uuid -> operation name
  private operationToUUID: Map<string, string> = new Map() // operation name -> uuid
  private domainUUIDs: Map<string, string[]> = new Map() // domain -> [uuids]

  constructor() {
    this.indexAllOperations()
  }

  /**
   * Index all operations from core registry with UUIDs
   */
  private indexAllOperations(): void {
    const operations = listOperations()

    for (const operationName of operations) {
      const operation = getOperation(operationName)
      if (!operation) continue

      // Generate deterministic UUID from domain + operation
      const uuid = this.generateOperationUUID(operation.domain, operationName)

      this.uuidToOperation.set(uuid, operationName)
      this.operationToUUID.set(operationName, uuid)

      // Index by domain
      const domainOps = this.domainUUIDs.get(operation.domain) || []
      if (!domainOps.includes(uuid)) {
        domainOps.push(uuid)
        this.domainUUIDs.set(operation.domain, domainOps)
      }
    }
  }

  /**
   * Generate deterministic UUID for operation
   * Allows consistent addressing across restarts
   */
  private generateOperationUUID(domain: string, operation: string): string {
    const seed = `${domain}::${operation}`
    const hash = this.hashString(seed)
    return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-4${hash.substring(13, 16)}-${hash.substring(16, 20)}-${hash.substring(20, 32)}`
  }

  /**
   * Simple hash function for deterministic UUID generation
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
   * Execute operation by UUID
   */
  async executeByUUID(uuid: string, inputs?: Record<string, unknown>): Promise<ExecutionResult> {
    const operationName = this.uuidToOperation.get(uuid)
    if (!operationName) {
      return {
        success: false,
        error: `Operation not found for UUID: ${uuid}`
      }
    }

    return executeOperation(operationName, inputs)
  }

  /**
   * Execute operation by name
   */
  async executeByName(name: string, inputs?: Record<string, unknown>): Promise<ExecutionResult> {
    return executeOperation(name, inputs)
  }

  /**
   * Get UUID for operation
   */
  getUUID(operationName: string): string | undefined {
    return this.operationToUUID.get(operationName)
  }

  /**
   * Get operation name for UUID
   */
  getOperationName(uuid: string): string | undefined {
    return this.uuidToOperation.get(uuid)
  }

  /**
   * List all UUIDs in domain
   */
  listDomain(domain: string): string[] {
    return this.domainUUIDs.get(domain) || []
  }

  /**
   * List all operations with their UUIDs
   */
  listAll(): UUIDIndexEntry[] {
    const entries: UUIDIndexEntry[] = []

    for (const [uuid, operationName] of this.uuidToOperation.entries()) {
      const operation = getOperation(operationName)
      if (operation) {
        entries.push({
          uuid,
          domain: operation.domain,
          operation: operationName,
          registered: new Date()
        })
      }
    }

    return entries
  }

  /**
   * Get all operations
   */
  getAll() {
    return this.listAll()
  }
}

// ============================================================================
// GLOBAL BRIDGE INSTANCE
// ============================================================================

export const uuidBridge = new UUIDBridge()

/**
 * Execute operation by UUID (global)
 */
export async function executeByUUID(uuid: string, inputs?: Record<string, unknown>): Promise<ExecutionResult> {
  return uuidBridge.executeByUUID(uuid, inputs)
}

/**
 * Execute operation by name (global)
 */
export async function executeByName(name: string, inputs?: Record<string, unknown>): Promise<ExecutionResult> {
  return uuidBridge.executeByName(name, inputs)
}

export default UUIDBridge
