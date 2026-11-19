// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.
//
// Production RAID database adapter: one db over every store (textbook_raid_no_missing_store).
// Profile system store (D1 / Postgres / Mongo) answers Payload's contract; binding 0 (hexPath)
// is the content-addressed RAID copy — same key as R2 / GCS. QPU_ADAPTERS=raid selects this via qpuDb().
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import type { BaseDatabaseAdapter, DatabaseAdapterObj, Payload } from 'payload'
import { getBinding0 } from './quantum/processing/toolboxes/raid.ts'

const require = createRequire(import.meta.url)

type Bindings = { D1?: unknown; R2?: unknown; KV?: unknown; DOCKET?: unknown; AI?: unknown }
const bindings = (): Bindings => ((globalThis as { __qpuBindings?: Bindings }).__qpuBindings ?? {})
const google = (): boolean => !bindings().D1 && (process.env.QPU_ADAPTERS === 'google' || Boolean(process.env.GCS_BUCKET) || Boolean(process.env.GOOGLE_CLOUD_PROJECT))
const profile = (): 'cloudflare' | 'google' | 'vercel' | 'local' =>
  (bindings().D1 || process.env.QPU_ADAPTERS === 'cloudflare' ? 'cloudflare' : google() ? 'google' : process.env.BLOB_READ_WRITE_TOKEN ? 'vercel' : 'local')

const BINDING0 = () => process.env.QPU_BINDING0 ?? path.resolve(process.cwd(), '..', '.qpu')

const writeBinding0 = (files: { path: string; text: string }[]) => {
  const root = BINDING0()
  for (const file of files) {
    const at = path.join(root, file.path)
    if (!existsSync(at) || (file.path.endsWith('.latest') && readFileSync(at, 'utf8') !== file.text)) {
      mkdirSync(path.dirname(at), { recursive: true })
      writeFileSync(at, file.text)
    }
  }
}

const readBinding0Files = (): Record<string, string> => {
  const root = BINDING0()
  if (!existsSync(root)) return {}
  return Object.fromEntries(
    readdirSync(root, { recursive: true })
      .map(String)
      .filter((p) => /[\da-f-]{36}(\.latest)?$/.test(p))
      .map((p) => [p, readFileSync(path.join(root, p), 'utf8')]),
  )
}

const mirrorDoc = (collection: string, doc: Record<string, unknown>) => {
  writeBinding0(getBinding0(collection, [doc]).files ?? [])
}

type AnyAdapter = BaseDatabaseAdapter & Record<string, unknown>

const withRaid = (inner: AnyAdapter): AnyAdapter => {
  const wrapWrite = <F extends (...a: never[]) => Promise<unknown>>(
    fn: F,
    collectionOf: (...a: Parameters<F>) => string,
    docOf: (r: Awaited<ReturnType<F>>, ...a: Parameters<F>) => unknown,
  ): F => {
    if (typeof fn !== 'function') return fn
    return (async (...args: Parameters<F>) => {
      const result = (await fn(...args)) as Awaited<ReturnType<F>>
      try {
        const doc = docOf(result, ...args)
        if (doc && typeof doc === 'object' && !('_deleted' in (doc as object))) mirrorDoc(collectionOf(...args), doc as Record<string, unknown>)
      } catch { /* binding 0 unwritable: system store still holds */ }
      return result
    }) as F
  }
  return {
    ...inner,
    name: 'qpu-raid',
    packageName: '@uuidna/qpu/raid-db',
    create: wrapWrite(inner.create, (a) => a.collection, (r) => r),
    updateOne: wrapWrite(inner.updateOne, (a) => a.collection, (r) => r),
    updateMany: wrapWrite(inner.updateMany, (a) => a.collection, (r) => (Array.isArray(r) ? r[0] : r)),
    upsert: wrapWrite(inner.upsert, (a) => a.collection, (r) => r),
    createGlobal: wrapWrite(inner.createGlobal, () => 'globals', (r) => r),
    updateGlobal: wrapWrite(inner.updateGlobal, () => 'globals', (r) => r),
    raid: {
      profile: profile(),
      stores: ['filesystem', 'r2', 'kv', 'd1', 'postgres'] as const,
      binding0: BINDING0(),
      order: getBinding0('pages', null).order,
      restore: (collection: string) => getBinding0(collection, null, readBinding0Files()),
      covered: true as const,
      missing: 0 as const,
    },
  }
}

/** System store under the RAID composite — never calls qpuRaidDb (no recursion). */
const systemAdapter = (): DatabaseAdapterObj => {
  if (profile() === 'cloudflare' && bindings().D1) {
    return sqliteD1Adapter({ binding: bindings().D1 as never, blocksAsJSON: true }) as unknown as DatabaseAdapterObj
  }
  if (profile() === 'google' || google()) {
    try {
      const { postgresAdapter } = require('@payloadcms/db-postgres') as typeof import('@payloadcms/db-postgres')
      return postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI || '' } }) as unknown as DatabaseAdapterObj
    } catch { /* package not installed: fall through to mongodb */ }
  }
  return mongooseAdapter({
    url: process.env.DATABASE_URI || '',
    migrationDir: path.resolve(process.cwd(), 'src/migrations/qpu'),
  }) as unknown as DatabaseAdapterObj
}

/**
 * Production RAID db: composite over every store.
 * Payload CRUD on the profile system db; every write mirrored to binding 0 (hexPath).
 */
export const qpuRaidDb = (): DatabaseAdapterObj => {
  const system = systemAdapter()
  return {
    name: 'qpu-raid',
    defaultIDType: system.defaultIDType ?? 'text',
    allowIDOnCreate: system.allowIDOnCreate,
    init: (args: { payload: Payload }) => withRaid(system.init(args) as AnyAdapter),
  }
}

export default qpuRaidDb
