import { GenericBlock, type GenericProps } from '../_generic'
import type { CalloutBlock } from '@/payload-types'

/** A callout: rich text set apart from the flow. Rendered by the one generic block over the shared vocabulary. */
export async function Callout(props: CalloutBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
