/**
 * LEAN FEEDS THE REST — A FAMILY NEVER HARDCODES A VALUE A THEOREM PROVES. The degree constants the Lean module Qpu.Pi
 * proves (180 = pi_half_turn, 360 = pi_turn_degrees) are written in the families as the lattice names halfTurn / fullTurn
 * from qpuLatticeNamesOf(), not as literals. The codemod scripts/theorem-constants.mjs --check reports any family that
 * still types one in; this gate holds it at zero. Deterministic, token-free.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'

test('no family hardcodes a degree constant a theorem proves (lean feeds the rest)', () => {
  const root = join(dirname(new URL(import.meta.url).pathname), '..')
  let out = ''
  try {
    out = execFileSync('node', ['scripts/theorem-constants.mjs', '--check'], { cwd: root, encoding: 'utf8' })
  } catch (e) {
    assert.fail(`families still hardcode a theorem's degree constant — run \`node scripts/theorem-constants.mjs\`:\n${(e.stdout ?? '') + (e.stderr ?? '')}`)
  }
  assert.match(out, /would rewrite 0 families/, out.trim())
})
