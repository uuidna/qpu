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

export const ROADMAP: readonly Milestone[] = [
  { number: 1, title: 'Beyond classical', year: '2019', physicalQubits: 54, status: 'achieved' },
  { number: 2, title: 'Logical qubit prototype', year: '2023', physicalQubits: 100, status: 'achieved' },
  { number: 3, title: '1 long-lived logical qubit', year: '2025+', physicalQubits: 1000, status: 'in progress' },
  { number: 4, title: 'Tileable module (logical gate)', year: null, physicalQubits: 10000, status: 'planned' },
  { number: 5, title: 'Engineering scale up', year: null, physicalQubits: 100000, status: 'planned' },
  { number: 6, title: 'Error-corrected quantum computer', year: null, physicalQubits: 1000000, status: 'planned' },
]

/** The applications Google's roadmap figure predicts, by the physical qubits each needs with quantum error correction. */
export const APPLICATIONS: readonly { band: string; low: number; high: number; applications: readonly string[] }[] = TABLES.APPLICATIONS as readonly { band: string; low: number; high: number; applications: readonly string[] }[]
