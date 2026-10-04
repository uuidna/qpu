import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

/** Feedback left on a docs page: the path and whether it helped. Laid out the payloadcms/website way: src/collections/DocsFeedback.ts, auto-wired by the generator. */
export const DocsFeedback: CollectionConfig = {
  slug: 'docs-feedback',
  admin: { useAsTitle: 'path' },
  access: { read: authenticated, create: anyone, update: authenticated, delete: authenticated },
  fields: [{ name: 'path', type: 'text', required: true }, { name: 'helpful', type: 'checkbox' }, { name: 'comment', type: 'textarea' }],
}
