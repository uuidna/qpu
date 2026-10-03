import { blockFields } from '../../fields/blockFields'

export const Steps = blockFields('Steps', 'Layout', 'An ordered set of steps, each a title and a description.', [{ name: 'items', type: 'array', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'href', type: 'text' }] }])
