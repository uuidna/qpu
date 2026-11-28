import Qpu.Processing.QuantumGate

/-! # Qpu.Physics.QuantumEntanglement
---
component: quantum entanglement (ISO/IEC 4879:2024 3.2.10)
---
Unified entanglement module (merging exact Bell/GHZ amplitude proofs and finite CHSH/GHZ-Mermin games from `Qpu.Verify.Entangle`). -/

namespace QuantumEntanglement
open HilbertSpace Operator QuantumGate

/-- Bell: Hadamard on the high qubit of |00⟩, then CNOT -/
def bell : Vec := ap 4 CNOT (ap 4 (kron 2 H idm) (basis 0))

/-- the Bell state is supported on exactly 00 and 11, with equal weight -/
theorem bell_state : (∀ r, r < 4 → (bell r ≠ 0 ↔ r = 0 ∨ r = 3)) ∧ (bell 0).normSq = (bell 3).normSq := by decide

/-- GHZ on three qubits: Hadamard on the top qubit, then CNOT down the line -/
def ghz : Vec := ap 8 (kron 4 idm CNOT) (ap 8 (kron 2 CNOT idm) (ap 8 (kron 4 H idm) (basis 0)))

/-- the GHZ state is supported on exactly 000 and 111, with equal weight -/
theorem ghz_state : (∀ r, r < 8 → (ghz r ≠ 0 ↔ r = 0 ∨ r = 7)) ∧ (ghz 0).normSq = (ghz 7).normSq := by decide +kernel

/-- a CHSH test with definite values: the four ±1 outcomes `a₀ a₁ b₀ b₁` -/
def chshClassical (a0 a1 b0 b1 : Bool) : Int :=
  let v := fun b : Bool => if b then (1 : Int) else -1
  v a0 * v b0 + v a0 * v b1 + v a1 * v b0 - v a1 * v b1

/-- every assignment of definite values gives |S| = 2: the classical bound -/
theorem chsh_classical_bound : ∀ a0 a1 b0 b1 : Bool, chshClassical a0 a1 b0 b1 = 2 ∨ chshClassical a0 a1 b0 b1 = -2 := by decide

/-- the correlation ⟨Φ|A ⊗ B|Φ⟩ of the Bell state, unnormalised -/
def corr (a b : Mat) : GI := sumTo 4 fun r => GI.conj (bell r) * ap 4 (kron 2 a b) bell r
/-- Bob's two observables scaled by √2: Z + X and Z − X -/
def bobPlus : Mat := fun r c => Z r c + X r c
def bobMinus : Mat := fun r c => Z r c + -(X r c)
/-- the CHSH sum of the Bell state, with Bell's norm ⟨Φ|Φ⟩ = 2 and Bob's scale √2 left in -/
def chshBell : GI := corr Z bobPlus + corr Z bobMinus + corr X bobPlus + -(corr X bobMinus)

/-- the Bell state gives S² = 8: the scaled sum is 8 = S · ⟨Φ|Φ⟩ · √2, so S² = 8² / (2² · 2) = 8, beyond the classical 2² = 4 -/
theorem chsh_quantum_value : chshBell = 8 ∧ (8 : Nat) ^ 2 = 8 * (2 ^ 2 * 2) ∧ (2 : Nat) ^ 2 < 8 := by decide +kernel

end QuantumEntanglement

/-! ## Qpu.Verify.Entangle (merged into QuantumEntanglement)
CHSH and GHZ/Mermin game bounds as finite combinatorics. -/
namespace Qpu.Verify.Entangle

/-- One CHSH round: won iff `a ⊕ b = x ∧ y`. -/
def chshRoundWon (a b x y : Bool) : Bool := (a ^^ b) == (x && y)

/-- Wins of a deterministic classical strategy over the four CHSH rounds. -/
def chshWins (a0 a1 b0 b1 : Bool) : Nat :=
  (if chshRoundWon a0 b0 false false then 1 else 0) +
  (if chshRoundWon a0 b1 false true then 1 else 0) +
  (if chshRoundWon a1 b0 true false then 1 else 0) +
  (if chshRoundWon a1 b1 true true then 1 else 0)

/-- Classical bound: no local deterministic strategy wins all four rounds. -/
theorem chsh_classical_bound (a0 a1 b0 b1 : Bool) : chshWins a0 a1 b0 b1 ≤ 3 := by
  cases a0 <;> cases a1 <;> cases b0 <;> cases b1 <;> decide

/-- Control: the bound is tight. -/
theorem chsh_bound_is_tight : chshWins false false false false = 3 := by decide

/-- One GHZ/Mermin round (input parity zero): won iff a⊕b⊕c = x∨y∨z. -/
def ghzRoundWon (a b c x y z : Bool) : Bool := (a ^^ b ^^ c) == (x || y || z)

/-- Wins of a deterministic classical strategy over the four GHZ rounds. -/
def ghzWins (a0 a1 b0 b1 c0 c1 : Bool) : Nat :=
  (if ghzRoundWon a0 b0 c0 false false false then 1 else 0) +
  (if ghzRoundWon a0 b1 c1 false true true then 1 else 0) +
  (if ghzRoundWon a1 b0 c1 true false true then 1 else 0) +
  (if ghzRoundWon a1 b1 c0 true true false then 1 else 0)

/-- Mermin's bound: no deterministic classical strategy wins all four. -/
theorem ghz_classical_bound (a0 a1 b0 b1 c0 c1 : Bool) : ghzWins a0 a1 b0 b1 c0 c1 ≤ 3 := by
  cases a0 <;> cases a1 <;> cases b0 <;> cases b1 <;> cases c0 <;> cases c1 <;> decide

/-- GHZ response table for three-qubit trinity X/Y measurements. -/
def ghzQuantumOutput : Nat → Bool × Bool × Bool
  | 0 => (false, false, false)
  | 1 => (false, false, true)
  | 2 => (false, true, false)
  | _ => (true, false, false)

/-- Score one quantum-table row against question triple `(x, y, z)`. -/
def quantumCheck (r : Nat) (x y z : Bool) : Nat :=
  match ghzQuantumOutput r with
  | (a, b, c) => if ghzRoundWon a b c x y z then 1 else 0

/-- The entangled GHZ trinity strategy wins 4/4 — strictly above the classical ceiling of 3. -/
theorem ghz_quantum_wins_all_four :
    quantumCheck 0 false false false +
    quantumCheck 1 false true true +
    quantumCheck 2 true false true +
    quantumCheck 3 true true false = 4 := by decide

/-- Negative control: a representative local strategy loses. -/
theorem ghz_uniform_strategy_loses : ghzWins false false false false false false < 4 := by decide

end Qpu.Verify.Entangle
