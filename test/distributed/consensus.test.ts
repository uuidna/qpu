/**
 * Consensus Engine Tests: PBFT-lite, quorum, view changes
 */

import test from 'node:test'
import assert from 'node:assert'
import ConsensusEngine from '../../src/distributed/consensus.js'

test('ConsensusEngine: Initialize engine', async () => {
  const consensus = new ConsensusEngine('node-1', 3)

  const stats = consensus.getStats()

  assert.strictEqual(stats.quorumSize, 2) // f=1, quorum=f+1=2
  assert.strictEqual(stats.consensusRounds, 0)
  assert.strictEqual(stats.viewNumber, 0)

  console.log('✅ Engine initialization works')
})

test('ConsensusEngine: Propose state', async () => {
  const consensus = new ConsensusEngine('node-1', 3)

  const data = { key: 'value', number: 42 }
  const decision = await consensus.proposeState(data, 1)

  assert(decision === 'accept' || decision === 'reject' || decision === 'abort')

  const state = consensus.getState(1)
  assert(state !== undefined)
  assert.strictEqual(state.sequenceNumber, 1)
  assert.strictEqual(state.currentPhase, 'commit')

  console.log(`✅ State proposal works (decision: ${decision})`)
})

test('ConsensusEngine: Handle pre-prepare message', async () => {
  const consensus = new ConsensusEngine('node-1', 3)

  // Initialize state first
  const data = { test: true }
  await consensus.proposeState(data, 1)

  // Handle pre-prepare message from peer
  consensus.handleMessage({
    phase: 'pre-prepare',
    viewNumber: 0,
    sequenceNumber: 2,
    senderId: 'node-2',
    digest: 'abcd1234',
    timestamp: Date.now(),
    data
  })

  const state = consensus.getState(2)
  assert(state !== undefined)
  assert.strictEqual(state.prepareQuorum.size, 1)
  assert(state.prepareQuorum.has('node-2'))

  console.log('✅ Pre-prepare message handling works')
})

test('ConsensusEngine: Build prepare quorum', async () => {
  const consensus = new ConsensusEngine('node-1', 3)

  const data = { value: 100 }

  // Simulate prepare messages from multiple nodes
  consensus.handleMessage({
    phase: 'pre-prepare',
    viewNumber: 0,
    sequenceNumber: 3,
    senderId: 'node-2',
    digest: 'def5678',
    timestamp: Date.now(),
    data
  })

  consensus.handleMessage({
    phase: 'prepare',
    viewNumber: 0,
    sequenceNumber: 3,
    senderId: 'node-2',
    digest: 'def5678',
    timestamp: Date.now()
  })

  consensus.handleMessage({
    phase: 'prepare',
    viewNumber: 0,
    sequenceNumber: 3,
    senderId: 'node-3',
    digest: 'def5678',
    timestamp: Date.now()
  })

  const state = consensus.getState(3)
  assert(state !== undefined)
  assert.strictEqual(state.prepareQuorum.size, 2)

  console.log('✅ Prepare quorum building works')
})

test('ConsensusEngine: Message log', async () => {
  const consensus = new ConsensusEngine('node-1', 3)

  const data1 = { seq: 1 }
  const data2 = { seq: 2 }

  await consensus.proposeState(data1, 1)
  await consensus.proposeState(data2, 2)

  const allMessages = consensus.getMessageLog()
  assert(allMessages.length > 0)

  const seq1Messages = consensus.getMessageLog(1)
  assert(seq1Messages.length > 0)
  assert(seq1Messages.every(m => m.sequenceNumber === 1))

  const seq2Messages = consensus.getMessageLog(2)
  assert(seq2Messages.length > 0)
  assert(seq2Messages.every(m => m.sequenceNumber === 2))

  console.log(`✅ Message log tracking works (${allMessages.length} total)`)
})

test('ConsensusEngine: Stats', async () => {
  const consensus = new ConsensusEngine('node-1', 4)

  // Propose multiple states
  const data = { test: true }
  for (let i = 1; i <= 3; i++) {
    await consensus.proposeState(data, i)
  }

  const stats = consensus.getStats()

  assert.strictEqual(stats.consensusRounds, 3)
  assert(stats.accepted >= 0)
  assert(stats.rejected >= 0)
  assert.strictEqual(stats.quorumSize, 2)
  assert(stats.messageLogSize > 0)

  console.log(`✅ Stats work: ${stats.consensusRounds} rounds, ${stats.accepted} accepted`)
})

test('ConsensusEngine: Prune old states', async () => {
  const consensus = new ConsensusEngine('node-1', 3)

  // Propose states 1-5
  for (let i = 1; i <= 5; i++) {
    await consensus.proposeState({ seq: i }, i)
  }

  // Check all exist
  let stats = consensus.getStats()
  assert.strictEqual(stats.consensusRounds, 5)

  // Prune states before 3
  consensus.prune(3)

  // Check pruning worked
  assert.strictEqual(consensus.getState(1), undefined)
  assert.strictEqual(consensus.getState(2), undefined)
  assert(consensus.getState(3) !== undefined)
  assert(consensus.getState(4) !== undefined)
  assert(consensus.getState(5) !== undefined)

  console.log('✅ Pruning old states works')
})

test('ConsensusEngine: View change', async () => {
  const consensus = new ConsensusEngine('node-1', 3)

  const initialView = consensus.getStats().viewNumber
  assert.strictEqual(initialView, 0)

  // Request view change (in real system: triggered by timeout)
  const success = await consensus.requestViewChange()

  // Note: This will timeout since we don't have f+1 nodes
  // In real system, the view change would be handled by actual peers
  assert.strictEqual(success, false) // Timeout expected

  console.log('✅ View change handling works')
})

console.log(`
╔════════════════════════════════════════════════════════════════════════════════╗
║                    CONSENSUS ENGINE TESTS COMPLETE                            ║
╚════════════════════════════════════════════════════════════════════════════════╝
`)
