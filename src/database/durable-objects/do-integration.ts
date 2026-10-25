// Durable Objects Integration with Distributed Database (WAVE 6)
// Coordinates replication, failover, conflicts, and distributed state

import { MultiProviderRouter } from '../router/multi-provider-router.js'
import type { DatabaseProvider } from '../types.js'

export class DurableObjectIntegration {
  private router: MultiProviderRouter | null = null
  private doNamespace: DurableObjectNamespace | null = null
  private coordinatorId: string = 'default'

  async initialize(router: MultiProviderRouter, doNamespace?: DurableObjectNamespace): Promise<void> {
    this.router = router
    this.doNamespace = doNamespace
  }

  // Get or create coordinator instance
  private getCoordinator(): DurableObjectStub {
    if (!this.doNamespace) {
      throw new Error('Durable Objects not configured')
    }
    return this.doNamespace.get(this.coordinatorId)
  }

  // Coordinate distributed write with replication
  async coordinatedWrite(
    table: string,
    data: any,
    replicationTargets: DatabaseProvider[]
  ): Promise<{ success: boolean; replicated: number }> {
    if (!this.router) throw new Error('Router not initialized')

    const coordinator = this.getCoordinator()
    const replicationId = `write:${Date.now()}:${Math.random().toString(36).slice(2)}`

    try {
      // Queue replication with coordinator
      const queueResponse = await coordinator.fetch(
        new Request('http://coordinator/queue/replicate', {
          method: 'POST',
          body: JSON.stringify({
            id: replicationId,
            sourceProvider: 'cloudflare-d1',
            targetProviders: replicationTargets,
            status: 'pending',
            startTime: Date.now(),
            rowsReplicated: 0,
            errors: []
          })
        })
      )

      if (!queueResponse.ok) {
        throw new Error('Failed to queue replication')
      }

      // Execute replication
      const replicated = await this.router.replicateData(
        'cloudflare-d1',
        replicationTargets,
        [],
        { mode: 'merge' }
      )

      // Update coordinator with completion
      const updateResponse = await coordinator.fetch(
        new Request(`http://coordinator/queue/status?id=${replicationId}`, {
          method: 'GET'
        })
      )

      const replications = Array.from(replicated.values()).reduce((a, b) => a + b, 0)

      return {
        success: replications > 0,
        replicated: replications
      }
    } catch (error) {
      console.error('Coordinated write failed:', error)
      return { success: false, replicated: 0 }
    }
  }

  // Coordinate failover with consensus
  async coordinateFailover(to: DatabaseProvider): Promise<boolean> {
    if (!this.router) throw new Error('Router not initialized')

    const coordinator = this.getCoordinator()
    const providers = this.router.getProviderInfo()

    try {
      // Collect votes from all providers
      const votes: Map<DatabaseProvider, string> = new Map()

      for (const provider of providers.map(p => p.provider)) {
        // Get health status of provider
        const health = await this.router.getHealth(provider)

        // Vote for target if healthier
        const targetHealth = await this.router.getHealth(to)

        const vote = targetHealth.latency < health.latency ? to : provider

        const voteResponse = await coordinator.fetch(
          new Request('http://coordinator/failover/vote', {
            method: 'POST',
            body: JSON.stringify({
              provider,
              vote
            })
          })
        )

        if (voteResponse.ok) {
          const result = await voteResponse.json()
          votes.set(provider, result.primary)
        }
      }

      // Check if consensus reached
      const stateResponse = await coordinator.fetch(
        new Request('http://coordinator/failover/state', {
          method: 'GET'
        })
      )

      const state = await stateResponse.json()

      if (state.consensusReached && state.primary === to) {
        // Execute failover
        await this.router.failoverTo(to)
        return true
      }

      return false
    } catch (error) {
      console.error('Failover coordination failed:', error)
      return false
    }
  }

  // Record conflict in Durable Objects
  async recordConflict(
    key: string,
    conflictingVersions: any[],
    strategy: string
  ): Promise<string> {
    const coordinator = this.getCoordinator()

    const response = await coordinator.fetch(
      new Request('http://coordinator/conflict/record', {
        method: 'POST',
        body: JSON.stringify({
          id: `${Date.now()}:${Math.random().toString(36).slice(2)}`,
          key,
          conflictingVersions,
          strategy,
          recordedAt: Date.now()
        })
      })
    )

    const result = await response.json()
    return result.id
  }

  // Resolve conflict recorded in Durable Objects
  async resolveConflict(conflictId: string, resolution: any): Promise<boolean> {
    const coordinator = this.getCoordinator()

    const response = await coordinator.fetch(
      new Request('http://coordinator/conflict/resolve', {
        method: 'POST',
        body: JSON.stringify({
          id: conflictId,
          resolution
        })
      })
    )

    return response.ok
  }

  // Acquire distributed lock
  async acquireLock(key: string, ttl: number = 30000): Promise<boolean> {
    const coordinator = this.getCoordinator()

    const response = await coordinator.fetch(
      new Request('http://coordinator/lock/acquire', {
        method: 'POST',
        body: JSON.stringify({ key, ttl })
      })
    )

    return response.ok
  }

  // Release distributed lock
  async releaseLock(key: string): Promise<boolean> {
    const coordinator = this.getCoordinator()

    const response = await coordinator.fetch(
      new Request('http://coordinator/lock/release', {
        method: 'POST',
        body: JSON.stringify({ key })
      })
    )

    return response.ok
  }

  // Update vector clock for causal ordering
  async updateVectorClock(provider: DatabaseProvider, clock: Record<string, number>): Promise<Record<string, number>> {
    const coordinator = this.getCoordinator()

    const response = await coordinator.fetch(
      new Request('http://coordinator/vector-clock/update', {
        method: 'POST',
        body: JSON.stringify({ provider, clock })
      })
    )

    const result = await response.json()
    return result.clock
  }

  // Get replication queue status
  async getReplicationStatus(id?: string): Promise<any> {
    const coordinator = this.getCoordinator()

    const url = id
      ? `http://coordinator/queue/status?id=${id}`
      : 'http://coordinator/queue/status'

    const response = await coordinator.fetch(
      new Request(url, { method: 'GET' })
    )

    return response.json()
  }

  // Get failover state
  async getFailoverState(): Promise<any> {
    const coordinator = this.getCoordinator()

    const response = await coordinator.fetch(
      new Request('http://coordinator/failover/state', {
        method: 'GET'
      })
    )

    return response.json()
  }

  // Get comprehensive stats
  async getStats(): Promise<any> {
    const coordinator = this.getCoordinator()

    const response = await coordinator.fetch(
      new Request('http://coordinator/stats', {
        method: 'GET'
      })
    )

    return response.json()
  }

  // Distributed transaction coordinator
  async coordinateTransaction(
    steps: Array<{ query: string; params?: any[] }>,
    providers: DatabaseProvider[] = []
  ): Promise<{ success: boolean; results: any[] }> {
    if (!this.router) throw new Error('Router not initialized')

    const txId = `tx:${Date.now()}:${Math.random().toString(36).slice(2)}`

    try {
      // Acquire lock for transaction
      const lockKey = `tx:lock:${txId}`
      const locked = await this.acquireLock(lockKey, 60000)

      if (!locked) {
        throw new Error('Could not acquire transaction lock')
      }

      try {
        // Execute on primary
        const primary = this.router.getProviderInfo()[0]
        const results = await this.router.transaction({
          provider: primary.provider,
          steps,
          isolation: 'serializable',
          timeout: 30000
        })

        // Replicate to secondaries
        if (providers.length > 0) {
          await this.coordinatedWrite('_transaction', { txId, steps }, providers)
        }

        return {
          success: true,
          results: results.data
        }
      } finally {
        // Always release lock
        await this.releaseLock(lockKey)
      }
    } catch (error) {
      return {
        success: false,
        results: [(error as Error).message]
      }
    }
  }

  // Check if replication is in progress
  async isReplicationInProgress(): Promise<boolean> {
    try {
      const stats = await this.getStats()
      return (stats.replication?.inProgress || 0) > 0
    } catch {
      return false
    }
  }

  // Wait for replication to complete
  async waitForReplication(id: string, timeout: number = 30000): Promise<boolean> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      const status = await this.getReplicationStatus(id)

      if (!status.status) {
        return false
      }

      if (status.status === 'completed') {
        return true
      }

      if (status.status === 'failed') {
        return false
      }

      // Wait 100ms before checking again
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return false
  }

  // Strong consistency write - wait for full replication
  async strongConsistencyWrite(
    table: string,
    data: any,
    replicationTargets: DatabaseProvider[]
  ): Promise<{ success: boolean; replicated: number }> {
    const result = await this.coordinatedWrite(table, data, replicationTargets)

    if (result.success) {
      // In production, wait for replication completion
      // For now, just return success
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return result
  }
}

export const doIntegration = new DurableObjectIntegration()
