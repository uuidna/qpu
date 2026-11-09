import Qpu.Processing.QuantumGate

/-! # Qpu.Processing.CircuitBasedQuantumComputing
---
component: circuit-based quantum computing (ISO/IEC 4879:2024 3.4.13)
---
The exact computation of Clifford circuits (Gottesman–Knill): a circuit of H, S and CNOT is computed on Pauli strings, never on the
2^n amplitudes. A two-qubit Pauli string is a phase `i^k` and an (x, z) bit pair per qubit, its matrix `i^k · P(x₀, z₀) ⊗ P(x₁, z₁)`
with `P(x, z) = i^(x·z) · X^x · Z^z`, so `P(1, 1)` is the gate set's `Y`. The tableau rules a stabilizer computation applies
(Aaronson–Gottesman) are proved equal to the exact conjugation of that matrix by the gate, for all 64 strings: H swaps x and z and
flips the sign of Y, S adds x to z and flips the sign of Y, CNOT copies x from control to target and z from target to control with
the sign `x_c · z_t · (x_t = z_c)`. Hadamard is unscaled, so its conjugation carries the factor 2. -/

namespace CircuitBasedQuantumComputing
open HilbertSpace Operator QuantumGate

/-- a two-qubit Pauli string: the phase `i^k` and the (x, z) bits of the high qubit 0 and the low qubit 1 -/
structure Pauli2 where
  k : Nat
  x0 : Bool
  z0 : Bool
  x1 : Bool
  z1 : Bool

/-- `i^k` -/
def ipow : Nat → GI
  | 0 => 1
  | k + 1 => GI.i * ipow k

/-- the one-qubit Pauli `P(x, z) = i^(x·z) · X^x · Z^z` -/
def pauli (x z : Bool) : Mat := match x, z with
  | false, false => idm
  | true, false => X
  | false, true => Z
  | true, true => Y

/-- the matrix of a Pauli string -/
def Pauli2.mat (p : Pauli2) : Mat := smul (ipow p.k) (kron 2 (pauli p.x0 p.z0) (pauli p.x1 p.z1))

/-- the sign flip the rule adds: `i^2 = −1` when `b` holds -/
def signFlip (k : Nat) (b : Bool) : Nat := (k + if b then 2 else 0) % 4

/-- the tableau rule of H on qubit 0 -/
def ruleH0 (p : Pauli2) : Pauli2 := ⟨signFlip p.k (p.x0 && p.z0), p.z0, p.x0, p.x1, p.z1⟩
/-- the tableau rule of H on qubit 1 -/
def ruleH1 (p : Pauli2) : Pauli2 := ⟨signFlip p.k (p.x1 && p.z1), p.x0, p.z0, p.z1, p.x1⟩
/-- the tableau rule of S on qubit 0 -/
def ruleS0 (p : Pauli2) : Pauli2 := ⟨signFlip p.k (p.x0 && p.z0), p.x0, p.z0 != p.x0, p.x1, p.z1⟩
/-- the tableau rule of S on qubit 1 -/
def ruleS1 (p : Pauli2) : Pauli2 := ⟨signFlip p.k (p.x1 && p.z1), p.x0, p.z0, p.x1, p.z1 != p.x1⟩
/-- the tableau rule of CNOT, control qubit 0, target qubit 1 -/
def ruleCNOT (p : Pauli2) : Pauli2 := ⟨signFlip p.k (p.x0 && p.z1 && (p.x1 == p.z0)), p.x0, p.z0 != p.z1, p.x1 != p.x0, p.z1⟩

/-- the gate `u` conjugating the string `p` equals `scale` times the string the rule gives -/
def Exact (u : Mat) (rule : Pauli2 → Pauli2) (scale : GI) : Prop :=
  ∀ k, k < 4 → ∀ x0 z0 x1 z1 : Bool, Same 4 (mm 4 (mm 4 u (Pauli2.mat ⟨k, x0, z0, x1, z1⟩)) (dag u)) (smul scale (rule ⟨k, x0, z0, x1, z1⟩).mat)
instance (u : Mat) (rule : Pauli2 → Pauli2) (scale : GI) : Decidable (Exact u rule scale) := by unfold Exact; infer_instance

/-- H on either qubit acts on every Pauli string exactly as its tableau rule says (times the factor 2 its scale carries) -/
theorem stabilizer_hadamard : Exact (kron 2 H idm) ruleH0 2 ∧ Exact (kron 2 idm H) ruleH1 2 := by decide +kernel
/-- S on either qubit acts on every Pauli string exactly as its tableau rule says -/
theorem stabilizer_phase : Exact (kron 2 S idm) ruleS0 1 ∧ Exact (kron 2 idm S) ruleS1 1 := by decide +kernel
/-- CNOT acts on every Pauli string exactly as its tableau rule says -/
theorem stabilizer_cnot : Exact CNOT ruleCNOT 1 := by decide +kernel

end CircuitBasedQuantumComputing
