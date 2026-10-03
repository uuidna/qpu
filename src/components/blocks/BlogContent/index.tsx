import { GenericBlock, type GenericProps } from '../_generic'
import type { BlogContentBlock } from '@/payload-types'

/** A post body in Lexical rich text. Rendered by the one generic block over the shared vocabulary. */
export async function BlogContent(props: BlogContentBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
