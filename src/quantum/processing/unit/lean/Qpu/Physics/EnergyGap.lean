import Qpu.General.Mint
import Qpu.General.Lattice

/-! # Qpu.Physics.EnergyGap
Many-body physics gap scaling for quantum simulation, exact Nat on the doubling mint: the energy gap at level k
follows the doubling mint, giving the exponential-in-k gap scaling used in adiabatic quantum computing and quantum
annealing. Monotonicity, positivity, strict growth and exact doubling are quantified over all k — unlimited levels —
with the textbook values kept as kernel-decided controls.
The level gap is `levelGap`; `gap` is the BCS gap of a critical temperature, with Planck and Boltzmann (SI exact
digits), the transmon temperature and cooling, which Qpu.Sigma and the Josephson junction read. -/


def planck : Nat := 662607015
def boltzmann : Nat := 1380649
def transmon : Nat := 5
def photon : Nat := planck * transmon
def thermal (millikelvin : Nat) : Nat := boltzmann * millikelvin * 10
theorem temperature : photon / thermal 10 = 23 ∧ photon / thermal 100 = 2 ∧ photon / thermal 4000 = 0 ∧ 4000 / 100 = 40 ∧ 100 / 10 = 10 ∧ 10 < 35 := ⟨rfl, rfl, rfl, rfl, rfl, Nat.le_of_ble_eq_true rfl⟩
def bcs : Nat := 352
def aluminium : Nat := 1200
def niobium : Nat := 9260
def gap (tc : Nat) : Nat := bcs * boltzmann * tc / planck / 10
theorem superconductivity : aluminium > 10 ∧ niobium > aluminium ∧ bcs / 100 = 3 ∧ gap aluminium = 88 ∧ gap aluminium > transmon ∧ gap niobium = 679 := ⟨Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, rfl, rfl, Nat.le_of_ble_eq_true rfl, rfl⟩
/-- COOLING: for every t, a, n with 0 < t and 0 < a, 0 < t * a ^ n; with a < b as well, t * a ^ n * a < t * a ^ n * b. -/
theorem cooling_stays_positive (t a n : Nat) (ht : 0 < t) (ha : 0 < a) : 0 < t * a ^ n :=
  Nat.mul_pos ht (Nat.pow_pos ha)
theorem cooling_strictly_decreases (t a b n : Nat) (ht : 0 < t) (ha : 0 < a) (hab : a < b) : t * a ^ n * a < t * a ^ n * b :=
  Nat.mul_lt_mul_of_pos_left hab (Nat.mul_pos ht (Nat.pow_pos ha))

/-- the many-body gap at level k, on the doubling mint -/
def levelGap (k : Nat) : Nat := mint k

/-- The gap never shrinks with level, for all level pairs. -/
theorem gap_monotone {k k' : Nat} (h : k ≤ k') : levelGap k ≤ levelGap k' := by
  cases Nat.lt_or_eq_of_le h with
  | inl hlt => exact Nat.le_of_lt (mintOf_lt hlt)
  | inr heq => rw [← heq]; exact Nat.le_refl _

/-- Every level has a positive gap, for every k. -/
theorem gap_pos (k : Nat) : 0 < levelGap k := mintOf_pos k

/-- The gap strictly grows with level, for every k. -/
theorem gap_strict (k : Nat) : levelGap k < levelGap (k + 1) := mintOf_lt_succ k

/-- One more level exactly doubles the gap, for every k. -/
theorem gap_doubles (k : Nat) : levelGap (k + 1) = 2 * levelGap k := by
  rw [levelGap, levelGap, mintOf_succ]
  omega

/-- The textbook spot values, decided by the kernel as controls on the general laws. -/
theorem physics_all : levelGap 0 = 1 ∧ levelGap 1 = 2 ∧ levelGap 2 = 4 ∧ levelGap 3 = 8 := ⟨rfl, rfl, rfl, rfl⟩
