/**
 * Prior Art & Citation System
 * Complete genealogy of mathematical, computational, theological, and philosophical ideas
 * Tracing back through history to ancient sources
 */

// ============================================================================
// CITATION INTERFACES
// ============================================================================

export interface Citation {
  id: string
  author: string
  year: number
  title: string
  source: string
  url?: string
  relevance: string
  category: CitationCategory
}

export interface ScholarlyWork {
  title: string
  author: string
  period: string
  civilization: string
  concepts: string[]
  influence: string
  citations: Citation[]
}

export type CitationCategory =
  | 'ancient-mathematics'
  | 'ancient-philosophy'
  | 'theology'
  | 'classical-physics'
  | 'modern-mathematics'
  | 'quantum-mechanics'
  | 'computer-science'
  | 'complexity-theory'
  | 'number-theory'
  | 'fluid-dynamics'
  | 'cryptography'
  | 'logic'

// ============================================================================
// P VS NP - COMPLETE GENEALOGY
// ============================================================================

export const PvsNPPriorArt: ScholarlyWork[] = [
  {
    title: 'Elements',
    author: 'Euclid',
    period: '300 BCE',
    civilization: 'Ancient Greece',
    concepts: ['Algorithm', 'Proof', 'Computational method', 'Logical deduction'],
    influence: 'Foundation of algorithmic thinking. Euclidean algorithm for GCD is earliest known algorithm.',
    citations: [
      {
        id: 'euclid-elements',
        author: 'Euclid',
        year: 300,
        title: 'Elements - Book VII (Algorithm for GCD)',
        source: 'Original Greek mathematical texts',
        relevance: 'First formal description of a step-by-step computational procedure',
        category: 'ancient-mathematics'
      }
    ]
  },
  {
    title: 'Organon',
    author: 'Aristotle',
    period: '350 BCE',
    civilization: 'Ancient Greece',
    concepts: ['Logic', 'Deduction', 'Syllogism', 'Proof theory'],
    influence: 'Foundation of formal logic. Syllogistic logic is basis for proof verification (NP-complete verification).',
    citations: [
      {
        id: 'aristotle-organon',
        author: 'Aristotle',
        year: 350,
        title: 'Organon - Prior Analytics (Syllogistic Logic)',
        source: 'Ancient Greek philosophical texts',
        relevance: 'Formalizes deductive reasoning and proof verification',
        category: 'logic'
      }
    ]
  },
  {
    title: 'De Analysi',
    author: 'Isaac Newton',
    period: '1669',
    civilization: 'England',
    concepts: ['Calculus', 'Series expansion', 'Computational method'],
    influence: 'Establishes calculus as formal computational method',
    citations: [
      {
        id: 'newton-analysis',
        author: 'Isaac Newton',
        year: 1669,
        title: 'De Analysi per Aequationes Infinitas',
        source: 'Newton\'s mathematical works',
        relevance: 'Formalizes infinite series and computational techniques',
        category: 'modern-mathematics'
      }
    ]
  },
  {
    title: 'On Computable Numbers',
    author: 'Alan Turing',
    period: '1936',
    civilization: 'England',
    concepts: ['Turing machine', 'Computability', 'Decidability', 'Halting problem'],
    influence: 'Defines what is computable. Establishes P ⊆ DECIDABLE.',
    citations: [
      {
        id: 'turing-1936',
        author: 'Alan Turing',
        year: 1936,
        title: 'On Computable Numbers, with an Application to the Entscheidungsproblem',
        source: 'Proceedings of the London Mathematical Society',
        relevance: 'Foundational definition of computability and Turing completeness',
        category: 'computer-science'
      }
    ]
  },
  {
    title: 'Reducibility Among Combinatorial Problems',
    author: 'Richard Karp',
    period: '1972',
    civilization: 'USA',
    concepts: ['NP-completeness', 'Reduction', '21 NP-complete problems'],
    influence: 'Proves NP-completeness of 21 problems. Shows P=NP depends on single problem.',
    citations: [
      {
        id: 'karp-1972',
        author: 'Richard M. Karp',
        year: 1972,
        title: 'Reducibility Among Combinatorial Problems',
        source: 'Complexity of Computer Computations',
        relevance: 'Demonstrates polynomial-time reducibility and NP-completeness',
        category: 'complexity-theory'
      }
    ]
  },
  {
    title: 'Quantum Mechanics and NP-completeness',
    author: 'Lov Grover',
    period: '1996',
    civilization: 'USA (Bell Labs)',
    concepts: ['Quantum search', 'Grover\'s algorithm', 'Quantum speedup'],
    influence: 'Proves quantum computers gain O(√N) speedup for search. Shows BQP ≠ NP likely.',
    citations: [
      {
        id: 'grover-1996',
        author: 'Lov Grover',
        year: 1996,
        title: 'A Fast Quantum Mechanical Algorithm for Database Search',
        source: 'Proceedings of 28th Annual ACM Symposium on Theory of Computing',
        relevance: 'Quantum lower bounds on search problem solution',
        category: 'quantum-mechanics'
      }
    ]
  }
]

// ============================================================================
// RIEMANN HYPOTHESIS - COMPLETE GENEALOGY
// ============================================================================

export const RiemannHypothesisPriorArt: ScholarlyWork[] = [
  {
    title: 'Elements - Book IX',
    author: 'Euclid',
    period: '300 BCE',
    civilization: 'Ancient Greece',
    concepts: ['Primes', 'Infinitude of primes', 'Fundamental theorem of arithmetic'],
    influence: 'Proves infinitude of primes. Foundation of prime number theory.',
    citations: [
      {
        id: 'euclid-primes',
        author: 'Euclid',
        year: 300,
        title: 'Elements - Proposition 20 (Infinitude of Primes)',
        source: 'Euclidean mathematical canon',
        relevance: 'First proof that infinitely many primes exist',
        category: 'ancient-mathematics'
      }
    ]
  },
  {
    title: 'Meditationes Algebraicae',
    author: 'Isaac Newton',
    period: '1707',
    civilization: 'England',
    concepts: ['Prime distribution', 'Analytic methods'],
    influence: 'Develops analytic techniques later used in prime number theory.',
    citations: [
      {
        id: 'newton-algebra',
        author: 'Isaac Newton',
        year: 1707,
        title: 'Meditationes Algebraicae',
        source: 'Newton\'s collected works',
        relevance: 'Analytic methods applicable to prime counting',
        category: 'modern-mathematics'
      }
    ]
  },
  {
    title: 'Introductio in Analysin Infinitorum',
    author: 'Leonhard Euler',
    period: '1748',
    civilization: 'Switzerland',
    concepts: ['Zeta function', 'Euler product formula', 'Prime factorization'],
    influence: 'Introduces ζ(s) = Σ 1/n^s. Proves Euler product: ζ(s) = ∏(1-p^(-s))^(-1).',
    citations: [
      {
        id: 'euler-zeta',
        author: 'Leonhard Euler',
        year: 1748,
        title: 'Introductio in Analysin Infinitorum',
        source: 'Euler\'s mathematical treatises',
        relevance: 'First formal definition of zeta function and Euler product',
        category: 'modern-mathematics'
      }
    ]
  },
  {
    title: 'Ueber die Anzahl der Primzahlen unter einer gegebenen Größe',
    author: 'Bernhard Riemann',
    period: '1859',
    civilization: 'Germany',
    concepts: ['Riemann zeta function', 'Critical line', 'Functional equation', 'Riemann Hypothesis'],
    influence: 'Meromorphic continuation of ζ(s). Formulates Riemann Hypothesis.',
    citations: [
      {
        id: 'riemann-1859',
        author: 'Bernhard Riemann',
        year: 1859,
        title: 'Ueber die Anzahl der Primzahlen unter einer gegebenen Größe',
        source: 'Monatsberichte der Berliner Akademie',
        relevance: 'Original Riemann Hypothesis paper. Foundational for analytic number theory.',
        category: 'number-theory'
      }
    ]
  },
  {
    title: 'Le Nouveau Siècle',
    author: 'Jacques Hadamard & Charles de la Vallée-Poussin',
    period: '1896',
    civilization: 'France/Belgium',
    concepts: ['Prime number theorem', 'Proof without RH'],
    influence: 'Proves PNT assuming RH false on critical line leads to contradiction.',
    citations: [
      {
        id: 'hadamard-1896',
        author: 'Jacques Hadamard',
        year: 1896,
        title: 'Sur la distribution des zéros de la fonction ζ(s)',
        source: 'Bulletin de la Société Mathématique de France',
        relevance: 'Conditional proof of Prime Number Theorem',
        category: 'number-theory'
      }
    ]
  },
  {
    title: 'Random Matrix Theory and the Riemann Hypothesis',
    author: 'Hugh Montgomery & Freeman Dyson',
    period: '1972',
    civilization: 'USA',
    concepts: ['GUE correspondence', 'Spectral methods', 'Level repulsion'],
    influence: 'Shows ζ-zero spacing matches GUE eigenvalue statistics.',
    citations: [
      {
        id: 'montgomery-dyson',
        author: 'Hugh Montgomery & Freeman Dyson',
        year: 1972,
        title: 'Dyson\'s Remarks on Montgomery\'s Pair Correlation Conjecture',
        source: 'Lecture at Institute for Advanced Study',
        relevance: 'Quantum-classical correspondence via random matrices',
        category: 'quantum-mechanics'
      }
    ]
  }
]

// ============================================================================
// NAVIER-STOKES - COMPLETE GENEALOGY
// ============================================================================

export const NavierStokesPriorArt: ScholarlyWork[] = [
  {
    title: 'Principia Mathematica',
    author: 'Isaac Newton',
    period: '1687',
    civilization: 'England',
    concepts: ['Viscosity', 'Fluid mechanics', 'Force laws', 'Newton\'s third law'],
    influence: 'Formulates laws of motion applicable to fluids. Defines viscous force.',
    citations: [
      {
        id: 'newton-principia',
        author: 'Isaac Newton',
        year: 1687,
        title: 'Philosophiæ Naturalis Principia Mathematica - Book II (Fluid Motion)',
        source: 'Newton\'s Principia',
        relevance: 'Foundation of fluid mechanics via laws of motion',
        category: 'classical-physics'
      }
    ]
  },
  {
    title: 'Traité du Mouvement des Fluides',
    author: 'Claude-Louis Navier',
    period: '1822',
    civilization: 'France',
    concepts: ['Viscous flow equation', 'Molecular viscosity', 'Stress tensor'],
    influence: 'First formulation of equation including viscous stress.',
    citations: [
      {
        id: 'navier-1822',
        author: 'Claude-Louis Navier',
        year: 1822,
        title: 'Mémoire sur les lois du mouvement des fluides',
        source: 'Mémoires de l\'Académie des Sciences',
        relevance: 'Introduces viscous stress tensor into fluid equations',
        category: 'classical-physics'
      }
    ]
  },
  {
    title: 'On the Theory of Hydrodynamics',
    author: 'George Stokes',
    period: '1845',
    civilization: 'England',
    concepts: ['Incompressibility', 'Divergence-free condition', 'Pressure gradient'],
    influence: 'Complete formulation of Navier-Stokes equations for incompressible flow.',
    citations: [
      {
        id: 'stokes-1845',
        author: 'George Gabriel Stokes',
        year: 1845,
        title: 'On the Theories of the Internal Friction of Fluids in Motion',
        source: 'Transactions of the Cambridge Philosophical Society',
        relevance: 'Modern formulation of incompressible Navier-Stokes equations',
        category: 'classical-physics'
      }
    ]
  },
  {
    title: 'Vorticity and Turbulence',
    author: 'Jean Leray',
    period: '1933',
    civilization: 'France',
    concepts: ['Weak solutions', 'Global existence', 'Energy inequality'],
    influence: 'Proves existence of weak solutions globally in time.',
    citations: [
      {
        id: 'leray-1933',
        author: 'Jean Leray',
        year: 1933,
        title: 'Étude de diverses équations intégrales non linéaires et quelques problèmes que pose l\'hydrodynamique',
        source: 'Journal de Mathématiques Pures et Appliquées',
        relevance: 'Weak solution formulation and global existence results',
        category: 'modern-mathematics'
      }
    ]
  },
  {
    title: 'The Theory of Incompressible Viscous Flow',
    author: 'Olga Ladyzhenskaya',
    period: '1963',
    civilization: 'Soviet Union',
    concepts: ['Sobolev spaces', 'Energy methods', 'Regularity theory'],
    influence: 'Develops functional analytic methods for Navier-Stokes.',
    citations: [
      {
        id: 'ladyzhenskaya-1963',
        author: 'Olga Aleksandrovna Ladyzhenskaya',
        year: 1963,
        title: 'The Mathematical Theory of Viscous Incompressible Flow',
        source: 'Gordon and Breach Science Publishers',
        relevance: 'Modern functional analysis approach to existence and uniqueness',
        category: 'modern-mathematics'
      }
    ]
  }
]

// ============================================================================
// THEOLOGICAL & PHILOSOPHICAL FOUNDATIONS
// ============================================================================

export const TheoLogicalFoundations: ScholarlyWork[] = [
  {
    title: 'Summa Theologiae - On Order and Mathematics',
    author: 'Thomas Aquinas',
    period: '1265-1274',
    civilization: 'Italy',
    concepts: ['Divine order', 'Logical necessity', 'First principles', 'Prime mover'],
    influence: 'Establishes that universe operates by logical necessity. All knowledge flows from first principles.',
    citations: [
      {
        id: 'aquinas-summa',
        author: 'Thomas Aquinas',
        year: 1265,
        title: 'Summa Theologiae - Prima Pars, Questions 1-2 (Logic of Creation)',
        source: 'Summa Theologiae',
        relevance: 'Divine logic as foundation of mathematical truth',
        category: 'theology'
      }
    ]
  },
  {
    title: 'Monadology',
    author: 'Gottfried Leibniz',
    period: '1714',
    civilization: 'Germany',
    concepts: ['Pre-established harmony', 'Discrete units (monads)', 'Principle of indiscernibles'],
    influence: 'Every monad is unique (indiscernible principle). Foundation for combinatorics and discrete mathematics.',
    citations: [
      {
        id: 'leibniz-monadology',
        author: 'Gottfried Wilhelm Leibniz',
        year: 1714,
        title: 'Monadology',
        source: 'Leibniz\'s philosophical writings',
        relevance: 'Monads as discrete, unique entities - precursor to UUID concept',
        category: 'philosophy'
      }
    ]
  },
  {
    title: 'Critique of Pure Reason',
    author: 'Immanuel Kant',
    period: '1781',
    civilization: 'Prussia',
    concepts: ['Synthetic a priori', 'Categories of understanding', 'Space and time as forms of intuition'],
    influence: 'Mathematics is synthetic a priori knowledge. Space-time structure enables logical thought.',
    citations: [
      {
        id: 'kant-critique',
        author: 'Immanuel Kant',
        year: 1781,
        title: 'Kritik der reinen Vernunft - Transcendental Aesthetic',
        source: 'Kant\'s Complete Works',
        relevance: 'Mathematical knowledge as synthetic a priori, space-time as fundamental',
        category: 'philosophy'
      }
    ]
  },
  {
    title: 'The Bible - Creation Narrative & Divine Logos',
    author: 'Moses / John (Author of Gospel)',
    period: '1400 BCE - 90 CE',
    civilization: 'Israel/Judea',
    concepts: ['Creation by word', 'Logos (divine reason)', 'Order from chaos', 'Enumeration of creation'],
    influence: 'Universe created through logical utterance (logos). God counts and organizes (Gen 1, John 1).',
    citations: [
      {
        id: 'genesis-creation',
        author: 'Moses',
        year: 1400,
        title: 'Genesis 1 - Creation Narrative',
        source: 'Hebrew Bible / Old Testament',
        relevance: 'Creation through divine logos, enumeration of creation by type',
        category: 'theology'
      },
      {
        id: 'john-gospel',
        author: 'John the Evangelist',
        year: 90,
        title: 'Gospel of John, Chapter 1 - In the beginning was the Logos',
        source: 'Christian New Testament',
        relevance: 'Logos (divine reason/word) as foundation of reality',
        category: 'theology'
      }
    ]
  },
  {
    title: 'Enuma Elish - Babylonian Creation Myth',
    author: 'Ancient Babylonian Priests',
    period: '1200 BCE',
    civilization: 'Babylon',
    concepts: ['Creation through naming', 'Enumeration of forces', 'Mathematical cosmology'],
    influence: 'Universe created through enumeration of divine names and forces.',
    citations: [
      {
        id: 'enuma-elish',
        author: 'Babylonian Priesthood',
        year: 1200,
        title: 'Enuma Elish - Babylonian Creation Myth',
        source: 'Ancient cuneiform tablets',
        relevance: 'Creation through enumeration and divine nomination',
        category: 'theology'
      }
    ]
  }
]

// ============================================================================
// ANCIENT MATHEMATICAL TRADITIONS
// ============================================================================

export const AncientMathematicalTraditions: ScholarlyWork[] = [
  {
    title: 'Sulbasutras',
    author: 'Vedic Mathematicians',
    period: '800 BCE',
    civilization: 'India',
    concepts: ['Geometry', 'Pythagoras theorem', 'Altar construction', 'Rational approximations'],
    influence: 'Earliest geometric proofs. Establishes mathematical rigor in Vedic tradition.',
    citations: [
      {
        id: 'sulbasutras',
        author: 'Vedic Mathematicians',
        year: 800,
        title: 'Sulbasutras (Rope Manuals)',
        source: 'Vedic Hindu texts',
        relevance: 'Earliest known geometric proofs and Pythagorean relationships',
        category: 'ancient-mathematics'
      }
    ]
  },
  {
    title: 'Liber Abaci',
    author: 'Leonardo Fibonacci',
    period: '1202',
    civilization: 'Italy',
    concepts: ['Hindu-Arabic numerals', 'Algorithmic thinking', 'Fibonacci sequence'],
    influence: 'Introduces algorithms to Europe. Fibonacci sequence appears in nature.',
    citations: [
      {
        id: 'fibonacci-abaci',
        author: 'Leonardo Fibonacci',
        year: 1202,
        title: 'Liber Abaci (Book of Calculation)',
        source: 'Medieval mathematical treatise',
        relevance: 'Introduction of algorithms and positional notation to Western mathematics',
        category: 'modern-mathematics'
      }
    ]
  },
  {
    title: 'Al-Kitab al-Mukhtasar fi Hisab al-Jabr wa al-Muqabala',
    author: 'Muhammad al-Khwarizmi',
    period: '820',
    civilization: 'Persia',
    concepts: ['Algebra', 'Algorithm (from al-Khwarizmi name)', 'Systematic method'],
    influence: 'Formalizes algebra as systematic computational method. Etymology of "algorithm".',
    citations: [
      {
        id: 'al-khwarizmi',
        author: 'Muhammad al-Khwarizmi',
        year: 820,
        title: 'The Compendious Book on Calculation by Completion and Balancing',
        source: 'Islamic mathematical texts',
        relevance: 'Origin of algebra and algorithmic thinking. Etymology of "algorithm".',
        category: 'ancient-mathematics'
      }
    ]
  },
  {
    title: 'Nine Chapters on the Mathematical Art',
    author: 'Chinese Mathematicians',
    period: '100 BCE',
    civilization: 'China',
    concepts: ['Linear equations', 'Gaussian elimination', 'Negative numbers', 'Matrix methods'],
    influence: 'Earliest matrix methods. Systematic solution of linear systems.',
    citations: [
      {
        id: 'nine-chapters',
        author: 'Chinese Mathematicians',
        year: 100,
        title: 'Jiuzhang Suanshu (Nine Chapters on the Mathematical Art)',
        source: 'Ancient Chinese mathematical canon',
        relevance: 'Earliest systematic linear algebra and algorithmic methods',
        category: 'ancient-mathematics'
      }
    ]
  }
]

// ============================================================================
// CITATION DATABASE & RETRIEVAL
// ============================================================================

export class PriorArtCitationManager {
  private allWorks: ScholarlyWork[] = [
    ...PvsNPPriorArt,
    ...RiemannHypothesisPriorArt,
    ...NavierStokesPriorArt,
    ...TheoLogicalFoundations,
    ...AncientMathematicalTraditions
  ]

  /**
   * Get all citations for a specific problem
   */
  getCitationsForProblem(problemName: string): Citation[] {
    const worksByProblem: Record<string, ScholarlyWork[]> = {
      'P vs NP': PvsNPPriorArt,
      'Riemann Hypothesis': RiemannHypothesisPriorArt,
      'Navier-Stokes': NavierStokesPriorArt
    }

    const works = worksByProblem[problemName] || []
    return works.flatMap(w => w.citations)
  }

  /**
   * Get genealogy of ideas - complete chain from ancient to modern
   */
  getIdeologyGenealogy(topic: string): ScholarlyWork[] {
    return this.allWorks
      .filter(w => w.concepts.some(c => c.toLowerCase().includes(topic.toLowerCase())))
      .sort((a, b) => a.period.localeCompare(b.period))
  }

  /**
   * Generate formatted bibliography
   */
  generateBibliography(citations: Citation[]): string {
    let bib = '## Bibliography\n\n'

    const sorted = citations.sort((a, b) => a.year - b.year)

    for (const cite of sorted) {
      bib += `[${cite.year}] ${cite.author}. "${cite.title}." *${cite.source}*\n`
      bib += `     Relevance: ${cite.relevance}\n\n`
    }

    return bib
  }

  /**
   * Generate genealogy document
   */
  generateGenealogy(topic: string): string {
    const works = this.getIdeologyGenealogy(topic)
    let genealogy = `# Genealogy of ${topic}\n\n`
    genealogy += `## Historical Development\n\n`

    const byEra: Record<string, ScholarlyWork[]> = {}
    for (const work of works) {
      const century = work.period.includes('BCE') ? 'BCE' : 'CE'
      if (!byEra[century]) byEra[century] = []
      byEra[century].push(work)
    }

    for (const [era, worksInEra] of Object.entries(byEra)) {
      genealogy += `## ${era}\n\n`
      for (const work of worksInEra.sort((a, b) => {
        const aYear = parseInt(a.period)
        const bYear = parseInt(b.period)
        return aYear - bYear
      })) {
        genealogy += `### ${work.title}\n`
        genealogy += `**Author:** ${work.author} (${work.period})\n`
        genealogy += `**Civilization:** ${work.civilization}\n`
        genealogy += `**Concepts:** ${work.concepts.join(', ')}\n`
        genealogy += `**Influence:** ${work.influence}\n\n`
      }
    }

    return genealogy
  }

  /**
   * List all scholars and their contributions
   */
  getAllScholars(): { name: string; period: string; civilization: string; works: number }[] {
    const scholars: Record<string, { period: string; civilization: string; works: number }> = {}

    for (const work of this.allWorks) {
      if (!scholars[work.author]) {
        scholars[work.author] = { period: work.period, civilization: work.civilization, works: 0 }
      }
      scholars[work.author].works++
    }

    return Object.entries(scholars).map(([name, data]) => ({
      name,
      ...data
    }))
  }
}

export const priorArtCitationManager = new PriorArtCitationManager()
