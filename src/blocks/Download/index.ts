import { blockFields } from '../../fields/blockFields.js'

export const Download = blockFields('Download', 'Layout', 'A downloadable reference with a caption.', [{ name: 'media', type: 'text', admin: { description: 'the media URL' } }, { name: 'caption', type: 'text' }])
