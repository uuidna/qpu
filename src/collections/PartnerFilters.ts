import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

/** The facets partners are filtered by. Laid out the payloadcms/website way: src/collections/PartnerFilters.ts, auto-wired by the generator. */
export const PartnerFilters: CollectionConfig = {
  slug: 'partner-filters',
  admin: { useAsTitle: 'name' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [{ name: 'name', type: 'text', required: true }, { name: 'slug', type: 'text', unique: true, index: true }],
}
