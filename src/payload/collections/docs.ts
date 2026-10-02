import type { CollectionConfig } from 'payload'

/** The documentation, generated from the inline docs (scripts/generate-docs.mjs) and seeded on init: the public site. */
export const Docs: CollectionConfig = {
  slug: 'docs',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'markdown', type: 'code', admin: { language: 'markdown' } },
    { name: 'html', type: 'code', admin: { language: 'html' } },
    { name: 'uuid', type: 'text', index: true },
  ],
}
