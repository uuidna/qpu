// The statements quantumai.google and its linked PDF make, as the pages state them. Each text is a quotation or a faithful
// summary of one passage; the source for each is named beside it in leads.ts.

export const STATEMENTS = {
  cirq: 'Cirq is a Python software library for writing, manipulating, and optimizing quantum circuits.',
  definition: 'Quantum computers use quantum physics to access different computational abilities from those of classical computers. A qubit can take the value of a complex combination of 0 and 1; a classical bit stores either 0 or 1.',
  progress: 'Google has been working on quantum computing since 2014. In 2019 it demonstrated beyond-classical performance (Milestone 1); in 2023 it demonstrated scaling quantum error correction (Milestone 2).',
  responsibility: 'Google aims to be honest and realistic about the progress and limitations of quantum computing. A fault-tolerant quantum computer could break RSA by factoring large primes. NIST has announced post-quantum tools to be standardized, one developed with Google\'s contributions.',
  vision: 'Our vision is that one day, people will use classical computers as well as quantum computers to expand the boundaries of human knowledge and solve some of the world\'s most complex problems.',
  hardware: 'Google Quantum AI\'s hardware focuses on superconducting qubits, which require specialized cryogenic environments and custom control electronics. It is built in the Santa Barbara facility.',
  early_access: 'The Willow Early Access Program selects a cohort of research partners for exclusive access to Willow, which is not yet available to the public. The submission deadline is May 15, 2026.',
  neutral_atoms: 'Google is expanding its quantum computing effort to include neutral atom quantum computing, which uses individual atoms as qubits. The page gives no Google device figures for it.',
} as const

export type StatementTopic = keyof typeof STATEMENTS

/** The five open-source tools the Software page names, as it describes them. Only Cirq is implemented in this repository. */
export const SOFTWARE: readonly { name: string; description: string; implemented: boolean }[] = [
  { name: 'Cirq', description: 'an open-source quantum framework for building and experimenting with NISQ algorithms on near-term processors', implemented: true },
  { name: 'qsim', description: 'a fast quantum circuit simulator that integrates with Cirq and runs quantum simulations on high-performance classical hardware', implemented: false },
  { name: 'Qualtran', description: 'a set of abstractions for representing quantum programs, and a library of quantum algorithms for quantum algorithms research', implemented: false },
  { name: 'OpenFermion', description: 'an open-source library for translating chemistry and materials science problems into quantum circuits that run on existing platforms', implemented: false },
  { name: 'TensorFlow Quantum', description: 'a quantum machine learning library for rapidly prototyping hybrid quantum-classical machine learning models within TensorFlow', implemented: false },
]
