import Mathlib

/-!
# Schedule — how the Lean tools are run

Each Lean tool loads the whole environment once. Run together, they need the sum of their footprints at once; run one after
another, the largest alone. The index script runs them in sequence, and skips a tool whose inputs keep their 122-qubit address.
-/

namespace Schedule

/-- Run one after another, the tools never need more memory at once than run together: every footprint is at most the sum of all
of them. From Mathlib's `List.single_le_sum`, with Lean's `Nat.zero_le` and the instance `Nat.instIsOrderedAddMonoid`. -/
theorem sequential_peak_le_parallel (footprints : List ℕ) : ∀ m ∈ footprints, m ≤ footprints.sum := by
  intro m hm
  exact List.single_le_sum (fun _ _ => Nat.zero_le _) m hm

end Schedule
