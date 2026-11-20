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

/-- `lake exe meaning <number> …`: the family formulas that reach each number, by `Thousand.meaning`. -/
lean_exe meaning where
  root := `Qpu.General.ThousandMain

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
  ["src/scripts/leanDerived.ts"]

/-- The Lean file that writes the prose index, where it writes it, and where the TypeScript reads it. -/
def proseFile : String := "src/quantum/processing/unit/lean/tools/Prose.lean"
/-- the index as Lean wrote it -/
def proseBuilt : System.FilePath := ".lake" / "build" / "prose-index.ts"
/-- the index the TypeScript reads -/
def proseIndex : System.FilePath := "src" / "quantum" / "processing" / "prose-index.ts"

/-- The Lean file that writes the nested catalogue, where it writes it, and where the TypeScript reads it. -/
def nestedFile : String := "src/quantum/processing/unit/lean/tools/Nested.lean"
/-- the catalogue as Lean wrote it -/
def nestedBuilt : System.FilePath := ".lake" / "build" / "nested-index.ts"
/-- the catalogue the TypeScript reads -/
def nestedIndex : System.FilePath := "src" / "quantum" / "processing" / "nested-index.ts"

/-- Lean writes an index; then it is installed, or with `check` compared with the committed one. -/
def renderByLean (file : String) (built index : System.FilePath) (check : Bool) : IO UInt32 := do
  let code ← step "lake" #["env", "lean", file]
  if code != 0 then return code
  let written ← IO.FS.readFile built
  let committed ← if ← index.pathExists then IO.FS.readFile index else pure ""
  if written == committed then return 0
  if check then
    IO.eprintln s!"{index} differs from what Lean writes: run lake run index and commit the result"
    return 1
  IO.FS.writeFile index written
  IO.println s!"wrote {index}"
  return 0

/-- The Lean file that writes the catalogue of claims. -/
def catalogueFile : String := "src/quantum/processing/unit/lean/tools/Catalogue.lean"

/-- The Lean file that writes the connector's configuration. -/
def configFile : String := "src/quantum/processing/unit/lean/tools/Config.lean"

/-- The Lean file that writes the register of standards. -/
def isoFile : String := "src/quantum/processing/unit/lean/tools/Iso.lean"

/-- The Lean file that writes the thousand-bit table. -/
def thousandFile : String := "src/quantum/processing/unit/lean/tools/Thousand.lean"

/-- The Lean file that writes the blueprint. -/
def blueprintFile : String := "src/quantum/processing/unit/lean/tools/Blueprint.lean"

/-- The Lean file that writes the textbook index. -/
def textbookFile : String := "src/quantum/processing/unit/lean/tools/Textbook.lean"

/-- The Lean file that writes the theorem index. -/
def theoremsFile : String := "src/quantum/processing/unit/lean/tools/Theorems.lean"

/-- Lean writes the prose index, the theorem index, the nested catalogue, the catalogue of claims, the thousand-bit table and the register of standards. -/
def renderProse (check : Bool) : IO UInt32 := do
  let said ← renderByLean proseFile proseBuilt proseIndex check
  if said != 0 then return said
  let stated ← renderByLean theoremsFile (".lake" / "build" / "theorems-index.ts") ("src" / "quantum" / "processing" / "theorems-index.ts") check
  if stated != 0 then return stated
  let taught ← renderByLean textbookFile (".lake" / "build" / "textbook-index.ts") ("src" / "quantum" / "processing" / "textbook-index.ts") check
  if taught != 0 then return taught
  let drawn ← renderByLean blueprintFile (".lake" / "build" / "BLUEPRINT.md") ("src" / "quantum" / "BLUEPRINT.md") check
  if drawn != 0 then return drawn
  let nested ← renderByLean nestedFile nestedBuilt nestedIndex check
  if nested != 0 then return nested
  let claimed ← renderByLean catalogueFile (".lake" / "build" / "CATALOGUE.md") ("src" / "quantum" / "CATALOGUE.md") check
  if claimed != 0 then return claimed
  let counted ← renderByLean thousandFile (".lake" / "build" / "thousand-index.ts") ("src" / "quantum" / "processing" / "thousand-index.ts") check
  if counted != 0 then return counted
  let listed ← renderByLean isoFile (".lake" / "build" / "iso-index.ts") ("src" / "quantum" / "processing" / "iso-index.ts") check
  if listed != 0 then return listed
  renderByLean configFile (".lake" / "build" / "config-index.ts") ("src" / "quantum" / "processing" / "config-index.ts") check

/-- `lake run index`: build, then Lean writes every file that follows it (prose index, theorem index, textbook index,
blueprint, nested catalogue, catalogue of claims, thousand-bit table, register of standards). The Clay statements keep their own generator,
which runs last. The prose index comes first: every other renderer reads its sentences from it. -/
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

/-- The Lean files that write rendered output; `lake run verify` runs each of them. -/
def leanTools : List String := [applicationsFile, proseFile, theoremsFile, textbookFile, blueprintFile, nestedFile, catalogueFile, thousandFile, isoFile, configFile]

/-- `lake run leanfiles`: no Lean file is skipped. Every `.lean` file the repository tracks is this lakefile, a module
the build compiles, a tool `lake run verify` runs, or evidence kept under `lean/`, which is named and never removed. -/
script leanfiles do
  let listed ← IO.Process.output { cmd := "git", args := #["ls-files", "*.lean"] }
  let files := (listed.stdout.splitOn "\n").filter (· != "")
  let unchecked := files.filter fun file =>
    !(file == "lakefile.lean" || file.startsWith "src/quantum/processing/unit/lean/Qpu/" || file == "src/quantum/processing/unit/lean/Qpu.lean" || leanTools.contains file)
  -- `lean/` is kept as evidence: its files are named here on every run, and nothing is removed for the kernel's sake
  let evidence := unchecked.filter (·.startsWith "lean/")
  let skipped := unchecked.filter (!·.startsWith "lean/")
  -- the root imports every module that states theorems, so the index, the catalogue and the claims see all of them;
  -- the prose modules hold sentences, and the two modules with a `main` are roots of their own
  let root ← IO.FS.readFile "src/quantum/processing/unit/lean/Qpu.lean"
  let imported := (root.splitOn "\n").filterMap fun line => if line.startsWith "import " then some (line.drop 7).trimAscii.toString else none
  let unseen := files.filter fun file =>
    file.startsWith "src/quantum/processing/unit/lean/Qpu/" && !file.startsWith "src/quantum/processing/unit/lean/Qpu/General/Prose"
      && !["Qpu.Claims.Extract", "Qpu.General.ThousandMain"].contains (((file.drop "src/quantum/processing/unit/lean/".length).dropEnd 5).toString.replace "/" ".")
      && !imported.contains (((file.drop "src/quantum/processing/unit/lean/".length).dropEnd 5).toString.replace "/" ".")
  for file in unseen do IO.eprintln s!"{file}: the root Qpu.lean does not import this module, so its theorems are in no index and no claim"
  if !unseen.isEmpty then return 1
  for file in evidence do IO.println s!"{file}: kept as evidence, not checked by the kernel"
  for file in skipped do IO.eprintln s!"{file}: no build and no script checks this Lean file"
  IO.println s!"{files.length} Lean file(s), {evidence.length} kept as evidence and not checked, {skipped.length} skipped"
  return if skipped.isEmpty then 0 else 1

/-- `lake run verify`: everything the kernel and the rendered files must satisfy — the build, the claim manifest,
that no Lean file is skipped, the rendered-file check and the draft applications. This is what CI runs. -/
script verify do
  steps
    [ ("lake", #["build"])
    , ("lake", #["exe", "claims"])
    , ("lake", #["run", "leanfiles"])
    , ("lake", #["run", "check"])
    , ("lake", #["env", "lean", applicationsFile]) ]

/-- `lake run seed`: write the VitePress pages from the seeds Payload writes, and the draft applications and the
prose pages from Lean. -/
script seed do
  steps [("node", #["src/scripts/site.ts"]), ("lake", #["run", "applications"]), ("lake", #["env", "lean", proseFile])]

/-- `lake run site`: write the pages, then build the VitePress site. -/
script site do
  steps [("lake", #["run", "seed"]), ("pnpm", #["exec", "vitepress", "build", "site"])]

/-- `lake run test`: the TypeScript tests of the quantum tree, which read the files rendered from Lean. -/
script test do
  steps [("node", #["--test", "src/quantum/**/*_test.ts", "src/quantum/**/*.test.ts"])]

/-- `lake run deploy`: the Payload deploy stages (database, seed, check, app), as package.json states them. -/
script deploy do
  steps [("pnpm", #["run", "deploy"])]
