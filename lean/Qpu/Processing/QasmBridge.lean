import Mathlib

/-!
# The OpenQASM bridge, proved

OpenQASM declares its qubits in registers, `qreg a[1]; qreg b[2];`, and the door lays them out one after another as one line of
qubits: the qubit `j` of the register `k` sits at the sizes of the registers before `k` plus `j`. That is the position Mathlib's
`finSigmaFinEquiv` gives the pair `⟨k, j⟩` (`finSigmaFinEquiv_apply`), and since it is an equivalence, no two qubits share a place.
-/

namespace QasmBridge

/-- The registers flatten without collision: two qubits laid out at the same position are the same qubit of the same register. The
position is `finSigmaFinEquiv`'s, which Mathlib proves to be the sizes of the registers before plus the index
(`finSigmaFinEquiv_apply`). An equivalence is injective (`Equiv.injective`), so equal images mean equal qubits
(`Function.Injective.eq_iff`), and equal positions are equal elements of `Fin` (`Fin.ext_iff`). -/
theorem registers_flatten {m : ℕ} {n : Fin m → ℕ} (a b : (i : Fin m) × Fin (n i))
    (h : (finSigmaFinEquiv a : ℕ) = finSigmaFinEquiv b) : a = b := by
  rw [← finSigmaFinEquiv.injective.eq_iff, Fin.ext_iff]
  exact h

end QasmBridge
