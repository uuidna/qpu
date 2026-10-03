import type { CollectionConfig } from 'payload'

/** A named block of rich text reused across pages and posts. Laid out the payloadcms/website way: src/collections/ReusableContent.ts, auto-wired by the generator. */
export const ReusableContent: CollectionConfig = {
  slug: 'reusable-content',
  admin: { useAsTitle: 'title' },
  fields: [{ name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', unique: true, index: true }, { name: 'richText', type: 'richText' }],
}
