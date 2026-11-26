// The messaging tools against an in-memory room with the Mailbox's contract: ordered sequence numbers, a reader's view,
// the per-minute share and the retention. The Durable Object's SQL itself answers in the Worker (wrangler dev e2e).
import test from 'node:test'
import assert from 'node:assert/strict'
import { LIMITS, MESSAGING_TOOLS, callMessaging, type Limits, type MailboxNamespace, type Posted } from './index.ts'

const memory = (): MailboxNamespace => {
  const rooms = new Map<string, { seq: number; rows: (Posted & { t: number })[] }>()
  return { getByName: (name) => {
    const room = rooms.get(name) ?? rooms.set(name, { seq: 0, rows: [] }).get(name)!
    return {
      post: async (from: string, to: string | null, text: string, at: number, limits: Limits) => {
        if (room.rows.filter((r) => r.t > at - 60_000).length >= limits.perMinute) return { refused: 'rate' as const }
        room.rows.push({ seq: ++room.seq, from, to, text, at: new Date(at).toISOString(), t: at })
        room.rows = room.rows.filter((r) => r.seq > room.seq - limits.keep && r.t >= at - limits.ttlMs)
        return { seq: room.seq }
      },
      read: async (after: number, reader: string | null, limit: number) => room.rows.filter((r) => r.seq > after && (reader === null || r.to === null || r.to === reader || r.from === reader)).slice(0, limit).map(({ t: _t, ...m }) => m),
    }
  } }
}
const room = '6f1c2a3e8b4d4c5e9f60718293a4b5c6'.repeat(2)
const s = (r: { structuredContent: Record<string, unknown> }) => r.structuredContent as any

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a room carries messages in order, a reader resumes after its last sequence number, and a message to a name reaches that name only. */
test('a room carries messages in order, a reader resumes after its last sequence number, and a message to a name reaches that name only', async () => {
  const rooms = memory()
  const a = s(await callMessaging(rooms, 'send', { room, from: 'qpu-readme', text: 'merge my branch first' }, 1_000))
  const b = s(await callMessaging(rooms, 'send', { room, from: 'blissful', to: 'qpu-readme', text: 'agreed' }, 2_000))
  await callMessaging(rooms, 'send', { room, from: 'blissful', to: 'someone-else', text: 'not for you' }, 3_000)
  assert.deepEqual([a.seq, b.seq], [1, 2])
  assert.match(a.receipt.address, /^[0-9a-f]{8}-/)
  assert.equal(a.receipt.sealed, true)
  const all = s(await callMessaging(rooms, 'receive', { room }))
  assert.deepEqual(all.messages.map((m: Posted) => m.text), ['merge my branch first', 'agreed', 'not for you'])
  assert.equal(all.next, 3)
  const mine = s(await callMessaging(rooms, 'receive', { room, for: 'qpu-readme' }))
  assert.deepEqual(mine.messages.map((m: Posted) => m.seq), [1, 2])
  const after = s(await callMessaging(rooms, 'receive', { room, after: 2 }))
  assert.deepEqual(after.messages.map((m: Posted) => m.seq), [3])
  assert.equal(all.messages[0].receipt.address, a.receipt.address, 'the address a send answers is the address the message is read under')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a room is 256 bits, names and text are bounded, and a room takes its share a minute and no more. */
test('a room is 256 bits, names and text are bounded, and a room takes its share a minute and no more', async () => {
  const rooms = memory()
  assert.equal((await callMessaging(rooms, 'send', { room: 'general', from: 'a', text: 'x' })).isError, true)
  assert.equal((await callMessaging(rooms, 'send', { room: '6f1c2a3e-8b4d-4c5e-9f60-718293a4b5c6', from: 'a', text: 'x' })).isError, true, 'a UUID is 122 bits: too few for a room')
  assert.equal((await callMessaging(rooms, 'send', { room, from: '', text: 'x' })).isError, true)
  assert.equal((await callMessaging(rooms, 'send', { room, from: 'a', text: 'x'.repeat(LIMITS.text + 1) })).isError, true)
  for (let i = 0; i < LIMITS.perMinute; i++) assert.equal((await callMessaging(rooms, 'send', { room, from: 'a', text: `${i}` }, 10_000 + i)).isError, false)
  const over = await callMessaging(rooms, 'send', { room, from: 'a', text: 'one too many' }, 10_000 + LIMITS.perMinute)
  assert.equal(over.isError, true)
  assert.equal((await callMessaging(rooms, 'send', { room, from: 'a', text: 'a minute later' }, 80_000)).isError, false)
  assert.deepEqual(MESSAGING_TOOLS.map((t) => t.name), ['send', 'receive'])
})
