// The gaps of the library as Lean's own library search finds them (lean/tools/Gaps.lean): every conjunct of every
// declared theorem with a variable, in the library (named), open, undecided, or of the tree's own notions; the whole
// finding sealed as a uuid program, so a receipt names the exact run it reads.
import { GAPS } from '../../../../../../../../9/b/d/6/c/f/0/2/index.ts'
import { receiptOf } from '../../../../../../../../index.ts'
import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'

type Part = { statement: string; library?: readonly string[]; decided?: string; open?: boolean; undecided?: boolean; own?: readonly string[] }
const VERDICTS = ['library', 'decided', 'open', 'undecided', 'own'] as const
const verdictOf = (p: Part) => (p.library ? 'library' : p.decided ? 'decided' : p.open ? 'open' : p.undecided ? 'undecided' : 'own')

/** The finding: the count of each verdict, the open conjuncts (or those matching `asked`), and the receipt. */
export const listGaps = (asked: unknown) => {
  const words = typeof asked === 'string' ? asked.toLowerCase() : ''
  const rows = (GAPS as readonly { key: string; module: string; parts: readonly Part[] }[]).flatMap((t) =>
    t.parts.map((p) => ({ theorem: t.key, module: t.module, verdict: verdictOf(p), statement: p.statement, library: p.library ?? (p.decided ? [p.decided] : []), own: p.own ?? [] })))
  const count = Object.fromEntries(VERDICTS.map((v) => [v, rows.filter((r) => r.verdict === v).length]))
  const gaps = rows.filter((r) => (words ? `${r.theorem} ${r.statement}`.toLowerCase().includes(words) : r.verdict === 'open'))
  const receipt = receiptOf('library-gaps', rows.map((r) => `${r.theorem}:${r.verdict}:${r.library.join(',')}`))
  const says = proseFill(PROSE.quantumProcessingMcp_says435, GAPS.length, count.library! + count.decided!, count.open, count.undecided, count.own, gaps.length)
  return { phase: 'gaps' as const, receipt, theorems: GAPS.length, count, gaps, holds: receipt.sealed && rows.length > 0, says }
}
