// Prose is linked to the source of its proof, or it stands on a committed list that only shrinks: no new sentence enters unlinked.
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { call } from '../../../../../../../../3/8/5/9/0/2/0/f/index.ts'
import { PROSE } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { PROSE_UNLINKED } from '../../../../../../../../3/7/2/f/3/1/1/5/index.ts'
import { gateProseLinks, linkedTheorems, nextUnlinked, unlinkedProse } from './index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a linked sentence names a kernel theorem whose Lean file states it, and the prose door answers that source. */
test('a linked sentence names a kernel theorem whose Lean file states it, and the prose door answers that source', () => {
  const name = 'quantumProcessingAgents_coordinateSays', links = linkedTheorems(PROSE[name])
  assert.deepEqual(links.map((l) => l.theorem).sort(), ['textbook_shards_cover', 'textbook_shards_disjoint'])
  for (const l of links) { assert.ok(existsSync(l.source), l.source); assert.ok(readFileSync(l.source, 'utf8').includes(`theorem ${l.theorem}`), l.theorem); assert.ok(l.statement.length > 0) }
  const answered = call('prose', { verify: name }).result!.structuredContent
  assert.deepEqual([answered.grounded, answered.theorems.map((t: { source: string }) => t.source)], [true, links.map((l) => l.source)])
  assert.deepEqual(linkedTheorems('a sentence that names no theorem at all'), [])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the gate holds on the tree, refuses a sentence that would enter the list, and requires a sentence since linked to be struck. */
test('the gate holds on the tree, refuses a sentence that would enter the list, and requires a sentence since linked to be struck', () => {
  const now = unlinkedProse(), gate = gateProseLinks()
  assert.deepEqual([gate.holds, gate.entering, gate.struck, gate.unlinked, gate.linked + gate.unlinked], [true, [], [], PROSE_UNLINKED.length, Object.keys(PROSE).length])
  assert.deepEqual([...PROSE_UNLINKED], now)
  // a sentence written today with no proof's source: it is not on the committed list, so it would enter, and the gate refuses
  const fresh = gateProseLinks(PROSE_UNLINKED.filter((n) => n !== now[0]))
  assert.deepEqual([fresh.holds, fresh.entering], [false, [now[0]]])
  assert.match(fresh.evidence, new RegExp(`\\+1 -0: ${now[0]}$`))
  // a listed sentence that has since been linked must leave the list in the same commit
  const stale = gateProseLinks([...PROSE_UNLINKED, 'quantumProcessingAgents_coordinateSays'])
  assert.deepEqual([stale.holds, stale.struck], [false, ['quantumProcessingAgents_coordinateSays']])
  // the generator never adds a name: from an empty list it writes none unless it is seeded, and it strikes what is linked
  assert.deepEqual([nextUnlinked([]).length, nextUnlinked([], true).length, nextUnlinked([now[0]!, 'quantumProcessingAgents_coordinateSays'])], [0, now.length, [now[0]]])
  // every commit, push and CI run is held to it
  for (const workflow of ['pre-commit', 'pre-push', 'ci']) assert.equal((call('repository', { workflow, facts: {} }).result!.structuredContent.decision.rules as { rule: string; holds: boolean }[]).find((r) => r.rule === 'linked')?.holds, true, workflow)
})
