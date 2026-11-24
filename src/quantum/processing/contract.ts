// The contract a client reads from tools/list alone, stated once: the codes a refusal carries and the kind each belongs to, the inputs of a
// tool that are alternatives and what each combines with, and what a call may be relied on for (whether asking twice answers the same).
// The handler (mcp.ts) and the Worker (net/) read these; the tests hold them against the code and the worked examples.
import { PROSE, proseFill } from './prose-index.ts'

/** Every code a refusal carries, with its kind: what a client may do about it. validation: fix the arguments. role: claim a role that may.
 *  limit: wait and ask again. upstream: something this server depends on failed; asking again may help. internal: the server's own fault. */
export const ERROR_KINDS = {
  invalid_params: 'validation', ambiguous_arguments: 'validation', not_found: 'validation',
  refused: 'role',
  limit_reached: 'limit', prover_busy: 'limit', time_limit: 'limit',
  upstream_failed: 'upstream', prover_failed: 'upstream', prover_unavailable: 'upstream',
  internal_error: 'internal',
} as const
export type ErrorCode = keyof typeof ERROR_KINDS
/** A refusal in the one shape every door gives it. */
export const refusalOf = (code: ErrorCode, error: string, more: Record<string, unknown> = {}) => ({ error, code, kind: ERROR_KINDS[code], ...more })
/** A tool's answer as MCP carries it: the structured content, and the same as text. */
export const toolAnswer = (structured: Record<string, unknown>, isError = false) => ({ content: [{ type: 'text' as const, text: JSON.stringify(structured) }], structuredContent: structured, isError })
/** A thrown error's code: a tool rejects arguments by throwing an Error; a TypeError or ReferenceError is the code's own fault. */
export const codeOfThrown = (error: unknown): ErrorCode => (error instanceof TypeError || error instanceof ReferenceError ? 'internal_error' : 'invalid_params')
export const thrownText = (error: unknown): string => { const text = error instanceof Error ? error.message : String(error); return codeOfThrown(error) === 'internal_error' ? proseFill(PROSE.quantumProcessingContract_internal, text) : text }

type Alternative = { /** the inputs that select this alternative; where there are several they are one alternative and may come together */ keys: readonly string[]; /** the inputs it reads beside them */ with?: readonly string[] }
/** The tools whose inputs are alternatives: a call names one, with only the inputs it combines with. Each list mirrors the tool's own branches,
 *  and is as wide as the worked examples: where an example passes text beside an alternative that does not read it, text is listed beside it. */
export const ALTERNATIVES: Readonly<Record<string, readonly Alternative[]>> = {
  fold: [
    { keys: ['superpositions'] }, { keys: ['qubits'] }, { keys: ['exchange'] }, { keys: ['organise'] }, { keys: ['coins'] }, { keys: ['proven'] }, { keys: ['integers'] }, { keys: ['split'] },
    { keys: ['dna'], with: ['query'] }, { keys: ['reflect'] }, { keys: ['speak'] }, { keys: ['harmonic'] }, { keys: ['decode'] }, { keys: ['combinatorics'] }, { keys: ['spaces'] },
    { keys: ['rosetta'], with: ['order', 'index'] }, { keys: ['radices'], with: ['digits', 'index'] }, { keys: ['hex'] }, { keys: ['neighbours'] }, { keys: ['next'] },
    { keys: ['navigate'], with: ['query'] }, { keys: ['uuids'], with: ['query'] }, { keys: ['pieces'], with: ['root', 'withPieces'] }, { keys: ['text'], with: ['bound', 'key', 'withPieces'] },
  ],
  seal: [
    { keys: ['token'] }, { keys: ['nist'] }, { keys: ['aead'], with: ['text'] }, { keys: ['x25519'] }, { keys: ['pbkdf2'] }, { keys: ['receipts'] }, { keys: ['merkle'] }, { keys: ['witnesses'] }, { keys: ['pqc'] }, { keys: ['kem'] },
    { keys: ['slh'], with: ['text'] }, { keys: ['ed25519'], with: ['text'] }, { keys: ['constants'], with: ['text'] }, { keys: ['texts'], with: ['brief'] }, { keys: ['gltf'], with: ['text'] }, { keys: ['artifacts'], with: ['text'] }, { keys: ['tamper'], with: ['text'] },
    { keys: ['text'], with: ['brief', 'fips180', 'sha3', 'shake', 'ecdsa', 'entropy', 'key', 'sign', 'referer'] },
  ],
  verify: [
    { keys: ['numerology'] }, { keys: ['move'] }, { keys: ['theorem', 'call'] }, { keys: ['witnesses'] }, { keys: ['scan'] }, { keys: ['uuid'], with: ['content', 'prev', 'self', 'next'] },
  ],
}
/** Inputs every tool reads beside any alternative. */
const FREE = new Set(['selftest', 'records', 'lead'])

/** Why a call is ambiguous, or null: two alternatives named at once, or an input beside an alternative it does not combine with. Inputs the
 *  tool's schema does not name are not judged here. */
export const findAmbiguity = (tool: string, args: Readonly<Record<string, unknown>>): string | null => {
  const alternatives = ALTERNATIVES[tool]
  if (!alternatives) return null
  const given = Object.keys(args).filter((k) => args[k] !== undefined && !FREE.has(k))
  const named = alternatives.filter((a) => a.keys.some((k) => given.includes(k)))
  // an input that selects one alternative and is read beside another (text beside slh) is no second alternative
  const chosen = named.filter((a) => !named.some((b) => b !== a && a.keys.every((k) => !given.includes(k) || (b.with ?? []).includes(k))))
  if (chosen.length > 1) return proseFill(PROSE.quantumProcessingContract_ambiguous, tool, chosen.length, chosen.map((a) => a.keys.filter((k) => given.includes(k)).join(' + ')).join(', '))
  const one = chosen[0]
  if (!one) return null
  const known = new Set(alternatives.flatMap((a) => [...a.keys, ...(a.with ?? [])]))
  const stray = given.find((k) => known.has(k) && !one.keys.includes(k) && !(one.with ?? []).includes(k))
  if (stray === undefined) return null
  return proseFill(PROSE.quantumProcessingContract_stray, tool, stray, one.keys.filter((k) => given.includes(k)).join(' + '), alternatives.filter((a) => (a.with ?? []).includes(stray)).map((a) => a.keys.join(' or ')).join(', '))
}

/** The tools the Worker serves beside the kernel's, where it binds its rooms and its Lean prover (net/messaging.ts, net/prover.ts): the kernel
 *  counts them from here, so metrics, the README and tools/list state one number. */
export const BOUND_TOOLS = ['send', 'receive', 'lean'] as const

/** The tools whose answer to the same arguments may differ between calls, each with why; every other kernel tool is a function of its arguments. */
export const NOT_IDEMPOTENT: Readonly<Record<string, string>> = {
  seal: PROSE.quantumProcessingContract_fresh,
  ...Object.fromEntries(['audit', 'e2e', 'imagine', 'jsonld', 'legal', 'metrics', 'repository'].map((tool) => [tool, PROSE.quantumProcessingContract_clock])),
}
/** What a kernel tool writes: nothing that outlives the call. The Worker's send is the one tool that writes durably and says so itself. */
export const KERNEL_STATE = { writes: false, says: PROSE.quantumProcessingContract_state } as const
