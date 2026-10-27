// The statements quantumai.google and its linked PDF make, as the pages state them. Each text is a quotation or a faithful
// summary of one passage; the source for each is named beside it in leads.ts.
import { TABLES } from './tables-index.ts'

export const STATEMENTS = TABLES.STATEMENTS

export type StatementTopic = keyof typeof STATEMENTS

/** The five open-source tools the Software page names, as it describes them. Only Cirq is implemented in this repository. */
export const SOFTWARE: readonly { name: string; description: string; implemented: boolean }[] = [
  { name: 'Cirq', description: 'an open-source quantum framework for building and experimenting with NISQ algorithms on near-term processors', implemented: true },
  { name: 'qsim', description: 'a fast quantum circuit simulator that integrates with Cirq and runs quantum simulations on high-performance classical hardware', implemented: false },
  { name: 'Qualtran', description: 'a set of abstractions for representing quantum programs, and a library of quantum algorithms for quantum algorithms research', implemented: false },
  { name: 'OpenFermion', description: 'an open-source library for translating chemistry and materials science problems into quantum circuits that run on existing platforms', implemented: false },
  { name: 'TensorFlow Quantum', description: 'a quantum machine learning library for rapidly prototyping hybrid quantum-classical machine learning models within TensorFlow', implemented: false },
]
