/**
 * State Synchronization Tests: Vector clocks, Merkle trees, eventual consistency
 */

import test from 'node:test'
import assert from 'node:assert'
import StateSynchronizer from '../../src/distributed/state-sync.js'

test('StateSynchronizer: Initialize', async () => {
  const sync = new StateSynchronizer('node-1')

  const state = sync.getSyncState()

  assert.strictEqual(state.localVersion, 0)
  assert.strictEqual(state.peerVersions.size, 0)
  assert.strictEqual(state.pendingEvents.length, 0)
  assert(state.vectorClock['node-1'] === 0)

  console.log('✅ Initialization works')
})

test('StateSynchronizer: Update state', async () => {
  const sync = new StateSynchronizer('node-1')

  sync.updateState('key1', 'value1')
  sync.updateState('key2', 42)
  sync.updateState('key3', { nested: 'object' })

  const state = sync.getSyncState()

  assert.strictEqual(state.localVersion, 3)
  assert.strictEqual(state.vectorClock['node-1'], 3)
  assert.strictEqual(state.pendingEvents.length, 3)

  // Verify values
  assert.strictEqual(sync.getState('key1')?.value, 'value1')
  assert.strictEqual(sync.getState('key2')?.value, 42)
  assert.deepStrictEqual(sync.getState('key3')?.value, { nested: 'object' })

  console.log('✅ State updates work')
})

test('StateSynchronizer: Delete state', async () => {
  const sync = new StateSynchronizer('node-1')

  sync.updateState('key1', 'value1')
  assert(sync.getState('key1') !== undefined)

  sync.deleteState('key1')
  assert(sync.getState('key1') === undefined)

  const state = sync.getSyncState()
  assert.strictEqual(state.localVersion, 2)
  assert.strictEqual(state.pendingEvents.length, 2)

  console.log('✅ State deletion works')
})

test('StateSynchronizer: Create snapshot', async () => {
  const sync = new StateSynchronizer('node-1')

  sync.updateState('data1', 'value1')
  sync.updateState('data2', 'value2')

  const snapshot = sync.createSnapshot()

  assert.strictEqual(snapshot.version, 2)
  assert.strictEqual(snapshot.nodeId, 'node-1')
  assert(snapshot.timestamp > 0)
  assert(snapshot.merkleRoot.length > 0)
  assert(snapshot.checksum.length > 0)

  console.log(`✅ Snapshot creation works (root: ${snapshot.merkleRoot.slice(0, 16)})`)
})

test('StateSynchronizer: Merge state from peer', async () => {
  const sync = new StateSynchronizer('node-1')

  // Update local state
  sync.updateState('local_key', 'local_value')

  // Create event from peer
  const peerEvent = {
    type: 'update' as const,
    key: 'peer_key',
    value: 'peer_value',
    timestamp: Date.now(),
    sourceNode: 'node-2',
    vectorClock: { 'node-2': 1, 'node-1': 0 }
  }

  const merged = sync.mergeState(peerEvent, 'node-2')

  assert.strictEqual(merged, true)
  assert(sync.getState('peer_key') !== undefined)

  const state = sync.getSyncState()
  assert.strictEqual(state.peerVersions.get('node-2'), 1)

  console.log('✅ State merging from peer works')
})

test('StateSynchronizer: Vector clock causality', async () => {
  const sync = new StateSynchronizer('node-1')

  // Update local state twice
  sync.updateState('v1', 'value1')
  sync.updateState('v2', 'value2')

  // Non-causal event (should be buffered)
  const nonCausalEvent = {
    type: 'update' as const,
    key: 'nc_key',
    value: 'nc_value',
    timestamp: Date.now(),
    sourceNode: 'node-2',
    vectorClock: { 'node-2': 1, 'node-1': 99 } // node-1 clock ahead of ours
  }

  const merged = sync.mergeState(nonCausalEvent, 'node-2')

  assert.strictEqual(merged, false) // Should be buffered, not merged

  console.log('✅ Vector clock causality detection works')
})

test('StateSynchronizer: Merkle tree verification', async () => {
  const sync1 = new StateSynchronizer('node-1')
  const sync2 = new StateSynchronizer('node-2')

  // Both nodes have same data
  sync1.updateState('key1', 'value1')
  sync1.updateState('key2', 'value2')

  sync2.updateState('key1', 'value1')
  sync2.updateState('key2', 'value2')

  // Create snapshots
  const snap1 = sync1.createSnapshot()
  const snap2 = sync2.createSnapshot()

  // Merkle roots should match
  assert.strictEqual(snap1.merkleRoot, snap2.merkleRoot)
  assert.strictEqual(snap1.checksum, snap2.checksum)

  // Verify using getStateForSync
  const state1 = sync1.getStateForSync()
  const verification = sync2.verifyPeerState(snap1, state1.data)

  assert.strictEqual(verification.consistent, true)

  console.log('✅ Merkle tree verification works')
})

test('StateSynchronizer: Detect inconsistency', async () => {
  const sync1 = new StateSynchronizer('node-1')
  const sync2 = new StateSynchronizer('node-2')

  // Different data
  sync1.updateState('key1', 'value1')
  sync1.updateState('key2', 'value2-original')

  sync2.updateState('key1', 'value1')
  sync2.updateState('key2', 'value2-modified')

  // Create snapshots
  const snap1 = sync1.createSnapshot()

  // Verify from sync2
  const state1 = sync1.getStateForSync()
  const verification = sync2.verifyPeerState(snap1, state1.data)

  // Roots should match since sync1's data is consistent
  assert.strictEqual(verification.consistent, true)

  // But if we verify with different data
  const badVerification = sync2.verifyPeerState(snap1, {
    key1: 'value1',
    key2: 'value2-tampered'
  })

  assert.strictEqual(badVerification.consistent, false)

  console.log('✅ Inconsistency detection works')
})

test('StateSynchronizer: Stats', async () => {
  const sync = new StateSynchronizer('node-1')

  sync.updateState('k1', 'v1')
  sync.updateState('k2', 'v2')
  sync.updateState('k3', 'v3')

  // Simulate peer versions
  sync.mergeState({
    type: 'update',
    key: 'peer_k',
    value: 'peer_v',
    timestamp: Date.now(),
    sourceNode: 'node-2',
    vectorClock: { 'node-1': 3, 'node-2': 1 }
  }, 'node-2')

  const stats = sync.getStats()

  assert.strictEqual(stats.localVersion, 4)
  assert.strictEqual(stats.dataSize, 4)
  assert.strictEqual(stats.eventCount, 4)
  assert(stats.consistency > 0)
  assert(stats.lastMerkleRoot.length > 0)

  console.log(`✅ Stats work: version=${stats.localVersion}, consistency=${stats.consistency}%`)
})

test('StateSynchronizer: Clear state', async () => {
  const sync = new StateSynchronizer('node-1')

  sync.updateState('k1', 'v1')
  sync.updateState('k2', 'v2')

  let state = sync.getSyncState()
  assert.strictEqual(state.localVersion, 2)

  sync.clear()

  state = sync.getSyncState()
  assert.strictEqual(state.localVersion, 0)
  assert.strictEqual(state.pendingEvents.length, 0)
  assert(sync.getState('k1') === undefined)

  console.log('✅ State clearing works')
})

console.log(`
╔════════════════════════════════════════════════════════════════════════════════╗
║                    STATE SYNC TESTS COMPLETE                                  ║
╚════════════════════════════════════════════════════════════════════════════════╝
`)
