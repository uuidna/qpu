import Qpu.General.Mint
import Qpu.General.Lattice

/-! # Qpu.Application.Qaoa
QAOA circuit resource counts over p layers, exact Nat grounded in the lattice constants: the variational parameter
count (two per layer, from coins), the cost-layer ZZ gates over e edges, and the mixer X gates over q qubits. Every law
is quantified over all layers, edges and qubits — unlimited parameters — with the textbook values kept as
kernel-decided controls. -/

def qaoaParams (p : Nat) : Nat := coins * p
def qaoaZz (p e : Nat) : Nat := p * e
def qaoaX (p q : Nat) : Nat := p * q

/-- Every layer adds exactly coins = 2 parameters, for every p. -/
theorem qaoaParams_succ (p : Nat) : qaoaParams (p + 1) = qaoaParams p + coins := by
  rw [qaoaParams, qaoaParams, Nat.mul_succ]

/-- The parameter count is always even: two angles per layer, for every p. -/
theorem qaoaParams_twice (p : Nat) : qaoaParams p = 2 * p := by
  rw [qaoaParams, coins_two]

/-- One more layer costs e more ZZ gates, for every layer count and edge set. -/
theorem qaoaZz_succ_layer (p e : Nat) : qaoaZz (p + 1) e = qaoaZz p e + e := by
  rw [qaoaZz, qaoaZz, Nat.add_mul, Nat.one_mul]

/-- One more edge costs p more ZZ gates, for every edge count and layer depth. -/
theorem qaoaZz_succ_edge (p e : Nat) : qaoaZz p (e + 1) = qaoaZz p e + p := by
  rw [qaoaZz, qaoaZz, Nat.mul_succ]

/-- One more layer costs q more mixer gates, for every qubit count. -/
theorem qaoaX_succ_layer (p q : Nat) : qaoaX (p + 1) q = qaoaX p q + q := by
  rw [qaoaX, qaoaX, Nat.add_mul, Nat.one_mul]

/-- Deeper circuits never cost fewer ZZ gates, for all layer pairs and edge sets. -/
theorem qaoaZz_le_layers {p p' : Nat} (h : p ≤ p') (e : Nat) : qaoaZz p e ≤ qaoaZz p' e := by
  rw [qaoaZz, qaoaZz]
  exact Nat.mul_le_mul h (Nat.le_refl e)

/-- Denser graphs never cost fewer ZZ gates, for all edge pairs at any depth. -/
theorem qaoaZz_le_edges (p : Nat) {e e' : Nat} (h : e ≤ e') : qaoaZz p e ≤ qaoaZz p e' := by
  rw [qaoaZz, qaoaZz]
  exact Nat.mul_le_mul (Nat.le_refl p) h

/-- The budget splits per layer: ZZ cost plus X mixers over p layers is p copies
    of the single-layer count, for every p, e and q. -/
theorem qaoa_budget_per_layer (p e q : Nat) : qaoaZz p e + qaoaX p q = p * (e + q) := by
  rw [qaoaZz, qaoaX, ← Nat.left_distrib]

/-- The textbook spot values, decided by the kernel as controls on the general laws. -/
theorem qaoa_all : qaoaParams 3 = 6 ∧ qaoaZz 2 5 = 10 ∧ qaoaX 3 4 = 12 := ⟨rfl, rfl, rfl⟩
