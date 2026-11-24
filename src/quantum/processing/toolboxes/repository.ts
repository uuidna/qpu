// The repository toolbox: workspaces, branches, tags and releases watched by the flow and verified online, pure. Phase one
// takes the local facts the client gathered (worktrees, branches with their upstreams, tags with their commits, HEAD, the
// package version, the remote) and plans the requests: GitHub's branches, tags and releases for the remote, Zenodo's records
// for the concept DOI, each checked against the contract discovery found. Phase two reads the answers into agreement and
// leads: a local branch with no remote, a remote branch not here, a tag here and not there or there and not here, a release
// without its tag, a package version with no tag, a Zenodo version with no release. Nothing here runs git or fetches.
import { WORKFLOWS } from '../config-index.ts'
import { PROSE, proseFill } from '../prose-index.ts'
import { getAnswer } from './extension.ts'
import { defineTool, isObj, createChecks, unlimited, type Toolbox } from '../toolbox.ts'
import { isContracted } from '../wave.ts'
import { flowWidget } from '../widgets.ts'
import { verifyTheorems } from '../verification.ts'
import { MACHINE_ACTIONS, MACHINE_RUNNER, LONG_ACTIONS, nextWaves, planMachine, recordMachine, machineStatus, forecastTimes, type MachineRequest, type MachineRun } from '../machine.ts'
import { billCloudflare, pricePenalty, countPenalties, getCapacity, plasma, type CapacityInput, type CloudflareUsage } from './billing.ts'
import { CLAIMS } from '../claims-index.ts'
import { listLiterals, listManualDocs, ERROR_REMEDIES, FALLBACKS, ENTROPY_KINDS } from '../audit.ts'
import { uuid } from '../../uuid/index.ts'
import { GOOGLE_HOST, QPU_MCP } from '../discovery.ts'
import { checkAccess, type Ability, type ScopedRole } from '../access.ts'
import { PAYLOADCMS_WORKSPACE_ALIGNMENT } from '../repositories.ts'
import { LICENSE } from '../unit/license.ts'
import { TABLES } from '../tables-index.ts'
import { stamp } from '../../uuid/programs/clock/index.ts'
import { findStaleReceipts } from '../crypto/index.ts'

/** The theorems the one passable way rests on, and what the literature and the hosts say of them: each one's claim as the sealed OpenAlex search
 *  and the readers' confirmations left it (nothing recognised without a recorded confirmation; a theorem never searched is unasked), and the e2e
 *  gate's decoding of the same answers on every host. Counts only: the tree states what the kernel accepts and the records show, no verdict. */
const WAY_THEOREMS = ['textbook_penalty_clear_involution', 'textbook_double_entry', 'textbook_free_or_coil', 'textbook_penalty_antimatter_annihilates', 'textbook_coins_coils_balanced', 'textbook_penalty_harmonic'] as const
/** The path and URL literals outside their registries as penalties of the dirty-code kind, priced harmonically (each literal's bytes at four a
 *  token): the ones already in the tree listed and priced to the tree, never blocking; each one's antimatter waiting on confirm. */
const penaliseLiterals = (files: Record<string, string>) => { const l = listLiterals(files); return { urls: l.urls, paths: l.paths, outside: l.outside, tokens: l.tokens, priced: 'the tree', blocking: 0, autoAnnihilated: l.dirty.filter((x) => x.antimatter === null).length, confirm: l.dirty.filter((x) => x.antimatter?.needs === 'confirm').length, byFile: l.byFile, dirty: l.dirty, theorem: l.theorem, says: proseFill(PROSE.quantumProcessingToolboxesRepository_says1, l.outside, l.urls, l.paths, l.tokens) } }
type E2eOutcomes = { agree?: number; erased?: number; uncorrectable?: number }
const wayEvidence = (e2e?: E2eOutcomes) => {
  const rows = WAY_THEOREMS.map((t) => { const c = CLAIMS.find((x) => x.theorem === t); return { theorem: t, status: c?.status ?? 'unasked', candidates: c?.candidates.length ?? 0, recognisedBy: c?.recognisedBy ?? null } })
  const count = (st: string) => rows.filter((r) => r.status === st).length
  return {
    literary: { theorems: rows, recorded: rows.filter((r) => r.recognisedBy).length, unconfirmed: rows.filter((r) => !r.recognisedBy).length, candidates: count('candidate'), unasked: count('unasked'), source: PROSE.quantumProcessingToolboxesRepository_source2, says: proseFill(PROSE.quantumProcessingToolboxesRepository_says3, rows.filter((r) => r.recognisedBy).length, rows.length) },
    crossMcp: e2e ? { agree: e2e.agree ?? 0, erased: e2e.erased ?? 0, uncorrectable: e2e.uncorrectable ?? 0, says: PROSE.quantumProcessingToolboxesRepository_says4 } : { agree: null, erased: null, uncorrectable: null, says: PROSE.quantumProcessingToolboxesRepository_says5 },
  }
}

/** The git hooks and the CI as client MCP workflows: one door answers the steps of each (a command of next, the e2e gate, an imprint, the
 *  trailers, the unit's signature over the hosted door), the hook client walks them (machine-run.ts hook <name>, from .githooks) and decides nothing itself; the CI
 *  workflow is the same flow on a runner, measured against the file the hand holds. Six workflows git starts, the CI and the deploy pre-check: eight workflows (textbook_hook_workflows). */
/** what the Payload app over OpenNext needs bound: the adapters' bindings (D1, R2, KV), the static assets, the QPU Worker as a service, Workers AI */
const NEEDED_BINDINGS = ['ASSETS', 'D1', 'R2', 'KV', 'QPU', 'AI'] as const
const NEEDED_FLAGS = ['nodejs_compat', 'webcrypto_modern_algorithms'] as const
/** The strict rules of when to commit and when to push, each decided by a theorem over the facts the client hands over (the receipt it just
 *  wrote, the approval the configs step recorded, the gate's decoding): a commit needs the flow green (no red step: textbook_commit_green);
 *  a push needs that, the version sequential and representing the package, the gate decoded with nothing
 *  uncorrectable (textbook_majority_of_three), and the packed npm package complete and ISO verified; a release needs nothing carried
 *  (textbook_carry_release). A release is tagged and pushed only when that package gate holds. A violated rule is a case the court computes. */
/** A waiver of one rule, asked by someone through Payload: honoured only when the rule abilities let their roles waive that rule here. */
type Waiver = { rule: string; by: string; reason: string; roles: readonly ScopedRole[] }
type Rename = { file: string; from: string; to: string; rest: string }
/** The package the client read (package.json) and the files `npm pack` listed. The handler does not pack or publish. */
type NpmPackageFacts = { name?: string; version?: string; license?: string; description?: string; exports?: Record<string, string>; packed?: readonly string[] }
const PACKAGE_EXPORTS = PAYLOADCMS_WORKSPACE_ALIGNMENT.qpu.exports
/** A release is tagged and pushed only when every export of @uuidna/qpu is in the pack and the package is identified (ISO/IEC 19770) and documented (ISO 9001). */
const gateNpmRelease = (pkg: NpmPackageFacts) => {
  const exportsMap = pkg.exports ?? {}
  const packed = new Set(pkg.packed ?? [])
  const listed = pkg.packed != null
  const missingExport = PACKAGE_EXPORTS.filter((key) => typeof exportsMap[key] !== 'string' || exportsMap[key]!.length === 0)
  const missingFile = PACKAGE_EXPORTS.filter((key) => typeof exportsMap[key] === 'string' && exportsMap[key]!.length > 0 && !packed.has(exportsMap[key]!))
  const of: number = PACKAGE_EXPORTS.length
  const present = of - missingExport.length - missingFile.length
  const percent = of === 0 ? 0 : Math.floor((present * 100) / of)
  const complete = listed && missingExport.length === 0 && missingFile.length === 0 && present === of
  const nameOk = pkg.name === PAYLOADCMS_WORKSPACE_ALIGNMENT.qpu.name
  const versionOk = typeof pkg.version === 'string' && /^\d+\.\d+\.\d+(?:[-+].*)?$/.test(pkg.version)
  const licenseOk = pkg.license === LICENSE.spdx
  const documented = typeof pkg.description === 'string' && pkg.description.trim().length > 0
  const iso = [
    { dimension: 'ISO/IEC 19770' as const, holds: nameOk && versionOk && licenseOk, evidence: nameOk && versionOk && licenseOk ? `${pkg.name}@${pkg.version} ${pkg.license}` : PROSE.quantumProcessingToolboxesRepository_s6 },
    { dimension: 'ISO 9001' as const, holds: documented, evidence: documented ? PROSE.quantumProcessingToolboxesRepository_s7 : 'an empty description is not documented' },
  ]
  const verified = iso.every((row) => row.holds)
  const open = complete && verified
  const gap = complete ? '' : proseFill(PROSE.quantumProcessingToolboxesRepository_s8, missingExport.length, missingFile.length, listed ? '' : ', no pack list')
  const isoGap = verified ? '' : PROSE.quantumProcessingToolboxesRepository_s9
  return { phase: 'release' as const, complete, verified, tag: open, push: open, coverage: { present, of, percent, bounded: percent <= 100, theorem: 'textbook_coverage_bounded' as const }, missing: { exports: [...missingExport], files: [...missingFile] }, iso, says: open ? proseFill(PROSE.quantumProcessingToolboxesRepository_s10, pkg.name, pkg.version, present, of) : proseFill(PROSE.quantumProcessingToolboxesRepository_s11, [gap, isoGap].filter(Boolean).join('; ')) }
}
export type WorkflowFacts = { /** the branch the workflow runs on */ branch?: string | null; /** every tool call imprinted and asked again (pre-commit): how many, and the slowest read in milliseconds and whole seconds */ calls?: { asked: number; readMs: number; seconds: number } | null; /** the waivers asked through Payload, with their authors' roles */ waivers?: readonly Waiver[]; /** the commit message as git hands it to commit-msg */ message?: string | null; /** each GitHub workflow's text by its file */ workflows?: Record<string, string> | null; /** the staged diff of the hand-written roots and the files whose header names a generator (pre-commit): the core reads literals, folded and proven from it */ staged?: { diff: string; generated?: readonly string[]; /** the renames the rename door recorded in Payload at the base commit: each with the content address of its declaration's first line there */ renames?: readonly Rename[] } | null; folded?: { added: number; removed: number; lines?: { added: number; removed: number } } | null; proven?: { news: string[]; unproven: string[] } | null; /** the path and URL literals this commit adds outside their registries (pre-commit) */ literals?: { added: { file: string; literal: string; kind: string }[] } | null; /** the generated files whose staged content differs from what their generators just wrote */ automated?: { drifted: string[]; manual?: string[] } | null; /** what is shown but typed or kept by hand, each as git found it */ fakes?: string[] | null; /** the deploy configuration's text as the client read it, parsed here */ config?: string | null; /** the docket's documents as the Payload MCP answered them (findEntries), folded here */ docket?: { body?: unknown; createdAt?: string }[] | null; openNext?: { worker: boolean; assets: boolean; builtAt: number; sourcesAt: number } | null; wrangler?: { bindings: string[]; placeholders: number; flags: string[]; d1: string[]; r2: string[]; kv: string[] } | null; account?: { d1: string[]; r2: string[]; kv: string[]; workers: string[] } | null; observability?: { requests: number; errors5xx: number; window: string } | null; usage?: CloudflareUsage | null; receipt?: { steps?: { name: string; status: string }[] } | null; e2e?: { uncorrectable?: number; agree?: number; erased?: number } | null; /** the receipts the docket records */ receipts?: readonly { id?: string; leaves: readonly unknown[]; recorded: string }[] | null; /** the package the client read and the files npm pack listed; absent means the package was not measured */ npm?: NpmPackageFacts | null }
/** The placeholder the generator writes where a tenant's resource id belongs; the docket's resource with that binding fills it. */
const PLACEHOLDER = "<the tenant's>"
type Body = Record<string, unknown>
/** The docket's documents folded into facts, naming no provider and no resource: the newest body of each kind (account, observability,
 *  usage) is that fact, every resource body is kept by its binding and every receipt body by its id; the details live in the RAID and arrive through the Payload MCP. */
const listDocketFacts = (docs: readonly { body?: unknown; createdAt?: string }[]) => {
  const rows = docs.filter((d) => isObj(d.body)).map((d) => ({ at: d.createdAt ?? '', body: d.body as Body })).sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0))
  const newest = (kind: string) => { const b = rows.find((r) => r.body.kind === kind)?.body; if (!b) return null; const { kind: _k, _id, by: _by, read: _r, notes: _n, ...rest } = b; return rest }
  const resources = new Map<string, Body>(); for (const r of rows) if (r.body.kind === 'resource' && typeof r.body.binding === 'string' && !resources.has(r.body.binding)) resources.set(r.body.binding, r.body)
  const receipts = new Map<string, Body>(); for (const x of rows) if (x.body.kind === 'receipt' && typeof x.body.id === 'string' && !receipts.has(x.body.id)) receipts.set(x.body.id, x.body)
  return { account: newest('account') as WorkflowFacts['account'], observability: newest('observability') as WorkflowFacts['observability'], usage: newest('usage') as WorkflowFacts['usage'], resources: [...resources.values()], receipts: [...receipts.values()] as unknown as NonNullable<WorkflowFacts['receipts']> }
}
/** The deploy configuration (JSON with line comments) read into the bindings, the flags and the resources it names; a placeholder id is
 *  left only when the docket holds no resource of that binding with an id. */
const getDeployConfig = (text: string, resources: readonly Body[] = []): WorkflowFacts['wrangler'] => {
  let w: any = null; try { w = JSON.parse(text.replace(/^\s*\/\/.*$/gm, '')) } catch { return null }
  const id = (binding: string) => { const r = resources.find((x) => x.binding === binding); return typeof r?.id === 'string' && r.id ? r.id : null }
  const d1 = (w.d1_databases ?? []) as { binding: string; database_name: string; database_id: string }[], r2 = (w.r2_buckets ?? []) as { binding: string; bucket_name: string }[], kv = (w.kv_namespaces ?? []) as { binding: string; id: string }[]
  const left = [...d1.filter((d) => d.database_id === PLACEHOLDER && !id(d.binding)), ...kv.filter((k) => k.id === PLACEHOLDER && !id(k.binding))].length
  return { bindings: [...(w.assets?.binding ? [w.assets.binding] : []), ...d1.map((d) => d.binding), ...r2.map((d) => d.binding), ...kv.map((d) => d.binding), ...((w.services ?? []) as { binding: string }[]).map((d) => d.binding), ...(w.ai?.binding ? [w.ai.binding] : [])], placeholders: left, flags: w.compatibility_flags ?? [], d1: d1.map((d) => d.database_name), r2: r2.map((d) => d.bucket_name), kv: kv.map((k) => (k.id === PLACEHOLDER ? id(k.binding) ?? k.id : k.id)) }
}
/** The facts as the rules read them: raw configuration and docket folded in, a fact handed over directly kept as given. */
/** The staged diff read once: each hand-written file's added text, the code lines added and removed outside the proof tables (the rule folded), and
 *  the exports it adds that no added theorem and example names (the rule proven). A generated file is not hand-written; a proof table never counts as growth. */
const PROOF_FILES: readonly string[] = ['src/quantum/processing/examples.ts', 'src/quantum/processing/textbook-theorems.ts']
const getStaged = (diff: string, generated: readonly string[] = [], renames: readonly Rename[] = []) => {
  const side: Record<'+' | '-', Record<string, string>> = { '+': {}, '-': {} }; let file = ''
  for (const l of diff.split('\n')) { if (l.startsWith('+++ ') || l.startsWith('--- ')) { file = l.startsWith('+++ ') ? l.slice(4).replace(/^b\//, () => '') : file; continue } if ((l[0] === '+' || l[0] === '-') && file && ![...GENERATED_FILES, ...generated].includes(file)) side[l[0]][file] = (side[l[0]][file] ?? '') + l.slice(1) + '\n' }
  const code = (t: Record<string, string>) => Object.entries(t).filter(([f]) => !PROOF_FILES.includes(f)), count = (t: Record<string, string>, bytes = true) => code(t).reduce((n, [, x]) => n + (bytes ? new TextEncoder().encode(x.replace(/\n/g, () => '')).length : x.split('\n').length - 1), 0)
  const declarations = (t: Record<string, string>) => code(t).flatMap(([file, x]) => [...x.matchAll(/^(export )?(?:async )?(?:const|function) ([A-Za-z_$][\w$]*)(.*)$/gm)].map((m) => ({ file, exported: !!m[1], name: m[2]!, rest: m[3]! })))
  // a rename is neither a new export nor growth: a removed and an added declaration of one file whose first lines agree once the commit's renames
  // are read back, paired until no pair is left; the added code is then counted with every rename read back
  const gone = declarations(side['-']), came = declarations(side['+']), was = new Set(gone.filter((e) => e.exported).map((e) => e.name)), renamed = new Map<string, Map<string, string>>(), paired = new Set<Rename>()
  // the names read back per file: one new name may come from different old names in different files, so a file's own renames decide it, and
  // another file reads a name back only where every rename to it agrees on the old one
  const shared = () => { const by = new Map<string, Set<string>>(); for (const r of paired) (by.get(r.to) ?? by.set(r.to, new Set()).get(r.to)!).add(r.from); return new Map([...by].filter(([, s]) => s.size === 1).map(([k, s]) => [k, [...s][0]!])) }
  const back = (file: string, s: string, all = shared()) => { const own = renamed.get(file); return s.replace(/[A-Za-z_$][\w$]*/g, (w) => own?.get(w) ?? all.get(w) ?? w) }
  // only the renames Payload holds, each crossed three ways (the rosetta): the address it recorded, the removed line's, the added line's read back
  // each rename pairs at most once, so the passes end
  for (let grew = true; grew;) { grew = false; for (const r of renames) { if (paired.has(r)) continue; const g = gone.find((x) => x.file === r.file && x.name === r.from), a = came.find((x) => x.file === r.file && x.name === r.to); if (g && a && uuid(g.rest) === r.rest && back(r.file, a.rest.split(r.to).join(r.from)) === g.rest) { (renamed.get(r.file) ?? renamed.set(r.file, new Map()).get(r.file)!).set(r.to, r.from); paired.add(r); grew = true } } }
  const all = shared()
  const news = [...new Set(came.filter((e) => e.exported).map((e) => e.name))].filter((n) => !was.has(n) && ![...renamed.values()].some((m) => m.has(n)) && !gone.some((g) => g.name === n)), readBack = Object.fromEntries(Object.entries(side['+']).map(([f, x]) => [f, back(f, x, all)]))
  return { added: side['+'], removed: side['-'], folded: { added: count(readBack), removed: count(side['-']), lines: { added: count(side['+'], false), removed: count(side['-'], false) } }, proven: { news, unproven: news.filter((n) => !PROOF_FILES.every((p) => (side['+'][p] ?? '').includes(n))) }, renames: { recorded: renames.length, paired: paired.size, unpaired: renames.filter((r) => !paired.has(r)).map((r) => `${r.file}:${r.from}→${r.to}`) } }
}
const gatherFacts = (given: WorkflowFacts): WorkflowFacts => {
  const s = given.staged ? getStaged(given.staged.diff, given.staged.generated, given.staged.renames) : null
  // a literal that appears anywhere on the removed side is not added — it moved (a file move puts its removal at the old path, not this file), so it is the tree's, not the committer's
  const f = s ? { ...given, literals: given.literals ?? { added: listLiterals(s.added).dirty.filter((x) => !Object.values(s.removed).some((r) => (r as string).includes(x.literal))).map((x) => ({ file: x.file, literal: x.literal, kind: x.kind })) }, folded: given.folded ?? s.folded, proven: given.proven ?? s.proven } : given
  if (f.config == null && f.docket == null) return f
  const d = f.docket ? listDocketFacts(f.docket) : null
  return { ...f, wrangler: f.wrangler ?? (typeof f.config === 'string' ? getDeployConfig(f.config, d?.resources ?? []) : null), account: f.account ?? d?.account ?? null, observability: f.observability ?? d?.observability ?? null, usage: f.usage ?? d?.usage ?? null, receipts: f.receipts ?? d?.receipts ?? null }
}
/** The generated files whose content is a function of the tree alone (dated records such as configs.json and the entropy stream are not among them). */
/** The inputs of every cacheable step of next, by root: a deterministic step whose inputs have the same content address as when it last ran
 *  green is reused, never rerun (textbook_step_cache_sound); a generator is reused only when the generated files are still exactly what it wrote,
 *  so a hand edit of its output always reruns it and the rule automated is always decided. A step that reads the network, the clock or the
 *  repository's own state (compete, repository, trunk, publish, every online step) and purify and metrics, which read the run's own artefacts,
 *  are never cached, and say so; metrics runs in the full flow, never in the fast pre-commit form. A table of paths, in the path registry. */
export const STEP_CACHE = TABLES.STEP_CACHE as Readonly<Record<string, { roots: readonly string[]; generator?: true; /** the docs pages a generator writes are outputs of the run, never inputs */ generatedDocsExcluded?: true }>>
/** Which steps a hook runs and which it reuses: a step runs when it is not cacheable, has no sealed green record, its input address changed, or
 *  (a generator) its outputs changed since; every other step reuses its sealed record. The steps run are never more than those whose inputs
 *  changed or that cannot be cached (textbook_hook_steps_monotone). Pure. */
const planSteps = (steps: readonly { name: string; key: string | null; outputs?: string | null }[], sealed: readonly { name: string; key: string; status: string; outputs?: string | null }[]) => {
  const plan = steps.map((s) => { const r = sealed.find((x) => x.name === s.name); const reuse = s.key !== null && !!r && r.status === 'green' && r.key === s.key && (s.outputs === undefined || s.outputs === r.outputs); return { name: s.name, cacheable: s.key !== null, reuse, why: s.key === null ? PROSE.quantumProcessingToolboxesRepository_s12 : !r ? 'no sealed record' : r.status !== 'green' ? PROSE.quantumProcessingToolboxesRepository_s13 : r.key !== s.key ? 'its inputs changed' : s.outputs !== undefined && s.outputs !== r.outputs ? PROSE.quantumProcessingToolboxesRepository_s14 : PROSE.quantumProcessingToolboxesRepository_s15 } })
  const run = plan.filter((p) => !p.reuse).map((p) => p.name), reuse = plan.filter((p) => p.reuse).map((p) => p.name)
  return { plan, run, reuse, steps: steps.length, says: proseFill(PROSE.quantumProcessingToolboxesRepository_says16, run.length, steps.length, reuse.length), theorem: 'textbook_hook_steps_monotone' }
}
export const GENERATED_FILES = TABLES.GENERATED_FILES
export const WORKFLOW_RULES: readonly { rule: string; theorem: string; appliesTo: readonly WorkflowName[]; says: string; decide: (f: WorkflowFacts) => { holds: boolean | null; evidence: string } }[] = [
  { rule: 'green', theorem: 'textbook_commit_green', appliesTo: ['pre-commit', 'pre-push', 'ci', 'pre-deploy'], says: PROSE.quantumProcessingToolboxesRepository_says17, decide: (f) => { if (!f.receipt?.steps) return { holds: null, evidence: 'no receipt' }; const steps = Object.values(Object.fromEntries(f.receipt.steps.map((s) => [s.name, s]))), red = steps.filter((s) => s.status === 'red').map((s) => s.name); return { holds: red.length === 0, evidence: red.length ? `red: ${red.join(', ')}` : `${steps.filter((s) => s.status === 'green').length} green, ${steps.filter((s) => s.status === 'skipped').length} skipped, 0 red` } } },
  { rule: 'decoded', theorem: 'textbook_majority_of_three', appliesTo: ['pre-push'], says: PROSE.quantumProcessingToolboxesRepository_says18, decide: (f) => { const e = f.e2e; if (!e || typeof e.uncorrectable !== 'number') return { holds: null, evidence: PROSE.quantumProcessingToolboxesRepository_evidence19 }; return { holds: e.uncorrectable === 0, evidence: `agree ${e.agree ?? '?'}, erased ${e.erased ?? '?'}, uncorrectable ${e.uncorrectable}` } } },
  { rule: 'packaged', theorem: 'textbook_coverage_bounded', appliesTo: ['pre-push'], says: PROSE.quantumProcessingToolboxesRepository_says20, decide: (f) => { if (!f.npm) return { holds: null, evidence: PROSE.quantumProcessingToolboxesRepository_evidence21 }; const g = gateNpmRelease(f.npm); return { holds: g.tag && g.push, evidence: g.says } } },
  { rule: 'built', theorem: 'textbook_build_fresh', appliesTo: ['pre-deploy'], says: PROSE.quantumProcessingToolboxesRepository_says22, decide: (f) => { const o = f.openNext; if (!o) return { holds: null, evidence: 'no build measured' }; return { holds: o.worker && o.assets && o.builtAt >= o.sourcesAt, evidence: !o.worker || !o.assets ? 'the bundle is missing' : o.builtAt >= o.sourcesAt ? PROSE.quantumProcessingToolboxesRepository_s23 : PROSE.quantumProcessingToolboxesRepository_s24 } } },
  { rule: 'bound', theorem: 'textbook_bindings_bound', appliesTo: ['pre-deploy'], says: PROSE.quantumProcessingToolboxesRepository_says25, decide: (f) => { const w = f.wrangler; if (!w) return { holds: null, evidence: 'no wrangler configuration read' }; const missing = NEEDED_BINDINGS.filter((b) => !w.bindings.includes(b)); const flags = NEEDED_FLAGS.filter((x) => !w.flags.includes(x)); return { holds: missing.length === 0 && w.placeholders === 0 && flags.length === 0, evidence: [missing.length ? `unbound: ${missing.join(', ')}` : `${NEEDED_BINDINGS.length} of ${NEEDED_BINDINGS.length} bound`, w.placeholders ? `${w.placeholders} placeholder id(s): D1_DATABASE_ID, KV_NAMESPACE_ID at generation` : 'no placeholder', flags.length ? `flags missing: ${flags.join(', ')}` : 'flags set'].join('; ') } } },
  { rule: 'account', theorem: 'textbook_bindings_bound', appliesTo: ['pre-deploy'], says: PROSE.quantumProcessingToolboxesRepository_says26, decide: (f) => { const a = f.account, w = f.wrangler; if (!a || !w) return { holds: null, evidence: !w ? 'no deploy configuration read' : PROSE.quantumProcessingToolboxesRepository_s27 }; const absent = [...w.d1.filter((x) => !a.d1.includes(x)).map((x) => `D1 ${x}`), ...w.r2.filter((x) => !a.r2.includes(x)).map((x) => `R2 ${x}`), ...w.kv.filter((x) => !a.kv.includes(x)).map((x) => `KV ${x}`)]; return { holds: absent.length === 0, evidence: absent.length ? `not in the account: ${absent.join(', ')}` : PROSE.quantumProcessingToolboxesRepository_s28 } } },
  { rule: 'observed', theorem: 'textbook_observed_errors', appliesTo: ['pre-deploy'], says: PROSE.quantumProcessingToolboxesRepository_says29, decide: (f) => { const o = f.observability; if (!o) return { holds: null, evidence: PROSE.quantumProcessingToolboxesRepository_evidence30 }; return { holds: o.errors5xx * 1000 <= o.requests, evidence: `${o.errors5xx} server error(s) in ${o.requests} request(s) over ${o.window}` } } },
  { rule: 'billed', theorem: 'textbook_bill_covered', appliesTo: ['pre-deploy'], says: PROSE.quantumProcessingToolboxesRepository_says31, decide: (f) => { if (!f.usage) return { holds: null, evidence: PROSE.quantumProcessingToolboxesRepository_evidence32 }; const b = billCloudflare(f.usage); return { holds: b.covered, evidence: b.says } } },
  { rule: 'receipts', theorem: 'textbook_stale_receipt_refuses_deploy', appliesTo: ['pre-deploy'], says: PROSE.quantumProcessingToolboxesRepository_says33, decide: (f) => { if (!f.receipts) return { holds: null, evidence: PROSE.quantumProcessingToolboxesRepository_evidence34 }; const x = findStaleReceipts(f.receipts); return { holds: x.stale + x.wrong === 0, evidence: x.invalidated.length ? `${x.says}; invalidated: ${x.rows.filter((w) => w.verdict !== 'holds').map((w) => `${w.id} ${w.verdict}${w.fold ? ` under ${w.fold}` : ''}`).join(', ')}` : x.says } } },
  { rule: 'automated', theorem: 'textbook_ui_deterministic', appliesTo: ['pre-commit'], says: PROSE.quantumProcessingToolboxesRepository_says35, decide: (f) => { const a = f.automated; if (!a) return { holds: null, evidence: PROSE.quantumProcessingToolboxesRepository_evidence36 }; const manual = a.manual ?? []; return { holds: a.drifted.length === 0 && manual.length === 0, evidence: [a.drifted.length ? proseFill(PROSE.quantumProcessingToolboxesRepository_s37, a.drifted.join(', ')) : '', manual.length ? proseFill(PROSE.quantumProcessingToolboxesRepository_s38, manual.join(', ')) : ''].filter(Boolean).join('; ') || PROSE.quantumProcessingToolboxesRepository_s39 } } },
  { rule: 'described', theorem: 'textbook_cl_described', appliesTo: ['commit-msg'], says: PROSE.quantumProcessingToolboxesRepository_says40, decide: (f) => { if (typeof f.message !== 'string') return { holds: null, evidence: 'no message read' }; const [first = '', blank, ...body] = f.message.split('\n').filter((l) => !l.startsWith('#')), verb = first.split(' ')[0]!; const gaps = [first.length > 72 && `first line ${first.length} > 72`, !/^[A-Z][a-z]*$/.test(verb) || /^(A|An|The|This|It)$|(ed|ing|[^su]s)$/.test(verb) ? `"${verb}" is not an imperative verb` : '', blank !== '' && 'no blank second line', !body.some((l) => l.trim()) && 'no body'].filter(Boolean); return { holds: gaps.length === 0, evidence: gaps.join('; ') || `"${first}": imperative, ${first.length} characters, a body` } } },
  { rule: 'pinned', theorem: 'textbook_actions_pinned', appliesTo: ['pre-commit', 'pre-push'], says: PROSE.quantumProcessingToolboxesRepository_says41, decide: (f) => { const w = f.workflows; if (!w) return { holds: null, evidence: 'no workflow read' }; const gaps = Object.entries(w).flatMap(([p, t]) => [...[...t.matchAll(/uses:\s*(\S+@(?![0-9a-f]{40}\b)\S+)/g)].map((m) => `${p}: ${m[1]} not pinned by SHA`), ...(/^permissions:/m.test(t) && !/write-all/.test(t) ? [] : [`${p}: no least-privilege permissions`])]); return { holds: gaps.length === 0, evidence: gaps.join('; ') || proseFill(PROSE.quantumProcessingToolboxesRepository_s42, Object.keys(w).length) } } },
  { rule: 'folded', theorem: 'textbook_code_folds', appliesTo: ['pre-commit'], says: PROSE.quantumProcessingToolboxesRepository_says43, decide: (f) => { if (!f.folded) return { holds: null, evidence: PROSE.quantumProcessingToolboxesRepository_evidence45 }; const c = f.calls, full = !!c && c.asked > 0 && c.seconds === 0; return { holds: full || f.folded.added <= f.folded.removed, evidence: proseFill(PROSE.quantumProcessingToolboxesRepository_evidence44, f.folded.added, f.folded.removed, f.folded.added - f.folded.removed, f.folded.lines ? `; lines ${f.folded.lines.added} added, ${f.folded.lines.removed} removed` : '') + (c ? proseFill(full ? PROSE.quantumProcessingToolboxesRepository_utilised : PROSE.quantumProcessingToolboxesRepository_unutilised, c.asked, c.readMs) : '') } } },
  { rule: 'proven', theorem: 'textbook_new_doors_proven', appliesTo: ['pre-commit'], says: PROSE.quantumProcessingToolboxesRepository_says46, decide: (f) => (f.proven ? { holds: f.proven.unproven.length === 0, evidence: f.proven.unproven.length ? `unproven: ${f.proven.unproven.join(', ')}` : `${f.proven.news.length} new export(s), each proven` } : { holds: null, evidence: PROSE.quantumProcessingToolboxesRepository_evidence45 }) },
  { rule: 'google-via-payload', theorem: 'textbook_google_one_door', appliesTo: ['pre-commit'], says: PROSE.quantumProcessingToolboxesRepository_says47, decide: (f) => { const g = f.literals?.added.filter((x) => URL.canParse(x.literal) && GOOGLE_HOST.test(new URL(x.literal).hostname)); return g ? { holds: !g.length, evidence: g.length ? proseFill(PROSE.quantumProcessingToolboxesRepository_s48, g.length, g.map((x) => `${x.literal} in ${x.file}`).join(', ')) : PROSE.quantumProcessingToolboxesRepository_s49 } : { holds: null, evidence: PROSE.quantumProcessingToolboxesRepository_evidence50 } } },
  { rule: 'genuine', theorem: 'textbook_google_one_door', appliesTo: ['pre-commit', 'pre-push'], says: PROSE.quantumProcessingToolboxesRepository_genuine, decide: (f) => (f.fakes ? { holds: !f.fakes.length, evidence: f.fakes.join('; ') || PROSE.quantumProcessingToolboxesRepository_genuineHolds } : { holds: null, evidence: PROSE.quantumProcessingToolboxesRepository_genuineUnread }) },
]
/** A violation, the one computable type every rule, check, red step and refusal answers: a kind of the closed set (the workflow rules, the
 *  entropy kinds, security, a red step, a refused validation, an error, unmeasured), the rule and theorem it breaks, the evidence, the remedy
 *  ERROR_REMEDIES learned, the fallback FALLBACKS declares, and the content address of { kind, rule, evidence }: one violation, one record */
const VIOLATION_KINDS: readonly string[] = [...WORKFLOW_RULES.map((r) => r.rule), ...ENTROPY_KINDS.map((k) => k.kind), 'security', 'red-step', 'refused', 'error', 'unmeasured']
type Violation = { kind: string; rule: string; theorem: string | null; evidence: string; address: string; remedy: string | null; fallback: string; severity: 'refuse' }
const recordViolation = (kind: string, rule: string, evidence: string, theorem: string | null = null): Violation => {
  if (!VIOLATION_KINDS.includes(kind)) throw new Error(proseFill(PROSE.quantumProcessingToolboxesRepository_s51, kind, VIOLATION_KINDS.join(', ')))
  const remedy = ERROR_REMEDIES.find((r) => new RegExp(r.signature).test(evidence))?.remedy ?? null
  return { kind, rule, theorem, evidence, address: uuid(JSON.stringify({ kind, rule, evidence })), remedy, fallback: FALLBACKS.find((f) => f.failure === (remedy ? 'a remedy that errors' : 'a handling without a remedy'))!.handling, severity: 'refuse' }
}
const decideWorkflow = (name: WorkflowName, given: WorkflowFacts) => {
  const facts = gatherFacts(given)
  // a violated rule holds when a waiver stands for it: its author's roles may waive it here by the rule abilities Payload holds (a cannot binds every role)
  const abilities = ((TABLES as Record<string, unknown>).RULE_ABILITIES ?? []) as readonly Ability[], waiver = (rule: string) => (given.waivers ?? []).find((w) => w.rule === rule && checkAccess(abilities, w.roles, 'rules', 'waive', { rule, branch: given.branch ?? null, workflow: name }))
  const rules = WORKFLOW_RULES.filter((r) => r.appliesTo.includes(name)).map((r) => ({ rule: r.rule, theorem: r.theorem, says: r.says, ...r.decide(facts) })).map((r) => { const w = r.holds === false ? waiver(r.rule) : undefined; return w ? { ...r, holds: true as const, waived: { by: w.by, reason: w.reason }, evidence: `waived by ${w.by}: ${w.reason} (was: ${r.evidence})` } : r })
  // every workflow hard-fails: a rule violated or unmeasured is a violation, and any violation refuses
  const violated = rules.filter((r) => r.holds === false), unknown = rules.filter((r) => r.holds === null)
  const violations = [...violated.map((r) => recordViolation(r.rule, r.rule, r.evidence, r.theorem)), ...unknown.map((r) => recordViolation('unmeasured', r.rule, r.evidence, r.theorem))], allowed = !violations.length, strict = true
  return { workflow: name, strict, rules, violations, verify: verifyTheorems(rules.map((r) => r.theorem)), allowed, violated: violated.map((r) => r.rule), unknown: unknown.map((r) => r.rule), court: violated.length || (strict && unknown.length) ? { tool: 'legal', arguments: { court: { gate: `git ${name}`, status: 412, rule: 'collision', evidence: { violated: violated.map((r) => `${r.rule}: ${r.evidence}`), unknown: unknown.map((r) => r.rule) } } }, says: PROSE.quantumProcessingToolboxesRepository_says52 } : null, says: allowed ? `${name} allowed: ${rules.map((r) => `${r.rule} holds (${r.theorem})`).join(', ') || 'no strict rule'}` : `${name} refused: ${[...violated.map((r) => `${r.rule} violated (${r.evidence})`), ...unknown.map((r) => `${r.rule} unknown (${r.evidence})`)].join('; ')}` }
}
type WorkflowName = typeof WORKFLOWS[number]
const getWorkflow = (name: WorkflowName, o: { offline?: boolean } = {}) => {
  // next is the machine's runner, run by the hook as a process: the same code the Payload MCP machine tool queues as the qpu-machine job for a
  // remote caller (textbook_long_action_queued), here awaited, so a red step stops the hook; the receipt is its last line
  const next = (flags: string[]) => ({
    id: 'next',
    kind: 'run' as const,
    strict: true,
    cmd: 'node',
    args: [MACHINE_RUNNER, 'next', ...flags.filter((x) => x !== '--strict')],
    says: proseFill(PROSE.quantumProcessingToolboxesRepository_says53, MACHINE_RUNNER, flags.length ? ` (${flags.filter((x) => x !== '--strict').join(' ')})` : ''),
  })
  // the act reported through the Payload app's MCP door: the same tool, asked there, answers the decision the app holds
  const report = (workflow: WorkflowName) => ({ id: 'report', kind: 'mcp' as const, tool: 'repository', url: QPU_MCP, arguments: { workflow }, says: PROSE.quantumProcessingToolboxesRepository_report })
  const by: Record<WorkflowName, { says: string; steps: { id: string; kind: 'run' | 'mcp' | 'raid' | 'imprint' | 'trailers' | 'stage'; strict?: boolean; detach?: boolean; cmd?: string; args?: string[]; tool?: string; arguments?: Record<string, unknown>; url?: string; auth?: string; files?: string[]; says: string }[] }> = {
    'pre-commit': { says: PROSE.quantumProcessingToolboxesRepository_says54, steps: [next(['--offline', '--fast', '--strict']), { id: 'stage', kind: 'stage', files: ['docs/public/mcp.json', 'docs/mcp.md', 'docs/.vitepress/config.mts', 'src/quantum/processing/clay-statements.ts', 'src/quantum/STATUS.md', 'README.md', 'docs/public/manifest.webmanifest', 'docs/public/configs.json'], says: PROSE.quantumProcessingToolboxesRepository_says55 }] },
    'commit-msg': { says: PROSE.quantumProcessingToolboxesRepository_says56, steps: [] },
    'pre-push': { says: PROSE.quantumProcessingToolboxesRepository_says57, steps: [next(['--offline', '--fast', '--strict']), { id: 'e2e', kind: 'run', strict: true, cmd: 'node', args: ['--max-old-space-size=16384', MACHINE_RUNNER, 'step', 'e2e', JSON.stringify({ hosts: ['http://localhost:3000/api/mcp'] })], says: PROSE.quantumProcessingToolboxesRepository_says58 }] },
    'post-commit': { says: PROSE.quantumProcessingToolboxesRepository_says59, steps: [{ id: 'imprint', kind: 'imprint', says: PROSE.quantumProcessingToolboxesRepository_says60 }, report('post-commit')] },
    'post-push': { says: PROSE.quantumProcessingToolboxesRepository_postPush, steps: [report('post-push')] },
    'prepare-commit-msg': { says: PROSE.quantumProcessingToolboxesRepository_says63, steps: [{ id: 'sign', kind: 'mcp', tool: 'sign_commit', url: 'https://uuidna.com/mcp', arguments: { theorems: ['sealed_theorem_not_forged', 'honesty_gate_is_theorem_not_oracle'] }, says: PROSE.quantumProcessingToolboxesRepository_says64 }, { id: 'trailers', kind: 'trailers', says: PROSE.quantumProcessingToolboxesRepository_says65 }] },
    'pre-deploy': { says: PROSE.quantumProcessingToolboxesRepository_says66, steps: [{ id: 'build', kind: 'run', strict: true, cmd: 'lake', args: ['run', 'site'], says: PROSE.quantumProcessingToolboxesRepository_build }, { id: 'dry-run', kind: 'run', strict: true, cmd: 'npx', args: ['wrangler', 'deploy', '--dry-run'], says: PROSE.quantumProcessingToolboxesRepository_says67 }] },
    ci: { says: PROSE.quantumProcessingToolboxesRepository_says69, steps: [{ id: 'checkout', kind: 'run', cmd: 'actions/checkout@v5', says: 'the tree' }, { id: 'node', kind: 'run', cmd: 'actions/setup-node@v5', args: ['node-version=26', 'cache=npm'], says: 'node 26' }, { id: 'install', kind: 'run', cmd: 'npm', args: ['ci'], says: 'the dependencies' }, { id: 'elan', kind: 'run', cmd: 'elan-init', args: ['-y', '--default-toolchain', 'none'], says: PROSE.quantumProcessingToolboxesRepository_says70 }, { ...next([]), strict: true }, { id: 'deliver', kind: 'run', cmd: 'node', args: ['scripts/ci.ts'], says: PROSE.quantumProcessingToolboxesRepository_says71 }, { id: 'receipt', kind: 'run', cmd: 'actions/upload-artifact@v4', args: ['docs/public/receipt.json', 'docs/public/verification.json', 'docs/public/ci.json', 'docs/.vitepress/dist'], says: 'the receipt uploaded' }] },
  }
  const w = by[name]
  // every workflow strict and every step it holds: a red step is a violation and refuses (a detached step reports in its own log)
  const steps = w.steps.map((s) => ({ ...s, strict: !s.detach, ...(o.offline && s.kind === 'mcp' ? { url: undefined, says: `${s.says} (offline: unsigned)` } : {}) }))
  return { name, strict: true, says: w.says, steps, rules: WORKFLOW_RULES.filter((r) => r.appliesTo.includes(name)).map((r) => ({ rule: r.rule, theorem: r.theorem, says: r.says })), client: PROSE.quantumProcessingToolboxesRepository_client72, theorem: 'textbook_hook_workflows' }
}

type Local = { probes?: { appKey?: boolean; adc: boolean }; remote: string | null; head: string; branch: string; version: string; worktrees: { path: string; head: string; branch: string | null }[]; branches: { name: string; upstream: string | null; head: string }[]; tags: { name: string; commit: string }[]; conceptDoi?: string | null; /** the package name on the registry */ pkg?: string | null; /** the workflow files held here (.github/workflows) */ workflows?: string[] }
type Request = { id: string; url: string; purpose: 'branches' | 'tags' | 'releases' | 'zenodo' | 'npm' | 'runs' | 'workflows' | 'protection'; contracted: 'yes' | 'no' | 'unknown'; method?: 'POST'; body?: unknown; via?: 'rest' | 'mcp' }
/** GitHub's MCP: the doors that watch a repository, with the arguments the server's own contract names. */
const GITHUB_MCP_URL = 'https://api.githubcopilot.com/mcp/'
const GITHUB_DOORS: Record<'branches' | 'tags' | 'releases', string> = { branches: 'list_branches', tags: 'list_tags', releases: 'list_releases' }
type Answer = Request & { status: number; text: string }
type Watch = { remote: string | null; owner: string | null; repo: string | null; head: string; branch: string; version: string; worktrees: number; branches: { local: number; remote: number | null; onlyLocal: string[]; onlyRemote: string[]; agree: string[] }; tags: { local: number; remote: number | null; onlyLocal: string[]; onlyRemote: string[]; agree: string[]; mismatch: string[] }; releases: { count: number | null; latest: string | null; withoutTag: string[]; versionHasTag: boolean; versionHasRelease: boolean | null }; zenodo: { versions: number | null; latest: string | null; withoutRelease: string[] }; npm: { latest: string | null; behind: boolean | null; published: string | null }; runs: { latest: { name: string; conclusion: string | null; url: string }[]; red: string[] }; workflows: { remote: string[] | null; onlyRemote: string[]; onlyLocal: string[] }; leads: { id: string; source: string; statement: string; status: 'open'; reason: string }[]; refusals: string[] }

const getOwnerRepo = (remote: string | null): { owner: string; repo: string } | null => { const m = remote ? /github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/.exec(remote) : null; return m ? { owner: m[1]!, repo: m[2]! } : null }

const createWatchRequests = (local: Local, contracts: Readonly<Record<string, readonly string[]>> = {}, via: 'rest' | 'mcp' = 'rest'): Request[] => {
  const or = getOwnerRepo(local.remote); const out: Request[] = []
  const req = (id: string, url: string, purpose: Request['purpose']) => out.push({ id, url, purpose, contracted: isContracted(url, contracts) })
  // through GitHub's MCP, when the tenant's token opens it: the same three facts through the doors, one tools/call each; the token travels in the client's request
  if (or && via === 'mcp') { for (const purpose of ['branches', 'tags', 'releases'] as const) out.push({ id: purpose, url: GITHUB_MCP_URL, purpose, contracted: 'yes', method: 'POST', via: 'mcp', body: { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: GITHUB_DOORS[purpose], arguments: { owner: or.owner, repo: or.repo, perPage: 100 } } } }); if (local.conceptDoi) req('zenodo', `https://zenodo.org/api/records?q=conceptdoi:%22${local.conceptDoi}%22&allversions=1&size=25`, 'zenodo'); if (local.pkg) req('npm', `https://registry.npmjs.org/${encodeURIComponent(local.pkg)}`, 'npm'); req('runs', `https://api.github.com/repos/${or.owner}/${or.repo}/actions/runs?per_page=20`, 'runs'); req('workflows', `https://api.github.com/repos/${or.owner}/${or.repo}/actions/workflows`, 'workflows'); return out }
  if (or) { const api = `https://api.github.com/repos/${or.owner}/${or.repo}`; req('branches', `${api}/branches?per_page=100`, 'branches'); req('tags', `${api}/tags?per_page=100`, 'tags'); req('releases', `${api}/releases?per_page=100`, 'releases'); req('runs', `${api}/actions/runs?per_page=20`, 'runs'); req('workflows', `${api}/actions/workflows`, 'workflows'); req('protection', `${api}/branches/main`, 'protection') }
  // the registry: the version it holds against the package's, so a version behind is a lead (npm publish is the author's act, approved by the versions kind)
  if (local.pkg) req('npm', `https://registry.npmjs.org/${encodeURIComponent(local.pkg)}`, 'npm')
  if (local.conceptDoi) req('zenodo', `https://zenodo.org/api/records?q=conceptdoi:%22${local.conceptDoi}%22&allversions=1&size=25`, 'zenodo')
  return out
}

// an answer read whether REST (the JSON body) or MCP (the door's structured content, or the JSON its text carries, whether JSON or an event stream)
const parse = <T>(a: Answer | undefined): T | null => { if (!a || a.status !== 200) return null; try { if ((a as { via?: string }).via === 'mcp') { const r = getAnswer(a.text); return r.ok ? (typeof r.result === 'string' ? JSON.parse(r.result) : r.result) as T : null } return JSON.parse(a.text) as T } catch { return null } }

const getWatch = (local: Local, answers: readonly Answer[]): Watch => {
  const or = getOwnerRepo(local.remote)
  const refusals = answers.filter((a) => a.status !== 200).map((a) => `${a.purpose}: HTTP ${a.status || 'none'} ${a.text}`)
  const remoteBranches = parse<{ name: string; commit: { sha: string } }[]>(answers.find((a) => a.purpose === 'branches'))
  const remoteTags = parse<{ name: string; commit: { sha: string } }[]>(answers.find((a) => a.purpose === 'tags'))
  const releases = parse<{ tag_name: string; name: string; draft: boolean; prerelease: boolean; published_at: string }[]>(answers.find((a) => a.purpose === 'releases'))
  const zen = parse<{ hits?: { hits?: { metadata?: { version?: string; publication_date?: string }; doi?: string }[] } }>(answers.find((a) => a.purpose === 'zenodo'))
  const localBranchNames = local.branches.map((b) => b.name.replace(/^origin\//, ''))
  const rb = remoteBranches?.map((b) => b.name) ?? null
  const localTagNames = local.tags.map((t) => t.name); const rt = remoteTags?.map((t) => t.name) ?? null
  const mismatch = remoteTags ? local.tags.filter((t) => { const r = remoteTags.find((x) => x.name === t.name); return r && !r.commit.sha.startsWith(t.commit) && !t.commit.startsWith(r.commit.sha) }).map((t) => t.name) : []
  const versionTag = `v${local.version}`
  const releaseTags = releases?.filter((r) => !r.draft).map((r) => r.tag_name) ?? null
  const zenVersions = zen?.hits?.hits?.map((h) => h.metadata?.version ?? '?') ?? null
  const npm = parse<{ 'dist-tags'?: { latest?: string }; time?: Record<string, string> }>(answers.find((a) => a.purpose === 'npm'))
  const runs = parse<{ workflow_runs?: { name: string; conclusion: string | null; status: string; html_url: string; created_at: string }[] }>(answers.find((a) => a.purpose === 'runs'))
  const wf = parse<{ workflows?: { name: string; path: string; state: string }[] }>(answers.find((a) => a.purpose === 'workflows'))
  const npmLatest = npm?.['dist-tags']?.latest ?? null
  const latestRuns = (() => { const seen = new Map<string, { name: string; conclusion: string | null; url: string }>(); for (const x of runs?.workflow_runs ?? []) if (!seen.has(x.name)) seen.set(x.name, { name: x.name, conclusion: x.conclusion, url: x.html_url }); return [...seen.values()] })()
  const remoteWorkflows = wf?.workflows?.map((w) => w.path.replace(/^\.github\/workflows\//, '')) ?? null
  const localWorkflows = local.workflows ?? []
  const leads: Watch['leads'] = []
  const lead = (id: string, statement: string, reason: string) => leads.push({ id: id.replace(/[^a-z0-9]+/gi, '-'), source: local.remote ?? 'git', statement, status: 'open', reason })
  if (npmLatest && npmLatest !== local.version) lead(`npm-behind-${npmLatest}`, proseFill(PROSE.quantumProcessingToolboxesRepository_s73, local.pkg, npmLatest, npm?.time?.[npmLatest] ? ` (published ${npm.time[npmLatest]!.slice(0, 10)})` : '', local.version), 'npm publish is the author\'s act, approved by the versions kind when the version is sequential and represents the package')
  for (const x of latestRuns.filter((x) => x.conclusion === 'failure')) lead(`workflow-red-${x.name}`, proseFill(PROSE.quantumProcessingToolboxesRepository_s74, x.name, x.url), PROSE.quantumProcessingToolboxesRepository_s75)
  if (remoteWorkflows) for (const w of remoteWorkflows.filter((w) => !localWorkflows.includes(w))) lead(`workflow-only-remote-${w}`, proseFill(PROSE.quantumProcessingToolboxesRepository_s76, w), PROSE.quantumProcessingToolboxesRepository_s77)
  if (remoteWorkflows) for (const w of localWorkflows.filter((w) => !remoteWorkflows.includes(w))) lead(`workflow-only-local-${w}`, proseFill(PROSE.quantumProcessingToolboxesRepository_s78, w), 'unpushed: the push carries it')
  if (rb) for (const b of localBranchNames.filter((n) => !rb.includes(n) && n !== 'HEAD')) lead(`branch-only-local-${b}`, proseFill(PROSE.quantumProcessingToolboxesRepository_s79, b, or?.owner, or?.repo), local.branches.find((x) => x.name === b)?.upstream ? PROSE.quantumProcessingToolboxesRepository_s80 : PROSE.quantumProcessingToolboxesRepository_s81)
  if (rb) for (const b of rb.filter((n) => !localBranchNames.includes(n))) lead(`branch-only-remote-${b}`, proseFill(PROSE.quantumProcessingToolboxesRepository_s82, b), 'fetch it, or it is another workspace\'s')
  if (rt) for (const t of localTagNames.filter((n) => !rt.includes(n))) lead(`tag-only-local-${t}`, proseFill(PROSE.quantumProcessingToolboxesRepository_s83, t), PROSE.quantumProcessingToolboxesRepository_s84)
  if (rt) for (const t of rt.filter((n) => !localTagNames.includes(n))) lead(`tag-only-remote-${t}`, proseFill(PROSE.quantumProcessingToolboxesRepository_s85, t), 'fetch tags')
  for (const t of mismatch) lead(`tag-moved-${t}`, proseFill(PROSE.quantumProcessingToolboxesRepository_s86, t), PROSE.quantumProcessingToolboxesRepository_s87)
  if (releaseTags) for (const r of releaseTags.filter((t) => rt && !rt.includes(t))) lead(`release-without-tag-${r}`, proseFill(PROSE.quantumProcessingToolboxesRepository_s88, r), PROSE.quantumProcessingToolboxesRepository_s89)
  if (!localTagNames.includes(versionTag)) lead(`version-without-tag-${versionTag}`, proseFill(PROSE.quantumProcessingToolboxesRepository_s90, local.version, versionTag), PROSE.quantumProcessingToolboxesRepository_s91)
  if (releaseTags && !releaseTags.includes(versionTag)) lead(`version-without-release-${versionTag}`, `no GitHub release for ${versionTag}`, PROSE.quantumProcessingToolboxesRepository_s92)
  if (zenVersions && releaseTags) for (const v of zenVersions.filter((v) => !releaseTags.includes(v) && !releaseTags.includes(`v${v}`))) lead(`zenodo-without-release-${v}`, proseFill(PROSE.quantumProcessingToolboxesRepository_s93, v), PROSE.quantumProcessingToolboxesRepository_s94)
  // the user's acts: leads their probes close, never a wait
  const p = local.probes, guarded = parse<{ protected?: boolean }>(answers.find((a) => a.purpose === 'protection'))
  if (p?.appKey === false) lead('probe-app-key', PROSE.quantumProcessingToolboxesRepository_s95, PROSE.quantumProcessingToolboxesRepository_s96)
  if (p && !p.adc) lead('probe-google-adc', 'no Google application default credentials', PROSE.quantumProcessingToolboxesRepository_s97)
  if (guarded && !guarded.protected) lead('probe-branch-protection', PROSE.quantumProcessingToolboxesRepository_s99, PROSE.quantumProcessingToolboxesRepository_s100)
  if (local.worktrees.length > 1) for (const w of local.worktrees.slice(1)) lead(`workspace-${w.path.split('/').pop()}`, `workspace ${w.path} at ${w.head.slice(0, 8)} on ${w.branch ?? 'detached HEAD'}`, PROSE.quantumProcessingToolboxesRepository_s101)
  return { remote: local.remote, owner: or?.owner ?? null, repo: or?.repo ?? null, head: local.head, branch: local.branch, version: local.version, worktrees: local.worktrees.length,
    branches: { local: localBranchNames.length, remote: rb?.length ?? null, onlyLocal: rb ? localBranchNames.filter((n) => !rb.includes(n)) : [], onlyRemote: rb ? rb.filter((n) => !localBranchNames.includes(n)) : [], agree: rb ? localBranchNames.filter((n) => rb.includes(n)) : [] },
    tags: { local: localTagNames.length, remote: rt?.length ?? null, onlyLocal: rt ? localTagNames.filter((n) => !rt.includes(n)) : [], onlyRemote: rt ? rt.filter((n) => !localTagNames.includes(n)) : [], agree: rt ? localTagNames.filter((n) => rt.includes(n) && !mismatch.includes(n)) : [], mismatch },
    releases: { count: releaseTags?.length ?? null, latest: releaseTags?.[0] ?? null, withoutTag: releaseTags && rt ? releaseTags.filter((t) => !rt.includes(t)) : [], versionHasTag: localTagNames.includes(versionTag), versionHasRelease: releaseTags ? releaseTags.includes(versionTag) : null },
    zenodo: { versions: zenVersions?.length ?? null, latest: zenVersions?.[0] ?? null, withoutRelease: zenVersions && releaseTags ? zenVersions.filter((v) => !releaseTags.includes(v) && !releaseTags.includes(`v${v}`)) : [] },
    npm: { latest: npmLatest, behind: npmLatest ? npmLatest !== local.version : null, published: npmLatest ? npm?.time?.[npmLatest]?.slice(0, 10) ?? null : null },
    runs: { latest: latestRuns, red: latestRuns.filter((x) => x.conclusion === 'failure').map((x) => x.name) },
    workflows: { remote: remoteWorkflows, onlyRemote: remoteWorkflows ? remoteWorkflows.filter((w) => !localWorkflows.includes(w)) : [], onlyLocal: remoteWorkflows ? localWorkflows.filter((w) => !remoteWorkflows.includes(w)) : [] }, leads, refusals }
}

const getWatchPage = (w: Watch, date: string): string => ['---', 'title: Repository', 'order: 57', '---', '', '# Workspaces, branches, tags and releases, watched', '',
  proseFill(PROSE.quantumProcessingToolboxesRepository_s102, date, w.owner ? `${w.owner}/${w.repo}` : 'no GitHub remote', w.head.slice(0, 8), w.branch, w.version, w.worktrees), '',
  PROSE.quantumProcessingToolboxesRepository_s103, '|---|---:|---:|---:|---|---|',
  `| branches | ${w.branches.local} | ${w.branches.remote ?? 'not reached'} | ${w.branches.agree.length} | ${w.branches.onlyLocal.join(', ') || '—'} | ${w.branches.onlyRemote.join(', ') || '—'} |`,
  `| tags | ${w.tags.local} | ${w.tags.remote ?? 'not reached'} | ${w.tags.agree.length} | ${w.tags.onlyLocal.join(', ') || '—'} | ${w.tags.onlyRemote.join(', ') || '—'} |`, '',
  proseFill(PROSE.quantumProcessingToolboxesRepository_s104, w.releases.count ?? 'not reached', w.releases.latest ?? '—', w.releases.versionHasTag ? 'present' : 'absent', w.releases.versionHasRelease === null ? 'unknown' : w.releases.versionHasRelease ? 'present' : 'absent', w.zenodo.versions ?? 'not reached', w.zenodo.latest ?? '—', w.zenodo.withoutRelease.length ? `, without a release: ${w.zenodo.withoutRelease.join(', ')}` : '', w.tags.mismatch.length ? `Tags moved: ${w.tags.mismatch.join(', ')}.` : ''), '',
  proseFill(PROSE.quantumProcessingToolboxesRepository_s105, w.npm.latest ?? 'not reached', w.npm.published ? ` (published ${w.npm.published})` : '', w.npm.behind === null ? '' : w.npm.behind ? `, behind the tree's ${w.version}` : ', the tree\'s version', w.workflows.remote ? w.workflows.remote.join(', ') : 'not reached', w.workflows.onlyRemote.length ? ` (only there: ${w.workflows.onlyRemote.join(', ')})` : '', w.workflows.onlyLocal.length ? ` (only here: ${w.workflows.onlyLocal.join(', ')})` : '', w.runs.latest.length ? w.runs.latest.map((x) => `${x.name} ${x.conclusion ?? 'running'}`).join(', ') : 'not reached'), '',
  '## Leads', '', ...(w.leads.length ? w.leads.map((l) => `- \`${l.id}\`: ${l.statement} — ${l.reason}`) : [PROSE.quantumProcessingToolboxesRepository_s106]), '', ...(w.refusals.length ? ['## Refused', '', ...w.refusals.map((r) => `- ${r}`), ''] : [])].join('\n')

const repository = defineTool('repository', {
  name: 'repository',
  description: PROSE.quantumProcessingToolboxesRepository_description107,
  inputSchema: { type: 'object', properties: { release: { type: 'object', description: PROSE.quantumProcessingToolboxesRepository_description108 }, status: { type: 'object', description: PROSE.quantumProcessingToolboxesRepository_description109 }, plasma: { type: 'object', description: PROSE.quantumProcessingToolboxesRepository_description110 }, penalties: { type: 'array', items: { type: 'object' }, description: PROSE.quantumProcessingToolboxesRepository_description111 }, steps: { type: 'object', description: PROSE.quantumProcessingToolboxesRepository_description112 }, docs: { type: 'object', description: PROSE.quantumProcessingToolboxesRepository_description113 }, capacity: { type: 'object', description: PROSE.quantumProcessingToolboxesRepository_description114 }, e2e: { type: 'object', description: PROSE.quantumProcessingToolboxesRepository_description115 }, penalty: { type: 'object', description: PROSE.quantumProcessingToolboxesRepository_description116 }, via: { type: 'string', enum: ['rest', 'mcp'], description: PROSE.quantumProcessingToolboxesRepository_description117 }, local: { type: 'object', description: '{ remote, head, branch, version, worktrees, branches, tags, conceptDoi }' }, contracts: { type: 'object' }, answers: { type: 'array', items: { type: 'object' } }, machine: { type: 'object', description: PROSE.quantumProcessingToolboxesRepository_description118 }, workflow: { type: 'string', enum: [...WORKFLOWS], description: PROSE.quantumProcessingToolboxesRepository_description119 }, offline: { type: 'boolean', description: PROSE.quantumProcessingToolboxesRepository_description120 }, facts: { type: 'object', description: PROSE.quantumProcessingToolboxesRepository_description121 }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (Object.keys(args).every((k) => k === 'selftest')) return unlimited() as never
    if (isObj(args.machine)) {
      const m = args.machine as { actions?: boolean; next?: boolean; plan?: MachineRequest; record?: MachineRun }
      if (m.next === true) return nextWaves()
      if (m.plan) return { phase: 'machine-plan' as const, ...planMachine(m.plan, decideWorkflow), long: LONG_ACTIONS.includes(String(m.plan.action)) }
      if (m.record) return { phase: 'machine-record' as const, ...recordMachine(m.record) }
      return { phase: 'machine-actions' as const, actions: MACHINE_ACTIONS.map((a) => ({ id: a.id, kind: a.kind, says: a.says, command: [a.cmd, ...a.args].join(' '), needs: a.needs ?? null, workflow: a.workflow ?? null })), reads: MACHINE_ACTIONS.filter((a) => a.kind === 'read').length, writes: MACHINE_ACTIONS.filter((a) => a.kind === 'write').length, server: PROSE.quantumProcessingToolboxesRepository_server122, theorem: 'textbook_machine_allow_list' }
    }
    if (isObj(args.status)) { const st = args.status as Parameters<typeof machineStatus>[0]; return { phase: 'status' as const, ...machineStatus({ ...st, events: st.events ?? [] }) } }
    if (isObj(args.steps)) { const st = args.steps as { plan?: Parameters<typeof planSteps>[0]; sealed?: Parameters<typeof planSteps>[1] }; return { phase: 'steps' as const, ...planSteps(st.plan ?? [], st.sealed ?? []) } }
    if (isObj(args.plasma)) { const p = args.plasma as { texts?: Record<string, string>; answers?: { url?: string; status?: number; ok?: boolean }[] }; return { phase: 'plasma' as const, ...plasma(isObj(p.texts) ? p.texts : {}, p.answers) } }
    if (Array.isArray(args.penalties)) return { phase: 'penalties' as const, ...countPenalties(args.penalties as Parameters<typeof countPenalties>[0]), ...wayEvidence(args.e2e as E2eOutcomes | undefined), ...(isObj(args.literals) ? { literals: penaliseLiterals(args.literals as Record<string, string>) } : {}), ...(isObj(args.capacity) ? { capacity: getCapacity(args.capacity as CapacityInput) } : {}), ...(isObj(args.docs) ? { docs: listManualDocs((args.docs as { pages: { path: string; bytes: number }[] }).pages ?? [], (args.docs as { scripts?: Record<string, string> }).scripts ?? {}, (args.docs as { lean?: Record<string, string> }).lean ?? {}) } : {}) }
    if (isObj(args.violation)) { const v = args.violation as { kind: string; rule: string; evidence: string; theorem?: string }; return { phase: 'violation' as const, ...recordViolation(v.kind, v.rule, String(v.evidence), v.theorem ?? null) } }
    if (isObj(args.penalty)) return { phase: 'penalty' as const, ...pricePenalty(args.penalty as Parameters<typeof pricePenalty>[0]) }
    if (typeof args.workflow === 'string') { if (!WORKFLOWS.includes(args.workflow as WorkflowName)) throw new Error(`no workflow ${args.workflow}; the workflows are ${WORKFLOWS.join(', ')}`); return { workflow: getWorkflow(args.workflow as WorkflowName, { offline: args.offline === true }), ...(isObj(args.facts) ? { decision: decideWorkflow(args.workflow as WorkflowName, args.facts as WorkflowFacts) } : {}), workflows: WORKFLOWS.length, rules: WORKFLOW_RULES.length, theorem: 'textbook_hook_workflows' } }
    if (isObj(args.release)) return gateNpmRelease(args.release as NpmPackageFacts)
    const local = args.local as Local | undefined
    if (!local) throw new Error(PROSE.quantumProcessingToolboxesRepository_s123)
    if (!Array.isArray(args.answers)) { const requests = createWatchRequests(local, (args.contracts ?? {}) as Record<string, string[]>, args.via === 'mcp' ? 'mcp' : 'rest'); return { phase: 'requests' as const, requests: requests.length, requestList: requests } }
    const w = getWatch(local, args.answers as Answer[])
    return { phase: 'watch' as const, branches: w.branches.local, tags: w.tags.local, releases: w.releases.count ?? -1, leads: w.leads.length, refusals: w.refusals.length, watch: w, page: getWatchPage(w, stamp()) }
  },
  widget: flowWidget,
})

const LOCAL = TABLES.LOCAL as unknown as Local
const ANSWERS = TABLES.ANSWERS as unknown as Answer[]

export const REPOSITORY: Toolbox = {
  name: 'repository',
  idea: PROSE.quantumProcessingToolboxesRepository_idea124,
  tools: [repository],
  examples: [
    { id: 'repository-watch', tool: 'repository', theorem: 'textbook_repository_watch_leads', arguments: { local: LOCAL, answers: ANSWERS }, shows: PROSE.quantumProcessingToolboxesRepository_shows125, expect: (s) => (s.phase === 'watch' && s.leads === 14 && s.watch.npm.behind === true && s.watch.runs.red.join() === 'publish' && s.watch.workflows.onlyRemote.join() === 'publish.yml,codeql.yml' && s.watch.tags.mismatch.join() === 'v1.4.0' && s.watch.releases.withoutTag.join() === 'v0.9.0' && s.watch.zenodo.withoutRelease.join() === '1.1.1' ? null : `${s.phase} ${s.leads} leads: ${s.watch?.leads.map((l: { id: string }) => l.id).join(', ')}`) },
  ],
  skill: {
    instructions: PROSE.quantumProcessingToolboxesRepository_instructions126,
    directions: [PROSE.quantumProcessingToolboxesRepository_s127, PROSE.quantumProcessingToolboxesRepository_s128, PROSE.quantumProcessingToolboxesRepository_s129],
    selftest: () => {
      const { check, done } = createChecks()
      const va = recordViolation('automated', 'automated', 'drifted: docs/mcp.md'), vb = recordViolation('automated', 'automated', 'drifted: docs/mcp.md'), unknownKind = (() => { try { recordViolation('free-text', 'x', 'y'); return false } catch { return true } })()
      check('repository:violation-addressed', va.address === vb.address && recordViolation('automated', 'automated', 'drifted: docs/api.md').address !== va.address && unknownKind && va.fallback.length > 0, PROSE.quantumProcessingToolboxesRepository_s130)
      const reqs = createWatchRequests(LOCAL, { 'api.github.com': ['/repos/{owner}/{repo}/branches', '/repos/{owner}/{repo}/tags', '/repos/{owner}/{repo}/releases'] })
      check('repository:requests', reqs.length === 8 && reqs.filter((r) => r.contracted === 'yes').length === 3 && reqs.some((r) => r.purpose === 'zenodo') && reqs.some((r) => r.purpose === 'npm') && reqs.some((r) => r.purpose === 'runs') && reqs.some((r) => r.purpose === 'workflows'), `${reqs.length} requests, ${reqs.filter((r) => r.contracted === 'yes').length} inside GitHub's contract`)
      const fc = forecastTimes([1200, 1200, 1200, 1200]), fs = forecastTimes([100, 300, 100, 300, 100, 300], { period: 2 })
      check('repository:forecast-exact', fc?.point === 1200 && fc.level === '1200000/1000' && fc.interval?.join() === '1200,1200' && fs?.point === 100 && fs.seasonal?.index.join() === '-100,100' && forecastTimes([]) === null, PROSE.quantumProcessingToolboxesRepository_s131)
      const renameDiff = (a: string, b: string) => `+++ b/src/quantum/x.ts\n-export const foo = (n: number) => bar(n)\n-export const bar = (n: number) => n\n+export const ${a} = (n: number) => ${b}(n)\n+export const ${b} = (n: number) => n\n+export const fresh = () => 1\n`
      const held: Rename[] = [{ file: 'src/quantum/x.ts', from: 'foo', to: 'readFoo', rest: uuid(' = (n: number) => bar(n)') }, { file: 'src/quantum/x.ts', from: 'bar', to: 'readBar', rest: uuid(' = (n: number) => n') }]
      const rn = getStaged(renameDiff('readFoo', 'readBar'), [], held).proven, unheld = getStaged(renameDiff('readFoo', 'readBar')).proven, forged = getStaged(renameDiff('readFoo', 'readBar'), [], [{ ...held[0]!, rest: uuid('x') }, held[1]!]).renames
      const only = getStaged(renameDiff('readFoo', 'readBar').split('\n').filter((l) => !l.includes('fresh')).join('\n'), [], held).folded
      const waived = (roles: { name: string }[], branch: string) => decideWorkflow('commit-msg', { message: 'x', branch, waivers: [{ rule: 'described', by: 'u1', reason: 'a draft', roles }] })
      const [byTenantAdmin, byMachine] = [waived([{ name: 'tenant-admin' }], 'dev/x'), waived([{ name: 'machine' }], 'dev/x')]
      const grown = (calls?: WorkflowFacts['calls']) => decideWorkflow('pre-commit', { folded: { added: 2, removed: 1 }, calls }).rules.find((r) => r.rule === 'folded')?.holds
      check('repository:growth-once-utilised', grown({ asked: 3, readMs: 12, seconds: 0 }) === true && grown({ asked: 3, readMs: 1200, seconds: 1 }) === false && grown({ asked: 0, readMs: 0, seconds: 0 }) === false && grown() === false, PROSE.quantumProcessingToolboxesRepository_grows)
      check('repository:waiver-by-abilities', byTenantAdmin.allowed && byTenantAdmin.rules.find((r) => r.rule === 'described')?.holds === true && !byMachine.allowed && byMachine.violated.includes('described'), PROSE.quantumProcessingToolboxesRepository_s132)
      check('repository:rename-is-no-new-export', rn.news.join() === 'fresh' && rn.unproven.join() === 'fresh' && only.added === only.removed && unheld.news.length === 3 && forged.unpaired.join() === 'src/quantum/x.ts:foo→readFoo', proseFill(PROSE.quantumProcessingToolboxesRepository_s133, rn.news.join()))
      check('repository:no-remote', createWatchRequests({ ...LOCAL, remote: null, conceptDoi: null, pkg: null }).length === 0 && getOwnerRepo('git@github.com:uuidna/qpu.git')?.repo === 'qpu', PROSE.quantumProcessingToolboxesRepository_s134)
      const w = getWatch(LOCAL, ANSWERS)
      const ids = w.leads.map((l) => l.id)
      check('repository:leads', ids.includes('branch-only-local-rebuild-phase-1') && ids.includes('branch-only-remote-clean') && ids.includes('tag-only-local-waves-complete') && ids.includes('tag-only-remote-v1-0-1') && ids.includes('tag-moved-v1-4-0') && ids.includes('release-without-tag-v0-9-0') && ids.includes('version-without-release-v1-4-0') && ids.includes('zenodo-without-release-1-1-1') && ids.includes('workspace-qpu-2') && ids.includes('npm-behind-1-0-1') && ids.includes('workflow-red-publish') && ids.includes('workflow-only-remote-publish-yml') && !ids.some((i) => i.startsWith('version-without-tag')), ids.join(', '))
      const offline = getWatch(LOCAL, [])
      check('repository:offline', offline.branches.remote === null && offline.leads.length === 1 && offline.leads[0]!.id === 'workspace-qpu-2' && offline.refusals.length === 0, PROSE.quantumProcessingToolboxesRepository_s135)
      const refused = getWatch(LOCAL, [{ ...ANSWERS[0]!, status: 403, text: 'rate limited' }])
      check('repository:refusal', refused.refusals.length === 1 && refused.branches.remote === null, PROSE.quantumProcessingToolboxesRepository_s136)
      check('repository:page', getWatchPage(w, '2026-01-01').includes('| tags | 3 | 3 | 1 | waves-complete | v1.0.1 |'), PROSE.quantumProcessingToolboxesRepository_s137)
            {
        const viaMcp = createWatchRequests(LOCAL, {}, 'mcp')
        const stream = (v: unknown) => 'event: message\ndata: ' + JSON.stringify({ jsonrpc: '2.0', id: 1, result: { content: [{ type: 'text', text: JSON.stringify(v) }] } }) + '\n\n'
        const mcpAnswers: Answer[] = [
          { ...viaMcp[0]!, status: 200, text: stream([{ name: 'main', commit: { sha: '1111' } }, { name: 'rebuild/phase-1', commit: { sha: '2222' } }]) } as Answer,
          { ...viaMcp[1]!, status: 200, text: stream([{ name: 'v1.4.0', commit: { sha: '4444' } }]) } as Answer,
          { ...viaMcp[2]!, status: 200, text: stream([{ tag_name: 'v1.4.0', name: 'v1.4.0', draft: false, prerelease: false, published_at: '2026-10-01T00:00:00Z' }]) } as Answer,
        ]
        const wm = getWatch(LOCAL, mcpAnswers)
        check('repository:github-mcp-doors', viaMcp.filter((r) => r.via === 'mcp').length === 3 && viaMcp.every((r) => r.via !== 'mcp' || (r.method === 'POST' && (r.body as { params: { name: string } }).params.name.startsWith('list_'))) && wm.branches.remote === 2 && wm.tags.remote === 1 && wm.releases.count === 1, proseFill(PROSE.quantumProcessingToolboxesRepository_s138, viaMcp.filter((r) => r.via === 'mcp').map((r) => (r.body as { params: { name: string } }).params.name).join(', '), wm.branches.remote, wm.tags.remote, wm.releases.count))
      }
      return done()
    },
  },
}
