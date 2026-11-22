import Mathlib.Data.Nat.Totient
import Mathlib.Algebra.BigOperators.Intervals
import Qpu.General.Meaning
import Qpu.Application.Shor

/-- Euler's totient function. This counts the number of naturals strictly less than `n` which are
coprime with `n`. -/
theorem totient_eq_nat_totient (n : Nat) : totient n = Nat.totient n := by
  have aux : ∀ k acc, totientAux k n acc = acc + ∑ j ∈ Finset.Ico 1 (k + 1), if Nat.Coprime n j then 1 else 0 := by
    intro k
    induction k with
    | zero => intro acc; simp [totientAux]
    | succ k ih =>
      intro acc
      rw [totientAux, ih, Finset.sum_Ico_succ_top (by omega : 1 ≤ k + 1), Qpu.gcd_eq_nat_gcd]
      by_cases h : Nat.Coprime n (k + 1)
      · have h' : Nat.gcd (k + 1) n = 1 := Nat.Coprime.symm h
        rw [if_pos h', if_pos h]; omega
      · have h' : ¬ Nat.gcd (k + 1) n = 1 := fun e => h (Nat.Coprime.symm e)
        rw [if_neg h', if_neg h]; omega
  have ico := Nat.filter_coprime_Ico_eq_totient n 1
  rw [Nat.add_comm 1 n] at ico
  rw [totient, aux, Nat.zero_add, ← Finset.card_filter, ico]
