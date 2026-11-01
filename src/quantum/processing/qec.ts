// The three-qubit repetition code, run as a circuit on the density matrix: encode a logical qubit, let a channel act once on
// each data qubit, extract the two syndromes onto ancillas, correct by majority with Toffolis, and decode. Every figure is read
// from the simulated density matrix. The encoding, syndrome and correction gates are noiseless, and the channel acts once on
// each data qubit and nowhere else: the code-capacity model, whose textbook figure for the bit-flip code under bit-flip noise
// is a logical error of 3p² − 2p³ (Nielsen & Chuang, Quantum Computation and Quantum Information, §10.1.1). The simulation is
// compared with that figure; it does not assume it.

import { CNOT, Circuit, DensityMatrixSimulator, H, LineQubit, TOFFOLI, X, applied, noisy, type Channel, type Operation, type Qubit } from './cirq.ts'

/** The two repetition codes: the bit-flip code (|000⟩, |111⟩) and the phase-flip code (|+++⟩, |−−−⟩), its Hadamard conjugate. */
export type RepetitionCode = 'bit_flip' | 'phase_flip'

/** The logical state encoded: a computational or a Hadamard basis state of one qubit. */
export type LogicalState = '0' | '1' | '+' | '-'

/** The operations that prepare one qubit in a logical state from |0⟩. Their reverse, adjoint by adjoint, undoes them; every
 *  gate here is its own adjoint, so the reverse of the list suffices. */
const prepare = (q: Qubit, state: LogicalState): Operation[] => {
  if (state === '0') return []
  if (state === '1') return [applied(X, q)]
  if (state === '+') return [applied(H, q)]
  return [applied(X, q), applied(H, q)]
}

/** The repetition code cycle: prepare the logical state on the first data qubit, encode it onto three, apply the channel once
 *  to each data qubit, extract the syndromes d0⊕d1 and d1⊕d2 onto two ancillas, correct the data qubit the syndrome names with
 *  Toffolis (open controls by X conjugation), decode, and undo the preparation, so that the first data qubit is |0⟩ exactly when
 *  the logical qubit came through. Data qubits are line 0, 1, 2; the ancillas are line 3 and 4. */
export const repetitionCycle = (code: RepetitionCode, channel: Channel, logical: LogicalState = '0'): Circuit => {
  const [d0, d1, d2, a0, a1] = LineQubit.range(5) as [Qubit, Qubit, Qubit, Qubit, Qubit]
  const data = [d0, d1, d2]
  const frame = code === 'phase_flip' ? data.map((q) => applied(H, q)) : []
  const ops: Operation[] = [
    ...prepare(d0, logical),
    applied(CNOT, d0, d1), applied(CNOT, d0, d2),
    ...frame,
    ...data.map((q) => noisy(channel, q)),
    ...frame,
    applied(CNOT, d0, a0), applied(CNOT, d1, a0),
    applied(CNOT, d1, a1), applied(CNOT, d2, a1),
    // syndrome (a0, a1) = (1, 0): d0 flipped; (1, 1): d1 flipped; (0, 1): d2 flipped
    applied(X, a1), applied(TOFFOLI, a0, a1, d0), applied(X, a1),
    applied(TOFFOLI, a0, a1, d1),
    applied(X, a0), applied(TOFFOLI, a0, a1, d2), applied(X, a0),
    applied(CNOT, d0, d2), applied(CNOT, d0, d1),
    ...prepare(d0, logical).reverse(),
  ]
  return new Circuit().append(ops)
}

/** The same logical qubit with no code: prepared, exposed to the channel once, and the preparation undone. */
export const unencodedCycle = (channel: Channel, logical: LogicalState = '0'): Circuit => {
  const q = LineQubit.of(0)
  return new Circuit().append([...prepare(q, logical), noisy(channel, q), ...prepare(q, logical).reverse()])
}

/** The probability that the first qubit (line 0) of a simulated circuit is |1⟩: the sum of the basis probabilities whose
 *  lowest bit is set, since the basis order puts line 0 at bit 0. */
const countErrors = (circuit: Circuit): number => {
  const { probabilities, qubits } = new DensityMatrixSimulator().simulate(circuit)
  const index = qubits.findIndex((q) => q.kind === 'line' && q.x === 0)
  return probabilities.reduce((sum, p, k) => ((k >> index) & 1 ? sum + p : sum), 0)
}

/** A channel of one probability, as the three the code is tried against are named in Cirq. */
export type ErrorChannel = 'bit_flip' | 'phase_flip' | 'depolarize'

export const channelOf = (name: ErrorChannel, p: number): Channel => ({ name, p })

/** One point of the code's performance: the raw error of the unencoded qubit and the logical error after one cycle, both from
 *  the simulated density matrix, at the channel probability p. */
type CodePoint = { p: number; physicalError: number; logicalError: number }

export const codePoint = (code: RepetitionCode, channel: ErrorChannel, p: number, logical: LogicalState = '0'): CodePoint => ({
  p,
  physicalError: countErrors(unencodedCycle(channelOf(channel, p), logical)),
  logicalError: countErrors(repetitionCycle(code, channelOf(channel, p), logical)),
})

/** The textbook figure for the code matched to its channel on a logical |0⟩ or |1⟩: 3p² − 2p³, the probability of two or more
 *  flips among three, each pair of flips acting as the logical X the code cannot see. On |+⟩ or |−⟩ that logical X does nothing,
 *  and for a channel the code is not built for the textbook gives no single formula; in both cases none is claimed. */
export const textbookLogicalError = (code: RepetitionCode, channel: ErrorChannel, logical: LogicalState, p: number): number | null => {
  const matched = ((code === 'bit_flip' && channel === 'bit_flip') || (code === 'phase_flip' && channel === 'phase_flip')) && (logical === '0' || logical === '1')
  return matched ? 3 * p * p - 2 * p * p * p : null
}

/** The break-even probability found from the simulation itself: the p at which the logical error stops being lower than the
 *  physical error, located by bisection between the last sweep point where the code helps and the first where it does not.
 *  Null when the sweep shows no crossing. */
export const getBreakEven = (code: RepetitionCode, channel: ErrorChannel, logical: LogicalState, sweep: readonly CodePoint[]): number | null => {
  const helps = (pt: CodePoint) => pt.logicalError < pt.physicalError
  let lo: number | null = null
  let hi: number | null = null
  for (let i = 1; i < sweep.length; i++) {
    if (helps(sweep[i - 1]!) && !helps(sweep[i]!)) {
      lo = sweep[i - 1]!.p
      hi = sweep[i]!.p
      break
    }
  }
  if (lo === null || hi === null) return null
  let [a, b] = [lo, hi]
  for (let step = 0; step < 50; step++) {
    const mid = (a + b) / 2
    if (helps(codePoint(code, channel, mid, logical))) a = mid
    else b = mid
  }
  return (a + b) / 2
}
