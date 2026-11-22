// The textbook theorems whose numbers come from data: the tables Payload holds, Payload's surface, the locales and
// what the tools compute. Lean states these numbers in Qpu/General/Textbook.lean; each entry here renders the same
// theorem from the data as it is now. textbook_test.ts fails when the two differ: the Lean file is the author, so a
// change in the data is a change someone makes in Lean.
import { PROSE, proseFill } from './prose-index.ts'
import { PRECEDENCE } from './unit/license.ts'
type MeasuredTheorem = { key: string; lean?: string; says?: string; examples: readonly string[]; /** the Lean example testing it: integers and decimals live here, never in a theorem */ example?: string }
import { SET_FAMILIES, SET_RADICES, SET_SPACE } from './institutions.ts'
import { PORT_RADICES } from './port.ts'
import { TABLES } from './tables-index.ts'
import { LOCALES } from './i18n.ts'
import { PAYLOAD_SURFACE as PS } from './payload-surface.ts'
import { configKinds, TENANT_ROLES, OPERATIONS } from './payload-vocabulary.ts'
import { ROLES } from './unit/roles.ts'
// what only the tools compute (the toolboxes, the generated files, the configurations) read through the QPU's own MCP: mcp.ts hands its
// sources over once it has loaded (updateTheoremSources), and the getters below read them, each once, so no import cycle is ever read early
type TheoremSources = { toolboxes: readonly { tools: readonly unknown[] }[]; call: (name: string, args: unknown) => unknown; googleMcps: readonly string[]; examples: readonly { id: string; tool: string; arguments: unknown }[] }
let sources: TheoremSources | null = null
export const updateTheoremSources = (s: TheoremSources) => { sources = s }
const from = (): TheoremSources => { if (!sources) throw new Error(PROSE.quantumProcessingTextbookMeasured_s1); return sources }
const once = <V>(f: () => V) => { let v: V | undefined; return () => (v ??= f()) }
const configure = (args: Record<string, unknown>) => (from().call('configure', args) as { result?: { structuredContent?: any } }).result?.structuredContent
const BOXES = once(() => from().toolboxes.map((b) => b.tools.length)), PLUGINS = once((): number => configure({ kind: 'payload' }).config.plugins.length)
const FILES = once(() => configure({ files: true }) as { tool: number; hand: number; unfiled: number; kinds: number })
const FULLSTACK = once((): string => String(configure({ kind: 'fullstack' }).config.partition)), FULLSTACK_FILES = once(() => Number(FULLSTACK().split(' = ')[1]))
// a theorem's numbers read from the example it names: the tool's answer over the example's own arguments
const example = (id: string) => { const e = from().examples.find((x) => x.id === id); if (!e) throw new Error(`no example ${id}`); return (from().call(e.tool, e.arguments) as { result?: { structuredContent?: any } }).result?.structuredContent }
const WEBSITE = once(() => { const s = example('payload-website') as { pluginsShared: string[]; pluginsOnlyHere: string[] }; return { shared: s.pluginsShared.length, beyond: s.pluginsOnlyHere.length } })
const SKILLS = once(() => example('payload-skills') as { skills: number; references: number })
const SLICES = once(() => example('fold-slices-exact') as { bytes: number; pieces: unknown[] }), WIDTHS = once(() => example('fold-reflect-widths') as { nibbles: number; faces: number })
const ANTIMATTER = once(() => (example('repository-antimatter-total') as { antimatterCounts: { generated: number; none: number } }).antimatterCounts), ROYALTY = once(() => (example('stripe-royalty') as { royalty: { ratio: { num: number; den: number } } }).royalty.ratio)
const PACKAGES = once(() => configure({ kind: 'packages' }).config as { count: number; counts: Record<string, number> }), PACKAGE_KINDS = ['plugins', 'databases', 'storage', 'email', 'editors', 'live-preview', 'runtime-and-tooling'] as const
// the counts the theorems state, read from their sources (the tables Payload holds, Payload's surface, the locales) when gen-docs writes the Lean
// file: never a number written by hand that a new row would falsify
const T = TABLES as unknown as Record<string, any>, count = <R>(rows: readonly R[], f: (r: R) => boolean) => rows.filter(f).length, sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0)
const CAT = T.CATALOGUE.length, PRODUCTS = new Set(T.CATALOGUE.map((v: { product: string }) => v.product)).size, byInterval = (i: string) => count(T.CATALOGUE, (v: { interval: string }) => v.interval === i)
const NEWS_OPEN = count(T.NEWS_APIS, (a: { open: boolean }) => a.open), PATENT_OPEN = count(T.PATENT_APIS, (a: { open: boolean }) => a.open), ATTEST_REQUESTED = count(T.ATTEST_APIS, (a: { id: string }) => a.id !== 'tls-live')
const DIR = (read: string) => count(T.MCP_DIRECTORIES, (d: { read: string }) => d.read === read), SOFTWARE_DONE = count(T.SOFTWARE, (s: { implemented: boolean }) => s.implemented), STATEMENT_COUNT = Object.keys(T.STATEMENTS).length
const LANG_ROWS = [...new Set(T.REPOSITORIES.map((r: { language: string }) => r.language))].map((l) => [l, count(T.REPOSITORIES, (r: { language: string }) => r.language === l)] as const), LANGS = LANG_ROWS.map(([, k]) => k), LANGS_SAID = LANG_ROWS.map(([l, k]) => `${k} in ${l}`).join(', ')
const LOCALE_COUNT = Object.keys(LOCALES).length
const DATA_TYPES = count(PS.fieldTypes, (x) => x.data), COLLECTION_OPS = count(PS.operations, (o) => o.scope === 'collection'), SCOPES = (['collection', 'global', 'auth', 'access', 'preferences', 'jobs', 'custom', 'graphql'] as const).map((s) => [s, count(PS.operations, (o) => o.scope === s)] as const) // Payload's scopes in the order its docs list them
const HOOK_LEVELS = (['root', 'collection', 'global', 'field'] as const).map((k) => (PS.hooks as Record<string, readonly unknown[]>)[k]!.length), ACCESS_LEVELS = (['collection', 'global', 'field', 'jobs'] as const).map((k) => (PS.access as Record<string, readonly unknown[]>)[k]!.length)
const [ADB, AST, AEM] = PORT_RADICES
export const MEASURED_THEOREMS: readonly MeasuredTheorem[] = [
  { key: 'textbook_plugin_combinations', get example() { return `example : 2 ^ ${PLUGINS()} = ${2 ** PLUGINS()} := by decide` }, examples: ['configure-payload'] },
  { key: 'textbook_prices_are_variants_times_currencies', example: `example : ${CAT} * 2 = ${CAT * 2} := by decide`, examples: ['stripe-catalogue'] },
  { key: 'textbook_integrations_are_thirty_five', example: `example : ${count(T.KNOWN_MCP, (m: { auth: string }) => m.auth !== 'none')} + ${count(T.KNOWN_MCP, (m: { auth: string }) => m.auth === 'none')} = ${T.KNOWN_MCP.length} := by decide`, examples: ['extend-in-request'] },
  { key: 'textbook_workspace_sets', get example() { return `example : ${SET_RADICES.join(' * ')} = ${SET_SPACE} ∧ ${SET_RADICES[0]} = ${SET_FAMILIES.length} := by decide` }, examples: ['textbook-sets', 'textbook-set'] },
  { key: 'textbook_antimatter_total', get example() { const a = ANTIMATTER(); return `example : ${a.generated + a.none} - ${a.generated} = 0 := by decide` }, examples: ['repository-antimatter-total'] },
  { key: 'textbook_website_plugins_partition', get example() { const w = WEBSITE(); return `example : ${w.shared} + ${w.beyond} + ${PLUGINS() - w.shared - w.beyond} = ${PLUGINS()} := by decide` }, examples: ['payload-website'] },
  { key: 'textbook_skills_documents', get example() { const k = SKILLS(); return `example : ${k.skills} + ${k.references} = ${k.skills + k.references} := by decide` }, examples: ['payload-skills'] },
  { key: 'textbook_configs_partition', get example() { return `example : ${FILES().tool} + ${FILES().hand} + ${FILES().unfiled} = ${configKinds.length} := by decide` }, examples: ['configure-files', 'configure-policies'] },
  { key: 'textbook_packages_partition', get example() { return `example : ${PACKAGE_KINDS.map((k) => PACKAGES().counts[k] ?? 0).join(' + ')} = ${PACKAGES().count} := by decide` }, examples: ['configure-packages'] },
  { key: 'textbook_catalogue_prices', example: `example : ${CAT} * 3 = ${CAT * 3} := by decide`, examples: ['configure-ecommerce'] },
  { key: 'textbook_fullstack_files_by_role', get example() { return `example : ${FULLSTACK()} := by decide` }, examples: ['configure-fullstack', 'configure-fullstack-readme'] },
  { key: 'textbook_app_bundle', get example() { return `example : ${FULLSTACK_FILES()} + 2 = ${FULLSTACK_FILES() + 2} := by decide` }, examples: ['payload-app'] },
  { key: 'textbook_mcp_tools_by_toolbox', get example() { return `example : ${BOXES().join(' + ')} = ${sum(BOXES())} := by decide` }, examples: ['configure-sets', 'extend-out'] },
  { key: 'textbook_google_mcps', get example() { return `example : ${T.GOOGLE_MCP.length} + ${from().googleMcps.length} = ${T.GOOGLE_MCP.length + from().googleMcps.length} := by decide` }, examples: ['configure-gates'] },
  { key: 'textbook_adapter_combinations', example: `example : ${ADB} * ${AST} * ${AEM} = ${ADB * AST * AEM} := by decide`, examples: ['configure-adapters'] },
  { key: 'textbook_access_combinations', example: `example : ${TENANT_ROLES.length} * ${Object.keys(ROLES).length} * ${OPERATIONS.length} = ${TENANT_ROLES.length * Object.keys(ROLES).length * OPERATIONS.length} := by decide`, examples: ['audit-access'] },
  { key: 'textbook_app_doc_blocks', get example() { return `example : ${FULLSTACK_FILES() + 2} + 1 = ${FULLSTACK_FILES() + 3} := by decide` }, examples: ['payload-app-lexical'] },
  { key: 'textbook_hologram_rotations', example: `example : 10 * ${LOCALE_COUNT} = ${10 * LOCALE_COUNT} := by decide`, examples: [] },
  { key: 'textbook_news_adapters', example: `example : ${NEWS_OPEN} + ${T.NEWS_APIS.length - NEWS_OPEN} = ${T.NEWS_APIS.length} := by decide`, examples: ['compete-news-plan'] },
  { key: 'textbook_deploy_sets', example: `example : 2 * ${PRODUCTS} = ${2 * PRODUCTS} := by decide`, examples: ['configure-wrangler-set', 'configure-deploy-sets'] },
  { key: 'textbook_payload_field_types', example: `example : ${DATA_TYPES} + ${PS.fieldTypes.length - DATA_TYPES} = ${PS.fieldTypes.length} := by decide`, examples: ['payload-schemas'] },
  { key: 'textbook_payload_operations', example: `example : ${SCOPES.map((s) => s[1]).join(' + ')} = ${PS.operations.length} := by decide`, examples: ['payload-schemas'] },
  { key: 'textbook_payload_schemas', example: `example : ${DATA_TYPES} * ${COLLECTION_OPS} = ${DATA_TYPES * COLLECTION_OPS} := by decide`, examples: ['payload-schemas'] },
  { key: 'textbook_payload_queries', example: `example : ${PS.whereOperators.length} * ${DATA_TYPES} = ${PS.whereOperators.length * DATA_TYPES} := by decide`, examples: ['payload-schemas'] },
  { key: 'textbook_payload_hooks', example: `example : ${HOOK_LEVELS.join(' + ')} = ${sum(HOOK_LEVELS)} := by decide`, examples: ['payload-schemas'] },
  { key: 'textbook_payload_access', example: `example : ${ACCESS_LEVELS.join(' + ')} = ${sum(ACCESS_LEVELS)} := by decide`, examples: ['payload-schemas'] },
  { key: 'textbook_payload_coordination', example: `example : ${PS.realtime.length} * ${PS.operations.length} = ${PS.realtime.length * PS.operations.length} := by decide`, examples: ['payload-schemas'] },
  { key: 'textbook_mcp_directories', example: `example : ${DIR('search')} + ${DIR('mcp')} + ${DIR('sitemap')} + ${DIR('keyed')} + ${DIR('none')} = ${T.MCP_DIRECTORIES.length} := by decide`, examples: ['discover-lead-registry', 'discover-directories-keyed'] },
  { key: 'textbook_patent_apis_partition', example: `example : ${PATENT_OPEN} + ${T.PATENT_APIS.length - PATENT_OPEN} = ${T.PATENT_APIS.length} := by decide`, examples: ['patents-plan'] },
  { key: 'textbook_catalogue_offers', example: `example : ${byInterval('once')} + ${byInterval('year')} + ${byInterval('month')} + ${byInterval('metered')} = ${CAT} := by decide`, examples: ['jsonld-catalogue'] },
  { key: 'textbook_codes_locales', example: `example : 1 + ${LOCALE_COUNT - 1} = ${LOCALE_COUNT} := by decide`, examples: ['codes-plan'] },
  { key: 'textbook_attest_requests', example: `example : ${ATTEST_REQUESTED} + 1 = ${T.ATTEST_APIS.length} := by decide`, examples: ['attest-plan'] },
  { key: 'textbook_software_cirq_implemented', example: `example : ${SOFTWARE_DONE} + ${T.SOFTWARE.length - SOFTWARE_DONE} = ${T.SOFTWARE.length} := by decide`, examples: ['software'] },
  { key: 'textbook_statements_one_topic', example: `example : 1 + ${STATEMENT_COUNT - 1} = ${STATEMENT_COUNT} := by decide`, examples: ['statements-cirq'] },
  { key: 'textbook_repositories_by_language', example: `example : ${LANGS.join(' + ')} = ${T.REPOSITORIES.length} := by decide`, examples: ['repositories'] },
  { key: 'textbook_authorship_tracked', lean: `theorem textbook_authorship_tracked : ${PRECEDENCE.filter((p) => p.doi === '10.5281/zenodo.23156998').length} = 1 ∧ ${PRECEDENCE.filter((p) => p.doi === '10.1086/468061').length} = 0 := by decide`, says: PROSE.quantumProcessingTextbookMeasured_says37, examples: ['match-doi-own', 'match-doi-external'] },
  { key: 'textbook_e2e_tree_dissent', get example() { type D = { combo: string; logical: string; syndrome: string[]; involutions: number; copies: unknown[]; errors: { kind: string }[]; possibilities: { value: string; copies: string[] }[] }; const s = example('e2e-tree-outvoted') as { decoded: D[] }, d = s.decoded.find((x) => x.combo === 't1')!, e = s.decoded.find((x) => x.combo === 't2')!, flips = d.errors.filter((x) => x.kind === 'flip').length, erasures = d.errors.length - flips, voters = 1 + d.copies.length - erasures, agree = d.possibilities.find((p) => p.value === d.logical)!.copies.length; return `example : ${agree} * 2 > ${voters} ∧ ${voters} - ${agree} = ${flips} ∧ ${flips} + ${erasures} = ${d.syndrome.length} ∧ ${e.involutions} = 0 := by decide` }, examples: ['e2e-tree-outvoted'] },
  { key: 'textbook_merge_collision', get example() { type M = { blocks: number; collisions: number; removed: number; address: string; collided: { contents: string[] }[] }; const a = example('payload-merge-collision') as M, b = example('payload-merge-collision-reversed') as M, e = example('payload-merge-edit-stands') as M, addresses = new Set(JSON.stringify(from().examples.find((x) => x.id === 'payload-merge-collision')!.arguments).match(/"uuid":"[0-9a-f-]{36}"/g)).size; return `example : ${a.blocks} + ${a.collisions} + ${a.removed} = ${addresses} ∧ ${a.collided[0]!.contents.length} = 2 ∧ 2 - ${new Set([a.address, b.address]).size} = 1 ∧ ${a.collisions} + ${b.collisions} + ${e.collisions} = 2 := by decide` }, examples: ['payload-merge-collision', 'payload-merge-collision-reversed', 'payload-merge-edit-stands'] },
  { key: 'textbook_entry_canonical', get example() { const s = example('mongo-insert-canonical') as { written: number; entries: { id: string }[] }; return `example : ${s.written} - ${new Set(s.entries.map((e) => e.id)).size} = 2 ∧ 2 * 1 = 2 := by decide` }, examples: ['mongo-insert-canonical'] },
  { key: 'textbook_fold_slices', get example() { const f = example('fold-slices-exact') as { bytes: number; bound: number; pieces: { bytes: number }[] }, u = example('fold-unfold-exact') as { bytes: number }, given = (from().examples.find((x) => x.id === 'fold-unfold-exact')!.arguments as { pieces: { text: string }[] }).pieces; return `example : ${f.pieces.map((p) => p.bytes).join(' + ')} = ${f.bytes} ∧ ${f.pieces.length} * ${f.bound} ≥ ${f.bytes} ∧ ${given.map((p) => p.text.length).join(' + ')} = ${u.bytes} := by decide` }, examples: ['fold-slices-exact', 'fold-unfold-exact'] },
  { key: 'textbook_reflect_widths', get example() { const r = example('fold-reflect-widths') as { nibbles: number; faces: number }; return `example : ${r.nibbles} / ${r.faces} * ${r.faces} + ${r.nibbles} % ${r.faces} = ${r.nibbles} ∧ ${r.nibbles} % ${r.faces} < ${r.faces} := by decide` }, examples: ['fold-reflect-widths'] },
  { key: 'textbook_references_name_collision', get lean() { const s = example('payload-references-collision') as { edges: unknown[]; dangling: unknown[]; collisions: { ids: string[] }[] }, refs = (JSON.stringify(from().examples.find((x) => x.id === 'payload-references-collision')!.arguments).match(/\]\(\//g) ?? []).length; return `theorem textbook_references_name_collision : ${s.edges.length} + ${s.dangling.length} = ${refs} ∧ ${s.collisions.length} = 1 ∧ ${s.collisions[0]!.ids.length} = 2 := by decide` }, says: PROSE.quantumProcessingTextbookMeasured_says43, examples: ['payload-references-collision'] },
  { key: 'textbook_css_one_source', get example() { const c = (example('css-one-source') as { vars: Record<string, string> }).vars['--qpu-hue'], p = (example('fold-hex-one-source') as { style: Record<string, string> }).style['--qpu-hue']; return `example : ${parseInt('016da774', 16)} % 360 = ${c} ∧ ${c} = ${p} := by decide` }, examples: ['css-one-source', 'fold-hex-one-source'] },
  { key: 'textbook_royalty_fractal', get example() { const { num: n, den: d } = ROYALTY(); return `example (f p s r : Nat) (hp : ${n} * p ≤ ${d - n} * r) (hs : s * ${d} ≤ p * ${n}) : f * ${n} / ${d} ≤ f ∧ ${n} * (f * ${n} / ${d}) ≤ ${d - n} * (f - f * ${n} / ${d}) ∧ s ≤ r ∧ ${n} * s ≤ ${d - n} * (r - s) := by omega` }, examples: ['stripe-royalty'] },
]
