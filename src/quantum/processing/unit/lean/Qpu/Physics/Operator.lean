import Qpu.Physics.HilbertSpace

/-! # Qpu.Physics.Operator
---
component: operator (ISO/IEC 4879:2024 3.2.2)
---
Linear operators on the Hilbert space as exact matrices over the Gaussian integers, read on the indices below their dimension:
products, the conjugate transpose, the identity, scalar multiples, Kronecker products, permutations, and an operator applied to a
state. Two operators are the same when every entry below the dimension agrees. -/

namespace Operator
open HilbertSpace

/-- a matrix, read on the indices below its dimension -/
abbrev Mat := Nat → Nat → GI

/-- the product of two `n × n` matrices -/
def mm (n : Nat) (a b : Mat) : Mat := fun r c => sumTo n fun k => a r k * b k c
/-- the conjugate transpose -/
def dag (a : Mat) : Mat := fun r c => GI.conj (a c r)
/-- the identity -/
def idm : Mat := fun r c => if r = c then 1 else 0
/-- a scalar times a matrix -/
def smul (k : GI) (a : Mat) : Mat := fun r c => k * a r c
/-- the Kronecker product of `a` with an `m × m` matrix `b` -/
def kron (m : Nat) (a b : Mat) : Mat := fun r c => a (r / m) (c / m) * b (r % m) (c % m)
/-- the permutation matrix sending basis state `c` to `p c` -/
def perm (p : Nat → Nat) : Mat := fun r c => if r = p c then 1 else 0
/-- the matrix `u` applied to the `n`-dimensional state `v` -/
def ap (n : Nat) (u : Mat) (v : Vec) : Vec := fun r => sumTo n fun k => u r k * v k

/-- two matrices agree on every entry below `n` -/
def Same (n : Nat) (a b : Mat) : Prop := ∀ r, r < n → ∀ c, c < n → a r c = b r c
instance (n : Nat) (a b : Mat) : Decidable (Same n a b) := by unfold Same; infer_instance

end Operator
