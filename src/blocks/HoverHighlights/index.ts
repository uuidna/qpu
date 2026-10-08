import { blockFields } from '../../fields/blockFields.js'

export const HoverHighlights = blockFields('HoverHighlights', 'Layout', 'Highlights revealed on hover, each a title and a description.', [{ name: 'items', type: 'array', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'href', type: 'text' }] }])
