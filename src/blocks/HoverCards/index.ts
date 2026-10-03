import { blockFields } from '../../fields/blockFields'

export const HoverCards = blockFields('HoverCards', 'Layout', 'Cards revealed on hover, each a title and a description.', [{ name: 'items', type: 'array', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'href', type: 'text' }] }])
