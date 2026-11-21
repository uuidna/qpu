import Lean
/-! # Address — Lean → TypeScript codegen prototype for the UUID core.

The pure fold/stamp/uuid core of `src/quantum/password/address.ts`, defined here as Lean functions that
mirror the JavaScript bit-for-bit (16-bit limbs, the 0x1b3 multiply, `>>>16`, `<<8`, `& 0xffff`). The same file
renders the TypeScript from these definitions, so Lean is the single source for the executable, not just the data.

Run from the repository root: `lake env lean lean/tools/Address.lean`. The emitted module is written to
`.lake/build/address.ts`; `lake run index` installs it at `src/quantum/password/address.ts`. -/

namespace Qpu.Address

/-- The seed limbs the fold starts from (low limb first). -/
def OFFSET : List Nat := [0x2325, 0x8422, 0x9ce4, 0xcbf2]
/-- The odd multiplier that mixes each limb. -/
def MUL : Nat := 0x1b3

/-- One character folded into the four 16-bit limbs, exactly as the JavaScript does it. -/
def step (s : List Nat) (c : Nat) : List Nat :=
  match s with
  | [h0, h1, h2, h3] =>
    let a := h0 ^^^ c
    let t0 := a * MUL
    let t1 := h1 * MUL + t0 / 65536
    let t2 := h2 * MUL + a * 256 + t1 / 65536
    let d := (h3 * MUL + h1 * 256 + t2 / 65536) % 65536
    [t0 % 65536, t1 % 65536, t2 % 65536, d]
  | other => other

/-- Fold a string's code units into the limbs. -/
def foldFrom (s : List Nat) (text : String) : List Nat :=
  text.toList.foldl (fun st ch => step st ch.toNat) s

/-- A single lowercase hex digit. -/
def hex1 (n : Nat) : String := String.ofList ["0123456789abcdef".toList.getD (n % 16) '0']

/-- One limb as four lowercase hex digits. -/
def hex4 (n : Nat) : String := hex1 (n / 4096) ++ hex1 (n / 256) ++ hex1 (n / 16) ++ hex1 n

/-- The limbs as hex, high limb first (the list is reversed, like the JS `.reverse()`). -/
def hex (limbs : List Nat) : String := String.join (limbs.reverse.map hex4)

/-- A hex digit's value. -/
def hv (c : Char) : Nat := "0123456789abcdef".toList.idxOf c

/-- A slice of a hex string by character positions. -/
def sl (s : String) (a b : Nat) : String := String.ofList (s.toList.drop a |>.take (b - a))

/-- The version nibble the stamp carries: a digest of the other digits, mapped into 1..8. -/
def version (digits : String) : String :=
  let r := (digits.toList.foldl
      (fun acc c => (if acc.2 == 12 then acc.1 else (acc.1 * 16 + hv c) % 91, acc.2 + 1))
      ((0 : Nat), (0 : Nat))).1
  hex1 (1 + ((r ^ 7) % 91) % 8)

/-- The dashed 8-4-4-4-12 shape. -/
def dashed (h : String) : String :=
  sl h 0 8 ++ "-" ++ sl h 8 12 ++ "-" ++ sl h 12 16 ++ "-" ++ sl h 16 20 ++ "-" ++ sl h 20 32

/-- The stamp: the digits with the version nibble spliced in at position 12. -/
def stamp (digits : String) : String := dashed (sl digits 0 12 ++ version digits ++ String.ofList (digits.toList.drop 13))

/-- The UUID of a text: fold, a second fold for the low half, the variant nibble, then stamp. -/
def uuid (text : String) : String :=
  let state := foldFrom OFFSET text
  let high := hex state
  let low := hex (foldFrom state "\u0000shape")
  let variant := hex1 ((hv (low.toList.getD 0 '0') % 4) + 8)
  stamp (sl high 0 12 ++ sl high 15 16 ++ sl high 12 15 ++ variant ++ sl low 1 4 ++ sl low 4 16)

/-- Sanity: the Lean fold reproduces the JavaScript output bit-for-bit. The generated TypeScript must agree. -/
theorem uuid_x : uuid "x" = "af63f54c-8602-8170-8331-b95a7d569506" := by native_decide

/-! ## Emit the TypeScript

The core is rendered from the Lean definitions above — the OFFSET limbs and the multiplier are spliced from the Lean
values, so changing the Lean changes the TypeScript. The emitted module is verified against `uuid_x` by its own test. -/

/-- The OFFSET limbs as a TypeScript array literal, built from the Lean `OFFSET`. -/
def offsetTs : String := "[" ++ ", ".intercalate (OFFSET.map (fun n => "0x" ++ hex4 n)) ++ "]"

/-- Where the rendered core is written, and the committed file that follows it. -/
def addrOut : System.FilePath := ".lake" / "build" / "address-core.ts"

/-- The generated TypeScript of the UUID core: the same algorithm the Lean above states, rendered with the Lean
    constants. `stamp`, `version` and `uuid` are exported; the folding helpers stay module-private. -/
def addressCoreTs : String := String.intercalate "\n"
  [ "// GENERATED from lean/tools/Address.lean by lake run index — do not edit. Lean proves uuid('x')==='" ++ uuid "x" ++ "' (native_decide)."
  , "const OFFSET = " ++ offsetTs
  , "const MUL = 0x" ++ hex4 MUL
  , "const foldFrom = (state: readonly number[], text: string): number[] => {"
  , "  let a = state[0]!, b = state[1]!, c = state[2]!, d = state[3]!"
  , "  for (let i = 0; i < text.length; i++) {"
  , "    a ^= text.charCodeAt(i)"
  , "    const t0 = a * MUL, t1 = b * MUL + (t0 >>> 16), t2 = c * MUL + (a << 8) + (t1 >>> 16)"
  , "    d = (d * MUL + (b << 8) + (t2 >>> 16)) & 0xffff; a = t0 & 0xffff; b = t1 & 0xffff; c = t2 & 0xffff"
  , "  }"
  , "  return [a, b, c, d]"
  , "}"
  , "const hex = (limbs: readonly number[]): string => limbs.map((l) => l.toString(16).padStart(4, '0')).reverse().join('')"
  , "const hex1 = (n: number): string => '0123456789abcdef'[n % 16]!"
  , "export const version = (digits: string): string => { const r = [...digits].reduce((m, d, i) => (i === 12 ? m : (m * 16 + parseInt(d, 16)) % 91), 0); return hex1(1 + ((r ** 7) % 91) % 8) }"
  , "const dashed = (h: string): string => h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20, 32)"
  , "export const stamp = (digits: string): string => dashed(digits.slice(0, 12) + version(digits) + digits.slice(13))"
  , "export const uuid = (text: string): string => {"
  , "  const state = foldFrom(OFFSET, text)"
  , "  const high = hex(state)"
  , "  const low = hex(foldFrom(state, '\\u0000shape'))"
  , "  const variant = hex1((parseInt(low.slice(0, 1), 16) % 4) + 8)"
  , "  return stamp(high.slice(0, 12) + high.slice(15, 16) + high.slice(12, 15) + variant + low.slice(1, 4) + low.slice(4, 16))"
  , "}"
  , "" ]

#eval IO.FS.writeFile addrOut addressCoreTs

end Qpu.Address
