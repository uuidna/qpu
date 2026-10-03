import { GenericBlock, type GenericProps } from '../_generic'
import type { LinkGridBlock } from '@/payload-types'

/** A grid of links, each a title and an href. Rendered by the one generic block over the shared vocabulary. */
export async function LinkGrid(props: LinkGridBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
