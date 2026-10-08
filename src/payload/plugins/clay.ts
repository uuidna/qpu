import { qpuCiteOf } from '../../quantum/processing/unit/presentation.js'
import { qpuPublicOf } from '../../quantum/processing/unit/zeropage.js'

/**
 * The prize claim the receipt already refuses. scripts/receipt.mjs sets legal.citation.holds to false and legal.citation.lead
 * to true for the statement "clay solved in august", with the words "This file is a naming scheme. It solves none of the
 * problems it names." This reading does not flip that. It does not submit anything to the Clay Mathematics Institute.
 *
 * The rules quoted here are the Institute's own, adopted 26 September 2018:
 * https://www.claymath.org/wp-content/uploads/2022/03/millennium_prize_rules_0.pdf
 */
const RULES = 'https://www.claymath.org/wp-content/uploads/2022/03/millennium_prize_rules_0.pdf'

export const clayPrizeOf = () => {
  const cite = qpuCiteOf()
  const face = qpuPublicOf()
  const citation = {
    statement: 'clay solved in august' as const,
    words: 'This file is a naming scheme. It solves none of the problems it names' as const,
    holds: false as const,
    lead: true as const,
  }
  return {
    kind: 'clay-prize' as const,
    rules: RULES,
    citation,
    prize: face.prize,
    public: {
      doi: cite.doi,
      archive: cite.archive,
      identifier: cite.identifier,
      prior: cite.prior,
      sentence: face.sentence,
    },
    billed: false as const,
    holds: false as const,
  }
}
