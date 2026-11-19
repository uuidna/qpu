import Qpu.Combinatorics
/-! # Qpu.Mint
Doubling: mint k = 2^k, binomials, and the laws that make a sum inside the doubling a product outside it. -/

def mint : Nat → Nat | 0 => 1 | k + 1 => mint k + mint k
theorem mintOf_zero : mint 0 = 1 := rfl
theorem mintOf_succ (k : Nat) : mint (k + 1) = mint k + mint k := rfl
theorem mintOf_add (a b : Nat) : mint (a + b) = mint a * mint b := by induction b with | zero => rw [Nat.add_zero, mintOf_zero, Nat.mul_one] | succ b ih => rw [Nat.add_succ, mintOf_succ, ih, mintOf_succ, Nat.mul_add]
theorem multiply (a b : Nat) : mint (a + b) = mint a * mint b := mintOf_add a b
