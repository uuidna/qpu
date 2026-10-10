/**
 * Node Registry: Multi-node discovery via gossip + heartbeat
 * Self-healing, low-overhead node membership
 */

import {
  NodeInfo,
  NodeCapability,
  NodeRegistryState,
  GossipMessage,
  GossipConfig
} from './types.js'

let __seq = 0

export class NodeRegistry {
  private state: NodeRegistryState
  private gossipConfig: GossipConfig
  private gossipMessages: Map<string, GossipMessage> = new Map()
  private heartbeatIntervals: Map<string, NodeJS.Timeout> = new Map()
  private gossipInterval: NodeJS.Timeout | null = null
  private messageHandlers: Map<string, Function> = new Map()

  constructor(
    localNodeId: string,
    gossipConfig: Partial<GossipConfig> = {}
  ) {
    this.state = {
      nodes: new Map(),
      localNodeId,
      clusterSize: 1,
      lastSync: Date.now()
    }

    this.gossipConfig = {
      fanout: gossipConfig.fanout ?? 3,
      interval: gossipConfig.interval ?? 5000,
      maxAge: gossipConfig.maxAge ?? 60000
    }
  }

  /**
   * Register this node with capabilities
   */
  registerLocalNode(info: Partial<NodeInfo>): void {
    const node: NodeInfo = {
      id: this.state.localNodeId,
      name: info.name ?? `node-${this.state.localNodeId.slice(0, 8)}`,
      host: info.host ?? 'localhost',
      port: info.port ?? 3000,
      capabilities: info.capabilities ?? [
        {
          type: 'formula',
          name: 'executor',
          maxConcurrent: 10,
          currentLoad: 0
        },
        {
          type: 'compute',
          name: 'cpu',
          affinity: 'general',
          maxConcurrent: 100,
          currentLoad: 0
        },
        {
          type: 'storage',
          name: 'state',
          maxConcurrent: 1000,
          currentLoad: 0
        },
        {
          type: 'sync',
          name: 'merkle',
          maxConcurrent: 50,
          currentLoad: 0
        }
      ],
      version: info.version ?? '0.9.0',
      status: 'healthy',
      lastHeartbeat: Date.now(),
      cpu: info.cpu ?? 0,
      memory: info.memory ?? 0,
      disk: info.disk ?? 0
    }

    this.state.nodes.set(this.state.localNodeId, node)
    console.log(`[Node Registry] Local node ${node.name} registered`)
  }

  /**
   * Discover peer nodes via gossip seed nodes
   */
  async discoverPeers(seedNodes: Partial<NodeInfo>[]): Promise<NodeInfo[]> {
    console.log(`[Node Registry] Discovering peers from ${seedNodes.length} seed nodes...`)

    for (const seed of seedNodes) {
      const seedNode: NodeInfo = {
        id: seed.id ?? `seed-${(__seq++).toString(36).padStart(6, '0')}`,
        name: seed.name ?? 'seed-node',
        host: seed.host ?? 'localhost',
        port: seed.port ?? 3000,
        capabilities: seed.capabilities ?? [],
        version: seed.version ?? '0.9.0',
        status: 'healthy',
        lastHeartbeat: Date.now(),
        cpu: 0,
        memory: 0,
        disk: 0
      }

      this.state.nodes.set(seedNode.id, seedNode)
      this.startHeartbeatFor(seedNode.id)
    }

    // Start gossip protocol
    this.startGossip()

    return Array.from(this.state.nodes.values())
  }

  /**
   * Register peer node
   */
  registerPeerNode(node: NodeInfo): void {
    const existing = this.state.nodes.get(node.id)

    if (existing) {
      existing.lastHeartbeat = Date.now()
      existing.status = 'healthy'
      existing.cpu = node.cpu
      existing.memory = node.memory
      existing.disk = node.disk
    } else {
      this.state.nodes.set(node.id, node)
      console.log(`[Node Registry] Peer node registered: ${node.name}`)
    }

    if (!this.heartbeatIntervals.has(node.id)) {
      this.startHeartbeatFor(node.id)
    }

    // Broadcast via gossip
    this.gossip({
      id: `node-join-${Date.now()}`,
      type: 'node-join',
      sourceNode: this.state.localNodeId,
      timestamp: Date.now(),
      data: node,
      seenBy: new Set([this.state.localNodeId])
    })
  }

  /**
   * Unregister peer node
   */
  unregisterPeerNode(nodeId: string): void {
    this.state.nodes.delete(nodeId)

    const interval = this.heartbeatIntervals.get(nodeId)
    if (interval) {
      clearInterval(interval)
      this.heartbeatIntervals.delete(nodeId)
    }

    console.log(`[Node Registry] Peer node unregistered: ${nodeId}`)

    // Broadcast via gossip
    this.gossip({
      id: `node-leave-${Date.now()}`,
      type: 'node-leave',
      sourceNode: this.state.localNodeId,
      timestamp: Date.now(),
      data: { nodeId },
      seenBy: new Set([this.state.localNodeId])
    })
  }

  /**
   * Get all healthy nodes
   */
  getHealthyNodes(): NodeInfo[] {
    return Array.from(this.state.nodes.values()).filter(
      n => n.status === 'healthy' && Date.now() - n.lastHeartbeat < 30000
    )
  }

  /**
   * Get nodes by capability
   */
  getNodesByCapability(capability: string, affinity?: string): NodeInfo[] {
    return this.getHealthyNodes().filter(n =>
      n.capabilities.some(c =>
        c.type === capability &&
        (!affinity || c.affinity === affinity || c.affinity === 'general')
      )
    )
  }

  /**
   * Get node info
   */
  getNodeInfo(nodeId: string): NodeInfo | undefined {
    return this.state.nodes.get(nodeId)
  }

  /**
   * Get cluster size
   */
  getClusterSize(): number {
    return this.getHealthyNodes().length
  }

  /**
   * Update node load
   */
  updateNodeLoad(nodeId: string, capability: string, load: number): void {
    const node = this.state.nodes.get(nodeId)
    if (!node) return

    const cap = node.capabilities.find(c => c.type === capability)
    if (cap) {
      cap.currentLoad = Math.max(0, Math.min(load, cap.maxConcurrent))
    }
  }

  /**
   * Gossip protocol: broadcast state updates to random peers
   */
  private gossip(message: GossipMessage): void {
    const nodes = this.getHealthyNodes()
    if (nodes.length <= 1) return

    // Random fanout
    const targets = nodes
      .filter(n => n.id !== this.state.localNodeId && !message.seenBy.has(n.id))
      .slice(0, this.gossipConfig.fanout)

    for (const target of targets) {
      message.seenBy.add(target.id)
      // In real implementation: send via WebSocket/gRPC
      console.log(`[Gossip] Sending to ${target.name}: ${message.type}`)
    }

    this.gossipMessages.set(message.id, message)
  }

  /**
   * Handle gossip message from peer
   */
  handleGossipMessage(message: GossipMessage): void {
    if (message.seenBy.has(this.state.localNodeId)) {
      return // Already seen
    }

    message.seenBy.add(this.state.localNodeId)

    // Route to handler
    const handler = this.messageHandlers.get(message.type)
    if (handler) {
      handler(message)
    }

    // Continue gossipping
    this.gossip(message)
  }

  /**
   * Register message handler
   */
  on(messageType: string, handler: Function): void {
    this.messageHandlers.set(messageType, handler)
  }

  /**
   * Start heartbeat monitoring for node
   */
  private startHeartbeatFor(nodeId: string): void {
    if (this.heartbeatIntervals.has(nodeId)) return

    const interval = setInterval(() => {
      const node = this.state.nodes.get(nodeId)
      if (!node) {
        clearInterval(interval)
        this.heartbeatIntervals.delete(nodeId)
        return
      }

      const timeSinceHeartbeat = Date.now() - node.lastHeartbeat

      if (timeSinceHeartbeat > 30000) {
        if (node.status !== 'unhealthy') {
          node.status = 'unhealthy'
          console.log(`[Heartbeat] Node ${node.name} unhealthy (no heartbeat)`)
        }
      } else if (timeSinceHeartbeat > 15000) {
        if (node.status !== 'degraded') {
          node.status = 'degraded'
          console.log(`[Heartbeat] Node ${node.name} degraded`)
        }
      } else if (node.status !== 'healthy') {
        node.status = 'healthy'
        console.log(`[Heartbeat] Node ${node.name} recovered`)
      }
    }, 5000)

    this.heartbeatIntervals.set(nodeId, interval)
  }

  /**
   * Start gossip protocol
   */
  private startGossip(): void {
    if (this.gossipInterval) return

    this.gossipInterval = setInterval(() => {
      // Clean up old messages
      const maxAge = this.gossipConfig.maxAge
      const now = Date.now()

      for (const [id, msg] of this.gossipMessages.entries()) {
        if (now - msg.timestamp > maxAge) {
          this.gossipMessages.delete(id)
        }
      }

      // Periodically send heartbeat
      this.gossip({
        id: `heartbeat-${Date.now()}`,
        type: 'heartbeat',
        sourceNode: this.state.localNodeId,
        timestamp: Date.now(),
        data: this.state.nodes.get(this.state.localNodeId),
        seenBy: new Set([this.state.localNodeId])
      })
    }, this.gossipConfig.interval)

    console.log(`[Gossip] Protocol started (fanout=${this.gossipConfig.fanout}, interval=${this.gossipConfig.interval}ms)`)
  }

  /**
   * Stop gossip protocol
   */
  stopGossip(): void {
    if (this.gossipInterval) {
      clearInterval(this.gossipInterval)
      this.gossipInterval = null
    }

    for (const [, interval] of this.heartbeatIntervals) {
      clearInterval(interval)
    }
    this.heartbeatIntervals.clear()

    console.log(`[Gossip] Protocol stopped`)
  }

  /**
   * Get registry state
   */
  getState(): NodeRegistryState {
    return {
      nodes: new Map(this.state.nodes),
      localNodeId: this.state.localNodeId,
      clusterSize: this.getClusterSize(),
      lastSync: this.state.lastSync
    }
  }

  /**
   * Get topology info
   */
  getTopology(): Record<string, any> {
    const nodes = this.getHealthyNodes()
    return {
      clusterSize: nodes.length,
      nodes: nodes.map(n => ({
        id: n.id,
        name: n.name,
        host: n.host,
        port: n.port,
        status: n.status,
        capabilities: n.capabilities.map(c => `${c.type}:${c.name}`),
        load: n.capabilities.map(c => c.currentLoad / c.maxConcurrent)
      })),
      topology_version: this.state.nodes.size
    }
  }
}

export default NodeRegistry
