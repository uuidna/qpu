import Qpu.Mint
import Qpu.Lattice

/-! # Qpu.Leads.FederatedLearning

Federated learning over a finite list of clients whose updates are integer vectors
(`Vec d := Fin d → Int`), formalised with Lean core only (no Mathlib, no reals).

What is formalised and kernel-checked:
* **Aggregation.** The coordinate-wise integer sum `sumV` and average `avgV`; the sum is
  linear over `++`, invariant under any permutation of the clients (order-independence of
  the server), and the average of identical updates is that update (unbiasedness).
* **Clipping.** `clipZ c` sends every integer into `[-c, c]`, is idempotent, is the identity
  on already-bounded values, and *detects* an out-of-range value exactly when it changes it.
  The aggregate of `n` clipped updates lies in `[-c·n, c·n]`, also for any sub-list of active
  clients (dropout), and every clipped update deviates from the clipped average by at most `2c`
  (a heterogeneity bound in place of a real-valued non-IID statement).
* **Secure aggregation.** A secret `s` is split into `k` additive shares
  `(s − Σ masks) :: masks`; the shares sum back to `s`, the server's sum over all clients'
  shares equals the sum of the secrets, and any `k − 1` of the `k` shares are consistent with
  every alternative secret (the combinatorial core of perfect secrecy; no probability is
  modelled). The traffic of the protocol is `clients · k` messages per round.
* **Byzantine resilience.** `median` and `trimmedMean` on `List Int` through core's
  `mergeSort`. If at most `f` values are outside the honest range `[lo, hi]` and `2f < n`
  (honest majority) then the median lies in `[lo, hi]`; so does every trimmed value and the
  trimmed mean. The federated statement uses the explicit bound `3 · malicious < clients`,
  coordinate-wise on vectors, plus a labelled lattice instance (`hexbit` of `faces` clients).
* **Noise.** Noise is an integer offset `e` with an explicit bound `|e| ≤ b`. Utility: the
  released aggregate is within `b` of the truth. Privacy: two aggregates at distance `≤ b` can
  release the same value, and a mechanism with bound `b` can only confuse aggregates at distance
  `≤ 2b` — the integer privacy/utility trade-off.
* **Compression.** Integer quantisation `x ↦ (x / q) · q` has error in `[0, q)`, and a clipped
  value quantises into `[(−c)/q, c/q]`.
* **Convergence.** A loss that halves each round reaches `0` within `k` rounds once it is below
  `mint k = 2^k` (`Qpu.Mint`), and within `L` rounds from loss `L`.

Deliberately **not** formalised (the sketch's real-valued axioms had no concrete content):
`(ε, δ)`-differential privacy, membership-inference and model-inversion "hardness",
generalisation gaps, and probabilistic poison detection. Detection here is deterministic
(the clip test). -/

namespace Qpu.Federated

/-! ## Integer vectors and sums -/

/-- A model update: an integer vector of dimension `d`. -/
abbrev Vec (d : Nat) := Fin d → Int

/-- Sum of a list of integers. -/
def sumZ : List Int → Int
  | [] => 0
  | x :: xs => x + sumZ xs

theorem sumZ_nil : sumZ [] = 0 := rfl
theorem sumZ_cons (x : Int) (xs : List Int) : sumZ (x :: xs) = x + sumZ xs := rfl

theorem sumZ_append (a b : List Int) : sumZ (a ++ b) = sumZ a + sumZ b := by
  induction a with
  | nil => simp [sumZ]
  | cons x xs ih => simp [sumZ, ih, Int.add_assoc]

/-- The sum does not depend on the order of the summands. -/
theorem sumZ_perm {a b : List Int} (h : a.Perm b) : sumZ a = sumZ b := by
  induction h with
  | nil => rfl
  | cons x _ ih => simp [sumZ, ih]
  | swap x y l => simp only [sumZ]; omega
  | trans _ _ ih₁ ih₂ => exact ih₁.trans ih₂

theorem sumZ_replicate (k : Nat) (x : Int) : sumZ (List.replicate k x) = x * k := by
  induction k with
  | zero => simp [sumZ]
  | succ k ih =>
    rw [List.replicate_succ, sumZ_cons, ih, Int.natCast_add, Int.natCast_one, Int.mul_add, Int.mul_one]
    omega

/-- Every element in `[lo, hi]` → the sum lies in `[lo·|l|, hi·|l|]`. -/
theorem sumZ_bounded (lo hi : Int) : ∀ (l : List Int), (∀ x ∈ l, lo ≤ x ∧ x ≤ hi) →
    lo * (l.length : Int) ≤ sumZ l ∧ sumZ l ≤ hi * (l.length : Int) := by
  intro l
  induction l with
  | nil => intro _; simp [sumZ]
  | cons x xs ih =>
    intro h
    have hx := h x (List.mem_cons.2 (Or.inl rfl))
    have hs := ih (fun y hy => h y (List.mem_cons_of_mem x hy))
    rw [sumZ_cons, List.length_cons, Int.natCast_add, Int.natCast_one, Int.mul_add, Int.mul_one,
      Int.mul_add, Int.mul_one]
    omega

/-- Integer average (floor division by the client count). -/
def avgZ (l : List Int) : Int := sumZ l / (l.length : Int)

/-- Every element in `[lo, hi]` → the average lies in `[lo, hi]`. -/
theorem avgZ_bounded (lo hi : Int) (l : List Int) (hpos : 0 < l.length)
    (h : ∀ x ∈ l, lo ≤ x ∧ x ≤ hi) : lo ≤ avgZ l ∧ avgZ l ≤ hi := by
  have hb := sumZ_bounded lo hi l h
  have hn : (0 : Int) < (l.length : Int) := by omega
  have hne : (l.length : Int) ≠ 0 := by omega
  constructor
  · have := Int.ediv_le_ediv hn hb.1
    rwa [Int.mul_ediv_cancel lo hne] at this
  · have := Int.ediv_le_ediv hn hb.2
    rwa [Int.mul_ediv_cancel hi hne] at this

/-- Averaging `k > 0` copies of `x` returns `x` exactly. -/
theorem avgZ_replicate (k : Nat) (hk : 0 < k) (x : Int) : avgZ (List.replicate k x) = x := by
  unfold avgZ
  rw [sumZ_replicate, List.length_replicate]
  exact Int.mul_ediv_cancel x (by omega)

def zeroV {d : Nat} : Vec d := fun _ => 0
def addV {d : Nat} (u v : Vec d) : Vec d := fun i => u i + v i
def subV {d : Nat} (u v : Vec d) : Vec d := fun i => u i - v i

/-- The `i`-th coordinates of a list of updates. -/
def coord {d : Nat} (i : Fin d) (us : List (Vec d)) : List Int := us.map (fun u => u i)

/-- The server's coordinate-wise sum of the updates. -/
def sumV {d : Nat} (us : List (Vec d)) : Vec d := fun i => sumZ (coord i us)

/-- Federated averaging: the coordinate-wise integer average. -/
def avgV {d : Nat} (us : List (Vec d)) : Vec d := fun i => avgZ (coord i us)

theorem sumV_nil {d : Nat} : sumV ([] : List (Vec d)) = zeroV := rfl
theorem sumV_cons {d : Nat} (u : Vec d) (us : List (Vec d)) : sumV (u :: us) = addV u (sumV us) := rfl

/-- Aggregation is linear over concatenation: the server may aggregate in batches. -/
theorem sumV_append {d : Nat} (us vs : List (Vec d)) : sumV (us ++ vs) = addV (sumV us) (sumV vs) := by
  funext i
  show sumZ (coord i (us ++ vs)) = sumZ (coord i us) + sumZ (coord i vs)
  simp only [coord, List.map_append, sumZ_append]

/-- Aggregation is order-independent: any arrival order of the clients gives the same sum. -/
theorem sumV_perm {d : Nat} {us vs : List (Vec d)} (h : us.Perm vs) : sumV us = sumV vs := by
  funext i
  exact sumZ_perm (h.map _)

/-- Unbiasedness: averaging `k > 0` identical updates returns that update. -/
theorem avgV_replicate {d : Nat} (k : Nat) (hk : 0 < k) (u : Vec d) : avgV (List.replicate k u) = u := by
  funext i
  simp only [avgV, coord, List.map_replicate]
  exact avgZ_replicate k hk (u i)

/-- Coordinate-wise bounded updates average to a coordinate-wise bounded vector. -/
theorem avgV_bounded {d : Nat} (lo hi : Int) (us : List (Vec d)) (hpos : 0 < us.length) (i : Fin d)
    (h : ∀ u ∈ us, lo ≤ u i ∧ u i ≤ hi) : lo ≤ avgV us i ∧ avgV us i ≤ hi := by
  apply avgZ_bounded lo hi (coord i us) (by simp only [coord, List.length_map]; exact hpos)
  intro x hx
  simp only [coord, List.mem_map] at hx
  obtain ⟨u, hu, rfl⟩ := hx
  exact h u hu

/-! ## Clipping -/

/-- Clip an integer into `[-c, c]`. -/
def clipZ (c : Nat) (x : Int) : Int :=
  if x < -(c : Int) then -(c : Int) else if (c : Int) < x then c else x

theorem clipZ_bounded (c : Nat) (x : Int) : -(c : Int) ≤ clipZ c x ∧ clipZ c x ≤ c := by
  unfold clipZ; split <;> (try split) <;> omega

theorem clipZ_of_bounded (c : Nat) (x : Int) (h : -(c : Int) ≤ x ∧ x ≤ c) : clipZ c x = x := by
  unfold clipZ; split <;> (try split) <;> omega

theorem clipZ_idem (c : Nat) (x : Int) : clipZ c (clipZ c x) = clipZ c x :=
  clipZ_of_bounded c _ (clipZ_bounded c x)

/-- Deterministic detection: the clip changes a value exactly when it is out of range. -/
theorem clipZ_ne_iff (c : Nat) (x : Int) : clipZ c x ≠ x ↔ (x < -(c : Int) ∨ (c : Int) < x) := by
  unfold clipZ; split <;> (try split) <;> omega

/-- Clip every coordinate of an update. -/
def clipV {d : Nat} (c : Nat) (u : Vec d) : Vec d := fun i => clipZ c (u i)

theorem clipV_bounded {d : Nat} (c : Nat) (u : Vec d) (i : Fin d) :
    -(c : Int) ≤ clipV c u i ∧ clipV c u i ≤ c := clipZ_bounded c (u i)

theorem clipV_idem {d : Nat} (c : Nat) (u : Vec d) : clipV c (clipV c u) = clipV c u := by
  funext i; exact clipZ_idem c (u i)

theorem mem_map_clipV_bounded {d : Nat} (c : Nat) (us : List (Vec d)) (i : Fin d) :
    ∀ x ∈ coord i (us.map (clipV c)), -(c : Int) ≤ x ∧ x ≤ c := by
  intro x hx
  simp only [coord, List.mem_map] at hx
  obtain ⟨v, hv, rfl⟩ := hx
  obtain ⟨u, _, rfl⟩ := hv
  exact clipZ_bounded c (u i)

/-- The aggregate of `n` clipped updates lies in `[-c·n, c·n]`, in every coordinate. -/
theorem clipped_sum_bounded {d : Nat} (c : Nat) (us : List (Vec d)) (i : Fin d) :
    -((c : Int) * us.length) ≤ sumV (us.map (clipV c)) i ∧
      sumV (us.map (clipV c)) i ≤ (c : Int) * us.length := by
  have h := sumZ_bounded (-(c : Int)) c _ (mem_map_clipV_bounded c us i)
  simp only [coord, List.length_map] at h
  rw [Int.neg_mul] at h
  exact h

/-- Dropout: aggregating any sub-list of active clients keeps the bound of the full cohort. -/
theorem dropout_sum_bounded {d : Nat} (c : Nat) (us active : List (Vec d)) (hsub : active.Sublist us)
    (i : Fin d) :
    -((c : Int) * us.length) ≤ sumV (active.map (clipV c)) i ∧
      sumV (active.map (clipV c)) i ≤ (c : Int) * us.length := by
  have h := clipped_sum_bounded c active i
  have hle : (c : Int) * active.length ≤ (c : Int) * us.length :=
    Int.mul_le_mul_of_nonneg_left (by have := hsub.length_le; omega) (by omega)
  omega

/-- The clipped average is bounded by the clip. -/
theorem clipped_avg_bounded {d : Nat} (c : Nat) (us : List (Vec d)) (hpos : 0 < us.length) (i : Fin d) :
    -(c : Int) ≤ avgV (us.map (clipV c)) i ∧ avgV (us.map (clipV c)) i ≤ c := by
  apply avgZ_bounded (-(c : Int)) c (coord i (us.map (clipV c)))
    (by simp only [coord, List.length_map]; exact hpos)
  exact mem_map_clipV_bounded c us i

/-- Heterogeneity bound (in place of a real-valued non-IID statement): every clipped update
deviates from the clipped average by at most `2c` in every coordinate. -/
theorem heterogeneity_bounded {d : Nat} (c : Nat) (us : List (Vec d)) (hpos : 0 < us.length)
    (u : Vec d) (i : Fin d) :
    -(2 * (c : Int)) ≤ clipV c u i - avgV (us.map (clipV c)) i ∧
      clipV c u i - avgV (us.map (clipV c)) i ≤ 2 * c := by
  have h1 := clipV_bounded c u i
  have h2 := clipped_avg_bounded c us hpos i
  omega

/-! ## Secure aggregation by additive shares -/

/-- Split a secret into `ms.length + 1` additive shares: the masks, and the secret minus their sum. -/
def shares {d : Nat} (s : Vec d) (ms : List (Vec d)) : List (Vec d) := subV s (sumV ms) :: ms

theorem shares_length {d : Nat} (s : Vec d) (ms : List (Vec d)) : (shares s ms).length = ms.length + 1 := rfl

/-- The shares sum back to the secret. -/
theorem sumV_shares {d : Nat} (s : Vec d) (ms : List (Vec d)) : sumV (shares s ms) = s := by
  funext i
  simp only [sumV, coord, shares, List.map_cons, sumZ_cons, subV]
  omega

/-- The masks are chosen independently of the secret: the tail of the sharing never depends on `s`. -/
theorem shares_tail_independent {d : Nat} (s s' : Vec d) (ms : List (Vec d)) :
    (shares s ms).tail = (shares s' ms).tail := rfl

/-- Hiding one mask: whatever the observed head share and the other masks, every alternative
secret `s'` admits a mask `m'` reproducing exactly those observed shares. Together with
`shares_tail_independent` this is: any `k − 1` of `k` shares are consistent with every secret. -/
theorem shares_consistent {d : Nat} (s s' m : Vec d) (ms : List (Vec d)) :
    ∃ m' : Vec d, (shares s' (m' :: ms)).head? = (shares s (m :: ms)).head? ∧
      (shares s' (m' :: ms)).tail.tail = (shares s (m :: ms)).tail.tail := by
  refine ⟨addV m (subV s' s), ?_, rfl⟩
  simp only [shares, List.head?]
  congr 1
  funext i
  simp only [subV, addV, sumV, coord, List.map_cons, sumZ_cons]
  omega

/-- Two clients with one pairwise mask: `(u + m) + (v − m) = u + v`. -/
theorem pairwise_mask_cancels {d : Nat} (u v m : Vec d) : addV (addV u m) (subV v m) = addV u v := by
  funext i; simp only [addV, subV]; omega

/-- The server's view: it sums every share of every client. -/
def secureAggregate {d : Nat} (cs : List (Vec d × List (Vec d))) : Vec d :=
  sumV (cs.flatMap (fun c => shares c.1 c.2))

/-- Correctness of secure aggregation: the sum of all shares is the sum of the secrets. -/
theorem secureAggregate_eq {d : Nat} (cs : List (Vec d × List (Vec d))) :
    secureAggregate cs = sumV (cs.map Prod.fst) := by
  induction cs with
  | nil => rfl
  | cons c cs ih =>
    simp only [secureAggregate] at ih ⊢
    rw [List.flatMap_cons, sumV_append, sumV_shares, ih, List.map_cons, sumV_cons]

/-- Traffic: with `k` shares per client, one round carries `clients · k` share messages. -/
theorem shares_traffic {d : Nat} (k : Nat) : ∀ (cs : List (Vec d × List (Vec d))),
    (∀ c ∈ cs, c.2.length + 1 = k) → (cs.flatMap (fun c => shares c.1 c.2)).length = cs.length * k := by
  intro cs
  induction cs with
  | nil => intro _; simp
  | cons c cs ih =>
    intro h
    rw [List.flatMap_cons, List.length_append, shares_length, h c (List.mem_cons.2 (Or.inl rfl)),
      ih (fun c' hc' => h c' (List.mem_cons_of_mem c hc')), List.length_cons, Nat.add_mul, Nat.one_mul]
    omega

def messagesPerRound (clients k : Nat) : Nat := clients * k
def totalMessages (rounds clients k : Nat) : Nat := rounds * messagesPerRound clients k

/-- Communication lower bound: `rounds · clients` messages at least, whatever the share count `k ≥ 1`. -/
theorem communication_lower_bound (rounds clients k : Nat) (hk : 0 < k) :
    rounds * clients ≤ totalMessages rounds clients k := by
  unfold totalMessages messagesPerRound
  rw [← Nat.mul_assoc]
  exact Nat.le_mul_of_pos_right _ hk

/-! ## Byzantine resilience: median and trimmed mean -/

/-- Sort integers ascending (core `mergeSort`). -/
def sortZ (l : List Int) : List Int := l.mergeSort (fun a b => decide (a ≤ b))

theorem sortZ_perm (l : List Int) : (sortZ l).Perm l := List.mergeSort_perm l _
theorem sortZ_length (l : List Int) : (sortZ l).length = l.length := List.length_mergeSort l

theorem sortZ_sorted (l : List Int) : (sortZ l).Pairwise (· ≤ ·) := by
  have h := List.pairwise_mergeSort (le := fun a b : Int => decide (a ≤ b))
    (fun a b c hab hbc => by simp only [decide_eq_true_eq] at hab hbc ⊢; omega)
    (fun a b => by simp only [Bool.or_eq_true, decide_eq_true_eq]; omega) l
  exact h.imp (fun hab => of_decide_eq_true hab)

/-- In a sorted list, if at most `k` values are below `lo`, the `k`-th value is at least `lo`. -/
theorem sorted_lower {s : List Int} (hs : s.Pairwise (· ≤ ·)) (lo : Int) {k : Nat} (hk : k < s.length)
    (hc : s.countP (fun x => decide (x < lo)) ≤ k) : lo ≤ s[k] := by
  apply Int.not_lt.mp
  intro hlt
  have hpw := List.pairwise_iff_getElem.mp hs
  have hpre : ∀ x ∈ s.take k, decide (x < lo) = true := by
    intro x hx
    obtain ⟨j, hj, rfl⟩ := List.mem_iff_getElem.mp hx
    rw [List.getElem_take]
    have hjk : j < k := by simp only [List.length_take] at hj; omega
    have := hpw j k (by omega) hk hjk
    exact decide_eq_true (by omega)
  have hlen : (s.take k).length = k := by simp only [List.length_take]; omega
  have hdecomp : s.take k ++ (s[k] :: s.drop (k + 1)) = s := by
    rw [← List.drop_eq_getElem_cons hk, List.take_append_drop]
  have hcount := List.countP_append (p := fun x => decide (x < lo)) (l₁ := s.take k)
    (l₂ := s[k] :: s.drop (k + 1))
  rw [hdecomp] at hcount
  rw [List.countP_eq_length.mpr hpre, hlen,
    List.countP_cons_of_pos (p := fun x => decide (x < lo)) (decide_eq_true hlt)] at hcount
  omega

/-- In a sorted list of length `n`, if at most `n − 1 − k` values exceed `hi`, the `k`-th value is at most `hi`. -/
theorem sorted_upper {s : List Int} (hs : s.Pairwise (· ≤ ·)) (hi : Int) {k : Nat} (hk : k < s.length)
    (hc : s.countP (fun x => decide (hi < x)) ≤ s.length - 1 - k) : s[k] ≤ hi := by
  apply Int.not_lt.mp
  intro hlt
  have hpw := List.pairwise_iff_getElem.mp hs
  have hsuf : ∀ x ∈ s.drop (k + 1), decide (hi < x) = true := by
    intro x hx
    obtain ⟨j, hj, rfl⟩ := List.mem_iff_getElem.mp hx
    rw [List.getElem_drop]
    have hj' : k + 1 + j < s.length := by simp only [List.length_drop] at hj; omega
    have := hpw k (k + 1 + j) hk hj' (by omega)
    exact decide_eq_true (by omega)
  have hlen : (s.drop (k + 1)).length = s.length - (k + 1) := List.length_drop
  have hdecomp : s.take k ++ (s[k] :: s.drop (k + 1)) = s := by
    rw [← List.drop_eq_getElem_cons hk, List.take_append_drop]
  have hcount := List.countP_append (p := fun x => decide (hi < x)) (l₁ := s.take k)
    (l₂ := s[k] :: s.drop (k + 1))
  rw [hdecomp] at hcount
  rw [List.countP_cons_of_pos (p := fun x => decide (hi < x)) (decide_eq_true hlt),
    List.countP_eq_length.mpr hsuf, hlen] at hcount
  omega

/-- The median: the middle element of the sorted list (`0` for the empty list). -/
def median (l : List Int) : Int := (sortZ l).getD (l.length / 2) 0

theorem median_eq_getElem (l : List Int) (hpos : 0 < l.length) :
    median l = (sortZ l)[l.length / 2]'(by rw [sortZ_length]; omega) := by
  have hk : l.length / 2 < (sortZ l).length := by rw [sortZ_length]; omega
  unfold median
  rw [List.getD_eq_getElem?_getD, List.getElem?_eq_getElem hk]
  rfl

/-- Honest majority: at most `f` values below `lo`, at most `f` above `hi`, `2f < n` →
the median lies in `[lo, hi]`. -/
theorem median_bounded (l : List Int) (lo hi : Int) (f : Nat) (hpos : 0 < l.length)
    (hlo : l.countP (fun x => decide (x < lo)) ≤ f) (hhi : l.countP (fun x => decide (hi < x)) ≤ f)
    (hf : 2 * f < l.length) : lo ≤ median l ∧ median l ≤ hi := by
  have hk : l.length / 2 < (sortZ l).length := by rw [sortZ_length]; omega
  have hs := sortZ_sorted l
  have hperm := sortZ_perm l
  have hlen := sortZ_length l
  rw [median_eq_getElem l hpos]
  constructor
  · apply sorted_lower hs lo hk
    rw [List.Perm.countP_eq _ hperm]; omega
  · apply sorted_upper hs hi hk
    rw [List.Perm.countP_eq _ hperm, hlen]; omega

/-- Drop the `f` smallest and `f` largest values. -/
def trimmed (f : Nat) (l : List Int) : List Int := ((sortZ l).drop f).take (l.length - 2 * f)

theorem trimmed_length (f : Nat) (l : List Int) (hf : 2 * f ≤ l.length) :
    (trimmed f l).length = l.length - 2 * f := by
  simp only [trimmed, List.length_take, List.length_drop, sortZ_length]; omega

/-- Every trimmed value lies in the honest range when at most `f` values lie on either side and `2f < n`. -/
theorem trimmed_mem_bounded (l : List Int) (lo hi : Int) (f : Nat)
    (hlo : l.countP (fun x => decide (x < lo)) ≤ f) (hhi : l.countP (fun x => decide (hi < x)) ≤ f)
    (hf : 2 * f < l.length) : ∀ x ∈ trimmed f l, lo ≤ x ∧ x ≤ hi := by
  intro x hx
  have hs := sortZ_sorted l
  have hperm := sortZ_perm l
  have hlen := sortZ_length l
  obtain ⟨j, hj, rfl⟩ := List.mem_iff_getElem.mp hx
  have hj' := hj
  simp only [trimmed, List.length_take, List.length_drop, sortZ_length] at hj'
  have hjf : f + j < (sortZ l).length := by rw [hlen]; omega
  have hx' : (trimmed f l)[j] = (sortZ l)[f + j]'hjf := by
    simp only [trimmed, List.getElem_take, List.getElem_drop]
  rw [hx']
  exact ⟨sorted_lower hs lo hjf (by rw [List.Perm.countP_eq _ hperm]; omega),
    sorted_upper hs hi hjf (by rw [List.Perm.countP_eq _ hperm, hlen]; omega)⟩

/-- The trimmed mean: the integer average of the trimmed values. -/
def trimmedMean (f : Nat) (l : List Int) : Int := avgZ (trimmed f l)

theorem trimmedMean_bounded (l : List Int) (lo hi : Int) (f : Nat)
    (hlo : l.countP (fun x => decide (x < lo)) ≤ f) (hhi : l.countP (fun x => decide (hi < x)) ≤ f)
    (hf : 2 * f < l.length) : lo ≤ trimmedMean f l ∧ trimmedMean f l ≤ hi :=
  avgZ_bounded lo hi _ (by rw [trimmed_length f l (by omega)]; omega)
    (trimmed_mem_bounded l lo hi f hlo hhi hf)

/-- The Byzantine test: a value is suspicious when it leaves the honest range `[lo, hi]`. -/
def outside (lo hi x : Int) : Bool := decide (x < lo) || decide (hi < x)

theorem countP_lt_le_outside (l : List Int) (lo hi : Int) :
    l.countP (fun x => decide (x < lo)) ≤ l.countP (outside lo hi) :=
  List.countP_mono_left (fun x _ h => by simp only [outside, Bool.or_eq_true]; exact Or.inl h)

theorem countP_gt_le_outside (l : List Int) (lo hi : Int) :
    l.countP (fun x => decide (hi < x)) ≤ l.countP (outside lo hi) :=
  List.countP_mono_left (fun x _ h => by simp only [outside, Bool.or_eq_true]; exact Or.inr h)

/-- Byzantine resilience of the median: at most `malicious` values outside the honest range and
`3 · malicious < clients` → the median is honest. -/
theorem byzantine_median (l : List Int) (lo hi : Int) (malicious : Nat) (hpos : 0 < l.length)
    (hbad : l.countP (outside lo hi) ≤ malicious) (hf : 3 * malicious < l.length) :
    lo ≤ median l ∧ median l ≤ hi :=
  median_bounded l lo hi malicious hpos
    (Nat.le_trans (countP_lt_le_outside l lo hi) hbad)
    (Nat.le_trans (countP_gt_le_outside l lo hi) hbad) (by omega)

/-- Byzantine resilience of the trimmed mean under the same explicit bound. -/
theorem byzantine_trimmedMean (l : List Int) (lo hi : Int) (malicious : Nat)
    (hbad : l.countP (outside lo hi) ≤ malicious) (hf : 3 * malicious < l.length) :
    lo ≤ trimmedMean malicious l ∧ trimmedMean malicious l ≤ hi :=
  trimmedMean_bounded l lo hi malicious
    (Nat.le_trans (countP_lt_le_outside l lo hi) hbad)
    (Nat.le_trans (countP_gt_le_outside l lo hi) hbad) (by omega)

/-- Coordinate-wise median of the updates. -/
def medianV {d : Nat} (us : List (Vec d)) : Vec d := fun i => median (coord i us)

/-- An update is honest when every coordinate lies in the box `[lo i, hi i]`. -/
def inBox {d : Nat} (lo hi u : Vec d) : Bool := decide (∀ i, lo i ≤ u i ∧ u i ≤ hi i)

/-- Federated Byzantine resilience: with at most `malicious` dishonest updates among the clients
and `3 · malicious < clients`, the coordinate-wise median is honest in every coordinate. -/
theorem byzantine_medianV {d : Nat} (us : List (Vec d)) (lo hi : Vec d) (malicious : Nat)
    (hpos : 0 < us.length) (hbad : us.countP (fun u => !inBox lo hi u) ≤ malicious)
    (hf : 3 * malicious < us.length) : ∀ i, lo i ≤ medianV us i ∧ medianV us i ≤ hi i := by
  intro i
  apply byzantine_median (coord i us) (lo i) (hi i) malicious
    (by simp only [coord, List.length_map]; exact hpos) _
    (by simp only [coord, List.length_map]; exact hf)
  simp only [coord, List.countP_map]
  refine Nat.le_trans (List.countP_mono_left ?_) hbad
  intro u _ hu
  simp only [Function.comp, outside, Bool.or_eq_true, decide_eq_true_eq] at hu
  cases hbox : inBox lo hi u with
  | false => rfl
  | true =>
    exfalso
    unfold inBox at hbox
    have h := of_decide_eq_true hbox i
    omega

/-- Labelled lattice instance: `faces = 14` clients tolerate `hexbit = 4` malicious ones, `3·4 < 14`. -/
theorem lattice_instance : 3 * hexbit < faces := by decide

theorem byzantine_lattice (l : List Int) (lo hi : Int) (hlen : l.length = faces)
    (hbad : l.countP (outside lo hi) ≤ hexbit) : lo ≤ median l ∧ median l ≤ hi :=
  byzantine_median l lo hi hexbit (by rw [hlen]; decide) hbad (by rw [hlen]; exact lattice_instance)

/-! ## Noise as a bounded integer offset -/

/-- Utility: releasing `a + e` with `|e| ≤ b` errs by at most `b`. -/
theorem noised_utility (a e : Int) (b : Nat) (he : -(b : Int) ≤ e ∧ e ≤ b) :
    -(b : Int) ≤ (a + e) - a ∧ (a + e) - a ≤ b := by omega

/-- Privacy: two aggregates at distance `≤ b` can release the same value. -/
theorem noised_privacy (a a' : Int) (b : Nat) (h : -(b : Int) ≤ a - a' ∧ a - a' ≤ b) :
    ∃ e e' : Int, (-(b : Int) ≤ e ∧ e ≤ b) ∧ (-(b : Int) ≤ e' ∧ e' ≤ b) ∧ a + e = a' + e' :=
  ⟨0, a - a', by omega, h, by omega⟩

/-- Trade-off: a mechanism with noise bound `b` (hence utility error `≤ b`) can only make two
aggregates indistinguishable when they are within `2b` of each other. -/
theorem privacy_utility_tradeoff (a a' e e' : Int) (b : Nat)
    (he : -(b : Int) ≤ e ∧ e ≤ b) (he' : -(b : Int) ≤ e' ∧ e' ≤ b) (hcoll : a + e = a' + e') :
    -(2 * (b : Int)) ≤ a - a' ∧ a - a' ≤ 2 * b := by omega

/-- The noised clipped aggregate lies in `[-(c·n + b), c·n + b]`. -/
theorem noised_clipped_bounded {d : Nat} (c b : Nat) (us : List (Vec d)) (i : Fin d) (e : Int)
    (he : -(b : Int) ≤ e ∧ e ≤ b) :
    -((c : Int) * us.length + b) ≤ sumV (us.map (clipV c)) i + e ∧
      sumV (us.map (clipV c)) i + e ≤ (c : Int) * us.length + b := by
  have := clipped_sum_bounded c us i
  omega

/-! ## Compression by integer quantisation -/

def quantize (q : Nat) (x : Int) : Int := x / (q : Int)
def dequantize (q : Nat) (y : Int) : Int := y * (q : Int)

/-- Quantisation error lies in `[0, q)`. -/
theorem quantization_error (q : Nat) (hq : 0 < q) (x : Int) :
    0 ≤ x - dequantize q (quantize q x) ∧ x - dequantize q (quantize q x) < q := by
  have h1 := Int.emod_nonneg x (b := (q : Int)) (by omega)
  have h2 := Int.emod_lt_of_pos x (b := (q : Int)) (by omega)
  have h3 := Int.emod_def x (q : Int)
  unfold dequantize quantize
  rw [Int.mul_comm] at h3
  omega

/-- A clipped value quantises into the finite range `[(−c)/q, c/q]` (the compression levels). -/
theorem quantize_clipped_bounded (q c : Nat) (hq : 0 < q) (x : Int) :
    (-(c : Int)) / q ≤ quantize q (clipZ c x) ∧ quantize q (clipZ c x) ≤ (c : Int) / q := by
  have hb := clipZ_bounded c x
  have hq' : (0 : Int) < q := by omega
  exact ⟨Int.ediv_le_ediv hq' hb.1, Int.ediv_le_ediv hq' hb.2⟩

/-! ## Convergence of a halving loss -/

/-- `r` rounds of halving the loss. -/
def halve : Nat → Nat → Nat
  | 0, L => L
  | r + 1, L => halve r (L / 2)

theorem halve_le (r L : Nat) : halve r L ≤ L := by
  induction r generalizing L with
  | zero => exact Nat.le_refl L
  | succ r ih => exact Nat.le_trans (ih (L / 2)) (Nat.div_le_self L 2)

/-- A loss below `mint r = 2^r` reaches `0` within `r` halving rounds. -/
theorem halving_converges (r : Nat) : ∀ L, L < mint r → halve r L = 0 := by
  induction r with
  | zero => intro L h; rw [mintOf_zero] at h; show L = 0; omega
  | succ r ih => intro L h; rw [mintOf_succ] at h; exact ih (L / 2) (by omega)

theorem lt_mintOf_self (L : Nat) : L < mint L := by
  induction L with
  | zero => rw [mintOf_zero]; exact Nat.zero_lt_one
  | succ L ih => rw [mintOf_succ]; omega

/-- Rounds needed: from loss `L`, `L` rounds suffice. -/
theorem rounds_suffice (L : Nat) : halve L L = 0 := halving_converges L L (lt_mintOf_self L)

end Qpu.Federated
