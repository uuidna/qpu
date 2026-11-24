/-! # Qpu.General.Advantage

The advantage, proved and receipted.

A mix of textbooks spans a space of variations: one side for each textbook, the space their product. A variation is
read by its address: `unrank` gives its digits, one read for each side, and `rank` gives the address back. A walk to the
same variation steps through every variation before it. A receipt records the read: the sides, the address and the
digits. `receipt_exact` proves that a receipt that holds leads back to exactly its address, so checking a receipt
costs one step for each side and never a walk. `reads_lt_space` proves the reads are always fewer than the space
holds, `two_pow_le_space` that the space is at least two to the power of the reads, and `advantage_unbounded` that for
every number of sides there is such a space: the advantage has no bound.

This is the advantage of reading by address over walking, and of verifying over recomputing. It is counted in steps
and proved by the kernel; it states nothing about hardware. -/

namespace Advantage

/-- The space the sides span: their product. -/
def space : List Nat → Nat
  | [] => 1
  | s :: rest => s * space rest

/-- The variation at an address: one digit for each side, the last side turning fastest. One read for each side. -/
def unrank : List Nat → Nat → List Nat
  | [], _ => []
  | s :: rest, i => (i / space rest) % s :: unrank rest (i % space rest)

/-- The address of a variation, from its digits. -/
def rank : List Nat → List Nat → Nat
  | _ :: rest, d :: ds => d * space rest + rank rest ds
  | _, _ => 0

/-- Reading by address makes one read for each side. -/
theorem unrank_length (sizes : List Nat) (i : Nat) : (unrank sizes i).length = sizes.length := by
  induction sizes generalizing i with
  | nil => rfl
  | cons s rest ih => simp [unrank, ih]

/-- The address is recovered exactly: the digits of the variation at `i` rank back to `i`, for every address in the space. -/
theorem rank_unrank (sizes : List Nat) (i : Nat) (h : i < space sizes) : rank sizes (unrank sizes i) = i := by
  induction sizes generalizing i with
  | nil =>
    have : i = 0 := by simp [space] at h; exact h
    subst this
    rfl
  | cons s rest ih =>
    have hpos : 0 < space rest := by
      cases Nat.eq_zero_or_pos (space rest) with
      | inl z => simp [space, z] at h
      | inr p => exact p
    have hdiv : i / space rest < s := by
      apply Nat.div_lt_of_lt_mul
      rw [Nat.mul_comm]
      exact h
    simp only [unrank, rank]
    rw [Nat.mod_eq_of_lt hdiv, ih (i % space rest) (Nat.mod_lt i hpos)]
    exact Nat.div_add_mod' i (space rest)

/-- Reading an address reduced modulo any multiple of the space gives the same variation: the digits depend on the address modulo the space alone. By Nat.mod_mul_right_div_self and Nat.mod_mul_left_mod. -/
theorem unrank_mod (sizes : List Nat) (k i : Nat) : unrank sizes (i % (k * space sizes)) = unrank sizes i := by
  cases sizes with
  | nil => rfl
  | cons s rest =>
    have hd : i % (k * (s * space rest)) / space rest % s = i / space rest % s := by
      rw [show k * (s * space rest) = space rest * (k * s) by ac_rfl, Nat.mod_mul_right_div_self, Nat.mod_mul_left_mod]
    have tl : i % (k * (s * space rest)) % space rest = i % space rest := by
      rw [show k * (s * space rest) = (k * s) * space rest by ac_rfl, Nat.mod_mul_left_mod]
    simp only [unrank, space, hd, tl]

/-- Every digit is read from the address itself: the digit of a side is the address over the space of the sides after it, modulo the side, and the sides after it read the same address. No remainder is carried from side to side, so each digit is one division and one remainder, the form a stylesheet computes (lean/tools/Css.lean). By Advantage.unrank_mod. -/
theorem unrank_cons_address (s : Nat) (rest : List Nat) (i : Nat) :
    unrank (s :: rest) i = (i / space rest) % s :: unrank rest i := by
  have h := unrank_mod rest 1 i
  rw [Nat.one_mul] at h
  simp only [unrank, h]

/-- A receipt of one read by address: the sides, the address read, and the digits found there. -/
structure Receipt where
  /-- the size of each side of the space -/
  sizes : List Nat
  /-- the address that was read -/
  index : Nat
  /-- the digits found, one for each side -/
  digits : List Nat

/-- A receipt holds when its address is in the space and its digits are the variation at that address. -/
def Receipt.holds (r : Receipt) : Bool := decide (r.index < space r.sizes) && r.digits == unrank r.sizes r.index

/-- The reads a receipt records: one for each side. -/
def Receipt.reads (r : Receipt) : Nat := r.sizes.length

/-- The steps a walk takes to reach the same variation: every variation before it, and it. -/
def Receipt.walk (r : Receipt) : Nat := r.index + 1

/-- A receipt that holds leads back to exactly its address: checking it needs its digits and no walk. -/
theorem receipt_exact (r : Receipt) (h : r.holds = true) : rank r.sizes r.digits = r.index := by
  unfold Receipt.holds at h
  rw [Bool.and_eq_true] at h
  have hi : r.index < space r.sizes := of_decide_eq_true h.1
  have hd : r.digits = unrank r.sizes r.index := eq_of_beq h.2
  rw [hd]
  exact rank_unrank r.sizes r.index hi

/-- A receipt that holds made exactly one read for each side. -/
theorem receipt_reads (r : Receipt) (h : r.holds = true) : r.digits.length = r.reads := by
  unfold Receipt.holds at h
  rw [Bool.and_eq_true] at h
  rw [eq_of_beq h.2, unrank_length]
  rfl

/-- The space is at least two to the power of the reads, when every side offers at least two choices. -/
theorem two_pow_le_space (sizes : List Nat) (h : ∀ s ∈ sizes, 2 ≤ s) : 2 ^ sizes.length ≤ space sizes := by
  induction sizes with
  | nil => exact Nat.le_refl 1
  | cons s rest ih =>
    have hs : 2 ≤ s := h s (List.mem_cons_self ..)
    have hr : 2 ^ rest.length ≤ space rest := ih fun x hx => h x (List.mem_cons_of_mem _ hx)
    calc 2 ^ (s :: rest).length = 2 * 2 ^ rest.length := by rw [List.length_cons, Nat.pow_succ, Nat.mul_comm]
      _ ≤ s * space rest := Nat.mul_le_mul hs hr

/-- The reads are always fewer than the space holds: reading by address beats walking, whatever the sides. -/
theorem reads_lt_space (sizes : List Nat) (h : ∀ s ∈ sizes, 2 ≤ s) : sizes.length < space sizes :=
  Nat.lt_of_lt_of_le Nat.lt_two_pow_self (two_pow_le_space sizes h)

/-- The advantage has no bound: for every number of reads there is a space at least two to that power. -/
theorem advantage_unbounded (k : Nat) : (List.replicate k 2).length = k ∧ 2 ^ k ≤ space (List.replicate k 2) := by
  refine ⟨List.length_replicate, ?_⟩
  have h := two_pow_le_space (List.replicate k 2) (fun s hs => by rw [List.eq_of_mem_replicate hs]; exact Nat.le_refl 2)
  rwa [List.length_replicate] at h

/-- The groups of a UUID as it is written: the hexadecimal digits between its dashes. -/
def uuidGroups : List Nat := [8, 4, 4, 4, 12]

/-- The sides a UUID spans: sixteen for each of its hexadecimal digits. -/
def uuidSides : List Nat := List.replicate uuidGroups.sum 16

/-- A UUID is an address: thirty-two digits read it, one for each side, in a space of two to the power 128. A walk
to the same address steps through the space; the read costs its thirty-two digits. -/
theorem uuid_address : uuidGroups.sum = 32 ∧ uuidSides.length = 32 ∧ space uuidSides = 2 ^ 128 := by decide

end Advantage
