import { blockFields } from '../../fields/blockFields'

export const Pricing = blockFields('Pricing', 'Layout', 'A grid of plans, each a title, a description and a link.', [{ name: 'items', type: 'array', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'href', type: 'text' }] }])
