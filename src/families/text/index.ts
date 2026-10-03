import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** TEXT — LANGUAGE AS ARITHMETIC (chosen by the registry: the text domain). A document is numbers: tokens, average
 *  sentence length, similarity, keyword density, net sentiment, the type-token ratio, compression, and token cost.
 *  Crosses to `ml` — text is what a model reads. A measure. */

const PROOF = 'text arithmetic (tokens, sentence length, similarity, keyword density, sentiment, type-token ratio, compression, token cost); a measure crossed to ml'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const x = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'text', dst: 'ml', formula, value, proof: PROOF, ...extra }, holds, { name: `text.${name}`, params })

export class TextFormulas {
  /** TOKENS: characters over the average characters per token (≈ 4). value ⌊chars / perToken⌋. */
  static tokens(chars: number, perToken: number): CrossFormula { return x('text-tokens', 'tokens(chars, perToken) = ⌊chars / perToken⌋', perToken > 0 ? Math.floor(chars / perToken) : 0, nat(chars, perToken) && perToken > 0, 'tokens', [chars, perToken]) }
  /** AVERAGE SENTENCE LENGTH: words over sentences — a readability proxy. value ⌊words / sentences⌋. */
  static readability(words: number, sentences: number): CrossFormula { return x('text-readability', 'readability(words, sentences) = ⌊words / sentences⌋', sentences > 0 ? Math.floor(words / sentences) : 0, nat(words, sentences) && sentences > 0, 'readability', [words, sentences]) }
  /** SIMILARITY as a percentage: shared terms over the union (Jaccard). value ⌊shared · 100 / total⌋. */
  static similarity(shared: number, total: number): CrossFormula { return x('text-similarity', 'similarity(shared, total) = ⌊shared · 100 / total⌋', total > 0 ? Math.floor((shared * 100) / total) : 0, nat(shared, total) && total > 0 && shared <= total, 'similarity', [shared, total]) }
  /** KEYWORD DENSITY as a percentage. value ⌊keyword · 100 / total⌋. */
  static density(keyword: number, total: number): CrossFormula { return x('text-density', 'density(keyword, total) = ⌊keyword · 100 / total⌋', total > 0 ? Math.floor((keyword * 100) / total) : 0, nat(keyword, total) && total > 0 && keyword <= total, 'density', [keyword, total]) }
  /** NET SENTIMENT: positive less negative mentions (may be negative). value positive − negative. */
  static sentiment(positive: number, negative: number): CrossFormula { return x('text-sentiment', 'sentiment(positive, negative) = positive − negative', positive - negative, nat(positive, negative), 'sentiment', [positive, negative]) }
  /** THE TYPE-TOKEN RATIO as a percentage: unique words over all words. value ⌊unique · 100 / total⌋. */
  static ttr(unique: number, total: number): CrossFormula { return x('text-ttr', 'ttr(unique, total) = ⌊unique · 100 / total⌋', total > 0 ? Math.floor((unique * 100) / total) : 0, nat(unique, total) && total > 0 && unique <= total, 'ttr', [unique, total]) }
  /** COMPRESSION as a percentage: the summary length over the original. value ⌊summary · 100 / original⌋. */
  static summary(original: number, summary: number): CrossFormula { return x('text-summary', 'summary(original, summary) = ⌊summary · 100 / original⌋', original > 0 ? Math.floor((summary * 100) / original) : 0, nat(original, summary) && original > 0 && summary <= original, 'summary', [original, summary]) }
  /** TOKEN COST per thousand tokens. value ⌊tokens · rate / 1000⌋. */
  static cost(tokens: number, rate: number): CrossFormula { return x('text-cost', 'cost(tokens, rate) = ⌊tokens · rate / 1000⌋', Math.floor((tokens * rate) / 1000), nat(tokens, rate), 'cost', [tokens, rate]) }
}

for (const name of ['cost', 'density', 'readability', 'sentiment', 'similarity', 'summary', 'tokens', 'ttr'] as const)
  qpuHexRegisterOf('text', name, (TextFormulas[name] as (...x: unknown[]) => unknown).bind(TextFormulas))
