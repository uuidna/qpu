/**
 * THE WALL FINDER, PROVED ABLE TO FIRE AND ABLE TO CLEAR.
 *
 * A finder that reads zero is worthless until it has been shown catching something, and a finder that flags
 * everything is worse than none. Both arms are asserted here, on the same reader, because either alone passes
 * against a broken instrument: "found nothing" passes against a reader that never opens a file, and "found the
 * planted one" passes against a reader that flags every comment.
 *
 * THE THIRD ANSWER IS ASSERTED TOO. An unreadable file must be named UNMEASURED and never folded into clean —
 * the sibling repository lost a control to exactly that collapse, where a cure's before and after arms both
 * read zero because both were placed where the reader could not see them.
 *
 * This file deliberately CONTAINS bare walls in its fixtures. That is why walls.mjs exempts its own two files:
 * the shortest path to a green run would otherwise be to soften these fixtures until they no longer contain
 * what they exist to catch.
 *
 *   node --test scripts/walls.test.mjs
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { IMPOSSIBLE, JUSTIFIED, REASON_CLAUSE, SELF, sourcesOf, wallsOf, receiptOf, committedReceipt, ROOT } from './walls.mjs'

/** a throwaway tree, so a fixture never touches the package */
const inTree = (files) => {
  const dir = mkdtempSync(join(tmpdir(), 'walls-'))
  for (const [name, body] of Object.entries(files)) writeFileSync(join(dir, name), body)
  return { dir, done: () => rmSync(dir, { recursive: true, force: true }) }
}

test('A BARE WALL IS CAUGHT — the arm without which a reading of zero means nothing', () => {
  const t = inTree({ 'a.mjs': '// this cannot be done here\nexport const x = 1\n' })
  const r = wallsOf(['a.mjs'], t.dir)
  t.done()
  assert.equal(r.walls.length, 1, 'a comment asserting a limit with no cause named must be caught')
  assert.equal(r.walls[0].line, 1, 'and it names the line, so the finding is actionable')
  assert.deepEqual(r.unreadable, [], 'a readable file is not reported as unreadable')
})

test('EACH OF THE FOUR NAMED CAUSES CLEARS, including the one the printed cure recommends', () => {
  const fixtures = {
    'host.mjs': '// cannot read it — no filesystem in this host\n',
    'theorem.mjs': '// cannot exceed it, by theorem qpu_balance_holds\n',
    'construction.mjs': '// cannot happen by construction\n',
    'boundary.mjs': '// cannot classify it from the name alone, which is the declared boundary of this reader\n',
  }
  const t = inTree(fixtures)
  const r = wallsOf(Object.keys(fixtures), t.dir)
  t.done()
  assert.deepEqual(r.walls, [], `every named cause must clear — flagged: ${JSON.stringify(r.walls)}`)
})

test('A CAUSE GIVEN AS A CLAUSE CLEARS, and a shrug does not', () => {
  const fixtures = {
    'clause.mjs': '// cannot tell busy from stuck; a live child answers on its own socket\n',
    'because.mjs': '// cannot be folded because the reading comes from a clock outside this package\n',
    'shrug.mjs': '// cannot flash firmware — sadly\n',
    'bare.mjs': '// so it cannot be done\n',
  }
  const t = inTree(fixtures)
  const r = wallsOf(Object.keys(fixtures), t.dir)
  t.done()
  const flagged = r.walls.map((w) => w.file).sort()
  assert.deepEqual(flagged, ['bare.mjs', 'shrug.mjs'],
    `a stated cause clears and a shrug does not — flagged ${JSON.stringify(flagged)}`)
})

test('THE WINDOW IS THREE LINES, because a comment sentence wraps', () => {
  const t = inTree({ 'wrap.mjs': '// cannot be computed here\n// because the host owns the clock\n' })
  const r = wallsOf(['wrap.mjs'], t.dir)
  t.done()
  assert.deepEqual(r.walls, [], 'a cause on the following line is still a cause')
})

test('A FILE THAT CANNOT BE READ IS UNMEASURED, never folded into clean', () => {
  const r = wallsOf(['this-file-does-not-exist.mjs'])
  assert.deepEqual(r.walls, [], 'an unread file makes no claims')
  assert.deepEqual(r.unreadable, ['this-file-does-not-exist.mjs'],
    'and it MUST be named — an empty unreadable list here means "I could not look" was spent as "nothing is open"')
})

test('THE CONTROL — the two answers are distinguishable, so the third is load-bearing', () => {
  // without this arm, the test above also passes against a reader that calls EVERYTHING unreadable
  const r = wallsOf(sourcesOf())
  assert.deepEqual(r.unreadable, [], 'this package\'s own sources are all readable')
  assert.ok(r.walls.length > 0,
    'and the tree carries real walls — a reading of zero here would mean the finder stopped finding, not that '
    + 'every limit in this package names its cause')
})

test('the finder exempts only itself, and code is not exempt', () => {
  assert.deepEqual([...SELF].sort(), ['scripts/walls.mjs', 'scripts/walls.test.mjs'])
  const files = sourcesOf()
  assert.ok(files.includes('src/quantum/processing/unit/index.ts'), 'the sealed unit is read like anything else')
  assert.ok(files.length > 20, `the walk must actually reach the tree — found ${files.length}`)
})

test('the committed receipt is this tree\'s reading, and a rise would show as a diff', () => {
  const held = committedReceipt()
  assert.ok(held !== null, 'walls-receipt.json must be committed, or a rise has nothing to be measured against')
  const fresh = receiptOf(wallsOf(sourcesOf()))
  assert.equal(fresh.walls, held.walls,
    `the reading (${fresh.walls}) must equal the committed receipt (${held.walls}) — run \`npm run walls\` and `
    + 'commit the receipt with the change that moved it')
  assert.deepEqual(fresh.byFile, held.byFile, 'and per file, so a wall moving between files is not invisible')
  assert.equal(held.unreadable, 0, 'a committed receipt with unreadable files would be a receipt for a partial look')
})

test('the predicates are not vacuous on their own', () => {
  assert.ok(IMPOSSIBLE.test('it cannot be done'))
  assert.ok(!IMPOSSIBLE.test('it is done'))
  assert.ok(JUSTIFIED.test('by construction'))
  assert.ok(!JUSTIFIED.test('for reasons'))
  assert.ok(REASON_CLAUSE.test('cannot A: the host has no clock at all'))
  assert.ok(!REASON_CLAUSE.test('cannot A. cannot B.'), 'a full stop ends the clause; the next claim stands alone')
  assert.ok(ROOT.endsWith('qpu'), 'the reader is rooted at this package')
})
