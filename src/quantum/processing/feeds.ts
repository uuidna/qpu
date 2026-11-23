// One catalogue document: the licences of the catalogue priced in the rates given, the Google challenges, and the Clay combinations.
import { caller } from './mcp.ts'
import { googleChallenges } from './toolboxes/google.ts'
import { CATALOGUE, convertAmounts } from './toolboxes/billing.ts'

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
