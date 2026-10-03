import { GenericBlock, type GenericProps } from '../_generic'
import type { CaseStudiesHighlightBlock } from '@/payload-types'

/** A grid highlighting entries, each a title, a description and a link. Rendered by the one generic block over the shared vocabulary. */
export async function CaseStudiesHighlight(props: CaseStudiesHighlightBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
