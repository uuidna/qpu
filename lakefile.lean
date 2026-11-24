import Lake
open Lake DSL

package qpu where
  srcDir := "lean"
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

/-- The meaning gate, built by default: `lake build` fails on any violation of textbook meaning not named in
`GateBaseline`, and on any named one that no longer stands. Meaning comes from Mathlib; nothing is written by hand. -/
@[default_target]
lean_lib QpuGate where
  roots := #[`Gate, `GateBaseline]

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
def applicationsFile : String := "lean/tools/Applications.lean"

/-- The scripts that render files from Lean, in the order they depend on each other. -/
def renderers : List String :=
  ["scripts/leanDerived.ts"]

/-- The Lean file that writes the prose index, where it writes it, and where the TypeScript reads it. -/
def proseFile : String := "lean/tools/Prose.lean"
/-- the index as Lean wrote it -/
def proseBuilt : System.FilePath := ".lake" / "build" / "prose-index.ts"
/-- the index the TypeScript reads -/
def proseIndex : System.FilePath := "src" / "quantum" / "processing" / "prose-index.ts"

/-- The Lean file that writes the nested catalogue, where it writes it, and where the TypeScript reads it. -/
def nestedFile : String := "lean/tools/Nested.lean"
/-- the catalogue as Lean wrote it -/
def nestedBuilt : System.FilePath := ".lake" / "build" / "nested-index.ts"
/-- the catalogue the TypeScript reads -/
def nestedIndex : System.FilePath := "src" / "quantum" / "processing" / "nested-index.ts"

/-- The Lean file that writes the catalogue of claims. -/
def catalogueFile : String := "lean/tools/Catalogue.lean"

/-- The Lean file that writes the connector's configuration. -/
def configFile : String := "lean/tools/Config.lean"

/-- The Lean file that writes the stylesheet that reads a variation by its address in CSS alone. -/
def cssFile : String := "lean/tools/Css.lean"

/-- The Lean file that writes the register of standards. -/
def isoFile : String := "lean/tools/Iso.lean"

/-- The Lean file that writes the thousand-bit table. -/
def thousandFile : String := "lean/tools/Thousand.lean"

/-- The Lean file that writes the blueprint. -/
def blueprintFile : String := "lean/tools/Blueprint.lean"

/-- The Lean file that writes the textbook index. -/
def textbookFile : String := "lean/tools/Textbook.lean"

/-- The Lean file that writes the theorem index. -/
def theoremsFile : String := "lean/tools/Theorems.lean"

/-- The Lean file that finds the library's gaps by Lean's own library search, and the shards it runs as at once. -/
def gapsFile : String := "lean/tools/Gaps.lean"
def gapsShards : Nat := 3

/-- The Lean file that renders the UUID address core as TypeScript (Lean → TS codegen). -/
def addressFile : String := "lean/tools/Address.lean"

/-- Compare what a Lean tool wrote with the committed file, or install it. -/
def settle (built index : System.FilePath) (check : Bool) : IO UInt32 := do
  let written ← IO.FS.readFile built
  let committed ← if ← index.pathExists then IO.FS.readFile index else pure ""
  if written == committed then return 0
  if check then
    IO.eprintln s!"{index} differs from what Lean writes: run lake run index and commit the result"
    return 1
  IO.FS.writeFile index written
  IO.println s!"wrote {index}"
  return 0

/-- Each Lean tool with the file it writes and the committed file that follows it. -/
def rendered : List (String × System.FilePath × System.FilePath) :=
  [ (proseFile, proseBuilt, proseIndex)
  , (theoremsFile, ".lake" / "build" / "theorems-index.ts", "src" / "quantum" / "processing" / "theorems-index.ts")
  , (textbookFile, ".lake" / "build" / "textbook-index.ts", "src" / "quantum" / "processing" / "textbook-index.ts")
  , (blueprintFile, ".lake" / "build" / "BLUEPRINT.md", "src" / "quantum" / "BLUEPRINT.md")
  , (nestedFile, nestedBuilt, nestedIndex)
  , (catalogueFile, ".lake" / "build" / "CATALOGUE.md", "src" / "quantum" / "CATALOGUE.md")
  , (thousandFile, ".lake" / "build" / "thousand-index.ts", "src" / "quantum" / "processing" / "thousand-index.ts")
  , (isoFile, ".lake" / "build" / "iso-index.ts", "src" / "quantum" / "processing" / "iso-index.ts")
  , (configFile, ".lake" / "build" / "config-index.ts", "src" / "quantum" / "processing" / "config-index.ts")
  , (cssFile, ".lake" / "build" / "advantage.css", "site" / ".vitepress" / "theme" / "advantage.css")
  , (addressFile, ".lake" / "build" / "address-core.ts", "src" / "quantum" / "password" / "address-core.ts") ]

/-- Lean writes the prose index, the theorem index, the textbook index, the blueprint, the nested catalogue, the
catalogue of claims, the thousand-bit table, the register of standards and the configuration. The tools read the same
built tree and each writes its own file, so they run at the same time; the files are then settled in order. -/
def renderProse (check : Bool) : IO UInt32 := do
  let tasks ← rendered.mapM fun (file, _, _) => IO.asTask (step "lake" #["env", "lean", file])
  let mut failed : UInt32 := 0
  for ((file, built, index), task) in rendered.zip tasks do
    match task.get with
    | .error e =>
      IO.eprintln s!"{file}: {e}"
      failed := 1
    | .ok code =>
      if code != 0 then
        IO.eprintln s!"{file}: Lean stopped with code {code}"
        failed := code
      else
        let settled ← settle built index check
        if settled != 0 then failed := settled
  return failed

/-- Wrangler's configuration and the git hooks Lean writes (lean/tools/Config.lean), compared with or installed as
`wrangler.jsonc` and into `.githooks`. -/
def renderHooks (check : Bool) : IO UInt32 := do
  let built : System.FilePath := ".lake" / "build" / "githooks"
  let hooksDir : System.FilePath := ".githooks"
  let mut code ← settle (".lake" / "build" / "wrangler.jsonc") "wrangler.jsonc" check
  for entry in (← built.readDir) do
    let written ← IO.FS.readFile entry.path
    let at_ := hooksDir / entry.fileName
    let committed ← if ← at_.pathExists then IO.FS.readFile at_ else pure ""
    if written == committed then continue
    if check then
      IO.eprintln s!"{at_} differs from what Lean writes: run lake run index and commit the result"
      code := 1
    else
      IO.FS.createDirAll hooksDir
      IO.FS.writeFile at_ written
      IO.setAccessRights at_ { user := { read := true, write := true, execution := true }, group := { read := true, execution := true }, other := { read := true, execution := true } }
      IO.println s!"wrote {at_}"
  return code

/-- Lean's library search over every declared theorem with a variable, as `gapsShards` shards at once, their rows
merged into the gaps index the `textbook { gaps }` door serves. A rerun keeps each committed row whose statements are
unchanged under the same Mathlib, budget and procedures, so it searches only what changed. -/
def renderGaps (check : Bool) : IO UInt32 := do
  let run (env : String × String) : IO UInt32 := do
    (← IO.Process.spawn { cmd := "lake", args := #["env", "lean", gapsFile], env := #[(env.1, some env.2)] }).wait
  for k in List.range gapsShards do IO.FS.writeFile (".lake" / "build" / s!"gaps-{k}-of-{gapsShards}.jsonl") ""
  let tasks ← (List.range gapsShards).mapM fun k => IO.asTask (run ("GAPS_SHARD", s!"{k}/{gapsShards}"))
  for task in tasks do
    match task.get with
    | .ok 0 => pure ()
    | _ => return 1
  let merged ← run ("GAPS_MERGE", toString gapsShards)
  if merged != 0 then return merged
  settle (".lake" / "build" / "gaps-index.ts") ("src" / "quantum" / "processing" / "gaps-index.ts") check

/-- `lake run index`: build, then Lean writes every file that follows it (prose index, theorem index, textbook index,
blueprint, nested catalogue, catalogue of claims, thousand-bit table, register of standards, gaps index). The Clay statements keep their own generator,
which runs last. The prose index comes first: every other renderer reads its sentences from it. -/
script index do
  let built ← step "lake" #["build"]
  if built != 0 then return built
  let said ← renderProse false
  if said != 0 then return said
  let searched ← renderGaps false
  if searched != 0 then return searched
  let hooked ← renderHooks false
  if hooked != 0 then return hooked
  steps (renderers.map fun file => ("node", #[file]))

/-- `lake run gaps`: build, then the gaps index alone. -/
script gaps do
  let built ← step "lake" #["build"]
  if built != 0 then return built
  renderGaps false

/-- `lake run check`: build, then fail when a rendered file differs from Lean. Nothing is written. -/
script check do
  let built ← step "lake" #["build"]
  if built != 0 then return built
  let said ← renderProse true
  if said != 0 then return said
  let searched ← renderGaps true
  if searched != 0 then return searched
  let hooked ← renderHooks true
  if hooked != 0 then return hooked
  steps (renderers.map fun file => ("node", #[file, "--check"]))

/-- `lake run hooks`: Lean writes the git hooks and git is told to use them. Each hook is the client of the workflow of
its name, served by the repository tool, so a commit and a push run the same process the tree runs everywhere. -/
script hooks do
  let built ← step "lake" #["env", "lean", configFile]
  if built != 0 then return built
  let written ← renderHooks false
  if written != 0 then return written
  step "git" #["config", "core.hooksPath", ".githooks"]

/-- `lake run prose`: fail when a sentence is typed in TypeScript instead of written in Lean. -/
script prose do
  steps [("node", #["scripts/proseCheck.ts"])]

/-- `lake run applications`: Lean writes one draft application per theoretical use into `site/patents`. -/
script applications do
  steps [("lake", #["build"]), ("lake", #["env", "lean", applicationsFile])]

/-- The Lean files that write rendered output; `lake run verify` runs each of them. -/
def leanTools : List String := [applicationsFile, proseFile, theoremsFile, textbookFile, blueprintFile, nestedFile, catalogueFile, thousandFile, isoFile, configFile, cssFile, addressFile, gapsFile]

/-- `lake run leanfiles`: no Lean file is skipped. Every `.lean` file the repository tracks is this lakefile, a module
the build compiles, a tool `lake run verify` runs, or evidence kept under `lean/`, which is named and never removed. -/
script leanfiles do
  let listed ← IO.Process.output { cmd := "git", args := #["ls-files", "*.lean"] }
  let files := (listed.stdout.splitOn "\n").filter (· != "")
  let unchecked := files.filter fun file =>
    !(file == "lakefile.lean" || file.startsWith "lean/Qpu/" || file == "lean/Qpu.lean" || file == "lean/Gate.lean" || file == "lean/GateBaseline.lean" || leanTools.contains file)
  -- `lean/` is kept as evidence: its files are named here on every run, and nothing is removed for the kernel's sake
  let evidence := unchecked.filter (·.startsWith "lean/")
  let skipped := unchecked.filter (!·.startsWith "lean/")
  -- the root imports every module that states theorems, so the index, the catalogue and the claims see all of them;
  -- the prose modules hold sentences, and the two modules with a `main` are roots of their own
  let root ← IO.FS.readFile "lean/Qpu.lean"
  let imported := (root.splitOn "\n").filterMap fun line => if line.startsWith "import " then some (line.drop 7).trimAscii.toString else none
  let unseen := files.filter fun file =>
    file.startsWith "lean/Qpu/" && !file.startsWith "lean/Qpu/General/Prose"
      && !["Qpu.Claims.Extract", "Qpu.General.ThousandMain"].contains (((file.drop "lean/".length).dropEnd 5).toString.replace "/" ".")
      && !imported.contains (((file.drop "lean/".length).dropEnd 5).toString.replace "/" ".")
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
  steps [("node", #["scripts/site.ts"]), ("lake", #["run", "applications"]), ("lake", #["env", "lean", proseFile])]

/-- `lake run site`: write the pages, then build the VitePress site. -/
script site do
  steps [("lake", #["run", "seed"]), ("pnpm", #["exec", "vitepress", "build", "site"])]

/-- `lake run test`: the TypeScript tests of the quantum tree, which read the files rendered from Lean. -/
script test do
  steps [("node", #["--test", "src/quantum/**/*_test.ts", "src/quantum/**/*.test.ts"])]

/-- `lake run deploy`: the Payload deploy stages (database, seed, check, app), as package.json states them. -/
script deploy do
  steps [("pnpm", #["run", "deploy"])]
