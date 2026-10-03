import type { CollectionConfig } from 'payload'

/** Community help threads, each a title and its body. Laid out the payloadcms/website way: src/collections/CommunityHelp.ts, auto-wired by the generator. */
export const CommunityHelp: CollectionConfig = {
  slug: 'community-help',
  admin: { useAsTitle: 'title' },
  fields: [{ name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', unique: true, index: true }, { name: 'body', type: 'richText' }],
}
