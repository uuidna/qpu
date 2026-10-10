import type { Block } from 'payload'

/** Media — one upload from the media collection. The payloadcms/website `mediaBlock`. */
export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  admin: { group: 'QPU' },
  fields: [{ name: 'media', type: 'upload', relationTo: 'media', required: true }],
}
