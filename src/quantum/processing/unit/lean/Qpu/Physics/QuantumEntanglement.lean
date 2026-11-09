import Qpu.Processing.QuantumGate

/-! # Qpu.Physics.QuantumEntanglement
---
component: quantum entanglement (ISO/IEC 4879:2024 3.2.10)
---
Entangled states in exact amplitudes, and the test that separates them from definite values. The Bell state is supported on
exactly 00 and 11 and the GHZ state on exactly 000 and 111, each with equal weight. Every assignment of definite ±1 values to a CHSH
test gives |S| = 2, while the Bell state gives S² = 8, beyond the bound. A register shows quantum-mechanical behaviour (ISO/IEC
4879:2024, introduction) when its measured outcomes violate this bound; registers whose contents are definite bits compute these
numbers without showing them. -/

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
