// XPRIZE Quantum Applications, sponsored by Google Quantum AI, as its competition page states it on 2026-10-24. The page
// gives no Phase II deadline; the Wild Card window is the last entry window it names.
export const XPRIZE_QC_APPS = {
  name: 'XPRIZE Quantum Applications',
  url: 'https://www.xprize.org/competitions/qc-apps',
  prize: 5000000,
  years: [2024, 2027] as const,
  phase: 'Phase II, for the seven finalists',
  dates: {
    wildCardOpens: '2026-01-14',
    wildCardCloses: '2026-03-04',
    finalistsBook2026: '2026-05-10',
    winners: 'Spring 2027',
  },
  open: false,
  criteria: ['impact', 'resources', 'evidence', 'novelty'] as const,
  finalists: ['Calbee Quantum', 'Gibbs Samplers', 'Phasecraft (Materials Team)', 'Q4Proteins', 'QuantumForGraphproblem', 'The QuMIT', 'Xanadu'] as const,
} as const
