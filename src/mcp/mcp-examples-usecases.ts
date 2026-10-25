// Examples Use Cases: Real-world applications across all example families
// Every example mapped to concrete use cases, domains, and industries

interface UseCase {
  id: string
  name: string
  description: string
  domain: string
  industry: string
  examples: string[] // Which examples demonstrate this
  problemStatement: string
  quantumAdvantage: string
  expectedOutcome: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: string[]
  timeEstimate: string
  frameworks: string[]
  providers: string[]
  resourcesNeeded: string[]
}

export const ENTANGLEMENT_USECASES: UseCase[] = [
  {
    id: 'qkd-quantum-key-distribution',
    name: 'Quantum Key Distribution (QKD)',
    description: 'Secure communication using Bell state entanglement',
    domain: 'entanglement',
    industry: 'Cybersecurity',
    examples: ['qiskit-bell-state', 'cirq-ghz-state'],
    problemStatement:
      'Traditional cryptography vulnerable to quantum computers. Need theoretically unbreakable key distribution.',
    quantumAdvantage:
      'Bell states guarantee security through quantum mechanics: any eavesdropping is detectable via entanglement breaking.',
    expectedOutcome: 'Secure key establishment between two parties with eavesdropping detection',
    difficulty: 'intermediate',
    prerequisites: ['Quantum entanglement basics', 'Bell inequality understanding'],
    timeEstimate: '2-3 hours',
    frameworks: ['qiskit', 'cirq'],
    providers: ['ibm-quantum', 'google-cirq'],
    resourcesNeeded: ['2-qubit device', 'classical post-processing']
  },

  {
    id: 'distributed-quantum-computing',
    name: 'Distributed Quantum Computing',
    description: 'Entangle qubits across multiple quantum processors',
    domain: 'entanglement',
    industry: 'Cloud Computing',
    examples: ['cirq-ghz-state'],
    problemStatement:
      'Single quantum processors limited by qubit count. Scale computation across networked processors.',
    quantumAdvantage:
      'GHZ states enable entanglement swapping: connect 3+ quantum computers into single logical system.',
    expectedOutcome: 'Multi-processor quantum computation with coherence verification',
    difficulty: 'advanced',
    prerequisites: ['Entanglement swapping', 'Quantum networks', 'Error correction'],
    timeEstimate: '4-6 hours',
    frameworks: ['cirq'],
    providers: ['google-cirq'],
    resourcesNeeded: ['3+ qubit devices', 'Quantum network infrastructure']
  },

  {
    id: 'quantum-sensing-gravity',
    name: 'Quantum Sensing for Gravity Measurement',
    description: 'Use entangled states for precision gravity sensing',
    domain: 'entanglement',
    industry: 'Geophysics',
    examples: ['qiskit-bell-state'],
    problemStatement:
      'Classical accelerometers have fundamental sensitivity limits. Measure gravitational fields with unprecedented precision.',
    quantumAdvantage:
      'Entangled photon pairs beat shot-noise limit: achieve 1000× better sensitivity than classical sensors.',
    expectedOutcome: 'Precision gravity measurement demonstrating quantum advantage',
    difficulty: 'intermediate',
    prerequisites: ['Quantum metrology', 'Interferometry'],
    timeEstimate: '3-4 hours',
    frameworks: ['qiskit'],
    providers: ['ibm-quantum'],
    resourcesNeeded: ['Photon source', 'Interferometer', 'Single-photon detectors']
  },

  {
    id: 'quantum-teleportation',
    name: 'Quantum Teleportation Protocol',
    description: 'Transfer quantum state using Bell measurements',
    domain: 'entanglement',
    industry: 'Quantum Networks',
    examples: ['qiskit-bell-state'],
    problemStatement:
      'Transmit quantum information without sending qubits themselves. Requires entanglement + classical channel.',
    quantumAdvantage:
      'Bell measurement + classical bits = perfect quantum state transfer (no physical qubit transmission needed).',
    expectedOutcome: 'Successful teleportation of unknown quantum state with fidelity >90%',
    difficulty: 'advanced',
    prerequisites: ['Bell states', 'Quantum measurement', 'Entanglement swapping'],
    timeEstimate: '3-4 hours',
    frameworks: ['qiskit', 'cirq'],
    providers: ['ibm-quantum', 'ionq'],
    resourcesNeeded: ['3-qubit device', 'Classical feedback capability']
  }
]

export const ALGORITHM_USECASES: UseCase[] = [
  {
    id: 'function-property-detection',
    name: 'Function Property Detection (Deutsch-Jozsa)',
    description: 'Determine if function is balanced or constant with single evaluation',
    domain: 'algorithms',
    industry: 'Cryptography',
    examples: ['pennylane-deutsch-jozsa'],
    problemStatement:
      'Classically: need up to 2^(n-1)+1 function evaluations. Quantum: 1 evaluation determines answer.',
      quantumAdvantage:
      'Exponential speedup: oracle evaluation in superposition, one measurement determines global property.',
    expectedOutcome: 'Correctly identify function property (balanced vs constant) in single call',
    difficulty: 'intermediate',
    prerequisites: ['Quantum superposition', 'Oracle construction'],
    timeEstimate: '2-3 hours',
    frameworks: ['pennylane', 'qiskit'],
    providers: ['ionq', 'ibm-quantum'],
    resourcesNeeded: ['2-qubit device', 'Controlled phase gate']
  },

  {
    id: 'unstructured-search',
    name: 'Unstructured Database Search (Grover)',
    description: 'Search unsorted database 100× faster than classical',
    domain: 'algorithms',
    industry: 'Database Systems',
    examples: ['pyquil-grover'],
    problemStatement:
      'Search through N items: classical requires O(N) comparisons. Quantum: O(√N) amplifications.',
    quantumAdvantage:
      'Amplitude amplification: mark solution states, interfere to amplify probability from 1/N to 1/√N.',
    expectedOutcome: 'Find marked element with >80% probability in √N iterations',
    difficulty: 'advanced',
    prerequisites: ['Amplitude amplification', 'Phase kickback', 'Inversion about average'],
    timeEstimate: '3-4 hours',
    frameworks: ['pyquil', 'qiskit'],
    providers: ['rigetti', 'ibm-quantum'],
    resourcesNeeded: ['3-4 qubit device', 'Controlled-Z gates']
  },

  {
    id: 'prime-factorization',
    name: 'Prime Factorization (Shor Algorithm)',
    description: 'Factor large numbers, break RSA encryption',
    domain: 'algorithms',
    industry: 'Cryptography',
    examples: ['qiskit-bell-state'],
    problemStatement:
      'Classical: factor N-bit number in exponential time. Quantum: factor in polynomial time (threat to RSA).',
    quantumAdvantage:
      'Period-finding via quantum Fourier transform: find period of a^x mod N in polynomial time.',
    expectedOutcome: 'Demonstrate factorization of small number, verify quantum advantage scaling',
    difficulty: 'advanced',
    prerequisites: ['Quantum Fourier transform', 'Modular exponentiation', 'Continued fractions'],
    timeEstimate: '6-8 hours',
    frameworks: ['qiskit'],
    providers: ['ibm-quantum'],
    resourcesNeeded: ['8-15 qubits', 'High-fidelity gates', 'Error correction']
  },

  {
    id: 'phase-estimation',
    name: 'Quantum Phase Estimation',
    description: 'Estimate eigenvalue of quantum operator',
    domain: 'algorithms',
    industry: 'Chemistry',
    examples: ['qiskit-bell-state'],
    problemStatement:
      'Find ground state energy of molecule classically expensive (exponential in system size).',
    quantumAdvantage:
      'Phase estimation: measure eigenvalue directly from quantum state, scales polynomially.',
    expectedOutcome: 'Estimate phase/energy with precision 2^(-m) using m qubits',
    difficulty: 'advanced',
    prerequisites: ['Quantum Fourier transform', 'Controlled operations', 'Eigenvalue theory'],
    timeEstimate: '4-5 hours',
    frameworks: ['qiskit', 'cirq'],
    providers: ['ibm-quantum', 'google-cirq'],
    resourcesNeeded: ['4-8 qubits', 'QPE circuit']
  }
]

export const OPTIMIZATION_USECASES: UseCase[] = [
  {
    id: 'portfolio-optimization',
    name: 'Portfolio Optimization (QAOA)',
    description: 'Optimize investment portfolio allocation',
    domain: 'optimization',
    industry: 'Finance',
    examples: ['pyquil-grover'],
    problemStatement:
      'Classical: find optimal asset allocation among N assets (exponential possibilities). Quantum: approximate optimal in polynomial time.',
    quantumAdvantage:
      'QAOA applies alternating mixer/cost Hamiltonians to converge to near-optimal portfolio.',
    expectedOutcome: 'Portfolio allocation within 90% of classical optimum',
    difficulty: 'intermediate',
    prerequisites: ['Optimization basics', 'Hamiltonian simulation'],
    timeEstimate: '3-4 hours',
    frameworks: ['pyquil', 'qiskit'],
    providers: ['rigetti', 'ibm-quantum'],
    resourcesNeeded: ['4-6 qubits', 'Parametrized gates']
  },

  {
    id: 'logistics-routing',
    name: 'Logistics Routing (Vehicle Routing Problem)',
    description: 'Optimize delivery routes for cost minimization',
    domain: 'optimization',
    industry: 'Transportation',
    examples: ['pyquil-grover'],
    problemStatement:
      'Classical: solve TSP in factorial time. Quantum: approximate near-optimal routes faster.',
    quantumAdvantage:
      'Encode routes as SAT problem, use QAOA to find satisfying assignment minimizing distance.',
    expectedOutcome: 'Route cost within 85-95% of optimal',
    difficulty: 'advanced',
    prerequisites: ['SAT encoding', 'QAOA', 'Graph theory'],
    timeEstimate: '4-5 hours',
    frameworks: ['pyquil'],
    providers: ['rigetti'],
    resourcesNeeded: ['8-12 qubits', 'Long coherence times']
  },

  {
    id: 'materials-design',
    name: 'Materials Design Optimization',
    description: 'Find optimal atomic configurations for material properties',
    domain: 'optimization',
    industry: 'Materials Science',
    examples: ['cirq-ghz-state'],
    problemStatement:
      'Classical: simulate atomic interactions across lattice (computationally prohibitive). Quantum: simulate directly.',
    quantumAdvantage:
      'Quantum simulation of Hamiltonian directly on quantum hardware avoids exponential classical overhead.',
    expectedOutcome: 'Find lattice configuration with lowest energy state',
    difficulty: 'advanced',
    prerequisites: ['Hamiltonian simulation', 'Variational quantum algorithms'],
    timeEstimate: '5-6 hours',
    frameworks: ['cirq'],
    providers: ['google-cirq'],
    resourcesNeeded: ['6-10 qubits', 'Variational circuit']
  }
]

export const SIMULATION_USECASES: UseCase[] = [
  {
    id: 'molecular-dynamics',
    name: 'Molecular Dynamics Simulation',
    description: 'Simulate molecular behavior and reactions',
    domain: 'simulation',
    industry: 'Chemistry',
    examples: ['cirq-ghz-state'],
    problemStatement:
      'Classical: simulate N molecules requires exponential resources. Quantum: encode in quantum state.',
    quantumAdvantage:
      'Quantum simulator: represent molecular wavefunction directly, observe dynamics in real-time.',
    expectedOutcome: 'Simulate molecular behavior with high fidelity',
    difficulty: 'advanced',
    prerequisites: ['Hamiltonian mechanics', 'Second quantization', 'Jordan-Wigner mapping'],
    timeEstimate: '5-6 hours',
    frameworks: ['cirq'],
    providers: ['google-cirq'],
    resourcesNeeded: ['8-12 qubits', 'High gate fidelity']
  },

  {
    id: 'condensed-matter',
    name: 'Condensed Matter Physics Simulation',
    description: 'Study quantum phase transitions and topological properties',
    domain: 'simulation',
    industry: 'Physics',
    examples: ['cirq-ghz-state'],
    problemStatement:
      'Classical: phase diagram requires exponential simulation. Quantum: probe directly.',
    quantumAdvantage:
      'Tune Hamiltonian parameters in real-time, measure order parameters showing phase transitions.',
    expectedOutcome: 'Observe quantum critical phenomena on real quantum device',
    difficulty: 'advanced',
    prerequisites: ['Condensed matter theory', 'Critical phenomena', 'Order parameters'],
    timeEstimate: '6-8 hours',
    frameworks: ['cirq'],
    providers: ['google-cirq'],
    resourcesNeeded: ['10+ qubits', 'Tunable interactions']
  }
]

export const ML_USECASES: UseCase[] = [
  {
    id: 'quantum-classification',
    name: 'Quantum Classification with QNN',
    description: 'Classify data using quantum neural network',
    domain: 'ml',
    industry: 'Machine Learning',
    examples: ['pennylane-deutsch-jozsa'],
    problemStatement:
      'Classical: deep networks expensive to train. Quantum: variational circuits may learn faster.',
    quantumAdvantage:
      'Quantum feature space: encode data in quantum state, measure linear separation.',
    expectedOutcome: 'Train quantum classifier with >85% accuracy on test set',
    difficulty: 'intermediate',
    prerequisites: ['Classical ML basics', 'Variational algorithms', 'PennyLane'],
    timeEstimate: '3-4 hours',
    frameworks: ['pennylane'],
    providers: ['ionq'],
    resourcesNeeded: ['4-6 qubits', 'Measurement-based learning']
  },

  {
    id: 'quantum-dimensionality-reduction',
    name: 'Quantum Dimensionality Reduction',
    description: 'Reduce feature space using quantum PCA',
    domain: 'ml',
    industry: 'Data Science',
    examples: ['pennylane-deutsch-jozsa'],
    problemStatement:
      'Classical: reduce high-dimensional data while preserving structure (expensive).',
    quantumAdvantage:
      'Quantum PCA: exponential speedup for certain data distributions.',
    expectedOutcome: 'Reduce dimensions by 10× while preserving 90% variance',
    difficulty: 'advanced',
    prerequisites: ['PCA', 'HHL algorithm', 'Phase kickback'],
    timeEstimate: '4-5 hours',
    frameworks: ['pennylane', 'qiskit'],
    providers: ['ionq', 'ibm-quantum'],
    resourcesNeeded: ['6-8 qubits', 'Amplitude amplification']
  },

  {
    id: 'generative-models',
    name: 'Quantum Generative Models',
    description: 'Generate synthetic data using quantum circuits',
    domain: 'ml',
    industry: 'Generative AI',
    examples: ['cirq-ghz-state'],
    problemStatement:
      'Classical GANs need large networks. Quantum: use superposition to represent distributions.',
    quantumAdvantage:
      'Quantum-enhanced generator: represent distribution in exponentially smaller circuit.',
    expectedOutcome: 'Generate samples matching training distribution',
    difficulty: 'advanced',
    prerequisites: ['GANs', 'Quantum state preparation', 'Variational circuits'],
    timeEstimate: '5-6 hours',
    frameworks: ['cirq', 'pennylane'],
    providers: ['google-cirq', 'ionq'],
    resourcesNeeded: ['8-10 qubits', 'Parameterized circuits']
  }
]

export const USECASES_LOOKUP = {
  entanglement: ENTANGLEMENT_USECASES,
  algorithms: ALGORITHM_USECASES,
  optimization: OPTIMIZATION_USECASES,
  simulation: SIMULATION_USECASES,
  ml: ML_USECASES
}

export const ALL_USECASES = [
  ...ENTANGLEMENT_USECASES,
  ...ALGORITHM_USECASES,
  ...OPTIMIZATION_USECASES,
  ...SIMULATION_USECASES,
  ...ML_USECASES
]

export function getUsecasesByExample(exampleId: string): UseCase[] {
  return ALL_USECASES.filter(uc => uc.examples.includes(exampleId))
}

export function getUsecasesByDomain(domain: string): UseCase[] {
  return USECASES_LOOKUP[domain as keyof typeof USECASES_LOOKUP] || []
}

export function getUsecasesByIndustry(industry: string): UseCase[] {
  return ALL_USECASES.filter(uc => uc.industry === industry)
}

export function getUsecasesByFramework(framework: string): UseCase[] {
  return ALL_USECASES.filter(uc => uc.frameworks.includes(framework))
}
