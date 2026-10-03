import { BlockWrapper } from '@/components/BlockWrapper'
import { LiveTable } from '@/components/LiveTable'
import { liveOf } from '@/app/_data'
import type { LiveBlock } from '@/payload-types'

/** Live public datasets read now and checked against the unit; `match` narrows them by label. */
export async function Live({ heading, intro, anchor, match }: LiveBlock) {
  const rows = (await liveOf()).filter((r) => !match || r.label.toLowerCase().includes(match.toLowerCase()))
  const agree = rows.filter((r) => r.result.agrees).length
  return (
    <BlockWrapper heading={heading} intro={`${intro ? `${intro} ` : ''}${agree} of ${rows.length} agree now.`} anchor={anchor}>
      <LiveTable rows={rows} />
    </BlockWrapper>
  )
}
