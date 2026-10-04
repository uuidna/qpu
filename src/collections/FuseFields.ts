import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

/** One field of the fused registry, addressed by shape UUID (name and type): how many APIs give it and take it. */
export const FuseFields: CollectionConfig = {
  slug: 'fuse-fields',
  admin: { useAsTitle: 'name' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'uuid', type: 'text', required: true, unique: true },
    { name: 'name', type: 'text', required: true },
    { name: 'gives', type: 'number', required: true },
    { name: 'takes', type: 'number', required: true },
    { name: 'pairs', type: 'number', required: true },
  ],
}
