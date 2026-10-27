// The raid toolbox: the ported MongoDB over the docket, as pure functions. A collection is a family of content-addressed
// entries; a query is a Mongo filter ($eq, $ne, $gt, $gte, $lt, $lte, $in, $nin, $exists, $regex, $and, $or, $not, dotted
// paths) evaluated here over the entries the client read from the docket; an update ($set, $unset, $inc, $push) is computed
// here and lands as a new entry linked to the old, since entries are immutable and addressed by content. Nothing here does
// I/O: the client reads the docket's rows and writes the entries this toolbox returns. Payload's mongodb adapter interface is
// the shape this ports to, not Cloudflare's D1.
import { toolOf, isObj, checksOf, type Toolbox, type Context } from '../toolbox.js'
import { uuidOf } from '../blocks.js'
import { flowWidget } from '../widgets.js'

export type Doc = Record<string, unknown>
export type Filter = Record<string, unknown>

const pathOf = (doc: unknown, path: string): unknown => path.split('.').reduce<unknown>((v, k) => (isObj(v) ? (v as Record<string, unknown>)[k] : undefined), doc)
const cmp = (a: unknown, b: unknown): number => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0)
const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b)

/** Does a value satisfy a Mongo operator object (or equal a plain value)? */
const satisfies = (value: unknown, cond: unknown): boolean => {
  if (isObj(cond) && !Array.isArray(cond) && Object.keys(cond).every((k) => k.startsWith('$'))) {
    return Object.entries(cond as Record<string, unknown>).every(([op, arg]) => {
      switch (op) {
        case '$eq': return same(value, arg) || (Array.isArray(value) && value.some((v) => same(v, arg)))
        case '$ne': return !same(value, arg)
        case '$gt': return value !== undefined && cmp(value, arg) > 0
        case '$gte': return value !== undefined && cmp(value, arg) >= 0
        case '$lt': return value !== undefined && cmp(value, arg) < 0
        case '$lte': return value !== undefined && cmp(value, arg) <= 0
        case '$in': return Array.isArray(arg) && arg.some((a) => same(value, a) || (Array.isArray(value) && value.some((v) => same(v, a))))
        case '$nin': return !(Array.isArray(arg) && arg.some((a) => same(value, a)))
        case '$exists': return (value !== undefined) === Boolean(arg)
        case '$regex': return typeof value === 'string' && new RegExp(String(arg), typeof (cond as { $options?: string }).$options === 'string' ? (cond as { $options: string }).$options : '').test(value)
        case '$options': return true
        case '$not': return !satisfies(value, arg)
        case '$size': return Array.isArray(value) && value.length === arg
        default: throw new Error(`operator ${op} is not ported`)
      }
    })
  }
  return same(value, cond) || (Array.isArray(value) && value.some((v) => same(v, cond)))
}
/** Does a document match a filter? */
const matchesOf = (doc: Doc, filter: Filter): boolean => Object.entries(filter).every(([k, cond]) => {
  if (k === '$and') return (cond as Filter[]).every((f) => matchesOf(doc, f))
  if (k === '$or') return (cond as Filter[]).some((f) => matchesOf(doc, f))
  if (k === '$nor') return !(cond as Filter[]).some((f) => matchesOf(doc, f))
  return satisfies(pathOf(doc, k), cond)
})
/** find: filter, sort ({field: 1 | -1}), skip; no limit unless asked (no caps). */
const findOf = (docs: readonly Doc[], filter: Filter = {}, sort: Record<string, 1 | -1> = {}, skip = 0, limit?: number): Doc[] => {
  const out = docs.filter((d) => matchesOf(d, filter))
  for (const [k, dir] of Object.entries(sort).reverse()) out.sort((a, b) => dir * cmp(pathOf(a, k), pathOf(b, k)))
  const sliced = out.slice(skip)
  return limit === undefined ? sliced : sliced.slice(0, limit)
}
/** An update applied: $set, $unset, $inc, $push, $pull, or a whole replacement; the result is a new document, never a mutation. */
const updateOf = (doc: Doc, update: Record<string, unknown>): Doc => {
  const ops = Object.keys(update).filter((k) => k.startsWith('$'))
  if (!ops.length) return { ...update, _id: doc._id }
  const out: Doc = JSON.parse(JSON.stringify(doc))
  const setPath = (path: string, f: (prev: unknown) => unknown) => { const ks = path.split('.'); let o: Record<string, unknown> = out; for (const k of ks.slice(0, -1)) { if (!o[k] || typeof o[k] !== 'object') o[k] = {}; o = o[k] as Record<string, unknown> } const last = ks.at(-1)!; const v = f(o[last]); if (v === undefined) delete o[last]; else o[last] = v }
  for (const op of ops) for (const [path, arg] of Object.entries(update[op] as Record<string, unknown>)) {
    if (op === '$set') setPath(path, () => arg)
    else if (op === '$unset') setPath(path, () => undefined)
    else if (op === '$inc') setPath(path, (p) => (typeof p === 'number' ? p : 0) + Number(arg))
    else if (op === '$push') setPath(path, (p) => [...(Array.isArray(p) ? p : []), arg])
    else if (op === '$pull') setPath(path, (p) => (Array.isArray(p) ? p.filter((v) => !same(v, arg)) : p))
    else throw new Error(`update operator ${op} is not ported`)
  }
  return out
}
/** A document as a docket entry: content-addressed by its body, in a collection family, linked to the version it replaces. */
export const entryOf = (collection: string, doc: Doc, replaces?: string): { id: string; kind: string; collection: string; body: Doc; links: string[] } => {
  const body = { ...doc }
  const id = uuidOf(`${collection}${JSON.stringify(body)}`)
  return { id, kind: 'document', collection, body: { ...body, _id: body._id ?? id }, links: replaces ? [replaces] : [] }
}

const mongo = toolOf('raid', {
  name: 'mongo',
  description: 'The ported MongoDB over the docket, pure. find: {collection, docs, filter, sort, skip, limit} → the matching documents (Mongo operators, dotted paths, $and/$or/$nor). insert: {collection, docs: [new]} → the entries to write, content-addressed. update: {collection, docs, filter, update} → for each match the new document and the entry that replaces it (linked to the old). delete: {collection, docs, filter} → the ids to delete, if unlinked. The client reads the docket rows and writes what comes back.',
  inputSchema: { type: 'object', properties: { op: { type: 'string', enum: ['find', 'insert', 'update', 'delete'] }, collection: { type: 'string' }, docs: { type: 'array', items: { type: 'object' }, description: 'the collection\'s documents as read from the docket (their bodies)' }, filter: { type: 'object' }, update: { type: 'object' }, sort: { type: 'object' }, skip: { type: 'integer' }, limit: { type: 'integer' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...RAID.skill.selftest(ctx) }
    const op = String(args.op ?? 'find'); const collection = String(args.collection ?? 'documents'); const docs = (Array.isArray(args.docs) ? args.docs : []) as Doc[]; const filter = (args.filter ?? {}) as Filter
    if (op === 'find') { const found = findOf(docs, filter, (args.sort ?? {}) as Record<string, 1 | -1>, Number(args.skip ?? 0), typeof args.limit === 'number' ? args.limit : undefined); return { op, collection, scanned: docs.length, matched: found.length, docs: found } }
    if (op === 'insert') { const entries = docs.map((d) => entryOf(collection, d)); return { op, collection, written: entries.length, entries } }
    if (op === 'update') { const changes = findOf(docs, filter).map((d) => { const next = updateOf(d, (args.update ?? {}) as Record<string, unknown>); return { from: String(d._id ?? ''), to: entryOf(collection, next, typeof d._id === 'string' ? d._id : undefined) } }); return { op, collection, scanned: docs.length, matched: changes.length, changes } }
    if (op === 'delete') { const ids = findOf(docs, filter).map((d) => String(d._id ?? '')); return { op, collection, scanned: docs.length, matched: ids.length, ids, note: 'the docket refuses a delete while anything links the entry; a linked document is kept as history' } }
    throw new Error(`op ${op} is not one of find, insert, update, delete`)
  },
  widget: flowWidget,
})

const SAMPLE: Doc[] = [
  { _id: 'a', title: 'Willow', qubits: 105, tags: ['processor', 'google'], meta: { year: 2024 } },
  { _id: 'b', title: 'Sycamore', qubits: 54, tags: ['processor'], meta: { year: 2019 } },
  { _id: 'c', title: 'Quantum Echoes', qubits: 65, tags: ['experiment'], meta: { year: 2025 } },
]

export const RAID: Toolbox = {
  name: 'raid',
  idea: 'the docket as a database: MongoDB\'s query and update language ported as pure functions over content-addressed entries, so any document framework (Payload first) stores on the RAID through its mongodb adapter',
  tools: [mongo],
  examples: [
    { id: 'mongo-find', tool: 'mongo', arguments: { op: 'find', collection: 'processors', docs: SAMPLE, filter: { qubits: { $gte: 60 }, tags: 'processor' }, sort: { qubits: -1 } }, shows: 'A Mongo filter over documents read from the docket: operators, array membership, sort; the match is computed here, the storage is the docket.', expect: (s) => (s.matched === 1 && s.docs[0]?._id === 'a' ? null : `${s.matched} matched: ${s.docs.map((d: Doc) => d._id)}`) },
    { id: 'mongo-update', tool: 'mongo', arguments: { op: 'update', collection: 'processors', docs: SAMPLE, filter: { _id: 'b' }, update: { $set: { 'meta.year': 2020 }, $inc: { qubits: 1 }, $push: { tags: 'updated' } } }, shows: 'An update computed as a new document and a new entry linked to the one it replaces: entries are immutable and content-addressed, so history is kept.', expect: (s) => (s.matched === 1 && s.changes[0]?.to.body.qubits === 55 && s.changes[0]?.to.body.meta.year === 2020 && s.changes[0]?.to.links[0] === 'b' ? null : JSON.stringify(s.changes).slice(0, 160)) },
  ],
  skill: {
    instructions: 'A client that is a database adapter (Payload\'s mongodb adapter interface) reads a collection\'s rows from the docket (GET /docket?collection=…, the bodies), calls mongo with the op and the rows, and writes the entries the tool returns (POST /docket, writer role) or deletes the ids (DELETE, admin role; a linked entry is refused and kept). Every query is pure and recomputable; every write is content-addressed and linked to what it replaces.',
    directions: ['server only: the query language on a sample collection', 'toolbox → toolbox: entries are addressed with the tree\'s uuidOf and verified by the tree toolbox\'s verify', 'client → server: the rows come from the docket; the entries go back to it'],
    selftest: () => {
      const { check, done } = checksOf()
      check('raid:find-ops', findOf(SAMPLE, { $or: [{ qubits: { $lt: 60 } }, { 'meta.year': 2025 }] }, { title: 1 }).map((d) => d._id).join() === 'c,b' && findOf(SAMPLE, { title: { $regex: '^Q', $options: 'i' } }).length === 1 && findOf(SAMPLE, { tags: { $in: ['google'] } })[0]?._id === 'a' && findOf(SAMPLE, { meta: { $exists: true }, qubits: { $nin: [54] } }).length === 2, 'or sorted by title (Quantum Echoes before Sycamore), dotted path, regex, in, nin, exists')
      check('raid:find-skip-limit', findOf(SAMPLE, {}, { qubits: 1 }, 1, 1)[0]?._id === 'c' && findOf(SAMPLE, {}, {}, 0).length === 3, 'skip and limit only when asked; no cap otherwise')
      const u = updateOf(SAMPLE[1]!, { $set: { 'meta.year': 2020 }, $inc: { qubits: 1 }, $push: { tags: 'x' }, $unset: { title: '' } })
      check('raid:update-ops', u.qubits === 55 && (u.meta as Doc).year === 2020 && (u.tags as string[]).includes('x') && !('title' in u) && SAMPLE[1]!.qubits === 54, 'set, inc, push, unset; the source document untouched')
      const e1 = entryOf('c', { x: 1 }); const e2 = entryOf('c', { x: 1 }); const e3 = entryOf('c', { x: 2 }, e1.id)
      check('raid:entries-addressed', e1.id === e2.id && e1.id !== e3.id && e3.links[0] === e1.id && e1.body._id === e1.id, 'same content, same address; a replacement links what it replaces')
      let threw = false; try { findOf(SAMPLE, { qubits: { $mod: [2, 0] } }) } catch { threw = true }
      check('raid:unported-refused', threw, 'an operator not ported throws, never guesses')
      return done()
    },
  },
}
