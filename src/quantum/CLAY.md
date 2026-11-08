# Clay register

The `clay` tool. The arithmetic is [`clay-register.ts`](processing/clay-register.ts). The 55 statements are [`clay-statements.ts`](processing/clay-statements.ts), each the Lean theorem the kernel accepted by `rfl`. The detailed specification is [`README.md`](README.md). The echo is [`ECHO.md`](ECHO.md).

The relations are identities between the unit's own constants. A call recomputes them. It is not a proof of an open problem.

Every intermediate value is a natural number no larger than `Number.MAX_SAFE_INTEGER`. Division is floor division. Subtraction stops at 0. `mint k` is 2^k. `choose` is Pascal's rule.

| Axiom | Formula | Value |
|---|---|---:|
| `n` | the length of `quantum`, `processing`, `unit` | 3 |
| `seed` | `mint (n − n)` | 1 |
| `coins` | `seed + seed` | 2 |
| `rays` | `n + coins + coins` | 7 |
| `vertices` | `mint n` | 8 |
| `hexbit` | `mint coins` | 4 |
| `bits` | `mint (n + coins)` | 32 |
| `faces` | `vertices + hexbit + coins` | 14 |
| `amplitudes` | `mint bits` | 4,294,967,296 |
| `plane` | `coins × coins × rays` | 28 |
| `coil` | `coins × rays` | 14 |
| `shorBase` | `mint n` | 8 |
| `shorModulus` | `rays × (faces − seed)` | 91 |

Omit every argument and all 55 relations are recomputed. Each statement is split on `∧` and then on `=`. A relation holds when every equation has equal values. The bit width is the bits of the largest value, at least 1. The call returns `total` 55, `holding` 55, `maxBits` 33, and `maxLimbs16` 3. The ledger is one line per relation, `name=value`.

Pass `name` and the call returns that one relation inside the same totals. `relation_7` is `relation_rsa`. A name that is not in the register is refused, and the refusal lists the names. `relation_36` is `triangular vertices = qftGates vertices` and `totient 74`. Its value is 36, φ(74), the cyclotomic degree the thousand-bit integer uses. `relation_28` is the case `pascal-rule-28` of the product `textbook_pascal_rule`.

`lean: true` verifies by UUID. The address is the UUID of the relation's integer. The receipt is the UUID of its Lean statement, bound by the SHA-256 of that statement. The handle and the tail stay. Nothing is written.

`technique: 'reflection'` reads each value by its digital root. The reflection of a seed is `10 − seed`, and 0 reflects to 0. A seed divisible by 3 is the trinity 3, 6, 9. Seeds 7, 4, and 1 are one trinity. The rest are 2, 5, and 8. Pairs are relations whose seeds sum to 10, except seed 5, which is fixed. A value with no public integer sequence is an open lead. Pass `unit` and each `{ value, answer }` is compared with the tree's reading. The tree uses the digital root. The unit uses the last decimal digit. A side that leaves its own convention is a lead.

`catalog`, `combinations`, `chess`, `solve`, and `readme` are further readings of the same 55 relations. `chess` takes a NIST pulse and a CERN record the caller already read. Nothing is fetched.
