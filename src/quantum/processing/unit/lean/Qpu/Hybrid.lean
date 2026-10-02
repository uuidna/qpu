import Qpu.Lattice

/-! # Qpu.Hybrid
Hybrid storage: KV and R2 cost and speed, and their sums. -/

def kvCost : Nat := coins
def r2Cost : Nat := seed
def hybridCost : Nat := kvCost + r2Cost
def kvSpeed : Nat := rays
def r2Speed : Nat := seed
def hybridSpeed : Nat := kvSpeed + r2Speed
theorem hybrid_cost : coins + seed = n := by rw [coins_two, seed_eq, n_eq]
theorem hybrid_speed : rays + seed = mintOf n := by rw [rays, n_eq, coins_two, seed_eq]; rw [show mintOf 3 = 8 from rfl]
theorem hybrid : coins + seed = n ∧ rays + seed = mintOf n ∧ coins = seed + seed := ⟨hybrid_cost, hybrid_speed, coins_two⟩
