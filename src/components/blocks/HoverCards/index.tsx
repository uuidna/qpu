import { GenericBlock, type GenericProps } from '../_generic'
import type { HoverCardsBlock } from '@/payload-types'

/** Cards revealed on hover, each a title and a description. Rendered by the one generic block over the shared vocabulary. */
export async function HoverCards(props: HoverCardsBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
