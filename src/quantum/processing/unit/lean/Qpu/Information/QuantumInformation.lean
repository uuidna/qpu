import Qpu.Physics.Operator

/-! # Qpu.Information.QuantumInformation
---
component: quantum information (ISO/IEC 4879:2024 3.3.1)
---
Quantum information cannot be copied: no linear map sends both |0⟩ and |+⟩ to two copies of themselves. A register whose contents
copy exactly therefore holds a description of a state, not the state. -/

namespace QuantumInformation
open HilbertSpace Operator

/-- no-cloning: every linear map sending |0⟩|0⟩ to |0⟩|0⟩ and |1⟩|0⟩ to |1⟩|1⟩ fails to copy |+⟩: |+⟩|0⟩ does not go to |+⟩|+⟩ -/
theorem no_cloning (u : Mat)
    (h0 : ∀ r, r < 4 → ap 4 u (basis 0) r = basis 0 r) (h2 : ∀ r, r < 4 → ap 4 u (basis 2) r = basis 3 r) :
    ap 4 u (fun r => basis 0 r + basis 2 r) 1 ≠ 1 := by
  have a := h0 1 (by decide)
  have b := h2 1 (by decide)
  simp only [ap, sumTo, basis, List.range, List.range.loop, List.foldl] at a b ⊢
  generalize u 1 0 = x0 at a b ⊢
  generalize u 1 1 = x1 at a b ⊢
  generalize u 1 2 = x2 at a b ⊢
  generalize u 1 3 = x3 at a b ⊢
  obtain ⟨p0, q0⟩ := x0
  obtain ⟨p1, q1⟩ := x1
  obtain ⟨p2, q2⟩ := x2
  obtain ⟨p3, q3⟩ := x3
  intro h
  simp only [Nat.reduceEqDiff, ↓reduceIte] at a b h
  have ha := congrArg GI.re a
  have hb := congrArg GI.re b
  have hh := congrArg GI.re h
  simp only [GI.add_re, GI.add_im, GI.mul_re, GI.zero_re, GI.one_re, GI.zero_im, GI.one_im] at ha hb hh
  omega

end QuantumInformation
