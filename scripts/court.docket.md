# Court docket — the whole repo

Session: `node --test scripts/court.test.mjs` · token-free (reads the registry and the files, runs no formula) · 453 ms

**Verdict: the gate holds.** Every unresolved item has a forum and a remedy — none is left outside the court. Nothing is removed (`law.removable`: a referenced item is *remanded*, not dropped).

## Charges: 6 — all to forum `law`

| # | Defendant (file) | Charge | Remedy |
|---|---|---|---|
| 1 | `src/mcp/python-client.py` | residual `qpu_` token | host/holding peer clears it — remanded while referenced |
| 2 | `src/mcp/secure-chat-rbac.ts` | residual `qpu_` token | remanded while referenced |
| 3 | `src/quantum/kernel/index.ts` | residual `qpu_` token | remanded while referenced |
| 4 | `scripts/develop.mjs` | residual `qpu_` token | remanded while referenced |
| 5 | `scripts/e2e.test.mjs` | residual `qpu_` token | remanded while referenced |
| 6 | `scripts/walls.test.mjs` | residual `qpu_` token | remanded while referenced |

All six are the public MCP tool names (`qpu_phase1`, `qpu_ghz_state`, `qpu_discrete_log`, …) — they are *referenced*, so the court remands them, it does not clear them. That is the point: the court routes, it never removes a lead.

## What the court found clean (zero charges)

- **Over-cap families** (forum `court`): 0 — no family exceeds the 15-formula nibble.
- **Handle collisions** (forum `court`): 0 — every family's first-formula fold is unique.
- **Off-path files** (forum `gravity`): 0 — nothing sits off its meaningful path.
- **Bad names** (forum `law`): 0 — every family is one lowercase word.

## On the consolidation / redundancy question

The redundancy you asked about is not left to my judgment — the court heard the whole repo and docketed nothing for removal. No near-duplicate family was charged; no family is over-cap; no handle collides. The verify-merge redundancy (the `a11y`/`vo2max` digit-name duplicates) was already removed earlier, and 1150 family directories == 1150 registry imports with no drift. The court's standing rule holds: **leads before removal — it routes, it never deletes.**

## Resolution: the residual `qpu_` tokens are gone from the repo

The six charges above are kept as filed. This entry records what the repository shows now, for the court to confirm.

| # | Defendant | Now | Basis |
|---|---|---|---|
| 1 | `src/mcp/python-client.py` | no `qpu_` token | `f0a967b6` renamed the five tool calls |
| 2 | `src/mcp/secure-chat-rbac.ts` | no `qpu_` token | `f0a967b6` renamed the seven tool names |
| 3 | `src/quantum/kernel/index.ts` | no `qpu_` token in HEAD | `bca8dedc` renamed the ten tools; the working copy keeps an uncommitted surface-code edit that is not the court's concern here |
| 4 | `scripts/develop.mjs` | file is now `scripts/develop.ts`, no `qpu_` token | converted to TypeScript earlier |
| 5 | `scripts/e2e.test.mjs` | file is now `scripts/e2e.test.ts`, no `qpu_` token | converted to TypeScript earlier |
| 6 | `scripts/walls.test.mjs` | file is now `scripts/walls.test.ts`; fixture name renamed | `d86cdadf` |

The detectors that search for the prefix (`scripts/audit.test.ts`, `scripts/court.test.ts`, `scripts/queue.test.ts`, `scripts/use-surface.mts`, `scripts/wave-sweep-grid.mts`) check for it and do not carry it.
