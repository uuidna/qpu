// mock — one stub implements every generic op. Skip refused keys (hardware QPU).
import type { BindingSpec, QpuEnv } from './types.js'

export function mockStub(): Record<string, unknown> {
  const store = new Map<string, string>()
  return {
    get: async (k: string) => store.get(k) ?? null,
    put: async (k: string, v: string) => { store.set(k, String(v)) },
    delete: async (k: string) => store.delete(k),
    list: async () => ({ keys: [...store.keys()].map((name) => ({ name })) }),
    head: async (k: string) => (store.has(k) ? { key: k } : null),
    send: async () => undefined,
    write: async () => undefined,
    exec: async () => ({ count: 1 }),
    query: async () => ({ rows: [] }),
    search: async (q: string) => ({ results: [{ q }] }),
    run: async (model: string) => ({ response: model }),
    upsert: async () => ({ mutationId: '1' }),
    create: async (name: string) => ({ id: name }),
    limit: async () => ({ success: true }),
    connect: async () => ({ host: 'localhost' }),
    info: async () => ({ ok: true }),
    fetch: async () => new Response('ok', { status: 200 }),
    idFromName: (name: string) => name,
    prepare: (sql: string) => ({ bind: () => ({ all: async () => ({ results: [{ sql }] }) }) }),
    writeDataPoint: () => undefined,
  }
}

export function mockEnvFrom(bindings: readonly BindingSpec[], skip: readonly string[] = []): QpuEnv {
  const deny = new Set(skip)
  const env: QpuEnv = {}
  for (const b of bindings) {
    if (deny.has(b.kind) || deny.has(b.envKey)) continue
    env[b.envKey] = mockStub()
  }
  return env
}
