import Mathlib.Data.Nat.Prime.Defs
import Qpu.General.Config

/-- `Nat.Prime p` means that `p` is a prime number, that is, a natural number
at least 2 whose only divisors are `p` and `1`.
The theorem `Nat.prime_def` witnesses this description of a prime number. -/
theorem isPrime_eq_decide_prime (n : Nat) : Config.isPrime n = decide (Nat.Prime n) := by
  have key : Config.isPrime n = true ↔ Nat.Prime n := by
    rw [Nat.prime_def_lt]
    simp only [Config.isPrime, Bool.and_eq_true, decide_eq_true_eq, List.all_eq_true, List.mem_range,
      Bool.or_eq_true, bne_iff_ne, ne_eq]
    constructor
    · rintro ⟨h2, h⟩
      refine ⟨h2, fun m hm hd => ?_⟩
      rcases h m hm with h1 | h1
      · by_cases hm0 : m = 0
        · subst hm0; exact absurd (Nat.eq_zero_of_zero_dvd hd) (by omega)
        · omega
      · exact absurd (Nat.mod_eq_zero_of_dvd hd) h1
    · rintro ⟨h2, h⟩
      refine ⟨h2, fun d hd => ?_⟩
      by_cases hd2 : d < 2
      · exact Or.inl hd2
      · exact Or.inr fun hmod => by have := h d hd (Nat.dvd_of_mod_eq_zero hmod); omega
  rw [Bool.eq_iff_iff, decide_eq_true_iff]; exact key
