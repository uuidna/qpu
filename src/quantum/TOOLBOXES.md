# Toolboxes

Eleven toolboxes; `textbook_mcp_tools_by_toolbox` counts their tools. The list is `TOOLBOXES` in [`mcp.ts`](uuid/programs/3/8/5/9/0/2/0/f/index.ts). One program holds each of these toolboxes: [`billing`](uuid/programs/4/5/8/2/8/f/3/f/index.ts), [`crypto`](uuid/programs/d/7/4/9/a/6/e/6/index.ts), [`extension`](uuid/programs/8/f/4/e/9/3/3/b/index.ts), [`flow`](uuid/programs/f/e/c/2/1/d/9/b/index.ts), [`google`](uuid/programs/b/f/8/0/7/c/5/5/index.ts), [`language`](uuid/programs/d/1/4/f/5/d/a/c/index.ts), [`legal`](uuid/programs/1/4/e/7/5/1/4/a/index.ts), [`raid`](uuid/programs/9/a/1/5/3/0/4/2/index.ts), [`repository`](uuid/programs/f/1/d/1/3/a/e/6/index.ts), [`standards`](uuid/programs/0/d/3/d/2/8/0/1/index.ts). The detailed specification is [`README.md`](README.md). The repositories are [`REPOSITORIES.md`](REPOSITORIES.md).

`clone` with no toolbox returns the eleven names, the tool count of each, and a clone address. `clone` with a toolbox name returns that toolbox's toolset, skillset, and selftest. The quantum state of a computation is not copied. The document is the classical description. The theorem is `all_noclone`.

| Toolbox | Tools | What it answers |
|---|---:|---|
| `google` | 14 | The Willow processor, Cirq circuits, the echo, the roadmap, the algorithms, the software, the statements, the repositories, and the one Google door (the challenges, a Google call, Workspace). |
| `tree` | 10 | The leads, the audit, a matched statement, the Clay register, a verified UUID, the metrics, the textbooks, the stylesheet, the dashboard, and the clone. |
| `flow` | 6 | Discovery, the wave, readiness, imagination, the end-to-end gate, and a shard. The client fetches and writes. |
| `language` | 2 | Translation by vocabulary, both ways, and prose from a tool's result. Offline. |
| `raid` | 1 | MongoDB's query and update language over content-addressed docket entries. |
| `billing` | 2 | A Stripe licence per tenant, and the currency of a coin. |
| `legal` | 3 | The legal and security audit, a competition, and the patents. |
| `repository` | 1 | Workspaces, branches, tags, and releases compared with the remote. A disagreement is a lead. |
| `standards` | 3 | schema.org JSON-LD, the ISO code lists, and the standards in slices of 6. |
| `extension` | 1 | A foreign MCP read into doors of this catalogue, and this catalogue as a registration. |
| `crypto` | 3 | A fold into content-addressed pieces, a seal, and an attestation. |

The tools, in the order the toolbox holds them:

| Toolbox | Names |
|---|---|
| `google` | `processor`, `circuit`, `echo`, `echo_benchmark`, `roadmap`, `algorithm`, `software`, `statements`, `repositories`, `quantumlib`, `quantum-error-correction`, `chemistry-simulation`, `fault-tolerant-design`, `google` |
| `tree` | `leads`, `audit`, `match`, `clay`, `verify`, `metrics`, `textbook`, `css`, `dashboard`, `clone` |
| `flow` | `discover`, `wave`, `readiness`, `imagine`, `e2e`, `shard` |
| `language` | `translate`, `prose` |
| `raid` | `mongo` |
| `billing` | `stripe`, `currency` |
| `legal` | `legal`, `compete`, `patents` |
| `repository` | `repository` |
| `standards` | `jsonld`, `codes`, `validate` |
| `extension` | `extend` |
| `crypto` | `fold`, `seal`, `attest` |

`processor`, `circuit`, `echo`, `algorithm`, `quantum-error-correction`, and `chemistry-simulation` are specified in [`PROCESSORS.md`](PROCESSORS.md), [`ALGORITHMS.md`](ALGORITHMS.md), [`ECHO.md`](ECHO.md), [`QEC.md`](QEC.md), and [`CHEMISTRY.md`](CHEMISTRY.md). `clay` is [`CLAY.md`](CLAY.md). `verify` is [`WITNESSES.md`](WITNESSES.md). `validate` is [`STANDARDS.md`](STANDARDS.md). `repositories` is [`REPOSITORIES.md`](REPOSITORIES.md). `fold` and the thousand-bit check are [`CRYPTO.md`](CRYPTO.md).
