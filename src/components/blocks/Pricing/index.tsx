import { GenericBlock, type GenericProps } from '../_generic'
import type { PricingBlock } from '@/payload-types'

/** A grid of plans, each a title, a description and a link. Rendered by the one generic block over the shared vocabulary. */
export async function Pricing(props: PricingBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
