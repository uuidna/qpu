import type { CollectionConfig } from 'payload'

/** Partners, each a name, a site and the categories that filter them. Laid out the payloadcms/website way: src/collections/Partners.ts, auto-wired by the generator. */
export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: { useAsTitle: 'name' },
  fields: [{ name: 'name', type: 'text', required: true }, { name: 'slug', type: 'text', unique: true, index: true }, { name: 'website', type: 'text' }, { name: 'filters', type: 'relationship', relationTo: 'partner-filters', hasMany: true }],
}
