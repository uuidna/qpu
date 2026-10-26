// The legal toolbox: a full legal and security audit with forensic analysis, of this MCP, through MCP. Phase one gathers the
// author's claims from the tree (the licence module, the metadata files, the perspectives) and plans the calls: every claim
// to the unit's forensic and verification doors, the legal facts, the licence computed for this tree, the prior art of its
// theorems, due process over the claims, and every security door the unit serves — chosen from discovery, free agents by
// default, overridden only by the operator's own list. Phase two reads the answers into verdicts, drift and findings, beside
// the tree's own security checks over its source texts. Pure; the client fetches. Recomputable facts, not legal advice.
import { toolOf, type Toolbox } from '../toolbox.js'
import { LICENSE } from '../license.js'
import type { Discovery } from '../discovery.js'
import type { Lead } from '../leads.js'
import { flowWidget } from '../widgets.js'
import { sha256, utf8, hex } from '../hmac.js'
import { uuidOf } from '../blocks.js'
import { THEOREMS, KERNEL_THEOREMS } from '../theorems-index.js'

export type Claim = { id: string; source: string; text: string }
export type Call = { door: string; host: string; arguments: Record<string, unknown>; purpose: 'forensics' | 'verify' | 'legal' | 'security' | 'due-process' | 'prior-art' | 'licence' }
export type Answer = Call & { answer?: unknown; refusal?: string }
export type Texts = { readme?: string; citation?: string; zenodo?: string; package?: string; worker?: string; billing?: string; hmac?: string; mcp?: string }

/** The claims the author makes, read from the tree and its metadata; each a sentence a door can judge. */
export const claimsOf = (texts: Texts, leads: readonly Lead[], cite?: { theorem?: string | null }): Claim[] => {
  // a claim with legal words is backed by a sealed guarantee of the unit's own court (a theorem key its due-process door names),
  // never by a receipt: the forensic door admits a cited theorem and treats any other UUID as an address it must find sealed
  const backed = ` backed by theorem ${cite?.theorem ?? 'legal_only_the_proven_is_admitted'}`
  const out: Claim[] = [
    { id: 'licence-spdx', source: 'src/quantum/license.ts', text: `@uuidna/qpu is licensed ${LICENSE.spdx} by ${LICENSE.author}; commercial use requires a licence from the author,${backed}` },
    { id: 'licence-address', source: 'src/quantum/license.ts', text: `the licence record is at ${LICENSE.url}; its address and imprint are the ones the unit's rights door gives, carried by every result as _meta.license,${backed}` },
    { id: 'author-orcid', source: 'src/quantum/license.ts', text: `the author is ${LICENSE.author}, ORCID ${LICENSE.orcid}` },
    { id: 'representation', source: 'src/quantum/license.ts', text: `${LICENSE.representation.replace(/\.$/, '')},${backed}` },
    { id: 'disclaimer', source: 'src/quantum/license.ts', text: `${LICENSE.disclaimer.replace(/\.$/, '')},${backed}` },
  ]
  const field = (text: string | undefined, re: RegExp) => text?.match(re)?.[1]?.trim()
  const citationAuthor = field(texts.citation, /family-names:\s*(\S+)/); const citationGiven = field(texts.citation, /given-names:\s*(\S+)/); const citationLicence = field(texts.citation, /^license:\s*(\S+)/m); const citationOrcid = field(texts.citation, /orcid:\s*(\S+)/)
  if (texts.citation) out.push({ id: 'citation-cff', source: 'CITATION.cff', text: `CITATION.cff names ${citationGiven ?? '?'} ${citationAuthor ?? '?'} (${citationOrcid ?? 'no ORCID'}) as the author under ${citationLicence ?? 'no licence'}` })
  if (texts.zenodo) { try { const z = JSON.parse(texts.zenodo) as { creators?: { name: string; orcid?: string }[]; license?: string; title?: string }; out.push({ id: 'zenodo-json', source: '.zenodo.json', text: `.zenodo.json names ${z.creators?.map((c) => `${c.name} (${c.orcid ?? 'no ORCID'})`).join(', ') ?? 'nobody'} as creator of ${z.title ?? '?'} under ${z.license ?? 'no licence'}` }) } catch { out.push({ id: 'zenodo-json', source: '.zenodo.json', text: '.zenodo.json is not valid JSON' }) } }
  if (texts.package) { try { const p = JSON.parse(texts.package) as { name?: string; version?: string; license?: string; author?: { name?: string } | string }; out.push({ id: 'package-json', source: 'package.json', text: `package.json names ${p.name ?? '?'} ${p.version ?? ''} under ${p.license ?? 'no licence'} by ${typeof p.author === 'string' ? p.author : p.author?.name ?? 'nobody'}` }) } catch { out.push({ id: 'package-json', source: 'package.json', text: 'package.json is not valid JSON' }) } }
  for (const m of (texts.readme ?? '').matchAll(/^\| ([^|]+) \| ([^|]+) \|$/gm)) if (!/^-+$|^Measure$/.test(m[1]!.trim())) out.push({ id: `readme-${m[1]!.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`, source: 'README.md measured table', text: `${m[1]!.trim()}: ${m[2]!.trim()}` })
  for (const l of leads.filter((x) => x.id.startsWith('perspective-'))) out.push({ id: l.id, source: l.source, text: l.statement })
  return out
}

/** The tree's own security checks over its source texts: what a reader would ask of a Worker that holds tokens and keys. */
export const securityOf = (texts: Texts): { id: string; passed: boolean; evidence: string }[] => {
  const w = texts.worker ?? ''; const b = texts.billing ?? ''; const h = texts.hmac ?? ''; const m = texts.mcp ?? ''
  const all = `${w}\n${b}\n${h}\n${m}\n${texts.readme ?? ''}`
  const checks: { id: string; passed: boolean; evidence: string }[] = []
  const check = (id: string, passed: boolean, evidence: string) => checks.push({ id, passed, evidence })
  if (!w) { check('security:worker-text', false, 'no worker source given: nothing measured'); return checks }
  check('security:no-live-secret-literal', !/\b(sk_live_|whsec_[0-9A-Za-z]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC )?PRIVATE KEY)/.test(all), 'no live Stripe key, webhook secret, AWS key or private key literal in the sources')
  check('security:tokens-compared-in-constant-time', /const sameToken[\s\S]*?\^/.test(w) || /sameToken = [\s\S]{0,400}\^/.test(w), 'sameToken xors the bytes; no early exit on a mismatch')
  check('security:signature-compared-in-constant-time', /sameHex[\s\S]*?\^/.test(h) && /sameHex\(/.test(b), 'the Stripe signature is compared by sameHex, xor over every character')
  check('security:writes-need-a-role', /need && role === 'reader'/.test(w) && /need === 'admin' && role !== 'admin'/.test(w), 'POST needs writer, DELETE needs admin; a reader is refused with the procedure')
  check('security:tenant-isolation', /idFromName\(tenant\)/.test(w) && !/idFromName\('qpu'\)/.test(w), 'the docket is addressed by tenant, never by a fixed name')
  check('security:webhook-verified-before-write', /verifySignature\(/.test(b) && /if \(!out\.valid\) return json/.test(w), 'a webhook is verified before anything is written; a refusal is answered 400 and recorded as a lead')
  check('security:keys-stay-in-the-worker', !/STRIPE_SECRET_KEY|QPU_DATA_KEY|QPU_WRITE_TOKEN/.test(m), 'the handler names no secret; the Worker alone reads env')
  check('security:cors-headers', /Access-Control-Allow-Origin/.test(w) && /OPTIONS/.test(w), 'cross-origin reads allowed, preflight answered')
  check('security:timeouts-on-outbound', /AbortSignal\.timeout\(/.test(w), 'every outbound fetch of the Worker carries a timeout')
  check('security:no-eval', !/\beval\(|new Function\(/.test(all), 'no eval, no Function constructor')
  return checks
}

const DOOR_PURPOSE: Record<string, Call['purpose']> = { get_legal_facts: 'legal', get_rights: 'legal', get_laws: 'legal', compute_license: 'licence', compute_prior_art: 'prior-art', get_due_process: 'due-process', audit_security: 'security', audit_cloudflare: 'security', detect_traitors: 'security', get_conformance: 'security', get_fingerprint: 'security', audit_full_anti_fraud: 'security', get_guard_lessons: 'security' }

/** The calls: every claim to the forensic and verification doors; the legal, licence, prior-art, due-process and security doors once. */
export const planOf = (claims: readonly Claim[], discovery: Pick<Discovery, 'doors'> | null, agents: readonly string[] | null, theoremKeys: readonly string[]): { calls: Call[]; agents: string[]; by: 'operator' | 'free-by-default'; absent: string[]; operatorAgents: { id: string; endpoint: string; model: string; key: string; version: string; chosen: boolean; note: string }[] } => {
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
    else if (name === 'compute_prior_art') calls.push({ door: name, host: host(name), arguments: { keys: theoremKeys.slice(0, 50) }, purpose: 'prior-art' })
    else if (name === 'get_due_process') calls.push({ door: name, host: host(name), arguments: { claims: claims.map((c) => c.text) }, purpose: 'due-process' })
    else calls.push({ door: name, host: host(name), arguments: {}, purpose: DOOR_PURPOSE[name] ?? 'security' })
  }
  return { calls, agents: chosen, by: agents?.length ? 'operator' : 'free-by-default', absent, operatorAgents: [{ id: 'claude-api', endpoint: 'https://api.anthropic.com/v1/messages', model: 'claude-opus-5-5', key: 'ANTHROPIC_API_KEY[_<TENANT>]', version: '2023-06-01', chosen: !!agents?.includes('claude-api'), note: 'an operator agent: it joins the audit only when the operator names it (agents: ["claude-api"]) and the tenant\'s key is in the client\'s request; the free doors are the default and are never overridden' }] }
}

export type Finding = { claim: string; door: string; verdict: string | null; clean: boolean | null; violations: number; violationKinds: string[]; note: string; receipt: string | null; refusal: string | null }
/** The answers read: verdicts per claim, drift between the unit's facts and the tree's licence, security findings, due process gaps. */
export const auditOf = (claims: readonly Claim[], answers: readonly Answer[], security: readonly { id: string; passed: boolean; evidence: string }[]) => {
  const findings: Finding[] = []
  for (const a of answers.filter((x) => x.purpose === 'forensics' || x.purpose === 'verify')) {
    const claim = claims.find((c) => c.text === (a.arguments.statement as string))?.id ?? '?'
    if (a.refusal !== undefined) { findings.push({ claim, door: a.door, verdict: null, clean: null, violations: 0, violationKinds: [], note: '', receipt: null, refusal: a.refusal.slice(0, 200) }); continue }
    const r = (a.answer ?? {}) as { verdict?: string; clean?: boolean; violations?: { kind?: string; detail?: string }[]; note?: string; honest?: string; receipt?: string }
    const kinds = Array.isArray(r.violations) ? r.violations.map((v) => `${v.kind ?? 'violation'}: ${(v.detail ?? '').slice(0, 120)}`) : []
    findings.push({ claim, door: a.door, verdict: r.verdict ?? null, clean: typeof r.clean === 'boolean' ? r.clean : null, violations: kinds.length, violationKinds: kinds, note: (kinds.length ? kinds.join('; ') : r.note ?? r.honest ?? '').slice(0, 240), receipt: r.receipt ?? null, refusal: null })
  }
  const legal = answers.find((a) => a.door === 'get_legal_facts')?.answer as Record<string, unknown> | undefined
  const rights = answers.find((a) => a.door === 'get_rights')?.answer as Record<string, unknown> | undefined
  const drift: string[] = []
  if (rights) { if (rights.license !== LICENSE.spdx) drift.push(`spdx ${rights.license} vs ${LICENSE.spdx}`); if (rights.licenseAddress !== LICENSE.address) drift.push(`licence address ${rights.licenseAddress} vs ${LICENSE.address}`); if (rights.imprint !== LICENSE.imprint) drift.push(`imprint ${rights.imprint} vs ${LICENSE.imprint}`); if (typeof rights.holder === 'string' && !rights.holder.includes(LICENSE.author)) drift.push(`holder ${rights.holder} vs ${LICENSE.author}`) }
  const licence = answers.find((a) => a.door === 'compute_license')?.answer as { scope?: string; spdx?: string; bill?: { free?: boolean } } | undefined
  const priorArt = answers.find((a) => a.door === 'compute_prior_art')?.answer as { exhibits?: unknown[]; missing?: string[]; author?: string } | undefined
  const due = answers.find((a) => a.door === 'get_due_process')?.answer as { allGuaranteesSealed?: boolean; gaps?: unknown[]; docket?: unknown[]; traitors?: unknown[] } | undefined
  const securityDoors = answers.filter((a) => a.purpose === 'security').map((a) => { const r = (a.answer ?? {}) as Record<string, unknown>; return { door: a.door, refusal: a.refusal ?? null, clean: typeof r.clean === 'boolean' ? r.clean : typeof r.allClear === 'boolean' ? r.allClear : typeof r.conforms === 'boolean' ? r.conforms : typeof r.allHold === 'boolean' ? r.allHold : typeof r.fraudDetected === 'boolean' ? !r.fraudDetected : null, failed: typeof r.failed === 'number' ? r.failed : Array.isArray(r.traitors) ? r.traitors.length : Array.isArray(r.offenders) ? r.offenders.length : null, receipt: typeof r.receipt === 'string' ? r.receipt : null, honest: typeof r.honest === 'string' ? r.honest.slice(0, 160) : '' } })
  const verdicts = findings.reduce<Record<string, number>>((acc, f) => ({ ...acc, [f.verdict ?? (f.refusal ? 'refused' : 'none')]: (acc[f.verdict ?? (f.refusal ? 'refused' : 'none')] ?? 0) + 1 }), {})
  const violations = findings.reduce((n, f) => n + f.violations, 0)
  return { claims: claims.length, findings, verdicts, violations, drift, legalFacts: legal ?? null, rights: rights ? { holder: rights.holder, license: rights.license, licenseAddress: rights.licenseAddress, imprint: rights.imprint, receipt: rights.receipt } : null, licence: licence ? { scope: licence.scope, spdx: licence.spdx, free: licence.bill?.free } : null, priorArt: priorArt ? { exhibits: priorArt.exhibits?.length ?? 0, missing: priorArt.missing?.length ?? 0, author: priorArt.author } : null, dueProcess: due ? { allGuaranteesSealed: due.allGuaranteesSealed, gaps: due.gaps?.length ?? 0, docket: due.docket?.length ?? 0, traitors: due.traitors?.length ?? 0 } : null, securityDoors, security: [...security], securityPassed: security.filter((c) => c.passed).length, securityTotal: security.length, refusals: answers.filter((a) => a.refusal !== undefined).length }
}

export const legalPageOf = (a: ReturnType<typeof auditOf>, plan: { agents: string[]; by: string; absent: string[] }, date: string): string => ['---', 'title: Legal', 'order: 56', '---', '', '# The legal and security audit, through MCP', '',
  `> ${(a.legalFacts as { disclaimer?: string } | null)?.disclaimer ?? LICENSE.disclaimer}`, '', `Run by \`npm run next\` on ${date} through the \`legal\` tool: every claim the author makes in this tree sent to the unit's forensic and verification doors, the unit's legal facts and rights beside this tree's licence module, the licence computed for this tree, the prior art of its theorems, due process over the claims, every security door the unit serves, and the tree's own security checks over its sources. Agents: ${plan.agents.join(', ')} (${plan.by}${plan.absent.length ? `; absent: ${plan.absent.join(', ')}` : ''}). ${LICENSE.disclaimer}`, '',
  `## Claims: ${a.claims}; verdicts ${Object.entries(a.verdicts).map(([k, v]) => `${k} ${v}`).join(', ')}; violations ${a.violations}; refusals ${a.refusals}`, '',
  '| Claim | Door | Verdict | Clean | Violations | Receipt | Note or refusal |', '|---|---|---|---|---:|---|---|', ...a.findings.map((f) => `| ${f.claim} | ${f.door} | ${f.verdict ?? '—'} | ${f.clean === null ? '—' : f.clean} | ${f.violations} | ${f.receipt ?? '—'} | ${(f.note || f.refusal || '').replace(/\|/g, '\\|')} |`), '',
  '## Rights and drift', '', a.rights ? `The unit's rights: holder ${a.rights.holder}, ${a.rights.license}, licence address ${a.rights.licenseAddress}, imprint ${a.rights.imprint}, receipt ${a.rights.receipt}. ${a.drift.length ? `Drift against this tree: ${a.drift.join('; ')}.` : 'No drift against this tree\'s licence module.'}` : 'The rights door was not reached.', '',
  '## Licence, prior art, due process', '', `Licence computed for this tree: ${a.licence ? `${a.licence.scope}, ${a.licence.spdx}, free ${a.licence.free}` : 'not reached'}. Prior art: ${a.priorArt ? `${a.priorArt.exhibits} exhibits, ${a.priorArt.missing} keys missing from the unit's ledger (qpu's own theorems are not sealed there: lead gap-theorems-unsealed), author ${a.priorArt.author}` : 'not reached'}. Due process: ${a.dueProcess ? `guarantees sealed ${a.dueProcess.allGuaranteesSealed}, ${a.dueProcess.docket} on the docket, ${a.dueProcess.gaps} gaps, ${a.dueProcess.traitors} traitors` : 'not reached'}.`, '',
  '## Security doors of the unit', '', '| Door | Clean | Failed | Receipt | Honest |', '|---|---|---:|---|---|', ...a.securityDoors.map((d) => `| ${d.door} | ${d.refusal ? `refused: ${d.refusal.slice(0, 80)}` : d.clean === null ? '—' : d.clean} | ${d.failed ?? '—'} | ${d.receipt ?? '—'} | ${d.honest.replace(/\|/g, '\\|')} |`), '',
  `## This tree's security checks: ${a.securityPassed} of ${a.securityTotal}`, '', '| Check | Passed | Evidence |', '|---|---|---|', ...a.security.map((c) => `| ${c.id} | ${c.passed ? '✓' : '✗'} | ${c.evidence.replace(/\|/g, '\\|')} |`), ''].join('\n')

const legal = toolOf('legal', {
  name: 'legal',
  description: 'The full legal and security audit with forensic analysis, through MCP. Phase one (texts, discovery, agents?, theoremKeys?): the author\'s claims gathered from the tree and its metadata, this tree\'s own security checks over its sources, and the plan of calls to the unit\'s forensic, verification, legal, licence, prior-art, due-process and security doors — free agents found by discovery by default, the operator\'s own list when given. Phase two (plus answers): verdicts per claim, drift against this tree\'s licence, the findings, the page. Recomputable facts, not legal advice.',
  inputSchema: { type: 'object', properties: { texts: { type: 'object', description: '{ readme, citation, zenodo, package, worker, billing, hmac, mcp }: the texts of the tree' }, discovery: { type: 'object' }, agents: { type: 'array', items: { type: 'string' }, description: 'the operator\'s override: the doors to use; omit for the free doors discovery found' }, theoremKeys: { type: 'array', items: { type: 'string' } }, citeTheorem: { type: 'string', description: 'the sealed guarantee of the unit\'s court cited beside every legal claim; default legal_only_the_proven_is_admitted, a key its due-process door names' }, answers: { type: 'array', items: { type: 'object' } }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...LEGAL.skill.selftest(ctx) }
    const texts = (args.texts ?? {}) as Texts
    const claims = claimsOf(texts, ctx.leads, { theorem: typeof args.citeTheorem === 'string' ? args.citeTheorem : null })
    const security = securityOf(texts)
    const plan = planOf(claims, (args.discovery as Discovery | undefined) ?? null, Array.isArray(args.agents) ? args.agents.map(String) : null, Array.isArray(args.theoremKeys) ? args.theoremKeys.map(String) : [])
    if (!Array.isArray(args.answers)) return { phase: 'plan' as const, claims: claims.length, calls: plan.calls.length, agents: plan.agents.length, by: plan.by, securityPassed: security.filter((c) => c.passed).length, securityTotal: security.length, claimList: claims, plan, security }
    const audit = auditOf(claims, args.answers as Answer[], security)
    const date = new Date().toISOString()
    // Tampering impossible by computation: every input is named by its SHA-256, the audit by its content address; change a source
    // or an answer and the address changes; recompute and compare (the verify tool) and the difference is the tampering.
    const inputs = { texts: Object.fromEntries(Object.entries(texts).filter(([, t]) => typeof t === 'string').map(([k, t]) => [k, hex(sha256(utf8(t as string)))])), discovery: args.discovery ? hex(sha256(utf8(JSON.stringify(args.discovery)))) : null, theoremKeys: hex(sha256(utf8(JSON.stringify(args.theoremKeys ?? [])))), answers: hex(sha256(utf8(JSON.stringify(args.answers)))) }
    const content = JSON.stringify({ inputs, audit, agents: plan.agents, by: plan.by })
    const id = uuidOf(content)
    return { phase: 'audit' as const, id, sha256: hex(sha256(utf8(content))), inputs, claims: audit.claims, violations: audit.violations, refusals: audit.refusals, drift: audit.drift.length, securityPassed: audit.securityPassed, securityTotal: audit.securityTotal, by: plan.by, audit, page: legalPageOf(audit, plan, date) }
  },
  widget: flowWidget,
})

const FIXTURE_TEXTS: Texts = { citation: 'cff-version: 1.2.0\ntitle: QPU\nauthors:\n  - family-names: Rouschev\n    given-names: Tsvetan\n    orcid: https://orcid.org/0009-0000-7312-9778\nlicense: CC-BY-NC-ND-4.0\n', zenodo: '{"creators":[{"name":"Rouschev, Tsvetan","orcid":"0009-0000-7312-9778"}],"license":"cc-by-nc-nd-4.0","title":"QPU"}', package: '{"name":"@uuidna/qpu","version":"1.4.0","license":"CC-BY-NC-ND-4.0","author":{"name":"Tsvetan Rouschev"}}', readme: '| Measure | Value |\n|---|---:|\n| Tests | 152 pass |\n', worker: "const sameToken = (a, b) => { let d = 0; for (...) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0 }\nif (need && role === 'reader') return json()\nif (need === 'admin' && role !== 'admin') return json()\nidFromName(tenant)\nif (!out.valid) return json({ refused })\nAccess-Control-Allow-Origin OPTIONS AbortSignal.timeout(5000)", billing: 'verifySignature(secret) sameHex(expected, v1)', hmac: 'export const sameHex = (a, b) => { let d = 0; d |= a.charCodeAt(i) ^ b.charCodeAt(i) }', mcp: 'const BALANCER = new Map()' }

/** The competitions with prizes and funding, their rules read at the source (2026-10-26) and judged against this tree's own evidence on every run:
 * a rule is satisfied, pending (the author's act), closed (the window has passed) or open (a lead). Nothing is claimed won; what the rules
 * require and what the tree holds are stated, and the gap is the author's act or a lead. */
export type Rule = { rule: string; needs: string; status: 'satisfied' | 'pending' | 'closed' | 'open'; evidence: string; act?: string }
export const COMPETITIONS: readonly { id: string; name: string; prize: string; rules: string; read: string; kind: 'prize' | 'funding'; entry: 'open' | 'closed' | 'rolling' | 'unknown'; note: string; requires: readonly Omit<Rule, 'status' | 'evidence'>[] }[] = [
  { id: 'clay-millennium', name: 'Clay Mathematics Institute, the Millennium Prize Problems', prize: 'USD 1 000 000 per problem (seven; one solved, Poincaré)', rules: 'https://www.claymath.org/millennium-problems/rules/', read: '2026-10-26', kind: 'prize', entry: 'rolling', note: 'CMI considers a proposed solution only when all three conditions hold: (i) published in a Qualifying Outlet (§6), (ii) two years passed since publication, (iii) general acceptance in the mathematics community; then the Scientific Advisory Board advises', requires: [
    { rule: 'a solution of one of the seven problems', needs: 'a proof accepted by the community, not an identity: the σ-involution bridge theorems here are kernel-checked integer identities, not solutions of any Millennium problem', act: 'none claimed: a solution is mathematics the author would publish' },
    { rule: '(i) published in a Qualifying Outlet', needs: 'a refereed journal or outlet of §6', act: 'the author publishes (the release and its DOI are the author\'s acts)' },
    { rule: '(ii) two years since publication', needs: 'time', act: 'wait two years after (i)' },
    { rule: '(iii) general acceptance', needs: 'the community', act: 'none the tree can take' },
  ] },
  { id: 'xprize-quantum-applications', name: 'XPRIZE Quantum Applications (Google Quantum AI, title sponsor)', prize: 'USD 5 000 000 purse', rules: 'https://www.xprize.org/prizes/qc-apps', read: '2026-10-26', kind: 'prize', entry: 'closed', note: 'Finalist teams chosen (news of 2026-05-10); Phase II Wild Card registration opened 2026-01-14 and closed 2026-03-04; winners announced in the spring of 2027: no entry is open', requires: [
    { rule: 'registration within the window', needs: 'Phase II Wild Card registration 2026-01-14 to 2026-03-04', act: 'closed: the next XPRIZE quantum competition is a lead to watch' },
    { rule: 'a quantum algorithm with a plausible pathway to quantum advantage, technical novelty and algorithmic rigor', needs: 'a submission judged by XPRIZE\'s panel', act: 'the author submits when a window opens' },
  ] },
  { id: 'github-maintainer-programs', name: 'GitHub maintainer programs (Accelerator, Fund, Sponsors)', prize: 'funding, security tools, mentorship (page: "Get funding, security tools, mentorship, and community")', rules: 'https://github.com/accelerator', read: '2026-10-26', kind: 'funding', entry: 'unknown', note: 'the page names the programs; a cohort\'s application window is announced by GitHub', requires: [
    { rule: 'an open source project on GitHub maintained in public', needs: 'the repository public with a licence', act: 'the push and the release are the author\'s acts; the tree\'s licence is CC-BY-NC-ND-4.0, the fork\'s MIT' },
    { rule: 'an application in a cohort window', needs: 'GitHub\'s announcement', act: 'the author applies' },
  ] },
  { id: 'cloudflare-workers-launchpad', name: 'Cloudflare Workers Launchpad (funding program for startups on Workers)', prize: 'funding from the Launchpad\'s VC partners', rules: 'https://www.cloudflare.com/lp/workers-launchpad/', read: '2026-10-26 (the gateway answered 403 to the verifier: a lead)', kind: 'funding', entry: 'unknown', note: 'the Worker qpu runs on three hosts at the edge; the page refused an automated read', requires: [
    { rule: 'a startup building on Cloudflare Workers', needs: 'the deployed Worker and a company', act: 'the author applies with the company' },
  ] },
  { id: 'vercel-oss-program', name: 'Vercel Open Source Program (credits for open source projects)', prize: 'platform credits', rules: 'https://vercel.com/oss', read: '2026-10-26 (a client-rendered page: the rules are not in its HTML; a lead)', kind: 'funding', entry: 'unknown', note: 'the Payload fork deploys on Vercel; the program\'s criteria are read in the browser only', requires: [
    { rule: 'an open source project deployed on Vercel', needs: 'the fork deployed by the tenant', act: 'the tenant deploys the app; the author applies' },
  ] },
]
/** The registry's MCPs for grants and funding (2026-10-26: grant 20, funding 20, competition 2, prize 0, hackathon 0): proposed, extended by the discover step through the lead, never called here. */
export const FUNDING_MCPS = ['ca.netgrant/canadian-grants', 'com.cedargrant/federal-grants', 'com.dropwatchhq/grant-finder', 'io.github.Ansvar-Systems/uk-farm-grants', 'io.github.Froydinger/grantsignal-us', 'ai.rallyprop/gov-funding', 'com.funding-radar/radar', 'com.modernmustardseed/funding-finder', 'eu.tech.funding/fundi', 'com.meridianlabssoftware/sec-form-d-funding-rounds'] as const
/** Every competition judged: each rule's status from the tree's evidence (theorems kernel-accepted, hosts deployed, licence, no publication), nothing claimed. */
export const competeOf = (evidence: { theorems: number; kernel: number; hosts: number; licence: string; published: boolean; pushed: boolean }) => {
  const judged = COMPETITIONS.map((c) => {
    const rules: Rule[] = c.requires.map((r) => {
      if (c.entry === 'closed' && /registration/.test(r.rule)) return { ...r, status: 'closed' as const, evidence: c.note }
      if (/deployed on Vercel/.test(r.rule)) return { ...r, status: 'pending' as const, evidence: 'the fork builds; its deploy is the tenant\'s act' }
      if (/open source project/.test(r.rule)) return { ...r, status: evidence.pushed ? 'satisfied' as const : 'pending' as const, evidence: `${evidence.licence}; the repository is ${evidence.pushed ? 'public' : 'local until the author pushes'}` }
      if (/solution of one of the seven/.test(r.rule)) return { ...r, status: 'open' as const, evidence: `${evidence.theorems} theorems kernel-accepted (${evidence.kernel} in the kernel), identities and bridge theorems; no Millennium problem solved` }
      if (/published/.test(r.rule)) return { ...r, status: evidence.published ? 'satisfied' as const : 'pending' as const, evidence: evidence.published ? 'published' : 'no publication in a qualifying outlet' }
      if (/startup building on Cloudflare Workers/.test(r.rule)) return { ...r, status: 'pending' as const, evidence: `the Worker qpu on ${evidence.hosts} hosts; the company is the author\'s` }
      return { ...r, status: 'pending' as const, evidence: 'the author\'s act' }
    })
    const counts = rules.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {})
    return { ...c, rules, counts, satisfied: `${counts.satisfied ?? 0}/${rules.length}`, enterable: c.entry !== 'closed' && rules.every((r) => r.status !== 'open' && r.status !== 'closed'), ready: rules.every((r) => r.status === 'satisfied') }
  })
  return { competitions: judged, prizes: judged.filter((c) => c.kind === 'prize').length, funding: judged.filter((c) => c.kind === 'funding').length, enterable: judged.filter((c) => c.enterable).map((c) => c.id), ready: judged.filter((c) => c.ready).map((c) => c.id), says: 'enterable: every rule is satisfied or the author\'s act; ready: every rule satisfied', closed: judged.filter((c) => c.entry === 'closed').map((c) => c.id), relatedMcps: FUNDING_MCPS, honest: 'nothing here is a prize won or a problem solved: every rule is judged against evidence, and what remains is the author\'s act (publish, push, apply) or a lead; the tree competes by following the rules, measured on every run', internalCompetition: 'the gate\'s competition of codes (five codes a combination, the fastest correct wins) is judged against its five written rules on every run: see the e2e tool' }
}

const compete = toolOf('legal', {
  name: 'compete',
  description: 'The competitions with prizes and funding, their rules read at the source and judged against this tree\'s own evidence on every run: the Clay Millennium Prize rules (three conditions), XPRIZE Quantum Applications (closed: finalists chosen, winners spring 2027), GitHub\'s maintainer programs, Cloudflare\'s Workers Launchpad, Vercel\'s open source program; the registry\'s grant and funding MCPs proposed. Each rule is satisfied, pending (the author\'s act), closed or open (a lead). Nothing is claimed won; the tree competes by following every rule. Pure.',
  inputSchema: { type: 'object', properties: { published: { type: 'boolean', description: 'a publication in a qualifying outlet exists (the author says so)' }, pushed: { type: 'boolean', description: 'the repository is public (the author pushed)' }, hosts: { type: 'integer' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...LEGAL.skill.selftest(ctx) }
    return competeOf({ theorems: THEOREMS.length, kernel: KERNEL_THEOREMS, hosts: typeof args.hosts === 'number' ? args.hosts : 3, licence: LICENSE.spdx, published: args.published === true, pushed: args.pushed === true })
  },
  widget: flowWidget,
})

export const LEGAL: Toolbox = {
  name: 'legal',
  idea: 'the legal and security audit of this MCP through MCP: the author\'s claims judged by the unit\'s forensic, legal and security doors, free agents by default, the operator alone overriding, beside the tree\'s own checks of its sources',
  tools: [legal, compete],
  examples: [
    { id: 'compete-rules', tool: 'compete', theorem: 'textbook_clay_conditions', arguments: {}, shows: 'Every competition with a prize or funding judged by its own rules: the Clay conditions (three, all required), XPRIZE Quantum Applications closed until spring 2027, the funding programs pending the author\'s acts; nothing claimed, the gaps named.', expect: (s) => (s.competitions.length === 5 && s.closed.includes('xprize-quantum-applications') && s.competitions[0].rules.length === 4 && s.competitions[0].rules[0].status === 'open' && s.enterable.length === 3 && s.ready.length === 0 ? null : JSON.stringify(s.competitions.map((c: { id: string; satisfied: string; enterable: boolean }) => [c.id, c.satisfied, c.enterable]))) },
    { id: 'legal-audit-offline', tool: 'legal', theorem: 'textbook_uuid_is_36', arguments: { texts: FIXTURE_TEXTS, answers: [] }, shows: 'Phase two with no answers (offline): the claims, the tree\'s security checks, and the audit\'s own content address over the SHA-256 of every input — change a source and the address changes.', expect: (s) => (s.phase === 'audit' && typeof s.id === 'string' && s.id.length === 36 && s.sha256.length === 64 && s.inputs.texts.worker?.length === 64 && s.securityPassed === s.securityTotal ? null : `${s.phase} ${s.id} ${s.securityPassed}/${s.securityTotal}`) },
    { id: 'legal-plan', tool: 'legal', arguments: { texts: FIXTURE_TEXTS, discovery: { doors: [{ host: 'uuidna.com', url: 'https://uuidna.com/mcp', name: 'compute_forensics', description: '', takes: ['statement'], required: ['statement'], answers: ['verdict', 'receipt'], readOnly: true, contract: 'catalogue' }, { host: 'uuidna.com', url: 'https://uuidna.com/mcp', name: 'get_rights', description: '', takes: [], required: [], answers: ['receipt'], readOnly: true, contract: 'tools/list' }, { host: 'uuidna.com', url: 'https://uuidna.com/mcp', name: 'audit_security', description: '', takes: [], required: [], answers: ['receipt'], readOnly: true, contract: 'catalogue' }] } }, shows: 'Phase one on fixture texts and a three-door discovery: the claims gathered (licence, author, metadata, measured table, perspectives), the tree\'s security checks, and the plan — one forensics call per claim, the rights and security doors once, free by default.', expect: (s) => (s.phase === 'plan' && s.claims >= 10 && s.by === 'free-by-default' && s.agents === 3 && s.calls === s.claims + 2 && s.securityPassed === s.securityTotal ? null : `${s.phase} ${s.claims} claims ${s.calls} calls ${s.agents} agents ${s.by} security ${s.securityPassed}/${s.securityTotal}`) },
  ],
  skill: {
    instructions: 'The client reads the tree\'s texts (README, CITATION.cff, .zenodo.json, package.json, src/worker.ts, the billing and hmac modules, mcp.ts), the discovery and the theorem ledger, calls legal for the plan, makes every call against its host, and calls legal again with the answers; it writes legal.json and the page. Agents are the free doors discovery found; the operator overrides with agents: [...] and nothing else does. A refusal is recorded, never retried blindly.',
    directions: ['server only: claims from fixture metadata, security checks on fixture sources, the plan, the audit of fixture answers', 'client → server: the texts come from the tree, the answers from the doors', 'toolbox → toolbox: the doors come from discovery; the claims include every perspective lead; the licence module is the measure of drift'],
    selftest: (ctx) => {
      const checks: { id: string; passed: boolean; evidence: string }[] = []
      const check = (id: string, passed: boolean, evidence: string) => checks.push({ id, passed, evidence })
      const claims = claimsOf(FIXTURE_TEXTS, ctx.leads)
      check('legal:claims', claims.some((c) => c.id === 'citation-cff' && c.text.includes('Tsvetan Rouschev')) && claims.some((c) => c.id === 'zenodo-json') && claims.some((c) => c.id === 'package-json') && claims.some((c) => c.id.startsWith('readme-tests')) && claims.filter((c) => c.id.startsWith('perspective-')).length >= 10, `${claims.length} claims: ${claims.slice(0, 8).map((c) => c.id).join(', ')}…`)
      const sec = securityOf(FIXTURE_TEXTS)
      check('legal:security-checks', sec.length === 10 && sec.every((c) => c.passed), sec.filter((c) => !c.passed).map((c) => c.id).join(', ') || 'all pass on the fixture sources')
      check('legal:security-catches', !securityOf({ ...FIXTURE_TEXTS, worker: FIXTURE_TEXTS.worker + " const leaked = 'sk_live_" + 'abcdefghijklmnop' + "'" }).find((c) => c.id === 'security:no-live-secret-literal')!.passed && !securityOf({ ...FIXTURE_TEXTS, mcp: 'env.QPU_DATA_KEY' }).find((c) => c.id === 'security:keys-stay-in-the-worker')!.passed, 'a live key literal and a secret in the handler are caught')
      const doors = ['compute_forensics', 'verify_claim', 'get_rights', 'get_legal_facts', 'compute_license', 'compute_prior_art', 'get_due_process', 'audit_security'].map((name) => ({ host: 'uuidna.com', url: 'https://uuidna.com/mcp', name, description: '', takes: [] as string[], required: [] as string[], answers: ['verdict'], readOnly: true as boolean | null, contract: 'catalogue' as const }))
      const plan = planOf(claims, { doors }, null, ['clay_sigma'])
      check('legal:plan-free-by-default', plan.by === 'free-by-default' && plan.calls.length === claims.length * 2 + 6 && plan.calls.some((c) => c.door === 'get_due_process' && (c.arguments.claims as string[]).length === claims.length), `${plan.calls.length} calls for ${claims.length} claims through ${plan.agents.length} doors`)
      const override = planOf(claims, { doors }, ['audit_security', 'get_rights', 'not_a_door'], ['clay_sigma'])
      check('legal:plan-operator-override', override.by === 'operator' && override.calls.length === 2 && override.absent.join() === 'not_a_door', 'the operator\'s list is used as given; an absent door is named, not guessed')
      const answers: Answer[] = [...plan.calls.map((c): Answer => c.purpose === 'forensics' ? { ...c, answer: { verdict: 'UNVERIFIED', clean: true, violations: [], receipt: 'r', note: 'no decidable test' } } : c.purpose === 'verify' ? { ...c, answer: { verdict: 'UNVERIFIED', receipt: 'r2' } } : c.door === 'get_rights' ? { ...c, answer: { holder: `${LICENSE.author} (ceccec@psg.bg)`, license: LICENSE.spdx, licenseAddress: LICENSE.address, imprint: 'other-imprint', receipt: 'r3' } } : c.door === 'audit_security' ? { ...c, answer: { checks: 7, passed: 7, failed: 0, receipt: 'r4' } } : c.door === 'compute_prior_art' ? { ...c, refusal: 'the edge does not hold the whole ledger' } : { ...c, answer: { receipt: 'r5' } })]
      const audit = auditOf(claims, answers, sec)
      check('legal:audit-read', audit.findings.length === claims.length * 2 && audit.verdicts.UNVERIFIED === claims.length * 2 && audit.violations === 0 && audit.drift.length === 1 && audit.drift[0]!.startsWith('imprint') && audit.refusals === 1 && audit.securityDoors.find((d) => d.door === 'audit_security')?.failed === 0, `${audit.findings.length} findings, drift ${audit.drift.join('; ')}, refusals ${audit.refusals}`)
      check('legal:page', legalPageOf(audit, plan, '2026-01-01').includes('Drift against this tree: imprint'), 'the page renders the drift')
      const run = (t: Texts) => ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'legal', arguments: { texts: t, answers: [] } } }).result.structuredContent as { id: string; sha256: string }
      const a1 = run(FIXTURE_TEXTS); const a2 = run(FIXTURE_TEXTS); const a3 = run({ ...FIXTURE_TEXTS, readme: FIXTURE_TEXTS.readme + '| Tampered | yes |\n' })
      check('legal:tamper-evident', a1.id === a2.id && a1.sha256 === a2.sha256 && a1.id !== a3.id && a1.sha256 !== a3.sha256, 'the same inputs give the same address; one changed line changes it')
      const comp = competeOf({ theorems: 12, kernel: 1000, hosts: 3, licence: 'CC-BY-NC-ND-4.0', published: false, pushed: false })
      const pub = competeOf({ theorems: 12, kernel: 1000, hosts: 3, licence: 'CC-BY-NC-ND-4.0', published: true, pushed: true })
      check('legal:compete-judges-never-claims', comp.ready.length === 0 && comp.enterable.length === 3 && comp.competitions.every((c) => c.rules.every((r) => r.status !== 'satisfied')) && pub.competitions.find((c) => c.id === 'github-maintainer-programs')!.rules[0]!.status === 'satisfied' && pub.ready.length === 0 && pub.competitions.find((c) => c.id === 'clay-millennium')!.rules[0]!.status === 'open' && /nothing here is a prize won/.test(comp.honest), 'unpushed and unpublished, nothing is ready and three funding programs are enterable by the author\'s acts; pushed, the public-repository rule is satisfied and the application stays the author\'s; a Millennium problem stays open whatever the author does here')
      return { passed: checks.every((c) => c.passed), checks }
    },
  },
}
