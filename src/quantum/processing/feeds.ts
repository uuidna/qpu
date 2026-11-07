// The product and variant feeds payloadcms/website delivers, computed by the QPU: a thin client of two doors. payload { feeds } prices the
// catalogue by the rates and adds the Google challenges when asked; clay { combinations } gives the product combinations, each product's
// variants cut to the limit the request named (0 is no cut). The endpoint, the plugin and the toolbox read this one answer, so a door's
// error is the door's, never a fallback made here.
import { caller } from './mcp.ts'
import { googleChallenges } from './toolboxes/google.ts'

export type FeedRates = Record<string, { rate: number }>
export type FeedsArgs = { rates?: FeedRates | null; combinations?: boolean; combinationLimit?: number; google?: boolean }
type Combinations = { products?: { product: string; variants: unknown[] }[] } & Record<string, unknown>

export const feeds = ({ rates = null, combinations = false, combinationLimit = 0, google = false }: FeedsArgs = {}) => {
  const base = caller('payload')({ feeds: { ...(rates ? { rates } : {}), google } }) as Record<string, unknown>
  if (!combinations) return base
  const all = caller('clay')({ combinations: true }) as Combinations
  const limit = Math.max(0, Math.floor(combinationLimit))
  const products = (all.products ?? []).map((p) => ({ ...p, variants: limit ? p.variants.slice(0, limit) : p.variants }))
  const variants = (all.products ?? []).reduce((n, p) => n + p.variants.length, 0)
  return { ...base, combinations: { ...all, products }, counts: { ...((base.counts as Record<string, number> | undefined) ?? {}), products: products.length, variants, shown: products.reduce((n, p) => n + p.variants.length, 0) } }
}
export { googleChallenges }
