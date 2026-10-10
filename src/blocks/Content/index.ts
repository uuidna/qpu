import type { Block } from 'payload'

/** Content — a row of sized columns, each richText with an optional link. The payloadcms/website `content` block. */
export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  admin: { group: 'QPU' },
  fields: [
    {
      name: 'columns',
      type: 'array',
      fields: [
        { name: 'size', type: 'select', defaultValue: 'oneThird', options: ['oneThird', 'half', 'twoThirds', 'full'] },
        { name: 'richText', type: 'richText' },
        { name: 'enableLink', type: 'checkbox' },
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}
