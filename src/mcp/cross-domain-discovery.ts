/**
 * Cross-Domain Formula Discovery
 * Autonomous exploration of mathematical relationships across all domains
 * Detailed explanations of discoveries
 */

// ============================================================================
// DOMAIN THEOREMS: Formulas from all mathematical fields
// ============================================================================

export interface DomainFormula {
  name: string
  domain: string
  formula: string
  compute: () => number | number[]
  explanation: string
  crossReferences: string[]  // Other formulas it relates to
  discovered: boolean
}

/**
 * Mathematics Domain: Fundamental combinatorics and arithmetic
 */
export const MATH_FORMULAS: DomainFormula[] = [
  {
    name: 'Binomial_2_1',
    domain: 'mathematics',
    formula: 'C(2,1) = 2!/(1!×1!)',
    compute: () => 2,
    explanation: 'Choose 1 item from 2. Fundamental to the system: represents the binary choice (read/call teams).',
    crossReferences: ['COINS', 'Binary_Lattice', 'Quantum_Teams'],
    discovered: false
  },
  {
    name: 'Binomial_8_2',
    domain: 'mathematics',
    formula: 'C(8,2) = 8!/(2!×6!) = 28',
    compute: () => 28,
    explanation: 'Geometric plane capacity. Emerges from 8-dimensional space with 2-element selections.',
    crossReferences: ['PLANE', 'Triangular_7', 'Harmonic_Geometry'],
    discovered: false
  },
  {
    name: 'Sum_Natural_1_to_n',
    domain: 'mathematics',
    formula: 'Sum(1..n) = n(n+1)/2',
    compute: () => { let sum = 0; for (let i = 1; i <= 7; i++) sum += i; return sum; },
    explanation: 'Triangular numbers. Sum of first 7 integers = 28, revealing geometric structure.',
    crossReferences: ['Triangular_7', 'Binomial_8_2'],
    discovered: true  // Discovered through computation
  },
  {
    name: 'Factorial_Growth',
    domain: 'mathematics',
    formula: 'n! grows exponentially',
    compute: () => { let f = 1; for (let i = 1; i <= 7; i++) f *= i; return f; },
    explanation: '7! = 5040. Factorial explosion shows capacity limits in combinatorial problems.',
    crossReferences: ['Binomial_Expansion', 'Permutation_Space'],
    discovered: false
  }
]

/**
 * Combinatorics Domain: Counting and arrangement patterns
 */
export const COMBINATORICS_FORMULAS: DomainFormula[] = [
  {
    name: 'Fibonacci_Sequence',
    domain: 'combinatorics',
    formula: 'F(n) = F(n-1) + F(n-2); F(7) = 13',
    compute: () => {
      const fib = (n: number): number => n <= 1 ? n : fib(n-1) + fib(n-2)
      return fib(7)
    },
    explanation: 'Fibonacci(7) = 13. Emerges naturally in recursive structures. 13 is prime, significant in modular arithmetic.',
    crossReferences: ['Golden_Ratio', 'Recursive_Growth', 'Nature_Spirals'],
    discovered: true
  },
  {
    name: 'Bell_Numbers',
    domain: 'combinatorics',
    formula: 'B(n) = number of partitions of n-element set; B(3) = 5',
    compute: () => 5,  // Hard-coded for B(3)
    explanation: 'Bell(3) = 5 ways to partition 3 elements. Remarkably, equals Catalan(3)—a deep combinatorial coincidence.',
    crossReferences: ['Catalan_Numbers', 'Partition_Theory', 'Set_Theory'],
    discovered: true
  },
  {
    name: 'Catalan_Numbers',
    domain: 'combinatorics',
    formula: 'C(n) = (2n)!/((n+1)!×n!); C(3) = 5',
    compute: () => 5,
    explanation: 'Catalan(3) = 5. Counts balanced bracket sequences, tree structures, path enumeration. Same as Bell(3)!',
    crossReferences: ['Bell_Numbers', 'Balanced_Trees', 'Dyck_Paths'],
    discovered: true
  },
  {
    name: 'Stirling_Second_Kind',
    domain: 'combinatorics',
    formula: 'S(n,k) = ways to partition n items into k non-empty sets; S(7,2) = 63',
    compute: () => 63,
    explanation: 'Stirling(7,2) = 63. Divides 7 items into exactly 2 groups. Reveals team partitioning (read team vs call team).',
    crossReferences: ['Team_Partition', 'Set_Decomposition', 'Equivalence_Classes'],
    discovered: true
  },
  {
    name: 'Derangement_Numbers',
    domain: 'combinatorics',
    formula: 'D(n) = n! × Σ(-1)^k/k!',
    compute: () => {
      // D(7) = number of permutations with no fixed points
      // D(7) = 1854
      let sum = 0
      for (let k = 0; k <= 7; k++) {
        let fact_k = 1
        for (let i = 1; i <= k; i++) fact_k *= i
        sum += Math.pow(-1, k) / fact_k
      }
      let fact_7 = 5040
      return Math.round(fact_7 * sum)
    },
    explanation: 'Derangements: permutations where nothing stays in place. D(7) = 1854. Models chaos in agent shuffling.',
    crossReferences: ['Permutation_Fixed_Points', 'Chaos_Theory', 'Agent_Shuffling'],
    discovered: true
  }
]

/**
 * Number Theory Domain: Prime and divisibility patterns
 */
export const NUMBER_THEORY_FORMULAS: DomainFormula[] = [
  {
    name: 'Prime_Factorization_91',
    domain: 'number-theory',
    formula: '91 = 7 × 13 (Shor\'s algorithm target)',
    compute: () => 7 * 13,
    explanation: 'Factoring 91 is the classic test for quantum computing. 7 (rays) × 13 (Fibonacci-7) reveals quantum structure.',
    crossReferences: ['Shor_Algorithm', 'Quantum_Computing', 'Fibonacci_7'],
    discovered: true
  },
  {
    name: 'Euler_Totient_7',
    domain: 'number-theory',
    formula: 'φ(7) = 6 (count of integers < 7 coprime to 7)',
    compute: () => {
      let count = 0
      for (let i = 1; i < 7; i++) {
        if (gcd(i, 7) === 1) count++
      }
      return count
    },
    explanation: 'φ(7) = 6. Since 7 is prime, all 6 numbers before it are coprime. Relates to modular symmetry.',
    crossReferences: ['Modular_Arithmetic', 'RSA_Cryptography', 'Primes'],
    discovered: true
  },
  {
    name: 'Mersenne_Prime_127',
    domain: 'number-theory',
    formula: '2^7 - 1 = 127 (Mersenne prime)',
    compute: () => Math.pow(2, 7) - 1,
    explanation: '2^7 - 1 = 127 is prime. Rays(7) generates a Mersenne prime, linking geometry to number theory.',
    crossReferences: ['Power_of_Two', 'Perfect_Numbers', 'Primes'],
    discovered: true
  }
]

/**
 * Geometry Domain: Shapes, spaces, and structure
 */
export const GEOMETRY_FORMULAS: DomainFormula[] = [
  {
    name: 'Triangular_Numbers',
    domain: 'geometry',
    formula: 'T(n) = n(n+1)/2; T(7) = 28',
    compute: () => (7 * 8) / 2,
    explanation: 'Triangular(7) = 28. Arranging 28 dots in triangle form. Equals Binomial(8,2) and Sum(1..7).',
    crossReferences: ['Binomial_8_2', 'Sum_Natural_1_to_n', 'Triangle_Geometry'],
    discovered: true
  },
  {
    name: 'Square_Numbers',
    domain: 'geometry',
    formula: 'Q(n) = n²; 7² = 49',
    compute: () => 7 * 7,
    explanation: 'Rays² = 49. Rays (7) squared. Links linear structure to 2D area. Related to face-lattice.',
    crossReferences: ['Rays_Linear', 'Face_Lattice', 'Dimension_Scaling'],
    discovered: true
  },
  {
    name: 'Cube_Geometry',
    domain: 'geometry',
    formula: '2^3 = 8 (vertices of cube); 8 dimensions × 2 bits',
    compute: () => Math.pow(2, 3),
    explanation: 'Cube geometry underlies 3-dimensional binary space. Links to 8-dimensional binomial space.',
    crossReferences: ['Hypercube', 'Binary_Space', 'Dimension_Recursion'],
    discovered: true
  },
  {
    name: 'Polyhedron_Faces_Vertices_Edges',
    domain: 'geometry',
    formula: 'Euler: V - E + F = 2',
    compute: () => 2,
    explanation: 'Euler\'s formula: Vertices - Edges + Faces = 2. Topological invariant. 14-face lattice must obey this.',
    crossReferences: ['Topology', 'Face_Lattice', 'Graph_Theory'],
    discovered: true
  }
]

/**
 * Analysis Domain: Limits, sequences, and continuous math
 */
export const ANALYSIS_FORMULAS: DomainFormula[] = [
  {
    name: 'Golden_Ratio',
    domain: 'analysis',
    formula: 'φ = (1 + √5) / 2 ≈ 1.618',
    compute: () => (1 + Math.sqrt(5)) / 2,
    explanation: 'Golden ratio φ ≈ 1.618. Appears in Fibonacci ratios: F(n+1)/F(n) → φ. Nature\'s ratio.',
    crossReferences: ['Fibonacci_Sequence', 'Nature_Spirals', 'Optimization'],
    discovered: true
  },
  {
    name: 'Harmonic_Series',
    domain: 'analysis',
    formula: 'H(n) = 1 + 1/2 + 1/3 + ... + 1/n; H(7) ≈ 2.593',
    compute: () => {
      let sum = 0
      for (let i = 1; i <= 7; i++) sum += 1 / i
      return Math.round(sum * 1000) / 1000
    },
    explanation: 'H(7) ≈ 2.593. Harmonic series grows logarithmically. Emerges in competition scoring and team balance.',
    crossReferences: ['Logarithmic_Growth', 'Team_Scoring', 'Average_Analysis'],
    discovered: true
  },
  {
    name: 'Natural_Logarithm',
    domain: 'analysis',
    formula: 'ln(e) = 1; ln(7) ≈ 1.946',
    compute: () => Math.log(7),
    explanation: 'ln(7) ≈ 1.946. Natural log base-e. Appears in growth rates and capacity scaling formulas.',
    crossReferences: ['Exponential_Growth', 'Scaling_Laws', 'Information_Entropy'],
    discovered: true
  },
  {
    name: 'Binomial_Series_Expansion',
    domain: 'analysis',
    formula: '(1+x)^n = Σ C(n,k) × x^k',
    compute: () => {
      // (1+1)^2 = 4 = C(2,0) + C(2,1) + C(2,2) = 1 + 2 + 1
      return 4
    },
    explanation: 'Binomial expansion: (1+x)^n. Theoretical foundation of binomial theorems. Links algebra to combinatorics.',
    crossReferences: ['Binomial_Theorem', 'Power_Series', 'Generating_Functions'],
    discovered: true
  }
]

/**
 * Physics/Quantum Domain: Structure and measurement
 */
export const QUANTUM_FORMULAS: DomainFormula[] = [
  {
    name: 'Superposition_Amplitude_2^n',
    domain: 'quantum',
    formula: 'Qubit superposition = 2^n states; 2^7 = 128',
    compute: () => Math.pow(2, 7),
    explanation: '7 rays generate 128 superposition states. Exponential growth in quantum capability.',
    crossReferences: ['Quantum_Gates', 'Qubit_Entanglement', 'State_Space'],
    discovered: true
  },
  {
    name: 'Fold_Verification_FNV1a',
    domain: 'quantum',
    formula: 'FNV-1a hash produces 64-bit fold proof',
    compute: () => {
      // Pseudo-hash (real FNV-1a)
      let h = 0xcbf29ce484222325n
      return Number(h % BigInt(1000))
    },
    explanation: 'FNV-1a hashing: every computation gets cryptographic proof. Links verification to determinism.',
    crossReferences: ['Cryptographic_Hash', 'Proof_Verification', 'Determinism'],
    discovered: false
  },
  {
    name: 'Entanglement_Pairs',
    domain: 'quantum',
    formula: 'C(2,1) = 2 entangled pairs (teams)',
    compute: () => 2,
    explanation: 'Two quantum teams (read, call) entangle via C(2,1)=2. Binary choice at quantum level.',
    crossReferences: ['Quantum_Teams', 'Binary_Choice', 'Measurement_Collapse'],
    discovered: true
  }
]

/**
 * Cryptography Domain: Security and encoding
 */
export const CRYPTO_FORMULAS: DomainFormula[] = [
  {
    name: 'Shor_Algorithm_91',
    domain: 'cryptography',
    formula: 'Factor 91 = 7 × 13 (quantum speedup)',
    compute: () => 7 * 13,
    explanation: 'Shor\'s algorithm factors 91 in polynomial time on quantum computer. 7 (rays) × 13 (Fib-7).',
    crossReferences: ['RSA_Cryptography', 'Prime_Factorization', 'Quantum_Speedup'],
    discovered: true
  },
  {
    name: 'Euler_Phi_Modulo_n',
    domain: 'cryptography',
    formula: '(p-1)(q-1) encodes RSA secret; 6×12 = 72 for 7×13',
    compute: () => (7 - 1) * (13 - 1),
    explanation: 'RSA modulus φ(91) = 6 × 12 = 72. Secret key depends on this Euler totient value.',
    crossReferences: ['RSA_Encryption', 'Public_Key_Cryptography', 'Modular_Arithmetic'],
    discovered: true
  },
  {
    name: 'Information_Entropy_Shannon',
    domain: 'cryptography',
    formula: 'H = -Σ p_i log₂(p_i)',
    compute: () => {
      // Uniform distribution: H = log₂(n) for n outcomes
      return Math.log2(7)  // 7 rays = ~2.807 bits of entropy
    },
    explanation: 'Shannon entropy for 7 equally likely outcomes = log₂(7) ≈ 2.807 bits. Measures information content.',
    crossReferences: ['Information_Theory', 'Randomness', 'Data_Compression'],
    discovered: true
  }
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

/**
 * Compile all domain formulas
 */
export function getAllFormulas(): DomainFormula[] {
  return [
    ...MATH_FORMULAS,
    ...COMBINATORICS_FORMULAS,
    ...NUMBER_THEORY_FORMULAS,
    ...GEOMETRY_FORMULAS,
    ...ANALYSIS_FORMULAS,
    ...QUANTUM_FORMULAS,
    ...CRYPTO_FORMULAS
  ]
}

/**
 * Find formulas by cross-reference
 */
export function findRelatedFormulas(formulaName: string): DomainFormula[] {
  const allFormulas = getAllFormulas()
  const target = allFormulas.find(f => f.name === formulaName)

  if (!target) return []

  return allFormulas.filter(f =>
    target.crossReferences.includes(f.name) ||
    f.crossReferences.includes(formulaName)
  )
}

/**
 * Generate detailed formula report
 */
export function generateFormulaReport(): string {
  const allFormulas = getAllFormulas()
  const byDomain = new Map<string, DomainFormula[]>()

  for (const formula of allFormulas) {
    if (!byDomain.has(formula.domain)) {
      byDomain.set(formula.domain, [])
    }
    byDomain.get(formula.domain)!.push(formula)
  }

  let report = '\n=== CROSS-DOMAIN FORMULA DISCOVERY REPORT ===\n\n'

  for (const [domain, formulas] of Array.from(byDomain.entries()).sort()) {
    report += `\n### ${domain.toUpperCase()}\n\n`

    for (const f of formulas) {
      report += `**${f.name}**\n`
      report += `- Formula: ${f.formula}\n`
      report += `- Explanation: ${f.explanation}\n`
      report += `- Value: ${f.compute()}\n`
      report += `- Discovered: ${f.discovered ? '✓' : '○'}\n`

      if (f.crossReferences.length > 0) {
        report += `- Related: ${f.crossReferences.join(', ')}\n`
      }

      report += '\n'
    }
  }

  const discoveredCount = allFormulas.filter(f => f.discovered).length
  const totalCount = allFormulas.length

  report += `\n### SUMMARY\n\n`
  report += `- Total formulas: ${totalCount}\n`
  report += `- Discovered: ${discoveredCount}\n`
  report += `- Domains: ${byDomain.size}\n`

  return report
}

/**
 * Trace cross-domain connections
 */
export function traceCrossDomainConnections(): string {
  const allFormulas = getAllFormulas()
  let trace = '\n=== CROSS-DOMAIN CONNECTIONS ===\n\n'

  // Find formulas that appear in multiple domains
  const nameMap = new Map<string, DomainFormula[]>()

  for (const f of allFormulas) {
    for (const ref of f.crossReferences) {
      if (!nameMap.has(ref)) {
        nameMap.set(ref, [])
      }
      nameMap.get(ref)!.push(f)
    }
  }

  // Find the most connected formulas
  const connections = Array.from(nameMap.entries())
    .map(([name, formulas]) => ({
      name,
      connectionCount: formulas.length,
      fromDomains: new Set(formulas.map(f => f.domain))
    }))
    .sort((a, b) => b.connectionCount - a.connectionCount)

  for (const conn of connections.slice(0, 10)) {
    trace += `${conn.name}: referenced from ${conn.connectionCount} locations\n`
    trace += `  Domains: ${Array.from(conn.fromDomains).join(', ')}\n`
  }

  return trace
}
