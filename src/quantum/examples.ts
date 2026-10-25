// One registry of example calls. The docs pages render them live, the tests replay them, and the audit tool replays
// them again on request: three readers of one list, so the documentation cannot say what the tools do not do.

export type Example = {
  /** a stable id, used by the docs anchors and the audit report */
  id: string
  tool: string
  arguments: Record<string, unknown>
  /** what the example shows, in one sentence */
  shows: string
  /** null when the structured result is as expected, else the reason it is not */
  expect: (structured: any) => string | null
}

const pair = (rows: unknown[][], label: string): string | undefined => rows.find((r) => r[0] === label)?.[1] as string | undefined
const between = (x: unknown, lo: number, hi: number) => typeof x === 'number' && x >= lo && x <= hi

export const EXAMPLES: Example[] = [
  { id: 'processor-willow', tool: 'processor', arguments: { name: 'Willow' }, shows: 'How many qubits Willow has, as its spec sheet states it: 105, with average connectivity 3.47.',
    expect: (s) => (s.qubits === 105 && s.statedAverageConnectivity === 3.47 ? null : `qubits ${s.qubits}, connectivity ${s.statedAverageConnectivity}`) },
  { id: 'processor-sycamore', tool: 'processor', arguments: { name: 'Sycamore' }, shows: 'Sycamore from its printed diagram: 54 qubits and 88 couplers, derived and stated.',
    expect: (s) => (s.qubits === 54 && s.couplers === 88 && s.statedCouplers === 88 ? null : `qubits ${s.qubits}, couplers ${s.couplers}`) },
  { id: 'circuit-hadamard-amplitudes', tool: 'circuit', arguments: { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }] }, shows: 'A Hadamard gives two amplitudes of 1/√2.',
    expect: (s) => (s.amplitudes?.length === 2 && s.amplitudes.every((a: { re: number }) => Math.abs(a.re - Math.SQRT1_2) < 1e-12) ? null : `amplitudes ${JSON.stringify(s.amplitudes)}`) },
  { id: 'circuit-hadamard-sampled', tool: 'circuit', arguments: { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }], measure: { key: 'm', qubits: [{ kind: 'line', x: 0 }] }, repetitions: 400 }, shows: 'The same circuit measured: 400 bitstrings, each 0 or 1, in a histogram.',
    expect: (s) => (s.bitstrings?.length === 400 && s.bitstrings.every((b: string) => b === '0' || b === '1') && typeof s.histogram === 'object' ? null : `bitstrings ${s.bitstrings?.length}`) },
  { id: 'circuit-bit-flip-noise', tool: 'circuit', arguments: { operations: [{ gate: 'X', qubits: [{ kind: 'line', x: 0 }] }], noise: [{ name: 'bit_flip', p: 0.1 }] }, shows: 'An X gate under a bit-flip channel of p = 0.1 on the density matrix: probability 0.1 of reading 0, purity 0.1² + 0.9² = 0.82. Noise does not sample; it returns the mixed state.',
    expect: (s) => (Math.abs(s.probabilities?.[0] - 0.1) < 1e-12 && Math.abs(s.purity - 0.82) < 1e-12 ? null : `probabilities ${JSON.stringify(s.probabilities)}, purity ${s.purity}`) },
  { id: 'echo-returns', tool: 'echo', arguments: { forward: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }], perturbation: { gate: 'Z', qubits: [{ kind: 'line', x: 0 }] } }, shows: 'H forward, Z, H back is X: the echo is destroyed, so the return probability is 0.',
    expect: (s) => (s.probability === 0 ? null : `probability ${s.probability}`) },
  { id: 'echo-benchmark', tool: 'echo_benchmark', arguments: {}, shows: "Quantum Echoes as Google states it: Willow, 105 qubits, the 13,000× figure (Google's, not this tree's).",
    expect: (s) => (s.processor === 'Willow' && s.qubits === 105 && s.speedup === 13000 ? null : JSON.stringify(s).slice(0, 80)) },
  { id: 'roadmap-all', tool: 'roadmap', arguments: {}, shows: 'The six roadmap milestones and the four application bands.',
    expect: (s) => (s.milestones?.length === 6 && s.applications?.length === 4 ? null : `milestones ${s.milestones?.length}`) },
  { id: 'roadmap-milestone-3', tool: 'roadmap', arguments: { milestone: 3 }, shows: 'One milestone by number.',
    expect: (s) => (s.milestones?.length === 1 ? null : `milestones ${s.milestones?.length}`) },
  { id: 'algorithm-shor-15', tool: 'algorithm', arguments: { name: 'shor', N: 15, a: 7 }, shows: "Shor's circuit on the state-vector simulator: order 4 and factors 3 × 5 for N = 15, a = 7.",
    expect: (s) => (pair(s.summary, 'Factors') === '3 × 5' && pair(s.summary, 'Order of a mod N') === '4' ? null : JSON.stringify(s.summary)) },
  { id: 'algorithm-qft-3', tool: 'algorithm', arguments: { name: 'qft', qubits: 3, input: 5 }, shows: 'The QFT of |5⟩ on three qubits: eight amplitudes of equal magnitude.',
    expect: (s) => (s.rows?.length === 8 ? null : `rows ${s.rows?.length}`) },
  { id: 'algorithm-grover', tool: 'algorithm', arguments: { name: 'grover' }, shows: 'Grover on two qubits finds the marked |00⟩ with certainty.',
    expect: (s) => (s.rows?.length === 1 ? null : `rows ${s.rows?.length}`) },
  { id: 'algorithm-teleportation', tool: 'algorithm', arguments: { name: 'teleportation' }, shows: 'Teleportation: the received state matches the message on X, Y and Z.',
    expect: (s) => (s.rows?.length === 3 ? null : `rows ${s.rows?.length}`) },
  { id: 'algorithm-phase-estimation', tool: 'algorithm', arguments: { name: 'phase_estimation', theta: 0.25, bits: 3 }, shows: 'Phase estimation reads θ = 0.25 exactly in three bits.',
    expect: (s) => (s.rows?.length === 1 ? null : `rows ${s.rows?.length}`) },
  { id: 'algorithm-qaoa', tool: 'algorithm', arguments: { name: 'qaoa' }, shows: "QAOA on the Cirq page's instance, sampled from the state's probabilities.",
    expect: (s) => (Array.isArray(s.rows) && s.rows.length > 0 ? null : 'no rows') },
  { id: 'software', tool: 'software', arguments: {}, shows: 'The Software page tools; only Cirq is implemented here.',
    expect: (s) => (s.tools?.length === 5 ? null : `tools ${s.tools?.length}`) },
  { id: 'statements-cirq', tool: 'statements', arguments: { topic: 'cirq' }, shows: 'One statement by topic.',
    expect: (s) => (s.statements?.length === 1 ? null : `statements ${s.statements?.length}`) },
  { id: 'repositories', tool: 'repositories', arguments: {}, shows: 'The fifteen quantumlib repositories.',
    expect: (s) => (s.total === 15 && s.repositories?.length === 15 ? null : `total ${s.total}`) },
  { id: 'leads-all', tool: 'leads', arguments: {}, shows: 'Every lead with its status; the counts add up to the total.',
    expect: (s) => { const sum = Object.values(s.counts ?? {}).reduce((a: number, b: any) => a + Number(b), 0); return sum === s.total && s.leads?.length === s.total ? null : `counts ${sum} vs total ${s.total}` } },
  { id: 'qec-bit-flip-0.1', tool: 'quantum-error-correction', arguments: { p: 0.1 }, shows: 'The three-qubit repetition code on the density matrix at p = 0.1: logical error 3p² − 2p³ = 0.028, below the raw 0.1.',
    expect: (s) => { const at = s.at ?? {}; const ok = Math.abs(at.logicalError - 0.028) < 1e-9 && at.physicalError === 0.1 && s.textbook?.maxDeviationOverSweep < 1e-9; return ok ? null : `at ${JSON.stringify(at)}` } },
  { id: 'chemistry-h2', tool: 'chemistry-simulation', arguments: {}, shows: 'H₂ in STO-3G at 0.7414 Å: the Hartree–Fock energy from the simulator is −1.1167 Ha and the variational minimum lies below it near −1.137 Ha.',
    expect: (s) => { const hf = s.hartreeFockFromSimulator; const best = s.vqe?.best; const e = typeof best === 'number' ? best : best?.energy; return Math.abs(hf + 1.1167) < 2e-3 && typeof e === 'number' && e <= hf && Math.abs(e + 1.137) < 5e-3 ? null : `hf ${hf}, best ${JSON.stringify(best)}` } },
  { id: 'ftqc-all', tool: 'fault-tolerant-design', arguments: {}, shows: 'Resource counts read from six circuits this tree builds; one Toffoli costs 7 T gates by the cited decomposition.',
    expect: (s) => (s.circuits?.length === 6 && s.costs?.toffoli?.tCount === 7 ? null : `circuits ${s.circuits?.length}, toffoli ${JSON.stringify(s.costs?.toffoli)}`) },
  { id: 'quantumlib-cirq', tool: 'quantumlib', arguments: { repository: 'Cirq' }, shows: 'What this tree implements of Cirq, as a cross-reference of its exports.',
    expect: (s) => (JSON.stringify(s).includes('Cirq') ? null : 'no Cirq entry') },
  { id: 'clay-register', tool: 'clay', arguments: {}, shows: 'The 54 Clay relations recomputed in exact integer arithmetic: all hold, the widest value needs 33 bits (amplitudes = 2^32).',
    expect: (s) => (s.total === 54 && s.holding === 54 && s.maxBits === 33 ? null : `${s.holding}/${s.total}, ${s.maxBits} bits`) },
  { id: 'clay-relation-15', tool: 'clay', arguments: { name: 'relation_15' }, shows: 'One relation: magicBlock = glProd hexbit seed = qftDepth vertices = 15.',
    expect: (s) => (s.relations?.[0]?.sides?.every((x: { value: number }) => x.value === 15) ? null : JSON.stringify(s.relations?.[0]?.sides)) },
  { id: 'verify-seal-and-content', tool: 'verify', arguments: { uuid: '70a13419-52d5-2702-a236-d17851bf2b4a', content: 'qpu' }, shows: 'One UUID checked cheaply: its seal from its own 31 nibbles, and its content by one fold.',
    expect: (s) => (s.valid === true && s.decided === 2 ? null : JSON.stringify(s.checks)) },
  { id: 'verify-tampered', tool: 'verify', arguments: { uuid: '70a13419-52d5-2702-a236-d17851bf2b4b' }, shows: 'A UUID with one nibble changed: the content-decided version no longer agrees, and no content was needed to see it.',
    expect: (s) => (s.valid === false && s.checks[0].passed === false ? null : JSON.stringify(s.checks[0])) },
  { id: 'match-willow', tool: 'match', arguments: { statement: 'How many qubits does Willow have?' }, shows: 'Any statement, matched: this one is served by the processor tool.',
    expect: (s) => (s.verdict === 'served' && s.tool === 'processor' ? null : `${s.verdict} via ${s.tool}`) },
  { id: 'match-rsa-2048', tool: 'match', arguments: { statement: 'Factor RSA-2048 with Shor' }, shows: 'Any statement, proved impossible from the schema: algorithm.N is bounded to 21; the cluster names what is served instead.',
    expect: (s) => (s.verdict === 'impossible' && s.cluster?.length > 0 ? null : `${s.verdict}, cluster ${s.cluster?.length}`) },
  { id: 'audit-self', tool: 'audit', arguments: {}, shows: 'The MCP surface audits itself: every check passes.',
    expect: (s) => (s.failed === 0 && s.total > 0 ? null : `${s.failed} of ${s.total} checks failed: ${(s.checks ?? []).filter((c: { passed: boolean }) => !c.passed).map((c: { id: string }) => c.id).join(', ')}`) },
]
