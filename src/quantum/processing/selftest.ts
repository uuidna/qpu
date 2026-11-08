// The flow toolbox tests itself in every direction, with no test file: server only (each tool on fixtures), server → client
// (every request a tool emits is one the client can answer), client → server (answers read back into data), and toolbox →
// toolbox (discovery feeds wave and readiness, wave feeds readiness, match feeds imagine and the judge). Any flow tool called
// with selftest runs the whole suite; the audit replays it; a client runs it before a live run. Pure.
import type { Example } from './examples.ts'
import type { Lead } from './leads.ts'
import type { Rpc, Check } from './audit.ts'
import { VERIFIERS } from './verifiers.ts'
import { createDiscoveryRequests, listFollowUps, getDiscovery, getDiscoveryPage, type Answer, type Request } from './discovery.ts'
import { createWaveRequests, getWave, getWavePage, type WaveResult } from './wave.ts'
import { indexPages, judgeLead, listSources, planBorder, getBorder, getReadinessPage } from './readiness.ts'
import { imagineLeads, getImaginePage } from './imagine.ts'
import { createMatcher } from './match.ts'
import { decodeE2e, judgeRules, decodeValue, type E2eAnswer } from './e2e.ts'
import { createRegistryRequests, listRelatedServers, rankBestDoors } from './discovery.ts'
import { clock } from './unit/clock.ts'

const UNIT = 'https://unit.test/mcp'
const rpcOk = (result: unknown) => JSON.stringify({ jsonrpc: '2.0', id: 1, result })
const call = (structured: unknown) => rpcOk({ content: [{ type: 'text', text: JSON.stringify(structured) }], structuredContent: structured })

/** The client of the fixture: answers every request the discover tool emits, as the hosts would. */
const answerRequest = (r: Request): Answer => {
  const text = (status: number, type: string, body: string): Answer => ({ ...r, status, type, text: body })
  if (r.purpose === 'mcp-list') return text(200, 'application/json', rpcOk({ tools: [{ name: 'list_tools', description: 'Every tool: {} lists; {name} gives one contract.', inputSchema: { type: 'object', properties: { name: { type: 'string' } } } }, { name: 'get_rights', description: 'Get rights. Returns {license,receipt}.', inputSchema: { type: 'object', properties: {} } }] }))
  if (r.purpose === 'catalogue') return text(200, 'application/json', call({ tools: [{ name: 'list_tools', description: 'the catalogue' }, { name: 'get_rights', description: 'Get rights. Returns {license,receipt}.' }, { name: 'verify_claim', description: 'Verify claim. Returns {statement,verdict,receipt,note}.' }, { name: 'get_css', description: 'Get css. Returns {css}.' }, { name: 'sign_commit', description: 'Sign commit. Returns {signed,verdict,address}.' }] }))
  if (r.purpose === 'contract' && r.name === 'verify_claim') return text(200, 'application/json', call({ name: 'verify_claim', inputSchema: { type: 'object', properties: { statement: { type: 'string' } }, required: ['statement'] }, outputSchema: { type: 'object', properties: { statement: {}, verdict: {}, receipt: {}, note: {} } }, annotations: { readOnlyHint: true } }))
  if (r.purpose === 'contract' && r.name === 'sign_commit') return text(200, 'application/json', call({ name: 'sign_commit', inputSchema: { type: 'object', properties: { message: { type: 'string' }, theorems: { type: 'array' } }, required: ['message', 'theorems'] }, outputSchema: { type: 'object', properties: { signed: {}, verdict: {}, address: {} } }, annotations: { readOnlyHint: true } }))
  if (r.purpose === 'sitemap') return text(200, 'application/xml', r.name ? `<urlset><url><loc>${new URL(r.url).origin}/cirq</loc><lastmod>2026-10-20</lastmod></url></urlset>` : `<sitemapindex><sitemap><loc>${r.url}.0</loc><lastmod>2026-10-25</lastmod></sitemap></sitemapindex>`)
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
export const runFlowSelftest = (handle: (m: Rpc) => any, examples: readonly Example[], leads: readonly Lead[]): { passed: boolean; checks: Check[] } => {
  const checks: Check[] = []
  let tick = clock()
  const check = (id: string, passed: boolean, evidence: string) => { const now = clock(); checks.push({ id, passed, evidence, ms: now - tick }); tick = now }
  const safe = (id: string, f: () => void) => { try { f() } catch (e) { check(id, false, `threw: ${(e as Error).message}`) } }

  // discover: server → client → server
  const requests = createDiscoveryRequests([UNIT], VERIFIERS)
  const answers = requests.map(answerRequest)
  check('discover:requests-answerable', answers.every((a) => a.status !== 0), `${requests.length} requests, every one answered by the client fixture`)
  const followUps = listFollowUps(answers)
  check('discover:follow-ups', followUps.filter((f) => f.purpose === 'contract').map((f) => f.name).sort().join(',') === 'sign_commit,verify_claim' && followUps.filter((f) => f.purpose === 'sitemap').length === 1, `follow-ups for ${followUps.map((f) => f.name).join(', ') || 'none'}: the catalogue doors that answer a verdict and are not in tools/list`)
  const all = [...answers, ...followUps.map(answerRequest)]
  check('discover:no-third-wave', listFollowUps(all).length === 0, 'every follow-up answered, nothing left to ask')
  const discovery = getDiscovery(all, VERIFIERS)
  check('discover:sitemap', discovery.sitemap.sitemaps.length === 1 && discovery.sitemap.urls.map((u) => new URL(u.loc).pathname + ' ' + u.lastmod).join() === '/cirq 2026-10-20', `the index named ${discovery.sitemap.sitemaps.length} child, read as ${discovery.sitemap.urls.length} url(s) by sitemaps.org's loc and lastmod`)
  const unit = discovery.hosts.find((h) => h.host === 'unit.test' && h.kind === 'mcp')
  const unitDoors = unit?.doors ?? []
  check('discover:doors-read', unitDoors.length === 5 && unitDoors.some((d) => d.name === 'verify_claim' && d.contract === 'catalogue' && d.required.join() === 'statement'), `${unitDoors.length} doors: ${unitDoors.map((d) => d.name).join(', ')}`)
  check('discover:capabilities', discovery.capabilities.statementVerdict.join() === 'verify_claim' && discovery.capabilities.signing.join() === 'sign_commit' && discovery.capabilities.rbac.length === 0 && discovery.capabilities.metaphysics.length === 0, JSON.stringify(discovery.capabilities))
  const gh = discovery.hosts.find((h) => h.host === 'raw.githubusercontent.com')
  check('discover:openapi-paths', gh?.detected === 'openapi 3.1.0' && gh.paths?.length === 2, `${gh?.detected}: ${gh?.paths?.join(', ')}`)
  check('discover:openapi-yaml', discovery.hosts.find((h) => h.host === 'en.wikipedia.org')?.paths?.join() === '/page/summary/{title}', 'yaml paths read')
  check('discover:oai-and-html', discovery.hosts.find((h) => h.host === 'export.arxiv.org')?.detected === 'oai-pmh identify' && discovery.hosts.find((h) => h.host === 'api.crossref.org')?.detected === 'html page', 'identify and html page detected')
  check('discover:leads', discovery.leads.some((l) => l.id === 'contract-api.crossref.org') && discovery.leads.some((l) => l.id === 'contract-oeis.org'), `${discovery.leads.length} contract leads: the html page and the hosts with no machine contract named`)
  safe('discover:page', () => check('discover:page', getDiscoveryPage(discovery, '2026-01-01').includes('| unit.test | mcp |'), 'the page renders the hosts table'))

  // wave: server → client → server, with discovery's contracts (toolbox → toolbox)
  const two = leads.filter((l) => l.id === 'willow-spec' || l.id === 'repo-cirq').concat(leads.filter((l) => l.status === 'open' && l.source.startsWith('quantumai.google/')).slice(0, 1))
  const wreq = createWaveRequests(two, [])
  check('wave:requests', wreq.length > 0 && wreq.every((r) => r.verifier && r.url.startsWith('http') && r.check && r.leads.length > 0), `${wreq.length} requests from ${two.length} leads, each with verifier, url, check and leads`)
  const contracts = Object.fromEntries(discovery.hosts.filter((h) => h.paths?.length).map((h) => [h.host, h.paths!]))
  const results: WaveResult[] = [
    { verifier: 'source-page', url: 'https://quantumai.google/cirq/build', check: 'the page states: the page cirq/build', leads: ['page:cirq/build'], status: 200, ok: true, ms: 1, text: '<html><title>Research libraries and tools &nbsp;|&nbsp; Cirq</title></html>' },
    { verifier: 'source-page', url: 'https://quantumai.google/learn', check: 'the page states: Learn overview', leads: ['learn'], status: 404, ok: false, ms: 1, text: '<html><title>404</title></html>' },
    { verifier: 'source-page', url: 'https://quantumai.google/hardware', check: 'the page states: Willow', leads: ['willow-title'], status: 200, ok: true, ms: 1, text: '<html><title>How many qubits does Willow have?</title></html>' },
    { verifier: 'github', url: 'https://raw.githubusercontent.com/repos/quantumlib/Cirq', check: 'the repository exists', leads: ['repo-cirq'], status: 200, ok: true, ms: 1, text: '{"description":"A Python framework","language":"Python"}' },
    { verifier: 'github', url: 'https://raw.githubusercontent.com/nowhere', check: 'a path outside the contract', leads: ['repo-x'], status: 200, ok: true, ms: 1, text: '{}' },
  ]
  const wave = getWave(results, contracts)
  check('wave:notes', wave.results.find((r) => r.url.endsWith('/cirq/build'))?.note === 'title="Research libraries and tools &nbsp;|&nbsp; Cirq"' && wave.results.find((r) => r.leads.includes('repo-cirq'))?.note === 'description="A Python framework" language=Python', 'titles and GitHub descriptions read from the bodies')
  check('wave:contracted', wave.results.find((r) => r.leads.includes('repo-cirq'))?.contracted === 'yes' && wave.results.find((r) => r.leads.includes('repo-x'))?.contracted === 'no' && wave.results.find((r) => r.verifier === 'source-page')?.contracted === 'unknown', "yes inside the discovered contract, no outside it, unknown where no contract was discovered")
  check('wave:summary', wave.summary['source-page']?.requests === 3 && wave.summary['source-page']?.ok === 2 && wave.summary.github?.contracted === 1 && wave.summary.github?.uncontracted === 1, JSON.stringify(wave.summary))
  safe('wave:page', () => check('wave:page', getWavePage(wave, two.length, '2026-01-01', true).includes('| github | 2 | 2 | 1 | 1 |'), 'the page renders the summary row'))

  // readiness: wave's pages and discovery's doors read into a judgement and a border (toolbox → toolbox → toolbox)
  const match = createMatcher(handle, examples, leads)
  const pages = indexPages(wave.results)
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
  const judged = fixture.map((l) => judgeLead(l, pages, new Set(['scripts/back.ts']), match, '2026-01-01T00:00:00Z'))
  const cls = Object.fromEntries(judged.map((j) => [j.lead, j.class]))
  check('readiness:judge', cls['served-one'] === 'served' && cls['cleanup-gone'] === 'refuted' && cls['cleanup-back'] === 'trial' && cls.learn === 'refuted' && cls['partial-one'] === 'trial' && cls['willow-title'] === 'served' && cls['page:cirq/build'] === 'refuted' && cls.declared === 'refuted' && cls.owed === 'trial', JSON.stringify(cls))
  check('readiness:judge-evidence', judged.find((j) => j.lead === 'page:cirq/build')!.by.includes('covers') && judged.find((j) => j.lead === 'willow-title')!.by.includes('by processor') && judged.find((j) => j.lead === 'learn')!.by.startsWith('HTTP 404'), judged.filter((j) => ['page:cirq/build', 'willow-title', 'learn'].includes(j.lead)).map((j) => j.by).join(' | '))
  const sources = listSources(judged, fixture)
  const q = sources.find((s) => s.source === 'quantumai.google')
  check('readiness:sources', q?.settled === 5 && q.open.length === 1 && sources.find((s) => s.source === 'scripts')?.open[0]?.owes === 'scripts/back.ts is present again' && sources.find((s) => s.source === 'uuidna.com')?.why === '1 open of 1', sources.map((s) => `${s.source} ${s.why}`).join('; '))
  const plan = planBorder(discovery, { key: 'clay_sigma', statement: '1 + 1 = 2' })
  check('readiness:border-plan', plan.calls.length === 1 && plan.calls[0]!.door === 'verify_claim' && plan.calls[0]!.arguments.statement === 'clay_sigma: 1 + 1 = 2' && plan.unfillable.length === 0, JSON.stringify(plan.calls))
  const border = getBorder([{ door: 'verify_claim', host: 'unit.test', arguments: plan.calls[0]!.arguments, answer: { verdict: 'VERIFIED', receipt: 'r-1', note: 'decided' } }, { door: 'deposit_trial', host: 'unit.test', arguments: {}, refusal: 'the edge does not hold the whole ledger' }, { door: 'prove_verdict', host: 'unit.test', arguments: {}, answer: { verdict: 'UNVERIFIED', receipt: 'r-2' } }])
  check('readiness:border-read', border[0]!.sealed && border[0]!.receipt === 'r-1' && !border[1]!.sealed && (border[1]!.refusal ?? '').startsWith('the edge') && !border[2]!.sealed && border[2]!.verdict === 'UNVERIFIED', border.map((b) => `${b.door}:${b.verdict ?? b.refusal}:${b.sealed}`).join(' '))
  safe('readiness:page', () => check('readiness:page', getReadinessPage({ unit: UNIT, date: '2026-01-01', measured: '2026-01-01', discovered: '2026-01-01', probe: { key: 'clay_sigma', statement: '1 + 1 = 2' }, judged, classes: { served: judged.filter((j) => j.class === 'served').length, refuted: judged.filter((j) => j.class === 'refuted').length, trial: judged.filter((j) => j.class === 'trial').length }, sources, border, sealedBy: ['verify_claim'], answers: { readiness: { ready: false, why: 'fixture', settled: 7, asked: 3, answered: 3, receipt: 'fixture' }, auras: {}, rights: { drift: [] }, address: { probe: 'qpu', here: 'a', unit: 'a', agree: true, note: 'fixture' } } }).includes('Sealed or verified by: verify_claim.'), 'the page renders the border verdict'))

  // imagine: the matcher feeds the imagination (toolbox → toolbox), on a subset
  safe('imagine:subset', () => { const im = imagineLeads(handle, examples, leads, ['willow-spec', 'learn']); check('imagine:subset', im.leads === 2 && im.rows.length === 2 && Object.values(im.verdicts).reduce((a, b) => a + b, 0) === 2 && im.imagined.some((l) => l.id.startsWith('application-')) && getImaginePage(im, '2026-01-01', 10).includes('| willow-spec |'), `${im.rows.map((r) => `${r.lead}:${r.verdict}`).join(' ')}; ${im.imaginedLeads} imagined`) })

    // sharding: the shares of n shards cover the list exactly once
  {
    const list = Array.from({ length: 23 }, (_, i) => i)
    const shares = [0, 1, 2, 3].map((i) => (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'shard', arguments: { list, index: i, count: 4 } } }) as { result: { structuredContent: { shareList: number[] } } }).result.structuredContent.shareList)
    const union = shares.flat().sort((a, b) => a - b)
    check('shard:shares-cover-exactly-once', union.length === 23 && union.every((v, k) => v === k) && shares.every((s, i) => s.every((v) => v % 4 === i)), `four shares of 23 items: ${shares.map((s) => s.length).join('+')} = 23, each item once`)
  }
  // leads first: the registry asked with a lead's words, its answer read into related servers and the requests that extend them
  {
    const lead = { id: 'x', statement: 'Cloudflare MCP servers answer 401 without a token; the documentation server answers in the open' }
    const reqs = createRegistryRequests(lead)
    const answer = JSON.stringify({ servers: [{ server: { name: 'com.cloudflare.mcp/mcp', description: 'Cloudflare MCP servers', remotes: [{ url: 'https://docs.mcp.cloudflare.com/mcp' }, { url: 'https://bindings.mcp.cloudflare.com/mcp' }] } }, { server: { name: 'x/none', description: 'no remote', remotes: [] } }] })
    const rel = listRelatedServers('x', reqs.filter((r) => r.directory === 'official').map((r) => ({ id: r.id, word: r.word, status: 200, text: answer })))
    const best = rankBestDoors(lead, [{ server: 's', url: 'https://x/mcp', tools: [{ name: 'list_tokens', description: 'the tokens of an account' }, { name: 'search_documentation', description: 'search the Cloudflare documentation' }, { name: 'unrelated', description: 'nothing of this' }] }])
    check('discover:best-doors-by-shared-words', best.length === 2 && best[0]!.door === 'search_documentation' && best[0]!.shared.includes('documentation') && best[1]!.door === 'list_tokens' && best[1]!.shared.includes('token'), `${best.map((b) => `${b.door}=${b.score}`).join(', ')}: the doors sharing stems with the lead (tokens meets token), the best first; the unrelated one left out`)
    // the directory's own origin, read from the request it is asked by: a page, its locale copy and an unrelated slug
    const site = new URL(reqs.find((r) => r.directory === 'mcpservers.org')!.url).origin, map = ['/servers/cloudflare-docs-mcp', '/ja/servers/cloudflare-docs-mcp', '/servers/airtable-mcp-server'].map((p) => `<url><loc>${site}${p}</loc></url>`).join(''), smithery = JSON.stringify({ servers: [{ qualifiedName: 'acme/cloudflare-tokens', description: 'tokens', remote: true }] })
    const dirs = listRelatedServers('x', reqs.filter((r) => r.directory !== 'official').map((r) => ({ id: r.id, word: r.word, status: 200, text: r.directory === 'smithery' ? smithery : map })))
    check('discover:directories-beside-the-registry', ['official', 'smithery', 'mcpservers.org'].every((d) => reqs.some((r) => r.directory === d)) && !reqs.some((r) => /glama|pulsemcp|mcp\.so/.test(r.url) || (r.directory === 'mcpservers.org' && /\/api\//.test(r.url))) && dirs.servers.map((s) => s.name).sort().join() === 'acme/cloudflare-tokens,cloudflare-docs-mcp', `${new Set(reqs.map((r) => r.directory)).size} directories asked (open searches and open sitemaps; keyed ones named, a disallowed /api/ never); ${dirs.servers.map((s) => s.name).join(', ')} read, the locale copy and the unrelated slug left out`)
    check('discover:lead-asks-the-registry-first', reqs.length >= 1 && reqs.some((r) => r.url.includes('registry.modelcontextprotocol.io/v0/servers?limit=10&search=')) && rel.servers.length === 2 && rel.extend.length === 2 && rel.extend.every((e) => (e.body as { method: string }).method === 'tools/list'), `${reqs.map((r) => r.word).join(', ')} asked; ${rel.servers.length} related, ${rel.extend.length} remote(s) to extend`)
  }
  // the gate as a repetition code, on fixtures: one host agrees, one flips, one is erased; then no majority
  {
    const base = { combo: 'c1', tool: 'clay', toolbox: 'tree', from: 'example' as const, arguments: {}, url: '', method: 'POST' as const, accept: '', headers: {}, body: null, local: 'L' }
    const ok = JSON.stringify({ jsonrpc: '2.0', id: 1, result: { structuredContent: { v: 1 } } })
    const L = decodeValue({ status: 200, text: ok }).value
    const answers: E2eAnswer[] = [
      { ...base, local: L, id: 'c1@a', host: 'a', status: 200, ms: 10, text: ok },
      { ...base, local: L, id: 'c1@b', host: 'b', status: 200, ms: 20, text: 'event: message\ndata: ' + JSON.stringify({ jsonrpc: '2.0', id: 1, result: { structuredContent: { v: 2 } } }) + '\n\n' },
      { ...base, local: L, id: 'c1@c', host: 'c', status: 0, ms: 5, text: 'fetch failed' },
      { ...base, combo: 'c2', local: 'X', id: 'c2@a', host: 'a', status: 200, ms: 1, text: ok },
      { ...base, combo: 'c2', local: 'X', id: 'c2@b', host: 'b', status: 200, ms: 1, text: JSON.stringify({ jsonrpc: '2.0', id: 1, result: { structuredContent: { v: 3 } } }) },
    ]
    const r = decodeE2e(answers)
    const d1 = r.decoded.find((d) => d.combo === 'c1')!; const d2 = r.decoded.find((d) => d.combo === 'c2')!
    check('e2e:corrected-by-majority', d1.outcome === 'corrected' && d1.logical === L && d1.syndrome.join() === 'b,c' && d1.errors.map((e) => e.kind).join() === 'flip,erasure', `c1: ${d1.outcome}, syndrome ${d1.syndrome.join(' ')}`)
    check('e2e:uncorrectable-without-majority', d2.outcome === 'uncorrectable' && d2.logical === 'none' && r.logicalErrorRate === 0.5, `c2: ${d2.outcome}, logical error rate ${r.logicalErrorRate}`)
    check('e2e:errors-are-uuid-blocks', r.errors.length === 4 && r.errors.every((e) => /^[0-9a-f-]{36}$/.test(e.uuid)) && decodeE2e(answers).errors[0]!.uuid === r.errors[0]!.uuid && !JSON.stringify(r.errors).includes('"v":'), `${r.errors.length} error blocks (the two suspects of an uncorrectable combination count), deterministic uuids, no bodies`)
    check('e2e:competition-fastest-correct-code-wins', d1.winner === 'tree-reference' && d1.codes.find((c) => c.code === 'tree-reference')!.ms === 10 && d1.codes.find((c) => c.code === 'majority')!.ms === 20 && d1.codes.find((c) => c.code === 'any')!.correct === true && d2.winner === null && d2.possibilities.length === 3 && r.competition.saved === 10, `c1 won by ${d1.winner} at ${d1.codes.find((c) => c.code === d1.winner)?.ms} ms against majority at 20; c2 has ${d2.possibilities.length} possibilities and no winner; ${r.competition.saved} ms saved`)
    const inv = decodeE2e([{ ...base, combo: 'c3', local: 'Z', id: 'c3@a', host: 'a', status: 304, ms: 3, text: '', etag: '"Z"', address: 'c3' }, { ...base, combo: 'c3', local: 'Z', id: 'c3@b', host: 'b', status: 304, ms: 9, text: '', etag: '"Z"', address: 'c3' }]).decoded[0]!
    const unv = decodeE2e([{ ...base, combo: 'c4', local: 'Z', id: 'c4@a', host: 'a', status: 304, ms: 3, text: '', etag: '"Q"', address: 'c4' }]).decoded[0]!
    check('e2e:teleport-materialised-or-erased', inv.materialised === 2 && unv.outcome === 'erased' && unv.involutions === 0 && unv.errors[0]!.kind === 'erasure', `two 304s with the held hash materialise; a 304 echoing another hash is an erasure`)
    check('e2e:involution-proves-at-the-edge', inv.outcome === 'agree' && inv.involutions === 2 && inv.winner === 'involution' && inv.codes.find((c) => c.code === 'involution')!.ms === 3 && inv.logical === 'Z', `two 304 copies: ${inv.outcome}, won by ${inv.winner} at 3 ms`)
    const judged = r.competition.rules
    const cheat = judgeRules([{ combo: 'x', logical: 'V', outcome: 'agree', winner: 'majority', copies: [{ ms: 5 }, { ms: 9 }], codes: [{ code: 'any', logical: 'V', ms: 5, correct: true, copiesUsed: 1 }, { code: 'majority', logical: 'V', ms: 9, correct: true, copiesUsed: 3 }, { code: 'tree-reference', logical: 'V', ms: 2, correct: true, copiesUsed: 2 }] }])
    check('e2e:competition-rules-followed', judged.followed && judged.judged === r.decoded.length && judged.rules.length === 5 && !cheat.followed && cheat.violations.some((v) => v.rule === 1 && v.code === 'tree-reference') && cheat.violations.some((v) => v.rule === 2 && v.code === 'majority'), `every decoded combination followed the ${judged.rules.length} rules; a fixture where a slower code is named winner and a code decides before its copies arrived breaks rules 2 and 1`)
    check('e2e:rates-against-textbook', r.physicalErrorRate === 4 / 5 && r.textbookLogical !== null && Math.abs(r.textbookLogical - (3 * 0.64 - 2 * 0.512)) < 1e-12 && r.leads.some((l) => l.id.startsWith('e2e-uncorrectable-')) && r.byHost.c!.erasures === 1, `p=${r.physicalErrorRate}, textbook ${r.textbookLogical}, ${r.leads.length} leads`)
  }
  return { passed: checks.every((c) => c.passed), checks }
}
