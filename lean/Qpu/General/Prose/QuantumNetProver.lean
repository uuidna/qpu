/-! # Qpu.General.Prose.QuantumNetProver
The prose of `src/quantum/net/prover.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def quantumNetProver_lean : String := "Lean 4 with Mathlib and this tree's own Lean, in a container with no internet: check a Lean source and get the kernel's verdict with every message Lean wrote, or run Lean's library search over every theorem of the tree."
def quantumNetProver_source : String := "A Lean source to check, as one file: it may import Mathlib and any Qpu module; ok is true only when Lean accepts all of it within the time limit."
def quantumNetProver_gaps : String := "true: Lean's library search over every theorem of the tree with a variable, run once per image as three shards at once; the first call starts it, later calls answer its progress and then its counts."
def quantumNetProver_sourceRefused : String := "The source must be Lean text of 1 to ⟦0⟧ characters."

end Prose
