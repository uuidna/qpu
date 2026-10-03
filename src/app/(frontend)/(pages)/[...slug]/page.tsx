import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { qpuHexDecodeOf, qpuHexRunOf } from '@uuidna/qpu'
import { docOf, docsOf, familiesOf, pageOf, payloadOf, runOf } from '@/app/_data'
import { RenderBlocks, type SearchParams } from '@/components/RenderBlocks'
import { metadataOf } from '@/utilities/metadataOf'
import { DocView } from '@/components/Doc'
import { FamilyView } from '@/components/Family'
import { ProgramView, RunCard, type Run } from '@/components/Program'
import type { Redirect } from '@/payload-types'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string[] }>; searchParams: Promise<SearchParams & { p?: string }> }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

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
  if (segs.length === 2) {
    const family = familiesOf().find((f) => f.name === segs[0])
    const names = segs[1]!.split('+').filter(Boolean)
    if (family && names.length > 0 && names.length <= 10 && names.every((n) => family.formulas.some((x) => x.name === n))) return { program: { family: family.name, names, formulas: family.formulas.map((x) => x.name) } }
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
  if (r.program) return { title: `${r.program.family} [${r.program.names.join(' → ')}]`, description: `Run the hex program ${r.program.names.join(' → ')} of the ${r.program.family} family and read its quantum receipt.` }
  if (r.uuid) return { title: `hex ${r.uuid}`, description: 'A hex-program UUID, run: the family, its formulas, the value and the quantum receipt.' }
  return {}
}

export default async function Resolved({ params, searchParams }: Props) {
  const { slug: path } = await params
  const r = await resolve(path)
  const query = await searchParams

  if (r.program) {
    const raw = String(query.p ?? '')
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
