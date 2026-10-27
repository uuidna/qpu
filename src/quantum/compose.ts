// A URL that names no route is answered anyway: the combination of the cached assets its words select — the generated code
// (every file of the full stack), the SDK module, the shadcn registry items, the examples' blocks — computed in real time from
// the handler alone, every asset at its content address and verified (verifyOf: the seal, the content), the combination at the
// address of its parts (ETag by content, 304 by involution). The fallback for anything, and a billed answer: one coil of the
// metered variant for the author's coins, and a sublicence at the tenant's own Stripe when the tenant resells it (the licence
// chain, link by link: textbook_licence_chain). Four kinds of asset, fifteen non-empty combinations (textbook_url_combinations).
import type { Context } from './toolbox.ts'
import { uuidOf, verifyOf, PRESENTABLE_ITEMS } from './blocks.ts'
import { stemsOf } from './audit.ts'
import { usageOrderOf, recursiveLicenceOf } from './toolboxes/billing.ts'
import { coilColourOf } from './theme.ts'

const ASSET_KINDS = ['code', 'sdk', 'registry', 'block'] as const
type AssetKind = typeof ASSET_KINDS[number]
export type Asset = { kind: AssetKind; id: string; url: string; address: string; bytes: number; verified: boolean; stems: string[]; score: number; text?: string; tool?: string; replay?: { tool: string; arguments: Record<string, unknown> } }

const intersect = (a: Set<string>, b: Set<string>) => [...a].filter((x) => b.has(x))

/** Every cached asset the handler can compute, each at its address: the code of the full stack, the SDK, the registry items, the examples' blocks. */
const assetsOf = (ctx: Context, origin: string): Omit<Asset, 'score'>[] => {
  const files = (ctx.call('configure', { kind: 'fullstack' })?.config?.files as Record<string, string> | undefined) ?? {}
  const sdk = (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'resources/read', params: { uri: 'sdk://qpu/lib' } }) as { result?: { contents?: { text?: string }[] } }).result?.contents?.[0]?.text ?? ''
  const textAsset = (kind: AssetKind, id: string, text: string, url: string): Omit<Asset, 'score'> => { const address = uuidOf(text); return { kind, id, url, address, bytes: text.length, verified: verifyOf(address, text).valid, stems: [...stemsOf(id.replace(/\.[a-z]+$/, '').replace(/([a-z])([A-Z])/g, '$1 $2'))], text } }
  const idAsset = (kind: AssetKind, id: string, url: string, stems: string, extra: Partial<Asset> = {}): Omit<Asset, 'score'> => { const address = uuidOf(`${kind}:${id}`); return { kind, id, url, address, bytes: 0, verified: verifyOf(address).valid, stems: [...stemsOf(stems)], ...extra } }
  return [
    ...Object.entries(files).map(([p, text]) => textAsset('code', p, text, `${origin}/${p}`)),
    ...(sdk ? [textAsset('sdk', 'lib/qpu-sdk.ts', sdk, `${origin}/lib/qpu-sdk.ts`)] : []),
    ...PRESENTABLE_ITEMS.map((item) => idAsset('registry', item, `${origin}/r/${item}.json`, `${item} registry shadcn`)),
    ...ctx.examples.map((e) => idAsset('block', e.id, `${origin}/mcp`, `${e.id} ${e.tool} ${e.theorem ?? ''}`, { tool: e.tool, replay: { tool: 'textbook', arguments: { reuse: e.id } } })),
  ]
}

/** The combination the URL names: the assets whose stems its words share, ranked; the code joined; the whole addressed, verified and billed. */
export const composeOf = (path: string, ctx: Context, origin = 'https://qpu.uuidna.com', tenant = 'uuidna', currency = 'eur') => {
  const clean = path.split('?')[0]!.split('#')[0]!
  const ext = /\.(tsx?|jsx?|json|css|md|html)$/.exec(clean)?.[1] ?? null
  const words = stemsOf(clean.replace(/\.[a-z]+$/, '').replace(/([a-z])([A-Z])/g, '$1 $2'))
  const all = assetsOf(ctx, origin)
  const selected: Asset[] = all.map((a) => ({ ...a, score: intersect(words, new Set(a.stems)).length })).filter((a) => a.score > 0).sort((a, b) => b.score - a.score || ASSET_KINDS.indexOf(a.kind) - ASSET_KINDS.indexOf(b.kind) || a.id.localeCompare(b.id))
  const code = selected.filter((a) => a.text !== undefined).map((a) => `// ── ${a.id} · ${a.address} · ${a.bytes} bytes · ${a.verified ? 'verified' : 'unverified'}\n${a.text}`).join('\n\n')
  const kinds = [...new Set(selected.map((a) => a.kind))]
  const address = selected.length ? uuidOf(selected.map((a) => `${a.kind}:${a.id}:${a.address}`).join('\n')) : null
  const verified = selected.length > 0 && selected.every((a) => a.verified)
  // the bill: the composition is one call and a coil (no pure algebra), priced by the metered variant for the author's coins; a tenant that resells it sublicenses it at its own Stripe
  const order = usageOrderOf(1, currency, undefined, { free: 0, coils: 1, commercial: tenant !== 'uuidna' }) // the author's own domain serves it under the non-commercial term; a tenant reselling it is commercial: the coil priced
  const licence = recursiveLicenceOf(['author', tenant, 'customer'])
  return {
    path: clean, words: [...words], ext, kinds, combinations: 2 ** ASSET_KINDS.length - 1, theorem: 'textbook_url_combinations',
    count: selected.length, assets: selected.map(({ text: _t, ...a }) => { void _t; return a }), code: code || null, codeBytes: code.length, address, verified,
    serve: ext && /^(tsx?|jsx?)$/.test(ext) ? 'text/typescript: the code of the combination' : ext === 'json' || !ext ? 'application/json: the combination; text/html: the page' : 'application/json: the combination',
    bill: { calls: 1, free: 0, coils: 1, colour: coilColourOf().coil, order, author: { coins: 2, says: 'every response deposits the two coins: the author\'s side of the monetisation, however many levels resell' }, licence },
    says: selected.length ? `the URL names ${selected.length} cached asset(s) of ${kinds.length} kind(s): computed in real time, each verified at its address, the whole at ${address}` : 'the URL names no cached asset: the decision alone (404 with the match tool\'s verdict)',
  }
}
