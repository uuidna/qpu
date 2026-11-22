// Build-time data for the background movie (a VitePress data loader): the theorems the movie plays, as the Lean kernel
// recorded them in the theorem index, and the published figures it measures them against, read from the processor
// spec sheet. Nothing here restates a figure: the index and the sheet are the sources.
import { defineLoader } from 'vitepress'
import { THEOREMS } from '../../../src/quantum/processing/theorems-index.ts'
import { WILLOW } from '../../../src/quantum/processing/processor.ts'

const PLAYED = [
  'Supremacy.separation',
  'Supremacy.willow_rcs',
  'Supremacy.sycamore_rcs_within',
  'Supremacy.lanes_pos',
  'Supremacy.lanes_le_cores',
  'textbook_clock_clone_involution',
  'textbook_witness_clock_move',
]

export type MovieTheorem = { key: string; module: string; statement: string; axioms: readonly string[] }
export type MovieData = { theorems: MovieTheorem[]; missing: string[]; willow: { quantum: string; classical: string; qubits: number; depth: number } }

declare const data: MovieData
export { data }

export default defineLoader({
  load(): MovieData {
    const theorems = PLAYED.flatMap((key) => THEOREMS.filter((row) => row.key === key).map(({ key, module, statement, axioms }) => ({ key, module, statement, axioms })))
    const rcs = WILLOW.chips.randomCircuitSampling
    return {
      theorems,
      missing: PLAYED.filter((key) => !theorems.some((row) => row.key === key)),
      willow: { quantum: rcs.comparison.onWillow, classical: rcs.comparison.onClassicalSupercomputer, qubits: rcs.application.qubits, depth: rcs.application.depth },
    }
  },
})
