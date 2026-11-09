/-! # Qpu.Blueprint.Gates
---
component: gate set
---
The processor's gates as exact matrices over the Gaussian integers, never floats. Hadamard is kept unscaled, so its unitarity
reads `H · H† = 2 · I`; the other gates are exact unitaries, `U · U† = I`. Clifford closure is stated on the generators: conjugating
a Pauli by H, S or CNOT lands on a Pauli (up to the factor H carries and a sign). -/

namespace Blueprint

/-- a Gaussian integer `re + im·i` -/
structure GI where
  re : Int
  im : Int
deriving DecidableEq, Repr

namespace GI
instance (n : Nat) : OfNat GI n := ⟨⟨n, 0⟩⟩
instance : Add GI := ⟨fun a b => ⟨a.re + b.re, a.im + b.im⟩⟩
instance : Neg GI := ⟨fun a => ⟨-a.re, -a.im⟩⟩
instance : Mul GI := ⟨fun a b => ⟨a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re⟩⟩
/-- the imaginary unit -/
def i : GI := ⟨0, 1⟩
/-- the complex conjugate -/
def conj (a : GI) : GI := ⟨a.re, -a.im⟩
/-- the squared modulus: a measurement weight -/
def normSq (a : GI) : Int := a.re * a.re + a.im * a.im
end GI

/-- a matrix, read on the indices below its dimension -/
abbrev Mat := Nat → Nat → GI

/-- the sum of `f k` for `k < n` -/
def sumTo (n : Nat) (f : Nat → GI) : GI := (List.range n).foldl (fun acc k => acc + f k) 0

/-- the product of two `n × n` matrices -/
def mm (n : Nat) (a b : Mat) : Mat := fun r c => sumTo n fun k => a r k * b k c
/-- the conjugate transpose -/
def dag (a : Mat) : Mat := fun r c => GI.conj (a c r)
/-- the identity -/
def idm : Mat := fun r c => if r = c then 1 else 0
/-- a scalar times a matrix -/
def smul (k : GI) (a : Mat) : Mat := fun r c => k * a r c
/-- the Kronecker product of `a` with an `m × m` matrix `b` -/
def kron (m : Nat) (a b : Mat) : Mat := fun r c => a (r / m) (c / m) * b (r % m) (c % m)
/-- the permutation matrix sending basis state `c` to `p c` -/
def perm (p : Nat → Nat) : Mat := fun r c => if r = p c then 1 else 0

/-- two matrices agree on every entry below `n` -/
def Same (n : Nat) (a b : Mat) : Prop := ∀ r, r < n → ∀ c, c < n → a r c = b r c
instance (n : Nat) (a b : Mat) : Decidable (Same n a b) := by unfold Same; infer_instance

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
theorem gate_h_unitary : Same 2 (mm 2 H (dag H)) (smul 2 idm) := by decide
/-- Hadamard squared is twice the identity: H · H = 2 · I -/
theorem gate_h_squared : Same 2 (mm 2 H H) (smul 2 idm) := by decide
/-- X, Z and S are unitary: U · U† = I -/
theorem gate_paulis_unitary : Same 2 (mm 2 X (dag X)) idm ∧ Same 2 (mm 2 Z (dag Z)) idm ∧ Same 2 (mm 2 S (dag S)) idm := by decide
/-- S squared is Z -/
theorem gate_s_squared : Same 2 (mm 2 S S) Z := by decide
/-- CNOT is unitary and its own inverse: CNOT · CNOT† = I and CNOT · CNOT = I -/
theorem gate_cnot : Same 4 (mm 4 CNOT (dag CNOT)) idm ∧ Same 4 (mm 4 CNOT CNOT) idm := by decide
/-- SWAP is unitary and its own inverse -/
theorem gate_swap : Same 4 (mm 4 SWAP (dag SWAP)) idm ∧ Same 4 (mm 4 SWAP SWAP) idm := by decide
/-- Toffoli is unitary and its own inverse -/
theorem gate_toffoli : Same 8 (mm 8 TOFFOLI (dag TOFFOLI)) idm ∧ Same 8 (mm 8 TOFFOLI TOFFOLI) idm := by decide +kernel

/-- one-qubit Clifford closure: H sends X ↔ Z and Y to −Y (times its scale 2), S sends X to Y, Y to −X and keeps Z -/
theorem gate_clifford_1q :
    Same 2 (mm 2 (mm 2 H X) (dag H)) (smul 2 Z) ∧ Same 2 (mm 2 (mm 2 H Z) (dag H)) (smul 2 X) ∧
    Same 2 (mm 2 (mm 2 H Y) (dag H)) (smul (-2) Y) ∧ Same 2 (mm 2 (mm 2 S X) (dag S)) Y ∧
    Same 2 (mm 2 (mm 2 S Y) (dag S)) (smul (-1) X) ∧ Same 2 (mm 2 (mm 2 S Z) (dag S)) Z := by decide

/-- two-qubit Clifford closure: CNOT copies X from control to target and Z from target to control, and keeps the others -/
theorem gate_clifford_2q :
    Same 4 (mm 4 (mm 4 CNOT (kron 2 X idm)) CNOT) (kron 2 X X) ∧ Same 4 (mm 4 (mm 4 CNOT (kron 2 idm X)) CNOT) (kron 2 idm X) ∧
    Same 4 (mm 4 (mm 4 CNOT (kron 2 Z idm)) CNOT) (kron 2 Z idm) ∧ Same 4 (mm 4 (mm 4 CNOT (kron 2 idm Z)) CNOT) (kron 2 Z Z) := by
  decide +kernel

end Blueprint
