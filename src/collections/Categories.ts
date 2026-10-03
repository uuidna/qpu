import type { CollectionConfig } from 'payload'

/** Taxonomy shared across posts, docs and case studies. Laid out the payloadcms/website way: src/collections/Categories.ts, auto-wired by the generator. */
export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'title' },
  fields: [{ name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', unique: true, index: true }],
}
