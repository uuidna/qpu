import Qpu.General.Mint
import Qpu.General.Lattice
import Qpu.Processing.CircuitBasedQuantumComputing

/-! # Qpu.Processing.Stabilizer
Unified stabilizer formalism (merging stabilizer counts and symplectic Clifford Pauli conjugation verification; all 16 redundant
`test_cz_*` / `stabilizer_t_gate` duplicates purged). -/

/-- `∏ x ∈ s, f x` is the product of `f x` as `x` ranges over the elements of the finite set `s`.

When the index type is a `Fintype`, the notation `∏ x, f x`, is a shorthand for
`∏ x ∈ Finset.univ, f x`. -/
def stabProd : Nat → Nat | 0 => 1 | k + 1 => (mint (k + 1) + 1) * stabProd k
/-- `a * b` computes the product of `a` and `b`.
The meaning of this notation is type-dependent. 

Conventions for notations in identifiers:

 * The recommended spelling of `*` in identifiers is `mul`.-/
def stabStates (nn : Nat) : Nat := mint nn * stabProd nn
/-- `a ^ b` computes `a` to the power of `b`.
The meaning of this notation is type-dependent. 

Conventions for notations in identifiers:

 * The recommended spelling of `^` in identifiers is `pow`.-/
def paulis (nn : Nat) : Nat := mint (2 * nn + 2)
def stabSubgroup (nn : Nat) : Nat := mint nn

/-- One stabilizer factor, for every k. -/
theorem stabProd_step (k : Nat) : stabProd (k + 1) = (mint (k + 1) + 1) * stabProd k := rfl

/-- The stabilizer product never vanishes, for every k. -/
theorem stabProd_pos (k : Nat) : 0 < stabProd k := by
  induction k with
  | zero => exact Nat.succ_pos 0
  | succ k ih =>
    rw [stabProd_step]
    exact Nat.mul_pos (Nat.succ_pos _) ih

/-- The stabilizer product never shrinks across a factor, for every k. -/
theorem stabProd_grows (k : Nat) : stabProd k ≤ stabProd (k + 1) := by
  rw [stabProd_step]
  exact Nat.le_mul_of_pos_left _ (Nat.succ_pos _)

/-- n qubits always have stabilizer states, for every n. -/
theorem stabStates_pos (nn : Nat) : 0 < stabStates nn :=
  Nat.mul_pos (mintOf_pos nn) (stabProd_pos nn)

/-- One more qubit quadruples the phased Pauli group, for every nn. -/
theorem paulis_growth (nn : Nat) : paulis (nn + 1) = 4 * paulis nn := by
  rw [paulis, paulis, show 2 * (nn + 1) + 2 = (2 * nn + 2) + 2 from by omega, mintOf_add]
  rw [show mint 2 = 4 from rfl, Nat.mul_comm]

/-- The phased Pauli group is nonempty, for every nn. -/
theorem paulis_pos (nn : Nat) : 0 < paulis nn := mintOf_pos _

/-- One more qubit doubles the stabilizer subgroup, for every nn. -/
theorem stabSubgroup_doubles (nn : Nat) : stabSubgroup (nn + 1) = 2 * stabSubgroup nn := by
  rw [stabSubgroup, stabSubgroup, mintOf_succ]
  omega

/-- The textbook spot values, decided by the kernel as controls on the general laws. -/
theorem stabilizer_all : stabStates 1 = 6 ∧ stabStates 2 = 60 ∧ stabStates 3 = 1080 ∧ paulis 1 = 16 := ⟨rfl, rfl, rfl, rfl⟩

/-! ## Qpu.Verify.Stabilizer (merged into Stabilizer; redundant CZ and T duplicates purged) -/
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

/-- Conjugation by H: X↔Z, Y ↦ −Y. -/
def conjH (p : P1) : Signed := (p.x && p.z, ⟨p.z, p.x⟩)

/-- Conjugation by S: X ↦ Y, Y ↦ −X, Z ↦ Z. -/
def conjS (p : P1) : Signed := (p.x && p.z, ⟨p.x, p.x ^^ p.z⟩)

/-- Lift an unsigned-input conjugation rule to signed Paulis. -/
def liftSigned (f : P1 → Signed) (v : Signed) : Signed :=
  let result := f v.2
  (v.1 ^^ result.1, result.2)

/-- Signed Hadamard conjugation. -/
def applySignedH : Signed → Signed := liftSigned conjH
/-- Signed S conjugation. -/
def applySignedS : Signed → Signed := liftSigned conjS
/-- Signed S† conjugation, implemented as three S conjugations. -/
def applySignedSdg (v : Signed) : Signed := applySignedS (applySignedS (applySignedS v))

/-- Positive control: T has order 8 (from `QuantumGate.t_gate`). -/
theorem test_t_order_is_eight : QuantumGate.SameW (QuantumGate.powW QuantumGate.TW 8) QuantumGate.idW :=
  QuantumGate.t_gate.2.1

/-- Negative control: T does not have order 4. -/
theorem test_t_order_is_not_four : ¬ QuantumGate.SameW (QuantumGate.powW QuantumGate.TW 4) QuantumGate.idW :=
  QuantumGate.t_gate.2.2.1

/-- Negative control: T does not commute with Hadamard. -/
theorem test_t_does_not_commute_with_hadamard :
    ¬ (QuantumGate.SameW (QuantumGate.mmW QuantumGate.HW QuantumGate.TW) (QuantumGate.mmW QuantumGate.TW QuantumGate.HW)) := by
  intro h
  exact (QuantumGate.t_gate.2.2.2 h).elim

/-- Conjugation by CNOT (control first). -/
def conjCnot (ct : P1 × P1) : P1 × P1 :=
  (⟨ct.1.x, ct.1.z ^^ ct.2.z⟩, ⟨ct.1.x ^^ ct.2.x, ct.2.z⟩)

/-- Conjugation by SWAP: exchanges the two qubits' Pauli factors. -/
def conjSwap (ct : P1 × P1) : P1 × P1 := (ct.2, ct.1)

/-- SWAP is an involution on every two-qubit Pauli pair. -/
theorem stabilizer_swap_involution (ct : P1 × P1) : conjSwap (conjSwap ct) = ct := by
  rcases ct with ⟨⟨a, b⟩, ⟨c, d⟩⟩
  cases a <;> cases b <;> cases c <;> cases d <;> decide

/-- SWAP exchanges the two qubits' Pauli factors. -/
theorem stabilizer_swap_exchanges_factors (ct : P1 × P1) : conjSwap ct = (ct.2, ct.1) := rfl

/-- Signed two-qubit Pauli. -/
abbrev Signed2 := Bool × P1 × P1

/-- Signed CNOT conjugation (control first). -/
def conjCnotSigned (ct : P1 × P1) : Signed2 :=
  (ct.1.x && ct.2.z && (ct.2.x == ct.1.z),
   ⟨ct.1.x, ct.1.z ^^ ct.2.z⟩,
   ⟨ct.1.x ^^ ct.2.x, ct.2.z⟩)

/-- Signed CNOT conjugation lifted to signed inputs. -/
def applySignedCnot : Signed2 → Signed2 := fun v =>
  let result := conjCnotSigned (v.2.1, v.2.2)
  (v.1 ^^ result.1, result.2.1, result.2.2)

/-- Conjugation by CZ. -/
def conjCz (ct : P1 × P1) : Signed2 :=
  (ct.1.x && ct.2.x, ⟨ct.1.x, ct.1.z ^^ ct.2.x⟩, ⟨ct.2.x, ct.2.z ^^ ct.1.x⟩)

/-- Signed CZ conjugation lifted to signed inputs. -/
def applySignedCz : Signed2 → Signed2 := fun v =>
  let result := conjCz (v.2.1, v.2.2)
  (v.1 ^^ result.1, result.2.1, result.2.2)

theorem stabilizer_cz_involution (ct : P1 × P1) : applySignedCz (conjCz ct) = (false, ct.1, ct.2) := by
  rcases ct with ⟨⟨a, b⟩, ⟨c, d⟩⟩; cases a <;> cases b <;> cases c <;> cases d <;> decide
theorem stabilizer_cz_x_support_rule (ct : P1 × P1) : (conjCz ct).2.1.x = ct.1.x ∧ (conjCz ct).2.2.x = ct.2.x := by
  rcases ct with ⟨⟨a, b⟩, ⟨c, d⟩⟩; cases a <;> cases b <;> cases c <;> cases d <;> decide
theorem stabilizer_cz_z_support_rule (ct : P1 × P1) : (conjCz ct).2.1.z = (ct.1.z ^^ ct.2.x) ∧ (conjCz ct).2.2.z = (ct.2.z ^^ ct.1.x) := by
  rcases ct with ⟨⟨a, b⟩, ⟨c, d⟩⟩; cases a <;> cases b <;> cases c <;> cases d <;> decide
theorem stabilizer_cz_sign_rule (ct : P1 × P1) : (conjCz ct).1 = (ct.1.x && ct.2.x) := by
  rcases ct with ⟨⟨a, b⟩, ⟨c, d⟩⟩; cases a <;> cases b <;> cases c <;> cases d <;> decide
theorem stabilizer_cz_commutation_rule (ct : P1 × P1) : (conjCz ct = (false, ct.1, ct.2)) ↔ (ct.1.x = false ∧ ct.2.x = false) := by
  rcases ct with ⟨⟨a, b⟩, ⟨c, d⟩⟩; cases a <;> cases b <;> cases c <;> cases d <;> decide

theorem test_cz_identity : conjCz (pi, pi) = (false, pi, pi) := by decide
theorem stabilizer_cz_xi : conjCz (px, pi) = (false, px, pz) := by decide
theorem stabilizer_cz_ix : conjCz (pi, px) = (false, pz, px) := by decide
theorem stabilizer_cz_zi : conjCz (pz, pi) = (false, pz, pi) := by decide
theorem stabilizer_cz_iz : conjCz (pi, pz) = (false, pi, pz) := by decide
theorem stabilizer_cz_xx : conjCz (px, px) = (true, py, py) := by decide
theorem stabilizer_cz_xy : conjCz (px, py) = (true, py, px) := by decide
theorem stabilizer_cz_yx : conjCz (py, px) = (true, px, py) := by decide
theorem stabilizer_cz_yy : conjCz (py, py) = (true, px, px) := by decide
theorem stabilizer_cz_xz : conjCz (px, pz) = (false, px, pi) := by decide
theorem stabilizer_cz_zx : conjCz (pz, px) = (false, pi, px) := by decide
theorem stabilizer_cz_yz : conjCz (py, pz) = (false, py, pi) := by decide
theorem stabilizer_cz_zy : conjCz (pz, py) = (false, pi, py) := by decide
theorem stabilizer_cz_yi : conjCz (py, pi) = (false, py, pz) := by decide
theorem stabilizer_cz_iy : conjCz (pi, py) = (false, pz, py) := by decide
theorem stabilizer_cz_zz : conjCz (pz, pz) = (false, pz, pz) := by decide

theorem stabilizer_hadamard_x : conjH px = (false, pz) := by decide
theorem stabilizer_hadamard_z : conjH pz = (false, px) := by decide
theorem stabilizer_hadamard_y : conjH py = (true, py) := by decide
theorem stabilizer_phase_x : conjS px = (false, py) := by decide
theorem stabilizer_phase_y : conjS py = (true, px) := by decide
theorem stabilizer_phase_z : conjS pz = (false, pz) := by decide
theorem stabilizer_cnot_xi : conjCnot (px, pi) = (px, px) := by decide
theorem stabilizer_cnot_ix : conjCnot (pi, px) = (pi, px) := by decide
theorem stabilizer_cnot_zi : conjCnot (pz, pi) = (pz, pi) := by decide
theorem stabilizer_cnot_iz : conjCnot (pi, pz) = (pz, pz) := by decide
theorem stabilizer_cnot_yi : conjCnot (py, pi) = (py, px) := by decide
theorem phase_y_is_not_plus_x : conjS py ≠ (false, px) := by decide

theorem stabilizer_cnot_signed_xi : conjCnotSigned (px, pi) = (false, px, px) := by decide
theorem stabilizer_cnot_signed_ix : conjCnotSigned (pi, px) = (false, pi, px) := by decide
theorem stabilizer_cnot_signed_zi : conjCnotSigned (pz, pi) = (false, pz, pi) := by decide
theorem stabilizer_cnot_signed_iz : conjCnotSigned (pi, pz) = (false, pz, pz) := by decide
theorem stabilizer_cnot_signed_yi : conjCnotSigned (py, pi) = (false, py, px) := by decide
theorem stabilizer_cnot_signed_iy : conjCnotSigned (pi, py) = (false, pz, py) := by decide
theorem stabilizer_cnot_signed_yy : conjCnotSigned (py, py) = (true, px, pz) := by decide
theorem stabilizer_cnot_signed_xy : conjCnotSigned (px, py) = (false, py, pz) := by decide

theorem test_signed_cnot_all_cases (sign : Bool) (pc pt : P1) :
    applySignedCnot (sign, pc, pt) = (sign ^^ (pc.x && pt.z && (pt.x == pc.z)), ⟨pc.x, pc.z ^^ pt.z⟩, ⟨pc.x ^^ pt.x, pt.z⟩) := by
  rcases pc with ⟨a, b⟩; rcases pt with ⟨c, d⟩; cases sign <;> cases a <;> cases b <;> cases c <;> cases d <;> decide

theorem conjCnotSigned_agrees_with_ruleCNOT (k : Nat) (ct : P1 × P1) :
    CircuitBasedQuantumComputing.ruleCNOT ⟨k, ct.1.x, ct.1.z, ct.2.x, ct.2.z⟩ =
      ⟨(k + if (ct.1.x && ct.2.z && (ct.2.x == ct.1.z)) then 2 else 0) % 4, ct.1.x, ct.1.z ^^ ct.2.z, ct.1.x ^^ ct.2.x, ct.2.z⟩ := by
  rcases ct with ⟨⟨a, b⟩, ⟨c, d⟩⟩; cases a <;> cases b <;> cases c <;> cases d <;> rfl

theorem conjCnotSigned_matches_ruleCNOT (k : Nat) (ct : P1 × P1) :
    CircuitBasedQuantumComputing.ruleCNOT ⟨k, ct.1.x, ct.1.z, ct.2.x, ct.2.z⟩ =
      ⟨(k + if (conjCnotSigned ct).1 then 2 else 0) % 4,
       (conjCnotSigned ct).2.1.x, (conjCnotSigned ct).2.1.z, (conjCnotSigned ct).2.2.x, (conjCnotSigned ct).2.2.z⟩ := by
  rcases ct with ⟨⟨a, b⟩, ⟨c, d⟩⟩; cases a <;> cases b <;> cases c <;> cases d <;> rfl

theorem test_signed_hadamard_all_cases (sign : Bool) (p : P1) : applySignedH (sign, p) = (sign ^^ (p.x && p.z), ⟨p.z, p.x⟩) := by
  rcases p with ⟨a, b⟩; cases sign <;> cases a <;> cases b <;> decide
theorem test_signed_phase_all_cases (sign : Bool) (p : P1) : applySignedS (sign, p) = (sign ^^ (p.x && p.z), ⟨p.x, p.x ^^ p.z⟩) := by
  rcases p with ⟨a, b⟩; cases sign <;> cases a <;> cases b <;> decide
theorem test_signed_hadamard_plus_x : applySignedH (false, px) = (false, pz) := by decide
theorem test_signed_hadamard_minus_x : applySignedH (true, px) = (true, pz) := by decide
theorem test_signed_hadamard_plus_z : applySignedH (false, pz) = (false, px) := by decide
theorem test_signed_hadamard_minus_z : applySignedH (true, pz) = (true, px) := by decide
theorem test_signed_hadamard_plus_y : applySignedH (false, py) = (true, py) := by decide
theorem test_signed_hadamard_minus_y : applySignedH (true, py) = (false, py) := by decide
theorem test_signed_phase_plus_x : applySignedS (false, px) = (false, py) := by decide
theorem test_signed_phase_minus_x : applySignedS (true, px) = (true, py) := by decide
theorem test_signed_phase_plus_y : applySignedS (false, py) = (true, px) := by decide
theorem test_signed_phase_minus_y : applySignedS (true, py) = (false, px) := by decide
theorem test_signed_phase_plus_z : applySignedS (false, pz) = (false, pz) := by decide
theorem test_signed_phase_minus_z : applySignedS (true, pz) = (true, pz) := by decide
theorem test_signed_hadamard_minus_y_is_not_minus_y : applySignedH (true, py) ≠ (true, py) := by decide
theorem test_signed_phase_minus_y_is_not_minus_x : applySignedS (true, py) ≠ (true, px) := by decide

theorem test_signed_cz_all_cases (sign : Bool) (pc pt : P1) :
    applySignedCz (sign, pc, pt) = (sign ^^ (pc.x && pt.x), ⟨pc.x, pc.z ^^ pt.x⟩, ⟨pt.x, pt.z ^^ pc.x⟩) := by
  rcases pc with ⟨a, b⟩; rcases pt with ⟨c, d⟩; cases sign <;> cases a <;> cases b <;> cases c <;> cases d <;> decide
theorem test_signed_cz_plus_xi : applySignedCz (false, px, pi) = (false, px, pz) := by decide
theorem test_signed_cz_minus_xi : applySignedCz (true, px, pi) = (true, px, pz) := by decide
theorem test_signed_cz_plus_xx : applySignedCz (false, px, px) = (true, py, py) := by decide
theorem test_signed_cz_minus_xx : applySignedCz (true, px, px) = (false, py, py) := by decide
theorem test_signed_cz_minus_xx_is_not_minus_yy : applySignedCz (true, px, px) ≠ (true, py, py) := by decide
theorem test_cz_does_not_commute_with_xx : conjCz (px, px) ≠ (false, px, px) := by decide
theorem test_cz_does_not_commute_with_xy : conjCz (px, py) ≠ (false, px, py) := by decide
theorem test_cz_does_not_commute_with_yx : conjCz (py, px) ≠ (false, py, px) := by decide
theorem test_cz_does_not_commute_with_yy : conjCz (py, py) ≠ (false, py, py) := by decide

end Qpu.Verify.Stabilizer
