import Mathlib

/-!
# The Qualtran bridge, proved

Qualtran counts `Z^{3/4}` and `Z^{5/4}` as arbitrary rotations. The door counts each as one T gate, because powers of `Z` add:
`Z^{3/4} = Z^{1/2} Z^{1/4}` is the Clifford `S` times one `T`, and `Z^{5/4} = Z Z^{1/4}` is the Pauli `Z` times one `T`. The lower
entry of `Z^t` is `e^{iπt}`, and those entries multiply.
-/

namespace QualtranBridge

open Complex

/-- Powers of `Z` add: `e^{iπ(a+b)} = e^{iπa} e^{iπb}`, so `Z^{3/4} = S·T` and `Z^{5/4} = Z·T` each cost one T gate beside a
Clifford. The exponent distributes over the sum (`mul_add`, `Complex.ofReal_add`, `add_mul`, through `Distrib.leftDistribClass`
and `Distrib.rightDistribClass`), and the exponential of a sum is the product (`Complex.exp_add`). -/
theorem z_powers_add (a b : ℝ) :
    exp (↑(Real.pi * (a + b)) * I) = exp (↑(Real.pi * a) * I) * exp (↑(Real.pi * b) * I) := by
  rw [mul_add, Complex.ofReal_add, add_mul, Complex.exp_add]

end QualtranBridge
