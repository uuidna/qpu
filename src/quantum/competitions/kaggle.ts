// Google Quantum AI's Kaggle competition, Verifiable Quantum Circuit Compilation (arXiv:2610.23832). The record is the
// competition's own: its dates, prize and the three benchmarks with the cost each one scores. The baseline values are the
// benchmark module's, so the constants live in one place.
import { baseline, baselineScore } from '../processing/unit/fusion.js'

export const KAGGLE_COMPETITION = {
  name: 'Google Quantum AI, Verifiable Quantum Circuit Compilation',
  kaggle: 'https://www.kaggle.com/competitions/google-verifiable-quantum-circuit-compilation',
  start: '2026-10-22',
  end: '2027-01-20',
  prize: 150000,
  benchmarks: {
    fusion: { formula: 'S = Q × C, C = Toffolis + T/4 per shot', scored: false, baseline: { ...baseline, S: baselineScore() } },
    dqi: { formula: 'S = R(ε+) × Q² × T, T the Toffoli count', scored: false },
    chemistry: { formula: 'S = λ_eff × T_tot × Q_tot', scored: false },
  },
} as const
