import { GenericBlock, type GenericProps } from '../_generic'
import type { MediaContentAccordionBlock } from '@/payload-types'

/** Rich text beside a media reference, in an accordion. Rendered by the one generic block over the shared vocabulary. */
export async function MediaContentAccordion(props: MediaContentAccordionBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
