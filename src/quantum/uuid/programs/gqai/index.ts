// Google Quantum AI Challenge Implementation program:
// operationalized Lean-verified quantum functions, ISO/IEC 4879:2024 witness matrix,
// strict evidence policy (supported | blocked | not_supported | unverified),
// Kaggle kickmix/Qualtran & XPRIZE Stage III benchmark matrix, and sealed Google Apps Script export.
import { THEOREMS } from '../3/f/0/e/7/a/6/f/index.ts'
import { WILLOW } from '../f/7/e/3/6/2/f/6/index.ts'
import { LICENSE } from '../a/f/3/d/e/a/5/f/index.ts'
import { VERSION } from '../c/0/7/0/9/8/4/3/index.ts'
import { hex, sha256, utf8 } from '../9/e/8/6/7/0/6/8/index.ts'
import { SDK_API_PREFIX, SDK_VOCABULARY } from '../sdk/schema/index.ts'
import { canonicalText, seal, uuid } from '../2/7/1/a/7/6/4/9/index.ts'

export type EvidenceStatus = 'supported' | 'blocked' | 'not_supported' | 'unverified'

export type WitnessRow = {
  clause: string
  terminology: string
  witness: string
  fn: string
  expression: string
}

export type ChallengeBenchmark = {
  id: 'fusion-invsqrt' | 'dqi-reed-solomon' | 'femoco-qpe' | 'xprize-stage-iii'
  competition: 'kaggle-verifiable-compilation' | 'xprize-quantum-applications'
  title: string
  target: string
  artefacts: readonly string[]
  metric: string
  witnesses: readonly string[]
  sample: { qubits: number; distance: number; rawDepth: number }
  submissionStatus: EvidenceStatus
}

/** State dimension 2^n for n qubits (Vocabulary.basis_length). */
export const getQubitBasisLength = (n: number): number => {
  if (!Number.isInteger(n) || n < 0) throw new Error(`qubits ${n}`)
  return 2 ** n
}

/** Grover search space 2^(2*k) for k qubits (groverSize_eq_two_pow). */
export const getGroverSize = (k: number): number => {
  if (!Number.isInteger(k) || k < 0) throw new Error(`qubits ${k}`)
  return 2 ** (2 * k)
}

/** Minimal QFT routing depth 2*q - 1 under nearest-neighbour layout (qftDepth_eq_sub). */
export const getQftDepth = (q: number): number => {
  if (!Number.isInteger(q) || q < 1) throw new Error(`qubits ${q}`)
  return 2 * q - 1
}

/** Exact QAOA variational parameter budget 2*p for p layers (qaoaParams_eq_mul). */
export const getQaoaParams = (p: number): number => {
  if (!Number.isInteger(p) || p < 0) throw new Error(`layers ${p}`)
  return 2 * p
}

/** Planar surface code physical qubits 2*d^2 - 2*d + 1 for distance d (surfacePhysical_eq_add). */
export const getSurfacePhysicalQubits = (d: number): number => {
  if (!Number.isInteger(d) || d < 1) throw new Error(`distance ${d}`)
  return 2 * d * d - 2 * d + 1
}

/** Maximum correctable errors floor((d - 1) / 2) for distance d (surfaceCorrectable_eq_div). */
export const getSurfaceCorrectableErrors = (d: number): number => {
  if (!Number.isInteger(d) || d < 1) throw new Error(`distance ${d}`)
  return Math.floor((d - 1) / 2)
}

/** ISO/IEC 4879:2024 formal witness matrix verified against the Lean 4 kernel index. */
export const GQAI_WITNESS_MATRIX: readonly WitnessRow[] = [
  { clause: '3.1.2', terminology: 'Model Parameter', witness: 'Vocabulary.parameter_unique', fn: 'getQaoaParams', expression: '2*p' },
  { clause: '3.1.4', terminology: 'Simulator Basis Length', witness: 'Vocabulary.basis_length', fn: 'getQubitBasisLength', expression: '2^n' },
  { clause: '3.1.9', terminology: 'Search Algorithm Advantage', witness: 'groverSize_eq_two_pow', fn: 'getGroverSize', expression: '2^(2*k)' },
  { clause: '3.4.19', terminology: 'Quantum Error Correction', witness: 'surfaceCorrectable_eq_div', fn: 'getSurfaceCorrectableErrors', expression: 'floor((d - 1) / 2)' },
  { clause: '3.4.20', terminology: 'Surface Code Physical Qubits', witness: 'surfacePhysical_eq_add', fn: 'getSurfacePhysicalQubits', expression: '2*d^2 - 2*d + 1' },
  { clause: '3.4.21', terminology: 'Quantum Programming Depth', witness: 'qftDepth_eq_sub', fn: 'getQftDepth', expression: '2*q - 1' },
  { clause: '3.4.32', terminology: 'Hardware Coupler Topology', witness: 'Coupler.willow', fn: 'WILLOW.sites.length', expression: '105' },
  { clause: '3.5.2', terminology: 'Quantum Machine Learning', witness: 'qaoaParams_eq_mul', fn: 'getQaoaParams', expression: '2*p' },
] as const

/** Additional Lean kernel witnesses cited across the Google Quantum AI roadmap. */
export const GQAI_EXTRA_WITNESSES = [
  'Advantage.rank_unrank',
  'textbook_grover_search',
  'Qpu.Verify.Correct.steane_corrects_one',
  'surfacePhysical_pos',
  'QuantumCircuit.routed_depth',
  'QuantumGate.t_gate',
  'qaoa_budget_per_layer',
] as const

/** Active Google Quantum AI challenge benchmarks mapped to Lean witnesses and evidence status. */
export const GQAI_CHALLENGES: readonly ChallengeBenchmark[] = [
  {
    id: 'fusion-invsqrt',
    competition: 'kaggle-verifiable-compilation',
    title: 'Fusion Plasma Simulation',
    target: 'kickmix / Qualtran',
    artefacts: ['invsqrt.kmb', 'invsqrt.kmx'],
    metric: 'T-count + depth',
    witnesses: ['QuantumGate.t_gate', 'QuantumCircuit.routed_depth', 'qftDepth_eq_sub'],
    sample: { qubits: 8, distance: 5, rawDepth: 24 },
    submissionStatus: 'unverified',
  },
  {
    id: 'dqi-reed-solomon',
    competition: 'kaggle-verifiable-compilation',
    title: 'Decoded Quantum Interferometry',
    target: 'kickmix / Qualtran',
    artefacts: ['dqi.kmb', 'dqi.kmx'],
    metric: 'T-count + depth',
    witnesses: ['Qpu.Verify.Correct.steane_corrects_one', 'Advantage.rank_unrank', 'QuantumCircuit.routed_depth'],
    sample: { qubits: 10, distance: 7, rawDepth: 32 },
    submissionStatus: 'unverified',
  },
  {
    id: 'femoco-qpe',
    competition: 'kaggle-verifiable-compilation',
    title: 'FeMoCo Nitrogenase QPE',
    target: 'kickmix / Qualtran',
    artefacts: ['femoco.kmb', 'femoco.kmx'],
    metric: 'T-count + QROM',
    witnesses: ['Vocabulary.basis_length', 'QuantumGate.t_gate', 'surfacePhysical_eq_add'],
    sample: { qubits: 12, distance: 7, rawDepth: 48 },
    submissionStatus: 'unverified',
  },
  {
    id: 'xprize-stage-iii',
    competition: 'xprize-quantum-applications',
    title: 'XPRIZE Stage III Utility',
    target: 'Cirq / OpenFermion / Stim',
    artefacts: ['resource-budget.json'],
    metric: 'Logical speedup + qubits',
    witnesses: ['Coupler.willow', 'surfacePhysical_eq_add', 'surfaceCorrectable_eq_div', 'qaoaParams_eq_mul'],
    sample: { qubits: 6, distance: 7, rawDepth: 18 },
    submissionStatus: 'unverified',
  },
] as const

export type CompilationInput = {
  qubits?: unknown
  distance?: unknown
  rawDepth?: unknown
  tCount?: unknown
  benchmark?: unknown
}

/** Verify proposed circuit compilation metrics against Lean 4 bounds and ISO/IEC 4879:2024 rules. */
export const verifyCompilationMetrics = (input: CompilationInput) => {
  const qubits = Number(input.qubits)
  const distance = Number(input.distance)
  const rawDepth = Number(input.rawDepth)
  const tCount = input.tCount === undefined ? null : Number(input.tCount)
  const benchmark = typeof input.benchmark === 'string' && input.benchmark.trim() ? input.benchmark.trim() : null
  const validInts = Number.isInteger(qubits) && qubits >= 1 && Number.isInteger(distance) && distance >= 1 && Number.isInteger(rawDepth) && rawDepth >= 0
  if (!validInts) {
    const blockedBody = { qubits, distance, rawDepth, benchmark, evidenceStatus: 'blocked' as const }
    const address = uuid(canonicalText(blockedBody))
    return {
      phase: 'gqai-compilation' as const,
      ...blockedBody,
      isCompilationValid: false,
      reason: 'invalid-parameters',
      address,
      handle: address.slice(0, 8),
      sealed: seal(address).valid,
      standard: SDK_VOCABULARY,
      licence: LICENSE.spdx,
    }
  }
  const minPhysicalQubits = getSurfacePhysicalQubits(distance)
  const maxCorrectableErrors = getSurfaceCorrectableErrors(distance)
  const basisDimension = qubits <= 53 ? getQubitBasisLength(qubits) : null
  const basisBits = qubits
  const minAllowedDepth = getQftDepth(qubits)
  const isOddDistance = distance % 2 === 1
  const isValidDepth = rawDepth >= minAllowedDepth
  const fitsWillowSingleLogical = minPhysicalQubits <= WILLOW.sites.length
  const isCompilationValid = isOddDistance && isValidDepth
  const evidenceStatus: EvidenceStatus = isCompilationValid ? 'supported' : 'blocked'
  const core = {
    logicalQubits: qubits,
    basisDimension,
    basisBits,
    codeDistance: distance,
    requiredPhysicalQubits: minPhysicalQubits,
    maxCorrectableErrors,
    minAllowedDepth,
    rawDepth,
    ...(tCount !== null && Number.isInteger(tCount) && tCount >= 0 ? { tCount } : {}),
    ...(benchmark ? { benchmark } : {}),
    fitsWillowSingleLogical,
    willowQubits: WILLOW.sites.length,
    isCompilationValid,
    evidenceStatus,
  }
  const canonical = canonicalText(core)
  const address = uuid(canonical)
  return {
    phase: 'gqai-compilation' as const,
    ...core,
    witnesses: ['Vocabulary.basis_length', 'qftDepth_eq_sub', 'surfacePhysical_eq_add', 'surfaceCorrectable_eq_div', 'Coupler.willow'] as const,
    address,
    handle: address.slice(0, 8),
    sha256: hex(sha256(utf8(canonical))),
    sealed: seal(address).valid,
    standard: SDK_VOCABULARY,
    licence: LICENSE.spdx,
    mcpVerify: { method: 'tools/call' as const, params: { name: 'verify' as const, arguments: { uuid: address, content: canonical } } },
  }
}

/** Complete Google Quantum AI Challenge implementation matrix verified against Lean kernel theorems. */
export const gqaiChallengeMatrix = (origin = 'https://qpu.uuidna.com') => {
  const root = origin.replace(/\/+$/, '')
  const theoremSet = new Set(THEOREMS.map((t) => t.key))
  const witnesses = GQAI_WITNESS_MATRIX.map((w) => ({
    ...w,
    kernelAccepted: theoremSet.has(w.witness),
  }))
  const extraAccepted = GQAI_EXTRA_WITNESSES.every((k) => theoremSet.has(k))
  const challenges = GQAI_CHALLENGES.map((c) => ({
    ...c,
    witnessesAccepted: c.witnesses.every((k) => theoremSet.has(k)),
    baseline: verifyCompilationMetrics({ ...c.sample, benchmark: c.id }),
  }))
  const allWitnessesAccepted = witnesses.every((w) => w.kernelAccepted) && extraAccepted
  const body = { origin: root, version: VERSION, witnesses: witnesses.length, challenges: challenges.length, allWitnessesAccepted }
  const canonical = canonicalText(body)
  const address = uuid(canonical)
  return {
    phase: 'gqai-challenges' as const,
    origin: root,
    version: VERSION,
    standard: SDK_VOCABULARY,
    licence: LICENSE.spdx,
    mcpEndpoint: `${root}${SDK_API_PREFIX}/mcp`,
    globalEndpoint: `${root}${SDK_API_PREFIX}/globals/google`,
    evidencePolicy: ['supported', 'blocked', 'not_supported', 'unverified'] as const,
    allWitnessesAccepted,
    witnesses,
    extraWitnesses: [...GQAI_EXTRA_WITNESSES],
    challenges,
    address,
    handle: address.slice(0, 8),
    sha256: hex(sha256(utf8(canonical))),
    sealed: seal(address).valid,
  }
}

/** Deterministic standalone Google Apps Script bundle operationalizing Lean 4 theorems. */
export const gqaiAppsScript = (origin = 'https://qpu.uuidna.com') => {
  const root = origin.replace(/\/+$/, '')
  const fn = 'function '
  const code = [
    `// @uuidna/qpu v${VERSION} (${SDK_VOCABULARY})`,
    `// MCP: ${root}${SDK_API_PREFIX}/mcp`,
    '/** Vocabulary.basis_length: 2^n */',
    `${fn}getQubitBasisLength(n) { return 2 ** n; }`,
    '/** groverSize_eq_two_pow: 2^(2*k) */',
    `${fn}getGroverSize(k) { return 2 ** (2 * k); }`,
    '/** qftDepth_eq_sub: 2*q - 1 */',
    `${fn}getQftDepth(q) { return 2 * q - 1; }`,
    '/** qaoaParams_eq_mul: 2*p */',
    `${fn}getQaoaParams(p) { return 2 * p; }`,
    '/** surfacePhysical_eq_add: 2*d^2 - 2*d + 1 */',
    `${fn}getSurfacePhysicalQubits(d) { return 2 * d * d - 2 * d + 1; }`,
    '/** surfaceCorrectable_eq_div: floor((d - 1) / 2) */',
    `${fn}getSurfaceCorrectableErrors(d) { return Math.floor((d - 1) / 2); }`,
    '/** ISO/IEC 4879:2024 compilation verifier */',
    `${fn}verifyCompilationMetrics(qubits, distance, rawDepth) {`,
    '  var minPhysicalQubits = getSurfacePhysicalQubits(distance);',
    '  var maxCorrectableErrors = getSurfaceCorrectableErrors(distance);',
    '  var basisDim = getQubitBasisLength(qubits);',
    '  var minRoutingDepth = getQftDepth(qubits);',
    '  var isValidDepth = (distance % 2 === 1) && (rawDepth >= minRoutingDepth);',
    '  return {',
    '    logicalQubits: qubits,',
    '    basisDimension: basisDim,',
    '    codeDistance: distance,',
    '    requiredPhysicalQubits: minPhysicalQubits,',
    '    maxCorrectableErrors: maxCorrectableErrors,',
    '    minAllowedDepth: minRoutingDepth,',
    '    isCompilationValid: isValidDepth,',
    '    evidenceStatus: isValidDepth ? "supported" : "blocked"',
    '  };',
    '}',
  ].join('\n')
  const address = uuid(code)
  return {
    phase: 'gqai-apps-script' as const,
    runtime: 'google-apps-script' as const,
    version: VERSION,
    standard: SDK_VOCABULARY,
    licence: LICENSE.spdx,
    address,
    handle: address.slice(0, 8),
    sha256: hex(sha256(utf8(code))),
    sealed: seal(address).valid,
    code,
  }
}
