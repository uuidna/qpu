import Mathlib

/-!
# The OpenFermion bridge, proved

The Jordan–Wigner transform writes a fermionic ladder on a mode as `a = (X + iY)/2` and `a† = (X - iY)/2`, with a string of `Z`
on the modes below, which squares to the identity and commutes with the mode's own `X` and `Y`. The transform is a fermionic one
because it keeps the canonical relations: `a a† + a† a = 1` and `a a = 0` on every mode, in any complex algebra in which `X` and `Y`
square to the identity and anticommute.
-/

namespace FermionBridge

open Complex

variable {A : Type*} [Ring A]

/-- The anticommutator of a sum and a difference: `(u + v)(u - v) + (u - v)(u + v) = 2u² - 2v²` in any ring. Each difference is
a sum with a negation (`sub_eq_add_neg`), both products expand (`mul_add`, `add_mul`, through `Distrib.leftDistribClass` and
`Distrib.rightDistribClass`), the signs leave the products (`mul_neg`, `neg_mul`, `neg_add`), the four sums regroup
(`add_add_add_comm`), and the cross terms cancel (`add_neg_cancel`, `neg_add_cancel`, `add_zero`, `zero_add`). -/
theorem anticommutator_expand (u v : A) :
    (u + v) * (u - v) + (u - v) * (u + v) = u * u + u * u - (v * v + v * v) := by
  simp only [sub_eq_add_neg, add_mul, mul_add, mul_neg, neg_mul, neg_add]
  rw [add_add_add_comm (u * u + v * u) (-(u * v) + -(v * v)), add_add_add_comm (u * u) (v * u), add_neg_cancel, add_zero,
    add_add_add_comm (-(u * v)) (-(v * v)), neg_add_cancel, zero_add]

/-- The square of a sum of anticommuting elements: `(u + v)² = u² + v²` whenever `uv = -vu`. The square expands (`add_mul`,
`mul_add`, through `Distrib.rightDistribClass` and `Distrib.leftDistribClass`), and with `uv = -vu` the cross terms cancel
(`add_assoc`, `neg_add_cancel_left`). -/
theorem square_expand (u v : A) (h : u * v = -(v * u)) : (u + v) * (u + v) = u * u + v * v := by
  rw [add_mul, mul_add, mul_add, h, add_assoc, neg_add_cancel_left]

variable [Algebra ℂ A]

/-- The ladders of a mode anticommute to the identity: `a a† + a† a = 1` whenever `X` and `Y` square to the identity. The halves
leave the products (`smul_mul_assoc`, `mul_smul_comm`, `smul_add`, with `IsScalarTower.right` and `Algebra.to_smulCommClass`),
the anticommutator expands (`FermionBridge.anticommutator_expand`), `(iY)² = i²Y² = -1` (`smul_mul_smul_comm`, `IsScalarTower.left`,
`Complex.I_mul_I`, `neg_one_smul`), the four units add (`neg_add`, `sub_neg_eq_add`, `two_smul`, with
`Nat.instAtLeastTwoHAddOfNat`), and the two halves cancel the two twos (`one_div`, `inv_smul_smul₀`, `two_ne_zero`, through
`CharZero.NeZero.two` and `Complex.instCharZero`). -/
theorem ladder_anticommute (X Y : A) (hX : X * X = 1) (hY : Y * Y = 1) :
    ((1 / 2 : ℂ) • (X + I • Y)) * ((1 / 2 : ℂ) • (X - I • Y)) + ((1 / 2 : ℂ) • (X - I • Y)) * ((1 / 2 : ℂ) • (X + I • Y)) = 1 := by
  rw [smul_mul_assoc, mul_smul_comm, smul_mul_assoc, mul_smul_comm, ← smul_add, ← smul_add, anticommutator_expand,
    smul_mul_smul_comm, hX, hY, I_mul_I, neg_one_smul, ← neg_add, sub_neg_eq_add, ← two_smul ℂ (1 : A), one_div,
    ← two_smul ℂ ((2 : ℂ) • (1 : A)), inv_smul_smul₀ two_ne_zero, inv_smul_smul₀ two_ne_zero]

/-- A ladder squares to nothing: `a a = 0` whenever `X` and `Y` square to the identity and anticommute. The halves leave the
product (`smul_mul_smul_comm`, with `IsScalarTower.right`, `IsScalarTower.left`, `Algebra.to_smulCommClass` and
`Nat.instAtLeastTwoHAddOfNat`), `X` and `iY` anticommute (`mul_smul_comm`, `smul_mul_assoc`, `smul_neg`), so the square is
`X² + (iY)²` (`FermionBridge.square_expand`), and `1 + i²·1 = 0` (`Complex.I_mul_I`, `neg_one_smul`, `add_neg_cancel`,
`smul_zero`). -/
theorem ladder_square_zero (X Y : A) (hX : X * X = 1) (hY : Y * Y = 1) (hXY : X * Y = -(Y * X)) :
    ((1 / 2 : ℂ) • (X + I • Y)) * ((1 / 2 : ℂ) • (X + I • Y)) = 0 := by
  rw [smul_mul_smul_comm, square_expand X (I • Y) (by rw [mul_smul_comm, smul_mul_assoc, hXY, smul_neg]), smul_mul_smul_comm,
    hX, hY, I_mul_I, neg_one_smul, add_neg_cancel, smul_zero]
end FermionBridge
