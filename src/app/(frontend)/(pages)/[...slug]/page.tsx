import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { qpuHexDecodeOf, qpuHexRunOf } from '@uuidna/qpu'
import { askOf, docOf, docsOf, familiesOf, pageOf, payloadOf, runOf } from '@/app/_data'
import { RenderBlocks, type SearchParams } from '@/components/RenderBlocks'
import { metadataOf } from '@/utilities/metadataOf'
import { DocView } from '@/components/Doc'
import { FamilyView } from '@/components/Family'
import { ProgramView, RunCard, type Run } from '@/components/Program'
import type { Redirect } from '@/payload-types'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string[] }>; searchParams: Promise<SearchParams & { p?: string }> }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** A path means what it names: a page built from blocks, a doc, a formula family, a hex-program UUID (one segment), or a
 *  family's program (two segments). One segment can name several things at once; each is shown. */
const resolve = async (path: string[]) => {
  const segs = path.map((s) => decodeURIComponent(s))
  if (segs.length === 1) {
    const [x] = segs as [string]
    const decoded = UUID.test(x) ? qpuHexDecodeOf(x) : null
    return {
      page: await pageOf(x),
      doc: await docOf(x),
      family: familiesOf().find((f) => f.name === x),
      uuid: decoded && 'holds' in decoded && decoded.holds ? x.toLowerCase() : undefined,
    }
  }
  if (segs.length >= 2) {
    // a multi-segment path is a COMBINATION: family / formula / formula / … / [params]. Formula segments also split on
    // '+', and a trailing all-numeric segment is the params — so /family/f1/f2/1,2 and /family/f1+f2 both name the program.
    const family = familiesOf().find((f) => f.name === segs[0])
    if (family) {
      const last = segs[segs.length - 1]!
      const params = /^[0-9]+([,+][0-9]+)*$/.test(last) ? last.split(/[,+]/).map(Number).filter((x) => Number.isSafeInteger(x) && x >= 0).slice(0, 3) : undefined
      const names = segs.slice(1, params ? -1 : undefined).flatMap((s) => s.split('+')).filter(Boolean)
      if (names.length > 0 && names.length <= 10 && names.every((n) => family.formulas.some((x) => x.name === n))) return { program: { family: family.name, names, formulas: family.formulas.map((x) => x.name) }, params }
    }
  }
  return {}
}

const redirectOf = async (path: string[]): Promise<string | undefined> => {
  const from = `/${path.map((s) => decodeURIComponent(s)).join('/')}`
  const r = (await (await payloadOf()).find({ collection: 'redirects', where: { from: { equals: from } }, limit: 1, depth: 1 })).docs[0] as Redirect | undefined
  if (!r?.to) return undefined
  if (r.to.type === 'reference' && r.to.reference && typeof r.to.reference.value === 'object') return `/${(r.to.reference.value as { slug: string }).slug}`
  return r.to.url ?? undefined
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await resolve((await params).slug)
  if (r.page) return metadataOf(r.page)
  if (r.doc) return metadataOf(r.doc, 'article')
  if (r.family) return { title: `${r.family.name} formulas`, description: `The ${r.family.formulas.length} formulas of the ${r.family.name} family and their ${r.family.formulas.length ** 2} compositions.`, alternates: { canonical: `/${encodeURIComponent(r.family.name)}` } }
  // every path-variant of a combination (/family/f1/f2/p, /family/f1+f2?p=…) shares ONE canonical — the normalized
  // combination — so a path change does not break SEO: it still resolves (200) and points at the same canonical.
  if (r.program) return { title: `${r.program.family} [${r.program.names.join(' → ')}]`, description: `Run the hex program ${r.program.names.join(' → ')} of the ${r.program.family} family and read its quantum receipt.`, alternates: { canonical: `/${encodeURIComponent(r.program.family)}/${r.program.names.join('+')}${r.params?.length ? `/${r.params.join(',')}` : ''}` } }
  if (r.uuid) return { title: `hex ${r.uuid}`, description: 'A hex-program UUID, run: the family, its formulas, the value and the quantum receipt.', alternates: { canonical: `/${r.uuid}` } }
  return {}
}

export default async function Resolved({ params, searchParams }: Props) {
  const { slug: path } = await params
  const r = await resolve(path)
  const query = await searchParams

  if (r.program) {
    // params from the path (a multi-segment combination) win; otherwise the ?p= query, as before
    const raw = r.params?.length ? r.params.join(',') : String(query.p ?? '')
    const nums = raw.split(',').map((x) => x.trim()).filter(Boolean).map(Number).slice(0, 3)
    if (!nums.every((x) => Number.isSafeInteger(x) && x >= 0)) return <ProgramView family={r.program.family} names={r.program.names} formulas={r.program.formulas} raw={raw} error="Parameters must be natural numbers." />
    try {
      const { uuid, run } = await runOf(r.program.family, r.program.names, nums)
      return <ProgramView family={r.program.family} names={r.program.names} formulas={r.program.formulas} raw={raw} uuid={uuid} run={run as Run} />
    } catch (e) {
      return <ProgramView family={r.program.family} names={r.program.names} formulas={r.program.formulas} raw={raw} error={(e as Error).message} />
    }
  }

  if (!r.page && !r.doc && !r.family && !r.uuid) {
    const to = await redirectOf(path)
    if (to) redirect(to)
    // ANY MEANINGFUL PATH IS A LEAD, NOT A 404: parse its words; if they name a formula (a meaningful combination),
    // return the combinatorics (200). Nothing is recorded — the path is a lead the ask resolves on the fly.
    const lead = await askOf(path.map((s) => decodeURIComponent(s)).join(' '))
    if (lead?.hex) return <div className="space-y-16"><RunCard uuid={lead.hex} run={(await qpuHexRunOf(lead.hex)) as Run} /></div>
    notFound()
  }

  return (
    <div className="space-y-16">
      {r.page ? <RenderBlocks blocks={r.page.layout} searchParams={query} /> : null}
      {r.doc ? <DocView doc={r.doc} docs={await docsOf()} /> : null}
      {r.family ? <FamilyView family={r.family} /> : null}
      {r.uuid ? <RunCard uuid={r.uuid} run={(await qpuHexRunOf(r.uuid)) as Run} /> : null}
    </div>
  )
}
