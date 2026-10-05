#!/usr/bin/env node
/**
 * THE FAMILIES WRITE THEIR OWN SKILL. Nothing here is typed: the skill is the registered families read back from the
 * unit, each formula named with its arity and the exact MCP call that answers it. A family added to src/families and
 * wired by the generator appears here the next run — the skill's content is a pure function of the registry, so it
 * cannot drift from what the MCP actually serves.
 *
 *   npm run skills            write .claude/skills/qpu-families/SKILL.md from the families
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { qpuHexFamiliesOf, qpuHexUuidOf, qpuCiteOf, qpuFoldOf } from '../dist/quantum/processing/unit/index.js'
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
