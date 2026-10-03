import { GenericBlock, type GenericProps } from '../_generic'
import type { CardGridBlock } from '@/payload-types'

/** A grid of cards, each a title, a description and a link. Rendered by the one generic block over the shared vocabulary. */
export async function CardGrid(props: CardGridBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
