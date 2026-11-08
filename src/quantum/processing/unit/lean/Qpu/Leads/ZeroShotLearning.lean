import Qpu.Mint
import Qpu.Lattice

/-! # Qpu.Leads.ZeroShotLearning

Zero-shot classification over a finite list of classes, each described by a
binary attribute vector (`List Bool`).

What is formalised (everything is computable and kernel-checked, no axioms):

* `agree` — the compatibility score, Hamming agreement between a query and a
  class's attribute vector; `dot` — the dot product on natural-valued attribute
  vectors, with the binary indicator lift bounded by `agree`.
* `best` / `predict` — the maximum score over a candidate list and the argmax
  (earliest class wins a tie). `predict` is total on non-empty lists, returns a
  member, attains `best`, and dominates every candidate.
* Exact match: a class whose attribute vector equals the query attains the
  maximum, so the predicted class ties with it; with uniform attribute length
  the predicted class carries the query's vector, and with distinct vectors it
  *is* that class.
* Separation: equal attribute vectors are indistinguishable by every query;
  distinct vectors of equal length are separated by the class's own vector.
* Triangle inequality for agreement (`agree_triangle`) and the honest
  replacement of the sketch's "semantic transitivity".
* Pigeonhole: `dim` binary attributes distinguish at most `mint dim = 2^dim`
  classes (`distinct_le_mint`), via the binary code of a vector; the bound is
  sharp (`allVecs`), and specialised to the lattice (`vertices = mint n`).
* Seen/unseen split by a predicate: disjoint and covering by construction, and
  a zero-shot prediction over the unseen list is unchanged when a seen class is
  added to the pool.

What is deliberately not formalised: real-valued embeddings, cosine similarity,
learned compatibility functions, probabilities, or any statement with a
numerical "confidence" constant. The sketch's theorems of the form
"∃ r : ℝ, r = 0.7 ∧ r > 0.5" carried no content about zero-shot learning and
are replaced by the discrete properties above. -/

namespace Qpu.ZeroShot

/-- An attribute vector: one Boolean per attribute. -/
abbrev Attr := List Bool

/-- A class: an identifier and its attribute description. -/
structure Class where
  id : Nat
  attr : Attr
deriving Repr, DecidableEq

/-! ## Compatibility scores -/

/-- Hamming agreement over the common prefix of two attribute vectors. -/
def agree : Attr → Attr → Nat
  | [], _ => 0
  | _ :: _, [] => 0
  | a :: as, b :: bs => (if a = b then 1 else 0) + agree as bs

/-- Dot product of natural-valued attribute vectors (common prefix). -/
def dot : List Nat → List Nat → Nat
  | [], _ => 0
  | _ :: _, [] => 0
  | a :: as, b :: bs => a * b + dot as bs

/-- The 0/1 lift of a Boolean attribute vector. -/
def indicator (v : Attr) : List Nat := v.map (fun b => if b then 1 else 0)

theorem agree_nil_right (a : Attr) : agree a [] = 0 := by
  cases a <;> rfl

theorem agree_comm (a b : Attr) : agree a b = agree b a := by
  induction a generalizing b with
  | nil => rw [agree_nil_right]; rfl
  | cons x xs ih =>
    cases b with
    | nil => rfl
    | cons y ys => cases x <;> cases y <;> simp [agree, ih]

theorem agree_self (a : Attr) : agree a a = a.length := by
  induction a with
  | nil => rfl
  | cons x xs ih => simp [agree, ih, Nat.add_comm]

theorem agree_le_length_left (a b : Attr) : agree a b ≤ a.length := by
  induction a generalizing b with
  | nil => exact Nat.le_refl 0
  | cons x xs ih =>
    cases b with
    | nil => simp [agree]
    | cons y ys =>
      have := ih ys
      simp only [agree, List.length_cons]
      split <;> omega

theorem agree_le_length_right (a b : Attr) : agree a b ≤ b.length := by
  rw [agree_comm]; exact agree_le_length_left b a

/-- Full agreement of equal-length vectors is equality. -/
theorem agree_eq_length_iff (a b : Attr) (h : a.length = b.length) :
    agree a b = a.length ↔ a = b := by
  induction a generalizing b with
  | nil => cases b with
    | nil => simp [agree]
    | cons y ys => simp at h
  | cons x xs ih =>
    cases b with
    | nil => simp at h
    | cons y ys =>
      simp only [List.length_cons, Nat.add_right_cancel_iff] at h
      have hle := agree_le_length_left xs ys
      have hiff := ih ys h
      cases x <;> cases y <;> simp [agree] <;> (try rw [← hiff]) <;> omega

theorem agree_lt_of_ne (a b : Attr) (h : a.length = b.length) (hne : a ≠ b) :
    agree a b < a.length := by
  have hle := agree_le_length_left a b
  have : agree a b ≠ a.length := fun h' => hne ((agree_eq_length_iff a b h).mp h')
  omega

/-- Two vectors agreeing with a third: the triangle inequality for Hamming distance,
written for agreement (`n - agree` is the distance). -/
theorem agree_triangle (a b c : Attr) (hab : a.length = b.length) (hbc : b.length = c.length) :
    agree a b + agree b c ≤ a.length + agree a c := by
  induction a generalizing b c with
  | nil =>
    cases b with
    | nil => cases c with
      | nil => simp [agree]
      | cons _ _ => simp at hbc
    | cons _ _ => simp at hab
  | cons x xs ih =>
    cases b with
    | nil => simp at hab
    | cons y ys =>
      cases c with
      | nil => simp at hbc
      | cons z zs =>
        simp only [List.length_cons, Nat.add_right_cancel_iff] at hab hbc
        have := ih ys zs hab hbc
        cases x <;> cases y <;> cases z <;> simp [agree] <;> omega

/-- Honest replacement of the sketch's "semantic transitivity": if `a` agrees with `b`
and `b` with `c` on all but `k` attributes each, then `a` agrees with `c` on all but
`2k`. (The sketch asserted `0.8, 0.8 → 0.6` for undefined real similarities.) -/
theorem semantic_transitivity (a b c : Attr) (k : Nat)
    (hab : a.length = b.length) (hbc : b.length = c.length)
    (h1 : a.length ≤ agree a b + k) (h2 : a.length ≤ agree b c + k) :
    a.length ≤ agree a c + 2 * k := by
  have := agree_triangle a b c hab hbc
  omega

/-- The dot product of indicator vectors counts shared `true` attributes, which are
in particular agreements. -/
theorem dot_indicator_le_agree (a b : Attr) : dot (indicator a) (indicator b) ≤ agree a b := by
  induction a generalizing b with
  | nil => simp [indicator, dot]
  | cons x xs ih =>
    cases b with
    | nil => simp [indicator, dot, agree]
    | cons y ys =>
      have := ih ys
      cases x <;> cases y <;> simp [indicator, dot, agree] at this ⊢ <;> omega

theorem dot_comm (a b : List Nat) : dot a b = dot b a := by
  induction a generalizing b with
  | nil => cases b <;> rfl
  | cons x xs ih =>
    cases b with
    | nil => rfl
    | cons y ys => simp [dot, ih, Nat.mul_comm]

/-! ## Scores, maximum, argmax -/

/-- Compatibility of a query with a class. -/
def score (q : Attr) (c : Class) : Nat := agree q c.attr

/-- The best score over a candidate list (`0` on the empty list). -/
def best (q : Attr) : List Class → Nat
  | [] => 0
  | c :: cs => max (score q c) (best q cs)

/-- Argmax over a candidate list; on a tie the earlier class wins. -/
def predict (q : Attr) : List Class → Option Class
  | [] => none
  | c :: cs =>
    match predict q cs with
    | none => some c
    | some d => if score q c < score q d then some d else some c

theorem score_of_attr_eq (q : Attr) {c d : Class} (h : c.attr = d.attr) : score q c = score q d := by
  simp [score, h]

theorem score_le_length (q : Attr) (c : Class) : score q c ≤ q.length :=
  agree_le_length_left q c.attr

theorem score_exact (q : Attr) {c : Class} (h : c.attr = q) : score q c = q.length := by
  rw [score, h, agree_self]

theorem best_ge_score (q : Attr) {c : Class} {cs : List Class} (h : c ∈ cs) :
    score q c ≤ best q cs := by
  induction cs with
  | nil => cases h
  | cons d ds ih =>
    simp only [best]
    rcases List.mem_cons.mp h with rfl | h'
    · exact Nat.le_max_left _ _
    · exact Nat.le_trans (ih h') (Nat.le_max_right _ _)

theorem best_le_length (q : Attr) (cs : List Class) : best q cs ≤ q.length := by
  induction cs with
  | nil => exact Nat.zero_le _
  | cons c cs ih =>
    simp only [best]
    exact Nat.max_le.mpr ⟨score_le_length q c, ih⟩

theorem best_cons_ge (q : Attr) (c : Class) (cs : List Class) : best q cs ≤ best q (c :: cs) :=
  Nat.le_max_right _ _

theorem predict_none_iff (q : Attr) (cs : List Class) : predict q cs = none ↔ cs = [] := by
  cases cs with
  | nil => simp [predict]
  | cons c cs =>
    simp only [List.cons_ne_nil, iff_false]
    intro h
    simp only [predict] at h
    split at h
    · cases h
    · split at h <;> cases h

theorem predict_exists (q : Attr) {cs : List Class} (h : cs ≠ []) : ∃ c, predict q cs = some c := by
  cases hp : predict q cs with
  | none => exact absurd ((predict_none_iff q cs).mp hp) h
  | some c => exact ⟨c, rfl⟩

theorem predict_mem (q : Attr) {cs : List Class} {c : Class} (h : predict q cs = some c) : c ∈ cs := by
  induction cs generalizing c with
  | nil => simp [predict] at h
  | cons d ds ih =>
    simp only [predict] at h
    split at h
    · cases h; exact List.mem_cons_self
    · rename_i e hp
      split at h
      · cases h; exact List.mem_cons_of_mem d (ih hp)
      · cases h; exact List.mem_cons_self

/-- The predicted class attains the maximum score. -/
theorem predict_score (q : Attr) {cs : List Class} {c : Class} (h : predict q cs = some c) :
    score q c = best q cs := by
  induction cs generalizing c with
  | nil => simp [predict] at h
  | cons d ds ih =>
    simp only [predict] at h
    simp only [best]
    split at h
    · rename_i hp
      cases h
      have : ds = [] := (predict_none_iff q ds).mp hp
      subst this
      simp only [best]; omega
    · rename_i e hp
      have he := ih hp
      split at h
      · cases h; omega
      · cases h; omega

/-- The predicted class dominates every candidate. -/
theorem predict_is_argmax (q : Attr) {cs : List Class} {c : Class} (h : predict q cs = some c) :
    ∀ d ∈ cs, score q d ≤ score q c := by
  intro d hd
  rw [predict_score q h]
  exact best_ge_score q hd

/-- The maximum is attained by some candidate whenever there is one. -/
theorem best_attained (q : Attr) {cs : List Class} (h : cs ≠ []) :
    ∃ c ∈ cs, score q c = best q cs := by
  obtain ⟨c, hc⟩ := predict_exists q h
  exact ⟨c, predict_mem q hc, predict_score q hc⟩

/-- Tie-breaking: a head class that is at least as good as every other candidate is
the prediction. -/
theorem predict_cons_of_ge (q : Attr) {c : Class} {cs : List Class}
    (h : ∀ d ∈ cs, score q d ≤ score q c) : predict q (c :: cs) = some c := by
  simp only [predict]
  cases hp : predict q cs with
  | none => rfl
  | some d =>
    have := h d (predict_mem q hp)
    simp [Nat.not_lt.mpr this]

/-- A new class scoring strictly above the pool's best is predicted. -/
theorem predict_cons_of_gt (q : Attr) {c : Class} {cs : List Class}
    (h : best q cs < score q c) : predict q (c :: cs) = some c :=
  predict_cons_of_ge q (fun _ hd => Nat.le_of_lt (Nat.lt_of_le_of_lt (best_ge_score q hd) h))

/-! ## Exact matches -/

/-- All attribute vectors in the list have length `dim`. -/
def Uniform (dim : Nat) (cs : List Class) : Prop := ∀ c ∈ cs, c.attr.length = dim

/-- Pairwise distinct attribute vectors. -/
def Distinct (cs : List Class) : Prop := cs.Pairwise (fun c d => c.attr ≠ d.attr)

instance (dim : Nat) (cs : List Class) : Decidable (Uniform dim cs) :=
  inferInstanceAs (Decidable (∀ c ∈ cs, c.attr.length = dim))

instance (cs : List Class) : Decidable (Distinct cs) :=
  inferInstanceAs (Decidable (cs.Pairwise (fun c d => c.attr ≠ d.attr)))

theorem exact_match_best (q : Attr) {c : Class} {cs : List Class} (hc : c ∈ cs) (h : c.attr = q) :
    best q cs = q.length :=
  Nat.le_antisymm (best_le_length q cs) (score_exact q h ▸ best_ge_score q hc)

/-- A class whose vector equals the query ties with the prediction at the maximum. -/
theorem exact_match_predicted_score (q : Attr) {c d : Class} {cs : List Class}
    (hc : c ∈ cs) (h : c.attr = q) (hd : predict q cs = some d) : score q d = q.length := by
  rw [predict_score q hd, exact_match_best q hc h]

/-- With uniform attribute length, the predicted class carries the query's vector. -/
theorem exact_match_predicted_attr (q : Attr) {c d : Class} {cs : List Class}
    (hu : Uniform q.length cs) (hc : c ∈ cs) (h : c.attr = q) (hd : predict q cs = some d) :
    d.attr = q := by
  have hs := exact_match_predicted_score q hc h hd
  have hl : q.length = d.attr.length := (hu d (predict_mem q hd)).symm
  exact ((agree_eq_length_iff q d.attr hl).mp hs).symm

/-- In a list of pairwise distinct vectors, a shared vector means the same class. -/
theorem distinct_attr_inj {cs : List Class} (hd : Distinct cs) {c d : Class}
    (hc : c ∈ cs) (hdm : d ∈ cs) (h : c.attr = d.attr) : c = d := by
  induction cs with
  | nil => cases hc
  | cons e es ih =>
    have ⟨he, hes⟩ := List.pairwise_cons.mp hd
    rcases List.mem_cons.mp hc with rfl | hc'
    · rcases List.mem_cons.mp hdm with rfl | hd'
      · rfl
      · exact absurd h (he d hd')
    · rcases List.mem_cons.mp hdm with rfl | hd'
      · exact absurd h.symm (he c hc')
      · exact ih hes hc' hd'

/-- Uniform length and distinct vectors: an exact match is *the* prediction. -/
theorem exact_match_predicted (q : Attr) {c : Class} {cs : List Class}
    (hu : Uniform q.length cs) (hd : Distinct cs) (hc : c ∈ cs) (h : c.attr = q) :
    predict q cs = some c := by
  obtain ⟨d, hpd⟩ := predict_exists q (List.ne_nil_of_mem hc)
  have hda := exact_match_predicted_attr q hu hc h hpd
  have : d = c := distinct_attr_inj hd (predict_mem q hpd) hc (hda.trans h.symm)
  rw [hpd, this]

/-! ## Separation: why distinct vectors are needed and sufficient -/

/-- Equal attribute vectors are indistinguishable by every query. -/
theorem indistinguishable {c d : Class} (h : c.attr = d.attr) : ∀ q, score q c = score q d :=
  fun q => score_of_attr_eq q h

/-- Distinct vectors of equal length are separated by the class's own vector as query. -/
theorem separable {c d : Class} (hl : c.attr.length = d.attr.length) (h : c.attr ≠ d.attr) :
    score c.attr d < score c.attr c := by
  rw [score, score, agree_self]
  exact agree_lt_of_ne c.attr d.attr hl h

/-! ## Pigeonhole: `dim` binary attributes distinguish at most `mint dim` classes -/

/-- Binary code of an attribute vector (little-endian). -/
def code : Attr → Nat
  | [] => 0
  | b :: bs => (if b then 1 else 0) + 2 * code bs

theorem code_lt (a : Attr) : code a < mint a.length := by
  induction a with
  | nil => simp [code, mint]
  | cons b bs ih =>
    simp only [code, List.length_cons, mintOf_succ]
    split <;> omega

theorem code_inj (a b : Attr) (h : a.length = b.length) (hc : code a = code b) : a = b := by
  induction a generalizing b with
  | nil => cases b with
    | nil => rfl
    | cons _ _ => simp at h
  | cons x xs ih =>
    cases b with
    | nil => simp at h
    | cons y ys =>
      simp only [List.length_cons, Nat.add_right_cancel_iff] at h
      cases x <;> cases y <;> simp [code] at hc ⊢
      · exact ih ys h (by omega)
      · omega
      · omega
      · exact ih ys h (by omega)

/-- Pigeonhole on naturals: a duplicate-free list of numbers below `m` has at most `m` entries. -/
theorem nodup_lt_length_le (m : Nat) : ∀ (l : List Nat), l.Nodup → (∀ x ∈ l, x < m) → l.length ≤ m := by
  induction m with
  | zero =>
    intro l _ h
    cases l with
    | nil => exact Nat.le_refl 0
    | cons x xs => exact absurd (h x List.mem_cons_self) (Nat.not_lt_zero x)
  | succ m ih =>
    intro l hn h
    by_cases hm : m ∈ l
    · have h1 := List.length_erase_of_mem hm
      have h2 := ih (l.erase m) (hn.erase m) (fun x hx => by
        have hx' := h x (List.mem_of_mem_erase hx)
        have hne : x ≠ m := fun e => hn.not_mem_erase (e ▸ hx)
        omega)
      omega
    · have h2 := ih l hn (fun x hx => by
        have := h x hx
        have : x ≠ m := fun e => hm (e ▸ hx)
        omega)
      omega

/-- The pigeonhole bound: pairwise distinct attribute vectors of length `dim` number at
most `mint dim = 2^dim`. -/
theorem distinct_le_mint {dim : Nat} {cs : List Class} (hu : Uniform dim cs) (hd : Distinct cs) :
    cs.length ≤ mint dim := by
  have hnd : (cs.map (fun c => code c.attr)).Nodup := by
    unfold List.Nodup
    refine List.Pairwise.map _ (fun a b (h : code a.attr ≠ code b.attr) => h) ?_
    exact hd.imp_of_mem (fun {a b} ha hb hne hc =>
      hne (code_inj a.attr b.attr ((hu a ha).trans (hu b hb).symm) hc))
  have hlt : ∀ x ∈ cs.map (fun c => code c.attr), x < mint dim := by
    intro x hx
    obtain ⟨c, hc, rfl⟩ := List.mem_map.mp hx
    have := code_lt c.attr
    rw [hu c hc] at this
    exact this
  have := nodup_lt_length_le (mint dim) _ hnd hlt
  rwa [List.length_map] at this

/-- Honest replacement of the sketch's `dim_sufficiency` (`embedding_dim ≥ log num_distinctions`):
with fewer than `cs.length` codes available, two classes share an attribute vector. -/
theorem dim_insufficient {dim : Nat} {cs : List Class} (hu : Uniform dim cs)
    (h : mint dim < cs.length) : ¬ Distinct cs :=
  fun hd => Nat.lt_irrefl _ (Nat.lt_of_lt_of_le h (distinct_le_mint hu hd))

/-- All attribute vectors of length `d`. -/
def allVecs : Nat → List Attr
  | 0 => [[]]
  | d + 1 => (allVecs d).map (true :: ·) ++ (allVecs d).map (false :: ·)

theorem allVecs_length (d : Nat) : (allVecs d).length = mint d := by
  induction d with
  | zero => rfl
  | succ d ih => simp [allVecs, List.length_append, List.length_map, ih, mintOf_succ]

theorem allVecs_uniform (d : Nat) : ∀ v ∈ allVecs d, v.length = d := by
  induction d with
  | zero => intro v hv; simp [allVecs] at hv; rw [hv]; rfl
  | succ d ih =>
    intro v hv
    simp only [allVecs, List.mem_append, List.mem_map] at hv
    rcases hv with ⟨w, hw, rfl⟩ | ⟨w, hw, rfl⟩ <;> simp [ih w hw]

theorem allVecs_complete (v : Attr) : v ∈ allVecs v.length := by
  induction v with
  | nil => simp [allVecs]
  | cons b bs ih =>
    simp only [List.length_cons, allVecs, List.mem_append, List.mem_map]
    cases b
    · exact Or.inr ⟨bs, ih, rfl⟩
    · exact Or.inl ⟨bs, ih, rfl⟩

theorem allVecs_nodup (d : Nat) : (allVecs d).Nodup := by
  induction d with
  | zero => simp [allVecs]
  | succ d ih =>
    unfold List.Nodup at ih ⊢
    simp only [allVecs]
    refine List.pairwise_append.mpr ⟨?_, ?_, ?_⟩
    · exact List.pairwise_map.mpr (ih.imp (fun h hc => h (List.cons_eq_cons.mp hc).2))
    · exact List.pairwise_map.mpr (ih.imp (fun h hc => h (List.cons_eq_cons.mp hc).2))
    · intro a ha b hb
      obtain ⟨_, _, rfl⟩ := List.mem_map.mp ha
      obtain ⟨_, _, rfl⟩ := List.mem_map.mp hb
      simp

/-- The bound is sharp: `mint dim` pairwise distinct classes of length `dim` exist. -/
def allClasses (d : Nat) : List Class := (allVecs d).map (fun v => ⟨code v, v⟩)

theorem allClasses_length (d : Nat) : (allClasses d).length = mint d := by
  rw [allClasses, List.length_map, allVecs_length]

theorem allClasses_uniform (d : Nat) : Uniform d (allClasses d) := by
  intro c hc
  obtain ⟨v, hv, rfl⟩ := List.mem_map.mp hc
  exact allVecs_uniform d v hv

theorem allClasses_distinct (d : Nat) : Distinct (allClasses d) := by
  unfold Distinct allClasses
  exact List.pairwise_map.mpr (allVecs_nodup d)

/-- On the lattice: `n` binary attributes distinguish at most `vertices = mint n` classes. -/
theorem vertices_bound {cs : List Class} (hu : Uniform n cs) (hd : Distinct cs) :
    cs.length ≤ vertices :=
  distinct_le_mint hu hd

/-! ## Seen and unseen classes -/

/-- Split a pool by a seen-predicate: `(seen, unseen)`. -/
def split (isSeen : Class → Bool) (cs : List Class) : List Class × List Class :=
  (cs.filter isSeen, cs.filter (fun c => !isSeen c))

theorem split_disjoint (isSeen : Class → Bool) (cs : List Class) {c : Class}
    (h : c ∈ (split isSeen cs).1) : c ∉ (split isSeen cs).2 := by
  simp only [split, List.mem_filter] at h ⊢
  simp [h.2]

theorem split_cover (isSeen : Class → Bool) {cs : List Class} {c : Class} (h : c ∈ cs) :
    c ∈ (split isSeen cs).1 ∨ c ∈ (split isSeen cs).2 := by
  simp only [split, List.mem_filter]
  cases hs : isSeen c <;> simp [h]

theorem split_length (isSeen : Class → Bool) (cs : List Class) :
    (split isSeen cs).1.length + (split isSeen cs).2.length = cs.length := by
  induction cs with
  | nil => rfl
  | cons c cs ih =>
    simp only [split, List.filter_cons] at ih ⊢
    cases isSeen c <;> simp <;> omega

/-- The unseen candidates are exactly the pool members the predicate rejects. -/
theorem mem_unseen (isSeen : Class → Bool) (cs : List Class) (c : Class) :
    c ∈ (split isSeen cs).2 ↔ c ∈ cs ∧ isSeen c = false := by
  simp [split, List.mem_filter]

/-- Adding a seen class to the pool leaves the unseen candidate list untouched. -/
theorem split_unseen_cons_seen (isSeen : Class → Bool) (cs : List Class) {s : Class}
    (hs : isSeen s = true) : (split isSeen (s :: cs)).2 = (split isSeen cs).2 := by
  simp [split, hs]

/-- Zero-shot prediction over the unseen classes is unchanged by adding a seen class. -/
theorem predict_unseen_cons_seen (isSeen : Class → Bool) (q : Attr) (cs : List Class) {s : Class}
    (hs : isSeen s = true) :
    predict q (split isSeen (s :: cs)).2 = predict q (split isSeen cs).2 := by
  rw [split_unseen_cons_seen isSeen cs hs]

/-- Adding an unseen class with a strictly better score changes the prediction to it. -/
theorem predict_unseen_cons_unseen (isSeen : Class → Bool) (q : Attr) (cs : List Class) {u : Class}
    (hu : isSeen u = false) (h : best q (split isSeen cs).2 < score q u) :
    predict q (split isSeen (u :: cs)).2 = some u := by
  have : (split isSeen (u :: cs)).2 = u :: (split isSeen cs).2 := by
    simp [split, hu]
  rw [this]
  exact predict_cons_of_gt q h

/-! ## Worked example (labelled, concrete) -/

/-- Attributes: `[stripes, fourLegs, flies]`. -/
def zebra : Class := ⟨0, [true, true, false]⟩
def horse : Class := ⟨1, [false, true, false]⟩
def bat : Class := ⟨2, [false, false, true]⟩

/-- Zoo: the horse is seen; zebra and bat are unseen. -/
def zooSeen (c : Class) : Bool := c.id == 1

example : (split zooSeen [zebra, horse, bat]).2 = [zebra, bat] := by decide
example : predict [true, true, false] (split zooSeen [zebra, horse, bat]).2 = some zebra := by decide
/-- Horse and bat tie at two agreements; the earlier candidate wins. -/
example : predict [false, true, true] [zebra, horse, bat] = some horse := by decide
example : best [false, true, true] [zebra, horse, bat] = 2 := by decide
example : (allVecs n).length = vertices := by decide
example : Distinct [zebra, horse, bat] ∧ Uniform n [zebra, horse, bat] := by decide

end Qpu.ZeroShot
