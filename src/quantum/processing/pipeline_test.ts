// One pipeline, post hooked to pre: each stage has a hexbit context that holds the one before it, a push the commit's hook started is gated
// on the commit's context, and the workflows name the step each hook starts.
import test from 'node:test'
import assert from 'node:assert/strict'
import { call } from './mcp.ts'
import { PIPELINE, checkContext, pipelineContexts, stageContext } from './pipeline.ts'

const HEAD = 'd248ff7ae0f1c2b3a4d5e6f708192a3b4c5d6e7f', BRANCH = 'claude/consumer-brief-1f2917'
const decide = (facts: object) => (call('repository', { workflow: 'pre-push', facts }).result!.structuredContent.decision.rules as { rule: string; holds: boolean | null; evidence: string }[]).find((r) => r.rule === 'chained')!

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the contexts of a commit are a chain of sealed UUIDs, each holding the address of the stage before, and another commit or branch has others. */
test('the contexts of a commit are a chain of sealed UUIDs, each holding the address of the stage before, and another commit or branch has others', () => {
  const c = pipelineContexts(HEAD, BRANCH)
  assert.deepEqual(PIPELINE.map((s) => c[s].stage), ['commit', 'push', 'ship'])
  assert.deepEqual([c.commit.prev, c.push.prev, c.ship.prev], [null, c.commit.address, c.push.address])
  for (const s of PIPELINE) assert.deepEqual([/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(c[s].address), c[s].handle, c[s].register.free, c[s].register.full], [true, c[s].address.replace(/-/g, '').substring(0, 8), 122, true], s)
  assert.equal(new Set(PIPELINE.map((s) => c[s].address)).size, 3)
  assert.deepEqual(stageContext('commit', HEAD, BRANCH), c.commit)
  assert.notEqual(pipelineContexts(HEAD, 'main').commit.address, c.commit.address)
  assert.notEqual(pipelineContexts(HEAD.replace('d2', 'e3'), BRANCH).commit.address, c.commit.address)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the hook before a push passes a push started by hand, passes the commit's own context and refuses any other. */
test('the hook before a push passes a push started by hand, passes the commit\'s own context and refuses any other', () => {
  const c = pipelineContexts(HEAD, BRANCH)
  assert.deepEqual([decide({}).holds, decide({}).evidence], [true, 'by hand'])
  assert.deepEqual([decide({ context: { given: c.commit.address, head: HEAD, branch: BRANCH } }).holds, checkContext('push', c.commit.address, HEAD, BRANCH).by], [true, 'hook'])
  // the context of another commit, of another branch, or of the wrong stage is not this push's
  for (const given of [pipelineContexts(HEAD.replace('d2', 'e3'), BRANCH).commit.address, pipelineContexts(HEAD, 'main').commit.address, c.push.address]) {
    const refused = decide({ context: { given, head: HEAD, branch: BRANCH } })
    assert.deepEqual([refused.holds, refused.evidence], [false, `commit ${given} ≠ ${c.commit.address}`])
  }
  assert.deepEqual([checkContext('ship', c.push.address, HEAD, BRANCH).holds, checkContext('ship', c.commit.address, HEAD, BRANCH).holds], [true, false])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the workflows name the step each hook after an act starts: the commit its push, the push its pull request. */
test('the workflows name the step each hook after an act starts: the commit its push, the push its pull request', () => {
  const steps = (workflow: string) => (call('repository', { workflow }).result!.structuredContent.workflow.steps as { id: string; cmd?: string; args?: string[]; detach?: boolean; says: string }[])
  const push = steps('post-commit').find((s) => s.id === 'push')!, ship = steps('post-push').find((s) => s.id === 'ship')!
  assert.deepEqual([push.cmd, push.args, push.detach, ship.cmd, ship.args, ship.detach], ['git', ['push', '-u', 'origin', 'HEAD'], true, 'gh', ['pr', 'create', '--base', 'main'], true])
  for (const s of [push, ship]) assert.match(s.says, /QPU_HOLD/)
  assert.ok((call('repository', { workflow: 'pre-push' }).result!.structuredContent.workflow.rules as { rule: string }[]).some((r) => r.rule === 'chained'))
})
