import Qpu.Processing.CircuitBasedQuantumComputing

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

/-- Signed two-qubit Pauli: one global phase sign plus the two Pauli bits. -/
abbrev Signed2 := Bool × P1 × P1

/-- Signed CNOT conjugation (control first): copies the control's X to the
    target, copies the target's Z to the control, and applies the Clifford
    phase correction `x_c · z_t · (x_t = z_c)`. -/
def conjCnotSigned (ct : P1 × P1) : Signed2 :=
  (ct.1.x && ct.2.z && (ct.2.x == ct.1.z),
   ⟨ct.1.x, ct.1.z ^^ ct.2.z⟩,
   ⟨ct.1.x ^^ ct.2.x, ct.2.z⟩)

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

/-- Signed CNOT sends X⊗I to +X⊗X. -/
theorem stabilizer_cnot_signed_xi :
    conjCnotSigned (px, pi) = (false, px, px) := by decide
/-- Signed CNOT fixes I⊗X. -/
theorem stabilizer_cnot_signed_ix :
    conjCnotSigned (pi, px) = (false, pi, px) := by decide
/-- Signed CNOT fixes Z⊗I. -/
theorem stabilizer_cnot_signed_zi :
    conjCnotSigned (pz, pi) = (false, pz, pi) := by decide
/-- Signed CNOT sends I⊗Z to +Z⊗Z. -/
theorem stabilizer_cnot_signed_iz :
    conjCnotSigned (pi, pz) = (false, pz, pz) := by decide
/-- Signed CNOT sends Y⊗I to +Y⊗X. -/
theorem stabilizer_cnot_signed_yi :
    conjCnotSigned (py, pi) = (false, py, px) := by decide
/-- Signed CNOT sends I⊗Y to +Z⊗Y. -/
theorem stabilizer_cnot_signed_iy :
    conjCnotSigned (pi, py) = (false, pz, py) := by decide
/-- Signed CNOT sends Y⊗Y to −X⊗Z. -/
theorem stabilizer_cnot_signed_yy :
    conjCnotSigned (py, py) = (true, px, pz) := by decide
/-- Negative control: signed CNOT sends X⊗Y to +Y⊗Z, so its phase rule is
    not merely the unsigned rule with a constant sign. -/
theorem stabilizer_cnot_signed_xy :
    conjCnotSigned (px, py) = (false, py, pz) := by decide

/-- The signed CNOT rule agrees with the phase-aware matrix-level rule:
    same phase parity and same Pauli-bit updates. -/
theorem conjCnotSigned_agrees_with_ruleCNOT (k : Nat) (ct : P1 × P1) :
    CircuitBasedQuantumComputing.ruleCNOT
      ⟨k, ct.1.x, ct.1.z, ct.2.x, ct.2.z⟩ =
      ⟨(k + if (ct.1.x && ct.2.z && (ct.2.x == ct.1.z)) then 2 else 0) % 4,
       ct.1.x, ct.1.z ^^ ct.2.z,
       ct.1.x ^^ ct.2.x, ct.2.z⟩ := rfl

/-- The signed CNOT rule is exactly the rule appearing in the proved
    `Exact CNOT` proposition, with its Boolean phase encoding the parity of
    the rule's `i^k` phase. -/
theorem conjCnotSigned_matches_ruleCNOT (k : Nat) (ct : P1 × P1) :
    CircuitBasedQuantumComputing.ruleCNOT
      ⟨k, ct.1.x, ct.1.z, ct.2.x, ct.2.z⟩ =
      ⟨(k + if (conjCnotSigned ct).1 then 2 else 0) % 4,
       (conjCnotSigned ct).2.1,
       (conjCnotSigned ct).2.2⟩ := rfl

end Qpu.Verify.Stabilizer