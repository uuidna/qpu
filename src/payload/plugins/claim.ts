/**
 * THE COURT RULES ON A CLAIM. A claim is decided only by the source it names, and every other source is weak evidence.
 *
 *   verified    the named source's reading holds the expected value
 *   denied      the named source's reading holds a different value
 *   unverified  no named source answered, or none of its fields matched; the verdict names the next step
 *
 * The court always rules: "unverified" is a ruling with a reason. Sources and readings come in as functions, so the same
 * rule runs in the MCP tool, in the script, and in a test, over the same connector.
 */

export type Verdict = {
  at: string
  claim: string
  verdict: 'verified' | 'unverified'
  reason: string
  next?: string
  tried?: number
  answered?: number
}

export type Source = { source: string; args: Record<string, unknown> }
export type Reply = Record<string, unknown> | null
export type Reader = (source: string, args: Record<string, unknown>) => Promise<Reply>
export type Lister = () => Promise<Source[]>

type Row = { verdict: 'verified' | 'unverified'; where: string; value: string }

/** The claim's words that can name a field: longer than two characters, and not the expected value itself. */
export const wordsOf = (claim: string, expect: string): string[] =>
  [...new Set(claim.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && w !== expect.toLowerCase()))]

/** A reply that carries a reading, which is the only kind of reply the court can rule on. */
const readingOf = (reply: Reply): Record<string, unknown> | null => {
  if (!reply || reply.kind === 'failure' || reply.reading === undefined || typeof reply.reading !== 'object' || reply.reading === null) return null
  return reply.reading as Record<string, unknown>
}

/** Rule on a claim: ask every source, decide only from the sources the claim names, and report the rest as weak. */
export const verdictFromReplies = (claim: string, expect: string, sources: Source[], replies: Reply[]): Verdict => {
  const at = new Date().toISOString()
  // every prompt is a claim: one with no expected value cannot be checked, so it is recorded as an open lead
  if (expect.trim() === '') return { at, claim, verdict: 'unverified', reason: 'no expected value: recorded as an open lead, every claim stays open until a source verifies it', next: 'attach the value the claim expects, so a source can check it' }
  const lower = claim.toLowerCase()
  const words = wordsOf(claim, expect)
  const strong: Row[] = []
  const weak: Row[] = []
  let answered = 0
  replies.forEach((reply, i) => {
    const reading = readingOf(reply)
    if (!reading || !reply) return
    answered++
    const source = sources[i]!.source
    // a source is named when the claim names it, or one of its arguments (a family, a DOI, a repository)
    const named = lower.includes(source.toLowerCase()) || Object.values(sources[i]!.args).some((v) => typeof v === 'string' && v.length > 0 && lower.includes(v.toLowerCase()))
    for (const scope of [reply, reading]) {
      for (const [key, value] of Object.entries(scope)) {
        if (!words.some((w) => key.toLowerCase().includes(w))) continue
        const row: Row = { verdict: String(value).toLowerCase() === expect.toLowerCase() ? 'verified' : 'unverified', where: `${source} ${key}`, value: String(value) }
        ;(named ? strong : weak).push(row)
      }
    }
  })
  const tried = sources.length
  if (strong.length) {
    const verified = strong.find((r) => r.verdict === 'verified')
    if (verified) return { at, claim, verdict: 'verified', reason: `${verified.where} is ${expect}`, tried, answered }
    const seen = strong[0]!
    return { at, claim, verdict: 'unverified', reason: `${seen.where} is ${seen.value}, the claim says ${expect}`, next: 'correct the claim or name the source that holds the value', tried, answered }
  }
  if (weak.length) {
    return { at, claim, verdict: 'unverified', reason: `no source named in the claim answers; weak matches only: ${weak.slice(0, 3).map((w) => `${w.where}=${w.value}`).join(', ')}`, next: 'name the source the claim is about, or a field it carries', tried, answered }
  }
  return { at, claim, verdict: 'unverified', reason: `no source field matches ${words.join(', ')}; ${answered} of ${tried} answered`, next: 'name a source whose reading carries the claim field', tried, answered }
}

/** A case as the court reads it from schema.org markup: the claim, the value it expects, and the source that decides it. */
export type CaseSpec = { claim: string; expect: string; source?: string }

const microPropsOf = (html: string): Record<string, string> => {
  const out: Record<string, string> = {}
  for (const m of html.matchAll(/<([a-zA-Z0-9]+)\b[^>]*\bitemprop="([^"]+)"[^>]*>([^<]*)</g)) {
    const prop = m[2]!.trim()
    if (!(prop in out)) out[prop] = m[3]!.trim()
  }
  return out
}

/** The case a schema.org markup states: JSON-LD (name, value, source) or microdata (itemprop name, value, source). */
export const caseOf = (schema: unknown): CaseSpec | null => {
  const pick = (get: (k: string) => string | undefined): CaseSpec | null => {
    const claim = get('name') ?? get('claim') ?? get('about')
    const expect = get('value') ?? get('expect')
    if (!claim || expect === undefined) return null
    const source = get('source') ?? get('url')
    return { claim, expect, ...(source ? { source } : {}) }
  }
  if (typeof schema === 'string') {
    const props = microPropsOf(schema)
    return pick((k) => props[k])
  }
  if (schema && typeof schema === 'object') {
    const o = schema as Record<string, unknown>
    const str = (k: string) => (typeof o[k] === 'string' || typeof o[k] === 'number' || typeof o[k] === 'boolean' ? String(o[k]) : undefined)
    return pick(str)
  }
  return null
}

/** A free-text claim: every source is read, then the claim is ruled on from those readings. */
export const claimVerdictOf = async (claim: string, expect: string, list: Lister, read: Reader): Promise<Verdict> => {
  const sources = await list()
  const replies = await Promise.all(sources.map((s) => read(s.source, s.args).catch(() => null)))
  return verdictFromReplies(claim, expect, sources, replies)
}
