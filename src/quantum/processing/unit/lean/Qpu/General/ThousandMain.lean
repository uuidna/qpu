import Qpu.General.Thousand

/-! # Qpu.General.ThousandMain

`lake exe meaning <number> …`: the meaning of each number given, by `Thousand.meaning`. One line per number: the
number, then every family formula that reaches it with the size at which it does. -/

/-- Print the meaning of each number on the command line. -/
def main (args : List String) : IO UInt32 := do
  for arg in args do
    match arg.toNat? with
    | none => IO.eprintln s!"{arg}: not a natural number"
    | some n =>
      let found := Thousand.meaning n
      let said := ", ".intercalate (found.map fun (family, name, size) => s!"{family}.{name} {size}")
      IO.println s!"{n}: {if found.isEmpty then "no family formula reaches it" else said}"
  return 0
