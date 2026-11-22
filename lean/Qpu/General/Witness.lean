import Mathlib.Data.Nat.Prime.Basic
/-! # Qpu.General.Witness

The trapdoor's witness, proved for every candidate. A semiprime N = p·q is minted with its witness the centre
a = (p + q)/2 and gap b = (q − p)/2, so N = (a − b)(a + b); decoding a candidate a splits N at a ± b. These theorems
state that the split is unique: for primes p ≤ q, any split d·e = p·q with 1 < d ≤ e is d = p and e = q, so the only
witness that decodes is the true centre, and every other candidate (0, a ± 2, or any a) is refused. The decoder in
`algorithms.ts` (`decodeImpossible`) tests exactly this split; here it holds for all witnesses, not a sample. -/

namespace Witness

/-- Only one split of a semiprime: for primes `p ≤ q`, if `d * e = p * q` with `1 < d ≤ e`, then `d = p` and `e = q`.
Composed from Mathlib's `Nat.dvd_prime`, `Nat.Prime.pos` and `Nat.Prime.two_le`, with Lean core's `Nat.dvd_mul`
and `Nat.eq_of_mul_eq_mul_left`. -/
theorem split_unique {p q d e : ℕ} (hp : p.Prime) (hq : q.Prime) (hpq : p ≤ q) (hde : d ≤ e)
    (hN : d * e = p * q) (hd : 1 < d) : d = p ∧ e = q := by
  have hdvd : d ∣ p * q := hN ▸ Nat.dvd_mul_right d e
  obtain ⟨d1, d2, h1, h2, hd12⟩ := Nat.dvd_mul.mp hdvd
  have hp0 := hp.pos
  have hq0 := hq.pos
  rcases (Nat.dvd_prime hp).mp h1 with h1 | h1 <;> rcases (Nat.dvd_prime hq).mp h2 with h2 | h2 <;>
    rw [h1, h2] at hd12 <;> subst hd12
  · omega
  · rw [Nat.one_mul] at hN hd hde ⊢
    have hep : e = p := Nat.eq_of_mul_eq_mul_left hq0 (by rw [hN, Nat.mul_comm])
    omega
  · rw [Nat.mul_one] at hN hd hde ⊢
    exact ⟨rfl, Nat.eq_of_mul_eq_mul_left hp0 hN⟩
  · have he : e = 1 := Nat.eq_of_mul_eq_mul_left (Nat.mul_pos hp0 hq0) (by rw [hN, Nat.mul_one])
    have h4 : 2 * 2 ≤ p * q := Nat.mul_le_mul hp.two_le hq.two_le
    omega

/-- Only the true witness decodes: for primes `p ≤ q`, a candidate centre `a` with gap `b` that splits
`(a - b) * (a + b) = p * q` with `1 < a - b` has `a - b = p` and `a + b = q`. From `Witness.split_unique`, itself
composed from Mathlib's `Nat.dvd_prime`, `Nat.Prime.pos` and `Nat.Prime.two_le`. -/
theorem witness_unique {p q a b : ℕ} (hp : p.Prime) (hq : q.Prime) (hpq : p ≤ q)
    (hN : (a - b) * (a + b) = p * q) (hd : 1 < a - b) : a - b = p ∧ a + b = q :=
  split_unique hp hq hpq (by omega) hN hd

end Witness
