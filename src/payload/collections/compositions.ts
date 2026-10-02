import type { CollectionConfig } from 'payload'

/**
 * Compositions Collection
 * Stores formula combinations for efficient querying
 */
export const Compositions: CollectionConfig = {
  slug: 'compositions',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    {
      name: 'hash',
      type: 'text',
      required: true,
      unique: true,
      index: true
    },
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'formulas',
      type: 'relationship',
      relationTo: 'formulas',
      hasMany: true,
      required: true
    },
    {
      name: 'domains',
      type: 'array',
      fields: [
        { name: 'domain', type: 'text' }
      ]
    },
    {
      name: 'problems',
      type: 'array',
      fields: [
        { name: 'problem', type: 'text' }
      ]
    },
    {
      name: 'metadata',
      type: 'json',
      admin: { readOnly: true }
    },
  ],
}
