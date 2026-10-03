import type { CollectionConfig } from 'payload'

export const SITE = { origin: 'https://qpu.uuidna.com', name: 'UUIDNA QPU' } as const

type DocLike = { slug?: unknown; title?: unknown; description?: unknown }
const textOf = (x: unknown): string => (typeof x === 'string' ? x : '')

/** The SEO plugin's generators, and the values every doc is saved with: the index is the site root, a page lives at its own slug. */
export const seoTitleOf = (doc: DocLike): string => (textOf(doc.slug) === 'index' ? SITE.name : [textOf(doc.title), SITE.name].filter(Boolean).join(' — '))
export const seoDescriptionOf = (doc: DocLike): string => textOf(doc.description).slice(0, 160)
export const seoURLOf = (doc: DocLike): string => (textOf(doc.slug) === 'index' ? SITE.origin : `${SITE.origin}/${textOf(doc.slug)}`)

/** The documentation, generated from the inline docs (scripts/generate-docs.mjs) and seeded on init: the public site. */
export const Docs: CollectionConfig = {
  slug: 'docs',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  hooks: {
    // the SEO fields are populated on every save, so no page waits for someone to press "auto-generate"
    beforeChange: [
      ({ data }) => {
        const meta = (data?.meta ?? {}) as { title?: string; description?: string }
        return { ...data, meta: { ...meta, title: meta.title || seoTitleOf(data ?? {}), description: meta.description || seoDescriptionOf(data ?? {}) } }
      },
    ],
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'markdown', type: 'code', admin: { language: 'markdown' } },
    { name: 'html', type: 'code', admin: { language: 'html' } },
    { name: 'uuid', type: 'text', index: true },
  ],
}
