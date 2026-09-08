// mock — in-process Cloudflare env. Every binding in kinds.ts is present. No live account.
import { qpuLicenceHostOf } from '../../hologram.js'
import type { QpuEnv } from '../env.js'
import { CLOUDFLARE_BINDINGS } from './kinds.js'

const html = async (): Promise<Response> =>
  new Response('<html>qpu</html>', { headers: { 'content-type': 'text/html' } })

const fetcher = { fetch: html }

export function mockCloudflareEnv(): QpuEnv {
  const kv = new Map<string, string>()
  const r2 = new Map<string, string>()
  const env: QpuEnv = {
    ASSETS: fetcher,
    KV: {
      get: async (k: string) => kv.get(k) ?? null,
      put: async (k: string, v: string) => { kv.set(k, v) },
      delete: async (k: string) => kv.delete(k),
      list: async () => ({ keys: [...kv.keys()].map((name) => ({ name })) }),
    },
    D1: {
      exec: async () => ({ count: 1 }),
      prepare: (sql: string) => ({
        bind: (..._a: unknown[]) => ({
          all: async () => ({ results: [{ sql, n: 1 }] }),
        }),
      }),
    },
    R2: {
      get: async (k: string) => (r2.has(k) ? { key: k, body: r2.get(k) } : null),
      put: async (k: string, v: string) => { r2.set(k, v); return { key: k } },
      head: async (k: string) => (r2.has(k) ? { key: k } : null),
      delete: async (k: string) => r2.delete(k),
      list: async () => ({ objects: [...r2.keys()].map((key) => ({ key })) }),
    },
    DO: {
      idFromName: (name: string) => ({ toString: () => name, name }),
      get: (_id: unknown) => fetcher,
    },
    QUEUE: { send: async () => undefined },
    AI: {
      run: async (model: string) => ({ response: model }),
      gateway: (id: string) => ({ id, run: async () => ({ id }) }),
    },
    VECTORIZE: {
      query: async () => ({ matches: [] }),
      upsert: async () => ({ mutationId: '1' }),
    },
    HYPERDRIVE: { host: 'localhost', port: 5432, database: 'qpu' },
    WORKFLOW: {
      create: async (name: string) => ({ id: name }),
      get: async (id: string) => ({ id, status: 'complete' }),
    },
    CONTAINER: { get: async (id: string) => ({ id }) },
    UUIDNA: fetcher,
    DISPATCH: { get: async (name: string) => ({ name, ...fetcher }) },
    AE: { writeDataPoint: () => undefined },
    QPU_HOST: qpuLicenceHostOf(),
    IMAGES: { info: async () => ({ format: 'svg' }) },
    MTLS: fetcher,
    PIPELINE: { send: async (rows: unknown) => ({ submitted: Array.isArray(rows) ? rows.length : 1 }) },
    AI_GATEWAY: { run: async (model: string) => ({ response: model }) },
    SECRET_STORE: { get: async () => 'store' },
    BROWSER: fetcher,
    EMAIL: { send: async () => undefined },
    AI_SEARCH: { search: async (q: string) => ({ results: [{ q }] }) },
    AI_SEARCH_NS: { list: async () => ({ instances: [] }) },
    QPU_SECRET: 'mock',
    CF_VERSION_METADATA: { id: 'test', tag: '0.3.1' },
    RATE_LIMIT: { limit: async () => ({ success: true }) },
    TAIL: { consumer: true },
    LOADER: {
      load: (_code: unknown) => ({ getEntrypoint: () => fetcher }),
      get: (id: string, _cb?: unknown) => ({ id, getEntrypoint: () => fetcher }),
    },
    MEDIA: {
      input: (stream: unknown) => ({
        transform: () => ({ output: () => ({ response: html, media: async () => stream, contentType: async () => 'video/mp4' }) }),
        output: () => ({ response: html, media: async () => stream, contentType: async () => 'video/mp4' }),
      }),
    },
    STREAM: {
      upload: async (url: string) => ({ id: '1', url }),
      createDirectUpload: async () => ({ uploadURL: `https://${qpuLicenceHostOf()}/`, id: '1' }),
      videos: { list: async () => [] },
      video: (id: string) => ({ details: async () => ({ id }) }),
    },
    FLAGS: {
      getBooleanValue: async (_k: string, d: boolean) => d,
      getStringValue: async (_k: string, d: string) => d,
    },
    ARTIFACTS: {
      create: async (name: string) => ({ name }),
      list: async () => ({ repos: [] }),
    },
    VPC: fetcher,
  }
  for (const b of CLOUDFLARE_BINDINGS) {
    if (env[b.envKey] === undefined) throw new Error(`mock missing ${b.envKey}`)
  }
  return env
}
