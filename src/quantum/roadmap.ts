// The Google Quantum AI roadmap, as its published roadmap figure states it (Google Quantum AI, "roadmap and mission"; the
// figure's physical-qubit scale is read from its axis). A milestone the figure marks achieved has its check; the figure's
// caption names the one Google is working towards.
import { TABLES } from './tables-index.ts'

type Milestone = {
  number: number
  title: string
  year: string | null
  physicalQubits: number
  status: 'achieved' | 'in progress' | 'planned'
}

export const ROADMAP = TABLES.ROADMAP as unknown as readonly Milestone[]

/** The applications Google's roadmap figure predicts, by the physical qubits each needs with quantum error correction. */
export const APPLICATIONS: readonly { band: string; low: number; high: number; applications: readonly string[] }[] = TABLES.APPLICATIONS as readonly { band: string; low: number; high: number; applications: readonly string[] }[]
