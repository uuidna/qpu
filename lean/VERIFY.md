# Qpu.Verify - zero-dependency kernel-decided bridge for Cirq/Qualtran

Companion proof suite to the erpax Cirq/Qualtran RFC. Every module lives under
`Qpu/Processing/Verify/` and proves its claims with the Lean kernel alone (`by decide` or
exhaustive `cases`) and imports no package; the project pins `leanprover/lean4:v4.33.0`.
Mathlib (`v4.33.0`) is the project's one dependency, imported only by `Qpu/General/Meaning.lean`,
which proves the tree's own definitions equal to the Mathlib notions they are.

## Modules

| Module | Scope |
|---|---|
| `Qpu/Processing/Verify/Gate.lean` | Scaled Gaussian-integer gate matrices; unitarity, H·Z·H = X, CNOT/SWAP involutions |
| `Qpu/Processing/Verify/Stabilizer.lean` | H / S / CNOT Pauli conjugation on symplectic bits, sign-correct |
| `Qpu/Processing/Verify/Entangle.lean` | CHSH and GHZ/Mermin finite game bounds; classical ceilings by exhaustive decision, quantum 4/4 tables |
| `Qpu/Processing/Verify/Correct.lean` | Repetition + nested Shor majority decoding; Steane [[7,1,3]] syndrome decode with failure controls |
| `Qpu/Processing/Verify/Cost.lean` | NIST PQC-ladder margin arithmetic (see scope note below) |
| `Qpu/Processing/Verify/Receipt.lean` | Break-even economics of content-addressed caching (~30x reference bundle, self-reported) |
| `Qpu/Processing/Verify/Hexbit.lean` | Nibble/hex round-trips, 32-bit routing prefixes |
| `Qpu/Processing/Verify/Uuid.lean` | 128-bit handle banding: 6 fixed + 122 free = 16 program + 106 message |

## Method

Every true theorem is paired with a false-statement control, so a broken
proof checker cannot pass the suite silently.

## Build

From the repo root:

```
lake build
```

The library root `Qpu.lean` imports every `Qpu/Processing/Verify/*` module, so a plain
`lake build` kernel-checks the whole corpus. CI does the same via
`.github/workflows/lean-verify.yml` on every push and pull request.

## Exporter PoC

`tools/cirq_to_lean.ts` converts a stabilizer circuit JSON into a generated
Lean module of `decide` theorems (one per conjugation step) plus the final
tableau. See its header for the input format and sign-tracking limitation.

## Scope honesty

- `decide` verifies finite instances only: small circuits, small syndrome
  tables. This is CI pre-flight certification, not symbolic verification
  at Stim scale.
- `Cost.lean` records NIST's stated security-strength ratings (IR 8547
  ipd Table 7: SHA-256 preimage 256-bit, collision 128-bit) and proves only
  the arithmetic built on them. No theorem here proves SHA-256 hard.
- The ~30x / 45.9s vs 1.5s figures in `Receipt.lean` are self-reported on
  the erpax reference bundle; re-measure before quoting.
