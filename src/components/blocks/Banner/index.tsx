import { GenericBlock, type GenericProps } from '../_generic'
import type { BannerBlock } from '@/payload-types'

/** A banner: a heading, an intro and rich text, for a notice at the top of a page. Rendered by the one generic block over the shared vocabulary. */
export async function Banner(props: BannerBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
