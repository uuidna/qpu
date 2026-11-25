/-! # Qpu.Processing.Qft
Quantum Fourier transform resource counts over the qubit count q, exact Nat: the gate count (a triangular number), the
swap count, the circuit depth and the output dimension. Every law is quantified over q — unlimited qubits — with the
textbook values kept as kernel-decided controls. -/

/-- `choose n k` is the number of `k`-element subsets in an `n`-element set. Also known as binomial
coefficients. For the fact that this is the number of `k`-element-subsets of an `n`-element
set, see `Finset.card_powersetCard`. -/
def qftGates (q : Nat) : Nat := q * (q + 1) / 2
/-- `a / b` computes the result of dividing `a` by `b`.
The meaning of this notation is type-dependent.
* For most types like `Nat`, `Int`, `Rat`, `Real`, `a / 0` is defined to be `0`.
* For `Nat`, `a / b` rounds downwards.
* For `Int`, `a / b` rounds downwards if `b` is positive or upwards if `b` is negative.
  It is implemented as `Int.ediv`, the unique function satisfying
  `a % b + b * (a / b) = a` and `0 ≤ a % b < natAbs b` for `b ≠ 0`.
  Other rounding conventions are available using the functions
  `Int.fdiv` (floor rounding) and `Int.tdiv` (truncation rounding).
* For `Float`, `a / 0` follows the IEEE 754 semantics for division,
  usually resulting in `inf` or `nan`. 

Conventions for notations in identifiers:

 * The recommended spelling of `/` in identifiers is `div`.-/
def qftSwaps (q : Nat) : Nat := q / 2
/-- `a - b` computes the difference of `a` and `b`.
The meaning of this notation is type-dependent.
* For natural numbers, this operator saturates at 0: `a - b = 0` when `a ≤ b`. 

Conventions for notations in identifiers:

 * The recommended spelling of `-` in identifiers is `sub` (when used as a binary operator).-/
def qftDepth (q : Nat) : Nat := 2 * q - 1
/-- `a ^ b` computes `a` to the power of `b`.
The meaning of this notation is type-dependent. 

Conventions for notations in identifiers:

 * The recommended spelling of `^` in identifiers is `pow`.-/
def qftStates (q : Nat) : Nat := 2 ^ q

/-- The output dimension is never zero, for every qubit count. -/
theorem qftStates_pos (q : Nat) : 0 < qftStates q := Nat.pow_pos (Nat.succ_pos 1)

/-- One more qubit doubles the state space, for every q. -/
theorem qftStates_growth (q : Nat) : qftStates (q + 1) = 2 * qftStates q := by
  rw [qftStates, qftStates, Nat.pow_succ, Nat.mul_comm]

/-- The state space strictly grows with every added qubit, at every size. -/
theorem qftStates_strict_growth (q : Nat) : qftStates q < qftStates (q + 1) := by
  rw [qftStates_growth]
  have h := qftStates_pos q
  omega

/-- The triangular recurrence: the QFT on q+1 qubits costs exactly q+1 more gates
    than on q, for every q. -/
theorem qftGates_succ (q : Nat) : qftGates (q + 1) = qftGates q + (q + 1) := by
  rw [qftGates, qftGates]
  rw [show (q + 1) * (q + 1 + 1) = q * (q + 1) + (q + 1) * 2 from by
    rw [Nat.mul_comm (q + 1) (q + 1 + 1), Nat.add_mul (q + 1) 1 (q + 1), Nat.add_mul q 1 (q + 1)]; omega]
  exact Nat.add_mul_div_right _ _ (Nat.succ_pos 1)

/-- Any nonempty register pays at least one gate, for every q ≥ 1. -/
theorem qftGates_pos (q : Nat) (h : 0 < q) : 0 < qftGates q := by
  rw [qftGates]
  have h2 : 1 * 2 ≤ q * (q + 1) := Nat.mul_le_mul h (by omega : 2 ≤ q + 1)
  exact Nat.div_pos h2 (Nat.succ_pos 1)

/-- Swaps never exceed half the register, for every q. -/
theorem qftSwaps_le (q : Nat) : qftSwaps q ≤ q := by
  rw [qftSwaps]
  exact Nat.div_le_self _ _

/-- More qubits never mean fewer swaps, for all register pairs. -/
theorem qftSwaps_monotone {q q' : Nat} (h : q ≤ q') : qftSwaps q ≤ qftSwaps q' := by
  rw [qftSwaps, qftSwaps]
  exact Nat.div_le_div_right h

/-- Depth never shrinks as the register grows, for all register pairs. -/
theorem qftDepth_monotone {q q' : Nat} (h : q ≤ q') : qftDepth q ≤ qftDepth q' := by
  rw [qftDepth, qftDepth]
  omega

/-- The next qubit adds exactly two layers of depth, once the register is
    nonempty — the q = 0 edge, where truncated subtraction fires, is excluded. -/
theorem qftDepth_succ (q : Nat) (h : 0 < q) : qftDepth (q + 1) = qftDepth q + 2 := by
  rw [qftDepth, qftDepth]
  omega

/-- The textbook spot values, decided by the kernel as controls on the general laws. -/
theorem qft_all : qftGates 3 = 6 ∧ qftGates 4 = 10 ∧ qftSwaps 4 = 2 ∧ qftDepth 4 = 7 ∧ qftStates 4 = 16 := ⟨rfl, rfl, rfl, rfl, rfl⟩
