// The one runner of a planned machine action, shared by the stdio transport and the Payload MCP plugin's machine tool: the argument vector
// the plan returns, spawned with no shell, its output read line by line as it arrives — each line handed to the caller at once, so a client
// that sent a progress token sees the run as it happens — and the whole kept for the record the repository tool judges. For next, a finished
// step (a line opening with ✓, ✗ or ·) is the unit of progress; for any other action, a line is.
import { spawn, execFileSync } from 'node:child_process'

export type MachineProgress = { progress: number; total?: number; message: string }
const STEP = /^\s*[✓✗·]\s/

/** Runs the plan's command, calling onProgress for every finished step of next or every output line of anything else, and resolves to the whole run. */
const spawnRun = (plan: { action: string; command: { cmd: string; args: readonly string[] }; input?: string | null }, cwd: string, onProgress: (p: MachineProgress) => void = () => {}) =>
  new Promise<{ status: number | null; stdout: string; stderr: string; ms: number }>((resolve) => {
    const t0 = Date.now()
    const child = spawn(plan.command.cmd, [...plan.command.args], { cwd, shell: false })
    let stdout = '', stderr = '', progress = 0
    const lineOf = (stream: 'stdout' | 'stderr') => { let rest = ''; return (chunk: Buffer) => {
      const text = rest + chunk.toString('utf8'); const lines = text.split('\n'); rest = lines.pop() ?? ''
      if (stream === 'stdout') stdout += chunk.toString('utf8'); else stderr += chunk.toString('utf8')
      for (const line of lines) if (line.trim() && (plan.action !== 'next' || STEP.test(line))) onProgress({ progress: ++progress, message: line })
    } }
    child.stdout.on('data', lineOf('stdout'))
    child.stderr.on('data', lineOf('stderr'))
    child.on('error', (e) => { stderr += String(e); resolve({ status: null, stdout, stderr, ms: Date.now() - t0 }) })
    child.on('close', (code) => resolve({ status: code, stdout, stderr, ms: Date.now() - t0 }))
    child.stdin.end(plan.input ?? '')
  })

// The stream every run writes. Each start, end and heartbeat is one NDJSON line in the stream file (the harness tails it, the Payload admin
// reads it): while a run lasts, a heartbeat follows any second without an event, so the stream is never silent (textbook_stream_no_silence), and
// every event carries the ETA the receipts and the stream's own finished runs give, or none (textbook_eta_from_receipts). The stream is the
// machine's own file, beside the run's record in Entries; it is never a docket entry of its own.
import { appendFileSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { homedir } from 'node:os'
import { forecastTimes, MACHINE_ACTIONS, type StreamEvent } from '../src/quantum/machine.ts'
import { getJson } from './mcp.ts'
import { LITERAL_ROOTS } from '../src/quantum/audit.ts'

const runFiles = async () => (await import('../src/quantum/toolboxes/repository.ts')).RUN_FILES
export const streamOf = async (root: string) => {
  const file = join(root, (await runFiles()).stream)
  mkdirSync(dirname(file), { recursive: true })
  let last = Date.now(), beat: ReturnType<typeof setInterval> | null = null, current: { subject: string; t0: number; eta: number | null } | null = null
  const emit = (e: Omit<StreamEvent, 'at'>) => { const ev = { at: new Date().toISOString(), ...e } as StreamEvent; last = Date.now(); appendFileSync(file, JSON.stringify(ev) + '\n'); return ev }
  let high: number | undefined
  const start = (subject: string, eta: number | null, hi?: number) => { current = { subject, t0: Date.now(), eta }; high = hi; emit({ kind: 'step-start', subject, eta, says: `${subject} started${eta === null ? ', no ETA: no recorded time yet' : `, ETA ${(eta / 1000).toFixed(1)} s`}` })
    beat = setInterval(() => { if (current && Date.now() - last >= 900) { const elapsed = Date.now() - current.t0; emit({ kind: 'working', subject: current.subject, elapsed, eta: current.eta, says: `${current.subject} working ${(elapsed / 1000).toFixed(0)} s${current.eta === null ? '' : ` of ~${(current.eta / 1000).toFixed(0)} s`}` }) } }, 100) }
  const end = (ok: boolean, says: string) => { if (beat) clearInterval(beat); beat = null; if (!current) return; const { subject, t0, eta } = current, ms = Date.now() - t0; current = null
    emit({ kind: 'step-end', subject, ms, eta, says: `${subject} ${ok ? 'done' : 'failed'} in ${(ms / 1000).toFixed(1)} s${says ? `: ${says}` : ''}` })
    const bound = high ?? (eta === null ? null : 2 * eta) // the forecast is the budget: past its interval is a violation, its profile the event
    if (bound !== null && ms > bound) emit({ kind: 'over-forecast', subject, ms, eta, says: `${subject} took ${(ms / 1000).toFixed(1)} s, past its forecast's bound of ${(bound / 1000).toFixed(1)} s (estimated ${((eta ?? 0) / 1000).toFixed(1)} s)` }) }
  return { emit, start, end }
}

/** The recorded times of each step and action, from the receipts and the stream's own finished runs: the ETA's only source. */
export const timesOf = async (root: string) => {
  const files = await runFiles(), times: Record<string, number[]> = {}
  const lines = (f: string) => (existsSync(join(root, f)) ? readFileSync(join(root, f), 'utf8').trim().split('\n') : [])
  for (const l of lines(files.receipts)) { try { for (const st of (JSON.parse(l) as { steps?: { name: string; ms?: number; status?: string }[] }).steps ?? []) if (typeof st.ms === 'number' && st.ms > 0 && st.status === 'green') (times[st.name] ??= []).push(st.ms) } catch {} }
  for (const l of lines(files.stream)) { try { const e = JSON.parse(l) as StreamEvent; if (e.kind === 'step-end' && typeof e.ms === 'number' && e.ms > 0 && !/ failed /.test(e.says)) (times[e.subject] ??= []).push(e.ms) } catch {} }
  return times
}

/** Runs an asked action: planned by the workflow rules against the facts at the root, run with no shell and streamed (its start with the ETA, a
 *  heartbeat every second, each finished step of next), then recorded; an action the rules refuse answers its plan and runs nothing. */
export const runMachine = async (args: Record<string, unknown>, cwd: string, onProgress: (p: MachineProgress) => void = () => {}) => {
  const repository = (await import('../src/quantum/mcp.ts')).toolCallerOf('repository'), read = (f: string) => getJson(join(cwd, f))
  const files = await runFiles(), plan = repository({ machine: { plan: { ...args, facts: { receipt: read(files.receipt), approval: read(files.configs)?.approval ?? null, e2e: read(files.e2e)?.outcomes ?? null } } } })
  if (!plan?.allowed) return { plan, answer: plan }
  // the action's own hooks run first, before use: a refusal is answered here, before anything is changed or booked
  const workflow = MACHINE_ACTIONS.find((a) => a.id === plan.action)?.workflow, pre = workflow ? await spawnRun({ action: 'pre-use', command: { cmd: 'node', args: [...MACHINE_ACTIONS.find((a) => a.id === 'precheck')!.args.slice(0, 1), workflow, '--pre-use'] } }, cwd) : null
  if (pre && / refused/.test(pre.stdout + pre.stderr)) return { plan, answer: { plan, preUse: (pre.stdout + pre.stderr).trim() } }
  const s = await streamOf(cwd), subject = plan.action
  const f = forecastTimes((await timesOf(cwd))[subject] ?? [])
  s.start(subject, f?.point ?? null, f?.interval?.[1])
  const run = await spawnRun(plan, cwd, (p) => { if (plan.action === 'next') s.emit({ kind: 'progress', subject, says: p.message.slice(0, 200) }); onProgress(p) })
  s.end(run.status === 0, run.status === 0 ? '' : `status ${run.status}`)
  const record = repository({ machine: { record: { action: plan.action, command: plan.command, status: run.status, stdout: run.stdout, stderr: run.stderr, ms: run.ms, root: cwd, home: homedir() } } })
  return { plan, record, answer: { plan: { action: plan.action, command: plan.command, decision: plan.decision?.says ?? null }, record: { says: record.says, ok: record.ok, redacted: record.redacted, entry: record.entry } } }
}

/** A merge as one linear flow of machine actions: the working tree set aside when it holds changes, the branch merged without a commit (no
 *  pre-use: nothing is regenerated before it), the merge completed by the commit action, whose pre-use decides the merged tree. */
const mergeFlow = async (branch: string, message: string | undefined, cwd: string, onProgress: (p: MachineProgress) => void = () => {}) => {
  const dirty = (await spawnRun({ action: 'status', command: { cmd: 'git', args: ['status', '--porcelain', '--untracked-files=no'] } }, cwd)).stdout.trim()
  const aside = dirty ? await runMachine({ action: 'set-aside' }, cwd, onProgress) : null, merged = await runMachine({ action: 'merge', branch }, cwd, onProgress)
  const commit = merged.record?.ok ? await runMachine({ action: 'commit', confirm: true, message: message ?? `Merge ${branch}\n\nBrought in by the machine's merge flow: the working tree set aside, the branch merged without a\ncommit, the merge completed through the commit action.` }, cwd, onProgress) : null
  return { aside, merged, commit }
}

/** The status on request: what runs, for how long and its ETA, the last events and what the stream says of its own silence. */
export const now = async (root: string, last = 20) => {
  const file = join(root, (await runFiles()).stream)
  const events = existsSync(file) ? readFileSync(file, 'utf8').trim().split('\n').flatMap((l) => { try { return [JSON.parse(l)] } catch { return [] } }) : []
  const { toolCallerOf } = await import('../src/quantum/mcp.ts')
  return toolCallerOf('repository')({ status: { events, times: await timesOf(root), last } })
}

// the machine from the command line: now, the last receipt's red steps, or any allowed action, its message read from a file
if (process.argv[1]?.endsWith('machine.ts')) {
  const [, , action, ...rest] = process.argv, flag = (n: string) => (rest.includes(n) ? rest[rest.indexOf(n) + 1] : undefined)
  const say = (x: Awaited<ReturnType<typeof runMachine>>) => (x.answer as { preUse?: string }).preUse ?? (x.answer as { record?: { says?: string } }).record?.says ?? (x.answer as { says?: string }).says ?? JSON.stringify(x.answer)
  if (action === 'now') console.log(JSON.stringify(await now(process.cwd()), null, 1))
  else if (action === 'proof-keys' || action === 'proof-verify') {
    const c = await import('node:crypto'), { mcpClient } = await import('./mcp.ts'), { toolCallerOf } = await import('../src/quantum/mcp.ts'), keyFile = join(dirname(join(process.cwd(), (await runFiles()).receipt)), 'proof-key.json')
    const referer = flag('--referer'), sk = process.env.QPU_PROOF_SIGNING_KEY
    // keys bound to a referer: each chunk's seed is HKDF over the signing seed, the referer the salt (the plan seal { referer } answers); the public ids printed, never a private key
    if (action === 'proof-keys' && referer) { const plan = (toolCallerOf('seal')({ text: referer, referer: { address: referer, chunks: Number(flag('--chunks') ?? 1) } }) as { derivation: { infos: string[] } }).derivation, seed = Buffer.from(sk ?? '', 'base64').subarray(-32)
      if (Buffer.from(sk ?? '', 'base64').length !== 54) { console.log('no seed-form QPU_PROOF_SIGNING_KEY named: make one with proof-keys first'); process.exit(1) }
      const idOf = (info: string) => { const k = c.createPrivateKey({ key: Buffer.concat([Buffer.from('3034020100300b0609608648016503040312042280' + '20', 'hex'), Buffer.from(c.hkdfSync('sha256', seed, Buffer.from(referer.split('-').join(''), 'hex'), info, 32))]), format: 'der', type: 'pkcs8' }); return c.createHash('sha256').update(c.createPublicKey(k).export({ type: 'spki', format: 'der' })).digest('hex') }
      const ids = plan.infos.map(idOf), again = plan.infos.map(idOf); console.log(JSON.stringify({ referer, keys: ids, recomputedEqual: ids.join() === again.join(), distinct: new Set(ids).size === ids.length, entropy: 'the signing seed\'s 256 bits; the referer adds 0' })); process.exit(0) }
    if (action === 'proof-keys') { if (process.env.QPU_PROOF_SIGNING_KEY) { console.log('a proof signing key is already named; not replaced'); process.exit(0) }
      const { publicKey, privateKey } = (c.generateKeyPairSync as unknown as (alg: string) => { publicKey: import('node:crypto').KeyObject; privateKey: import('node:crypto').KeyObject })('ml-dsa-65'), spki = publicKey.export({ type: 'spki', format: 'der' }).toString('base64')
      writeFileSync(keyFile, JSON.stringify({ alg: 'ML-DSA-65', spki, id: c.createHash('sha256').update(spki).digest('hex') }, null, 1) + '\n'); appendFileSync('.dev.vars', `\nQPU_PROOF_SIGNING_KEY=${privateKey.export({ type: 'pkcs8', format: 'der' }).toString('base64')}\n`)
      console.log(`ML-DSA-65 key pair made: the private key named QPU_PROOF_SIGNING_KEY in the environment file (never printed), the public key published at ${keyFile}`) }
    else { const pk = c.createPublicKey({ key: Buffer.from((JSON.parse(readFileSync(keyFile, 'utf8')) as { spki: string }).spki, 'base64'), format: 'der', type: 'spki' }), file = flag('--file'), page = flag('--page')
      const blocks = (file ? JSON.parse(readFileSync(file, 'utf8')) : ((await mcpClient().docOf('findPages', page ?? '')) as { layout?: unknown[] } | null)?.layout ?? []) as { blockType?: string; tool?: string; arguments?: unknown; theorem?: string; proof?: { signed: string; mac: string | null; signature: string | null } | null }[]
      const proved = blocks.filter((b) => b.proof), rows = proved.map((b) => { const again = (toolCallerOf('verify')({ call: { tool: b.tool, arguments: b.arguments ?? {} }, ...(b.theorem ? { theorem: b.theorem } : {}) }) as { signed?: string | null }).signed
        return { same: again === b.proof!.signed, signature: b.proof!.signature ? c.verify(null, Buffer.from(b.proof!.signed), pk, Buffer.from(b.proof!.signature, 'base64')) : null, mac: b.proof!.mac && process.env.QPU_DATA_KEY ? c.createHmac('sha256', Buffer.from(c.hkdfSync('sha256', process.env.QPU_DATA_KEY, '', 'qpu proof mac', 32))).update(b.proof!.signed).digest('hex') === b.proof!.mac : null } })
      console.log(`${blocks.length} block(s), ${proved.length} with a proof: ${rows.filter((r) => r.same).length} recomputed equal, ${rows.filter((r) => r.signature === true).length} signatures verified with the public key alone, ${rows.filter((r) => r.mac === true).length} MACs verified with the secret, ${rows.filter((r) => r.signature === false || r.mac === false || !r.same).length} failed`) }
  }
  else if (action === 'leaks') { const dir = dirname(join(process.cwd(), (await runFiles()).receipt)), { readdirSync } = await import('node:fs'), { toolCallerOf } = await import('../src/quantum/mcp.ts'); const r = toolCallerOf('audit')({ leaks: { texts: Object.fromEntries(readdirSync(dir).filter((p) => /\.(md|json|ndjson|txt|xml|html)$/.test(p)).map((p) => [p, readFileSync(join(dir, p), 'utf8')])) } }) as { byKind: Record<string, number>; says: string }; console.log(r.says); console.log(JSON.stringify(r.byKind)) }
  else if (action === 'unexport' || action === 'rename') {
    // the type checker's own language service (the site's TypeScript, which exposes it) over the tree's tsconfig: never a text replace
    const ts = (await import('node:module')).default.createRequire(join(process.cwd(), 'site', 'package.json'))('typescript') as any, root = process.cwd()
    const conf = ts.parseJsonConfigFileContent(ts.readConfigFile(join(root, 'tsconfig.json'), ts.sys.readFile).config, ts.sys, root), versions = new Map<string, number>()
    const ls = ts.createLanguageService({ getScriptFileNames: () => conf.fileNames, getScriptVersion: (f: string) => String(versions.get(f) ?? 0), getScriptSnapshot: (f: string) => (ts.sys.fileExists(f) ? ts.ScriptSnapshot.fromString(ts.sys.readFile(f)) : undefined), getCurrentDirectory: () => root, getCompilationSettings: () => conf.options, getDefaultLibFileName: ts.getDefaultLibFilePath, fileExists: ts.sys.fileExists, readFile: ts.sys.readFile })
    const apply = (edits: { file: string; start: number; end: number; text: string }[]) => { const by = new Map<string, typeof edits>(); for (const e of edits) by.set(e.file, [...(by.get(e.file) ?? []), e]); for (const [f, es] of by) { let t = readFileSync(f, 'utf8'); for (const e of es.sort((a, b) => b.start - a.start)) t = t.slice(0, e.start) + e.text + t.slice(e.end); writeFileSync(f, t); versions.set(f, (versions.get(f) ?? 0) + 1) } return edits.length }
    // one rename, or a wave: --map <file> holding [file, from, to] rows, every one in this one language service; --record records renames already made
    if (action === 'rename') { const rows = (rest.includes('--map') ? JSON.parse(readFileSync(rest[rest.indexOf('--map') + 1] ?? '', 'utf8')) : [rest]) as string[][]
      for (const [file, from, to] of rest.includes('--record') ? [] : rows) { const f = join(root, file ?? ''), sf = ls.getProgram().getSourceFile(f); let at = -1; const walk = (n: any) => { if (at < 0 && n.name?.text === from) at = n.name.getStart(); ts.forEachChild(n, walk) }; if (sf) walk(sf)
      console.log(at < 0 ? `no declaration named ${from} in ${file}` : `renamed ${from} → ${to} at ${apply((ls.findRenameLocations(f, at, false, false) ?? []).map((l: any) => ({ file: l.fileName, start: l.textSpan.start, end: l.textSpan.start + l.textSpan.length, text: to })))} place(s)`) }
      // each rename recorded in Payload with its witness (the content address of its declaration's first line at the base commit, after the name)
      // and one wave that has many of them (links): the pre-commit rule pairs only what Payload holds and the diff agrees with
      if (!process.env.QPU_APP_KEY) { console.log('renames not recorded: no QPU_APP_KEY, so the pre-commit rule counts them as growth'); process.exit(0) }
      const { mcpClient } = await import('./mcp.ts'), { uuidOf } = await import('../src/quantum/blocks.ts'), m = mcpClient(), base = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), ids: string[] = []
      for (const [file, from, to] of rows) { const line = execFileSync('git', ['show', `${base}:${file}`], { encoding: 'utf8', maxBuffer: 1 << 28 }).split('\n').find((l) => new RegExp(`^(export )?(async )?(const|function) ${from}\\b`).test(l)); if (!line) continue
        const made = await m.call('createEntries', { kind: 'rename', from: 'machine', body: { file, from, to, base, rest: uuidOf(line.slice(line.indexOf(from) + from!.length)) } }), id = (m.docsOf(made.text ?? '')[0] as { id?: string } | undefined)?.id; if (id) ids.push(id) }
      const wave = await m.call('createEntries', { kind: 'rename-wave', from: 'machine', body: { base, renames: ids.length }, links: ids })
      console.log(wave.error ? `the wave was refused: ${String(wave.error).slice(0, 200)}` : `${ids.length} of ${rows.length} rename(s) recorded in Payload at ${base.slice(0, 9)}, one wave having many`) }
    else { const PUBLIC = /\/(blocks|mcp|roles)\.ts$|toolboxes\/payload\.ts$/, edits: { file: string; start: number; end: number; text: string }[] = []
      // a name a consumer outside the tsconfig imports (the docs site, the Payload app) stays exported: its import is its reference
      const kept = new Set(execFileSync('git', ['grep', '-h', '-o', '-E', "import \\{[^}]+\\} from '[./]+(src/quantum/)?[a-z/-]+\\.ts'", '--', join(dirname(dirname((await runFiles()).receipt)), '.vitepress'), ...LITERAL_ROOTS.filter((r) => r.startsWith('site'))], { encoding: 'utf8' }).split('\n').flatMap((l) => (l.match(/\{([^}]+)\}/)?.[1] ?? '').split(',').map((s) => s.trim().split(' as ')[0]!.replace(/^type /, ''))).filter(Boolean))
      for (const sf of ls.getProgram().getSourceFiles().filter((s: any) => s.fileName.startsWith(join(root, 'src', 'quantum')) && !/\.test\.ts$/.test(s.fileName) && !PUBLIC.test(s.fileName))) for (const st of sf.statements) {
        const mod = st.modifiers?.find((x: any) => x.kind === ts.SyntaxKind.ExportKeyword); if (!mod || st.modifiers.some((x: any) => x.kind === ts.SyntaxKind.DefaultKeyword)) continue
        const names = st.declarationList ? st.declarationList.declarations.map((d: any) => d.name) : st.name ? [st.name] : []
        if (names.length && names.every((n: any) => n.kind === ts.SyntaxKind.Identifier && !kept.has(n.text) && (ls.findReferences(sf.fileName, n.getStart()) ?? []).every((r: any) => r.references.every((x: any) => x.fileName === sf.fileName)))) edits.push({ file: sf.fileName, start: mod.getStart(), end: mod.getEnd() + 1, text: '' }) }
      console.log(`unexported ${apply(edits)} name(s) only their own file uses`) }
  }
  else if (action === 'receipt') { const r = getJson(join(process.cwd(), (await runFiles()).receipt)) as { head?: string; steps?: { name: string; status: string; tail: string }[] } | null, red = (r?.steps ?? []).filter((s) => s.status === 'red'); for (const s of red) console.log(`${s.name}: ${s.tail.split('\n').filter((l) => /✗|✖|rror/.test(l)).slice(0, 3).join(' | ')}`); console.log(`${r?.head}: ${red.length} red`) }
  else if (action === 'merge') { const file = flag('--message-file'), f = await mergeFlow(flag('--branch') ?? '', file ? readFileSync(file, 'utf8') : flag('-m'), process.cwd()); for (const x of [f.aside, f.merged, f.commit]) if (x) console.log(say(x)) }
  else if (action) { const file = flag('--message-file'), r = await runMachine({ action, confirm: rest.includes('--confirm'), message: file ? readFileSync(file, 'utf8') : flag('-m'), branch: flag('--branch') }, process.cwd()); console.log(say(r)) }
}
