import Qpu.General.Mint
import Qpu.General.Lattice

/-! # Qpu.Processing.Surfacecode
Rotated surface-code parameters over arbitrary code distance d, exact Nat grounded
in the lattice constants: the physical qubit count, the correctable errors, and the
logical qubits per patch. Every statement is quantified over d — unlimited distances —
with the closed values kept as kernel-decided controls. -/

/-- `a + b` computes the sum of `a` and `b`.
The meaning of this notation is type-dependent. 

Conventions for notations in identifiers:

 * The recommended spelling of `+` in identifiers is `add`.-/
def surfacePhysical (d : Nat) : Nat := coins * d ^ 2 - coins * d + seed
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
def surfaceCorrectable (d : Nat) : Nat := (d - seed) / coins
def surfaceLogical : Nat := coins

/-- Squaring never shrinks the distance, for every d. -/
theorem sq_ge (d : Nat) : d ≤ d ^ 2 := by
  induction d with
  | zero => exact Nat.zero_le _
  | succ d ih =>
    have e : (d + 1) ^ 2 = d ^ 2 + 2 * d + 1 := by
      rw [Nat.pow_two, Nat.pow_two, Nat.add_mul d 1 (d + 1), Nat.mul_add d d 1]; omega
    rw [e]
    exact Nat.le_trans (Nat.succ_le_succ ih) (by omega)

/-- Every code distance yields at least one physical qubit: the patch never
    vanishes, uniformly in d. -/
theorem surfacePhysical_pos (d : Nat) : 0 < surfacePhysical d := by
  rw [surfacePhysical, seed_eq]
  have h : coins * d ≤ coins * d ^ 2 := Nat.mul_le_mul (Nat.le_refl coins) (sq_ge d)
  omega

/-- Higher distance corrects at least as much, for all distance pairs. -/
theorem surfaceCorrectable_monotone {d₁ d₂ : Nat} (h : d₁ ≤ d₂) :
    surfaceCorrectable d₁ ≤ surfaceCorrectable d₂ := by
  rw [surfaceCorrectable, surfaceCorrectable]
  exact Nat.div_le_div_right (Nat.sub_le_sub_right h seed)

/-- The correctable count never exceeds the distance itself: an honest margin,
    for every d. -/
theorem surfaceCorrectable_le (d : Nat) : surfaceCorrectable d ≤ d :=
  Nat.le_trans (Nat.div_le_self _ _) (Nat.sub_le d seed)

/-- The textbook spot values, decided by the kernel as controls on the
    monotone and positivity theorems. -/
theorem surfacecode_all : surfacePhysical 3 = 13 ∧ surfaceCorrectable 5 = 2 ∧ surfaceLogical = 2 := ⟨rfl, rfl, rfl⟩
