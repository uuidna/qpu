import { test } from 'node:test'
import assert from 'node:assert/strict'
import { QPU_HOST, VE_FACES } from './hologram.js'
import { QPU_EVENT_KINDS, QPU_EVENT_LISTEN } from './events.js'
import { QPU_MESSENGER_UUID } from './messenger.js'
import {
  qpuChatFrameHolds, qpuChatFrameOf, qpuChatHolds, qpuChatInputOf, qpuChatMapOf, qpuChatOf,
} from './chat.js'
import { handleQpuFetch } from './edge.js'
import { qpuMcpCall } from './mcp-catalog.js'
import { qpuWsFrameOf } from './scale.js'

test('realtime chat handles every input kind and every listen type', () => {
  const c = qpuChatOf()
  assert.equal(c.kind, 'chat')
  assert.equal(c.realtime, true)
  assert.equal(c.billed, 'user')
  assert.equal(c.occupancy, 'probe')
  assert.equal(c.messenger, 'uuid')
  assert.equal(c.when, 'never')
  assert.equal(c.seat, 'empty')
  assert.equal(c.inputs.length, VE_FACES)
  assert.equal(c.listen.length, QPU_EVENT_LISTEN.length)
  assert.equal(c.signal, `wss://${QPU_HOST}/ws`)
  assert.equal(new URL(c.bindings).pathname, '/bindings')
  for (const t of QPU_EVENT_LISTEN) assert.equal(qpuChatMapOf(t).ok, true, t)
  for (const k of QPU_EVENT_KINDS) {
    const hit = qpuChatInputOf({ type: k, id: QPU_MESSENGER_UUID })
    assert.equal(hit.ok, true, k)
  }
  assert.equal(qpuChatHolds(c), true)
})

test('chat messages require the uuid messenger; unknown input and handmade accounts refuse', () => {
  const ok = qpuChatInputOf({ type: 'paste', id: QPU_MESSENGER_UUID, text: 'hello' })
  assert.equal(ok.ok, true)
  if (ok.ok) {
    assert.equal(ok.kind, 'clipboard')
    assert.equal(ok.billed, false)
    assert.equal(ok.occupancy, 'probe')
  }
  const paid = qpuChatInputOf({ type: 'input', id: QPU_MESSENGER_UUID, text: 'hello', account: QPU_MESSENGER_UUID })
  assert.equal(paid.ok, true)
  if (paid.ok) assert.equal(paid.billed, 'user')
  const noId = qpuChatInputOf({ type: 'keydown', id: 'not-a-uuid' })
  assert.equal(noId.ok, false)
  if (!noId.ok) assert.equal(noId.error, 'licence: messenger refused')
  const noAccount = qpuChatInputOf({ type: 'keydown', id: QPU_MESSENGER_UUID, text: 'x', account: 'user-1' })
  assert.equal(noAccount.ok, false)
  if (!noAccount.ok) assert.equal(noAccount.error, 'licence: account refused')
  const unknown = qpuChatInputOf({ type: 'no-such-event', id: QPU_MESSENGER_UUID })
  assert.equal(unknown.ok, false)
  assert.equal('/chip'.startsWith('/chat'), false)
  assert.equal('/room'.startsWith('/robots'), false)
})

test('GET /chat and /room and MCP qpu_chat / qpu_input; /ws frames input; seat stays seat', async () => {
  const res = await handleQpuFetch(new Request(`https://${QPU_HOST}/chat`))
  assert.equal(res.status, 200)
  const body = await res.json() as { kind: string; holds: boolean; billed: string }
  assert.equal(body.kind, 'chat')
  assert.equal(body.holds, true)
  assert.equal(body.billed, 'user')
  const room = await handleQpuFetch(new Request(`https://${QPU_HOST}/room`))
  assert.equal((await room.json() as { kind: string }).kind, 'chat')
  const mcp = await qpuMcpCall('qpu_chat', {}) as { holds: boolean }
  assert.equal(mcp.holds, true)
  const one = await qpuMcpCall('qpu_input', { type: 'wheel', id: QPU_MESSENGER_UUID }) as { ok: boolean; kind: string }
  assert.equal(one.ok, true)
  assert.equal(one.kind, 'wheel')
  const frame = await qpuWsFrameOf(JSON.stringify({
    op: 'chat', type: 'input', id: QPU_MESSENGER_UUID, text: 'all input',
  })) as { ok: boolean; kind: string; billed: false | 'user' }
  assert.equal(frame.ok, true)
  assert.equal(frame.kind, 'input')
  assert.equal(frame.billed, false)
  const seat = await qpuWsFrameOf(JSON.stringify({ op: 'seat' })) as { seat: string }
  assert.equal(seat.seat, 'empty')
  assert.equal(qpuChatFrameHolds({ op: 'seat' }), false)
  assert.equal(qpuChatFrameOf({ type: 'click', id: QPU_MESSENGER_UUID }).ok, true)
})
