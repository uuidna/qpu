import { blockFields } from '../../fields/blockFields'

export const Media = blockFields('Media', 'Layout', 'A media reference with a caption.', [{ name: 'media', type: 'text', admin: { description: 'the media URL' } }, { name: 'caption', type: 'text' }])
