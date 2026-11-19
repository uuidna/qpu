import Qpu.Mint
import Qpu.Lattice

/-! # Qpu.Leads.ExplainableAI

Explainability of a finite model, formalised without real numbers and without
axioms. Everything below is a computable definition over `Nat`, `Int` and
`List`, and every theorem is checked by the kernel.

What is formalised:

* **Linear (additive) model.** `Linear` has integer `weights` and a `bias`;
  `Linear.eval` is `bias + Σ wᵢ xᵢ` over the common prefix of weights and input.
* **Attribution and completeness.** `attr w x b` is the linear
  (Aumann–Shapley / integrated-gradients / DeepLIFT-rescale) attribution
  `wᵢ (xᵢ − bᵢ)` against a baseline `b`; its sum is exactly the output
  difference (`attr_sum`, `attr_complete`). The same completeness is proved
  for the model-agnostic sequential-ablation attribution `ablation f x b`
  of an arbitrary `f : List Int → Int` (`ablation_complete`, a telescoping sum).
* **Integrated gradients.** Along the straight path a linear model has a
  constant gradient, so the `steps`-point Riemann sum is `steps` copies of the
  attribution and the average is the attribution itself
  (`integrated_gradients_linear`).
* **Perturbation.** Replacing feature `i` changes the output by
  `wᵢ · (new − old)` (`eval_set_sub_set`, `eval_sub_set`), giving occlusion
  sensitivity, permutation importance, local sensitivity (`sensitivity_eq_weight`,
  `sensitivity_ratio`), partial-dependence slope (`pd_slope`), zero interaction
  between distinct features (`interaction_zero`), noise invariance of the
  finite-difference gradient (`sensitivity_noise_invariant`), zero saliency ⇒
  insensitivity (`saliency_zero_insensitive`), and the Shapley fact that every
  marginal contribution equals the attribution (`shap_marginal_constant`).
* **Influence.** Leave-one-out retraining of a kernel/sum predictor equals the
  influence term (`influence_loo`); influence does not depend on the other
  samples (`influence_stability`).
* **Attention.** `Attention T` is a list of natural weights whose sum is the
  fixed total `T` (the role of "sums to one"). Each weight is at most `T`
  (`attention_weight_le_total`), uniform attention exists for every total
  `len * k` (`uniform`), heads concatenate additively (`attention_concat`), and
  attention rollout / class-activation maps preserve normalisation at scale
  `T · T` (`sum_rollout`, `attention_rollout_normalised`, `cam_total`).
* **Layer-wise relevance propagation.** A layer is a list of splits, one per
  upper neuron, each a list of relevances sent to the lower neurons; the lower
  relevance is the column sum (`propagate`). Relevance is conserved exactly
  through one layer (`propagate_sum`) and through any chain of conserving
  layers (`lrp_conservation`).
* **Counterfactuals.** Hamming distance between inputs (`hamming`); a feature
  with nonzero weight yields a counterfactual at distance ≤ 1 that changes the
  prediction (`counterfactual_exists`).
* **Importance bounds.** With `importance = |attribution|`, no single
  importance exceeds the total (`importance_le_total`) and the total bounds the
  absolute output change (`output_change_le_total_importance`).
* **Monotonicity.** Nonnegative weights give a monotone model (`eval_mono`).
* **Surrogates.** `fidelity f g data` counts agreements; it is at most the data
  size and equals it for a perfect surrogate (`fidelity_le`, `fidelity_self`);
  the support of the weights is a sufficient explanation (`support_sufficient`).

What is deliberately not formalised: real numbers (totals and weights are
naturals or integers, "sums to one" is "sums to a fixed total", division appears
only where it is exact), gradients of nonlinear models (only the linear case
and finite differences), and the sketch's unbounded existence statements
(`∃ score ∈ [0,1]`), which are replaced by the exact conservation laws above.
-/

namespace Qpu.Xai

/-! ## The linear model -/

/-- A finite additive model: one integer weight per feature and a bias. -/
structure Linear where
  weights : List Int
  bias : Int

/-- Inner product over the common prefix (extra entries on either side are ignored). -/
def dot : List Int → List Int → Int
  | w :: ws, x :: xs => w * x + dot ws xs
  | [], _ => 0
  | _ :: _, [] => 0

/-- Model output. -/
def Linear.eval (m : Linear) (x : List Int) : Int := m.bias + dot m.weights x

/-! ## Attribution against a baseline -/

/-- Linear attribution `wᵢ (xᵢ − bᵢ)` (Aumann–Shapley, integrated gradients and
DeepLIFT-rescale all coincide for a linear model). -/
def attr : List Int → List Int → List Int → List Int
  | w :: ws, x :: xs, b :: bs => w * (x - b) :: attr ws xs bs
  | [], _, _ => []
  | _ :: _, [], _ => []
  | _ :: _, _ :: _, [] => []

/-- **Attribution additivity / completeness** on the inner product: the attributions
sum to the change of the inner product, for any weights, when input and baseline
have the same length. Tactic: induction on the weights, `omega` on the arithmetic. -/
theorem attr_sum (w x b : List Int) (h : x.length = b.length) :
    (attr w x b).sum = dot w x - dot w b := by
  induction w generalizing x b with
  | nil => simp [attr, dot]
  | cons w ws ih =>
    cases x with
    | nil =>
      cases b with
      | nil => simp [attr, dot]
      | cons _ _ => simp at h
    | cons x xs =>
      cases b with
      | nil => simp at h
      | cons b bs =>
        simp only [List.length_cons, Nat.add_right_cancel_iff] at h
        simp only [attr, dot, List.sum_cons, ih xs bs h]
        rw [Int.mul_sub]
        omega

/-- **Completeness** for the model: `Σ attr = f(x) − f(baseline)`. -/
theorem attr_complete (m : Linear) (x b : List Int) (h : x.length = b.length) :
    (attr m.weights x b).sum = m.eval x - m.eval b := by
  unfold Linear.eval
  rw [attr_sum m.weights x b h]
  omega

/-- The `steps`-point Riemann sum of integrated gradients along the straight path:
the gradient of a linear model is constant, so each step contributes the whole
attribution and the sum is `steps` copies of it. -/
def igRiemann (steps : Nat) (a : Int) : List Int := List.replicate steps a

theorem sum_replicate_int (n : Nat) (a : Int) : (List.replicate n a).sum = n * a := by
  induction n with
  | zero => simp
  | succ n ih =>
    rw [List.replicate_succ, List.sum_cons, ih]
    push_cast
    rw [Int.add_mul, Int.one_mul]
    omega

/-- **Integrated gradients** for a linear model: averaging the Riemann sum over
`steps > 0` steps returns the attribution exactly, independent of `steps`.
(The sketch's `path_integral = 1/steps` is replaced by this exact statement.) -/
theorem integrated_gradients_linear (steps : Nat) (hs : 0 < steps) (a : Int) :
    (igRiemann steps a).sum / (steps : Int) = a := by
  unfold igRiemann
  rw [sum_replicate_int, Int.mul_comm]
  exact Int.mul_ediv_cancel a (by omega)

/-! ## Perturbing one feature -/

/-- Replacing the `i`-th feature by `v` instead of `u` changes the inner product by
`wᵢ (v − u)`. Tactic: induction on `i`. -/
theorem dot_set_sub_set (w l : List Int) (i : Nat) (u v : Int) (hi : i < l.length) :
    dot w (l.set i v) - dot w (l.set i u) = w.getD i 0 * (v - u) := by
  induction i generalizing w l with
  | zero =>
    cases l with
    | nil => simp at hi
    | cons a as =>
      cases w with
      | nil => simp [dot]
      | cons w ws =>
        simp only [List.set_cons_zero, dot, List.getD_cons_zero]
        rw [Int.mul_sub]
        omega
  | succ i ih =>
    cases l with
    | nil => simp at hi
    | cons a as =>
      cases w with
      | nil => simp [dot]
      | cons w ws =>
        simp only [List.length_cons, Nat.add_lt_add_iff_right] at hi
        simp only [List.set_cons_succ, dot, List.getD_cons_succ]
        have := ih ws as hi
        omega

/-- **Occlusion / permutation**: replacing the `i`-th feature by `v` lowers the inner
product by `wᵢ (xᵢ − v)`. -/
theorem dot_sub_set (w l : List Int) (i : Nat) (v : Int) (hi : i < l.length) :
    dot w l - dot w (l.set i v) = w.getD i 0 * (l.getD i 0 - v) := by
  induction i generalizing w l with
  | zero =>
    cases l with
    | nil => simp at hi
    | cons a as =>
      cases w with
      | nil => simp [dot]
      | cons w ws =>
        simp only [List.set_cons_zero, dot, List.getD_cons_zero]
        rw [Int.mul_sub]
        omega
  | succ i ih =>
    cases l with
    | nil => simp at hi
    | cons a as =>
      cases w with
      | nil => simp [dot]
      | cons w ws =>
        simp only [List.length_cons, Nat.add_lt_add_iff_right] at hi
        simp only [List.set_cons_succ, dot, List.getD_cons_succ]
        have := ih ws as hi
        omega

theorem eval_set_sub_set (m : Linear) (l : List Int) (i : Nat) (u v : Int)
    (hi : i < l.length) :
    m.eval (l.set i v) - m.eval (l.set i u) = m.weights.getD i 0 * (v - u) := by
  unfold Linear.eval
  have := dot_set_sub_set m.weights l i u v hi
  omega

/-- **Occlusion sensitivity** of feature `i` with occluding value `v`: exactly the
attribution of that feature against the baseline value `v`. With `v = 0` this is
the sketch's "importance decrease" of permutation importance. -/
theorem eval_sub_set (m : Linear) (l : List Int) (i : Nat) (v : Int) (hi : i < l.length) :
    m.eval l - m.eval (l.set i v) = m.weights.getD i 0 * (l.getD i 0 - v) := by
  unfold Linear.eval
  have := dot_sub_set m.weights l i v hi
  omega

/-- **Sensitivity**: perturbing feature `i` by `δ` changes the output by `wᵢ δ`. -/
theorem sensitivity_eq_weight (m : Linear) (x : List Int) (i : Nat) (δ : Int)
    (hi : i < x.length) :
    m.eval (x.set i (x.getD i 0 + δ)) - m.eval x = m.weights.getD i 0 * δ := by
  have h := eval_sub_set m x i (x.getD i 0 + δ) hi
  have e : x.getD i 0 - (x.getD i 0 + δ) = -δ := by omega
  rw [e, Int.mul_neg] at h
  omega

/-- **Sensitivity ratio** `output change / perturbation` is the weight, for any
nonzero perturbation (the sketch's `sensitivity = output_change / perturbation`). -/
theorem sensitivity_ratio (m : Linear) (x : List Int) (i : Nat) (δ : Int)
    (hi : i < x.length) (hδ : δ ≠ 0) :
    (m.eval (x.set i (x.getD i 0 + δ)) - m.eval x) / δ = m.weights.getD i 0 := by
  rw [sensitivity_eq_weight m x i δ hi]
  exact Int.mul_ediv_cancel _ hδ

/-- **SmoothGrad / noise robustness**: the finite-difference gradient at any
(noisy) point `x'` is the same weight as at `x`. -/
theorem sensitivity_noise_invariant (m : Linear) (x x' : List Int) (i : Nat) (δ : Int)
    (hi : i < x.length) (hi' : i < x'.length) :
    m.eval (x'.set i (x'.getD i 0 + δ)) - m.eval x' =
      m.eval (x.set i (x.getD i 0 + δ)) - m.eval x := by
  rw [sensitivity_eq_weight m x i δ hi, sensitivity_eq_weight m x' i δ hi']

/-- **Partial dependence**: `pd m x i v = f(x with xᵢ := v)`. -/
def pd (m : Linear) (x : List Int) (i : Nat) (v : Int) : Int := m.eval (x.set i v)

/-- The partial-dependence function of a linear model has constant slope `wᵢ`. -/
theorem pd_slope (m : Linear) (x : List Int) (i : Nat) (v : Int) (hi : i < x.length) :
    pd m x i (v + 1) - pd m x i v = m.weights.getD i 0 := by
  unfold pd
  rw [eval_set_sub_set m x i v (v + 1) hi]
  have e : v + 1 - v = 1 := by omega
  rw [e, Int.mul_one]

/-- `getD` ignores a `set` at a different index. -/
theorem getD_set_ne {α : Type} (l : List α) (i j : Nat) (v d : α) (h : i ≠ j) :
    (l.set i v).getD j d = l.getD j d := by
  rw [List.getD_eq_getElem?_getD, List.getD_eq_getElem?_getD, List.getElem?_set_ne h]

/-- **Feature interaction**: the second difference of a linear model across two
distinct features is zero (an additive model has no interactions). The sketch's
`interaction_strength < 1` is replaced by this exact statement. -/
theorem interaction_zero (m : Linear) (x : List Int) (i j : Nat) (a b : Int)
    (hj : j < x.length) (hij : i ≠ j) :
    (m.eval ((x.set i a).set j b) - m.eval (x.set i a)) -
      (m.eval (x.set j b) - m.eval x) = 0 := by
  have h1 := eval_sub_set m (x.set i a) j b (by rw [List.length_set]; exact hj)
  have h2 := eval_sub_set m x j b hj
  rw [getD_set_ne x i j a 0 hij] at h1
  omega

/-! ## Saliency -/

/-- Gradient-based saliency of a linear model: `|wᵢ|`. -/
def saliency (m : Linear) : List Nat := m.weights.map Int.natAbs

theorem getD_map_natAbs (l : List Int) (i : Nat) :
    (l.map Int.natAbs).getD i 0 = (l.getD i 0).natAbs := by
  induction l generalizing i with
  | nil => simp
  | cons a as ih =>
    cases i with
    | zero => simp
    | succ i => rw [List.map_cons, List.getD_cons_succ, List.getD_cons_succ]; exact ih i

/-- Saliency vanishes exactly when the weight does. -/
theorem saliency_zero_iff (m : Linear) (i : Nat) :
    (saliency m).getD i 0 = 0 ↔ m.weights.getD i 0 = 0 := by
  unfold saliency
  rw [getD_map_natAbs]
  exact Int.natAbs_eq_zero

/-- **Gradient saliency**: a feature with zero saliency cannot move the output. -/
theorem saliency_zero_insensitive (m : Linear) (x : List Int) (i : Nat) (v : Int)
    (hi : i < x.length) (hs : (saliency m).getD i 0 = 0) :
    m.eval (x.set i v) = m.eval x := by
  have h := eval_sub_set m x i v hi
  rw [(saliency_zero_iff m i).mp hs, Int.zero_mul] at h
  omega

/-! ## Shapley marginal contributions -/

/-- A coalition is a Boolean mask: kept features take their input value, the others
their baseline value. -/
def mask : List Bool → List Int → List Int → List Int
  | s :: ss, x :: xs, b :: bs => (if s then x else b) :: mask ss xs bs
  | [], _, _ => []
  | _ :: _, [], _ => []
  | _ :: _, _ :: _, [] => []

/-- **SHAP**: the marginal contribution of feature `i` to *any* coalition `S` is the
linear attribution `wᵢ (xᵢ − bᵢ)`. Since the Shapley value is a weighted average of
marginal contributions with weights summing to one, it equals this attribution. -/
theorem shap_marginal_constant (w : List Int) (S : List Bool) (x b : List Int) (i : Nat)
    (hi : i < S.length) (hx : S.length = x.length) (hb : x.length = b.length) :
    dot w (mask (S.set i true) x b) - dot w (mask (S.set i false) x b) =
      w.getD i 0 * (x.getD i 0 - b.getD i 0) := by
  induction i generalizing w S x b with
  | zero =>
    cases S with
    | nil => simp at hi
    | cons s ss =>
      cases x with
      | nil => simp at hx
      | cons x xs =>
        cases b with
        | nil => simp at hb
        | cons b bs =>
          cases w with
          | nil => simp [dot]
          | cons w ws =>
            simp only [List.set_cons_zero, mask, dot, List.getD_cons_zero, Bool.false_eq_true,
              ite_true, ite_false]
            rw [Int.mul_sub]
            omega
  | succ i ih =>
    cases S with
    | nil => simp at hi
    | cons s ss =>
      cases x with
      | nil => simp at hx
      | cons x xs =>
        cases b with
        | nil => simp at hb
        | cons b bs =>
          simp only [List.length_cons, Nat.add_lt_add_iff_right, Nat.add_right_cancel_iff] at hi hx hb
          cases w with
          | nil => simp [dot]
          | cons w ws =>
            simp only [List.set_cons_succ, mask, dot, List.getD_cons_succ]
            have := ih ws ss xs bs hi hx hb
            omega

/-! ## Model-agnostic ablation attribution -/

/-- Telescoping sum. -/
theorem telescope (g : Nat → Int) (n : Nat) :
    ((List.range n).map (fun k => g k - g (k + 1))).sum = g 0 - g n := by
  induction n with
  | zero => simp
  | succ n ih =>
    rw [List.range_succ, List.map_append, List.sum_append, ih]
    simp
    omega

/-- The point of the ablation path with the first `k` features set to the baseline. -/
def blend (x b : List Int) (k : Nat) : List Int := b.take k ++ x.drop k

/-- Sequential-ablation attribution of an arbitrary model `f`: feature `k` receives
the output change caused by ablating it after features `0..k-1`. -/
def ablation (f : List Int → Int) (x b : List Int) : List Int :=
  (List.range x.length).map (fun k => f (blend x b k) - f (blend x b (k + 1)))

/-- **Attribution completeness for any model**: the ablation attributions sum to
`f(x) − f(baseline)`. Tactic: telescoping. -/
theorem ablation_complete (f : List Int → Int) (x b : List Int) (h : x.length = b.length) :
    (ablation f x b).sum = f x - f b := by
  unfold ablation
  rw [telescope (fun k => f (blend x b k))]
  simp only [blend, List.take_zero, List.drop_zero, List.nil_append, List.drop_length,
    List.append_nil]
  rw [h, List.take_length]

/-! ## Importance bounds -/

/-- Importance is the absolute attribution. -/
def importance (a : List Int) : List Nat := a.map Int.natAbs

theorem mem_le_sum (l : List Nat) (a : Nat) (h : a ∈ l) : a ≤ l.sum := by
  induction l with
  | nil => simp at h
  | cons x xs ih =>
    rw [List.sum_cons]
    cases List.mem_cons.mp h with
    | inl e => omega
    | inr hm => have := ih hm; omega

theorem natAbs_sum_le (l : List Int) : l.sum.natAbs ≤ (l.map Int.natAbs).sum := by
  induction l with
  | nil => simp
  | cons a as ih =>
    rw [List.sum_cons, List.map_cons, List.sum_cons]
    exact Nat.le_trans (Int.natAbs_add_le a as.sum) (Nat.add_le_add_left ih _)

/-- **Feature importance is bounded**: every importance is at most the total
importance (the sketch's `0 ≤ f i ≤ 1` with the total in the role of `1`). -/
theorem importance_le_total (a : List Int) (k : Nat) (h : k ∈ importance a) :
    k ≤ (importance a).sum := mem_le_sum _ k h

/-- The total importance bounds the absolute output change. -/
theorem output_change_le_total_importance (f : List Int → Int) (x b : List Int)
    (h : x.length = b.length) :
    (f x - f b).natAbs ≤ (importance (ablation f x b)).sum := by
  rw [← ablation_complete f x b h]
  exact natAbs_sum_le _

/-! ## Influence functions -/

/-- Influence of training sample `j` on a kernel/sum predictor `Σ kⱼ yⱼ`. -/
def influence (m : Linear) (y : List Int) (j : Nat) : Int := m.weights.getD j 0 * y.getD j 0

/-- **Influence = leave-one-out**: removing sample `j` (setting its label to `0`)
changes the prediction by exactly its influence. -/
theorem influence_loo (m : Linear) (y : List Int) (j : Nat) (hj : j < y.length) :
    m.eval y - m.eval (y.set j 0) = influence m y j := by
  rw [eval_sub_set m y j 0 hj, Int.sub_zero]
  rfl

/-- **Influence stability**: the influence of sample `j` is unchanged by altering any
other sample `k ≠ j`. -/
theorem influence_stability (m : Linear) (y : List Int) (j k : Nat) (v : Int) (h : k ≠ j) :
    influence m (y.set k v) j = influence m y j := by
  unfold influence
  rw [getD_set_ne y k j v 0 h]

/-! ## Attention -/

/-- Attention weights over positions: naturals summing to a fixed total `T`
(the integer stand-in for "sums to one"). -/
structure Attention (total : Nat) where
  weights : List Nat
  sums : weights.sum = total

theorem sum_replicate_nat (n k : Nat) : (List.replicate n k).sum = n * k := by
  induction n with
  | zero => simp
  | succ n ih => rw [List.replicate_succ, List.sum_cons, ih, Nat.succ_mul]; omega

/-- **Uniform attention** over `len` positions, each weight `k`, total `len * k`. -/
def uniform (len k : Nat) : Attention (len * k) := ⟨List.replicate len k, sum_replicate_nat len k⟩

/-- **Attention is bounded**: every weight is at most the total. -/
theorem attention_weight_le_total {T : Nat} (A : Attention T) (w : Nat) (h : w ∈ A.weights) :
    w ≤ T := by
  have := mem_le_sum A.weights w h
  rw [A.sums] at this
  exact this

/-- **Heads concatenate**: two heads with totals `T₁`, `T₂` form one with `T₁ + T₂`. -/
def attention_concat {T₁ T₂ : Nat} (A : Attention T₁) (B : Attention T₂) : Attention (T₁ + T₂) :=
  ⟨A.weights ++ B.weights, by rw [List.sum_append, A.sums, B.sums]⟩

/-- Scale a row. -/
def smul (k : Nat) (r : List Nat) : List Nat := r.map (k * ·)

/-- Add two rows, padding the shorter with zeros. -/
def vadd : List Nat → List Nat → List Nat
  | [], v => v
  | u, [] => u
  | a :: u, b :: v => (a + b) :: vadd u v

theorem sum_smul (k : Nat) (r : List Nat) : (smul k r).sum = k * r.sum := by
  unfold smul
  induction r with
  | nil => simp
  | cons a as ih => rw [List.map_cons, List.sum_cons, List.sum_cons, ih, Nat.mul_add]

theorem sum_vadd (u v : List Nat) : (vadd u v).sum = u.sum + v.sum := by
  induction u generalizing v with
  | nil => simp [vadd]
  | cons a as ih =>
    cases v with
    | nil => simp [vadd]
    | cons b bs => simp only [vadd, List.sum_cons, ih]; omega

/-- Attention rollout of one row through the next layer: `Σₖ aₖ · Bₖ`
(also the class-activation map `Σₖ wₖ · featureMapₖ`). -/
def rollout : List Nat → List (List Nat) → List Nat
  | a :: as, r :: rs => vadd (smul a r) (rollout as rs)
  | [], _ => []
  | _ :: _, [] => []

/-- **Rollout preserves normalisation**: if every row of `B` sums to `T`, the rolled
row sums to `(Σ a) · T`. -/
theorem sum_rollout (a : List Nat) (B : List (List Nat)) (T : Nat)
    (hB : ∀ r ∈ B, r.sum = T) (hl : a.length ≤ B.length) :
    (rollout a B).sum = a.sum * T := by
  induction a generalizing B with
  | nil => simp [rollout]
  | cons a as ih =>
    cases B with
    | nil => simp at hl
    | cons r rs =>
      simp only [List.length_cons, Nat.add_le_add_iff_right] at hl
      rw [rollout, sum_vadd, sum_smul, hB r (List.mem_cons_self), List.sum_cons, Nat.add_mul]
      rw [ih rs (fun r' h' => hB r' (List.mem_cons_of_mem r h')) hl]

/-- **Attention rollout**: an attention row with total `T` rolled through attention
rows with total `T` is normalised at scale `T · T`. -/
theorem attention_rollout_normalised {T : Nat} (A : Attention T) (B : List (Attention T))
    (hl : A.weights.length ≤ B.length) :
    (rollout A.weights (B.map Attention.weights)).sum = T * T := by
  rw [sum_rollout A.weights _ T (fun r hr => by
        obtain ⟨b, _, rfl⟩ := List.mem_map.mp hr
        exact b.sums)
      (by rw [List.length_map]; exact hl), A.sums]

/-- **CAM heatmap total**: class weights `w` over feature maps that each sum to `T`
give a map with total `(Σ w) · T`. -/
theorem cam_total (w : List Nat) (maps : List (List Nat)) (T : Nat)
    (h : ∀ f ∈ maps, f.sum = T) (hl : w.length ≤ maps.length) :
    (rollout w maps).sum = w.sum * T := sum_rollout w maps T h hl

/-! ## Layer-wise relevance propagation -/

/-- Propagate one layer: each split (one per upper neuron) lists the relevance sent
to each lower neuron; the lower relevance is the column sum. -/
def propagate (splits : List (List Nat)) : List Nat := splits.foldl vadd []

theorem sum_foldl_vadd (L : List (List Nat)) (acc : List Nat) :
    (L.foldl vadd acc).sum = acc.sum + (L.map List.sum).sum := by
  induction L generalizing acc with
  | nil => simp
  | cons s ss ih => rw [List.foldl_cons, ih, sum_vadd, List.map_cons, List.sum_cons]; omega

/-- **Conservation through one layer**: the lower relevance total equals the sum of
the split totals. -/
theorem propagate_sum (splits : List (List Nat)) :
    (propagate splits).sum = (splits.map List.sum).sum := by
  unfold propagate
  rw [sum_foldl_vadd]
  simp

/-- A chain of layers is conserving when each split sums to its upper neuron's relevance. -/
def Chain : List Nat → List (List (List Nat)) → Prop
  | _, [] => True
  | R, S :: Ss => S.map List.sum = R ∧ Chain (propagate S) Ss

/-- Propagate through all layers. -/
def propagateAll : List Nat → List (List (List Nat)) → List Nat
  | R, [] => R
  | _, S :: Ss => propagateAll (propagate S) Ss

/-- **LRP conservation** across a whole network: the final relevance total equals the
output relevance total exactly (the sketch's `≤ 1` becomes `=`). -/
theorem lrp_conservation (R : List Nat) (Ss : List (List (List Nat))) (h : Chain R Ss) :
    (propagateAll R Ss).sum = R.sum := by
  induction Ss generalizing R with
  | nil => rfl
  | cons S Ss ih =>
    obtain ⟨hS, hc⟩ := h
    rw [propagateAll, ih (propagate S) hc, propagate_sum, hS]

/-! ## Counterfactuals -/

/-- Hamming distance between two inputs. -/
def hamming : List Int → List Int → Nat
  | x :: xs, y :: ys => (if x = y then 0 else 1) + hamming xs ys
  | [], _ => 0
  | _ :: _, [] => 0

theorem hamming_self (x : List Int) : hamming x x = 0 := by
  induction x with
  | nil => rfl
  | cons a as ih => simp [hamming, ih]

theorem hamming_le_length (x y : List Int) : hamming x y ≤ x.length := by
  induction x generalizing y with
  | nil => simp [hamming]
  | cons a as ih =>
    cases y with
    | nil => simp [hamming]
    | cons b bs =>
      simp only [hamming, List.length_cons]
      have := ih bs
      split <;> omega

theorem hamming_set_le_one (x : List Int) (i : Nat) (v : Int) : hamming x (x.set i v) ≤ 1 := by
  induction i generalizing x with
  | zero =>
    cases x with
    | nil => simp [hamming]
    | cons a as => simp only [List.set_cons_zero, hamming, hamming_self]; split <;> omega
  | succ i ih =>
    cases x with
    | nil => simp [hamming]
    | cons a as => simp only [List.set_cons_succ, hamming, ite_true]; have := ih as; omega

/-- **Counterfactual explanation**: any feature with nonzero weight yields an input at
Hamming distance at most one whose prediction differs. -/
theorem counterfactual_exists (m : Linear) (x : List Int) (i : Nat) (hi : i < x.length)
    (hw : m.weights.getD i 0 ≠ 0) :
    ∃ y : List Int, hamming x y ≤ 1 ∧ m.eval y ≠ m.eval x := by
  refine ⟨x.set i (x.getD i 0 + 1), hamming_set_le_one x i _, ?_⟩
  have h := sensitivity_eq_weight m x i 1 hi
  rw [Int.mul_one] at h
  omega

/-! ## Monotonicity -/

/-- Pointwise order on inputs of equal length. -/
def Le : List Int → List Int → Prop
  | x :: xs, y :: ys => x ≤ y ∧ Le xs ys
  | [], [] => True
  | [], _ :: _ => False
  | _ :: _, [] => False

theorem dot_mono (w x y : List Int) (hw : ∀ a ∈ w, 0 ≤ a) (hxy : Le x y) :
    dot w x ≤ dot w y := by
  induction w generalizing x y with
  | nil => simp [dot]
  | cons a as ih =>
    cases x with
    | nil => cases y with
      | nil => simp [dot]
      | cons _ _ => exact (hxy).elim
    | cons x xs => cases y with
      | nil => exact (hxy).elim
      | cons y ys =>
        obtain ⟨h1, h2⟩ := hxy
        simp only [dot]
        have ha : 0 ≤ a := hw a List.mem_cons_self
        have hrest := ih xs ys (fun b hb => hw b (List.mem_cons_of_mem a hb)) h2
        exact Int.add_le_add (Int.mul_le_mul_of_nonneg_left h1 ha) hrest

/-- **Monotonicity**: a linear model with nonnegative weights is monotone (the
sketch's "monotone ⇒ ∃ grad ≥ 0" reversed into the usable direction). -/
theorem eval_mono (m : Linear) (x y : List Int) (hw : ∀ a ∈ m.weights, 0 ≤ a) (hxy : Le x y) :
    m.eval x ≤ m.eval y := by
  unfold Linear.eval
  exact Int.add_le_add_left (dot_mono m.weights x y hw hxy) m.bias

/-! ## Surrogates and explanation quality -/

/-- Fidelity of a surrogate `g` to `f`: the number of data points on which they agree. -/
def fidelity (f g : List Int → Int) (data : List (List Int)) : Nat :=
  (data.filter (fun x => decide (f x = g x))).length

/-- **Fidelity is bounded** by the data size (the sketch's `fidelity ≤ 1`). -/
theorem fidelity_le (f g : List Int → Int) (data : List (List Int)) :
    fidelity f g data ≤ data.length := List.length_filter_le _ _

/-- A perfect surrogate has full fidelity. -/
theorem fidelity_self (f : List Int → Int) (data : List (List Int)) :
    fidelity f f data = data.length := by
  simp [fidelity]

/-- Keep the features in the support of the weights, baseline the rest. -/
def maskSupport : List Int → List Int → List Int → List Int
  | w :: ws, x :: xs, b :: bs => (if w = 0 then b else x) :: maskSupport ws xs bs
  | [], _, _ => []
  | _ :: _, [], _ => []
  | _ :: _, _ :: _, [] => []

/-- **Explanation sufficiency**: the support of the weights is a sufficient explanation,
since baselining every zero-weight feature leaves the inner product unchanged. -/
theorem support_sufficient (w x b : List Int) (h : x.length = b.length) :
    dot w (maskSupport w x b) = dot w x := by
  induction w generalizing x b with
  | nil => simp [dot]
  | cons a as ih =>
    cases x with
    | nil => cases b with
      | nil => simp [maskSupport, dot]
      | cons _ _ => simp at h
    | cons x xs => cases b with
      | nil => simp at h
      | cons b bs =>
        simp only [List.length_cons, Nat.add_right_cancel_iff] at h
        simp only [maskSupport, dot, ih xs bs h]
        split
        · rename_i ha; rw [ha]; simp
        · rfl

/-! ## A concrete instance on the lattice constants (labelled) -/

/-- Concrete instance: uniform attention over the `n = 3` lattice words with weight
`hexbit = 4` has total `n * hexbit`, and every weight is bounded by it. -/
theorem lattice_attention_bounded (w : Nat) (h : w ∈ (uniform n hexbit).weights) :
    w ≤ n * hexbit := attention_weight_le_total (uniform n hexbit) w h

end Qpu.Xai
