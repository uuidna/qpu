/**
 * Consensus Engine: PBFT-lite for state consistency
 * 3-phase commit protocol, view changes, quorum management
 */

import crypto from 'crypto'
import {
  ConsensusMessage,
  ConsensusPhase,
  ConsensusDecision,
  ConsensusState,
  ConsensusConfig
} from './types.js'

export class ConsensusEngine {
  private config: ConsensusConfig
  private localNodeId: string
  private clusterSize: number
  private states: Map<number, ConsensusState> = new Map()
  private messageLog: ConsensusMessage[] = []
  private viewChangeRequests: Set<string> = new Set()

  constructor(
    localNodeId: string,
    clusterSize: number,
    config: Partial<ConsensusConfig> = {}
  ) {
    this.localNodeId = localNodeId
    this.clusterSize = clusterSize
    this.config = {
      f: config.f ?? Math.floor((clusterSize - 1) / 3),
      timeout: config.timeout ?? 5000,
      retries: config.retries ?? 3,
      viewChangeTimeout: config.viewChangeTimeout ?? 15000
    }

    console.log(`[Consensus] Engine initialized: f=${this.config.f}, clusterSize=${clusterSize}`)
  }

  /**
   * Propose new state for consensus
   */
  async proposeState(data: any, sequenceNumber: number): Promise<ConsensusDecision> {
    const viewNumber = this.getCurrentViewNumber()
    const digest = this.hash(JSON.stringify(data))

    console.log(`[Consensus] Proposing state: seq=${sequenceNumber}, view=${viewNumber}, digest=${digest.slice(0, 8)}...`)

    // Initialize consensus state
    const consensusState: ConsensusState = {
      viewNumber,
      sequenceNumber,
      currentPhase: 'pre-prepare',
      prepareQuorum: new Set(),
      commitQuorum: new Set(),
      timestamp: Date.now()
    }

    this.states.set(sequenceNumber, consensusState)

    // Phase 1: PRE-PREPARE
    const preMsg: ConsensusMessage = {
      phase: 'pre-prepare',
      viewNumber,
      sequenceNumber,
      senderId: this.localNodeId,
      digest,
      timestamp: Date.now(),
      data
    }

    this.messageLog.push(preMsg)
    consensusState.currentPhase = 'pre-prepare'

    // Wait for prepare messages
    const prepareQuorum = await this.waitForQuorum('prepare', sequenceNumber, this.config.timeout)
    if (!prepareQuorum) {
      console.log(`[Consensus] Pre-prepare failed: no quorum for seq=${sequenceNumber}`)
      return 'abort'
    }

    // Phase 2: PREPARE
    const prepareMsg: ConsensusMessage = {
      phase: 'prepare',
      viewNumber,
      sequenceNumber,
      senderId: this.localNodeId,
      digest,
      timestamp: Date.now()
    }

    this.messageLog.push(prepareMsg)
    consensusState.currentPhase = 'prepare'
    consensusState.prepareQuorum.add(this.localNodeId)

    console.log(`[Consensus] Phase PREPARE: seq=${sequenceNumber}, quorum=${consensusState.prepareQuorum.size}/${this.config.f + 1}`)

    // Wait for commit messages
    const commitQuorum = await this.waitForQuorum('commit', sequenceNumber, this.config.timeout)
    if (!commitQuorum) {
      console.log(`[Consensus] Prepare failed: no quorum for seq=${sequenceNumber}`)
      return 'abort'
    }

    // Phase 3: COMMIT
    const commitMsg: ConsensusMessage = {
      phase: 'commit',
      viewNumber,
      sequenceNumber,
      senderId: this.localNodeId,
      digest,
      timestamp: Date.now()
    }

    this.messageLog.push(commitMsg)
    consensusState.currentPhase = 'commit'
    consensusState.commitQuorum.add(this.localNodeId)

    console.log(`[Consensus] Phase COMMIT: seq=${sequenceNumber}, quorum=${consensusState.commitQuorum.size}/${this.config.f + 1}`)

    // Finalize
    if (consensusState.commitQuorum.size >= this.config.f + 1) {
      consensusState.decision = 'accept'
      consensusState.finalDigest = digest
      console.log(`[Consensus] ✅ Consensus reached for seq=${sequenceNumber}`)
      return 'accept'
    }

    console.log(`[Consensus] ❌ Consensus failed for seq=${sequenceNumber}`)
    return 'reject'
  }

  /**
   * Handle consensus message from peer
   */
  handleMessage(msg: ConsensusMessage): void {
    const seq = msg.sequenceNumber
    const state = this.states.get(seq) || this.initializeState(seq, msg.viewNumber)

    // Verify message validity
    if (!this.isValidMessage(msg)) {
      console.log(`[Consensus] Invalid message: ${msg.phase} from ${msg.senderId}`)
      return
    }

    // Route to appropriate phase handler
    switch (msg.phase) {
      case 'pre-prepare':
        this.handlePrePrepare(msg, state)
        break
      case 'prepare':
        this.handlePrepare(msg, state)
        break
      case 'commit':
        this.handleCommit(msg, state)
        break
    }

    this.messageLog.push(msg)
  }

  /**
   * Handle pre-prepare message
   */
  private handlePrePrepare(msg: ConsensusMessage, state: ConsensusState): void {
    if (state.currentPhase !== 'pre-prepare') {
      console.log(`[Consensus] Pre-prepare received but in phase: ${state.currentPhase}`)
      return
    }

    // Send prepare message back
    const prepareMsg: ConsensusMessage = {
      phase: 'prepare',
      viewNumber: msg.viewNumber,
      sequenceNumber: msg.sequenceNumber,
      senderId: this.localNodeId,
      digest: msg.digest,
      timestamp: Date.now()
    }

    state.prepareQuorum.add(msg.senderId)
    console.log(`[Consensus] Pre-prepare accepted: seq=${msg.sequenceNumber}, digest=${msg.digest.slice(0, 8)}...`)

    // Broadcast prepare
    this.broadcast(prepareMsg)
  }

  /**
   * Handle prepare message
   */
  private handlePrepare(msg: ConsensusMessage, state: ConsensusState): void {
    state.prepareQuorum.add(msg.senderId)

    // Check if we have quorum
    if (state.prepareQuorum.size >= this.config.f + 1 && state.currentPhase === 'pre-prepare') {
      state.currentPhase = 'prepare'

      // Send commit message
      const commitMsg: ConsensusMessage = {
        phase: 'commit',
        viewNumber: msg.viewNumber,
        sequenceNumber: msg.sequenceNumber,
        senderId: this.localNodeId,
        digest: msg.digest,
        timestamp: Date.now()
      }

      console.log(`[Consensus] Prepare quorum reached: seq=${msg.sequenceNumber}, quorum=${state.prepareQuorum.size}`)
      this.broadcast(commitMsg)
    }
  }

  /**
   * Handle commit message
   */
  private handleCommit(msg: ConsensusMessage, state: ConsensusState): void {
    state.commitQuorum.add(msg.senderId)

    // Check if we have quorum
    if (state.commitQuorum.size >= this.config.f + 1 && state.currentPhase === 'prepare') {
      state.currentPhase = 'commit'
      state.decision = 'accept'
      state.finalDigest = msg.digest

      console.log(`[Consensus] Commit quorum reached: seq=${msg.sequenceNumber}, quorum=${state.commitQuorum.size}`)
      console.log(`[Consensus] ✅ State consensus finalized: seq=${msg.sequenceNumber}`)
    }
  }

  /**
   * Broadcast message to all nodes
   */
  private broadcast(msg: ConsensusMessage): void {
    // In real implementation: send via WebSocket/gRPC
    console.log(`[Consensus] Broadcasting ${msg.phase}: seq=${msg.sequenceNumber}, digest=${msg.digest.slice(0, 8)}...`)
  }

  /**
   * Wait for quorum of messages in phase
   */
  private async waitForQuorum(phase: ConsensusPhase, sequenceNumber: number, timeout: number): Promise<boolean> {
    const startTime = Date.now()

    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const state = this.states.get(sequenceNumber)
        if (!state) {
          clearInterval(checkInterval)
          resolve(false)
          return
        }

        const quorumSize = phase === 'prepare' ? state.prepareQuorum.size : state.commitQuorum.size
        if (quorumSize >= this.config.f + 1) {
          clearInterval(checkInterval)
          resolve(true)
          return
        }

        if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval)
          console.log(`[Consensus] Timeout waiting for ${phase} quorum: seq=${sequenceNumber}`)
          resolve(false)
        }
      }, 100)
    })
  }

  /**
   * Request view change (triggered on timeout/failure)
   */
  async requestViewChange(): Promise<boolean> {
    const currentView = this.getCurrentViewNumber()
    const newView = currentView + 1

    console.log(`[Consensus] Initiating view change: ${currentView} → ${newView}`)

    this.viewChangeRequests.add(this.localNodeId)

    // Wait for f+1 view change requests
    const timeout = this.config.viewChangeTimeout
    const startTime = Date.now()

    while (this.viewChangeRequests.size < this.config.f + 1) {
      if (Date.now() - startTime > timeout) {
        console.log(`[Consensus] View change timeout`)
        return false
      }
      await new Promise(r => setTimeout(r, 100))
    }

    console.log(`[Consensus] ✅ View change completed: new view=${newView}`)
    this.viewChangeRequests.clear()
    return true
  }

  /**
   * Validate message
   */
  private isValidMessage(msg: ConsensusMessage): boolean {
    if (!msg.senderId || !msg.digest || msg.sequenceNumber === undefined) {
      return false
    }

    // In real implementation: verify signature, check message ordering, etc.
    return true
  }

  /**
   * Initialize consensus state
   */
  private initializeState(sequenceNumber: number, viewNumber: number): ConsensusState {
    const state: ConsensusState = {
      viewNumber,
      sequenceNumber,
      currentPhase: 'pre-prepare',
      prepareQuorum: new Set(),
      commitQuorum: new Set(),
      timestamp: Date.now()
    }
    this.states.set(sequenceNumber, state)
    return state
  }

  /**
   * Get current view number
   */
  private getCurrentViewNumber(): number {
    if (this.states.size === 0) return 0
    const states = Array.from(this.states.values())
    return Math.max(...states.map(s => s.viewNumber), 0)
  }

  /**
   * Hash utility
   */
  private hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex')
  }

  /**
   * Get consensus state
   */
  getState(sequenceNumber: number): ConsensusState | undefined {
    return this.states.get(sequenceNumber)
  }

  /**
   * Get message log
   */
  getMessageLog(sequenceNumber?: number): ConsensusMessage[] {
    if (sequenceNumber === undefined) return this.messageLog
    return this.messageLog.filter(m => m.sequenceNumber === sequenceNumber)
  }

  /**
   * Get stats
   */
  getStats(): Record<string, any> {
    const decisions = Array.from(this.states.values())
    const accepted = decisions.filter(s => s.decision === 'accept').length
    const rejected = decisions.filter(s => s.decision === 'reject').length

    return {
      consensusRounds: this.states.size,
      accepted,
      rejected,
      messageLogSize: this.messageLog.length,
      viewNumber: this.getCurrentViewNumber(),
      quorumSize: this.config.f + 1
    }
  }

  /**
   * Clear old states
   */
  prune(beforeSequenceNumber: number): void {
    for (const seq of this.states.keys()) {
      if (seq < beforeSequenceNumber) {
        this.states.delete(seq)
      }
    }
  }
}

export default ConsensusEngine
