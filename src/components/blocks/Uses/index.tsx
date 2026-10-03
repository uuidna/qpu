import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockWrapper } from '@/components/BlockWrapper'
import type { SearchParams } from '@/components/RenderBlocks'
import { qpuDataOf } from '@uuidna/qpu/mcp/qpu-fused.js'
import { qpuHexUuidOf } from '@uuidna/qpu'
import type { UsesBlock } from '@/payload-types'

type Imagined = { reading?: { about?: string; category?: string; categories?: string[]; apis?: string[]; families?: { family: string; formulas: string[]; words: string[] }[]; is?: string }; agrees?: boolean; warning?: string }

/** What the unit may be for a request: the APIs the words find, the families those APIs name. The request is the page's
 *  ?about=, else the block's, else the registry's categories one by one — imagined by the record, proposed not claimed. */
export async function Uses({ heading, intro, anchor, about, searchParams }: UsesBlock & { searchParams: SearchParams }) {
  const asked = String(searchParams.about ?? about ?? '').trim()
  const c = Number(searchParams.category ?? 0)
  const r = (await qpuDataOf('imagine', asked ? { about: asked } : { category: Number.isFinite(c) && c >= 0 ? c : 0 })) as Imagined
  const reading = r.reading ?? {}
  const hex = (name: string, params: number[]) => { try { return qpuHexUuidOf({ family: 'data', program: [name], params }) } catch { return '' } }
  return (
    <BlockWrapper heading={heading ?? 'What QPU may be'} intro={intro} anchor={anchor}>
      <form method="get" className="mb-4 flex flex-wrap items-end gap-2">
        <label className="grid gap-1 text-xs text-muted-foreground">a request<input name="about" defaultValue={asked} placeholder="law firm" className="h-9 w-64 rounded-md border bg-background px-2 text-sm text-foreground" /></label>
        <button type="submit" className="h-9 rounded-md border px-3">Imagine</button>
      </form>
      <p className="mb-4 text-sm">{reading.is ?? r.warning ?? 'nothing read'}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(reading.families ?? []).map((f) => (
          <Link key={f.family} href={`/${encodeURIComponent(f.family)}`} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/60">
              <CardHeader>
                <CardTitle className="font-mono">{f.family}</CardTitle>
                <CardDescription className="line-clamp-2">{f.formulas.join(' · ')}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">{f.words.map((w) => <Badge key={w} variant="outline">{w}</Badge>)}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <p className="mt-4 font-mono text-xs text-muted-foreground">
        {(reading.apis ?? []).length} APIs read · {(reading.categories ?? []).join(', ')}{asked ? '' : <> · <Link href={`/${hex('imagine', [Number.isFinite(c) ? c : 0])}`} className="underline">data.imagine({Number.isFinite(c) ? c : 0})</Link> · <Link href={`?category=${(Number.isFinite(c) ? c : 0) + 1}`} className="underline">next category</Link></>}
      </p>
    </BlockWrapper>
  )
}
