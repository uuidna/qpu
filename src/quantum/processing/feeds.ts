// GET /api/qpu/feeds and payload { feeds }: one catalogue document (rates, google, repos, clay combinations).
import { caller } from './mcp.ts'
import { googleChallenges } from './toolboxes/google.ts'

export type FeedRates = Record<string, { rate: number }>
export type FeedsArgs = { rates?: FeedRates | null; combinations?: boolean; combinationLimit?: number; google?: boolean; repos?: boolean }
type Combinations = { products?: { product: string; variants: unknown[] }[] } & Record<string, unknown>

export const feeds = ({ rates = null, combinations = false, combinationLimit = 0, google = false, repos = false }: FeedsArgs = {}) => {
  const base = caller('payload')({ feeds: { ...(rates ? { rates } : {}), google, ...(repos ? { repos: true } : {}) } }) as Record<string, unknown>
  if (!combinations) return base
  const all = caller('clay')({ combinations: true }) as Combinations
  const limit = Math.max(0, Math.floor(combinationLimit))
  const products = (all.products ?? []).map((p) => ({ ...p, variants: limit ? p.variants.slice(0, limit) : p.variants }))
  const variants = (all.products ?? []).reduce((n, p) => n + p.variants.length, 0)
  return { ...base, combinations: { ...all, products }, counts: { ...((base.counts as Record<string, number> | undefined) ?? {}), products: products.length, variants, shown: products.reduce((n, p) => n + p.variants.length, 0) } }
}
export { googleChallenges }
