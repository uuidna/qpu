/**
 * payload-qpu — a Payload database adapter whose database is the QPU.
 *
 * Documents live in the QPU document database (MongoDB query and update semantics, docdb.ts) over the unit's store:
 * RAID across the Cloudflare STORAGE (KV) and BLOBS (R2) bindings on Workers, memory elsewhere, or any DocStore
 * passed in. Ids are programmable content UUIDs; every write is a quantum receipt in the `db` stream.
 *
 *   db: qpuAdapter({ env })                      // Workers: bindings from cloudflare:workers or getCloudflareContext
 *   db: qpuAdapter()                             // Node: the unit's in-memory heap
 *
 * Payload's `where` is translated to a docdb filter; versions, drafts, globals and jobs are collections of their
 * own; migrations use Payload's own helpers. Transactions are not offered: beginTransaction answers null, which is
 * Payload's documented "no transaction" result.
 */
import {
  createDatabaseAdapter,
  findMigrationDir,
  migrate,
  migrateDown,
  migrateRefresh,
  migrateReset,
  migrateStatus,
} from 'payload'
import type { BaseDatabaseAdapter, DatabaseAdapterObj, Payload, PaginatedDocs, Where } from 'payload'
import fs from 'node:fs'
import path from 'node:path'
import { qpuDocDbOf, type DocStore, type Filter, type SortSpec, type QpuEnv } from '../quantum/processing/unit/index.js'

type Row = Record<string, unknown>

const QPU_MIGRATION = `import type { Payload, PayloadRequest } from 'payload'

export async function up({ payload, req }: { payload: Payload; req: PayloadRequest }): Promise<void> {
  // Migration code
}

export async function down({ payload, req }: { payload: Payload; req: PayloadRequest }): Promise<void> {
  // Migration code
}
`
type Db = ReturnType<typeof qpuDocDbOf>

// ---- where → filter ----------------------------------------------------------------------------------------------
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const fieldOf = (p: string) => (p === 'id' ? '_id' : p)

/** Payload's where, operator for operator, as a docdb filter. */
export const filterOf = (where?: Where): Filter => {
  if (!where) return {}
  const out: Filter[] = []
  for (const [key, cond] of Object.entries(where)) {
    if (key === 'and' || key === 'or') {
      const parts = (cond as Where[]).map(filterOf).filter((f) => Object.keys(f).length > 0)
      if (parts.length) out.push({ [`$${key}`]: parts })
      continue
    }
    const field = fieldOf(key)
    for (const [op, v] of Object.entries(cond as Row)) {
      switch (op) {
        case 'equals': out.push({ [field]: v === null ? { $exists: false } : v }); break
        case 'not_equals': out.push({ [field]: { $ne: v } }); break
        case 'in': out.push({ [field]: { $in: Array.isArray(v) ? v : String(v).split(',') } }); break
        case 'not_in': out.push({ [field]: { $nin: Array.isArray(v) ? v : String(v).split(',') } }); break
        case 'all': out.push({ [field]: { $all: Array.isArray(v) ? v : [v] } }); break
        case 'exists': out.push({ [field]: { $exists: v === true || v === 'true' } }); break
        case 'greater_than': out.push({ [field]: { $gt: v } }); break
        case 'greater_than_equal': out.push({ [field]: { $gte: v } }); break
        case 'less_than': out.push({ [field]: { $lt: v } }); break
        case 'less_than_equal': out.push({ [field]: { $lte: v } }); break
        case 'contains': out.push({ [field]: { $regex: escape(String(v)), $options: 'i' } }); break
        case 'like':
          out.push({ $and: String(v).split(/\s+/).filter(Boolean).map((w) => ({ [field]: { $regex: escape(w), $options: 'i' } })) })
          break
        default:
          throw new Error(`payload-qpu: where operator "${op}" on ${key} is not supported (geo operators need a spatial index)`)
      }
    }
  }
  return out.length === 0 ? {} : out.length === 1 ? out[0]! : { $and: out }
}

const sortOf = (sort?: string | string[]): SortSpec => {
  const list = Array.isArray(sort) ? sort : typeof sort === 'string' ? sort.split(',') : []
  const spec = list.filter(Boolean).map((s): [string, 1 | -1] => (s.startsWith('-') ? [fieldOf(s.slice(1)), -1] : [fieldOf(s), 1]))
  return spec.length ? spec : [['createdAt', -1]]
}
const projectionOf = (select?: Row): Record<string, 0 | 1> | undefined => {
  if (!select || Object.keys(select).length === 0) return undefined
  const flat: Record<string, 0 | 1> = {}
  const walk = (o: Row, prefix: string) => {
    for (const [k, v] of Object.entries(o)) {
      if (v && typeof v === 'object') walk(v as Row, `${prefix}${k}.`)
      else flat[`${prefix}${k}`] = v ? 1 : 0
    }
  }
  walk(select, '')
  if (Object.values(flat).some((v) => v === 1)) for (const k of ['_id', 'createdAt', 'updatedAt']) flat[k] ??= 1
  return flat
}
const out = (d: Row | null): Row | null => {
  if (!d) return null
  const { _id, ...rest } = d
  return { id: _id, ...rest }
}

const paginate = async (db: Db, collection: string, where: Filter, a: { limit?: number; page?: number; pagination?: boolean; sort?: string | string[]; select?: Row; skip?: number }): Promise<PaginatedDocs<Row>> => {
  const c = db.collection(collection)
  // page and limit still define the window when pagination is off (Payload trims versions with limit 1, page max + 1);
  // what pagination: false drops is the count. limit 0 means every document.
  const limit = a.limit && a.limit > 0 ? a.limit : a.limit === 0 || a.pagination === false ? 0 : 10
  const page = Math.max(1, a.page ?? 1)
  const skip = a.skip ?? (limit ? (page - 1) * limit : 0)
  const docs = (await c.find(where, { sort: sortOf(a.sort), skip, limit: limit || undefined, projection: projectionOf(a.select) })).map((d) => out(d)!)
  if (a.pagination === false || limit === 0)
    return { docs, totalDocs: docs.length, limit: limit || docs.length, page, totalPages: 1, pagingCounter: skip + 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null }
  const totalDocs = await c.countDocuments(where)
  const totalPages = Math.max(1, Math.ceil(totalDocs / limit))
  return {
    docs,
    totalDocs,
    limit,
    page,
    totalPages,
    pagingCounter: (page - 1) * limit + 1,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
  }
}

const versionsOf = (slug: string) => `_${slug}_versions`
const globalVersionsOf = (slug: string) => `_global_${slug}_versions`
const GLOBALS = '_globals'
const now = () => new Date().toISOString()

export type QpuAdapterArgs = { env?: QpuEnv; store?: DocStore; name?: string; migrationDir?: string }

export function qpuAdapter(args: QpuAdapterArgs = {}): DatabaseAdapterObj {
  const db = qpuDocDbOf(args.env, args.name ?? 'payload', args.store)
  function adapter({ payload }: { payload: Payload }) {
    const migrationDir = findMigrationDir(args.migrationDir)
    const touch = (data: Row, created = false): Row => ({ ...data, ...(created ? { createdAt: (data.createdAt as string) ?? now() } : {}), updatedAt: (data.updatedAt as string) ?? now() })
    const one = async (collection: string, a: { id?: number | string; where?: Where }) =>
      db.collection(collection).findOne(a.id !== undefined ? { _id: String(a.id) } : filterOf(a.where))

    const impl = {
      name: 'qpu',
      packageName: '@uuidna/qpu',
      payload,
      defaultIDType: 'text',
      allowIDOnCreate: true,
      migrationDir,
      sessions: {},
      beginTransaction: async () => null,
      commitTransaction: async () => {},
      rollbackTransaction: async () => {},
      connect: async () => {},
      destroy: async () => {},
      init: async () => {},

      create: async ({ collection, data, customID }) =>
        out(await db.collection(collection).insertOne({ ...touch(data as Row, true), ...((customID ?? data.id) !== undefined ? { _id: String(customID ?? data.id) } : {}), id: undefined }))!,
      find: async (a) => (await paginate(db, a.collection, filterOf(a.where), a as never)) as never,
      findOne: async ({ collection, where, select }) =>
        out(await db.collection(collection).findOne(filterOf(where), { projection: projectionOf(select as Row) })) as never,
      count: async ({ collection, where }) => ({ totalDocs: await db.collection(collection).countDocuments(filterOf(where)) }),
      findDistinct: async ({ collection, field, where, limit, page }) => {
        const values = (await db.collection(collection).distinct(fieldOf(field), filterOf(where))).map((v) => ({ [field]: v }))
        const size = limit && limit > 0 ? limit : values.length || 1
        const at = Math.max(1, page ?? 1)
        const totalPages = Math.max(1, Math.ceil(values.length / size))
        return { values: values.slice((at - 1) * size, at * size), totalDocs: values.length, limit: size, page: at, totalPages, pagingCounter: (at - 1) * size + 1, hasPrevPage: at > 1, hasNextPage: at < totalPages, prevPage: at > 1 ? at - 1 : null, nextPage: at < totalPages ? at + 1 : null }
      },
      updateOne: async ({ collection, data, id, where }) => {
        const found = await one(collection, { id, where })
        if (!found) return null as never
        const { id: _drop, ...set } = touch(data as Row)
        return out((await db.collection(collection).updateOne({ _id: found._id }, { $set: set })).doc ?? null)!
      },
      updateMany: async ({ collection, data, where, limit, sort }) => {
        const { id: _drop, ...set } = touch(data as Row)
        return (await db.collection(collection).updateMany(filterOf(where), { $set: set }, { limit, sort: sortOf(sort as never) })).map((d) => out(d)!)
      },
      upsert: async ({ collection, data, where }) => {
        const { id: _drop, ...set } = touch(data as Row)
        const r = await db.collection(collection).updateOne(filterOf(where), { $set: set, $setOnInsert: { createdAt: now() } }, { upsert: true })
        return out(r.doc ?? null)!
      },
      deleteOne: async ({ collection, where }) => out(await db.collection(collection).deleteOne(filterOf(where)))!,
      deleteMany: async ({ collection, where }) => void (await db.collection(collection).deleteMany(filterOf(where))),

      // versions and drafts: one collection per slug, the latest version flagged
      createVersion: async ({ collectionSlug, parent, versionData, autosave, createdAt, updatedAt, publishedLocale, snapshot }) => {
        const c = db.collection(versionsOf(collectionSlug))
        await c.updateMany({ parent, latest: true }, { $set: { latest: false } })
        return out(await c.insertOne({ parent, version: versionData, autosave, latest: true, createdAt, updatedAt, ...(publishedLocale ? { publishedLocale } : {}), ...(snapshot ? { snapshot } : {}) })) as never
      },
      findVersions: async (a) => paginate(db, versionsOf(a.collection), filterOf(a.where), a as never) as never,
      countVersions: async ({ collection, where }) => ({ totalDocs: await db.collection(versionsOf(collection)).countDocuments(filterOf(where)) }),
      updateVersion: async ({ collection, id, where, versionData }) => {
        const c = db.collection(versionsOf(collection))
        const found = await c.findOne(id !== undefined ? { _id: String(id) } : filterOf(where))
        if (!found) return null as never
        return out((await c.updateOne({ _id: found._id }, { $set: { ...versionData, updatedAt: versionData.updatedAt ?? now() } })).doc ?? null) as never
      },
      deleteVersions: async ({ collection, globalSlug, where }) =>
        void (await db.collection(collection ? versionsOf(collection) : globalVersionsOf(globalSlug!)).deleteMany(filterOf(where))),
      queryDrafts: async (a) => {
        const versions = filterOf(a.where ? prefixWhere(a.where, 'version.') : undefined)
        const page = await paginate(db, versionsOf(a.collection), { $and: [{ latest: true }, versions] }, { ...a, sort: prefixSort(a.sort, 'version.') } as never)
        return { ...page, docs: page.docs.map((v) => ({ ...(v.version as Row), id: v.parent })) } as never
      },

      // globals
      createGlobal: async ({ slug, data }) => {
        const d = await db.collection(GLOBALS).insertOne({ ...touch(data as Row, true), globalType: slug })
        return out(d) as never
      },
      findGlobal: async ({ slug }) => (out(await db.collection(GLOBALS).findOne({ globalType: slug })) ?? {}) as never,
      updateGlobal: async ({ slug, data }) =>
        out((await db.collection(GLOBALS).updateOne({ globalType: slug }, { $set: touch(data as Row) }, { upsert: true })).doc ?? null) as never,
      createGlobalVersion: async ({ globalSlug, versionData, autosave, createdAt, updatedAt, publishedLocale, snapshot }) => {
        const c = db.collection(globalVersionsOf(globalSlug))
        await c.updateMany({ latest: true }, { $set: { latest: false } })
        return out(await c.insertOne({ version: versionData, autosave, latest: true, createdAt, updatedAt, ...(publishedLocale ? { publishedLocale } : {}), ...(snapshot ? { snapshot } : {}) })) as never
      },
      findGlobalVersions: async (a) => paginate(db, globalVersionsOf(a.global), filterOf(a.where), a as never) as never,
      countGlobalVersions: async ({ global, where }) => ({ totalDocs: await db.collection(globalVersionsOf(global)).countDocuments(filterOf(where)) }),
      updateGlobalVersion: async ({ global, id, where, versionData }) => {
        const c = db.collection(globalVersionsOf(global))
        const found = await c.findOne(id !== undefined ? { _id: String(id) } : filterOf(where))
        if (!found) return null as never
        return out((await c.updateOne({ _id: found._id }, { $set: { ...versionData, updatedAt: versionData.updatedAt ?? now() } })).doc ?? null) as never
      },

      // jobs
      updateJobs: async (a) => {
        const c = db.collection('payload-jobs')
        const { id: _drop, ...set } = touch(a.data as Row)
        if (a.id !== undefined) return [out((await c.updateOne({ _id: String(a.id) }, { $set: set })).doc ?? null)].filter(Boolean) as never
        return (await c.updateMany(filterOf(a.where), { $set: set }, { limit: a.limit, sort: sortOf(a.sort as never) })).map((d) => out(d)) as never
      },

      // migrations: there is no schema to migrate; the files still run through Payload's own runner
      migrate,
      migrateDown,
      migrateFresh: async function (this: never) {
        await migrateReset.call(this)
        await migrate.call(this, {} as never)
      },
      migrateRefresh,
      migrateReset,
      migrateStatus,
      createMigration: async ({ migrationName, payload: p }) => {
        const dir = findMigrationDir(args.migrationDir)
        fs.mkdirSync(dir, { recursive: true })
        const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
        const file = path.join(dir, `${stamp}_${(migrationName ?? 'migration').replace(/\W+/g, '_')}.ts`)
        fs.writeFileSync(file, QPU_MIGRATION)
        p.logger.info({ msg: `Migration created at ${file}` })
      },
    } satisfies Partial<BaseDatabaseAdapter>
    return createDatabaseAdapter<BaseDatabaseAdapter>(impl as never)
  }
  return { name: 'qpu', defaultIDType: 'text', allowIDOnCreate: true, init: adapter as never }
}

const prefixWhere = (where: Where, prefix: string): Where =>
  Object.fromEntries(
    Object.entries(where).map(([k, v]) =>
      k === 'and' || k === 'or' ? [k, (v as Where[]).map((w) => prefixWhere(w, prefix))] : [k === 'id' ? 'parent' : k.startsWith(prefix) ? k : `${prefix}${k}`, v],
    ),
  ) as Where
const prefixSort = (sort: unknown, prefix: string): string[] | undefined => {
  const list = Array.isArray(sort) ? (sort as string[]) : typeof sort === 'string' ? sort.split(',') : undefined
  return list?.map((s) => (s.startsWith('-') ? `-${prefix}${s.slice(1)}` : `${prefix}${s}`))
}
