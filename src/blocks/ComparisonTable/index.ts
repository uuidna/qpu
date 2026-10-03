import { blockFields } from '../../fields/blockFields'

export const ComparisonTable = blockFields('ComparisonTable', 'Layout', 'A grid comparing entries side by side.', [{ name: 'items', type: 'array', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'href', type: 'text' }] }])
