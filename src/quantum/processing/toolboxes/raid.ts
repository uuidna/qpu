// The raid toolbox: the ported MongoDB over the docket, as pure functions. A collection is a family of content-addressed
// entries; a query is a Mongo filter ($eq, $ne, $gt, $gte, $lt, $lte, $in, $nin, $exists, $regex, $and, $or, $not, dotted
// paths) evaluated here over the entries the client read from the docket; an update ($set, $unset, $inc, $push) is computed
// here and lands as a new entry linked to the old, since entries are immutable and addressed by content. Nothing here does
// I/O: the client reads the docket's rows and writes the entries this toolbox returns. Payload's mongodb adapter interface is
// the shape this ports to, not Cloudflare's D1.
import { PROSE, proseFill } from '../prose-index.ts'
import { TABLES } from '../tables-index.ts'
import { defineTool, isObj, createChecks, type Toolbox } from '../toolbox.ts'
import { documentPath } from '../../fs/index.ts'
import { uuid, canonicalText } from '../../uuid/index.ts'
import { flowWidget } from '../widgets.ts'
import { valueAt } from '../access.ts'

type Doc = Record<string, unknown>
type Filter = Record<string, unknown>

type Field = Record<string, unknown>
export type Association = { type: 'belongs_to' | 'has_one' | 'has_many' | 'has_many_through' | 'has_one_through' | 'has_and_belongs_to_many' | 'polymorphic' | 'self_join' | 'sti' | 'delegated_type'; owner: string; name: string; target?: string; targets?: readonly string[]; through?: string; on?: string; inverse?: string; optional?: boolean; subtypes?: Readonly<Record<string, readonly Field[]>>; dependent?: 'destroy'; counterCache?: string; touch?: boolean }
export const createAssociation = (a: Association) => {
  // the key a has_many or has_one is joined on: Rails' convention, the owner's singular name on the target (authors has_many books: books.author)
  const t = a.target ?? '', on = a.on ?? a.owner.replace(/ies$/, 'y').replace(/s$/, ''), rel = (name: string, to: string | readonly string[], extra: Field = {}): Field => ({ name, type: 'relationship', relationTo: to, ...extra }), join = (name: string, collection: string, by: string, extra: Field = {}): Field => ({ name, type: 'join', collection, on: by, ...extra })
  const sides: { owner: Field[]; target?: Field[]; through?: Field[] } =
    a.type === 'belongs_to' ? { owner: [rel(a.name, t, { required: !a.optional, index: true })] }
    : a.type === 'has_one' ? { owner: [join(a.name, t, on, { defaultLimit: 1 })], target: [rel(on, a.owner, { unique: true, index: true })] }
    : a.type === 'has_many' ? { owner: [join(a.name, t, on)], target: [rel(on, a.owner, { index: true })] }
    : a.type === 'has_many_through' || a.type === 'has_one_through' ? { owner: [join(a.name, a.through ?? '', on, a.type === 'has_one_through' ? { defaultLimit: 1 } : {})], through: [rel(on, a.owner, { required: true, index: true }), rel(a.inverse ?? t, t, { required: true, index: true })] }
    : a.type === 'has_and_belongs_to_many' ? { owner: [rel(a.name, t, { hasMany: true })], target: [join(a.inverse ?? a.owner, a.owner, a.name)] }
    : a.type === 'polymorphic' ? { owner: [rel(a.name, a.targets ?? [])] }
    : a.type === 'self_join' ? { owner: [rel(a.name, a.owner, { hasMany: true }), join(a.inverse ?? `${a.name}By`, a.owner, a.name)] }
    : a.type === 'sti' ? { owner: [{ name: a.name, type: 'select', required: true, options: Object.keys(a.subtypes ?? {}) }, ...Object.entries(a.subtypes ?? {}).flatMap(([sub, fs]) => fs.map((f) => ({ ...f, admin: { condition: `(data) => data?.${a.name} === '${sub}'` } })))] }
    : { owner: [rel(a.name, a.targets ?? [], { required: true })], target: (a.targets ?? []).map((x) => join(a.inverse ?? a.owner, a.owner, a.name)) }
  // the association options as Payload hooks, their source for the generator to write
  const hooks = [...(a.dependent === 'destroy' ? [{ on: a.owner, hook: 'afterDelete', source: `async ({ doc, req }) => { await req.payload.delete({ collection: '${t}', where: { ${on}: { equals: doc.id } }, req }) }` }] : []), ...(a.counterCache ? [{ on: t || a.owner, hook: 'afterChange', source: `async ({ doc, req }) => { const parent = doc.${on}; if (parent) await req.payload.update({ collection: '${a.owner}', id: typeof parent === 'object' ? parent.id : parent, data: { ${a.counterCache}: (await req.payload.count({ collection: '${t}', where: { ${on}: { equals: typeof parent === 'object' ? parent.id : parent } }, req })).totalDocs }, req }) }` }] : []), ...(a.touch ? [{ on: t || a.owner, hook: 'afterChange', source: `async ({ doc, req }) => { const parent = doc.${on}; if (parent) await req.payload.update({ collection: '${a.owner}', id: typeof parent === 'object' ? parent.id : parent, data: {}, req }) }` }] : [])]
  return { phase: 'association' as const, rails: a.type, ...sides, hooks, theorem: 'textbook_association_fields' }
}

export type Validation = { name: string; helper: 'absence' | 'acceptance' | 'confirmation' | 'comparison' | 'format' | 'inclusion' | 'exclusion' | 'length' | 'numericality' | 'presence' | 'uniqueness' | 'validates_associated' | 'validates_each' | 'validates_with'; options?: { with?: string; in?: readonly (string | number)[]; minimum?: number; maximum?: number; is?: number; onlyInteger?: boolean; greaterThan?: number | string; lessThan?: number | string; allowNil?: boolean; allowBlank?: boolean; message?: string; on?: 'create' | 'update'; if?: string; unless?: string; validator?: string } }
export const createValidation = (v: Validation) => {
  const o = v.options ?? {}, say = (m: string) => JSON.stringify(o.message ?? `${v.name} ${m}`), field: Field = {}
  const test: string | null =
    v.helper === 'presence' ? (field.required = true, null)
    : v.helper === 'uniqueness' ? (field.unique = true, field.index = true, null)
    : v.helper === 'validates_associated' ? null // Payload refuses a relationship to a document that is not there
    : v.helper === 'length' && o.is === undefined ? (o.minimum !== undefined && (field.minLength = o.minimum), o.maximum !== undefined && (field.maxLength = o.maximum), null)
    : v.helper === 'inclusion' && !o.message ? (field.options = o.in ?? [], null)
    : v.helper === 'absence' ? `(value == null || value === '') || ${say('must be blank')}`
    : v.helper === 'acceptance' ? `value === true || ${say('must be accepted')}`
    : v.helper === 'confirmation' ? `value === siblingData?.${v.name}Confirmation || ${say('doesn\'t match confirmation')}`
    : v.helper === 'comparison' ? `(${o.greaterThan !== undefined ? `value > ${typeof o.greaterThan === 'string' ? `siblingData?.${o.greaterThan}` : o.greaterThan}` : 'true'} && ${o.lessThan !== undefined ? `value < ${typeof o.lessThan === 'string' ? `siblingData?.${o.lessThan}` : o.lessThan}` : 'true'}) || ${say('is out of comparison')}`
    : v.helper === 'format' ? `new RegExp(${JSON.stringify(o.with ?? '.*')}).test(String(value ?? '')) || ${say('is invalid')}`
    : v.helper === 'inclusion' ? `${JSON.stringify(o.in ?? [])}.includes(value) || ${say('is not included in the list')}`
    : v.helper === 'exclusion' ? `!${JSON.stringify(o.in ?? [])}.includes(value) || ${say('is reserved')}`
    : v.helper === 'length' ? `String(value ?? '').length === ${o.is} || ${say(proseFill(PROSE.quantumProcessingToolboxesRaid_s24, o.is))}`
    : v.helper === 'numericality' ? (field.type = 'number', o.minimum !== undefined && (field.min = o.minimum), o.maximum !== undefined && (field.max = o.maximum), o.onlyInteger ? `Number.isInteger(value) || ${say('must be an integer')}` : null)
    : `(${o.validator ?? '() => true'})(value, siblingData)` // validates_each and validates_with: the tenant's own validator
  // the options wrap the test: empty values pass when allowed, the operation and the condition decide whether it runs
  const guards = [...(o.allowNil || o.allowBlank ? [`value == null${o.allowBlank ? ` || value === ''` : ''}`] : []), ...(o.on ? [`operation !== '${o.on}'`] : []), ...(o.if ? [`!(${o.if})`] : []), ...(o.unless ? [`(${o.unless})`] : [])]
  const validate = test ? `(value, { siblingData, operation }) => ${guards.length ? `(${guards.join(' || ')}) || ` : ''}(${test})` : null
  return { phase: 'validation' as const, rails: v.helper, field: { name: v.name, ...field }, validate, theorem: 'textbook_validation_helpers' }
}

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
  return satisfies(valueAt(doc, k), cond)
})
/** find: filter, sort ({field: 1 | -1}), skip; no limit unless asked (no caps). */
const listDocs = (docs: readonly Doc[], filter: Filter = {}, sort: Record<string, 1 | -1> = {}, skip = 0, limit?: number): Doc[] => {
  const out = docs.filter((d) => matchesFilter(d, filter))
  for (const [k, dir] of Object.entries(sort).reverse()) out.sort((a, b) => dir * cmp(valueAt(a, k), valueAt(b, k)))
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
/** A document as a docket entry: content-addressed by its body's canonical text (any key order, one address), in a collection family, linked to the version it replaces. */
const toEntry = (collection: string, doc: Doc, replaces?: string): { id: string; kind: string; collection: string; body: Doc; links: string[] } => {
  const body = { ...doc }
  const id = uuid(`${collection}${canonicalText(body)}`)
  return { id, kind: 'document', collection, body: { ...body, _id: body._id ?? id }, links: replaces ? [replaces] : [] }
}

/** Binding 0 of the storage dimension, the filesystem: a document once at its content address in hex folders named by the UUID's middle, g1/g2/g3/<uuid>
 *  (one program's versions in one folder), its R2 key and its GCS object, and beside the address of its collection and id a pointer to its latest version. */
const hexPath = documentPath
/** The RAID's order by profile: Payload, then the profile's database and object store, then binding 0, which always answers. */
const RAID_ORDER = { cloudflare: ['payload', 'd1', 'r2', 'filesystem'], google: ['payload', 'cloudsql', 'gcs', 'filesystem'], vercel: ['payload', 'filesystem'], local: ['payload', 'filesystem'] } as const
// every file by the address its name ends with (a version, or its pointer with .latest), wherever it lies, the first-four-digit folders included
const named = (files: Readonly<Record<string, string>>) => Object.entries(files).flatMap(([path, text]) => { const m = /([0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})(\.latest)?$/.exec(path); return m ? [{ path, text, id: m[1]!, latest: m[2], to: hexPath(m[1]!) + (m[2] ?? '') }] : [] })
// bit 0: a version's bytes recompute its address, else it is not read
const addressed = (id: string, text = '') => { try { const e = JSON.parse(text) as { collection: string; body: Doc }, { _id, ...rest } = e.body, doc = _id === id ? rest : e.body; return toEntry(e.collection, doc).id === id ? { collection: e.collection, doc } : null } catch { return null } }
/** Documents mirrored to binding 0 (each file to write: the version at its address, the pointer naming it), or a collection read back from the
 *  files: every pointer's version verified by its address, a file not at its address refused by path, never read. Pure: Payload's hook writes. */
export const getBinding0 = (collection: string, docs: readonly Doc[] | null, files: Readonly<Record<string, string>> = {}) => {
  if (docs) return { files: docs.flatMap((d) => { const e = toEntry(collection, d); return [{ path: hexPath(e.id), text: JSON.stringify(e) }, { path: `${hexPath(uuid(`${collection}/${String(d.id ?? e.id)}`))}.latest`, text: e.id }] }), order: RAID_ORDER }
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
/** SMART self-monitoring of the RAID's disks (the bindings): verifyCopies read as a health report — each binding a disk with its attributes
 *  (entries, verified, reallocated = missing, pending = differing) and a status, the RAID failed only when a version no copy holds (refused),
 *  degraded while a binding is missing or differs (rebuildable from a verified copy), so the Payload admin shows each disk's health and the
 *  degraded ones as leads. Pure: the client hands the copies, the admin lists what comes back. */
const smartHealth = (copies: Readonly<Record<string, Readonly<Record<string, string>>>>) => {
  const v = verifyCopies(copies)
  const disks = Object.entries(v.bindings).map(([binding, b]) => { const entries = b.verified + b.missing + b.differ; return { binding, status: b.missing + b.differ > 0 ? 'degraded' : 'healthy', online: b.verified > 0 || entries === 0, attributes: { entries, verified: b.verified, reallocated: b.missing, pending: b.differ }, health: entries ? Math.round((b.verified / entries) * 100) : 100 } })
  const degraded = disks.filter((d) => d.status !== 'healthy'), status = v.refused.length ? 'failed' : degraded.length ? 'degraded' : 'healthy'
  return { op: 'health', status, disks, entries: v.entries, twoCopies: v.twoCopies, rebuilds: v.rebuild.length, moves: v.moves.length, refused: v.refused, leads: degraded.map((d) => ({ id: `raid-disk-${d.binding}`, statement: proseFill(PROSE.quantumProcessingToolboxesRaid_statement1, d.binding, d.health, d.attributes.reallocated, d.attributes.pending), status: 'open' as const, tool: 'mongo' })), says: proseFill(PROSE.quantumProcessingToolboxesRaid_says2, disks.length, status, v.twoCopies, v.rebuild.length, degraded.length) }
}
const mongo = defineTool('raid', {
  name: 'mongo',
  description: PROSE.quantumProcessingToolboxesRaid_description3,
  inputSchema: { type: 'object', properties: { op: { type: 'string', enum: ['find', 'insert', 'update', 'delete', 'mirror', 'restore', 'verify', 'health', 'associate', 'validate'] }, association: { type: 'object', description: PROSE.quantumProcessingToolboxesRaid_description4 }, validation: { type: 'object', description: PROSE.quantumProcessingToolboxesRaid_description5 }, files: { type: 'object', description: PROSE.quantumProcessingToolboxesRaid_description6 }, copies: { type: 'object', description: PROSE.quantumProcessingToolboxesRaid_description7 }, collection: { type: 'string' }, docs: { type: 'array', items: { type: 'object' }, description: PROSE.quantumProcessingToolboxesRaid_description8 }, filter: { type: 'object' }, update: { type: 'object' }, sort: { type: 'object' }, skip: { type: 'integer' }, limit: { type: 'integer' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    const op = String(args.op ?? 'find'); const collection = String(args.collection ?? 'documents'); const docs = (Array.isArray(args.docs) ? args.docs : []) as Doc[]; const filter = (args.filter ?? {}) as Filter
    if (op === 'find') { const found = listDocs(docs, filter, (args.sort ?? {}) as Record<string, 1 | -1>, Number(args.skip ?? 0), typeof args.limit === 'number' ? args.limit : undefined); return { op, collection, scanned: docs.length, matched: found.length, docs: found } }
    if (op === 'insert') { const entries = docs.map((d) => toEntry(collection, d)); return { op, collection, written: entries.length, entries } }
    if (op === 'update') { const changes = listDocs(docs, filter).map((d) => { const next = applyUpdate(d, (args.update ?? {}) as Record<string, unknown>); return { from: String(d._id ?? ''), to: toEntry(collection, next, typeof d._id === 'string' ? d._id : undefined) } }); return { op, collection, scanned: docs.length, matched: changes.length, changes } }
    if (op === 'mirror' || op === 'restore') return { op, collection, ...getBinding0(collection, op === 'mirror' ? docs : null, (args.files ?? {}) as Record<string, string>) }
    // the data model of documents after the Rails guides, as the Payload fields that implement it (createAssociation, createValidation)
    if (op === 'associate') return { op, ...createAssociation(args.association as Association) }
    if (op === 'validate') return { op, ...createValidation(args.validation as Validation) }
    if (op === 'verify') return { op, ...verifyCopies((args.copies ?? {}) as Record<string, Record<string, string>>) }
    if (op === 'health') return smartHealth((args.copies ?? {}) as Record<string, Record<string, string>>)
    if (op === 'delete') { const ids = listDocs(docs, filter).map((d) => String(d._id ?? '')); return { op, collection, scanned: docs.length, matched: ids.length, ids, note: PROSE.quantumProcessingToolboxesRaid_note9 } }
    throw new Error(proseFill(PROSE.quantumProcessingToolboxesRaid_s10, op))
  },
  widget: flowWidget,
})

const SAMPLE = TABLES.SAMPLE as unknown as Doc[]

export const RAID: Toolbox = {
  name: 'raid',
  idea: PROSE.quantumProcessingToolboxesRaid_idea11,
  tools: [mongo],
  examples: [
    { id: 'mongo-find', tool: 'mongo', theorem: 'textbook_mongo_find_filter', arguments: { op: 'find', collection: 'processors', docs: SAMPLE, filter: { qubits: { $gte: 60 }, tags: 'processor' }, sort: { qubits: -1 } }, shows: PROSE.quantumProcessingToolboxesRaid_shows12, expect: (s) => (s.matched === 1 && s.docs[0]?._id === 'a' ? null : `${s.matched} matched: ${s.docs.map((d: Doc) => d._id)}`) },
    { id: 'mongo-update', tool: 'mongo', theorem: 'textbook_mongo_update_inc', arguments: { op: 'update', collection: 'processors', docs: SAMPLE, filter: { _id: 'b' }, update: { $set: { 'meta.year': 2020 }, $inc: { qubits: 1 }, $push: { tags: 'updated' } } }, shows: PROSE.quantumProcessingToolboxesRaid_shows13, expect: (s) => (s.matched === 1 && s.changes[0]?.to.body.qubits === 55 && s.changes[0]?.to.body.meta.year === 2020 && s.changes[0]?.to.links[0] === 'b' ? null : JSON.stringify(s.changes)) },
  ],
  skill: {
    instructions: PROSE.quantumProcessingToolboxesRaid_instructions14,
    directions: [PROSE.quantumProcessingToolboxesRaid_s15, PROSE.quantumProcessingToolboxesRaid_s16, PROSE.quantumProcessingToolboxesRaid_s17],
    selftest: () => {
      const { check, done } = createChecks()
      check('raid:find-ops', listDocs(SAMPLE, { $or: [{ qubits: { $lt: 60 } }, { 'meta.year': 2025 }] }, { title: 1 }).map((d) => d._id).join() === 'c,b' && listDocs(SAMPLE, { title: { $regex: '^Q', $options: 'i' } }).length === 1 && listDocs(SAMPLE, { tags: { $in: ['google'] } })[0]?._id === 'a' && listDocs(SAMPLE, { meta: { $exists: true }, qubits: { $nin: [54] } }).length === 2, PROSE.quantumProcessingToolboxesRaid_s18)
      check('raid:find-skip-limit', listDocs(SAMPLE, {}, { qubits: 1 }, 1, 1)[0]?._id === 'c' && listDocs(SAMPLE, {}, {}, 0).length === 3, PROSE.quantumProcessingToolboxesRaid_s19)
      const u = applyUpdate(SAMPLE[1]!, { $set: { 'meta.year': 2020 }, $inc: { qubits: 1 }, $push: { tags: 'x' }, $unset: { title: '' } })
      check('raid:update-ops', u.qubits === 55 && (u.meta as Doc).year === 2020 && (u.tags as string[]).includes('x') && !('title' in u) && SAMPLE[1]!.qubits === 54, PROSE.quantumProcessingToolboxesRaid_s20)
      const e1 = toEntry('c', { x: 1 }); const e2 = toEntry('c', { x: 1 }); const e3 = toEntry('c', { x: 2 }, e1.id)
      check('raid:entries-addressed', e1.id === e2.id && e1.id !== e3.id && e3.links[0] === e1.id && e1.body._id === e1.id, PROSE.quantumProcessingToolboxesRaid_s21)
      let threw = false; try { listDocs(SAMPLE, { qubits: { $mod: [2, 0] } }) } catch { threw = true }
      check('raid:unported-refused', threw, PROSE.quantumProcessingToolboxesRaid_s22)
      const eh = toEntry('c', { x: 1 }), h = smartHealth({ filesystem: { [hexPath(eh.id)]: JSON.stringify(eh) }, r2: {} })
      check('raid:smart-health', h.status === 'degraded' && h.disks.find((d) => d.binding === 'filesystem')?.status === 'healthy' && h.disks.find((d) => d.binding === 'r2')?.attributes.reallocated === 1 && h.disks.find((d) => d.binding === 'r2')?.status === 'degraded' && h.leads.length === 1, PROSE.quantumProcessingToolboxesRaid_s23)
      return done()
    },
  },
}
