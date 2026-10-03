import { GenericBlock, type GenericProps } from '../_generic'
import type { StepsBlock } from '@/payload-types'

/** An ordered set of steps, each a title and a description. Rendered by the one generic block over the shared vocabulary. */
export async function Steps(props: StepsBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
