// drive — ONE driver path. A new architecture is a kinds list; this file does the rest.
import { BASE, HANDLE_HEXBITS, QPU_HOST, SEAL_TEN } from '../hologram.js'
import type { BindingSpec, DriverReading, DriverResult, ProviderModule, ProviderName, QpuEnv } from './types.js'

export const qpuKeyOf = (input: string): string => {
  let n = 0
  for (let i = 0; i < input.length; i++) {
    n = (n * BASE + input.charCodeAt(i) + SEAL_TEN[i % SEAL_TEN.length]!) >>> 0
  }
  let hex = n.toString(16)
  while (hex.length < HANDLE_HEXBITS) hex = `0${hex}`
  return hex.slice(-HANDLE_HEXBITS)
}

export const present = (env: QpuEnv | undefined, key: string): boolean => {
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

const textOf = (v: unknown, d = ''): string => (v == null ? d : String(v))

export const readingsOf = (
  bindings: readonly BindingSpec[],
  env?: QpuEnv,
  refuse?: (kind: string) => boolean,
): DriverReading[] =>
  bindings.map((b) => {
    const bound = refuse?.(b.kind) ? false : present(env, b.envKey)
    return {
      provider: b.provider,
      kind: b.kind,
      envKey: b.envKey,
      bound,
      seat: bound ? ('bound' as const) : ('empty' as const),
      ops: b.ops,
    }
  })

const fail = (provider: ProviderName, kind: string, op: string, bound: boolean, error: string, key?: string): DriverResult =>
  ({ provider, kind, bound, op, ok: false, key, error })

const ok = (provider: ProviderName, kind: string, op: string, bound: boolean, extra: Partial<DriverResult> = {}): DriverResult =>
  ({ provider, kind, bound, op, ok: true, ...extra })

export async function genericDrive(
  provider: ProviderName,
  bindings: readonly BindingSpec[],
  env: QpuEnv | undefined,
  kind: string,
  op: string,
  args: Record<string, unknown> = {},
  refuse?: (kind: string) => boolean,
): Promise<DriverResult> {
  const spec = bindings.find((b) => b.kind === kind)
  if (!spec) return fail(provider, kind, op, false, 'no such binding')
  if (refuse?.(kind)) return fail(provider, kind, op, false, 'empty')
  if (!spec.ops.includes(op)) return fail(provider, kind, op, present(env, spec.envKey), 'no such op')
  const bound = present(env, spec.envKey)
  if (!bound) return fail(provider, kind, op, false, 'empty')
  const binding = env![spec.envKey]
  const key = qpuKeyOf(textOf(args.key, textOf(args.value, kind)))
  const call = (name: string, ...a: unknown[]) => {
    const f = method(binding, name)
    if (!f) throw new Error(`no ${name}`)
    return f(...a)
  }
  try {
    if (op === 'probe') return ok(provider, kind, op, true, { value: spec.envKey })
    if (op === 'get' && !method(binding, 'get')) return ok(provider, kind, op, true, { value: binding })
    if (op === 'fetch') {
      const res = await call('fetch', new Request(`https://${QPU_HOST}/`)) as Response
      return ok(provider, kind, op, true, { value: res.status })
    }
    if (op === 'put' || op === 'delete' || op === 'head') {
      const value = await call(op, op === 'put' ? key : textOf(args.key, key), ...(op === 'put' ? [textOf(args.value, kind)] : []))
      return ok(provider, kind, op, true, { key, value: op === 'put' ? textOf(args.value, kind) : value })
    }
    if (op === 'get') return ok(provider, kind, op, true, { key, value: await call('get', textOf(args.key, key)) })
    if (op === 'list' || op === 'info') return ok(provider, kind, op, true, { value: await call(op) })
    if (op === 'send' || op === 'write' || op === 'exec') {
      await call(op, args.value ?? args.sql ?? { key })
      return ok(provider, kind, op, true, { key })
    }
    if (op === 'query' || op === 'search' || op === 'run' || op === 'upsert' || op === 'create' || op === 'limit' || op === 'connect') {
      const value = await call(op, args.q ?? args.model ?? args.value ?? key, args)
      return ok(provider, kind, op, true, { key, value })
    }
    if (op === 'id') return ok(provider, kind, op, true, { key, value: String(await call('idFromName', key)) })
    const value = method(binding, op) ? await call(op, args.value ?? key) : binding
    return ok(provider, kind, op, true, { key, value })
  } catch (e) {
    return fail(provider, kind, op, true, String((e as Error).message || e), key)
  }
}

/** Copy-folder constructor: kinds.ts + this call. */
export const providerOf = (
  name: ProviderName,
  bindings: readonly BindingSpec[],
  refuse?: (kind: string) => boolean,
): ProviderModule => ({
  name,
  seat: 'bound',
  bindings,
  readings: (env) => readingsOf(bindings, env, refuse),
  drive: (env, kind, op, args) => genericDrive(name, bindings, env, kind, op, args, refuse),
})

export const spec = (
  provider: ProviderName,
  kind: string,
  envKey: string,
  wrangler: string,
  op: readonly string[],
): BindingSpec => ({ provider, kind, envKey, wrangler, ops: op })
