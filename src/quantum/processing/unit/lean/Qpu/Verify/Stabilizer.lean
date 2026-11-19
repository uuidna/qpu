/-
  Qpu.Verify.Stabilizer — Pauli conjugation rules for the Clifford group,
  kernel-checked by `decide` on symplectic (x, z) bits.
-/
namespace Qpu.Verify.Stabilizer

/-- Single-qubit Pauli as symplectic bits: both set means Y. -/
structure P1 where
  x : Bool
  z : Bool
deriving DecidableEq, Repr

/-- Identity Pauli. -/
def pi : P1 := ⟨false, false⟩
/-- Pauli X. -/
def px : P1 := ⟨true, false⟩
/-- Pauli Y. -/
def py : P1 := ⟨true, true⟩
/-- Pauli Z. -/
def pz : P1 := ⟨false, true⟩

/-- Signed Pauli: `true` carries a minus sign. -/
abbrev Signed := Bool × P1

/-- Conjugation by H: X↔Z, Y ↦ −Y. Sign flips exactly when both bits are set. -/
def conjH (p : P1) : Signed := (p.x && p.z, ⟨p.z, p.x⟩)

/-- Conjugation by S: X ↦ Y, Y ↦ −X, Z ↦ Z. -/
def conjS (p : P1) : Signed := (p.x && p.z, ⟨p.x, p.x ^^ p.z⟩)

/-- Conjugation by CNOT (control first): X on the control spreads to the
    target, Z on the target spreads to the control. No sign changes. -/
def conjCnot (ct : P1 × P1) : P1 × P1 :=
  (⟨ct.1.x, ct.1.z ^^ ct.2.z⟩, ⟨ct.1.x ^^ ct.2.x, ct.2.z⟩)

/-- H·X·H = +Z. -/
theorem stabilizer_hadamard_x : conjH px = (false, pz) := by decide
/-- H·Z·H = +X. -/
theorem stabilizer_hadamard_z : conjH pz = (false, px) := by decide
/-- H·Y·H = −Y: the Hadamard is its own inverse with a sign on Y. -/
theorem stabilizer_hadamard_y : conjH py = (true, py) := by decide
/-- S·X·S† = +Y. -/
theorem stabilizer_phase_x : conjS px = (false, py) := by decide
/-- S·Y·S† = −X. -/
theorem stabilizer_phase_y : conjS py = (true, px) := by decide
/-- S·Z·S† = +Z: the phase gate commutes with Z. -/
theorem stabilizer_phase_z : conjS pz = (false, pz) := by decide
/-- CNOT sends X⊗I to X⊗X: the bit flip fans out control → target. -/
theorem stabilizer_cnot_xi : conjCnot (px, pi) = (px, px) := by decide
/-- CNOT fixes I⊗X. -/
theorem stabilizer_cnot_ix : conjCnot (pi, px) = (pi, px) := by decide
/-- CNOT fixes Z⊗I. -/
theorem stabilizer_cnot_zi : conjCnot (pz, pi) = (pz, pi) := by decide
/-- CNOT sends I⊗Z to Z⊗Z: the phase flip fans back target → control. -/
theorem stabilizer_cnot_iz : conjCnot (pi, pz) = (pz, pz) := by decide
/-- CNOT sends Y⊗I to Y⊗X with no sign change. -/
theorem stabilizer_cnot_yi : conjCnot (py, pi) = (py, px) := by decide
/-- Negative control: S sends Y to −X, never to +X. -/
theorem phase_y_is_not_plus_x : conjS py ≠ (false, px) := by decide

end Qpu.Verify.Stabilizer