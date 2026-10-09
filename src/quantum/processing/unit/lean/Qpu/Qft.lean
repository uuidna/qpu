/-! # Qpu.Qft
Quantum Fourier transform resource counts over the qubit count q, exact Nat: the gate count (a triangular number), the
swap count, the circuit depth and the output dimension. The kernel proves the values; there is no holds. -/

def qftGates (q : Nat) : Nat := q * (q + 1) / 2
def qftSwaps (q : Nat) : Nat := q / 2
def qftDepth (q : Nat) : Nat := 2 * q - 1
def qftStates (q : Nat) : Nat := 2 ^ q
theorem qft_all : qftGates 3 = 6 ∧ qftGates 4 = 10 ∧ qftSwaps 4 = 2 ∧ qftDepth 4 = 7 ∧ qftStates 4 = 16 := ⟨rfl, rfl, rfl, rfl, rfl⟩
