// drivers — one driver per Cloudflare binding. Unbound is an empty seat. Workers-safe.
import { QPU_HOST } from '../../hologram.js'
import type { DriverReading, DriverResult } from '../types.js'
import type { QpuEnv } from '../env.js'
import { CLOUDFLARE_BINDINGS, cloudflareBindingOf } from './kinds.js'
import { qpuKeyOf } from '../drive.js'

export { qpuKeyOf }

const present = (env: QpuEnv | undefined, key: string): boolean => {
  if (!env) return false
  const v = env[key]
  return v !== undefined && v !== null && v !== ''
}

const rec = (v: unknown): Record<string, unknown> | undefined =>
  v !== null && typeof v === 'object' ? (v as Record<string, unknown>) : undefined

const method = (v: unknown, name: string): ((...a: unknown[]) => unknown) | undefined => {
  const r = rec(v)
  const f = r?.[name]
  if (typeof f !== 'function') return undefined
  return (f as (...a: unknown[]) => unknown).bind(v)
}

const fail = (kind: string, op: string, bound: boolean, error: string, key?: string): DriverResult => ({
  provider: 'cloudflare',
  kind,
  bound,
  op,
  ok: false,
  key,
  error,
})

const ok = (kind: string, op: string, bound: boolean, extra: Partial<DriverResult> = {}): DriverResult => ({
  provider: 'cloudflare',
  kind,
  bound,
  op,
  ok: true,
  ...extra,
})

const textOf = (v: unknown, d = ''): string => (v == null ? d : String(v))

export const cloudflareReadingsOf = (env?: QpuEnv): DriverReading[] =>
  CLOUDFLARE_BINDINGS.map((b) => {
    const bound = present(env, b.envKey)
    return {
      provider: 'cloudflare' as const,
      kind: b.kind,
      envKey: b.envKey,
      bound,
      seat: bound ? ('bound' as const) : ('empty' as const),
      ops: b.ops,
    }
  })

async function driveBound(
  specKind: string,
  env: QpuEnv,
  envKey: string,
  op: string,
  args: Record<string, unknown>,
): Promise<DriverResult> {
  const binding = env[envKey]
  const key = qpuKeyOf(textOf(args.key, textOf(args.value, specKind)))
  const call = (name: string, ...a: unknown[]) => {
    const f = method(binding, name)
    if (!f) throw new Error(`no ${name}`)
    return f(...a)
  }

  if (op === 'probe') return ok(specKind, op, true, { value: envKey })

  switch (specKind) {
    case 'assets':
    case 'services':
    case 'mtls':
    case 'browser':
    case 'vpc': {
      const res = await call('fetch', new Request(`https://${QPU_HOST}/`)) as Response
      return ok(specKind, op, true, { value: res.status })
    }
    case 'kv': {
      if (op === 'put') {
        await call('put', key, textOf(args.value, specKind))
        return ok(specKind, op, true, { key, value: textOf(args.value, specKind) })
      }
      if (op === 'get') return ok(specKind, op, true, { key, value: await call('get', textOf(args.key, key)) })
      if (op === 'delete') {
        await call('delete', textOf(args.key, key))
        return ok(specKind, op, true, { key })
      }
      const listed = await call('list')
      return ok(specKind, op, true, { value: listed })
    }
    case 'd1': {
      if (op === 'exec') {
        const out = await call('exec', textOf(args.sql, 'SELECT 1'))
        return ok(specKind, op, true, { value: out })
      }
      const stmt = call('prepare', textOf(args.sql, 'SELECT 1'))
      const bound = method(stmt, 'bind') ? method(stmt, 'bind')!(key) : stmt
      const all = method(bound, 'all')
      return ok(specKind, op, true, { key, value: all ? await all() : bound })
    }
    case 'r2': {
      if (op === 'put') {
        await call('put', key, textOf(args.value, specKind))
        return ok(specKind, op, true, { key })
      }
      if (op === 'get' || op === 'head') return ok(specKind, op, true, { key, value: await call(op, textOf(args.key, key)) })
      if (op === 'delete') {
        await call('delete', textOf(args.key, key))
        return ok(specKind, op, true, { key })
      }
      return ok(specKind, op, true, { value: await call('list') })
    }
    case 'durable_objects': {
      const id = call('idFromName', key)
      if (op === 'id') return ok(specKind, op, true, { key, value: String(id) })
      const stub = call('get', id)
      const fetch = method(stub, 'fetch')
      const res = fetch ? await fetch(new Request(`https://${QPU_HOST}/`)) as Response : undefined
      return ok(specKind, op, true, { key, value: res?.status })
    }
    case 'queues':
    case 'pipelines':
    case 'email': {
      await call('send', args.value ?? { key })
      return ok(specKind, op, true, { key })
    }
    case 'ai':
    case 'ai_gateway': {
      if (op === 'gateway') {
        return ok(specKind, op, true, { value: await call('gateway', textOf(args.key, 'default')) })
      }
      const value = await call('run', textOf(args.model, '@cf/qpu'), args.value ?? { prompt: specKind })
      return ok(specKind, op, true, { value })
    }
    case 'worker_loaders': {
      if (op === 'get') {
        const stub = call('get', key, async () => ({ modules: { 'worker.js': '' } }))
        return ok(specKind, op, true, { key, value: rec(stub) ? true : stub })
      }
      const stub = call('load', {
        compatibilityDate: '2026-08-01',
        mainModule: 'worker.js',
        modules: { 'worker.js': '' },
        globalOutbound: null,
      })
      return ok(specKind, op, true, { value: rec(stub) ? true : stub })
    }
    case 'media': {
      const chain = call('input', args.value ?? new ReadableStream())
      return ok(specKind, op, true, { value: rec(chain) ? true : chain })
    }
    case 'stream': {
      if (op === 'upload') {
        return ok(specKind, op, true, { value: await call('upload', textOf(args.value, `https://${QPU_HOST}/og.svg`)) })
      }
      const videos = rec(rec(binding)?.videos)
      const list = videos && typeof videos.list === 'function' ? (videos.list as (...a: unknown[]) => unknown).bind(videos) : undefined
      if (!list) throw new Error('no list')
      return ok(specKind, op, true, { value: await list() })
    }
    case 'flagship':
      return ok(specKind, op, true, { value: await call('getBooleanValue', textOf(args.key, specKind), false, args.value ?? {}) })
    case 'artifacts': {
      if (op === 'create') return ok(specKind, op, true, { key, value: await call('create', key) })
      return ok(specKind, op, true, { value: await call('list') })
    }
    case 'vectorize': {
      if (op === 'upsert') {
        await call('upsert', [{ id: key, values: [1, 0, 0] }])
        return ok(specKind, op, true, { key })
      }
      return ok(specKind, op, true, { value: await call('query', [1, 0, 0], { topK: 1 }) })
    }
    case 'hyperdrive': {
      const r = rec(binding) ?? {}
      return ok(specKind, op, true, { value: { host: r.host, port: r.port, database: r.database } })
    }
    case 'workflows': {
      if (op === 'create') return ok(specKind, op, true, { key, value: await call('create', key, args) })
      return ok(specKind, op, true, { value: await call('get', textOf(args.key, key)) })
    }
    case 'containers':
    case 'dispatch': {
      const stub = await call('get', key)
      return ok(specKind, op, true, { key, value: rec(stub) ? true : stub })
    }
    case 'analytics': {
      await call('writeDataPoint', { blobs: [key], doubles: [1], indexes: [specKind] })
      return ok(specKind, op, true, { key })
    }
    case 'vars':
      return ok(specKind, op, true, { value: binding })
    case 'images':
      return ok(specKind, op, true, { value: await call('info', textOf(args.value, specKind)) })
    case 'secrets_store': {
      const get = method(binding, 'get')
      return ok(specKind, op, true, { value: get ? await get() : binding })
    }
    case 'ai_search':
      return ok(specKind, op, true, { value: await call('search', textOf(args.q, specKind)) })
    case 'ai_search_namespace':
      return ok(specKind, op, true, { value: await call('list') })
    case 'secrets':
      return ok(specKind, op, true, { value: typeof binding === 'string' ? binding.length : 0 })
    case 'version_metadata': {
      const r = rec(binding) ?? {}
      return ok(specKind, op, true, { value: { id: r.id, tag: r.tag } })
    }
    case 'ratelimit':
      return ok(specKind, op, true, { key, value: await call('limit', { key }) })
    case 'tail':
      return ok(specKind, op, true, { value: envKey })
    default:
      return fail(specKind, op, true, 'no such op')
  }
}

export async function cloudflareDrive(
  env: QpuEnv | undefined,
  kind: string,
  op: string,
  args: Record<string, unknown> = {},
): Promise<DriverResult> {
  const spec = cloudflareBindingOf(kind)
  if (!spec) return fail(kind, op, false, 'no such binding')
  if (!spec.ops.includes(op)) return fail(kind, op, present(env, spec.envKey), 'no such op')
  const bound = present(env, spec.envKey)
  if (!bound) return fail(kind, op, false, 'empty')
  try {
    return await driveBound(spec.kind, env!, spec.envKey, op, args)
  } catch (e) {
    return fail(kind, op, true, String((e as Error).message || e), qpuKeyOf(kind))
  }
}
