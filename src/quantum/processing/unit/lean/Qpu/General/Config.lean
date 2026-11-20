import Qpu.General.Textbook
import Qpu.General.Lattice

/-! # Qpu.General.Config

The configuration the connector reads, held by Lean.

Each value the connector was configured with by hand is stated here once. A value that follows from a rule is derived
from the rule and proved equal to what was typed before: the primes a hexadecimal digit can hold are computed, not
listed. A value that names a theorem is written as a name the compiler resolves, so the connector cannot be
configured with a theorem the kernel lacks. `tools/Config.lean` writes these values for the code to read. -/

namespace Config

/-- Whether a number is prime: at least two, and divided by nothing between two and itself. -/
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

/-- The workflows the repository tool serves: the points at which the tree checks itself. -/
def workflows : List String := ["pre-commit", "commit-msg", "pre-push", "post-commit", "prepare-commit-msg", "ci", "pre-deploy"]

/-- The workflows git itself starts, each from the hook of the same name. The others are started by CI and by the deploy. -/
def gitHooks : List String := ["pre-commit", "commit-msg", "pre-push", "post-commit", "prepare-commit-msg"]

/-- Every git hook is a workflow, and every workflow that is not a git hook is one CI or the deploy starts. -/
theorem git_hooks_are_workflows :
    (gitHooks.all fun hook => workflows.contains hook) = true ∧ (workflows.filter fun w => !gitHooks.contains w) = ["ci", "pre-deploy"] := by
  decide

end Config
