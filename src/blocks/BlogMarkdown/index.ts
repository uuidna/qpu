import { blockFields } from '../../fields/blockFields.js'

export const BlogMarkdown = blockFields('BlogMarkdown', 'Layout', 'A post body authored as rich text.', [{ name: 'richText', type: 'richText' }])
