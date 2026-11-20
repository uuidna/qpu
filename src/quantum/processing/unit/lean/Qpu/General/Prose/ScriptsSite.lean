/-! # Qpu.General.Prose.ScriptsSite
The prose of `src/scripts/site.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def scriptsSite_says1 : String := "what tools/list answers, served statically; a static site answers no tools/call"
def scriptsSite_s2 : String := "description: \"The QPU pages and MCP catalogue, served statically from the same seeds Payload writes\""
def scriptsSite_s3 : String := "This site is built from the same seeds the Payload site writes, so it serves every page when Payload or its database is down."

end Prose
