// The raid toolbox: the ported MongoDB over the docket, as pure functions. A collection is a family of content-addressed
// entries; a query is a Mongo filter ($eq, $ne, $gt, $gte, $lt, $lte, $in, $nin, $exists, $regex, $and, $or, $not, dotted
// paths) evaluated here over the entries the client read from the docket; an update ($set, $unset, $inc, $push) is computed
// here and lands as a new entry linked to the old, since entries are immutable and addressed by content. Nothing here does
// I/O: the client reads the docket's rows and writes the entries this toolbox returns. Payload's mongodb adapter interface is
// the shape this ports to, not Cloudflare's D1.
import { defineTool, isObj, makeChecks, type Toolbox, type Context } from '../toolbox.ts'
import { uuidOf } from '../blocks.ts'
import { flowWidget } from '../widgets.ts'

type Doc = Record<string, unknown>
type Filter = Record<string, unknown>

const readPath = (doc: unknown, path: string): unknown => path.split('.').reduce<unknown>((v, k) => (isObj(v) ? (v as Record<string, unknown>)[k] : undefined), doc)
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
const matchesFilter = (doc: Doc, filter: Filter): boolean => Object.entries(filter).every(([k, cond]) => {
  if (k === '$and') return (cond as Filter[]).every((f) => matchesFilter(doc, f))
  if (k === '$or') return (cond as Filter[]).some((f) => matchesFilter(doc, f))
  if (k === '$nor') return !(cond as Filter[]).some((f) => matchesFilter(doc, f))
  return satisfies(readPath(doc, k), cond)
})
/** find: filter, sort ({field: 1 | -1}), skip; no limit unless asked (no caps). */
const findDocs = (docs: readonly Doc[], filter: Filter = {}, sort: Record<string, 1 | -1> = {}, skip = 0, limit?: number): Doc[] => {
  const out = docs.filter((d) => matchesFilter(d, filter))
  for (const [k, dir] of Object.entries(sort).reverse()) out.sort((a, b) => dir * cmp(readPath(a, k), readPath(b, k)))
  const sliced = out.slice(skip)
  return limit === undefined ? sliced : sliced.slice(0, limit)
}
/** An update applied: $set, $unset, $inc, $push, $pull, or a whole replacement; the result is a new document, never a mutation. */
const applyUpdate = (doc: Doc, update: Record<string, unknown>): Doc => {
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
const toEntry = (collection: string, doc: Doc, replaces?: string): { id: string; kind: string; collection: string; body: Doc; links: string[] } => {
  const body = { ...doc }
  const id = uuidOf(`${collection}${JSON.stringify(body)}`)
  return { id, kind: 'document', collection, body: { ...body, _id: body._id ?? id }, links: replaces ? [replaces] : [] }
}

/** Binding 0 of the storage dimension, the filesystem: a document once at its content address in hex folders named by the UUID's middle, g1/g2/g3/<uuid>
 *  (one program's versions in one folder), its R2 key and its GCS object, and beside the address of its collection and id a pointer to its latest version. */
const hexPath = (uuid: string) => { const [, a, b, c] = uuid.split('-'); return `${a}/${b}/${c}/${uuid}` }
/** The RAID's order by profile: Payload, then the profile's database and object store, then binding 0, which always answers. */
const RAID_ORDER = { cloudflare: ['payload', 'd1', 'r2', 'filesystem'], google: ['payload', 'cloudsql', 'gcs', 'filesystem'], vercel: ['payload', 'filesystem'], local: ['payload', 'filesystem'] } as const
// every file by the address its name ends with (a version, or its pointer with .latest), wherever it lies, the first-four-digit folders included
const named = (files: Readonly<Record<string, string>>) => Object.entries(files).flatMap(([path, text]) => { const m = /([0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})(\.latest)?$/.exec(path); return m ? [{ path, text, id: m[1]!, latest: m[2], to: hexPath(m[1]!) + (m[2] ?? '') }] : [] })
// bit 0: a version's bytes recompute its address, else it is not read
const addressed = (id: string, text = '') => { try { const e = JSON.parse(text) as { collection: string; body: Doc }, { _id, ...rest } = e.body, doc = _id === id ? rest : e.body; return toEntry(e.collection, doc).id === id ? { collection: e.collection, doc } : null } catch { return null } }
/** Documents mirrored to binding 0 (each file to write: the version at its address, the pointer naming it), or a collection read back from the
 *  files: every pointer's version verified by its address, a file not at its address refused by path, never read. Pure: Payload's hook writes. */
export const readBinding0 = (collection: string, docs: readonly Doc[] | null, files: Readonly<Record<string, string>> = {}) => {
  if (docs) return { files: docs.flatMap((d) => { const e = toEntry(collection, d); return [{ path: hexPath(e.id), text: JSON.stringify(e) }, { path: `${hexPath(uuidOf(`${collection}/${String(d.id ?? e.id)}`))}.latest`, text: e.id }] }), order: RAID_ORDER }
  const all = named(files), at = Object.fromEntries(all.map((f) => [f.to, f.text])), ids = all.filter((f) => f.latest).map((f) => f.text.trim()), back = ids.map((id) => addressed(id, at[hexPath(id)]))
  return { docs: back.flatMap((e) => (e?.collection === collection ? [e.doc] : [])), refused: ids.filter((id, i) => !back[i] && at[hexPath(id)]?.includes(`"collection":${JSON.stringify(collection)}`)).map(hexPath), pointers: ids.length, order: RAID_ORDER }
}
/** Every copy of every version checked against bit 0, the address its own bytes recompute: per binding the copies verified, missing or differing,
 *  a rebuild from a verified copy for each of the others, and every file not at its middle-part path moved there (textbook_raid_bit_zero_verify). */
const verifyCopies = (copies: Readonly<Record<string, Readonly<Record<string, string>>>>) => {
  const by = Object.entries(copies).map(([binding, files]) => { const all = named(files); return { binding, all, at: Object.fromEntries(all.filter((f) => !f.latest).map((f) => [f.id, f.text])) } })
  const ids = [...new Set(by.flatMap((b) => Object.keys(b.at)))], good = (b: (typeof by)[number], id: string) => !!addressed(id, b.at[id]), from = (id: string) => by.find((b) => good(b, id))?.at[id], of = (k: (id: string) => boolean) => ids.filter(k).length
  return {
    entries: ids.length, twoCopies: ids.filter((id) => by.filter((b) => good(b, id)).length > 1).length, refused: ids.filter((id) => !from(id)).map(hexPath),
    bindings: Object.fromEntries(by.map((b) => [b.binding, { verified: of((id) => good(b, id)), missing: of((id) => !(id in b.at)), differ: of((id) => id in b.at && !good(b, id)) }])),
    rebuild: by.flatMap((b) => ids.filter((id) => from(id) && !good(b, id)).map((id) => ({ binding: b.binding, path: hexPath(id), text: from(id)! }))),
    moves: by.flatMap((b) => b.all.filter((f) => f.path !== f.to && (f.latest || addressed(f.id, f.text))).map((f) => ({ binding: b.binding, from: f.path, to: f.to }))),
  }
}
const mongo = defineTool('raid', {
  name: 'mongo',
  description: 'The ported MongoDB over the docket, pure. find: {collection, docs, filter, sort, skip, limit} → the matching documents (Mongo operators, dotted paths, $and/$or/$nor). insert: {collection, docs: [new]} → the entries to write, content-addressed. update: {collection, docs, filter, update} → for each match the new document and the entry that replaces it (linked to the old). delete: {collection, docs, filter} → the ids to delete, if unlinked. mirror: {collection, docs} → binding 0\'s files (hex folders g1/g2/g3/<uuid> by the UUID\'s middle, the R2 and GCS key, and the collection\'s pointer); restore: {collection, files} → the documents read back, each verified by its address; verify: {copies: {binding: files}} → every copy against bit 0, the rebuilds and the moves to the middle-part folders. The client reads the docket rows and writes what comes back.',
  inputSchema: { type: 'object', properties: { op: { type: 'string', enum: ['find', 'insert', 'update', 'delete', 'mirror', 'restore', 'verify'] }, files: { type: 'object', description: 'restore: binding 0\'s files as read, path → text' }, copies: { type: 'object', description: 'verify: each binding\'s files, binding → path → text' }, collection: { type: 'string' }, docs: { type: 'array', items: { type: 'object' }, description: 'the collection\'s documents as read from the docket (their bodies)' }, filter: { type: 'object' }, update: { type: 'object' }, sort: { type: 'object' }, skip: { type: 'integer' }, limit: { type: 'integer' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...RAID.skill.selftest(ctx) }
    const op = String(args.op ?? 'find'); const collection = String(args.collection ?? 'documents'); const docs = (Array.isArray(args.docs) ? args.docs : []) as Doc[]; const filter = (args.filter ?? {}) as Filter
    if (op === 'find') { const found = findDocs(docs, filter, (args.sort ?? {}) as Record<string, 1 | -1>, Number(args.skip ?? 0), typeof args.limit === 'number' ? args.limit : undefined); return { op, collection, scanned: docs.length, matched: found.length, docs: found } }
    if (op === 'insert') { const entries = docs.map((d) => toEntry(collection, d)); return { op, collection, written: entries.length, entries } }
    if (op === 'update') { const changes = findDocs(docs, filter).map((d) => { const next = applyUpdate(d, (args.update ?? {}) as Record<string, unknown>); return { from: String(d._id ?? ''), to: toEntry(collection, next, typeof d._id === 'string' ? d._id : undefined) } }); return { op, collection, scanned: docs.length, matched: changes.length, changes } }
    if (op === 'mirror' || op === 'restore') return { op, collection, ...readBinding0(collection, op === 'mirror' ? docs : null, (args.files ?? {}) as Record<string, string>) }
    if (op === 'verify') return { op, ...verifyCopies((args.copies ?? {}) as Record<string, Record<string, string>>) }
    if (op === 'delete') { const ids = findDocs(docs, filter).map((d) => String(d._id ?? '')); return { op, collection, scanned: docs.length, matched: ids.length, ids, note: 'the docket refuses a delete while anything links the entry; a linked document is kept as history' } }
    throw new Error(`op ${op} is not one of find, insert, update, delete, mirror, restore, verify`)
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
      const { check, done } = makeChecks()
      check('raid:find-ops', findDocs(SAMPLE, { $or: [{ qubits: { $lt: 60 } }, { 'meta.year': 2025 }] }, { title: 1 }).map((d) => d._id).join() === 'c,b' && findDocs(SAMPLE, { title: { $regex: '^Q', $options: 'i' } }).length === 1 && findDocs(SAMPLE, { tags: { $in: ['google'] } })[0]?._id === 'a' && findDocs(SAMPLE, { meta: { $exists: true }, qubits: { $nin: [54] } }).length === 2, 'or sorted by title (Quantum Echoes before Sycamore), dotted path, regex, in, nin, exists')
      check('raid:find-skip-limit', findDocs(SAMPLE, {}, { qubits: 1 }, 1, 1)[0]?._id === 'c' && findDocs(SAMPLE, {}, {}, 0).length === 3, 'skip and limit only when asked; no cap otherwise')
      const u = applyUpdate(SAMPLE[1]!, { $set: { 'meta.year': 2020 }, $inc: { qubits: 1 }, $push: { tags: 'x' }, $unset: { title: '' } })
      check('raid:update-ops', u.qubits === 55 && (u.meta as Doc).year === 2020 && (u.tags as string[]).includes('x') && !('title' in u) && SAMPLE[1]!.qubits === 54, 'set, inc, push, unset; the source document untouched')
      const e1 = toEntry('c', { x: 1 }); const e2 = toEntry('c', { x: 1 }); const e3 = toEntry('c', { x: 2 }, e1.id)
      check('raid:entries-addressed', e1.id === e2.id && e1.id !== e3.id && e3.links[0] === e1.id && e1.body._id === e1.id, 'same content, same address; a replacement links what it replaces')
      let threw = false; try { findDocs(SAMPLE, { qubits: { $mod: [2, 0] } }) } catch { threw = true }
      check('raid:unported-refused', threw, 'an operator not ported throws, never guesses')
      return done()
    },
  },
}
