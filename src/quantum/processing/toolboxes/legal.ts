// The legal toolbox: a legal and security audit of this MCP through MCP. Phase one gathers the author's claims and plans the calls (forensic,
// verification, legal facts, licence, prior art, due process, security doors chosen from discovery); phase two reads the answers into verdicts,
// drift and findings beside the tree's own security checks. Pure; the client fetches. Recomputable facts, not legal advice.
import { PROSE, proseFill } from '../prose-index.ts'
import { TEXTBOOK_THEOREMS } from '../textbook-theorems.ts'
import { defineTool, isObj, createChecks, type Toolbox } from '../toolbox.ts'
import { LICENSE, PRECEDENCE } from '../unit/license.ts'
import { UNIT_MCP, CLAUDE_API, type Discovery } from '../discovery.ts'
import type { Lead } from '../leads.ts'
import { flowWidget } from '../widgets.ts'
import { sha256, utf8, hex } from '../unit/hmac.ts'
import { uuid } from '../../uuid/index.ts'
import { THEOREMS, KERNEL_THEOREMS } from '../theorems-index.ts'
import { createLedger, convertAmounts, RATE_SOURCES } from './billing.ts'
import { TABLES } from '../tables-index.ts'
import { claimNovelty } from '../claims.ts'
import { competeProgramNeighbours } from '../../uuid/programs/index.ts'
import { clock, stamp } from '../../uuid/programs/clock/index.ts'

type Claim = { id: string; source: string; text: string }
type Call = { door: string; host: string; arguments: Record<string, unknown>; purpose: 'forensics' | 'verify' | 'legal' | 'security' | 'due-process' | 'prior-art' | 'licence' }
type Answer = Call & { answer?: unknown; refusal?: string }
/** The court every cheap gate leads a violator to: the rules a gate refuses by, each named by the theorem that states it and the remedy that
 *  satisfies it; a refusal computes the case (its content address) and the MCP call the violator makes to file it — the gate writes nothing
 *  (textbook_cheap_gates), the violator's own client carries the case to the docket (kind case) or appeals through the match tool. */
const COURT_RULES = TABLES.COURT_RULES as readonly { rule: string; violated: string; theorem: string; remedy: string; statuses: readonly number[] }[]
type Summons = { gate: string; status?: number; code?: number; rule?: string; theorem?: string; remedy?: string; violated?: string; duty?: string; evidence?: unknown; tenant?: string }
export const summonCourt = (v: Summons) => {
  // summoned on any finding, lead or decline: a matter bringing its own theorem, violation and remedy is judged on those
  // (legal_only_the_proven_is_admitted); else a known HTTP rule by name or status; else the first rule.
  const declared = (v.theorem || v.remedy || v.violated) ? { rule: v.rule ?? 'declared', violated: v.violated ?? v.rule ?? 'a declared matter', theorem: v.theorem ?? 'legal_only_the_proven_is_admitted', remedy: v.remedy ?? 'declared by the summons', statuses: [] as readonly number[] } : null
  const rule = COURT_RULES.find((r) => r.rule === v.rule) ?? COURT_RULES.find((r) => r.statuses.includes(v.status ?? v.code ?? 0)) ?? declared ?? COURT_RULES[0]!
  // quantum is ancient: the case is grounded first, with priority, in the ancient wisdom it enacts — the codes and maxims whose theorem is this one's law
  const ancient = ANCIENT_LAW.filter((l) => l.theorem === rule.theorem || l.theorem === (v.duty ?? 'legal_only_the_proven_is_admitted'))
  const summons = { gate: v.gate, status: v.status ?? null, code: v.code ?? null, rule: rule.rule, evidence: v.evidence ?? null, tenant: v.tenant ?? null }
  const address = uuid(JSON.stringify(summons))
  // who denies: a denial carrying an HTTP error is an external party, identified by its content address; otherwise this tree's kernel,
  // identified by the theorem it denied under.
  const httpCode = typeof (v.code ?? v.status) === 'number' && (v.code ?? v.status)! >= 400 ? (v.code ?? v.status)! : null
  const denier = httpCode !== null
    ? { kind: 'external' as const, party: v.gate, id: uuid(`denier\nexternal\n${v.gate}\n${httpCode}`), by: proseFill(PROSE.quantumProcessingToolboxesLegal_by1, httpCode), identified: PROSE.quantumProcessingToolboxesLegal_identified2 }
    : { kind: 'self' as const, party: 'the QPU kernel', id: uuid(`denier\nself\ntheorem:${rule.theorem}`), by: `theorem ${rule.theorem}, this tree's own law`, identified: PROSE.quantumProcessingToolboxesLegal_identified3 }
  // the legal grounds of all involved, and a ruling for the QPU licence where validatable: the court names the Payload call that validates
  // it and never asserts it unvalidated.
  const grounds = [
    { party: denier.party, role: 'denier' as const, ground: denier.by, identified: denier.id },
    { party: `the QPU (${LICENSE.author})`, role: 'rights-holder' as const, ground: proseFill(PROSE.quantumProcessingToolboxesLegal_ground4, LICENSE.spdx, LICENSE.url), identified: uuid(`party\nqpu\n${LICENSE.spdx}`) },
    ...(v.tenant ? [{ party: `tenant ${v.tenant}`, role: 'subject' as const, ground: proseFill(PROSE.quantumProcessingToolboxesLegal_ground5, LICENSE.spdx), identified: uuid(`party\ntenant\n${v.tenant}`) }] : []),
  ]
  const ruling = { favour: 'the QPU licence' as const, exists: true, basis: `${LICENSE.spdx} and ${rule.theorem}`, validatableVia: { tool: 'legal', arguments: { court: summons } }, says: proseFill(PROSE.quantumProcessingToolboxesLegal_says6, LICENSE.spdx) }
  // no ruling stands on a repo the court did not verify: verified by its content address, sliced into tasks decoded by majority (the e2e code)
  const repoAudit = { required: PROSE.quantumProcessingToolboxesLegal_required7, quantum: PROSE.quantumProcessingToolboxesLegal_quantum8, nanosecondTasks: PROSE.quantumProcessingToolboxesLegal_nanosecondTasks9, validatableVia: { tool: 'audit', arguments: {} }, theorem: 'textbook_court_audits_repo' }
  return {
    case: address, ...summons, ancient, denier, grounds, ruling, repoAudit, violated: rule.violated, theorem: rule.theorem, remedy: rule.remedy, duty: v.duty ?? 'legal_only_the_proven_is_admitted',
    verdict: PROSE.quantumProcessingToolboxesLegal_verdict10,
    via: { file: { tool: 'legal', arguments: { court: summons } }, docket: { how: PROSE.quantumProcessingToolboxesLegal_how11, says: PROSE.quantumProcessingToolboxesLegal_says12 }, appeal: { tool: 'match', arguments: { statement: `${rule.violated} at ${v.gate}` } } },
    cost: PROSE.quantumProcessingToolboxesLegal_cost13, theorems: [rule.theorem, 'textbook_cheap_gates', 'textbook_denier_identified', 'textbook_court_audits_repo'],
    says: proseFill(PROSE.quantumProcessingToolboxesLegal_says14, v.gate, rule.violated, denier.party, denier.kind, denier.by, grounds.length, rule.remedy, address),
  }
}

type Texts = { readme?: string; citation?: string; zenodo?: string; package?: string; worker?: string; billing?: string; hmac?: string; mcp?: string }

/** The claims the author makes, read from the tree and its metadata; each a sentence a door can judge. */
const listClaims = (texts: Texts, leads: readonly Lead[], cite?: { theorem?: string | null }): Claim[] => {
  // a claim with legal words is backed by a sealed guarantee of the unit's own court (a theorem key its due-process door names),
  // never by a receipt: the forensic door admits a cited theorem and treats any other UUID as an address it must find sealed
  const backed = ` backed by theorem ${cite?.theorem ?? 'legal_only_the_proven_is_admitted'}`
  const out: Claim[] = [
    { id: 'licence-spdx', source: 'src/quantum/processing/unit/license.ts', text: proseFill(PROSE.quantumProcessingToolboxesLegal_text15, LICENSE.spdx, LICENSE.author, backed) },
    { id: 'licence-address', source: 'src/quantum/processing/unit/license.ts', text: proseFill(PROSE.quantumProcessingToolboxesLegal_text16, LICENSE.url, backed) },
    { id: 'author-orcid', source: 'src/quantum/processing/unit/license.ts', text: `the author is ${LICENSE.author}, ORCID ${LICENSE.orcid}` },
    { id: 'representation', source: 'src/quantum/processing/unit/license.ts', text: `${LICENSE.representation.replace(/\.$/, '')},${backed}` },
    { id: 'disclaimer', source: 'src/quantum/processing/unit/license.ts', text: `${LICENSE.disclaimer.replace(/\.$/, '')},${backed}` },
  ]
  const field = (text: string | undefined, re: RegExp) => text?.match(re)?.[1]?.trim()
  const citationAuthor = field(texts.citation, /family-names:\s*(\S+)/); const citationGiven = field(texts.citation, /given-names:\s*(\S+)/); const citationLicence = field(texts.citation, /^license:\s*(\S+)/m); const citationOrcid = field(texts.citation, /orcid:\s*(\S+)/)
  if (texts.citation) out.push({ id: 'citation-cff', source: 'CITATION.cff', text: proseFill(PROSE.quantumProcessingToolboxesLegal_text17, citationGiven ?? '?', citationAuthor ?? '?', citationOrcid ?? 'no ORCID', citationLicence ?? 'no licence') })
  if (texts.zenodo) { try { const z = JSON.parse(texts.zenodo) as { creators?: { name: string; orcid?: string }[]; license?: string; title?: string }; out.push({ id: 'zenodo-json', source: '.zenodo.json', text: proseFill(PROSE.quantumProcessingToolboxesLegal_text18, z.creators?.map((c) => `${c.name} (${c.orcid ?? 'no ORCID'})`).join(', ') ?? 'nobody', z.title ?? '?', z.license ?? 'no licence') }) } catch { out.push({ id: 'zenodo-json', source: '.zenodo.json', text: PROSE.quantumProcessingToolboxesLegal_text19 }) } }
  if (texts.package) { try { const p = JSON.parse(texts.package) as { name?: string; version?: string; license?: string; author?: { name?: string } | string }; out.push({ id: 'package-json', source: 'package.json', text: `package.json names ${p.name ?? '?'} ${p.version ?? ''} under ${p.license ?? 'no licence'} by ${typeof p.author === 'string' ? p.author : p.author?.name ?? 'nobody'}` }) } catch { out.push({ id: 'package-json', source: 'package.json', text: PROSE.quantumProcessingToolboxesLegal_text20 }) } }
  for (const m of (texts.readme ?? '').matchAll(/^\| ([^|]+) \| ([^|]+) \|$/gm)) if (!/^-+$|^Measure$/.test(m[1]!.trim())) out.push({ id: `readme-${m[1]!.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'README.md measured table', text: `${m[1]!.trim()}: ${m[2]!.trim()}` })
  for (const l of leads.filter((x) => x.id.startsWith('perspective-'))) out.push({ id: l.id, source: l.source, text: l.statement })
  return out
}

/** The tree's own security checks over the Payload app's surface (texts.worker): that its mechanisms are present and configured (access control,
 *  tenant isolation, Stripe webhook verification, env-only secrets, CORS, timeouts); the selftest plants real vulnerabilities and asserts each caught. */
const checkLegalSecurity = (texts: Texts): { id: string; passed: boolean; evidence: string }[] => {
  const w = texts.worker ?? ''; const b = texts.billing ?? ''; const h = texts.hmac ?? ''; const m = texts.mcp ?? ''
  const all = `${w}\n${b}\n${h}\n${m}\n${texts.readme ?? ''}`
  const { check, done } = createChecks()
  if (!w) { check('security:app-text', false, PROSE.quantumProcessingToolboxesLegal_s21); return done().checks }
  check('security:no-live-secret-literal', !/\b(sk_live_|whsec_[0-9A-Za-z]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC )?PRIVATE KEY)/.test(all), PROSE.quantumProcessingToolboxesLegal_s22)
  check('security:token-auth-delegated', /useAPIKey|auth: \{/.test(w) && !/apiKey === |token === |charCodeAt\([^)]*\) ===/.test(w), PROSE.quantumProcessingToolboxesLegal_s23)
  check('security:signature-compared-in-constant-time', /sameHex[\s\S]*?\^/.test(h) && /sameHex\(/.test(b), PROSE.quantumProcessingToolboxesLegal_s24)
  check('security:writes-need-a-role', /overrideAccess: false/.test(w) && /qpuEditor|qpuSuperAdmin|ACCESS\.groups|isAdmin/.test(w), PROSE.quantumProcessingToolboxesLegal_s25)
  check('security:tenant-isolation', /multiTenantPlugin/.test(w), PROSE.quantumProcessingToolboxesLegal_s26)
  check('security:webhook-verified-before-write', /stripeAdapter/.test(w) && /webhookSecret/.test(w), PROSE.quantumProcessingToolboxesLegal_s27)
  check('security:keys-stay-in-the-handler', !/STRIPE_SECRET_KEY|QPU_DATA_KEY|QPU_WRITE_TOKEN|PAYLOAD_SECRET/.test(m), PROSE.quantumProcessingToolboxesLegal_s28)
  check('security:secrets-from-env', /process\.env/.test(w), PROSE.quantumProcessingToolboxesLegal_s29)
  check('security:cors-configured', /cors:/.test(w), PROSE.quantumProcessingToolboxesLegal_s30)
  check('security:timeouts-on-outbound', /AbortSignal\.timeout\(/.test(w), PROSE.quantumProcessingToolboxesLegal_s31)
  check('security:no-eval', !/\beval\(|new Function\(/.test(all), 'no eval, no Function constructor')
  return done().checks
}

/** The public news APIs wired as adapters of the DOI research: the open ones answer mentions of each record of precedence without a key, the keyed ones
 *  wait for a tenant's name (never a value); the mentions by source are the measure the acceptance rule reads, never a verdict (textbook_news_adapters). */
export const NEWS_APIS = TABLES.NEWS_APIS as readonly { id: string; name: string; url: string; open: boolean; key: string | null; reads: string }[]
const createNewsRequests = () => PRECEDENCE.flatMap((p) => NEWS_APIS.filter((a) => a.open).map((a) => ({ id: `${a.id}:${p.doi}`, api: a.id, doi: p.doi, method: 'GET' as const, url: a.url.replace('<doi>', encodeURIComponent(p.doi)).replace('<query>', encodeURIComponent(a.id === 'crossref-events' ? p.doi : p.title)), accept: 'application/json' })))
const countMentions = (answers: readonly { id: string; status: number; text: string }[]) => {
  const read = (api: string, text: string): number | null => { try { const j = JSON.parse(text) as Record<string, unknown>; switch (api) { case 'gdelt': return Array.isArray((j as { articles?: unknown[] }).articles) ? (j as { articles: unknown[] }).articles.length : 0; case 'hn-algolia': return Number((j as { nbHits?: number }).nbHits ?? 0); case 'crossref-events': return Number((j as { message?: { 'total-results'?: number } }).message?.['total-results'] ?? 0); case 'wikipedia-search': return Number((j as { query?: { searchinfo?: { totalhits?: number } } }).query?.searchinfo?.totalhits ?? 0); default: return null } } catch { return null } }
  const rows = answers.map((a) => { const i = a.id.indexOf(':'); const api = a.id.slice(0, i), doi = a.id.slice(i + 1); return { api, doi, status: a.status, mentions: a.status === 200 ? read(api, a.text) : null } })
  const byRecord = Object.fromEntries(PRECEDENCE.map((p) => [p.doi, rows.filter((r) => r.doi === p.doi).reduce((n, r) => n + (r.mentions ?? 0), 0)]))
  const bySource = Object.fromEntries(NEWS_APIS.filter((a) => a.open).map((a) => [a.id, rows.filter((r) => r.api === a.id).reduce((n, r) => n + (r.mentions ?? 0), 0)]))
  return { rows, byRecord, bySource, total: rows.reduce((n, r) => n + (r.mentions ?? 0), 0), reachable: rows.filter((r) => r.status === 200).length, of: rows.length, says: PROSE.quantumProcessingToolboxesLegal_says32 }
}
const DOOR_PURPOSE = TABLES.DOOR_PURPOSE as unknown as Record<string, Call['purpose']>

/** The calls: every claim to the forensic and verification doors; the legal, licence, prior-art, due-process and security doors once. */
const planLegal = (claims: readonly Claim[], discovery: Pick<Discovery, 'doors'> | null, agents: readonly string[] | null, theoremKeys: readonly string[]): { calls: Call[]; agents: string[]; by: 'operator' | 'free-by-default'; absent: string[]; operatorAgents: { id: string; endpoint: string; model: string; key: string; version: string; chosen: boolean; note: string }[] } => {
  const doors = discovery?.doors ?? []
  const has = (name: string) => doors.find((d) => d.name === name)
  const chosen: string[] = agents?.length ? [...agents] : [...Object.keys(DOOR_PURPOSE), 'compute_forensics', 'verify_claim'].filter((n) => has(n))
  const absent = chosen.filter((n) => !has(n))
  const calls: Call[] = []
  const host = (name: string) => has(name)?.host ?? 'uuidna.com'
  for (const name of chosen) {
    if (!has(name)) continue
    // the statement alone: the forensic door recomputes the address of every claim it is handed, so a claim without its address is an address mismatch of the call, not of the claim
    if (name === 'compute_forensics') for (const c of claims) calls.push({ door: name, host: host(name), arguments: { statement: c.text }, purpose: 'forensics' })
    else if (name === 'verify_claim') for (const c of claims) calls.push({ door: name, host: host(name), arguments: { statement: c.text }, purpose: 'verify' })
    else if (name === 'compute_license') calls.push({ door: name, host: host(name), arguments: { licensee: '@uuidna/qpu (this tree)', commercial: false }, purpose: 'licence' })
    else if (name === 'compute_prior_art') calls.push({ door: name, host: host(name), arguments: { keys: theoremKeys, dois: PRECEDENCE.map((p) => p.doi) }, purpose: 'prior-art' })
    else if (name === 'get_due_process') calls.push({ door: name, host: host(name), arguments: { claims: claims.map((c) => c.text) }, purpose: 'due-process' })
    else calls.push({ door: name, host: host(name), arguments: {}, purpose: DOOR_PURPOSE[name] ?? 'security' })
  }
  return { calls, agents: chosen, by: agents?.length ? 'operator' : 'free-by-default', absent, operatorAgents: [{ id: 'claude-api', endpoint: '/api/qpu/search', model: 'qpu-payload', key: 'needs-key refuse', version: CLAUDE_API.version ?? '2023-06-01', chosen: false, note: PROSE.quantumProcessingToolboxesLegal_note33 }] }
}

type Finding = { claim: string; door: string; verdict: string | null; clean: boolean | null; violations: number; violationKinds: string[]; note: string; receipt: string | null; refusal: string | null }
/** The answers read: verdicts per claim, drift between the unit's facts and the tree's licence, security findings, due process gaps. */
/** An answer as a host gives it: an agnostic host (list_tools and call_tool, as the unit serves its doors) returns each door's result as the
 *  JSON text of its content, often followed by more parts (the licence line), so the whole text or its first part that parses as an
 *  object is read as the object it states; anything else is kept as it came. */
const parsed = (text: string): unknown => { try { return JSON.parse(text) } catch { return undefined } }
const readAnswer = (answer: unknown): unknown => typeof answer !== 'string' ? answer : parsed(answer) ?? answer.split('\n').map(parsed).find((v) => v !== null && typeof v === 'object') ?? answer
const auditClaims = (claims: readonly Claim[], given: readonly Answer[], security: readonly { id: string; passed: boolean; evidence: string }[]) => {
  const answers = given.map((a) => (a.answer === undefined ? a : { ...a, answer: readAnswer(a.answer) }))
  const findings: Finding[] = []
  for (const a of answers.filter((x) => x.purpose === 'forensics' || x.purpose === 'verify')) {
    const claim = claims.find((c) => c.text === (a.arguments.statement as string))?.id ?? '?'
    if (a.refusal !== undefined) { findings.push({ claim, door: a.door, verdict: null, clean: null, violations: 0, violationKinds: [], note: '', receipt: null, refusal: a.refusal }); continue }
    const r = (a.answer ?? {}) as { verdict?: string; clean?: boolean; violations?: { kind?: string; detail?: string }[]; note?: string; honest?: string; receipt?: string }
    const kinds = Array.isArray(r.violations) ? r.violations.map((v) => `${v.kind ?? 'violation'}: ${v.detail ?? ''}`) : []
    findings.push({ claim, door: a.door, verdict: r.verdict ?? null, clean: typeof r.clean === 'boolean' ? r.clean : null, violations: kinds.length, violationKinds: kinds, note: (kinds.length ? kinds.join('; ') : r.note ?? r.honest ?? ''), receipt: r.receipt ?? null, refusal: null })
  }
  const legal = answers.find((a) => a.door === 'get_legal_facts')?.answer as Record<string, unknown> | undefined
  const rights = answers.find((a) => a.door === 'get_rights')?.answer as Record<string, unknown> | undefined
  const drift: string[] = []
  if (rights) { if (rights.license !== LICENSE.spdx) drift.push(`spdx ${rights.license} vs ${LICENSE.spdx}`); if (rights.licenseAddress !== LICENSE.address) drift.push(`licence address ${rights.licenseAddress} vs ${LICENSE.address}`); if (rights.imprint !== LICENSE.imprint) drift.push(`imprint ${rights.imprint} vs ${LICENSE.imprint}`); if (typeof rights.holder === 'string' && !rights.holder.includes(LICENSE.author)) drift.push(`holder ${rights.holder} vs ${LICENSE.author}`) }
  const licence = answers.find((a) => a.door === 'compute_license')?.answer as { scope?: string; spdx?: string; bill?: { free?: boolean } } | undefined
  const priorArt = answers.find((a) => a.door === 'compute_prior_art')?.answer as { exhibits?: unknown[]; missing?: string[]; author?: string } | undefined
  const due = answers.find((a) => a.door === 'get_due_process')?.answer as { allGuaranteesSealed?: boolean; gaps?: unknown[]; docket?: unknown[]; traitors?: unknown[] } | undefined
  const securityDoors = answers.filter((a) => a.purpose === 'security').map((a) => { const r = (a.answer ?? {}) as Record<string, unknown>; return { door: a.door, refusal: a.refusal ?? null, clean: typeof r.clean === 'boolean' ? r.clean : typeof r.allClear === 'boolean' ? r.allClear : typeof r.conforms === 'boolean' ? r.conforms : typeof r.allHold === 'boolean' ? r.allHold : typeof r.fraudDetected === 'boolean' ? !r.fraudDetected : null, failed: typeof r.failed === 'number' ? r.failed : Array.isArray(r.traitors) ? r.traitors.length : Array.isArray(r.offenders) ? r.offenders.length : null, receipt: typeof r.receipt === 'string' ? r.receipt : null, honest: typeof r.honest === 'string' ? r.honest : '' } })
  const verdicts = findings.reduce<Record<string, number>>((acc, f) => ({ ...acc, [f.verdict ?? (f.refusal ? 'refused' : 'none')]: (acc[f.verdict ?? (f.refusal ? 'refused' : 'none')] ?? 0) + 1 }), {})
  const violations = findings.reduce((n, f) => n + f.violations, 0)
  return { claims: claims.length, findings, verdicts, violations, drift, legalFacts: legal ?? null, rights: rights ? { holder: rights.holder, license: rights.license, licenseAddress: rights.licenseAddress, imprint: rights.imprint, receipt: rights.receipt } : null, licence: licence ? { scope: licence.scope, spdx: licence.spdx, free: licence.bill?.free } : null, priorArt: priorArt ? { exhibits: priorArt.exhibits?.length ?? 0, missing: priorArt.missing?.length ?? 0, author: priorArt.author } : null, dueProcess: due ? { allGuaranteesSealed: due.allGuaranteesSealed, gaps: due.gaps?.length ?? 0, docket: due.docket?.length ?? 0, traitors: due.traitors?.length ?? 0 } : null, securityDoors, security: [...security], securityPassed: security.filter((c) => c.passed).length, securityTotal: security.length, refusals: answers.filter((a) => a.refusal !== undefined).length }
}

const getLegalPage = (a: ReturnType<typeof auditClaims>, plan: { agents: string[]; by: string; absent: string[] }, date: string): string => ['---', 'title: Legal', 'order: 56', '---', '', '# The legal and security audit, through MCP', '',
  `> ${(a.legalFacts as { disclaimer?: string } | null)?.disclaimer ?? LICENSE.disclaimer}`, '', proseFill(PROSE.quantumProcessingToolboxesLegal_s34, date, plan.agents.join(', '), plan.by, plan.absent.length ? `; absent: ${plan.absent.join(', ')}` : '', LICENSE.disclaimer), '',
  `## Claims: ${a.claims}; verdicts ${Object.entries(a.verdicts).map(([k, v]) => `${k} ${v}`).join(', ')}; violations ${a.violations}; refusals ${a.refusals}`, '',
  PROSE.quantumProcessingToolboxesLegal_s35, '|---|---|---|---|---:|---|---|', ...a.findings.map((f) => `| ${f.claim} | ${f.door} | ${f.verdict ?? '—'} | ${f.clean === null ? '—' : f.clean} | ${f.violations} | ${f.receipt ?? '—'} | ${(f.note || f.refusal || '').replace(/\|/g, '\\|')} |`), '',
  '## Rights and drift', '', a.rights ? proseFill(PROSE.quantumProcessingToolboxesLegal_s36, a.rights.holder, a.rights.license, a.rights.licenseAddress, a.rights.imprint, a.rights.receipt, a.drift.length ? `Drift against this tree: ${a.drift.join('; ')}.` : PROSE.quantumProcessingToolboxesLegal_s37) : PROSE.quantumProcessingToolboxesLegal_s38, '',
  '## Licence, prior art, due process', '', proseFill(PROSE.quantumProcessingToolboxesLegal_s39, a.licence ? `${a.licence.scope}, ${a.licence.spdx}, free ${a.licence.free}` : 'not reached', a.priorArt ? proseFill(PROSE.quantumProcessingToolboxesLegal_s40, a.priorArt.exhibits, a.priorArt.missing, a.priorArt.author) : 'not reached', a.dueProcess ? proseFill(PROSE.quantumProcessingToolboxesLegal_s41, a.dueProcess.allGuaranteesSealed, a.dueProcess.docket, a.dueProcess.gaps, a.dueProcess.traitors) : 'not reached'), '',
  '## Security doors of the unit', '', PROSE.quantumProcessingToolboxesLegal_s42, '|---|---|---:|---|---|', ...a.securityDoors.map((d) => `| ${d.door} | ${d.refusal ? `refused: ${d.refusal}` : d.clean === null ? '—' : d.clean} | ${d.failed ?? '—'} | ${d.receipt ?? '—'} | ${d.honest.replace(/\|/g, '\\|')} |`), '',
  `## This tree's security checks: ${a.securityPassed} of ${a.securityTotal}`, '', '| Check | Passed | Evidence |', '|---|---|---|', ...a.security.map((c) => `| ${c.id} | ${c.passed ? '✓' : '✗'} | ${c.evidence.replace(/\|/g, '\\|')} |`), ''].join('\n')

/** Ancient law fused into the court: the foundational codes and Roman maxims, each by name (no URL), mapped to the court mechanism this tree
 *  enacts and the theorem that is its law; the earliest attested dates are given. */
export const ANCIENT_LAW: readonly { id: string; era: string; principle: string; enactedBy: string; theorem: string }[] = [
  { id: 'ur-nammu', era: 'c. 2100 BCE, Sumer', principle: PROSE.quantumProcessingToolboxesLegal_principle43, enactedBy: PROSE.quantumProcessingToolboxesLegal_enactedBy44, theorem: 'textbook_cheap_gates' },
  { id: 'hammurabi', era: 'c. 1754 BCE, Babylon', principle: PROSE.quantumProcessingToolboxesLegal_principle45, enactedBy: PROSE.quantumProcessingToolboxesLegal_enactedBy46, theorem: 'textbook_cheap_gates' },
  { id: 'twelve-tables', era: '451 BCE, Rome', principle: PROSE.quantumProcessingToolboxesLegal_principle47, enactedBy: PROSE.quantumProcessingToolboxesLegal_enactedBy48, theorem: 'textbook_cheap_gates' },
  { id: 'corpus-juris-civilis', era: '529–534 CE, Byzantium', principle: PROSE.quantumProcessingToolboxesLegal_principle49, enactedBy: PROSE.quantumProcessingToolboxesLegal_enactedBy50, theorem: 'textbook_court_audits_repo' },
  { id: 'audi-alteram-partem', era: 'Roman maxim', principle: PROSE.quantumProcessingToolboxesLegal_principle51, enactedBy: PROSE.quantumProcessingToolboxesLegal_enactedBy52, theorem: 'textbook_denier_identified' },
  { id: 'nemo-iudex-in-causa-sua', era: 'Roman maxim', principle: PROSE.quantumProcessingToolboxesLegal_principle53, enactedBy: PROSE.quantumProcessingToolboxesLegal_enactedBy54, theorem: 'textbook_denier_identified' },
  { id: 'nulla-poena-sine-lege', era: 'Roman maxim', principle: 'no penalty without a law', enactedBy: PROSE.quantumProcessingToolboxesLegal_enactedBy55, theorem: 'textbook_cheap_gates' },
  { id: 'ei-incumbit-probatio', era: 'Roman maxim', principle: PROSE.quantumProcessingToolboxesLegal_principle56, enactedBy: PROSE.quantumProcessingToolboxesLegal_enactedBy57, theorem: 'legal_only_the_proven_is_admitted' },
  { id: 'res-judicata', era: 'Roman maxim', principle: PROSE.quantumProcessingToolboxesLegal_principle58, enactedBy: PROSE.quantumProcessingToolboxesLegal_enactedBy59, theorem: 'textbook_court_audits_repo' },
]

const legal = defineTool('legal', {
  name: 'legal',
  description: PROSE.quantumProcessingToolboxesLegal_description60,
  inputSchema: { type: 'object', properties: { now: { type: 'number', description: PROSE.quantumProcessingToolboxesLegal_description61 }, texts: { type: 'object', description: '{ readme, citation, zenodo, package, worker, billing, hmac, mcp }: the texts of the tree' }, discovery: { type: 'object' }, agents: { type: 'array', items: { type: 'string' }, description: PROSE.quantumProcessingToolboxesLegal_description62 }, theoremKeys: { type: 'array', items: { type: 'string' } }, citeTheorem: { type: 'string', description: PROSE.quantumProcessingToolboxesLegal_description63 }, answers: { type: 'array', items: { type: 'object' } }, court: { description: PROSE.quantumProcessingToolboxesLegal_description64 }, ancient: { description: PROSE.quantumProcessingToolboxesLegal_description65 }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (isObj(args.court)) return summonCourt(args.court as Summons)
    if (args.court === true) return { rules: COURT_RULES, count: COURT_RULES.length, theorem: 'textbook_cheap_gates', says: PROSE.quantumProcessingToolboxesLegal_says66 }
    if (args.ancient) return { laws: ANCIENT_LAW, count: ANCIENT_LAW.length, duty: 'legal_only_the_proven_is_admitted', theorem: 'textbook_cheap_gates', says: PROSE.quantumProcessingToolboxesLegal_says67 }
    if (isObj(args.court)) return summonCourt(args.court as Summons)
    const texts = (args.texts ?? {}) as Texts
    const claims = listClaims(texts, ctx.leads, { theorem: typeof args.citeTheorem === 'string' ? args.citeTheorem : null })
    const security = checkLegalSecurity(texts)
    const plan = planLegal(claims, (args.discovery as Discovery | undefined) ?? null, Array.isArray(args.agents) ? args.agents.map(String) : null, Array.isArray(args.theoremKeys) ? args.theoremKeys.map(String) : [])
    if (!Array.isArray(args.answers)) return { phase: 'plan' as const, claims: claims.length, calls: plan.calls.length, agents: plan.agents.length, by: plan.by, securityPassed: security.filter((c) => c.passed).length, securityTotal: security.length, claimList: claims, plan, security }
    const audit = auditClaims(claims, args.answers as Answer[], security)
    const date = stamp(typeof args.now === 'number' ? args.now : undefined) // the clock the client names (now), so the audit is a function of its arguments
    // Tampering impossible by computation: every input is named by its SHA-256, the audit by its content address; change a source
    // or an answer and the address changes; recompute and compare (the verify tool) and the difference is the tampering.
    const inputs = { texts: Object.fromEntries(Object.entries(texts).filter(([, t]) => typeof t === 'string').map(([k, t]) => [k, hex(sha256(utf8(t as string)))])), discovery: args.discovery ? hex(sha256(utf8(JSON.stringify(args.discovery)))) : null, theoremKeys: hex(sha256(utf8(JSON.stringify(args.theoremKeys ?? [])))), answers: hex(sha256(utf8(JSON.stringify(args.answers)))) }
    const content = JSON.stringify({ inputs, audit, agents: plan.agents, by: plan.by })
    const id = uuid(content)
    return { phase: 'audit' as const, id, sha256: hex(sha256(utf8(content))), inputs, claims: audit.claims, violations: audit.violations, refusals: audit.refusals, drift: audit.drift.length, securityPassed: audit.securityPassed, securityTotal: audit.securityTotal, by: plan.by, audit, page: getLegalPage(audit, plan, date) }
  },
  widget: flowWidget,
})

const FIXTURE_TEXTS: Texts = { citation: 'cff-version: 1.2.0\ntitle: QPU\nauthors:\n  - family-names: Rouschev\n    given-names: Tsvetan\n    orcid: https://orcid.org/0009-0000-7312-9778\nlicense: CC-BY-NC-ND-4.0\n', zenodo: '{"creators":[{"name":"Rouschev, Tsvetan","orcid":"0009-0000-7312-9778"}],"license":"cc-by-nc-nd-4.0","title":"QPU"}', package: '{"name":"@uuidna/qpu","version":"1.4.0","license":"CC-BY-NC-ND-4.0","author":{"name":"Tsvetan Rouschev"}}', readme: '| Measure | Value |\n|---|---:|\n| Tests | 152 pass |\n', worker: PROSE.quantumProcessingToolboxesLegal_worker68, billing: 'verifySignature(secret) sameHex(expected, v1)', hmac: 'export const sameHex = (a, b) => { let d = 0; d |= a.charCodeAt(i) ^ b.charCodeAt(i) }', mcp: 'const BALANCER = new Map()' }

/** The competitions with prizes and funding, their rules read at the source (2026-10-26) and judged against this tree's own evidence on every run:
 * a rule is satisfied, pending (the author's act), closed (the window has passed) or open (a lead). Nothing is claimed won; what the rules
 * require and what the tree holds are stated, and the gap is the author's act or a lead. */
type Rule = { rule: string; needs: string; status: 'satisfied' | 'pending' | 'closed' | 'open'; evidence: string; act?: string }
export const COMPETITIONS = TABLES.COMPETITIONS as readonly { id: string; name: string; prize: string; rules: string; read: string; kind: 'prize' | 'funding'; entry: 'open' | 'closed' | 'rolling' | 'unknown'; note: string; /** the competitors: who else is in, as the public page measures it (never claimed) */ competitors: { source: string; read: string; measured: string; known: readonly string[] }; requires: readonly Omit<Rule, 'status' | 'evidence'>[] }[]
/** The registry's MCPs for grants and funding (2026-10-26: grant 20, funding 20, competition 2, prize 0, hackathon 0): proposed, extended by the discover step through the lead, never called here. */
export const FUNDING_MCPS = TABLES.FUNDING_MCPS
/** A competition's window read from its page: "Registration opens on <date>, and closes on <date>" → open, closed or upcoming at `now`; "applications are open" → open; nothing read → unknown. Autonomy: the entry state is measured from the page on every run, never hand-set. */
const getEntryWindow = (text: string, now: number): { entry: 'open' | 'closed' | 'upcoming' | 'unknown'; opens: string | null; closes: string | null; says: string } => {
  const m = /[Rr]egistration opens on ([A-Z][a-z]+ \d{1,2}, \d{4}),? and closes on ([A-Z][a-z]+ \d{1,2}, \d{4})/.exec(text)
  if (m) { const opens = Date.parse(`${m[1]!} UTC`); const closes = Date.parse(`${m[2]!} UTC`) + 86_399_000; /* the day the window closes counts whole, in UTC */ const entry = now < opens ? 'upcoming' : now > closes ? 'closed' : 'open'; return { entry, opens: new Date(opens).toISOString().slice(0, 10), closes: new Date(closes).toISOString().slice(0, 10), says: proseFill(PROSE.quantumProcessingToolboxesLegal_says69, m[1], m[2], entry, new Date(now).toISOString().slice(0, 10)) } }
  if (/applications? (?:are|is) (?:now |currently )?open/i.test(text)) return { entry: 'open', opens: null, closes: null, says: PROSE.quantumProcessingToolboxesLegal_says70 }
  if (/applications? (?:are|is) (?:now |currently )?closed/i.test(text)) return { entry: 'closed', opens: null, closes: null, says: PROSE.quantumProcessingToolboxesLegal_says71 }
  return { entry: 'unknown', opens: null, closes: null, says: text ? 'the page names no window' : 'no page read' }
}
/** Every competition judged: each rule's status from the tree's evidence (theorems kernel-accepted, hosts deployed, licence, no publication), nothing claimed. */
/** To win, know the competitors as well as the theorems: a competition is known when both are (textbook_compete_knows: the product is
 *  positive only when neither is empty); the competitors as the public page measures them, the theorems the tree carries for it. */
export const knowCompetition = (c: (typeof COMPETITIONS)[number]) => {
  const theorems = TEXTBOOK_THEOREMS.filter((t) => t.examples.includes('compete-rules') || (c.id === 'clay-millennium' && /clay|sigma|relation|triad/.test(t.key))).map((t) => t.key)
  return { competitors: c.competitors.known.length, source: c.competitors.source, read: c.competitors.read, measured: c.competitors.measured, theorems, both: c.competitors.known.length > 0 && theorems.length > 0, says: c.competitors.known.length ? 'known from the page' : PROSE.quantumProcessingToolboxesLegal_s72 }
}
// Every prize prose made a computable value via the billing currencies: the amount, its currency and basis (purse/fund/per-problem to win,
// invested, or none). Only a winnable basis counts to a total; invested and non-monetary are 0.
const CURRENCY_OF: Record<string, string> = { USD: 'usd', '$': 'usd', EUR: 'eur', '€': 'eur', GBP: 'gbp', '£': 'gbp' }
export const prize = (prose: string): { value: number; currency: string; basis: 'purse' | 'fund' | 'per-problem' | 'invested' | 'none'; says: string } => {
  const m = /(USD|EUR|GBP|\$|€|£)\s*([0-9][0-9  ,.]*)\s*(million|billion)?/i.exec(prose)
  if (!m) return { value: 0, currency: 'usd', basis: 'none', says: PROSE.quantumProcessingToolboxesLegal_says73 }
  let value = parseFloat(m[2]!.replace(/[  ,]/g, '')); const scale = /billion/i.test(m[3] ?? '') ? 1e9 : /million/i.test(m[3] ?? '') ? 1e6 : 1; value *= scale
  const currency = CURRENCY_OF[m[1]!.toUpperCase()] ?? CURRENCY_OF[m[1]!] ?? 'usd'
  if (/invest|venture capital|access to .{0,30}(capital|partners)/i.test(prose)) return { value: 0, currency, basis: 'invested', says: proseFill(PROSE.quantumProcessingToolboxesLegal_says74, m[0]) }
  const per = /per (?:problem|milestone|pinnacle)[^.]*?\b(seven|six|five|four|three|two|\d+)\b/i.exec(prose)
  if (per) { const k = ({ two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7 } as Record<string, number>)[per[1]!.toLowerCase()] ?? (parseInt(per[1]!) || 1); return { value: value * k, currency, basis: 'per-problem', says: `${m[0]} per problem × ${k}` } }
  return { value, currency, basis: /\bfund\b/i.test(prose) ? 'fund' : 'purse', says: m[0] }
}

const judgeCompetitions = (evidence: { theorems: number; kernel: number; hosts: number; licence: string; published: boolean; pushed: boolean; conduct?: boolean; acceptance?: ReturnType<typeof countMentions> | null }, pages: Record<string, string> = {}, now = 0) => {
  const judged = COMPETITIONS.map((c0) => {
    // the window measured from the page when a page was read: the fixture's entry stands only until then
    const w = pages[c0.id] ? getEntryWindow(pages[c0.id]!, clock(now || undefined)) : null
    const c = w && w.entry !== 'unknown' ? { ...c0, entry: w.entry === 'upcoming' ? 'closed' as const : w.entry, window: w } : { ...c0, window: w }
    const rules: Rule[] = c.requires.map((r) => {
      // a rule the page states that the tree fails as it stands (its licence, its age, its author alone): closed until the author's act changes it;
      // one only to check stays pending with the flag as its evidence
      if (/^FLAG:/.test(r.needs ?? '')) return { ...r, status: 'closed' as const, evidence: r.needs }
      if (/^FLAG to check:/.test(r.needs ?? '')) return { ...r, status: 'pending' as const, evidence: r.needs }
      if (/registration|application in a cohort/.test(r.rule)) return c.entry === 'closed' ? { ...r, status: 'closed' as const, evidence: c.window?.says ?? c.note } : c.entry === 'open' ? { ...r, status: 'pending' as const, evidence: c.window?.says ?? c.note, act: `open: ${r.act ?? 'the author registers'}` } : { ...r, status: 'pending' as const, evidence: c.window?.says ?? c.note }
      if (/hosted on Vercel|deployed on Vercel/.test(r.rule)) return { ...r, status: 'pending' as const, evidence: PROSE.quantumProcessingToolboxesLegal_evidence75 }
      if (/open source project/.test(r.rule)) return { ...r, status: evidence.pushed ? 'satisfied' as const : 'pending' as const, evidence: `${evidence.licence}; the repository is ${evidence.pushed ? 'public' : PROSE.quantumProcessingToolboxesLegal_s76}` }
      if (/solution of one of the seven/.test(r.rule)) return { ...r, status: 'open' as const, evidence: proseFill(PROSE.quantumProcessingToolboxesLegal_evidence77, evidence.theorems, evidence.kernel, PRECEDENCE[0]!.doi, evidence.acceptance ? proseFill(PROSE.quantumProcessingToolboxesLegal_s78, evidence.acceptance.total, Object.keys(evidence.acceptance.bySource).length) : '') }
      if (/general acceptance/.test(r.rule)) return { ...r, status: 'pending' as const, evidence: evidence.acceptance ? proseFill(PROSE.quantumProcessingToolboxesLegal_s79, evidence.acceptance.total, evidence.acceptance.reachable, evidence.acceptance.of, Object.entries(evidence.acceptance.bySource).map(([k, v]) => `${k} ${v}`).join(', ')) : PROSE.quantumProcessingToolboxesLegal_s80, act: PROSE.quantumProcessingToolboxesLegal_act81 }
      if (/published/.test(r.rule)) return { ...r, status: evidence.published ? 'satisfied' as const : 'pending' as const, evidence: evidence.published ? 'published' : PROSE.quantumProcessingToolboxesLegal_s141 }
      if (/AI live in production/.test(r.rule)) return { ...r, status: 'pending' as const, evidence: PROSE.quantumProcessingToolboxesLegal_evidence82 }
      if (/category impact: Education/.test(r.rule)) return { ...r, status: 'pending' as const, evidence: PROSE.quantumProcessingToolboxesLegal_evidence83 }
      if (/a Code of Conduct/.test(r.rule)) return { ...r, status: evidence.conduct ? 'satisfied' as const : 'pending' as const, evidence: evidence.conduct ? PROSE.quantumProcessingToolboxesLegal_s84 : 'no CODE_OF_CONDUCT in the repository' }
      if (/startup building on Cloudflare Workers/.test(r.rule)) return { ...r, status: 'pending' as const, evidence: proseFill(PROSE.quantumProcessingToolboxesLegal_evidence85, evidence.hosts) }
      return { ...r, status: 'pending' as const, evidence: 'the author\'s act' }
    })
    const counts = rules.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {})
    // the coin cost of the evidence: every theorem the tree carries for the competition served as a coin through textbook { theorem }, booked in
    // the ledger beside the prize as its page states it; a cost, never a claim: no prize is won and no problem solved by booking it
    const know = knowCompetition(c0)
    const ledger = createLedger(know.theorems.map((theorem) => ({ tool: 'textbook', tenant: 'author', arguments: { theorem } })))
    const economics = { prize: c.prize, evidence: know.theorems.length, calls: know.theorems.map((theorem) => ({ name: 'textbook', arguments: { theorem } })), coins: ledger.coins, coils: ledger.coils, costMillicents: ledger.debits, balanced: ledger.balanced, says: proseFill(PROSE.quantumProcessingToolboxesLegal_says86, know.theorems.length, ledger.coins, ledger.debits, c.prize), theorem: 'textbook_double_entry' }
    return { ...c, prizeValue: prize(c.prize), rules, counts, know, economics, satisfied: `${counts.satisfied ?? 0}/${rules.length}`, enterable: c.entry !== 'closed' && rules.every((r) => r.status !== 'open' && r.status !== 'closed'), ready: rules.every((r) => r.status === 'satisfied') }
  })
  const neighbours = competeProgramNeighbours('a1b2c3d4')
  return { precedence: PRECEDENCE, acceptance: evidence.acceptance ?? null, news: { apis: NEWS_APIS.length, open: NEWS_APIS.filter((a) => a.open).length, keyed: NEWS_APIS.filter((a) => !a.open).map((a) => ({ id: a.id, key: a.key })) }, prizeTotals: (() => { const w = judged.map((j) => j.prizeValue).filter((x) => x.basis === 'purse' || x.basis === 'fund' || x.basis === 'per-problem'); const byCurrency = w.reduce((a2, x) => ({ ...a2, [x.currency]: (a2[x.currency] ?? 0) + x.value }), {} as Record<string, number>); return { winnable: w.length, byCurrency, basis: judged.reduce((a2, j) => ({ ...a2, [j.prizeValue.basis]: (a2[j.prizeValue.basis] ?? 0) + 1 }), {} as Record<string, number>), rateSources: RATE_SOURCES.length, convert: (rates: Record<string, { rate: number }>) => convertAmounts(byCurrency.usd ?? 0, rates), theorem: 'textbook_prizes_computable', says: Object.entries(byCurrency).map(([k, v]) => k + ' ' + v.toLocaleString('en-US')).join(', ') + ' across ' + w.length + PROSE.quantumProcessingToolboxesLegal_s87 } })(), competitions: judged, neighbours: { law: neighbours.law, handle: neighbours.handle, competitions: neighbours.competitions, holding: neighbours.holding, reflect: neighbours.reflect.holds, holds: neighbours.holds, says: neighbours.says }, know: { competitors: judged.reduce((n, c) => n + c.know.competitors, 0), theorems: new Set(judged.flatMap((c) => c.know.theorems)).size, both: judged.filter((c) => c.know.both).map((c) => c.id), says: PROSE.quantumProcessingToolboxesLegal_says88 }, prizes: judged.filter((c) => c.kind === 'prize').length, funding: judged.filter((c) => c.kind === 'funding').length, enterable: judged.filter((c) => c.enterable).map((c) => c.id), ready: judged.filter((c) => c.ready).map((c) => c.id), says: PROSE.quantumProcessingToolboxesLegal_says89, closed: judged.filter((c) => c.entry === 'closed').map((c) => c.id), relatedMcps: FUNDING_MCPS, honest: PROSE.quantumProcessingToolboxesLegal_honest90, internalCompetition: PROSE.quantumProcessingToolboxesLegal_internalCompetition91 }
}

const compete = defineTool('legal', {
  name: 'compete',
  description: PROSE.quantumProcessingToolboxesLegal_description92,
  inputSchema: { type: 'object', properties: { conduct: { type: 'boolean', description: PROSE.quantumProcessingToolboxesLegal_description93 }, claim: { description: PROSE.quantumProcessingToolboxesLegal_description94 }, news: { type: 'boolean', description: PROSE.quantumProcessingToolboxesLegal_description95 }, mentions: { type: 'array', items: { type: 'object' }, description: PROSE.quantumProcessingToolboxesLegal_description96 }, pages: { type: 'object', description: PROSE.quantumProcessingToolboxesLegal_description97 }, now: { type: 'number', description: PROSE.quantumProcessingToolboxesLegal_description98 }, published: { type: 'boolean', description: PROSE.quantumProcessingToolboxesLegal_description99 }, pushed: { type: 'boolean', description: PROSE.quantumProcessingToolboxesLegal_description100 }, hosts: { type: 'integer' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (isObj(args.claim)) return claimNovelty(args.claim)
    if (args.claim) { const requests = createNewsRequests(); return { op: 'claim' as const, orcid: LICENSE.orcid, precedence: PRECEDENCE.map((p) => ({ doi: p.doi, title: p.title, year: p.year, orcid: LICENSE.orcid })), newsRequests: requests.length, release: { via: 'github-actions', article: PROSE.quantumProcessingToolboxesLegal_article101, workflow: 'publish' }, says: PROSE.quantumProcessingToolboxesLegal_says102 } }
    if (args.news) { const requests = createNewsRequests(); return { op: 'news' as const, apis: NEWS_APIS, open: NEWS_APIS.filter((a) => a.open).map((a) => a.id), keyed: NEWS_APIS.filter((a) => !a.open).map((a) => ({ id: a.id, key: a.key })), records: PRECEDENCE.length, requests: requests.length, requestList: requests, says: PROSE.quantumProcessingToolboxesLegal_says103 } }
    return judgeCompetitions({ theorems: THEOREMS.length, kernel: KERNEL_THEOREMS, hosts: typeof args.hosts === 'number' ? args.hosts : 3, licence: LICENSE.spdx, published: args.published === true, pushed: args.pushed === true, conduct: args.conduct === true, acceptance: Array.isArray(args.mentions) ? countMentions(args.mentions as { id: string; status: number; text: string }[]) : null }, isObj(args.pages) ? args.pages as Record<string, string> : {}, typeof args.now === 'number' ? args.now : 0)
  },
  widget: flowWidget,
})

/** Every patent API found and measured (2026-10-26): what answers in the open, what takes a key (named, never valued), what refuses an automated read. */
export const PATENT_APIS = TABLES.PATENT_APIS as readonly { id: string; name: string; url: string; open: boolean; key: string | null; measured: string; format: 'google-xhr' | 'epo-dates-html' | 'json' | 'xml' }[]
/** The registry\'s patent MCPs (2026-10-26: patent 20, patents 13, uspto 7; remotes marked by the discover step): proposed, never called here. */
export const PATENT_MCPS = TABLES.PATENT_MCPS
type Patent = { number: string; title: string; priority: string | null; filing: string | null; publication: string | null; grant: string | null; assignee: string | null; inventor: string | null; office: string; kind: string | null }
/** A patent number read: the office (the two letters), the kind code; US, EP, WO, CN and the rest. */
const getPatentNumber = (n: string): { office: string; kind: string | null; wellFormed: boolean } => {
  const m = /^([A-Z]{2})(\d+)([A-Z]\d?)?$/.exec(n)
  if (!m) return { office: n.slice(0, 2), kind: null, wellFormed: false }
  const office = m[1]!; const digits = m[2]!; const kind = m[3] ?? null
  const wellFormed = office === 'US' ? /^\d{7,8}$|^\d{11}$/.test(digits) : office === 'EP' ? /^\d{7}$/.test(digits) : office === 'WO' ? /^\d{10}$/.test(digits) : digits.length >= 6
  return { office, kind, wellFormed }
}
/** Google Patents\' answer read into patents: the )]}\' prefix stripped, every cluster\'s results taken. */
const listPatents = (text: string): { total: number; patents: Patent[] } | { error: string } => {
  try {
    const j = JSON.parse(text.replace(/^\)\]\}'\n?/, '')) as { results?: { total_num_results?: number; cluster?: { result?: { patent?: Record<string, string> }[] }[] } }
    const r = j.results ?? {}
    const patents: Patent[] = (r.cluster ?? []).flatMap((c) => c.result ?? []).map((x) => x.patent).filter((p): p is Record<string, string> => !!p).map((p) => { const n = getPatentNumber(p.publication_number ?? ''); return { number: p.publication_number ?? '', title: (p.title ?? '').replace(/<[^>]+>/g, '').trim(), priority: p.priority_date || null, filing: p.filing_date || null, publication: p.publication_date || null, grant: p.grant_date || null, assignee: p.assignee || null, inventor: p.inventor || null, office: n.office, kind: n.kind } })
    return { total: r.total_num_results ?? 0, patents }
  } catch (e) { return { error: (e as Error).message } }
}
const toDay = (d: string | null): number | null => (d ? Math.floor(Date.parse(d + 'T00:00:00Z') / 86_400_000) : null)
/** The theorems over patents, verified on every patent read: the dates are ordered (priority ≤ filing ≤ publication, filing ≤ grant), the number is well formed for its office, and a granted patent\'s term ends twenty years after its filing (US utility, EP: Art. 63 EPC): every violation is named, never hidden. */
const checkPatentTheorems = (patents: readonly Patent[]): { checked: number; passed: number; violations: { number: string; theorem: string; says: string }[]; byTheorem: Record<string, { passed: number; failed: number }> } => {
  const violations: { number: string; theorem: string; says: string }[] = []
  const byTheorem: Record<string, { passed: number; failed: number }> = {}
  const tally = (t: string, ok: boolean, number: string, says: string) => { byTheorem[t] = byTheorem[t] ?? { passed: 0, failed: 0 }; if (ok) byTheorem[t]!.passed += 1; else { byTheorem[t]!.failed += 1; violations.push({ number, theorem: t, says }) } }
  for (const p of patents) {
    const pr = toDay(p.priority), fi = toDay(p.filing), pu = toDay(p.publication), gr = toDay(p.grant)
    if (pr !== null && fi !== null) tally('textbook_patent_dates_ordered', pr <= fi, p.number, `priority ${p.priority} after filing ${p.filing}`)
    if (fi !== null && pu !== null) tally('textbook_patent_dates_ordered', fi <= pu, p.number, `filing ${p.filing} after publication ${p.publication}`)
    if (fi !== null && gr !== null) tally('textbook_patent_dates_ordered', fi <= gr, p.number, `filing ${p.filing} after grant ${p.grant}`)
    tally('textbook_patent_number_well_formed', getPatentNumber(p.number).wellFormed, p.number, proseFill(PROSE.quantumProcessingToolboxesLegal_s104, p.office))
    if (fi !== null && gr !== null && (p.office === 'US' || p.office === 'EP')) { const term = new Date(Date.parse(p.filing! + 'T00:00:00Z')); term.setUTCFullYear(term.getUTCFullYear() + 20); tally('textbook_patent_term_twenty_years', gr < Math.floor(term.getTime() / 86_400_000), p.number, proseFill(PROSE.quantumProcessingToolboxesLegal_s105, p.grant, p.filing)) }
  }
  const checked = Object.values(byTheorem).reduce((n, t) => n + t.passed + t.failed, 0)
  return { checked, passed: checked - violations.length, violations, byTheorem }
}
const GOOGLE_FIXTURE = ")]}'\n" + JSON.stringify({ results: { total_num_results: 2, cluster: [{ result: [{ patent: { publication_number: 'US12242926B2', title: 'Quantum system <b>controller</b>', priority_date: '2021-08-19', filing_date: '2024-02-12', grant_date: '2025-03-04', publication_date: '2025-03-04', inventor: 'Ciaran Ryan-Anderson', assignee: 'Quantinuum Llc' } }, { patent: { publication_number: 'EP1234567B1', title: 'Another', priority_date: '2020-01-01', filing_date: '2019-12-31', grant_date: '2041-01-01', publication_date: '2021-07-01', inventor: 'x', assignee: 'y' } }] }] } })

const patents = defineTool('legal', {
  name: 'patents',
  description: PROSE.quantumProcessingToolboxesLegal_description106,
  inputSchema: { type: 'object', properties: { op: { type: 'string', enum: ['plan', 'read'] }, query: { type: 'string', description: PROSE.quantumProcessingToolboxesLegal_description107 }, queries: { type: 'array', items: { type: 'string' } }, count: { type: 'integer', minimum: 1, description: PROSE.quantumProcessingToolboxesLegal_description108 }, answers: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, query: { type: 'string' }, text: { type: 'string' } } } }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    const op = String(args.op ?? 'plan')
    const queries = Array.isArray(args.queries) && args.queries.length ? args.queries.map(String) : [String(args.query ?? 'quantum error correction')]
    const count = typeof args.count === 'number' ? Math.max(1, Math.floor(args.count)) : 100 // no cap here: the host's own page size bounds an answer, and the client pages
    if (op === 'plan') return { op, apis: PATENT_APIS, open: PATENT_APIS.filter((a) => a.open).map((a) => a.id), keyed: PATENT_APIS.filter((a) => !a.open).map((a) => ({ id: a.id, key: a.key })), requests: [...queries.map((q) => ({ id: `patents:google:${q}`, api: 'google-patents', query: q, method: 'GET' as const, url: `https://patents.google.com/xhr/query?url=${encodeURIComponent(`q=${q.replace(/\s+/g, '+')}&num=${count}`)}`, accept: 'application/json' })), { id: 'patents:epo-dates', api: 'epo-publication-server', query: null, method: 'GET' as const, url: PATENT_APIS[1]!.url, accept: 'text/html' }], relatedMcps: PATENT_MCPS, theorems: ['textbook_patent_dates_ordered', 'textbook_patent_number_well_formed', 'textbook_patent_term_twenty_years'] }
    if (op !== 'read') throw new Error(`op ${op} is not plan or read`)
    const answers = (Array.isArray(args.answers) ? args.answers : []) as { id: string; query?: string; text: string }[]
    const byQuery = answers.filter((a) => a.id.startsWith('patents:google:')).map((a) => ({ query: a.query ?? a.id.replace('patents:google:', ''), ...listPatents(String(a.text ?? '')) }))
    const epo = answers.find((a) => a.id === 'patents:epo-dates')
    // the EPO lists its dates as publication-dates/YYYYMMDD (measured 2026-10-26: 20261021, 20261014, 20261007 …)
    const epoDates = epo ? [...new Set((String(epo.text).match(/publication-dates\/(20\d{6})/g) ?? []).map((m) => m.slice(-8)))] : []
    const all = byQuery.flatMap((q) => ('patents' in q ? q.patents : []))
    const theorems = checkPatentTheorems(all)
    return { op, queries: byQuery.map((q) => ({ query: q.query, ...('error' in q ? { error: q.error } : { total: q.total, read: q.patents.length }) })), patents: all, offices: all.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.office]: (acc[p.office] ?? 0) + 1 }), {}), epoPublicationDates: epoDates.length, theorems, says: proseFill(PROSE.quantumProcessingToolboxesLegal_says109, all.length, byQuery.length, byQuery.length === 1 ? 'y' : 'ies', theorems.checked, theorems.violations.length, epoDates.length) }
  },
  widget: flowWidget,
})

export const LEGAL: Toolbox = {
  name: 'legal',
  idea: PROSE.quantumProcessingToolboxesLegal_idea110,
  tools: [legal, compete, patents],
  examples: [
    { id: 'patents-plan', tool: 'patents', theorem: 'textbook_patent_apis_partition', arguments: { op: 'plan', query: 'quantum error correction', count: 10 }, shows: PROSE.quantumProcessingToolboxesLegal_shows111, expect: (s) => (s.apis.length === 7 && s.open.length === 2 && s.requests.length === 2 && s.theorems.length === 3 ? null : JSON.stringify(s.open)) },
    { id: 'patents-read', tool: 'patents', theorem: 'textbook_patent_dates_ordered', arguments: { op: 'read', answers: [{ id: PROSE.quantumProcessingToolboxesLegal_id112, query: 'quantum error correction', text: GOOGLE_FIXTURE }] }, shows: PROSE.quantumProcessingToolboxesLegal_shows113, expect: (s) => (s.patents.length === 2 && s.theorems.violations.length === 2 && s.theorems.byTheorem.textbook_patent_dates_ordered.failed === 1 && s.theorems.byTheorem.textbook_patent_term_twenty_years.failed === 1 ? null : JSON.stringify(s.theorems)) },
    { id: 'compete-news-plan', tool: 'compete', theorem: 'textbook_news_adapters', arguments: { news: true }, shows: PROSE.quantumProcessingToolboxesLegal_shows114, expect: (s) => (s.op === 'news' && s.apis.length === NEWS_APIS.length && s.open.length + s.keyed.length === s.apis.length && s.open.length === NEWS_APIS.filter((a) => a.open).length && s.requests === s.open.length * s.records && s.requestList.every((r: { url: string }) => r.url.startsWith('https://')) ? null : JSON.stringify({ apis: s.apis.length, requests: s.requests })) },
    { id: 'compete-mentions', tool: 'compete', theorem: 'textbook_mentions_by_source', arguments: { mentions: [{ id: 'hn-algolia:10.5281/zenodo.21781602', status: 200, text: '{"nbHits":3}' }, { id: 'crossref-events:10.5281/zenodo.23156998', status: 200, text: '{"message":{"total-results":2}}' }, { id: 'gdelt:10.5281/zenodo.22700098', status: 503, text: '' }] }, shows: PROSE.quantumProcessingToolboxesLegal_shows115, expect: (s) => (s.acceptance.total === 5 && s.acceptance.reachable === 2 && s.acceptance.of === 3 && s.acceptance.byRecord['10.5281/zenodo.21781602'] === 3 && s.competitions.find((c: { id: string }) => c.id === 'clay-millennium').rules.some((r: { rule: string; evidence: string }) => /general acceptance/.test(r.rule) && /5 mentions/.test(r.evidence)) ? null : JSON.stringify(s.acceptance)) },
    { id: 'compete-rules', tool: 'compete', theorem: 'textbook_clay_conditions', arguments: {}, shows: PROSE.quantumProcessingToolboxesLegal_shows116, expect: (s) => (s.competitions.length > 0 && s.closed.includes('xprize-quantum-applications') && s.competitions[0].rules[0].status === 'open' && s.enterable.every((id: string) => s.competitions.find((c: { id: string }) => c.id === id).rules.every((r: { needs?: string }) => !/^FLAG:/.test(r.needs ?? ''))) && s.closed.includes('gemini-xprize-hackathon') && s.ready.length === 0 && s.know.competitors > 0 && s.know.theorems > 0 && s.competitions.every((c: { competitors: { source: string } }) => c.competitors.source.startsWith('https://')) ? null : JSON.stringify(s.competitions.map((c: { id: string; satisfied: string; enterable: boolean }) => [c.id, c.satisfied, c.enterable]))) },
    { id: 'legal-audit-offline', tool: 'legal', theorem: 'textbook_uuid_is_36', arguments: { texts: FIXTURE_TEXTS, answers: [] }, shows: PROSE.quantumProcessingToolboxesLegal_shows117, expect: (s) => (s.phase === 'audit' && typeof s.id === 'string' && s.id.length === 36 && s.sha256.length === 64 && s.inputs.texts.worker?.length === 64 && s.securityPassed === s.securityTotal ? null : `${s.phase} ${s.id} ${s.securityPassed}/${s.securityTotal}`) },
    { id: 'legal-court', tool: 'legal', theorem: 'textbook_cheap_gates', arguments: { court: { gate: 'DELETE /docket/70a13419-52d5-8e4c-9f1b-3c0d2e1f4a5b', status: 409, evidence: { refs: 2 }, tenant: 'psg' } }, shows: PROSE.quantumProcessingToolboxesLegal_shows118, expect: (s) => (s.rule === 'links' && s.theorem === 'textbook_licence_chain' && /^[0-9a-f-]{36}$/.test(s.case) && s.via.file.tool === 'legal' && s.via.appeal.tool === 'match' && s.tenant === 'psg' && s.theorems.includes('textbook_cheap_gates') ? null : JSON.stringify(s)) },
    { id: 'legal-court-rules', tool: 'legal', theorem: 'textbook_cheap_gates', arguments: { court: true }, shows: PROSE.quantumProcessingToolboxesLegal_shows119, expect: (s) => (s.count === TABLES.COURT_RULES.length && s.rules.every((r: { theorem: string; remedy: string }) => r.theorem.startsWith('textbook_') && r.remedy.length > 0) ? null : String(s.count)) },
    { id: 'legal-court-role', tool: 'legal', theorem: 'textbook_rest_rbac', arguments: { court: { gate: 'rest', status: 401 } }, shows: PROSE.quantumProcessingToolboxesLegal_shows141, expect: (s) => (s.rule === 'role' && s.theorem === 'textbook_rest_rbac' ? null : JSON.stringify({ rule: s.rule, theorem: s.theorem })) },
    { id: 'legal-court-collision', tool: 'legal', theorem: 'textbook_edit_collides', arguments: { court: { gate: 'edit', status: 412 } }, shows: PROSE.quantumProcessingToolboxesLegal_shows142, expect: (s) => (s.rule === 'collision' && s.theorem === 'textbook_edit_collides' ? null : JSON.stringify({ rule: s.rule, theorem: s.theorem })) },
    { id: 'legal-court-method', tool: 'legal', theorem: 'textbook_payload_operations', arguments: { court: { gate: 'rest', status: 405 } }, shows: PROSE.quantumProcessingToolboxesLegal_shows143, expect: (s) => (s.rule === 'method' && s.theorem === 'textbook_payload_operations' ? null : JSON.stringify({ rule: s.rule, theorem: s.theorem })) },
    { id: 'legal-court-denier', tool: 'legal', theorem: 'textbook_denier_identified', arguments: { court: { gate: 'fanout to the hosted unit', code: 404, evidence: { host: 'qpu.uuidna.com' }, tenant: 'uuidna' } }, shows: PROSE.quantumProcessingToolboxesLegal_shows120, expect: (s) => (s.denier?.kind === 'external' && /^[0-9a-f-]{36}$/.test(s.denier.id) && s.denier.by.includes('404') && s.case?.length === 36 && Array.isArray(s.grounds) && s.grounds.length === 3 && s.grounds.some((g: { role?: string }) => g.role === 'rights-holder') && s.ruling?.favour === 'the QPU licence' && s.ruling?.validatableVia?.tool === 'legal' ? null : JSON.stringify({ denier: s.denier, grounds: s.grounds?.length, ruling: s.ruling?.favour })) },
    { id: 'legal-court-repo-audit', tool: 'legal', theorem: 'textbook_court_audits_repo', arguments: { court: { gate: 'commit', rule: 'folded' } }, shows: PROSE.quantumProcessingToolboxesLegal_shows121, expect: (s) => (s.repoAudit?.validatableVia?.tool === 'audit' && /nanosecond/i.test(s.repoAudit.nanosecondTasks ?? '') && s.repoAudit.theorem === 'textbook_court_audits_repo' ? null : JSON.stringify(s.repoAudit)) },
    { id: 'legal-plan', tool: 'legal', theorem: 'textbook_legal_plan_calls', arguments: { texts: FIXTURE_TEXTS, discovery: { doors: [{ host: 'uuidna.com', url: UNIT_MCP, name: 'compute_forensics', description: '', takes: ['statement'], required: ['statement'], answers: ['verdict', 'receipt'], readOnly: true, contract: 'catalogue' }, { host: 'uuidna.com', url: UNIT_MCP, name: 'get_rights', description: '', takes: [], required: [], answers: ['receipt'], readOnly: true, contract: 'tools/list' }, { host: 'uuidna.com', url: UNIT_MCP, name: 'audit_security', description: '', takes: [], required: [], answers: ['receipt'], readOnly: true, contract: 'catalogue' }] } }, shows: PROSE.quantumProcessingToolboxesLegal_shows122, expect: (s) => (s.phase === 'plan' && s.claims >= 10 && s.by === 'free-by-default' && s.agents === 3 && s.calls === s.claims + 2 && s.securityPassed === s.securityTotal ? null : `${s.phase} ${s.claims} claims ${s.calls} calls ${s.agents} agents ${s.by} security ${s.securityPassed}/${s.securityTotal}`) },
  ],
  skill: {
    instructions: PROSE.quantumProcessingToolboxesLegal_instructions123,
    directions: [PROSE.quantumProcessingToolboxesLegal_s124, PROSE.quantumProcessingToolboxesLegal_s125, PROSE.quantumProcessingToolboxesLegal_s126],
    selftest: (ctx) => {
      const { check, done } = createChecks()
      const claims = listClaims(FIXTURE_TEXTS, ctx.leads)
      check('legal:claims', claims.some((c) => c.id === 'citation-cff' && c.text.includes('Tsvetan Rouschev')) && claims.some((c) => c.id === 'zenodo-json') && claims.some((c) => c.id === 'package-json') && claims.some((c) => c.id.startsWith('readme-tests')) && claims.filter((c) => c.id.startsWith('perspective-')).length >= 10, `${claims.length} claims: ${claims.slice(0, 8).map((c) => c.id).join(', ')}…`)
      const sec = checkLegalSecurity(FIXTURE_TEXTS)
      check('legal:security-checks', sec.length === 11 && sec.every((c) => c.passed), sec.filter((c) => !c.passed).map((c) => c.id).join(', ') || PROSE.quantumProcessingToolboxesLegal_s127)
      check('legal:security-catches', ([
        { patch: { worker: FIXTURE_TEXTS.worker + " const leaked = 'sk_live_" + 'abcdefghijklmnop' + "'" }, id: 'security:no-live-secret-literal' },
        { patch: { mcp: PROSE.quantumProcessingToolboxesLegal_mcp128 }, id: 'security:keys-stay-in-the-handler' },
        { patch: { worker: FIXTURE_TEXTS.worker!.replace('overrideAccess: false', 'overrideAccess: true') }, id: 'security:writes-need-a-role' },
        { patch: { worker: FIXTURE_TEXTS.worker!.replace('multiTenantPlugin', 'noTenantPlugin') }, id: 'security:tenant-isolation' },
        { patch: { worker: FIXTURE_TEXTS.worker!.replace('webhookSecret', 'noWebhookCheck') }, id: 'security:webhook-verified-before-write' },
        { patch: { worker: FIXTURE_TEXTS.worker!.replace('AbortSignal.timeout(10000)', 'nothing') }, id: 'security:timeouts-on-outbound' },
        { patch: { worker: FIXTURE_TEXTS.worker + '\nif (apiKey === token) ok()' }, id: 'security:token-auth-delegated' },
      ] as const).every(({ patch, id }) => !checkLegalSecurity({ ...FIXTURE_TEXTS, ...patch }).find((c) => c.id === id)!.passed), PROSE.quantumProcessingToolboxesLegal_s129)
      const doors = ['compute_forensics', 'verify_claim', 'get_rights', 'get_legal_facts', 'compute_license', 'compute_prior_art', 'get_due_process', 'audit_security'].map((name) => ({ host: 'uuidna.com', url: UNIT_MCP, name, description: '', takes: [] as string[], required: [] as string[], answers: ['verdict'], readOnly: true as boolean | null, contract: 'catalogue' as const }))
      const plan = planLegal(claims, { doors }, null, ['clay_sigma'])
      check('legal:plan-free-by-default', plan.by === 'free-by-default' && plan.calls.length === claims.length * 2 + 6 && plan.calls.some((c) => c.door === 'get_due_process' && (c.arguments.claims as string[]).length === claims.length), proseFill(PROSE.quantumProcessingToolboxesLegal_s130, plan.calls.length, claims.length, plan.agents.length))
      const override = planLegal(claims, { doors }, ['audit_security', 'get_rights', 'not_a_door'], ['clay_sigma'])
      check('legal:plan-operator-override', override.by === 'operator' && override.calls.length === 2 && override.absent.join() === 'not_a_door', PROSE.quantumProcessingToolboxesLegal_s131)
      const answers: Answer[] = [...plan.calls.map((c): Answer => c.purpose === 'forensics' ? { ...c, answer: { verdict: 'UNVERIFIED', clean: true, violations: [], receipt: 'r', note: 'no decidable test' } } : c.purpose === 'verify' ? { ...c, answer: { verdict: 'UNVERIFIED', receipt: 'r2' } } : c.door === 'get_rights' ? { ...c, answer: { holder: `${LICENSE.author} (https://qpu.uuidna.com)`, license: LICENSE.spdx, licenseAddress: LICENSE.address, imprint: 'other-imprint', receipt: 'r3' } } : c.door === 'audit_security' ? { ...c, answer: { checks: 7, passed: 7, failed: 0, receipt: 'r4' } } : c.door === 'compute_prior_art' ? { ...c, refusal: PROSE.quantumProcessingToolboxesLegal_refusal132 } : { ...c, answer: { receipt: 'r5' } })]
      const audit = auditClaims(claims, answers, sec)
      check('legal:audit-read', audit.findings.length === claims.length * 2 && audit.verdicts.UNVERIFIED === claims.length * 2 && audit.violations === 0 && audit.drift.length === 1 && audit.drift[0]!.startsWith('imprint') && audit.refusals === 1 && audit.securityDoors.find((d) => d.door === 'audit_security')?.failed === 0, `${audit.findings.length} findings, drift ${audit.drift.join('; ')}, refusals ${audit.refusals}`)
      // an agnostic host (list_tools and call_tool) hands each door's result back as JSON text with more parts after it: the same audit
      const asText = answers.map((a): Answer => (a.answer === undefined ? a : { ...a, answer: `${JSON.stringify(a.answer)}\n${LICENSE.attribution}` }))
      check('legal:agnostic-answers', JSON.stringify(auditClaims(claims, asText, sec)) === JSON.stringify(audit), PROSE.quantumProcessingToolboxesLegal_agnostic)
      check('legal:page', getLegalPage(audit, plan, '2026-01-01').includes(PROSE.quantumProcessingToolboxesLegal_s133), PROSE.quantumProcessingToolboxesLegal_s134)
      const run = (t: Texts) => ctx.call('legal', { texts: t, answers: [] }) as { id: string; sha256: string }
      const a1 = run(FIXTURE_TEXTS); const a2 = run(FIXTURE_TEXTS); const a3 = run({ ...FIXTURE_TEXTS, readme: FIXTURE_TEXTS.readme + '| Tampered | yes |\n' })
      check('legal:tamper-evident', a1.id === a2.id && a1.sha256 === a2.sha256 && a1.id !== a3.id && a1.sha256 !== a3.sha256, PROSE.quantumProcessingToolboxesLegal_s135)
      const comp = judgeCompetitions({ theorems: 12, kernel: 1000, hosts: 3, licence: 'CC-BY-NC-ND-4.0', published: false, pushed: false })
      const pub = judgeCompetitions({ theorems: 12, kernel: 1000, hosts: 3, licence: 'CC-BY-NC-ND-4.0', published: true, pushed: true })
      const win = getEntryWindow(PROSE.quantumProcessingToolboxesLegal_s136, Date.parse('2026-02-01'))
      const after = getEntryWindow(PROSE.quantumProcessingToolboxesLegal_s136, Date.parse('2026-10-26'))
      const measured = judgeCompetitions({ theorems: 12, kernel: 1000, hosts: 3, licence: 'CC-BY-NC-ND-4.0', published: false, pushed: false }, { 'xprize-quantum-applications': PROSE.quantumProcessingToolboxesLegal_s137 }, Date.parse('2027-02-01'))
      check('legal:window-measured-from-the-page', getEntryWindow('Applications are currently closed.', 1).entry === 'closed' && win.entry === 'open' && win.opens === '2026-01-14' && after.entry === 'closed' && getEntryWindow('', 1).entry === 'unknown' && measured.competitions.find((c) => c.id === 'xprize-quantum-applications')!.entry === 'open' && measured.enterable.includes('xprize-quantum-applications'), PROSE.quantumProcessingToolboxesLegal_s138)
      check('legal:compete-judges-never-claims', comp.ready.length === 0 && comp.enterable.length > 0 && comp.competitions.every((c) => !c.enterable || (c.entry !== 'closed' && c.rules.every((r) => !/^FLAG:/.test(r.needs ?? '')))) && !comp.enterable.includes('vercel-oss-program') && !comp.enterable.includes('gemini-xprize-hackathon') && comp.competitions.every((c) => c.rules.every((r) => r.status !== 'satisfied')) && pub.competitions.find((c) => c.id === 'github-maintainer-programs')!.rules[0]!.status === 'satisfied' && pub.ready.length === 0 && pub.competitions.find((c) => c.id === 'clay-millennium')!.rules[0]!.status === 'open' && /nothing here is a prize won/.test(comp.honest), PROSE.quantumProcessingToolboxesLegal_s139)
      const read = listPatents(GOOGLE_FIXTURE)
      const th = 'patents' in read ? checkPatentTheorems(read.patents) : { checked: 0, passed: 0, violations: [], byTheorem: {} }
      check('legal:patents-read-and-theorems-verified', 'patents' in read && read.total === 2 && read.patents[0]!.number === 'US12242926B2' && read.patents[0]!.title === 'Quantum system controller' && th.violations.length === 2 && th.violations.every((v) => v.number === 'EP1234567B1') && getPatentNumber('WO2020123456A1').wellFormed && !getPatentNumber('EP12A').wellFormed && 'error' in listPatents('not json'), proseFill(PROSE.quantumProcessingToolboxesLegal_s140, th.checked, th.violations.length))
      return done()
    },
  },
}
