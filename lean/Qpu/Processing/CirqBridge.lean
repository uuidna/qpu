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

end CirqBridge
