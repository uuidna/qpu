import Qpu.Physics.Operator

/-! # Qpu.Processing.QuantumGate
---
component: quantum gate (ISO/IEC 4879:2024 3.4.2, 3.4.3 unitary gate)
---
The processor's gates as exact unitary matrices, never floats. Hadamard is kept unscaled, so its unitarity reads `H · H† = 2 · I`;
X, Z, S, CNOT, SWAP and Toffoli are exact unitaries, `U · U† = I`. The T gate lives over ℤ[ω], ω the eighth root of unity: it is
unitary, has order 8 and does not commute with Hadamard, so H, S, CNOT and T are a universal set. Clifford closure is stated on
the generators: conjugating a Pauli by H, S or CNOT lands on a Pauli, up to the factor H carries and a sign. -/

namespace QuantumGate
open HilbertSpace Operator

/-- Hadamard, unscaled: [[1, 1], [1, −1]] -/
def H : Mat := fun r c => if r = 1 ∧ c = 1 then -1 else 1
/-- Pauli X: the bit flip -/
def X : Mat := perm fun c => 1 - c
/-- Pauli Z: the phase flip -/
def Z : Mat := fun r c => if r = c then (if r = 0 then 1 else -1) else 0
/-- Pauli Y = i·X·Z -/
def Y : Mat := smul GI.i (mm 2 X Z)
/-- the phase gate S = diag(1, i) -/
def S : Mat := fun r c => if r = c then (if r = 0 then 1 else GI.i) else 0
/-- CNOT on two qubits, the control the high bit: |c t⟩ ↦ |c, t ⊕ c⟩ -/
def CNOT : Mat := perm fun c => if c = 2 then 3 else if c = 3 then 2 else c
/-- SWAP on two qubits -/
def SWAP : Mat := perm fun c => if c = 1 then 2 else if c = 2 then 1 else c
/-- Toffoli on three qubits: the low bit flips when both high bits are set -/
def TOFFOLI : Mat := perm fun c => if c = 6 then 7 else if c = 7 then 6 else c

/-- Hadamard is unitary up to its scale: H · H† = 2 · I -/
theorem h_unitary : Same 2 (mm 2 H (dag H)) (smul 2 idm) := by decide
/-- Hadamard squared is twice the identity: H · H = 2 · I -/
theorem h_squared : Same 2 (mm 2 H H) (smul 2 idm) := by decide
/-- X, Z and S are unitary: U · U† = I -/
theorem paulis_unitary : Same 2 (mm 2 X (dag X)) idm ∧ Same 2 (mm 2 Z (dag Z)) idm ∧ Same 2 (mm 2 S (dag S)) idm := by decide
/-- S squared is Z -/
theorem s_squared : Same 2 (mm 2 S S) Z := by decide
/-- CNOT is unitary and its own inverse: CNOT · CNOT† = I and CNOT · CNOT = I -/
theorem cnot : Same 4 (mm 4 CNOT (dag CNOT)) idm ∧ Same 4 (mm 4 CNOT CNOT) idm := by decide
/-- SWAP is unitary and its own inverse -/
theorem swap : Same 4 (mm 4 SWAP (dag SWAP)) idm ∧ Same 4 (mm 4 SWAP SWAP) idm := by decide
/-- Toffoli is unitary and its own inverse -/
theorem toffoli : Same 8 (mm 8 TOFFOLI (dag TOFFOLI)) idm ∧ Same 8 (mm 8 TOFFOLI TOFFOLI) idm := by decide +kernel

/-- one-qubit Clifford closure: H sends X ↔ Z and Y to −Y (times its scale 2), S sends X to Y, Y to −X and keeps Z -/
theorem clifford_1q :
    Same 2 (mm 2 (mm 2 H X) (dag H)) (smul 2 Z) ∧ Same 2 (mm 2 (mm 2 H Z) (dag H)) (smul 2 X) ∧
    Same 2 (mm 2 (mm 2 H Y) (dag H)) (smul (-2) Y) ∧ Same 2 (mm 2 (mm 2 S X) (dag S)) Y ∧
    Same 2 (mm 2 (mm 2 S Y) (dag S)) (smul (-1) X) ∧ Same 2 (mm 2 (mm 2 S Z) (dag S)) Z := by decide

/-- two-qubit Clifford closure: CNOT copies X from control to target and Z from target to control, and keeps the others -/
theorem clifford_2q :
    Same 4 (mm 4 (mm 4 CNOT (kron 2 X idm)) CNOT) (kron 2 X X) ∧ Same 4 (mm 4 (mm 4 CNOT (kron 2 idm X)) CNOT) (kron 2 idm X) ∧
    Same 4 (mm 4 (mm 4 CNOT (kron 2 Z idm)) CNOT) (kron 2 Z idm) ∧ Same 4 (mm 4 (mm 4 CNOT (kron 2 idm Z)) CNOT) (kron 2 Z Z) := by
  decide +kernel

/-- an element `a₀ + a₁ω + a₂ω² + a₃ω³` of ℤ[ω], ω⁴ = −1 -/
structure ZW where
  a0 : Int
  a1 : Int
  a2 : Int
  a3 : Int
deriving DecidableEq, Repr

namespace ZW
instance (n : Nat) : OfNat ZW n := ⟨⟨n, 0, 0, 0⟩⟩
instance : Add ZW := ⟨fun x y => ⟨x.a0 + y.a0, x.a1 + y.a1, x.a2 + y.a2, x.a3 + y.a3⟩⟩
instance : Neg ZW := ⟨fun x => ⟨-x.a0, -x.a1, -x.a2, -x.a3⟩⟩
/-- the product, reduced by ω⁴ = −1 -/
instance : Mul ZW := ⟨fun x y =>
  ⟨x.a0 * y.a0 - x.a1 * y.a3 - x.a2 * y.a2 - x.a3 * y.a1,
   x.a0 * y.a1 + x.a1 * y.a0 - x.a2 * y.a3 - x.a3 * y.a2,
   x.a0 * y.a2 + x.a1 * y.a1 + x.a2 * y.a0 - x.a3 * y.a3,
   x.a0 * y.a3 + x.a1 * y.a2 + x.a2 * y.a1 + x.a3 * y.a0⟩⟩
/-- ω, the eighth root of unity -/
def ω : ZW := ⟨0, 1, 0, 0⟩
/-- the complex conjugate: ω̄ = ω⁻¹ = −ω³ -/
def conj (x : ZW) : ZW := ⟨x.a0, -x.a3, -x.a2, -x.a1⟩
end ZW

/-- a 2 × 2 matrix over ℤ[ω] -/
abbrev MatW := Nat → Nat → ZW
/-- the product of two 2 × 2 matrices -/
def mmW (a b : MatW) : MatW := fun r c => a r 0 * b 0 c + a r 1 * b 1 c
/-- the conjugate transpose -/
def dagW (a : MatW) : MatW := fun r c => ZW.conj (a c r)
/-- the identity -/
def idW : MatW := fun r c => if r = c then 1 else 0
/-- two matrices agree on their four entries -/
def SameW (a b : MatW) : Prop := ∀ r, r < 2 → ∀ c, c < 2 → a r c = b r c
instance (a b : MatW) : Decidable (SameW a b) := by unfold SameW; infer_instance
/-- the `k`-th power -/
def powW (a : MatW) : Nat → MatW
  | 0 => idW
  | k + 1 => mmW a (powW a k)

/-- the T gate diag(1, ω) -/
def TW : MatW := fun r c => if r = c then (if r = 0 then 1 else ZW.ω) else 0
/-- Hadamard over ℤ[ω], unscaled -/
def HW : MatW := fun r c => if r = 1 ∧ c = 1 then -1 else 1

/-- T is unitary, has order 8 (T⁸ = I and T⁴ ≠ I) and does not commute with Hadamard -/
theorem t_gate :
    SameW (mmW TW (dagW TW)) idW ∧ SameW (powW TW 8) idW ∧ ¬ SameW (powW TW 4) idW ∧ ¬ SameW (mmW HW TW) (mmW TW HW) := by
  decide

end QuantumGate
