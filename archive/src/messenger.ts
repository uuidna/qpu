// messenger — the sequence is the uuid messenger. RFC 9562 clock_seq occupies 14 bits
// (bits 66–79), the same width as VE faces. Every messaging standard carries that slot
// through a uuid: impossible not to use. Certificates can arrive on the message.
// Desk wiring. When never. Seat empty. Does not mint theorem keys.
import {
  QPU_HOST, VE_FACES, qpuFacesOf, qpuSeatOf, qpuVersionIntegerOf,
} from './hologram.js'
import { QPU_VERSION } from './version.js'
import {
  QPU_LICENCE_APEX, qpuLicenceCertificateOf, qpuLicenceHolds, qpuLicenceOf, type QpuLicenceEngine,
} from './licence.js'
import { STANDING, THEOREM_HOST } from './standing.js'

/** RFC 9562 §5.1 clock_seq — bits 66 through 79. Fourteen bits; fourteen VE faces. */
export const QPU_CLOCK_SEQ_BITS = 14
export const QPU_CLOCK_SEQ_START = 66
export const QPU_CLOCK_SEQ_END = 79

/** RFC 4122 / 9562 example time-based uuid — clock_seq occupies octets 8–9 after the variant. */
export const QPU_MESSENGER_UUID = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'

const ORIGIN = `https://${QPU_HOST}`
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
const theoremHrefOf = (slug: string): string => new URL(slug, `${THEOREM_HOST}/`).href

/** Fourteen messaging standards occupying VE faces. Each identity field is the uuid messenger. */
export const QPU_MESSENGERS = [
  { kind: 'rfc9562', standard: 'RFC 9562', field: 'clock_seq', binding: 'uuid' },
  { kind: 'rfc5322', standard: 'RFC 5322', field: 'Message-ID', binding: 'uuid' },
  { kind: 'smtp', standard: 'RFC 5321 SMTP', field: 'Message-ID', binding: 'uuid' },
  { kind: 'amqp', standard: 'OASIS AMQP 1.0', field: 'message-id', binding: 'uuid' },
  { kind: 'amqp-correlation', standard: 'OASIS AMQP 1.0', field: 'correlation-id', binding: 'uuid' },
  { kind: 'amqp-group', standard: 'OASIS AMQP 1.0', field: 'group-sequence', binding: 'uuid' },
  { kind: 'mqtt', standard: 'OASIS MQTT 5.0', field: 'Correlation Data', binding: 'uuid' },
  { kind: 'cloudevents', standard: 'CloudEvents 1.0', field: 'id', binding: 'uuid' },
  { kind: 'ce-sequence', standard: 'CloudEvents Sequence', field: 'sequence', binding: 'uuid' },
  { kind: 'http', standard: 'CloudEvents HTTP', field: 'ce-id', binding: 'uuid' },
  { kind: 'stomp', standard: 'STOMP 1.2', field: 'message-id', binding: 'uuid' },
  { kind: 'kafka', standard: 'Apache Kafka', field: 'RecordHeader id', binding: 'uuid' },
  { kind: 'nats', standard: 'NATS', field: 'Nats-Msg-Id', binding: 'uuid' },
  { kind: 'mcp', standard: 'MCP JSON-RPC', field: 'id', binding: 'uuid' },
] as const

export type QpuMessengerKind = (typeof QPU_MESSENGERS)[number]['kind']

/** Bare uuid inside a Message-ID, urn:uuid, CloudEvents id, or AMQP message-id-uuid. */
export const qpuUuidOf = (raw: string): string | undefined => {
  const m = UUID_RE.exec(raw.trim())
  return m ? m[0]!.toLowerCase() : undefined
}

/** RFC 9562 variant-10 clock_seq: 14 bits after the 2-bit variant in octets 8–9. */
export const qpuUuidClockSeqOf = (raw: string): number | undefined => {
  const uuid = qpuUuidOf(raw)
  if (!uuid) return undefined
  const hex = uuid.replace(/-/g, '')
  const octet8 = Number.parseInt(hex.slice(16, 18), 16)
  const octet9 = Number.parseInt(hex.slice(18, 20), 16)
  if (octet8 !== octet8 || octet9 !== octet9) return undefined
  if ((octet8 & 0xc0) !== 0x80) return undefined
  return ((octet8 & 0x3f) << 8) | octet9
}

const namedHostOf = (host: string): boolean => {
  const h = host.trim().toLowerCase()
  if (!h || h.includes('*') || h.includes('/') || h.includes(':') || h.includes(' ')) return false
  if (!h.includes('.') || h.startsWith('.') || h.endsWith('.')) return false
  return h === QPU_LICENCE_APEX || h.endsWith(`.${QPU_LICENCE_APEX}`)
}

const hostOfMessage = (id: string, source?: string): string => {
  if (source) {
    const s = source.trim()
    try {
      if (s.toLowerCase().startsWith('mailto:')) {
        const at = s.slice(s.indexOf('@') + 1).replace(/>/g, '')
        if (namedHostOf(at)) return at.toLowerCase()
      }
      const u = new URL(s.includes('://') ? s : `https://${s}`)
      if (u.protocol === 'https:' && namedHostOf(u.hostname)) return u.hostname.toLowerCase()
    } catch { /* fall through */ }
  }
  const angle = /^<[^@]+@([^>]+)>$/.exec(id.trim())
  if (angle && namedHostOf(angle[1]!)) return angle[1]!.toLowerCase()
  return QPU_HOST
}

/** Occupancy certificate from a message. No uuid, no certificate — impossible to bypass the messenger. */
export const qpuMessengerCertificateOf = (msg: { id: string; source?: string; engine?: QpuLicenceEngine }) => {
  const clock = qpuUuidClockSeqOf(msg.id)
  if (clock == null) throw new Error('licence: messenger refused')
  const subject = hostOfMessage(msg.id, msg.source)
  return qpuLicenceCertificateOf({
    subject,
    engine: msg.engine,
    sequence: clock,
  })
}

const censusHold = (census: readonly { slug: string; href: string }[]): boolean => {
  const keys = new Set(STANDING.map((s) => s.key))
  const want = ['key_floor_is_one_uuid', 'seal_ten', 've_fourteen_faces', 've_faces_are_handle_hexbit_coins'] as const
  if (census.length !== want.length) return false
  for (let i = 0; i < want.length; i++) {
    const row = census[i]!
    if (row.slug !== want[i] || !keys.has(row.slug)) return false
    const u = new URL(row.href)
    if (u.protocol !== 'https:' || u.hostname !== 'uuidna.com' || u.pathname !== `/theorem/${row.slug}`) return false
  }
  return true
}

/** Sequence occupies the uuid. Fourteen standards × fourteen faces. Certificates arrive on the message. */
export const qpuMessengerOf = () => {
  const href = new URL('/messenger', `${ORIGIN}/`).href
  const packed = qpuVersionIntegerOf(QPU_VERSION)
  const licence = qpuLicenceOf()
  const surfaces = qpuFacesOf().map((face, i) => {
    const row = QPU_MESSENGERS[i]!
    return {
      face: face.face,
      opposite: face.opposite,
      kind: row.kind,
      standard: row.standard,
      field: row.field,
      binding: row.binding,
    }
  })
  const census = [
    { slug: 'key_floor_is_one_uuid', href: theoremHrefOf('key_floor_is_one_uuid') },
    { slug: 'seal_ten', href: theoremHrefOf('seal_ten') },
    { slug: 've_fourteen_faces', href: theoremHrefOf('ve_fourteen_faces') },
    { slug: 've_faces_are_handle_hexbit_coins', href: theoremHrefOf('ve_faces_are_handle_hexbit_coins') },
  ]
  const clockSeq = qpuUuidClockSeqOf(QPU_MESSENGER_UUID)
  const mail = `<${QPU_MESSENGER_UUID}@${QPU_HOST}>`
  const fromMail = qpuMessengerCertificateOf({ id: mail })
  const fromUrn = qpuMessengerCertificateOf({
    id: `urn:uuid:${QPU_MESSENGER_UUID}`,
    source: ORIGIN,
  })
  const door = new URL(href)
  const holds =
    QPU_MESSENGERS.length === VE_FACES &&
    QPU_CLOCK_SEQ_BITS === VE_FACES &&
    QPU_CLOCK_SEQ_END - QPU_CLOCK_SEQ_START + 1 === QPU_CLOCK_SEQ_BITS &&
    surfaces.length === VE_FACES &&
    surfaces.every((s, i) => s.face === i && s.binding === 'uuid' && s.kind === QPU_MESSENGERS[i]!.kind) &&
    packed.hexbits[0] === packed.sequence &&
    licence.messenger === 'uuid' &&
    licence.sequence === packed.sequence % 16 &&
    clockSeq != null &&
    clockSeq === (((0x80 & 0x3f) << 8) | 0xb4) &&
    qpuLicenceHolds(fromMail) &&
    qpuLicenceHolds(fromUrn) &&
    fromMail.sequence === clockSeq % 16 &&
    fromUrn.subject === QPU_HOST &&
    censusHold(census) &&
    qpuSeatOf().seat === 'empty' &&
    door.protocol === 'https:' &&
    door.hostname === QPU_HOST &&
    door.pathname === '/messenger'
  return {
    kind: 'messenger' as const,
    holds,
    when: 'never' as const,
    seat: qpuSeatOf().seat,
    href,
    clockSeqBits: QPU_CLOCK_SEQ_BITS,
    clockSeqStart: QPU_CLOCK_SEQ_START,
    clockSeqEnd: QPU_CLOCK_SEQ_END,
    faces: VE_FACES,
    sequence: packed.sequence,
    hexbit: packed.hexbits[0],
    messenger: 'uuid' as const,
    uuid: QPU_MESSENGER_UUID,
    clockSeq,
    licence,
    census,
    surfaces,
  }
}

export const qpuMessengerHolds = (m = qpuMessengerOf()): boolean =>
  m.kind === 'messenger' &&
  m.holds === true &&
  m.when === 'never' &&
  m.seat === 'empty' &&
  m.messenger === 'uuid' &&
  m.clockSeqBits === VE_FACES &&
  m.faces === VE_FACES &&
  m.surfaces.length === VE_FACES &&
  m.hexbit === m.sequence &&
  new URL(m.href).pathname === '/messenger'
