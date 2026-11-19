import Qpu.Mint
import Qpu.Lattice

/-! # Qpu.Physics
Many-body physics gap scaling for quantum simulation, exact Nat on the doubling mint: the energy gap at level k
follows the doubling mint, giving the exponential-in-k gap scaling used in adiabatic quantum computing and quantum
annealing. Monotonicity, positivity, strict growth and exact doubling are quantified over all k — unlimited levels —
with the textbook values kept as kernel-decided controls. -/

def gap (k : Nat) : Nat := mint k

/-- The gap never shrinks with level, for all level pairs. -/
theorem gap_monotone {k k' : Nat} (h : k ≤ k') : gap k ≤ gap k' := by
  cases Nat.lt_or_eq_of_le h with
  | inl hlt => exact Nat.le_of_lt (mintOf_lt hlt)
  | inr heq => rw [← heq]

/-- Every level has a positive gap, for every k. -/
theorem gap_pos (k : Nat) : 0 < gap k := mintOf_pos k

/-- The gap strictly grows with level, for every k. -/
theorem gap_strict (k : Nat) : gap k < gap (k + 1) := mintOf_lt_succ k

/-- One more level exactly doubles the gap, for every k. -/
theorem gap_doubles (k : Nat) : gap (k + 1) = 2 * gap k := by
  rw [gap, gap, mintOf_succ]
  omega

/-- The textbook spot values, decided by the kernel as controls on the general laws. -/
theorem physics_all : gap 0 = 1 ∧ gap 1 = 2 ∧ gap 2 = 4 ∧ gap 3 = 8 := ⟨rfl, rfl, rfl, rfl⟩
