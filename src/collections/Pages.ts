import type { CollectionConfig } from 'payload'
import { publishedOnly } from '../access/publishedOnly'
import { seoDescriptionOf, seoTitleOf, seoURLOf } from './Docs'

/** Pages built from blocks, as payloadcms/website builds its own: drafts, a preview at the page's address, SEO filled on
 *  save. The blocks are every folder under src/blocks. The page `home` is the site root; any other lives at its slug. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'updatedAt'], preview: (doc) => seoURLOf(doc) },
  access: { read: publishedOnly },
  versions: { drafts: true },
  hooks: {
    beforeChange: [
      ({ data }) => {
        const meta = (data?.meta ?? {}) as { title?: string; description?: string }
        return { ...data, meta: { ...meta, title: meta.title || seoTitleOf(data ?? {}), description: meta.description || seoDescriptionOf(data ?? {}) } }
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, admin: { position: 'sidebar' } },
    { name: 'description', type: 'textarea' },
  ],
}
