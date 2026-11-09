import Qpu.Blueprint.Gates
import Qpu.Textbook

/-! # Qpu.Blueprint.Algorithms
---
component: algorithms
---
The processor's algorithms run on exact amplitudes over the Gaussian integers: a state is a vector, a circuit applies the gates of
`Qpu.Blueprint.Gates`, and a measurement weight is the squared modulus. Hadamard stays unscaled, so amplitudes carry its factor and
weights are compared, never normalised. Shor's reduction is `textbook_shor_sigma_root`. -/

namespace Blueprint

/-- a state: its amplitude on each basis index -/
abbrev Vec := Nat → GI

/-- the matrix `u` applied to the `n`-dimensional state `v` -/
def ap (n : Nat) (u : Mat) (v : Vec) : Vec := fun r => sumTo n fun k => u r k * v k
/-- the basis state `b` -/
def basis (b : Nat) : Vec := fun r => if r = b then 1 else 0

/-- Bell: Hadamard on the high qubit of |00⟩, then CNOT -/
def bell : Vec := ap 4 CNOT (ap 4 (kron 2 H idm) (basis 0))

/-- the Bell state is supported on exactly 00 and 11, with equal weight -/
theorem algorithm_bell : (∀ r, r < 4 → (bell r ≠ 0 ↔ r = 0 ∨ r = 3)) ∧ (bell 0).normSq = (bell 3).normSq := by decide

/-- GHZ on three qubits: Hadamard on the top qubit, then CNOT down the line -/
def ghz : Vec := ap 8 (kron 4 idm CNOT) (ap 8 (kron 2 CNOT idm) (ap 8 (kron 4 H idm) (basis 0)))

/-- the GHZ state is supported on exactly 000 and 111, with equal weight -/
theorem algorithm_ghz : (∀ r, r < 8 → (ghz r ≠ 0 ↔ r = 0 ∨ r = 7)) ∧ (ghz 0).normSq = (ghz 7).normSq := by decide +kernel

/-- the value of the two-bit function with truth table `f` (bit `x` of `f`) -/
def fval (f x : Nat) : Bool := (f / 2 ^ x) % 2 == 1
/-- the phase oracle of `f`: the sign (−1)^f(x) on basis state `x` -/
def oracle (f : Nat) : Mat := fun r c => if r = c then (if fval f r then -1 else 1) else 0
/-- Deutsch–Jozsa on two qubits: Hadamards, one oracle query, Hadamards -/
def dj (f : Nat) : Vec := ap 4 (kron 2 H H) (ap 4 (oracle f) (ap 4 (kron 2 H H) (basis 0)))
/-- a constant function: all zeros or all ones -/
def constant (f : Nat) : Bool := f == 0 || f == 15
/-- a balanced function: exactly two of its four values are one -/
def balanced (f : Nat) : Bool := ((List.range 4).filter (fval f)).length == 2

/-- one query decides: a constant function leaves all weight on 00, a balanced one leaves none -/
theorem algorithm_deutsch_jozsa : ∀ f, f < 16 →
    (constant f = true → (dj f 0).normSq = 16) ∧ (balanced f = true → dj f 0 = 0) := by decide +kernel

/-- the oracle marking item `m` -/
def mark (m : Nat) : Mat := fun r c => if r = c then (if r = m then -1 else 1) else 0
/-- the diffusion over four items, scaled by two: 2·(2|s⟩⟨s| − I) = J − 2·I -/
def diffusion : Mat := fun r c => if r = c then -1 else 1
/-- Grover over four items: the uniform state, one oracle query, one diffusion -/
def grover (m : Nat) : Vec := ap 4 diffusion (ap 4 (mark m) (ap 4 (kron 2 H H) (basis 0)))

/-- one Grover iteration over four items leaves all weight on the marked item -/
theorem algorithm_grover : ∀ m, m < 4 → ∀ r, r < 4 → (grover m r ≠ 0 ↔ r = m) := by decide +kernel

/-- the three-bit repetition code word of `b` -/
def encode (b : Bool) : Nat := if b then 7 else 0
/-- flip bit `e` of the word (no flip when `e = 3`) -/
def flip (e w : Nat) : Nat := if e < 3 then w ^^^ 2 ^ e else w
/-- majority decoding -/
def decode (w : Nat) : Bool := ((List.range 3).filter fun k => (w / 2 ^ k) % 2 == 1).length ≥ 2

/-- the repetition code corrects every single bit flip, and no flip at all -/
theorem algorithm_repetition : ∀ b : Bool, ∀ e, e < 4 → decode (flip e (encode b)) = b := by decide

end Blueprint
