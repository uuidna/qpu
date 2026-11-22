/-! # Qpu.General.Prose.ScriptsSite
The prose of `src/scripts/site.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def scriptsSite_says1 : String := "what tools/list answers, served statically; a static site answers no tools/call"
def scriptsSite_s2 : String := "description: \"The QPU pages and MCP catalogue, written by Lean and served beside /api/mcp\""
def scriptsSite_s3 : String := "This site is written from the quantum tree: the ISO/IEC 4879:2024 vocabulary, the standards it fuses, the MCP toolboxes and the theorems the Lean kernel accepted. Every tool answers live at POST /api/mcp."

def scriptsSite_proofs1 : String := "The theorems below are stated in Lean 4 and were accepted by its kernel, each with the axioms it rests on; the page carries them as schema.org microdata an MCP client reads."

end Prose
