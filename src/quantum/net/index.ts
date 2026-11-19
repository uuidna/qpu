// Network adapters. Storage is chosen here. Bindings are names. Values never travel.
// A directory is a filesystem concern.

import { BINDING_NAMES, BINDINGS } from './bindings/index.ts'
import { cloudflareAdapters } from './cloudflare.ts'
import { STORAGE, type StorageAdapter } from './storage/index.ts'

const head = (need: string) => need.split(' ')[0] ?? need

const named = (adapter: StorageAdapter, have: ReadonlySet<string>, cloudflare: boolean) => adapter.binding ? cloudflare && have.has(adapter.binding) : adapter.needs.every((need) => have.has(head(need)))

/** The storage adapter the environment names, else the one that always answers. */
export const storage = (env: readonly string[] = []) => {
  const have = new Set(env.map(String))
  const cloudflare = have.has('D1') || have.has('R2') || have.has('QPU_ADAPTERS=cloudflare')
  return STORAGE.find((adapter) => named(adapter, have, cloudflare)) ?? STORAGE.find((adapter) => adapter.pkg === 'storage-vercel-blob') ?? STORAGE[0]!
}

/** The storage adapter and the bindings for one address. The address is the object key. */
export const store = (id: string, env: readonly string[] = []) => {
  const adapter = storage(env)
  return { id, pkg: adapter.pkg, provider: adapter.provider, binding: adapter.binding, bindings: BINDING_NAMES }
}

export { BINDING_NAMES, BINDINGS, STORAGE, cloudflareAdapters }

export { netPlugin as plugin } from '../plugin.ts'

const net = { storage: STORAGE, bindings: BINDINGS, names: BINDING_NAMES, storageOf: storage, store }
export default net
