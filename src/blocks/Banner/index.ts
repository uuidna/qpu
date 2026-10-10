import type { Block } from 'payload'

/** Banner — a styled callout. The payloadcms/website `banner` block. */
export const Banner: Block = {
  slug: 'banner',
  interfaceName: 'BannerBlock',
  admin: { group: 'QPU' },
  fields: [
    { name: 'style', type: 'select', defaultValue: 'info', options: ['info', 'warning', 'error', 'success'] },
    { name: 'content', type: 'richText' },
  ],
}
