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

export const seedPlugin = (seed: (payload: unknown) => Promise<unknown>): QpuPlugin => (config) => ({
  ...config,
  onInit: async (payload: unknown) => { await seed(payload) },
})
