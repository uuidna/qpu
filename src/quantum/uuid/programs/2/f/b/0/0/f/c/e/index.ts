// Former scripts/* work owned by Payload: pure doors that answer the file bodies and the invoke map. The thin clients under
// scripts/ only call these (or another MCP tool) and write what they return — no parallel logic world outside the CMS.
// Fused on the payload tool as payload { scripts: … }; never a new tools/list door (connect bill stays the existing catalogue).

import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { VERSION } from '../../../../../../../../c/0/7/0/9/8/4/3/index.ts'
import { LICENSE } from '../../../../../../../../a/f/3/d/e/a/5/f/index.ts'
import { RELEASE_REPOSITORY } from '../../../../../../../../6/6/5/9/1/f/5/8/index.ts'
import { WEBSITE_CLIENT, WEBSITE_ORIGIN } from '../../../../../../../../4/a/1/6/6/9/b/c/index.ts'
import QPU_PACKAGE from '../../../../../../../../../../package.json' with { type: 'json' }
type ClayRelation = { name: string; statement: string; families: string[] }
import { TEXTBOOK_THEOREMS } from '../../../../../../../../3/4/7/e/0/c/e/0/index.ts'
import { QUANTUM_TERMS, quantumVocabulary } from '../../../../../../../../d/f/0/d/9/1/3/b/index.ts'
import { canonicalText, seal, uuid, uuidQubits } from '../../../../../../../7/1/a/7/6/4/9/index.ts'
import { catalogDoc } from '../../../../../../../../3/2/7/5/4/2/0/1/index.ts'
import { merkleTree } from '../../../../../../../../e/1/9/1/6/4/9/c/index.ts'
import { hexagonHandle } from '../../../../../../../../d/7/8/3/e/4/6/3/index.ts'
import { crossWitnesses, leanAlgebraSeed } from '../../../../../../../../3/1/0/2/7/5/b/a/index.ts'
import { utilisationOf } from '../../../../../../../../0/8/7/0/6/d/2/8/index.ts'
import { TOOLBOXES } from '../../../../../../../../3/8/5/9/0/2/0/f/index.ts'
import { AUTHOR_CLAIMS, GENERATED_LEMMAS, KERNEL_THEOREMS, NOVELTIES, THEOREMS } from '../../../../../../../../3/f/0/e/7/a/6/f/index.ts'
import { receiptOf } from '../../../../../../../../index.ts'
import { listFactors } from '../../../../../../../../b/1/c/2/3/6/2/1/index.ts'
import { LEAD_ROWS } from '../../../../../../../../f/3/5/3/8/2/1/2/index.ts'
import { gateProseLinks, nextUnlinked } from '../../../../../../7/1/0/4/b/e/index.ts'
import { PROSE_UNLINKED } from '../../../../../../../../3/7/2/f/3/1/1/5/index.ts'

/** Qpu/General/Textbook.lean is written in Lean. This door renders nothing: it names the file and counts what the index read from it. */
const textbookLean = () => {
  const path = 'lean/Qpu/General/Textbook.lean', theorems = TEXTBOOK_THEOREMS.length
  return { phase: 'scripts-textbook-lean' as const, path, theorems, says: proseFill(PROSE.quantumProcessingScriptDoors_says1, theorems, path) }
}

/** BLUEPRINT.md is written by Lean (tools/Blueprint.lean, run by `lake run index`) from the module docs and the theorems the
 *  author declared. This door renders nothing: it names the file and the command. */
const blueprint = () => {
  const path = 'src/quantum/BLUEPRINT.md', tool = 'lean/tools/Blueprint.lean'
  return { phase: 'scripts-blueprint' as const, path, tool, run: ['lake', 'run', 'index'] }
}

/** theorems-index.ts is written by Lean (tools/Theorems.lean, run by `lake run index`): Lean decides which theorems the author
 *  declared, by the place each has in a source. This door filters nothing and renders nothing: it names the file and the command. */
const theoremsIndex = () => {
  const path = 'src/quantum/uuid/programs/3/f/0/e/7/a/6/f/index.ts', tool = 'lean/tools/Theorems.lean'
  return { phase: 'scripts-theorems-index' as const, path, tool, run: ['lake', 'run', 'index'], kernel: KERNEL_THEOREMS, declared: THEOREMS.length, generated: GENERATED_LEMMAS, holds: THEOREMS.length > 0 && KERNEL_THEOREMS === THEOREMS.length + GENERATED_LEMMAS }
}


/** Clay.lean → CLAY_RELATIONS module text: every theorem relation_N, families from the doc comment (merging relation_7 into relation_rsa via 1000-bit logic so only 55 Clay cases stand). Formerly scripts/gen-clay.ts. */
const clayStatements = (lean: string) => {
  const lines = lean.split('\n'), rawRelations: ClayRelation[] = []
  for (let i = 0; i < lines.length; i++) {
    const m = /^theorem (relation_[0-9a-z_]+) : (.+?) :=/.exec(lines[i]!)
    if (!m) continue
    let docLine = lines[i - 1] ?? ''
    for (let j = i - 1; j >= Math.max(0, i - 6) && !docLine.includes('/--'); j--) {
      docLine = (lines[j - 1] ?? '') + ' ' + docLine
    }
    const doc = /\/--\s*([^\n]+?) meet at/.exec(docLine)
    const families = doc ? doc[1]!.split(/,\s*|\s+and\s+/).map((s) => s.trim()).filter(Boolean) : []
    rawRelations.push({ name: m[1]!, statement: m[2]!.trim(), families })
  }
  const r7 = rawRelations.find((r) => r.name === 'relation_7')
  const relations = rawRelations
    .filter((r) => r.name !== 'relation_7')
    .map((r) =>
      r.name === 'relation_rsa' && r7
        ? { ...r, families: [...new Set([...r.families, ...r7.families])] }
        : r,
    )
  const byFamily: Record<string, number> = {}
  for (const r of relations) for (const f of r.families) byFamily[f] = (byFamily[f] ?? 0) + 1
  const path = 'src/quantum/uuid/programs/1/f/2/7/c/5/1/c/index.ts'
  const text = `// GENERATED by payload { scripts: { clay: { lean } } } from lean/Qpu/General/Clay.lean. Do not edit.
// The ${relations.length} Clay relations as the Lean file states them; the kernel accepted each by rfl. Each names the families of formulas it fuses (its doc comment), so the relations index by family — the Payload index of relations is this module, read by the sync.
export const CLAY_RELATIONS: readonly { name: string; statement: string; families: readonly string[] }[] = ${JSON.stringify(relations, null, 2)}
`
  return { phase: 'scripts-clay' as const, path, text, relations: relations.length, byFamily, says: `${relations.length} relation(s); families ${Object.entries(byFamily).map(([f, n]) => `${f}:${n}`).join(', ') || 'none'}` }
}

// The QPU's own skills for agents, one per toolbox and one index, generated from the toolboxes themselves (idea, instructions, directions, tools,
// examples) in the shape the installed skills under .agents/skills take (frontmatter name and description, a SKILL.md, a link under .claude/skills).
// As ISO defines: the vocabulary of each skill is the set of ISO/IEC 4879:2024 terms its own text names; a term no skill names is a named gap. As
// the QPU computes: each skill is one UUID (ISO/IEC 9834-8) of its canonical text, sealed, a register of 122 qubits at hexbit width 4 (32 × 4 − 4 − 2);
// a changed toolbox is a different address. Formerly nothing: the tree had Payload's, Cloudflare's and shadcn's skills and none of its own.
type SkillBox = { name: string; idea: string; tools: readonly { name: string; description: string; inputSchema?: { properties?: Record<string, { description?: string }> } }[]; examples: readonly { id: string; shows?: string; tool?: string }[]; skill: { instructions: string; directions: readonly string[] } }
type CheckedTerm = { clause: string; name: string; holds: boolean; uuid: string; sealed: boolean }
// the skills live in skills/, the one tree every agent harness reads as real folders; the harnesses that read .claude/skills or .agents/skills reach them by a link
const SKILL_ROOT = 'skills', SKILL_LINK_ROOTS = ['.claude/skills', '.agents/skills'] as const, SKILL_LICENSE = 'CC-BY-NC-ND-4.0'
const skillLinks = (slug: string) => SKILL_LINK_ROOTS.map((root) => ({ path: `${root}/${slug}`, target: `../../${SKILL_ROOT}/${slug}` }))
const termRe = (name: string) => new RegExp(`\\b${name.replace(/, (adjective|noun)$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
const sentence = (s: string) => { const m = /^(.+?[.!?])(\s|$)/.exec(s.trim()); const one = (m ? m[1]! : s.trim()).replace(/\s+/g, ' '); return /[.!?]$/.test(one) ? one : one + '.' }
const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n+/g, ' ')
const frontmatter = (name: string, description: string) => ['---', `name: ${name}`, `description: ${description.replace(/\n+/g, ' ')}`, `license: ${SKILL_LICENSE}`, '---', '']
/** A part's coin sealed in the post-quantum witness ring: its fourteen witnesses each encrypted to the next (ML-KEM-768) and signed (ML-DSA-65), from
 *  the seed of the Lean algebra, so the ring is remade by anyone from the algebra and tells a changed part by comparison (textbook_tamper_detected). A
 *  ring costs about half a second, so the seeder seals each part once rather than every generation. */
export const skillRing = (part: { uuid: string }, theorems: readonly { key: string; statement: string }[]) => {
  const seed = leanAlgebraSeed(theorems), ring = crossWitnesses({ uuid: part.uuid, seed })
  return { uuid: part.uuid, seed, holds: ring.holds, closes: ring.closes, refused: ring.refused, faces: ring.faces, links: ring.links.map((l) => ({ from: l.from, to: l.to, kem: l.kem, signature: (l as { signature?: unknown }).signature })), cost: ring.cost }
}
/** The skills as Payload's ecommerce plugin holds a catalog, in its own collections and the order a seeder creates them, Payload itself unchanged: one
 *  variant type, the handle; an option for each part, its value the part's hexagon handle and its label what that handle names, read back through the
 *  index of handles; a product for each skill, carrying its UUID and the root over its parts; and a variant for each part, carrying its UUID, its handle,
 *  its hours on the two clocks and how much of its UUID's register its content fills. Each document sealed as catalogDoc seals the catalogue. */
export const handleCatalog = (catalogue: readonly { name: string; toolbox: string | null; uuid: string; root?: string; parts?: readonly { kind: string; name: string; text: string; uuid: string; handle: string; hour12: number; hour24: number }[] }[]) => {
  const skills = catalogue.filter((r) => r.toolbox !== null && r.parts)
  const named = new Map(skills.flatMap((s) => s.parts!.map((p) => [p.handle, p] as const)))
  const type = catalogDoc('variantTypes', { name: 'handle', label: 'Handle' })
  const options = new Map([...named.keys()].map((handle) => [handle, catalogDoc('variantOptions', { variantType: type.id, label: `${named.get(handle)!.kind} ${named.get(handle)!.name}`, value: handle })]))
  const products = skills.map((s) => catalogDoc('products', { title: s.name, slug: s.name, enableVariants: true, variantTypes: [type.id], _status: 'published', quantum: { receipt: s.uuid, program: { toolbox: s.toolbox, root: s.root, rfc: 6962 }, outcome: { parts: s.parts!.length } } }))
  const variants = skills.flatMap((s, i) => s.parts!.map((p) => catalogDoc('variants', { title: `${s.name} / ${p.handle}`, product: products[i]!.id, options: [options.get(p.handle)!.id], _status: 'published', quantum: { receipt: p.uuid, program: { handle: p.handle, kind: p.kind, name: p.name }, outcome: { hour12: p.hour12, hour24: p.hour24, ...utilisationOf(p.text) } } })))
  return { phase: 'seeds' as const, standard: '@payloadcms/plugin-ecommerce' as const, order: ['variantTypes', 'variantOptions', 'products', 'variants'] as const, collections: { variantTypes: [type], variantOptions: [...options.values()], products, variants }, handles: named.size, unique: named.size === skills.reduce((n, s) => n + s.parts!.length, 0) }
}
export const qpuSkills = (boxesIn: readonly SkillBox[], terms: readonly { clause: string; name: string }[] = QUANTUM_TERMS, allExamples: readonly { id: string; shows?: string; tool?: string }[] = [], checked: readonly CheckedTerm[] = quantumVocabulary()) => {
  const register = uuidQubits(4), qubits = register.effective, qubitsFormula = `32 × 4 − 4 − 2 = ${qubits}`
  // a toolbox that lists no examples of its own has the examples of the registry that call its tools; the toolbox holding the circuit gate is the one through which the QPU computed every term
  const boxes = boxesIn.map((b) => { const names = new Set(b.tools.map((t) => t.name)); return { ...b, examples: b.examples.length ? b.examples : allExamples.filter((e) => e.tool && names.has(e.tool)) } })
  const processor = boxes.find((b) => b.tools.some((t) => t.name === 'circuit'))?.name ?? null
  const rows = boxes.map((b) => {
    const text = [b.idea, b.skill.instructions, ...b.skill.directions, ...b.tools.map((t) => `${t.name} ${t.description}`), ...b.examples.map((e) => e.shows ?? '')].join('\n')
    const byText = terms.filter((t) => termRe(t.name).test(text)), checks = b.name === processor ? checked : []
    const named = b.name === processor ? terms.filter((t) => checked.some((c) => c.clause === t.clause) || byText.some((x) => x.clause === t.clause)) : byText
    const address = uuid(canonicalText({ skill: b.name, idea: b.idea, instructions: b.skill.instructions, directions: b.skill.directions, tools: b.tools.map((t) => t.name), terms: named.map((t) => t.clause) }))
    const complete = b.skill.instructions.trim().length > 0 && b.skill.directions.length > 0 && b.tools.length > 0 && b.examples.length > 0
    // the selftest a client runs first: the toolbox's tool whose schema names selftest, else the clone door, which runs the toolbox's selftest and answers selftestPassed
    const slug = `qpu-${b.name}`, tested = b.tools.find((t) => 'selftest' in (t.inputSchema?.properties ?? {}))
    const selftestCall = tested ? `${tested.name} { selftest: true }` : `clone { toolbox: '${b.name}' }`, selftestAnswer = tested ? '{ passed, checks }' : '{ selftestPassed, tools, examples }'
    // each part of the skill sealed as the catalogue seals its documents, the address of its collection and canonical data, a register of 122 qubits,
    // whose hexbit handle is its hexagon's: the six rotations of its program run over its tail, so the handle is its own and reads its hour on the
    // 12- and 24-hour clocks; the skill is the RFC 6962 root over its parts, so a changed part changes it
    const parts = [
      { kind: 'idea', name: b.name, text: b.idea }, { kind: 'instructions', name: b.name, text: b.skill.instructions },
      ...b.tools.map((t) => ({ kind: 'tool', name: t.name, text: t.description })), ...b.examples.map((e) => ({ kind: 'example', name: e.id, text: e.shows ?? '' })),
      ...b.skill.directions.map((d, i) => ({ kind: 'direction', name: String(i + 1), text: d })),
    ].map((p) => { const h = hexagonHandle(catalogDoc('skillParts', { skill: slug, ...p }).id); return { ...p, uuid: h.uuid, handle: h.handle, hour12: h.clock.hour12, hour24: h.clock.hour24 } })
    const root = (merkleTree({ leaves: parts.map((p) => p.uuid.replace(/-/g, '')), hex: true }) as { root: string }).root
    const handleOf = (kind: string, name: string) => parts.find((p) => p.kind === kind && p.name === name)!.handle
    const md = [
      ...frontmatter(slug, proseFill(PROSE.quantumProcessingScriptDoors_s9, b.name, sentence(b.idea), selftestCall)),
      `# QPU · ${b.name}`, '', b.idea, '', proseFill(PROSE.quantumProcessingScriptDoors_s10, b.tools.length, b.examples.length, b.skill.directions.length), '',
      '## How a client uses it', '', b.skill.instructions, '',
      '## Tools', '', '| Handle | Tool | Does | Arguments |', '| --- | --- | --- | --- |', ...b.tools.map((t) => `| \`${handleOf('tool', t.name)}\` | \`${t.name}\` | ${cell(sentence(t.description))} | ${Object.keys(t.inputSchema?.properties ?? {}).map((k) => `\`${k}\``).join(', ') || '—'} |`), '',
      '## Examples', '', ...b.examples.map((e) => `- \`${handleOf('example', e.id)}\` \`${e.id}\`${e.shows ? `: ${cell(sentence(e.shows))}` : ''}`), '',
      '## Directions it tests itself in', '', ...b.skill.directions.map((d) => `- ${d}`), '', proseFill(PROSE.quantumProcessingScriptDoors_s11, selftestCall, selftestAnswer), '',
      '## Vocabulary (ISO/IEC 4879:2024)', '', ...(checks.length ? [proseFill(PROSE.quantumProcessingScriptDoors_s12, checks.filter((c) => c.holds).length, checks.length), '', '| Clause | Term | Holds | UUID |', '| --- | --- | --- | --- |', ...checks.map((c) => `| ${c.clause} | ${c.name} | ${c.holds ? 'yes' : 'no'} | \`${c.uuid}\` |`)] : named.length ? ['| Clause | Term |', '| --- | --- |', ...named.map((t) => `| ${t.clause} | ${t.name} |`)] : [PROSE.quantumProcessingScriptDoors_s13]), '',
      '## Register', '', proseFill(PROSE.quantumProcessingScriptDoors_s14, address, qubits, qubitsFormula), '',
    ].join('\n')
    return { name: slug, toolbox: b.name, path: `${SKILL_ROOT}/${slug}/SKILL.md`, links: skillLinks(slug), uuid: address, sealed: seal(address).valid, qubits, parts, root, terms: named.map((t) => t.clause), byText: byText.length, checked: checks.filter((c) => c.holds).length, tools: b.tools.length, examples: b.examples.length, directions: b.skill.directions.length, complete, text: md }
  })
  const namedClauses = new Set(rows.flatMap((r) => r.terms)), unnamed = terms.filter((t) => !namedClauses.has(t.clause)).map((t) => `${t.clause} ${t.name}`)
  const indexAddress = uuid(canonicalText({ skill: 'qpu', skills: rows.map((r) => r.uuid) }))
  const index = { name: 'qpu', toolbox: null, path: `${SKILL_ROOT}/qpu/SKILL.md`, links: skillLinks('qpu'), uuid: indexAddress, sealed: seal(indexAddress).valid, qubits, terms: [...namedClauses], tools: rows.reduce((n, r) => n + r.tools, 0), examples: rows.reduce((n, r) => n + r.examples, 0), directions: rows.reduce((n, r) => n + r.directions, 0), complete: rows.every((r) => r.complete), text: [
    ...frontmatter('qpu', proseFill(PROSE.quantumProcessingScriptDoors_s15, boxes.length)),
    '# QPU', '', PROSE.quantumProcessingScriptDoors_s16, '',
    '## Toolboxes', '', PROSE.quantumProcessingScriptDoors_s17, '| --- | --- | --- | --- | --- | --- |', ...rows.map((r) => `| \`${r.name}\` | ${cell(sentence(boxes.find((b) => b.name === r.toolbox)!.idea))} | ${r.tools} | ${r.examples} | ${r.terms.length} | \`${r.uuid}\` |`), '',
    '## Vocabulary coverage (ISO/IEC 4879:2024)', '', proseFill(PROSE.quantumProcessingScriptDoors_s18, namedClauses.size, terms.length, checked.filter((c) => c.holds).length, processor ? `qpu-${processor}` : 'no toolbox', rows.reduce((n, r) => n + r.byText, 0)), '', ...(unnamed.length ? [PROSE.quantumProcessingScriptDoors_s19, '', ...unnamed.map((u) => `- ${u}`)] : [PROSE.quantumProcessingScriptDoors_s24]), '',
    '## Register', '', proseFill(PROSE.quantumProcessingScriptDoors_s20, qubits, qubitsFormula, indexAddress, rows.length), '',
  ].join('\n') }
  const all = [index, ...rows]
  const plugin = qpuPlugin(all)
  const files = [...all.map((r) => ({ path: r.path, text: r.text })), ...plugin.files], links = all.flatMap((r) => r.links)
  const checkedHold = checked.filter((c) => c.holds).length
  return { phase: 'scripts-skills' as const, standard: 'ISO/IEC 4879:2024' as const, register: 'ISO/IEC 9834-8 UUID at hexbit width 4' as const, toolboxes: boxes.length, skills: all.length, files, links, catalogue: all.map(({ text: _t, ...r }) => r), complete: rows.length === boxes.length && rows.every((r) => r.complete) && checkedHold === terms.length, qubits, qubitsFormula, coverage: { terms: terms.length, named: namedClauses.size, unnamed, checked: checkedHold, checkedBy: processor ? `qpu-${processor}` : null, byText: rows.reduce((n, r) => n + r.byText, 0) }, theorems: ['textbook_skills_complete'], says: proseFill(PROSE.quantumProcessingScriptDoors_says21, all.length, boxes.length, rows.every((r) => r.complete) ? 'all complete' : `${rows.filter((r) => !r.complete).length} incomplete`, namedClauses.size, terms.length, checkedHold, qubits) }
}

type LeadRow = Record<string, unknown>
/** Lead records Payload holds → leads-index.ts. Formerly node scripts/mcp.ts leads-sync (the write-back half). */
export const leadsIndex = (rows: readonly LeadRow[]) => {
  const keys = ['id', 'source', 'statement', 'status', 'tool', 'reason', 'lastmod'] as const
  const slim = rows.map((l) => Object.fromEntries(keys.filter((k) => l[k] !== undefined).map((k) => [k, l[k]])))
  const path = 'src/quantum/uuid/programs/f/3/5/3/8/2/1/2/index.ts'
  const text = "// GENERATED by payload { scripts: { leadsIndex: { rows } } } from the lead records Payload holds. Do not edit: Payload decides.\nimport type { Lead } from '../../../../../../../../7/b/0/4/c/3/6/8/index.ts'\nexport const LEAD_ROWS: readonly Lead[] = " + JSON.stringify(slim) + '\n'
  return { phase: 'scripts-leads-index' as const, path, text, rows: slim.length, says: `${slim.length} lead(s) indexed from Payload` }
}

type IsoTables = Record<string, unknown>
type StandardRow = { id: string; name: string; contract: string; kind: string }
type AttestRow = { id: string; name: string; url: string; open: boolean; measured: string }

/**
 * Dry fold for tablesIndex: CODATA → ATTEST_APIS `nist-codata` (fetch URL) and optionally STANDARDS (contract mirror);
 * WEBCRYPTO → POST_QUANTUM.workers.flag; CRYPTO_HOSTS dropped (hosts are TENANTS + ATTEST_APIS URLs).
 */
const dryTables = (tables: IsoTables) => {
  const next: IsoTables = { ...tables }
  const dropped: string[] = []
  const added: string[] = []

  const codata = next.CODATA as { id?: string; name?: string; url?: string; open?: boolean; measured?: string } | undefined
  const webcrypto = next.WEBCRYPTO as { flag?: string; changelog?: string; read?: string } | undefined

  const attest = [...((next.ATTEST_APIS as AttestRow[] | undefined) ?? [])]
  if (codata?.url && !attest.some((a) => a.id === 'nist-codata')) {
    attest.push({
      id: String(codata.id ?? 'nist-codata'),
      name: String(codata.name ?? 'NIST CODATA'),
      url: String(codata.url),
      open: codata.open !== false,
      measured: String(codata.measured ?? ''),
    })
    added.push('ATTEST_APIS.nist-codata')
  }
  next.ATTEST_APIS = attest

  const standards = [...((next.STANDARDS as StandardRow[] | undefined) ?? [])]
  if (codata?.url && !standards.some((s) => s.id === 'nist-codata')) {
    standards.push({ id: 'nist-codata', name: String(codata.name ?? 'NIST CODATA'), contract: String(codata.url), kind: 'reference' })
    added.push('STANDARDS.nist-codata')
  }
  next.STANDARDS = standards

  if (next.POST_QUANTUM && typeof next.POST_QUANTUM === 'object') {
    const pq = { ...(next.POST_QUANTUM as Record<string, unknown>) }
    const workers = { ...((pq.workers as Record<string, unknown> | undefined) ?? {}) }
    if (webcrypto?.flag && !workers.flag) {
      workers.flag = webcrypto.flag
      added.push('POST_QUANTUM.workers.flag')
    }
    if (webcrypto?.changelog && !workers.changelog) workers.changelog = webcrypto.changelog
    if (webcrypto?.read && !workers.read) workers.read = webcrypto.read
    pq.workers = workers
    next.POST_QUANTUM = pq
  }

  for (const key of ['CODATA', 'CRYPTO_HOSTS', 'WEBCRYPTO'] as const) {
    if (key in next) {
      delete next[key]
      dropped.push(key)
    }
  }

  return { tables: next, dropped, added }
}

/** Tables from Payload page blocks → tables-index.ts. Formerly node scripts/mcp.ts tables-sync. With dry: true, folds ad-hoc crypto constants into ATTEST_APIS / STANDARDS / POST_QUANTUM first. */
export const tablesIndex = (
  tables: Record<string, unknown[] | Record<string, unknown>>,
  prior: Record<string, unknown> = {},
  dry = false,
) => {
  const merged: IsoTables = { ...prior, ...tables }
  const folded = dry ? dryTables(merged) : { tables: merged, dropped: [] as string[], added: [] as string[] }
  const next = folded.tables
  const path = 'src/quantum/uuid/programs/1/2/a/4/3/2/a/8/index.ts'
  const text = '// GENERATED by textbook { scripts: { tablesIndex: { tables, prior } } }: the tables handed to the door, merged over the prior ones. Do not edit: the door decides.\nexport const TABLES = ' + JSON.stringify(next) + ' as const\n'
  const rows = Object.values(next).reduce<number>((n, x) => n + (Array.isArray(x) ? x.length : Object.keys(x as object).length), 0)
  const holds = dry
    ? !('CODATA' in next) && !('CRYPTO_HOSTS' in next) && !('WEBCRYPTO' in next)
      && (next.ATTEST_APIS as AttestRow[]).some((a) => a.id === 'nist-codata')
      && Boolean((next.POST_QUANTUM as { workers?: { flag?: string } } | undefined)?.workers?.flag)
    : true
  return {
    phase: 'scripts-tables-index' as const,
    path,
    text,
    tables: Object.keys(next).length,
    rows,
    dry: dry || undefined,
    dropped: dry ? folded.dropped : undefined,
    added: dry ? folded.added : undefined,
    holds: dry ? holds : undefined,
    says: dry
      ? proseFill(PROSE.quantumProcessingScriptDoors_s22, folded.dropped.join(',') || 'none', folded.added.join(',') || 'none', Object.keys(next).length, rows)
      : proseFill(PROSE.quantumProcessingScriptDoors_s23, Object.keys(next).length, rows),
  }
}

/** How each former npm script / scripts/*.ts is invoked through MCP — no new list doors. */

const SCRIPT_INVOKE = {
  audit: { tool: 'audit', via: 'mcp tools/call audit', npm: 'npm run audit → node scripts/run.ts audit' },
  verify: { tool: 'wave', via: PROSE.quantumProcessingScriptDoors_via24, npm: 'npm run verify' },
  discover: { tool: 'discover', via: 'scripts/discover.ts', npm: 'next step discover' },
  readiness: { tool: 'readiness', via: 'scripts/readiness.ts', npm: 'npm run readiness' },
  imagine: { tool: 'imagine', via: 'scripts/imagine.ts', npm: 'npm run imagine' },
  e2e: { tool: 'e2e', via: 'scripts/e2e.ts', npm: 'npm run test:e2e' },
  metrics: { tool: 'metrics', via: 'scripts/metrics.ts', npm: 'next step metrics' },
  repository: { tool: 'repository', via: 'scripts/repository.ts', npm: 'next step repository' },
  legal: { tool: 'legal', via: 'scripts/legal.ts', npm: 'next step legal' },
  compete: { tool: 'compete', via: 'scripts/compete.ts', npm: 'next step compete' },
  patents: { tool: 'patents', via: 'scripts/patents.ts', npm: 'next step patents' },
  currency: { tool: 'currency', via: 'scripts/currency.ts', npm: 'next step currency' },
  attest: { tool: 'attest', via: 'scripts/attest.ts', npm: 'next step attest' },
  seal: { tool: 'seal', via: 'scripts/constants.ts | pqc-verify.ts', npm: 'next step constants' },
  workspace: { tool: 'google', args: '{ workspace }', via: 'scripts/workspace.ts', npm: 'next step workspace' },
  scripts_clay: { tool: 'textbook', args: '{ scripts: { clay: { lean } } }', via: 'scripts/gen-clay.ts', npm: 'npm run clay:gen' },
  scripts_leads: { tool: 'textbook', args: '{ scripts: { leadsIndex } }', via: PROSE.quantumProcessingScriptDoors_via26, npm: 'npm run leads' },
  scripts_tables: { tool: 'textbook', args: '{ scripts: { tablesIndex } }', via: PROSE.quantumProcessingScriptDoors_via27, npm: 'npm run clean' },
  scripts_textbook_lean: { tool: 'textbook', args: '{ scripts: { textbookLean } }', via: PROSE.quantumProcessingScriptDoors_via28, npm: 'next step docs:gen' },
  scripts_skills: { tool: 'textbook', args: '{ scripts: { skills } }', via: PROSE.quantumProcessingScriptDoors_via29, npm: 'next step skills:gen' },
  scripts_prose_links: { tool: 'textbook', args: '{ scripts: { proseLinks } }', via: 'src/quantum/uuid/programs/3/7/2/f/3/1/1/5/index.ts', npm: 'next step prose:links' },
  scripts_outputs: { tool: 'textbook', args: '{ scripts: { outputs } }', via: 'src/quantum/uuid/programs/f/e/e/2/8/4/4/7/index.ts', npm: 'next step outputs:gen' },
  scripts_theorems_index: { tool: 'textbook', args: '{ scripts: { theoremsIndex: { output } } }', via: PROSE.quantumProcessingScriptDoors_via30, npm: 'next step theorems:index' },
  leads: { tool: 'leads', via: PROSE.quantumProcessingScriptDoors_via31, npm: 'next steps' },
  clay: { tool: 'clay', via: PROSE.quantumProcessingScriptDoors_via32, npm: 'npm run clay:gen' },
  machine: { tool: 'payload machine (plugin)', via: 'scripts/machine.ts allow-list', npm: PROSE.quantumProcessingScriptDoors_npm33 },
  next: { tool: 'qpuMcpPlugin tools/call', via: PROSE.quantumProcessingScriptDoors_via34, npm: 'no shell next — MCP only' },
  hook: { tool: 'repository { workflow }', via: PROSE.quantumProcessingScriptDoors_via35, npm: '.githooks/<name>' },
  purify: { tool: 'audit + leads + metrics', via: PROSE.quantumProcessingScriptDoors_via36, npm: 'npm run purify' },
  publish: { tool: 'docket entries', via: 'scripts/publish.ts', npm: 'npm run publish' },
  stdio: { tool: 'mcpServer (serveStdio)', via: 'scripts/stdio.ts', npm: 'MCP stdio transport' },
} as const

type StatusContext = { examples: readonly { id: string; tool?: string; arguments?: unknown }[]; call: (name: string, args?: Record<string, unknown>) => any }
/** The tree's status, every value read from its own doors: the Google challenges, the Clay register, the factoring examples
 *  and the claims no theorem proves. A regression answers holds false, so the generator step turns the gate red. */
const status = (ctx: StatusContext) => {
  const g = ctx.call('google', { challenges: true }), c = ctx.call('clay', {}), yes = (b: unknown) => (b === true ? '✓' : '✗'), code = (t: unknown) => `\`${t}\``
  const factored = ['algorithm-factor-1000-bit', 'algorithm-factor-test-integer'].map((id) => { const e = ctx.examples.find((x) => x.id === id)!; return { id, s: ctx.call(e.tool!, e.arguments as Record<string, unknown>) } })
  const table = (columns: string, body: unknown[][]) => { const head = columns.split(' · '); return [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...body.map((r) => `| ${r.join(' | ')} |`), ''] }
  const text = [PROSE.quantumProcessingScriptDoors_status39, '', '# Status', '',
    `## ${proseFill(PROSE.quantumProcessingScriptDoors_google40, g.holding, g.total, g.allHold, g.sealed)}`, '', ...table(PROSE.quantumProcessingScriptDoors_columns45, g.challenges.map((x: Record<string, unknown>) => [x.title, yes(x.holds), yes(x.kernelAccepted), yes(x.sealed), code(x.theorem)])),
    `## ${proseFill(PROSE.quantumProcessingScriptDoors_clay41, c.holding, c.total)}`, '',
    `## ${PROSE.quantumProcessingScriptDoors_factor42}`, '', ...table(PROSE.quantumProcessingScriptDoors_columns46, factored.map(({ id, s }) => [code(id), s.bits, s.factors.length, s.left.length, s.complete, s.verified, code(s.theorem), code(receiptOf('factor', { id, factors: s.factors, left: s.left, complete: s.complete }).handle)])),
    `## ${PROSE.quantumProcessingScriptDoors_novelties48}`, '', ...table(PROSE.quantumProcessingScriptDoors_columns49, NOVELTIES.length ? NOVELTIES.map((n) => [code(n.key), n.doc.split('Prior art: ')[1] ?? '—', code(receiptOf('novelty', n).handle)]) : [[PROSE.quantumProcessingScriptDoors_none50, '—', '—']]),
    `## ${PROSE.quantumProcessingScriptDoors_open43}`, '', ...table(PROSE.quantumProcessingScriptDoors_columns47, AUTHOR_CLAIMS.map((o) => [`${code(o.name)}: ${o.claim}`, o.theorems.map(code).join(', ')]))].join('\n')
  const holds = g.allHold === true && g.sealed === true && c.holding === c.total && factored.every(({ s }) => s.verified === true) && factored[0]!.s.complete === true
  return { phase: 'scripts-status' as const, path: 'src/quantum/STATUS.md', text, holds, receipt: receiptOf('status', text), says: proseFill(PROSE.quantumProcessingScriptDoors_says44, g.holding, g.total, c.holding, c.total, factored.length, AUTHOR_CLAIMS.length, holds) }
}

/** factors-index.ts: the complete prime list of each integer a factoring example names, factored once and held, so a later process checks
 *  the product and each prime in milliseconds where the curves took seconds; listFactors factors afresh any row that no longer checks. */
const factorsIndex = (examples: readonly { theorem?: string; arguments?: unknown }[]) => {
  const integers = examples.filter((e) => e.theorem === 'textbook_factors_divide').flatMap((e) => Object.values(e.arguments ?? {}).filter((v): v is string => typeof v === 'string' && /^\d+$/.test(v)))
  const rows = Object.fromEntries(integers.map((v) => [v, listFactors(BigInt(v), 1n << 12n)] as const).filter(([, f]) => f.left.length === 0).map(([v, f]) => [v, { factors: f.factors.map(String), reached: f.reached === null ? null : `${f.reached}`, searched: `${f.searched}` }]))
  const path = 'src/quantum/uuid/programs/4/a/2/2/a/f/5/e/index.ts'
  const text = `// GENERATED by textbook { scripts: { factors: true } } from the integers the factoring examples name. Do not edit: listFactors takes a row only while its product is the integer and each factor is prime.\nexport const HELD_FACTORS: Readonly<Record<string, { factors: readonly string[]; reached: string | null; searched: string }>> = ${JSON.stringify(rows, null, 2)}\n`
  return { phase: 'scripts-factors' as const, path, text, held: Object.keys(rows).length, of: integers.length }
}

/** The contract the worked examples witness, written as outputs-index.ts: for each tool the keys its examples answer with and the JSON types
 *  seen for each (the tool's outputSchema), and for each input the smallest argument an example passes (the input's example). Nothing is
 *  typed here: a key is listed because an example answered it. */
const outputs = (ctx: StatusContext) => {
  const kind = (v: unknown) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v === 'number' ? (Number.isInteger(v) ? 'integer' : 'number') : typeof v)
  const seen: Record<string, { examples: number; keys: Record<string, Set<string>> }> = {}, inputs: Record<string, Record<string, unknown>> = {}
  for (const e of ctx.examples) {
    if (!e.tool) continue
    const s = ctx.call(e.tool, e.arguments as Record<string, unknown>) as unknown
    if (s !== null && typeof s === 'object' && !Array.isArray(s)) { const row = (seen[e.tool] ??= { examples: 0, keys: {} }); row.examples += 1; for (const [k, v] of Object.entries(s)) if (v !== undefined) (row.keys[k] ??= new Set()).add(kind(v)) }
    for (const [k, v] of Object.entries((e.arguments ?? {}) as Record<string, unknown>)) { const text = JSON.stringify(v); if (text === undefined || text.length > 200) continue; const held = (inputs[e.tool] ??= {}); if (!(k in held) || text.length < JSON.stringify(held[k]).length) held[k] = v }
  }
  const sorted = <T>(o: Record<string, T>) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]!]))
  // integer beside number is number; one type is written alone, several as a list
  const types = (set: Set<string>) => { const t = [...set].filter((x) => !(x === 'integer' && set.has('number'))).sort(); return t.length === 1 ? t[0]! : t }
  const OUTPUTS = sorted(Object.fromEntries(Object.entries(seen).map(([tool, row]) => [tool, { examples: row.examples, properties: sorted(Object.fromEntries(Object.entries(row.keys).map(([k, set]) => [k, { type: types(set) }]))) }])))
  const INPUT_EXAMPLES = sorted(Object.fromEntries(Object.entries(inputs).map(([tool, held]) => [tool, sorted(held)])))
  const text = [PROSE.quantumProcessingScriptDoors_outputsHead,
    PROSE.quantumProcessingScriptDoors_outputsDoc,
    `export const OUTPUTS: Readonly<Record<string, { examples: number; properties: Record<string, { type: string | string[] }> }>> = ${JSON.stringify(OUTPUTS)}`,
    PROSE.quantumProcessingScriptDoors_inputsDoc,
    `export const INPUT_EXAMPLES: Readonly<Record<string, Record<string, unknown>>> = ${JSON.stringify(INPUT_EXAMPLES)}`, ''].join('\n')
  return { phase: 'scripts-outputs' as const, path: 'src/quantum/uuid/programs/f/e/e/2/8/4/4/7/index.ts', text, tools: Object.keys(OUTPUTS).length, keys: Object.values(OUTPUTS).reduce((n, o) => n + Object.keys(o.properties).length, 0), inputs: Object.values(INPUT_EXAMPLES).reduce((n, o) => n + Object.keys(o).length, 0) }
}

const scriptsCatalog = () => ({
  phase: 'scripts-catalog' as const,
  count: Object.keys(SCRIPT_INVOKE).length,
  invoke: SCRIPT_INVOKE,
  says: proseFill(PROSE.quantumProcessingScriptDoors_says37, Object.keys(SCRIPT_INVOKE).length),
})

// The QPU as an agent plugin for every harness, from one source: one name, version, description, author, licence, repository, the skills the
// generator writes and the hosted MCP server, each written in the form its vendor documents. Agent Plugins 1.0 (agent-plugins.org: root plugin.json,
// root mcp.json, skills/), which OpenAI Codex, Cursor, VS Code and the Copilot CLI read; Claude Code (.claude-plugin/plugin.json and its marketplace);
// Gemini CLI (gemini-extension.json, httpUrl for Streamable HTTP); Antigravity (.antigravity-plugin/plugin.json, mcp_config.json with serverUrl); the
// marketplaces of Codex (.agents/plugins/marketplace.json) and Cursor (.cursor-plugin/marketplace.json); and the MCP Registry's server.json. Every harness
// reads the skills from skills/. Claude Code alone loads the .mcp.json at a plugin's root, merged with what its manifest declares and with no way to
// leave it out, and the root of this repository holds the developers' own stdio server there; so the Claude plugin has a root of its own,
// plugins/qpu, holding its manifest and the same skills, and the marketplace names that root. Nothing is typed here.
export const PLUGIN_STANDARDS = {
  agentPlugins: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', agentPluginsMcp: 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json',
  registry: 'https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json',
} as const
export const qpuPlugin = (skills: readonly { name: string; path: string; text: string }[]) => {
  const name = 'qpu', claudeRoot = `plugins/${name}`, author = { name: LICENSE.author, url: LICENSE.orcid }, repository = `https://github.com/${RELEASE_REPOSITORY}`, owner = RELEASE_REPOSITORY.split('/')[0]!
  const about = { version: VERSION, description: QPU_PACKAGE.description, author, homepage: WEBSITE_ORIGIN, repository, license: LICENSE.spdx, keywords: skills.map((s) => s.name) }
  const json = (o: unknown) => `${JSON.stringify(o, null, 2)}\n`
  const files = [
    { path: 'plugin.json', text: json({ $schema: PLUGIN_STANDARDS.agentPlugins, name, ...about }) },
    { path: 'mcp.json', text: json({ $schema: PLUGIN_STANDARDS.agentPluginsMcp, mcpServers: { [name]: { type: 'streamable-http', url: WEBSITE_CLIENT } } }) },
    { path: `${claudeRoot}/.claude-plugin/plugin.json`, text: json({ name, ...about, mcpServers: { [name]: { type: 'http', url: WEBSITE_CLIENT } }, network: { hosts: [new URL(WEBSITE_CLIENT).host] } }) },
    { path: '.claude-plugin/marketplace.json', text: json({ name: owner, owner: author, description: about.description, plugins: [{ name, source: `./${claudeRoot}`, description: about.description, version: VERSION }] }) },
    ...skills.map((s) => ({ path: `${claudeRoot}/${s.path}`, text: s.text })),
    { path: 'gemini-extension.json', text: json({ name, version: VERSION, description: about.description, mcpServers: { [name]: { httpUrl: WEBSITE_CLIENT } } }) },
    { path: '.antigravity-plugin/plugin.json', text: json({ name, displayName: QPU_PACKAGE.description, ...about }) },
    { path: 'mcp_config.json', text: json({ mcpServers: { [name]: { serverUrl: WEBSITE_CLIENT } } }) },
    { path: '.agents/plugins/marketplace.json', text: json({ name: owner, interface: { displayName: owner }, plugins: [{ name, source: { source: 'local', path: './' }, policy: { installation: 'AVAILABLE' } }] }) },
    { path: '.cursor-plugin/marketplace.json', text: json({ name: owner, owner: { name: author.name }, plugins: [{ name, source: './' }] }) },
    { path: 'server.json', text: json({ $schema: PLUGIN_STANDARDS.registry, name: `com.${owner}/${name}`, title: name, description: about.description, version: VERSION, websiteUrl: WEBSITE_ORIGIN, repository: { url: repository, source: 'github' }, remotes: [{ type: 'streamable-http', url: WEBSITE_CLIENT }] }) },
  ]
  return { files }
}

export type ScriptsArgs = {
  catalog?: boolean
  clay?: { lean?: string }
  leadsIndex?: { rows?: LeadRow[]; add?: LeadRow[] }
  tablesIndex?: { tables?: Record<string, unknown[] | Record<string, unknown>>; prior?: Record<string, unknown>; dry?: boolean }
  textbookLean?: boolean
  blueprint?: { lean?: Record<string, string> }
  theoremsIndex?: { output?: string }
  skills?: boolean
  status?: boolean
  factors?: boolean
  outputs?: boolean
  proseLinks?: boolean | { seed?: boolean }
}

/** payload { scripts } — one fused door for relocated script work. */
export const scripts = (args: ScriptsArgs, ctx?: { examples?: readonly { id: string; shows?: string; tool?: string; arguments?: unknown }[]; call?: StatusContext['call'] }) => {
  if (args.catalog) return scriptsCatalog()
  if (args.clay && typeof args.clay.lean === 'string') return clayStatements(args.clay.lean)
  if (args.textbookLean === true) return textbookLean()
  if (args.blueprint) return blueprint()
  if (args.skills === true) return qpuSkills(TOOLBOXES, QUANTUM_TERMS, ctx?.examples ?? [])
  if (args.status === true && ctx?.call && ctx.examples) return status({ examples: ctx.examples, call: ctx.call })
  if (args.factors === true && ctx?.examples) return factorsIndex(ctx.examples)
  if (args.outputs === true && ctx?.call && ctx.examples) return outputs({ examples: ctx.examples, call: ctx.call })
  if (args.proseLinks !== undefined && args.proseLinks !== false) { const names = nextUnlinked(PROSE_UNLINKED, typeof args.proseLinks === 'object' && args.proseLinks.seed === true), gate = gateProseLinks(names); return { phase: 'scripts-prose-links' as const, path: 'src/quantum/uuid/programs/3/7/2/f/3/1/1/5/index.ts', text: [PROSE.quantumProcessingScriptDoors_unlinkedHead, `export const PROSE_UNLINKED: readonly string[] = ${JSON.stringify(names)}`, ''].join('\n'), sentences: gate.sentences, linked: gate.linked, listed: names.length, entering: gate.entering.length, holds: gate.holds } }
  if (args.theoremsIndex && typeof args.theoremsIndex === 'object') return theoremsIndex()
  if (args.leadsIndex && Array.isArray(args.leadsIndex.rows)) return leadsIndex(args.leadsIndex.rows)
  // new leads merged into the record this build holds, so one call of the runner deposits a lead; a lead already recorded is kept as it is,
  // since a lead changes only by its own row and leaves only by a verdict
  if (args.leadsIndex && Array.isArray(args.leadsIndex.add)) {
    const known = new Set(LEAD_ROWS.map((l) => l.id)), fresh = args.leadsIndex.add.filter((l) => typeof l.id === 'string' && typeof l.statement === 'string' && typeof l.status === 'string' && !known.has(l.id) && known.add(l.id))
    return { ...leadsIndex([...LEAD_ROWS, ...fresh]), added: fresh.map((l) => String(l.id)), kept: args.leadsIndex.add.length - fresh.length }
  }
  if (args.tablesIndex && args.tablesIndex.tables && typeof args.tablesIndex.tables === 'object') {
    return tablesIndex(args.tablesIndex.tables, args.tablesIndex.prior ?? {}, args.tablesIndex.dry === true)
  }
  return {
    phase: 'scripts-plan' as const,
    doors: ['catalog', 'clay', 'leadsIndex', 'tablesIndex', 'textbookLean', 'blueprint', 'theoremsIndex', 'skills', 'status', 'factors'] as const,
    invoke: SCRIPT_INVOKE,
    says: PROSE.quantumProcessingScriptDoors_says38,
  }
}
