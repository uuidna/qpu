import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

/** Case studies built from blocks; structure only, each site supplies its own. Laid out the payloadcms/website way: src/collections/CaseStudies.ts, auto-wired by the generator. */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: { useAsTitle: 'title' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [{ name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', unique: true, index: true }],
}
