/-! # Qpu.General.Prose.ScriptsDevelopLead
The prose of `src/scripts/developLead.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def scriptsDevelopLead_s1 : String := "⟦0⟧ is not an admin here: run queueLegacyLeads first or name one"
def scriptsDevelopLead_s2 : String := "no lead page for ⟦0⟧: queue it with LEGACY_PATHS=⟦1⟧"
def scriptsDevelopLead_s3 : String := "⟦0⟧ is now a product. It was developed from the lead ⟦1⟧, which entered this installation through the uuidna trial door."

end Prose
