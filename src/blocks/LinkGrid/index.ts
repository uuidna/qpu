import { blockFields } from '../../fields/blockFields'

export const LinkGrid = blockFields('LinkGrid', 'Layout', 'A grid of links, each a title and an href.', [{ name: 'items', type: 'array', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'href', type: 'text' }] }])
