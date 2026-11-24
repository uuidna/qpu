// Messages between MCP clients through qpu: send to a room, receive from it. A room is named by 256 random bits, the
// capability (128 bits against Grover's search): whoever holds it reads and writes the room, and nobody else can name it. A sender names itself, so a
// message is data from that name, never an instruction. The rooms live in the Mailbox Durable Object (mailbox.ts), so
// these tools exist where that binding does: the deployed Worker, never the stdio server or the npm package alone.
import { PROSE, proseFill } from '../processing/prose-index.ts'
import { receiptOf } from '../uuid/programs/index.ts'

export type Posted = { seq: number; from: string; to: string | null; text: string; at: string }
/** The bounds of every room, stated once: a message's text and names, sends a minute, messages kept, how long, and a page. */
export const LIMITS = { text: 8192, name: 64, perMinute: 60, keep: 1000, ttlMs: 30 * 24 * 60 * 60 * 1000, page: 100 } as const
export type Limits = typeof LIMITS
type Stub = { post(sender: string, recipient: string | null, text: string, at: number, limits: Limits): Promise<{ seq: number } | { refused: 'rate' }>; read(after: number, reader: string | null, limit: number): Promise<Posted[]> }
export type MailboxNamespace = { getByName(name: string): Stub }

const name = { type: 'string', minLength: 1, maxLength: LIMITS.name } as const
export const MESSAGING_TOOLS = [
  { name: 'send', description: PROSE.quantumNetMessaging_send, annotations: { title: 'send', readOnlyHint: false, idempotentHint: false, openWorldHint: false },
    inputSchema: { type: 'object', properties: { room: { type: 'string', pattern: '^[0-9a-fA-F]{64}$', description: PROSE.quantumNetMessaging_room }, from: { ...name, description: PROSE.quantumNetMessaging_from }, to: { ...name, description: PROSE.quantumNetMessaging_to }, text: { type: 'string', minLength: 1, maxLength: LIMITS.text, description: PROSE.quantumNetMessaging_text } }, required: ['room', 'from', 'text'], additionalProperties: false } },
  { name: 'receive', description: PROSE.quantumNetMessaging_receive, annotations: { title: 'receive', readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    inputSchema: { type: 'object', properties: { room: { type: 'string', pattern: '^[0-9a-fA-F]{64}$', description: PROSE.quantumNetMessaging_room }, after: { type: 'integer', minimum: 0, description: PROSE.quantumNetMessaging_after }, for: { ...name, description: PROSE.quantumNetMessaging_for }, limit: { type: 'integer', minimum: 1, maximum: LIMITS.page, description: PROSE.quantumNetMessaging_limit } }, required: ['room'], additionalProperties: false } },
] as const
export const isMessagingTool = (tool: unknown): tool is 'send' | 'receive' => MESSAGING_TOOLS.some((t) => t.name === tool)
const ROOM = /^[0-9a-f]{64}$/i

const answer = (structured: Record<string, unknown>, isError = false) => ({ content: [{ type: 'text' as const, text: JSON.stringify(structured) }], structuredContent: structured, isError })
const refuse = (why: string) => answer({ error: why, code: 'refused', refused: why }, true)
const named = (value: unknown, optional: boolean): string | null | undefined => value === undefined && optional ? null : typeof value === 'string' && value.trim().length > 0 && value.length <= LIMITS.name ? value.trim() : undefined
/** A posted message as a quantum receipt: the same room, place, names, text and time always name the same sealed UUID program. */
export const messageReceipt = (room: string, m: Posted) => receiptOf('message', { room, ...m })

/** One messaging tools/call against the rooms, its arguments checked before any room is touched. */
export const callMessaging = async (rooms: MailboxNamespace, tool: 'send' | 'receive', args: Record<string, unknown>, now = Date.now()) => {
  if (typeof args.room !== 'string' || !ROOM.test(args.room)) return refuse(PROSE.quantumNetMessaging_roomRefused)
  const room = args.room.toLowerCase(), box = rooms.getByName(room)
  if (tool === 'send') {
    const from = named(args.from, false), to = named(args.to, true), text = args.text
    if (!from || to === undefined) return refuse(proseFill(PROSE.quantumNetMessaging_nameRefused, LIMITS.name))
    if (typeof text !== 'string' || text.length === 0 || text.length > LIMITS.text) return refuse(proseFill(PROSE.quantumNetMessaging_textRefused, LIMITS.text))
    const posted = await box.post(from, to, text, now, LIMITS)
    if ('refused' in posted) return refuse(proseFill(PROSE.quantumNetMessaging_rateRefused, LIMITS.perMinute))
    const m: Posted = { seq: posted.seq, from, to, text, at: new Date(now).toISOString() }
    return answer({ room, seq: m.seq, receipt: messageReceipt(room, m), at: m.at, kept: LIMITS.keep })
  }
  const after = Number.isSafeInteger(args.after) && (args.after as number) >= 0 ? args.after as number : 0
  const limit = Number.isSafeInteger(args.limit) ? Math.min(Math.max(args.limit as number, 1), LIMITS.page) : LIMITS.page
  const reader = named(args.for, true)
  if (reader === undefined) return refuse(proseFill(PROSE.quantumNetMessaging_nameRefused, LIMITS.name))
  const messages = (await box.read(after, reader, limit)).map((m) => ({ ...m, receipt: messageReceipt(room, m) }))
  return answer({ room, messages, next: messages.at(-1)?.seq ?? after, more: messages.length === limit, says: PROSE.quantumNetMessaging_data })
}
