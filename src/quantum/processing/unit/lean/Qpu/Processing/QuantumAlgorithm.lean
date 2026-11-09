import Qpu.Processing.QuantumGate

/-! # Qpu.Processing.QuantumAlgorithm
---
component: quantum algorithm (ISO/IEC 4879:2024 3.4.9)
---
The processor's algorithms on exact amplitudes: a circuit applies the gates of `Qpu.Processing.QuantumGate` and a measurement
weight is the squared modulus. Deutsch–Jozsa decides every two-bit function in one oracle query, Grover finds the marked item of
four in one iteration (a search algorithm, 3.5.6), and Shor's reduction is `textbook_shor_sigma_root`. The quantum Fourier
transform on three qubits, over ℤ[ω] with ω the eighth root of unity, is unitary, and phase estimation on an eigenphase k/8 returns
exactly |k⟩ once the inverse transform is applied. -/

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

/-- ω to the power `k`, ω⁸ = 1 -/
def wPow (k : Nat) : ZW := (List.range (k % 8)).foldl (fun x _ => x * ZW.ω) 1
/-- the sum of eight terms -/
def sum8 (f : Nat → ZW) : ZW := (List.range 8).foldl (fun s i => s + f i) 0
/-- the quantum Fourier transform on three qubits, unscaled: entry (j, k) is ω^(jk) -/
def qft (j k : Nat) : ZW := wPow (j * k)
/-- its inverse, unscaled: ω^(−jk) -/
def iqft (j k : Nat) : ZW := wPow (8 - j * k % 8)

/-- the QFT on three qubits is unitary: QFT · QFT† = 8 · I -/
theorem qft_unitary : ∀ j, j < 8 → ∀ k, k < 8 → sum8 (fun i => qft j i * iqft i k) = if j = k then 8 else 0 := by decide +kernel
/-- phase estimation: the register holding ω^(jk) on |j⟩ for the eigenphase k/8 returns exactly |k⟩ under the inverse QFT -/
theorem phase_estimation_exact : ∀ k, k < 8 → ∀ r, r < 8 → sum8 (fun j => iqft r j * wPow (j * k)) = if r = k then 8 else 0 := by decide +kernel

end QuantumAlgorithm
