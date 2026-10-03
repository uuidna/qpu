import { GenericBlock, type GenericProps } from '../_generic'
import type { SliderBlock } from '@/payload-types'

/** A slider of items, each a title, a description and a link. Rendered by the one generic block over the shared vocabulary. */
export async function Slider(props: SliderBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
