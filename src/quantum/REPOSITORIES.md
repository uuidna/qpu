# Repositories

The `repositories` tool. The quantumlib list is `REPOSITORIES` in [`repositories.ts`](processing/repositories.ts). The Payload matrix is `payloadcmsRepos` in the same file. The detailed specification is [`README.md`](README.md). The thousand-bit integer is [`CRYPTO.md`](CRYPTO.md).

Omit every argument and the call returns the fifteen quantumlib repositories, each with its name, description, and primary language, and beside them the Payload matrix. A `language` keeps the repositories whose primary language is that string.

| Language | Repositories |
|---|---|
| Python | Cirq, chromobius, Qualtran, OpenFermion, OpenFermion-PySCF, OpenFermion-FQE, OpenFermion-Psi4, OpenFermion-Cirq, ReCirq, TypedUnits, qchack-2021-challenge |
| C++ | Stim, tesseract-decoder, qsim |
| OpenQASM | unitary |

`repositories` with `organization: 'payloadcms'`, or with `payloadcms: true`, returns the three `github.com/payloadcms` repositories. The phase of that matrix is `payloadcms-repositories`. It holds, and its address is sealed.

| Repository | Licence | Language | Local path | Door |
|---|---|---|---|---|
| `payloadcms/website` | MIT | TypeScript | `src` | `payload { website: true }` |
| `payloadcms/payload` | MIT | TypeScript | `node_modules/payload` | `configure { kind: 'packages' }` |
| `payloadcms/skills` | MIT | Markdown | `skill(name)` | `payload { skills: true }` |

This repository is the full stack. Develop in `src/` against the `payloadcms/website` layout. Every `@payloadcms/*` package comes from `payloadcms/payload` (`TABLES.PAYLOAD_PACKAGES` → `https://github.com/payloadcms/payload/tree/main/packages`). MCP is `@payloadcms/plugin-mcp` mounted as `qpuMcpPlugin` at `/api/mcp`.

`payloadcms/payload` is a monorepo of 45 packages. This tree mounts 21 of them. Each mounted name is in `TABLES.PAYLOAD_PACKAGES`. The registry and `package.json` pin those packages at `4.0.0-beta.7`.

| Role | Count | Packages |
|---|---:|---|
| core | 3 | `payload`, `@payloadcms/next`, `@payloadcms/ui` |
| editor | 1 | `@payloadcms/richtext-lexical` |
| database | 3 | `@payloadcms/db-d1-sqlite`, `@payloadcms/db-mongodb`, `@payloadcms/db-postgres` |
| storage | 3 | `@payloadcms/storage-r2`, `@payloadcms/storage-gcs`, `@payloadcms/storage-vercel-blob` |
| email | 2 | `@payloadcms/email-nodemailer`, `@payloadcms/email-resend` |
| plugin | 9 | `@payloadcms/plugin-ecommerce`, `@payloadcms/plugin-mcp`, `@payloadcms/plugin-multi-tenant`, `@payloadcms/plugin-search`, `@payloadcms/plugin-import-export`, `@payloadcms/plugin-form-builder`, `@payloadcms/plugin-seo`, `@payloadcms/plugin-nested-docs`, `@payloadcms/plugin-redirects` |

The website template plugins in the count are form-builder, nested-docs, redirects, and seo. The matrix counts 9 QPU plugins and 512 combinations. Skills via `skill` / `skills` / `SKILL_MCP` formulated MCP calls.

`payloadcms/payload` also names the templates `templates/ecommerce` and `templates/website`. The workspace alignment records this package as `@uuidna/qpu` at `.`, the website surface as `src` (upstream `payloadcms/website`), and the sibling `../payload` as `uuidna-payload` on `github.com/uuidna/payload`.

The doors the matrix names are `/api/qpu/repos`, `/api/qpu/feeds?repos=1`, `/api/qpu/accounting`, `/api/qpu/google`, and `/api/mcp`.
