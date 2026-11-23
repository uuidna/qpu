import Mathlib.RingTheory.Polynomial.Cyclotomic.Basic
import Qpu.Claims.Novelty

/-! # Qpu.General.Cyclotomic
The cyclotomic split of `X ^ n + 1`, which Mathlib holds only for `X ^ n - 1`: the thousand-bit check splits
`2 ^ 999 + 1` into the values `Φ_d(2)` over `d ∣ 1998`, `d ∤ 999`. -/

open Polynomial Finset

namespace Polynomial

/-- `X ^ n + 1` is the product of the cyclotomic polynomials `Φ_d` over the divisors `d` of `2 n` that do not divide
`n`, for `0 < n` over any commutative ring. Proposed for Mathlib beside `prod_cyclotomic_eq_X_pow_sub_one`.
Prior art: 8f1972b9-da78-721e-9d7e-cf6e117067ed (lean/dossiers/Polynomial.prod_cyclotomic_eq_X_pow_add_one.md) -/
@[novelty] theorem prod_cyclotomic_eq_X_pow_add_one {n : ℕ} (hpos : 0 < n) (R : Type*) [CommRing R] :
    ∏ d ∈ (2 * n).divisors \ n.divisors, cyclotomic d R = X ^ n + 1 := by
  have hsub : n.divisors ⊆ (2 * n).divisors := Nat.divisors_subset_of_dvd (by omega) (Dvd.intro_left 2 rfl)
  have h2n := prod_cyclotomic_eq_X_pow_sub_one (show 0 < 2 * n by omega) R
  rw [← Finset.prod_sdiff hsub, prod_cyclotomic_eq_X_pow_sub_one hpos R] at h2n
  have hfac : (X ^ (2 * n) - 1 : R[X]) = (X ^ n + 1) * (X ^ n - 1) := by ring
  rw [hfac] at h2n
  have hm : (X ^ n - 1 : R[X]).Monic := monic_X_pow_sub_C 1 (by omega)
  exact hm.mul_left_eq_zero_iff.mp (by rw [sub_mul, h2n, sub_self]) |> sub_eq_zero.mp

end Polynomial
