import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker, { qpuStepsHolds, qpuStepsOf, qpuTrainOf } from './index.js'

// AUTONOMOUS STEPS ARE COMPUTED FROM THE LATTICE, never chosen: the same lattice gives the same walk, every face once,
// scanner then radar by the hop of rays, and an agent's next move is the first face that does not hold or the face
// after the seat.
test('the walk visits every face once, scanner then radar, and returns by the involution', () => {
  const s = qpuStepsOf()
  assert.equal(qpuStepsHolds(s), true)
  assert.equal(s.walk.length, 14)
  assert.deepEqual(s.walk.map((w) => w.face), [0, 7, 1, 8, 2, 9, 3, 10, 4, 11, 5, 12, 6, 13])
  assert.ok(s.walk.every((w) => w.involution && w.team === (w.face < 7 ? 'scanner' : 'radar') && w.ray === w.face % 7))
  assert.ok(s.walk.every((w) => typeof w.node === 'string' && w.door.tool.startsWith('qpu_') && w.door.path.startsWith('/')))
})

test('with every face holding, the seat is 0, todo is empty, and next is the radar of ray 0', () => {
  const s = qpuStepsOf()
  assert.equal(s.seat, 0)
  assert.deepEqual(s.todo, [])
  assert.equal(s.next.face, 7)
  assert.equal(s.next.team, 'radar')
  assert.deepEqual(qpuStepsOf(), s)
})

test('qpu_train serves the steps, and the MCP reply carries them', async () => {
  const train = qpuTrainOf()
  assert.equal(train.steps.holds, true)
  const res = await worker.fetch(
    new Request('https://qpu.uuidna.com/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'text/html' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'qpu_train', arguments: {} } }),
    }),
    { QPU_HOST: 'qpu.uuidna.com' },
  )
  const body = (await res.json()) as { result: { structuredContent?: { steps?: { seat: number; next: { face: number; door: { tool: string } }; walk: unknown[] } } } }
  const steps = body.result.structuredContent?.steps
  assert.ok(steps)
  assert.equal(steps.walk.length, 14)
  assert.equal(steps.seat, 0)
  assert.equal(steps.next.face, 7)
})
