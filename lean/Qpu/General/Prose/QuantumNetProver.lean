/-! # Qpu.General.Prose.QuantumNetProver
The prose of `src/quantum/net/prover.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def quantumNetProver_lean : String := "Lean 4 with Mathlib and this tree's own Lean, in a container with no internet: check a Lean source and get the kernel's verdict with every message Lean wrote, or run Lean's library search over every theorem of the tree. An answer is a verdict (accepted, or rejected with Lean's own error messages) and carries a receipt, the address of the source, the verdict, the messages and the toolchain; or it is no verdict (the time limit passed, or the prover failed, was busy or could not be reached), named by its code, and carries no receipt."
def quantumNetProver_source : String := "A Lean source to check, as one file: it may import Mathlib and any Qpu module; ok is true only when Lean accepts all of it within the time limit."
def quantumNetProver_gaps : String := "true: Lean's library search over every theorem of the tree with a variable, run once per image as three shards at once; the first call starts it, later calls answer its progress and then its counts."
def quantumNetProver_sourceRefused : String := "The source must be Lean text of 1 to ⟦0⟧ characters."

def quantumNetProver_limits : String := "Limits: a source of 1 to ⟦0⟧ characters, and ⟦1⟧ seconds for Lean to decide it. One container serves every caller: it checks ⟦2⟧ sources at once, ⟦3⟧ more wait their turn, and a call beyond those is answered prover_busy with retryAfterSeconds. The container sleeps after ⟦4⟧ minutes without a call; the next call starts it, which takes seconds when its image is at hand and minutes when it is not, and a call that finds it out of reach is answered prover_unavailable. Importing Mathlib adds seconds to a check."
def quantumNetProver_timeLimit : String := "Lean did not decide within ⟦0⟧ seconds: the source is neither accepted nor rejected, and nothing is sealed."
def quantumNetProver_failed : String := "The prover failed before Lean reached a verdict (exit ⟦0⟧). This says nothing about the source: stderr carries what the process wrote, and nothing is sealed."
def quantumNetProver_busy : String := "Every check slot is taken and the queue is full. This says nothing about the source: ask again in ⟦0⟧ seconds."
def quantumNetProver_unavailable : String := "The prover could not be reached: ⟦0⟧. This says nothing about the source: a container that is starting answers within minutes, so ask again."
def quantumNetProver_unanswered : String := "The prover did not answer on port ⟦0⟧."

end Prose
