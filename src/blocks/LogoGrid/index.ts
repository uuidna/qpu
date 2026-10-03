import { blockFields } from '../../fields/blockFields'

export const LogoGrid = blockFields('LogoGrid', 'Layout', 'A grid of marks, each a title and a link.', [{ name: 'items', type: 'array', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'href', type: 'text' }] }])
