import Qpu.General.Textbook
import Qpu.General.Lattice

/-! # Qpu.General.Config

The configuration the connector reads, held by Lean.

Each value the connector was configured with by hand is stated here once. A value that follows from a rule is derived
from the rule and proved equal to what was typed before: the primes a hexadecimal digit can hold are computed, not
listed. A value that names a theorem is written as a name the compiler resolves, so the connector cannot be
configured with a theorem the kernel lacks. `tools/Config.lean` writes these values for the code to read. -/

namespace Config

/-- `Nat.Prime p` means that `p` is a prime number, that is, a natural number
at least 2 whose only divisors are `p` and `1`.
The theorem `Nat.prime_def` witnesses this description of a prime number. -/
def isPrime (n : Nat) : Bool := 2 ≤ n && (List.range n).all fun d => d < 2 || n % d != 0

/-- The primes a hexadecimal digit can hold: the primes below sixteen. -/
def nibblePrimes : List Nat := (List.range 16).filter isPrime

/-- The primes below sixteen are these six. -/
theorem nibble_primes : nibblePrimes = [2, 3, 5, 7, 11, 13] := by decide

/-- A formula the connector solves for a variable: its name, the theorem that states it, and its parameters. -/
structure Formula where
  /-- the name the caller asks by -/
  name : String
  /-- the theorem that states the formula -/
  witness : Lean.Name
  /-- the parameters the caller gives -/
  params : List String

/-- The formulas the connector solves. -/
def formulas : List Formula :=
  [ ⟨"order", ``textbook_order_finding, ["N", "a"]⟩
  , ⟨"shor", ``textbook_shor_reduction, ["N", "a", "order"]⟩
  , ⟨"factor", ``textbook_factors_divide, ["integer", "a"]⟩ ]

/-- The Payload plugins the connector expects to find mounted. -/
def officialPlugins : List String :=
  [ "@payloadcms/plugin-ecommerce", "@payloadcms/plugin-mcp", "@payloadcms/plugin-multi-tenant"
  , "@payloadcms/plugin-search", "@payloadcms/plugin-import-export", "@payloadcms/plugin-form-builder"
  , "@payloadcms/plugin-seo", "@payloadcms/plugin-nested-docs", "@payloadcms/plugin-redirects" ]

/-- The tools served first: the register, the decider and the verifier. -/
def clayFirst : List String := ["clay", "match", "verify"]

/-- The most theorems one chat share carries. -/
def chatShare : Nat := 12

/-- The protocol version the connector answers `initialize` with. -/
def protocolVersion : String := "2025-06-18"

/-- The address of the theorem ledger among the connector's resources. -/
def leanResource : String := "lean://qpu/theorems"

-- The domains bound to the Worker, each with its tenant. Wrangler's routes, the hosts the server answers and serves
-- free and the hosts the site names are built from this one list (lean/tools/Config.lean writes them).
/-- The list whose first element is `head`, where `tail` is the rest of the list.
Usually written `head :: tail`.


Conventions for notations in identifiers:

 * The recommended spelling of `::` in identifiers is `cons`.

 * The recommended spelling of `[a]` in identifiers is `singleton`.-/
def tenants : List (String × String) := [("qpu.uuidna.com", "uuidna"), ("qpu.psg.bg", "psg")]

/-- The ways an operation is inserted into a circuit, and the one used when none is named. -/
def insertStrategies : List String := ["EARLIEST", "NEW", "INLINE", "NEW_THEN_INLINE"]

/-- The insert strategy used when none is named. -/
def insertDefault : String := "EARLIEST"

/-- The configuration is consistent: nine plugins, each named once; three tools served first; and the default insert strategy is one of the strategies. -/
theorem config_consistent :
    officialPlugins.length = 9 ∧ officialPlugins.eraseDups.length = 9 ∧ clayFirst.length = 3 ∧
    insertStrategies.contains insertDefault = true ∧ formulas.length = 3 := by decide

/-- The coin qubit space: the states of the qubits the coins mint. The coins mint the hexbit, and the hexbit's qubits
span this many states. No computation keeps more remembered results than this at once. -/
def coinQubitSpace : Nat := mint hexbit

/-- The coins are 2, the hexbit they mint is 4 qubits, and those span 16 states. -/
theorem coin_qubit_space : coins = 2 ∧ hexbit = 4 ∧ coinQubitSpace = 16 := ⟨coins_two, rfl, rfl⟩

/-- The PBKDF2 iteration counts Payload can hash a password with (`auth.passwordHashIterations`). -/
def passwordHashChoices : List Nat := [100000, 600000]

/-- The most PBKDF2 iterations the Workers runtime runs in one call. -/
def workerHashLimit : Nat := 100000

/-- The count this installation hashes a password with: the largest Payload offers that the Worker can run. Payload's
    own default, the largest of its choices, is past the Worker's limit, so a password could not be set there. -/
def passwordHashIterations : Nat := (passwordHashChoices.filter (· ≤ workerHashLimit)).foldl max 0

/-- The count is one Payload offers, the Worker runs it, and Payload's default does not fit the Worker. -/
theorem password_hash_fits :
    passwordHashIterations = 100000 ∧ passwordHashChoices.contains passwordHashIterations = true ∧
    passwordHashIterations ≤ workerHashLimit ∧ workerHashLimit < passwordHashChoices.foldl max 0 := by decide

/-- The workflows the repository tool serves: the points at which the tree checks itself. -/
def workflows : List String := ["pre-commit", "commit-msg", "pre-push", "post-commit", "post-push", "prepare-commit-msg", "ci", "pre-deploy", "pre-tool"]

/-- The workflows git itself starts. The others are started by CI and by the deploy. -/
def gitHooks : List String := ["pre-commit", "commit-msg", "pre-push", "post-commit", "post-push", "prepare-commit-msg"]

/-- The workflows that run after the act: they report it and cannot refuse it. -/
def afterHooks : List String := ["post-commit", "post-push"]

-- The workflows the harness of an agent starts, each with the harness event that starts it: the tree's court for a
-- session, before a tool runs.
/-- The list whose first element is `head`, where `tail` is the rest of the list.
Usually written `head :: tail`.


Conventions for notations in identifiers:

 * The recommended spelling of `::` in identifiers is `cons`.

 * The recommended spelling of `[a]` in identifiers is `singleton`.-/
def agentEvents : List (String × String) := [("pre-tool", "PreToolUse")]

-- The harness tools that write a file. In the tree a file changes only through the machine door's patch, and
-- nothing is written outside a repository.
/-- The list whose first element is `head`, where `tail` is the rest of the list.
Usually written `head :: tail`.


Conventions for notations in identifiers:

 * The recommended spelling of `::` in identifiers is `cons`.

 * The recommended spelling of `[a]` in identifiers is `singleton`.-/
def agentWriteTools : List String := ["Edit", "Write", "MultiEdit", "NotebookEdit"]

-- The harness tools that spawn agents. Their energy is measured by time against what landed, and each runs only on
-- the owner's word.
/-- The list whose first element is `head`, where `tail` is the rest of the list.
Usually written `head :: tail`.


Conventions for notations in identifiers:

 * The recommended spelling of `::` in identifiers is `cons`.

 * The recommended spelling of `[a]` in identifiers is `singleton`.-/
def agentSpawnTools : List String := ["Agent", "Task", "Workflow"]

-- The rules of an agent hook that ask the owner instead of refusing.
/-- The list whose first element is `head`, where `tail` is the rest of the list.
Usually written `head :: tail`.


Conventions for notations in identifiers:

 * The recommended spelling of `::` in identifiers is `cons`.

 * The recommended spelling of `[a]` in identifiers is `singleton`.-/
def agentConfirmRules : List String := ["timed"]

/-- The hook file git reads for a workflow. Git has no hook after a push, so post-push rides `reference-transaction`,
    which git runs once the remote-tracking ref has moved; every other workflow has the hook of its own name. -/
def hookFile (workflow : String) : String := if workflow == "post-push" then "reference-transaction" else workflow

/-- Every git hook is a workflow, every agent hook is a workflow git does not start, and every other workflow is one
    CI or the deploy starts. -/
theorem git_hooks_are_workflows :
    (gitHooks.all fun hook => workflows.contains hook) = true ∧ (agentEvents.all fun hook => workflows.contains hook.1 && !gitHooks.contains hook.1) = true ∧ (workflows.filter fun w => !gitHooks.contains w && !(agentEvents.map (·.1)).contains w) = ["ci", "pre-deploy"] := by
  decide

/-- Every workflow git starts has its own hook file, and the workflows after the act are among those git starts. -/
theorem hook_files_distinct :
    (gitHooks.map hookFile).eraseDups.length = gitHooks.length ∧ (afterHooks.all fun hook => gitHooks.contains hook) = true := by
  decide

end Config
