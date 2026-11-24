// The textbook's axioms, replaced by theorems. An example asserts constants (seven variants, 256 combinations, a UUID of 36
// characters); asserted, they are axioms of the textbook. Where the constants stand in an arithmetic relation of the model,
// the relation is a Lean theorem the kernel checks, and the example names its theorem. The theorems are written in Lean, in
// Qpu/General/Textbook.lean: the sentence and the examples are the theorem's inline doc. textbook-index.ts is rendered from
// that file (lake run index) and this module reads it; nothing here states a theorem.
import { PROSE, proseFill } from './prose-index.ts'
import { evaluate } from './expressions.ts'
import { TEXTBOOK_INDEX, type TextbookRow } from './textbook-index.ts'
type TextbookTheorem = TextbookRow
// a theorem's attributes (@[novelty]) mark it; its statement starts at the keyword
export const TEXTBOOK_THEOREMS: readonly TextbookTheorem[] = TEXTBOOK_INDEX.map((t) => ({ ...t, lean: t.lean.replace(/^@\[[^\]]*\]\s*/, '') }))
// Every theorem of the table reflected by the shape of its statement, generated beside it into Qpu/General/Textbook.lean and never assumed: an
// equality a = b over the naturals reflects to σ − b = σ − a for every σ (its symmetry and σ_σ at once), any other equality to b = a; an order
// a ≤ b to σ − b ≤ σ − a, since σ reverses order, and a < b to σ − b < σ − a wherever b ≤ σ; a conjunction part by part; a disjunction, an
// equivalence and a disequality by symmetry; an implication, stated or by hypotheses, by its contrapositive, which always holds, and its
// converse, proved by omega where no counterexample exists and the arithmetic is linear, refuted by a counterexample the kernel decides, or open.
type Reflection = { key: string; shape: string; lean: string[]; converse: 'proved' | 'refuted' | 'open' | null; counterexample: Record<string, string> | null }
/** The top-level parts of a statement split at an operator, outside every bracket and before any quantifier, whose scope runs to the end. */
const parts = (s: string, op: string): string[] => { const out: string[] = []; let d = 0, from = 0; for (let i = 0; i < s.length; i++) { const c = s[i]!; if ('(⟨[{'.includes(c)) d++; else if (')⟩]}'.includes(c)) d--; else if (d === 0 && op !== ':=' && '∀∃'.includes(c)) break; else if (d === 0 && s.startsWith(op, i)) { out.push(s.slice(from, i).trim()); from = i + op.length } } return [...out, s.slice(from).trim()] }
const parens = (s: string) => `(${s})`
/** A statement without the parentheses that wrap all of it. */
const bare = (s: string): string => { let d = 0; for (let i = 0; i < s.length && s[0] === '('; i++) if ('(⟨[{'.includes(s[i]!)) d++; else if (')⟩]}'.includes(s[i]!) && --d === 0) return i === s.length - 1 ? bare(s.slice(1, -1).trim()) : s; return s }
const proj = (x: string, k: number, n: number) => (n === 1 ? x : `${x}${'.2'.repeat(k)}${k < n - 1 ? '.1' : ''}`)
const reflection = (t: TextbookTheorem): Reflection => {
  const m = /^theorem\s+(\S+)\s*([\s\S]*)$/.exec(t.lean)!; let rest = m[2]!; const binders: { text: string; names: string[]; type: string; explicit: boolean }[] = []
  while (/^[({[]/.test(rest)) { let d = 0, i = 0; for (; i < rest.length; i++) { if ('({['.includes(rest[i]!)) d++; else if (')}]'.includes(rest[i]!) && --d === 0) break } const text = rest.slice(0, i + 1), c = text.indexOf(':'); binders.push({ text, names: text.slice(1, c).trim().split(/\s+/), type: text.slice(c + 1, -1).trim(), explicit: text[0] === '(' }); rest = rest.slice(i + 1).trimStart() }
  const prop = parts(rest.replace(/^:\s*/, () => ''), ':=')[0]!, args = binders.filter((b) => b.explicit).flatMap((b) => b.names), call = parens([m[1]!, ...args].join(' '))
  const vars = binders.filter((b) => b.type === 'Nat').flatMap((b) => b.names), env = Object.fromEntries(vars.map((v) => [v, 1n]))
  const kind = (e: string) => { try { return typeof evaluate(e, env).value } catch { return null } }
  const hyps = binders.filter((b) => b.type !== 'Nat'), arithmetic = binders.every((b) => b.explicit && (b.type === 'Nat' || kind(b.type) === 'boolean'))
  const extra: string[] = []
  const contra = (premises: string[], concl: string, f: (h: string) => string) => ({ s: `¬ ${parens(concl)} → ¬ ${parens(premises.map(parens).join(' ∧ '))}`, p: `fun hc hh => hc ${parens(f('hh'))}` })
  const applied = (proof: string, premises: string[]) => (h: string) => [proof, ...premises.map((_, k, a) => proj(h, k, a.length))].join(' ')
  // one statement by its shape, its proof given: a ∀ kept and applied, an implication by its contrapositive, a relation as above
  const part = (text: string, proof: string): { s: string; p: string } | null => {
    const t = bare(text), q = /^∀\s*((?:[A-Za-z_][\w']*\s*)+?)\s*(:[^,]*)?,\s*([\s\S]+)$/.exec(t), im = parts(t, '→')
    if (q) { const r = part(q[3]!, `(${proof} ${q[1]})`); return r && { s: `∀ ${q[1]}${q[2] ? ` ${q[2]}` : ''}, ${r.s}`, p: `fun ${q[1]} => ${r.p}` } }
    if (im.length > 1) return contra(im.slice(0, -1), im.at(-1)!, applied(proof, im.slice(0, -1)))
    for (const op of ['≠', '≤', '≥', '<', '>', '=']) {
      const ps = parts(t, op); if (ps.length !== 2) continue
      const [a, b] = ps.map(parens) as [string, string]
      if (op === '≠') return { s: `${b} ≠ ${a}`, p: `Ne.symm ${proof}` }
      if (kind(a) !== 'bigint' || kind(b) !== 'bigint') return op === '=' ? { s: `${b} = ${a}`, p: `Eq.symm ${proof}` } : null
      if (op === '=') return { s: `σ - ${b} = σ - ${a}`, p: `congrArg (σ - ·) (Eq.symm ${proof})` }
      const [lo, hi] = op === '≤' || op === '<' ? [a, b] : [b, a]
      if (op === '≤' || op === '≥') return { s: `σ - ${hi} ≤ σ - ${lo}`, p: `Nat.sub_le_sub_left ${proof} σ` }
      const h = `hσ${extra.length}`; extra.push(`(${h} : ${hi} ≤ σ)`)
      return { s: `σ - ${hi} < σ - ${lo}`, p: proseFill(PROSE.quantumProcessingTextbookTheorems_p1, proof, h, proof) }
    }
    return null
  }
  const conj = parts(prop, '∧'), disj = parts(prop, '∨'), iff = parts(prop, '↔'), impl = parts(prop, '→')
  const shape = /^∃/.test(prop) ? 'existential' : /^∀/.test(prop) ? 'universal' : impl.length > 1 ? 'implication' : iff.length === 2 ? 'equivalence' : conj.length > 1 ? 'conjunction' : disj.length > 1 ? 'disjunction' : /[≤≥<>]/.test(prop) && parts(prop, '=').length === 1 ? 'order' : 'equality'
  const r = shape === 'equivalence' ? { s: `${parens(iff[1]!)} ↔ ${parens(iff[0]!)}`, p: `Iff.symm ${call}` }
    : shape === 'disjunction' ? { s: `${parens(disj.slice(1).join(' ∨ '))} ∨ ${parens(disj[0]!)}`, p: `Or.symm ${call}` }
    : shape === 'conjunction' ? (() => { const rs = conj.map((c, k) => part(c, proj(call, k, conj.length))); return rs.every(Boolean) ? { s: rs.map((x) => parens(x!.s)).join(' ∧ '), p: `⟨${rs.map((x) => x!.p).join(', ')}⟩` } : null })()
    : shape === 'existential' ? null : part(prop, call)
  const lean: string[] = []
  const bind = (s: string) => [...binders.map((b) => b.text), ...(s.includes('σ') ? ['(σ : Nat)'] : []), ...extra].join(' ')
  if (r) lean.push(`theorem ${t.key}_reflected ${bind(r.s)} : ${r.s} := ${r.p}`)
  // an implication by hypotheses over the naturals: its contrapositive, and its converse decided
  const premises = shape === 'implication' ? impl.slice(0, -1) : hyps.map((h) => h.type), concl = shape === 'implication' ? impl.at(-1)! : prop
  if (!arithmetic || !premises.length || ![...premises, concl].every((e) => kind(e) === 'boolean')) return { key: t.key, shape, lean, converse: null, counterexample: null }
  const own = binders.filter((b) => b.type === 'Nat').map((b) => b.text).join(' '), hp = premises.map(parens).join(' ∧ ')
  if (shape !== 'implication') { const c = contra(premises, concl, (h) => [m[1]!, ...binders.flatMap((b) => (b.type === 'Nat' ? b.names : [proj(h, hyps.indexOf(b), hyps.length)]))].join(' ')); lean.push(`theorem ${t.key}_contrapositive ${own} : ${c.s} := ${c.p}`) }
  const lits = [...new Set([0n, 1n, 2n, 3n, ...(vars.length <= 3 ? [...`${hp} ${concl}`.matchAll(/\b\d+\b/g)].flatMap((x) => [BigInt(x[0]) - 1n, BigInt(x[0]), BigInt(x[0]) + 1n]) : [])].filter((x) => x >= 0n))]
  const holds = (e: string, at: Record<string, bigint>) => { try { return evaluate(e, at).value === true } catch { return false } }
  const search = (k: number, at: Record<string, bigint>): Record<string, bigint> | null => (k === vars.length ? (holds(concl, at) && !holds(hp, at) ? at : null) : lits.reduce<Record<string, bigint> | null>((f, x) => f ?? search(k + 1, { ...at, [vars[k]!]: x }), null))
  const found = search(0, {})
  // a converse refuted by a counterexample is that counterexample, decided here; a decide proof of it carries no textbook meaning, so no theorem is written
  if (found) return { key: t.key, shape, lean, converse: 'refuted', counterexample: Object.fromEntries(Object.entries(found).map(([k, v]) => [k, v.toString()])) }
  if (/([A-Za-z_][\w']*|\))\s*[*/%^]\s*[A-Za-z_(]|[\d)]\s*\^\s*[A-Za-z_(]/.test(`${hp} ${concl}`)) {
    // not linear: omega does not decide it, so the converse is open unless a proof is held for it, which the kernel checks like any other
    const proof = NONLINEAR_CONVERSES[t.key]
    if (!proof) return { key: t.key, shape, lean, converse: 'open', counterexample: null }
    lean.push(`theorem ${t.key}_converse ${own} : ${parens(concl)} → ${hp} := ${proof}`)
    return { key: t.key, shape, lean, converse: 'proved', counterexample: null }
  }
  lean.push(`theorem ${t.key}_converse ${own} : ${parens(concl)} → ${hp} := fun hc => ${premises.length > 1 ? `⟨${premises.map(() => 'by omega').join(', ')}⟩` : 'by omega'}`)
  return { key: t.key, shape, lean, converse: 'proved', counterexample: null }
}
/** The converses that are not linear arithmetic, each with the proof the kernel accepts. A converse of that kind without an entry stays open. */
const NONLINEAR_CONVERSES: Readonly<Record<string, string>> = {
  textbook_shards_cover: 'fun hc => Nat.lt_of_le_of_lt (Nat.zero_le _) hc',
  textbook_harmonic_default: 'fun hc => Nat.lt_of_le_of_lt (Nat.zero_le _) hc',
  textbook_compete_knows: 'fun hc => ⟨Nat.pos_of_ne_zero (fun h => by rw [h, Nat.zero_mul] at hc; exact Nat.lt_irrefl 0 hc), Nat.pos_of_ne_zero (fun h => by rw [h, Nat.mul_zero] at hc; exact Nat.lt_irrefl 0 hc)⟩',
  textbook_next_waves_ordered: 'fun hc => ⟨hc.1, hc.2.1, hc.2.2⟩',
}
let reflections: Reflection[] | undefined
/** Every textbook theorem reflected by its shape, once: the Lean each one generates, and its converse decided where it is an implication. */
export const listReflections = () => (reflections ??= TEXTBOOK_THEOREMS.map(reflection))
/** The reflections measured against the kernel's index: each generated theorem accepted or not, the converses decided, and per theorem the books
 *  of the sealed open-textbook catalogue (OpenStax, the Open Textbook Library, Open Library) that the sources step routed to it. */
export const getReflections = (kernel: ReadonlySet<string>, books: Readonly<Record<string, number>> = {}) => {
  const rows = listReflections().map((r) => ({ ...r, names: r.lean.map((l) => /^theorem (\S+)/.exec(l)![1]!), books: books[r.key] ?? 0 }))
  const count = (suffix: string) => ({ generated: rows.filter((r) => r.names.includes(r.key + suffix)).length, accepted: rows.filter((r) => kernel.has(r.key + suffix)).length })
  const generated = rows.reduce((n, r) => n + r.names.length, 0), accepted = rows.reduce((n, r) => n + r.names.filter((k) => kernel.has(k)).length, 0)
  const reflected = count('_reflected'), converse = (s: string) => rows.filter((r) => r.converse === s).length, cited = rows.filter((r) => r.books > 0)
  return { theorems: rows.length, reflected: reflected.accepted, unreflected: rows.filter((r) => !kernel.has(`${r.key}_reflected`)).map((r) => r.key), contrapositives: count('_contrapositive'), converses: { total: rows.filter((r) => r.converse).length, proved: converse('proved'), refuted: converse('refuted'), open: converse('open'), accepted: count('_converse').accepted }, generated, accepted, byShape: rows.reduce<Record<string, number>>((a, r) => ({ ...a, [r.shape]: (a[r.shape] ?? 0) + 1 }), {}), books: { cited: cited.length, routed: cited.reduce((n, r) => n + r.books, 0), stated: 0 }, rows: rows.map(({ lean: _, ...r }) => r), theorem: 'textbook_reflection_by_shape', says: proseFill(PROSE.quantumProcessingTextbookTheorems_says2, reflected.accepted, rows.length, converse('proved'), converse('refuted'), converse('open'), accepted, generated, cited.length) }
}
/**
 * Full-text search over textbook theorems: each theorem is a real scenario whose `says` uses respected terminology
 * (not Clay axiom names), so a query matching that prose returns the usable programs — the examples that replay it
 * (tool + arguments). The theorem key itself is searchable terminology too. Pure.
 */
export const searchTextbookPrograms = (
  query: string,
  examples: readonly { id: string; tool: string; arguments: unknown; theorem?: string | null; shows?: string }[] = [],
) => {
  const tokens = [...new Set(query.toLowerCase().match(/[\p{L}\p{N}]{2,}/gu) ?? [])]
  const byId = new Map(examples.map((e) => [e.id, e]))
  const score = (t: TextbookTheorem) => {
    const hay = `${t.key.replace(/_/g, ' ')} ${t.says}`.toLowerCase()
    if (tokens.length === 0) return 0
    let n = 0
    for (const tok of tokens) if (hay.includes(tok)) n += 1
    return n
  }
  const hits = TEXTBOOK_THEOREMS.map((t) => {
    const n = score(t)
    if (n === 0) return null
    const programs = t.examples.flatMap((id) => {
      const ex = byId.get(id) ?? examples.find((e) => e.theorem === t.key && e.id === id)
      if (!ex) return []
      return [{ example: ex.id, tool: ex.tool, arguments: ex.arguments as Record<string, unknown>, shows: ex.shows ?? null }]
    })
    return {
      theorem: t.key,
      says: t.says,
      score: n,
      matched: tokens.filter((tok) => `${t.key.replace(/_/g, ' ')} ${t.says}`.toLowerCase().includes(tok)),
      examples: t.examples,
      programs,
      usable: programs.length > 0,
    }
  }).filter((h): h is NonNullable<typeof h> => h !== null).sort((a, b) => b.score - a.score || a.theorem.localeCompare(b.theorem))
  const usable = hits.filter((h) => h.usable)
  const programs = usable.flatMap((h) => h.programs.map((p) => ({ theorem: h.theorem, ...p })))
  const holds = tokens.length > 0
    ? hits.length === 0 || (usable.length > 0 && programs.every((p) => typeof p.tool === 'string' && p.tool.length > 0 && p.arguments !== undefined))
    : true
  return {
    phase: 'search' as const,
    via: 'textbook' as const,
    query,
    tokens,
    theorems: hits.length,
    usable: usable.length,
    programs: programs.length,
    holds,
    hits,
    programsList: programs,
    theorem: 'textbook_search_proven' as const,
    says: holds
      ? (hits.length === 0
        ? proseFill(PROSE.quantumProcessingTextbookTheorems_s3, JSON.stringify(query))
        : proseFill(PROSE.quantumProcessingTextbookTheorems_s4, usable.length, hits.length, programs.length))
      : PROSE.quantumProcessingTextbookTheorems_s5,
  }
}

/** A sentence made safe inside a Lean doc comment: Lean block comments nest, so an opening /- or a closing -/ in the prose would open or end one early; both are parted by a space. */
export const escapeLeanDoc = (s: string) => s.replace(/\/-/g, '/ -').replace(/-\//g, '- /')

// proven: serveMcp GET POST OPTIONS — the package's own Streamable-HTTP transport (serveMcp) and the /api/mcp route handlers (GET, POST, OPTIONS) that delegate to it, exercised by src/quantum/net/mcp-http_test.ts: it frames tools/list, answers a notification with 202, and prices a paid tools/call by the qubits it uses below the fused quantum market floor.
// proven (slice lies-merges): entryText (textbook_entry_canonical), typeOk (moved, one check for the site's examples, payload-site, and the qpu block's save), tree and witness (textbook_e2e_tree_dissent) — the one canonical addressing and the tree's recomputed copy.
// proven: the crypto primitives backing seal/attest/verify — merkleLeafHash merkleRoot merkleProof merkleVerify pbkdf2Sha256 hkdfExtract hkdfExpand sha3_256 sha3_512 shake128 shake256 aes256gcmEncrypt aes256gcmDecrypt x25519 chacha20poly1305Encrypt sha1 md5 rsaModPow — and the unit address resolver — QPU_ORIGIN QPU_APEX QPU_LEAN RESERVED_SEGMENTS tenantAddress isUnscoped — are exercised by the seal, attest, verify and payload examples and their theorems.
// proven: sealLeavesSplit — the program-leaf seal split by UUID over worker threads, rows rejoined in list order, exercised by src/quantum/uuid/programs/index.test.ts, which recomputes a leaf in-thread and requires it equal to its worker's row before the neighbour audit reads the split; the audit, the gate and every synchronous door keep the serial sealLeaves, so a door's answer never becomes a promise.
// proven: lanesNow — the runner's lanes read from node:os (cores scaled by the share of memory free), exercised by src/quantum/processing/machine-run.test.ts, which checks the live value lies between one and the cores, the bounds the kernel proves as Supremacy.lanes_pos and Supremacy.lanes_le_cores.
// proven: UI_TOKENS — the design tokens the MCP Apps view (mcp-apps.ts ui) declares as custom properties, moved out of the payload toolbox with ui, MCP_APPS and build, exercised by src/quantum/processing/reflection_test.ts, which requires every tool's widget to carry --qpu-accent and --qpu-c, and by the audit's css-vars check on every example.
// proven: quantumTerm — the ISO/IEC 4879:2024 term an address picks with the program's amplitudes, the quantum envelope of a google tools/call (_meta.quantum) in place of the Payload page and website gate, exercised by src/quantum/processing/mcp_test.ts on the repositories call.
// proven: closedOf — the closed instance a general textbook theorem's kernel-checked example states, read by the evaluator, the prose audit and the schema dimensions, exercised by src/quantum/processing/textbook_test.ts (the Queneau evaluation and the measured examples) and the audit's textbook-evaluate and textbook-prose examples.
// proven: callPriceUsd x402Of — x402 through Cloudflare's Agents SDK (net/mcp-http.ts: withX402 and paidTool over the kernel's own tools, a call priced at what quantum providers charge, the cheapest real call on the market, a wallet that is not an EVM address refused), exercised by src/quantum/net/mcp-http_test.ts (the x402 v2 PAYMENT_REQUIRED challenge at the derived price, the refused wallet).
// proven: DONATION — the donation request of a host that names no x402 wallet (net/mcp-http.ts: the address written once, carried in each free answer's _meta.donation and once in the instructions, and read by scripts/doiRecord.ts into the record Zenodo archives with each release), exercised by src/quantum/net/mcp-http_test.ts (a free answer asks for a donation beside the kernel's answer, once in the instructions, and a paid answer asks for none).
// proven: solved complying title markdown above receipt hardware HARDWARE_MARK htmlWithHardware page beforeHardware — the one text and its build receipt (scripts/oneText.ts: the Google Quantum AI challenges solved and those complying in full, the title, the Markdown and the text above the rule that the receipt addresses, the hardware receipt after HARDWARE_MARK, the HTML with it for the Zenodo record, the page every Markdown copy is, and beforeHardware, the part lake run check compares), exercised by src/quantum/processing/receipt_test.ts (the receipt is the address and the SHA-256 of the one text, every copy carries it above its rule, and initialize welcomes with it while verify decides the text the resource serves).
// proven: pqc kemRound dsaRound — post-quantum cryptography computed (crypto/pqc.ts over @noble/post-quantum: X-Wing and ML-KEM-512/768/1024 of FIPS 203, ML-DSA-44/65/87 of FIPS 204, SLH-DSA-SHA2-128s/128f/192s/256s of FIPS 205, and the classical Ed25519 of RFC 8032 and ECDSA P-256 of FIPS 186-5 over @noble/curves, the secret key derived from a seed the caller keeps), exercised by src/quantum/processing/crypto/pqc_test.ts (X-Wing and ML-DSA round-trip, a changed message or another seed is refused), the seal-pqc-xwing, seal-kem, seal-sign, seal-slh, seal-ed25519, seal-ecdsa and seal-block-sign-ml-dsa-44 examples and the FIPS 186-5/203/204/205 rows of seal-nist-reverse-cern.
// proven: LIMITS MESSAGING_TOOLS isMessagingTool messageAddress callMessaging — qpu rooms (net/messaging.ts): send and receive over /api/mcp, registered on the Agents SDK server where the Worker binds the Mailbox Durable Object, each room 256 random bits (128 against Grover), its messages in order with their content addresses and bounds, exercised by src/quantum/net/messaging_test.ts (order, a reader's view, resuming after a sequence number, the address a send answers, the 256-bit room and a refused UUID, the bounds and the per-minute share) and end to end through wrangler dev.
// proven: googleCall measureGoogle GOOGLE_DOOR — the one Google door (toolboxes/google.ts google { challenges | call | measured | workspace }), moved out of the payload toolbox: the 14 Google challenges solved and sealed, a Google call validated against its Discovery document, the Google pages, calls and keys measured, exercised by src/quantum/processing/google-challenges_test.ts and the examples google-call-validated, google-call-endpoint, google-call-refused, google-measured and google-workspace-*.
// proven: MCP_PATHS isMcp — an agent harness pointed at the domain, /mcp or /api/mcp (net/mcp-http.ts): the Worker routes an MCP request there and a browser's page request to the site, every origin served, exercised by src/quantum/net/mcp-http_test.ts (initialize, list and call at each path, a browser at / and /mcp gets the site, a cross-origin client is served) and through wrangler dev.
// proven: mcpServer listGaps — the one MCP SDK server over the kernel (net/mcp-http.ts mcpServer), served by the Worker over Streamable HTTP and by scripts/stdio.ts over serveStdio, exercised by src/quantum/processing/stdio_test.ts, which starts the command and initializes, lists every tool and calls one; and the gaps of the library Lean's own library search finds (processing/gaps.ts listGaps over gaps-index.ts, which lake run gaps writes), exercised by the textbook-gaps example: every conjunct of textbook_div_zero is a library theorem
// proven: PROVER_LIMITS PROVER_TOOLS ProverNamespace callProver Prover — Lean with Mathlib behind the Worker: the lean tool (net/prover.ts) checks a source out of bounds before the container is reached and seals each verdict by its content, served over MCP where the Worker binds PROVER (net/mcp-http.ts); the Prover Durable Object (net/prover-object.ts) starts the Alpine prover image with no internet and forwards to alpine/prover-server.ts, which returns Lean's own verdict with its messages and stops a check at its limit; exercised by src/quantum/net/prover_test.ts against a recording prover, through serveMcp, and against this checkout's Lean
// proven: OPEN_CLAIMS — every claim no theorem proves, written by Lean from Qpu.openClaims into theorems-index.ts (lean/tools/Theorems.lean), read by the status generator (textbook { scripts: { status: true } }), which writes src/quantum/STATUS.md from the google, clay and algorithm doors and answers holds false on any regression, so the status:gen step of every commit exercises it
// proven: receiptOf messageReceipt NOVELTIES — every certified result sealed as a quantum receipt (uuid/programs receiptOf: kind and canonical text addressed by uuid, the first eight hex digits a program placed in the tree, sealed when indexed and valid): a message as it is sent and read (net/messaging.ts messageReceipt, exercised by messaging_test.ts), a Lean verdict (net/prover.ts, prover_test.ts), the gaps of the library (gaps.ts, the textbook-gaps example), each factoring result, each novelty Lean lists in NOVELTIES (lean/tools/Theorems.lean) and the status itself (the status:gen step of every commit)
// proven: sealSettlement — a paid answer whose x402 settlement is sealed as a quantum receipt the moment the Agents SDK writes x402/payment-response into its _meta (net/mcp-http.ts), exercised by src/quantum/net/mcp-http_test.ts, which runs the two statements agents/x402 runs after settling and finds the sealed receipt beside the settlement
// proven: FACTOR_CERTIFICATES searchFactors DEPLOYED_ATTEMPTS DEPLOYED_WAIT_MS createDeployedRequests judgeDeployed — the factoring kept as a certificate and the gate after a deploy (src/quantum/processing/algorithms.ts: FACTOR_CERTIFICATES holds the factors of 2^999 + 1 that searchFactors found, taken by listFactors only when each is prime and they multiply back; src/quantum/processing/deployed.ts: createDeployedRequests plans Lean both ways, both selftest doors and the audit shares, judgeDeployed judges the answers and asks a cold prover again up to DEPLOYED_ATTEMPTS times, DEPLOYED_WAIT_MS apart), exercised by src/quantum/processing/algorithms_test.ts (the certificate is the list the search itself finds, and it answers within a request's time) and src/quantum/processing/deployed_test.ts (the answers the live server gave on 2026-11-24 do not pass, the right ones do, a starting prover is asked again with the reason, and the runner exits by whether the gate holds)
// proven: ERROR_KINDS refusalOf codeOfThrown thrownText ALTERNATIVES findAmbiguity BOUND_TOOLS NOT_IDEMPOTENT KERNEL_STATE OUTPUTS INPUT_EXAMPLES — the contract a client reads from tools/list alone (src/quantum/processing/contract.ts: ERROR_KINDS gives every refusal code its kind and refusalOf the one shape, codeOfThrown and thrownText tell arguments at fault from the code's own fault, ALTERNATIVES and findAmbiguity refuse alternatives named together, BOUND_TOOLS counts the tools the Worker binds, NOT_IDEMPOTENT and KERNEL_STATE say what a second call answers and what is written; src/quantum/processing/outputs-index.ts: OUTPUTS and INPUT_EXAMPLES, the output schema and input example the worked examples witness), exercised by src/quantum/net/contract_test.ts (whole sentences and an output schema on every tool, the generated index equal to what the examples answer today, alternatives refused by name while every worked example passes, idempotent tools equal across two processes, leads in pages, one list of codes, one count of tools and one version, plain JSON for a client that accepts JSON alone)
