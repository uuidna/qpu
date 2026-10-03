import { GenericBlock, type GenericProps } from '../_generic'
import type { BlogMarkdownBlock } from '@/payload-types'

/** A post body authored as rich text. Rendered by the one generic block over the shared vocabulary. */
export async function BlogMarkdown(props: BlogMarkdownBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
