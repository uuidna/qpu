// One pipeline from a commit to a release, each stage started by the hook after the one before it and gated by its own hook before:
// post-commit starts the push, which pre-push gates; post-push starts the pull request, which the checks gate; the landing starts the deploy
// and a deploy that passed starts the release (the workflows). Every stage has a context, a hexbit address: the UUID of its stage, the
// commit, the branch and the context before it, so the contexts are a chain and a stage started by a hook carries the address of the stage
// that started it. A hook before a stage checks that address; a stage started by hand carries none and is gated as it always was.
import { receiptOf } from '../uuid/programs/index.ts'
import { quantumCapacity } from './capacity.ts'

/** The stages the hooks chain on this machine, in order; the workflows carry the pull request on to the landing, the deploy and the release. */
export const PIPELINE = ['commit', 'push', 'ship'] as const
export type Stage = (typeof PIPELINE)[number]

/** A stage's context: its address is the receipt of { stage, head, branch, prev }, a UUID of the register, and prev is the context before it. */
export const stageContext = (stage: Stage, head: string, branch: string, prev: string | null = null) => {
  const r = receiptOf('pipeline', { stage, head, branch, prev }), c = quantumCapacity()
  return { stage, head, branch, prev, address: r.address, handle: r.handle, sealed: r.sealed, register: { free: c.register.free, full: c.full } }
}
/** The contexts of one commit on one branch, each holding the address of the one before. */
export const pipelineContexts = (head: string, branch: string) => {
  const commit = stageContext('commit', head, branch), push = stageContext('push', head, branch, commit.address), ship = stageContext('ship', head, branch, push.address)
  return { commit, push, ship }
}
/** What the hook before a stage decides of the context handed to it: none is a stage started by hand, and one given must be the address of
 *  the stage before, for this commit and branch. */
export const checkContext = (stage: Exclude<Stage, 'commit'>, given: string | null | undefined, head: string, branch: string) => {
  if (given === null || given === undefined || given === '') return { holds: true, by: 'hand' as const, evidence: 'by hand' }
  const before = pipelineContexts(head, branch)[PIPELINE[PIPELINE.indexOf(stage) - 1]!], holds = given === before.address
  return { holds, by: 'hook' as const, expected: before.address, evidence: `${before.stage} ${given}${holds ? '' : ` ≠ ${before.address}`}` }
}
