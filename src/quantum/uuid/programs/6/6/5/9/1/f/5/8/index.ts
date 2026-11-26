// A published blog post posts a release, and the release refreshes the DOI. Zenodo's GitHub integration archives every
// release of the repository as a new version under the unit's concept DOI, so the DOI always resolves to the latest
// publication. This module plans the release from the post and sends it through the fetch it is given: it holds no
// token, reads no environment, and a caller without a token sends nothing.
import { NESTED } from '../../../../../../../../1/8/a/3/8/3/8/c/index.ts'
import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'

export const RELEASE_REPOSITORY = 'uuidna/qpu'
/** The concept DOI of the unit on Zenodo (ISO 26324): the parent every release is a version of. */
export const UNIT_CONCEPT_DOI = '10.5281/zenodo.22700098'
const CONCEPT_RECORD = UNIT_CONCEPT_DOI.slice(UNIT_CONCEPT_DOI.lastIndexOf('.') + 1)
const GITHUB = `https://api.github.com/repos/${RELEASE_REPOSITORY}`
const ZENODO_LATEST = `https://zenodo.org/api/records/${CONCEPT_RECORD}`

type Version = [number, number, number]
const parse = (tag: unknown): Version | null => {
  const m = typeof tag === 'string' ? /^v?(\d+)\.(\d+)\.(\d+)$/.exec(tag.trim()) : null
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null
}
const later = (a: Version, b: Version) => (a[0] !== b[0] ? a[0] > b[0] : a[1] !== b[1] ? a[1] > b[1] : a[2] > b[2])

/** The next tag: one patch above the highest version either GitHub or Zenodo already holds. */
export const nextTag = (known: readonly unknown[]): string => {
  const highest = known.map(parse).filter((v): v is Version => v !== null).reduce<Version>((top, v) => (later(v, top) ? v : top), [0, 0, 0])
  return `v${highest[0]}.${highest[1]}.${highest[2] + 1}`
}

export type PublishedPost = { title: string; slug: string; description?: string | null; status?: string | null; previousStatus?: string | null }

/** A post posts a release only on the change that publishes it. */
export const publishesNow = (post: PublishedPost) => post.status === 'published' && post.previousStatus !== 'published'

/** The release request for a post: the tag, the name and the notes. Pure. */
export const planRelease = (post: PublishedPost, known: readonly unknown[], origin: string) => {
  const tag = nextTag(known), page = `${origin.replace(/\/$/, '')}/posts/${post.slug}`
  const catalogue = `https://github.com/${RELEASE_REPOSITORY}/blob/${tag}/src/quantum/CATALOGUE.md`
  const products = NESTED.reduce((n, p) => n + p.products.length, 0), variants = NESTED.reduce((n, p) => n + p.products.reduce((m, q) => m + q.variants.length, 0), 0)
  const notes = [post.description?.trim(), proseFill(PROSE.quantumProcessingRelease_says5, page, UNIT_CONCEPT_DOI), proseFill(PROSE.quantumProcessingRelease_says6, products, variants, catalogue)].filter(Boolean).join('\n\n')
  return { tag, page, request: { method: 'POST' as const, url: `${GITHUB}/releases`, body: { tag_name: tag, target_commitish: 'main', name: post.title, body: notes, draft: false, prerelease: false } } }
}

type Fetch = (url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>

/** Post the release for a post that was just published. Reads the highest known version from GitHub and Zenodo, then
 *  creates the release with the token. Nothing is sent for a post this change did not publish, or without a token. */
export const postRelease = async (given: { post: PublishedPost; fetch: Fetch; token?: string | null; origin: string }) => {
  const { post, fetch, token, origin } = given
  if (!publishesNow(post)) return { phase: 'release' as const, sent: false, says: PROSE.quantumProcessingRelease_says1 }
  if (!token) return { phase: 'release' as const, sent: false, says: PROSE.quantumProcessingRelease_says2 }
  const read = async (url: string) => { try { const r = await fetch(url, { headers: { accept: 'application/json', 'user-agent': 'qpu' } }); return r.ok ? ((await r.json()) as Record<string, any>) : null } catch { return null } }
  const [github, zenodo] = await Promise.all([read(`${GITHUB}/releases/latest`), read(ZENODO_LATEST)])
  const plan = planRelease(post, [github?.tag_name, zenodo?.metadata?.version], origin)
  const sent = await fetch(plan.request.url, { method: plan.request.method, headers: { accept: 'application/vnd.github+json', authorization: `Bearer ${token}`, 'content-type': 'application/json', 'user-agent': 'qpu', 'x-github-api-version': '2022-11-28' }, body: JSON.stringify(plan.request.body) })
  if (!sent.ok) return { phase: 'release' as const, sent: true, posted: false, status: sent.status, tag: plan.tag, says: proseFill(PROSE.quantumProcessingRelease_says4, sent.status) }
  const release = (await sent.json()) as { html_url?: string }
  return { phase: 'release' as const, sent: true, posted: true, status: sent.status, tag: plan.tag, release: release.html_url ?? null, page: plan.page, conceptDoi: UNIT_CONCEPT_DOI, latest: ZENODO_LATEST, says: proseFill(PROSE.quantumProcessingRelease_says3, plan.tag, UNIT_CONCEPT_DOI) }
}
