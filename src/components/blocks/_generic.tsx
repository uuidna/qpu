import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockWrapper } from '@/components/BlockWrapper'
import { qpuHexUuidOf, qpuMcpCallOf } from '@uuidna/qpu'
import { usageBillOf } from '@/payload/plugins/billing'

/** The one generic block renderer. Every block of the payload-way set composes from a shared vocabulary — a heading and
 *  intro, Lexical rich text, an array of items (title, description, href), a media reference with a caption, and a hex
 *  program (family, program, params) that the unit runs for the value and the receipt. A block declares which of these
 *  it carries; the renderer shows what is there. One component, many addresses: the combinatorics the site is made of. */
export type GenericProps = {
  heading?: string | null
  intro?: string | null
  anchor?: string | null
  richText?: SerializedEditorState | null
  items?: ({ title?: string | null; description?: string | null; href?: string | null } | null)[] | null
  media?: string | null
  caption?: string | null
  family?: string | null
  program?: string | null
  params?: string | null
  code?: string | null
}

export async function GenericBlock({ heading, intro, anchor, richText, items, media, caption, family, program, params, code }: GenericProps) {
  // a hex program, when the block names one: run it, show the value and the receipt at its address
  let run: { hex: string; value?: unknown; holds?: boolean; receipt?: string } | undefined
  if (family && program) {
    try {
      const hex = qpuHexUuidOf({ family, program: program.split(/[+,\s]+/).filter(Boolean), params: (params ?? '').split(/[\s,]+/).map(Number).filter((n) => Number.isFinite(n)) })
      const shown = (await qpuMcpCallOf('cite', { hex, full: true })) as { structuredContent?: { value?: unknown; holds?: boolean; receipt?: string } }
      const r = shown.structuredContent
      if (!r) throw new Error('cite')
      run = { hex, value: typeof r.value === 'object' ? JSON.stringify(r.value) : r.value, holds: r.holds, receipt: r.receipt }
    } catch { run = undefined }
  }
  const bill = usageBillOf()
  return (
    <BlockWrapper heading={heading} intro={intro} anchor={anchor}>
      {richText ? <RichText data={richText} className="prose max-w-3xl dark:prose-invert" /> : null}
      {code ? <pre className="overflow-x-auto rounded-md border bg-muted p-4 text-sm"><code>{code}</code></pre> : null}
      {run ? (
        <p className="font-mono text-xs">
          <Link href={`/${run.hex}`} className="text-primary hover:underline">{family}.{program}({params ?? ''}) = {String(run.value)}</Link>
          {run.holds === true ? <Badge className="ml-2">holds</Badge> : <Badge variant="outline" className="ml-2">lead, not delivered value</Badge>}
          <span className="ml-2 text-muted-foreground">ledger {bill.units} · charged {bill.charged} · billed {bill.billed} · margin is a lead · citation is not solved</span>
        </p>
      ) : null}
      {media ? (
        <figure className="my-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media} alt={caption ?? heading ?? ''} className="w-full rounded-md border" />
          {caption ? <figcaption className="mt-2 text-sm text-muted-foreground">{caption}</figcaption> : null}
        </figure>
      ) : null}
      {items?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.filter(Boolean).map((it, i) => {
            const card = (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-base">{it!.title}</CardTitle>
                  {it!.description ? <CardDescription>{it!.description}</CardDescription> : null}
                </CardHeader>
                {it!.href ? <CardContent><span className="text-sm text-primary">{it!.href}</span></CardContent> : null}
              </Card>
            )
            return it!.href ? <Link key={i} href={it!.href} className="group">{card}</Link> : <div key={i}>{card}</div>
          })}
        </div>
      ) : null}
    </BlockWrapper>
  )
}
