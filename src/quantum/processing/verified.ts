// What the one text may state: the theorems Lean holds that the NIST door and the CERN door both name while each holds, and no other.
// The doors are the seal tool's own (seal { nist: true } and seal { nist: { reverse: true, via: 'cern' } }); the text and its receipts
// are the ones the build wrote (receipt-index.ts). The gate reads both and computes nothing else: a text that names another theorem, a
// receipt of anything but a verified theorem, or a verified theorem left out, does not hold. It is the first rule of every workflow.
import { RECEIPTS, RECEIPT_TEXT } from './receipt-index.ts'
import { THEOREM_KEYS } from './theorems-index.ts'
import { cryptoConfig } from './crypto/config.ts'
import { cryptoHosts, nistScenarios, nistScenariosReverse } from './crypto/index.ts'

type Door = { holds: boolean; theorems: readonly string[] }
/** The theorems Lean holds that both doors name while each holds: a meet is the top only when both are (textbook_physical_evidence). */
export const verifiedByBoth = (nist: Door, cern: Door): string[] => (nist.holds === true && cern.holds === true ? nist.theorems.filter((t) => cern.theorems.includes(t) && THEOREM_KEYS.has(t)) : [])
/** The two doors as the seal tool answers them for this tree. */
export const verifyingDoors = () => { const config = cryptoConfig(); return { nist: nistScenarios(config), cern: nistScenariosReverse(config, [cryptoHosts(config).cern]) } }
/** The theorems a text names: every word of it that is a theorem the kernel holds, or is written as the textbook names one whether the
 *  kernel holds it or not, so a name no kernel theorem answers to is met and refused like any other. */
export const namedTheorems = (text: string): string[] => [...new Set(text.match(/[A-Za-z_][\w.]*/g) ?? [])].filter((w) => (/[_.]/.test(w) && THEOREM_KEYS.has(w)) || /^textbook_[a-z0-9_]*[a-z0-9]$/.test(w))
/** The gate over the one text and the receipts it is loaded from: the theorems named are the verified ones, each the kind of one receipt. */
export const gateVerified = (text: string = RECEIPT_TEXT, receipts: readonly Record<string, unknown>[] = RECEIPTS) => {
  const doors = verifyingDoors(), verified = verifiedByBoth(doors.nist, doors.cern), held = new Set(verified)
  const kinds = receipts.slice(1).map((r) => String(r.alternateName)), based = receipts.flatMap((r) => ((r.isBasedOn ?? []) as { name: string }[]).map((f) => f.name))
  const named = [...new Set([...namedTheorems(text), ...based, ...kinds])]
  const unverified = named.filter((t) => !held.has(t)), absent = verified.filter((t) => !kinds.includes(t))
  return { verified, named, unverified, absent, holds: verified.length > 0 && unverified.length === 0 && absent.length === 0, evidence: `${named.length} named, ${verified.length} verified by both; +${unverified.length} -${absent.length}${unverified.length ? `: ${unverified.slice(0, 8).join(', ')}` : ''}` }
}
