import { GenericBlock, type GenericProps } from '../_generic'
import type { CaseStudyCardsBlock } from '@/payload-types'

/** Cards, each a title, a description and a link. Rendered by the one generic block over the shared vocabulary. */
export async function CaseStudyCards(props: CaseStudyCardsBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
