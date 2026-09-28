/**
 * A WALL WITH NO CAUSE NAMED, hunted in this package's own prose.
 *
 * A comment that says something CANNOT be done is read by the next person as settled. If the cause is named —
 * a host fact, a sealed theorem, a declared boundary, or "by construction" — that reading is correct and the
 * work behind the wall is genuinely out of reach. If no cause is named, the sentence is a CHOICE wearing the
 * costume of a limit: nobody re-examines it, and the thing behind it never gets done. Measured here the first
 * time this ran: 39 such walls across 55 files, in a package whose whole claim is that it computes exactly.
 *
 * PORTED RATHER THAN INVENTED, and the debt this pays is worth stating. The sibling repository has run this
 * finder for weeks and paid for two corrections that are built in here from the first line:
 *
 *   UNREADABLE IS NOT CLEAN. Its first version folded a file it could not open into "no walls here", so an
 *   unreadable source and a spotless one returned the same empty list. That cost a real control: a cure's
 *   before-and-after arms were both placed outside the reader's root, both read 0, and the cure looked
 *   unnecessary. This reader returns both answers and the caller must look at both.
 *
 *   THE VOCABULARY MUST ADMIT THE CURE IT PRINTS. Its fix text named four acceptable causes and its keyword
 *   list carried three — `declared boundary` was missing — so a cure written word for word in the third one
 *   was flagged again on the next run. All four are here.
 *
 * A REASON STATED AS A CLAUSE IS A NAMED REASON. "cannot tell busy from stuck; a live child answers" names its
 * cause in plain English and clearing it requires no keyword, so the clause forms are read too, each with a
 * twelve-character floor — `cannot, sadly` is a shrug, not a cause.
 *
 * THE WINDOW IS THREE LINES, because a comment sentence wraps and a cause whose colon landed on the next line
 * is still a cause.
 *
 *   node scripts/walls.mjs            the reading, and the receipt it writes
 */
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

const HERE = dirname(new URL(import.meta.url).pathname)
export const ROOT = resolve(HERE, '..')
export const RECEIPT = join(ROOT, 'walls-receipt.json')

const CLAIM = String.raw`(cannot|can't|is unable to|are unable to|impossible|no way to|must always|must never|(?:is|are) required to|require[sd]? that)`

/** a sentence that asserts a limit */
export const IMPOSSIBLE = new RegExp(String.raw`\b${CLAIM}\b`, 'i')

/** the four causes that settle one, and a named project decision, which is a legitimate source once it is named */
export const JUSTIFIED =
  /\b(theorem [a-z0-9_]+|by construction|declared boundary|host|browser|no filesystem|secure context|determinism|hard-reject|kernel|physical device|edge|isolate|tab|upstream|vendored|this project|the captain|decision|convention|rule of this|chosen|deliberate)\b/i

/** or the cause given as a clause, in either order, with a floor so a shrug does not clear a wall */
export const REASON_CLAUSE = new RegExp(
  [
    String.raw`\b${CLAIM}\b[^:.]{0,80}(?::\s*\S[^\n]{11,}|\s+(?:because|since|so that|which is why)\b)`,
    String.raw`\b${CLAIM}\b[^\n]{0,80}[—–;]\s*\S[^\n]{11,}`,
    String.raw`\S[^\n]{11,}[,)]?\s+(?:so|therefore|hence)\s+[^\n]{0,30}?\b${CLAIM}\b`,
  ].join('|'),
  'i',
)

const COMMENT = /^\s*(\/\/|\*|\/\*)/

/**
 * THE FINDER'S OWN FILES ARE EXEMPT, and this is the one exemption.
 *
 * walls.mjs must contain the forms it hunts in order to hunt them, and its test must WRITE a bare wall in order
 * to assert one is still caught. Without this the shortest path to a green run is to soften the controls until
 * they no longer contain what they exist to catch — the finder marking its own homework.
 */
export const SELF = new Set(['scripts/walls.mjs', 'scripts/walls.test.mjs'])

/** every source file of this package, discovered rather than listed */
export function sourcesOf(root = ROOT) {
  const out = []
  const skip = new Set(['node_modules', 'dist', '.git', '.lake', '.wrangler', 'coverage'])
  const walk = (dir) => {
    for (const entry of readdirSync(dir).sort()) {
      if (skip.has(entry) || entry.startsWith('.')) continue
      const path = join(dir, entry)
      if (statSync(path).isDirectory()) walk(path)
      else if (/\.(ts|mjs|js|lean)$/.test(entry) && !/\.d\.ts$/.test(entry)) out.push(relative(root, path))
    }
  }
  walk(root)
  return out
}

/**
 * The reading: every wall with no cause named, AND every file that could not be read — never folded together.
 *
 * A caller that looks only at `walls` and sees an empty array has learned nothing until it also sees that
 * `unreadable` is empty. That pair is the whole correction this port inherits.
 */
export function wallsOf(files, root = ROOT) {
  const walls = []
  const unreadable = []
  for (const rel of files) {
    if (SELF.has(rel)) continue
    let text
    try {
      text = readFileSync(join(root, rel), 'utf8')
    } catch {
      unreadable.push(rel)
      continue
    }
    const lines = text.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!COMMENT.test(line) || !IMPOSSIBLE.test(line)) continue
      const window = [lines[i - 1] ?? '', line, lines[i + 1] ?? ''].join(' ')
      if (JUSTIFIED.test(window) || REASON_CLAUSE.test(window)) continue
      walls.push({ file: rel, line: i + 1, claim: line.trim().slice(0, 140) })
    }
  }
  return { walls, unreadable }
}

/** the reading as it is committed: a count and its files, so a rise shows up as a diff rather than as a mood */
export const receiptOf = (reading) => ({
  kind: 'walls-receipt',
  walls: reading.walls.length,
  unreadable: reading.unreadable.length,
  byFile: Object.fromEntries(
    Object.entries(
      reading.walls.reduce((acc, w) => ({ ...acc, [w.file]: (acc[w.file] ?? 0) + 1 }), {}),
    ).sort(([a], [b]) => a.localeCompare(b)),
  ),
})

export const committedReceipt = () => (existsSync(RECEIPT) ? JSON.parse(readFileSync(RECEIPT, 'utf8')) : null)

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  const files = sourcesOf()
  const reading = wallsOf(files)
  const fresh = receiptOf(reading)
  const held = committedReceipt()
  console.log(`\n  WALLS WITH NO CAUSE NAMED — ${files.length} source file(s) read, ${reading.unreadable.length} unreadable\n`)
  for (const [file, n] of Object.entries(fresh.byFile)) console.log(`    ${String(n).padStart(3)}  ${file}`)
  console.log(`\n    ${String(fresh.walls).padStart(3)}  total`)
  if (reading.unreadable.length > 0) {
    console.log(`\n  UNMEASURED — these were never read, and are not counted as clean:`)
    for (const f of reading.unreadable) console.log(`    ${f}`)
  }
  writeFileSync(RECEIPT, JSON.stringify(fresh, null, 2) + '\n')
  // A RISE IS THE ONLY FAILURE. A drop rewrites the receipt, and `npm run proof` turns that into a diff that has
  // to be committed deliberately — the same ratchet this package already uses for test-receipt.json, rather than
  // a number typed into a second place.
  const rose = held !== null && fresh.walls > held.walls
  if (held === null) console.log(`\n  no receipt was held; ${fresh.walls} is now the committed reading\n`)
  else if (rose) console.error(`\n✗ walls — rose from ${held.walls} to ${fresh.walls}: a new limit was asserted without naming its cause\n`)
  else if (fresh.walls < held.walls) console.log(`\n✓ walls — fell from ${held.walls} to ${fresh.walls}; commit the receipt with the change that earned it\n`)
  else console.log(`\n✓ walls — ${fresh.walls}, unchanged, and every one of them is a real sentence in this tree\n`)
  if (reading.unreadable.length > 0) console.error('✗ walls — a file could not be read; "I could not look" is never spent as "nothing is open"')
  process.exit(rose || reading.unreadable.length > 0 ? 1 : 0)
}
