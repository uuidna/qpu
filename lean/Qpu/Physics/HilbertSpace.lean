/-! # Qpu.Physics.HilbertSpace
---
component: Hilbert space (ISO/IEC 4879:2024 3.2.1)
---
The state space of the processor in exact arithmetic: amplitudes are Gaussian integers `re + im·i`, never floats, a state is a
vector of them indexed by basis states, and a measurement weight is the squared modulus. Hadamard is kept unscaled elsewhere, so
states carry its factor and weights are compared, never normalised. -/

namespace HilbertSpace

/-- a Gaussian integer `re + im·i` -/
structure GI where
  re : Int
  im : Int
deriving DecidableEq, Repr

namespace GI
instance (n : Nat) : OfNat GI n := ⟨⟨n, 0⟩⟩
instance : Add GI := ⟨fun a b => ⟨a.re + b.re, a.im + b.im⟩⟩
instance : Neg GI := ⟨fun a => ⟨-a.re, -a.im⟩⟩
instance : Mul GI := ⟨fun a b => ⟨a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re⟩⟩
/-- the imaginary unit -/
def i : GI := ⟨0, 1⟩
/-- the complex conjugate -/
def conj (a : GI) : GI := ⟨a.re, -a.im⟩
/-- the squared modulus: a measurement weight -/
def normSq (a : GI) : Int := a.re * a.re + a.im * a.im

/-- the real and imaginary parts of a sum, a product and the literals 0 and 1 -/
theorem add_re (x y : GI) : (x + y).re = x.re + y.re := rfl
theorem add_im (x y : GI) : (x + y).im = x.im + y.im := rfl
theorem mul_re (x y : GI) : (x * y).re = x.re * y.re - x.im * y.im := rfl
theorem zero_re : (0 : GI).re = 0 := rfl
theorem one_re : (1 : GI).re = 1 := rfl
theorem zero_im : (0 : GI).im = 0 := rfl
theorem one_im : (1 : GI).im = 0 := rfl
end GI

/-- the sum of `f k` for `k < n` -/
def sumTo (n : Nat) (f : Nat → GI) : GI := (List.range n).foldl (fun acc k => acc + f k) 0

/-- a state: its amplitude on each basis index -/
abbrev Vec := Nat → GI
/-- the basis state `b` -/
def basis (b : Nat) : Vec := fun r => if r = b then 1 else 0

end HilbertSpace
