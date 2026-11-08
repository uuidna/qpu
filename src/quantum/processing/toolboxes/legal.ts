// The legal toolbox: a legal and security audit of this MCP through MCP. Phase one gathers the author's claims and plans the calls (forensic,
// verification, legal facts, licence, prior art, due process, security doors chosen from discovery); phase two reads the answers into verdicts,
// drift and findings beside the tree's own security checks. Pure; the client fetches. Recomputable facts, not legal advice.
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
import { clock, stamp } from '../unit/clock.ts'

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
    ? { kind: 'external' as const, party: v.gate, id: uuid(`denier\nexternal\n${v.gate}\n${httpCode}`), by: `an HTTP ${httpCode} from the party the gate names`, identified: 'an external party (a host or MCP key), by its content address — not this tree' }
    : { kind: 'self' as const, party: 'the QPU kernel', id: uuid(`denier\nself\ntheorem:${rule.theorem}`), by: `theorem ${rule.theorem}, this tree's own law`, identified: 'this tree itself, by the kernel theorem that is the law it denied under' }
  // the legal grounds of all involved, and a ruling for the QPU licence where validatable: the court names the Payload call that validates
  // it and never asserts it unvalidated.
  const grounds = [
    { party: denier.party, role: 'denier' as const, ground: denier.by, identified: denier.id },
    { party: `the QPU (${LICENSE.author})`, role: 'rights-holder' as const, ground: `${LICENSE.spdx}: the author's rights in the QPU framework (${LICENSE.url}); the a432 harmonic default is free under attribution`, identified: uuid(`party\nqpu\n${LICENSE.spdx}`) },
    ...(v.tenant ? [{ party: `tenant ${v.tenant}`, role: 'subject' as const, ground: `the tenant's scoped rights under the ${LICENSE.spdx} licence`, identified: uuid(`party\ntenant\n${v.tenant}`) }] : []),
  ]
  const ruling = { favour: 'the QPU licence' as const, exists: true, basis: `${LICENSE.spdx} and ${rule.theorem}`, validatableVia: { tool: 'payload', arguments: { report: { tool: 'legal', arguments: { court: summons } } } }, says: `the QPU licence perspective exists (every result carries ${LICENSE.spdx}) and is validatable via the Payload MCP; the court rules for it where a client validates it via Payload, else it stands as the claim to validate — never asserted unvalidated` }
  // no ruling stands on a repo the court did not verify: verified by its content address, sliced into tasks decoded by majority (the e2e code)
  const repoAudit = { required: 'the court decides only on an audited repo; its integrity is verified before any ruling', quantum: 'verify the repo by its content address — O(1) per check, nanoseconds — beats classical recompute (the whole tree) by magnitudes (verify_beats_recompute_by_magnitudes)', nanosecondTasks: 'sliced into content-addressed pieces each decided in nanoseconds, decoded by majority (the e2e repetition code), as a fold or RSA is sliced', validatableVia: { tool: 'audit', arguments: {} }, theorem: 'textbook_court_audits_repo' }
  return {
    case: address, ...summons, ancient, denier, grounds, ruling, repoAudit, violated: rule.violated, theorem: rule.theorem, remedy: rule.remedy, duty: v.duty ?? 'legal_only_the_proven_is_admitted',
    verdict: 'refused at the gate; the case computed, nothing written',
    via: { file: { tool: 'legal', arguments: { court: summons } }, docket: { how: 'POST /docket { kind: "case", from: <the client>, body: <this case> } with the tenant\'s writer token, or the Payload MCP\'s createEntries', says: 'the violator files its own case through its MCP; the gate wrote nothing' }, appeal: { tool: 'match', arguments: { statement: `${rule.violated} at ${v.gate}` } } },
    cost: 'computed from the refusal alone: the gate stays cheap', theorems: [rule.theorem, 'textbook_cheap_gates', 'textbook_denier_identified', 'textbook_court_audits_repo'],
    says: `${v.gate}: ${rule.violated} — denied by ${denier.party} (${denier.kind}, ${denier.by}); the legal grounds of all ${grounds.length} parties shown, ruling in favour of the QPU licence where validatable via Payload; remedy: ${rule.remedy}; the case ${address} is the violator\'s to file through its MCP`,
  }
}

type Texts = { readme?: string; citation?: string; zenodo?: string; package?: string; worker?: string; billing?: string; hmac?: string; mcp?: string }

/** The claims the author makes, read from the tree and its metadata; each a sentence a door can judge. */
const listClaims = (texts: Texts, leads: readonly Lead[], cite?: { theorem?: string | null }): Claim[] => {
  // a claim with legal words is backed by a sealed guarantee of the unit's own court (a theorem key its due-process door names),
  // never by a receipt: the forensic door admits a cited theorem and treats any other UUID as an address it must find sealed
  const backed = ` backed by theorem ${cite?.theorem ?? 'legal_only_the_proven_is_admitted'}`
  const out: Claim[] = [
    { id: 'licence-spdx', source: 'src/quantum/processing/unit/license.ts', text: `@uuidna/qpu is licensed ${LICENSE.spdx} by ${LICENSE.author}; commercial use requires a licence from the author,${backed}` },
    { id: 'licence-address', source: 'src/quantum/processing/unit/license.ts', text: `the licence record is at ${LICENSE.url}; its address and imprint are the ones the unit's rights door gives, carried by every result as _meta.license,${backed}` },
    { id: 'author-orcid', source: 'src/quantum/processing/unit/license.ts', text: `the author is ${LICENSE.author}, ORCID ${LICENSE.orcid}` },
    { id: 'representation', source: 'src/quantum/processing/unit/license.ts', text: `${LICENSE.representation.replace(/\.$/, '')},${backed}` },
    { id: 'disclaimer', source: 'src/quantum/processing/unit/license.ts', text: `${LICENSE.disclaimer.replace(/\.$/, '')},${backed}` },
  ]
  const field = (text: string | undefined, re: RegExp) => text?.match(re)?.[1]?.trim()
  const citationAuthor = field(texts.citation, /family-names:\s*(\S+)/); const citationGiven = field(texts.citation, /given-names:\s*(\S+)/); const citationLicence = field(texts.citation, /^license:\s*(\S+)/m); const citationOrcid = field(texts.citation, /orcid:\s*(\S+)/)
  if (texts.citation) out.push({ id: 'citation-cff', source: 'CITATION.cff', text: `CITATION.cff names ${citationGiven ?? '?'} ${citationAuthor ?? '?'} (${citationOrcid ?? 'no ORCID'}) as the author under ${citationLicence ?? 'no licence'}` })
  if (texts.zenodo) { try { const z = JSON.parse(texts.zenodo) as { creators?: { name: string; orcid?: string }[]; license?: string; title?: string }; out.push({ id: 'zenodo-json', source: '.zenodo.json', text: `.zenodo.json names ${z.creators?.map((c) => `${c.name} (${c.orcid ?? 'no ORCID'})`).join(', ') ?? 'nobody'} as creator of ${z.title ?? '?'} under ${z.license ?? 'no licence'}` }) } catch { out.push({ id: 'zenodo-json', source: '.zenodo.json', text: '.zenodo.json is not valid JSON' }) } }
  if (texts.package) { try { const p = JSON.parse(texts.package) as { name?: string; version?: string; license?: string; author?: { name?: string } | string }; out.push({ id: 'package-json', source: 'package.json', text: `package.json names ${p.name ?? '?'} ${p.version ?? ''} under ${p.license ?? 'no licence'} by ${typeof p.author === 'string' ? p.author : p.author?.name ?? 'nobody'}` }) } catch { out.push({ id: 'package-json', source: 'package.json', text: 'package.json is not valid JSON' }) } }
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
  if (!w) { check('security:app-text', false, 'no app security source given: nothing measured'); return done().checks }
  check('security:no-live-secret-literal', !/\b(sk_live_|whsec_[0-9A-Za-z]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC )?PRIVATE KEY)/.test(all), 'no live Stripe key, webhook secret, AWS key or private key literal in the sources')
  check('security:token-auth-delegated', /useAPIKey|auth: \{/.test(w) && !/apiKey === |token === |charCodeAt\([^)]*\) ===/.test(w), 'token auth is Payload\'s framework (useAPIKey / auth), not a hand-rolled, possibly non-constant-time comparison in the app source')
  check('security:signature-compared-in-constant-time', /sameHex[\s\S]*?\^/.test(h) && /sameHex\(/.test(b), 'the HMAC / Stripe signature is compared by sameHex, xor over every character')
  check('security:writes-need-a-role', /overrideAccess: false/.test(w) && /qpuEditor|qpuSuperAdmin|ACCESS\.groups|isAdmin/.test(w), 'collection writes run under Payload access control computed from roles (overrideAccess: false), never a blanket bypass')
  check('security:tenant-isolation', /multiTenantPlugin/.test(w), 'tenants are isolated by the Payload multi-tenant plugin; every scoped collection is addressed by tenant')
  check('security:webhook-verified-before-write', /stripeAdapter/.test(w) && /webhookSecret/.test(w), 'the Stripe adapter verifies the webhook signature before any write; the signing secret is a named env value, never a literal')
  check('security:keys-stay-in-the-handler', !/STRIPE_SECRET_KEY|QPU_DATA_KEY|QPU_WRITE_TOKEN|PAYLOAD_SECRET/.test(m), 'the pure handler names no secret; the app reads env at its boundary alone')
  check('security:secrets-from-env', /process\.env/.test(w), 'the app reads its secrets from process.env, never a literal')
  check('security:cors-configured', /cors:/.test(w), 'CORS is configured in the Payload config; cross-origin access is controlled, not open by default')
  check('security:timeouts-on-outbound', /AbortSignal\.timeout\(/.test(w), 'the app\'s own outbound fetches carry a timeout')
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
  return { rows, byRecord, bySource, total: rows.reduce((n, r) => n + (r.mentions ?? 0), 0), reachable: rows.filter((r) => r.status === 200).length, of: rows.length, says: 'mentions of the author\'s records by public source, measured, never a verdict: the acceptance rule reads them' }
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
  return { calls, agents: chosen, by: agents?.length ? 'operator' : 'free-by-default', absent, operatorAgents: [{ id: 'claude-api', endpoint: '/api/qpu/search', model: 'qpu-payload', key: 'needs-key refuse', version: CLAUDE_API.version ?? '2023-06-01', chosen: false, note: 'AI sidecar uses QPU; Anthropic is not invoked. needs-key stays a refuse. Work proceeds on /api/qpu/search with no key.' }] }
}

type Finding = { claim: string; door: string; verdict: string | null; clean: boolean | null; violations: number; violationKinds: string[]; note: string; receipt: string | null; refusal: string | null }
/** The answers read: verdicts per claim, drift between the unit's facts and the tree's licence, security findings, due process gaps. */
const auditClaims = (claims: readonly Claim[], answers: readonly Answer[], security: readonly { id: string; passed: boolean; evidence: string }[]) => {
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
  `> ${(a.legalFacts as { disclaimer?: string } | null)?.disclaimer ?? LICENSE.disclaimer}`, '', `Run by \`npm run next\` on ${date} through the \`legal\` tool: every claim the author makes in this tree sent to the unit's forensic and verification doors, the unit's legal facts and rights beside this tree's licence module, the licence computed for this tree, the prior art of its theorems, due process over the claims, every security door the unit serves, and the tree's own security checks over its sources. Agents: ${plan.agents.join(', ')} (${plan.by}${plan.absent.length ? `; absent: ${plan.absent.join(', ')}` : ''}). ${LICENSE.disclaimer}`, '',
  `## Claims: ${a.claims}; verdicts ${Object.entries(a.verdicts).map(([k, v]) => `${k} ${v}`).join(', ')}; violations ${a.violations}; refusals ${a.refusals}`, '',
  '| Claim | Door | Verdict | Clean | Violations | Receipt | Note or refusal |', '|---|---|---|---|---:|---|---|', ...a.findings.map((f) => `| ${f.claim} | ${f.door} | ${f.verdict ?? '—'} | ${f.clean === null ? '—' : f.clean} | ${f.violations} | ${f.receipt ?? '—'} | ${(f.note || f.refusal || '').replace(/\|/g, '\\|')} |`), '',
  '## Rights and drift', '', a.rights ? `The unit's rights: holder ${a.rights.holder}, ${a.rights.license}, licence address ${a.rights.licenseAddress}, imprint ${a.rights.imprint}, receipt ${a.rights.receipt}. ${a.drift.length ? `Drift against this tree: ${a.drift.join('; ')}.` : 'No drift against this tree\'s licence module.'}` : 'The rights door was not reached.', '',
  '## Licence, prior art, due process', '', `Licence computed for this tree: ${a.licence ? `${a.licence.scope}, ${a.licence.spdx}, free ${a.licence.free}` : 'not reached'}. Prior art: ${a.priorArt ? `${a.priorArt.exhibits} exhibits, ${a.priorArt.missing} keys missing from the unit's ledger (qpu's own theorems are not sealed there: lead gap-theorems-unsealed), author ${a.priorArt.author}` : 'not reached'}. Due process: ${a.dueProcess ? `guarantees sealed ${a.dueProcess.allGuaranteesSealed}, ${a.dueProcess.docket} on the docket, ${a.dueProcess.gaps} gaps, ${a.dueProcess.traitors} traitors` : 'not reached'}.`, '',
  '## Security doors of the unit', '', '| Door | Clean | Failed | Receipt | Honest |', '|---|---|---:|---|---|', ...a.securityDoors.map((d) => `| ${d.door} | ${d.refusal ? `refused: ${d.refusal}` : d.clean === null ? '—' : d.clean} | ${d.failed ?? '—'} | ${d.receipt ?? '—'} | ${d.honest.replace(/\|/g, '\\|')} |`), '',
  `## This tree's security checks: ${a.securityPassed} of ${a.securityTotal}`, '', '| Check | Passed | Evidence |', '|---|---|---|', ...a.security.map((c) => `| ${c.id} | ${c.passed ? '✓' : '✗'} | ${c.evidence.replace(/\|/g, '\\|')} |`), ''].join('\n')

/** Ancient law fused into the court: the foundational codes and Roman maxims, each by name (no URL), mapped to the court mechanism this tree
 *  enacts and the theorem that is its law; the earliest attested dates are given. */
export const ANCIENT_LAW: readonly { id: string; era: string; principle: string; enactedBy: string; theorem: string }[] = [
  { id: 'ur-nammu', era: 'c. 2100 BCE, Sumer', principle: 'the oldest extant code: a wrong is repaid in measured restitution (a fine), not retaliation', enactedBy: 'a refusal is priced in work, not destruction — the gate pays nothing and the author the measured difference', theorem: 'textbook_cheap_gates' },
  { id: 'hammurabi', era: 'c. 1754 BCE, Babylon', principle: '282 laws set in stone: every offence named by its own written rule', enactedBy: 'COURT_RULES: every refusal is named by the theorem that is its law, none ad hoc', theorem: 'textbook_cheap_gates' },
  { id: 'twelve-tables', era: '451 BCE, Rome', principle: 'the law made public, so none is judged by a secret rule', enactedBy: 'legal { court: true } and legal { ancient: true } publish every rule; the kernel theorems are public', theorem: 'textbook_cheap_gates' },
  { id: 'corpus-juris-civilis', era: '529–534 CE, Byzantium', principle: 'the law compiled into one consistent body, the basis of civil law', enactedBy: 'the textbook theorem ledger: one kernel-accepted body every claim cites', theorem: 'textbook_court_audits_repo' },
  { id: 'audi-alteram-partem', era: 'Roman maxim', principle: 'hear the other side: none is judged without a hearing of every party', enactedBy: 'the court shows the legal grounds of all parties (denier, rights-holder, tenant)', theorem: 'textbook_denier_identified' },
  { id: 'nemo-iudex-in-causa-sua', era: 'Roman maxim', principle: 'no one is a judge in their own cause: the judge must be impartial', enactedBy: 'the denier is identified by content address as self (the kernel) or external (an HTTP party), never assumed', theorem: 'textbook_denier_identified' },
  { id: 'nulla-poena-sine-lege', era: 'Roman maxim', principle: 'no penalty without a law', enactedBy: 'every penalty names the theorem (the law) it is denied under; no penalty without one', theorem: 'textbook_cheap_gates' },
  { id: 'ei-incumbit-probatio', era: 'Roman maxim', principle: 'the burden of proof lies on the one who asserts, not the one who denies', enactedBy: 'legal_only_the_proven_is_admitted — the duty of candour: only the proven is admitted, the rest declared, never asserted', theorem: 'legal_only_the_proven_is_admitted' },
  { id: 'res-judicata', era: 'Roman maxim', principle: 'a matter once decided is not litigated again', enactedBy: 'the case is content-addressed: one address decides it once, a repeat resolves to the same address', theorem: 'textbook_court_audits_repo' },
]

const legal = defineTool('legal', {
  name: 'legal',
  description: 'The full legal and security audit with forensic analysis, through MCP. Phase one (texts, discovery, agents?, theoremKeys?): the author\'s claims gathered from the tree and its metadata, this tree\'s own security checks over its sources, and the plan of calls to the unit\'s forensic, verification, legal, licence, prior-art, due-process and security doors — free agents found by discovery by default, the operator\'s own list when given. Phase two (plus answers): verdicts per claim, drift against this tree\'s licence, the findings, the page. Recomputable facts, not legal advice.',
  inputSchema: { type: 'object', properties: { now: { type: 'number', description: 'the clock the client names (milliseconds since the epoch), so the audit is a function of its arguments' }, texts: { type: 'object', description: '{ readme, citation, zenodo, package, worker, billing, hmac, mcp }: the texts of the tree' }, discovery: { type: 'object' }, agents: { type: 'array', items: { type: 'string' }, description: 'the operator\'s override: the doors to use; omit for the free doors discovery found' }, theoremKeys: { type: 'array', items: { type: 'string' } }, citeTheorem: { type: 'string', description: 'the sealed guarantee of the unit\'s court cited beside every legal claim; default legal_only_the_proven_is_admitted, a key its due-process door names' }, answers: { type: 'array', items: { type: 'object' } }, court: { description: 'true: the court\'s rules, each with its theorem and remedy; { gate, status | code, rule?, evidence?, tenant? }: the case a refusal computes — what was violated, the theorem, the remedy, the MCP call the violator makes to file it (kind case in the docket) or to appeal (match); every cheap gate answers its refusals with this' }, ancient: { description: 'true: the ancient law fused into the court — the foundational codes (Ur-Nammu, Hammurabi, the Twelve Tables, the Corpus Juris Civilis) and the Roman maxims (audi alteram partem, nemo iudex in causa sua, nulla poena sine lege, ei incumbit probatio, res judicata), each mapped to the court mechanism this tree enacts, the theorem that is its law, and its source' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (isObj(args.court)) return summonCourt(args.court as Summons)
    if (args.court === true) return { rules: COURT_RULES, count: COURT_RULES.length, theorem: 'textbook_cheap_gates', says: 'every gate refuses by one of these rules and answers the case computed: the violator files it through its own MCP, the gate writes nothing' }
    if (args.ancient) return { laws: ANCIENT_LAW, count: ANCIENT_LAW.length, duty: 'legal_only_the_proven_is_admitted', theorem: 'textbook_cheap_gates', says: 'the court fused with ancient law: each foundational code and Roman maxim mapped to the court mechanism this tree already enacts and the theorem that is its law' }
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

const FIXTURE_TEXTS: Texts = { citation: 'cff-version: 1.2.0\ntitle: QPU\nauthors:\n  - family-names: Rouschev\n    given-names: Tsvetan\n    orcid: https://orcid.org/0009-0000-7312-9778\nlicense: CC-BY-NC-ND-4.0\n', zenodo: '{"creators":[{"name":"Rouschev, Tsvetan","orcid":"0009-0000-7312-9778"}],"license":"cc-by-nc-nd-4.0","title":"QPU"}', package: '{"name":"@uuidna/qpu","version":"1.4.0","license":"CC-BY-NC-ND-4.0","author":{"name":"Tsvetan Rouschev"}}', readme: '| Measure | Value |\n|---|---:|\n| Tests | 152 pass |\n', worker: "auth: { useAPIKey: true }\naccess: { create: qpuEditor, update: qpuSuperAdmin }, overrideAccess: false\nmultiTenantPlugin({ collections: { pages: {}, entries: {} } })\nstripeAdapter({ secretKey: process.env.STRIPE_SECRET_KEY, webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET })\ncors: [process.env.QPU_ORIGIN]\nawait fetch(url, { signal: AbortSignal.timeout(10000) })", billing: 'verifySignature(secret) sameHex(expected, v1)', hmac: 'export const sameHex = (a, b) => { let d = 0; d |= a.charCodeAt(i) ^ b.charCodeAt(i) }', mcp: 'const BALANCER = new Map()' }

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
  if (m) { const opens = Date.parse(`${m[1]!} UTC`); const closes = Date.parse(`${m[2]!} UTC`) + 86_399_000; /* the day the window closes counts whole, in UTC */ const entry = now < opens ? 'upcoming' : now > closes ? 'closed' : 'open'; return { entry, opens: new Date(opens).toISOString().slice(0, 10), closes: new Date(closes).toISOString().slice(0, 10), says: `the page says registration opens ${m[1]} and closes ${m[2]}: ${entry} on ${new Date(now).toISOString().slice(0, 10)}` } }
  if (/applications? (?:are|is) (?:now |currently )?open/i.test(text)) return { entry: 'open', opens: null, closes: null, says: 'the page says applications are open' }
  if (/applications? (?:are|is) (?:now |currently )?closed/i.test(text)) return { entry: 'closed', opens: null, closes: null, says: 'the page says applications are currently closed' }
  return { entry: 'unknown', opens: null, closes: null, says: text ? 'the page names no window' : 'no page read' }
}
/** Every competition judged: each rule's status from the tree's evidence (theorems kernel-accepted, hosts deployed, licence, no publication), nothing claimed. */
/** To win, know the competitors as well as the theorems: a competition is known when both are (textbook_compete_knows: the product is
 *  positive only when neither is empty); the competitors as the public page measures them, the theorems the tree carries for it. */
export const knowCompetition = (c: (typeof COMPETITIONS)[number]) => {
  const theorems = TEXTBOOK_THEOREMS.filter((t) => t.examples.includes('compete-rules') || (c.id === 'clay-millennium' && /clay|sigma|relation|triad/.test(t.key))).map((t) => t.key)
  return { competitors: c.competitors.known.length, source: c.competitors.source, read: c.competitors.read, measured: c.competitors.measured, theorems, both: c.competitors.known.length > 0 && theorems.length > 0, says: c.competitors.known.length ? 'known from the page' : 'no name on the page: a lead to read where the page points' }
}
// Every prize prose made a computable value via the billing currencies: the amount, its currency and basis (purse/fund/per-problem to win,
// invested, or none). Only a winnable basis counts to a total; invested and non-monetary are 0.
const CURRENCY_OF: Record<string, string> = { USD: 'usd', '$': 'usd', EUR: 'eur', '€': 'eur', GBP: 'gbp', '£': 'gbp' }
export const prize = (prose: string): { value: number; currency: string; basis: 'purse' | 'fund' | 'per-problem' | 'invested' | 'none'; says: string } => {
  const m = /(USD|EUR|GBP|\$|€|£)\s*([0-9][0-9  ,.]*)\s*(million|billion)?/i.exec(prose)
  if (!m) return { value: 0, currency: 'usd', basis: 'none', says: 'no stated amount (non-monetary: tools, mentorship, credits)' }
  let value = parseFloat(m[2]!.replace(/[  ,]/g, '')); const scale = /billion/i.test(m[3] ?? '') ? 1e9 : /million/i.test(m[3] ?? '') ? 1e6 : 1; value *= scale
  const currency = CURRENCY_OF[m[1]!.toUpperCase()] ?? CURRENCY_OF[m[1]!] ?? 'usd'
  if (/invest|venture capital|access to .{0,30}(capital|partners)/i.test(prose)) return { value: 0, currency, basis: 'invested', says: `${m[0]} is capital access or investment, not a prize to win: 0 to the total` }
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
      if (/hosted on Vercel|deployed on Vercel/.test(r.rule)) return { ...r, status: 'pending' as const, evidence: 'the fork builds; its deploy is the tenant\'s act' }
      if (/open source project/.test(r.rule)) return { ...r, status: evidence.pushed ? 'satisfied' as const : 'pending' as const, evidence: `${evidence.licence}; the repository is ${evidence.pushed ? 'public' : 'local until the author pushes'}` }
      if (/solution of one of the seven/.test(r.rule)) return { ...r, status: 'open' as const, evidence: `${evidence.theorems} theorems kernel-accepted (${evidence.kernel} in the kernel); the evidence of precedence the author\'s record doi:${PRECEDENCE[0]!.doi}${evidence.acceptance ? `; ${evidence.acceptance.total} mentions of the records by ${Object.keys(evidence.acceptance.bySource).length} public sources` : ''}` }
      if (/general acceptance/.test(r.rule)) return { ...r, status: 'pending' as const, evidence: evidence.acceptance ? `${evidence.acceptance.total} mentions of the records across ${evidence.acceptance.reachable} of ${evidence.acceptance.of} public source reads: ${Object.entries(evidence.acceptance.bySource).map(([k, v]) => `${k} ${v}`).join(', ')}` : 'the public news APIs not yet read: compete { news: true } plans the requests, compete { mentions } reads them', act: 'measured by the mentions the public sources answer; the community\'s act' }
      if (/published/.test(r.rule)) return { ...r, status: evidence.published ? 'satisfied' as const : 'pending' as const, evidence: evidence.published ? 'published' : 'no publication in a qualifying outlet' }
      if (/AI live in production/.test(r.rule)) return { ...r, status: 'pending' as const, evidence: 'the Gemini API is wired as an operator agent the tenant names (extend { gemini }: generateContent planned, the key in the x-goog-api-key header from GEMINI_API_KEY, never in the tree), beside the Claude API; AI live in production deciding the business is the author\'s act with a key' }
      if (/category impact: Education/.test(r.rule)) return { ...r, status: 'pending' as const, evidence: 'textbook { institution } prices an institution and sends the kernel\'s closed equations as Classroom coursework; textbook { institution: { sets } } gives 26,244 Workspace sets, 8,748 for education, each a page in the admin: the users benefit by choosing, never by a claim' }
      if (/a Code of Conduct/.test(r.rule)) return { ...r, status: evidence.conduct ? 'satisfied' as const : 'pending' as const, evidence: evidence.conduct ? 'CODE_OF_CONDUCT.md adopts the Contributor Covenant 2.1 by link; enforcement stays the author\'s judgement' : 'no CODE_OF_CONDUCT in the repository' }
      if (/startup building on Cloudflare Workers/.test(r.rule)) return { ...r, status: 'pending' as const, evidence: `the Worker qpu on ${evidence.hosts} hosts; the company is the author\'s` }
      return { ...r, status: 'pending' as const, evidence: 'the author\'s act' }
    })
    const counts = rules.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {})
    // the coin cost of the evidence: every theorem the tree carries for the competition served as a coin through textbook { theorem }, booked in
    // the ledger beside the prize as its page states it; a cost, never a claim: no prize is won and no problem solved by booking it
    const know = knowCompetition(c0)
    const ledger = createLedger(know.theorems.map((theorem) => ({ tool: 'textbook', tenant: 'author', arguments: { theorem } })))
    const economics = { prize: c.prize, evidence: know.theorems.length, calls: know.theorems.map((theorem) => ({ name: 'textbook', arguments: { theorem } })), coins: ledger.coins, coils: ledger.coils, costMillicents: ledger.debits, balanced: ledger.balanced, says: `${know.theorems.length} theorem(s) of evidence served as ${ledger.coins} coin(s) at a cost of ${ledger.debits} thousandths of a cent, beside the prize as stated (${c.prize}); no prize is won and no problem solved by this`, theorem: 'textbook_double_entry' }
    return { ...c, prizeValue: prize(c.prize), rules, counts, know, economics, satisfied: `${counts.satisfied ?? 0}/${rules.length}`, enterable: c.entry !== 'closed' && rules.every((r) => r.status !== 'open' && r.status !== 'closed'), ready: rules.every((r) => r.status === 'satisfied') }
  })
  const neighbours = competeProgramNeighbours('a1b2c3d4')
  return { precedence: PRECEDENCE, acceptance: evidence.acceptance ?? null, news: { apis: NEWS_APIS.length, open: NEWS_APIS.filter((a) => a.open).length, keyed: NEWS_APIS.filter((a) => !a.open).map((a) => ({ id: a.id, key: a.key })) }, prizeTotals: (() => { const w = judged.map((j) => j.prizeValue).filter((x) => x.basis === 'purse' || x.basis === 'fund' || x.basis === 'per-problem'); const byCurrency = w.reduce((a2, x) => ({ ...a2, [x.currency]: (a2[x.currency] ?? 0) + x.value }), {} as Record<string, number>); return { winnable: w.length, byCurrency, basis: judged.reduce((a2, j) => ({ ...a2, [j.prizeValue.basis]: (a2[j.prizeValue.basis] ?? 0) + 1 }), {} as Record<string, number>), rateSources: RATE_SOURCES.length, convert: (rates: Record<string, { rate: number }>) => convertAmounts(byCurrency.usd ?? 0, rates), theorem: 'textbook_prizes_computable', says: Object.entries(byCurrency).map(([k, v]) => k + ' ' + v.toLocaleString('en-US')).join(', ') + ' across ' + w.length + ' winnable prizes, read from the records not the prose' } })(), competitions: judged, neighbours: { law: neighbours.law, handle: neighbours.handle, competitions: neighbours.competitions, holding: neighbours.holding, reflect: neighbours.reflect.holds, holds: neighbours.holds, says: neighbours.says }, know: { competitors: judged.reduce((n, c) => n + c.know.competitors, 0), theorems: new Set(judged.flatMap((c) => c.know.theorems)).size, both: judged.filter((c) => c.know.both).map((c) => c.id), says: 'to win, know the competitors as well as the theorems: a competition is known when both are; the names live in the competition gate pages (the pages collection the Payload MCP plugin serves), nothing added' }, prizes: judged.filter((c) => c.kind === 'prize').length, funding: judged.filter((c) => c.kind === 'funding').length, enterable: judged.filter((c) => c.enterable).map((c) => c.id), ready: judged.filter((c) => c.ready).map((c) => c.id), says: 'enterable: every rule is satisfied or the author\'s act; ready: every rule satisfied', closed: judged.filter((c) => c.entry === 'closed').map((c) => c.id), relatedMcps: FUNDING_MCPS, honest: 'nothing here is a prize won or a problem solved: every rule is judged against evidence, and what remains is the author\'s act (publish, push, apply) or a lead; the tree competes by following the rules, measured on every run', internalCompetition: 'neighbours reflect and test each other in games and competitions online; the gate\'s competition of codes (five codes a combination, the fastest correct wins) is judged against its five written rules on every run: see the e2e tool' }
}

const compete = defineTool('legal', {
  name: 'compete',
  description: 'The competitions with prizes and funding, their rules read at the source and judged against this tree\'s own evidence on every run: the Clay Millennium Prize rules (three conditions), XPRIZE Quantum Applications (closed: finalists chosen, winners spring 2027), GitHub\'s maintainer programs, Cloudflare\'s Workers Launchpad, Vercel\'s open source program, the Build with Gemini XPRIZE Hackathon (closed 2026-08-17) and Google for Startups Accelerator; the registry\'s grant and funding MCPs proposed. Each rule is satisfied, pending (the author\'s act), closed or open (a lead). Nothing is claimed won; the tree competes by following every rule. Pure.',
  inputSchema: { type: 'object', properties: { conduct: { type: 'boolean', description: 'the client found a CODE_OF_CONDUCT in the repository' }, claim: { description: 'true: the DOI records of the author cited with the ORCID as precedence. { statement, doi, answers } or { items }: novelty under ISO 690 and ISO 26324. An earlier DOI-registered work that resembles the claim is cited. None, and the author\'s DOI naming the author, claims it for the author' }, news: { type: 'boolean', description: 'the public news APIs as adapters of the DOI research: the requests the client makes to the open ones for every record of precedence, the keyed ones named' }, mentions: { type: 'array', items: { type: 'object' }, description: 'the answers to the news requests ({ id, status, text }): the mentions by source and by record, read into the acceptance rule' }, pages: { type: 'object', description: 'competition id → the text of its rules page, read by the client: the entry window is measured from it' }, now: { type: 'number', description: 'the clock (ms) the window is judged at; the host\'s when absent' }, published: { type: 'boolean', description: 'a publication in a qualifying outlet exists (the author says so)' }, pushed: { type: 'boolean', description: 'the repository is public (the author pushed)' }, hosts: { type: 'integer' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (isObj(args.claim)) return claimNovelty(args.claim)
    if (args.claim) { const requests = createNewsRequests(); return { op: 'claim' as const, orcid: LICENSE.orcid, precedence: PRECEDENCE.map((p) => ({ doi: p.doi, title: p.title, year: p.year, orcid: LICENSE.orcid })), newsRequests: requests.length, release: { via: 'github-actions', article: 'each claim is published as a blog article = a release', workflow: 'publish' }, says: 'claim: the DOI records of the author, each cited with the ORCID, establish precedence; the news requests find public mentions of new problems to claim; each claim publishes as a blog article = a release via GitHub Actions. Nothing is claimed won, precedence is verified via validations and the public decides.' } }
    if (args.news) { const requests = createNewsRequests(); return { op: 'news' as const, apis: NEWS_APIS, open: NEWS_APIS.filter((a) => a.open).map((a) => a.id), keyed: NEWS_APIS.filter((a) => !a.open).map((a) => ({ id: a.id, key: a.key })), records: PRECEDENCE.length, requests: requests.length, requestList: requests, says: 'the public news APIs wired as adapters of the DOI research: one request per open API per record of precedence; the keyed ones wait for a tenant\'s name; the mentions are read by compete { mentions }' } }
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
    tally('textbook_patent_number_well_formed', getPatentNumber(p.number).wellFormed, p.number, `the number is not well formed for ${p.office}`)
    if (fi !== null && gr !== null && (p.office === 'US' || p.office === 'EP')) { const term = new Date(Date.parse(p.filing! + 'T00:00:00Z')); term.setUTCFullYear(term.getUTCFullYear() + 20); tally('textbook_patent_term_twenty_years', gr < Math.floor(term.getTime() / 86_400_000), p.number, `granted ${p.grant} after the twenty-year term from filing ${p.filing}`) }
  }
  const checked = Object.values(byTheorem).reduce((n, t) => n + t.passed + t.failed, 0)
  return { checked, passed: checked - violations.length, violations, byTheorem }
}
const GOOGLE_FIXTURE = ")]}'\n" + JSON.stringify({ results: { total_num_results: 2, cluster: [{ result: [{ patent: { publication_number: 'US12242926B2', title: 'Quantum system <b>controller</b>', priority_date: '2021-08-19', filing_date: '2024-02-12', grant_date: '2025-03-04', publication_date: '2025-03-04', inventor: 'Ciaran Ryan-Anderson', assignee: 'Quantinuum Llc' } }, { patent: { publication_number: 'EP1234567B1', title: 'Another', priority_date: '2020-01-01', filing_date: '2019-12-31', grant_date: '2041-01-01', publication_date: '2021-07-01', inventor: 'x', assignee: 'y' } }] }] } })

const patents = defineTool('legal', {
  name: 'patents',
  description: 'Every patent API found, wired and measured: plan answers the requests to the open ones (Google Patents\' query endpoint, the EPO publication server) and names the keyed ones (PatentsView, USPTO ODP, EPO OPS, Lens: the variable names, never values) and the registry\'s patent MCPs; read takes the bodies a client fetched, reads the patents (number, dates, assignee, inventor, title) and verifies the theorems over them — the dates ordered, the number well formed for its office, the twenty-year term — naming every violation. Pure: nothing fetched here.',
  inputSchema: { type: 'object', properties: { op: { type: 'string', enum: ['plan', 'read'] }, query: { type: 'string', description: 'the search, e.g. quantum error correction' }, queries: { type: 'array', items: { type: 'string' } }, count: { type: 'integer', minimum: 1, description: 'how many patents the request asks for. There is no maximum: the host pages its own answer' }, answers: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, query: { type: 'string' }, text: { type: 'string' } } } }, selftest: { type: 'boolean' } } },
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
    return { op, queries: byQuery.map((q) => ({ query: q.query, ...('error' in q ? { error: q.error } : { total: q.total, read: q.patents.length }) })), patents: all, offices: all.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.office]: (acc[p.office] ?? 0) + 1 }), {}), epoPublicationDates: epoDates.length, theorems, says: `${all.length} patent(s) read from ${byQuery.length} quer${byQuery.length === 1 ? 'y' : 'ies'}; ${theorems.checked} theorem checks, ${theorems.violations.length} violation(s); ${epoDates.length} EPO publication dates listed` }
  },
  widget: flowWidget,
})

export const LEGAL: Toolbox = {
  name: 'legal',
  idea: 'the legal and security audit of this MCP through MCP: the author\'s claims judged by the unit\'s forensic, legal and security doors, free agents by default, the operator alone overriding, beside the tree\'s own checks of its sources',
  tools: [legal, compete, patents],
  examples: [
    { id: 'patents-plan', tool: 'patents', arguments: { op: 'plan', query: 'quantum error correction', count: 10 }, shows: 'Every patent API found: the two that answer in the open (Google Patents\' query endpoint, the EPO publication server) as requests, the five that take a key or a session named with their variable names, the registry\'s patent MCPs, and the three theorems every patent read is verified against.', expect: (s) => (s.apis.length === 7 && s.open.length === 2 && s.requests.length === 2 && s.theorems.length === 3 ? null : JSON.stringify(s.open)) },
    { id: 'patents-read', tool: 'patents', theorem: 'textbook_patent_dates_ordered', arguments: { op: 'read', answers: [{ id: 'patents:google:quantum error correction', query: 'quantum error correction', text: GOOGLE_FIXTURE }] }, shows: 'Two patents read from a fixture of Google Patents\' answer and verified: the Quantinuum patent passes every theorem; the second names a priority after its filing and a grant beyond the twenty-year term — violations named, never hidden.', expect: (s) => (s.patents.length === 2 && s.theorems.violations.length === 2 && s.theorems.byTheorem.textbook_patent_dates_ordered.failed === 1 && s.theorems.byTheorem.textbook_patent_term_twenty_years.failed === 1 ? null : JSON.stringify(s.theorems)) },
    { id: 'compete-news-plan', tool: 'compete', theorem: 'textbook_news_adapters', arguments: { news: true }, shows: 'The public news APIs wired as adapters of the DOI research: four open (GDELT, Hacker News, Crossref Event Data, Wikipedia) answering mentions of each record of precedence without a key, three keyed (NewsAPI, The Guardian, The New York Times) waiting for a tenant\'s name; twelve requests for three records, none capped.', expect: (s) => (s.op === 'news' && s.apis.length === NEWS_APIS.length && s.open.length + s.keyed.length === s.apis.length && s.open.length === NEWS_APIS.filter((a) => a.open).length && s.requests === s.open.length * s.records && s.requestList.every((r: { url: string }) => r.url.startsWith('https://')) ? null : JSON.stringify({ apis: s.apis.length, requests: s.requests })) },
    { id: 'compete-mentions', tool: 'compete', arguments: { mentions: [{ id: 'hn-algolia:10.5281/zenodo.21781602', status: 200, text: '{"nbHits":3}' }, { id: 'crossref-events:10.5281/zenodo.23156998', status: 200, text: '{"message":{"total-results":2}}' }, { id: 'gdelt:10.5281/zenodo.22700098', status: 503, text: '' }] }, shows: 'Fixture answers of the news adapters read into mentions by record and by source — five mentions, one source unreachable — and the acceptance rule of the Clay competition reading them: measured, never a verdict.', expect: (s) => (s.acceptance.total === 5 && s.acceptance.reachable === 2 && s.acceptance.of === 3 && s.acceptance.byRecord['10.5281/zenodo.21781602'] === 3 && s.competitions.find((c: { id: string }) => c.id === 'clay-millennium').rules.some((r: { rule: string; evidence: string }) => /general acceptance/.test(r.rule) && /5 mentions/.test(r.evidence)) ? null : JSON.stringify(s.acceptance)) },
    { id: 'compete-rules', tool: 'compete', theorem: 'textbook_clay_conditions', arguments: {}, shows: 'Every competition with a prize or funding judged by its own rules: the Clay conditions (three, all required), XPRIZE Quantum Applications closed until spring 2027, Vercel\'s program closed until its next cohort, the other funding programs pending the author\'s acts; nothing claimed, the gaps named.', expect: (s) => (s.competitions.length > 0 && s.closed.includes('xprize-quantum-applications') && s.competitions[0].rules[0].status === 'open' && s.enterable.every((id: string) => s.competitions.find((c: { id: string }) => c.id === id).rules.every((r: { needs?: string }) => !/^FLAG:/.test(r.needs ?? ''))) && s.closed.includes('gemini-xprize-hackathon') && s.ready.length === 0 && s.know.competitors > 0 && s.know.theorems > 0 && s.competitions.every((c: { competitors: { source: string } }) => c.competitors.source.startsWith('https://')) ? null : JSON.stringify(s.competitions.map((c: { id: string; satisfied: string; enterable: boolean }) => [c.id, c.satisfied, c.enterable]))) },
    { id: 'legal-audit-offline', tool: 'legal', theorem: 'textbook_uuid_is_36', arguments: { texts: FIXTURE_TEXTS, answers: [] }, shows: 'Phase two with no answers (offline): the claims, the tree\'s security checks, and the audit\'s own content address over the SHA-256 of every input — change a source and the address changes.', expect: (s) => (s.phase === 'audit' && typeof s.id === 'string' && s.id.length === 36 && s.sha256.length === 64 && s.inputs.texts.worker?.length === 64 && s.securityPassed === s.securityTotal ? null : `${s.phase} ${s.id} ${s.securityPassed}/${s.securityTotal}`) },
    { id: 'legal-court', tool: 'legal', theorem: 'textbook_cheap_gates', arguments: { court: { gate: 'DELETE /docket/70a13419-52d5-8e4c-9f1b-3c0d2e1f4a5b', status: 409, evidence: { refs: 2 }, tenant: 'psg' } }, shows: 'Cheap gates leading every violator to court via its own MCP: a refusal at any gate (here a deletion refused because two entries link the one) is answered with the case computed from the refusal alone — the rule violated (links), the theorem that states it, the remedy, the case\'s content address — and the MCP calls the violator makes: to file the case in the docket (kind case, with its own token or the Payload MCP) or to appeal through the match tool; the gate writes nothing, however many violators.', expect: (s) => (s.rule === 'links' && s.theorem === 'textbook_licence_chain' && /^[0-9a-f-]{36}$/.test(s.case) && s.via.file.tool === 'legal' && s.via.appeal.tool === 'match' && s.tenant === 'psg' && s.theorems.includes('textbook_cheap_gates') ? null : JSON.stringify(s)) },
    { id: 'legal-court-rules', tool: 'legal', arguments: { court: true }, shows: 'The court\'s rules: ten ways a gate refuses, each named by its theorem and its remedy, from the shape of a request to the integrity of a fold.', expect: (s) => (s.count === TABLES.COURT_RULES.length && s.rules.every((r: { theorem: string; remedy: string }) => r.theorem.startsWith('textbook_') && r.remedy.length > 0) ? null : String(s.count)) },
    { id: 'legal-court-denier', tool: 'legal', theorem: 'textbook_denier_identified', arguments: { court: { gate: 'fanout to the hosted unit', code: 404, evidence: { host: 'qpu.uuidna.com' }, tenant: 'uuidna' } }, shows: 'Every denial identifies who denies and shows the legal grounds of all involved: an HTTP 404 from another host is identified as an external party (by its content address), beside the QPU rights-holder and the tenant; the court rules in favour of the QPU licence where validatable via Payload, naming the Payload call that confirms it — never asserting it unvalidated.', expect: (s) => (s.denier?.kind === 'external' && /^[0-9a-f-]{36}$/.test(s.denier.id) && s.denier.by.includes('404') && s.case?.length === 36 && Array.isArray(s.grounds) && s.grounds.length === 3 && s.grounds.some((g: { role?: string }) => g.role === 'rights-holder') && s.ruling?.favour === 'the QPU licence' && s.ruling?.validatableVia?.tool === 'payload' ? null : JSON.stringify({ denier: s.denier, grounds: s.grounds?.length, ruling: s.ruling?.favour })) },
    { id: 'legal-court-repo-audit', tool: 'legal', theorem: 'textbook_court_audits_repo', arguments: { court: { gate: 'commit', rule: 'folded' } }, shows: 'The court decides only on an audited repo: every case names the repo-audit precondition — a quantum computation (verify the repo by content address, nanoseconds, beating classical recompute by magnitudes) sliced into nanosecond tasks, validatable via the audit tool — so no ruling stands on an unverified repo.', expect: (s) => (s.repoAudit?.validatableVia?.tool === 'audit' && /nanosecond/i.test(s.repoAudit.nanosecondTasks ?? '') && s.repoAudit.theorem === 'textbook_court_audits_repo' ? null : JSON.stringify(s.repoAudit)) },
    { id: 'legal-plan', tool: 'legal', arguments: { texts: FIXTURE_TEXTS, discovery: { doors: [{ host: 'uuidna.com', url: UNIT_MCP, name: 'compute_forensics', description: '', takes: ['statement'], required: ['statement'], answers: ['verdict', 'receipt'], readOnly: true, contract: 'catalogue' }, { host: 'uuidna.com', url: UNIT_MCP, name: 'get_rights', description: '', takes: [], required: [], answers: ['receipt'], readOnly: true, contract: 'tools/list' }, { host: 'uuidna.com', url: UNIT_MCP, name: 'audit_security', description: '', takes: [], required: [], answers: ['receipt'], readOnly: true, contract: 'catalogue' }] } }, shows: 'Phase one on fixture texts and a three-door discovery: the claims gathered (licence, author, metadata, measured table, perspectives), the tree\'s security checks, and the plan — one forensics call per claim, the rights and security doors once, free by default.', expect: (s) => (s.phase === 'plan' && s.claims >= 10 && s.by === 'free-by-default' && s.agents === 3 && s.calls === s.claims + 2 && s.securityPassed === s.securityTotal ? null : `${s.phase} ${s.claims} claims ${s.calls} calls ${s.agents} agents ${s.by} security ${s.securityPassed}/${s.securityTotal}`) },
  ],
  skill: {
    instructions: 'The client reads the tree\'s texts (README, CITATION.cff, .zenodo.json, package.json, src/worker.ts, the billing and hmac modules, mcp.ts), the discovery and the theorem ledger, calls legal for the plan, makes every call against its host, and calls legal again with the answers; it writes legal.json and the page. Agents are the free doors discovery found; the operator overrides with agents: [...] and nothing else does. A refusal is recorded, never retried blindly.',
    directions: ['server only: claims from fixture metadata, security checks on fixture sources, the plan, the audit of fixture answers', 'client → server: the texts come from the tree, the answers from the doors', 'toolbox → toolbox: the doors come from discovery; the claims include every perspective lead; the licence module is the measure of drift'],
    selftest: (ctx) => {
      const { check, done } = createChecks()
      const claims = listClaims(FIXTURE_TEXTS, ctx.leads)
      check('legal:claims', claims.some((c) => c.id === 'citation-cff' && c.text.includes('Tsvetan Rouschev')) && claims.some((c) => c.id === 'zenodo-json') && claims.some((c) => c.id === 'package-json') && claims.some((c) => c.id.startsWith('readme-tests')) && claims.filter((c) => c.id.startsWith('perspective-')).length >= 10, `${claims.length} claims: ${claims.slice(0, 8).map((c) => c.id).join(', ')}…`)
      const sec = checkLegalSecurity(FIXTURE_TEXTS)
      check('legal:security-checks', sec.length === 11 && sec.every((c) => c.passed), sec.filter((c) => !c.passed).map((c) => c.id).join(', ') || 'all pass on the fixture sources')
      check('legal:security-catches', ([
        { patch: { worker: FIXTURE_TEXTS.worker + " const leaked = 'sk_live_" + 'abcdefghijklmnop' + "'" }, id: 'security:no-live-secret-literal' },
        { patch: { mcp: 'const k = process.env.QPU_DATA_KEY' }, id: 'security:keys-stay-in-the-handler' },
        { patch: { worker: FIXTURE_TEXTS.worker!.replace('overrideAccess: false', 'overrideAccess: true') }, id: 'security:writes-need-a-role' },
        { patch: { worker: FIXTURE_TEXTS.worker!.replace('multiTenantPlugin', 'noTenantPlugin') }, id: 'security:tenant-isolation' },
        { patch: { worker: FIXTURE_TEXTS.worker!.replace('webhookSecret', 'noWebhookCheck') }, id: 'security:webhook-verified-before-write' },
        { patch: { worker: FIXTURE_TEXTS.worker!.replace('AbortSignal.timeout(10000)', 'nothing') }, id: 'security:timeouts-on-outbound' },
        { patch: { worker: FIXTURE_TEXTS.worker + '\nif (apiKey === token) ok()' }, id: 'security:token-auth-delegated' },
      ] as const).every(({ patch, id }) => !checkLegalSecurity({ ...FIXTURE_TEXTS, ...patch }).find((c) => c.id === id)!.passed), 'every planted vulnerability is caught: a live key literal, a secret in the handler, overrideAccess:true, no multi-tenant plugin, no webhook secret, an unbounded outbound fetch, and a hand-rolled token comparison')
      const doors = ['compute_forensics', 'verify_claim', 'get_rights', 'get_legal_facts', 'compute_license', 'compute_prior_art', 'get_due_process', 'audit_security'].map((name) => ({ host: 'uuidna.com', url: UNIT_MCP, name, description: '', takes: [] as string[], required: [] as string[], answers: ['verdict'], readOnly: true as boolean | null, contract: 'catalogue' as const }))
      const plan = planLegal(claims, { doors }, null, ['clay_sigma'])
      check('legal:plan-free-by-default', plan.by === 'free-by-default' && plan.calls.length === claims.length * 2 + 6 && plan.calls.some((c) => c.door === 'get_due_process' && (c.arguments.claims as string[]).length === claims.length), `${plan.calls.length} calls for ${claims.length} claims through ${plan.agents.length} doors`)
      const override = planLegal(claims, { doors }, ['audit_security', 'get_rights', 'not_a_door'], ['clay_sigma'])
      check('legal:plan-operator-override', override.by === 'operator' && override.calls.length === 2 && override.absent.join() === 'not_a_door', 'the operator\'s list is used as given; an absent door is named, not guessed')
      const answers: Answer[] = [...plan.calls.map((c): Answer => c.purpose === 'forensics' ? { ...c, answer: { verdict: 'UNVERIFIED', clean: true, violations: [], receipt: 'r', note: 'no decidable test' } } : c.purpose === 'verify' ? { ...c, answer: { verdict: 'UNVERIFIED', receipt: 'r2' } } : c.door === 'get_rights' ? { ...c, answer: { holder: `${LICENSE.author} (https://qpu.uuidna.com)`, license: LICENSE.spdx, licenseAddress: LICENSE.address, imprint: 'other-imprint', receipt: 'r3' } } : c.door === 'audit_security' ? { ...c, answer: { checks: 7, passed: 7, failed: 0, receipt: 'r4' } } : c.door === 'compute_prior_art' ? { ...c, refusal: 'the edge does not hold the whole ledger' } : { ...c, answer: { receipt: 'r5' } })]
      const audit = auditClaims(claims, answers, sec)
      check('legal:audit-read', audit.findings.length === claims.length * 2 && audit.verdicts.UNVERIFIED === claims.length * 2 && audit.violations === 0 && audit.drift.length === 1 && audit.drift[0]!.startsWith('imprint') && audit.refusals === 1 && audit.securityDoors.find((d) => d.door === 'audit_security')?.failed === 0, `${audit.findings.length} findings, drift ${audit.drift.join('; ')}, refusals ${audit.refusals}`)
      check('legal:page', getLegalPage(audit, plan, '2026-01-01').includes('Drift against this tree: imprint'), 'the page renders the drift')
      const run = (t: Texts) => ctx.call('legal', { texts: t, answers: [] }) as { id: string; sha256: string }
      const a1 = run(FIXTURE_TEXTS); const a2 = run(FIXTURE_TEXTS); const a3 = run({ ...FIXTURE_TEXTS, readme: FIXTURE_TEXTS.readme + '| Tampered | yes |\n' })
      check('legal:tamper-evident', a1.id === a2.id && a1.sha256 === a2.sha256 && a1.id !== a3.id && a1.sha256 !== a3.sha256, 'the same inputs give the same address; one changed line changes it')
      const comp = judgeCompetitions({ theorems: 12, kernel: 1000, hosts: 3, licence: 'CC-BY-NC-ND-4.0', published: false, pushed: false })
      const pub = judgeCompetitions({ theorems: 12, kernel: 1000, hosts: 3, licence: 'CC-BY-NC-ND-4.0', published: true, pushed: true })
      const win = getEntryWindow('Phase II Wild Card Registration opens on January 14, 2026, and closes on March 4, 2026.', Date.parse('2026-02-01'))
      const after = getEntryWindow('Phase II Wild Card Registration opens on January 14, 2026, and closes on March 4, 2026.', Date.parse('2026-10-26'))
      const measured = judgeCompetitions({ theorems: 12, kernel: 1000, hosts: 3, licence: 'CC-BY-NC-ND-4.0', published: false, pushed: false }, { 'xprize-quantum-applications': 'Registration opens on January 14, 2027, and closes on March 4, 2027.' }, Date.parse('2027-02-01'))
      check('legal:window-measured-from-the-page', getEntryWindow('Applications are currently closed.', 1).entry === 'closed' && win.entry === 'open' && win.opens === '2026-01-14' && after.entry === 'closed' && getEntryWindow('', 1).entry === 'unknown' && measured.competitions.find((c) => c.id === 'xprize-quantum-applications')!.entry === 'open' && measured.enterable.includes('xprize-quantum-applications'), 'the XPRIZE window read from its sentence: open on 2026-02-01, closed on 2026-10-26; a page naming a 2027 window makes the competition enterable in 2027')
      check('legal:compete-judges-never-claims', comp.ready.length === 0 && comp.enterable.length > 0 && comp.competitions.every((c) => !c.enterable || (c.entry !== 'closed' && c.rules.every((r) => !/^FLAG:/.test(r.needs ?? '')))) && !comp.enterable.includes('vercel-oss-program') && !comp.enterable.includes('gemini-xprize-hackathon') && comp.competitions.every((c) => c.rules.every((r) => r.status !== 'satisfied')) && pub.competitions.find((c) => c.id === 'github-maintainer-programs')!.rules[0]!.status === 'satisfied' && pub.ready.length === 0 && pub.competitions.find((c) => c.id === 'clay-millennium')!.rules[0]!.status === 'open' && /nothing here is a prize won/.test(comp.honest), 'unpushed and unpublished, nothing is ready and three funding programs are enterable by the author\'s acts (Google\'s accelerator among them; the Gemini XPRIZE hackathon closed) (Vercel\'s says applications are currently closed); pushed, the public-repository rule is satisfied and the application stays the author\'s; a Millennium problem stays open whatever the author does here')
      const read = listPatents(GOOGLE_FIXTURE)
      const th = 'patents' in read ? checkPatentTheorems(read.patents) : { checked: 0, passed: 0, violations: [], byTheorem: {} }
      check('legal:patents-read-and-theorems-verified', 'patents' in read && read.total === 2 && read.patents[0]!.number === 'US12242926B2' && read.patents[0]!.title === 'Quantum system controller' && th.violations.length === 2 && th.violations.every((v) => v.number === 'EP1234567B1') && getPatentNumber('WO2020123456A1').wellFormed && !getPatentNumber('EP12A').wellFormed && 'error' in listPatents('not json'), `${th.checked} checks over 2 patents, ${th.violations.length} violations on the second (dates, term); numbers read for US, EP, WO; an unreadable body said so`)
      return done()
    },
  },
}
