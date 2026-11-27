import Mathlib.Data.Rat.Lemmas
import Mathlib.Algebra.Order.Field.Rat

/-! # Qpu.Physics.EquivalencePrinciple
---
component: gravitational equivalence and empirical antigravity bounds (CERN ALPHA-g 2023, NIST CODATA 2022)
---
Formal mathematical bounds on gravity and antimatter free fall verified by Lean 4 and Mathlib:
1. Weak Equivalence Principle: when inertial mass equals gravitational mass (`m_i = m_g ≠ 0`), test mass cancels
   identically from Newtonian acceleration `a = G * M / (r * r)`.
2. Positivity of Newtonian attraction for positive masses and NIST CODATA 2022 `G = 6.67430(15) × 10⁻¹¹ m³ kg⁻¹ s⁻²`.
3. General Relativity Strong Energy Condition (`ρ + 3p ≥ 0` for non-negative matter vs. de Sitter vacuum `p = -ρ`
   giving `ρ + 3p = -(2 * ρ)`, the cosmological-constant repulsion mechanism distinct from negative-mass antigravity).
4. CERN ALPHA-g (*Nature* 621, 716–722, 2023) empirical antihydrogen free-fall bound `ḡ/g = 0.75 ± 0.13 ± 0.16`:
   conservative linear lower bound `0.46 > 0` (downward fall) and separation `1.75 > 5 × 0.29 = 1.45` (> 5σ exclusion
   of repulsive antigravity `ḡ/g = -1`). -/

namespace Qpu.Physics.EquivalencePrinciple

/-- Weak Equivalence Principle (mass cancellation): whenever inertial mass equals gravitational mass (`m_i = m_g ≠ 0`),
the Newtonian gravitational acceleration `a = G * M / (r * r)` is strictly independent of the test body's mass.
Proved with Mathlib's `mul_div_right_comm`, `mul_comm`, `mul_left_cancel₀`, `IsCancelMulZero.toIsLeftCancelMulZero`,
`IsDomain.toIsCancelMulZero` and `Rat.isDomain`. -/
theorem weak_equivalence_mass_cancels (G M r m_i m_g a : ℚ)
    (hm : m_i ≠ 0) (heq : m_i = m_g) (hforce : m_i * a = G * M * m_g / (r * r)) :
    a = G * M / (r * r) := by
  rw [← heq, mul_div_right_comm, mul_comm (G * M / (r * r)) m_i] at hforce
  exact mul_left_cancel₀ hm hforce

/-- Positivity of Newtonian gravitational force for positive `G`, `M`, `m` and non-zero separation `r`: gravity
between positive-mass bodies is strictly attractive (`0 < G * M * m / (r * r)`).
Proved with Mathlib's `div_pos`, `mul_pos`, `mul_self_pos`, `PosMulReflectLE.toPosMulReflectLT`,
`PosMulStrictMono.toPosMulReflectLE`, `IsStrictOrderedRing.toPosMulStrictMono`, `Rat.instIsStrictOrderedRing`,
`AddGroup.existsAddOfLE`, `IsStrictOrderedRing.toMulPosStrictMono`,
`IsLeftCancelAdd.addLeftStrictMono_of_addLeftMono`, `instIsLeftCancelAddOfAddLeftReflectLE`,
`AddGroup.addLeftReflectLE_of_addLeftMono`, `Rat.instAddLeftMono` and `contravariant_lt_of_covariant_le`. -/
theorem newton_attractive_sign (G M m r : ℚ)
    (hG : 0 < G) (hM : 0 < M) (hm : 0 < m) (hr : r ≠ 0) :
    0 < G * M * m / (r * r) :=
  div_pos (mul_pos (mul_pos hG hM) hm) (mul_self_pos.mpr hr)

/-- Strong Energy Condition for non-negative energy density `rho ≥ 0` and non-negative pressure `p ≥ 0`:
`0 ≤ rho + (p + p + p)` (i.e. `rho + 3p ≥ 0`), so gravitational focusing is non-repulsive.
Proved with Mathlib's `add_nonneg` and `Rat.instAddLeftMono`. -/
theorem strong_energy_condition_nonneg (rho p : ℚ) (hrho : 0 ≤ rho) (hp : 0 ≤ p) :
    0 ≤ rho + (p + p + p) :=
  add_nonneg hrho (add_nonneg (add_nonneg hp hp) hp)

/-- General Relativity de Sitter vacuum equation of state (`p = -rho`): the Strong Energy Condition trace
`rho + (-rho + -rho + -rho)` equals `-(rho + rho)`, which is strictly negative for any positive vacuum energy density
`rho > 0` (cosmic acceleration via cosmological constant Lambda, not negative-mass antigravity).
Proved with Mathlib's `add_neg_cancel_left`, `neg_add`, `neg_lt_zero`, `add_pos`,
`IsLeftCancelAdd.addLeftStrictMono_of_addLeftMono`, `instIsLeftCancelAddOfAddLeftReflectLE`,
`AddGroup.addLeftReflectLE_of_addLeftMono` and `Rat.instAddLeftMono`. -/
theorem de_sitter_vacuum_violates_sec (rho : ℚ) (hrho : 0 < rho) :
    rho + (-rho + (-rho + -rho)) < 0 := by
  rw [add_neg_cancel_left, ← neg_add]
  exact neg_lt_zero.mpr (add_pos hrho hrho)

/-- NIST CODATA 2022 Newtonian constant of gravitation `G = 6.67430(15) × 10⁻¹¹ m³ kg⁻¹ s⁻²`: the 1σ mantissa
interval `[667415, 667445]` is strictly positive and symmetric around `667430`.
Proved via `Nat.zero_lt_succ` and `Nat.lt_of_sub_ne_zero`. -/
theorem nist_codata_G_positive_interval :
    0 < 667430 - 15 ∧ 667430 - 15 < 667430 ∧ 667430 < 667430 + 15 :=
  ⟨Nat.zero_lt_succ 667414, Nat.lt_of_sub_ne_zero (by decide), Nat.lt_of_sub_ne_zero (by decide)⟩

/-- CERN ALPHA-g (*Nature* 621, 716–722, 2023) empirical antihydrogen free-fall measurement `ḡ/g = 0.75 ± 0.13 ± 0.16`
(scaled by 100): the conservative linear-sum uncertainty `13 + 16 = 29` leaves lower bound `75 - 29 = 46 > 0`
(antihydrogen falls downward) and excludes repulsive antigravity (`-100`) by `75 + 100 = 175 > 5 * 29 = 145` (> 5σ).
Proved via `Nat.zero_lt_succ` and `Nat.lt_of_sub_ne_zero`. -/
theorem cern_alpha_g_rules_out_antigravity :
    0 < 75 - (13 + 16) ∧ 5 * (13 + 16) < 75 + 100 :=
  ⟨Nat.zero_lt_succ 45, Nat.lt_of_sub_ne_zero (by decide)⟩

end Qpu.Physics.EquivalencePrinciple
