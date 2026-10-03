import { BlockWrapper } from '@/components/BlockWrapper'
import { RunCard, type Run } from '@/components/Program'
import { runOf } from '@/app/_data'
import type { ProgramBlock } from '@/payload-types'

/** One hex program, minted from family, formulas and params and run as the page is served. */
export async function Program({ heading, intro, anchor, family, program, params }: ProgramBlock) {
  const nums = (params ?? '').split(',').map((x) => x.trim()).filter(Boolean).map(Number).slice(0, 3)
  let body
  try {
    const { uuid, run } = await runOf(family, program.split('+').map((x) => x.trim()).filter(Boolean), nums)
    body = <RunCard uuid={uuid} run={run as Run} />
  } catch (e) {
    body = <p className="text-sm text-destructive">{(e as Error).message}</p>
  }
  return <BlockWrapper heading={heading} intro={intro} anchor={anchor}>{body}</BlockWrapper>
}
