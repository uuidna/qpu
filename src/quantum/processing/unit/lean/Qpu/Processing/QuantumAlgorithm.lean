import Qpu.Processing.QuantumGate
import Qpu.Textbook

/-! # Qpu.Processing.QuantumAlgorithm
---
component: quantum algorithm (ISO/IEC 4879:2024 3.4.9)
---
The processor's algorithms on exact amplitudes: a circuit applies the gates of `Qpu.Processing.QuantumGate` and a measurement
weight is the squared modulus. Deutsch–Jozsa decides every two-bit function in one oracle query, Grover finds the marked item of
four in one iteration (a search algorithm, 3.5.6), and Shor's reduction is `textbook_shor_sigma_root`. -/

namespace QuantumAlgorithm
open HilbertSpace Operator QuantumGate

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
theorem deutsch_jozsa : ∀ f, f < 16 →
    (constant f = true → (dj f 0).normSq = 16) ∧ (balanced f = true → dj f 0 = 0) := by decide +kernel

/-- the oracle marking item `m` -/
def mark (m : Nat) : Mat := fun r c => if r = c then (if r = m then -1 else 1) else 0
/-- the diffusion over four items, scaled by two: 2·(2|s⟩⟨s| − I) = J − 2·I -/
def diffusion : Mat := fun r c => if r = c then -1 else 1
/-- Grover over four items: the uniform state, one oracle query, one diffusion -/
def grover (m : Nat) : Vec := ap 4 diffusion (ap 4 (mark m) (ap 4 (kron 2 H H) (basis 0)))

/-- one Grover iteration over four items leaves all weight on the marked item -/
theorem grover_search : ∀ m, m < 4 → ∀ r, r < 4 → (grover m r ≠ 0 ↔ r = m) := by decide +kernel

end QuantumAlgorithm
