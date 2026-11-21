import Mathlib.Data.Nat.Choose.Basic
import Mathlib.Data.Nat.Factorial.Basic
import Mathlib.Data.Nat.Fib.Basic
import Mathlib.Data.Nat.GCD.Basic
import Qpu.General.Mint
import Qpu.General.Combinatorics
import Qpu.General.Lattice
import Qpu.Application.Shor
import Qpu.Processing.Anyon
import Qpu.Processing.Qft

/-! # Qpu.General.Meaning

Mathlib names the notions. The tree computes on its own recursive definitions so the kernel can decide every
statement by evaluation; this module proves each of those definitions equal to the Mathlib notion it is, for every
argument. A reader who knows Mathlib reads `mint` as `2 ^ k`, `choose` as `Nat.choose`, `gcd` as `Nat.gcd`,
`powMod` as `a ^ e % m`, `fibFusion` as `Nat.fib` and `qftGates` as `Nat.choose (q + 1) 2`, and each reading is
a theorem. The names follow Mathlib's convention: `definition_eq_notion`. -/

/-- `mint` is the power of two. -/
theorem mint_eq_two_pow (k : Nat) : mint k = 2 ^ k := by
  induction k with
  | zero => rfl
  | succ k ih => rw [mintOf_succ, ih, pow_succ]; omega

/-- `factorial` is `Nat.factorial`. -/
theorem factorial_eq_nat_factorial (n : Nat) : factorial n = n.factorial := by
  induction n with
  | zero => rfl
  | succ n ih => rw [factorial, ih, Nat.factorial_succ]

/-- `choose` is the binomial coefficient `Nat.choose`. -/
theorem choose_eq_nat_choose (n k : Nat) : choose n k = n.choose k := by
  induction n generalizing k with
  | zero => cases k <;> rfl
  | succ n ih =>
    cases k with
    | zero => rfl
    | succ k => rw [choose, ih, ih, Nat.choose_succ_succ, Nat.add_comm]

/-- The fuelled Euclid loop is `Nat.gcd` once the fuel covers the second argument. -/
theorem gcdAux_eq_nat_gcd (fuel a b : Nat) (h : b ≤ fuel) : gcdAux fuel a b = Nat.gcd a b := by
  induction fuel generalizing a b with
  | zero =>
    have hb : b = 0 := by omega
    subst hb
    simp [gcdAux]
  | succ fuel ih =>
    by_cases hb : b = 0
    · subst hb
      simp [gcdAux]
    · have hlt : a % b < b := Nat.mod_lt a (Nat.pos_of_ne_zero hb)
      rw [gcdAux, if_neg hb, ih b (a % b) (by omega), Nat.gcd_comm a b, Nat.gcd_rec b a, Nat.gcd_comm]

/-- `gcd` is `Nat.gcd`. -/
theorem gcd_eq_nat_gcd (a b : Nat) : gcd a b = Nat.gcd a b :=
  gcdAux_eq_nat_gcd (a + b) a b (Nat.le_add_left b a)

/-- The modular-power loop multiplies its accumulator by `a ^ k`, reduced mod `m`. -/
theorem powModAux_eq (k a m acc : Nat) : powModAux k a m (acc % m) = acc * a ^ k % m := by
  induction k generalizing acc with
  | zero => simp [powModAux]
  | succ k ih =>
    rw [powModAux, ih, pow_succ, Nat.mul_assoc, Nat.mod_mul_mod]
    congr 1
    ring

/-- `powMod` is modular exponentiation, `a ^ e % m`. -/
theorem powMod_eq_pow_mod (a e m : Nat) : powMod a e m = a ^ e % m := by
  rw [powMod, powModAux_eq, Nat.one_mul]

/-- The Fibonacci loop started at consecutive Fibonacci numbers advances the index by its fuel. -/
theorem fibAux_eq_nat_fib (k i : Nat) : fibAux k (Nat.fib i) (Nat.fib (i + 1)) = Nat.fib (i + k) := by
  induction k generalizing i with
  | zero => rfl
  | succ k ih =>
    rw [fibAux, ← Nat.fib_add_two, ih (i + 1)]
    congr 1
    omega

/-- `fibFusion` is the Fibonacci sequence `Nat.fib`: the fusion-space dimension of τ anyons. -/
theorem fibFusion_eq_nat_fib (n : Nat) : fibFusion n = Nat.fib n := by
  have h := fibAux_eq_nat_fib n 0
  rw [Nat.fib_zero, Nat.fib_one, Nat.zero_add] at h
  rw [fibFusion, seed_eq]
  exact h

/-- `qftGates` is the binomial coefficient `Nat.choose (q + 1) 2`: one gate per unordered pair, diagonal included. -/
theorem qftGates_eq_nat_choose (q : Nat) : qftGates q = (q + 1).choose 2 := by
  rw [qftGates, Nat.choose_two_right, Nat.add_sub_cancel, Nat.mul_comm]

/-- Mixing textbooks two at a time: `t` textbooks give `t * (t - 1) / 2` mixes, for every `t`. The count the nested
catalogue states for its textbooks is this law at their number. -/
theorem choose_two_eq_mixes (t : Nat) : choose t 2 = t * (t - 1) / 2 := by
  rw [choose_eq_nat_choose, Nat.choose_two_right]

/-- One more textbook mixes with every textbook already there: `choose (t + 1) 2 = choose t 2 + t`, for every `t`. -/
theorem choose_two_succ (t : Nat) : choose (t + 1) 2 = choose t 2 + t := by
  rw [choose_eq_nat_choose, choose_eq_nat_choose, Nat.choose_succ_succ, Nat.choose_one_right, Nat.add_comm]

/-- Twice the pairs of `t` things is `t * (t - 1)`, for every `t`: no division. -/
theorem two_mul_nat_choose_two (t : Nat) : 2 * t.choose 2 = t * (t - 1) := by
  cases t with
  | zero => rfl
  | succ m =>
    have h := Nat.add_one_mul_choose_eq m 1
    rw [Nat.choose_one_right] at h
    rw [Nat.add_sub_cancel, Nat.mul_comm 2, ← h]

/-- Six times the trinities of `t` things is `t * (t - 1) * (t - 2)`, for every `t`: no division. -/
theorem six_mul_nat_choose_three (t : Nat) : 6 * t.choose 3 = t * (t - 1) * (t - 2) := by
  cases t with
  | zero => rfl
  | succ m =>
    have h := Nat.add_one_mul_choose_eq m 2
    have h2 := two_mul_nat_choose_two m
    calc 6 * (m + 1).choose 3 = 2 * ((m + 1).choose 3 * 3) := by ring
      _ = 2 * ((m + 1) * m.choose 2) := by rw [← h]
      _ = (m + 1) * (2 * m.choose 2) := by ring
      _ = (m + 1) * (m * (m - 1)) := by rw [h2]
      _ = (m + 1) * (m + 1 - 1) * (m + 1 - 2) := by rw [Nat.add_sub_cancel, show m + 1 - 2 = m - 1 by omega]; ring

/-- Mixing textbooks in trinities, three at a time: six times the trinities of `t` textbooks is `t * (t - 1) * (t - 2)`,
for every `t`. The count the nested catalogue states for its textbooks is this law at their number. -/
theorem six_mul_choose_three_eq_trinities (t : Nat) : 6 * choose t 3 = t * (t - 1) * (t - 2) := by
  rw [choose_eq_nat_choose, six_mul_nat_choose_three]

/-- One more textbook joins every pair already there into a new trinity: `choose (t + 1) 3 = choose t 3 + choose t 2`,
for every `t`. Pairs and trinities are one ladder. -/
theorem choose_three_succ (t : Nat) : choose (t + 1) 3 = choose t 3 + choose t 2 := by
  rw [choose_eq_nat_choose, choose_eq_nat_choose, choose_eq_nat_choose, Nat.choose_succ_succ, Nat.add_comm]

/-- A trinity is formed by two pairs interacting as one: the two pairs share one member, and through it they are one.
Among `t` things, choose the member the pairs share and then the pair of the other two: `t * choose (t - 1) 2`
trinities. Every three things form three of them, one for each member the two pairs can share, so the trinities are
three times the triples, for every `t`. -/
theorem trinities_of_pairs (t : Nat) : t * choose (t - 1) 2 = 3 * choose t 3 := by
  rw [choose_eq_nat_choose, choose_eq_nat_choose]
  cases t with
  | zero => rfl
  | succ m => rw [Nat.add_sub_cancel, Nat.add_one_mul_choose_eq m 2, Nat.mul_comm]

/-- The two pairs of a trinity are two of the pairs there are, and they are different pairs: a trinity on `a`, the
shared `b`, and `c` is the pairs `{a, b}` and `{b, c}`, which differ exactly when `a` and `c` do. -/
theorem trinity_pairs_differ (a b c : Nat) (h : a ≠ c) : (a, b) ≠ (c, b) := by
  intro e
  exact h (congrArg Prod.fst e)

/-- Every pair lies in the trinities it forms with each other member: among `t` members a pair is in `t - 2` trinities,
so three times the trinities are the pairs times `t - 2`. No pair is left out and none is used more than another. -/
theorem pair_in_trinities (t : Nat) : 3 * t.choose 3 = (t - 2) * t.choose 2 := by
  have h3 := six_mul_nat_choose_three t
  have h2 := two_mul_nat_choose_two t
  have h : 2 * (3 * t.choose 3) = 2 * ((t - 2) * t.choose 2) := by
    calc 2 * (3 * t.choose 3) = 6 * t.choose 3 := by omega
      _ = t * (t - 1) * (t - 2) := h3
      _ = (t - 2) * (t * (t - 1)) := Nat.mul_comm _ _
      _ = (t - 2) * (2 * t.choose 2) := by rw [h2]
      _ = 2 * ((t - 2) * t.choose 2) := Nat.mul_left_comm _ _ _
  exact Nat.eq_of_mul_eq_mul_left (by decide) h

/-- The hexbit paired completely: its 4 qubits form 6 pairs and 4 trinities, each trinity holds 3 pairs, and each pair
lies in exactly 2 trinities. The trinities use every pair of the hexbit, each one equally. -/
theorem hexbit_paired_completely :
    hexbit = 4 ∧ choose hexbit 2 = 6 ∧ choose hexbit 3 = 4 ∧ choose hexbit 3 * choose 3 2 = 2 * choose hexbit 2 := by
  decide
