import Mathlib

/-!
# The qsim bridge, proved

qsim writes a rotation as `rz φ = diag(e^{-iφ/2}, e^{iφ/2})`, where Cirq's power `Z^{φ/π} = diag(1, e^{iφ})` carries no phase. The
two are the same gate up to the global phase `e^{-iφ/2}`: the upper entries agree at once, and the lower entry of the rotation is
the phase times the lower entry of the power.
-/

namespace QsimBridge

open Complex

/-- A rotation is a phased power: `e^{ix} = e^{-ix} e^{2ix}`, the lower entry of qsim's `rz` as the global phase `e^{-iφ/2}` times
the lower entry of `Z^{φ/π}`, with `x = φ/2`. The two exponentials join (`Complex.exp_add`), their exponents share the factor `i`
(`add_mul`, through `Distrib.rightDistribClass`), and `-x + (x + x) = x` (`neg_add_cancel_left`). -/
theorem rotation_phase (x : ℂ) : exp (x * I) = exp (-x * I) * exp ((x + x) * I) := by
  rw [← Complex.exp_add, ← add_mul, neg_add_cancel_left]

end QsimBridge
