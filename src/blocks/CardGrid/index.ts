import { blockFields } from '../../fields/blockFields'

export const CardGrid = blockFields('CardGrid', 'Layout', 'A grid of cards, each a title, a description and a link.', [{ name: 'items', type: 'array', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'href', type: 'text' }] }])
