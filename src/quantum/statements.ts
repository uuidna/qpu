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
  sycamore_gates: 'Sycamore accepts two two-qubit gates: cirq.ISWAP**0.5 and cirq.ISWAP**-0.5, with a duration of 32 ns; and the Sycamore gate, equivalent to FSimGate(π/2, π/6), with a duration of 12 ns. The page states one-qubit rotations take 25 ns on most Google devices.',
  echoes_preprint: 'Constructive interference at the edge of quantum ergodic dynamics (arXiv 2506.10191; published in Nature as "Observation of constructive interference at the edge of quantum ergodicity"). A 103-qubit superconducting processor measures second-order out-of-time-order correlators, OTOC(2). OTOC(2) is dominated by constructive interference between Pauli strings that form large loops in configuration space. The abstract states no quantitative speedup.',
  campus: 'Google Quantum AI\'s Santa Barbara campus is the headquarters for its quantum data center, quantum hardware research labs and processor fabrication facility. The lab page states no dates, sizes, staff counts or budgets.',
  campus_announcement: 'Announced May 18, 2021: the campus includes the first quantum data center, quantum hardware research laboratories and quantum processor chip fabrication facilities. The target is 1,000,000 physical qubits in a room-sized error-corrected quantum computer, with 1,000 physical qubits per logical qubit, against fewer than 100 qubits in systems of the time. Cryostats reach about 10 millikelvin.',
  qsim: 'qsim is a fast C++ and Python state-vector simulator for quantum circuits. It stores the state as a vector of complex amplitudes, uses gate fusion, single precision and vector instructions, and includes a Cirq interface (qsimcirq). It is Apache-2.0 licensed. The repository states no qubit or memory limits.',
  qualtran: 'Qualtran is a Python library for expressing and analyzing fault-tolerant quantum algorithms: a set of abstractions for quantum programs, with bloqs as its named abstraction. It is an experimental preview with no backward-compatibility guarantees, and it requires Python 3.12 or later.',
  openfermion: 'OpenFermion is an open-source Python package for compiling and analyzing quantum algorithms to simulate fermionic systems, including quantum chemistry. It provides data structures for fermionic and qubit Hamiltonians, with electronic-structure plugins for Psi4, PySCF, DIRAC and Q-Chem, and OpenFermion-FQE as a high-performance emulator of fermionic evolutions.',
  cirq_known_devices: 'Cirq\'s known_devices source defines Sycamore as a grid of 54 qubits and Sycamore23 as its 23-qubit subset. Couplers are not listed; they are computed from the grid\'s neighbours. Willow\'s device is loaded from the engine for the processor id willow_pink.',
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
