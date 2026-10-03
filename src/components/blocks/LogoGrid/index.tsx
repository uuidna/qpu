import { GenericBlock, type GenericProps } from '../_generic'
import type { LogoGridBlock } from '@/payload-types'

/** A grid of marks, each a title and a link. Rendered by the one generic block over the shared vocabulary. */
export async function LogoGrid(props: LogoGridBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
