import Qpu.Mint
import Qpu.Lattice

/-! # Qpu.Leads.CausalInference

Causal inference, kernel-checked, with no axioms and no `sorry`.

What is formalised:
* A causal graph `Dag` is a finite list of directed edges on the variables `0, 1, …, vars − 1`.
  `Dag.ordered` says every edge `(a, b)` has `a < b < vars`: the variable index is a causal
  (topological) ordering. Every finite DAG admits such an ordering, so this is the general case
  written in its normal form; acyclicity is then a theorem (`no_cycle`), not an assumption.
* Parents, children, directed paths, the backdoor path, and the fact that the parent set of a
  treatment is a valid adjustment set (blocks every backdoor path, contains no descendant).
* A structural causal model `Scm`: a `Dag` plus a mechanism `mech v parentValues noise`.
  Values are computed by fuel recursion along the ordering (`Scm.value`); the fuel is shown to be
  irrelevant above the variable (`valueF_stable`), which is what makes the semantics well defined.
* The intervention `do(x := c)` (`Scm.doOp`): it cuts the edges into `x` and fixes its mechanism.
  Theorems: the mutilated graph is still ordered on the same variables, `x` has no parents and
  takes the value `c`, pre-treatment variables are untouched, counterfactual consistency
  (`do(x := X) ` changes nothing), randomised treatment makes `do` equal to `see`, and the
  mediation decomposition total = direct + indirect as a theorem derived from consistency.
* Finite studies `Study`: units, a Bool treatment, a covariate (stratum) and bounded outcomes.
  Theorems: treated/control partition, the difference of group means is bounded by the outcome
  range, exact matching exists under overlap, overlap gives common support and strict positivity
  of the stratum propensity count, sharp regression discontinuity has no overlap, and bounded
  individual effects give a bounded average effect.
* A concrete confounding triangle on the lattice's `n = 3` variables, where the observed
  difference is 2 and the causal effect is 1.

What is deliberately not formalised: real-valued probabilities. Propensities and means appear as
counts (numerators and denominators), effects as `Nat`/`Int` differences, and distributional
statements (double robustness, sensitivity bounds, instrumental variables, front-door) are left
out rather than stated with placeholders. -/

namespace Qpu.CausalInference

/-! ## Causal graphs -/

/-- A directed graph on the variables `0 … vars − 1`, given by its edge list. -/
structure Dag where
  vars : Nat
  edges : List (Nat × Nat)

/-- The variable index is a causal ordering: every edge goes up, and stays inside the model. -/
def Dag.ordered (g : Dag) : Bool :=
  g.edges.all (fun e => decide (e.1 < e.2) && decide (e.2 < g.vars))

/-- Direct causes of `v`. -/
def Dag.parents (g : Dag) (v : Nat) : List Nat :=
  (g.edges.filter (fun e => e.2 == v)).map (·.1)

/-- Direct effects of `v`. -/
def Dag.children (g : Dag) (v : Nat) : List Nat :=
  (g.edges.filter (fun e => e.1 == v)).map (·.2)

/-- A directed path, as a list of consecutive vertices joined by edges. -/
def Dag.path (g : Dag) : List Nat → Bool
  | [] => true
  | [_] => true
  | a :: b :: rest => decide ((a, b) ∈ g.edges) && g.path (b :: rest)

/-- Theorem 1. In an ordered graph every edge goes strictly up and stays below `vars`. -/
theorem ordered_edge {g : Dag} (h : g.ordered = true) {e : Nat × Nat} (he : e ∈ g.edges) :
    e.1 < e.2 ∧ e.2 < g.vars := by
  have := List.all_eq_true.mp h e he
  simpa using this

/-- Theorem 2. `p` is a parent of `v` exactly when the edge `(p, v)` is present. -/
theorem mem_parents {g : Dag} {p v : Nat} : p ∈ g.parents v ↔ (p, v) ∈ g.edges := by
  unfold Dag.parents
  constructor
  · intro h
    obtain ⟨⟨a, b⟩, hab, hap⟩ := List.mem_map.mp h
    have := List.mem_filter.mp hab
    simp at hap this
    subst hap
    rw [← this.2]
    exact this.1
  · intro h
    exact List.mem_map.mpr ⟨(p, v), List.mem_filter.mpr ⟨h, by simp⟩, rfl⟩

/-- Theorem 3. `c` is a child of `v` exactly when the edge `(v, c)` is present. -/
theorem mem_children {g : Dag} {c v : Nat} : c ∈ g.children v ↔ (v, c) ∈ g.edges := by
  unfold Dag.children
  constructor
  · intro h
    obtain ⟨⟨a, b⟩, hab, hap⟩ := List.mem_map.mp h
    have := List.mem_filter.mp hab
    simp at hap this
    subst hap
    rw [← this.2]
    exact this.1
  · intro h
    exact List.mem_map.mpr ⟨(v, c), List.mem_filter.mpr ⟨h, by simp⟩, rfl⟩

/-- Theorem 4. Causes come before effects: a parent of `v` has a smaller index. -/
theorem parents_lt {g : Dag} (h : g.ordered = true) {p v : Nat} (hp : p ∈ g.parents v) : p < v :=
  (ordered_edge h (mem_parents.mp hp)).1

/-- Theorem 5. Every parent is a variable of the model (causal sufficiency of the index set). -/
theorem parents_lt_vars {g : Dag} (h : g.ordered = true) {p v : Nat} (hp : p ∈ g.parents v) :
    p < g.vars :=
  have := ordered_edge h (mem_parents.mp hp)
  Nat.lt_trans this.1 this.2

/-- Theorem 6. Effects come after causes: a child of `v` has a larger index. -/
theorem children_gt {g : Dag} (h : g.ordered = true) {c v : Nat} (hc : c ∈ g.children v) : v < c :=
  (ordered_edge h (mem_children.mp hc)).1

/-- Theorem 7. Along a directed path in an ordered graph every later vertex is above the first. -/
theorem path_lt {g : Dag} (h : g.ordered = true) (a : Nat) (l : List Nat)
    (hp : g.path (a :: l) = true) : ∀ b ∈ l, a < b := by
  induction l generalizing a with
  | nil => intro b hb; cases hb
  | cons c rest ih =>
    intro b hb
    have h1 := (Bool.and_eq_true _ _).mp hp
    have hac : a < c := (ordered_edge h (decide_eq_true_iff.mp h1.1)).1
    cases List.mem_cons.mp hb with
    | inl hbc => subst hbc; exact hac
    | inr hbr => exact Nat.lt_trans hac (ih c h1.2 b hbr)

/-- Theorem 8. An ordered graph is acyclic: no directed path returns to its start. -/
theorem no_cycle {g : Dag} (h : g.ordered = true) (a : Nat) (l : List Nat) :
    g.path (a :: (l ++ [a])) = false := by
  apply Bool.eq_false_iff.mpr
  intro hp
  exact Nat.lt_irrefl a
    (path_lt h a (l ++ [a]) hp a (List.mem_append.mpr (Or.inr (List.mem_singleton.mpr rfl))))

/-- Theorem 9 (local Markov shape). A parent of `v` is never a descendant of `v`. -/
theorem parent_not_descendant {g : Dag} (h : g.ordered = true) {p v : Nat} (hp : p ∈ g.parents v)
    (l : List Nat) : g.path (v :: (l ++ [p])) = false := by
  apply Bool.eq_false_iff.mpr
  intro hpath
  have h1 := path_lt h v (l ++ [p]) hpath p (List.mem_append.mpr (Or.inr (List.mem_singleton.mpr rfl)))
  exact Nat.lt_irrefl p (Nat.lt_trans (parents_lt h hp) h1)

/-- Theorem 10. A model with at least one edge has at least one variable. -/
theorem vars_pos_of_edge {g : Dag} (h : g.ordered = true) {e : Nat × Nat} (he : e ∈ g.edges) :
    0 < g.vars :=
  Nat.lt_of_le_of_lt (Nat.zero_le _) (ordered_edge h he).2

/-- A backdoor path out of `x`: a directed path that starts at a parent of `x`
(so its first edge points into `x`). -/
def Dag.backdoorPath (g : Dag) (x : Nat) : List Nat → Prop
  | [] => False
  | w :: rest => w ∈ g.parents x ∧ g.path (w :: rest) = true

/-- A set `z` blocks a path when it contains the path's first vertex, which on a backdoor path
is a non-collider. -/
def blocks (z : List Nat) : List Nat → Prop
  | [] => False
  | w :: _ => w ∈ z

/-- Theorem 11 (backdoor criterion). The parent set of `x` is a valid adjustment set:
it blocks every backdoor path out of `x` and contains no descendant of `x`. -/
theorem parents_backdoor {g : Dag} (h : g.ordered = true) (x : Nat) :
    (∀ p, g.backdoorPath x p → blocks (g.parents x) p) ∧
    (∀ w ∈ g.parents x, ∀ l, g.path (x :: (l ++ [w])) = false) := by
  constructor
  · intro p hp
    cases p with
    | nil => exact hp.elim
    | cons w rest => exact hp.1
  · intro w hw l
    exact parent_not_descendant h hw l

/-! ## Structural causal models and interventions -/

/-- A structural causal model: a graph and, for each variable, a mechanism from the values of
its parents (in edge order) and its own exogenous noise to its value. -/
structure Scm extends Dag where
  mech : Nat → List Nat → Nat → Nat

/-- Values by fuel recursion: with fuel `f`, variables below `f` are computed exactly. -/
def Scm.valueF (m : Scm) (u : Nat → Nat) : Nat → Nat → Nat
  | 0, _ => 0
  | fuel + 1, v => m.mech v ((m.parents v).map (fun p => m.valueF u fuel p)) (u v)

/-- The value of variable `v` under noise `u`. -/
def Scm.value (m : Scm) (u : Nat → Nat) (v : Nat) : Nat := m.valueF u (v + 1) v

/-- Theorem 12. In an ordered model the fuel does not matter once it exceeds the variable. -/
theorem valueF_stable {m : Scm} (h : m.ordered = true) (u : Nat → Nat) :
    ∀ (f₁ v : Nat), v < f₁ → ∀ f₂, v < f₂ → m.valueF u f₁ v = m.valueF u f₂ v := by
  intro f₁
  induction f₁ with
  | zero => intro v hv; exact absurd hv (Nat.not_lt_zero v)
  | succ f ih =>
    intro v hv f₂ hv₂
    cases f₂ with
    | zero => exact absurd hv₂ (Nat.not_lt_zero v)
    | succ f' =>
      simp only [Scm.valueF]
      congr 1
      apply List.map_congr_left
      intro p hp
      have hpv : p < v := parents_lt h hp
      exact ih p (by omega) f' (by omega)

/-- Theorem 13. `value` is the fuel recursion at any sufficient fuel. -/
theorem value_eq_valueF {m : Scm} (h : m.ordered = true) (u : Nat → Nat) {f v : Nat} (hf : v < f) :
    m.value u v = m.valueF u f v :=
  valueF_stable h u (v + 1) v (Nat.lt_succ_self v) f hf

/-- The intervention `do(x := c)`: cut every edge into `x` and fix its mechanism to `c`. -/
def Scm.doOp (m : Scm) (x c : Nat) : Scm :=
  { vars := m.vars
    edges := m.edges.filter (fun e => !(e.2 == x))
    mech := fun v ps noise => if v = x then c else m.mech v ps noise }

theorem filter_filter_not {α : Type} (p : α → Bool) :
    ∀ l : List α, (l.filter (fun a => !p a)).filter p = []
  | [] => rfl
  | a :: l => by
    by_cases h : p a = true
    · simp [h, filter_filter_not p l]
    · simp [h, filter_filter_not p l]

theorem filter_filter_ne {x v : Nat} (hvx : v ≠ x) :
    ∀ l : List (Nat × Nat),
      (l.filter (fun e => !(e.2 == x))).filter (fun e => e.2 == v) = l.filter (fun e => e.2 == v)
  | [] => rfl
  | a :: l => by
    by_cases ha : a.2 = v
    · simp [ha, hvx, filter_filter_ne hvx l]
    · by_cases hax : a.2 = x
      · simp [hax, Ne.symm hvx, filter_filter_ne hvx l]
      · simp [ha, hax, filter_filter_ne hvx l]

/-- Theorem 14. The intervened model keeps the variables and stays ordered: the mutilated graph
is a DAG on the same variables (identification lives in a DAG). -/
theorem do_ordered {m : Scm} (h : m.ordered = true) (x c : Nat) :
    (m.doOp x c).vars = m.vars ∧ (m.doOp x c).ordered = true := by
  refine ⟨rfl, ?_⟩
  apply List.all_eq_true.mpr
  intro e he
  have he' := (List.mem_filter.mp he).1
  exact List.all_eq_true.mp h e he'

/-- Theorem 15. After `do(x := c)` the treatment has no parents. -/
theorem do_parents_self (m : Scm) (x c : Nat) : (m.doOp x c).parents x = [] := by
  show ((m.edges.filter (fun e => !(e.2 == x))).filter (fun e => e.2 == x)).map (·.1) = []
  rw [filter_filter_not (fun e : Nat × Nat => e.2 == x)]
  rfl

/-- Theorem 16. `do(x := c)` leaves the parents of every other variable alone. -/
theorem do_parents_ne (m : Scm) {x v : Nat} (hvx : v ≠ x) (c : Nat) :
    (m.doOp x c).parents v = m.parents v := by
  show ((m.edges.filter (fun e => !(e.2 == x))).filter (fun e => e.2 == v)).map (·.1) =
    (m.edges.filter (fun e => e.2 == v)).map (·.1)
  rw [filter_filter_ne hvx]

/-- Theorem 17. After `do(x := c)` the treatment takes the value `c`, whatever the noise. -/
theorem do_value_self (m : Scm) (u : Nat → Nat) (x c : Nat) : (m.doOp x c).value u x = c := by
  simp [Scm.value, Scm.valueF, Scm.doOp]

theorem do_valueF_pre {m : Scm} (h : m.ordered = true) (u : Nat → Nat) (x c : Nat) :
    ∀ (f v : Nat), v < x → (m.doOp x c).valueF u f v = m.valueF u f v := by
  intro f
  induction f with
  | zero => intros; rfl
  | succ f ih =>
    intro v hv
    have hvx : v ≠ x := Nat.ne_of_lt hv
    simp only [Scm.valueF]
    rw [do_parents_ne m hvx c]
    simp only [Scm.doOp, if_neg hvx]
    congr 1
    apply List.map_congr_left
    intro p hp
    exact ih p (Nat.lt_trans (parents_lt h hp) hv)

/-- Theorem 18 (no interference backwards). A pre-treatment variable `v < x` is unaffected by
`do(x := c)`. -/
theorem do_pre_treatment {m : Scm} (h : m.ordered = true) (u : Nat → Nat) {x v : Nat} (hv : v < x)
    (c : Nat) : (m.doOp x c).value u v = m.value u v :=
  do_valueF_pre h u x c (v + 1) v hv

theorem do_valueF_consistent {m : Scm} (h : m.ordered = true) (u : Nat → Nat) (x : Nat) :
    ∀ (f v : Nat), v < f → (m.doOp x (m.value u x)).valueF u f v = m.valueF u f v := by
  intro f
  induction f with
  | zero => intro v hv; exact absurd hv (Nat.not_lt_zero v)
  | succ f ih =>
    intro v hv
    by_cases hvx : v = x
    · subst hvx
      show (if v = v then m.value u v else _) = _
      rw [if_pos rfl]
      exact value_eq_valueF h u hv
    · simp only [Scm.valueF]
      rw [do_parents_ne m hvx]
      simp only [Scm.doOp, if_neg hvx]
      congr 1
      apply List.map_congr_left
      intro p hp
      exact ih p (Nat.lt_of_lt_of_le (parents_lt h hp) (Nat.le_of_lt_succ hv))

/-- Theorem 19 (counterfactual consistency). Intervening on `x` at the value it already takes
changes nothing: `Y_{X = X} = Y` for every variable. -/
theorem do_consistent {m : Scm} (h : m.ordered = true) (u : Nat → Nat) (x v : Nat) :
    (m.doOp x (m.value u x)).value u v = m.value u v :=
  do_valueF_consistent h u x (v + 1) v (Nat.lt_succ_self v)

/-- A variable is exogenous (randomised) when it has no parents and simply reports its noise. -/
def Scm.exogenous (m : Scm) (x : Nat) : Prop :=
  m.parents x = [] ∧ ∀ noise, m.mech x [] noise = noise

theorem do_valueF_exogenous (m : Scm) (u : Nat → Nat) {x : Nat}
    (hx : m.exogenous x) (c : Nat) :
    ∀ (f v : Nat), (m.doOp x c).valueF u f v = m.valueF (fun w => if w = x then c else u w) f v := by
  intro f
  induction f with
  | zero => intro v; rfl
  | succ f ih =>
    intro v
    by_cases hvx : v = x
    · subst hvx
      show (if v = v then c else _) = m.mech v ((m.parents v).map _) (if v = v then c else u v)
      rw [if_pos rfl, if_pos rfl, hx.1]
      exact (hx.2 c).symm
    · simp only [Scm.valueF]
      rw [do_parents_ne m hvx]
      simp only [Scm.doOp, if_neg hvx]
      congr 1
      exact List.map_congr_left (fun p _ => ih p)

/-- Theorem 20 (no unmeasured confounding ⇒ identification). When the treatment is exogenous,
intervening equals observing: `do(x := c)` gives the same values as a noise draw with `x`'s
coin set to `c`. No ordering hypothesis is needed. -/
theorem exogenous_do_eq_see (m : Scm) (u : Nat → Nat) {x : Nat}
    (hx : m.exogenous x) (c v : Nat) :
    (m.doOp x c).value u v = m.value (fun w => if w = x then c else u w) v :=
  do_valueF_exogenous m u hx c (v + 1) v

/-- Total effect of `x` on `y` for noise `u`: `Y(do x := 1) − Y(do x := 0)`. -/
def Scm.totalEffect (m : Scm) (u : Nat → Nat) (x y : Nat) : Int :=
  ((m.doOp x 1).value u y : Int) - (m.doOp x 0).value u y

/-- Natural direct effect: change `x` from 0 to 1 while holding the mediator at `M(x := 0)`. -/
def Scm.directEffect (m : Scm) (u : Nat → Nat) (x med y : Nat) : Int :=
  (((m.doOp x 1).doOp med ((m.doOp x 0).value u med)).value u y : Int) -
    ((m.doOp x 0).doOp med ((m.doOp x 0).value u med)).value u y

/-- Natural indirect effect: keep `x := 1` and move the mediator from `M(x := 0)` to `M(x := 1)`. -/
def Scm.indirectEffect (m : Scm) (u : Nat → Nat) (x med y : Nat) : Int :=
  (((m.doOp x 1).doOp med ((m.doOp x 1).value u med)).value u y : Int) -
    ((m.doOp x 1).doOp med ((m.doOp x 0).value u med)).value u y

/-- Theorem 21 (mediation decomposition). Total effect = natural direct + natural indirect effect.
It follows from counterfactual consistency applied inside the intervened models. -/
theorem mediation_decomposition {m : Scm} (h : m.ordered = true) (u : Nat → Nat) (x med y : Nat) :
    m.totalEffect u x y = m.directEffect u x med y + m.indirectEffect u x med y := by
  unfold Scm.totalEffect Scm.directEffect Scm.indirectEffect
  rw [do_consistent (do_ordered h x 1).2 u med y, do_consistent (do_ordered h x 0).2 u med y]
  omega

/-! ## Finite studies: groups, overlap, common support -/

/-- A finite study: units, a binary treatment, an observed covariate (the stratum), an observed
outcome and the outcome's stated range. -/
structure Study where
  units : List Nat
  treat : Nat → Bool
  cov : Nat → Nat
  y : Nat → Nat
  ymax : Nat

def Study.treated (s : Study) : List Nat := s.units.filter s.treat
def Study.control (s : Study) : List Nat := s.units.filter (fun u => !s.treat u)
def Study.bounded (s : Study) : Prop := ∀ u ∈ s.units, s.y u ≤ s.ymax
def Study.stratum (s : Study) (k : Nat) : List Nat := s.units.filter (fun u => s.cov u == k)
def Study.treatedIn (s : Study) (k : Nat) : List Nat := (s.stratum k).filter s.treat
def Study.controlIn (s : Study) (k : Nat) : List Nat := (s.stratum k).filter (fun u => !s.treat u)
def Study.sumY (s : Study) (l : List Nat) : Nat := (l.map s.y).sum
/-- Overlap: every occupied stratum holds both a treated and a control unit. -/
def Study.overlap (s : Study) : Prop :=
  ∀ u ∈ s.units, s.treatedIn (s.cov u) ≠ [] ∧ s.controlIn (s.cov u) ≠ []
/-- Sharp regression discontinuity: treatment is assigned by a threshold on the covariate. -/
def Study.sharpRd (s : Study) (c : Nat) : Prop := ∀ u ∈ s.units, s.treat u = decide (c ≤ s.cov u)

/-- Theorem 22. A sum of values each at most `b` is at most `b` times the count. -/
theorem sum_le_mul_length (f : Nat → Nat) (b : Nat) :
    ∀ l : List Nat, (∀ a ∈ l, f a ≤ b) → (l.map f).sum ≤ b * l.length
  | [], _ => by simp
  | a :: l, h => by
    simp only [List.map_cons, List.sum_cons, List.length_cons, Nat.mul_succ]
    have h1 := h a List.mem_cons_self
    have h2 := sum_le_mul_length f b l (fun u hu => h u (List.mem_cons_of_mem a hu))
    omega

/-- Theorem 23. A predicate and its negation split a list into two parts whose lengths add up. -/
theorem length_filter_partition {α : Type} (p : α → Bool) :
    ∀ l : List α, (l.filter p).length + (l.filter (fun a => !p a)).length = l.length
  | [] => rfl
  | a :: l => by
    by_cases h : p a = true
    · simp [h]
      have := length_filter_partition p l
      omega
    · simp [h]
      have := length_filter_partition p l
      omega

/-- Theorem 24 (SUTVA, one treatment per unit). Every unit is treated or control, never both:
the two groups partition the study. -/
theorem treated_control_partition (s : Study) :
    s.treated.length + s.control.length = s.units.length :=
  length_filter_partition s.treat s.units

/-- Theorem 25 (ATE bound). With outcomes in `[0, ymax]`, the difference of the treated and
control means is at most `ymax` in absolute value; stated without division as
`ΣT·|C| ≤ ΣC·|T| + ymax·|T|·|C|` and symmetrically. -/
theorem ate_bounded (s : Study) (hb : s.bounded) :
    s.sumY s.treated * s.control.length ≤
        s.sumY s.control * s.treated.length + s.ymax * s.treated.length * s.control.length ∧
    s.sumY s.control * s.treated.length ≤
        s.sumY s.treated * s.control.length + s.ymax * s.treated.length * s.control.length := by
  have h1 : s.sumY s.treated ≤ s.ymax * s.treated.length :=
    sum_le_mul_length s.y s.ymax _ (fun u hu => hb u (List.mem_filter.mp hu).1)
  have h2 : s.sumY s.control ≤ s.ymax * s.control.length :=
    sum_le_mul_length s.y s.ymax _ (fun u hu => hb u (List.mem_filter.mp hu).1)
  constructor
  · exact Nat.le_trans (Nat.mul_le_mul_right _ h1) (Nat.le_add_left _ _)
  · have h3 : s.sumY s.control * s.treated.length ≤ s.ymax * s.treated.length * s.control.length := by
      rw [Nat.mul_right_comm]
      exact Nat.mul_le_mul_right _ h2
    exact Nat.le_trans h3 (Nat.le_add_left _ _)

theorem mem_stratum {s : Study} {u k : Nat} : u ∈ s.stratum k ↔ u ∈ s.units ∧ s.cov u = k := by
  simp [Study.stratum, List.mem_filter]

/-- Theorem 26 (exact matching). Under overlap every treated unit has a control unit with the
same covariate value: propensity-score style matching never fails. -/
theorem overlap_match (s : Study) (ho : s.overlap) {t : Nat} (ht : t ∈ s.treated) :
    ∃ c ∈ s.control, s.cov c = s.cov t := by
  have htu := (List.mem_filter.mp ht).1
  obtain ⟨c, hc⟩ := List.exists_mem_of_ne_nil _ (ho t htu).2
  have hc' := List.mem_filter.mp hc
  have hcs := mem_stratum.mp hc'.1
  exact ⟨c, List.mem_filter.mpr ⟨hcs.1, hc'.2⟩, hcs.2⟩

/-- Theorem 27 (common support). A nonempty study with overlap has both a treated and a control
group. -/
theorem common_support (s : Study) (ho : s.overlap) (hne : s.units ≠ []) :
    s.treated ≠ [] ∧ s.control ≠ [] := by
  obtain ⟨u, hu⟩ := List.exists_mem_of_ne_nil _ hne
  obtain ⟨ht, hc⟩ := ho u hu
  obtain ⟨t, htm⟩ := List.exists_mem_of_ne_nil _ ht
  obtain ⟨c, hcm⟩ := List.exists_mem_of_ne_nil _ hc
  have ht' := List.mem_filter.mp htm
  have hc' := List.mem_filter.mp hcm
  constructor
  · exact List.ne_nil_of_mem (List.mem_filter.mpr ⟨(mem_stratum.mp ht'.1).1, ht'.2⟩)
  · exact List.ne_nil_of_mem (List.mem_filter.mpr ⟨(mem_stratum.mp hc'.1).1, hc'.2⟩)

/-- Theorem 28 (positivity). Under overlap the stratum propensity, as the count pair
`treatedIn / stratum`, is strictly between 0 and 1. -/
theorem positivity (s : Study) (ho : s.overlap) {u : Nat} (hu : u ∈ s.units) :
    0 < (s.treatedIn (s.cov u)).length ∧
    (s.treatedIn (s.cov u)).length < (s.stratum (s.cov u)).length := by
  obtain ⟨ht, hc⟩ := ho u hu
  have h1 := List.length_pos_iff.mpr ht
  have h2 := List.length_pos_iff.mpr hc
  have h3 := length_filter_partition s.treat (s.stratum (s.cov u))
  have h1' : 0 < ((s.stratum (s.cov u)).filter s.treat).length := h1
  have h2' : 0 < ((s.stratum (s.cov u)).filter (fun u => !s.treat u)).length := h2
  clear h1 h2
  show 0 < ((s.stratum (s.cov u)).filter s.treat).length ∧
    ((s.stratum (s.cov u)).filter s.treat).length < (s.stratum (s.cov u)).length
  omega

/-- Theorem 29 (regression discontinuity). Under sharp threshold assignment no stratum of the
running variable holds both groups: identification at the cutoff is local, not by overlap. -/
theorem rd_no_overlap (s : Study) {c : Nat} (hrd : s.sharpRd c) (k : Nat) :
    ¬ (s.treatedIn k ≠ [] ∧ s.controlIn k ≠ []) := by
  intro ⟨ht, hc⟩
  obtain ⟨t, htm⟩ := List.exists_mem_of_ne_nil _ ht
  obtain ⟨k, hkm⟩ := List.exists_mem_of_ne_nil _ hc
  have ht' := List.mem_filter.mp htm
  have hk' := List.mem_filter.mp hkm
  have hts := mem_stratum.mp ht'.1
  have hks := mem_stratum.mp hk'.1
  have h1 := hrd t hts.1
  have h2 := hrd k hks.1
  rw [ht'.2] at h1
  have hk2 : s.treat k = false := by simpa using hk'.2
  rw [hk2] at h2
  have h1' : c ≤ s.cov t := of_decide_eq_true h1.symm
  have h2' : ¬ c ≤ s.cov k := of_decide_eq_false h2.symm
  omega

/-- Theorem 30 (sharp RD has no overlap at all). -/
theorem rd_not_overlap (s : Study) {c : Nat} (hrd : s.sharpRd c) (hne : s.units ≠ []) :
    ¬ s.overlap := by
  intro ho
  obtain ⟨u, hu⟩ := List.exists_mem_of_ne_nil _ hne
  exact rd_no_overlap s hrd (s.cov u) (ho u hu)

/-- Theorem 31 (heterogeneous effects, averaged). If every unit's potential outcome under
treatment exceeds its control outcome by at most `d`, the summed (hence average) effect is at
most `d`: `Σ y₁ ≤ Σ y₀ + d·N`. -/
theorem hte_bounded_average (y₁ y₀ : Nat → Nat) (d : Nat) :
    ∀ l : List Nat, (∀ u ∈ l, y₁ u ≤ y₀ u + d) → (l.map y₁).sum ≤ (l.map y₀).sum + d * l.length
  | [], _ => by simp
  | a :: l, h => by
    simp only [List.map_cons, List.sum_cons, List.length_cons, Nat.mul_succ]
    have h1 := h a List.mem_cons_self
    have h2 := hte_bounded_average y₁ y₀ d l (fun u hu => h u (List.mem_cons_of_mem a hu))
    omega

/-! ## A concrete confounded triangle -/

/-- `Z → X → Y`, `Z → Y` on the lattice's `n = 3` variables: `Z` is a coin, `X = Z`,
`Y = Z + X`. -/
def triangle : Scm :=
  { vars := n
    edges := [(0, 1), (0, 2), (1, 2)]
    mech := fun v ps noise =>
      match v with
      | 0 => noise
      | 1 => ps.headD 0
      | _ => ps.foldl (· + ·) 0 }

/-- Theorem 32. The triangle is an ordered causal graph and `X` is not exogenous (it has `Z`
as parent), while `Z` is. -/
theorem triangle_shape : triangle.ordered = true ∧ triangle.parents 1 = [0] ∧ triangle.exogenous 0 :=
  ⟨rfl, rfl, rfl, fun _ => rfl⟩

/-- Theorem 33 (association is not causation). In the triangle the observed difference in `Y`
between the two worlds where `X = 1` and `X = 0` is 2, but the causal effect `do(X := 1)` versus
`do(X := 0)` on `Y` is 1, for every coin. -/
theorem triangle_confounded (u : Nat → Nat) :
    triangle.value (fun _ => 1) 2 = 2 ∧ triangle.value (fun _ => 0) 2 = 0 ∧
    (triangle.doOp 1 1).value u 2 = (triangle.doOp 1 0).value u 2 + 1 :=
  ⟨rfl, rfl, rfl⟩

end Qpu.CausalInference
