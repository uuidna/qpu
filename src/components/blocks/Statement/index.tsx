import { GenericBlock, type GenericProps } from '../_generic'
import type { StatementBlock } from '@/payload-types'

/** A single statement in rich text. Rendered by the one generic block over the shared vocabulary. */
export async function Statement(props: StatementBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
