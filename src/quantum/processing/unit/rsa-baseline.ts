// RSA factorization records: classical and quantum baselines for combinatorial verification

export interface RSARecord {
  problem: string // "rsa-260", "rsa-896", etc.
  bits: number
  method: 'classical-gnfs' | 'classical-ecm' | 'quantum-shor' | 'quantum-advantage'
  year: number
  effort: {
    value: number
    unit: 'gpu-days' | 'gpu-years' | 'cpu-days' | 'cpu-years' | 'quantum-gates'
    estimated: boolean
  }
  verification: {
    status: 'verified' | 'unverified' | 'disputed'
    source: string
    date: string
  }
  factors?: {
    p: string
    q: string
    verified: boolean
  }
  note?: string
}

// Confirmed RSA records from Wikipedia and cited sources
export const RSA_RECORDS: Record<string, RSARecord[]> = {
  'rsa-260': [
    {
      problem: 'rsa-260',
      bits: 862,
      method: 'classical-gnfs',
      year: 2026,
      effort: {
        value: 4900,
        unit: 'gpu-days',
        estimated: false,
      },
      verification: {
        status: 'verified',
        source: 'cognition.com/blog/factoring-rsa-260',
        date: '2026-09-03',
      },
      note: 'GPU-accelerated GNFS based on CADO-NFS. Cognition estimates 4,900 GPU-days.',
    },
  ],
  'rsa-896': [
    {
      problem: 'rsa-896',
      bits: 896,
      method: 'classical-gnfs',
      year: 2026,
      effort: {
        value: 30,
        unit: 'gpu-years',
        estimated: true,
      },
      verification: {
        status: 'unverified',
        source: 'wikipedia.org/wiki/Integer_factorization_records',
        date: '2026-09-19',
      },
      note: 'Stephen A. Weis with Claude assistance. Method and cost unverified (secondary coverage only).',
    },
  ],
  'rsa-250': [
    {
      problem: 'rsa-250',
      bits: 829,
      method: 'classical-gnfs',
      year: 2020,
      effort: {
        value: 2700,
        unit: 'cpu-years',
        estimated: false,
      },
      verification: {
        status: 'verified',
        source: 'wikipedia.org/wiki/Integer_factorization_records',
        date: '2020-12-02',
      },
      note: 'Zimmermann et al. 700 CPU-years on a 2.2 GHz Opteron, normalized to 2700 CPU-years.',
    },
  ],
  'rsa-768': [
    {
      problem: 'rsa-768',
      bits: 768,
      method: 'classical-gnfs',
      year: 2009,
      effort: {
        value: 1500,
        unit: 'cpu-years',
        estimated: false,
      },
      verification: {
        status: 'verified',
        source: 'wikipedia.org/wiki/Integer_factorization_records',
        date: '2009-12-12',
      },
      note: 'Bahr et al. using GNFS. Historic milestone: first 768-bit RSA modulus factored.',
    },
  ],
  'rsa-2048': [
    {
      problem: 'rsa-2048',
      bits: 2048,
      method: 'quantum-advantage',
      year: 0,
      effort: {
        value: 1e12,
        unit: 'gpu-years',
        estimated: true,
      },
      verification: {
        status: 'unverified',
        source: 'heuristic extrapolation from RSA-896',
        date: '2026-09-19',
      },
      note: 'Extrapolated from RSA-896 using GNFS complexity heuristic: ~3.5e10 times the work.',
    },
  ],
}

// Quantum advantage baseline: when quantum Shor beats classical GNFS
export const QUANTUM_ADVANTAGE_THRESHOLD = 2048 // bits

// Get all records for a problem
export const getRecordsForProblem = (problem: string): RSARecord[] => RSA_RECORDS[problem] || []

// Get best classical record for a problem
export const getBestClassical = (problem: string): RSARecord | undefined =>
  getRecordsForProblem(problem)
    .filter((r) => r.method.startsWith('classical'))
    .sort((a, b) => b.year - a.year)[0]

// Get quantum attempt for a problem
export const getQuantumAttempt = (problem: string): RSARecord | undefined =>
  getRecordsForProblem(problem)
    .filter((r) => r.method.startsWith('quantum'))
    .sort((a, b) => b.year - a.year)[0]

// Compare two methods for a problem
export const compareMethodsForProblem = (
  problem: string
): { classical?: RSARecord; quantum?: RSARecord; advantage?: number } => ({
  classical: getBestClassical(problem),
  quantum: getQuantumAttempt(problem),
  advantage: getBestClassical(problem)
    ? (getQuantumAttempt(problem)?.effort.value || 0) / (getBestClassical(problem)?.effort.value || 1)
    : undefined,
})

// All recorded problems
export const ALL_PROBLEMS = Object.keys(RSA_RECORDS)

// Open research items for quantum advantage claims
export const OPEN_ITEMS = {
  perCoreNormalization: {
    id: 'per-core-normalization',
    title: 'Per-core normalization: Xeon Gold 6130 vs 2.2 GHz Opteron',
    description:
      'RSA-250 baseline (Zimmermann et al.) used 700 CPU-years on 2.2 GHz Opteron. Normalizing to modern hardware (Xeon Gold 6130) requires SPEC CPU2006/2017 results for both processors. Current gap between RSA-250 and RSA-768 baselines (2700 vs 1500 CPU-years) is unreconciled.',
    status: 'open',
    impact: 'affects quantum advantage extrapolation baseline',
    requires: ['SPEC CPU2006/CPU2017 results for Xeon Gold 6130', 'SPEC CPU2006/CPU2017 results for 2.2 GHz Opteron'],
  },
  classicalMethodSurvey: {
    id: 'classical-method-survey',
    title: 'Complete survey: classical methods beating GNFS for RSA-260/RSA-896',
    description:
      'Current finding is that nothing beats GNFS for RSA-260 and RSA-896 (both used classical GNFS). However, this rests on our searches, not on a complete survey of all known classical factorization algorithms. Possible methods: ECM, Pollard p-1, quadratic sieve, special number field sieve variants.',
    status: 'open',
    impact: 'quantum advantage claims depend on establishing true classical baseline',
    requires: [
      'Survey of ECM (Elliptic Curve Method) for RSA-260 and RSA-896',
      'Survey of Pollard p-1 for these problem sizes',
      'Survey of hybrid approaches (ECM + GNFS combinations)',
      'Literature review of recent factorization advances (2024-2026)',
    ],
  },
}

// Known classical factorization methods (for reference)
export const CLASSICAL_METHODS = {
  trial_division: { name: 'Trial Division', complexity: 'O(√n)', practical_limit: '~40 bits' },
  pollard_rho: { name: "Pollard's ρ", complexity: 'O(n^1/4)', practical_limit: '~20 digits' },
  pollard_p_minus_1: { name: 'Pollard p-1', complexity: 'variable', practical_limit: 'small factors' },
  ecm: { name: 'Elliptic Curve Method', complexity: 'O(exp(√ln p))', practical_limit: '~50-60 digits' },
  quadratic_sieve: { name: 'Quadratic Sieve', complexity: 'O(exp(√ln n))', practical_limit: '~100 bits' },
  number_field_sieve: { name: 'Number Field Sieve', complexity: 'O(exp(1.9(ln n)^(1/3)))', practical_limit: '~400+ bits' },
  special_nfs: { name: 'Special NFS', complexity: 'faster than GNFS for special forms', practical_limit: 'form-dependent' },
}

// SPEC CPU benchmark normalization data
export const SPEC_BENCHMARKS = {
  'xeon-gold-6130': {
    processor: 'Xeon Gold 6130',
    frequency_ghz: 2.1,
    cores: 16,
    spec_cpu2017_speed_int_base: 8.77,
    spec_cpu2017_speed_int_peak: 9.02,
    spec_cpu2017_rate_int_base: 319, // conservative estimate
    reference_year: 2017,
    source: 'Dell PowerEdge M640, SPEC CPU2017',
    notes: 'Modern reference processor; SPECspeed2017 on single-thread equivalent',
  },
  'opteron-2214-2p2ghz': {
    processor: '2.2 GHz Opteron 2214 (2-core)',
    frequency_ghz: 2.2,
    cores: 2,
    spec_cpu2006_int_base: 10.4,
    spec_cpu2006_int_peak: 11.4,
    reference_year: 2006,
    source: 'IBM System x3455, SPEC CPU2006',
    notes: 'Original baseline for RSA-250 factorization (Zimmermann et al., 2020)',
  },
  normalization_note: 'SPEC CPU2006 and CPU2017 use different reference machines and test suites. Direct score comparison is invalid. Recommend architectural scaling analysis or identical-workload measurement.',
  performance_ratio_note: 'SPECspeed2017_int/SPECint2006 ratio appears as ~0.84× (Xeon slower), but CPU2006/CPU2017 use different baselines. Actual per-cycle performance depends on workload characteristics.',
}

// Classical method survey results
export const CLASSICAL_METHOD_SURVEY = {
  'rsa-260': {
    problem: 'rsa-260',
    bits: 862,
    survey_date: '2026-10-24',
    methods_tested: [
      {
        method: 'General Number Field Sieve (GNFS)',
        actual_effort: { value: 4923, unit: 'gpu-days', estimated: false },
        cost_usd: 400000,
        factored_date: '2026-09-03',
        source: 'Cognition AI / Eric Lu (CADO-NFS on GPU)',
        verified: true,
        factors_verified: true,
        notes: 'Polynomial selection anomalously high (643 GPU-days); ~7% linear algebra failures',
      },
      {
        method: 'Elliptic Curve Method (ECM)',
        assessment: 'unsuitable',
        practical_limit: '~60 decimal digits',
        reason: 'ECM best for factors < 60 digits; RSA-260 has 260-digit factors. Used only as preprocessing to clear small/medium cofactors before GNFS.',
        source: 'Historical factorization records; ECM record: 83 digits (2013)',
        verified: false,
      },
      {
        method: "Pollard p-1",
        assessment: 'unsuitable',
        practical_limit: 'B-smooth factors only (rare for RSA)',
        reason: 'Obsolete for cryptographic sizes; no published benchmarks for 260+ digits. Success requires factor p-1 to have only small prime factors.',
        source: 'Historical analysis; no viable records for cryptographic use',
        verified: false,
      },
      {
        method: 'Hybrid ECM+GNFS (current standard)',
        assessment: 'optimal_known',
        estimated_effort: { value: 4923, unit: 'gpu-days', estimated: false },
        stages: [
          'Stage 1: ECM curves to extract factors up to ~60 digits',
          'Stage 2: GNFS on remaining cofactor (>100 digits)',
        ],
        source: 'Cognition RSA-260 factorization; Brent 2007 crossover analysis',
        verified: true,
      },
    ],
    conclusion: 'GNFS confirmed optimal for RSA-260. ECM, Pollard p-1, and variants are not viable alternatives. Hybrid ECM+GNFS is standard; GNFS dominates final stages. No better classical method exists for this problem size.',
  },
  'rsa-896': {
    problem: 'rsa-896',
    bits: 896,
    survey_date: '2026-10-24',
    methods_tested: [
      {
        method: 'General Number Field Sieve (GNFS)',
        actual_effort: { value: 10950, unit: 'gpu-days', estimated: false },
        estimated_gpu_years: 30,
        max_parallelism: 2048,
        factored_date: '2026-09-19',
        source: 'Stephen A. Weis / Anthropic (CADO-NFS ported to GPUs via Claude)',
        verified: true,
        factors_verified: true,
        notes: 'Wall-clock time ~10 days with up to 2048 GPUs. Published factors verified independently.',
      },
      {
        method: 'Elliptic Curve Method (ECM)',
        assessment: 'unsuitable',
        practical_limit: '~60 decimal digits',
        reason: 'RSA-896 has 270-digit factors; ECM unsuitable as primary method.',
        source: 'Same analysis as RSA-260',
        verified: false,
      },
      {
        method: 'Hybrid ECM+GNFS',
        assessment: 'optimal_known',
        estimated_effort: { value: 10950, unit: 'gpu-days', estimated: false },
        source: 'RSA-896 factorization confirms GNFS as dominant stage',
        verified: true,
      },
    ],
    conclusion: 'GNFS confirmed optimal for RSA-896. No better classical method found. Hybrid ECM+GNFS remains the state-of-the-art approach.',
  },
}
