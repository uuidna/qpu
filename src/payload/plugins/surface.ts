/**
 * The Payload surface that can be a plugin, as plugins. A collection, a global, the editor, admin, CORS, the types
 * path and the seed enter the config only through one of these. What Payload's own shape refuses to put in a plugin
 * stays a lead (src/payload/plugins/leads.ts).
 */

type Config = {
  collections?: unknown[]
  globals?: unknown[]
  editor?: unknown
  admin?: unknown
  cors?: unknown
  csrf?: unknown
  typescript?: unknown
  onInit?: (payload: unknown) => unknown
  endpoints?: unknown[]
}

export type QpuPlugin = (config: Config) => Config

export const collectionPlugin = (collection: unknown): QpuPlugin => (config) => ({
  ...config,
  collections: [...(config.collections ?? []), collection],
})

export const globalPlugin = (global: unknown): QpuPlugin => (config) => ({
  ...config,
  globals: [...(config.globals ?? []), global],
})

export const editorPlugin = (editor: unknown): QpuPlugin => (config) => ({ ...config, editor })

export const adminPlugin = (admin: unknown): QpuPlugin => (config) => ({ ...config, admin })

export const corsPlugin = (origins: readonly string[]): QpuPlugin => (config) => ({
  ...config,
  cors: [...origins],
  csrf: [...origins],
})

export const typescriptPlugin = (outputFile: string): QpuPlugin => (config) => ({
  ...config,
  typescript: { outputFile },
})

export const seedPlugin = <P>(seed: (payload: P) => Promise<unknown>): QpuPlugin => (config) => ({
  ...config,
  // seeding is best-effort and must never crash init: a seed error here would 500 every page. The request path
  // (src/app/_data) advances the seed per request with the same tolerance, so a failed slice is retried, not fatal.
  onInit: async (payload: unknown) => { await seed(payload as P).catch(() => undefined) },
})
