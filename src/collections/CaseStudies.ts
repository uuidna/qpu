import type { CollectionConfig } from 'payload'
import { blocks } from '../blocks'

/** Case studies built from blocks; structure only, each site supplies its own. Laid out the payloadcms/website way: src/collections/CaseStudies.ts, auto-wired by the generator. */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: { useAsTitle: 'title' },
  fields: [{ name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', unique: true, index: true }, { name: 'layout', type: 'blocks', blocks }],
}
