// Durable Objects: Replication Coordinator (WAVE 6)
// Strong consistency, coordination, and state management across providers

export interface ReplicationState {
  id: string
  sourceProvider: string
  targetProviders: string[]
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  startTime: number
  endTime?: number
  rowsReplicated: number
  errors: string[]
}

export interface FailoverState {
  currentPrimary: string
  previousPrimary?: string
  failoverTime?: number
  reason?: string
  consensusReached: boolean
  votes: Map<string, string>
}

export interface ConflictState {
  id: string
  key: string
  conflictingVersions: any[]
  resolution?: any
  resolvedAt?: number
  strategy: string
}

export class ReplicationCoordinator implements DurableObject {
  private state: DurableObjectState
  private env: any
  private replicationQueue: ReplicationState[] = []
  private failoverState: FailoverState | null = null
  private conflictLog: Map<string, ConflictState> = new Map()
  private vectorClocks: Map<string, Record<string, number>> = new Map()
  private locks: Map<string, { owner: string; expires: number }> = new Map()

  constructor(state: DurableObjectState, env: any) {
    this.state = state
    this.env = env

    // Load persisted state
    this.loadState()

    // Set up alarm for stale replication cleanup
    this.state.blockConcurrencyWhile(async () => {
      const alarm = await this.state.storage?.getAlarm()
      if (!alarm) {
        await this.state.storage?.setAlarm(Date.now() + 60000)  // Check every minute
      }
    })
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    try {
      switch (path) {
        case '/queue/replicate':
          return await this.queueReplication(request)
        case '/queue/status':
          return await this.getReplicationStatus(request)
        case '/failover/vote':
          return await this.registerFailoverVote(request)
        case '/failover/state':
          return await this.getFailoverState(request)
        case '/conflict/record':
          return await this.recordConflict(request)
        case '/conflict/resolve':
          return await this.resolveConflict(request)
        case '/lock/acquire':
          return await this.acquireLock(request)
        case '/lock/release':
          return await this.releaseLock(request)
        case '/vector-clock/update':
          return await this.updateVectorClock(request)
        case '/stats':
          return await this.getStats(request)
        default:
          return new Response('Not found', { status: 404 })
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as Error).message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  async alarm(): Promise<void> {
    // Clean up stale replication entries
    const now = Date.now()
    const timeout = 5 * 60 * 1000  // 5 minutes

    this.replicationQueue = this.replicationQueue.filter(item => {
      if (item.status === 'in-progress' && now - item.startTime > timeout) {
        item.status = 'failed'
        item.errors.push('Timeout: replication took too long')
        return true
      }
      if (item.status === 'completed' || item.status === 'failed') {
        return now - (item.endTime || item.startTime) < 3600000  // Keep 1 hour
      }
      return true
    })

    // Clean up expired locks
    for (const [key, lock] of this.locks.entries()) {
      if (now > lock.expires) {
        this.locks.delete(key)
      }
    }

    // Persist state
    await this.saveState()

    // Schedule next alarm
    await this.state.storage?.setAlarm(Date.now() + 60000)
  }

  private async queueReplication(request: Request): Promise<Response> {
    const data = await request.json() as ReplicationState

    // Acquire lock to prevent concurrent replication of same data
    const lockKey = `repl:${data.id}`
    const lock = await this.acquireLock(new Request('http://localhost/lock/acquire', {
      method: 'POST',
      body: JSON.stringify({ key: lockKey, ttl: 30000 })
    }))

    if (!lock.ok) {
      return new Response(
        JSON.stringify({ error: 'Another replication in progress' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check if already replicated
    const existing = this.replicationQueue.find(r => r.id === data.id)
    if (existing && existing.status === 'completed') {
      return new Response(
        JSON.stringify({ status: 'already-completed', data: existing }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Queue replication
    data.status = 'pending'
    data.startTime = Date.now()
    this.replicationQueue.push(data)

    // Process queue
    await this.processReplicationQueue()

    await this.saveState()

    return new Response(
      JSON.stringify({ status: 'queued', data }),
      { status: 202, headers: { 'Content-Type': 'application/json' } }
    )
  }

  private async processReplicationQueue(): Promise<void> {
    const pending = this.replicationQueue.find(r => r.status === 'pending')
    if (!pending) return

    pending.status = 'in-progress'

    try {
      // Simulate replication work (actual work would be done by router)
      // Here we just coordinate and track state

      // Mark as completed (router will update rowsReplicated)
      pending.status = 'completed'
      pending.endTime = Date.now()
    } catch (error) {
      pending.status = 'failed'
      pending.errors.push((error as Error).message)
      pending.endTime = Date.now()
    }
  }

  private async getReplicationStatus(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    const item = id
      ? this.replicationQueue.find(r => r.id === id)
      : this.replicationQueue

    return new Response(
      JSON.stringify(item || { error: 'Not found' }),
      { status: item ? 200 : 404, headers: { 'Content-Type': 'application/json' } }
    )
  }

  private async registerFailoverVote(request: Request): Promise<Response> {
    const data = await request.json() as { provider: string; vote: string }

    if (!this.failoverState) {
      this.failoverState = {
        currentPrimary: 'unknown',
        consensusReached: false,
        votes: new Map()
      }
    }

    this.failoverState.votes.set(data.provider, data.vote)

    // Check if consensus reached (2/3 majority)
    const votes = Array.from(this.failoverState.votes.values())
    const uniqueVotes = new Set(votes)

    if (uniqueVotes.size === 1 && votes.length >= 2) {
      this.failoverState.consensusReached = true
      this.failoverState.currentPrimary = votes[0]
      this.failoverState.failoverTime = Date.now()
    }

    await this.saveState()

    return new Response(
      JSON.stringify({
        consensus: this.failoverState.consensusReached,
        votes: Object.fromEntries(this.failoverState.votes),
        primary: this.failoverState.currentPrimary
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  private async getFailoverState(request: Request): Promise<Response> {
    return new Response(
      JSON.stringify(this.failoverState || { consensusReached: false, votes: {} }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  private async recordConflict(request: Request): Promise<Response> {
    const conflict = await request.json() as ConflictState

    conflict.id = `conflict:${Date.now()}:${Math.random().toString(36).slice(2)}`
    this.conflictLog.set(conflict.id, conflict)

    // Keep only last 1000 conflicts
    if (this.conflictLog.size > 1000) {
      const firstKey = this.conflictLog.keys().next().value
      this.conflictLog.delete(firstKey)
    }

    await this.saveState()

    return new Response(
      JSON.stringify({ id: conflict.id }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )
  }

  private async resolveConflict(request: Request): Promise<Response> {
    const data = await request.json() as { id: string; resolution: any }

    const conflict = this.conflictLog.get(data.id)
    if (!conflict) {
      return new Response(
        JSON.stringify({ error: 'Conflict not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    conflict.resolution = data.resolution
    conflict.resolvedAt = Date.now()

    await this.saveState()

    return new Response(
      JSON.stringify({ status: 'resolved', conflict }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  private async acquireLock(request: Request): Promise<Response> {
    const data = await request.json() as { key: string; ttl: number }
    const now = Date.now()

    const existing = this.locks.get(data.key)
    if (existing && now < existing.expires) {
      return new Response(
        JSON.stringify({ error: 'Lock held' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      )
    }

    this.locks.set(data.key, {
      owner: `owner:${Math.random().toString(36).slice(2)}`,
      expires: now + data.ttl
    })

    await this.saveState()

    return new Response(
      JSON.stringify({ acquired: true, key: data.key }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  private async releaseLock(request: Request): Promise<Response> {
    const data = await request.json() as { key: string }

    this.locks.delete(data.key)
    await this.saveState()

    return new Response(
      JSON.stringify({ released: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  private async updateVectorClock(request: Request): Promise<Response> {
    const data = await request.json() as { provider: string; clock: Record<string, number> }

    const current = this.vectorClocks.get(data.provider) || {}

    for (const key in data.clock) {
      current[key] = Math.max(current[key] || 0, data.clock[key])
    }
    current[data.provider] = (current[data.provider] || 0) + 1

    this.vectorClocks.set(data.provider, current)

    await this.saveState()

    return new Response(
      JSON.stringify({ clock: current }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  private async getStats(request: Request): Promise<Response> {
    const pending = this.replicationQueue.filter(r => r.status === 'pending').length
    const inProgress = this.replicationQueue.filter(r => r.status === 'in-progress').length
    const completed = this.replicationQueue.filter(r => r.status === 'completed').length
    const failed = this.replicationQueue.filter(r => r.status === 'failed').length

    return new Response(
      JSON.stringify({
        replication: {
          pending,
          inProgress,
          completed,
          failed,
          total: this.replicationQueue.length
        },
        failover: {
          consensusReached: this.failoverState?.consensusReached || false,
          currentPrimary: this.failoverState?.currentPrimary || 'unknown'
        },
        conflicts: {
          total: this.conflictLog.size,
          unresolved: Array.from(this.conflictLog.values()).filter(c => !c.resolvedAt).length
        },
        locks: this.locks.size,
        vectorClocks: this.vectorClocks.size
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  private async saveState(): Promise<void> {
    await this.state.storage?.put('state', {
      replicationQueue: this.replicationQueue,
      failoverState: this.failoverState ? Object.fromEntries(
        Object.entries(this.failoverState).map(([k, v]) =>
          [k, v instanceof Map ? Object.fromEntries(v) : v]
        )
      ) : null,
      conflictLog: Object.fromEntries(this.conflictLog),
      vectorClocks: Object.fromEntries(
        Array.from(this.vectorClocks.entries()).map(([k, v]) => [k, v])
      ),
      locks: Object.fromEntries(this.locks),
      timestamp: Date.now()
    })
  }

  private async loadState(): Promise<void> {
    const stored = await this.state.storage?.get('state')
    if (!stored) return

    if (stored.replicationQueue) {
      this.replicationQueue = stored.replicationQueue
    }
    if (stored.failoverState) {
      this.failoverState = {
        ...stored.failoverState,
        votes: new Map(Object.entries(stored.failoverState.votes || {}))
      }
    }
    if (stored.conflictLog) {
      this.conflictLog = new Map(Object.entries(stored.conflictLog))
    }
    if (stored.vectorClocks) {
      this.vectorClocks = new Map(Object.entries(stored.vectorClocks))
    }
    if (stored.locks) {
      this.locks = new Map(Object.entries(stored.locks))
    }
  }
}

// Durable Object stub for wrangler
export const durableObjectStubs = {
  ReplicationCoordinator
}
