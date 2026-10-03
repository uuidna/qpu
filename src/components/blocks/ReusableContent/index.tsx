import { GenericBlock, type GenericProps } from '../_generic'
import type { ReusableContentBlock } from '@/payload-types'

/** Rich text reused across pages. Rendered by the one generic block over the shared vocabulary. */
export async function ReusableContent(props: ReusableContentBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
