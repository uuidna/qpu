import Mathlib

/-!
# The ReCirq bridge, proved

ReCirq reports a QAOA energy as the expected value of `C = Σ w Z_i Z_j` over the edges of its problem graph. On a basis state the
product `Z_i Z_j` is `1` on an edge whose ends agree and `-1` on an edge the state cuts, that is `1 - 2c` with `c` the cut indicator,
so the energy is the total weight less twice the weight cut, and the door's expected cut answers ReCirq's energy.
-/

namespace RecirqBridge

/-- The Ising energy is the total weight less twice the cut: `Σ w (1 - 2c) = Σ w - 2 Σ w c` over any set of edges, `c` the cut
indicator of each edge. Twice a sum is the sum of the doubled terms (`Finset.mul_sum`), a sum of differences is the difference of
the sums (`Finset.sum_sub_distrib`), and term by term the sums agree (`Finset.sum_congr`): `w (1 - 2c) = w - 2 (w c)` (`mul_sub`,
`mul_one`, `mul_left_comm`), the literal two read through `Nat.instAtLeastTwoHAddOfNat`. -/
theorem ising_cut {E : Type*} (s : Finset E) (w c : E → ℝ) :
    ∑ e ∈ s, w e * (1 - 2 * c e) = ∑ e ∈ s, w e - 2 * ∑ e ∈ s, w e * c e := by
  rw [Finset.mul_sum, ← Finset.sum_sub_distrib]
  exact Finset.sum_congr rfl fun e _ => by rw [mul_sub, mul_one, mul_left_comm]

end RecirqBridge
