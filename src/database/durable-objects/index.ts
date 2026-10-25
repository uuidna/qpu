// Durable Objects Module Exports (WAVE 6)
// Coordination, replication queue, conflict resolution, distributed locks

export { ReplicationCoordinator, type ReplicationState, type FailoverState, type ConflictState } from './replication-coordinator.js'
export { DurableObjectIntegration, doIntegration } from './do-integration.js'
