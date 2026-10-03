import { GenericBlock, type GenericProps } from '../_generic'
import type { MediaBlock } from '@/payload-types'

/** A media reference with a caption. Rendered by the one generic block over the shared vocabulary. */
export async function Media(props: MediaBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
