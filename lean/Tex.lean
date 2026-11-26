import Lean

/-! # Tex — the statement as TeX

Each statement is typeset from the text Lean prints for the type the kernel accepted: every sign becomes the command that
typesets it, a name of more than one letter is set upright, an exponent takes its whole term. Nothing is typed beside
the statement, so the formula a reader sees is the statement that was checked. The writers of the indexes read it here:
the theorem index gives every theorem its formula, and the prose index sets the formula beside every theorem a sentence
names, so no name is shown without what it states. -/

open Lean Meta

/-- The signs Lean prints, each with the command that typesets it. -/
def texSigns : List (Char × String) :=
  [('∀', "\\forall "), ('∃', "\\exists "), ('→', "\\to "), ('↔', "\\leftrightarrow "), ('∧', "\\land "),
   ('∨', "\\lor "), ('¬', "\\neg "), ('≤', "\\le "), ('≥', "\\ge "), ('≠', "\\ne "), ('∈', "\\in "),
   ('∉', "\\notin "), ('⊆', "\\subseteq "), ('∣', "\\mid "), ('≡', "\\equiv "), ('≃', "\\simeq "),
   ('↪', "\\hookrightarrow "), ('↑', "\\uparrow "), ('↥', "\\uparrow "), ('ℕ', "\\mathbb{N}"), ('ℤ', "\\mathbb{Z}"),
   ('ℚ', "\\mathbb{Q}"), ('ℝ', "\\mathbb{R}"), ('ℂ', "\\mathbb{C}"), ('α', "\\alpha "), ('β', "\\beta "), ('δ', "\\delta "),
   ('ζ', "\\zeta "), ('θ', "\\theta "), ('ι', "\\iota "), ('κ', "\\kappa "), ('σ', "\\sigma "), ('φ', "\\varphi "),
   ('Δ', "\\Delta "), ('∑', "\\sum "), ('∏', "\\prod "), ('×', "\\times "), ('⊕', "\\oplus "), ('⊗', "\\otimes "),
   ('⊤', "\\top "), ('⊥', "\\bot "), ('⊓', "\\sqcap "), ('∘', "\\circ "), ('⬝', "\\cdot "), ('•', "\\bullet "), ('‖', "\\| "), ('∩', "\\cap "),
   ('∪', "\\cup "), ('∅', "\\emptyset "), ('√', "\\surd "), ('⌈', "\\lceil "), ('⌉', "\\rceil "), ('ᶜ', "^{c}"),
   ('⁻', "^{-}"), ('¹', "^{1}"), ('ˣ', "^{\\times}"), ('*', "\\cdot "), ('%', "\\bmod "), ('{', "\\{"), ('}', "\\}"),
   ('_', "\\_"), ('#', "\\#"), ('&', "\\&"), ('$', "\\$"), ('~', "\\sim "), ('\\', "\\setminus ")]

/-- The command that typesets a sign Lean prints. -/
def texSign (c : Char) : Option String := (texSigns.find? (·.1 == c)).map (·.2)

/-- The subscript signs, each with the digit or letter it stands for. -/
def texSubs : List (Char × Char) := [('₀', '0'), ('₁', '1'), ('₂', '2'), ('ₜ', 't'), ('ᵥ', 'v'), ('ₗ', 'l')]

/-- The digit or letter a subscript sign stands for. -/
def texSub (c : Char) : Option Char := (texSubs.find? (·.1 == c)).map (·.2)

/-- A character of a name or a number. -/
def texWord (c : Char) : Bool := c.isAlphanum || c == '_' || c == '.' || c == '\''

/-- A name or a number: a number and a one-letter name as they are, a longer name upright. -/
def texName (word : List Char) : String :=
  let text := word.foldl (fun s c => s.push c) ""
  let stem := word.filter (· != '\'')
  if text == "fun" then "\\lambda "
  else if stem.all Char.isDigit || stem.length ≤ 1 then text
  else "\\mathrm{" ++ stem.foldl (fun s c => if c == '_' then s ++ "\\_" else s.push c) "" ++ "}" ++ (word.filter (· == '\'')).foldl (fun s c => s.push c) ""

/-- A term in parentheses, whole, and what follows it. -/
partial def texParen : List Char → Nat → List Char → List Char × List Char
  | [], _, taken => (taken.reverse, [])
  | c :: rest, depth, taken =>
    if c == '(' then texParen rest (depth + 1) (c :: taken)
    else if c == ')' then (if depth ≤ 1 then ((c :: taken).reverse, rest) else texParen rest (depth - 1) (c :: taken))
    else texParen rest depth (c :: taken)

/-- The statement's characters as TeX. -/
partial def texChars : List Char → String
  | [] => ""
  | '^' :: rest =>
    let rest := rest.dropWhile (· == ' ')
    match rest with
    | '(' :: _ => let (term, after) := texParen rest 0 []; "^{" ++ texChars term ++ "}" ++ texChars after
    | _ => "^{" ++ texChars (rest.takeWhile texWord) ++ "}" ++ texChars (rest.dropWhile texWord)
  | '=' :: '>' :: rest => "\\mapsto " ++ texChars rest
  | '=' :: '=' :: rest => "=" ++ texChars rest
  | '&' :: '&' :: rest => "\\land " ++ texChars rest
  | '|' :: '|' :: rest => "\\lor " ++ texChars rest
  | '!' :: rest => "\\neg " ++ texChars rest
  | c :: rest =>
    if texWord c then
      let after := (c :: rest).dropWhile texWord
      let apart := after.head? == some ' ' && ((after.dropWhile (· == ' ')).head?.map texWord).getD false
      texName ((c :: rest).takeWhile texWord) ++ (if apart then "\\ " else "") ++ texChars after
    else if (texSub c).isSome then
      "_{" ++ ((c :: rest).takeWhile (texSub · |>.isSome)).foldl (fun s d => s.push ((texSub d).getD d)) "" ++ "}" ++ texChars ((c :: rest).dropWhile (texSub · |>.isSome))
    else (texSign c).getD (String.singleton c) ++ texChars rest

/-- The statement as TeX, its runs of spaces made one. -/
def texOf (statement : String) : String :=
  let once (chars : List Char) : List Char := chars.foldr (fun c rest => if c == ' ' && rest.head? == some ' ' then rest else c :: rest) []
  (once (texChars (once statement.toList)).toList).foldl (fun s c => s.push c) ""

/-- The statement Lean prints for a theorem's type, on one line. -/
def statementOf (name : Name) : MetaM String := do
  return (toString (← ppExpr (← getConstInfo name).type)).replace "\n" " "

/-- The theorems a sentence names, each with its formula, in the order they are named and each once. The sentence is
left as it was written: what reads it by its words reads the same words, and what shows it shows the formulas with it. -/
def texNamed (formula : String → Option String) (text : String) : List (String × String) :=
  let word (c : Char) : Bool := c.isAlphanum || c == '_' || c == '.'
  ((text.toList.splitBy fun a b => word a == word b).filterMap fun run =>
    let trimmed := if run.getLast? == some '.' then run.dropLast else run
    let name := trimmed.foldl (fun s c => s.push c) ""
    (formula name).map fun tex => (name, tex)).eraseDups
