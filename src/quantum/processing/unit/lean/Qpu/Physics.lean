/-! # Qpu.Physics
Planck and Boltzmann (SI exact digits), transmon temperature, BCS gaps of aluminium and niobium, cooling. -/

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
