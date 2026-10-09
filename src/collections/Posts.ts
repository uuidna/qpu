import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

/** Posts built from blocks, drafts with a preview, SEO filled on save. Laid out the payloadcms/website way: src/collections/Posts.ts, auto-wired by the generator. */
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [{ name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', unique: true, index: true }, { name: 'publishedOn', type: 'date' }, { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true }],
}
