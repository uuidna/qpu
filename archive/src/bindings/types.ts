// types — one shape for every src/bindings/<provider> folder.
export const PROVIDERS = ['cloudflare', 'google', 'aws', 'azure', 'ibm', 'oracle', 'hardware', 'arch'] as const
export type ProviderName = (typeof PROVIDERS)[number]

export interface BindingSpec {
  provider: ProviderName
  kind: string
  envKey: string
  wrangler: string
  ops: readonly string[]
}

export interface DriverReading {
  provider: ProviderName
  kind: string
  envKey: string
  bound: boolean
  seat: 'empty' | 'bound'
  ops: readonly string[]
}

export interface DriverResult {
  provider: ProviderName
  kind: string
  bound: boolean
  op: string
  ok: boolean
  key?: string
  value?: unknown
  error?: string
}

export type QpuEnv = {
  ASSETS?: { fetch: (request: Request) => Promise<Response> }
  [key: string]: unknown
}

export interface ProviderModule {
  name: ProviderName
  seat: 'empty' | 'bound'
  bindings: readonly BindingSpec[]
  readings: (env?: QpuEnv) => DriverReading[]
  drive: (
    env: QpuEnv | undefined,
    kind: string,
    op: string,
    args?: Record<string, unknown>,
  ) => Promise<DriverResult>
}

export const ops = (...xs: string[]): readonly string[] => Object.freeze(xs)
export const OPS_CRUD = ops('probe', 'get', 'put', 'list', 'delete')
export const OPS_FETCH = ops('probe', 'fetch')
export const OPS_SEND = ops('probe', 'send')
export const OPS_QUERY = ops('probe', 'query')
export const OPS_RUN = ops('probe', 'run')
export const OPS_GET = ops('probe', 'get')

export const spec = (
  provider: ProviderName,
  kind: string,
  envKey: string,
  wrangler: string,
  op: readonly string[],
): BindingSpec => ({ provider, kind, envKey, wrangler, ops: op })
