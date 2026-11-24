/-! # Qpu.General.Prose.QuantumProcessingDeployed
The prose of `src/quantum/processing/deployed.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def quantumProcessingDeployed_holdsAccepted : String := "Lean accepted the theorem that holds, 1 + 1 = 2, in ⟦0⟧ ms."
def quantumProcessingDeployed_holdsWrong : String := "Lean must accept the theorem that holds, 1 + 1 = 2, and the server answered: ⟦0⟧"
def quantumProcessingDeployed_failsRejected : String := "Lean rejected the theorem that does not hold, 1 + 1 = 3, with an error of its own: ⟦0⟧"
def quantumProcessingDeployed_failsWrong : String := "Lean must reject the theorem that does not hold, 1 + 1 = 3, with an error message of its own, and the server answered: ⟦0⟧"
def quantumProcessingDeployed_selftestPassed : String := "The selftest of ⟦0⟧ passed its ⟦1⟧ checks in ⟦2⟧ ms."
def quantumProcessingDeployed_selftestWrong : String := "The selftest of ⟦0⟧ must pass every check, and the server answered: ⟦1⟧"
def quantumProcessingDeployed_shardPassed : String := "Audit share ⟦0⟧ of ⟦1⟧ replayed ⟦2⟧ checks and none failed, in ⟦3⟧ ms (textbook_shards_cover)."
def quantumProcessingDeployed_shardWrong : String := "Audit share ⟦0⟧ of ⟦1⟧ must replay with no failed check, and the server answered: ⟦2⟧"
def quantumProcessingDeployed_retry : String := "⟦0⟧ is asked again, attempt ⟦1⟧ of ⟦2⟧, because the prover gave no verdict (⟦3⟧): ⟦4⟧"
def quantumProcessingDeployed_unanswered : String := "no answer was handed back for this request"
def quantumProcessingDeployed_says : String := "The deployed server at ⟦0⟧ gave ⟦1⟧ of ⟦2⟧ answers the gate requires; ⟦3⟧ wrong, ⟦4⟧ asked again."

end Prose
