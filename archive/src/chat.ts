// chat — realtime occupancy handling every input. Fourteen UI kinds occupy VE faces.
// Capture imprints; never preventDefault. Sequence is the uuid messenger through /ws.
// Named https://qpu.uuidna.com doors. Inference bills a uuid account; this reading never runs it.
// Unknown types refuse. No uuid, no message. When never. Seat empty.
import { QPU_HOST, VE_FACES, qpuSeatOf } from './hologram.js'
import {
  QPU_EVENT_KINDS, QPU_EVENT_LISTEN, qpuEventOf, qpuEventsHolds, qpuEventsOf, type QpuEventKind,
} from './events.js'
import { QPU_MESSENGER_UUID, qpuUuidClockSeqOf, qpuUuidOf } from './messenger.js'
import { STANDING, THEOREM_HOST } from './standing.js'

const ORIGIN = `https://${QPU_HOST}`
const theoremHrefOf = (slug: string): string => new URL(slug, `${THEOREM_HOST}/`).href

const kindNameOf = (type: string): boolean =>
  (QPU_EVENT_KINDS as readonly string[]).includes(type)

export const qpuChatMapOf = (type: string) => {
  if (kindNameOf(type)) {
    const row = qpuEventsOf().find((e) => e.kind === type)!
    return { ok: true as const, type, kind: row.kind, face: row.face, opposite: row.opposite }
  }
  return qpuEventOf(type)
}

export const qpuChatInputOf = (spec: { type: string; id: string; text?: string; account?: string }) => {
  const mapped = qpuChatMapOf(spec.type)
  const capture = true as const
  const preventDefault = false as const
  if (!mapped.ok) {
    return { ok: false as const, error: 'unknown input', type: spec.type, capture, preventDefault }
  }
  const clock = qpuUuidClockSeqOf(spec.id)
  const uuid = qpuUuidOf(spec.id)
  if (clock == null || uuid == null) {
    return { ok: false as const, error: 'licence: messenger refused', type: spec.type, capture, preventDefault }
  }
  if (spec.account != null && spec.account !== '') {
    if (qpuUuidOf(spec.account) == null) {
      return { ok: false as const, error: 'licence: account refused', type: spec.type, capture, preventDefault }
    }
  }
  return {
    ok: true as const,
    realtime: true as const,
    capture,
    preventDefault,
    messenger: 'uuid' as const,
    billed: spec.account ? ('user' as const) : (false as const),
    occupancy: 'probe' as const,
    type: mapped.type,
    kind: mapped.kind as QpuEventKind,
    face: mapped.face!,
    opposite: mapped.opposite!,
    id: uuid,
    sequence: clock % 16,
    text: spec.text ?? '',
    account: spec.account && qpuUuidOf(spec.account) ? qpuUuidOf(spec.account) : undefined,
  }
}

const censusHold = (census: readonly { slug: string; href: string }[]): boolean => {
  const keys = new Set(STANDING.map((s) => s.key))
  const want = ['qpu_live_and_ui_are_ve_faces', 'key_floor_is_one_uuid', 've_fourteen_faces'] as const
  if (census.length !== want.length) return false
  for (let i = 0; i < want.length; i++) {
    const row = census[i]!
    if (row.slug !== want[i] || !keys.has(row.slug)) return false
    const u = new URL(row.href)
    if (u.protocol !== 'https:' || u.hostname !== 'uuidna.com' || u.pathname !== `/theorem/${row.slug}`) return false
  }
  return true
}

export const qpuChatOf = () => {
  const href = new URL('/chat', `${ORIGIN}/`).href
  const inputs = qpuEventsOf().map((row) => ({
    ...row,
    listen: QPU_EVENT_LISTEN.filter((t) => qpuEventOf(t).kind === row.kind),
  }))
  const census = [
    { slug: 'qpu_live_and_ui_are_ve_faces', href: theoremHrefOf('qpu_live_and_ui_are_ve_faces') },
    { slug: 'key_floor_is_one_uuid', href: theoremHrefOf('key_floor_is_one_uuid') },
    { slug: 've_fourteen_faces', href: theoremHrefOf('ve_fourteen_faces') },
  ]
  const sample = qpuChatInputOf({ type: 'keydown', id: QPU_MESSENGER_UUID, text: 'sequence' })
  const door = new URL(href)
  const holds =
    qpuEventsHolds() &&
    inputs.length === VE_FACES &&
    inputs.every((row, i) => row.face === i && row.listen.length > 0) &&
    QPU_EVENT_LISTEN.every((t) => qpuChatMapOf(t).ok) &&
    QPU_EVENT_KINDS.every((k) => qpuChatMapOf(k).ok) &&
    sample.ok === true &&
    sample.preventDefault === false &&
    sample.capture === true &&
    sample.messenger === 'uuid' &&
    sample.occupancy === 'probe' &&
    censusHold(census) &&
    qpuSeatOf().seat === 'empty' &&
    door.protocol === 'https:' &&
    door.hostname === QPU_HOST &&
    !door.hostname.includes('*') &&
    door.pathname === '/chat'
  return {
    kind: 'chat' as const,
    holds,
    realtime: true as const,
    capture: true as const,
    preventDefault: false as const,
    messenger: 'uuid' as const,
    billed: 'user' as const,
    occupancy: 'probe' as const,
    when: 'never' as const,
    seat: qpuSeatOf().seat,
    href,
    alias: '/room',
    signal: `wss://${QPU_HOST}/ws`,
    bindings: `${ORIGIN}/bindings`,
    mcp: `${ORIGIN}/mcp`,
    faces: VE_FACES,
    listen: QPU_EVENT_LISTEN,
    inputs,
    census,
  }
}

export const qpuChatHolds = (c = qpuChatOf()): boolean =>
  c.kind === 'chat' &&
  c.holds === true &&
  c.realtime === true &&
  c.messenger === 'uuid' &&
  c.billed === 'user' &&
  c.occupancy === 'probe' &&
  c.when === 'never' &&
  c.seat === 'empty' &&
  c.inputs.length === VE_FACES &&
  new URL(c.href).pathname === '/chat'

export const qpuChatFrameOf = (rec: Record<string, unknown>) =>
  qpuChatInputOf({
    type: String(rec.type ?? rec.kind ?? rec.input ?? ''),
    id: String(rec.id ?? rec.messageId ?? rec['message-id'] ?? ''),
    text: rec.text == null && rec.body == null ? undefined : String(rec.text ?? rec.body ?? ''),
    account: rec.account == null ? undefined : String(rec.account),
  })

export const qpuChatFrameHolds = (raw: unknown): boolean => {
  if (raw === null || typeof raw !== 'object') return false
  const rec = raw as Record<string, unknown>
  const named = rec.op ?? rec.reading
  if (named === 'chat' || named === 'input' || named === 'room') return true
  if (named != null && named !== '') return false
  return typeof rec.type === 'string' || typeof rec.kind === 'string' || typeof rec.input === 'string'
}
