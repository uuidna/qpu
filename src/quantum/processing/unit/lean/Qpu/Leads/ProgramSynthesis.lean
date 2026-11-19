import Qpu.Mint
import Qpu.Lattice

/-! # Qpu.Leads.ProgramSynthesis

Kernel-checked formalisation of inductive (example-driven) program synthesis over a
deliberately tiny language, with no axioms, no `sorry`, no `opaque`, no `partial`.

**What is formalised.**
* A toy language `Expr`: natural-number literals, one input variable, `add`, `mul`.
  An evaluator `eval : Expr → Nat → Nat` and a size measure `size`.
* Specifications `Spec` are finite lists of input/output examples; `satisfies` is the
  Prop, `satisfiesB` the Bool, and they agree (`satisfiesB_iff`), so satisfaction is decidable.
* A size-ordered enumerative search space `upTo k` containing exactly the programs of
  size `≤ k` (`mem_upTo_of_size_le`, `size_le_of_mem_upTo`), and the synthesiser
  `synth k s := (upTo k).find? (satisfiesB · s)`. Proved: soundness (`synth_sound`),
  bounded completeness (`synth_complete`), minimality of the returned program
  (`synth_minimal`), and decidability of bounded satisfiability (`satisfiable_iff`).
* Constraint propagation `prune` / `propagate` (filtering candidates example by example):
  it never removes a satisfying program, never adds one (`mem_propagate`), and never grows
  (`propagate_length_le`); the CEGIS step (`counterexample_of_not_satisfies`,
  `cegis_eliminates`); the link `synth_mem_propagate` / `propagate_nil_iff`.
* A sound refinement-type inference `lower` (a lower bound on every output, exact at input 0:
  `eval_zero`, `lower_le_eval`) with a sound and complete bidirectional check `checkLower`.
* Program repair by one substitution at a position (`replace`, `get?`): it preserves every
  test on whose input the patch agrees with the old subterm (`repair_preserves`), and every
  single failing test has a one-step root patch (`repair_root`); sizes are accounted
  (`size_replace`).
* Sketches with holes (`Sketch`, `fill`, `holes`, `skeleton`): the size law `size_fill`,
  rigidity of hole-free sketches, and a sound/complete sketch-completion search `complete`.
* Observational equivalence `Equiv`, spec decomposition `satisfies_append`, specification
  learning from traces `trace`, a monotonicity obstruction showing some specs have no
  program at all (`satisfiable_monotone`, `unsatisfiable_spec`), affine expressibility.
* Labelled concrete worked examples checked by `decide` (`succ_synth`, `double_synth`, ...).

**What is deliberately not formalised.** Search is bounded by size; there is no
unbounded completeness (the language has infinitely many programs, `programs_unbounded`).
The language has no conditionals, subtraction or higher-order terms, so it is not Turing
complete, and `eval` is monotone (`eval_mono`). There is no `2^(8k)` bound on the size of the
search space, only finiteness and exact counts for small `k` (`upTo_counts`). Statements of
the earlier sketch that spoke of reals, neural scores, SMT solvers, lambda calculus or
polymorphism have no honest counterpart here and were dropped; each surviving theorem
carries a doc comment naming the sketch theorem it realises. -/

namespace Qpu.ProgramSynthesis

/-- The toy language: constants, one input variable, addition and multiplication. -/
inductive Expr where
  | lit : Nat → Expr
  | var : Expr
  | add : Expr → Expr → Expr
  | mul : Expr → Expr → Expr
  deriving DecidableEq, Repr

open Expr

/-- Evaluation of a program on one input. -/
def eval : Expr → Nat → Nat
  | lit c, _ => c
  | var, x => x
  | add a b, x => eval a x + eval b x
  | mul a b, x => eval a x * eval b x

/-- Program size: a literal `c` costs `c + 1`, so that each size class is finite. -/
def size : Expr → Nat
  | lit c => c + 1
  | var => 1
  | add a b => size a + size b + 1
  | mul a b => size a + size b + 1

theorem size_pos (e : Expr) : 0 < size e := by
  cases e <;> simp [size]

/-- One input/output example. -/
abbrev Example := Nat × Nat
/-- A specification is a finite list of examples. -/
abbrev Spec := List Example

/-- Boolean check of one example. -/
def holds (e : Expr) (ex : Example) : Bool := eval e ex.1 == ex.2
/-- Boolean check of a whole specification. -/
def satisfiesB (e : Expr) (s : Spec) : Bool := s.all (holds e)
/-- The program meets every example of the specification. -/
def satisfies (e : Expr) (s : Spec) : Prop := ∀ ex ∈ s, eval e ex.1 = ex.2

/-- Sketch "input_output_consistency": the per-example check decides exactly consistency. -/
theorem holds_iff (e : Expr) (ex : Example) : holds e ex = true ↔ eval e ex.1 = ex.2 := by
  simp [holds]

/-- Sketch "smt_decidable" / "witness_generation": the Boolean checker agrees with the Prop,
so satisfaction of a finite specification is decidable. -/
theorem satisfiesB_iff (e : Expr) (s : Spec) : satisfiesB e s = true ↔ satisfies e s := by
  simp [satisfiesB, satisfies, List.all_eq_true, holds_iff]

instance (e : Expr) (s : Spec) : Decidable (satisfies e s) :=
  decidable_of_iff _ (satisfiesB_iff e s)

/-! ## The size-ordered search space -/

/-- All programs of size exactly `k + 1`, given `prev` = the programs of size `≤ k`. -/
def layer (k : Nat) (prev : List Expr) : List Expr :=
  (if k = 0 then [var] else []) ++ lit k ::
    prev.flatMap fun a => prev.flatMap fun b =>
      if size a + size b = k then [add a b, mul a b] else []

/-- All programs of size `≤ k`, listed in non-decreasing size. -/
def upTo : Nat → List Expr
  | 0 => []
  | k + 1 => upTo k ++ layer k (upTo k)

theorem size_of_mem_layer {k : Nat} {prev : List Expr} {e : Expr} (h : e ∈ layer k prev) :
    size e = k + 1 := by
  simp only [layer, List.mem_append, List.mem_cons, List.mem_flatMap] at h
  rcases h with h | h | ⟨a, _, b, _, h⟩
  · by_cases hk : k = 0
    · simp [hk] at h; subst h; simp [size, hk]
    · simp [hk] at h
  · subst h; rfl
  · by_cases hab : size a + size b = k
    · simp [hab] at h
      rcases h with h | h <;> subst h <;> simp only [size] <;> omega
    · simp [hab] at h

/-- Sketch "program_space_bounded" (half): everything enumerated at bound `k` has size `≤ k`. -/
theorem size_le_of_mem_upTo : ∀ {k : Nat} {e : Expr}, e ∈ upTo k → size e ≤ k
  | 0, _, h => by simp [upTo] at h
  | k + 1, e, h => by
    rw [upTo, List.mem_append] at h
    rcases h with h | h
    · exact Nat.le_succ_of_le (size_le_of_mem_upTo h)
    · exact Nat.le_of_eq (size_of_mem_layer h)

/-- Sketch "program_space_bounded" (other half) and "enumeration_complete": the finite list
`upTo k` contains every program of size `≤ k`. -/
theorem mem_upTo_of_size_le : ∀ {k : Nat} (e : Expr), size e ≤ k → e ∈ upTo k
  | 0, e, h => absurd h (Nat.not_le_of_lt (size_pos e))
  | k + 1, e, h => by
    rw [upTo, List.mem_append]
    rcases Nat.lt_or_eq_of_le h with hlt | heq
    · exact Or.inl (mem_upTo_of_size_le e (Nat.le_of_lt_succ hlt))
    · right
      simp only [layer, List.mem_append, List.mem_cons, List.mem_flatMap]
      cases e with
      | lit c =>
        right; left
        simp only [size] at heq
        have : c = k := by omega
        subst this; rfl
      | var =>
        left
        simp only [size] at heq
        have hk : k = 0 := by omega
        simp [hk]
      | add a b =>
        right; right
        simp only [size] at heq
        have hab : size a + size b = k := by omega
        refine ⟨a, mem_upTo_of_size_le a (by omega), b, mem_upTo_of_size_le b (by omega), ?_⟩
        simp [hab]
      | mul a b =>
        right; right
        simp only [size] at heq
        have hab : size a + size b = k := by omega
        refine ⟨a, mem_upTo_of_size_le a (by omega), b, mem_upTo_of_size_le b (by omega), ?_⟩
        simp [hab]

/-- Sketch "modular_synthesis": the program space is unbounded in size. -/
theorem programs_unbounded (k : Nat) : ∃ e : Expr, k < size e :=
  ⟨lit k, Nat.lt_succ_self k⟩

/-- Labelled worked example: exact counts of the search space for small bounds. -/
theorem upTo_counts :
    (upTo 1).length = 2 ∧ (upTo 2).length = 3 ∧ (upTo 3).length = 12 ∧ (upTo 4).length = 21 := by
  decide

/-! ## The synthesiser -/

/-- Bounded enumerative synthesis: the first program of size `≤ k` meeting the spec. -/
def synth (k : Nat) (s : Spec) : Option Expr := (upTo k).find? (fun e => satisfiesB e s)

/-- Sketch "functional_correctness_proof" / "generated_code_type_safe": soundness, a returned
program satisfies the specification. -/
theorem synth_sound {k : Nat} {s : Spec} {e : Expr} (h : synth k s = some e) : satisfies e s := by
  have h' : (upTo k).find? (fun e => satisfiesB e s) = some e := h
  have hp := List.find?_some h'
  exact (satisfiesB_iff e s).mp hp

/-- A returned program respects the size bound. -/
theorem synth_size {k : Nat} {s : Spec} {e : Expr} (h : synth k s = some e) : size e ≤ k :=
  size_le_of_mem_upTo (List.mem_of_find?_eq_some h)

/-- Sketch "enumeration_complete" / "correct_program_exists": completeness up to the bound, a
spec with a witness of size `≤ k` is solved by `synth k`. -/
theorem synth_complete {k : Nat} {s : Spec} {w : Expr} (hw : satisfies w s) (hk : size w ≤ k) :
    ∃ e, synth k s = some e := by
  cases h : synth k s with
  | some e => exact ⟨e, rfl⟩
  | none =>
    exfalso
    unfold synth at h
    exact List.find?_eq_none.mp h w (mem_upTo_of_size_le w hk) ((satisfiesB_iff w s).mpr hw)

/-- Sketch "minimal_program_exists" / "flipping_synthesis": the size-ordered search returns a
program no larger than any program satisfying the spec. -/
theorem synth_minimal {s : Spec} : ∀ {k : Nat} {e : Expr}, synth k s = some e →
    ∀ w, satisfies w s → size e ≤ size w
  | 0, _, h, _, _ => by simp [synth, upTo] at h
  | k + 1, e, h, w, hw => by
    rcases Nat.lt_or_ge k (size w) with hlt | hge
    · exact Nat.le_trans (synth_size h) hlt
    · have hwmem := mem_upTo_of_size_le w hge
      simp only [synth, upTo, List.find?_append] at h
      cases h' : (upTo k).find? (fun e => satisfiesB e s) with
      | none =>
        exfalso
        exact List.find?_eq_none.mp h' w hwmem ((satisfiesB_iff w s).mpr hw)
      | some e' =>
        rw [h'] at h
        simp at h
        subst h
        exact synth_minimal (show synth k s = some e' from h') w hw

/-- Bounded satisfiability as a Boolean. -/
def satisfiable (k : Nat) (s : Spec) : Bool := (synth k s).isSome

/-- Sketch "constraints_satisfiable" / "repair_patch_exists": bounded satisfiability is decided
exactly by running the synthesiser. -/
theorem satisfiable_iff (k : Nat) (s : Spec) :
    satisfiable k s = true ↔ ∃ e, size e ≤ k ∧ satisfies e s := by
  constructor
  · intro h
    cases hs : synth k s with
    | none => simp [satisfiable, hs] at h
    | some e => exact ⟨e, synth_size hs, synth_sound hs⟩
  · rintro ⟨e, hk, he⟩
    obtain ⟨e', he'⟩ := synth_complete he hk
    simp [satisfiable, he']

/-- Sketch "input_output_consistency" at the level of a single example: a one-example
specification is always satisfiable, by the constant program. -/
theorem singleton_satisfiable (ex : Example) : satisfies (lit ex.2) [ex] := by
  intro e he
  simp at he
  subst he
  rfl

/-! ## Constraint propagation and CEGIS -/

/-- Filter a candidate list by one example. -/
def prune (ex : Example) (cands : List Expr) : List Expr := cands.filter (fun e => holds e ex)

/-- Propagate every example of the spec through the candidate list. -/
def propagate : Spec → List Expr → List Expr
  | [], c => c
  | ex :: s, c => propagate s (prune ex c)

theorem mem_prune {ex : Example} {c : List Expr} {e : Expr} :
    e ∈ prune ex c ↔ e ∈ c ∧ eval e ex.1 = ex.2 := by
  simp [prune, List.mem_filter, holds_iff]

/-- Sketch "constraint_propagation_reduces": one propagation step never grows the domain. -/
theorem prune_length_le (ex : Example) (c : List Expr) : (prune ex c).length ≤ c.length :=
  List.length_filter_le _ _

/-- Constraint propagation never removes a program satisfying the spec. -/
theorem prune_keeps {ex : Example} {s : Spec} {c : List Expr} {e : Expr}
    (hs : satisfies e s) (hex : ex ∈ s) (hc : e ∈ c) : e ∈ prune ex c :=
  mem_prune.mpr ⟨hc, hs ex hex⟩

/-- Sketch "constraint_propagation" completeness and soundness in one: the propagated domain is
exactly the candidates satisfying the whole spec. -/
theorem mem_propagate : ∀ {s : Spec} {c : List Expr} {e : Expr},
    e ∈ propagate s c ↔ e ∈ c ∧ satisfies e s
  | [], c, e => by simp [propagate, satisfies]
  | ex :: s, c, e => by
    rw [propagate, mem_propagate, mem_prune]
    simp only [satisfies, List.mem_cons]
    constructor
    · rintro ⟨⟨hc, hx⟩, hs⟩
      refine ⟨hc, fun x hx' => ?_⟩
      rcases hx' with rfl | hx'
      · exact hx
      · exact hs x hx'
    · rintro ⟨hc, h⟩
      exact ⟨⟨hc, h ex (Or.inl rfl)⟩, fun x hx => h x (Or.inr hx)⟩

/-- Sketch "inductive_synthesis_converges" / "constraint_propagation_reduces": propagation of
any number of examples never grows the candidate domain. -/
theorem propagate_length_le : ∀ (s : Spec) (c : List Expr), (propagate s c).length ≤ c.length
  | [], _ => Nat.le_refl _
  | ex :: s, c => Nat.le_trans (propagate_length_le s (prune ex c)) (prune_length_le ex c)

/-- More examples prune at least as much (monotone convergence of the domain). -/
theorem propagate_append_subset {s t : Spec} {c : List Expr} {e : Expr}
    (h : e ∈ propagate (s ++ t) c) : e ∈ propagate s c := by
  rw [mem_propagate] at h ⊢
  exact ⟨h.1, fun ex hex => h.2 ex (List.mem_append_left t hex)⟩

/-- The synthesiser's answer survives propagation of the whole spec. -/
theorem synth_mem_propagate {k : Nat} {s : Spec} {e : Expr} (h : synth k s = some e) :
    e ∈ propagate s (upTo k) :=
  mem_propagate.mpr ⟨List.mem_of_find?_eq_some h, synth_sound h⟩

/-- Propagation empties the bounded domain exactly when the synthesiser fails. -/
theorem propagate_nil_iff (k : Nat) (s : Spec) : propagate s (upTo k) = [] ↔ synth k s = none := by
  rw [List.eq_nil_iff_forall_not_mem]
  unfold synth
  rw [List.find?_eq_none]
  constructor
  · intro h e he hb
    exact h e (mem_propagate.mpr ⟨he, (satisfiesB_iff e s).mp hb⟩)
  · intro h e he
    have := mem_propagate.mp he
    exact h e this.1 ((satisfiesB_iff e s).mpr this.2)

/-- Sketch "cegis_refinement" (first half): a candidate that fails the spec admits a
counterexample inside the spec. -/
theorem counterexample_of_not_satisfies {e : Expr} {s : Spec} (h : ¬ satisfies e s) :
    ∃ ex ∈ s, eval e ex.1 ≠ ex.2 := by
  apply Classical.byContradiction
  intro hne
  apply h
  intro ex hex
  apply Classical.byContradiction
  intro hneq
  exact hne ⟨ex, hex, hneq⟩

/-- Sketch "cegis_refinement" (second half): adding the counterexample eliminates the
candidate from the domain. -/
theorem cegis_eliminates {e : Expr} {ex : Example} {c : List Expr} (hne : eval e ex.1 ≠ ex.2) :
    e ∉ prune ex c :=
  fun h => hne (mem_prune.mp h).2

/-! ## Observational equivalence and specifications -/

/-- Observational equivalence: equal on every input. -/
def Equiv (e₁ e₂ : Expr) : Prop := ∀ x, eval e₁ x = eval e₂ x

/-- Sketch "observational_equiv_testable": equivalent programs satisfy the same specs. -/
theorem satisfies_of_equiv {e₁ e₂ : Expr} {s : Spec} (h : Equiv e₁ e₂) :
    satisfies e₁ s ↔ satisfies e₂ s := by
  constructor
  · intro hh ex hex; rw [← h]; exact hh ex hex
  · intro hh ex hex; rw [h]; exact hh ex hex

/-- Labelled worked example: `x + x` and `2 * x` are observationally equivalent. -/
theorem double_equiv : Equiv (add var var) (mul (lit 2) var) := fun x => by
  show x + x = 2 * x
  omega

/-- Labelled worked example: testing is sound but not complete, `x * x` and `x + x` agree on the
tests `0 ↦ 0`, `2 ↦ 4` yet differ at `1`. -/
theorem testing_incomplete :
    satisfies (mul var var) [(0, 0), (2, 4)] ∧ satisfies (add var var) [(0, 0), (2, 4)] ∧
      ¬ Equiv (mul var var) (add var var) :=
  ⟨by decide, by decide, fun h => absurd (h 1) (by decide)⟩

/-- Sketch "top_down_decomposition": a specification splits into conjunctive subgoals. -/
theorem satisfies_append {e : Expr} (s t : Spec) :
    satisfies e (s ++ t) ↔ satisfies e s ∧ satisfies e t := by
  simp [satisfies, List.mem_append, or_imp, forall_and]

/-- Sketch "bottom_up_composition": the size of a composed program is the sum of its parts
plus one, for both constructors. -/
theorem size_compose (a b : Expr) :
    size (add a b) = size a + size b + 1 ∧ size (mul a b) = size a + size b + 1 :=
  ⟨rfl, rfl⟩

/-- Sketch "constraint_learning" / "implicit_specification_learning": learn a spec from the
trace of a program on chosen inputs. -/
def trace (e : Expr) (inputs : List Nat) : Spec := inputs.map fun x => (x, eval e x)

/-- Sketch "trace_based_synthesis": the traced program satisfies its own learned spec. -/
theorem satisfies_trace (e : Expr) (inputs : List Nat) : satisfies e (trace e inputs) := by
  intro ex hex
  simp [trace, List.mem_map] at hex
  obtain ⟨x, _, rfl⟩ := hex
  rfl

/-- Any program equivalent to the traced one satisfies the learned spec. -/
theorem equiv_satisfies_trace {e₁ e₂ : Expr} (h : Equiv e₁ e₂) (inputs : List Nat) :
    satisfies e₂ (trace e₁ inputs) :=
  (satisfies_of_equiv h).mp (satisfies_trace e₁ inputs)

/-- Sketch "trace_based_synthesis": a learned spec is always solved by the bounded synthesiser
at the size of its source program, with a result no larger than the source. -/
theorem synth_trace (e : Expr) (inputs : List Nat) :
    ∃ e', synth (size e) (trace e inputs) = some e' ∧ size e' ≤ size e := by
  obtain ⟨e', h⟩ := synth_complete (satisfies_trace e inputs) (Nat.le_refl (size e))
  exact ⟨e', h, synth_size h⟩

/-! ## Monotonicity, refinement types and bidirectional checking -/

/-- Sketch "lambda_turing_complete", replaced by the honest limitation: every program of this
language is monotone in its input, so the language is far from Turing complete. -/
theorem eval_mono (e : Expr) {x y : Nat} (h : x ≤ y) : eval e x ≤ eval e y := by
  induction e with
  | lit c => exact Nat.le_refl c
  | var => exact h
  | add a b iha ihb => exact Nat.add_le_add iha ihb
  | mul a b iha ihb => exact Nat.mul_le_mul iha ihb

/-- Sketch "correct_program_exists" is false in general: a satisfiable spec must be monotone. -/
theorem satisfiable_monotone {e : Expr} {s : Spec} (h : satisfies e s) {x y x' y' : Nat}
    (h₁ : (x, y) ∈ s) (h₂ : (x', y') ∈ s) (hx : x ≤ x') : y ≤ y' := by
  have e1 : eval e x = y := h (x, y) h₁
  have e2 : eval e x' = y' := h (x', y') h₂
  rw [← e1, ← e2]
  exact eval_mono e hx

/-- Labelled counterexample: no program maps `0 ↦ 1` and `1 ↦ 0`. -/
theorem unsatisfiable_spec (e : Expr) : ¬ satisfies e [(0, 1), (1, 0)] := fun h =>
  absurd (satisfiable_monotone h (x := 0) (y := 1) (x' := 1) (y' := 0) (by simp) (by simp)
    (Nat.zero_le 1)) (by decide)

/-- Labelled counterexample: an inconsistent spec (two outputs for one input) has no program. -/
theorem inconsistent_spec (e : Expr) : ¬ satisfies e [(0, 0), (0, 1)] := fun h =>
  absurd ((h (0, 0) (by simp)).symm.trans (h (0, 1) (by simp))) (by decide)

/-- Refinement-type inference: a lower bound on every output of the program. -/
def lower : Expr → Nat
  | lit c => c
  | var => 0
  | add a b => lower a + lower b
  | mul a b => lower a * lower b

/-- Sketch "type_inference_sound" (exactness): the inferred bound is the value at input `0`. -/
theorem eval_zero (e : Expr) : eval e 0 = lower e := by
  induction e with
  | lit c => rfl
  | var => rfl
  | add a b iha ihb => simp [eval, lower, iha, ihb]
  | mul a b iha ihb => simp [eval, lower, iha, ihb]

/-- Sketch "refinement_type_synthesis" / "abstraction_preserves_safety" / "typed_program_valid":
the inferred refinement `{v | lower e ≤ v}` is sound for every input. -/
theorem lower_le_eval (e : Expr) (x : Nat) : lower e ≤ eval e x := by
  rw [← eval_zero]
  exact eval_mono e (Nat.zero_le x)

/-- Bidirectional check of a program against an expected lower bound. -/
def checkLower (e : Expr) (bound : Nat) : Bool := decide (bound ≤ lower e)

/-- Sketch "bidirectional_check" (soundness): a program passing the check meets the bound on
every input. -/
theorem checkLower_sound {e : Expr} {bound : Nat} (h : checkLower e bound = true) (x : Nat) :
    bound ≤ eval e x :=
  Nat.le_trans (of_decide_eq_true h) (lower_le_eval e x)

/-- Sketch "bidirectional_check" (completeness): a program meeting the bound everywhere passes. -/
theorem checkLower_complete {e : Expr} {bound : Nat} (h : ∀ x, bound ≤ eval e x) :
    checkLower e bound = true :=
  decide_eq_true (by rw [← eval_zero]; exact h 0)

/-- Sketch "generated_code_type_safe": whatever the synthesiser returns is a total, monotone
program satisfying the spec and the size bound. -/
theorem synth_typed {k : Nat} {s : Spec} {e : Expr} (h : synth k s = some e) :
    satisfies e s ∧ size e ≤ k ∧ ∀ x y, x ≤ y → eval e x ≤ eval e y :=
  ⟨synth_sound h, synth_size h, fun _ _ hxy => eval_mono e hxy⟩

/-- Sketch "grammar_expressive_power": every affine map `x ↦ a * x + b` is expressible. -/
def affine (a b : Nat) : Expr := add (mul (lit a) var) (lit b)

theorem eval_affine (a b x : Nat) : eval (affine a b) x = a * x + b := rfl

theorem size_affine (a b : Nat) : size (affine a b) = a + b + 5 := by
  simp only [affine, size]
  omega

/-! ## Repair by one substitution -/

/-- A position in a program tree. -/
inductive Pos where
  | here : Pos
  | left : Pos → Pos
  | right : Pos → Pos

/-- The subterm at a position, if any. -/
def get? : Expr → Pos → Option Expr
  | e, .here => some e
  | add a _, .left p => get? a p
  | add _ b, .right p => get? b p
  | mul a _, .left p => get? a p
  | mul _ b, .right p => get? b p
  | lit _, .left _ => none
  | lit _, .right _ => none
  | var, .left _ => none
  | var, .right _ => none

/-- Replace the subterm at a position (no-op when the position does not exist). -/
def replace : Expr → Pos → Expr → Expr
  | _, .here, new => new
  | add a b, .left p, new => add (replace a p new) b
  | add a b, .right p, new => add a (replace b p new)
  | mul a b, .left p, new => mul (replace a p new) b
  | mul a b, .right p, new => mul a (replace b p new)
  | lit c, .left _, _ => lit c
  | lit c, .right _, _ => lit c
  | var, .left _, _ => var
  | var, .right _, _ => var

/-- Congruence: a patch agreeing with the old subterm on `x` leaves the whole program's value
at `x` unchanged. -/
theorem eval_replace : ∀ (e : Expr) (p : Pos) {old new : Expr}, get? e p = some old →
    ∀ {x : Nat}, eval new x = eval old x → eval (replace e p new) x = eval e x
  | _, .here, _, _, hget, _, hagree => by
    simp only [get?, Option.some.injEq] at hget
    subst hget
    simp only [replace]
    exact hagree
  | add a b, .left p, _, new, hget, x, hagree => by
    simp only [replace, eval]
    rw [eval_replace a p hget hagree]
  | add a b, .right p, _, new, hget, x, hagree => by
    simp only [replace, eval]
    rw [eval_replace b p hget hagree]
  | mul a b, .left p, _, new, hget, x, hagree => by
    simp only [replace, eval]
    rw [eval_replace a p hget hagree]
  | mul a b, .right p, _, new, hget, x, hagree => by
    simp only [replace, eval]
    rw [eval_replace b p hget hagree]
  | lit _, .left _, _, _, hget, _, _ => by simp [get?] at hget
  | lit _, .right _, _, _, hget, _, _ => by simp [get?] at hget
  | var, .left _, _, _, hget, _, _ => by simp [get?] at hget
  | var, .right _, _, _, hget, _, _ => by simp [get?] at hget

/-- Sketch "sketch_has_completion" (size accounting of a patch): size is conserved up to the
exchanged subterms. -/
theorem size_replace : ∀ (e : Expr) (p : Pos) {old new : Expr}, get? e p = some old →
    size (replace e p new) + size old = size e + size new
  | _, .here, _, _, hget => by
    simp only [get?, Option.some.injEq] at hget
    subst hget
    simp only [replace]
    exact Nat.add_comm _ _
  | add a b, .left p, _, new, hget => by
    simp only [replace, size]
    have := size_replace a p (new := new) hget
    omega
  | add a b, .right p, _, new, hget => by
    simp only [replace, size]
    have := size_replace b p (new := new) hget
    omega
  | mul a b, .left p, _, new, hget => by
    simp only [replace, size]
    have := size_replace a p (new := new) hget
    omega
  | mul a b, .right p, _, new, hget => by
    simp only [replace, size]
    have := size_replace b p (new := new) hget
    omega
  | lit _, .left _, _, _, hget => by simp [get?] at hget
  | lit _, .right _, _, _, hget => by simp [get?] at hget
  | var, .left _, _, _, hget => by simp [get?] at hget
  | var, .right _, _, _, hget => by simp [get?] at hget

/-- Sketch "repair_patch_exists" / "example_driven_repair": a one-substitution repair preserves
every test on whose input the patch agrees with the replaced subterm. -/
theorem repair_preserves {e : Expr} {p : Pos} {old new : Expr} (hget : get? e p = some old)
    {ex : Example} (hpass : eval e ex.1 = ex.2) (hagree : eval new ex.1 = eval old ex.1) :
    eval (replace e p new) ex.1 = ex.2 := by
  rw [eval_replace e p hget hagree]
  exact hpass

/-- The whole-spec form: tests unaffected by the patch keep passing. -/
theorem repair_preserves_spec {e : Expr} {p : Pos} {old new : Expr} {s : Spec}
    (hget : get? e p = some old) (hs : satisfies e s)
    (hagree : ∀ ex ∈ s, eval new ex.1 = eval old ex.1) : satisfies (replace e p new) s :=
  fun ex hex => repair_preserves hget (hs ex hex) (hagree ex hex)

/-- Sketch "example_driven_repair": any single failing test is fixed by one root patch. -/
theorem repair_root (e : Expr) (ex : Example) : eval (replace e .here (lit ex.2)) ex.1 = ex.2 := by
  simp [replace, eval]

/-! ## Sketches with holes -/

/-- A program sketch: a program with holes. -/
inductive Sketch where
  | hole : Sketch
  | lit : Nat → Sketch
  | var : Sketch
  | add : Sketch → Sketch → Sketch
  | mul : Sketch → Sketch → Sketch

/-- Fill every hole with the same program. -/
def fill : Sketch → Expr → Expr
  | .hole, e => e
  | .lit c, _ => lit c
  | .var, _ => var
  | .add a b, e => add (fill a e) (fill b e)
  | .mul a b, e => mul (fill a e) (fill b e)

/-- Number of holes. -/
def holes : Sketch → Nat
  | .hole => 1
  | .lit _ => 0
  | .var => 0
  | .add a b => holes a + holes b
  | .mul a b => holes a + holes b

/-- Size of the hole-free part. -/
def skeleton : Sketch → Nat
  | .hole => 0
  | .lit c => c + 1
  | .var => 1
  | .add a b => skeleton a + skeleton b + 1
  | .mul a b => skeleton a + skeleton b + 1

/-- Size law for filling. -/
theorem size_fill (sk : Sketch) (e : Expr) : size (fill sk e) = skeleton sk + holes sk * size e := by
  induction sk with
  | hole => simp [fill, holes, skeleton]
  | lit c => simp [fill, holes, skeleton, size]
  | var => simp [fill, holes, skeleton, size]
  | add a b iha ihb =>
    simp only [fill, holes, skeleton, size, iha, ihb, Nat.add_mul]
    omega
  | mul a b iha ihb =>
    simp only [fill, holes, skeleton, size, iha, ihb, Nat.add_mul]
    omega

/-- Sketch "sketch_has_completion": filling the holes with the variable yields a program of size
skeleton + holes. -/
theorem sketch_completion_size (sk : Sketch) : size (fill sk var) = skeleton sk + holes sk := by
  simp [size_fill, size]

/-- Sketch "hof_unification_exists", replaced by rigidity: a hole-free sketch denotes one program
whatever it is instantiated with. -/
theorem fill_of_holes_zero : ∀ (sk : Sketch), holes sk = 0 → ∀ e e', fill sk e = fill sk e'
  | .hole, h, _, _ => by simp [holes] at h
  | .lit _, _, _, _ => rfl
  | .var, _, _, _ => rfl
  | .add a b, h, e, e' => by
    simp only [holes] at h
    simp only [fill]
    rw [fill_of_holes_zero a (by omega) e e', fill_of_holes_zero b (by omega) e e']
  | .mul a b, h, e, e' => by
    simp only [holes] at h
    simp only [fill]
    rw [fill_of_holes_zero a (by omega) e e', fill_of_holes_zero b (by omega) e e']

/-- Sketch completion: the first program of size `≤ k` whose filling meets the spec. -/
def complete (k : Nat) (sk : Sketch) (s : Spec) : Option Expr :=
  (upTo k).find? (fun e => satisfiesB (fill sk e) s)

/-- Sketch "sketch_has_completion" (soundness of completion). -/
theorem complete_sound {k : Nat} {sk : Sketch} {s : Spec} {e : Expr}
    (h : complete k sk s = some e) : satisfies (fill sk e) s := by
  have h' : (upTo k).find? (fun e => satisfiesB (fill sk e) s) = some e := h
  have hp := List.find?_some h'
  exact (satisfiesB_iff _ _).mp hp

/-- Sketch completion is complete up to the bound. -/
theorem complete_complete {k : Nat} {sk : Sketch} {s : Spec} {w : Expr}
    (hw : satisfies (fill sk w) s) (hk : size w ≤ k) : ∃ e, complete k sk s = some e := by
  cases h : complete k sk s with
  | some e => exact ⟨e, rfl⟩
  | none =>
    exfalso
    unfold complete at h
    exact List.find?_eq_none.mp h w (mem_upTo_of_size_le w hk) ((satisfiesB_iff _ s).mpr hw)

/-- Plain synthesis is completion of the bare hole. -/
theorem complete_hole (k : Nat) (s : Spec) : complete k .hole s = synth k s := rfl

/-! ## Labelled worked examples -/

/-- The successor spec `0 ↦ 1, 1 ↦ 2, 2 ↦ 3`. -/
def succSpec : Spec := [(0, 1), (1, 2), (2, 3)]

/-- Worked example: at bound 4 the synthesiser finds `x + 1`, and nothing of size `≤ 3` fits. -/
theorem succ_synth : synth 4 succSpec = some (add var (lit 1)) ∧ synth 3 succSpec = none := by
  decide

/-- The doubling spec `1 ↦ 2, 3 ↦ 6`. -/
def doubleSpec : Spec := [(1, 2), (3, 6)]

/-- Worked example: the synthesiser returns `x + x` (size 3), not the equivalent `2 * x` (size 5),
and minimality confirms it. -/
theorem double_synth :
    synth 3 doubleSpec = some (add var var) ∧ size (add var var) ≤ size (mul (lit 2) var) := by
  have h3 : synth 3 doubleSpec = some (add var var) := by decide
  refine ⟨h3, synth_minimal h3 _ ?_⟩
  exact (satisfies_of_equiv double_equiv).mp (synth_sound h3)

/-- Worked example: pruning the size-3 space by the first doubling example leaves exactly the
programs with `1 ↦ 2`, and propagating both examples leaves exactly `x + x`. -/
theorem double_propagate : propagate doubleSpec (upTo 3) = [add var var] := by
  decide

end Qpu.ProgramSynthesis
