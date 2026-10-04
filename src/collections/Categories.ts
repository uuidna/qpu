import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

/** Taxonomy shared across posts, docs and case studies. Laid out the payloadcms/website way: src/collections/Categories.ts, auto-wired by the generator. */
export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'title' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [{ name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', unique: true, index: true }],
}
