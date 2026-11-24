export const meta = {
  name: 'qpu-leads',
  description: 'Work open qpu leads one at a time in the shared qpu tree: select from the lead record, build and commit each, adversarially verify, repair once',
  whenToUse: 'When leads in src/quantum/processing/leads-index.ts are open or partial and should be served by code. args: { ids?: string[], lastmod?: string, limit?: number }',
  phases: [
    { title: 'Select', detail: 'read the lead record and pick the leads to work' },
    { title: 'Build', detail: 'one agent per lead, sequential, commits by pathspec, no push' },
    { title: 'Verify', detail: 'one skeptic per landed commit tries to refute it' },
    { title: 'Fix', detail: 'one repair attempt when the skeptic refutes' },
  ],
}

// The leads are the work list: they enter only through the leads door (textbook { scripts: { leadsIndex } }) and leave only by a
// verdict, so this pipeline reads them from the record instead of a list typed by hand. Sequential by design: every agent works
// in the one shared qpu checkout, and its pre-commit hook judges the tree.
const ROOM = '4ffddc03d82f1044c9c29a1e544d2b3bdea4f020bee440774b7fe1b1c0a588c6'
const COMMON = `
You work in the qpu repository at /Users/ceci/github/uuidna/qpu, directly on branch main (the shared checkout; do not create worktrees or branches, do not stash, reset or switch branches). Other Claude sessions share this tree.
- Before editing, run \`git status --short\`. Never touch or commit another session's uncommitted files; if they block you, stop and report.
- Post to the coordination room with the uuidna-qpu MCP tool \`send\` (ToolSearch "select:mcp__uuidna-qpu__send"): room ${ROOM}, from "qpu-leads/<lead id>", once before you edit (which files) and once after you commit (the hash).
- Sentences are authored in Lean under lean/Qpu/General/Prose/ and generated into src/quantum/processing/prose-index.ts by \`lake run index\`; never hand-edit a generated file (prose-index.ts, leads-index.ts, receipt-index.ts, docs/public/mcp.json, the READMEs, .zenodo.json, .agents/skills/*). Compute only through the one runner, never an ad-hoc script: \`node src/quantum/processing/machine-run.ts step <tool> '<json>' [--write]\` calls any tool and, with --write, writes the files its answer returns ({ "$file": "<path>" } inside the JSON reads a file). After \`lake run index\`, regenerate the skills with \`step textbook '{"scripts":{"skills":true}}' --write\` and docs/public/mcp.json as scripts/site.ts writes it. The pre-commit rule one-script refuses any new entry point.
- A uuidna hook may refuse shell commands naming paths with "lean", "README", "zenodo" or "packages". Use Read/Edit/Write for .lean files; for git add/commit use the documented escape with a truthful line: UUIDNA_MCP_GAP="no door commits a change in the qpu repository" bash -c 'cd /Users/ceci/github/uuidna/qpu && git add -- <paths> && git commit -F <message file> -- <paths>'. Never obfuscate a command to pass a hook; if refused, stop and report.
- Pre-commit rules: "proven" (a new export also named in added lines of examples.ts and textbook-theorems.ts; prefer module-local helpers), "automated" (no hand-written docs page, no drifted generated file), "folded", "green". Tests are node:test *_test.ts with an ISO/IEC/IEEE 29119-3 doc comment equal to the title. Run the affected tests and \`pnpm -s typecheck\`, then commit by pathspec with a 10-minute timeout, message from a file: imperative subject under 72 characters, a body, last line Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
- NEVER push: a push to qpu main deploys the Worker and waits for the owner.
- Keep every field an integrator reads in each tool's default answer (seal address, sha256; verify valid and checks seal/content; jsonld jsonLd @context/@type/@id/url/name/description/inLanguage; codes standards, mine.currencies, *Unknown, *ValidCount, territoriesValid; audit fallback, leads, remedied, unremedied); add new forms beside old ones; never special-case a domain or tenant.
- A new lead goes in with one runner call: \`step textbook '{"scripts":{"leadsIndex":{"add":[{ id, source, statement, status, reason, lastmod }]}}}' --write\`. Update your own lead's row only through the door, run by the one runner: \`step textbook '{"scripts":{"leadsIndex":{"rows":[…]}}}' --write\` with LEAD_ROWS where your row's status is 'served' when its statement holds fully, else 'partial', and its reason says what was done; write the returned text to the returned path in the same commit.
- If the lead is too large, land a coherent first slice that passes every gate, set it 'partial', and report what remains.
`
const PICKED = { type: 'object', required: ['leads'], properties: { leads: { type: 'array', items: { type: 'object', required: ['id', 'statement'], properties: { id: { type: 'string' }, statement: { type: 'string' }, reason: { type: 'string' }, tool: { type: 'string' }, status: { type: 'string' } } } } } }
const RESULT = { type: 'object', required: ['lead', 'committed', 'summary', 'remaining'], properties: { lead: { type: 'string' }, committed: { type: 'boolean' }, commit: { type: 'string' }, summary: { type: 'string' }, tests: { type: 'string' }, remaining: { type: 'string' } } }
const VERDICT = { type: 'object', required: ['refuted', 'problems'], properties: { refuted: { type: 'boolean' }, problems: { type: 'array', items: { type: 'string' } } } }

const ask = args ?? {}
const limit = Number.isInteger(ask.limit) ? ask.limit : 6
phase('Select')
const picked = await agent(`Read-only. In /Users/ceci/github/uuidna/qpu, read the lead record through the one runner: \`node src/quantum/processing/machine-run.ts step leads '{}'\` (the leads door answers every lead with its id, statement, status, tool and reason; never an ad-hoc script). Select the leads to work: ${Array.isArray(ask.ids) && ask.ids.length ? `exactly the ids ${JSON.stringify(ask.ids)}` : ask.lastmod ? `status open or partial with lastmod ${JSON.stringify(ask.lastmod)}` : 'status open or partial, newest lastmod first'}, at most ${limit}, ordered so a lead another depends on comes first. Return each with id, statement, reason, tool and status, verbatim from the record.`, { label: 'select', phase: 'Select', schema: PICKED })
const leads = (picked?.leads ?? []).slice(0, limit)
log(`${leads.length} lead(s) selected: ${leads.map((l) => l.id).join(', ') || 'none'}`)

const results = []
for (const lead of leads) {
  const task = `Lead ${lead.id} (${lead.status ?? 'open'}${lead.tool ? `, door ${lead.tool}` : ''}): ${lead.statement}\nWhy it is open: ${lead.reason ?? 'not stated'}`
  const built = await agent(`${COMMON}\nYour task:\n${task}\n\nReturn whether you committed, the hash, a summary, the tests you ran with results, and what remains.`, { label: `build:${lead.id}`, phase: 'Build', schema: RESULT })
  if (!built) { results.push({ lead: lead.id, committed: false, summary: 'agent did not return', remaining: 'all' }); continue }
  log(`${lead.id}: ${built.committed ? `committed ${built.commit ?? ''}` : 'not committed'}`)
  if (!built.committed) { results.push(built); continue }
  const verdict = await agent(`You are a skeptic reviewing one local commit in /Users/ceci/github/uuidna/qpu (read-only: reading, git show/log/diff and running tests only). Commit ${built.commit} claims to work:\n${task}\n\nIts author says: ${built.summary}\n\nTry to refute it: does the diff do what the statement says (not a name or a stub)? Did a default answer field integrators read change? Was a generated file hand-edited? Is a domain or tenant special-cased? Do the tests assert behaviour? Run the tests it added. refuted=true only for concrete, verified problems, each with file and line.`, { label: `verify:${lead.id}`, phase: 'Verify', schema: VERDICT })
  if (verdict?.refuted && verdict.problems.length) {
    log(`${lead.id}: refuted (${verdict.problems.length}); one repair attempt`)
    const fixed = await agent(`${COMMON}\nA skeptic refuted commit ${built.commit} for:\n${task}\n\nProblems:\n- ${verdict.problems.join('\n- ')}\n\nFix the verified problems in a new commit (never amend or rewrite history); for a problem that is not real, say why instead.`, { label: `fix:${lead.id}`, phase: 'Fix', schema: RESULT })
    results.push({ ...built, verdict, fix: fixed })
  } else results.push({ ...built, verdict })
}
return results
