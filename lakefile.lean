import Lake
open Lake DSL

package qpu where
  srcDir := "src/quantum/processing/unit/lean"
  leanOptions := #[
    ⟨`autoImplicit, false⟩,
    ⟨`relaxedAutoImplicit, false⟩,
    ⟨`linter.unusedVariables, true⟩
  ]

/-- Mathlib names the notions: `Qpu.Meaning` proves each definition of this tree equal to the Mathlib notion it is. -/
require mathlib from git
  "https://github.com/leanprover-community/mathlib4" @ "v4.33.0"

/-- Every module under `Qpu`, so the kernel checks the whole tree and no file is left outside the build. -/
@[default_target]
lean_lib Qpu where
  globs := #[.andSubmodules `Qpu]

lean_exe claims where
  root := `Qpu.Claims.Extract
  supportInterpreter := true

/-! ## Scripts

Lake is the one entry point. Every step that reads Lean or renders from it is a script here, so a workflow, a
package script and a person all run the same command: `lake run <script>`. -/

/-- Run one command with the caller's terminal and return its exit code. -/
def step (cmd : String) (args : Array String) : IO UInt32 := do
  IO.println s!"> {cmd} {" ".intercalate args.toList}"
  let child ← IO.Process.spawn { cmd, args }
  child.wait

/-- Run the steps in order and stop at the first that fails. -/
def steps (all : List (String × Array String)) : IO UInt32 := do
  for (cmd, args) in all do
    let code ← step cmd args
    if code != 0 then return code
  return 0

/-- The Lean file that writes the draft applications. -/
def applicationsFile : String := "src/quantum/processing/unit/lean/tools/Applications.lean"

/-- The scripts that render files from Lean, in the order they depend on each other. -/
def renderers : List String :=
  ["src/scripts/textbookIndex.ts", "src/scripts/theoremsIndex.ts", "src/scripts/leanDerived.ts"]

/-- The Lean file that writes the prose index, where it writes it, and where the TypeScript reads it. -/
def proseFile : String := "src/quantum/processing/unit/lean/tools/Prose.lean"
/-- the index as Lean wrote it -/
def proseBuilt : System.FilePath := ".lake" / "build" / "prose-index.ts"
/-- the index the TypeScript reads -/
def proseIndex : System.FilePath := "src" / "quantum" / "processing" / "prose-index.ts"

/-- Lean writes the prose index; then it is installed, or with `check` compared with the committed one. -/
def renderProse (check : Bool) : IO UInt32 := do
  let code ← step "lake" #["env", "lean", proseFile]
  if code != 0 then return code
  let built ← IO.FS.readFile proseBuilt
  let committed ← if ← proseIndex.pathExists then IO.FS.readFile proseIndex else pure ""
  if built == committed then return 0
  if check then
    IO.eprintln s!"{proseIndex} differs from the Lean definitions under Qpu/General/Prose: run lake run index and commit the result"
    return 1
  IO.FS.writeFile proseIndex built
  IO.println s!"wrote {proseIndex}"
  return 0

/-- `lake run index`: build, then render every file that follows Lean (prose index, textbook index, theorem index,
blueprint, Clay statements). The prose index comes first: every other renderer reads its sentences from it. -/
script index do
  let built ← step "lake" #["build"]
  if built != 0 then return built
  let said ← renderProse false
  if said != 0 then return said
  steps (renderers.map fun file => ("node", #[file]))

/-- `lake run check`: build, then fail when a rendered file differs from Lean. Nothing is written. -/
script check do
  let built ← step "lake" #["build"]
  if built != 0 then return built
  let said ← renderProse true
  if said != 0 then return said
  steps (renderers.map fun file => ("node", #[file, "--check"]))

/-- `lake run prose`: fail when a sentence is typed in TypeScript instead of written in Lean. -/
script prose do
  steps [("node", #["src/scripts/proseCheck.ts"])]

/-- `lake run applications`: Lean writes one draft application per theoretical use into `site/patents`. -/
script applications do
  steps [("lake", #["build"]), ("lake", #["env", "lean", applicationsFile])]

/-- `lake run verify`: everything the kernel and the rendered files must satisfy — the build, the claim manifest,
the rendered-file check and the draft applications. This is what CI runs. -/
script verify do
  steps
    [ ("lake", #["build"])
    , ("lake", #["exe", "claims"])
    , ("lake", #["run", "check"])
    , ("lake", #["env", "lean", applicationsFile]) ]

/-- `lake run seed`: write the VitePress pages from the seeds Payload writes, and the draft applications from Lean. -/
script seed do
  steps [("node", #["src/scripts/site.ts"]), ("lake", #["run", "applications"])]

/-- `lake run site`: write the pages, then build the VitePress site. -/
script site do
  steps [("lake", #["run", "seed"]), ("pnpm", #["exec", "vitepress", "build", "site"])]

/-- `lake run test`: the TypeScript tests of the quantum tree, which read the files rendered from Lean. -/
script test do
  steps [("node", #["--test", "src/quantum/**/*_test.ts", "src/quantum/**/*.test.ts"])]

/-- `lake run deploy`: the Payload deploy stages (database, seed, check, app), as package.json states them. -/
script deploy do
  steps [("pnpm", #["run", "deploy"])]
