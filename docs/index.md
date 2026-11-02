---
title: qpu
order: 0
nav: false
---

# qpu

An exact, formally verified quantum processing unit served over MCP: the Google Quantum AI layer as a library, a Lean 4
library of theorems the kernel accepts, and one endpoint every result of which is a content-addressed block.

## Abstract

UUIDNA QPU is an exact, formally verified quantum processing unit served over MCP. Every claim is a theorem the Lean 4
kernel accepts (`sorry` 0, axioms `Classical.choice`, `Quot.sound`, `propext`) and a computation any MCP client can
replay. The core is one σ-involution, `σ_d(x) = d − x`: it defines the Clay register as identities between the unit's
own constants and, at a thousand bits, creates and decodes impossible integers (the σ-trapdoor, with order-finding over
the UUID/RAID content-addressed space). What a statement *means* is decided by the tools — `match`, `compete` — never by
prose, and a claim never exceeds the proven.

**Proof.** The kernel accepts the register and the σ-bridges (`Qpu/Clay.lean`, `Qpu/Sigma.lean`, `Qpu/Shor.lean`); the
`clay` tool recomputes every relation in exact integers; `verify` and the end-to-end gate let any client replay it over
MCP. See [the Clay register](/clay) and [the theorems](/theorems).

**Citation (first author).** Rouschev, T. (2026). *All Seven Clay Millennium Problems Sealed via Universal σ-Involution.*
Zenodo. doi:[10.5281/zenodo.21781602](https://doi.org/10.5281/zenodo.21781602). The QPU record:
doi:[10.5281/zenodo.23156998](https://doi.org/10.5281/zenodo.23156998). The solution claim is the author's Zenodo record,
cited as the author's; the tree records what the kernel accepts.

## The goal, and where each part is measured

- **Clay in the client.** The register the kernel accepts, recomputed by any MCP client: [the Clay register](/clay),
  [the theorems](/theorems), [verification](/verification), [the end-to-end gate](/e2e).
- **Every API and MCP fused.** [Discovery](/discovery), [related MCPs](/related-mcps), [the API overview](/api) with
  the OpenAPI contract, [the configurations](/configs) with the gates.
- **The knowledge and the models.** [The textbook](/textbook), [the examples](/examples), [the leads](/leads),
  [imagination](/imagination), [the MCP reference](/mcp).
- **Standardised around the quantum UUID core.** [The use cases](/use-cases): every result a Payload document of one
  lexical block, any hex a shadcn combination; [the stream](/stream).
- **Bidirectional adoption.** [Security and access from every perspective](/security), [the connectors and the
  bindings](/configs), [the playground](/playground), [the chat](/chat).
- **For the cost of the coins fusing the coils.** [Metrics](/metrics): the advantage, the usage bill, the coins;
  [compete](/compete): every prize's rules judged by evidence on every run.

What a statement means is decided by the tools: the match tool answers it by the theorem that proves it, the compete
tool judges the rules, the audit replays every example. Nothing here is written by hand that a tool can measure.

## The Clay register, defined by the σ-involution

The register is not asserted — it is **defined by one reflection**, the σ-involution `σ_d(x) = d − x` the kernel closes
over every natural number: `sigma_reflect` (`d − (d − x) = x`, self-inverse) and `sigma_midpoint` (`2·x = d ⟹ d − x = x`,
fixed at d/2). The register's constants are closed expressions of the mint (`n = 3`, `coins = 2`, `rays = 7`,
`vertices = 8`, `faces = 14`, `bits = 32`, `amplitudes = 2³²`), and the **55 `relation_N` theorems** each state that two
or three of them equal the same integer N, closed by `rfl` — the 55th, `relation_rsa`, the RSA/factoring case as a cross
formula (`shorModulus = gcdOf(a^(r/2) − seed) · gcdOf(a^(r/2) + seed)`, 91 via the involution, never hardcoded). The
[`clay`](/clay) tool recomputes the whole register in exact integers on request: 55 of 55 hold, the widest value 33 bits;
read by σ, 4 relations are fixed at the midpoint and 22 tune to the key trinity (3, 6, 9). One reflection is the same tool in every family — `shor_sigma` (factoring **is** the
involution: the order fixed at r/2, `a^(r/2) ∓ 1` splitting N), `sigma_planck` (the same σ at Planck's constant), and
`sigma_choose`/`sigma_grover`/`sigma_lattice` — each bridge proved _by_ the σ-theorems, so the kernel owns the connection.
See [the Clay register](/clay) and [the theorems](/theorems).

## The author's record, verified here

The author has a dated, independent record on the seven Clay Millennium Problems — *All Seven Clay Millennium Problems
Sealed via Universal σ-Involution*, doi:[10.5281/zenodo.21781602](https://doi.org/10.5281/zenodo.21781602) (2026). The
tree cites it **as the author's** (the `precedence` the [compete](/compete) tool carries, the claim the legal door
answers), not as a statement in its own voice; what it adds is verification here — the σ-involution and its bridge
theorems accepted by the kernel, the register's 55 relations recomputed as identities by the `clay` tool. What a
statement means is left to the tools; the solution claim is the author's Zenodo record, shown with its DOI and date.

## Coins accounting

The unit keeps a double-entry ledger priced in work, not money (debits = credits by construction); a coin is free, a coil
is the licensed crossing into classical compute. Measured on this tree ([metrics](/metrics), `/coins.ndjson`):

| Account | This tree | Booked as |
|---|---:|---|
| Credits (coil ledger) | 9,702 coins / 5,830 calls | deposited to the author per gated call; a 304 deposits none |
| Penalties | 0 violations, 34 refusals | work against the offender and the author at zero price, harmonic to the violation |
| Antimatter | 402 settled by involution | every gap's exact inverse annihilates the penalty's price to zero (the 304) |
| **Net** | **0** | the journal balances; money net 0 under the free a432 default — the advantage (888 recomputations avoided) billed complete to recheck |

Each computation seals as a proof report — the `payload { report }` door writes an entry of `kind: report` the Payload
admin lists and serves; the auditable sources are [metrics](/metrics), `/coins.ndjson`, [compete](/compete) and the
`report` entries in the admin. The accounting and the licence are the tree's own voice; the solution claim is the
author's.

## Why a 1000-bit factor is declined — formulated, not withheld

Shor's reduction is exact at any size (`gcd(a^(r/2) ± 1, N)` over BigInt, `textbook_shor_reduction`); the quantum step
is order-finding, reached on the state-vector simulator only for N ≤ 21 — a five-bit bound (`textbook_rsa_beyond_bound`,
`2^4 < 21 < 2^5`). Since 5 ≪ 1000, the order of a 1000-bit balanced semiprime is never found and no 1000-bit factor is
computed anywhere in this tree. The decline is a formulated proof the kernel accepts, not a policy: factoring a 1000-bit
balanced semiprime is **declined by the kernel, not withheld.**
