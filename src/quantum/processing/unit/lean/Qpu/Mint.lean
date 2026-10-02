/-! # Qpu.Mint
Doubling: mintOf k = 2^k, binomials, and the laws that make a sum inside the doubling a product outside it. -/

def mintOf : Nat → Nat | 0 => 1 | k + 1 => mintOf k + mintOf k
def chooseOf : Nat → Nat → Nat | _, 0 => 1 | 0, _ + 1 => 0 | n + 1, k + 1 => chooseOf n (k + 1) + chooseOf n k
theorem mintOf_zero : mintOf 0 = 1 := rfl
theorem mintOf_succ (k : Nat) : mintOf (k + 1) = mintOf k + mintOf k := rfl
theorem mintOf_add (a b : Nat) : mintOf (a + b) = mintOf a * mintOf b := by induction b with | zero => rw [Nat.add_zero, mintOf_zero, Nat.mul_one] | succ b ih => rw [Nat.add_succ, mintOf_succ, ih, mintOf_succ, Nat.mul_add]
theorem multiply (a b : Nat) : mintOf (a + b) = mintOf a * mintOf b := mintOf_add a b
