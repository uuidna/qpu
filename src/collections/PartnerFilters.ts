import type { CollectionConfig } from 'payload'

/** The facets partners are filtered by. Laid out the payloadcms/website way: src/collections/PartnerFilters.ts, auto-wired by the generator. */
export const PartnerFilters: CollectionConfig = {
  slug: 'partner-filters',
  admin: { useAsTitle: 'name' },
  fields: [{ name: 'name', type: 'text', required: true }, { name: 'slug', type: 'text', unique: true, index: true }],
}
