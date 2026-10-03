import { blockFields } from '../../fields/blockFields'

/** Rich text, edited in Lexical. */
export const Content = blockFields('Content', 'Layout', [{ name: 'richText', type: 'richText' }])
