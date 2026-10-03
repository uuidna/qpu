import { GenericBlock, type GenericProps } from '../_generic'
import type { StickyHighlightsBlock } from '@/payload-types'

/** Highlights that stick while the page scrolls, each a title and a description. Rendered by the one generic block over the shared vocabulary. */
export async function StickyHighlights(props: StickyHighlightsBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
