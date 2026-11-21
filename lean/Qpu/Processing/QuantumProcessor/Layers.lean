import Qpu.Processing.QuantumProcessor

/-! # Qpu.Processing.QuantumProcessor.Layers
---
component: quantum processor, parallel layers (ISO/IEC 4879:2024 3.4.8)
---
The coupling graph drives its couplers in parallel. Coloured by the parity of row plus bit, every coupler joins the two colours:
the graph is bipartite. Each coupler belongs to one of four layers (along a row from an even or an odd bit, between rows from an
even or an odd row), and within a layer no two couplers share a qubit, so every coupler of the register runs in four rounds. The
couplers so counted are `Qubit.couplers_formula` at hexbit width. -/

namespace QuantumProcessor.Layers
open Qubit QuantumProcessor

/-- the colour of a site: the parity of its row plus its bit -/
def colour (x : Nat × Nat) : Nat := (x.1 + x.2) % 2

/-- a site's key, ordering the sites so each coupler is counted once -/
def key (x : Nat × Nat) : Nat := x.1 * 64 + x.2

/-- the couplers at width `w`, each unordered pair once -/
def edges (w : Nat) : List ((Nat × Nat) × (Nat × Nat)) :=
  (sites w).flatMap fun a => ((sites w).filter fun b => coupled a b && decide (key a < key b)).map fun b => (a, b)

/-- the layer of a coupler: 0 or 1 along a row by the lower bit's parity, 2 or 3 between rows by the lower row's parity -/
def layer (e : (Nat × Nat) × (Nat × Nat)) : Nat :=
  if e.1.1 == e.2.1 then (min e.1.2 e.2.2) % 2 else 2 + (min e.1.1 e.2.1) % 2

/-- the couplers of layer `l` that touch site `x` -/
def touching (w l : Nat) (x : Nat × Nat) : Nat :=
  ((edges w).filter fun e => layer e == l && (e.1 == x || e.2 == x)).length

/-- every coupler joins the two colours: the coupling graph is bipartite -/
theorem layers_bipartite : ∀ e ∈ edges hexbit, colour e.1 ≠ colour e.2 := by
  have h : (edges hexbit).all (fun e => decide (colour e.1 ≠ colour e.2)) = true := by decide +kernel
  simpa [List.all_eq_true] using h

/-- every coupler sits in one of four layers, and within a layer no qubit is touched twice: four rounds drive every coupler -/
theorem layers_four : (∀ e ∈ edges hexbit, layer e < 4) ∧ ∀ x ∈ sites hexbit, ∀ l, l < 4 → touching hexbit l x ≤ 1 := by
  have h1 : (edges hexbit).all (fun e => decide (layer e < 4)) = true := by decide +kernel
  have h2 : (sites hexbit).all (fun x => (List.range 4).all fun l => decide (touching hexbit l x ≤ 1)) = true := by decide +kernel
  refine ⟨by simpa [List.all_eq_true] using h1, fun x hx l hl => ?_⟩
  have := (List.all_eq_true.mp h2) x hx
  simpa [List.all_eq_true, List.mem_range, hl] using (List.all_eq_true.mp this) l (List.mem_range.mpr hl)

/-- the couplers so counted are the register's couplers at hexbit width -/
theorem layers_count : (edges hexbit).length = couplers hexbit := by decide +kernel

end QuantumProcessor.Layers
