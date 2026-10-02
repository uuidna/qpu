/**
 * State Synchronization: Vector clocks + Merkle trees for eventual consistency
 * Fast by default, safe by design
 */

import { sha256Hex } from '../core/crypt.js'
import {
  VectorClock,
  MerkleNode,
  StateSnapshot,
  StateSyncEvent,
  SyncState
} from './types.js'

export class StateSynchronizer {
  private syncState: SyncState
  private stateData: Map<string, any> = new Map()
  private eventHistory: StateSyncEvent[] = []
  private merkleCache: Map<string, MerkleNode> = new Map()
  private localNodeId: string
  private snapshotHistory: StateSnapshot[] = []

  constructor(localNodeId: string) {
    this.localNodeId = localNodeId
    this.syncState = {
      localVersion: 0,
      peerVersions: new Map(),
      pendingEvents: [],
      vectorClock: { [localNodeId]: 0 },
      lastMerkleRoot: ''
    }
  }

  /**
   * Update local state (generates sync event)
   */
  updateState(key: string, value: any): void {
    this.stateData.set(key, value)

    // Increment local clock
    this.syncState.vectorClock[this.localNodeId] =
      (this.syncState.vectorClock[this.localNodeId] || 0) + 1

    // Create sync event
    const event: StateSyncEvent = {
      type: 'update',
      key,
      value,
      timestamp: Date.now(),
      sourceNode: this.localNodeId,
      vectorClock: { ...this.syncState.vectorClock }
    }

    this.eventHistory.push(event)
    this.syncState.pendingEvents.push(event)

    console.log(`[Sync] State updated: ${key} (version ${this.syncState.localVersion})`)

    // Invalidate merkle cache
    this.merkleCache.clear()
  }

  /**
   * Delete state
   */
  deleteState(key: string): void {
    if (!this.stateData.has(key)) return

    this.stateData.delete(key)

    // Increment local clock
    this.syncState.vectorClock[this.localNodeId] =
      (this.syncState.vectorClock[this.localNodeId] || 0) + 1

    // Create sync event
    const event: StateSyncEvent = {
      type: 'delete',
      key,
      timestamp: Date.now(),
      sourceNode: this.localNodeId,
      vectorClock: { ...this.syncState.vectorClock }
    }

    this.eventHistory.push(event)
    this.syncState.pendingEvents.push(event)

    console.log(`[Sync] State deleted: ${key}`)

    // Invalidate merkle cache
    this.merkleCache.clear()
  }

  /**
   * Get state with version info
   */
  getState(key: string): { value: any; version: number; clock: VectorClock } | undefined {
    const value = this.stateData.get(key)
    if (value === undefined) return undefined

    return {
      value,
      version: this.syncState.localVersion,
      clock: { ...this.syncState.vectorClock }
    }
  }

  /**
   * Merge state from peer (conflict resolution via vector clocks)
   */
  mergeState(event: StateSyncEvent, peerNodeId: string): boolean {
    // Update peer version
    this.syncState.peerVersions.set(peerNodeId, (this.syncState.peerVersions.get(peerNodeId) || 0) + 1)

    // Check causality: peer's clock must be >= local clock for all nodes except peer
    const isCausal = this.isCausallyConsistent(event.vectorClock)

    if (!isCausal) {
      console.log(`[Sync] Non-causal event received from ${peerNodeId}, buffering...`)
      // In real implementation: buffer and retry later
      return false
    }

    // Apply event based on type
    switch (event.type) {
      case 'update':
        // Check for conflicts (concurrent updates)
        const conflict = this.hasConflict(event)
        if (conflict) {
          console.log(`[Sync] Conflict detected for key: ${event.key}`)
          // Use wall-clock timestamp as tiebreaker
          const existing = this.stateData.get(event.key) as any
          if (event.timestamp > existing?.timestamp) {
            this.stateData.set(event.key, event.value)
          }
        } else {
          this.stateData.set(event.key, event.value)
        }
        break

      case 'delete':
        this.stateData.delete(event.key)
        break

      case 'merge':
        // Merge data structures (e.g., sets, maps)
        const existing = this.stateData.get(event.key) || {}
        if (typeof existing === 'object' && typeof event.value === 'object') {
          this.stateData.set(event.key, { ...existing, ...event.value })
        }
        break
    }

    // Update local version
    this.syncState.localVersion++

    // Invalidate merkle cache
    this.merkleCache.clear()

    console.log(`[Sync] Event merged from ${peerNodeId}: ${event.type} on ${event.key}`)
    return true
  }

  /**
   * Create state snapshot
   */
  createSnapshot(): StateSnapshot {
    const snapshot: StateSnapshot = {
      version: this.syncState.localVersion,
      timestamp: Date.now(),
      nodeId: this.localNodeId,
      vectorClock: { ...this.syncState.vectorClock },
      merkleRoot: this.computeMerkleRoot(),
      checksum: this.computeChecksum()
    }

    this.snapshotHistory.push(snapshot)
    this.syncState.lastMerkleRoot = snapshot.merkleRoot

    console.log(`[Sync] Snapshot created: v${snapshot.version}, root=${snapshot.merkleRoot.slice(0, 8)}...`)
    return snapshot
  }

  /**
   * Get state for peer sync
   */
  getStateForSync(): { data: Record<string, any>; snapshot: StateSnapshot; events: StateSyncEvent[] } {
    return {
      data: Object.fromEntries(this.stateData),
      snapshot: this.snapshotHistory[this.snapshotHistory.length - 1] || this.createSnapshot(),
      events: this.syncState.pendingEvents
    }
  }

  /**
   * Verify peer state consistency
   */
  verifyPeerState(peerSnapshot: StateSnapshot, peerData: Record<string, any>): {
    consistent: boolean
    reason: string
  } {
    // Compute merkle root from peer data
    const computedRoot = this.computeMerkleRootFromData(peerData)

    if (computedRoot !== peerSnapshot.merkleRoot) {
      return {
        consistent: false,
        reason: `Merkle root mismatch: expected ${peerSnapshot.merkleRoot.slice(0, 8)}, got ${computedRoot.slice(0, 8)}`
      }
    }

    // Verify checksum
    const expectedChecksum = this.computeChecksumFromData(peerData)
    if (expectedChecksum !== peerSnapshot.checksum) {
      return {
        consistent: false,
        reason: `Checksum mismatch`
      }
    }

    return {
      consistent: true,
      reason: 'State verified'
    }
  }

  /**
   * Compute merkle tree root
   */
  private computeMerkleRoot(): string {
    const sortedKeys = Array.from(this.stateData.keys()).sort()
    if (sortedKeys.length === 0) {
      return this.hash('')
    }

    const leaves = sortedKeys.map(key => ({
      hash: this.hash(JSON.stringify({ [key]: this.stateData.get(key) })),
      leaf: true
    }))

    return this.buildMerkleTree(leaves).hash
  }

  /**
   * Compute merkle tree root from data
   */
  private computeMerkleRootFromData(data: Record<string, any>): string {
    const sortedKeys = Object.keys(data).sort()
    if (sortedKeys.length === 0) {
      return this.hash('')
    }

    const leaves = sortedKeys.map(key => ({
      hash: this.hash(JSON.stringify({ [key]: data[key] })),
      leaf: true
    }))

    return this.buildMerkleTree(leaves).hash
  }

  /**
   * Build merkle tree from leaves
   */
  private buildMerkleTree(leaves: MerkleNode[]): MerkleNode {
    if (leaves.length === 0) return { hash: this.hash(''), leaf: true }
    if (leaves.length === 1) return leaves[0]

    const parents: MerkleNode[] = []
    for (let i = 0; i < leaves.length; i += 2) {
      const left = leaves[i]
      const right = leaves[i + 1] || left
      const parent: MerkleNode = {
        hash: this.hash(left.hash + right.hash),
        children: [left, right],
        leaf: false
      }
      parents.push(parent)
    }

    return this.buildMerkleTree(parents)
  }

  /**
   * Check if state update is causal
   */
  private isCausallyConsistent(eventClock: VectorClock): boolean {
    // For each node except source, event clock should be >= local clock
    for (const [nodeId, localTime] of Object.entries(this.syncState.vectorClock)) {
      const eventTime = eventClock[nodeId] || 0
      if (eventTime < localTime) {
        return false
      }
    }
    return true
  }

  /**
   * Check for concurrent updates (conflict)
   */
  private hasConflict(event: StateSyncEvent): boolean {
    // Find existing value
    const existing = this.stateData.get(event.key)
    if (!existing) return false

    // If both have vector clocks, check if they're concurrent
    if (existing._clock && event.vectorClock) {
      return this.areConcurrent(existing._clock, event.vectorClock)
    }

    return false
  }

  /**
   * Check if two events are concurrent (neither causally depends on other)
   */
  private areConcurrent(clock1: VectorClock, clock2: VectorClock): boolean {
    let hasGreater1 = false
    let hasGreater2 = false

    const allNodes = new Set([...Object.keys(clock1), ...Object.keys(clock2)])

    for (const node of allNodes) {
      const t1 = clock1[node] || 0
      const t2 = clock2[node] || 0

      if (t1 > t2) hasGreater1 = true
      if (t2 > t1) hasGreater2 = true
    }

    return hasGreater1 && hasGreater2
  }

  /**
   * Compute checksum
   */
  private computeChecksum(): string {
    const data = Object.fromEntries(this.stateData)
    return this.hash(JSON.stringify(data))
  }

  /**
   * Compute checksum from data
   */
  private computeChecksumFromData(data: Record<string, any>): string {
    return this.hash(JSON.stringify(data))
  }

  /**
   * Hash utility
   */
  private hash(data: string): string {
    return sha256Hex(data)
  }

  /**
   * Get sync state
   */
  getSyncState(): SyncState {
    return {
      localVersion: this.syncState.localVersion,
      peerVersions: new Map(this.syncState.peerVersions),
      pendingEvents: [...this.syncState.pendingEvents],
      vectorClock: { ...this.syncState.vectorClock },
      lastMerkleRoot: this.syncState.lastMerkleRoot
    }
  }

  /**
   * Get convergence stats
   */
  getStats(): Record<string, any> {
    const maxPeerVersion = Math.max(...this.syncState.peerVersions.values(), 0)
    const consistency = maxPeerVersion > 0 ?
      Math.min(100, (this.syncState.localVersion / maxPeerVersion) * 100) : 100

    return {
      localVersion: this.syncState.localVersion,
      peerVersions: Object.fromEntries(this.syncState.peerVersions),
      eventCount: this.eventHistory.length,
      pendingEvents: this.syncState.pendingEvents.length,
      dataSize: this.stateData.size,
      consistency: Math.round(consistency),
      lastMerkleRoot: this.syncState.lastMerkleRoot.slice(0, 16)
    }
  }

  /**
   * Clear state (for testing)
   */
  clear(): void {
    this.stateData.clear()
    this.eventHistory = []
    this.syncState.pendingEvents = []
    this.syncState.localVersion = 0
    this.syncState.vectorClock = { [this.localNodeId]: 0 }
    this.snapshotHistory = []
    this.merkleCache.clear()
  }
}

export default StateSynchronizer
