// Build-time data for the background movie (a VitePress data loader): the formulas the movie plays, found in the
// statements the Lean kernel recorded in the theorem index, and the published figures it measures them against, read from the processor
// spec sheet. Nothing here restates a figure: the index and the sheet are the sources.
import { defineLoader } from 'vitepress'
import { THEOREMS } from '../../../src/quantum/uuid/programs/3/f/0/e/7/a/6/f/index.ts'
import { WILLOW } from '../../../src/quantum/uuid/programs/f/7/e/3/6/2/f/6/index.ts'
import { KEY, SCAN } from '../../../src/quantum/uuid/programs/7/2/1/a/a/e/7/d/index.ts'
import { FOLD } from './fold-index.ts'

// The movie plays formulas, not names. Each entry is a formula as the kernel index prints it, and the movie plays every
// theorem that states it, whatever the theorem is called: the separation of an experiment from the feasibility bound,
// the two bounds of a lane count, the clock's reflection, and the move of the witnesses.
const FORMULAS = [
  'tq ≤ b → b < tc → tq < tc',
  '1 ≤ max 1 share',
  'max 1 (min cores share) ≤ cores',
  'd - (d - x) = x',
  '2 * (k + 1) = 2 * k + 2',
]

/** A side of a closed comparison, evaluated: natural numbers joined by * and ^ (^ binds tighter, right to left). */
const evaluate = (side: string): number => side.split('*').map((factor) => factor.split('^').map((n) => Number(n.trim())).reduceRight((exp, base) => base ** exp)).reduce((a, b) => a * b, 1)

export type Experiment = { key: string; statement: string; sides: [number, number] }
/** The movie's clock, every value from the stream equality and the fold plan: the frames of a period and a frame's
 *  milliseconds, the period, the hours of the dial, an hour and a turn of it in milliseconds, the digits of a hexbit
 *  and its bits. */
export type MovieClock = { statement: string; frames: number; frameMs: number; periodMs: number; hours: number; hourMs: number; turnMs: number; digits: number; bits: number }
export type MovieData = {
  clock: MovieClock | null
  played: { formula: string; keys: string[] }[]
  experiments: { bound: number | null; within: Experiment[]; separated: Experiment[] }
  missing: string[]
  willow: { quantum: string; classical: string; qubits: number; depth: number }
}

declare const data: MovieData
export { data }

export default defineLoader({
  load(): MovieData {
    const played = FORMULAS.map((formula) => ({ formula, keys: THEOREMS.filter((row) => row.statement.includes(formula)).map((row) => row.key) }))
    // The experiments are found by the separation itself, never listed: a closed comparison of numbers a ≤ b states a
    // time within a bound, and the feasibility bound is the greatest such b; a closed comparison a < c is a separated
    // experiment exactly when the bound stands between its sides, a ≤ b and b < c.
    const closed = THEOREMS.flatMap(({ key, statement }) => { const m = /^([\d\s*^]+)([<≤])([\d\s*^]+)$/.exec(statement); return m ? [{ key, statement, strict: m[2] === '<', sides: [evaluate(m[1]!), evaluate(m[3]!)] as [number, number] }] : [] })
    const within = closed.filter((c) => !c.strict), bound = within.length ? Math.max(...within.map((c) => c.sides[1])) : null
    const separated = bound === null ? [] : closed.filter((c) => c.strict && c.sides[0] <= bound && bound < c.sides[1])
    const experiment = ({ key, statement, sides }: (typeof closed)[number]): Experiment => ({ key, statement, sides })
    // The clock is the scan stream the theme reads from the kernel's statement frames × milliseconds = key × vortex
    // (SCAN): its value is the period; the dial has as many hours as the key holds frames; an hour lasts as many
    // frames as the vortex number, so a turn is that many frames for each hour. The digits and their bits are the
    // fold plan's, which Lean writes (fold-index.ts).
    const hours = KEY / SCAN.frames
    const clock = { statement: SCAN.statement, frames: SCAN.frames, frameMs: SCAN.frameMs, periodMs: SCAN.periodMs, hours, hourMs: SCAN.vortex * SCAN.frameMs, turnMs: hours * SCAN.vortex * SCAN.frameMs, digits: FOLD.digits, bits: FOLD.halves.length }
    const rcs = WILLOW.chips.randomCircuitSampling
    return {
      clock,
      played: played.filter((p) => p.keys.length > 0),
      experiments: { bound, within: within.map(experiment), separated: separated.map(experiment) },
      missing: [...played.filter((p) => p.keys.length === 0).map((p) => p.formula), ...[]],
      willow: { quantum: rcs.comparison.onWillow, classical: rcs.comparison.onClassicalSupercomputer, qubits: rcs.application.qubits, depth: rcs.application.depth },
    }
  },
})
