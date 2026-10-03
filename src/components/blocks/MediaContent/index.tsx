import { GenericBlock, type GenericProps } from '../_generic'
import type { MediaContentBlock } from '@/payload-types'

/** Rich text beside a media reference. Rendered by the one generic block over the shared vocabulary. */
export async function MediaContent(props: MediaContentBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
