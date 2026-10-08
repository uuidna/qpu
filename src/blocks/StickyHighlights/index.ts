import { blockFields } from '../../fields/blockFields.js'

export const StickyHighlights = blockFields('StickyHighlights', 'Layout', 'Highlights that stick while the page scrolls, each a title and a description.', [{ name: 'items', type: 'array', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'href', type: 'text' }] }])
