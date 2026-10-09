// Cooled out of index.ts by the heat family (scripts/cool.mjs): qpuEncryptOf, qpuCybersecurityOf, qpuCybersecurityToolsOf.
import {
  coins,
  cryptoClaimOf,
  cryptoReadingOf,
  cryptoToolNames,
  found,
  mintOf,
  n,
  onceOf,
  qpuCapacityHolds,
  qpuEncryptHolds,
  qpuEvidenceHolds,
  qpuEvidenceOf,
  qpuPurposeHolds,
  qpuPurposeOf,
  qpuRaidHolds,
  qpuRaidOf,
  qpuSequenceHolds,
  qpuSequenceOf,
  qpuSubManOf,
  seed,
  shorArgsOf,
  shorCountBits,
  shorDefaultsOf,
  shorFactorOf,
  theorem,
  unit,
} from './index.js'
import type { QpuSubTool } from './index.js'
import { qpuLeanOf, qpuLeanHolds } from './proof.js'
import { qpuShorTryOf, qpuShorOf, qpuShorHolds } from './shor.js'
import { qpuFacesOf, qpuCapacityOf } from './lattice.js'

/**
 * The split identity of theorem crypto: fused = split x share, recomputed; secrecy is reported false (it is an identity, not a cipher).
 * @wing crypto
 * @kind builder
 * @evidence qpuEncryptHolds
 */
export const qpuEncryptOf = onceOf(() => {
  const capacity = qpuCapacityOf()
  const crypt = capacity.crypt
  const modulus = qpuFacesOf().rays * (n * n + n + seed)
  const publicKey = crypt.fused
  const ciphertext = crypt.split * crypt.share
  /** identity READ from the run: split * share lands on the independently computed fused. theorem crypto. */
  const identity = ciphertext === crypt.fused && crypt.holds && crypt.theorem === 'crypto'
  /** secrecy READ from the run: a ciphertext equal to the public key hides nothing. This is not encryption. */
  const secrecy = ciphertext !== publicKey
  const holds =
    identity &&
    secrecy === false &&
    crypt.split === capacity.faces &&
    crypt.share === capacity.kv.amplitudes &&
    crypt.fused === capacity.fused &&
    ciphertext !== modulus
  return {
    kind: 'encrypt' as const,
    theorem: 'crypto' as const,
    identity,
    secrecy,
    public: publicKey,
    ciphertext,
    split: crypt.split,
    share: crypt.share,
    fused: crypt.fused,
    modulus,
    holds,
  }
})

/**
 * The cybersecurity door set: Shor on 91, RSA factoring, the encrypt identity, crypt split and RAID, with what each verifies.
 * @wing crypto
 * @kind builder
 * @evidence qpuCybersecurityHolds
 */
export const qpuCybersecurityOf = onceOf(() => {
  const shor = qpuShorOf()
  const capacity = qpuCapacityOf()
  const raid = qpuRaidOf()
  const purpose = qpuPurposeOf()
  const evidence = qpuEvidenceOf()
  const lean = qpuLeanOf()
  const sequence = qpuSequenceOf()
  const pairs = [
    [3, 5],
    [3, 7],
    [3, 11],
    [5, 7],
    [3, 13],
    [3, 17],
    [5, 11],
    [3, 19],
    [5, 13],
    [3, 23],
    [7, 11],
    [5, 17],
    [3, 29],
    [7, 13],
  ] as const
  const table = pairs.map(([p, q]) => ({ p, q, product: p * q, modulus: p * q, rsa: true as const, holds: p > seed && q > seed }))
  const rsa = {
    kind: 'rsa' as const,
    cryptosystem: 'rsa' as const,
    modulus: shor.n,
    public: { n: shor.n },
    factored: shor.rsa.factored,
    factors: shor.factors,
    table,
    payload: shor.payload,
    unlocked: shor.unlocked,
    lock: shor.lock,
    holds: shor.rsa.holds && table.length === qpuFacesOf().faces && table.every((row) => row.holds && row.p * row.q === row.modulus) && shor.unlocked === true,
  }
  const encrypt = qpuEncryptOf()
  const crypto = [...lean.rows, ...lean.cover].find((r) => r.heading === 'crypto')
  const shorRow = [...lean.rows, ...lean.cover].find((r) => r.heading === 'shor')
  const tools = cryptoToolNames
  const holds =
    qpuShorHolds(shor) &&
    qpuCapacityHolds(capacity) &&
    qpuRaidHolds(raid) &&
    qpuPurposeHolds(purpose) &&
    qpuEvidenceHolds(evidence) &&
    qpuSequenceHolds(sequence) &&
    qpuLeanHolds(lean) &&
    capacity.crypt.holds &&
    capacity.crypt.kind === 'crypto' &&
    raid.cluster.security === 'crypt' &&
    evidence.verify.crypt === true &&
    purpose.cybersecurity.holds &&
    purpose.cybersecurity.sealed === false &&
    purpose.cybersecurity.morph === true &&
    purpose.cybersecurity.tools.length === mintOf(n) &&
    tools.length === mintOf(n) &&
    rsa.holds &&
    rsa.kind === 'rsa' &&
    encrypt.holds &&
    qpuEncryptHolds(encrypt) &&
    table.length === qpuFacesOf().faces &&
    table.every((row) => row.holds && row.rsa === true) &&
    table[qpuFacesOf().faces - seed]!.p * table[qpuFacesOf().faces - seed]!.q === shor.n &&
    crypto?.holds === true &&
    shorRow?.holds === true &&
    sequence.rungs.every((row, k) => row.cybersecurity === tools[k])
  return {
    kind: 'cybersecurity' as const,
    theorem: 'crypto' as const,
    shor,
    rsa,
    encrypt,
    crypt: capacity.crypt,
    raid: { security: raid.cluster.security, holds: raid.cluster.security === 'crypt' },
    verify: evidence.verify,
    purpose: purpose.cybersecurity,
    table,
    tools,
    listed: true as const,
    morph: true as const,
    sealed: false as const,
    holds,
  }
})

/**
 * The eight cybersecurity MCP tools (catalog, rsa, shor, cmodexp, iqft, shots, split, verify) with their man pages and handlers.
 * @wing crypto
 * @kind builder
 */
export const qpuCybersecurityToolsOf = (): QpuSubTool[] => {
  const href = `${unit.origin}/mcp`
  const see = cryptoToolNames
  const schema = { type: 'object', properties: { man: { type: 'boolean' } } }
  const defaults = shorDefaultsOf()
  const shorSchema = {
    type: 'object',
    properties: {
      man: { type: 'boolean' },
      n: { type: ['integer', 'string'], description: `Modulus to factor. Default ${defaults.modulus}. Work register bits(n) qubits, counting register ${shorCountBits}; no cap — the state is sparse and exact for any n. The counting register of ${shorCountBits} qubits recovers a period only when it divides ${mintOf(shorCountBits)}; every other coprime run recovers nothing and says so in classical.resolvable, and a base sharing a factor with n is factored by gcd, not by period. The reach is of the state, not of period-finding. Past 2^53 send n as a string of digits; \`read\` says how each argument was taken and \`exact\` carries every value as decimal text.` },
      a: { type: ['integer', 'string'], description: `Base. Default ${defaults.base}. A base sharing a factor with n hands it over as Shor's first step.` }}}
  const named = `{ n, a } name the modulus and base; the run is theirs, whatever they are. Default ${defaults.modulus} and ${defaults.base}. Counting register ${shorCountBits}: a period is recovered only when it divides ${mintOf(shorCountBits)}, every other coprime run recovers nothing (classical.resolvable), and a shared factor is found by gcd, not by period. The reach is of the state, not of period-finding.`
  /** What a caller is shown: the run's numbers while they are exact as numbers, the decimal strings from `exact` once
   * they would round (past 2^53) or overflow (past 2^1024). Never a null where a number was asked for. */
  const shownOf = (shor: ReturnType<typeof qpuShorOf>) => {
    const e = shor.exact
    const safe = e.safe
    return {
      n: safe ? shor.n : e.n,
      a: safe ? shor.a : e.a,
      factors: safe ? shor.factors : { ...shor.factors, p: e.p, q: e.q, product: e.product },
      rsa: safe ? shor.rsa : { ...shor.rsa, modulus: e.n, p: e.p, q: e.q, product: e.product },
    }
  }
  const morph = 'In tools/list. Morph. Not a ninth sealed tool. No auth.'
  const factoring = `${morph} theorem shor. ${shorFactorOf()}. p * q = N.`
  const encrypt = `${morph} theorem crypto. ${cryptoClaimOf()}. fused = split * share.`
  const both = `${morph} theorem shor. ${shorFactorOf()}. theorem crypto. ${cryptoClaimOf()}.`
  return [
    {
      name: see[n - n],
      description: 'theorem shor. theorem crypto.',
      man: qpuSubManOf(see[n - n], cryptoReadingOf().catalog, both, href, see.filter((s) => s !== see[n - n])),
      inputSchema: schema,
      run: () => qpuCybersecurityOf()},
    {
      name: see[seed],
      description: `theorem shor. ${shorFactorOf()}.`,
      man: qpuSubManOf(see[seed], cryptoReadingOf().shor!, `${factoring} Coprime base. ${named}`, href, see.filter((s) => s !== see[seed])),
      inputSchema: shorSchema,
      run: (a: Record<string, unknown>) => {
        const shor = qpuShorTryOf(a)
        const shown = shownOf(shor)
        return {
          kind: 'shor' as const,
          n: shown.n,
          a: shown.a,
          read: shor.read,
          coprime: shor.coprime,
          exact: shor.exact,
          device: shor.device,
          circuitry: { kind: shor.circuitry.kind, qubits: shor.circuitry.qubits, work: shor.circuitry.work, counting: shor.circuitry.counting, dim: shor.circuitry.dim, holds: shor.circuitry.holds },
          prepare: shor.prepare,
          qft: shor.qft,
          measure: shor.measure,
          post: shor.post,
          classical: shor.classical,
          factors: shown.factors,
          rsa: shown.rsa,
          holds: shor.holds,
        }
      }},
    {
      name: see[coins],
      description: `theorem shor. ${shorFactorOf()}.`,
      man: qpuSubManOf(see[coins], cryptoReadingOf().cmodexp!, `${factoring} Native h cnot. Compiled x swap csdg cmodexp. ${named}`, href, see.filter((s) => s !== see[coins])),
      inputSchema: shorSchema,
      run: (a: Record<string, unknown>) => {
        const shor = qpuShorTryOf(a)
        const shown = shownOf(shor)
        return { kind: 'cmodexp' as const, circuitry: shor.circuitry, exact: shor.exact, read: shor.read, rsa: { kind: 'rsa' as const, modulus: shown.n, a: shown.a, factored: shor.rsa.factored }, holds: shor.circuitry.holds && shor.read.holds }
      }},
    {
      name: see[n],
      description: `theorem shor. ${shorFactorOf()}.`,
      man: qpuSubManOf(see[n], cryptoReadingOf().iqft!, `${factoring} Inverse QFT. Period continued-fraction. ${named}`, href, see.filter((s) => s !== see[n])),
      inputSchema: shorSchema,
      run: (a: Record<string, unknown>) => {
        const shor = qpuShorTryOf(a)
        const shown = shownOf(shor)
        return { kind: 'iqft' as const, qft: shor.qft, post: shor.post, classical: shor.classical, exact: shor.exact, read: shor.read, rsa: { kind: 'rsa' as const, modulus: shown.n, period: shor.post.period, factored: shor.rsa.factored }, holds: shor.qft.holds && shor.post.holds && shor.read.holds }
      }},
    {
      name: see[n + seed],
      description: `theorem shor. ${shorFactorOf()}.`,
      man: qpuSubManOf(see[n + seed], cryptoReadingOf().shots!, `${factoring} Exact amplitudes. xx identity. ${named}`, href, see.filter((s) => s !== see[n + seed])),
      inputSchema: shorSchema,
      run: (a: Record<string, unknown>) => {
        const shor = qpuShorTryOf(a)
        const shown = shownOf(shor)
        return { kind: 'shots' as const, device: shor.device, measure: shor.measure, exact: shor.exact, read: shor.read, rsa: { kind: 'rsa' as const, modulus: shown.n, factored: shor.rsa.factored }, holds: shor.measure.holds && shor.read.holds }
      }},
    {
      name: see[n + coins],
      description: `theorem shor. ${shorFactorOf()}.`,
      man: qpuSubManOf(see[n + coins], cryptoReadingOf().rsa!, `${factoring} JSON Nat. ${named}`, href, see.filter((s) => s !== see[n + coins])),
      inputSchema: shorSchema,
      run: (a: Record<string, unknown>) => {
        const args = shorArgsOf(a)
        if (args.modulus === undefined && args.base === undefined) return qpuCybersecurityOf().rsa
        const shor = qpuShorTryOf(a)
        const shown = shownOf(shor)
        return { ...shown.rsa, a: shown.a, period: shor.post.period, by: shor.factors.by, exact: shor.exact, read: shor.read, classical: shor.classical, holds: shor.rsa.holds && shor.read.holds }
      }},
    {
      name: see[n + n],
      description: `theorem crypto. ${cryptoClaimOf()}.`,
      man: qpuSubManOf(see[n + n], cryptoReadingOf().split!, encrypt, href, see.filter((s) => s !== see[n + n])),
      inputSchema: schema,
      run: () => qpuEncryptOf()},
    {
      name: see[mintOf(n) - seed],
      description: 'theorem shor. theorem crypto.',
      man: qpuSubManOf(see[mintOf(n) - seed], cryptoReadingOf().verify!, both, href, see.filter((s) => s !== see[mintOf(n) - seed])),
      inputSchema: schema,
      run: async () => {
        const cyber = qpuCybersecurityOf()
        // crypt.* security formulas — dynamic import keeps the cooled crypto module free of a families cycle.
        const { CryptFormulas } = await import('../../../families/crypt/index.js')
        const known = CryptFormulas.knownAnswers()
        const grover = CryptFormulas.symmetricQuantumBits(256)
        const classical = CryptFormulas.curveClassicalBits(256)
        const quantum = CryptFormulas.curveQuantumBits(256)
        const tag = CryptFormulas.aeadTagBits()
        const poly = CryptFormulas.tagForgery(16)
        const birthday = CryptFormulas.hashCollisionBits(256)
        const cryptFamily = {
          knownAnswers: known,
          symmetricQuantumBits256: grover,
          curveClassicalBits256: classical,
          curveQuantumBits256: quantum,
          aeadTagBits: tag,
          tagForgery16: poly,
          hashCollisionBits256: birthday,
          holds: [known, grover, classical, quantum, tag, poly, birthday].every((r) => r.holds === true),
        }
        return {
          kind: 'verify' as const,
          factoring: { theorem: 'shor' as const, factored: cyber.rsa.factored, n: cyber.rsa.modulus, p: cyber.rsa.factors.p, q: cyber.rsa.factors.q, holds: cyber.rsa.holds },
          encrypt: cyber.encrypt,
          verify: cyber.verify,
          rsa: cyber.rsa,
          payload: cyber.shor.payload,
          crypt: cryptFamily,
          holds: cyber.verify.crypt === true && cyber.verify.rsa === true && cyber.verify.encrypt === true && cyber.encrypt.holds && cyber.holds && cryptFamily.holds,
        }
      }}]
}
