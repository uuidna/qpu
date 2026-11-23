/-! # Qpu.General.Prose.ScriptsStdio
The prose of `scripts/stdio.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def scriptsStdio_machine : String := "This machine through the allow-list: an action is planned against the workflow rules, refused with the court's case or run, and its output recorded redacted at its content address. It reads files, searches the tracked tree, applies a unified diff, checks one Lean file and runs lake's build, check, index and gaps beside git. Files are staged and committed by their paths, never all at once; a push needs confirm: true."
def scriptsStdio_action : String := "The action, one of the allow-list's ids: status, log, ahead and diff read; read takes files, search takes pattern (a regular expression), patch takes patch (a unified diff), lean takes file; build, check, index and gaps run lake; stage takes files, commit takes a message and may take files, push takes confirm."
def scriptsStdio_files : String := "The paths to read, to stage, or the only paths to commit, each relative to the repository root."
def scriptsStdio_message : String := "The commit message: a subject in the imperative and a body."
def scriptsStdio_confirm : String := "true when the person asked for this push or other confirmed action themselves."

end Prose
