// The mailbox of one room: a SQLite-backed Durable Object, so every message of the room is stored once, in order.
// Imported only by the Worker (worker.ts): the runtime module cloudflare:workers exists there and nowhere else.
import { DurableObject } from 'cloudflare:workers'
import type { Limits, Posted } from '../../../../../../../../1/6/e/c/4/7/3/b/index.ts'

export class Mailbox extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    ctx.blockConcurrencyWhile(async () => {
      ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS messages (seq INTEGER PRIMARY KEY AUTOINCREMENT, sender TEXT NOT NULL, recipient TEXT, text TEXT NOT NULL, at INTEGER NOT NULL)')
    })
  }

  /** Append one message, or refuse it when the room already took its share of the last minute; then drop what is past the room's retention. */
  post(sender: string, recipient: string | null, text: string, at: number, limits: Limits): { seq: number } | { refused: 'rate' } {
    const sql = this.ctx.storage.sql
    const recent = sql.exec<{ n: number }>('SELECT COUNT(*) AS n FROM messages WHERE at > ?', at - 60_000).one().n
    if (recent >= limits.perMinute) return { refused: 'rate' }
    const seq = sql.exec<{ seq: number }>('INSERT INTO messages (sender, recipient, text, at) VALUES (?, ?, ?, ?) RETURNING seq', sender, recipient, text, at).one().seq
    sql.exec('DELETE FROM messages WHERE seq <= ? OR at < ?', seq - limits.keep, at - limits.ttlMs)
    return { seq }
  }

  /** The messages after a sequence number, oldest first: all of them, or those a reader sent, received or that went to everyone. */
  read(after: number, reader: string | null, limit: number): Posted[] {
    return this.ctx.storage.sql.exec<{ seq: number; sender: string; recipient: string | null; text: string; at: number }>(
      'SELECT seq, sender, recipient, text, at FROM messages WHERE seq > ? AND (? IS NULL OR recipient IS NULL OR recipient = ? OR sender = ?) ORDER BY seq LIMIT ?',
      after, reader, reader, reader, limit,
    ).toArray().map((row) => ({ seq: row.seq, from: row.sender, to: row.recipient, text: row.text, at: new Date(row.at).toISOString() }))
  }
}
