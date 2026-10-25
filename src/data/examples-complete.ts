// Complete Examples Data Model
// All 16 use cases, 4 examples, 5 domains, 4 frameworks, 5 providers

export const COMPLETE_USECASES = {
  // ENTANGLEMENT (4)
  'qkd-quantum-key-distribution': {
    domain: 'entanglement',
    title: 'Quantum Key Distribution',
    description: 'Secure cryptographic keys via quantum entanglement',
    tags: ['cryptography', 'security', 'entanglement'],
    difficulty: 'intermediate' as const,
    timeEstimate: '2-3 hours',
    industry: 'Cybersecurity',
    examples: ['qiskit-bell-state', 'cirq-ghz-state'],
    frameworks: ['qiskit', 'cirq'],
    providers: ['ibm-quantum', 'google-cirq'],
    problem: 'Classical encryption vulnerable to quantum computers',
    advantage: 'Bell states guarantee security, eavesdropping detectable',
    outcome: 'Secure key with eavesdropping detection',
    resources: ['2-qubit device', 'Classical post-processing'],
    learningPath: ['quantum-superposition', 'bell-states', 'measurement-postulate']
  },

  'distributed-quantum-computing': {
    domain: 'entanglement',
    title: 'Distributed Quantum Computing',
    description: 'Entangle qubits across multiple quantum processors',
    tags: ['entanglement', 'network', 'distributed'],
    difficulty: 'advanced' as const,
    timeEstimate: '4-6 hours',
    industry: 'Cloud Computing',
    examples: ['cirq-ghz-state'],
    frameworks: ['cirq'],
    providers: ['google-cirq'],
    problem: 'Single QPU limited by qubit count',
    advantage: 'GHZ states enable entanglement swapping across networks',
    outcome: 'Multi-processor quantum computation',
    resources: ['3+ qubit devices', 'Quantum network infrastructure'],
    learningPath: ['bell-states', 'ghz-states', 'entanglement-swapping']
  },

  'quantum-sensing-gravity': {
    domain: 'entanglement',
    title: 'Quantum Sensing for Gravity',
    description: 'Precision gravity measurement using entangled states',
    tags: ['sensing', 'metrology', 'entanglement'],
    difficulty: 'advanced' as const,
    timeEstimate: '3-4 hours',
    industry: 'Geophysics',
    examples: ['qiskit-bell-state'],
    frameworks: ['qiskit'],
    providers: ['ibm-quantum'],
    problem: 'Classical sensors have shot-noise limit',
    advantage: 'Entangled photons beat shot-noise by 1000×',
    outcome: 'Precision gravity measurement with quantum advantage',
    resources: ['Photon source', 'Interferometer', 'Single-photon detectors'],
    learningPath: ['superposition', 'entanglement', 'quantum-metrology']
  },

  'quantum-teleportation': {
    domain: 'entanglement',
    title: 'Quantum Teleportation',
    description: 'Transfer quantum state using Bell measurements',
    tags: ['teleportation', 'measurement', 'entanglement'],
    difficulty: 'advanced' as const,
    timeEstimate: '3-4 hours',
    industry: 'Quantum Networks',
    examples: ['qiskit-bell-state'],
    frameworks: ['qiskit', 'cirq'],
    providers: ['ibm-quantum', 'ionq'],
    problem: 'Transmit quantum information without sending qubits',
    advantage: 'Bell measurement + classical bits = perfect state transfer',
    outcome: 'Successful teleportation with fidelity >90%',
    resources: ['3-qubit device', 'Classical feedback capability'],
    learningPath: ['bell-states', 'measurement', 'bell-measurement']
  },

  // ALGORITHMS (4)
  'function-property-detection': {
    domain: 'algorithms',
    title: 'Function Property Detection (Deutsch-Jozsa)',
    description: 'Determine if function is balanced or constant',
    tags: ['algorithm', 'oracle', 'deutsch-jozsa'],
    difficulty: 'intermediate' as const,
    timeEstimate: '2-3 hours',
    industry: 'Cryptography',
    examples: ['pennylane-deutsch-jozsa'],
    frameworks: ['pennylane', 'qiskit'],
    providers: ['ionq', 'ibm-quantum'],
    problem: 'Classically need 2^(n-1)+1 evaluations',
    advantage: 'Quantum: 1 evaluation via superposition',
    outcome: 'Correctly identify function property in single call',
    resources: ['2-qubit device', 'Controlled phase gate'],
    learningPath: ['superposition', 'oracle', 'quantum-interference']
  },

  'unstructured-search': {
    domain: 'algorithms',
    title: 'Unstructured Search (Grover)',
    description: 'Search unsorted databases 100× faster',
    tags: ['algorithm', 'search', 'amplitude-amplification'],
    difficulty: 'advanced' as const,
    timeEstimate: '3-4 hours',
    industry: 'Database Systems',
    examples: ['pyquil-grover'],
    frameworks: ['pyquil', 'qiskit'],
    providers: ['rigetti', 'ibm-quantum'],
    problem: 'Classical search O(N), quantum O(√N)',
    advantage: 'Amplitude amplification: mark solutions, interfere',
    outcome: 'Find marked element with >80% probability',
    resources: ['3-4 qubit device', 'Controlled-Z gates'],
    learningPath: ['superposition', 'amplitude-amplification', 'phase-kickback']
  },

  'prime-factorization': {
    domain: 'algorithms',
    title: 'Prime Factorization (Shor)',
    description: 'Factor large numbers, break RSA encryption',
    tags: ['algorithm', 'cryptography', 'fourier-transform'],
    difficulty: 'advanced' as const,
    timeEstimate: '6-8 hours',
    industry: 'Cryptography',
    examples: ['qiskit-bell-state'],
    frameworks: ['qiskit'],
    providers: ['ibm-quantum'],
    problem: 'Factor N-bit number in exponential time classically',
    advantage: 'Quantum: period-finding via QFT in polynomial time',
    outcome: 'Demonstrate factorization of small number',
    resources: ['8-15 qubits', 'High-fidelity gates', 'Error correction'],
    learningPath: ['quantum-fourier-transform', 'modular-exponentiation', 'period-finding']
  },

  'phase-estimation': {
    domain: 'algorithms',
    title: 'Quantum Phase Estimation',
    description: 'Estimate eigenvalue of quantum operator',
    tags: ['algorithm', 'chemistry', 'eigenvalue'],
    difficulty: 'advanced' as const,
    timeEstimate: '4-5 hours',
    industry: 'Chemistry',
    examples: ['qiskit-bell-state'],
    frameworks: ['qiskit', 'cirq'],
    providers: ['ibm-quantum', 'google-cirq'],
    problem: 'Find ground state energy of molecule (exponential classically)',
    advantage: 'Phase estimation: measure eigenvalue directly, polynomial scaling',
    outcome: 'Estimate phase/energy with precision 2^(-m)',
    resources: ['4-8 qubits', 'QPE circuit'],
    learningPath: ['quantum-fourier-transform', 'controlled-operations', 'eigenvalue-theory']
  },

  // OPTIMIZATION (3)
  'portfolio-optimization': {
    domain: 'optimization',
    title: 'Portfolio Optimization (QAOA)',
    description: 'Optimize investment portfolio allocation',
    tags: ['optimization', 'qaoa', 'finance'],
    difficulty: 'intermediate' as const,
    timeEstimate: '3-4 hours',
    industry: 'Finance',
    examples: ['pyquil-grover'],
    frameworks: ['pyquil', 'qiskit'],
    providers: ['rigetti', 'ibm-quantum'],
    problem: 'Find optimal asset allocation among N assets',
    advantage: 'QAOA converges to near-optimal in polynomial time',
    outcome: 'Portfolio allocation within 90% of optimal',
    resources: ['4-6 qubits', 'Parametrized gates'],
    learningPath: ['optimization-basics', 'hamiltonian-simulation', 'variational-algorithms']
  },

  'logistics-routing': {
    domain: 'optimization',
    title: 'Logistics Routing (VRP)',
    description: 'Optimize delivery routes for cost minimization',
    tags: ['optimization', 'routing', 'logistics'],
    difficulty: 'advanced' as const,
    timeEstimate: '4-5 hours',
    industry: 'Transportation',
    examples: ['pyquil-grover'],
    frameworks: ['pyquil'],
    providers: ['rigetti'],
    problem: 'Solve TSP in factorial time classically',
    advantage: 'QAOA approximates near-optimal routes',
    outcome: 'Route cost within 85-95% of optimal',
    resources: ['8-12 qubits', 'Long coherence times'],
    learningPath: ['sat-encoding', 'qaoa', 'graph-theory']
  },

  'materials-design': {
    domain: 'optimization',
    title: 'Materials Design Optimization',
    description: 'Find optimal atomic configurations',
    tags: ['optimization', 'materials', 'simulation'],
    difficulty: 'advanced' as const,
    timeEstimate: '5-6 hours',
    industry: 'Materials Science',
    examples: ['cirq-ghz-state'],
    frameworks: ['cirq'],
    providers: ['google-cirq'],
    problem: 'Simulate atomic interactions across lattice (exponential)',
    advantage: 'Quantum simulation of Hamiltonian directly',
    outcome: 'Find lattice configuration with lowest energy',
    resources: ['6-10 qubits', 'Variational circuit'],
    learningPath: ['hamiltonian-simulation', 'variational-algorithms', 'material-science-basics']
  },

  // SIMULATION (2)
  'molecular-dynamics': {
    domain: 'simulation',
    title: 'Molecular Dynamics Simulation',
    description: 'Simulate molecular behavior and reactions',
    tags: ['simulation', 'chemistry', 'molecular'],
    difficulty: 'advanced' as const,
    timeEstimate: '5-6 hours',
    industry: 'Chemistry',
    examples: ['cirq-ghz-state'],
    frameworks: ['cirq'],
    providers: ['google-cirq'],
    problem: 'Simulate N molecules requires exponential resources',
    advantage: 'Quantum: encode molecular wavefunction directly',
    outcome: 'Simulate molecular behavior with high fidelity',
    resources: ['8-12 qubits', 'High gate fidelity'],
    learningPath: ['hamiltonian-mechanics', 'second-quantization', 'jordan-wigner-mapping']
  },

  'condensed-matter': {
    domain: 'simulation',
    title: 'Condensed Matter Physics',
    description: 'Study quantum phase transitions',
    tags: ['simulation', 'physics', 'phase-transitions'],
    difficulty: 'advanced' as const,
    timeEstimate: '6-8 hours',
    industry: 'Physics',
    examples: ['cirq-ghz-state'],
    frameworks: ['cirq'],
    providers: ['google-cirq'],
    problem: 'Phase diagram requires exponential simulation',
    advantage: 'Tune Hamiltonian, measure order parameters directly',
    outcome: 'Observe quantum critical phenomena',
    resources: ['10+ qubits', 'Tunable interactions'],
    learningPath: ['condensed-matter-theory', 'critical-phenomena', 'order-parameters']
  },

  // ML (3)
  'quantum-classification': {
    domain: 'ml',
    title: 'Quantum Classification with QNN',
    description: 'Classify data using quantum neural network',
    tags: ['ml', 'classification', 'variational'],
    difficulty: 'intermediate' as const,
    timeEstimate: '3-4 hours',
    industry: 'Machine Learning',
    examples: ['pennylane-deutsch-jozsa'],
    frameworks: ['pennylane'],
    providers: ['ionq'],
    problem: 'Deep networks expensive to train',
    advantage: 'Quantum feature space: encode data in quantum state',
    outcome: 'Train quantum classifier with >85% accuracy',
    resources: ['4-6 qubits', 'Measurement-based learning'],
    learningPath: ['classical-ml-basics', 'variational-algorithms', 'pennylane-basics']
  },

  'quantum-dimensionality-reduction': {
    domain: 'ml',
    title: 'Quantum Dimensionality Reduction',
    description: 'Reduce feature space using quantum PCA',
    tags: ['ml', 'dimensionality-reduction', 'pca'],
    difficulty: 'advanced' as const,
    timeEstimate: '4-5 hours',
    industry: 'Data Science',
    examples: ['pennylane-deutsch-jozsa'],
    frameworks: ['pennylane', 'qiskit'],
    providers: ['ionq', 'ibm-quantum'],
    problem: 'Reduce high-dimensional data while preserving structure',
    advantage: 'Quantum PCA: exponential speedup for certain distributions',
    outcome: 'Reduce dimensions by 10× preserving 90% variance',
    resources: ['6-8 qubits', 'Amplitude amplification'],
    learningPath: ['pca', 'hhl-algorithm', 'phase-kickback']
  },

  'generative-models': {
    domain: 'ml',
    title: 'Quantum Generative Models',
    description: 'Generate synthetic data using quantum circuits',
    tags: ['ml', 'generative', 'gan'],
    difficulty: 'advanced' as const,
    timeEstimate: '5-6 hours',
    industry: 'Generative AI',
    examples: ['cirq-ghz-state'],
    frameworks: ['cirq', 'pennylane'],
    providers: ['google-cirq', 'ionq'],
    problem: 'Classical GANs need large networks',
    advantage: 'Quantum: represent distribution in exponentially smaller circuit',
    outcome: 'Generate samples matching training distribution',
    resources: ['8-10 qubits', 'Parametrized circuits'],
    learningPath: ['gans', 'quantum-state-preparation', 'variational-circuits']
  }
}

export const COMPLETE_EXAMPLES = {
  'qiskit-bell-state': {
    title: 'Qiskit Bell State',
    description: 'Two-qubit entanglement Bell state',
    framework: 'qiskit',
    provider: 'ibm-quantum',
    qubits: 2,
    depth: 2,
    difficulty: 'beginner',
    tags: ['entanglement', 'qiskit', 'ibm'],
    relatedUsecases: ['qkd-quantum-key-distribution', 'quantum-teleportation', 'quantum-sensing-gravity'],
    metrics: { fidelity: 0.9834, t2: 25, quantumVolume: 32 }
  },
  'cirq-ghz-state': {
    title: 'Cirq GHZ State',
    description: 'Three-qubit entanglement GHZ state',
    framework: 'cirq',
    provider: 'google-cirq',
    qubits: 3,
    depth: 3,
    difficulty: 'beginner',
    tags: ['entanglement', 'cirq', 'google'],
    relatedUsecases: ['distributed-quantum-computing', 'materials-design', 'molecular-dynamics'],
    metrics: { fidelity: 0.9612, t2: 35, quantumVolume: 64 }
  },
  'pennylane-deutsch-jozsa': {
    title: 'PennyLane Deutsch-Jozsa',
    description: 'Deutsch-Jozsa algorithm implementation',
    framework: 'pennylane',
    provider: 'ionq',
    qubits: 2,
    depth: 3,
    difficulty: 'intermediate',
    tags: ['algorithm', 'pennylane', 'ionq'],
    relatedUsecases: ['function-property-detection', 'quantum-classification', 'quantum-dimensionality-reduction'],
    metrics: { fidelity: 0.9745, t2: 45, quantumVolume: 48 }
  },
  'pyquil-grover': {
    title: 'PyQuil Grover Search',
    description: "Grover's amplitude amplification algorithm",
    framework: 'pyquil',
    provider: 'rigetti',
    qubits: 2,
    depth: 5,
    difficulty: 'advanced',
    tags: ['algorithm', 'pyquil', 'rigetti'],
    relatedUsecases: ['unstructured-search', 'portfolio-optimization', 'logistics-routing'],
    metrics: { fidelity: 0.9512, t2: 22, quantumVolume: 32 }
  }
}

export const LEARNING_PATHS = {
  beginner: {
    title: 'Quantum Computing Fundamentals',
    description: 'Start here if new to quantum computing',
    steps: ['quantum-superposition', 'bell-states', 'measurement-postulate', 'qkd-quantum-key-distribution'],
    duration: '6-8 hours'
  },
  'intermediate-algorithms': {
    title: 'Quantum Algorithms Essentials',
    description: 'Learn core quantum algorithms',
    steps: ['quantum-fourier-transform', 'amplitude-amplification', 'function-property-detection', 'unstructured-search'],
    duration: '8-10 hours'
  },
  'advanced-applications': {
    title: 'Real-World Quantum Applications',
    description: 'Apply quantum computing to industry problems',
    steps: ['phase-estimation', 'variational-algorithms', 'qaoa', 'portfolio-optimization', 'materials-design'],
    duration: '12-15 hours'
  },
  'quantum-ml': {
    title: 'Quantum Machine Learning',
    description: 'Quantum approaches to ML and AI',
    steps: ['variational-algorithms', 'quantum-classification', 'quantum-dimensionality-reduction', 'generative-models'],
    duration: '10-12 hours'
  },
  'quantum-simulation': {
    title: 'Quantum Simulation for Science',
    description: 'Use quantum computers to simulate physics',
    steps: ['hamiltonian-simulation', 'phase-estimation', 'molecular-dynamics', 'condensed-matter'],
    duration: '12-14 hours'
  }
}

export function getUsecasesByDomain(domain: string) {
  return Object.entries(COMPLETE_USECASES)
    .filter(([, uc]) => uc.domain === domain)
    .map(([id, uc]) => ({ id, ...uc }))
}

export function getUsecasesByDifficulty(difficulty: string) {
  return Object.entries(COMPLETE_USECASES)
    .filter(([, uc]) => uc.difficulty === difficulty)
    .map(([id, uc]) => ({ id, ...uc }))
}

export function getUsecasesByIndustry(industry: string) {
  return Object.entries(COMPLETE_USECASES)
    .filter(([, uc]) => uc.industry === industry)
    .map(([id, uc]) => ({ id, ...uc }))
}

export function getExampleUsecases(exampleId: string) {
  const example = COMPLETE_EXAMPLES[exampleId as keyof typeof COMPLETE_EXAMPLES]
  if (!example) return []
  return example.relatedUsecases.map(id => COMPLETE_USECASES[id as keyof typeof COMPLETE_USECASES])
}
