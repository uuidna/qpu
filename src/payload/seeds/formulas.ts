/**
 * Formulas Seed Data
 * Auto-generated from formula definitions
 */
export const formulas = [
  {
    "id": "inv-barrier",
    "name": "Inversion Barrier",
    "domain": "causal",
    "problem": "P vs NP",
    "keywords": [
      "NP-hard",
      "information theory",
      "polynomial time"
    ],
    "description": "NP certificate space is irreversibly exponential"
  },
  {
    "id": "decomp",
    "name": "Hodge Decomposition",
    "domain": "xai",
    "problem": "Hodge Conjecture",
    "keywords": [
      "Hodge structure",
      "algebraic cycles"
    ],
    "description": "Explain Hodge structure via XAI"
  },
  {
    "id": "gauge-conv",
    "name": "Gauge Convergence",
    "domain": "federated",
    "problem": "Yang-Mills",
    "keywords": [
      "gauge symmetry",
      "QCD",
      "mass gap"
    ],
    "description": "Local gauge symmetry aggregates to energy gap"
  },
  {
    "id": "cycle-synth",
    "name": "Cycle Synthesis",
    "domain": "synthesis",
    "problem": "Hodge Conjecture",
    "keywords": [
      "algebraic varieties",
      "Chow groups"
    ],
    "description": "Synthesize algebraic cycle representatives"
  },
  {
    "id": "grassmann",
    "name": "Grassmannian Transfer",
    "domain": "transfer",
    "problem": "Hodge Conjecture",
    "keywords": [
      "Grassmannians",
      "Schubert varieties"
    ],
    "description": "Transfer proof from Grassmannian case"
  }
]

export async function seedFormulas(payload) {
  for (const formula of formulas) {
    try {
      await payload.create({ collection: 'formulas', data: formula })
    } catch (e) {
      // Exists already
    }
  }
}
