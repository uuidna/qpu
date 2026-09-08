import { test } from 'node:test'
import assert from 'node:assert/strict'
import { QPU_HOST, VE_FACES, qpuVersionIntegerOf } from './hologram.js'
import { QPU_VERSION } from './version.js'
import {
  QPU_CLOCK_SEQ_BITS, QPU_MESSENGERS, QPU_MESSENGER_UUID,
  qpuMessengerCertificateOf, qpuMessengerHolds, qpuMessengerOf, qpuUuidClockSeqOf, qpuUuidOf,
} from './messenger.js'
import { qpuLicenceHolds } from './licence.js'
import { handleQpuFetch } from './edge.js'
import { qpuMcpCall } from './mcp-catalog.js'

test('qpuMessengerHolds proves sequence is the uuid messenger through every standard', () => {
  const m = qpuMessengerOf()
  assert.equal(m.kind, 'messenger')
  assert.equal(m.when, 'never')
  assert.equal(m.seat, 'empty')
  assert.equal(m.messenger, 'uuid')
  assert.equal(m.clockSeqBits, VE_FACES)
  assert.equal(m.clockSeqBits, QPU_CLOCK_SEQ_BITS)
  assert.equal(m.clockSeqStart, 66)
  assert.equal(m.clockSeqEnd, 79)
  assert.equal(m.clockSeqEnd - m.clockSeqStart + 1, VE_FACES)
  assert.equal(QPU_MESSENGERS.length, VE_FACES)
  assert.equal(m.surfaces.length, VE_FACES)
  const packed = qpuVersionIntegerOf(QPU_VERSION)
  assert.equal(packed.hexbits[0], packed.sequence)
  assert.equal(m.hexbit, packed.sequence)
  assert.equal(m.licence.messenger, 'uuid')
  assert.equal(m.licence.sequence, packed.sequence % 16)
  const kinds = new Set<string>()
  for (let i = 0; i < VE_FACES; i++) {
    const row = m.surfaces[i]!
    assert.equal(row.face, i)
    assert.equal(row.binding, 'uuid')
    assert.equal(row.kind, QPU_MESSENGERS[i]!.kind)
    assert.equal(kinds.has(row.kind), false, row.kind)
    kinds.add(row.kind)
  }
  assert.equal(kinds.size, VE_FACES)
  assert.equal(qpuMessengerHolds(m), true)
})

test('certificates arrive on RFC 5322, CloudEvents, and AMQP uuid fields; no uuid refuses', () => {
  const clock = qpuUuidClockSeqOf(QPU_MESSENGER_UUID)
  assert.equal(qpuUuidOf(`urn:uuid:${QPU_MESSENGER_UUID}`), QPU_MESSENGER_UUID)
  assert.equal(clock, 0xb4)
  const mail = qpuMessengerCertificateOf({ id: `<${QPU_MESSENGER_UUID}@${QPU_HOST}>` })
  assert.equal(qpuLicenceHolds(mail), true)
  assert.equal(mail.subject, QPU_HOST)
  assert.equal(mail.sequence, clock! % 16)
  assert.equal(mail.messenger, 'uuid')
  const ce = qpuMessengerCertificateOf({
    id: QPU_MESSENGER_UUID,
    source: `https://${QPU_HOST}`,
  })
  assert.equal(qpuLicenceHolds(ce), true)
  const amqp = qpuMessengerCertificateOf({
    id: QPU_MESSENGER_UUID,
    source: 'https://qpu.uuidna.com',
    engine: 'qpu',
  })
  assert.equal(amqp.sequence, mail.sequence)
  assert.throws(() => qpuMessengerCertificateOf({ id: 'not-a-uuid' }))
  assert.throws(() => qpuMessengerCertificateOf({ id: '<seq@a.example>' }))
  assert.equal(qpuUuidClockSeqOf('00000000-0000-4000-0000-000000000000'), undefined)
})

test('GET /messenger and MCP qpu_messenger are the uuid sequence', async () => {
  const res = await handleQpuFetch(new Request(`https://${QPU_HOST}/messenger`))
  assert.equal(res.status, 200)
  const body = await res.json() as { kind: string; holds: boolean; messenger: string; clockSeqBits: number }
  assert.equal(body.kind, 'messenger')
  assert.equal(body.holds, true)
  assert.equal(body.messenger, 'uuid')
  assert.equal(body.clockSeqBits, VE_FACES)
  const mcp = await qpuMcpCall('qpu_messenger', {}) as { holds: boolean; sequence: number }
  assert.equal(mcp.holds, true)
  assert.equal(mcp.sequence, qpuVersionIntegerOf(QPU_VERSION).sequence)
})
