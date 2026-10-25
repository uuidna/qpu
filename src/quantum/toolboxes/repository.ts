// The repository toolbox: workspaces, branches, tags and releases watched by the flow and verified online, pure. Phase one
// takes the local facts the client gathered (worktrees, branches with their upstreams, tags with their commits, HEAD, the
// package version, the remote) and plans the requests: GitHub's branches, tags and releases for the remote, Zenodo's records
// for the concept DOI, each checked against the contract discovery found. Phase two reads the answers into agreement and
// leads: a local branch with no remote, a remote branch not here, a tag here and not there or there and not here, a release
// without its tag, a package version with no tag, a Zenodo version with no release. Nothing here runs git or fetches.
import { toolOf, type Toolbox } from '../toolbox.js'
import { contractedOf } from '../wave.js'
import { flowWidget } from '../widgets.js'

export type Local = { remote: string | null; head: string; branch: string; version: string; worktrees: { path: string; head: string; branch: string | null }[]; branches: { name: string; upstream: string | null; head: string }[]; tags: { name: string; commit: string }[]; conceptDoi?: string | null }
export type Request = { id: string; url: string; purpose: 'branches' | 'tags' | 'releases' | 'zenodo'; contracted: 'yes' | 'no' | 'unknown' }
export type Answer = Request & { status: number; text: string }
export type Watch = { remote: string | null; owner: string | null; repo: string | null; head: string; branch: string; version: string; worktrees: number; branches: { local: number; remote: number | null; onlyLocal: string[]; onlyRemote: string[]; agree: string[] }; tags: { local: number; remote: number | null; onlyLocal: string[]; onlyRemote: string[]; agree: string[]; mismatch: string[] }; releases: { count: number | null; latest: string | null; withoutTag: string[]; versionHasTag: boolean; versionHasRelease: boolean | null }; zenodo: { versions: number | null; latest: string | null; withoutRelease: string[] }; leads: { id: string; source: string; statement: string; status: 'open'; reason: string }[]; refusals: string[] }

export const ownerRepoOf = (remote: string | null): { owner: string; repo: string } | null => { const m = remote ? /github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/.exec(remote) : null; return m ? { owner: m[1]!, repo: m[2]! } : null }

export const watchRequestsOf = (local: Local, contracts: Readonly<Record<string, readonly string[]>> = {}): Request[] => {
  const or = ownerRepoOf(local.remote); const out: Request[] = []
  const req = (id: string, url: string, purpose: Request['purpose']) => out.push({ id, url, purpose, contracted: contractedOf(url, contracts) })
  if (or) { req('branches', `https://api.github.com/repos/${or.owner}/${or.repo}/branches?per_page=100`, 'branches'); req('tags', `https://api.github.com/repos/${or.owner}/${or.repo}/tags?per_page=100`, 'tags'); req('releases', `https://api.github.com/repos/${or.owner}/${or.repo}/releases?per_page=100`, 'releases') }
  if (local.conceptDoi) req('zenodo', `https://zenodo.org/api/records?q=conceptdoi:%22${local.conceptDoi}%22&allversions=1&size=25`, 'zenodo')
  return out
}

const parse = <T>(a: Answer | undefined): T | null => { if (!a || a.status !== 200) return null; try { return JSON.parse(a.text) as T } catch { return null } }

export const watchOf = (local: Local, answers: readonly Answer[]): Watch => {
  const or = ownerRepoOf(local.remote)
  const refusals = answers.filter((a) => a.status !== 200).map((a) => `${a.purpose}: HTTP ${a.status || 'none'} ${a.text.slice(0, 80)}`)
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
  const leads: Watch['leads'] = []
  const lead = (id: string, statement: string, reason: string) => leads.push({ id, source: local.remote ?? 'git', statement, status: 'open', reason })
  if (rb) for (const b of localBranchNames.filter((n) => !rb.includes(n) && n !== 'HEAD')) lead(`branch-only-local-${b.replace(/[^a-z0-9]+/gi, '-')}`, `branch ${b} exists here and not at ${or?.owner}/${or?.repo}`, local.branches.find((x) => x.name === b)?.upstream ? 'its upstream is gone: delete it or push it' : 'unpushed work, or a local experiment: push it, or record why it stays local')
  if (rb) for (const b of rb.filter((n) => !localBranchNames.includes(n))) lead(`branch-only-remote-${b.replace(/[^a-z0-9]+/gi, '-')}`, `branch ${b} exists at the remote and not here`, 'fetch it, or it is another workspace\'s')
  if (rt) for (const t of localTagNames.filter((n) => !rt.includes(n))) lead(`tag-only-local-${t.replace(/[^a-z0-9]+/gi, '-')}`, `tag ${t} exists here and not at the remote`, 'a tag that is not pushed is not a release: push it or delete it')
  if (rt) for (const t of rt.filter((n) => !localTagNames.includes(n))) lead(`tag-only-remote-${t.replace(/[^a-z0-9]+/gi, '-')}`, `tag ${t} exists at the remote and not here`, 'fetch tags')
  for (const t of mismatch) lead(`tag-moved-${t.replace(/[^a-z0-9]+/gi, '-')}`, `tag ${t} points at different commits here and at the remote`, 'a moved tag is a rewritten release: the two commits are the evidence')
  if (releaseTags) for (const r of releaseTags.filter((t) => rt && !rt.includes(t))) lead(`release-without-tag-${r.replace(/[^a-z0-9]+/gi, '-')}`, `release ${r} has no tag at the remote`, 'a release names a tag that is gone')
  if (!localTagNames.includes(versionTag)) lead(`version-without-tag-${versionTag}`, `package.json says ${local.version} and no tag ${versionTag} exists here`, 'the version is the single source: tag it when it ships, or it is unreleased work in progress')
  if (releaseTags && !releaseTags.includes(versionTag)) lead(`version-without-release-${versionTag}`, `no GitHub release for ${versionTag}`, 'the release is the author\'s act; the Zenodo webhook archives it')
  if (zenVersions && releaseTags) for (const v of zenVersions.filter((v) => !releaseTags.includes(v) && !releaseTags.includes(`v${v}`))) lead(`zenodo-without-release-${v.replace(/[^a-z0-9]+/gi, '-')}`, `Zenodo holds version ${v} and GitHub has no release for it`, 'a Zenodo version without its release: the orphan lineage, or a manual upload')
  if (local.worktrees.length > 1) for (const w of local.worktrees.slice(1)) lead(`workspace-${w.path.split('/').pop()}`, `workspace ${w.path} at ${w.head.slice(0, 8)} on ${w.branch ?? 'detached HEAD'}`, 'a second workspace holds work the main one does not see; merge or record it')
  return { remote: local.remote, owner: or?.owner ?? null, repo: or?.repo ?? null, head: local.head, branch: local.branch, version: local.version, worktrees: local.worktrees.length,
    branches: { local: localBranchNames.length, remote: rb?.length ?? null, onlyLocal: rb ? localBranchNames.filter((n) => !rb.includes(n)) : [], onlyRemote: rb ? rb.filter((n) => !localBranchNames.includes(n)) : [], agree: rb ? localBranchNames.filter((n) => rb.includes(n)) : [] },
    tags: { local: localTagNames.length, remote: rt?.length ?? null, onlyLocal: rt ? localTagNames.filter((n) => !rt.includes(n)) : [], onlyRemote: rt ? rt.filter((n) => !localTagNames.includes(n)) : [], agree: rt ? localTagNames.filter((n) => rt.includes(n) && !mismatch.includes(n)) : [], mismatch },
    releases: { count: releaseTags?.length ?? null, latest: releaseTags?.[0] ?? null, withoutTag: releaseTags && rt ? releaseTags.filter((t) => !rt.includes(t)) : [], versionHasTag: localTagNames.includes(versionTag), versionHasRelease: releaseTags ? releaseTags.includes(versionTag) : null },
    zenodo: { versions: zenVersions?.length ?? null, latest: zenVersions?.[0] ?? null, withoutRelease: zenVersions && releaseTags ? zenVersions.filter((v) => !releaseTags.includes(v) && !releaseTags.includes(`v${v}`)) : [] }, leads, refusals }
}

export const watchPageOf = (w: Watch, date: string): string => ['---', 'title: Repository', 'order: 57', '---', '', '# Workspaces, branches, tags and releases, watched', '',
  `Gathered here and verified online on ${date} by \`npm run next\` through the \`repository\` tool: ${w.owner ? `${w.owner}/${w.repo}` : 'no GitHub remote'}, HEAD ${w.head.slice(0, 8)} on ${w.branch}, package version ${w.version}, ${w.worktrees} workspace(s).`, '',
  '| Kind | Here | Remote | Agree | Only here | Only remote |', '|---|---:|---:|---:|---|---|',
  `| branches | ${w.branches.local} | ${w.branches.remote ?? 'not reached'} | ${w.branches.agree.length} | ${w.branches.onlyLocal.join(', ') || '—'} | ${w.branches.onlyRemote.join(', ') || '—'} |`,
  `| tags | ${w.tags.local} | ${w.tags.remote ?? 'not reached'} | ${w.tags.agree.length} | ${w.tags.onlyLocal.join(', ') || '—'} | ${w.tags.onlyRemote.join(', ') || '—'} |`, '',
  `Releases: ${w.releases.count ?? 'not reached'}, latest ${w.releases.latest ?? '—'}; version tag ${w.releases.versionHasTag ? 'present' : 'absent'}, release ${w.releases.versionHasRelease === null ? 'unknown' : w.releases.versionHasRelease ? 'present' : 'absent'}. Zenodo: ${w.zenodo.versions ?? 'not reached'} version(s), latest ${w.zenodo.latest ?? '—'}${w.zenodo.withoutRelease.length ? `, without a release: ${w.zenodo.withoutRelease.join(', ')}` : ''}. ${w.tags.mismatch.length ? `Tags moved: ${w.tags.mismatch.join(', ')}.` : ''}`, '',
  '## Leads', '', ...(w.leads.length ? w.leads.map((l) => `- \`${l.id}\`: ${l.statement} — ${l.reason}`) : ['none: here and the remote agree']), '', ...(w.refusals.length ? ['## Refused', '', ...w.refusals.map((r) => `- ${r}`), ''] : [])].join('\n')

const repository = toolOf('repository', {
  name: 'repository',
  description: 'Workspaces, branches, tags and releases watched and verified online, pure. Phase one (local): the requests to GitHub (branches, tags, releases) and Zenodo (every version of the concept DOI), each checked against the contract discovery found. Phase two (plus answers): agreement and leads — a branch or tag only here or only there, a moved tag, a release without its tag, a version without a tag or release, a Zenodo version without a release, a second workspace. The client runs git and fetches; nothing here does.',
  inputSchema: { type: 'object', properties: { local: { type: 'object', description: '{ remote, head, branch, version, worktrees, branches, tags, conceptDoi }' }, contracts: { type: 'object' }, answers: { type: 'array', items: { type: 'object' } }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...REPOSITORY.skill.selftest(ctx) }
    const local = args.local as Local | undefined
    if (!local) throw new Error('repository needs local: the facts the client gathered with git')
    if (!Array.isArray(args.answers)) { const requests = watchRequestsOf(local, (args.contracts ?? {}) as Record<string, string[]>); return { phase: 'requests' as const, requests: requests.length, requestList: requests } }
    const w = watchOf(local, args.answers as Answer[])
    return { phase: 'watch' as const, branches: w.branches.local, tags: w.tags.local, releases: w.releases.count ?? -1, leads: w.leads.length, refusals: w.refusals.length, watch: w, page: watchPageOf(w, new Date().toISOString()) }
  },
  widget: flowWidget,
})

const LOCAL: Local = { remote: 'https://github.com/uuidna/qpu.git', head: 'abcdef1234567890', branch: 'rebuild/phase-1', version: '1.4.0', worktrees: [{ path: '/w/qpu', head: 'abcdef12', branch: 'rebuild/phase-1' }, { path: '/w/qpu-2', head: '1234abcd', branch: null }], branches: [{ name: 'main', upstream: 'origin/main', head: '1111' }, { name: 'rebuild/phase-1', upstream: null, head: 'abcdef12' }, { name: 'orphan/v1.1.1-audit', upstream: null, head: '2222' }], tags: [{ name: 'v1.3.2', commit: '3333' }, { name: 'v1.4.0', commit: '4444' }, { name: 'waves-complete', commit: '5555' }], conceptDoi: '10.5281/zenodo.22700098' }
const ANSWERS: Answer[] = [
  { id: 'branches', url: 'https://api.github.com/repos/uuidna/qpu/branches?per_page=100', purpose: 'branches', contracted: 'yes', status: 200, text: JSON.stringify([{ name: 'main', commit: { sha: '1111' } }, { name: 'clean', commit: { sha: '9999' } }]) },
  { id: 'tags', url: 'https://api.github.com/repos/uuidna/qpu/tags?per_page=100', purpose: 'tags', contracted: 'yes', status: 200, text: JSON.stringify([{ name: 'v1.3.2', commit: { sha: '3333aaaa' } }, { name: 'v1.4.0', commit: { sha: 'ffff' } }, { name: 'v1.0.1', commit: { sha: '0101' } }]) },
  { id: 'releases', url: 'https://api.github.com/repos/uuidna/qpu/releases?per_page=100', purpose: 'releases', contracted: 'yes', status: 200, text: JSON.stringify([{ tag_name: 'v1.3.2', name: 'v1.3.2', draft: false, prerelease: false, published_at: '2026-10-01' }, { tag_name: 'v1.0.1', name: 'v1.0.1', draft: false, prerelease: false, published_at: '2026-09-01' }, { tag_name: 'v0.9.0', name: 'v0.9.0', draft: false, prerelease: false, published_at: '2026-08-01' }]) },
  { id: 'zenodo', url: 'https://zenodo.org/api/records?q=x', purpose: 'zenodo', contracted: 'unknown', status: 200, text: JSON.stringify({ hits: { hits: [{ metadata: { version: 'v1.3.2' } }, { metadata: { version: '1.1.1' } }] } }) },
]

export const REPOSITORY: Toolbox = {
  name: 'repository',
  idea: 'the repository watched: every workspace, branch, tag and release here compared with the remote and the archive online, every disagreement a lead',
  tools: [repository],
  examples: [
    { id: 'repository-watch', tool: 'repository', arguments: { local: LOCAL, answers: ANSWERS }, shows: 'Fixture facts against fixture answers: two local branches unpushed, one remote branch not here, a local tag not pushed, a remote tag not fetched, a moved tag, a release whose tag is gone, a version with a tag and no release, a Zenodo version without a release, a second workspace: ten leads.', expect: (s) => (s.phase === 'watch' && s.leads === 10 && s.watch.tags.mismatch.join() === 'v1.4.0' && s.watch.releases.withoutTag.join() === 'v0.9.0' && s.watch.zenodo.withoutRelease.join() === '1.1.1' ? null : `${s.phase} ${s.leads} leads: ${s.watch?.leads.map((l: { id: string }) => l.id).join(', ')}`) },
  ],
  skill: {
    instructions: 'The client gathers with git: the remote url, HEAD, the branch, package.json\'s version, worktree list, every branch with its upstream and head, every tag with its commit, and the concept DOI from .zenodo.json\'s related identifiers; calls repository for the requests; fetches them (GitHub needs no token for public reads); calls again with the answers; writes repository.json and the page; its leads join the next-leads docket. Offline, the local facts alone are written.',
    directions: ['server only: fixture facts against fixture answers give every kind of lead once', 'client → server: git facts in, GitHub and Zenodo bodies in', 'toolbox → toolbox: requests checked against the contracts discovery found; leads feed readiness'],
    selftest: () => {
      const checks: { id: string; passed: boolean; evidence: string }[] = []
      const check = (id: string, passed: boolean, evidence: string) => checks.push({ id, passed, evidence })
      const reqs = watchRequestsOf(LOCAL, { 'api.github.com': ['/repos/{owner}/{repo}/branches', '/repos/{owner}/{repo}/tags', '/repos/{owner}/{repo}/releases'] })
      check('repository:requests', reqs.length === 4 && reqs.filter((r) => r.contracted === 'yes').length === 3 && reqs[3]!.purpose === 'zenodo', `${reqs.length} requests, ${reqs.filter((r) => r.contracted === 'yes').length} inside GitHub's contract`)
      check('repository:no-remote', watchRequestsOf({ ...LOCAL, remote: null, conceptDoi: null }).length === 0 && ownerRepoOf('git@github.com:uuidna/qpu.git')?.repo === 'qpu', 'no remote, no requests; an ssh remote parses')
      const w = watchOf(LOCAL, ANSWERS)
      const ids = w.leads.map((l) => l.id)
      check('repository:leads', ids.includes('branch-only-local-rebuild-phase-1') && ids.includes('branch-only-remote-clean') && ids.includes('tag-only-local-waves-complete') && ids.includes('tag-only-remote-v1-0-1') && ids.includes('tag-moved-v1-4-0') && ids.includes('release-without-tag-v0-9-0') && ids.includes('version-without-release-v1.4.0') && ids.includes('zenodo-without-release-1-1-1') && ids.includes('workspace-qpu-2') && !ids.some((i) => i.startsWith('version-without-tag')), ids.join(', '))
      const offline = watchOf(LOCAL, [])
      check('repository:offline', offline.branches.remote === null && offline.leads.length === 1 && offline.leads[0]!.id === 'workspace-qpu-2' && offline.refusals.length === 0, 'without answers only the local facts speak: the second workspace')
      const refused = watchOf(LOCAL, [{ ...ANSWERS[0]!, status: 403, text: 'rate limited' }])
      check('repository:refusal', refused.refusals.length === 1 && refused.branches.remote === null, 'a refused request is recorded, never read as agreement')
      check('repository:page', watchPageOf(w, '2026-01-01').includes('| tags | 3 | 3 | 1 | waves-complete | v1.0.1 |'), 'the page renders the tags row')
      return { passed: checks.every((c) => c.passed), checks }
    },
  },
}
