import { blockFields } from '../../fields/blockFields.js'

export const ContentGrid = blockFields('ContentGrid', 'Layout', 'A grid of content cells, each a title and a description.', [{ name: 'items', type: 'array', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'href', type: 'text' }] }])
