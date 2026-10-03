import { GenericBlock, type GenericProps } from '../_generic'
import type { HoverHighlightsBlock } from '@/payload-types'

/** Highlights revealed on hover, each a title and a description. Rendered by the one generic block over the shared vocabulary. */
export async function HoverHighlights(props: HoverHighlightsBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
