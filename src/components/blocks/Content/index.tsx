import { RichText } from '@payloadcms/richtext-lexical/react'
import { BlockWrapper } from '@/components/BlockWrapper'
import type { ContentBlock } from '@/payload-types'

/** Rich text from Lexical, set in the typography scale. */
export function Content({ heading, intro, anchor, richText }: ContentBlock) {
  return (
    <BlockWrapper heading={heading} intro={intro} anchor={anchor}>
      {richText ? <RichText data={richText} className="prose max-w-3xl dark:prose-invert" /> : null}
    </BlockWrapper>
  )
}
