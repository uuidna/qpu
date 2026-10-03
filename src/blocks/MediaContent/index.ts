import { blockFields } from '../../fields/blockFields'

export const MediaContent = blockFields('MediaContent', 'Layout', 'Rich text beside a media reference.', [{ name: 'richText', type: 'richText' }, { name: 'media', type: 'text', admin: { description: 'the media URL' } }, { name: 'caption', type: 'text' }])
