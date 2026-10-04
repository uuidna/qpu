import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

/** Community help threads, each a title and its body. Laid out the payloadcms/website way: src/collections/CommunityHelp.ts, auto-wired by the generator. */
export const CommunityHelp: CollectionConfig = {
  slug: 'community-help',
  admin: { useAsTitle: 'title' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [{ name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', unique: true, index: true }, { name: 'body', type: 'richText' }],
}
