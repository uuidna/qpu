import { GenericBlock, type GenericProps } from '../_generic'
import type { ExampleTabsBlock } from '@/payload-types'

/** Tabbed examples, each a title, a description and a link. Rendered by the one generic block over the shared vocabulary. */
export async function ExampleTabs(props: ExampleTabsBlock) {
  return GenericBlock(props as unknown as GenericProps)
}
