#!/usr/bin/env node
/**
 * GRAVITY — FILES AND CODE FALL TO THEIR MEANINGFUL PLACE, AUTONOMOUSLY. Learned from uuidna/verify: two invariants,
 * read from the files and the registry, pull every family to ZERO POINT (its one canonical path and address) and the
 * registry to ZERO TEMP (deterministic, regenerated from the filesystem, no drift):
 *
 *   1. meaningful path — a module that registers a hex FAMILY sits at src/families/<name>/index.ts (a DOOR sits at
 *      src/mcp/, beside the registry it serves). A file whose registered family does not match its path is off-point.
 *   2. meaningful routing — each family routes at a unique hex handle; the address names exactly one family.
 *
 * verify only DETECTS ("gravity would move it there"). Here gravity also MOVES: `--fix` renames each off-point family
 * (its index.ts and the test.ts beside it) to src/families/<name>/index.ts and clears the empty folder it left — so the
 * moving is gravity's, not a hand's. A routing collision is reported, never auto-resolved: two families at one handle is a
 * rename a human decides.
 *
 *   node scripts/gravity.mjs          report what is off-point
 *   node scripts/gravity.mjs --fix    move each off-point family to its meaningful path
 */
import { readFileSync, readdirSync, renameSync, mkdirSync, existsSync, rmdirSync } from 'node:fs'
import { join, dirname, relative, sep } from 'node:path'

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')
export const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]))

/** The family a module registers, or null — read from the source. */
export const familyOf = (src) => src.match(/qpuHexRegisterOf\('([a-zA-Z.]+)'/)?.[1] ?? null

/**
 * The moves gravity would make: for each entry { file, family }, the family file that is off its meaningful path
 * src/families/<name>/index.ts (doors excepted) and where it belongs. Pure — hand it the entries and the door set, it
 * returns the moves, so a test can drive it without a filesystem.
 */
export const offPathOf = (entries, doors) =>
  entries
    .filter(({ family }) => family && !doors.has(family))
    .map(({ file, family }) => ({ from: file, to: join(ROOT, 'src', 'families', family, 'index.ts'), family }))
    .filter(({ from, to }) => from !== to)

/** Read src for the family files and the family each registers — the entries offPathOf takes. */
export const entriesOf = () =>
  walk(join(ROOT, 'src'))
    // a family module is index.ts (a door is src/mcp/*.ts); test files — test.ts and *.test.ts — register fixtures, not families
    .filter((f) => f.endsWith('.ts') && !f.endsWith('test.ts'))
    .map((file) => ({ file, family: familyOf(readFileSync(file, 'utf8')) }))

/**
 * THE TRINITY THAT APPROVES AN AUTONOMOUS EDIT. No move is applied on one family's say-so: three coordinate and all three
 * must hold — gravity (the target IS the meaningful path), rule (the family is one lowercase word, the naming rule), gate
 * (the family's handle is taken by no other family, so routing stays unambiguous). Pure — hand it the move and the registry
 * (a handleOf and the families map), it returns each family's approval and whether the trinity approves. Complete
 * autonomous editing: the trinity decides, the mover acts only on 3-of-3.
 */
export const trinityOf = (move, { handleOf, families }) => {
  const path = move.to.endsWith(['src', 'families', move.family, 'index.ts'].join(sep))
  const name = /^[a-z]+$/.test(move.family)
  const handle = handleOf(move.family)
  const route = handle != null && ![...families].some(([fam]) => fam !== move.family && handleOf(fam) === handle)
  const approvals = [
    { by: 'gravity', holds: path, why: path ? 'meaningful path' : 'not the meaningful path' },
    { by: 'rule', holds: name, why: name ? 'one lowercase word' : 'not one lowercase word (the naming rule)' },
    { by: 'gate', holds: route, why: route ? `unique handle ${handle}` : `handle ${handle} collides` },
  ]
  return { move, approvals, approved: approvals.every((a) => a.holds) }
}

/**
 * THE EQUILIBRIUM OBSERVES AND AGREES. A trinity coordinates one move, but no autonomous edit lands unless EVERY family in
 * equilibrium around the center still holds after it: the whole set stays one-word names (rule observes), unique handles
 * (gate observes), so the lattice stays balanced around the zero point. Each observing family reports on the WHOLE set,
 * not the moved one alone; the consensus is their unanimous agreement. Pure — hand it the registry and a handleOf, it
 * returns each observer's agreement and whether the equilibrium agrees. (The path axis is offPathOf, the gravity observer.)
 */
export const consensusOf = (families, { handleOf, registered = () => true }) => {
  // the equilibrium is the registered file-families — the Lean families (Qpu.*) and the doors are not governed here
  const names = [...families.keys()].filter((f) => registered(f) && (families.get(f)?.length ?? 0) > 0)
  const offName = names.filter((f) => !/^[a-z]+$/.test(f))
  const seen = new Map()
  const collisions = []
  for (const f of names) {
    const h = handleOf(f)
    if (h == null) continue
    const other = seen.get(h)
    if (other && other !== f) collisions.push(`${f}~${other}@${h}`)
    else seen.set(h, f)
  }
  const observers = [
    { by: 'rule', holds: offName.length === 0, why: offName.length ? `names not one word: ${offName.join(', ')}` : `${names.length} names one word` },
    { by: 'gate', holds: collisions.length === 0, why: collisions.length ? `handle collisions: ${collisions.join(', ')}` : `${seen.size} unique handles` },
  ]
  return { observers, agreed: observers.every((o) => o.holds), count: names.length }
}

/** Move one off-point family to its meaningful path: index.ts and the test.ts beside it, then clear the empty folder. */
const move = ({ from, to, family }) => {
  mkdirSync(dirname(to), { recursive: true })
  renameSync(from, to)
  const fromTest = join(dirname(from), 'test.ts')
  const toTest = join(dirname(to), 'test.ts')
  if (existsSync(fromTest) && !existsSync(toTest)) renameSync(fromTest, toTest)
  try { if (readdirSync(dirname(from)).length === 0) rmdirSync(dirname(from)) } catch { /* not empty, leave it */ }
  return `${relative(ROOT, from)} → ${relative(ROOT, to)}  (${family})`
}

if (process.argv[1]?.endsWith('gravity.mjs')) {
  const doors = new Set(['qpu', 'crypto', 'api', 'data', 'gate'])
  const off = offPathOf(entriesOf(), doors)
  const fix = process.argv.includes('--fix')
  if (!fix) {
    if (off.length === 0) console.log('✓ gravity: every family is at zero point — on its meaningful path')
    else {
      for (const m of off) console.log(`off-point: ${relative(ROOT, m.from)} registers '${m.family}' — gravity would move it to src/families/${m.family}/index.ts`)
      console.log(`\n✗ ${off.length} off-point; run with --fix to let the equilibrium move them`)
      process.exit(1)
    }
  } else {
    // the whole equilibrium observes: load the registry and ask the families around the center whether they agree
    const { qpuHexFamiliesOf, qpuHexUuidOf, qpuHexRegisteredSizeOf } = await import('../dist/quantum/processing/unit/index.js')
    await import('../dist/mcp/families.js')
    const families = qpuHexFamiliesOf()
    const handleOf = (fam) => {
      const fs = families.get(fam)
      return fs?.length ? qpuHexUuidOf({ family: fam, program: [fs[0].name], params: [] }).split('-')[0] : null
    }
    const registered = (f) => qpuHexRegisteredSizeOf(f) > 0
    const consensus = consensusOf(families, { handleOf, registered })
    if (!consensus.agreed) {
      console.log('✗ the equilibrium does not agree — the families around the center are not all in balance:')
      for (const o of consensus.observers.filter((o) => !o.holds)) console.log(`   ${o.by}: ${o.why}`)
      console.log('restore the equilibrium first; no autonomous edit lands while the center disagrees')
      process.exit(1)
    }
    if (off.length === 0) {
      console.log(`✓ every family at zero point; the equilibrium of ${consensus.count} families agrees — nothing to move`)
    } else {
      let moved = 0
      for (const m of off) {
        const t = trinityOf(m, { handleOf, families })
        if (t.approved) { console.log('moved ' + move(m)); moved++ } else {
          console.log(`held back ${relative(ROOT, m.from)} — the trinity did not agree:`)
          for (const a of t.approvals.filter((a) => !a.holds)) console.log(`   ${a.by}: ${a.why}`)
        }
      }
      console.log(`\n✓ ${moved}/${off.length} moved with the equilibrium's agreement (${consensus.count} families observing)`)
    }
  }
}
