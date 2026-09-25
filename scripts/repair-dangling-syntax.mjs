/**
 * Repair the dangling syntax a bulk edit of index.ts leaves behind.
 *
 * Three shapes, each the residue of deleting a line from the middle of a
 * construct: a trailing comma left alone before its closing brace, and an `&&`
 * left with nothing on its right because the last conjunct went. None of them
 * is a style preference — each is a parse error or a silently altered
 * conjunction, so this runs after an edit and before a build.
 *
 * IT WAS CALLED purge-slogans.mjs, which is a job it has never done: the word
 * "slogan" appears nowhere in it and it removes no prose. A file whose name
 * states a job it does not do is the thing the naming guard now refuses, and
 * this one was the guard's first finding about itself.
 *
 *   node scripts/repair-dangling-syntax.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const file = new URL('../src/quantum/processing/unit/index.ts', import.meta.url)
const before = readFileSync(file, 'utf8')

const after = before
  .replace(/ ,\n\s*\}/g, ' }')
  .replace(/&&\n  return \{/g, '\n  return {')
  .replace(/&&\n\nexport /g, '\n\nexport ')

if (after === before) {
  console.log('no dangling syntax to repair')
} else {
  writeFileSync(file, after)
  console.log(`repaired dangling syntax — ${before.length - after.length} characters removed`)
}
