// One catalogue document: the licences of the catalogue priced in the rates given, the Google challenges, and the Clay combinations.
import { caller } from '../../../../../../../../3/8/5/9/0/2/0/f/index.ts'
import { googleChallenges } from '../../../../../../../../b/f/8/0/7/c/5/5/index.ts'
import { CATALOGUE, convertAmounts } from '../../../../../../../../4/5/8/2/8/f/3/f/index.ts'

export type FeedRates = Record<string, { rate: number }>
export type FeedsArgs = { rates?: FeedRates | null; combinations?: boolean; combinationLimit?: number; google?: boolean }
type Combinations = { products?: { product: string; variants: unknown[] }[] } & Record<string, unknown>

const catalogueItems = (rates?: FeedRates | null) => CATALOGUE.map((v) => ({
  title: `${v.product} · ${v.variant}`,
  licence: { product: v.product, variant: v.variant, unit: v.unit, interval: v.interval, domains: String(v.domains) },
  prices: rates ? convertAmounts(v.amounts.eur ?? 0, rates) : v.amounts,
}))

export const feeds = ({ rates = null, combinations = false, combinationLimit = 0, google = false }: FeedsArgs = {}) => {
  const challenges = google ? googleChallenges() : undefined
  const base: Record<string, unknown> = { phase: 'feeds' as const, catalogue: catalogueItems(rates), ...(challenges ? { google: challenges, counts: { googleChallenges: challenges.total, googleHolding: challenges.holding } } : {}) }
  if (!combinations) return base
  const all = caller('clay')({ combinations: true }) as Combinations
  const limit = Math.max(0, Math.floor(combinationLimit))
  const products = (all.products ?? []).map((p) => ({ ...p, variants: limit ? p.variants.slice(0, limit) : p.variants }))
  const variants = (all.products ?? []).reduce((n, p) => n + p.variants.length, 0)
  return { ...base, combinations: { ...all, products }, counts: { ...((base.counts as Record<string, number> | undefined) ?? {}), products: products.length, variants, shown: products.reduce((n, p) => n + p.variants.length, 0) } }
}
export { googleChallenges }
