import Qpu.General.Config

/-! # Qpu.General.Meaning.Config
The configuration read as the library reads it: the tenants are a list, a first tenant before the rest. -/

/-- The list whose first element is `head`, where `tail` is the rest of the list.
Usually written `head :: tail`.


Conventions for notations in identifiers:

 * The recommended spelling of `::` in identifiers is `cons`.

 * The recommended spelling of `[a]` in identifiers is `singleton`.-/
theorem tenants_eq_cons : Config.tenants = List.cons (Config.tenants.headD default) Config.tenants.tail := rfl
