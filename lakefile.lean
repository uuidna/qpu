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

/-- `lake run index`: build, then render every file that follows Lean (textbook index, theorem index, blueprint,
Clay statements). -/
script index do
  steps (("lake", #["build"]) :: renderers.map fun file => ("node", #[file]))

/-- `lake run check`: build, then fail when a rendered file differs from Lean. Nothing is written. -/
script check do
  steps (("lake", #["build"]) :: renderers.map fun file => ("node", #[file, "--check"]))

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
