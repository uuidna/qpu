// Build-time data for the background movie (a VitePress data loader): the formulas the movie plays, found in the
// statements the Lean kernel recorded in the theorem index, and the published figures it measures them against, read from the processor
// spec sheet. Nothing here restates a figure: the index and the sheet are the sources.
import { defineLoader } from 'vitepress'
import { THEOREMS } from '../../../src/quantum/processing/theorems-index.ts'
import { WILLOW } from '../../../src/quantum/processing/processor.ts'

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
export type MovieData = {
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
    const rcs = WILLOW.chips.randomCircuitSampling
    return {
      played: played.filter((p) => p.keys.length > 0),
      experiments: { bound, within: within.map(experiment), separated: separated.map(experiment) },
      missing: played.filter((p) => p.keys.length === 0).map((p) => p.formula),
      willow: { quantum: rcs.comparison.onWillow, classical: rcs.comparison.onClassicalSupercomputer, qubits: rcs.application.qubits, depth: rcs.application.depth },
    }
  },
})
