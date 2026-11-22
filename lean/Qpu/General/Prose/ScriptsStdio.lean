/-! # Qpu.General.Prose.ScriptsStdio
The prose of `scripts/stdio.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def scriptsStdio_probe : String := "No Payload app answers at ⟦1⟧: start the local app with scripts/site-local.sh start, or name a deployed app's endpoint in QPU_APP_MCP, and list the tools again."

def scriptsStdio_unreached : String := "No Payload app answered the call to ⟦1⟧: name a deployed app's endpoint in QPU_APP_MCP or start the local app, then call again."

end Prose
