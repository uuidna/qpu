// The flow toolbox tests itself in every direction, with no test file: server only (each tool on fixtures), server → client
// (every request a tool emits is one the client can answer), client → server (answers read back into data), and toolbox →
// toolbox (discovery feeds wave and readiness, wave feeds readiness, match feeds imagine and the judge). Any flow tool called
// with selftest runs the whole suite; the audit replays it; a client runs it before a live run. Pure.
import type { Example } from './examples.js'
import type { Lead } from './leads.js'
import type { Rpc, Check } from './audit.js'
import { VERIFIERS } from './verifiers.js'
import { discoveryRequestsOf, followUpsOf, discoveryOf, discoveryPageOf, type Answer, type Request } from './discovery.js'
import { waveRequestsOf, waveOf, wavePageOf, type WaveResult } from './wave.js'
import { pagesOf, judgeOf, sourcesOf, borderPlanOf, borderOf, readinessPageOf } from './readiness.js'
import { imagineOf, imaginePageOf } from './imagine.js'
import { matcherOf } from './match.js'

const UNIT = 'https://unit.test/mcp'
const rpcOk = (result: unknown) => JSON.stringify({ jsonrpc: '2.0', id: 1, result })
const call = (structured: unknown) => rpcOk({ content: [{ type: 'text', text: JSON.stringify(structured) }], structuredContent: structured })

/** The client of the fixture: answers every request the discover tool emits, as the hosts would. */
const answerOf = (r: Request): Answer => {
  const text = (status: number, type: string, body: string): Answer => ({ ...r, status, type, text: body })
  if (r.purpose === 'mcp-list') return text(200, 'application/json', rpcOk({ tools: [{ name: 'list_tools', description: 'Every tool: {} lists; {name} gives one contract.', inputSchema: { type: 'object', properties: { name: { type: 'string' } } } }, { name: 'get_rights', description: 'Get rights. Returns {license,receipt}.', inputSchema: { type: 'object', properties: {} } }] }))
  if (r.purpose === 'catalogue') return text(200, 'application/json', call({ tools: [{ name: 'list_tools', description: 'the catalogue' }, { name: 'get_rights', description: 'Get rights. Returns {license,receipt}.' }, { name: 'verify_claim', description: 'Verify claim. Returns {statement,verdict,receipt,note}.' }, { name: 'get_css', description: 'Get css. Returns {css}.' }, { name: 'sign_commit', description: 'Sign commit. Returns {signed,verdict,address}.' }] }))
  if (r.purpose === 'contract' && r.name === 'verify_claim') return text(200, 'application/json', call({ name: 'verify_claim', inputSchema: { type: 'object', properties: { statement: { type: 'string' } }, required: ['statement'] }, outputSchema: { type: 'object', properties: { statement: {}, verdict: {}, receipt: {}, note: {} } }, annotations: { readOnlyHint: true } }))
  if (r.purpose === 'contract' && r.name === 'sign_commit') return text(200, 'application/json', call({ name: 'sign_commit', inputSchema: { type: 'object', properties: { message: { type: 'string' }, theorems: { type: 'array' } }, required: ['message', 'theorems'] }, outputSchema: { type: 'object', properties: { signed: {}, verdict: {}, address: {} } }, annotations: { readOnlyHint: true } }))
  if (r.purpose === 'well-known') return text(404, 'text/html', '<html><title>404</title></html>')
  if (r.purpose === 'api-contract') {
    if (r.host === 'raw.githubusercontent.com') return text(200, 'application/json', JSON.stringify({ openapi: '3.1.0', paths: { '/repos/{owner}/{repo}': {}, '/orgs/{org}/repos': {} } }))
    if (r.host === 'en.wikipedia.org') return text(200, 'application/yaml', 'openapi: 3.0.1\npaths:\n  /page/summary/{title}:\n    get: {}\n')
    if (r.host === 'export.arxiv.org') return text(200, 'text/xml', '<OAI-PMH><Identify><repositoryName>arXiv</repositoryName></Identify></OAI-PMH>')
    if (r.host === 'api.crossref.org') return text(200, 'text/html', '<html><title>Crossref Swagger UI</title></html>')
    return text(404, 'text/html', '<html><title>not found</title></html>')
  }
  return text(0, '', 'fetch failed: no fixture')
}

/** The whole suite: every direction, every toolbox feeding the next. */
export const flowSelftestOf = (handle: (m: Rpc) => any, examples: readonly Example[], leads: readonly Lead[]): { passed: boolean; checks: Check[] } => {
  const checks: Check[] = []
  let clock = Date.now()
  const check = (id: string, passed: boolean, evidence: string) => { const now = Date.now(); checks.push({ id, passed, evidence, ms: now - clock }); clock = now }
  const safe = (id: string, f: () => void) => { try { f() } catch (e) { check(id, false, `threw: ${(e as Error).message.slice(0, 160)}`) } }

  // discover: server → client → server
  const requests = discoveryRequestsOf([UNIT], VERIFIERS)
  const answers = requests.map(answerOf)
  check('discover:requests-answerable', answers.every((a) => a.status !== 0), `${requests.length} requests, every one answered by the client fixture`)
  const followUps = followUpsOf(answers)
  check('discover:follow-ups', followUps.map((f) => f.name).sort().join(',') === 'sign_commit,verify_claim', `follow-ups for ${followUps.map((f) => f.name).join(', ') || 'none'}: the catalogue doors that answer a verdict and are not in tools/list`)
  const all = [...answers, ...followUps.map(answerOf)]
  check('discover:no-third-wave', followUpsOf(all).length === 0, 'every follow-up answered, nothing left to ask')
  const discovery = discoveryOf(all, VERIFIERS)
  const unit = discovery.hosts.find((h) => h.host === 'unit.test' && h.kind === 'mcp')
  const unitDoors = unit?.doors ?? []
  check('discover:doors-read', unitDoors.length === 5 && unitDoors.some((d) => d.name === 'verify_claim' && d.contract === 'catalogue' && d.required.join() === 'statement'), `${unitDoors.length} doors: ${unitDoors.map((d) => d.name).join(', ')}`)
  check('discover:capabilities', discovery.capabilities.statementVerdict.join() === 'verify_claim' && discovery.capabilities.signing.join() === 'sign_commit' && discovery.capabilities.rbac.length === 0, JSON.stringify(discovery.capabilities))
  const gh = discovery.hosts.find((h) => h.host === 'raw.githubusercontent.com')
  check('discover:openapi-paths', gh?.detected === 'openapi 3.1.0' && gh.paths?.length === 2, `${gh?.detected}: ${gh?.paths?.join(', ')}`)
  check('discover:openapi-yaml', discovery.hosts.find((h) => h.host === 'en.wikipedia.org')?.paths?.join() === '/page/summary/{title}', 'yaml paths read')
  check('discover:oai-and-html', discovery.hosts.find((h) => h.host === 'export.arxiv.org')?.detected === 'oai-pmh identify' && discovery.hosts.find((h) => h.host === 'api.crossref.org')?.detected === 'html page', 'identify and html page detected')
  check('discover:leads', discovery.leads.some((l) => l.id === 'contract-api.crossref.org') && discovery.leads.some((l) => l.id === 'contract-oeis.org'), `${discovery.leads.length} contract leads: the html page and the hosts with no machine contract named`)
  safe('discover:page', () => check('discover:page', discoveryPageOf(discovery, '2026-01-01').includes('| unit.test | mcp |'), 'the page renders the hosts table'))

  // wave: server → client → server, with discovery's contracts (toolbox → toolbox)
  const two = leads.filter((l) => l.id === 'willow-spec' || l.id === 'repo-cirq').concat(leads.filter((l) => l.status === 'open' && l.source.startsWith('quantumai.google/')).slice(0, 1))
  const wreq = waveRequestsOf(two, [])
  check('wave:requests', wreq.length > 0 && wreq.every((r) => r.verifier && r.url.startsWith('http') && r.check && r.leads.length > 0), `${wreq.length} requests from ${two.length} leads, each with verifier, url, check and leads`)
  const contracts = Object.fromEntries(discovery.hosts.filter((h) => h.paths?.length).map((h) => [h.host, h.paths!]))
  const results: WaveResult[] = [
    { verifier: 'source-page', url: 'https://quantumai.google/cirq/build', check: 'the page states: the page cirq/build', leads: ['page:cirq/build'], status: 200, ok: true, ms: 1, text: '<html><title>Research libraries and tools &nbsp;|&nbsp; Cirq</title></html>' },
    { verifier: 'source-page', url: 'https://quantumai.google/learn', check: 'the page states: Learn overview', leads: ['learn'], status: 404, ok: false, ms: 1, text: '<html><title>404</title></html>' },
    { verifier: 'source-page', url: 'https://quantumai.google/hardware', check: 'the page states: Willow', leads: ['willow-title'], status: 200, ok: true, ms: 1, text: '<html><title>How many qubits does Willow have?</title></html>' },
    { verifier: 'github', url: 'https://raw.githubusercontent.com/repos/quantumlib/Cirq', check: 'the repository exists', leads: ['repo-cirq'], status: 200, ok: true, ms: 1, text: '{"description":"A Python framework","language":"Python"}' },
    { verifier: 'github', url: 'https://raw.githubusercontent.com/nowhere', check: 'a path outside the contract', leads: ['repo-x'], status: 200, ok: true, ms: 1, text: '{}' },
  ]
  const wave = waveOf(results, contracts)
  check('wave:notes', wave.results.find((r) => r.url.endsWith('/cirq/build'))?.note === 'title="Research libraries and tools &nbsp;|&nbsp; Cirq"' && wave.results.find((r) => r.leads.includes('repo-cirq'))?.note === 'description="A Python framework" language=Python', 'titles and GitHub descriptions read from the bodies')
  check('wave:contracted', wave.results.find((r) => r.leads.includes('repo-cirq'))?.contracted === 'yes' && wave.results.find((r) => r.leads.includes('repo-x'))?.contracted === 'no' && wave.results.find((r) => r.verifier === 'source-page')?.contracted === 'unknown', "yes inside the discovered contract, no outside it, unknown where no contract was discovered")
  check('wave:summary', wave.summary['source-page']?.requests === 3 && wave.summary['source-page']?.ok === 2 && wave.summary.github?.contracted === 1 && wave.summary.github?.uncontracted === 1, JSON.stringify(wave.summary))
  safe('wave:page', () => check('wave:page', wavePageOf(wave, two.length, '2026-01-01', true).includes('| github | 2 | 2 | 1 | 1 |'), 'the page renders the summary row'))

  // readiness: wave's pages and discovery's doors read into a judgement and a border (toolbox → toolbox → toolbox)
  const match = matcherOf(handle, examples, leads)
  const pages = pagesOf(wave.results)
  const fixture: Lead[] = [
    { id: 'served-one', source: 'quantumai.google/x', statement: 'served', status: 'served', tool: 'processor' },
    { id: 'cleanup-gone', source: 'scripts/gone.ts', statement: 'removed', status: 'out_of_scope', reason: 'removed' },
    { id: 'cleanup-back', source: 'scripts/back.ts', statement: 'removed', status: 'out_of_scope', reason: 'removed' },
    { id: 'learn', source: 'quantumai.google/learn', statement: 'Learn overview', status: 'blocked', reason: '404' },
    { id: 'partial-one', source: 'quantumai.google/y', statement: 'part', status: 'partial', tool: 'statements', reason: 'owes the rest' },
    { id: 'willow-title', source: 'quantumai.google/hardware', statement: 'the page hardware', status: 'open', reason: 'no tool follows' },
    { id: 'page:cirq/build', source: 'quantumai.google/cirq/build', statement: 'the page cirq/build', status: 'open', reason: 'no tool follows' },
    { id: 'declared', source: 'quantumai.google/z', statement: 'other vendor', status: 'out_of_scope', reason: 'not this layer' },
    { id: 'owed', source: 'uuidna.com/mcp', statement: 'the deploy', status: 'open', reason: "the author's act" },
  ]
  const judged = fixture.map((l) => judgeOf(l, pages, new Set(['scripts/back.ts']), match, '2026-01-01T00:00:00Z'))
  const cls = Object.fromEntries(judged.map((j) => [j.lead, j.class]))
  check('readiness:judge', cls['served-one'] === 'served' && cls['cleanup-gone'] === 'refuted' && cls['cleanup-back'] === 'trial' && cls.learn === 'refuted' && cls['partial-one'] === 'trial' && cls['willow-title'] === 'served' && cls['page:cirq/build'] === 'refuted' && cls.declared === 'refuted' && cls.owed === 'trial', JSON.stringify(cls))
  check('readiness:judge-evidence', judged.find((j) => j.lead === 'page:cirq/build')!.by.includes('covers') && judged.find((j) => j.lead === 'willow-title')!.by.includes('by processor') && judged.find((j) => j.lead === 'learn')!.by.startsWith('HTTP 404'), judged.filter((j) => ['page:cirq/build', 'willow-title', 'learn'].includes(j.lead)).map((j) => j.by.slice(0, 60)).join(' | '))
  const sources = sourcesOf(judged, fixture)
  const q = sources.find((s) => s.source === 'quantumai.google')
  check('readiness:sources', q?.settled === 5 && q.open.length === 1 && sources.find((s) => s.source === 'scripts')?.open[0]?.owes === 'scripts/back.ts is present again' && sources.find((s) => s.source === 'uuidna.com')?.why === '1 open of 1', sources.map((s) => `${s.source} ${s.why}`).join('; '))
  const plan = borderPlanOf(discovery, { key: 'clay_sigma', statement: '1 + 1 = 2' })
  check('readiness:border-plan', plan.calls.length === 1 && plan.calls[0]!.door === 'verify_claim' && plan.calls[0]!.arguments.statement === 'clay_sigma: 1 + 1 = 2' && plan.unfillable.length === 0, JSON.stringify(plan.calls))
  const border = borderOf([{ door: 'verify_claim', host: 'unit.test', arguments: plan.calls[0]!.arguments, answer: { verdict: 'VERIFIED', receipt: 'r-1', note: 'decided' } }, { door: 'deposit_trial', host: 'unit.test', arguments: {}, refusal: 'the edge does not hold the whole ledger' }, { door: 'prove_verdict', host: 'unit.test', arguments: {}, answer: { verdict: 'UNVERIFIED', receipt: 'r-2' } }])
  check('readiness:border-read', border[0]!.sealed && border[0]!.receipt === 'r-1' && !border[1]!.sealed && (border[1]!.refusal ?? '').startsWith('the edge') && !border[2]!.sealed && border[2]!.verdict === 'UNVERIFIED', border.map((b) => `${b.door}:${b.verdict ?? b.refusal?.slice(0, 20)}:${b.sealed}`).join(' '))
  safe('readiness:page', () => check('readiness:page', readinessPageOf({ unit: UNIT, date: '2026-01-01', measured: '2026-01-01', discovered: '2026-01-01', probe: { key: 'clay_sigma', statement: '1 + 1 = 2' }, judged, classes: { served: judged.filter((j) => j.class === 'served').length, refuted: judged.filter((j) => j.class === 'refuted').length, trial: judged.filter((j) => j.class === 'trial').length }, sources, border, sealedBy: ['verify_claim'], answers: { readiness: { ready: false, why: 'fixture', settled: 7, asked: 3, answered: 3, receipt: 'fixture' }, auras: {}, rights: { drift: [] }, address: { probe: 'qpu', here: 'a', unit: 'a', agree: true, note: 'fixture' } } }).includes('Sealed or verified by: verify_claim.'), 'the page renders the border verdict'))

  // imagine: the matcher feeds the imagination (toolbox → toolbox), on a subset
  safe('imagine:subset', () => { const im = imagineOf(handle, examples, leads, ['willow-spec', 'learn']); check('imagine:subset', im.leads === 2 && im.rows.length === 2 && Object.values(im.verdicts).reduce((a, b) => a + b, 0) === 2 && im.imagined.some((l) => l.id.startsWith('application-')) && imaginePageOf(im, '2026-01-01', 10).includes('| willow-spec |'), `${im.rows.map((r) => `${r.lead}:${r.verdict}`).join(' ')}; ${im.imaginedLeads} imagined`) })

  return { passed: checks.every((c) => c.passed), checks }
}
