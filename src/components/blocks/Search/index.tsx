import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BlockWrapper } from '@/components/BlockWrapper'
import type { SearchParams } from '@/components/RenderBlocks'
import { searchOf } from '@/app/_data'
import type { Doc, Page, SearchBlock } from '@/payload-types'

/** The search plugin's index, queried by ?q= on whatever page holds this block. */
export async function Search({ heading, intro, anchor, searchParams }: SearchBlock & { searchParams: SearchParams }) {
  const q = String(searchParams.q ?? '').trim()
  const found = await searchOf(q)
  return (
    <BlockWrapper heading={heading} intro={intro} anchor={anchor}>
      <form className="flex max-w-xl gap-2" method="get">
        <Input name="q" defaultValue={q} placeholder="Search" />
        <Button type="submit">Search</Button>
      </form>
      {q ? <p className="text-sm text-muted-foreground">{found.length} result{found.length === 1 ? '' : 's'} for “{q}”</p> : null}
      <div className="grid gap-3">
        {found.map((s) => {
          const doc = typeof s.doc.value === 'object' ? (s.doc.value as Doc | Page) : undefined
          return (
            <Link key={s.id} href={doc ? `/${doc.slug}` : '#'}>
              <Card className="transition-colors hover:border-primary/60">
                <CardHeader>
                  <CardTitle className="text-base">{s.title}</CardTitle>
                  <CardDescription>{doc?.meta?.description ?? doc?.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </BlockWrapper>
  )
}
