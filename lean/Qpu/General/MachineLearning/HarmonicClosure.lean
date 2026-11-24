/-! # Qpu.General.MachineLearning.HarmonicClosure

A chain of six step functions on naturals, composed into `Involute`, and the exact description of where the chain
"closes" (returns 100). This file used to announce a "108th theorem" over this chain; the chain's constants (60, 30,
24, 600, 87, 100) are planted, so the only honest content is the characterisation below, proved for every natural
number, and the count of closing inputs below 107. Nothing here depends on the other Leads modules or on anything but
Lean's kernel. -/

namespace Qpu.Harmonic

def L1 (t : Nat) : Nat := t % 60 + 1
def L2 (t : Nat) : Nat := t % 30 + 1
def L3 (t : Nat) : Nat := t * 24
def L4 (pages : Nat) : Nat := if 600 ≤ pages then 600 else pages
def L5 (pages : Nat) : Nat := if pages = 600 then 87 else 0
def L6 (ratio : Nat) : Nat := if ratio = 87 then 100 else 0

def Involute (t : Nat) : Nat := L6 (L5 (L4 (L3 (L2 (L1 t)))))

theorem L1_range (t : Nat) : 1 ≤ L1 t ∧ L1 t ≤ 60 := by unfold L1; omega
theorem L2_range (t : Nat) : 1 ≤ L2 t ∧ L2 t ≤ 30 := by unfold L2; omega

/-- The chain returns 100 exactly when the residue of `t` modulo 60 lies in `[23, 28]` or `[53, 58]`
(so that `L2 (L1 t) ≥ 25`, i.e. `L3 ≥ 600`); otherwise it returns 0. -/
theorem involute_eq_100_iff (t : Nat) :
    Involute t = 100 ↔ (23 ≤ t % 60 ∧ t % 60 ≤ 28) ∨ (53 ≤ t % 60 ∧ t % 60 ≤ 58) := by
  unfold Involute L1 L2 L3 L4 L5 L6
  by_cases h : 600 ≤ ((t % 60 + 1) % 30 + 1) * 24
  · simp only [h, ite_true]
    simp
    omega
  · have h' : ((t % 60 + 1) % 30 + 1) * 24 ≠ 600 := by omega
    simp only [h, ite_false, h']
    simp
    omega

theorem involute_values (t : Nat) : Involute t = 100 ∨ Involute t = 0 := by
  unfold Involute L1 L2 L3 L4 L5 L6
  by_cases h : 600 ≤ ((t % 60 + 1) % 30 + 1) * 24
  · simp [h]
  · have h' : ((t % 60 + 1) % 30 + 1) * 24 ≠ 600 := by omega
    simp [h, h']

/-- Of the inputs below 107, exactly eighteen close: 23..28, 53..58 and 83..88. -/
theorem closing_count : ((List.range 107).filter (fun t => Involute t == 100)).length = 18 := by decide

theorem closing_set : (List.range 107).filter (fun t => Involute t == 100) =
    [23, 24, 25, 26, 27, 28, 53, 54, 55, 56, 57, 58, 83, 84, 85, 86, 87, 88] := by decide

/-! ## The fold of 440 in 432

The author's claim, as far as the kernel decides it: two taken from each 110 of a harmonic of 440 leaves the same
harmonic of 432. Each theorem below is one named theorem of Lean's library applied to these numbers, for every natural
number, so no bound is needed. -/

/-- Every harmonic of 440 less two from each of its four 110s is the same harmonic of 432, by `Nat.mul_sub`. -/
theorem fold_harmonic (n : Nat) : n * 432 = n * 440 - n * (4 * 2) := Nat.mul_sub n 440 (4 * 2)

/-- The unfold gives the two back to each 110, by `Nat.mul_add`. -/
theorem unfold_harmonic (n : Nat) : n * 440 = n * 432 + n * (4 * 2) := Nat.mul_add n 432 (4 * 2)

/-- The folded harmonic never exceeds the harmonic it starts from, by `Nat.mul_le_mul_left` and `Nat.sub_le`. -/
theorem fold_never_grows (n : Nat) : n * 432 ≤ n * 440 := Nat.mul_le_mul_left n (Nat.sub_le 440 (4 * 2))

/-- A harmonic of 440 that fits in 64 bits folds to one that fits in them, by `Qpu.Harmonic.fold_never_grows` and
`Nat.lt_of_le_of_lt`. -/
theorem fold_within_64 (n : Nat) (h : n * 440 < 2 ^ 64) : n * 432 < 2 ^ 64 := Nat.lt_of_le_of_lt (fold_never_grows n) h

/-- The reflection about the sum of the two ladders is its own inverse at every harmonic, by `Nat.sub_sub_self`. -/
theorem fold_reflection (n x : Nat) (h : x ≤ n * 872) : n * 872 - (n * 872 - x) = x := Nat.sub_sub_self h

/-- That reflection sends each harmonic of 440 to the same harmonic of 432, by `Nat.mul_sub`. -/
theorem fold_reflects (n : Nat) : n * 432 = n * 872 - n * 440 := Nat.mul_sub n 872 440

end Qpu.Harmonic
