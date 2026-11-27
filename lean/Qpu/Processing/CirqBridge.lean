import Mathlib

/-!
# The Cirq bridge, proved

What the circuit door, the simulator and the README writer compute when they read a circuit as Cirq writes it, kernel-checked:

* an amplitude's index in Cirq's order, the first qubit the most significant bit, is the index in the simulator's order over the
  reversed qubits (reversing twice gives every qubit back: `Advantage.fold_unfold`), so the reorder loses and invents no amplitude;
* the global phases Cirq's shifts multiply the state by add: the product of `e^{iπ t s}` over the gates is `e^{iπ Σ t s}`, and a
  gate to the power `θ/π` with the shift `s` carries `e^{iθ s}`, so `Rx(θ)` carries `e^{-iθ/2}`;
* the verdict a machine run answers with, its lines filtered and deduplicated, holds each line once and only lines the record holds;
* a README writer that puts a currency row right after every coin row writes as many currency rows as coin rows.
-/

namespace CirqBridge

open Complex Finset

/-- An index in Cirq's order, the first qubit the most significant bit, equals the index in the simulator's order, the first qubit
the least significant, over the qubits read in reverse. From Mathlib's `Fintype.sum_equiv` and `Fin.revPerm_apply`. -/
theorem cirq_order_eq_reversed (n : ℕ) (b : Fin n → ℕ) :
    ∑ i : Fin n, b i * 2 ^ (n - 1 - (i : ℕ)) = ∑ i : Fin n, b (Fin.rev i) * 2 ^ (i : ℕ) := by
  rw [← Fintype.sum_equiv Fin.revPerm (fun i => b (Fin.rev i) * 2 ^ (i : ℕ)) (fun i => b i * 2 ^ (n - 1 - (i : ℕ)))]
  intro i
  simp only [Fin.revPerm_apply, Fin.val_rev]
  congr 2
  omega

/-- The global phases add: the product of `e^{iπ t s}` over the gates is `e^{iπ Σ t s}`, for any exponents and shifts, real ones
among them. From Mathlib's `Complex.exp_list_sum`, `List.map_map`, `List.sum_map_mul_right`, `List.sum_map_mul_left` and
`mul_assoc`. -/
theorem global_phases_add (l : List (ℂ × ℂ)) :
    (l.map fun p => exp (↑Real.pi * p.1 * p.2 * I)).prod = exp (↑Real.pi * (l.map fun p => p.1 * p.2).sum * I) := by
  rw [show (l.map fun p => exp (↑Real.pi * p.1 * p.2 * I)) = (l.map fun p => ↑Real.pi * p.1 * p.2 * I).map exp from by
      rw [List.map_map]; rfl, ← Complex.exp_list_sum, List.sum_map_mul_right, ← List.sum_map_mul_left]
  simp only [mul_assoc]

/-- A gate to the power `θ/π` with a global shift `s` carries the phase `e^{iπ (θ/π) s}`, which is `e^{iθ s}`: `Rx(θ)`, `X` to the
power `θ/π` with the shift `-1/2`, carries `e^{-iθ/2}`. From Mathlib's `mul_div_cancel₀` and `Real.pi_ne_zero`. -/
theorem shift_phase (θ s : ℝ) : exp (↑(Real.pi * (θ / Real.pi) * s) * I) = exp (↑(θ * s) * I) := by
  rw [mul_div_cancel₀ θ Real.pi_ne_zero]

/-- The verdict: the lines a run's record holds that pass the filter, deduplicated, are each held once, each held by the record,
and each one the filter keeps. From Mathlib's `List.nodup_dedup` and `List.mem_dedup`. -/
theorem brief_sound {α : Type*} [DecidableEq α] (record : List α) (p : α → Bool) :
    ((record.filter p).dedup).Nodup ∧ ∀ x ∈ (record.filter p).dedup, x ∈ record ∧ p x = true := by
  refine ⟨List.nodup_dedup _, fun x hx => ?_⟩
  rw [List.mem_dedup, List.mem_filter] at hx
  exact hx

/-- The README writer puts a currency row right after every coin row, in a table that held no currency row before: it writes as many
currency rows as coin rows, which is what the register's ISO 4217 row counts. From Mathlib's `List.count_eq_one_of_mem` and
`zero_add`. -/
theorem currency_beside_every_coin (rows : List String) (h : "currency" ∉ rows) :
    (rows.flatMap fun r => if r = "coin" then [r, "currency"] else [r]).count "currency" =
      (rows.flatMap fun r => if r = "coin" then [r, "currency"] else [r]).count "coin" := by
  induction rows with
  | nil => simp
  | cons r rows ih =>
    have hr : r ≠ "currency" := fun e => h (e ▸ List.mem_cons_self ..)
    have hrows : "currency" ∉ rows := fun m => h (List.mem_cons_of_mem _ m)
    simp only [List.flatMap_cons, List.count_append]
    rw [ih hrows]
    split_ifs with hc
    · subst hc; simp
    · simp [hr, hc]

section Gates

variable {A : Type*} [Ring A] [Algebra ℂ A]

/-- Cirq's eigen gate with eigenvalue exponents `0` on the projector `P₊ = (1 + G)/2` and `1` on `P₋ = (1 - G)/2` and global shift
`s`, which is how Cirq defines `XPowGate`, `YPowGate`, `ZPowGate`, `HPowGate`, `CZPowGate`, `CXPowGate`, `SwapPowGate` and
`CCXPowGate`, is the simulator's power of a gate that squares to the identity, `P₊ + e^{iπt} P₋`, times the global phase
`e^{iπts}` the circuit door carries. From Mathlib's `smul_add`, `smul_smul`, `zero_add`, `mul_add`, `mul_one`,
`Complex.ofReal_add`, `add_mul`, `Complex.exp_add` and `mul_comm`, with the instances `Nat.instAtLeastTwoHAddOfNat`,
`Distrib.leftDistribClass` and `Distrib.rightDistribClass`. -/
theorem cirq_eigen_gate (G : A) (t s : ℝ) :
    exp (↑(Real.pi * t * (0 + s)) * I) • ((1 / 2 : ℂ) • (1 + G)) + exp (↑(Real.pi * t * (1 + s)) * I) • ((1 / 2 : ℂ) • (1 - G)) =
      exp (↑(Real.pi * t * s) * I) • ((1 / 2 : ℂ) • (1 + G) + exp (↑(Real.pi * t) * I) • ((1 / 2 : ℂ) • (1 - G))) := by
  rw [smul_add (exp (↑(Real.pi * t * s) * I)), smul_smul (exp (↑(Real.pi * t * s) * I)) (exp (↑(Real.pi * t) * I)), zero_add,
    mul_add, mul_one, Complex.ofReal_add, add_mul, Complex.exp_add, mul_comm (exp (↑(Real.pi * t) * I))]

/-- At `t = 1` the simulator's power of a gate is the gate itself: `P₊ - P₋ = G`, since `e^{iπ} = -1`. From Mathlib's `mul_one`,
`Complex.exp_pi_mul_I`, `neg_one_smul`, `sub_eq_add_neg`, `smul_sub`, `add_sub_sub_cancel`, `two_smul`, `smul_smul`, `one_div`,
`inv_mul_cancel₀`, `two_ne_zero` and `one_smul`, with the instances `Nat.instAtLeastTwoHAddOfNat`, `CharZero.NeZero.two` and
`Complex.instCharZero`. -/
theorem involution_pow_one (G : A) : (1 / 2 : ℂ) • (1 + G) + exp (↑(Real.pi * 1) * I) • ((1 / 2 : ℂ) • (1 - G)) = G := by
  rw [mul_one, Complex.exp_pi_mul_I, neg_one_smul, ← sub_eq_add_neg, ← smul_sub, add_sub_sub_cancel, ← two_smul ℂ G, smul_smul,
    one_div, inv_mul_cancel₀ two_ne_zero, one_smul]

/-- At `t = 0` the simulator's power of a gate is the identity: `P₊ + P₋ = 1`, since `e^0 = 1`. From Mathlib's
`MulZeroClass.mul_zero`, `Complex.ofReal_zero`, `MulZeroClass.zero_mul`, `Complex.exp_zero`, `one_smul`, `smul_add`,
`add_add_sub_cancel`, `two_smul`, `smul_smul`, `one_div`, `inv_mul_cancel₀` and `two_ne_zero`, with the instances
`Nat.instAtLeastTwoHAddOfNat`, `CharZero.NeZero.two` and `Complex.instCharZero`. -/
theorem involution_pow_zero (G : A) : (1 / 2 : ℂ) • (1 + G) + exp (↑(Real.pi * 0) * I) • ((1 / 2 : ℂ) • (1 - G)) = 1 := by
  rw [mul_zero, Complex.ofReal_zero, zero_mul, Complex.exp_zero, one_smul, ← smul_add, add_add_sub_cancel, ← two_smul ℂ (1 : A),
    smul_smul, one_div, inv_mul_cancel₀ two_ne_zero, one_smul]

end Gates

/-- The simulator raises `S = diag(1, i)` entry by entry through the principal logarithm, `i^t = e^{t log i}`, and Cirq writes
`S**t` as `ZPowGate(t/2)`, `diag(1, e^{iπt/2})`: the two agree, since `log i = iπ/2`. From Mathlib's `Complex.cpow_def_of_ne_zero`,
`Complex.I_ne_zero`, `Complex.log_I`, `Complex.ofReal_div`, `Complex.ofReal_mul`, `Complex.ofReal_ofNat`, `mul_right_comm` and
`div_mul_eq_mul_div`, with the instance `Nat.instAtLeastTwoHAddOfNat`. -/
theorem s_power (t : ℝ) : I ^ (t : ℂ) = exp (↑(Real.pi * t / 2) * I) := by
  rw [Complex.cpow_def_of_ne_zero Complex.I_ne_zero, Complex.log_I, Complex.ofReal_div, Complex.ofReal_mul, Complex.ofReal_ofNat,
    mul_right_comm, div_mul_eq_mul_div]

/-- A global phase changes no probability: `‖e^{iθ} a‖ = ‖a‖`, so two states that agree up to a global phase give every outcome the
same probability `‖a‖²`, which is why a state Stim's tableau fixes up to its phase is compared up to that phase. From Mathlib's
`norm_mul`, `Complex.norm_exp_ofReal_mul_I` and `one_mul`, with the instance `NormedDivisionRing.toNormMulClass`. -/
theorem global_phase_invisible (θ : ℝ) (a : ℂ) : ‖exp (↑θ * I) * a‖ = ‖a‖ := by
  rw [norm_mul, Complex.norm_exp_ofReal_mul_I, one_mul]

end CirqBridge
