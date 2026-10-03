import { GenericBlock, type GenericProps } from '../_generic'
import type { CodeFeatureBlock } from '@/payload-types'

/** A hex program featured beside its explanation. Rendered by the one generic block over the shared vocabulary. */
export async function CodeFeature(props: CodeFeatureBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
