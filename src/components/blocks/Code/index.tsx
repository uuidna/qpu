import { GenericBlock, type GenericProps } from '../_generic'
import type { CodeBlock } from '@/payload-types'

/** A hex program rendered with its value and receipt, and the source it stands for. Rendered by the one generic block over the shared vocabulary. */
export async function Code(props: CodeBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
