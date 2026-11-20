/-! # Qpu.General.Prose.ScriptsProseCheck
The prose of `src/scripts/proseCheck.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def scriptsProseCheck_s1 : String := "prose is written in Lean: define each sentence under Qpu/General/Prose, run lake run index, and read it as PROSE.<name>"
def scriptsProseCheck_s2 : String := "a sentence names a theorem the kernel does not have yet: it is a lead, a theorem to prove in Lean; nothing is removed for it"

end Prose
