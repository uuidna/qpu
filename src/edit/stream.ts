/**
 * REAL-TIME EDITING, COORDINATED BY UUID STREAMS: a replicated sequence (RGA) over characters.
 *
 * Every character is an insert operation. It names the character it was typed after, so its position is a fact about
 * the text and not a line and column that a concurrent edit can shift. A deletion names the character it removes and
 * leaves a tombstone, so a later insert that refers to it still has a place to attach.
 *
 * Ordering: characters typed after the same reference are ordered newest first (by sequence, then author, then
 * identity), and a run typed later stays contiguous with what it was typed after. Two replicas that hold the same set of
 * operations render the same text, whatever order those operations arrived in. Merging is a set union, so it is
 * idempotent and needs no coordinator: any transport that delivers the operations is enough.
 */
import { createHash } from 'node:crypto'

export type Op =
  | { kind: 'insert'; stream: string; id: string; seq: number; author: string; after: string | null; ch: string }
  | { kind: 'delete'; stream: string; id: string; seq: number; author: string; target: string }

export type Replica = { stream: string; author: string; clock: number; ops: Map<string, Op> }

const hashUuid = (payload: unknown): string => {
  const hex = createHash('sha256').update(JSON.stringify(payload)).digest('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-8${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`
}

/** A new, empty replica for one author on one stream. */
export const replicaOf = (stream: string, author: string): Replica => ({ stream, author, clock: 0, ops: new Map() })

/** The visible sequence: every character not deleted, in document order, with its identity. */
const sequenceOf = (replica: Replica): { id: string; ch: string }[] => {
  const inserts = new Map<string, Extract<Op, { kind: 'insert' }>>()
  const deleted = new Set<string>()
  for (const op of replica.ops.values()) {
    if (op.stream !== replica.stream) continue
    if (op.kind === 'insert') inserts.set(op.id, op)
    else deleted.add(op.target)
  }
  // children of each reference, newest first (sequence, then author, then identity, all descending)
  const children = new Map<string, Extract<Op, { kind: 'insert' }>[]>()
  for (const op of inserts.values()) {
    const key = op.after ?? ''
    const list = children.get(key) ?? []
    list.push(op)
    children.set(key, list)
  }
  for (const list of children.values()) {
    list.sort((a, b) => b.seq - a.seq || (a.author < b.author ? 1 : a.author > b.author ? -1 : 0) || (a.id < b.id ? 1 : a.id > b.id ? -1 : 0))
  }
  // depth-first walk: a character, then everything typed after it, before its later siblings
  const out: { id: string; ch: string }[] = []
  const stack: Extract<Op, { kind: 'insert' }>[] = [...(children.get('') ?? [])].reverse()
  while (stack.length) {
    const op = stack.pop()!
    if (!deleted.has(op.id)) out.push({ id: op.id, ch: op.ch })
    const kids = children.get(op.id) ?? []
    for (let i = kids.length - 1; i >= 0; i--) stack.push(kids[i]!)
  }
  return out
}

/** The text of a replica: every visible character in order. */
export const textOf = (replica: Replica): string => sequenceOf(replica).map((c) => c.ch).join('')

/** The lines of a replica, split on newline characters. */
export const linesOf = (replica: Replica): string[] => textOf(replica).split('\n')

const indexOf = (seq: { ch: string }[], line: number, col: number): number => {
  let at = 0
  let l = 0
  while (l < line && at < seq.length) {
    if (seq[at]!.ch === '\n') l++
    at++
  }
  let c = 0
  while (c < col && at < seq.length && seq[at]!.ch !== '\n') {
    at++
    c++
  }
  return at
}

const record = (replica: Replica, op: Op): Op => {
  replica.ops.set(op.id, op)
  replica.clock = Math.max(replica.clock, op.seq)
  return op
}

/** Type text at a line and column. Each character is one insert, after the character before it. */
export const typeAt = (replica: Replica, line: number, col: number, text: string): Op[] => {
  const seq = sequenceOf(replica)
  let after = seq[indexOf(seq, line, col) - 1]?.id ?? null
  const made: Op[] = []
  for (const ch of text) {
    const seqNo = replica.clock + 1
    const body = { stream: replica.stream, seq: seqNo, author: replica.author, after, ch }
    const op: Op = { kind: 'insert', ...body, id: hashUuid({ kind: 'insert', ...body }) }
    made.push(record(replica, op))
    after = op.id
  }
  return made
}

/** Delete a run of visible characters starting at a line and column. Each deletion is one operation with a tombstone. */
export const deleteAt = (replica: Replica, line: number, col: number, length: number): Op[] => {
  const seq = sequenceOf(replica)
  const start = indexOf(seq, line, col)
  const made: Op[] = []
  for (const target of seq.slice(start, start + length)) {
    const seqNo = replica.clock + 1
    const body = { stream: replica.stream, seq: seqNo, author: replica.author, target: target.id }
    const op: Op = { kind: 'delete', ...body, id: hashUuid({ kind: 'delete', ...body }) }
    made.push(record(replica, op))
  }
  return made
}

/** Merge another replica's operations. A set union: idempotent, commutative, and independent of arrival order. */
export const mergeInto = (replica: Replica, incoming: readonly Op[]): Replica => {
  for (const op of incoming) {
    if (op.stream !== replica.stream || replica.ops.has(op.id)) continue
    record(replica, op)
  }
  return replica
}
