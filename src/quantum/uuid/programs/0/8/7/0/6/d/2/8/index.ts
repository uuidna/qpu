// The quantum capacity of one UUID register, every number the register's own answer (uuidQubits, the function the fold door serves as
// fold { qubits }) and none written here: the register and its receipt, the five parts of the UUID with the qubits each holds, the register at
// zero as it states it, the combination spaces and the eight scales of the handle. metrics carries it, the one text prints it, the welcome
// states it, and every workflow step is gated on it: the parts make the register, the receipt balances and is sealed, and nothing is left unused.
import { UUID_GROUPS } from '../../../../../../../../d/e/a/3/e/d/e/1/index.ts'
import { hexbitRegister } from '../../../../../../../../9/d/1/0/1/4/3/9/index.ts'
import { LICENSE } from '../../../../../../../../a/f/3/d/e/a/5/f/index.ts'
import { ALGEBRA_TOOLS } from '../../../../../../../../4/5/8/2/8/f/3/f/index.ts'
import { getEntropy } from '../../../../../../../../5/b/3/0/7/9/e/2/index.ts'

/** What the capacity is to the public, in the licence's own words and nothing added: the doors anyone may call to compute and check it, whether
 *  each is free under attribution or under a licence of the catalogue, and the terms, attribution, copyright and disclaimer the licence table holds. */
const publicUse = () => ({
  doors: [{ tool: 'fold', arguments: { qubits: 4 } }, { tool: 'metrics', arguments: {} }, { tool: 'verify', arguments: { uuid: 'uuid', content: 'content' } }].map((d) => ({ ...d, commercial: ALGEBRA_TOOLS.includes(d.tool) ? 'free under attribution' : 'a licence of the catalogue' })),
  licence: LICENSE.spdx, deed: LICENSE.deed, url: LICENSE.url, terms: LICENSE.terms, attribution: LICENSE.attribution, copyright: LICENSE.copyright, representation: LICENSE.representation, disclaimer: LICENSE.disclaimer,
})

type Register = { digits: number; hexbit: number; gateway: number; hex: number; version: number; variant: number; effective: number; handles: { perHandle: number; capacity: string; fractal: boolean; scales: { scale: number; radix: number; qubits: number; handles: string; capacity: string }[]; says: string }; organised: { fingerprint: { combinations: string }; combination: { combinations: string }; zero: Record<string, unknown> }; receipt: { coin: string; formula: string; debits: number; credits: number; balanced: boolean; sealed: boolean; theorem: string; line: { debit: string; credit: string } } }

/** The cost to fake an address, measured from the capacity inverted: f free bits are 2^f addresses, so finding the content of one given address
 *  is 2^f tries classically and 2^(f/2) by Grover's search (textbook_grover_search), and finding any two contents with one address is 2^(f/2)
 *  by the birthday bound and 2^(f/3) by quantum collision search. The floor is 128 bits against a quantum search (textbook_tamper_detected:
 *  256 / 2 = 128). The address alone is measured against it as it stands, and so is the SHA-256 every block carries beside its address. */
export const costToFake = (free: number, digestBits = 256, floor = 128) => {
  const measure = (bits: number) => ({ bits, preimage: { classical: bits, grover: bits / 2 }, collision: { classical: bits / 2, quantum: `${bits}/3` }, floor, meetsFloor: bits / 2 >= floor })
  return { unit: 'the exponent of 2' as const, address: measure(free), digest: measure(digestBits), theorems: ['textbook_grover_search', 'textbook_tamper_detected'] as const }
}

/** The capacity read from a register's answer; holds only when the parts make the whole, the receipt balances and is sealed, and used + left
 *  is the free register with nothing left (textbook_capacity_conserved: used + (capacity − used) = capacity). */
export const capacityOf = (answer: unknown) => {
  const q = answer as Register
  const tail = UUID_GROUPS[UUID_GROUPS.length - 1]!, handle = UUID_GROUPS[0]!, program = q.digits - handle - tail - 2
  const part = (name: string, digits: number, fixed: number) => ({ part: name, digits, bits: digits * 4, qubits: digits * q.hexbit, free: digits * q.hexbit - fixed })
  const parts = [part('handle', handle, 0), part('version', 1, q.version), part('program', program, 0), part('variant', 1, q.variant), part('tail', tail, 0)]
  const sum = (k: 'digits' | 'bits' | 'qubits' | 'free') => parts.reduce((n, p) => n + p[k], 0)
  const whole = sum('digits') === q.digits && sum('qubits') === q.hex && sum('free') === q.effective
  const used = Number(q.organised.zero.used), left = Number(q.organised.zero.left)
  const balanced = q.receipt.balanced === true && q.receipt.sealed === true && q.receipt.debits === q.effective && q.receipt.credits === q.effective
  return {
    register: { digits: q.digits, hexbit: q.hexbit, bits: sum('bits'), qubits: q.hex, version: q.version, gateway: q.gateway, free: q.effective, formula: q.receipt.formula, theorem: q.receipt.theorem },
    receipt: { coin: q.receipt.coin, debit: q.receipt.line.debit, credit: q.receipt.line.credit, debits: q.receipt.debits, credits: q.receipt.credits, balanced: q.receipt.balanced, sealed: q.receipt.sealed },
    parts, whole,
    zero: q.organised.zero,
    spaces: { handles: q.organised.fingerprint.combinations, programs: q.organised.combination.combinations, addressable: (BigInt(q.organised.fingerprint.combinations) * BigInt(q.organised.combination.combinations)).toString(), onEveryHandle: q.handles.capacity },
    scales: q.handles.scales, perHandle: q.handles.perHandle, unlimited: q.handles.fractal,
    used, left, full: used === q.effective && left === 0,
    public: publicUse(),
    security: costToFake(q.effective),
    gate: { theorem: 'textbook_capacity_conserved' as const, holds: whole && balanced && used + left === q.effective && left === 0, evidence: `${used} + ${left} = ${q.effective}; ${q.receipt.debits} = ${q.receipt.credits}; ${sum('free')} = ${q.effective}` },
  }
}
/** The hand-written sources the tree's entropy is measured over: the TypeScript of the quantum tree and the scripts, without tests and rendered indexes. */
export const stableSource = (file: string) => /^(src\/quantum|scripts)\/.*\.ts$/.test(file) && !/(_test\.ts|\.test\.ts|\.d\.ts)$/.test(file)
/** Stable: the capacity utilised in full and no entropy. The capacity is the gate above; the entropy is the audit door's own measure over the
 *  sources handed in (audit { entropy }: every lead a microstate, W the leads), and stable holds only when the gate holds and no lead is left. */
export const stabilityOf = (given: Readonly<Record<string, string>>) => {
  // a file a generator writes says so on its first line: it is data, read by no measure of entropy
  const files = Object.fromEntries(Object.entries(given).filter(([, text]) => !text.startsWith('// GENERATED')))
  const c = quantumCapacity(), e = getEntropy(files) as { leads?: { kind: string; occurrences: number }[] }, leads = e.leads ?? []
  const byKind: Record<string, number> = {}; for (const l of leads) byKind[l.kind] = (byKind[l.kind] ?? 0) + l.occurrences
  const stable = c.gate.holds && c.full && leads.length === 0
  return { phase: 'stable' as const, stable, holds: stable, release: stable ? 'allowed' as const : 'refused' as const, capacity: { used: c.used, left: c.left, full: c.full, ...c.gate }, entropy: { files: Object.keys(files).length, leads: leads.length, occurrences: leads.reduce((n, l) => n + l.occurrences, 0), byKind } }
}
/** The capacity at the hexbit width the axioms state, straight from the register the fold door serves. */
export const quantumCapacity = () => capacityOf(hexbitRegister())
