# Toolboxes

Twelve toolboxes; `textbook_mcp_tools_by_toolbox` counts their tools. The list is `TOOLBOXES` in [`mcp.ts`](processing/mcp.ts). One module in [`toolboxes/`](processing/toolboxes) holds each toolbox after `google` and `tree`. The detailed specification is [`README.md`](README.md). The repositories are [`REPOSITORIES.md`](REPOSITORIES.md).

`clone` with no toolbox returns the twelve names, the tool count of each, and a clone address. `clone` with a toolbox name returns that toolbox's toolset, skillset, and selftest. The quantum state of a computation is not copied. The document is the classical description. The theorem is `all_noclone`.

| Toolbox | Tools | What it answers |
|---|---:|---|
| `google` | 13 | The Willow processor, Cirq circuits, the echo, the roadmap, the algorithms, the software, the statements, and the repositories. |
| `tree` | 10 | The leads, the audit, a matched statement, the Clay register, a verified UUID, the metrics, the textbooks, the stylesheet, the dashboard, and the clone. |
| `flow` | 6 | Discovery, the wave, readiness, imagination, the end-to-end gate, and a shard. The client fetches and writes. |
| `language` | 2 | Translation by vocabulary, both ways, and prose from a tool's result. Offline. |
| `raid` | 1 | MongoDB's query and update language over content-addressed docket entries. |
| `billing` | 2 | A Stripe licence per tenant, and the currency of a coin. |
| `legal` | 3 | The legal and security audit, a competition, and the patents. |
| `repository` | 1 | Workspaces, branches, tags, and releases compared with the remote. A disagreement is a lead. |
| `standards` | 3 | schema.org JSON-LD, the ISO code lists, and the standards in slices of 6. |
| `payload` | 2 | Payload's document shape, and the configure door. |
| `extension` | 1 | A foreign MCP read into doors of this catalogue, and this catalogue as a registration. |
| `crypto` | 3 | A fold into content-addressed pieces, a seal, and an attestation. |

The tools, in the order the toolbox holds them:

| Toolbox | Names |
|---|---|
| `google` | `processor`, `circuit`, `echo`, `echo_benchmark`, `roadmap`, `algorithm`, `software`, `statements`, `repositories`, `quantumlib`, `quantum-error-correction`, `chemistry-simulation`, `fault-tolerant-design` |
| `tree` | `leads`, `audit`, `match`, `clay`, `verify`, `metrics`, `textbook`, `css`, `dashboard`, `clone` |
| `flow` | `discover`, `wave`, `readiness`, `imagine`, `e2e`, `shard` |
| `language` | `translate`, `prose` |
| `raid` | `mongo` |
| `billing` | `stripe`, `currency` |
| `legal` | `legal`, `compete`, `patents` |
| `repository` | `repository` |
| `standards` | `jsonld`, `codes`, `validate` |
| `payload` | `payload`, `configure` |
| `extension` | `extend` |
| `crypto` | `fold`, `seal`, `attest` |

`processor`, `circuit`, `echo`, `algorithm`, `quantum-error-correction`, and `chemistry-simulation` are specified in [`PROCESSORS.md`](PROCESSORS.md), [`ALGORITHMS.md`](ALGORITHMS.md), [`ECHO.md`](ECHO.md), [`QEC.md`](QEC.md), and [`CHEMISTRY.md`](CHEMISTRY.md). `clay` is [`CLAY.md`](CLAY.md). `verify` is [`WITNESSES.md`](WITNESSES.md). `validate` is [`STANDARDS.md`](STANDARDS.md). `repositories` is [`REPOSITORIES.md`](REPOSITORIES.md). `fold` and the thousand-bit check are [`CRYPTO.md`](CRYPTO.md).
