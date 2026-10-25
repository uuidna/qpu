// The verification wave as a pure toolbox: the handler emits every request the surface's leads and tree facts need (one per
// URL, with the leads it serves), the client fetches them, and the handler reads what came back into notes, a contract check
// against the host's discovered OpenAPI paths, and a summary. No I/O here.
import { factsOf, verifyRequestsOf, TREE_FACTS, type Fact } from './verifiers.js'
import type { Lead } from './leads.js'
import { dataOf } from './discovery.js'

export type WaveRequest = { verifier: string; url: string; check: string; leads: string[]; method?: 'GET' | 'POST'; body?: unknown; accept?: string }
export type WaveResult = WaveRequest & { status: number; ok: boolean; ms: number; text?: string; note?: string; contracted?: 'yes' | 'no' | 'unknown' }
export type WaveSummary = Record<string, { requests: number; ok: number; contracted: number; uncontracted: number }>

/** Every request, once per URL, with every lead it serves. */
export const waveRequestsOf = (leads: readonly Lead[], treeFacts: readonly Fact[] = TREE_FACTS): WaveRequest[] => {
  const requests = new Map<string, WaveRequest>()
  const add = (id: string, f: Fact) => { for (const r of verifyRequestsOf(f)) { const key = r.method === 'POST' ? `${r.url}#${JSON.stringify(r.body)}` : r.url; const cur = requests.get(key) ?? { verifier: r.verifier, url: r.url, check: r.check, leads: [], ...(r.method === 'POST' ? { method: r.method, body: r.body, accept: r.accept } : {}) }; if (!cur.leads.includes(id)) cur.leads.push(id); requests.set(key, cur) } }
  for (const lead of leads) for (const f of factsOf(lead)) add(lead.id, f)
  for (const f of treeFacts) add(`tree:${f.kind}:${f.value}`, f)
  return [...requests.values()]
}

/** What came back, in one line, by verifier. */
export const noteOf = (verifier: string, text: string): string => {
  const title = () => { const m = /<title>([^<]*)<\/title>/i.exec(text); return m ? `title="${m[1]!.trim().slice(0, 100)}"` : `${text.length} chars` }
  try {
    if (verifier === 'oeis') { const j = JSON.parse(text); return `${Array.isArray(j) ? j.length : j.results?.length ?? j.count ?? 0} sequence results` }
    if (verifier === 'github') { const j = JSON.parse(text); return `description="${(j.description ?? '').slice(0, 80)}" language=${j.language}` }
    if (verifier === 'zenodo' || verifier === 'datacite') { const j = JSON.parse(text); return JSON.stringify(j.metadata?.creators?.[0] ?? j.data?.attributes?.creators?.[0] ?? {}).slice(0, 120) }
    if (verifier === 'wikipedia') { const j = JSON.parse(text); return `extract="${(j.extract ?? '').slice(0, 100)}"` }
    if (verifier === 'cloudflare-docs') { const j = JSON.parse(dataOf(text)); const body: string = j.result?.content?.[0]?.text ?? JSON.stringify(j.error ?? j.result ?? '').slice(0, 100); return `${(body.match(/<url>|"url"|https:\/\/developers\.cloudflare\.com/g) ?? []).length} result(s): ${body.replace(/\s+/g, ' ').slice(0, 100)}` }
  } catch { /* fall through to the title */ }
  if (verifier === 'arxiv') { const t = /<title>([^<]+)<\/title>/g; t.exec(text); const m = t.exec(text); return m ? `entry="${m[1]!.trim().slice(0, 100)}"` : 'no entry' }
  return title()
}

/** Is a request's path in the OpenAPI contract its host published? unknown where none was discovered. */
export const contractedOf = (url: string, contracts: Readonly<Record<string, readonly string[]>>): 'yes' | 'no' | 'unknown' => {
  const u = new URL(url); const templates = contracts[u.host]
  if (!templates) return 'unknown'
  const matches = (template: string) => new RegExp('^' + template.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{[^}]+\\\}/g, '[^/]+') + '/?$').test(u.pathname)
  return templates.some(matches) ? 'yes' : 'no'
}

/** Results read: the note from the body, the contract check, and the summary by verifier. */
export const waveOf = (results: readonly WaveResult[], contracts: Readonly<Record<string, readonly string[]>> = {}): { results: WaveResult[]; summary: WaveSummary; reachable: number } => {
  const read = results.map((r) => ({ ...r, text: undefined, note: r.note ?? (r.text !== undefined ? noteOf(r.verifier, r.text) : `${r.status || 'no answer'}`), contracted: r.contracted ?? contractedOf(r.url, contracts) }))
  read.sort((a, b) => a.verifier.localeCompare(b.verifier) || a.url.localeCompare(b.url))
  const summary: WaveSummary = {}
  for (const r of read) { const s = summary[r.verifier] ?? (summary[r.verifier] = { requests: 0, ok: 0, contracted: 0, uncontracted: 0 }); s.requests += 1; if (r.ok) s.ok += 1; if (r.contracted === 'yes') s.contracted += 1; if (r.contracted === 'no') s.uncontracted += 1 }
  return { results: read, summary, reachable: read.filter((r) => r.ok).length }
}

/** The verification page. */
export const wavePageOf = (w: { results: WaveResult[]; summary: WaveSummary }, leads: number, date: string, contractsKnown: boolean): string => ['---', 'title: Verification', 'order: 48', '---', '',
  '# Cross-verification on live public sources', '',
  `Generated by \`npm run next\` on ${date} through the \`wave\` tool. Every verify request the surface emits for its ${leads} leads was fetched once by this`,
  'repository acting as the client MCP; the handler itself did no I/O. A failed or missing row is a lead, not a ruling.', '',
  "| Verifier | Requests | Reachable | In the host's contract | Outside it |", '|---|---:|---:|---:|---:|',
  ...Object.entries(w.summary).map(([v, s]) => `| ${v} | ${s.requests} | ${s.ok} | ${contractsKnown ? s.contracted : 'no contract discovered'} | ${contractsKnown ? s.uncontracted : '—'} |`), '',
  '| Verifier | Status | What came back | Contract | Check | Leads |', '|---|---:|---|---|---|---|',
  ...w.results.map((r) => `| ${r.verifier} | ${r.status || 'none'} | ${(r.note ?? '').replace(/\|/g, '\\|')} | ${r.contracted} | ${r.check.replace(/\|/g, '\\|')} | ${r.leads.join(', ')} |`), ''].join('\n')
