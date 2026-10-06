#!/usr/bin/env node
/**
 * THE FAMILIES WRITE THEIR OWN SKILL. Nothing here is typed: the skill is the registered families read back from the
 * unit, each formula named with its arity and the exact MCP call that answers it. A family added to src/families and
 * wired by the generator appears here the next run — the skill's content is a pure function of the registry, so it
 * cannot drift from what the MCP actually serves.
 *
 *   npm run skills            write .claude/skills/qpu-families/SKILL.md and .claude/skills/payload-cloudflare/SKILL.md
 *
 * Both skills are a pure function of the code: the family skill reads the registry; the payload-cloudflare skill reads
 * the deployment axes and asks the `combinatorics` family for the API combination count. Nothing is hardcoded — no list
 * of plugins, no combination number — so neither skill can drift from what the templates and the families actually serve.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { qpuHexFamiliesOf, qpuHexUuidOf, qpuCiteOf, qpuFoldOf, qpuHexRunOf } from '../dist/quantum/processing/unit/index.js'
import { CLOUDFLARE_RUNTIMES, CLOUDFLARE_DATABASES, CLOUDFLARE_STORAGE, CLOUDFLARE_EMAIL, CLOUDFLARE_PLUGINS, cloudflareCombinations, cloudflareKeyOf } from '../dist/deployment/payload-templates.js'
import { mintOf } from './lattice-values.mjs'
// every family registers on import of the generated registry — the one import that is the whole surface
await import('../dist/mcp/families.js')

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const site = (qpuCiteOf()).website

// the families as the registry holds them: name → formulas, each with its nibble (1-based hex), name and arity
const families = [...qpuHexFamiliesOf()]
  .map(([name, formulas]) => ({
    name,
    handle: qpuFoldOf(name).slice(0, mintOf(3)), // the 8-hex handle: the compact address a call routes by (token-free)
    formulas: formulas.map((f, i) => ({ nibble: (i + 1).toString(mintOf(4)), name: f.name, arity: f.arity })),
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

const totalFormulas = families.reduce((n, f) => n + f.formulas.length, 0)
// a real address for the first formula of the first family, so the skill shows a true UUID the reader can call back —
// computed from the SAME params the example shows, so the call and the address it quotes agree
const sample = families[0]?.formulas[0]
const sampleParams = Array.from({ length: sample?.arity ?? 0 }, (_, i) => i + 1)
const sampleUuid = sample ? qpuHexUuidOf({ family: families[0].name, program: [sample.name], params: sampleParams }) : ''

const paramsHint = (arity) => (arity === 0 ? "'[]'" : `'[${Array.from({ length: arity }, (_, i) => i + 1).join(', ')}]'`)

const description = `Call any of the ${families.length} QPU formula families (${totalFormulas} exact-integer formulas) through the MCP by its 8-hex HANDLE — each formula is a hex-program UUID (handle + nibble + params) that recomputes to the same value, so a call is a compact address, idempotent and verifiable, at no token cost. Use when computing or verifying with the QPU over MCP. The handle table is below; call \`npm run mcp -- <family>.<formula> '[params]'\`.`

const body = `---
name: qpu-families
description: ${description}
---

# QPU families over MCP

Every family is a set of exact-integer formulas. Each is addressed by an RFC 9562 v8 hex-program UUID — \`{ family, program: [formula], params }\` — and the same arguments recompute to the same value (the determinism law), so every call is idempotent and carries a receipt. Families cross to \`cross\`; \`gate.crossed\` confirms a formula when its value is reached across domains (an OEIS sequence, a live API, or the rosetta). This file is generated from the registry by \`scripts/generate-skills.mjs\`; it is never hand-written, so it is exactly what ${site} serves.

## Call a formula

\`\`\`bash
npm run mcp -- <family>.<formula> '[params]'            # the live host, ${site}
npm run mcp -- --local <family>.<formula> '[params]'    # the same call in-process over dist
\`\`\`

Params are a JSON array (\`'[]'\` for none). The call routes through \`hex\` to the address \`qpuHexUuidOf({ family, program: [formula], params })\` and returns the value, the sealed UUID, and a receipt. For example \`npm run mcp -- ${families[0]?.name}.${sample?.name} ${paramsHint(sample?.arity ?? 0)}\` answers at \`${sampleUuid}\`.

Ask a family anything else through its door — \`npm run mcp -- '{ "door": "gate.crossed", "i": 0 }'\` names the next lead; \`npm run mcp -- '{ "doors": true }'\` lists every door beyond the sixteen sealed tools.

## The ${families.length} families (${totalFormulas} tools)

| family | handle | formulas |
|---|---|---|
${families.map((f) => `| \`${f.name}\` | \`${f.handle}\` | ${f.formulas.map((x) => `\`${x.name}\`/${x.arity}`).join(', ')} |`).join('\n')}

Each row is a family at its 8-hex \`handle\` — the compact address a call routes by (handle + the formula's nibble + params = the hex-program UUID), so the LLM addresses by handle at no token cost. Each \`name\`/\`arity\` is one tool: a formula of that many parameters, callable as \`npm run mcp -- ${'<family>'}.<name> '[…]'\`. Every value is an exact integer a Lean kernel can check — no estimate, no coverage percentage, no wall clock.
`

const dir = path.join(ROOT, '.claude', 'skills', 'qpu-families')
fs.mkdirSync(dir, { recursive: true })
fs.writeFileSync(path.join(dir, 'SKILL.md'), body)
console.log(`wrote .claude/skills/qpu-families/SKILL.md — ${families.length} families, ${totalFormulas} formulas, from the registry`)

// ── payload-cloudflare skill: every value derived, nothing hardcoded ──────────────────────────────────────────────
// The API combination count is COMPUTED BY THE FAMILY, not typed: the combinatorics family's power-set formula
// binomial(n) = 2ⁿ gives the plugin subsets, multiplied by the axis cardinalities. The result is checked against the
// enumerator so the number in the skill can never drift from what cloudflareCombinations() actually yields.
const axes = { runtime: CLOUDFLARE_RUNTIMES, db: CLOUDFLARE_DATABASES, storage: CLOUDFLARE_STORAGE, email: CLOUDFLARE_EMAIL }
const binomialUuid = qpuHexUuidOf({ family: 'combinatorics', program: ['binomial'], params: [CLOUDFLARE_PLUGINS.length] })
const binomial = await qpuHexRunOf(binomialUuid)
const pluginSubsets = binomial.value // 2^|plugins|, with receipt binomial.receipt
const axisProduct = Object.values(axes).reduce((p, a) => p * a.length, 1)
const total = axisProduct * pluginSubsets
let enumerated = 0
for (const _ of cloudflareCombinations()) enumerated++
if (!(binomial.holds === true) || total !== enumerated)
  throw new Error(`payload-cloudflare combinatorics drift: family ${axisProduct}·2^${CLOUDFLARE_PLUGINS.length}=${total} ≠ enumerated ${enumerated} (holds ${binomial.holds})`)
// a representative combination key, built from the axes and run through cloudflareKeyOf — not typed
const sampleDb = CLOUDFLARE_DATABASES.find((d) => d.startsWith('qpu')) ?? CLOUDFLARE_DATABASES[0]
const samplePlugins = ['mcp', 'seo'].filter((p) => CLOUDFLARE_PLUGINS.includes(p))
const sampleKey = cloudflareKeyOf({ runtime: CLOUDFLARE_RUNTIMES[0], db: sampleDb, storage: CLOUDFLARE_STORAGE.includes('r2') ? 'r2' : CLOUDFLARE_STORAGE[0], email: CLOUDFLARE_EMAIL.includes('resend') ? 'resend' : CLOUDFLARE_EMAIL[0], plugins: samplePlugins })
const axisNote = {
  runtime: "vinext is Cloudflare's recommended Next.js path (bindings from `cloudflare:workers`); OpenNext reads them with `getCloudflareContext`",
  db: '`postgres` connects through a Hyperdrive binding. MongoDB has no Workers path: a MongoDB request is `qpu-raid` or `qpu-d1` — the QPU document database with MongoDB query/update semantics, Payload adapter `@uuidna/qpu/payload`',
  storage: 'Payload 4 takes storage adapters in `storage: [...]`, not `plugins`',
  email: 'Resend over HTTP, or none',
}
const payloadDesc = `Configure Next.js + Payload CMS on Cloudflare Workers in any combination — runtime (${CLOUDFLARE_RUNTIMES.join(', ')}), database (${CLOUDFLARE_DATABASES.join(', ')} — the QPU document database with MongoDB semantics on KV+R2 RAID or on D1), upload storage (${CLOUDFLARE_STORAGE.join(', ')}), email (${CLOUDFLARE_EMAIL.join(', ')}) and any subset of the ${CLOUDFLARE_PLUGINS.length} Payload plugins. Use when asked to set up, generate, compare, migrate or verify a Payload/Next.js deployment on Cloudflare, or when MongoDB is wanted on Workers.`
const payloadBody = `---
name: payload-cloudflare
description: ${payloadDesc}
---

# Payload on Cloudflare, every combination

This file is generated by \`scripts/generate-skills.mjs\` from the deployment axes and the \`combinatorics\` family — no plugin list or combination count is typed by hand, so it cannot drift. All configuration goes through the payload template system (\`src/deployment/payload-templates.ts\`): \`PayloadTemplates.cloudflarePayload(combination)\` and \`cloudflareCombinations()\`. Never hand-write a config outside it.

## Axes
| axis | values | notes |
|---|---|---|
| runtime | ${CLOUDFLARE_RUNTIMES.map((x) => `\`${x}\``).join(', ')} | ${axisNote.runtime} |
| db | ${CLOUDFLARE_DATABASES.map((x) => `\`${x}\``).join(', ')} | ${axisNote.db} |
| storage | ${CLOUDFLARE_STORAGE.map((x) => `\`${x}\``).join(', ')} | ${axisNote.storage} |
| email | ${CLOUDFLARE_EMAIL.map((x) => `\`${x}\``).join(', ')} | ${axisNote.email} |
| plugins | any subset of ${CLOUDFLARE_PLUGINS.map((x) => `\`${x}\``).join(', ')} | ecommerce needs \`products: true\`; multi-tenant adds a \`tenants\` collection |

A combination's key is \`runtime/db/storage/email/plugins\` with plugins sorted and joined by \`+\` (\`-\` for none), e.g. \`${sampleKey}\`.

## The API combinatorics (computed by the family, not counted by hand)
The combination space is \`|runtime|·|db|·|storage|·|email|·2^|plugins|\` = \`${axes.runtime.length}·${axes.db.length}·${axes.storage.length}·${axes.email.length}·2^${CLOUDFLARE_PLUGINS.length}\` = **${total.toLocaleString('en-US')}**. The power-set term \`2^${CLOUDFLARE_PLUGINS.length}\` = ${pluginSubsets.toLocaleString('en-US')} is the \`combinatorics\` family's \`binomial\` formula, so the count re-derives on every change to the plugin list:
\`\`\`bash
npm run mcp -- combinatorics.binomial '[${CLOUDFLARE_PLUGINS.length}]'   # ${pluginSubsets} plugin subsets, at ${binomialUuid}
\`\`\`
\`npm run payload:cf\` enumerates all ${total.toLocaleString('en-US')} with a content UUID and a quantum receipt (stream \`payload-cf\`) and checks this count equals the family's.

## Generate one
\`\`\`bash
npm run build && node scripts/payload-cloudflare.mjs --emit ${sampleKey} --out ./my-site
\`\`\`
Writes \`payload.config.ts\`, \`wrangler.jsonc\` (bindings as the combination needs) and \`dependencies.txt\`. Secrets go in Wrangler secrets / \`.dev.vars\`: PAYLOAD_SECRET, plus RESEND_API_KEY, STRIPE_SECRET_KEY, S3_*, SENTRY_DSN when chosen.

## An app's own content
Pass a \`CloudflareApp\` as the third argument to \`cloudflarePayload(c, name, app)\`: \`collections\` (\`{ name, from, slug }\`, replacing the template's Users and Pages), \`adminUser\`, \`targets\` per plugin (collection slugs it attaches to), \`dashboard\`, \`origins\` (CORS and CSRF), \`typescriptOutput\`, \`title\`. This repo's own configs are generated that way: \`npm run payload:cf -- --repo\`. Edit the \`REPO\` table in \`scripts/payload-cloudflare.mjs\`, never the generated files.

## Verify all of them
\`\`\`bash
npm run payload:cf
\`\`\`
Enumerates every combination with a content UUID and a quantum receipt (stream \`payload-cf\`), and type-checks every base with no plugins and with all plugins against the installed packages in one tsc program; writes \`payload-cf-receipt.json\`. A base that compiles with none and all compiles with every subset (plugins are independent \`Plugin\` calls). Before trusting a pass, break one generated config on purpose and confirm the check fails.

## Limits to state
QPU database: a collection scan reads at most 4 pages × 1000 keys per request on KV+R2; KV is eventually consistent (prefer \`qpu-d1\` when read-after-write matters); no transactions; localized-field queries and geo operators are not supported.
`
const payloadDir = path.join(ROOT, '.claude', 'skills', 'payload-cloudflare')
fs.mkdirSync(payloadDir, { recursive: true })
fs.writeFileSync(path.join(payloadDir, 'SKILL.md'), payloadBody)
console.log(`wrote .claude/skills/payload-cloudflare/SKILL.md — ${CLOUDFLARE_PLUGINS.length} plugins, ${total} combinations (2^${CLOUDFLARE_PLUGINS.length} by combinatorics.binomial), derived`)
