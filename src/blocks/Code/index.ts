import { blockFields } from '../../fields/blockFields.js'

export const Code = blockFields('Code', 'Layout', 'A hex program rendered with its value and receipt, and the source it stands for.', [{ name: 'family', type: 'text' }, { name: 'program', type: 'text' }, { name: 'params', type: 'text' }, { name: 'code', type: 'textarea' }])
