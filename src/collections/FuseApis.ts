import type { CollectionConfig } from 'payload'

/** One API of the fused registry: one qubit of the graph state, reached or unreached with why. */
export const FuseApis: CollectionConfig = {
  slug: 'fuse-apis',
  admin: { useAsTitle: 'api' },
  fields: [
    { name: 'api', type: 'text', required: true, unique: true },
    { name: 'qubit', type: 'number', required: true },
    { name: 'spec', type: 'text' },
    { name: 'categories', type: 'json' },
    { name: 'reached', type: 'checkbox', required: true },
    { name: 'why', type: 'text' },
    { name: 'methods', type: 'number' },
    { name: 'receipt', type: 'text' },
  ],
}
