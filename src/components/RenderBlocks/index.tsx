import type React from 'react'
import { blockComponents } from '@/components/blocks'
import type { Page } from '@/payload-types'

type Block = NonNullable<Page['layout']>[number]
export type SearchParams = Record<string, string | string[] | undefined>

/** A page's layout, block by block: each block's component is the folder of the same name under components/blocks. */
export function RenderBlocks({ blocks, searchParams = {} }: { blocks?: Block[] | null; searchParams?: SearchParams }) {
  return (
    <div className="space-y-16">
      {(blocks ?? []).map((block, i) => {
        const Component = (blockComponents as Record<string, (p: Block & { searchParams: SearchParams }) => React.ReactNode>)[block.blockType]
        return Component ? <Component key={block.id ?? i} {...block} searchParams={searchParams} /> : null
      })}
    </div>
  )
}
