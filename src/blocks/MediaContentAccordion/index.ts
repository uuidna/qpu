import { blockFields } from '../../fields/blockFields.js'

export const MediaContentAccordion = blockFields('MediaContentAccordion', 'Layout', 'Rich text beside a media reference, in an accordion.', [{ name: 'richText', type: 'richText' }, { name: 'media', type: 'text', admin: { description: 'the media URL' } }, { name: 'caption', type: 'text' }])
