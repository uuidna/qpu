import { GenericBlock, type GenericProps } from '../_generic'
import type { DownloadBlock } from '@/payload-types'

/** A downloadable reference with a caption. Rendered by the one generic block over the shared vocabulary. */
export async function Download(props: DownloadBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
