import { blockFields } from '../../fields/blockFields'

export const BlogContent = blockFields('BlogContent', 'Layout', 'A post body in Lexical rich text.', [{ name: 'richText', type: 'richText' }])
