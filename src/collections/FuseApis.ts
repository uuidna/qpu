import type { CollectionConfig } from 'payload'
import { anyone, adminOrAbove } from '../access'

/** One API of the fused registry: one qubit of the graph state, reached or unreached with why. */
export const FuseApis: CollectionConfig = {
  slug: 'fuse-apis',
  admin: { useAsTitle: 'api' },
  access: { read: anyone, create: adminOrAbove, update: adminOrAbove, delete: adminOrAbove },
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
