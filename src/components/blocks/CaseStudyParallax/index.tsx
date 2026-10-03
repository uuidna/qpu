import { GenericBlock, type GenericProps } from '../_generic'
import type { CaseStudyParallaxBlock } from '@/payload-types'

/** A media reference shown with parallax, with a caption. Rendered by the one generic block over the shared vocabulary. */
export async function CaseStudyParallax(props: CaseStudyParallaxBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
