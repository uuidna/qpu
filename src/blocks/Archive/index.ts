import type { Block } from 'payload'

/** Archive — a populated list of docs, by collection or hand-picked. The payloadcms/website `archive` block. */
export const Archive: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  admin: { group: 'QPU' },
  fields: [
    { name: 'introContent', type: 'richText' },
    { name: 'populateBy', type: 'select', defaultValue: 'collection', options: ['collection', 'selection'] },
    { name: 'relationTo', type: 'select', defaultValue: 'posts', options: ['posts'] },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
    { name: 'limit', type: 'number', defaultValue: 10 },
    { name: 'selectedDocs', type: 'relationship', relationTo: ['posts'], hasMany: true },
  ],
}
