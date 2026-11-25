import Qpu.General.Config

/-! # Qpu.General.Meaning.Config
The configuration read as the library reads it: the tenants are a list, a first tenant before the rest. -/

/-- The list whose first element is `head`, where `tail` is the rest of the list.
Usually written `head :: tail`.


Conventions for notations in identifiers:

 * The recommended spelling of `::` in identifiers is `cons`.

 * The recommended spelling of `[a]` in identifiers is `singleton`.-/
theorem tenants_eq_cons : Config.tenants = List.cons (Config.tenants.headD default) Config.tenants.tail := rfl

/-- The list whose first element is `head`, where `tail` is the rest of the list.
Usually written `head :: tail`.


Conventions for notations in identifiers:

 * The recommended spelling of `::` in identifiers is `cons`.

 * The recommended spelling of `[a]` in identifiers is `singleton`.-/
theorem agentEvents_eq_cons : Config.agentEvents = List.cons (Config.agentEvents.headD default) Config.agentEvents.tail := rfl

/-- The list whose first element is `head`, where `tail` is the rest of the list.
Usually written `head :: tail`.


Conventions for notations in identifiers:

 * The recommended spelling of `::` in identifiers is `cons`.

 * The recommended spelling of `[a]` in identifiers is `singleton`.-/
theorem agentWriteTools_eq_cons : Config.agentWriteTools = List.cons (Config.agentWriteTools.headD default) Config.agentWriteTools.tail := rfl

/-- The list whose first element is `head`, where `tail` is the rest of the list.
Usually written `head :: tail`.


Conventions for notations in identifiers:

 * The recommended spelling of `::` in identifiers is `cons`.

 * The recommended spelling of `[a]` in identifiers is `singleton`.-/
theorem agentSpawnTools_eq_cons : Config.agentSpawnTools = List.cons (Config.agentSpawnTools.headD default) Config.agentSpawnTools.tail := rfl

/-- The list whose first element is `head`, where `tail` is the rest of the list.
Usually written `head :: tail`.


Conventions for notations in identifiers:

 * The recommended spelling of `::` in identifiers is `cons`.

 * The recommended spelling of `[a]` in identifiers is `singleton`.-/
theorem agentConfirmRules_eq_cons : Config.agentConfirmRules = List.cons (Config.agentConfirmRules.headD default) Config.agentConfirmRules.tail := rfl
