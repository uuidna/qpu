import { GenericBlock, type GenericProps } from '../_generic'
import type { ComparisonTableBlock } from '@/payload-types'

/** A grid comparing entries side by side. Rendered by the one generic block over the shared vocabulary. */
export async function ComparisonTable(props: ComparisonTableBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
