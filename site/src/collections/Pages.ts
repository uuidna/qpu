import type { CollectionConfig } from 'payload'

import { revalidatePath } from 'next/cache'

import { isAdmin } from '../access/isAdmin'
import { publishedOnly } from '../access/publishedOnly'
import { fullTitle } from '../fields/fullTitle'
import { hero } from '../fields/hero'
import { slugField } from '../fields/slug'
import { formatPreviewURL } from '../utilities/formatPreviewURL'
import { collisionGuard } from './pages.qpu.hooks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: publishedOnly,
    readVersions: isAdmin,
    update: isAdmin,
  },
  admin: {
    defaultColumns: ['fullTitle', 'slug', 'createdAt', 'updatedAt'],
    livePreview: {
      url: ({ data }) => formatPreviewURL('pages', data),
    },
    preview: (doc) => formatPreviewURL('pages', doc),
    useAsTitle: 'fullTitle',
  },
  defaultPopulate: {
    slug: true,
    breadcrumbs: true,
    title: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    fullTitle,
    {
      name: 'noindex',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
      },
      label: 'No Index',
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blockReferences: [
                'qpu',
                'callout',
                'cta',
                'cardGrid',
                'caseStudyCards',
                'caseStudiesHighlight',
                'caseStudyParallax',
                'codeFeature',
                'content',
                'contentGrid',
                'comparisonTable',
                'form',
                'hoverCards',
                'hoverHighlights',
                'linkGrid',
                'logoGrid',
                'mediaBlock',
                'mediaContent',
                'mediaContentAccordion',
                'pricing',
                'reusableContentBlock',
                'slider',
                'statement',
                'steps',
                'stickyHighlights',
                'exampleTabs',
              ],
              blocks: [],
              required: true,
            },
          ],
          label: 'Content',
        },
      ],
    },
    slugField(),
    // the address an edit was based on, carried by any channel (an MCP client puts it in the data): read and dropped by collisionGuard, never stored
    { name: 'editBase', type: 'text', virtual: true, admin: { hidden: true } },
  ],
  hooks: {
    // an edit that names the address it read is accepted only while the document still folds to it (configure { kind: 'realtime' })
    beforeChange: [collisionGuard],
    afterChange: [
      ({ doc, previousDoc, req: { context } }) => {
        // outside a Next request (a seed, a migration) there is no cache to revalidate: the caller says so with context.disableRevalidate
        if (context?.disableRevalidate) return
        if (doc._status === 'published' || doc._status !== previousDoc._status) {
          if (doc.breadcrumbs && doc.breadcrumbs.length > 0) {
            revalidatePath(doc.breadcrumbs[doc.breadcrumbs.length - 1].url)
            console.log(`Revalidated: ${doc.breadcrumbs[doc.breadcrumbs.length - 1].url}`)
            if (doc.breadcrumbs[0].url === '/home') {
              revalidatePath('/')
              console.log(`Revalidated: /`)
            }
          } else {
            revalidatePath(`/${doc.slug}`)
            console.log(`Revalidated: /${doc.slug}`)
            if (doc.slug === 'home') {
              revalidatePath('/')
              console.log(`Revalidated: /`)
            }
          }
        }
      },
    ],
  },
  // every editor sees who holds a document; the draft streams to the store as it is typed (configure { kind: 'realtime' })
  lockDocuments: { duration: 300 },
  versions: {
    drafts: { autosave: { interval: 800 } },
  },
}
