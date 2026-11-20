/-! # Qpu.General.Prose.ScriptsProseCheck
The prose of `src/scripts/proseCheck.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def scriptsProseCheck_s1 : String := "prose is written in Lean: define each sentence under Qpu/General/Prose, run lake run index, and read it as PROSE.<name>"
def scriptsProseCheck_s2 : String := "a sentence names a theorem the kernel does not have: prove the theorem in Lean, or take its name out of the sentence"

end Prose
