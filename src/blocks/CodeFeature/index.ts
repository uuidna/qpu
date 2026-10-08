import { blockFields } from '../../fields/blockFields.js'

export const CodeFeature = blockFields('CodeFeature', 'Layout', 'A hex program featured beside its rich-text explanation: the value and receipt from the unit, and the source it stands for.', [{ name: 'richText', type: 'richText' }, { name: 'family', type: 'text' }, { name: 'program', type: 'text' }, { name: 'params', type: 'text' }, { name: 'code', type: 'textarea' }])
