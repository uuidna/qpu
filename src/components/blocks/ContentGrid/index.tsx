import { GenericBlock, type GenericProps } from '../_generic'
import type { ContentGridBlock } from '@/payload-types'

/** A grid of content cells, each a title and a description. Rendered by the one generic block over the shared vocabulary. */
export async function ContentGrid(props: ContentGridBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
