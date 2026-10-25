// The Google Quantum AI roadmap, as its published roadmap figure states it (Google Quantum AI, "roadmap and mission"; the
// figure's physical-qubit scale is read from its axis). A milestone the figure marks achieved has its check; the figure's
// caption names the one Google is working towards.

export type Milestone = {
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

/** The milestone Google is working towards, with the figure's own definition: capable of living for 1 million computational
 *  steps with less than 1 error. */
export const TARGET = 'Milestone 3: a long-lived logical qubit, capable of living for 1 million computational steps with less than 1 error'

/** The applications Google's roadmap figure predicts, by the physical qubits each needs with quantum error correction. */
export const APPLICATIONS: readonly { band: string; low: number; high: number; applications: readonly string[] }[] = [
  { band: '50k–100k', low: 50000, high: 100000, applications: ['Fundamental physics: quantum gravity, many-body states', 'Certified randomness'] },
  { band: '100k–500k', low: 100000, high: 500000, applications: ['Quantum magnets', 'Spectroscopy (NMR, ESR)', 'Quantum machine learning with "quantum data"', 'Novel phases of matter'] },
  { band: '500k–5M', low: 500000, high: 5000000, applications: ['Molecular modeling: drug targets and anti-targets, homogeneous catalysis, solar cell dye molecules', 'Topological data analysis', 'Some differential equations', 'Quantum machine learning of "classical data"'] },
  { band: '5M–50M', low: 5000000, high: 50000000, applications: ['Molecular modeling: better modeling of materials for our qubits, battery cathodes, heterogeneous catalysis, fusion reactor design', 'Factoring'] },
]
